'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '@/utils/config';

interface Upgrade {
    amenity: string;
    label: string;
    price_increase: number;
    new_predicted_price: number;
    booking_speed_improvement: string;
    probability_boost: number;
    new_estimated_days: number;
}

interface WhatIfData {
    base_predicted_price: number;
    upgrades: Upgrade[];
}

export default function AmenityWhatIf({ listingId }: { listingId: string }) {
    const [data, setData] = useState<WhatIfData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetch(`${API_URL}/listings/${listingId}`)
            .then(res => res.json())
            .then(listingData => {

                return fetch(`${API_URL}/simulate-upgrade`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ listing_data: listingData })
                });
            })
            .then(res => res.json())
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [listingId]);

    if (loading) {
        return (
            <div className="p-6 bg-white rounded-2xl border border-gray-200 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!data || !data.upgrades || data.upgrades.length === 0) return null;

    return (
        <div className="p-6 bg-white rounded-2xl border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Revenue vs. Occupancy Strategy
            </h3>
            <p className="text-sm text-gray-500 mb-6">
                Our AI modeled two ways to win with property upgrades
            </p>

            <div className="space-y-4">
                {data.upgrades.map((upgrade, idx) => (
                    <div
                        key={idx}
                        className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl shadow-inner">
                                {upgrade.amenity === 'ac' && '❄️'}
                                {upgrade.amenity === 'wifi' && '📶'}
                                {upgrade.amenity === 'kitchen' && '🍳'}
                                {upgrade.amenity === 'tv' && '📺'}
                                {upgrade.amenity === 'pool' && '🏊'}
                                {upgrade.amenity === 'gym' && '💪'}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg">{upgrade.label}</h4>
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Strategic Impact</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-green-50/50 p-4 rounded-xl border border-green-100">
                                <div className="text-[10px] text-green-700 font-bold uppercase mb-1">Option A: Maximize Revenue</div>
                                <div className="text-2xl font-black text-green-600">
                                    +£{upgrade.price_increase}
                                    <span className="text-xs font-normal text-gray-500 ml-1">/ night</span>
                                </div>
                                <p className="text-xs text-green-800 mt-1">Recommended listing price increase</p>
                            </div>

                            <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
                                <div className="text-[10px] text-purple-700 font-bold uppercase mb-1">Option B: Maximize Occupancy</div>
                                <div className="text-2xl font-black text-purple-600">
                                    {upgrade.new_estimated_days}
                                    <span className="text-xs font-normal text-gray-500 ml-1">days to book</span>
                                </div>
                                <p className="text-xs text-purple-800 mt-1">
                                    Books <span className="font-bold">{upgrade.booking_speed_improvement}</span> if price held constant
                                </p>
                            </div>
                        </div>

                        {upgrade.probability_boost > 0 && (
                            <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50/50 p-2 rounded-lg">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                </svg>
                                <span>Booking likelihood would surge by {upgrade.probability_boost}%</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <div className="text-xs text-slate-500 leading-relaxed italic text-center">
                    Upgrading your property amenities allows you to either command a premium price or dramatically reduce your vacancy rate by providing superior market value.
                </div>
            </div>
        </div>
    );
}
