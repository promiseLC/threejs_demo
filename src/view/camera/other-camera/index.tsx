import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import * as dat from 'dat.gui';

import { HeartCurve } from 'three/examples/jsm/curves/CurveExtras.js';

import { useRef,useEffect } from 'react';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';

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
  cube: THREE.Mesh;
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

    if(!mountRef.current){
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
      cube: null as unknown as THREE.Mesh,
      currentCameraIndex: 0,
      animationCount: 0,

      createScene() {
        this.scene = new THREE.Scene();
      },

      createCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        
        this.PCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 100);
        this.PCamera.position.set(0, 0, 3);
        this.scene.add(this.PCamera);

        this.WCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 100);
        this.WCamera.position.set(0, 0, 20);
        this.WCamera.lookAt(0, 0, 0);
        this.scene.add(this.WCamera);

        this.camera = this.PCamera;
      },

      createGeometry() {
           // 创建一个绿色立方体
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.cube = new THREE.Mesh(geometry, material);
        this.cube.position.set(0, 0, 0);
        this.scene.add(this.cube);




      },

      createLight() {
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(1, 1, 1);
        const ambLight = new THREE.AmbientLight(0xffffff);
        this.scene.add(dirLight, ambLight);
      },

      createGui() {
        this.gui = new dat.GUI();
        const cameraFolder = this.gui.addFolder('相机参数');
        
        cameraFolder.add(this.PCamera.position, 'x', -10, 10, 0.01).name('位置 X');
        cameraFolder.add(this.PCamera, 'zoom', 0.1, 4, 0.1).onChange(() => {
          this.PCamera.updateProjectionMatrix();
          // this.cameraHelper.update();
        }).name('缩放');
        cameraFolder.add(this.PCamera, 'fov', 1, 100, 1).onChange(() => {
          this.PCamera.updateProjectionMatrix();
          // this.cameraHelper.update();
        }).name('视场角');

        this.gui.add({ switchCamera: () => this.switchCamera() }, 'switchCamera').name('切换相机');
        cameraFolder.open();

        this.gui.add(this.controls, 'enabled').name('控制器');

      },

      switchCamera() {
        this.controls.dispose();
        this.currentCameraIndex = this.currentCameraIndex === 0 ? 1 : 0;
        this.camera = this.currentCameraIndex === 0 ? this.WCamera : this.PCamera;
        this.createControls();
      },

      createControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // 新增拖拽控制器
        const dragControls = new DragControls([this.cube], this.camera, this.renderer.domElement);
        
        dragControls.addEventListener('dragstart', (event) => {

          this.controls.enabled = false;
        });

        dragControls.addEventListener('dragend', (event) => {

          this.controls.enabled = true;
        });

      },

      createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
          antialias: true,
          // alpha: true
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current?.appendChild(this.renderer.domElement);
      },

      createHelper() {
        const axesHelper = new THREE.AxesHelper(4);
        // 只给pc相机添加辅助器
        // this.cameraHelper = new THREE.CameraHelper(this.PCamera);
        // this.scene.add(axesHelper, this.cameraHelper);
        this.scene.add(axesHelper);
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

      updateCamera() {
        const index = this.animationCount % this.points.length;
        const currentPoint = this.points[index];
        const nextPoint = this.points[(index + 1) % this.points.length];

        this.PCamera.position.set(currentPoint.x, 0, -currentPoint.y);
        this.sphereMesh.position.copy(this.PCamera.position);
        this.PCamera.lookAt(nextPoint.x, 0, -nextPoint.y);
        this.PCamera.updateProjectionMatrix();
        
        this.animationCount++;
      },

      animate() {
        this.controls.update();
        // this.updateCamera();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());
      },

      init() {
        this.createScene();
        this.createCamera();
        this.createGeometry();
        this.createLight();
        this.createRenderer();
        this.createHelper();
                this.createControls();
        this.createGui();

        this.handleResize();
        this.animate();
      }
    } as SceneManager;

    // 启动应用
    sceneManager.init();

    // 清理函数
    return () => {
      // sceneManager.gui.destroy();
      sceneManager.controls.dispose();
      if (mountRef.current && sceneManager.renderer.domElement) {
        mountRef.current.removeChild(sceneManager.renderer.domElement);
      }
    };
  }, []);


  return <div ref={mountRef}></div>;
};

export default Test;
