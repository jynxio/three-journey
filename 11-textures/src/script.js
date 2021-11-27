import "./style.css";
import * as three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Canvas
const canvas = document.querySelector("canvas.webgl");


// Scene
const scene = new three.Scene();


// Object
const loader = new three.TextureLoader();
const texture = loader.load("/textures/minecraft.png");
const geometry = new three.BoxGeometry(1, 1, 1);
const material = new three.MeshBasicMaterial({ map: texture })
const mesh = new three.Mesh(geometry, material)

// texture.repeat.x = 2;
// texture.repeat.y = 2;
// texture.wrapS = three.MirroredRepeatWrapping;
// texture.wrapT = three.MirroredRepeatWrapping;
// texture.offset.x = 0.5;
// texture.offset.y = 0.5;
// texture.rotation = Math.PI / 4;
// texture.center.x = 0.5;
// texture.center.y = 0.5;
// texture.minFilter = three.NearestFilter;
// texture.magFilter = three.NearestFilter;
scene.add(mesh)

// Size
const size = { width: window.innerWidth, height: window.innerHeight };


// Camera
const camera = new three.PerspectiveCamera(75, size.width / size.height, 0.01, 100);

camera.position.z = 3;
scene.add(camera);


// Controls
const control = new OrbitControls(camera, canvas);

control.enableDamping = true;


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


// Resizing
window.addEventListener("resize", _ => {

    size.width = window.innerWidth;
    size.height = window.innerHeight;

    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();

    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio), 2);

});
