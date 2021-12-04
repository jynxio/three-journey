import "./style.css";
import * as three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";


/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new three.Scene();


/**
 * Textures
 */
const texture_loader = new three.TextureLoader();
const particle_texture = texture_loader.load("/textures/particles/2.png");


/**
 * Particles
 */
// Geometry
const particle_geometry = new three.BufferGeometry();

const count = 20000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < positions.length; i++) positions[i] = (Math.random() - 0.5) * 10;
for (let i = 0; i < positions.length; i++) colors[i] = Math.random();

particle_geometry.setAttribute("position", new three.BufferAttribute(positions, 3));
particle_geometry.setAttribute("color", new three.BufferAttribute(colors, 3));

// Material
const particle_material = new three.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    transparent: true,
    // color: 0xffffff,
    map: particle_texture,
    alphaMap: particle_texture,
    // alphaTest: 0.001,
    // depthTest: false,
    depthWrite: false,
    blending: three.AdditiveBlending,
    vertexColors: true,
});

// Points
const particle = new three.Points(particle_geometry, particle_material);
scene.add(particle);


/**
 * Sizes
 */
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


/**
 * Camera
 */
// Base camera
const camera = new three.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;


/**
 * Renderer
 */
const renderer = new three.WebGLRenderer({
    canvas: canvas
});
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

    for (let i = 0; i < count; i++) {

        const x_index = i * 3;
        const y_index = i * 3 + 1;

        const x_value = particle_geometry.attributes.position.array[x_index];
        particle_geometry.attributes.position.array[y_index] = Math.sin(elapsed_time + x_value);

    }

    particle_geometry.attributes.position.needsUpdate = true;

    controls.update();
    renderer.render(scene, camera);

}
