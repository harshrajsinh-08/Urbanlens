'use client';

import { useState } from 'react';

interface FilterPanelProps {
    onFilterChange: (filters: Filters) => void;
}

export interface Filters {
    minPrice: number;
    maxPrice: number;
    roomType: string;
    minScore: number;
    minBedrooms: number;
}

export default function FilterPanel({ onFilterChange }: FilterPanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState<Filters>({
        minPrice: 0,
        maxPrice: 1000,
        roomType: 'all',
        minScore: 0,
        minBedrooms: 0
    });

    const handleChange = (key: keyof Filters, value: any) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    return (
        <div className="mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
                <span className="font-semibold">Filters</span>
                {isOpen ? '▲' : '▼'}
            </button>

            {isOpen && (
                <div className="mt-4 p-6 border rounded-lg bg-white shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price Range (£)
                        </label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="number"
                                value={filters.minPrice}
                                onChange={(e) => handleChange('minPrice', Number(e.target.value))}
                                className="w-24 px-2 py-1 border rounded text-sm"
                                placeholder="Min"
                            />
                            <span>-</span>
                            <input
                                type="number"
                                value={filters.maxPrice}
                                onChange={(e) => handleChange('maxPrice', Number(e.target.value))}
                                className="w-24 px-2 py-1 border rounded text-sm"
                                placeholder="Max"
                            />
                        </div>
                    </div>

                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Room Type
                        </label>
                        <select
                            value={filters.roomType}
                            onChange={(e) => handleChange('roomType', e.target.value)}
                            className="w-full px-3 py-2 border rounded text-sm"
                        >
                            <option value="all">All Types</option>
                            <option value="Entire home/apt">Entire Home</option>
                            <option value="Private room">Private Room</option>
                            <option value="Shared room">Shared Room</option>
                        </select>
                    </div>

                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Min Neighborhood Score
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="10"
                            step="0.5"
                            value={filters.minScore}
                            onChange={(e) => handleChange('minScore', Number(e.target.value))}
                            className="w-full"
                        />
                        <div className="text-sm text-gray-600 mt-1">{filters.minScore} / 10</div>
                    </div>

                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Min Bedrooms
                        </label>
                        <select
                            value={filters.minBedrooms}
                            onChange={(e) => handleChange('minBedrooms', Number(e.target.value))}
                            className="w-full px-3 py-2 border rounded text-sm"
                        >
                            <option value="0">Any</option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
}
