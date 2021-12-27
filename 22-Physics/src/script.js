import "./style.css";

import * as three from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import * as dat from "lil-gui";


/**
 * Debug
 */
const gui = new dat.GUI();


/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new three.Scene();


/**
 * Texture
 */
const textureLoader = new three.TextureLoader();
const cubeTextureLoader = new three.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
    "/textures/environmentMaps/0/px.png",
    "/textures/environmentMaps/0/nx.png",
    "/textures/environmentMaps/0/py.png",
    "/textures/environmentMaps/0/ny.png",
    "/textures/environmentMaps/0/pz.png",
    "/textures/environmentMaps/0/nz.png"
]);


/**
 * Test sphere
 */
const sphere = new three.Mesh(
    new three.SphereGeometry(0.5, 32, 32),
    new three.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
);
sphere.castShadow = true;
sphere.position.y = 0.5;
scene.add(sphere);


/**
 * Floor
 */
const floor = new three.Mesh(
    new three.PlaneGeometry(10, 10),
    new three.MeshStandardMaterial({
        color: "#777777",
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
);
floor.receiveShadow = true;
floor.rotation.x = - Math.PI * 0.5;
scene.add(floor);


/**
 * Lights
 */
const ambient_light = new three.AmbientLight(0xffffff, 0.7);
scene.add(ambient_light);

const directional_light = new three.DirectionalLight(0xffffff, 0.2);
directional_light.castShadow = true;
directional_light.shadow.mapSize.set(1024, 1024);
directional_light.shadow.camera.far = 15;
directional_light.shadow.camera.left = - 7;
directional_light.shadow.camera.top = 7;
directional_light.shadow.camera.right = 7;
directional_light.shadow.camera.bottom = - 7;
directional_light.position.set(5, 5, 5);
scene.add(directional_light);


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

});


/**
 * Camera
 */
// Base camera
const camera = new three.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
camera.position.set(- 3, 3, 3);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;


/**
 * Renderer
 */
const renderer = new three.WebGLRenderer({
    canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = three.PCFSoftShadowMap;
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


/**
 * Animate
 */
const clock = new three.Clock();

tick();

function tick() {

    window.requestAnimationFrame(tick);

    const elapsed_time = clock.getElapsedTime();

    controls.update();

    renderer.render(scene, camera);

}
