import "./style.css";

import * as three from "three";

import * as dat from "lil-gui";

/**
 * Debug
 */
const gui = new dat.GUI();

const parameters = {
    materialColor: "#ffeded",
};

gui
    .addColor(parameters, "materialColor")
    .onChange(_ => material.color.set(parameters.materialColor));

/**
 * Base
 */
// Canvas
const canvas = document.querySelector(".webgl");

// Scene
const scene = new three.Scene();

/**
 * Object
 */
// Texture
const texture_loader = new three.TextureLoader();
const gradient_texture = texture_loader.load("textures/gradients/3.jpg");
gradient_texture.minFilter = three.NearestFilter; // 禁用mapping，提升性能
gradient_texture.magFilter = three.NearestFilter; // 禁用纹理插值，以避免产生渐变效果

// Material
const material = new three.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradient_texture,
});

// Mesh
const torus = new three.Mesh(
    new three.TorusGeometry(1, 0.4, 16, 60),
    material
);

const cone = new three.Mesh(
    new three.ConeGeometry(1, 2, 32),
    material
);

const torusknot = new three.Mesh(
    new three.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
);

scene.add(torus, cone, torusknot);

const objects_distance = 4;
torus.position.y = - objects_distance * 0;
cone.position.y = - objects_distance * 1;
torusknot.position.y = - objects_distance * 2;

torus.position.x = 2;
cone.position.x = -2;
torusknot.position.x = 2;

/**
 * Light
 */
const directional_light = new three.DirectionalLight(0xffffff, 1);
directional_light.position.set(1, 1, 0);
scene.add(directional_light);

/**
 * Scroll
 */
let scroll_y = window.scrollY;

window.addEventListener("scroll", _ => {

    scroll_y = window.scrollY;

});

/**
 * Cursor
 */
const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener("mousemove", event => {

    cursor.x = event.clientX / (size.width - 1) - 0.5;
    cursor.y = event.clientY / (size.height - 1) - 0.5;

});

/**
 * Size
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

})

/**
 * Camera
 */
// Group
const camera_group = new three.Group();
scene.add(camera_group);

// Base camera
const camera = new three.PerspectiveCamera(35, size.width / size.height, 0.1, 100);
camera.position.z = 6;
camera_group.add(camera);

/**
 * Renderer
 */
const renderer = new three.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new three.Clock();
let previous_time = 0;

const section_meshs = [torus, cone, torusknot];

tick();

function tick() {

    window.requestAnimationFrame(tick);

    const elapsed_time = clock.getElapsedTime();
    const delta_time = elapsed_time - previous_time;

    previous_time = elapsed_time;

    // Animate Object
    section_meshs.forEach(item => {

        item.rotation.x = elapsed_time * 0.1;
        item.rotation.y = elapsed_time * 0.12;

    });

    // Animate camera
    camera_group.position.y = - scroll_y / size.height * objects_distance;

    const parallax_x = cursor.x * 0.5;
    const parallax_y = - cursor.y * 0.5;
    // camera.position.x = parallax_x; // 线性运动
    // camera.position.y = parallax_y; // 线性运动
    camera.position.x += (parallax_x - camera.position.x) * 5 * delta_time;
    camera.position.y += (parallax_y - camera.position.y) * 5 * delta_time;
    renderer.render(scene, camera);

}
