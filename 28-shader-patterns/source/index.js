import "/style/reset.css";

import "/style/index.css";

import * as three from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import Gui, { GUI } from "lil-gui";

import test_vertex_shader from "./vertex.glsl";

import test_fragment_shader from "./fragment.glsl";

/* ------------------------------------------------------------------------------------------------------ */
/* Renderer */
const renderer = new three.WebGLRenderer( { antialias: window.devicePixelRatio < 2 } );

renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.append( renderer.domElement );

/* Scene */
const scene = new three.Scene();

/* Camera */
const aspect = window.innerWidth / window.innerHeight;
const camera = new three.OrthographicCamera( - 1, 1, 1 * aspect, - 1 * aspect, 0.1, 10 );

camera.position.set( 0, 0, 1 );
scene.add( camera );

/* Resize */
window.addEventListener( "resize", _ => {

    const aspect = window.innerWidth / window.innerHeight;

    camera.top = 1 * aspect;
    camera.bottom = - 1 * aspect;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );
    renderer.setSize( window.innerWidth, window.innerHeight);

} );

/* My code */
const geometry = new three.PlaneGeometry( 2, 2 * aspect, 128, 128 );
const material = new three.RawShaderMaterial( {
    vertexShader: test_vertex_shader,
    fragmentShader: test_fragment_shader,
    wireframe: false,
    side: three.DoubleSide,
    uniforms: {
        uTime: { value: 0 },
    },
} );
const mesh = new three.Mesh( geometry, material );

scene.add( mesh );

/* Render */
const clock = new three.Clock();

renderer.setAnimationLoop( function loop() {

    const elapsed_time = clock.getElapsedTime();

    material.uniforms.uTime.value = elapsed_time;
    renderer.render( scene, camera );

} );
