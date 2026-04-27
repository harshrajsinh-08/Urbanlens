'use client';

import { useState, useMemo } from 'react';

interface CalendarProps {
    dates: {
        date: string;
        available: boolean;
        price: number | null;
    }[];
    basePrice: number;
}

export default function CalendarWidget({ dates, basePrice }: CalendarProps) {
    const [currentMonthIdx, setCurrentMonthIdx] = useState(0);


    const groupedByMonth = useMemo(() => {
        if (!dates || dates.length === 0) return [];

        const groups: { monthStr: string, days: typeof dates }[] = [];
        dates.forEach(d => {
            const dateObj = new Date(d.date);
            const monthStr = dateObj.toLocaleString('en-US', { month: 'long', year: 'numeric' });

            let group = groups.find(g => g.monthStr === monthStr);
            if (!group) {
                group = { monthStr, days: [] };
                groups.push(group);
            }
            group.days.push(d);
        });
        return groups;
    }, [dates]);

    if (!dates || dates.length === 0) {
        return (
            <div className="p-6 bg-white rounded-2xl border border-gray-200 text-center">
                <p className="text-gray-500">No availability data found for this property.</p>
            </div>
        );
    }

    const currentMonth = groupedByMonth[currentMonthIdx];
    if (!currentMonth) return null;


    const firstDayObj = new Date(currentMonth.days[0].date);
    const startDayOfWeek = firstDayObj.getDay();

    return (
        <div className="p-6 bg-white rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                    Availability & Pricing
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        disabled={currentMonthIdx === 0}
                        onClick={() => setCurrentMonthIdx(c => c - 1)}
                        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                        ←
                    </button>
                    <span className="font-semibold text-sm w-36 text-center">{currentMonth.monthStr}</span>
                    <button
                        disabled={currentMonthIdx === groupedByMonth.length - 1}
                        onClick={() => setCurrentMonthIdx(c => c + 1)}
                        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                        →
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-xs font-bold text-gray-400 uppercase tracking-wider">{day}</div>
                ))}

                {Array.from({ length: startDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-14"></div>
                ))}

                {currentMonth.days.map((d, i) => {
                    const dateNum = new Date(d.date).getDate();
                    const displayPrice = d.price ?? basePrice;

                    return (
                        <div
                            key={i}
                            className={`h-14 rounded-xl flex flex-col items-center justify-center border-2 transition-all ${d.available
                                    ? 'border-transparent bg-emerald-50 hover:border-emerald-200 cursor-pointer group'
                                    : 'border-transparent bg-gray-50/50 opacity-40 cursor-not-allowed'
                                }`}
                        >
                            <span className={`text-sm font-semibold ${d.available ? 'text-emerald-900' : 'text-gray-400 line-through'}`}>
                                {dateNum}
                            </span>
                            {d.available && (
                                <span className="text-[10px] font-bold text-emerald-600 group-hover:scale-110 transition-transform">
                                    £{Math.round(displayPrice)}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-100 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-50 border border-emerald-200"></div>
                    Available
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-100 line-through text-transparent">X</div>
                    Booked / Unavailable
                </div>
            </div>
        </div>
    );
}
