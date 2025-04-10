import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const Model3D = () => {
  const containerRef = useRef(null);
  useEffect(() => {
    let container = containerRef.current;
    let scene, camera, renderer, directionalLight;
    var clock = new THREE.Clock();
    let model = null;

    function init() {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        50,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );

      camera.position.set(0, 0, 8); 
      
      renderer = new THREE.WebGLRenderer({ antialias: true , alpha: true});
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(1.3);
      container.appendChild(renderer.domElement);

      const loader = new GLTFLoader();
      
      loader.load(
        'model/logo.gltf', 
        (gltf) => {
          model = gltf.scene;
          const quaternion = new THREE.Quaternion();
          quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI / 2 * .4 ); 
          model.applyQuaternion(quaternion)
          scene.add(model);
          fitCameraToCenteredObject(camera,model,.7);
          const light = new THREE.DirectionalLight( 0xffffff, 0.3 );
          scene.add(light);
          light.position.set(0,0,3)
          directionalLight = new THREE.DirectionalLight( 0xffffff, 8 );
          directionalLight.position.set(3,2,-3);
          scene.add( directionalLight );
          animate();
        },
        undefined,
        (error) => {
          console.error('An error happened while loading the model', error);
        }
      );
    }

    // Variables pour stocker les positions de la souris ou du toucher
const mouse = { x: 0, y: 0 };
let isTouching = false; // Indique si un toucher est actif

// Écouteurs pour les événements de souris
window.addEventListener('mousemove', (event) => {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1; // Normalisé entre -1 et 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1; // Normalisé entre -1 et 1
});

// Écouteurs pour les événements tactiles
window.addEventListener('touchstart', (event) => {
  isTouching = true;
  const touch = event.touches[0];
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
});

window.addEventListener('touchmove', (event) => {
  if (isTouching) {
    const touch = event.touches[0];
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
  }
});

window.addEventListener('touchend', () => {
  isTouching = false;
});

// Fonction animate mise à jour
function animate() {
  const quaternion = new THREE.Quaternion();

  quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2 * clock.getDelta() * 0.2);

  const targetQuaternion = new THREE.Quaternion();
  const tiltX = -mouse.y * 0.1; // Inclinaison en X basée sur la position verticale
  const tiltY = mouse.x * 0.1;  // Inclinaison en Y basée sur la position horizontale

  targetQuaternion.setFromEuler(new THREE.Euler(Math.atan(tiltX) / 8, Math.atan(tiltY) / 8, 0, 'XYZ'));

  model.applyQuaternion(quaternion.multiply(targetQuaternion));

  const elapsed = clock.getElapsedTime();
  directionalLight.position.set(
    Math.sin(elapsed) * 3 + Math.cos(elapsed) * 1.5,
    2 + Math.sin(elapsed) + Math.cos(elapsed) * 3,
    -3
  );

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

    window.addEventListener( 'resize', onWindowResize, false );
    function onWindowResize() {

      camera.aspect = window.innerWidth / (window.innerHeight*size_factor);
      camera.updateProjectionMatrix();
      fitCameraToCenteredObject(camera,model,.7);

      renderer.setSize( window.innerWidth, window.innerHeight*size_factor);

    }


    const fitCameraToCenteredObject = function (camera, object, offset) {
      const boundingBox = new THREE.Box3();
      boundingBox.setFromObject( object );
  
      var middle = new THREE.Vector3();
      var size = new THREE.Vector3();
      boundingBox.getSize(size);
      const fov = camera.fov * ( Math.PI / 180 );
      const fovh = 2*Math.atan(Math.tan(fov/2) * camera.aspect);
      let dx = size.z / 2 + Math.abs( size.x / 2 / Math.tan( fovh / 2 ) );
      let dy = size.z / 2 + Math.abs( size.y / 2 / Math.tan( fov / 2 ) );
      let cameraZ = Math.max(dx, dy);
        if( offset !== undefined && offset !== 0 ) cameraZ *= offset;
      camera.position.set( 0, 0, cameraZ*1.5 );
  
      const minZ = boundingBox.min.z;
      const cameraToFarEdge = ( minZ < 0 ) ? -minZ + cameraZ : cameraZ - minZ;
  
      camera.far = cameraToFarEdge * 3;
      camera.updateProjectionMatrix();
  
  };


    init();
    return () => {
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };

    


  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '500px' }} />;
};

export default Model3D;
