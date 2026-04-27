"use client";
import { useParams, useRouter } from "next/navigation";
import { API_URL } from "../../../../utils/config";
import { useEffect, useState } from "react";
import Navbar from "../../../../components/Navbar";


import NeighborhoodInsights from "../../../../components/NeighborhoodInsights";
import ComparativeAnalysis from "../../../../components/ComparativeAnalysis";
import PricingOptimization from "../../../../components/PricingOptimization";
import BookingProbability from "../../../../components/BookingProbability";
import SmartRecommendations from "../../../../components/SmartRecommendations";
import MarketData from "../../../../components/MarketData";

export default function InsightsPage() {
    const params = useParams();
    const router = useRouter();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!params?.id) return;

        fetch(`${API_URL}/listings/${params.id}`)
            .then((res) => res.json())
            .then((data) => {
                if (!data.error && !data.detail) {
                    setListing(data);
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
            <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-rose-500 border-r-transparent"></div>
            </main>
        );
    }

    if (!listing) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center flex-col gap-4">
                <h1 className="text-2xl font-bold">Listing not found</h1>
                <button onClick={() => router.back()} className="text-rose-500 hover:underline">Go Back</button>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 pt-10">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors"
                >
                    <span>←</span> Back to Listing
                </button>

                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">AI Price & Market Insights</h1>
                    <p className="text-gray-600">Deep market analysis and optimal pricing strategies powered by our AI model.</p>
                </div>

                
                <div className="bg-gray-900 text-white rounded-3xl p-8 shadow-sm flex flex-col justify-between overflow-hidden relative mb-12">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-3 text-rose-400">How we calculate prices</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Our AI analyzes thousands of properties to predict fair market prices based on key factors like location, property details, amenities, and current market position. We use XGBoost machine learning with quantile regression to predict prices and confidence intervals. The model is trained on real market data and continuously updated.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {['Location', 'Property Details', 'Amenities', 'Market Position'].map((tag, i) => (
                            <span key={i} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-semibold text-gray-200">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    
                    <ComparativeAnalysis listingId={listing.id} />

                    
                    <PricingOptimization listingId={listing.id} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    
                    <BookingProbability listingId={listing.id} />

                    
                    <MarketData listingId={listing.id} />
                </div>

                <div className="mb-8">
                    
                    <SmartRecommendations listingId={listing.id} />
                </div>

                <div className="mb-8">
                    
                    <NeighborhoodInsights listingId={listing.id} />
                </div>


            </div>
        </main>
    );
}
