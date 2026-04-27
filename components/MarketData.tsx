'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '@/utils/config';

interface MarketData {
    city: string;
    total_listings: number;
    active_listings: number;
    average_price: number;
    median_price: number;
    demand_level: string;
    demand_score: number;
    average_days_to_book: number;
    competition: {
        direct_competitors: number;
        price_percentile: number;
        score_percentile: number;
    };
    market_trends: {
        price_trend: string;
        occupancy_rate: number;
    };
}

export default function MarketData({ listingId }: { listingId: string }) {
    const [data, setData] = useState<MarketData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/market-data/${listingId}`)
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
        if (level === 'high') return 'bg-green-100 text-green-700 border-green-200';
        if (level === 'moderate') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        return 'bg-orange-100 text-orange-700 border-orange-200';
    };

    const getTrendIcon = (trend: string) => {
        if (trend === 'rising') return '↗';
        if (trend === 'falling') return '↘';
        return '→';
    };

    return (
        <div className="p-6 bg-white rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                    Market Data
                </h3>
                <span className="text-sm text-gray-500 capitalize">
                    {data?.city || 'Location'}
                </span>
            </div>

            
            <div className="mb-6 p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Market Demand</span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getDemandColor(data?.demand_level || 'low')}`}>
                        {data?.demand_level?.toUpperCase() || 'LOW'}
                    </span>
                </div>
                <div className="flex items-end gap-2 mb-2">
                    <span className="text-4xl font-bold text-gray-900">{data?.demand_score ?? 0}</span>
                    <span className="text-gray-500 mb-1">/ 100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                        style={{ width: `${data?.demand_score ?? 0}%` }}
                    />
                </div>
            </div>

            
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-600 mb-1">Avg. Price</div>
                    <div className="text-xl font-bold text-gray-900">£{data?.average_price?.toLocaleString() ?? 'N/A'}</div>
                    <div className="text-xs text-gray-500 mt-1">per night</div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-600 mb-1">Median Price</div>
                    <div className="text-xl font-bold text-gray-900">£{data?.median_price?.toLocaleString() ?? 'N/A'}</div>
                    <div className="text-xs text-gray-500 mt-1">per night</div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-600 mb-1">Days to Book</div>
                    <div className="text-xl font-bold text-gray-900">{data?.average_days_to_book ?? 'N/A'}</div>
                    <div className="text-xs text-gray-500 mt-1">average</div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-600 mb-1">Occupancy</div>
                    <div className="text-xl font-bold text-gray-900">{data?.market_trends?.occupancy_rate ?? 'N/A'}%</div>
                    <div className="text-xs text-gray-500 mt-1">rate</div>
                </div>
            </div>

            
            <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Competition</h4>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Direct Competitors</span>
                        <span className="text-sm font-semibold text-gray-900">{data?.competition?.direct_competitors ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Price Percentile</span>
                        <span className="text-sm font-semibold text-gray-900">{data?.competition?.price_percentile ?? 0}%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Quality Percentile</span>
                        <span className="text-sm font-semibold text-gray-900">{data?.competition?.score_percentile ?? 0}%</span>
                    </div>
                </div>
            </div>

            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-blue-900">Market Trend</span>
                    <span className="text-2xl">{getTrendIcon(data?.market_trends?.price_trend || 'stable')}</span>
                </div>
                <div className="text-sm text-blue-800 capitalize">
                    Prices are <span className="font-semibold">{data?.market_trends?.price_trend || 'stable'}</span>
                </div>
                <div className="text-xs text-blue-600 mt-2">
                    {data?.total_listings ?? 0} active listings in {data?.city || 'Location'}
                </div>
            </div>
        </div>
    );
}
