import "./style.css";
import * as three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import * as dat from "lil-gui";


// Debug
const gui = new dat.GUI();


// Canvas
const canvas = document.querySelector("canvas.webgl");


// Scene
const scene = new three.Scene();


// Texture
const texture_loader = new three.TextureLoader();
const matcap_texture = texture_loader.load("/textures/matcaps/3.png");

// Font
const font_loader = new FontLoader();

font_loader.load("/fonts/helvetiker_regular.typeface.json", font => {

    const text_geometry = new TextGeometry(
        "Hello Three.js",
        {
            font,
            size: 0.5,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5,
        }
    );
    const material = new three.MeshMatcapMaterial({ matcap: matcap_texture });
    const text = new three.Mesh(text_geometry, material);

    scene.add(text);
    text_geometry.computeBoundingBox();
    text_geometry.translate(
        -(text_geometry.boundingBox.max.x - 0.02) * 0.5,
        -(text_geometry.boundingBox.max.y - 0.02) * 0.5,
        -(text_geometry.boundingBox.max.z - 0.03) * 0.5
    );

    const donut_geometry = new three.TorusGeometry(0.3, 0.2, 20, 45);

    for (let i = 0; i < 100; i++) {

        const donut = new three.Mesh(donut_geometry, material);

        donut.position.x = (Math.random() - 0.5) * 10;
        donut.position.y = (Math.random() - 0.5) * 10;
        donut.position.z = (Math.random() - 0.5) * 10;

        donut.rotation.x = Math.random() * Math.PI;
        donut.rotation.y = Math.random() * Math.PI;

        const scale = Math.random();
        donut.scale.set(scale, scale, scale);

        scene.add(donut);

    }

});


// Object
// const cube = new three.Mesh(
//     new three.BoxGeometry(1, 1, 1),
//     new three.MeshBasicMaterial()
// );

// scene.add(cube);


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
    canvas: canvas,
    antialias: true,
});

renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));



// Animate
const clock = new three.Clock();

tick();

function tick() {

    requestAnimationFrame(tick);

    const elapsedTime = clock.getElapsedTime();

    controls.update();
    renderer.render(scene, camera);

}
