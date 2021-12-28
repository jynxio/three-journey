import "./style.css";

import * as three from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import cannon from "cannon";

import * as dat from "lil-gui";

import Stats from "stats.js";

/**
 * Debug
 */
const gui = new dat.GUI();


/**
 * Stats
 */
const stats = new Stats();
stats.showPanel(0);
document.body.prepend(stats.dom);


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
 * Physics
 */
const world = new cannon.World();
world.gravity.set(0, - 9.82, 0);

const concrete_material = new cannon.Material("concrete");
const plastic_material = new cannon.Material("plastic");
const concrete_plastic_contact_material = new cannon.ContactMaterial(
    concrete_material,
    plastic_material,
    {
        friction: 0.1,
        restitution: 0.7
    }
);
world.addContactMaterial(concrete_plastic_contact_material);

const default_material = new cannon.Material("default");
const default_contact_material = new cannon.ContactMaterial(
    default_material,
    default_material,
    {
        friction: 0.1,
        restitution: 0.7
    }
);
world.addContactMaterial(default_contact_material);
world.defaultContactMaterial = default_contact_material;

const sphere_shape = new cannon.Sphere(0.5);
const sphere_body = new cannon.Body({
    mass: 1,
    position: new cannon.Vec3(0, 3, 0),
    shape: sphere_shape,
    // material: default_material
});
world.addBody(sphere_body);

const floor_shape = new cannon.Plane();
const floor_body = new cannon.Body();
floor_body.mass = 0;
// floor_body.material = default_material;
floor_body.quaternion.setFromAxisAngle(new cannon.Vec3(-1, 0, 0), Math.PI * 0.5);
floor_body.addShape(floor_shape);
world.addBody(floor_body);


/**
 * Animate
 */
const clock = new three.Clock();
let old_elapsed_time = 0;

tick();

function tick() {

    window.requestAnimationFrame(tick);

    stats.begin();

    const elapsed_time = clock.getElapsedTime();
    const delta_time = elapsed_time - old_elapsed_time;
    old_elapsed_time = elapsed_time;

    // Update physics world
    world.step(1 / 120, delta_time, 3);

    // Update three world
    sphere.position.x = sphere_body.position.x;
    sphere.position.y = sphere_body.position.y;
    sphere.position.z = sphere_body.position.z;

    controls.update();

    renderer.render(scene, camera);

    stats.end();

}
