import "/style/reset.css";

import * as three from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import * as dat from "lil-gui";


/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Scene
const scene = new three.Scene();


/**
 * Floor
 */
const floor = new three.Mesh(
    new three.PlaneGeometry(10, 10),
    new three.MeshStandardMaterial({
        color: "#444444",
        metalness: 0,
        roughness: 0.5
    })
);
floor.receiveShadow = true;
floor.rotation.x = - Math.PI * 0.5;
scene.add(floor);


/**
 * Light
 */
const ambient_light = new three.AmbientLight(0xffffff, 0.8);
scene.add(ambient_light);

const directional_light = new three.DirectionalLight(0xffffff, 0.6);
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
})


/**
 * Renderer
 */
const renderer = new three.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = three.PCFSoftShadowMap;
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);


/**
 * Camera
 */
// Base camera
const camera = new three.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
camera.position.set(2, 2, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;


/**
 * Model
 */
const draco_loader = new DRACOLoader();
draco_loader.setDecoderPath("/static/draco/");

const gltf_loader = new GLTFLoader();
gltf_loader.setDRACOLoader(draco_loader);
gltf_loader.load(
    "/static/model/hanburger-draco-gltfpipeline.glb",
    function onSuccess(gltf) {

        gltf.scene.scale.set(0.1, 0.1, 0.1);
        gltf.scene.position.y = 0.5;
        scene.add(gltf.scene);

    }
);


/**
 * Animate
 */
tick();

function tick() {

    window.requestAnimationFrame(tick);

    controls.update();
    renderer.render(scene, camera);

}

