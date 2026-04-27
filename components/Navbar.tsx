'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
    { href: '/', label: 'Browse Listings' },
    { href: '/predict', label: 'Price Predictor' },
    { href: '/host', label: 'Host Estimator' },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-200 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <span className="text-slate-900 font-black text-2xl tracking-tighter">
                        Urban<span className="text-rose-500">Lens</span>
                    </span>
                </Link>

                <nav className="flex items-center gap-1">
                    {NAV_LINKS.map(({ href, label }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all
                                    ${active
                                        ? 'bg-rose-50 text-rose-600'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}
