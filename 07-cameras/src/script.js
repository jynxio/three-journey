import "./style.css";
import * as three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Size
const size = { width: 800, height: 600 };
const aspect_ratio = size.width / size.height;

// Scene
const scene = new three.Scene();

// Object
const mesh = new three.Mesh(
    new three.BoxGeometry(1, 1, 1, 5, 5, 5),
    new three.MeshBasicMaterial({ color: 0xff0000 })
);

scene.add(mesh);

// Camera
const camera = new three.PerspectiveCamera(75, size.width / size.height, 1, 100);

camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

// Controls
const control = new OrbitControls(camera, canvas);

control.enableDamping = true;

// Cursor
const cursor = { x: 0, y: 0 };

window.addEventListener("mousemove", event => {

    cursor.x = event.clientX / size.width - 0.5;
    cursor.y = -(event.clientY / size.height - 0.5);

});

// Renderer
const renderer = new three.WebGLRenderer({ canvas: canvas });

renderer.setSize(size.width, size.height);

// Animate
tick();

function tick() {

    requestAnimationFrame(tick);

    control.update();
    renderer.render(scene, camera);

}
