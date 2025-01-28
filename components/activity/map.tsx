import React, {useRef, useEffect} from 'react';
import mapboxgl from 'mapbox-gl';
import {Card} from "@/components/ui/card";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";

const Map3D: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    const activities = [
        {
            id: 1,
            name: 'Place du Capitole',
            coordinates: [1.444209, 43.604652],
            zone: 1,
        },
        {
            id: 2,
            name: 'Pitaya Rue de la Fayette',
            coordinates: [1.445, 43.605],
            zone: 2,
        },
        {
            id: 3,
            name: 'Basilique Saint-Sernin',
            coordinates: [1.441044, 43.6080722],
            zone: 3,
        },
        {
            id: 4,
            name: 'Saint Joseph La Salle',
            coordinates: [1.474432, 43.594191],
            zone: 4,
        },
        {
            id: 5,
            name: 'Cité de l Espace',
            coordinates: [1.493357, 43.586627],
            zone: 5,
        },
    ];

    useEffect(() => {
        if (!mapContainerRef.current) return;

        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [1.444209, 43.604652],
            zoom: 14,
        });

        mapRef.current = map;

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

            map.addLayer({
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
                        15, 0,
                        15.05, ['get', 'height']
                    ],
                    'fill-extrusion-base': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15, 0,
                        15.05, ['get', 'min_height']
                    ],
                    'fill-extrusion-opacity': 0.8,
                    'fill-extrusion-vertical-gradient': true
                }
            });

            map.setLight({
                anchor: 'viewport',
                color: 'white',
                intensity: 0.8,
                position: [1, 210, 30]
            });


            map.easeTo({
                pitch: 60,
                bearing: -10,
                duration: 3000

            });

            map.addSource('points', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [1.444209, 43.604652],
                            },
                            properties: {
                                title: 'Capitole',
                            },
                        },
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [1.445, 43.605],
                            },
                            properties: {
                                title: 'Pitaya Rue de la Fayette',
                            },
                        },

                        {
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [1.441044, 43.6080722],
                            },
                            properties: {
                                title: 'Basillique Saint-Sernin',
                            },
                        },

                        {
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [1.474432, 43.594191],
                            },
                            properties: {
                                title: 'Saint Joseph La Salle',
                            },
                        },

                        {
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [1.493357, 43.586627],
                            },
                            properties: {
                                title: 'Cité de l Espace',
                            },
                        },
                    ],
                },
            });

            map.addLayer({
                id: 'my-points-layer',
                type: 'symbol',
                source: 'points',
                layout: {
                    'icon-image': 'marker-15',
                    'icon-size': 1.5,
                    'icon-allow-overlap': true,
                    'text-field': ['get', 'title'],
                    'text-offset': [0, 1.2],
                    'text-anchor': 'top'
                },
                paint: {
                    'text-color': '#000000'
                }
            });
        });

        return () => {
            map.remove();
        };
    }, []);

    const handleActivityClick = (lng: number, lat: number) => {
        if (mapRef.current) {
            mapRef.current.flyTo({
                center: [lng, lat],
                zoom: 18,
                speed: 1.2,
                curve: 1,
                essential: true,
            });
        }
    };

    return (
        <Card className='flex h-screen'>
            <Card
                ref={mapContainerRef}
                className='w-full h-screen'
            />

            <ScrollArea className="w-1/3 h-full overflow-y-auto">
                <div className="p-4">
                    <h4 className="mb-6 text-2xl font-medium  leading-none">Tags</h4>
                    <ul className="p-0">
                        {activities.map((activity) => (
                            <li
                                key={activity.id}
                                style={{cursor: 'pointer', margin: '8px 0'}}
                                onClick={() =>
                                    handleActivityClick(
                                        activity.coordinates[0],
                                        activity.coordinates[1]
                                    )
                                }
                            >
                                <div className="block w-full p-2 rounded hover:bg-gray-100">
                                    Zone {activity.zone} - {activity.name}
                                </div>


                                <Separator className="my-2"/>

                            </li>
                        ))}
                    </ul>
                </div>
            </ScrollArea>
        </Card>
    );
};

export default Map3D;