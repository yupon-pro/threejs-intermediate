import * as THREE from "three";

const width = 1024;
const height = 620;

const mouse = new THREE.Vector2();

const canvas = document.querySelector("#canvas");

const renderer = new THREE.WebGLRenderer({ canvas });

renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, width / height);
camera.position.set(0, 0, +1000);

const geometry = new THREE.BoxGeometry(50, 50, 50);

// マウスとの交差を調べたいものは配列に格納する
const meshList = [...new Array(200)].map((_) => {
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = (Math.random() - 0.5) * 800;
  mesh.position.y = (Math.random() - 0.5) * 800;
  mesh.position.z = (Math.random() - 0.5) * 800;
  mesh.rotation.x = Math.random() * 2 * Math.PI;
  mesh.rotation.y = Math.random() * 2 * Math.PI;
  mesh.rotation.z = Math.random() * 2 * Math.PI;
  scene.add(mesh);

  return mesh;
});

// 平行光源
const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// 環境光源
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// レイキャストを作成
const raycaster = new THREE.Raycaster();

canvas.addEventListener("mousemove", (e) => {
  const element = e.currentTarget;
  // canvas要素上のXY座標
  const x = e.clientX - element.offsetLeft;
  const y = e.clientY - element.offsetTop;
  // canvas要素の幅・高さ
  const w = element.offsetWidth;
  const h = element.offsetHeight;

  // -1〜+1の範囲で現在のマウス座標を登録する
  mouse.x = (x / w) * 2 - 1;
  mouse.y = -(y / h) * 2 + 1;

});

tick();


// 毎フレーム時に実行されるループイベントです
function tick() {
  // レイキャスト = マウス位置からまっすぐに伸びる光線ベクトルを生成
  // 二次元上の重なりではなくて三次元上での交差、特にベクトルとの交差で判断！
  raycaster.setFromCamera(mouse, camera);

  // その光線とぶつかったオブジェクトを得る
  const intersects = raycaster.intersectObjects(meshList);

  for (const mesh of meshList) {
    // 交差しているオブジェクトが1つ以上存在しないなら早期終了
    if (intersects.length === 0) break;

    // 交差しているオブジェクトの1番目(最前面)のものだったら
    if (mesh === intersects[0].object) {
      // 色を赤くする
      mesh.material.color.setHex(0xff0000);
    } else {
      // それ以外は元の色にする
      mesh.material.color.setHex(0xffffff);
    }
  }

  // レンダリング
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}