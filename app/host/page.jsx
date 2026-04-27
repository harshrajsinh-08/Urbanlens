"use client";
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { API_URL } from '../../utils/config';


const inputCls =
    'w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-800 ' +
    'placeholder-slate-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition';

const labelCls = 'block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2';

const CITY_COORDS = {
    'westminster': [51.4975, -0.1357],
    'camden': [51.5290, -0.1255],
    'kensington': [51.5014, -0.1919],
    'islington': [51.5416, -0.1022],
    'hackney': [51.5450, -0.0553],
    'greenwich': [51.4892, 0.0648],
    'lambeth': [51.5013, -0.1173],
    'southwark': [51.5035, -0.0804],
    'wandsworth': [51.4568, -0.1910],
    'tower hamlets': [51.5099, -0.0059],
    'richmond': [51.4479, -0.3260],
    'haringey': [51.5907, -0.1105],
    'enfield': [51.6562, -0.0807],
    'croydon': [51.3714, -0.0977],
    'ealing': [51.5130, -0.3089],
};

const PROPERTY_TYPES = ['Apartment', 'House', 'Condo', 'Townhouse', 'Studio', 'Loft', 'Guesthouse'];

const AMENITIES = [
    { key: 'wifi', label: 'Fast WiFi', icon: '📶' },
    { key: 'ac', label: 'Air Conditioning', icon: '❄️' },
    { key: 'kitchen', label: 'Full Kitchen', icon: '🍳' },
    { key: 'tv', label: 'Television', icon: '📺' },
    { key: 'pool', label: 'Swimming Pool', icon: '🏊' },
    { key: 'gym', label: 'Gym / Fitness', icon: '💪' },
];

export default function HostPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const [formData, setFormData] = useState({
        city: 'westminster',
        property_type: 'Apartment',
        room_type: 'Entire home/apt',
        accommodates: 2,
        bedrooms: 1,
        bathrooms: 1.0,
        wifi: true,
        ac: true,
        kitchen: true,
        tv: true,
        pool: false,
        gym: false,
        latitude: 51.4975,
        longitude: -0.1357,
    });

    const handleCityChange = (e) => {
        const city = e.target.value;
        const coords = CITY_COORDS[city];
        setFormData(p => ({ ...p, city, latitude: coords[0], longitude: coords[1] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/analyze-listing`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            setResult(await res.json());
        } catch (err) {
            console.error('Failed to analyze listing', err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-6xl mx-auto px-6 pt-10 pb-16">

                
                <div className="text-center mb-10">
                    <span className="inline-block text-xs font-bold uppercase tracking-widest text-rose-500 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full mb-4">
                        Host Earnings Estimator
                    </span>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        Estimate Your Earnings
                    </h1>
                    <p className="mt-3 text-slate-500 text-base max-w-lg mx-auto">
                        Find out how much you could earn and get smart tips to maximise your property value.
                    </p>
                </div>

                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

                    
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                        <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center font-black">1</span>
                            Property Details
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            
                            <div>
                                <label className={labelCls}>Neighbourhood</label>
                                <select className={inputCls} value={formData.city} onChange={handleCityChange}>
                                    {Object.keys(CITY_COORDS).map(c => (
                                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                                    ))}
                                </select>
                            </div>

                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Property Type</label>
                                    <select
                                        className={inputCls}
                                        value={formData.property_type}
                                        onChange={e => setFormData(p => ({ ...p, property_type: e.target.value }))}
                                    >
                                        {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>Room Type</label>
                                    <select
                                        className={inputCls}
                                        value={formData.room_type}
                                        onChange={e => setFormData(p => ({ ...p, room_type: e.target.value }))}
                                    >
                                        {['Entire home/apt', 'Private room', 'Shared room'].map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className={labelCls}>Guests</label>
                                    <input
                                        type="number" min={1} max={16}
                                        className={inputCls}
                                        value={formData.accommodates}
                                        onChange={e => setFormData(p => ({ ...p, accommodates: +e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>Beds</label>
                                    <input
                                        type="number" min={0} max={10}
                                        className={inputCls}
                                        value={formData.bedrooms}
                                        onChange={e => setFormData(p => ({ ...p, bedrooms: +e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>Baths</label>
                                    <input
                                        type="number" min={0} max={10} step={0.5}
                                        className={inputCls}
                                        value={formData.bathrooms}
                                        onChange={e => setFormData(p => ({ ...p, bathrooms: +e.target.value }))}
                                    />
                                </div>
                            </div>

                            
                            <div>
                                <label className={labelCls}>Amenities</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {AMENITIES.map(({ key, label, icon }) => {
                                        const on = formData[key];
                                        return (
                                            <button
                                                type="button"
                                                key={key}
                                                onClick={() => setFormData(p => ({ ...p, [key]: !p[key] }))}
                                                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all
                                                    ${on
                                                        ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-sm'
                                                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                                                    }`}
                                            >
                                                <span className="text-base">{icon}</span>
                                                <span className="truncate">{label}</span>
                                                {on && (
                                                    <span className="ml-auto flex-shrink-0 w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center">
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

                            
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-rose-500 to-rose-600
                                    hover:from-rose-600 hover:to-rose-700 shadow-lg shadow-rose-500/20
                                    transition-all hover:-translate-y-0.5 active:translate-y-0
                                    disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0
                                    focus:outline-none focus:ring-4 focus:ring-rose-400/30"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Analysing…
                                    </span>
                                ) : 'Estimate Earnings →'}
                            </button>
                        </form>

                    </div>

                    
                    <div className="lg:col-span-3 space-y-6">
                        {!result ? (
                            <div className="h-full min-h-[520px] flex flex-col items-center justify-center
                                bg-white rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-center p-10">
                                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5 text-3xl">
                                    🏠
                                </div>
                                <p className="font-semibold text-slate-600 text-lg mb-1">No Estimate Yet</p>
                                <p className="text-sm max-w-xs">Fill in your property details on the left and click <strong>Estimate Earnings</strong>.</p>
                            </div>
                        ) : (
                            <>
                                
                                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl">
                                    <div className="px-8 pt-10 pb-8 text-center border-b border-white/10 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-rose-500/5 blur-3xl pointer-events-none" />
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                                            Estimated Nightly Price
                                        </p>
                                        <div className="flex items-start justify-center gap-1 text-white">
                                            <span className="text-2xl font-bold text-rose-400 mt-2">£</span>
                                            <span className="text-7xl font-black tracking-tighter">
                                                {result?.predicted_price?.toLocaleString() ?? '—'}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-sm mt-2">per night</p>
                                    </div>

                                    
                                    <div className="px-8 py-5 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-300">Potential Monthly Revenue</p>
                                            <p className="text-xs text-slate-500 mt-0.5">Based on 60% occupancy</p>
                                        </div>
                                        <p className="text-2xl font-black text-emerald-400">
                                            £{result?.potential_revenue_monthly?.toLocaleString() ?? '—'}
                                        </p>
                                    </div>
                                </div>

                                
                                {result?.top_features?.length > 0 && (
                                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                                        <div className="flex items-center justify-between mb-5">
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                                                Price Factor Breakdown
                                            </h3>
                                            <span className="text-[10px] px-2.5 py-1 bg-slate-100 rounded-full text-slate-400 font-semibold uppercase tracking-wider">
                                                SHAP
                                            </span>
                                        </div>
                                        <div className="space-y-3">
                                            {result.top_features.slice(0, 6).map((feature, idx) => {
                                                const isPos = feature.shap_value > 0;
                                                const impact = Math.round(Math.abs(feature.shap_value));
                                                const maxImpact = Math.max(...result.top_features.map(f => Math.abs(f.shap_value)));
                                                const barPct = Math.min(100, (Math.abs(feature.shap_value) / maxImpact) * 100);
                                                return (
                                                    <div key={idx} className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50/60 hover:bg-slate-100/60 border border-slate-100 transition">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black
                                                                ${isPos ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-500'}`}>
                                                                {isPos ? '↑' : '↓'}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-semibold text-slate-700 truncate">{feature.feature}</p>
                                                                <div className="mt-1 h-1 rounded-full bg-slate-200 w-28">
                                                                    <div
                                                                        className={`h-1 rounded-full ${isPos ? 'bg-emerald-400' : 'bg-rose-400'}`}
                                                                        style={{ width: `${barPct}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span className={`flex-shrink-0 text-sm font-bold tabular-nums
                                                            ${isPos ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                            {isPos ? '+' : '−'}£{impact.toLocaleString()}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                
                                {result?.amenity_impacts?.length > 0 && (
                                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-sm">⚡</div>
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                                                Increase Your Value
                                            </h3>
                                        </div>
                                        <p className="text-sm text-slate-500 mb-5">
                                            Based on similar listings in <strong className="text-slate-700 capitalize">{formData.city}</strong>, adding these amenities could boost your earnings.
                                        </p>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {result.amenity_impacts.map((tip, idx) => (
                                                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-emerald-200 hover:bg-emerald-50/30 transition">
                                                    <div className="flex justify-between items-start mb-1.5">
                                                        <p className="font-semibold text-slate-800 text-sm">{tip.amenity}</p>
                                                        <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                                                            +{tip.percentage_increase}%
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-400">
                                                        Est. uplift: <span className="font-bold text-slate-700">+£{tip.price_increase.toLocaleString()}</span> / night
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                
                                {result?.amenity_impacts?.length === 0 && (
                                    <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 flex items-center gap-4">
                                        <div className="text-3xl">🎉</div>
                                        <div>
                                            <h3 className="font-bold text-emerald-800">Fully Optimised!</h3>
                                            <p className="text-sm text-emerald-600 mt-0.5">Your property has all the key amenities for top-tier pricing.</p>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
