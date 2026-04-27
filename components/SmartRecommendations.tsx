'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_URL } from '@/utils/config';

interface Property {
    id: number;
    price: number;
    bedrooms: number;
    score: number;
    room_type: string;
    savings?: number;
}

interface RecommendationsData {
    similar_properties: Property[];
    better_value_alternatives: Property[];
}

export default function SmartRecommendations({ listingId }: { listingId: string }) {
    const [data, setData] = useState<RecommendationsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/recommendations/${listingId}`)
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
                    <div className="h-20 bg-gray-200 rounded"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="p-6 bg-white rounded-2xl border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Smart Recommendations
            </h3>

            
            {data?.similar_properties?.length > 0 && (
                <div className="mb-8">
                    <h4 className="text-base font-semibold text-gray-900 mb-4">
                        Similar Properties You Might Like
                    </h4>
                    <div className="space-y-3">
                        {data.similar_properties.slice(0, 3).map((prop) => (
                            <Link
                                key={prop.id}
                                href={`/rooms/${prop.id}`}
                                className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition border border-gray-200 hover:border-gray-300"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-gray-900 mb-1">
                                            {prop.room_type}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {prop.bedrooms} bed · Score {prop.score}/10
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-gray-900">
                                            £{prop.price.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-gray-500">per night</div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            
            {data?.better_value_alternatives?.length > 0 && (
                <div>
                    <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Better Value Alternatives
                    </h4>
                    <div className="space-y-3">
                        {data.better_value_alternatives.slice(0, 3).map((prop) => (
                            <Link
                                key={prop.id}
                                href={`/rooms/${prop.id}`}
                                className="block p-4 bg-green-50 hover:bg-green-100 rounded-xl transition border border-green-200 hover:border-green-300"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <div className="font-medium text-gray-900 mb-1">
                                            {prop.room_type}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {prop.bedrooms} bed · Score {prop.score}/10
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-gray-900">
                                            £{prop.price.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-gray-500">per night</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="px-2 py-1 bg-green-600 text-white rounded-full text-xs font-medium">
                                        Save £{prop.savings?.toLocaleString()}
                                    </span>
                                    <span className="text-green-700">per night</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {(!data?.similar_properties?.length && !data?.better_value_alternatives?.length) && (
                <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <div className="font-medium text-gray-700 mb-1">No recommendations available</div>
                    <div className="text-sm">Check back later for similar properties</div>
                </div>
            )}
        </div>
    );
}
