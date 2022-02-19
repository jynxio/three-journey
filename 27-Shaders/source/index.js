import "/style/reset.css";

import "/style/index.css";

import * as three from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import Gui from "lil-gui";

import vertex_shader from "./shader/vertex.glsl";

import fragment_shader from "./shader/fragment.glsl";

/* ------------------------------------------------------------------------------------------------------ */
/* Renderer */
const renderer = new three.WebGLRenderer( { antialias: window.devicePixelRatio < 2 } );

renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.append( renderer.domElement );

/* Scene */
const scene = new three.Scene();

/* Camera */
const camera = new three.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.01,
    100,
);

camera.position.set( 0.25, - 0.25, 1 );

scene.add( camera );

/* Controls */
const controls = new OrbitControls( camera, renderer.domElement );

controls.enableDamping = true;
controls.target = new three.Vector3( 0, 0, 0.01 );

/* Resize */
window.addEventListener( "resize", _ => {

    renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );
    renderer.setSize( window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

} );

/* Render */
const clock = new three.Clock();

renderer.setAnimationLoop( function loop() {

    const elapsed_time = clock.getElapsedTime();

    controls.update();

    renderer.render( scene, camera );

} );

/* ------------------------------------------------------------------------------------------------------ */
/* Test Mesh */
const geometry = new three.PlaneGeometry( 1, 1, 32, 32 );
const material = new three.RawShaderMaterial( {
    vertexShader: `
        uniform mat4 projectionMatrix;
        uniform mat4 viewMatrix;
        uniform mat4 modelMatrix;

        attribute vec3 position;

        void main() {
            gl_Position = projectionMatrix * viewMatrix * vec4( position, 1.0 );
        }
    `,
    fragmentShader: `
        precision mediump float;

        void main() {
            gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
        }
    `,
} );
const mesh = new three.Mesh( geometry, material );

scene.add( mesh );
