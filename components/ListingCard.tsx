import Link from 'next/link';
import Image from 'next/image';

interface ListingProps {
    id: string;
    image: string;
    location: string;
    distance: string;
    dates: string;
    price: number;
    rating: string;
    score: number;
    bedrooms: number;
    room_type: string;
}

import { useState } from 'react';

export default function ListingCard({ id, image, location, distance, dates, price, rating, score, bedrooms, room_type }: ListingProps) {
    const [imgSrc, setImgSrc] = useState(image || 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000');
    const getScoreColor = (s: number) => {
        if (s >= 8) return 'bg-green-100 text-green-800 border-green-200';
        if (s >= 5) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        return 'bg-red-100 text-red-800 border-red-200';
    };

    const getScoreLabel = (s: number) => {
        if (s >= 8) return 'Excellent';
        if (s >= 5) return 'Good';
        return 'Fair';
    };

    return (
        <Link href={`/rooms/${id}`} className="group cursor-pointer flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
            <div className="relative aspect-square w-full overflow-hidden bg-gray-200">
                <Image
                    src={imgSrc}
                    alt={location}
                    fill
                    unoptimized
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    onError={() => setImgSrc('https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000')}
                />
                <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-medium border ${getScoreColor(score)}`}>
                    {getScoreLabel(score)} Area
                </div>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{location}</h3>
                        <p className="text-sm text-gray-500 truncate">{room_type} · {bedrooms} bed{bedrooms !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm flex-shrink-0 ml-2">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium text-gray-900">{rating}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div>
                        <div className="text-lg font-semibold text-gray-900">£{price.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">per night</div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{score}/10</div>
                        <div className="text-xs text-gray-500">Quality score</div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
