



import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import * as dat from 'dat.gui';

import { HeartCurve } from 'three/examples/jsm/curves/CurveExtras.js';

import { useRef, useEffect } from 'react';
import { SceneManager } from '../../../type';
import gsap from 'gsap';


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
        this.PCamera.position.set(0, 5, 10);
        this.scene.add(this.PCamera);

        this.WCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 100);
        this.WCamera.position.set(0, 0, 20);
        this.WCamera.lookAt(0, 0, 0);
        this.scene.add(this.WCamera);

        this.camera = this.PCamera;
      },

      createGeometry() {

        const carGeometry = new THREE.BoxGeometry(4, 2, 0.5);
        const Material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const carMesh = new THREE.Mesh(carGeometry, Material);
        
        carMesh.rotation.x = -Math.PI / 2;

        const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5);

        const wheelMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff ,wireframe:true});


        const wheelMesh1 = new THREE.Mesh(wheelGeometry, wheelMaterial);
        const wheelMesh2 = new THREE.Mesh(wheelGeometry, wheelMaterial);
        const wheelMesh3 = new THREE.Mesh(wheelGeometry, wheelMaterial);
        const wheelMesh4 = new THREE.Mesh(wheelGeometry, wheelMaterial);

        wheelMesh1.name= 'wheelMesh';
        wheelMesh2.name= 'wheelMesh';
        wheelMesh3.name= 'wheelMesh';
        wheelMesh4.name= 'wheelMesh';

        wheelMesh1.position.set(-1, 0, 1);
        wheelMesh1.rotation.x = -Math.PI / 2;

         wheelMesh2.position.set(1, 0, 1);
        wheelMesh2.rotation.x = -Math.PI / 2;

         wheelMesh3.position.set(-1, 0, -1);
        wheelMesh3.rotation.x = -Math.PI / 2;

        wheelMesh4.position.set(1, 0, -1);
        wheelMesh4.rotation.x = -Math.PI / 2;

       
        
        const light = new THREE.BoxGeometry(0.4,0.4,0.4);
        const lightMaterial = new THREE.MeshBasicMaterial({color:0x882288});
        const lightMesh1 = new THREE.Mesh(light,lightMaterial);
        const lightMesh2 = new THREE.Mesh(light,lightMaterial);
        
        lightMesh1.position.set(-2.2, 0, -0.5);
        lightMesh2.position.set(-2.2, 0, 0.5);

        this.group = new THREE.Group();
        this.group.add(carMesh,wheelMesh1, wheelMesh2, wheelMesh3, wheelMesh4,lightMesh1,lightMesh2);
        this.scene.add(this.group);
        this.group.position.set(0,0.5,0);
        
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

        const gridHelper = new THREE.GridHelper(100, 10, 0x0000ff, 0xffffff);
        this.scene.add(gridHelper);
        
      },

      createGui() {
        
        const gui = new dat.GUI();
        
        this.gui = gui;
        const _this = this;
        const params = {
          rotateX: _this.sphereMesh.rotation.x,
          rotateSphereMesh: () => {

            gsap.to(_this.sphereMesh.rotation, {

              duration: 1,
              delay:0,
              x: _this.sphereMesh.rotation.x+Math.PI/2,
            })

            


          }
        };

        gui.add(this.sphereMesh.position, 'x').min(-3).max(3).step(0.01).name('x');

        // 控制球体变为线框图

        gui.add(this.sphereMesh.material as THREE.MeshBasicMaterial, 'wireframe').name('wireframe');


        gui.add(params, 'rotateSphereMesh');






      },

      runCar() {
        // 假设一帧走4度
        const delta = 4;
        const speed = ( 2*Math.PI*0.5) / 360 * delta;
        for (let i = 0; i < this.group.children.length; i++){
          
          if(this.group.children[i].name === 'wheelMesh'){
            this.group.children[i].rotation.y += THREE.MathUtils.degToRad(delta);
          }

        }

        this.group.position.x += -speed;

        if (this.group.position.x <= -10) {
          this.group.position.x = 10;
        }
      },

      animate() {
        this.runCar();
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
        // this.createGui();
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
