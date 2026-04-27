'use client';
import Navbar from '../../components/Navbar';
import PredictionForm from '../../components/PredictionForm';
export default function PredictPage() {
    return (
        <main className="min-h-screen bg-slate-50">
            <Navbar />
            <PredictionForm />
        </main>
    );
}
