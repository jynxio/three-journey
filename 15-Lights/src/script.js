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


// Lights
const ambientLight = new three.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new three.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);


// Material
const material = new three.MeshStandardMaterial();
material.roughness = 0.4;


// Objects
const sphere = new three.Mesh(
    new three.SphereGeometry(0.5, 32, 32),
    material
);
sphere.position.x = - 1.5;

const cube = new three.Mesh(
    new three.BoxGeometry(0.75, 0.75, 0.75),
    material
);

const torus = new three.Mesh(
    new three.TorusGeometry(0.3, 0.2, 32, 64),
    material
);
torus.position.x = 1.5;

const plane = new three.Mesh(
    new three.PlaneGeometry(5, 5),
    material
);
plane.rotation.x = - Math.PI * 0.5;
plane.position.y = - 0.65;
scene.add(sphere, cube, torus, plane);


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
})



// Camera
const camera = new three.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);


// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
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

    sphere.rotation.x = 0.15 * elapsed_time;
    sphere.rotation.y = 0.1 * elapsed_time;

    cube.rotation.x = 0.15 * elapsed_time;
    cube.rotation.y = 0.1 * elapsed_time;

    torus.rotation.x = 0.15 * elapsed_time;
    torus.rotation.y = 0.1 * elapsed_time;

    controls.update();

    renderer.render(scene, camera);

}
