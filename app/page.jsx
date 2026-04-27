"use client";
import dynamic from 'next/dynamic';
import ListingCard from '../components/ListingCard';
import Navbar from '../components/Navbar';
import { useState, useEffect, useMemo } from 'react';
import { API_URL } from '@/utils/config';

const Map = dynamic(() => import('../components/Map'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center">Loading Map...</div>
});
export default function Home() {
  const [listings, setListings] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchListings = (_page = 1, append = false) => {
    setLoading(true);
    const query = new URLSearchParams();
    query.append('page', _page.toString());
    query.append('limit', '20');

    fetch(`${API_URL}/listings?${query.toString()}`)
      .then(res => res.json())
      .then((response) => {
        const data = response.data || [];
        const formatted = data.map((item) => {
          const listingId = item.id.toString();
          const neighborhood = typeof item.neighborhood === 'string' ? item.neighborhood :
            (typeof item.city === 'string' ? item.city : 'London');

          const name = item.name || item.location || `${item.room_type} in ${neighborhood}`;
          const image = item.picture_url || `https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000`;

          return {
            id: listingId,
            location: name,
            distance: neighborhood ? `${neighborhood}, London` : 'London City',
            dates: "Available now",
            price: Number(item.price),
            score: Number(item.neighborhood_score),
            rating: Number(item.rating || 4.5).toFixed(1),
            latitude: Number(item.latitude),
            longitude: Number(item.longitude),
            image: image,
            room_type: String(item.room_type),
            bedrooms: Number(item.bedrooms),
            city: neighborhood
          };
        });

        if (append) {
          setListings(prev => [...prev, ...formatted]);
        } else {
          setListings(formatted);
        }

        setHasMore(data.length === 20);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch listings", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchListings(1, false);
  }, []);

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && !loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchListings(nextPage, true);
    }
  };

  return (<main className="flex h-screen w-full flex-col bg-gray-50">
    <Navbar />

    
    <div className="flex flex-1 overflow-hidden">
      
      <div
        className="w-full xl:w-[60%] overflow-y-auto p-6"
        onScroll={handleScroll}
      >
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Rental Market Analysis
          </h1>
          <p className="text-gray-600">
            Compare properties with AI-powered price predictions and neighborhood quality scores
          </p>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{listings.length}</span> properties loaded
          </div>
          {listings.length > 0 && (<div className="text-sm text-gray-600">
            £{Math.min(...listings.map(l => l.price)).toLocaleString()} - £{Math.max(...listings.map(l => l.price)).toLocaleString()} per night
          </div>)}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {listings.map((item) => (<ListingCard key={item.id} id={item.id} image={item.image} location={item.location} distance={item.distance} dates={item.dates} price={item.price} rating={item.rating} score={item.score} bedrooms={item.bedrooms} room_type={item.room_type} />))}
        </div>

        {loading && (
          <div className="py-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-rose-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-2 text-gray-500">Loading more properties...</p>
          </div>
        )}

        
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 xl:hidden">
          <button className="bg-gray-900 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition flex items-center gap-2">
            Map <span className="text-xs">🗺️</span>
          </button>
        </div>
      </div>

      
      <div className="hidden xl:block w-[40%] h-full sticky top-0">
        <Map listings={listings} />
      </div>
    </div>
  </main>);
}
