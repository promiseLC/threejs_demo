import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { HeartCurve } from 'three/examples/jsm/curves/CurveExtras.js';
// 完善场景管理器接口定义
export interface SceneManager {
  scene: THREE.Scene;
  PCamera: THREE.PerspectiveCamera;
  WCamera: THREE.PerspectiveCamera;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  group: THREE.Group;
  controls: OrbitControls;
  heartCurve: HeartCurve;
  points: THREE.Vector3[];
  sphereMesh: THREE.Mesh;
  cameraHelper: THREE.CameraHelper;
  gui: dat.GUI;
  currentCameraIndex: number;
  animationCount: number;
  texture: THREE.Texture;
  [P: string]: any;
  // 添加方法定义
  createScene: () => void;
  createCamera: () => void;
  createGeometry: () => void;
  createLight: () => void;
  createGui: () => void;
  switchCamera: () => void;
  createControls: () => void;
  createRenderer: () => void;
  createHelper: () => void;
  runCar: () => void;
  handleResize: () => () => void;
  loadTexture: () => void;
  updateCamera: () => void;
  animate: () => void;
  init: () => void;
}
