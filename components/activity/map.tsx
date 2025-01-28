import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

const Map3D: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [1.444209, 43.604652],
            zoom: 15
        });

        map.on('load', () => {

            // @ts-ignore
            const layers = map.getStyle().layers;
            if (!layers) return;


            let labelLayerId: string | undefined;
            for (const layer of layers) {
                if (
                    layer.type === 'symbol' &&
                    layer.layout &&
                    (layer.layout['text-field'] as any)
                ) {
                    labelLayerId = layer.id;
                    break;
                }
            }

            map.addLayer(
                {
                    id: '3d-buildings',
                    source: 'composite',
                    'source-layer': 'building',
                    filter: ['==', 'extrude', 'true'],
                    type: 'fill-extrusion',
                    minzoom: 15,
                    paint: {
                        'fill-extrusion-color': '#aaa',
                        'fill-extrusion-height': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            15,
                            0,
                            15.05,
                            ['get', 'height']
                        ],
                        'fill-extrusion-base': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            15,
                            0,
                            15.05,
                            ['get', 'min_height']
                        ],
                        'fill-extrusion-opacity': 0.6
                    }
                },
                labelLayerId
            );


            map.addSource('points', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates:[1.444209, 43.604652]
                            },
                            properties: {
                                title: 'Un point sur la carte'
                            }
                        },
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                    coordinates: [1.444209, 43.604652]
                            },
                            properties: {
                                title: 'Un deuxième point'
                            }
                        }
                    ]
                }
            });

            map.addLayer({
                id: 'points-layer',
                type: 'circle',
                source: 'points',
                paint: {
                    'circle-radius': 6,
                    'circle-color': '#B42222'
                }
            });

        });

        return () => {
            map.remove();
        };
    }, []);

    return (
        <div
            ref={mapContainerRef}
            style={{ width: '100%', height: '500px' }}
        />
    );
};

export default Map3D;
