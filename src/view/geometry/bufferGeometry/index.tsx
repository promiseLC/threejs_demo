

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import * as dat from 'dat.gui';

import { HeartCurve } from 'three/examples/jsm/curves/CurveExtras.js';

import { useRef, useEffect } from 'react';

// 完善场景管理器接口定义
interface SceneManager {
  scene: THREE.Scene;
  PCamera: THREE.PerspectiveCamera;
  WCamera: THREE.PerspectiveCamera;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  heartCurve: HeartCurve;
  points: THREE.Vector3[];
  sphereMesh: THREE.Mesh;
  cameraHelper: THREE.CameraHelper;
  gui: dat.GUI;
  currentCameraIndex: number;
  animationCount: number;

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
  handleResize: () => () => void;
  updateCamera: () => void;
  animate: () => void;
  init: () => void;
}

const Test = () => {

  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    if (!mountRef.current) {
      return;
    }

    // 使用类型断言确保初始化时所有必需属性都存在
    const sceneManager = {
      scene: null as unknown as THREE.Scene,
      PCamera: null as unknown as THREE.PerspectiveCamera,
      WCamera: null as unknown as THREE.PerspectiveCamera,
      camera: null as unknown as THREE.PerspectiveCamera,
      renderer: null as unknown as THREE.WebGLRenderer,
      controls: null as unknown as OrbitControls,
      heartCurve: null as unknown as HeartCurve,
      points: [] as THREE.Vector3[],
      sphereMesh: null as unknown as THREE.Mesh,
      cameraHelper: null as unknown as THREE.CameraHelper,
      gui: null as unknown as dat.GUI,
      currentCameraIndex: 0,
      animationCount: 0,

      createScene() {
        this.scene = new THREE.Scene();
      },

      createCamera() {
        const aspect = window.innerWidth / window.innerHeight;

        this.PCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.PCamera.position.set(0, 0, 3);
        this.scene.add(this.PCamera);

        this.WCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 100);
        this.WCamera.position.set(0, 0, 20);
        this.WCamera.lookAt(0, 0, 0);
        this.scene.add(this.WCamera);

        this.camera = this.PCamera;
      },

      createGeometry() {



        const geometry2 = new THREE.BufferGeometry();

        const vertices = new Float32Array([
          -1.0, -1.0, 1.0,
          1.0, -1.0, 1.0,
          1.0, 1.0, 1.0,
 1.0,  1.0,  1.0, // 第4个...
  -1.0,  1.0,  1.0,
  -1.0, -1.0,  1.0,
        ])

        // 第二个参数 3 表示每个顶点都是三个值构成。
        geometry2.setAttribute('position', new THREE.BufferAttribute(vertices, 3)); // 这里是告诉几何体这组数据就是顶点的坐标信息

        const material = new THREE.MeshBasicMaterial({
          color: 0x00ff00,
          // wireframe: true,
          side: THREE.DoubleSide,
        });

        const mesh = new THREE.Mesh(geometry2, material);
        this.scene.add(mesh);
        
        
      },

      createLight() {
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(1, 1, 1);
        const ambLight = new THREE.AmbientLight(0xffffff);
        this.scene.add(dirLight, ambLight);
      },





      createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
          antialias: true,
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current?.appendChild(this.renderer.domElement);
      },



      handleResize() {
        const handleResize = () => {
          const width = window.innerWidth;
          const height = window.innerHeight;

          this.camera.aspect = width / height;
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      },

      createHelper() {

        // 创建坐标轴辅助线
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);

        
      },


      animate() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());
      },

      createControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
      },

      init() {
        this.createScene();
        this.createCamera();
        this.createGeometry();
        this.createLight();
        this.createRenderer();
        this.createControls();
        this.handleResize();
        this.animate();
        this.createHelper();
      }
    } as SceneManager;

    // 启动应用
    sceneManager.init();

    // 清理函数
    return () => {


      if (mountRef.current && sceneManager.renderer.domElement) {
        mountRef.current.removeChild(sceneManager.renderer.domElement);
      }
    };
  }, []);


  return <div ref={mountRef}></div>;
};

export default Test;
