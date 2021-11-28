import "./style.css";
import * as three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";
import * as dat from "lil-gui";


// Debug
const gui = new dat.GUI();


// Canvas
const canvas = document.querySelector("canvas.webgl");


// Scene
const scene = new three.Scene();


// Lights
const ambient_light = new three.AmbientLight(0xffffff, 0.5);
scene.add(ambient_light);
gui.add(ambient_light, "intensity").min(0).max(1).step(0.001);

const directional_light = new three.DirectionalLight(0x00fffc, 0.3);
directional_light.position.set(1, 0.25, 0);
scene.add(directional_light);

const hemisphere_light = new three.HemisphereLight(0xff0000, 0x0000ff, 2);
scene.add(hemisphere_light);

const point_light = new three.PointLight(0xff9000, 0.5, 10, 2);
scene.add(point_light);

const rect_area_light = new three.RectAreaLight(0x00ff00, 2, 1, 1);
rect_area_light.position.set(-1.5, 0, 1.5);
rect_area_light.lookAt(new three.Vector3());
scene.add(rect_area_light);

const spot_light = new three.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1);
spot_light.position.set(0, 2, 3);
scene.add(spot_light);

const hemisphere_light_helper = new three.HemisphereLightHelper(hemisphere_light, 0.2);
scene.add(hemisphere_light_helper);

const directional_light_helper = new three.DirectionalLightHelper(directional_light, 0.2);
scene.add(directional_light_helper);

const point_light_helper = new three.PointLightHelper(point_light, 0.2);
scene.add(point_light_helper);

const spot_light_helper = new three.SpotLightHelper(spot_light);
scene.add(spot_light_helper);

const rect_area_light_helper = new RectAreaLightHelper(rect_area_light);
scene.add(rect_area_light_helper);

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
