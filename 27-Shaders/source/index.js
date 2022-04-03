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

/* My code */
const geometry = new three.PlaneGeometry( 1, 1, 32, 32 );
const position_num = geometry.attributes.position.count;
const randoms = new Float32Array( position_num );

for ( let i = 0; i < position_num; i++ ) {

    randoms[ i ] = Math.random();

}

geometry.setAttribute( "aRandom", new three.BufferAttribute( randoms, 1 ) );

const texture_loader = new three.TextureLoader();
const flag_texture = texture_loader.load( "/static/flag-french.jpg" );
const material = new three.RawShaderMaterial( {
    vertexShader: test_vertex_shader,
    fragmentShader: test_fragment_shader,
    wireframe: true,
    transparent: true,
    uniforms: {
        uFrequency: { value: new three.Vector2( 10, 5 ) },
        uTime: { value: 0 },
        uColor: { value: new three.Color( "orange" ) },
        uTexture: { value: flag_texture },
    }
} );
const mesh = new three.Mesh( geometry, material );

mesh.scale.y = 2 / 3;
scene.add( mesh );

/* GUI */
const gui = new GUI();

gui.add( material.uniforms.uFrequency.value, "x" ).min( 0 ).max( 20 ).step( 0.01 ).name( "frequencyX" );
gui.add( material.uniforms.uFrequency.value, "y" ).min( 0 ).max( 20 ).step( 0.01 ).name( "frequencyY" );

/* Render */
const clock = new three.Clock();

renderer.setAnimationLoop( function loop() {

    const  elapsed_time = clock.getElapsedTime();

    material.uniforms.uTime.value = elapsed_time;

    controls.update();
    renderer.render( scene, camera );

} );
