import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { SimplexNoise } from "three/addons/math/SimplexNoise.js";
// サイズを指定
const width = 1024;
const height = 620;

// レンダラーを作成
const canvasElement = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({
  canvas: canvasElement,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);

// シーンを作成
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 400, 1000);

// カメラを作成
const camera = new THREE.PerspectiveCamera(45, width / height);
camera.position.set(400, 400, 0);
// カメラコントローラーを作成
const controls = new OrbitControls(camera, canvasElement);
controls.autoRotate = true;
controls.maxDistance = 1000; // ズーム最大距離
controls.maxPolarAngle = (Math.PI * 0.8) / 2; // 上限の角度
controls.minPolarAngle = 0;

// 平行光源を作成
const light1 = new THREE.DirectionalLight(0x3399ff, 1);
light1.position.set(1, 1, 1);
scene.add(light1);

// 形状データを作成
const geometry = new THREE.PlaneGeometry(1000, 1000, 80, 80);

// マテリアルを作成
const material = new THREE.MeshLambertMaterial({
  flatShading: true,
  side: THREE.DoubleSide,
});

// 物体を作成
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = Math.PI / 2; // 地面らしい角度にする
scene.add(mesh);

// ノイズを初期化
// インスタンスは使いますことが重要
const simplexNoise = new SimplexNoise();

tick();
// 毎フレーム時に実行されるループイベントです
function tick() {
  // ジオメトリの頂点座標情報
  const position = mesh.geometry.attributes.position;
  // console.log(position.count); 
  // この場合は6561。6561もの頂点を次々と位置を変更させることによって実現。

  for (let i = 0; i < position.count; i++) {
    // 各頂点のXYZ座標
    const x = position.getX(i);
    const y = position.getY(i);

    const time = Date.now() * 0.0001;

    // 高さを計算（PlaneGeometryの場合はZ座標）
    const nextZ = simplexNoise.noise(x * 0.002 + time, y * 0.001 + time) * 150;
    // -1から1の間で値が返され、それを150倍にスケーリング

    position.setZ(i, nextZ);
  }

  // 頂点の更新が必要なことを伝える
  position.needsUpdate = true;

  // カメラの位置調整
  controls.update();
  // レンダリング
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
}