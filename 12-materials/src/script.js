import "./style.css";
import * as three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";


// Canvas
const canvas = document.querySelector("canvas.webgl");


// Scene
const scene = new three.Scene();


// Size
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener("resize", () => {

    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


// Camera
const camera = new three.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);

camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);


// Control
const controls = new OrbitControls(camera, canvas);

controls.enableDamping = true;


// Renderer
const renderer = new three.WebGLRenderer({
    canvas: canvas
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


// Texture
const loader_texture = new three.TextureLoader();
const door_color = loader_texture.load("/textures/door/color.jpg");
const door_alpha = loader_texture.load("/textures/door/alpha.jpg");
const door_ambient_occlusion = loader_texture.load("/textures/door/ambientOcclusion.jpg");
const door_height = loader_texture.load("/textures/door/height.jpg");
const door_normal = loader_texture.load("/textures/door/normal.jpg");
const door_metalness = loader_texture.load("/textures/door/metalness.jpg");
const door_roughness = loader_texture.load("/textures/door/roughness.jpg");
const matcap = loader_texture.load("/textures/matcaps/3.png");
const gradient = loader_texture.load("/textures/gradients/5.jpg");

const loader_cube = new three.CubeTextureLoader();
const environment = loader_cube.load([
    "/textures/environmentMaps/my/px.png",
    "/textures/environmentMaps/my/nx.png",
    "/textures/environmentMaps/my/py.png",
    "/textures/environmentMaps/my/ny.png",
    "/textures/environmentMaps/my/pz.png",
    "/textures/environmentMaps/my/nz.png"
]);

// Light
const light_ambient = new three.AmbientLight(0xffffff, 0.5);
const light_point = new three.PointLight(0xffffff, 0.5);

light_point.position.x = 2;
light_point.position.y = 3;
light_point.position.z = 4;
scene.add(light_ambient, light_point);

// Object
const material = new three.MeshStandardMaterial({
    roughness: 0.2,
    // roughnessMap: door_roughness,
    metalness: 0.7,
    envMap: environment,
    // metalnessMap: door_metalness,
    // map: door_color,
    // aoMap: door_ambient_occlusion,
    // aoMapIntensity: 1,
    // displacementMap: door_height,
    // displacementScale: 0.05,
    // normalMap: door_normal,
    // transparent: true,
    // alphaMap: door_alpha,
    // wireframe: true,
});
const sphere = new three.Mesh(new three.SphereGeometry(0.5, 64, 64), material);
const plane = new three.Mesh(new three.PlaneGeometry(1, 1, 100, 100), material);
const torus = new three.Mesh(new three.TorusGeometry(0.3, 0.2, 64, 128), material);

sphere.position.x = -1.5;
sphere.geometry.setAttribute("uv2", new three.BufferAttribute(sphere.geometry.attributes.uv.array, 2));

torus.position.x = 1.5;
torus.geometry.setAttribute("uv2", new three.BufferAttribute(torus.geometry.attributes.uv.array, 2));

plane.geometry.setAttribute("uv2", new three.BufferAttribute(plane.geometry.attributes.uv.array, 2));
scene.add(sphere, plane, torus);


// Debug
const gui = new dat.GUI();

gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);


// Animate
const clock = new three.Clock();

tick();

function tick() {

    requestAnimationFrame(tick);

    const elapsed_time = clock.getElapsedTime();

    sphere.rotation.x = 0.15 * elapsed_time;
    sphere.rotation.y = 0.1 * elapsed_time;

    plane.rotation.x = 0.15 * elapsed_time;
    plane.rotation.y = 0.1 * elapsed_time;

    torus.rotation.x = 0.15 * elapsed_time;
    torus.rotation.y = 0.1 * elapsed_time;

    controls.update();
    renderer.render(scene, camera);

}
