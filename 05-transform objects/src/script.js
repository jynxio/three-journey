import "./style.css";
import * as three from "three";
import { AxesHelper } from "three";

// Scene
const scene = new three.Scene();

// Object
const group = new three.Group();

group.scale.y = 2;
group.rotation.y = 0.2;
scene.add(group);

const cube_1 = new three.Mesh(
    new three.BoxGeometry(1, 1, 1),
    new three.MeshBasicMaterial({ color: 0xff0000 })
);

cube_1.position.x = -1.5;
group.add(cube_1);

const cube_2 = new three.Mesh(
    new three.BoxGeometry(1, 1, 1),
    new three.MeshBasicMaterial({ color: 0xff0000 })
);

cube_2.position.x = 0;
group.add(cube_2);

const cube_3 = new three.Mesh(
    new three.BoxGeometry(1, 1, 1),
    new three.MeshBasicMaterial({ color: 0xff0000 })
);

cube_3.position.x = 1.5;
group.add(cube_3);

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

// Axes Helper
const axes_helper = new three.AxesHelper(2);
scene.add(axes_helper);

// Renderer
const renderer = new three.WebGLRenderer({ canvas });

renderer.setSize(size.width, size.height);
renderer.render(scene, camera);
