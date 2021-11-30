import "./style.css";
import * as three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";


/**
 * Debug
 */
const gui = new dat.GUI();


/**
 * Canvas
 */
const canvas = document.querySelector("canvas.webgl");


/**
 * Scene
 */
const scene = new three.Scene();


/**
 * Texture
 */
const texture_loader = new three.TextureLoader();

const door_color_texture = texture_loader.load("/textures/door/color.jpg");
const door_alpha_texture = texture_loader.load("/textures/door/alpha.jpg");
const door_ambient_occlusion_texture = texture_loader.load("/textures/door/ambientOcclusion.jpg");
const door_height_texture = texture_loader.load("/textures/door/height.jpg");
const door_normal_texture = texture_loader.load("/textures/door/normal.jpg");
const door_metalness_texture = texture_loader.load("/textures/door/metalness.jpg");
const door_roughness_texture = texture_loader.load("/textures/door/roughness.jpg");

const bricks_color_texture = texture_loader.load("/textures/bricks/color.jpg");
const bricks_ambient_occlusion_texture = texture_loader.load("/textures/bricks/ambientOcclusion.jpg");
const bricks_normal_texture = texture_loader.load("/textures/bricks/normal.jpg");
const bricks_roughness_texture = texture_loader.load("/textures/bricks/roughness.jpg");

const grass_color_texture = texture_loader.load("/textures/grass/color.jpg");
const grass_ambient_occlusion_texture = texture_loader.load("/textures/grass/ambientOcclusion.jpg");
const grass_normal_texture = texture_loader.load("/textures/grass/normal.jpg");
const grass_roughness_texture = texture_loader.load("/textures/grass/roughness.jpg");

grass_color_texture.repeat.set(8, 8);
grass_ambient_occlusion_texture.repeat.set(8, 8);
grass_normal_texture.repeat.set(8, 8);
grass_roughness_texture.repeat.set(8, 8);

grass_color_texture.wrapS = three.RepeatWrapping;
grass_color_texture.wrapT = three.RepeatWrapping;

grass_ambient_occlusion_texture.wrapS = three.RepeatWrapping;
grass_ambient_occlusion_texture.wrapT = three.RepeatWrapping;

grass_normal_texture.wrapS = three.RepeatWrapping;
grass_normal_texture.wrapT = three.RepeatWrapping;

grass_roughness_texture.wrapS = three.RepeatWrapping;
grass_roughness_texture.wrapT = three.RepeatWrapping;


/**
 * Object
 */
// Floor
const floor = new three.Mesh(
    new three.PlaneGeometry(20, 20),
    new three.MeshStandardMaterial({
        map: grass_color_texture,
        aoMap: grass_ambient_occlusion_texture,
        normalMap: grass_normal_texture,
        roughnessMap: grass_roughness_texture,
    })
);
floor.geometry.setAttribute("uv2", new three.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2));
floor.rotation.x = - Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

// House container
const house = new three.Group();
scene.add(house);

// Wall
const wall = new three.Mesh(
    new three.BoxGeometry(4, 2.5, 4),
    new three.MeshStandardMaterial({
        map: bricks_color_texture,
        aoMap: bricks_ambient_occlusion_texture,
        normalMap: bricks_normal_texture,
        roughnessMap: bricks_roughness_texture,
    })
);
wall.geometry.setAttribute("uv2", new three.Float32BufferAttribute(wall.geometry.attributes.uv.array, 2));
wall.position.y = 1.25;
house.add(wall);

// Roof
const roof = new three.Mesh(
    new three.ConeGeometry(3.5, 1, 4),
    new three.MeshStandardMaterial({ color: 0xb35f45 })
);
roof.rotation.y = Math.PI * 0.25;
roof.position.y = 2.5 + 0.5;
house.add(roof);

// Door
const door = new three.Mesh(
    new three.PlaneGeometry(2.2, 2.2, 100, 100),
    new three.MeshStandardMaterial({
        map: door_color_texture,
        transparent: true,
        alphaMap: door_alpha_texture,
        aoMap: door_ambient_occlusion_texture,
        displacementMap: door_height_texture,
        displacementScale: 0.1,
        normalMap: door_normal_texture,
        metalnessMap: door_metalness_texture,
        roughnessMap: door_roughness_texture,
    }),
);
door.geometry.setAttribute("uv2", new three.Float32BufferAttribute(door.geometry.attributes.uv.array, 2));
door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);

// Bushes
const bush_geometry = new three.SphereGeometry(1, 16, 16);
const bush_material = new three.MeshStandardMaterial({ color: 0x89c854 });

const bush_1 = new three.Mesh(bush_geometry, bush_material);
bush_1.scale.set(0.5, 0.5, 0.5);
bush_1.position.set(0.8, 0.2, 2.2);

const bush_2 = new three.Mesh(bush_geometry, bush_material);
bush_2.scale.set(0.25, 0.25, 0.25);
bush_2.position.set(1.4, 0.1, 2.1);

const bush_3 = new three.Mesh(bush_geometry, bush_material);
bush_3.scale.set(0.4, 0.4, 0.4);
bush_3.position.set(-0.8, 0.1, 2.2);

const bush_4 = new three.Mesh(bush_geometry, bush_material);
bush_4.scale.set(0.15, 0.15, 0.15);
bush_4.position.set(-1, 0.05, 2.6);

house.add(bush_1, bush_2, bush_3, bush_4);

// Graves
const graves = new three.Group();
scene.add(graves);

const grave_geometry = new three.BoxGeometry(0.6, 0.8, 0.2);
const grave_material = new three.MeshStandardMaterial({ color: 0xb2b6b1 });

for (let i = 0; i < 50; i++) {

    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 6;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    const grave = new three.Mesh(grave_geometry, grave_material);

    grave.position.set(x, 0.3, z);
    grave.rotation.z = (Math.random() - 0.5) * 0.4;
    grave.rotation.y = (Math.random() - 0.5) * 0.4;
    grave.castShadow = true;

    graves.add(grave);

}

// Door light
const door_light = new three.PointLight(0xff7d46, 1, 7);
door_light.position.set(0, 2.2, 2.7);
house.add(door_light);


/**
 * Fog
 */
const fog = new three.Fog(0x262837, 1, 15);
scene.fog = fog;
// scene.background = new three.Color(0x262837);


/**
 * Light
 */
// Ambient light
const ambient_light = new three.AmbientLight(0xb9d5ff, 0.12);
gui.add(ambient_light, "intensity").min(0).max(1).step(0.001);
scene.add(ambient_light);

// Directional light
const moon_light = new three.DirectionalLight(0xb9d5ff, 0.12);
moon_light.position.set(4, 5, - 2);
gui.add(moon_light, "intensity").min(0).max(1).step(0.001);
gui.add(moon_light.position, "x").min(- 5).max(5).step(0.001);
gui.add(moon_light.position, "y").min(- 5).max(5).step(0.001);
gui.add(moon_light.position, "z").min(- 5).max(5).step(0.001);
scene.add(moon_light);


/**
 * Ghosts
 */
const ghost_1 = new three.PointLight(0xff00ff, 2, 3);
scene.add(ghost_1);

const ghost_2 = new three.PointLight(0x00ffff, 2, 3);
scene.add(ghost_2);

const ghost_3 = new three.PointLight(0xffff00, 2, 3);
scene.add(ghost_3);

moon_light.castShadow = true;
door_light.castShadow = true;
ghost_1.castShadow = true;
ghost_2.castShadow = true;
ghost_3.castShadow = true;

wall.castShadow = true;
bush_1.castShadow = true;
bush_2.castShadow = true;
bush_3.castShadow = true;
bush_4.castShadow = true;

floor.receiveShadow = true;

moon_light.shadow.mapSize.width = 256;
moon_light.shadow.mapSize.height = 256;
moon_light.shadow.camera.far = 15;

door_light.shadow.mapSize.width = 256;
door_light.shadow.mapSize.height = 256;
door_light.shadow.camera.far = 7;

ghost_1.shadow.mapSize.width = 256;
ghost_1.shadow.mapSize.height = 256;
ghost_1.shadow.camera.far = 7;

ghost_2.shadow.mapSize.width = 256;
ghost_2.shadow.mapSize.height = 256;
ghost_2.shadow.camera.far = 7;

ghost_3.shadow.mapSize.width = 256;
ghost_3.shadow.mapSize.height = 256;
ghost_3.shadow.camera.far = 7;

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

});


/**
 * Camera
 */
// Base camera
const camera = new three.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
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
renderer.setClearColor(0x262837);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = three.PCFSoftShadowMap;


/**
 * Animate
 */
const clock = new three.Clock();

tick();

function tick() {

    window.requestAnimationFrame(tick);

    const elapsed_time = clock.getElapsedTime();

    // Ghost animate
    const ghost_1_angle = elapsed_time * 0.5;
    ghost_1.position.x = Math.cos(ghost_1_angle) * 4;
    ghost_1.position.z = Math.sin(ghost_1_angle) * 4;
    ghost_1.position.y = Math.sin(elapsed_time * 3);

    const ghost_2_angle = -elapsed_time * 0.32;
    ghost_2.position.x = Math.cos(ghost_2_angle) * 5;
    ghost_2.position.z = Math.sin(ghost_2_angle) * 5;
    ghost_2.position.y = Math.sin(elapsed_time * 4) + Math.sin(elapsed_time * 2.5);

    const ghost_3_angle = -elapsed_time * 0.18;
    ghost_3.position.x = Math.cos(ghost_3_angle) * (7 + Math.sin(elapsed_time * 0.32));
    ghost_3.position.z = Math.sin(ghost_3_angle) * (7 + Math.sin(elapsed_time * 0.5));
    ghost_3.position.y = Math.sin(elapsed_time * 4) + Math.sin(elapsed_time * 2.5);

    //

    controls.update();
    renderer.render(scene, camera);

}
