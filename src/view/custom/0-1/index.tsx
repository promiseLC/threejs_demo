import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import HDR7 from '../../../assets/textures/rectangular/creepy_bathroom_1k.hdr';
import * as dat from 'dat.gui';
import { FlakesTexture } from 'three/examples/jsm/Addons.js';

const Custom = () => {
  const MRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    if (!MRef.current) {
      return;
    }

      const render = {
        scene: new THREE.Scene(),
        camera: null as unknown as THREE.PerspectiveCamera,
        renderer: null as unknown as THREE.WebGLRenderer,
        removeHandle: null as unknown as () => void,
        controls: null as unknown as OrbitControls,
        gui: null as unknown as dat.GUI,
        mesh: null as unknown as THREE.Mesh,
        directionalLight: null as unknown as THREE.DirectionalLight,
        ambientLight: null as unknown as THREE.AmbientLight,
        material: null as unknown as THREE.Material,
        texture: null as unknown as THREE.Texture,
        normalTexture: null as unknown as THREE.Texture,
        createRenderer() {
          this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
          });
          this.renderer.setPixelRatio(window.devicePixelRatio);
          this.renderer.setSize(window.innerWidth, window.innerHeight);
          this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
          this.renderer.toneMappingExposure = 1.25;
          this.renderer.outputColorSpace = THREE.SRGBColorSpace;



          MRef.current?.appendChild(this.renderer.domElement);


        },


        createCamera() {
          this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

          this.camera.position.set(0, 0, 10);

          this.camera.lookAt(this.mesh.position);

          this.scene.add(this.camera);
        },

        createLight() {
          const ambientLight = new THREE.AmbientLight(0xffff00, 0.5);
          const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
          directionalLight.position.set(0, 10, 0);

          directionalLight.lookAt(this.mesh.position);

          // this.scene.add(ambientLight);
          // this.scene.add(directionalLight);



          this.ambientLight = ambientLight;
          this.directionalLight = directionalLight;


          const pointLight = new THREE.PointLight(0xffffff, 1,1000,0);
          pointLight.position.set(20, 20, 20);

          const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);

          this.scene.add(pointLightHelper);

          this.scene.add(pointLight);



        },

        createTexture() {

          

          const normalTexture = new THREE.CanvasTexture(new FlakesTexture());

          normalTexture.wrapS = THREE.RepeatWrapping;
          normalTexture.wrapT = THREE.RepeatWrapping;
          normalTexture.repeat.set(10, 6);

          this.normalTexture = normalTexture;


          const hdrLoader = new RGBELoader();
          const texture = hdrLoader.load(HDR7, (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            // texture.colorSpace = THREE.SRGBColorSpace;
            texture.needsUpdate = true;
          },()=>{
            console.log('加载完成');
          },()=>{
            console.log('加载失败');
          });
          this.texture = texture;
        },



        createMesh() {

          const geometry = new THREE.SphereGeometry(2, 64, 64);


          const material = new THREE.MeshPhysicalMaterial({
            color: 0x8418ca,
            clearcoat: 1,
            clearcoatRoughness: 0.1,
            metalness: 0.9,
            roughness: 0.5,
            normalMap: this.normalTexture,
            normalScale: new THREE.Vector2(0.15, 0.15),
            envMap: this.texture,
            envMapIntensity: 1,
                   // emissive: 0x404040, // 自发光颜色
          });

          this.material = material;


          const mesh = new THREE.Mesh(geometry, material);

          this.mesh = mesh;

          mesh.position.set(0, 3, 0);

          this.scene.add(mesh);
        },

        createControls() {
          this.controls = new OrbitControls(this.camera, this.renderer.domElement);
          this.controls.enableDamping = true;
        },



        createHelper() {
          const gridHelper = new THREE.GridHelper(100, 100, '#ffff00', '#ffffff');
          this.scene.add(gridHelper);
          const axesHelper = new THREE.AxesHelper(5);
          this.scene.add(axesHelper);

        },


        createGui() {

          const _this = this;
          const gui = new dat.GUI();

          const light = gui.addFolder('光照');
          
          light.open();
          
          const ambientLightParams = {
            color: '#ffffff',
          }

          light.addColor(ambientLightParams,'color').onChange((val) => {
            _this.ambientLight.color = new THREE.Color(val);
          }).name('环境光颜色');

          light.add(this.ambientLight, 'visible').name('环境光可见性');

          light.add(this.ambientLight, 'intensity').min(0).max(10).step(0.1).onChange(()=>{
            this.ambientLight.intensity = this.ambientLight.intensity;
          }).name('环境光强度');

           light.add(this.directionalLight, 'visible').name('方向光源可见性');
          light.addColor({color: '#ffffff'}, 'color').onChange((val)=>{
            this.directionalLight.color =  new THREE.Color(val);
          }).name('方向光源颜色');


          light.add(this.directionalLight, 'intensity').min(0).max(10).step(0.1).onChange(()=>{
            this.directionalLight.intensity = this.directionalLight.intensity;
          });

          light.add(this.directionalLight.position, 'x', -10, 10, 0.1).onChange(() => {
            this.camera.lookAt(this.directionalLight.position);
          });
          light.add(this.directionalLight.position, 'y', -10, 10, 0.1).onChange(() => {
            this.camera.lookAt(this.directionalLight.position);
          });
          light.add(this.directionalLight.position, 'z', -10, 10, 0.1).onChange(() => {
            this.camera.lookAt(this.directionalLight.position);
          });

         
          const mesh = gui.addFolder('物体'); 
          mesh.open();

          mesh.addColor({color: '#00ff00'}, 'color').onChange((val)=>{
            if(_this.mesh.material instanceof THREE.Material) {
              (_this.mesh.material as THREE.MeshStandardMaterial).color = new THREE.Color(val);
            }
          }).name('物体颜色');

          mesh.add(this.mesh, 'visible').name('物体可见性');

          // 金属度
          mesh.add(this.material, 'metalness').min(0).max(1).step(0.1).onChange((val)=>{
            if(_this.mesh.material instanceof THREE.Material) {
              (_this.mesh.material as THREE.MeshStandardMaterial).metalness = val;
            }
          }).name('金属度');
          
          // 粗糙度
          mesh.add((this.material as THREE.MeshStandardMaterial), 'roughness').min(0).max(1).step(0.1).onChange((val)=>{
            if(_this.mesh.material instanceof THREE.Material) {
              (_this.mesh.material as THREE.MeshStandardMaterial).roughness = val;
            }
          }).name('粗糙度');

          mesh.add(this.mesh.position, 'x', -10, 10, 0.1);
          mesh.add(this.mesh.position, 'y', -10, 10, 0.1);
          mesh.add(this.mesh.position, 'z', -10, 10, 0.1);
          
          





          this.gui = gui;

        },

        init() {
          this.createRenderer();
          this.createTexture();
          this.createMesh(); 
          this.createCamera();
          this.createLight();
          this.createGui();
          this.createControls();
          this.createHelper();
          this.animate();
          this.removeHandle = this.handleResize();
        },

        animate() {
          this.camera.updateMatrixWorld();
          this.controls.update();
          this.renderer.render(this.scene, this.camera);
          requestAnimationFrame(()=>this.animate());
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
      };


      render.init();


    return () => {

      render.gui?.destroy();

      if (MRef.current && render.renderer.domElement) {
        MRef.current.removeChild(render.renderer.domElement);
        render.removeHandle();
      }


    };
  }, []);

  return <div ref={MRef} />;
};

export default Custom;
