'use client';

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import HeatmapLayer from './HeatmapLayer';

export default function Map({ listings }: { listings: any[] }) {
    const [isMounted, setIsMounted] = useState(false);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className="h-full w-full bg-gray-100 animate-pulse rounded-xl"></div>
    }


    const getColor = (s: number) => {
        if (s >= 8) return '#22c55e';
        if (s >= 5) return '#eab308';
        return '#ef4444';
    };


    const center = listings.length > 0
        ? [listings[0].latitude, listings[0].longitude]
        : [51.5074, -0.1278];


    const prices = listings.map(l => l.price || 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    const heatmapPoints: [number, number, number][] = listings.map(l => {
        const normalizedPrice = priceRange > 0
            ? (l.price - minPrice) / priceRange
            : 0.5;
        const intensity = Math.max(0.3, Math.min(1.0, Math.pow(normalizedPrice, 0.7)));
        return [l.latitude, l.longitude, intensity];
    });

    return (
        <div className="relative h-full w-full">
            
            <div className="absolute top-4 right-4 z-[400] bg-white rounded-lg shadow-md p-1 flex items-center gap-2">
                <button
                    onClick={() => { setShowHeatmap(false); }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${!showHeatmap ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    Markers
                </button>
                <button
                    onClick={() => { setShowHeatmap(true); }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${showHeatmap ? 'bg-rose-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    🔥 Heatmap
                </button>
            </div>

            <MapContainer
                center={center as [number, number]}
                zoom={12}
                scrollWheelZoom={true}
                className="h-full w-full rounded-xl z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {showHeatmap ? (
                    <HeatmapLayer points={heatmapPoints} />
                ) : (
                    listings.map((l, idx) => {
                        const score = l.score ?? l.neighborhood_score ?? 5;
                        const price = l.price || 0;
                        const locationName = l.location || l.name || l.room_type;

                        return (
                            <CircleMarker
                                key={idx}
                                center={[l.latitude, l.longitude]}
                                radius={8}
                                pathOptions={{
                                    color: getColor(score),
                                    fillColor: getColor(score),
                                    fillOpacity: 0.8,
                                    weight: 2
                                }}
                                eventHandlers={{
                                    mouseover: (e) => { e.target.openPopup(); },
                                    mouseout: (e) => { e.target.closePopup(); },
                                    click: (e) => {
                                        e.originalEvent.stopPropagation();
                                        router.push(`/rooms/${l.id}`);
                                    },
                                }}
                            >
                                <Popup closeButton={false} autoPan={false}>
                                    <div
                                        className="min-w-[180px] cursor-pointer"
                                        onClick={() => router.push(`/rooms/${l.id}`)}
                                    >
                                        <div className="font-bold text-gray-900 text-sm leading-tight mb-0.5">{locationName}</div>
                                        <div className="text-gray-400 text-xs mb-2">{l.room_type}</div>
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="font-bold text-rose-500 text-sm">£{price.toLocaleString()}<span className="text-gray-400 font-normal text-xs"> /night</span></span>
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                                ⭐ {score}/10
                                            </span>
                                        </div>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        )
                    })
                )}
            </MapContainer>
        </div>
    );
}
