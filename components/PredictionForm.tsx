'use client';

import { useState, FormEvent } from 'react';
import { API_URL } from '@/utils/config';

interface Factor {
    feature: string;
    impact: number;
    increases_price: boolean;
}

interface AmenityCounterfactual {
    amenity: string;
    label: string;
    icon: string;
    impact: number;
    increases_price: boolean;
    selected: boolean;
}

interface PredictionResult {
    predicted_price: number;
    shap_factors: Factor[];
    amenity_impacts: Factor[];
    amenity_counterfactuals: AmenityCounterfactual[];
}

const AMENITIES = [
    { id: 'wifi', label: 'Fast WiFi', icon: '📶' },
    { id: 'kitchen', label: 'Full Kitchen', icon: '🍳' },
    { id: 'ac', label: 'Air Conditioning', icon: '❄️' },
    { id: 'washer', label: 'Washer & Dryer', icon: '🫧' },
    { id: 'parking', label: 'Free Parking', icon: '🚗' },
    { id: 'pool', label: 'Swimming Pool', icon: '🏊' },
    { id: 'gym', label: 'Gym / Fitness', icon: '💪' },
    { id: 'workspace', label: 'Dedicated Workspace', icon: '💼' },
];

const LOCATIONS = [
    { name: 'Central London', lat: 51.5074, lng: -0.1278 },
    { name: 'Camden', lat: 51.5406, lng: -0.1423 },
    { name: 'Chelsea', lat: 51.4875, lng: -0.1687 },
    { name: 'Hackney', lat: 51.5450, lng: -0.0553 },
    { name: 'Islington', lat: 51.5386, lng: -0.1034 },
    { name: 'Westminster', lat: 51.4975, lng: -0.1357 },
];

const ROOM_TYPES = ['Entire home/apt', 'Private room', 'Shared room', 'Hotel room'];


const inputCls =
    'w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-800 ' +
    'placeholder-slate-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition';

const labelCls = 'block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2';

export default function PredictionForm() {
    const [formData, setFormData] = useState({
        latitude: 51.5074,
        longitude: -0.1278,
        neighborhood: 'Central London',
        room_type: 'Entire home/apt',
        accommodates: 2,
        bedrooms: 1,
        bathrooms: 1.0,
        amenities: [] as string[],
    });

    const [prediction, setPrediction] = useState<PredictionResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toggleAmenity = (id: string) =>
        setFormData(p => ({
            ...p,
            amenities: p.amenities.includes(id)
                ? p.amenities.filter(a => a !== id)
                : [...p.amenities, id],
        }));

    const handlePredict = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || 'Prediction failed');
            }
            setPrediction(await res.json());
        } catch (err: any) {
            setError(err.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-6xl mx-auto px-6 pt-10 pb-16">

                
                <div className="text-center mb-10">
                    <span className="inline-block text-xs font-bold uppercase tracking-widest text-rose-500 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full mb-4">
                        AI Price Predictor
                    </span>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        Optimal Pricing Engine
                    </h1>
                    <p className="mt-3 text-slate-500 text-base max-w-lg mx-auto">
                        Powered by XGBoost + SHAP — see exactly which factors drive your listing&apos;s price.
                    </p>
                </div>

                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                        <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center font-black">1</span>
                            Property Details
                        </h2>

                        <form onSubmit={handlePredict} className="space-y-6">

                            
                            <div>
                                <label className={labelCls}>Neighbourhood</label>
                                <select
                                    className={inputCls}
                                    value={`${formData.latitude},${formData.longitude},${formData.neighborhood}`}
                                    onChange={e => {
                                        const [lat, lng, name] = e.target.value.split(',');
                                        setFormData(p => ({ ...p, latitude: +lat, longitude: +lng, neighborhood: name }));
                                    }}
                                >
                                    {LOCATIONS.map(l => (
                                        <option key={l.name} value={`${l.lat},${l.lng},${l.name}`}>{l.name}</option>
                                    ))}
                                </select>
                            </div>

                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Room Type</label>
                                    <select
                                        className={inputCls}
                                        value={formData.room_type}
                                        onChange={e => setFormData(p => ({ ...p, room_type: e.target.value }))}
                                    >
                                        {ROOM_TYPES.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>Max Guests</label>
                                    <input
                                        type="number" min={1} max={16}
                                        className={inputCls}
                                        value={formData.accommodates}
                                        onChange={e => setFormData(p => ({ ...p, accommodates: +e.target.value || 1 }))}
                                    />
                                </div>
                            </div>

                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Bedrooms</label>
                                    <input
                                        type="number" min={0} max={10}
                                        className={inputCls}
                                        value={formData.bedrooms}
                                        onChange={e => setFormData(p => ({ ...p, bedrooms: +e.target.value || 0 }))}
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>Bathrooms</label>
                                    <input
                                        type="number" min={0} max={10} step={0.5}
                                        className={inputCls}
                                        value={formData.bathrooms || 1.0}
                                        onChange={e => setFormData(p => ({ ...p, bathrooms: +e.target.value || 1.0 }))}
                                    />
                                </div>
                            </div>

                            
                            <div>
                                <label className={labelCls}>Amenities</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {AMENITIES.map(a => {
                                        const selected = formData.amenities.includes(a.id);
                                        return (
                                            <button
                                                type="button"
                                                key={a.id}
                                                onClick={() => toggleAmenity(a.id)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all
                                                    ${selected
                                                        ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-sm'
                                                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                                                    }`}
                                            >
                                                <span className="text-base">{a.icon}</span>
                                                {a.label}
                                                {selected && (
                                                    <span className="ml-auto w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center">
                                                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            
                            {error && (
                                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                                    <span className="text-lg leading-none">⚠️</span>
                                    {error}
                                </div>
                            )}

                            
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-rose-500 to-rose-600
                                    hover:from-rose-600 hover:to-rose-700 shadow-lg shadow-rose-500/20
                                    transition-all hover:-translate-y-0.5 active:translate-y-0
                                    disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0
                                    focus:outline-none focus:ring-4 focus:ring-rose-400/30 text-sm"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Analysing…
                                    </span>
                                ) : 'Predict Optimal Price →'}
                            </button>
                        </form>
                    </div>

                    
                    <div className="space-y-6">
                        {!prediction ? (
                            <div className="min-h-[520px] flex flex-col items-center justify-center
                                bg-white rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-center p-10">
                                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5 text-3xl">
                                    🤖
                                </div>
                                <p className="font-semibold text-slate-600 text-lg mb-1">Awaiting Parameters</p>
                                <p className="text-sm max-w-xs">
                                    Fill in property details on the left and click <strong>Predict</strong> to see the SHAP factor breakdown.
                                </p>
                            </div>
                        ) : (
                            <>
                                
                                {prediction.amenity_counterfactuals && prediction.amenity_counterfactuals.length > 0 && (
                                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-800">Amenity Impact Analysis</h3>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    ML-derived marginal £ contribution per amenity — computed via counterfactual model runs
                                                </p>
                                            </div>
                                            <span className="text-[10px] px-2.5 py-1 bg-slate-100 rounded-full text-slate-500 font-bold uppercase tracking-wider">
                                                Counterfactual
                                            </span>
                                        </div>
                                        <div className="p-4 grid grid-cols-1 gap-2">
                                            {prediction.amenity_counterfactuals.map(a => {
                                                const isPos = a.increases_price;
                                                const maxImpact = Math.max(...prediction.amenity_counterfactuals.map(x => Math.abs(x.impact)));
                                                const barPct = maxImpact > 0 ? Math.min(100, (Math.abs(a.impact) / maxImpact) * 100) : 0;
                                                return (
                                                    <div
                                                        key={a.amenity}
                                                        className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition
                                                            ${a.selected
                                                                ? 'bg-rose-50 border-rose-200'
                                                                : 'bg-slate-50 border-slate-100 opacity-70 hover:opacity-100'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <span className="text-xl flex-shrink-0">{a.icon}</span>
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <p className="text-sm font-semibold text-slate-700 truncate">{a.label}</p>
                                                                    {a.selected && (
                                                                        <span className="text-[9px] font-bold uppercase tracking-wider text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded-full flex-shrink-0">
                                                                            Active
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="mt-1.5 h-1 rounded-full bg-slate-200 w-32">
                                                                    <div
                                                                        className={`h-1 rounded-full ${isPos ? 'bg-emerald-400' : 'bg-rose-400'}`}
                                                                        style={{ width: `${barPct}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span className={`flex-shrink-0 text-sm font-bold tabular-nums ${isPos ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                            {isPos ? '+' : ''}£{a.impact.toFixed(2)}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                
                                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl text-white shadow-2xl overflow-hidden">

                                    
                                    <div className="relative px-8 pt-10 pb-8 text-center border-b border-white/10 overflow-hidden">
                                        <div className="absolute inset-0 bg-rose-500/5 blur-3xl pointer-events-none" />
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                                            Recommended Market Price
                                        </p>
                                        <div className="flex items-start justify-center gap-1 text-white">
                                            <span className="text-2xl font-bold text-rose-400 mt-2">£</span>
                                            <span className="text-7xl font-black tracking-tighter">
                                                {Math.round(prediction.predicted_price)}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-sm mt-2">per night</p>
                                    </div>

                                    
                                    <div className="px-8 py-6 space-y-2">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                                                SHAP Factor Breakdown
                                            </h3>
                                            <span className="text-[10px] px-2.5 py-1 bg-white/10 rounded-full text-slate-300 font-semibold uppercase tracking-wider">
                                                XGBoost
                                            </span>
                                        </div>

                                        {prediction.shap_factors.map((f, idx) => {
                                            const isPos = f.increases_price;
                                            const maxImpact = Math.max(...prediction.shap_factors.map(x => Math.abs(x.impact)));
                                            const barPct = Math.min(100, (Math.abs(f.impact) / maxImpact) * 100);
                                            return (
                                                <div key={idx} className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black
                                                            ${isPos ? 'bg-emerald-400/15 text-emerald-400' : 'bg-rose-400/15 text-rose-400'}`}>
                                                            {isPos ? '↑' : '↓'}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-semibold text-slate-200 truncate">{f.feature}</p>
                                                            <div className="mt-1 h-1 rounded-full bg-white/5 w-28">
                                                                <div
                                                                    className={`h-1 rounded-full transition-all ${isPos ? 'bg-emerald-400' : 'bg-rose-400'}`}
                                                                    style={{ width: `${barPct}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className={`flex-shrink-0 text-sm font-bold tabular-nums ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                        {isPos ? '+' : ''}£{f.impact.toFixed(0)}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    
                                    <div className="px-8 pb-6 text-center">
                                        <p className="text-[10px] text-slate-500 leading-relaxed">
                                            SHAP values computed by TreeExplainer on the trained XGBoost model.
                                            Each factor shows its individual £GBP contribution to the predicted price.
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
