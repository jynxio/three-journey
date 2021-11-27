import "./style.css";
import * as three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import * as dat from "lil-gui";

// Canvas
const canvas = document.querySelector("canvas.webgl");


// Scene
const scene = new three.Scene();


// Object
const parameters = {
    color: 0xff0000,
    spin: function () {

        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });

    },
};
const geometry = new three.BoxGeometry(1, 1, 1)
const material = new three.MeshBasicMaterial({ color: parameters.color })
const mesh = new three.Mesh(geometry, material)
scene.add(mesh)

// Size
const size = { width: window.innerWidth, height: window.innerHeight };
const aspect_ratio = size.width / size.height;


// Camera
const camera = new three.PerspectiveCamera(75, size.width / size.height, 1, 100);

camera.position.z = 3;
scene.add(camera);


// Controls
const control = new OrbitControls(camera, canvas);

control.enableDamping = true;


// Renderer
const renderer = new three.WebGLRenderer({ canvas: canvas });

renderer.setSize(size.width, size.height);


// Animate
const clock = new three.Clock();

tick();

function tick() {

    requestAnimationFrame(tick);

    control.update();
    renderer.render(scene, camera);

}


// Resizing
window.addEventListener("resize", _ => {

    size.width = window.innerWidth;
    size.height = window.innerHeight;

    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();

    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio), 2);

});


// Fullscreen
window.addEventListener("dblclick", _ => {

    // webkitFullscreenElement, webkitExitFullscreen方法是为了兼容Safari(iPhone, 2021.11.21), 因为它暂不支持exitFullscreen, requestFullscreen
    if (document.fullscreenElement || document.webkitFullscreenElement) {

        document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen();

        return;

    }

    canvas.requestFullscreen ? canvas.requestFullscreen() : canvas.webkitFullscreenElement();

});


// Debug
const gui = new dat.GUI();

gui.add(mesh.position, "y");
gui.add(mesh.position, "x", -3, 3, 0.01);
gui.add(mesh.position, "z").min(-3).max(3).step(0.01);
gui.add(mesh, "visible").name("可见性");
gui.add(material, "wireframe").name("线框");
gui.addColor(parameters, "color").onChange(_ => material.color.set(parameters.color));
gui.add(parameters, "spin");