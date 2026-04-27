'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '@/utils/config';

interface BookingData {
    booking_probability: number;
    booking_speed: string;
    demand_level: string;
    price_competitiveness: string;
    estimated_days_to_book: number;
    views_per_week: number;
}

export default function BookingProbability({ listingId }: { listingId: string }) {
    const [data, setData] = useState<BookingData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/booking-probability/${listingId}`)
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
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const getDemandColor = (level: string) => {
        if (level === 'high') return 'text-green-600 bg-green-50';
        if (level === 'moderate') return 'text-yellow-600 bg-yellow-50';
        return 'text-orange-600 bg-orange-50';
    };

    const getProbabilityColor = (prob: number) => {
        if (prob >= 75) return 'text-green-600';
        if (prob >= 50) return 'text-yellow-600';
        return 'text-orange-600';
    };

    return (
        <div className="p-6 bg-white rounded-2xl border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Booking Insights
            </h3>

            
            <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2">Likelihood to Book</div>
                    <div className={`text-5xl font-bold mb-2 ${getProbabilityColor(data.booking_probability ?? 0)}`}>
                        {data.booking_probability ?? 0}%
                    </div>
                    <div className="text-sm text-gray-600">
                        Properties at this price book <span className="font-semibold text-gray-900">{data.booking_speed || 'N/A'}</span>
                    </div>
                </div>
            </div>

            
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-600 mb-1">Est. Days to Book</div>
                    <div className="text-2xl font-bold text-gray-900">{data.estimated_days_to_book ?? 0}</div>
                    <div className="text-xs text-gray-500 mt-1">days</div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-600 mb-1">Weekly Views</div>
                    <div className="text-2xl font-bold text-gray-900">{data.views_per_week ?? 0}</div>
                    <div className="text-xs text-gray-500 mt-1">estimated</div>
                </div>
            </div>

            
            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Demand Level</span>
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getDemandColor(data.demand_level)}`}>
                        {data.demand_level?.toUpperCase() || 'N/A'}
                    </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Price Competitiveness</span>
                    <span className="text-sm font-semibold text-gray-900 capitalize">
                        {data.price_competitiveness || 'N/A'}
                    </span>
                </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-blue-800">
                        <span className="font-semibold">Tip:</span> {(data.booking_probability ?? 0) >= 75
                            ? 'Your listing is highly competitive! Consider maintaining your current pricing.'
                            : (data.booking_probability ?? 0) >= 50
                                ? 'Good booking potential. Small price adjustments could improve competitiveness.'
                                : 'Consider reviewing your pricing or adding more amenities to boost appeal.'
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
