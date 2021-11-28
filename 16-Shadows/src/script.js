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
const ambient_light = new three.AmbientLight(0xffffff, 0.5);
scene.add(ambient_light);
gui.add(ambient_light, "intensity").min(0).max(1).step(0.001);

const directional_light = new three.DirectionalLight(0xffffff, 0.5);
directional_light.position.set(2, 2, - 1);
scene.add(directional_light)
gui.add(directional_light, "intensity").min(0).max(1).step(0.001);
gui.add(directional_light.position, "x").min(- 5).max(5).step(0.001);
gui.add(directional_light.position, "y").min(- 5).max(5).step(0.001);
gui.add(directional_light.position, "z").min(- 5).max(5).step(0.001);


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

const plane = new three.Mesh(
    new three.PlaneGeometry(5, 5),
    material
);
plane.rotation.x = - Math.PI * 0.5;
plane.position.y = - 0.5;
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


// Animate
const clock = new three.Clock();

tick();

function tick() {

    requestAnimationFrame(tick);

    const elapsed_time = clock.getElapsedTime();

    controls.update();
    renderer.render(scene, camera);

}
