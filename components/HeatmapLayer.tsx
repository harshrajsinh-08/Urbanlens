import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';


if (typeof window !== 'undefined') {
    require('leaflet.heat');
}

interface HeatmapLayerProps {
    points: [number, number, number][];
}

export default function HeatmapLayer({ points }: HeatmapLayerProps) {
    const map = useMap();

    useEffect(() => {
        if (!map || !points || points.length === 0) return;



        if (!L.heatLayer) {
            console.error('leaflet.heat is not loaded');
            return;
        }

        try {

            const heat = L.heatLayer(points, {
                radius: 35,
                blur: 25,
                maxZoom: 13,
                minOpacity: 0.5,
                gradient: {
                    0.0: 'blue',
                    0.3: 'cyan',
                    0.5: 'lime',
                    0.7: 'yellow',
                    1.0: 'red'
                }
            });

            heat.addTo(map);

            return () => {
                if (map && heat) {
                    map.removeLayer(heat);
                }
            };
        } catch (error) {
            console.error('Error creating heatmap layer:', error);
        }
    }, [map, points]);

    return null;
}
