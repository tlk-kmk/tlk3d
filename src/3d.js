import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import * as dat from 'dat.gui';


/**
 * CANVAS & SCENE
 */
const canvas = document.querySelector('canvas.webgl')
const container = canvas.parentElement
const scene = new THREE.Scene()

let logoMesh = null

/**
 * CAMERA
 */
const sizes = {
  width: container.clientWidth,
  height: container.clientHeight,
}

const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 500)
camera.position.set(0, 1, -17.5)
camera.lookAt(0, 1, 0)
scene.add(camera)

/**
 * RENDERER
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.physicallyCorrectLights = true
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

console.log('Canvas size:', canvas.width, canvas.height)
console.log('Renderer size:', renderer.domElement.width, renderer.domElement.height)

/**
 * ENVIRONMENT MAP (HDR with PMREM)
 */

const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

const exrLoader = new EXRLoader();
exrLoader.load('assets/3d/sky.exr', (exrTexture) => {
  const envMap = pmremGenerator.fromEquirectangular(exrTexture).texture;

  exrTexture.dispose();
  pmremGenerator.dispose();

  // ✅ ONLY use as visual background
  scene.background = envMap;

  console.log('EXR loaded as visual-only background');
});


/**
 * LIGHTS
 */


const lightColor = new THREE.Color(1, 0.5, 0.2); // R, G, B
const directionalLight = new THREE.DirectionalLight(lightColor, 0.5);
directionalLight.position.set(0, 1.7, -14.8);
directionalLight.castShadow = true;

// Optional shadow config for quality
directionalLight.shadow.radius = 2;
directionalLight.lookAt(0, 1.5, -16.5)

// Set up shadow camera bounds
directionalLight.shadow.camera.left = -20;
directionalLight.shadow.camera.right = 20;
directionalLight.shadow.camera.top = 20;
directionalLight.shadow.camera.bottom = -20;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 50;

// Improve shadow quality
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;

scene.add(directionalLight);


const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Create a target object for the directional light
const lightTarget = new THREE.Object3D();
lightTarget.position.set(0, 1.5, -16.5);
scene.add(lightTarget);

directionalLight.target = lightTarget;


// Point Light over Tree
const pointLightTree = new THREE.PointLight(0xffcf83, 3, 100, 2.2); // color, intensity, distance, decay
pointLightTree.position.set(-7.9, 2.1, 9.3);
pointLightTree.castShadow = true;
scene.add(pointLightTree);



// Point Light over Logo in Front
const pointLightLogo = new THREE.PointLight(0xffcf83, 1.3, 100, 3.8); // color, intensity, distance, decay
pointLightLogo.position.set(0, 1.3, -14.2);
pointLightLogo.castShadow = true;
scene.add(pointLightLogo);



/**
 * GUI (Point Light atm)
 */



/**
 * GROUND
 */
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({ color: '#444' })
)
ground.rotation.x = -Math.PI / 2
ground.position.y = 0
ground.receiveShadow = true
scene.add(ground)

/**
 * MATERIALS
 */
const sandMaterial = new THREE.MeshStandardMaterial({ 
  color: '#e2c290',
  envMapIntensity: 1,
  envMap: null,
  needsUpdate: true,
  metalness: 0.5
})

const treeMaterial = new THREE.MeshStandardMaterial({ color: '#5a3f28' })

const whiteBasic = new THREE.MeshBasicMaterial({ color: '#ffffff' })

const rockMaterial = new THREE.MeshStandardMaterial({ 
  color: '#483E37', 
  side: THREE.DoubleSide,
  envMapIntensity: 1,
  envMap: null,
  needsUpdate: true
})

const glassMaterial = new THREE.MeshStandardMaterial({
   color: '#ffffff',
   metalness: 0,
   roughness: 1,
   envMapIntensity: 2,
    envMap: null,
    needsUpdate: true
  })
glassMaterial.needsUpdate = true;

const pondMaterial = new THREE.MeshPhysicalMaterial({
  transmission: 1,
  roughness: 0.1,
  thickness: 0.4,
  metalness: 0,
  clearcoat: 0.7,
  transparent: true,
  opacity: 1,
  envMapIntensity: 1,
  envMap: null,
  needsUpdate: true
})

/**
 * LOADERS
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

const textureLoader = new THREE.TextureLoader()

/**
 * RESIZE HANDLER
 */
window.addEventListener('resize', () => {
  sizes.width = container.clientWidth
  sizes.height = container.clientHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * ANIMATION LOOP
 */
const clock = new THREE.Clock()

function animate() {
  const delta = clock.getDelta()

  if (logoMesh) {
    const fullRotation = Math.PI * 2
    const rotationSpeed = fullRotation / 8
    logoMesh.rotation.z += rotationSpeed * delta
  }

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

loadModel()
animate()

/**
 * LOAD GLTF MODEL
 */
function loadModel() {
  gltfLoader.load(
    'assets/3d/desert-2.glb',
    (gltf) => {
      const model = gltf.scene;
      model.traverse((child) => {
        if (!child.isMesh) return

        const name = child.name.toLowerCase()

        if (name === 'desert') {
          child.material = sandMaterial
          child.receiveShadow = true
          child.castShadow = false
        } else if (name === 'tlklogo') {
          child.material = whiteBasic
          child.castShadow = false
          child.receiveShadow = false
        } else if (name === 'tree') {
          child.material = treeMaterial
        } else if (name.match(/^rock\d{2}$/) || name === 'oldlogo') {
          child.material = rockMaterial
        } else if (name === 'pond') {
          child.material = pondMaterial
        } else if (name === 'logo') {
          child.material = glassMaterial
          logoMesh = child

          // Scale up the logo
          logoMesh.scale.set(1.1, 1.1, 1.1)
        }

        if (name !== 'tlklogo') {
          child.castShadow = true
          child.receiveShadow = true
        }

        if (!child.geometry.attributes.normal) {
            child.geometry.computeVertexNormals();
        }
      })

      scene.add(model)
    },
    undefined,
    (error) => {
      console.error('Error loading GLB:', error)
    }
  )
}
