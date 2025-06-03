let camera, scene, renderer, controls;
let layers = [];
let clickedCount = 0;

const CLEAN_SCENE = 'clean.jpg';
const MASK_LAYER = 'dirtyX.png';
const TRASH_LAYERS = ['dirty1.png'];
const statusBox = document.getElementById('message');

const log = (msg) => statusBox.innerText += "\n" + msg;

init();
animate();

function init() {
  const container = document.body;
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
  camera.position.z = 0.01;
  scene = new THREE.Scene();

  const geometry = new THREE.SphereGeometry(500, 60, 40);
  geometry.scale(-1, 1, 1);

  const loader = new THREE.TextureLoader();

  // Base clean layer
  log('🟡 Загружается: ' + CLEAN_SCENE);
  loader.load(CLEAN_SCENE, (texture) => {
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry.clone(), material);
    scene.add(mesh);
    log('✅ Загружено: ' + CLEAN_SCENE);
  }, undefined, () => log('❌ Ошибка: ' + CLEAN_SCENE));

  // Mask layer
  log('🟡 Загружается: ' + MASK_LAYER);
  loader.load(MASK_LAYER, (texture) => {
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthTest: false
    });
    const mesh = new THREE.Mesh(geometry.clone(), material);
    mesh.renderOrder = 2;
    scene.add(mesh);
    log('✅ Загружено: ' + MASK_LAYER);
  }, undefined, () => log('❌ Ошибка: ' + MASK_LAYER));

  // Trash layers
  TRASH_LAYERS.forEach((file) => {
    log('🟡 Загружается: ' + file);
    loader.load(file, (texture) => {
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthTest: false
      });
      const mesh = new THREE.Mesh(geometry.clone(), material);
      mesh.renderOrder = 1;
      scene.add(mesh);
      layers.push(mesh);
      log('✅ Загружено: ' + file);
    }, undefined, () => log('❌ Ошибка: ' + file));
  });

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;

  window.addEventListener('click', handleClick);
  window.addEventListener('resize', onWindowResize);
}

function handleClick() {
  for (let i = 0; i < layers.length; i++) {
    if (layers[i].visible) {
      layers[i].visible = false;
      clickedCount++;
      if (clickedCount === layers.length) {
        log('🎉 Well done!');
      }
      break;
    }
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
