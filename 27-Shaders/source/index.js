import "/style/reset.css";

import "/style/index.css";

import * as three from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import Gui from "lil-gui";

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
const camera = new three.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.01, 100 );

camera.position.set(0.25, - 0.25, 1)
scene.add( camera );

/* Controls */
const controls = new OrbitControls( camera, renderer.domElement );

controls.enableDamping = true;

/* Resize */
window.addEventListener( "resize", _ => {

    renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );
    renderer.setSize( window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

} );

/* Render */
renderer.setAnimationLoop( function loop() {

    controls.update();

    renderer.render( scene, camera );

} );

/* My code */
const geometry = new three.PlaneGeometry( 1, 1, 32, 32 );
const position_num = geometry.attributes.position.count;
const randoms = new Float32Array( position_num );

for ( let i = 0; i < position_num; i++ ) {

    randoms[ i ] = Math.random();

}

geometry.setAttribute( "aRandom", new three.BufferAttribute( randoms, 1 ) );


const material = new three.RawShaderMaterial( {
    vertexShader: test_vertex_shader,
    fragmentShader: test_fragment_shader,
    wireframe: true,
    transparent: true,
} );
const mesh = new three.Mesh( geometry, material );

scene.add( mesh );
