import "/style/reset.css";

import * as three from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import * as dat from "lil-gui";


/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Scene
const scene = new three.Scene();


/**
 * Test sphere
 */
const testSphere = new three.Mesh(
    new three.SphereGeometry(1, 32, 32),
    new three.MeshBasicMaterial()
);
scene.add(testSphere);


/**
 * Size
 */
const size = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener("resize", _ => {

    // Update size
    size.width = window.innerWidth;
    size.height = window.innerHeight;

    // Update camera
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

})


/**
 * Renderer
 */
const renderer = new three.WebGLRenderer();
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);


/**
 * Camera
 */
// Base camera
const camera = new three.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
camera.position.set(4, 1, - 4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


/**
 * Animate
 */
tick();

function tick() {

    window.requestAnimationFrame(tick);

    controls.update();

    renderer.render(scene, camera);

}
