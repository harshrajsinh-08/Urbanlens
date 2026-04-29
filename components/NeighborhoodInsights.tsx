'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '@/utils/config';

interface NeighborhoodData {
    neighborhood_score: number;
    score_description?: string;
    city: string;
    neighborhood: string;
    market_bracket?: string;
    area_vibe?: string;
    avg_city_score: number;
    total_listings_in_city: number;
    avg_city_price: number;
    score_percentile: number;
    insights: {
        walkability: number;
        safety: number;
        transit: number;
        amenities: number;
    };
}

interface Attraction {
    name: string;
    distance: number;
    type: string;
}

interface AttractionsData {
    attractions: Attraction[];
    restaurant_count: number;
    cafe_count: number;
    destination_count: number;
    transport_count: number;
    transport_accessibility: number;
    lists?: {
        restaurants: Attraction[];
        cafes: Attraction[];
        destinations: Attraction[];
        stops: Attraction[];
    };
}

export default function NeighborhoodInsights({ listingId }: { listingId: string }) {
    const [data, setData] = useState<NeighborhoodData | null>(null);
    const [attractions, setAttractions] = useState<AttractionsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([
            fetch(`${API_URL}/neighborhood/${listingId}`).then(res => res.json()),
            fetch(`${API_URL}/attractions/${listingId}`).then(res => res.json())
        ])
            .then(([neighborhoodData, attractionsData]) => {
                setData(neighborhoodData);
                setAttractions(attractionsData);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [listingId]);

    if (loading) {
        return (
            <div className="p-6 bg-white rounded-2xl border border-gray-200 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const getScoreColor = (score: number) => {
        if (score >= 8) return 'text-green-600';
        if (score >= 6) return 'text-yellow-600';
        return 'text-orange-600';
    };

    const getBarColor = (score: number) => {
        if (score >= 8) return 'bg-green-500';
        if (score >= 6) return 'bg-yellow-500';
        return 'bg-orange-500';
    };

    const toggleCategory = (category: string) => {
        setActiveCategory(activeCategory === category ? null : category);
    };

    const CategoryBadge = ({ category, label, count, colorClass, list }: { category: string, label: string, count: number, colorClass: string, list?: Attraction[] }) => (
        <div
            className={`p-3 bg-white rounded-lg border border-gray-100 shadow-sm cursor-pointer transition-all hover:border-blue-300 relative ${activeCategory === category ? 'ring-2 ring-blue-400 border-blue-400' : ''}`}
            onClick={() => toggleCategory(category)}
        >
            <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">{label}</div>
            <div className={`text-xl font-bold ${colorClass}`}>{count}</div>

            {activeCategory === category && list && list.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-[50] mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 min-w-[200px] animate-in slide-in-from-top-2 duration-200">
                    <div className="flex justify-between items-center mb-3 border-b pb-2">
                        <span className="font-bold text-xs text-gray-900 uppercase tracking-wider">{label} Nearby</span>
                        <span className="text-[10px] text-gray-400 font-bold cursor-pointer hover:text-gray-900" onClick={(e) => { e.stopPropagation(); setActiveCategory(null); }}>✕</span>
                    </div>
                    <div className="max-h-[200px] overflow-y-auto space-y-2 custom-scrollbar">
                        {list.map((item, i) => (
                            <div key={i} className="flex justify-between items-center text-[11px] group">
                                <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                                    {item.name}
                                </span>
                                <span className="text-gray-400 font-bold bg-gray-50 px-1.5 py-0.5 rounded">
                                    {item.distance}km
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm relative">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                    Neighborhood Insights
                </h3>
            </div>

            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between mb-3 border-b border-blue-100 pb-2">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">{data.market_bracket || 'Market Analysis'}</span>
                        <div className="text-sm text-gray-700 font-bold">
                            {data.neighborhood || 'Local Area'}
                        </div>
                    </div>
                    <div className="px-2 py-1 bg-white/50 rounded-lg text-xs font-bold text-gray-500 border border-white">
                        {data.area_vibe || 'London Standard'}
                    </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <div className="text-2xl font-bold text-gray-900">
                            Overall Score: {data.neighborhood_score ?? 0}/10
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-600">Better than</div>
                        <div className="text-2xl font-bold text-blue-600">
                            {data.score_percentile ?? 0}%
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4 mb-6">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 relative group cursor-help w-max">
                            <span className="text-lg">🚶</span>
                            <span className="text-sm font-medium text-gray-700 border-b border-dotted border-gray-400">Walkability</span>
                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-52 p-2 bg-gray-800 text-white text-[11px] rounded shadow-lg z-10 font-normal leading-tight">
                                Scores drop based on the exact distance (km) to the nearest local shop or restaurant.
                                <div className="absolute left-4 top-full w-2 h-2 bg-gray-800 transform rotate-45 -mt-1"></div>
                            </div>
                        </div>
                        <span className={`text-sm font-semibold ${getScoreColor(data.insights?.walkability ?? 0)}`}>
                            {(data.insights?.walkability ?? 0).toFixed(1)}/10
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full ${getBarColor(data.insights?.walkability ?? 0)}`}
                            style={{ width: `${((data.insights?.walkability ?? 0) / 10) * 100}%` }}
                        />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 relative group cursor-help w-max">
                            <span className="text-lg">🛡️</span>
                            <span className="text-sm font-medium text-gray-700 border-b border-dotted border-gray-400">Safety</span>
                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-52 p-2 bg-gray-800 text-white text-[11px] rounded shadow-lg z-10 font-normal leading-tight">
                                Safest in quiet suburbs. Highly dense nightlife and tourist zones receive slight penalties.
                                <div className="absolute left-4 top-full w-2 h-2 bg-gray-800 transform rotate-45 -mt-1"></div>
                            </div>
                        </div>
                        <span className={`text-sm font-semibold ${getScoreColor(data.insights?.safety ?? 0)}`}>
                            {(data.insights?.safety ?? 0).toFixed(1)}/10
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full ${getBarColor(data.insights?.safety ?? 0)}`}
                            style={{ width: `${((data.insights?.safety ?? 0) / 10) * 100}%` }}
                        />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 relative group cursor-help w-max">
                            <span className="text-lg">🚇</span>
                            <span className="text-sm font-medium text-gray-700 border-b border-dotted border-gray-400">Public Transit</span>
                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-52 p-2 bg-gray-800 text-white text-[11px] rounded shadow-lg z-10 font-normal leading-tight">
                                Scores reflect access to major transit networks, penalizing greater distances from the city center.
                                <div className="absolute left-4 top-full w-2 h-2 bg-gray-800 transform rotate-45 -mt-1"></div>
                            </div>
                        </div>
                        <span className={`text-sm font-semibold ${getScoreColor(data.insights?.transit ?? 0)}`}>
                            {(data.insights?.transit ?? 0).toFixed(1)}/10
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full ${getBarColor(data.insights?.transit ?? 0)}`}
                            style={{ width: `${((data.insights?.transit ?? 0) / 10) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl mb-6 border border-gray-100">
                <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-3">Nearby Snapshot (Click to view)</div>
                <div className="grid grid-cols-2 gap-3">
                    <CategoryBadge
                        category="restaurants"
                        label="Restaurants"
                        count={attractions?.restaurant_count ?? 0}
                        colorClass="text-orange-600"
                        list={attractions?.lists?.restaurants}
                    />
                    <CategoryBadge
                        category="destinations"
                        label="Destinations"
                        count={attractions?.destination_count ?? 0}
                        colorClass="text-purple-600"
                        list={attractions?.lists?.destinations}
                    />
                    <CategoryBadge
                        category="cafes"
                        label="Cafes"
                        count={attractions?.cafe_count ?? 0}
                        colorClass="text-emerald-600"
                        list={attractions?.lists?.cafes}
                    />
                    <CategoryBadge
                        category="stops"
                        label="Stops"
                        count={attractions?.transport_count ?? 0}
                        colorClass="text-blue-600"
                        list={attractions?.lists?.stops}
                    />
                </div>
            </div>

            {attractions && attractions.attractions && attractions.attractions.length > 0 && (
                <div className="border-t border-gray-100 pt-6">
                    <h4 className="text-sm font-bold text-gray-900 mb-4">Top Nearby Places</h4>
                    <div className="space-y-2">
                        {attractions.attractions?.map((attr: Attraction, idx: number) => (
                            <div key={idx} className="flex items-center justify-between text-sm p-3 hover:bg-gray-50 rounded-xl transition border border-transparent hover:border-gray-100">
                                <div className="flex items-center gap-3">
                                    <span className="text-base">📍</span>
                                    <div>
                                        <div className="font-bold text-gray-900">{attr.name}</div>
                                        <div className="text-[10px] text-gray-500 font-medium uppercase">{attr.type}</div>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{attr.distance} km</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
