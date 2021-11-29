import "./style.css";
import * as three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";


// Debug
const gui = new dat.GUI();


// Canvas
const canvas = document.querySelector("canvas.webgl");


// Scene
const scene = new three.Scene();


// Light
const ambient_light = new three.AmbientLight(0xffffff, 0.4);
scene.add(ambient_light);
gui.add(ambient_light, "intensity").min(0).max(1).step(0.001);

const directional_light = new three.DirectionalLight(0xffffff, 0.4);
directional_light.position.set(2, 2, - 1);
directional_light.castShadow = true;
directional_light.shadow.mapSize.width = 1024;
directional_light.shadow.mapSize.height = 1024;
directional_light.shadow.camera.near = 1;
directional_light.shadow.camera.far = 6;
directional_light.shadow.camera.top = 2;
directional_light.shadow.camera.right = 2;
directional_light.shadow.camera.bottom = -2;
directional_light.shadow.camera.left = -2;
directional_light.shadow.radius = 10;
scene.add(directional_light)

const directional_light_camera_helper = new three.CameraHelper(directional_light.shadow.camera);
directional_light_camera_helper.visible = false;
scene.add(directional_light_camera_helper);

gui.add(directional_light, "intensity").min(0).max(1).step(0.001);
gui.add(directional_light.position, "x").min(- 5).max(5).step(0.001);
gui.add(directional_light.position, "y").min(- 5).max(5).step(0.001);
gui.add(directional_light.position, "z").min(- 5).max(5).step(0.001);

const spot_light = new three.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3);
spot_light.castShadow = true;
spot_light.position.set(0, 2, 2);
spot_light.shadow.mapSize.width = 1024;
spot_light.shadow.mapSize.height = 1024;
spot_light.shadow.camera.fov = 30;
spot_light.shadow.camera.near = 1;
spot_light.shadow.camera.far = 6;
// spot_light.shadow.radius = 10;
scene.add(spot_light);
scene.add(spot_light.target);

// const spot_light_camera_helper = new three.CameraHelper(spot_light.shadow.camera);
// scene.add(spot_light_camera_helper);

// const spot_light_helper = new three.SpotLightHelper(spot_light);
// scene.add(spot_light_helper);
// spot_light_helper.update();

const point_light = new three.PointLight(0xffffff, 0.3);
point_light.castShadow = true;
point_light.position.set(-1, 1, 0);
scene.add(point_light);

const point_light_camera_helper = new three.CameraHelper(point_light.shadow.camera);
scene.add(point_light_camera_helper);
// TODO 从 PointLight 开始

// Materials
const material = new three.MeshStandardMaterial();
material.roughness = 0.7;
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);


// Objects
const sphere = new three.Mesh(
    new three.SphereGeometry(0.5, 32, 32),
    material
);
sphere.castShadow = true;

const plane = new three.Mesh(
    new three.PlaneGeometry(5, 5),
    material
);
plane.rotation.x = - Math.PI * 0.5;
plane.position.y = - 0.5;
plane.receiveShadow = true;
scene.add(sphere, plane);

// Size
const size = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener("resize", () => {

    size.width = window.innerWidth;
    size.height = window.innerHeight;

    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();

    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

});


// Camera
const camera = new three.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);


// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;


// Rednerer
const renderer = new three.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = three.BasicShadowMap;
// renderer.shadowMap.type = three.PCFSoftShadowMap;


// Animate
const clock = new three.Clock();

tick();

function tick() {

    requestAnimationFrame(tick);

    const elapsed_time = clock.getElapsedTime();

    controls.update();
    renderer.render(scene, camera);

}
