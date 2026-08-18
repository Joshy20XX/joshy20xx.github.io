/*========================================
Star Orbit Demo
Author: Josh Ottey
Date: 5/29/26 08:22:00 AM EST
Update: 8/18/26 12:55:21 PM EST
========================================*/

//Import the libraries
import * as THREE from 'three'

//Setup the camera
var FOV = 90, near = 0.1, far = 1500;

//Setup star position load
const INIT_NUM_OF_STAR_CLUSTERS = 300;
const NUM_INSTANCED_STARS = 15;
const MIN_X_SPREAD = -30, MAX_X_SPREAD = 30;
const MIN_Y_SPREAD = 5, MAX_Y_SPREAD = -7;
const MIN_Z_SPREAD = 8, MAX_Z_SPREAD = -30;

const velocity = 75.5; //Star Z-velocity

//Create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, near, far);
const timer = new THREE.Timer();
timer.connect(document);

//Create the renderer
const container = document.getElementById('threejs-backdrop');
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

//Set scene fog color
scene.background = new THREE.Color().setColorName("black");
scene.fog = new THREE.Fog("rgb(0,0,0)", 1, 25);

//Define triangle's matrix
const tri_verts = new Float32Array([
    -0.2, 0.0, 0.0, //left
    0.2, 0.0, 0.0, //right
    0.0, 0.4, 0.0, //top
]);

//Define triangle's UVs
const tri_uvs = new Float16Array([
    0,-0.33,
    1,0.2,
    0,0.85,
]);

const star_obj = new THREE.BufferGeometry();

//This must be define for the GPU to access and draw
star_obj.setAttribute('position', new THREE.BufferAttribute(tri_verts, 3));
star_obj.setAttribute('uv', new THREE.BufferAttribute(tri_uvs, 2));

const box_texture = loadColorTexture('resources/images/star.png');
const box_texture_alpha = loadColorTexture('resources/images/star_blended.png');
box_texture_alpha.offset = new THREE.Vector2(0.3,0.0);

const material = new THREE.MeshBasicMaterial( {
    map : box_texture,
    alphaMap : box_texture_alpha,
    transparent: true,
    wireframe: false,
    side : THREE.FrontSide,
    color : 0xfffff8,
} );

//We want multiple star to appear so add/delete them in an array
//We also want to spawn them in a circular fashion
const stars = [];
spawnStarInit(star_obj, material);
camera.position.z = 3.0;
//Precompile materials before drawing (TESTING)
renderer.compile(scene, camera, scene);

//After precompile, then we can draw the scene
renderer.setAnimationLoop(animate);
container.append(renderer.domElement);


//Refresh the window
function animate(time) {
    //Move each star in the list
    //NEW Method: random object lookup
    let star_count = stars.length
    let i = Math.trunc(RandomRange(0, star_count));

    //Discard the star if it's too far away
    if (stars[i].position.z > camera.position.z + 7) {
        stars[i].geometry.dispose();
        stars[i].material.dispose();
        scene.remove(stars[i]);

        //Also change the array
        if (i !== -1) {
            stars.splice(i,1);
        }


        //Then incrementally add stars after frame 1
        spawnStarLater(star_obj, material);

    }
    stars.forEach((star) => {
        star.position.z += velocity / 1000;
    });
    renderer.render(scene, camera);
}

//Texture loader
function loadColorTexture(path) {
    //Create a texture loader
    const loader = new THREE.TextureLoader();
    const texture = loader.load(path);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

//Star spawner
function spawnStarInit(geo, mat) {
    //Get our objects in a list
    for (var i = 0; i < INIT_NUM_OF_STAR_CLUSTERS; i++) {
        const tri = new THREE.InstancedMesh(geo, mat, NUM_INSTANCED_STARS);
        tri.name = "star" + i;
        stars.push(tri);
    }

    //For each object in star object list, randomise their positions
    //then spawn them in the scene
    for (var j = 0; j < stars.length; j++) {
        stars[j].position.x = RandomRange(MIN_X_SPREAD, MAX_X_SPREAD);
        stars[j].position.y = RandomRange(MIN_Y_SPREAD, MAX_Y_SPREAD);
        stars[j].position.z = RandomRange(MIN_Z_SPREAD, MAX_Z_SPREAD);

        scene.add(stars[j]);
    }
}

//Star spawner for after frame 1
function spawnStarLater(geo, mat) {
    const star = new THREE.InstancedMesh(geo, mat, NUM_INSTANCED_STARS);
    stars.push(star);

    //Randomize the positions and spawn them in
    star.position.x = RandomRange(MIN_X_SPREAD, MAX_X_SPREAD);
    star.position.y = RandomRange(MIN_Y_SPREAD, MAX_Y_SPREAD);
    star.position.z = -19.0;
    scene.add(star);
}

//Random range
function RandomRange(min, max) {
  return Math.random() * (max - min) + min;
}
