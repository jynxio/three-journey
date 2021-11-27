import './style.css'
import * as three from 'three'
import gsap from "gsap";

// Scene
const scene = new three.Scene();

// Object
const geometry = new three.BoxGeometry(1, 1, 1);
const material = new three.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new three.Mesh(geometry, material);

scene.add(mesh);

// Size
const size = {
    width: 800,
    height: 600,
};

// Camera
const camera = new three.PerspectiveCamera(75, size.width / size.height);

camera.position.z = 3;
scene.add(camera);

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Renderer
const renderer = new three.WebGLRenderer({ canvas });

renderer.setSize(size.width, size.height);

// Animate
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });

tick();

function tick() {

    requestAnimationFrame(tick);

    renderer.render(scene, camera);

}