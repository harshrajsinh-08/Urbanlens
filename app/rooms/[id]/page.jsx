"use client";
import { useParams, useRouter } from "next/navigation";
import { API_URL } from "../../../utils/config";
import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import NeighborhoodInsights from "../../../components/NeighborhoodInsights";
import CalendarWidget from "../../../components/CalendarWidget";
import Image from "next/image";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../../../components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-48 w-full bg-gray-100 animate-pulse rounded-xl"></div>
  ),
});

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [calendar, setCalendar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [optimization, setOptimization] = useState(null);
  const [probability, setProbability] = useState(null);
  const [imgSrc, setImgSrc] = useState("https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000");
  const [hostImgSrc, setHostImgSrc] = useState("");

  useEffect(() => {
    if (!params?.id) return;

    Promise.all([
      fetch(`${API_URL}/listings/${params.id}`).then((res) => res.json()),
      fetch(`${API_URL}/reviews/${params.id}`)
        .then((res) => res.json())
        .catch(() => ({ reviews: [] })),
      fetch(`${API_URL}/calendar/${params.id}`)
        .then((res) => res.json())
        .catch(() => ({ calendar: [] })),
      fetch(`${API_URL}/optimize/${params.id}`)
        .then((res) => res.json())
        .catch(() => null),
      fetch(`${API_URL}/booking-probability/${params.id}`)
        .then((res) => res.json())
        .catch(() => null),
    ])
      .then(([listingData, reviewsData, calendarData, optData, probData]) => {
        if (listingData.error || listingData.detail) {
          console.error(listingData.error || listingData.detail);
          setListing(null);
        } else {
          setListing(listingData);
          setImgSrc(listingData.picture_url || "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000");
          setHostImgSrc(listingData.host_picture_url || "");
          setReviews(reviewsData?.reviews || []);
          setCalendar(calendarData?.calendar || []);
          setOptimization(optData);
          setProbability(probData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen pb-10 bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 pt-6">
          
          <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-1/4 mb-6 animate-pulse"></div>

          
          <div className="w-full h-[450px] mb-10 rounded-2xl overflow-hidden animate-pulse bg-gray-200"></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            <div className="lg:col-span-2 space-y-8">
              <div className="h-40 bg-gray-100 rounded-2xl animate-pulse"></div>
              <div className="h-60 bg-gray-100 rounded-2xl animate-pulse"></div>
              <div className="h-40 bg-gray-100 rounded-2xl animate-pulse"></div>
            </div>

            
            <div className="relative">
              <div className="sticky top-28 h-[400px] border border-gray-200 rounded-2xl p-6 shadow-sm bg-white animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="h-32 bg-gray-100 rounded-xl mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
  if (!listing)
    return (
      <div className="flex h-screen items-center justify-center">
        Listing not found
      </div>
    );

  return (
    <main className="min-h-screen pb-10 bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-6">
        <h1 className="text-3xl font-semibold mb-2">
          {listing.location ||
            `${listing.room_type} in ${listing.neighborhood || "London"}`}
        </h1>
        <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <span>
            ★{" "}
            {Number(
              listing.review_scores_rating || listing.rating || listing.neighborhood_score / 2 || 4.5,
            ).toFixed(1)}
          </span>{" "}
          · <span>{listing.number_of_reviews} reviews</span> ·{" "}
          <span>{listing.neighborhood || listing.city || "London"}, UK</span>
        </div>

        <div className="w-full h-[500px] mb-10 rounded-2xl overflow-hidden relative shadow-lg group">
          <Image
            src={imgSrc}
            alt={listing.name || "Listing"}
            fill
            unoptimized
            className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
            priority
            onError={() => setImgSrc("https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000")}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2">
            <div className="border-b pb-6 mb-6">
              <h2 className="text-2xl font-semibold mb-2">
                {listing.property_type || listing.room_type} hosted by{" "}
                {listing.host_name}
              </h2>
              <p className="text-gray-600">
                {listing.accommodates} guests · {listing.bedrooms || 1} bedroom
                · {listing.beds || 1} beds · {listing.bathrooms || 1} bath
              </p>
            </div>

            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 sm">
                    🏢
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    Infrastructure
                  </h4>
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  Estimated based on area density and property features within
                  walking distance.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Transport Links</span>
                    <span className="font-bold">
                      {listing.transport_count_1km ||
                        Math.max(
                          1,
                          Math.floor(listing.neighborhood_score || 5) * 2,
                        )}{" "}
                      stops
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Dining Diversity</span>
                    <span className="font-bold">
                      {listing.restaurant_count_1km ||
                        Math.max(
                          3,
                          Math.floor(listing.neighborhood_score || 5) * 5,
                        )}{" "}
                      places
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 sm">
                    ⭐
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    Guest Experience
                  </h4>
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  Model-predicted scores based on historical reviews and area
                  sentiment.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Location Rating</span>
                    <span className="font-bold">
                      {listing.review_scores_location ||
                        Math.min(
                          10.0,
                          listing.neighborhood_score || 9.0,
                        ).toFixed(1)}
                      /10
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Value per Pound</span>
                    <span className="font-bold">
                      {listing.review_scores_value ||
                        Math.min(10.0, listing.rating * 2 || 9.2).toFixed(1)}
                      /10
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b pb-8 mb-10">
              <h3 className="text-xl font-semibold mb-4">Description</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm md:text-base">
                {listing.description?.replace(/<br\s*\/?>/gi, '\n')}
              </p>
              {listing.neighborhood_overview && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">About the area</h4>
                  <p className="text-gray-600 text-sm italic whitespace-pre-line">
                    {listing.neighborhood_overview?.replace(/<br\s*\/?>/gi, '\n')}
                  </p>
                </div>
              )}
            </div>

            
            <div className="border-b pb-12 mb-10">
              <h3 className="text-xl font-semibold mb-8 flex items-center gap-2">
                <span className="text-rose-500 text-2xl">★</span>
                {Number(
                  listing.review_scores_rating || listing.rating || listing.neighborhood_score / 2 || 4.5,
                ).toFixed(1)}{" "}
                · {listing.number_of_reviews} reviews
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
                {[
                  {
                    label: "Cleanliness",
                    value: listing.review_scores_cleanliness || 4.8,
                  },
                  {
                    label: "Accuracy",
                    value: listing.review_scores_accuracy || 4.9,
                  },
                  {
                    label: "Communication",
                    value: listing.review_scores_communication || 4.7,
                  },
                  {
                    label: "Location",
                    value:
                      listing.review_scores_location ||
                      Math.min(
                        5.0,
                        listing.neighborhood_score / 2 || 4.5,
                      ).toFixed(1),
                  },
                  {
                    label: "Check-in",
                    value: listing.review_scores_checkin || 4.9,
                  },
                  { label: "Value", value: listing.review_scores_value || 4.6 },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between group"
                  >
                    <span className="text-sm text-gray-700">{s.label}</span>
                    <div className="flex items-center gap-4 flex-1 max-w-[180px] ml-6">
                      <div className="h-1 bg-gray-100 rounded-full flex-1 overflow-hidden">
                        <div
                          className="h-full bg-gray-900 rounded-full group-hover:bg-rose-500 transition-colors"
                          style={{ width: `${(Number(s.value) / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-semibold w-6 text-right">
                        {Number(s.value).toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            
            {calendar && calendar.length > 0 && (
              <div className="mb-10">
                <CalendarWidget dates={calendar} basePrice={listing.price} />
              </div>
            )}

            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="h-[500px] rounded-2xl overflow-hidden border shadow-sm relative col-span-1 md:col-span-2">
                <Map listings={[listing]} />
              </div>
              <div className="col-span-1 md:col-span-2">
                <NeighborhoodInsights listingId={listing.id} />
              </div>
            </div>

            
            <div className="border-t pt-10">
              <h3 className="text-xl font-semibold mb-6">Meet your host</h3>
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-rose-500 text-white flex items-center justify-center text-3xl font-bold shadow-lg border-2 border-white relative">
                    {hostImgSrc ? (
                      <Image
                        src={hostImgSrc}
                        alt={listing.host_name}
                        fill
                        className="object-cover"
                        onError={() => setHostImgSrc("")}
                      />
                    ) : (
                      listing.host_name?.[0]
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">{listing.host_name}</h4>
                    <div className="text-sm text-gray-500 italic space-y-0.5">
                      <p>
                        User since{" "}
                        {listing.host_since
                          ? new Date(listing.host_since).getFullYear()
                          : "2022"}
                      </p>
                      {listing.host_location && (
                        <p className="text-xs opacity-75">📍 {listing.host_location}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600">
                  <p className="leading-relaxed">
                    {listing.host_about ||
                      "This host is a verified member of the community. They have established a reputation for quality and reliability in the London area."}
                  </p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-100">
                      <span className="text-gray-500">Response Rate</span>
                      <span className="font-bold text-gray-900">
                        {listing.host_response_rate || "100%"}
                      </span>
                    </div>
                    {listing.host_identity_verified && (
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full w-fit border border-emerald-100">
                        🛡️ Identity Verified
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            
            {reviews && reviews.length > 0 && (
              <div className="border-t pt-10 mt-10">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <span className="text-xl">💬</span> Real Guest Reviews
                </h3>
                <div className="space-y-8">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="text-gray-900 border-b border-gray-100 pb-6 last:border-0 last:pb-0 cursor-pointer hover:bg-gray-50/50 p-4 -mx-4 rounded-2xl transition-all group"
                      onClick={() => setSelectedReview(review)}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-sm group-hover:shadow transition-shadow">
                          <Image
                            src={`https://ui-avatars.com/api/?name=${review.reviewer_name}&background=random&color=fff&rounded=true`}
                            width={48}
                            height={48}
                            alt={review.reviewer_name}
                          />
                        </div>
                        <div>
                          <div className="font-bold group-hover:text-rose-600 transition-colors">
                            {review.reviewer_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(review.date).toLocaleDateString("en-GB", {
                              month: "long",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed text-sm lg:text-base whitespace-pre-line line-clamp-4">
                        {review.comments}
                      </p>
                      {review.comments?.length > 300 && (
                        <div className="mt-2 text-xs font-bold text-rose-500 flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          Read more <span>→</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          
          <div className="relative">
            <div className="sticky top-28 border border-gray-200 rounded-2xl p-6 shadow-sm bg-white">
              <div className="mb-6">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Listed Price
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">
                    £{listing.price}
                  </span>
                  <span className="text-gray-500 text-sm">/ night</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 mb-6 cursor-pointer hover:bg-blue-100 transition shadow-inner group" onClick={() => router.push(`/rooms/${listing.id}/insights`)}>
                <div className="flex items-center gap-2 mb-2 text-blue-900 font-bold text-sm justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⚖️</span>
                    AI Market Prediction
                  </div>
                  <span className="text-blue-500 opacity-60 group-hover:opacity-100 transition-opacity">→</span>
                </div>
                <div className="text-xl font-bold text-blue-800 mb-1">
                  £{optimization?.price_range?.min || Math.floor(listing.price * 0.9)} – £{optimization?.price_range?.max || Math.ceil(listing.price * 1.1)}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded uppercase tracking-wider">
                    {probability?.booking_probability || 75}% Booking Chance
                  </div>
                </div>
                <p className="text-[11px] text-blue-600 leading-tight">
                  This range represents the "Fair Market Value" predicted by our XGBoost model for this specific location and capacity.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  AI Assessment
                </div>
                
                {listing.neighborhood_score &&
                  listing.neighborhood_score >= 9.0 ? (
                  <div className="flex items-center gap-3 p-4 bg-amber-50 text-amber-800 rounded-xl border border-amber-100">
                    <span className="text-xl">✨</span>
                    <div className="text-xs font-bold uppercase">
                      Premium Listing
                    </div>
                  </div>
                ) : listing.price < 100 ? (
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100">
                    <span className="text-xl">💎</span>
                    <div className="text-xs font-bold uppercase">
                      Exceptional Deal
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-100">
                    <span className="text-xl">💰</span>
                    <div className="text-xs font-bold uppercase">
                      Fair Market Price
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-600">
                    Location Score
                  </span>
                  <span className="text-sm font-bold">
                    {listing.neighborhood_score}/10
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 transition-all"
                    style={{ width: `${listing.neighborhood_score * 10}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      {selectedReview && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedReview(null)}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <Image
                    src={`https://ui-avatars.com/api/?name=${selectedReview.reviewer_name}&background=random&color=fff&rounded=true`}
                    width={48}
                    height={48}
                    alt={selectedReview.reviewer_name}
                  />
                </div>
                <div>
                  <div className="font-bold text-lg">{selectedReview.reviewer_name}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(selectedReview.date).toLocaleDateString("en-GB", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedReview(null)}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-xl text-gray-400 hover:text-gray-900 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <p className="text-gray-800 leading-relaxed whitespace-pre-line text-lg">
                {selectedReview.comments}
              </p>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedReview(null)}
                className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-rose-600 transition-colors shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
