

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

// TODO: 计算模型移动后的uv等问题,要先改变顶点信息,使用四元数或者矩阵还解决这个问题


// 使用四元数计算
/* 
 const positions = geometry.attributes.position.array;
 const worldPositions = [];
 for (let i = 0; i < positions.length; i += 3) {
   const vertex = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
   vertex.applyQuaternion(quaternion); // 应用四元数旋转
   worldPositions.push(vertex.x, vertex.y, vertex.z);
 } 
   */

// 生成球面UV
export function generateSphereUVs(vertices: any, child: THREE.Mesh) {
  const uvs = new Float32Array((vertices.length / 3) * 2);

  // 计算中心点
  const center = new THREE.Vector3();
  const count = vertices.length / 3;

  for (let i = 0; i < vertices.length; i += 3) {
    center.x += vertices[i];
    center.y += vertices[i + 1];
    center.z += vertices[i + 2];
  }
  center.divideScalar(count);

  // 计算 UV
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i] - center.x;
    const y = vertices[i + 1] - center.y;
    const z = vertices[i + 2] - center.z;

    const radius = Math.sqrt(x * x + y * y + z * z);

    if (radius < 1e-6) {
      uvs[(i / 3) * 2] = 0.5; // 默认值
      uvs[(i / 3) * 2 + 1] = 0.5; // 默认值
      continue;
    }

    const nx = x / radius; // 归一化 x
    const ny = y / radius; // 归一化 y
    const nz = z / radius; // 归一化 z

    const theta = Math.atan2(ny, nx); // 方位角
    const phi = Math.acos(nz); // 极角

    const u = (theta + Math.PI) / (2 * Math.PI); // 映射到 [0, 1]
    const v = phi / Math.PI; // 映射到 [0, 1]

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




export function generateCylinderUVsWithCaps(vertices: any, child: THREE.Mesh, isReverse: boolean = false) {
  // 获取顶点的最小和最大 Z 坐标


  let minZ = new THREE.Box3().setFromObject(child).min.z;
  let maxZ = new THREE.Box3().setFromObject(child).max.z;

  const center = new THREE.Box3().setFromObject(child).getCenter(new THREE.Vector3());


  // 计算 UV 坐标
  const uvs = new Float32Array(vertices.length / 3 * 2);

  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i] - center.x;
    const y = vertices[i + 1] - center.y;
    const z = vertices[i + 2] - center.z;

    // 计算高度（v）
    const v = (z - minZ) / (maxZ - minZ); // 范围 [0, 1]

    // 计算角度（u）
    const theta = Math.atan2(y, x); // 范围 [-π, π]

    const u = (theta + Math.PI) / (2 * Math.PI); // 范围 [0, 1]

    if (isReverse) {
      uvs[(i / 3) * 2] = 1 - u;
      uvs[(i / 3) * 2 + 1] = 1 - v;
    } else {
      uvs[(i / 3) * 2] = u;
      uvs[(i / 3) * 2 + 1] = v;
    }
  }

  return uvs;
}

// 新的uv计算
export function generateCylinderUVs(vertices: Float32Array, child: THREE.Mesh, isReverse: boolean = false): Float32Array {


  child.updateWorldMatrix(true, false);
  const worldMatrix = child.matrixWorld;


  // 获取圆柱体的包围盒
  const boundingBox = new THREE.Box3().setFromObject(child);
  const center = boundingBox.getCenter(new THREE.Vector3());

  const worldBox = boundingBox.clone().applyMatrix4(worldMatrix);

  const minZ = worldBox.min.z;
  const maxZ = worldBox.max.z;
  const minX = worldBox.min.x;
  const maxX = worldBox.max.x;

  // 计算 UV 坐标
  const uvs = new Float32Array((vertices.length / 3) * 2);

  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i] - center.x;
    const y = vertices[i + 1] - center.y;
    const z = vertices[i + 2];

    // 归一化顶点坐标（投影到单位圆柱体表面）
    const radius = Math.sqrt(x * x + y * y);
    const nx = x / radius;
    const ny = y / radius;

    // 计算高度（v）
    const v = (z - minZ) / (maxZ - minZ); // 范围 [0, 1]

    // 计算角度（u）
    const theta = Math.atan2(ny, nx); // 范围 [-π, π]
    const u1 = (theta + Math.PI) / (2 * Math.PI); // 范围 [0, 1]

    // const u1 = (x - minX) / (maxX - minX);

    // 处理 UV 反转
    if (isReverse) {
      uvs[(i / 3) * 2] = 1 - u1;
      uvs[(i / 3) * 2 + 1] = 1 - v;
    } else {
      uvs[(i / 3) * 2] = u1;
      uvs[(i / 3) * 2 + 1] = v;
    }
  }

  return uvs;
}




export function generateUVs(geometry: any) {
  // 计算包围盒
  const box = new THREE.Box3().setFromBufferAttribute(geometry.attributes.position);
  const size = new THREE.Vector3();
  box.getSize(size);


  // 生成平面投影UV
  const uvs = [];
  const positions = geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    const x = (positions[i] - box.min.x) / size.x;
    const y = (positions[i + 1] - box.min.y) / size.y;

    // 将坐标原点移到中心（0.5, 0.5）
    const centerX = x - 0.5;
    const centerY = y - 0.5;

    // 旋转90度
    // 旋转矩阵：[cos(90°) -sin(90°)] = [0 -1]
    //          [sin(90°)  cos(90°)]   [1  0]
    const rotatedX = -centerY + 0.5;  // 旋转后移回原来的坐标系
    const rotatedY = centerX + 0.5;


    // if (isChange) {
    // uvs.push(u1, u2);
    // } else {
    uvs.push(rotatedX, rotatedY);
    // }
  }
  return uvs;
}