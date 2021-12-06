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
const canvas = document.querySelector(".webgl");

// Scene
const scene = new three.Scene();

/**
 * Objects
 */
const object_1 = new three.Mesh(
    new three.SphereGeometry(0.5, 16, 16),
    new three.MeshBasicMaterial({ color: "#ff0000" })
);
object_1.position.x = - 2;

const object_2 = new three.Mesh(
    new three.SphereGeometry(0.5, 16, 16),
    new three.MeshBasicMaterial({ color: "#ff0000" })
);

const object_3 = new three.Mesh(
    new three.SphereGeometry(0.5, 16, 16),
    new three.MeshBasicMaterial({ color: "#ff0000" })
);
object_3.position.x = 2;

scene.add(object_1, object_2, object_3);

/**
 * Size
 */
const size = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener("resize", () => {

    size.width = window.innerWidth
    size.height = window.innerHeight

    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();

    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

})

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
const renderer = new three.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


/**
 * Raycaster
 */
const raycaster = new three.Raycaster();

/**
 * Mouse
 */
const mouse = new three.Vector2();

window.addEventListener("mousemove", event => {

    mouse.x = event.clientX / window.innerWidth * 2 - 1;
    mouse.y = - event.clientY / window.innerHeight * 2 + 1;

});

/**
 * Animate
 */
const clock = new three.Clock();

tick();

function tick() {

    window.requestAnimationFrame(tick);

    const elapsed_time = clock.getElapsedTime();

    object_1.position.y = Math.sin(elapsed_time * 0.3) * 1.5;
    object_2.position.y = Math.sin(elapsed_time * 0.8) * 1.5;
    object_3.position.y = Math.sin(elapsed_time * 1.4) * 1.5;

    raycaster.setFromCamera(mouse, camera);

    const objectsToTest = [object_1, object_2, object_3];
    objectsToTest.forEach(object => object.material.color.set(0xff0000));

    const intersects = raycaster.intersectObjects(objectsToTest);
    intersects.forEach(intersect => intersect.object.material.color.set(0x0000ff));

    controls.update();
    renderer.render(scene, camera);

}

