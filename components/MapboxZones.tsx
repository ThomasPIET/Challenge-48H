'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
    Card,
    CardContent,

} from "@/components/ui/card"

interface NewsItem {
    quartier: string;
    // Ajoutez d'autres propriétés selon la structure de vos données
}

interface ZoneData {
    id: number;
    temperature: number;
    humidite: number;
    force_moyenne_du_vecteur_de_vent: number;
    force_du_vecteur_de_vent_max: number;
    pluie_intensite_max: number;
    date: string;
    quartier: string;
    sismicite: number;
    concentration_gaz: number;
    pluie_totale: number;
    seisme: boolean;
    inondation: boolean;
}


interface HighlightLayer {
    program: WebGLProgram;
    aPos: number;
    buffers: WebGLBuffer[];
    borderBuffers: WebGLBuffer[];
    polygons: Array<Array<mapboxgl.MercatorCoordinate>>;
    colors: Array<[number, number, number, number]>;
}

const MapboxExample = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    const [news, setNews] = useState<NewsItem[]>([]); // Utilisation du type NewsItem ici
    const [loading, setLoading] = useState(true);

    // Fonction pour calculer le centre géographique d'un polygone
    const calculateCentroid = (polygon: Array<{ lng: number; lat: number }>): { lng: number; lat: number } => {
        let lngSum = 0;
        let latSum = 0;

        polygon.forEach((coord) => {
            lngSum += coord.lng;
            latSum += coord.lat;
        });

        const centerLng = lngSum / polygon.length;
        const centerLat = latSum / polygon.length;

        return { lng: centerLng, lat: centerLat };
    };

    // Fonction pour récupérer les données de l'API
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('api/csv-data');
                const data = await response.json();
                setNews(data);
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors du chargement des données :', error);
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        mapboxgl.accessToken =
            'pk.eyJ1IjoiZ2Fib3JkZSIsImEiOiJjbTZmMWUwOGQwMGZzMmxzYmZ3N3o1YTlrIn0.WhV1l2qaLrtY_SwbzZ6-dA';

        const map = new mapboxgl.Map({
            container: mapContainerRef.current!,
            zoom: 11.5,
            center: [1.4300, 43.6200],
            style: 'mapbox://styles/mapbox/light-v11',
            antialias: true,
            projection: 'mercator',
        });

        const polygons = [
            [
                { lng: 1.42971, lat: 43.66369 },
                { lng: 1.45503, lat: 43.66375 },
                { lng: 1.46739, lat: 43.64735 },
                { lng: 1.45493, lat: 43.632 },
                { lng: 1.4285, lat: 43.63213 },
                { lng: 1.4146, lat: 43.64766 },
            ],
            [
                { lng: 1.39264, lat: 43.64797 },
                { lng: 1.4146, lat: 43.64766 },
                { lng: 1.4285, lat: 43.63213 },
                { lng: 1.41592, lat: 43.61616 },
                { lng: 1.39378, lat: 43.61607 },
                { lng: 1.38148, lat: 43.63214 },
            ],
            [
                { lng: 1.4285, lat: 43.63213 },
                { lng: 1.45493, lat: 43.632 },
                { lng: 1.46789, lat: 43.61636 },
                { lng: 1.45558, lat: 43.60112 },
                { lng: 1.42983, lat: 43.60149 },
                { lng: 1.41592, lat: 43.61616 },
            ],
            [
                { lng: 1.39378, lat: 43.61607 },
                { lng: 1.41592, lat: 43.61616 },
                { lng: 1.42983, lat: 43.60149 },
                { lng: 1.41617, lat: 43.5866 },
                { lng: 1.39351, lat: 43.58672 },
                { lng: 1.38183, lat: 43.60274 },
            ],
            [
                { lng: 1.42983, lat: 43.60149 },
                { lng: 1.45558, lat: 43.60112 },
                { lng: 1.46855, lat: 43.58681 },
                { lng: 1.4567, lat: 43.57251 },
                { lng: 1.42992, lat: 43.57214 },
                { lng: 1.41617, lat: 43.5866 },
            ],
        ];

        const highlightLayer: any = {
            id: 'highlight',
            type: 'custom',
            polygons: polygons.map((polygon) =>
                polygon.map((coord) => mapboxgl.MercatorCoordinate.fromLngLat(coord))
            ),
            colors: [
                [1.0, 0.0, 0.0, 0.5], // Rouge
                [0.0, 1.0, 0.0, 0.5], // Vert
                [0.0, 0.0, 1.0, 0.5], // Bleu
                [1.0, 1.0, 0.0, 0.5], // Jaune
                [0.0, 1.0, 1.0, 0.5], // Cyan
            ],
            onAdd(this: HighlightLayer, map: mapboxgl.Map, gl: WebGLRenderingContext) {
                const compileShader = (source: string, type: number) => {
                    const shader = gl.createShader(type)!;
                    gl.shaderSource(shader, source);
                    gl.compileShader(shader);
                    return shader;
                };

                const vertexSource = `
                  uniform mat4 u_matrix;
                  attribute vec2 a_pos;
                  void main() {
                    gl_Position = u_matrix * vec4(a_pos, 0.0, 1.0);
                  }`;

                const fragmentSource = `
                  precision mediump float;
                  uniform vec4 u_color;
                  void main() {
                    gl_FragColor = u_color;
                  }`;

                const vertexShader = compileShader(vertexSource, gl.VERTEX_SHADER);
                const fragmentShader = compileShader(fragmentSource, gl.FRAGMENT_SHADER);

                this.program = gl.createProgram()!;
                gl.attachShader(this.program, vertexShader);
                gl.attachShader(this.program, fragmentShader);
                gl.linkProgram(this.program);

                this.aPos = gl.getAttribLocation(this.program, 'a_pos');

                const createBuffers = (polygon: mapboxgl.MercatorCoordinate[], isBorder = false) => {
                    const coords = polygon
                        .map((p) => [p.x, p.y])
                        .concat(isBorder ? [[polygon[0].x, polygon[0].y]] : [])
                        .flat();
                    const buffer = gl.createBuffer()!;
                    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW);
                    return buffer;
                };

                this.buffers = this.polygons.map((polygon) => createBuffers(polygon));
                this.borderBuffers = this.polygons.map((polygon) => createBuffers(polygon, true));
            },
            render(this: HighlightLayer, gl: WebGLRenderingContext, matrix: number[]) {
                gl.useProgram(this.program);
                gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'u_matrix'), false, matrix);

                gl.enable(gl.BLEND);
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

                this.polygons.forEach((polygon, index) => {
                    const color = this.colors[index % this.colors.length];
                    gl.uniform4f(gl.getUniformLocation(this.program, 'u_color'), ...color);

                    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[index]);
                    gl.enableVertexAttribArray(this.aPos);
                    gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0);
                    gl.drawArrays(gl.TRIANGLE_FAN, 0, polygon.length);

                    gl.uniform4f(gl.getUniformLocation(this.program, 'u_color'), 0, 0, 0, 1);
                    gl.bindBuffer(gl.ARRAY_BUFFER, this.borderBuffers[index]);
                    gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0);
                    gl.drawArrays(gl.LINE_LOOP, 0, polygon.length + 1);
                });
            },
        };

        mapRef.current = map;

        map.on('load', () => {
            map.addLayer(highlightLayer);

            polygons.forEach((polygon, index) => {
                const centroid = calculateCentroid(polygon);

                // Associer les données de la zone
                const zoneData = news.find((zone) => zone.quartier === `Zone ${index + 1}`) as ZoneData; // Ajouter le typage ici

                // Si zoneData est undefined (zone non trouvée), on utilise un objet vide par défaut
                const infobubble = createInfobubble(zoneData?.quartier || 'Zone inconnue');
                infobubble.innerHTML = `
                <b>${zoneData?.quartier || 'Zone inconnue'}</b><br/>
                Température: ${zoneData?.temperature || 'N/A'} °C<br/>
                Humidité: ${zoneData?.humidite || 'N/A'}%<br/>
                Force moyenne du vent: ${zoneData?.force_moyenne_du_vecteur_de_vent || 'N/A'} m/s<br/>
                Force max du vent: ${zoneData?.force_du_vecteur_de_vent_max || 'N/A'} m/s<br/>
                Pluie max: ${zoneData?.pluie_intensite_max || 'N/A'} mm/h<br/>
                Date: ${zoneData?.date || 'N/A'}<br/>
                Sismicité: ${zoneData?.sismicite || 'N/A'}<br/>
                Concentration de gaz: ${zoneData?.concentration_gaz || 'N/A'} µg/m³<br/>
                Pluie totale: ${zoneData?.pluie_totale || 'N/A'} mm<br/>
                Séisme: ${zoneData?.seisme ? 'Oui' : 'Non'}<br/>
                Inondation: ${zoneData?.inondation ? 'Oui' : 'Non'}<br/>
            `   ;

                document.body.appendChild(infobubble);

                const markerElement = createCustomMarker(index + 1);

                new mapboxgl.Marker({
                    element: markerElement,
                })
                    .setLngLat([centroid.lng, centroid.lat])
                    .addTo(map);

                markerElement.addEventListener('mouseenter', (e) => {
                    infobubble.style.display = 'block';
                    infobubble.style.left = `${e.clientX + 10}px`;
                    infobubble.style.top = `${e.clientY + 10}px`;
                    markerElement.style.backgroundColor = '#000';
                    markerElement.style.color = '#fff';
                });
                markerElement.addEventListener('mouseleave', () => {
                    infobubble.style.display = 'none';
                    markerElement.style.backgroundColor = '#fff';
                    markerElement.style.color = '#000';
                });
            });
        });

        return () => {
            map.remove();
        };
    }, [news]); // Réexécuter quand les données changent

    const createCustomMarker = (number: number) => {
        const marker = document.createElement('div');
        marker.style.backgroundColor = '#fff';
        marker.style.border = '2px solid #000';
        marker.style.borderRadius = '50%';
        marker.style.width = '40px';
        marker.style.height = '40px';
        marker.style.display = 'flex';
        marker.style.alignItems = 'center';
        marker.style.justifyContent = 'center';
        marker.style.fontWeight = 'bold';
        marker.style.color = '#000';
        marker.style.transition = 'transform 0.2s ease, background-color 0.2s ease';
        marker.style.fontSize = '16px'; // Augmente la taille de la police ici
        marker.innerText = String(number);

        return marker;
    };

    const createInfobubble = (text: string) => {
        const bubble = document.createElement('div');
        bubble.style.position = 'absolute';
        bubble.style.backgroundColor = '#fff';
        bubble.style.border = '1px solid #ccc';
        bubble.style.borderRadius = '8px';
        bubble.style.padding = '8px 12px';
        bubble.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
        bubble.style.display = 'none';
        bubble.style.zIndex = '9999';
        bubble.innerText = text;

        return bubble;
    };

    return (
        <div className="flex justify-center mt-5">
            <Card className="w-3/4 h-[700px] border-2  rounded-lg overflow-hidden">
                <CardContent ref={mapContainerRef} className="w-full h-full">
                    {/* Le contenu de la carte ici */}
                </CardContent>
            </Card>
        </div>
    );
};

export default MapboxExample;
