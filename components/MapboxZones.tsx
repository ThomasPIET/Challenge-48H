'use client';

import React, {useEffect, useRef} from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Définition de l'interface pour l'objet `this` dans `onAdd`
interface HighlightLayer {
    program: WebGLProgram;
    aPos: number;
    buffer: WebGLBuffer;
    polygons: Array<Array<mapboxgl.MercatorCoordinate>>; // Ajout de la propriété `polygons`
    borderBuffer: WebGLBuffer; // Buffer pour les bords
}

const MapboxExample = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null); // Type du conteneur de la carte
    const canvasRef = useRef<HTMLCanvasElement | null>(null); // Référence du canvas
    const mapRef = useRef<mapboxgl.Map | null>(null); // Type de la référence de la carte

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiZ2Fib3JkZSIsImEiOiJjbTZmMWUwOGQwMGZzMmxzYmZ3N3o1YTlrIn0.WhV1l2qaLrtY_SwbzZ6-dA';

        const map = new mapboxgl.Map({
            container: mapContainerRef.current!,
            zoom: 12,
            center: [1.4442, 43.6047],
            style: 'mapbox://styles/mapbox/light-v11',
            antialias: true,
            projection: 'mercator',
        });

        // Créer une couche personnalisée
        const highlightLayer: any = {
            id: 'highlight',
            type: 'custom',
            onAdd: function (this: HighlightLayer, map: mapboxgl.Map, gl: WebGLRenderingContext) {
                const vertexSource = `
                    uniform mat4 u_matrix;
                    attribute vec2 a_pos;
                    void main() {
                        gl_Position = u_matrix * vec4(a_pos, 0.0, 1.0);
                    }`;

                const fragmentSource = `
                    void main() {
                        gl_FragColor = vec4(1.0, 0.0, 0.0, 0.5);                    
                    }`;

                const borderFragmentSource = `
                    void main() {
                        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Noire pour la bordure
                    }`;

                const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
                gl.shaderSource(vertexShader, vertexSource);
                gl.compileShader(vertexShader);

                const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
                gl.shaderSource(fragmentShader, fragmentSource);
                gl.compileShader(fragmentShader);

                const borderFragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
                gl.shaderSource(borderFragmentShader, borderFragmentSource);
                gl.compileShader(borderFragmentShader);

                this.program = gl.createProgram()!;
                gl.attachShader(this.program, vertexShader);
                gl.attachShader(this.program, fragmentShader);
                gl.linkProgram(this.program);

                this.aPos = gl.getAttribLocation(this.program, 'a_pos');

                // Définir plusieurs polygones
                this.polygons = [
                    [

                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.4285, lat: 43.63213}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.4146, lat: 43.64766}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.42971, lat: 43.66369}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.45503, lat: 43.66375}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.46739, lat: 43.64735}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.45493, lat: 43.632}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.4285, lat: 43.63213}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.4146, lat: 43.64766}),
                    ],
                    [
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.39264, lat: 43.64797}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.4146, lat: 43.64766}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.4285, lat: 43.63213}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.41592, lat: 43.61616}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.39378, lat: 43.61607}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.38148, lat: 43.63214}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.39264, lat: 43.64797}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.4146, lat: 43.64766}),
                    ],
                    [
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.4285, lat: 43.63213}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.45493, lat: 43.632}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.46789, lat: 43.61636}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.45558, lat: 43.60112}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.42983, lat: 43.60149}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.41592, lat: 43.61616}),
                    ],
                    [
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.39378, lat: 43.61607}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.41592, lat: 43.61616}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.42983, lat: 43.60149}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.41617, lat: 43.5866}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.39351, lat: 43.58672}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.38183, lat: 43.60274}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.39378, lat: 43.61607}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.41592, lat: 43.61616}),
                    ],
                    [
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.42983, lat: 43.60149}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.45558, lat: 43.60112}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.46855, lat: 43.58681}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.4567, lat: 43.57251}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.42992, lat: 43.57214}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.41617, lat: 43.5866}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.42983, lat: 43.60149}),
                        mapboxgl.MercatorCoordinate.fromLngLat({lng: 1.41592, lat: 43.61616}),
                    ],
                ];

                // Aplatir les polygones pour créer un tableau de coordonnées
                const flatCoords = this.polygons
                    .flat() // Aplatisse tous les polygones
                    .map(coord => [coord.x, coord.y]) // Mappe chaque coordonnée en [x, y]
                    .flat(); // Aplatis les résultats pour créer un tableau plat

                // Créer le buffer WebGL avec les coordonnées aplaties pour les polygones
                this.buffer = gl.createBuffer()!;
                gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
                gl.bufferData(
                    gl.ARRAY_BUFFER,
                    new Float32Array(flatCoords),  // Données des coordonnées aplaties
                    gl.STATIC_DRAW
                );

                // Créer un buffer pour la bordure
                const borderCoords = this.polygons
                    .flat()
                    .map(coord => [coord.x, coord.y])
                    .concat([this.polygons[0][0].x, this.polygons[0][0].y]); // Ferme les polygones en ajoutant le premier point à la fin pour la bordure

                this.borderBuffer = gl.createBuffer()!;
                gl.bindBuffer(gl.ARRAY_BUFFER, this.borderBuffer);
                gl.bufferData(
                    gl.ARRAY_BUFFER,
                    new Float32Array(borderCoords.flat()),
                    gl.STATIC_DRAW
                );
            },
            render: function (this: HighlightLayer, gl: WebGLRenderingContext, matrix: number[]) {
                gl.useProgram(this.program);
                gl.uniformMatrix4fv(
                    gl.getUniformLocation(this.program, 'u_matrix'),
                    false,
                    matrix
                );

                // Dessiner les polygones
                gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
                gl.enableVertexAttribArray(this.aPos);
                gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0);
                gl.enable(gl.BLEND);
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

                let offset = 0;
                for (const polygon of this.polygons) {
                    gl.drawArrays(gl.TRIANGLE_FAN, offset, polygon.length);
                    offset += polygon.length; // Met à jour l'offset pour chaque polygone
                }

                // Dessiner les bords des polygones
                gl.useProgram(this.program);
                gl.bindBuffer(gl.ARRAY_BUFFER, this.borderBuffer);
                gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0);
                gl.drawArrays(gl.LINE_LOOP, 0, this.polygons.flat().length + 1); // Utilisation de LINE_LOOP pour dessiner la bordure
            },
        };

        mapRef.current = map; // Stocke l'instance de la carte dans la référence

        map.on('load', () => {
            map.addLayer(highlightLayer);
        });

        return () => {
            map.remove();
        };
    }, []);

    return <div ref={mapContainerRef} id="map" style={{height: '100%'}}></div>;
};

export default MapboxExample;
