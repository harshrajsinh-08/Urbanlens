'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '@/utils/config';

interface OptimizationData {
    current_price: number;
    optimal_price: number;
    price_range: {
        min: number;
        max: number;
    };
    tips: Array<{
        type: 'success' | 'warning' | 'info';
        title: string;
        description: string;
        potential_impact: 'low' | 'medium' | 'high';
    }>;
}

export default function PricingOptimization({ listingId }: { listingId: string }) {
    const [data, setData] = useState<OptimizationData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/optimize/${listingId}`)
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

    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'warning':
                return 'bg-orange-50 border-orange-200 text-orange-800';
            case 'info':
                return 'bg-blue-50 border-blue-200 text-blue-800';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

    const getImpactBadge = (impact: string) => {
        const styles = {
            high: 'bg-red-100 text-red-700',
            medium: 'bg-yellow-100 text-yellow-700',
            low: 'bg-green-100 text-green-700'
        };
        return styles[impact as keyof typeof styles] || styles.low;
    };

    return (
        <div className="p-6 bg-white rounded-2xl border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Pricing Optimization
            </h3>

            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <div className="text-sm text-gray-600">Current Price</div>
                        <div className="text-2xl font-bold text-gray-900">
                            £{data.current_price.toLocaleString()}
                        </div>
                    </div>
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <div className="text-right">
                        <div className="text-sm text-gray-600">Optimal Price</div>
                        <div className="text-2xl font-bold text-green-600">
                            £{data.optimal_price.toLocaleString()}
                        </div>
                    </div>
                </div>
                <div className="text-xs text-gray-600">
                    Recommended range: £{data.price_range.min.toLocaleString()} - £{data.price_range.max.toLocaleString()}
                </div>
            </div>

            <div className="space-y-3">
                <div className="text-sm font-medium text-gray-900 mb-3">
                    Recommendations
                </div>
                {data.tips.map((tip, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border ${getTypeStyles(tip.type)}`}>
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                                {tip.type === 'success' && (
                                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {tip.type === 'warning' && (
                                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {tip.type === 'info' && (
                                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                )}
                                <h4 className="font-semibold">{tip.title}</h4>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getImpactBadge(tip.potential_impact)}`}>
                                {tip.potential_impact} impact
                            </span>
                        </div>
                        <p className="text-sm ml-7">{tip.description}</p>
                    </div>
                ))}
            </div>

            {data.tips.length === 0 && (
                <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-center">
                    <svg className="w-12 h-12 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="font-semibold text-green-900 mb-1">
                        Perfectly Optimized!
                    </div>
                    <div className="text-sm text-green-700">
                        Your pricing and features are well-positioned for the market.
                    </div>
                </div>
            )}
        </div>
    );
}
