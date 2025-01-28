'use client';

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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

    useEffect(() => {
        mapboxgl.accessToken =
            'pk.eyJ1IjoiZ2Fib3JkZSIsImEiOiJjbTZmMWUwOGQwMGZzMmxzYmZ3N3o1YTlrIn0.WhV1l2qaLrtY_SwbzZ6-dA';

        const map = new mapboxgl.Map({
            container: mapContainerRef.current!,
            zoom: 12,
            center: [1.4442, 43.6047],
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
                [1.0, 0.0, 1.0, 0.5], // Magenta
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

                // Créer les buffers pour les polygones et les bordures
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

                // Dessiner les polygones
                this.polygons.forEach((polygon, index) => {
                    const color = this.colors[index % this.colors.length];
                    gl.uniform4f(gl.getUniformLocation(this.program, 'u_color'), ...color);

                    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[index]);
                    gl.enableVertexAttribArray(this.aPos);
                    gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0);
                    gl.drawArrays(gl.TRIANGLE_FAN, 0, polygon.length);

                    // Dessiner les bordures
                    gl.uniform4f(gl.getUniformLocation(this.program, 'u_color'), 0, 0, 0, 1); // Noir
                    gl.bindBuffer(gl.ARRAY_BUFFER, this.borderBuffers[index]);
                    gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0);
                    gl.drawArrays(gl.LINE_LOOP, 0, polygon.length + 1);
                });
            },
        };

        mapRef.current = map;

        map.on('load', () => {
            map.addLayer(highlightLayer);

            // Calculer les centres des polygones et ajouter des marqueurs
            polygons.forEach((polygon, index) => {
                const centroid = calculateCentroid(polygon);

                const markerElement = createCustomMarker(index + 1);
                const infobubble = createInfobubble(`Polygone ${index + 1}`);
                document.body.appendChild(infobubble);

                new mapboxgl.Marker({
                    element: markerElement,
                })
                    .setLngLat([centroid.lng, centroid.lat])
                    .addTo(map);

                // Ajouter un effet hover sur le marqueur
                markerElement.addEventListener('mouseenter', (e) => {
                    infobubble.style.display = 'block';
                    infobubble.style.left = `${e.clientX + 10}px`; // Position relative au curseur
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
    }, []);

    const createCustomMarker = (number: number) => {
        const marker = document.createElement('div');
        marker.style.backgroundColor = '#fff';
        marker.style.border = '2px solid #000';
        marker.style.borderRadius = '50%';
        marker.style.width = '30px';
        marker.style.height = '30px';
        marker.style.display = 'flex';
        marker.style.alignItems = 'center';
        marker.style.justifyContent = 'center';
        marker.style.fontWeight = 'bold';
        marker.style.color = '#000';
        marker.style.transition = 'transform 0.2s ease, background-color 0.2s ease';
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
        <div className="relative w-full h-screen">
            <div ref={mapContainerRef} className="absolute top-0 left-0 w-full h-full" />
        </div>
    );
};

export default MapboxExample;
