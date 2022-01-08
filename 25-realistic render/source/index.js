import "/style/reset.css";

import * as three from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import * as dat from "lil-gui";


/**
 * Base
 */
// Debug
const debug_object = {};
const gui = new dat.GUI();

// Scene
const scene = new three.Scene();


/**
 * Model
 */
const gltf_loader = new GLTFLoader();
// gltf_loader.load("./static/model/flight-helmet/glTF/FlightHelmet.gltf", gltf => {

//     gltf.scene.scale.set(10, 10, 10);
//     gltf.scene.position.set(0, -4, 0);
//     gltf.scene.rotation.y = Math.PI * 0.5;
//     scene.add(gltf.scene);

//     gui.add(gltf.scene.rotation, "y").min(- Math.PI).max(Math.PI).step(0.001).name("rotation");

//     updateAllMaterial();

// });
gltf_loader.load("./static/model/hamburger.glb", gltf => {

    gltf.scene.scale.set(0.3, 0.3, 0.3);
    gltf.scene.position.set(0, -1, 0);
    scene.add(gltf.scene);

    updateAllMaterial();

});


/**
 * Environment map
 */
const cube_texture_loader = new three.CubeTextureLoader();
const environment_map = cube_texture_loader.load([
    "./static/texture/environment-map/0/px.jpg",
    "./static/texture/environment-map/0/nx.jpg",
    "./static/texture/environment-map/0/py.jpg",
    "./static/texture/environment-map/0/ny.jpg",
    "./static/texture/environment-map/0/pz.jpg",
    "./static/texture/environment-map/0/nz.jpg",
]);
environment_map.encoding = three.sRGBEncoding;

scene.background = environment_map;

debug_object.envMapIntensity = 2.5;
gui.add(debug_object, "envMapIntensity").min(0).max(10).step(0.001).onChange(updateAllMaterial);

function updateAllMaterial() {

    scene.traverse(child => {

        if (child instanceof three.Mesh === false) return;
        if (child.material instanceof three.MeshStandardMaterial === false) return;

        child.material.envMap = environment_map;
        child.material.envMapIntensity = debug_object.envMapIntensity;
        child.castShadow = true;
        child.receiveShadow = true;

    });

}


/**
 * Light
 */
const directional_light = new three.DirectionalLight(0xffffff, 3);
directional_light.position.set(0.25, 3, -2.25);
directional_light.castShadow = true;
directional_light.shadow.camera.far = 15;
directional_light.shadow.mapSize.set(1024, 1024);
directional_light.shadow.normalBias = 0.05;
scene.add(directional_light);

gui.add(directional_light, "intensity").min(0).max(10).step(0.001).name("light intensity");
gui.add(directional_light.position, "x").min(-5).max(5).step(0.001).name("light X");
gui.add(directional_light.position, "y").min(-5).max(5).step(0.001).name("light Y");
gui.add(directional_light.position, "z").min(-5).max(5).step(0.001).name("light Z");


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
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = three.sRGBEncoding;
renderer.toneMapping = three.ReinhardToneMapping;
renderer.toneMappingExposure = 3;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = three.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

gui.add(renderer, "toneMapping", {
    No: three.NoToneMapping,
    Linear: three.LinearToneMapping,
    Reinhard: three.ReinhardToneMapping,
    Cineon: three.CineonToneMapping,
    ACESFilmic: three.ACESFilmicToneMapping,
})
gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001);


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
