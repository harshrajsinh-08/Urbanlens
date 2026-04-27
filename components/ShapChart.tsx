'use client';

interface ShapFeature {
    feature: string;
    value: number;
    shap_value: number;
    impact: string;
}

interface ShapChartProps {
    features: ShapFeature[];
}

export default function ShapChart({ features }: ShapChartProps) {
    if (!features || features.length === 0) {
        return <div className="text-gray-500 text-sm">No explanation data available</div>;
    }


    const maxAbsValue = Math.max(...features.map(f => Math.abs(f.shap_value)));

    return (
        <div className="space-y-3">
            <h4 className="font-semibold text-gray-700 mb-3">Top Price Drivers</h4>
            {features.map((feature, idx) => {
                const percentage = (Math.abs(feature.shap_value) / maxAbsValue) * 100;
                const isPositive = feature.shap_value > 0;
                
                return (
                    <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-700">
                                {formatFeatureName(feature.feature)}
                            </span>
                            <span className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {isPositive ? '+' : ''}{feature.shap_value.toFixed(1)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div 
                                    className={`h-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <span className="text-xs text-gray-500 w-16 text-right">
                                {feature.value}
                            </span>
                        </div>
                    </div>
                );
            })}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-gray-600">
                <span className="font-semibold">How to read:</span> Positive values (green) increase the price, 
                negative values (red) decrease it. Bar length shows relative importance.
            </div>
        </div>
    );
}

function formatFeatureName(name: string): string {

    return name
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
