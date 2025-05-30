



import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import * as dat from 'dat.gui';

import { HeartCurve } from 'three/examples/jsm/curves/CurveExtras.js';

import { useRef, useEffect } from 'react';
import { SceneManager } from '../../../type';

import woodTexture from '../../../assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_basecolor.jpg';
import metalnessTexture from '../../../assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_metallic.jpg';
import oaTexture from '../../../assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_ambientOcclusion.jpg';
import heightTexture from '../../../assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_height.png';
import roughnessTexture from '../../../assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_roughness.jpg';

import { DragControls } from 'three/examples/jsm/Addons.js';


// 金属贴图
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
        this.PCamera.position.set(0, 0, 10);
        this.scene.add(this.PCamera);

        this.WCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 100);
        this.WCamera.position.set(0, 0, 20);
        this.WCamera.lookAt(0, 0, 0);
        this.scene.add(this.WCamera);

        this.camera = this.PCamera;
      },

      loadTexture() {
        this.texture =  new THREE.TextureLoader().load(woodTexture, (t) => {
          t.needsUpdate = true;
        });

        this.aoTexture = new THREE.TextureLoader().load(oaTexture, (t) => {
          t.needsUpdate = true;
        });

        this.roughness1Texture = new THREE.TextureLoader().load('../../../assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_roughness.jpg', (t) => {
          t.needsUpdate = true;
        });

        this.roughnessTexture = new THREE.TextureLoader().load(roughnessTexture, (t) => {
          t.needsUpdate = true;
        });


        this.metalnessTexture = new THREE.TextureLoader().load(metalnessTexture, (t) => {
          t.needsUpdate = true;
        });

        this.heightTexture = new THREE.TextureLoader().load(heightTexture, (texture) => {
         texture.needsUpdate = true;
           console.log('高度贴图加载成功:', texture);
            console.log('贴图尺寸:', texture.image.width, 'x', texture.image.height);
        });


         this.texture.colorSpace = THREE.SRGBColorSpace;
    this.roughnessTexture.colorSpace = THREE.SRGBColorSpace;
    this.metalnessTexture.colorSpace = THREE.SRGBColorSpace;
    

      },

      createGeometry() {




        const material = new THREE.MeshStandardMaterial({
          // color: 0x00ff00,
          side: THREE.DoubleSide,
          map: this.texture,
          // roughnessMap: this.roughnessTexture,
          metalnessMap: this.metalnessTexture,

        })

        this.material = material;


          const material1 = new THREE.MeshStandardMaterial({
          // color: 0x00ff00,
          side: THREE.DoubleSide,
            map: this.texture,
            // aoMap: this.aoTexture,
        })






        // 创建一个球
        const cubeGeometry = new THREE.SphereGeometry(2, 64,64);
        const cubeGeometry1 = new THREE.SphereGeometry(2, 64,64);

        const cubeMesh = new THREE.Mesh(cubeGeometry, material);
        const cubeMesh1 = new THREE.Mesh(cubeGeometry1, material1);

        this.cubeMesh = cubeMesh;

        cubeMesh.position.set(2, 0, 0);
        cubeMesh1.position.set(-3, 0, 0);

        // cubeGeometry.setAttribute('uv2', new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 2));

        

        // 加入场景

        this.scene.add( cubeMesh, cubeMesh1 );
        
        
        
      },

      createGui() {
        this.gui = new dat.GUI();

        // 值越小就是镜面反射,值越大就是表面粗糙漫反射
        this.gui.add(this.material, 'roughness').min(0).max(1).step(0.01);
        this.gui.add(this.material, 'metalness').min(0).max(1).step(0.01);
      },

      createLight() {

        

            // 添加全局光照
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    // 添加方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);

    directionalLight.position.set(1, 2, 4);

        this.scene.add(ambientLight);
        this.scene.add(directionalLight);

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

           // 添加网格平面
    const gridHelper = new THREE.GridHelper();

        gridHelper.position.y = -4;
        this.scene.add(gridHelper);
      },


      animate() {
         this.material.needsUpdate = true;
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());
      },

      createControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        const dragControls = new DragControls([this.cubeMesh], this.camera, this.renderer.domElement);

        dragControls.addEventListener('dragstart', (event) => {
          this.controls.enabled = false;
        });

        dragControls.addEventListener('dragend', (event) => {
          this.controls.enabled = true;
        });


      },

      init() {
        this.createScene();
        this.createCamera();
        this.loadTexture();
        this.createGeometry();
        this.createLight();
        this.createGui();
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

      if(sceneManager.gui){
        sceneManager.gui.destroy();
      }
     

      if (mountRef.current && sceneManager.renderer.domElement) {
        mountRef.current.removeChild(sceneManager.renderer.domElement);
      }
    };
  }, []);


  return <div ref={mountRef}></div>;
};

export default Test;
