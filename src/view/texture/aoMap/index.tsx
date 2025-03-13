



import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import * as dat from 'dat.gui';

import { HeartCurve } from 'three/examples/jsm/curves/CurveExtras.js';

import { useRef, useEffect } from 'react';
import { SceneManager } from '../../../type';

import woodTexture from '../../../assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_basecolor.jpg';
import oaTexture from '../../../assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_ambientOcclusion.jpg';
import woodTexture1 from '../../../assets/textures/Wood_Ceiling_Coffers_003/image1.png';
import { DragControls } from 'three/examples/jsm/Addons.js';


// TODO: AO贴图 在不打光的情况下，可以增加物体表面的凹凸感

// TODO: 凹凸贴图 可以增加物体表面的凹凸感 要使贴图生效要设置uv2属性

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

      loadTexture() {
        this.texture =  new THREE.TextureLoader().load(woodTexture, (t) => {
          t.needsUpdate = true;
        });

        this.aoTexture = new THREE.TextureLoader().load(oaTexture, (t) => {
          t.needsUpdate = true;
        });
    

      },

      createGeometry() {




        const material = new THREE.MeshBasicMaterial({
          // color: 0x00ff00,
          side: THREE.DoubleSide,
          map: this.texture,
            aoMap: this.aoTexture,
          aoMapIntensity: 1,
        })

        this.material = material;


          const material1 = new THREE.MeshBasicMaterial({
          // color: 0x00ff00,
          side: THREE.DoubleSide,
            map: this.texture,
            // aoMap: this.aoTexture,
        })






        // 创建一个立方体
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const cubeGeometry1 = new THREE.BoxGeometry(1, 1, 1);

        const cubeMesh = new THREE.Mesh(cubeGeometry, material);
        const cubeMesh1 = new THREE.Mesh(cubeGeometry1, material1);

        this.cubeMesh = cubeMesh;

        cubeMesh.position.set(0, 0, 0);
        cubeMesh1.position.set(-2, 0, 0);

        cubeGeometry.setAttribute('uv2', new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 2));

        console.log(cubeGeometry);
        

        // 加入场景

        this.scene.add( cubeMesh, cubeMesh1 );
        
        
        
      },

      createGui() {
        this.gui = new dat.GUI();

        this.gui.add(this.material, 'aoMapIntensity').min(0).max(1).step(0.01);
      },

      createLight() {
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(1, 1, 1);
        const ambLight = new THREE.AmbientLight(0xffffff);
        // this.scene.add(dirLight, ambLight);
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
        // this.createLight();
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


      if (mountRef.current && sceneManager.renderer.domElement) {
        mountRef.current.removeChild(sceneManager.renderer.domElement);
      }
    };
  }, []);


  return <div ref={mountRef}></div>;
};

export default Test;
