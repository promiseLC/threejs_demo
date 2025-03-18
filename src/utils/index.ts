

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

class Renderer {
  public renderer: THREE.WebGLRenderer;
  public scene!: THREE.Scene;
  camera!: THREE.OrthographicCamera | THREE.PerspectiveCamera;
  mesh!: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial[], THREE.Object3DEventMap>;
  width: number;
  height: number;
  orbitControls!: OrbitControls;
  renderDom: HTMLDivElement;
  constructor(renderDom: HTMLDivElement) {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    this.renderDom = renderDom;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.createScene();

    this.createCamera();

  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera(cameraParams?: any) {
    const { scene } = this;

    // 创建观察场景的相机
    const size = 4;
    const camera = cameraParams ?? new THREE.OrthographicCamera(-size, size, size / 2, -size / 2, 0.001, 100); // 正交相机

    // 设置相机位置
    camera.position.set(1, 0.5, 2); // 相机默认的坐标是在(0,0,0);
    // 设置相机方向
    camera.lookAt(scene.position); // 将相机朝向场景
    // 将相机添加到场景中
    scene.add(camera);
    this.camera = camera;
  }


  createLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff);
    const light = new THREE.DirectionalLight(0xffffff, 1);
    this.scene.add(light);
    this.scene.add(ambientLight);
  }

  createGeometry() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    let faces = [];

    for (let i = 0; i < geometry.groups.length; i++) {
      // 重新生成新的材质
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(Math.random() * 0x00ffff),
      });

      faces.push(material);
    }



    const mesh = new THREE.Mesh(geometry, faces);
    this.scene.add(mesh);


    this.mesh = mesh;
  }

  helpers() {
    // 辅助坐标系
    const axesHelper = new THREE.AxesHelper(4);

    this.scene.add(axesHelper);

    // 添加网格平面
    const gridHelper = new THREE.GridHelper(this.width, this.height, 0xcd37aa, 0xffffff);

    this.scene.add(gridHelper);
  }


  render() {
    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({
      antialias: true, // 抗锯齿
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    // 设置渲染器大小
    renderer.setSize(this.width, this.height);
    // 执行渲染
    renderer.render(this.scene, this.camera);
    this.renderer = renderer;
  }
  controls() {
    const orbitControls = new OrbitControls(this.camera, this.renderer.domElement);

    orbitControls.enableDamping = true; // 启用拖拽惯性效果
    this.orbitControls = orbitControls;
  }

  tick() {
    this.orbitControls.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.tick.bind(this));
  }

  // 自适应画布
  fitView() {
    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      // this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);
  }

  clean() {
    this.scene.clear();
    this.renderer.domElement.remove();
  }

  init() {


    this.render();
    this.createLight();
    this.createGeometry();
    this.helpers();
    this.controls();
    this.tick();
    this.fitView();




    this.renderDom.appendChild(this.renderer.domElement);
  }

};


export default Renderer;




export const $: any & {
  init(): void;
  createScene(): void;
  createLights(): void;
  createObjects(): void;
  helpers(): void;
  createCamera(): void;
  render(): void;
  controls(): void;
  tick(): void;
  fitView(): void;
} = {
  init() {
    this.createScene();
    this.createLights();
    this.createObjects();
    this.createCamera();
    this.helpers();

    this.render();
    this.controls();
    this.tick();
    this.fitView();
  },
  createScene() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    // 创建3D场景
    const scene = new THREE.Scene();
    const canvas = document.getElementById('c');

    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.scene = scene;
  },
  createLights() {
    const { scene } = this;
    // 添加全局光照
    const ambientLight = new THREE.AmbientLight(0xffffff);
    // 添加方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);

    scene.add(ambientLight);
    scene.add(directionalLight);
  },
  createObjects() {
    const { scene } = this;
    // 创建立方体
    const geometry = new THREE.BoxGeometry(2, 2, 2);

    // 设置立方体表面颜色
    /* const material = new THREE.MeshLambertMaterial({
      color: '#1890ff',
    }); */
    let faces = [];

    for (let i = 0; i < geometry.groups.length; i++) {
      // 重新生成新的材质
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(Math.random() * 0x00ffff),
      });

      faces.push(material);
    }

    // 生成物体对象
    const mesh = new THREE.Mesh(geometry, faces);

    scene.add(mesh);
    this.mesh = mesh;
  },
  helpers() {
    // 辅助坐标系
    const axesHelper = new THREE.AxesHelper(4);

    const cameraHelper = new THREE.CameraHelper(this.orthographicCamera);

    this.scene.add(axesHelper);
    this.scene.add(cameraHelper);

    // 添加网格平面
    const gridHelper = new THREE.GridHelper(100, 10, 0xcd37aa, 0x4a4a4a);

    this.scene.add(gridHelper);
    this.cameraHelper = cameraHelper;
  },
  createCamera() {
    const { scene } = this;

    // 创建观察场景的相机
    const size = 4;
    const orthographicCamera = new THREE.OrthographicCamera(-size, size, size / 2, -size / 2, 0.1, 2); // 正交相机

    // 设置相机位置
    orthographicCamera.position.set(2, 2, 3); // 相机默认的坐标是在(0,0,0);
    // 设置相机方向
    orthographicCamera.lookAt(scene.position); // 将相机朝向场景
    // 将相机添加到场景中
    scene.add(orthographicCamera);
    this.orthographicCamera = orthographicCamera;

    // 创建第二个相机
    const perspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);

    perspectiveCamera.position.set(2, 2, 6);
    perspectiveCamera.lookAt(scene.position);

    scene.add(perspectiveCamera);

    this.camera = perspectiveCamera;

  },
  render() {
    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true, // 抗锯齿
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    // 设置渲染器大小
    renderer.setSize(this.width, this.height);
    // 执行渲染
    renderer.render(this.scene, this.camera);
    this.renderer = renderer;
  },
  controls() {
    const orbitControls = new OrbitControls(this.camera, this.canvas);
    orbitControls.enableDamping = true; // 启用拖拽惯性效果
    this.orbitControls = orbitControls;
  },
  // 更新画布
  tick() {
    const _this = this;

    _this.cameraHelper.update();

    // update objects
    _this.orbitControls.update();
    // _this.mesh.rotation.y += 0.005;
    // 重新渲染整个场景
    _this.renderer.render(_this.scene, _this.camera);
    // 调用下次更新函数
    window.requestAnimationFrame(() => _this.tick());
  },
  // 自适应画布
  fitView() {
    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera?.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);
  },
}


// 顶点数组分组

export function convertTo3DArray(flatVertices: string | any[]) {
  const vertices = [];
  for (let i = 0; i < flatVertices.length; i += 3) {
    vertices.push([
      flatVertices[i],
      flatVertices[i + 1],
      flatVertices[i + 2]
    ]);
  }
  return vertices;
}



// 生成球面UV
export function generateSphereUVs(vertices: any, child: THREE.Mesh) {
  const uvs = new Float32Array(vertices.length / 3 * 2);
  const center = new THREE.Box3().setFromObject(child).getCenter(new THREE.Vector3());

  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i] - center.x;
    const y = vertices[i + 1] - center.y;
    const z = vertices[i + 2] - center.z;

    // 将顶点坐标转换为球面坐标
    const radius = Math.sqrt(x * x + y * y + z * z);
    const theta = Math.atan2(y, x); // 方位角
    const phi = Math.acos(z / radius); // 极角

    // 将球面坐标映射到 UV 坐标
    const u = (theta + Math.PI) / (2 * Math.PI);
    const v = phi / Math.PI;

    uvs[(i / 3) * 2] = u;
    uvs[(i / 3) * 2 + 1] = v;
  }

  return uvs;
}


export function planeGenerateUVs(vertices: any, child: THREE.Mesh) {
  let min = new THREE.Box3().setFromObject(child).min;
  let max = new THREE.Box3().setFromObject(child).max;
  // 计算 UV 坐标
  const uvs = new Float32Array(vertices.length / 3 * 2);
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const y = vertices[i + 1];

    // 归一化 X 和 Y 坐标
    const u = (x - min.x) / (max.x - min.x);
    const v = (y - min.y) / (max.y - min.y);

    // 将 UV 坐标存储到数组中
    uvs[(i / 3) * 2] = u;
    uvs[(i / 3) * 2 + 1] = v;
  }

  return uvs;
}




export function generateCylinderUVs(vertices: any, child: THREE.Mesh,isReverse:boolean = false) {
  // 获取顶点的最小和最大 Z 坐标


  let minZ = new THREE.Box3().setFromObject(child).min.z;
  let maxZ = new THREE.Box3().setFromObject(child).max.z;

  for (let i = 0; i < vertices.length; i += 3) {
    const z = vertices[i + 2];
    minZ = Math.min(minZ, z);
    maxZ = Math.max(maxZ, z);
  }

  // 计算 UV 坐标
  const uvs = new Float32Array(vertices.length / 3 * 2);

  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const y = vertices[i + 1];
    const z = vertices[i + 2];

    // 计算高度（v）
    const v = (z - minZ) / (maxZ - minZ); // 范围 [0, 1]

    // 计算角度（u）
    const theta = Math.atan2(y, x); // 范围 [-π, π]
    const u = (theta + Math.PI) / (2 * Math.PI); // 范围 [0, 1]

    if(isReverse) {
      uvs[(i / 3) * 2] = 1-u;
      uvs[(i / 3) * 2 + 1] = 1-v;
    }else{
      uvs[(i / 3) * 2] = u;
      uvs[(i / 3) * 2 + 1] = v;
    }
  }

  return uvs;
}