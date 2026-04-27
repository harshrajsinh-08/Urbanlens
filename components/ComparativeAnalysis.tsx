'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '@/utils/config';

interface ComparisonData {
    listing_price: number;
    average_similar_price: number;
    price_difference: number;
    percentile: number;
    similar_count: number;
    similar_properties: Array<{
        price: number;
        bedrooms: number;
        accommodates: number;
        neighborhood_score: number;
    }>;
}

export default function ComparativeAnalysis({ listingId }: { listingId: string }) {
    const [data, setData] = useState<ComparisonData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/compare/${listingId}`)
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

    const isPriceLower = (data?.price_difference ?? 0) < 0;
    const isPriceHigher = (data?.price_difference ?? 0) > 0;

    return (
        <div className="p-6 bg-white rounded-2xl border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Comparative Analysis
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">This Property</div>
                    <div className="text-3xl font-bold text-gray-900">
                        £{data?.listing_price?.toLocaleString() ?? 'N/A'}
                    </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Similar Properties Avg</div>
                    <div className="text-3xl font-bold text-blue-600">
                        £{data?.average_similar_price?.toLocaleString() ?? 'N/A'}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                        <div className="font-medium text-gray-900">Price Comparison</div>
                        <div className="text-sm text-gray-600">
                            {isPriceLower && `£${Math.abs(data?.price_difference ?? 0).toLocaleString()} below average`}
                            {isPriceHigher && `£${(data?.price_difference ?? 0).toLocaleString()} above average`}
                            {!isPriceLower && !isPriceHigher && 'At market average'}
                        </div>
                    </div>
                    <div className={`text-2xl font-bold ${isPriceLower ? 'text-green-600' : isPriceHigher ? 'text-orange-600' : 'text-gray-600'}`}>
                        {isPriceLower && '↓'}
                        {isPriceHigher && '↑'}
                        {!isPriceLower && !isPriceHigher && '='}
                    </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium text-purple-900">Market Position</div>
                            <div className="text-sm text-purple-700">
                                More expensive than {data?.percentile?.toFixed(0) ?? 0}% of properties
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-purple-600">
                            {data?.percentile?.toFixed(0) ?? 0}%
                        </div>
                    </div>
                </div>

                {(data?.similar_count ?? 0) > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                        <div className="text-sm font-medium text-gray-900 mb-3">
                            Similar Properties ({data.similar_count})
                        </div>
                        <div className="space-y-2">
                            {data.similar_properties.slice(0, 3).map((prop, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg">
                                    <div className="text-gray-600">
                                        {prop.bedrooms} bed · {prop.accommodates} guests · Score {prop.neighborhood_score}
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                        £{prop.price.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
