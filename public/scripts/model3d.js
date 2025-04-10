import * as THREE from './three.js';
import { GLTFLoader } from '/three/examples/jsm/loaders/GLTFLoader';

function initScene(src) {
  const container = document.getElementById('model-container');
  if (!container) {
    console.error('Container element not found');
    return;
  }

  const width = container.clientWidth;
  const height = container.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const loader = new GLTFLoader();
  loader.load(
    src,
    (gltf) => {
      scene.add(gltf.scene);
    },
    undefined,
    (error) => {
      console.error('An error occurred loading the model:', error);
    }
  );

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
}

const observer = new MutationObserver((mutations, obs) => {
  const container = document.getElementById('model-container');
  if (container) {
    const script = document.currentScript || document.querySelector('script[data-src]');
    const src = script.getAttribute('data-src');
    initScene(src);
    obs.disconnect();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});