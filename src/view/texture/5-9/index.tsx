
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

import woodTexture from '../../../assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_basecolor.jpg';
import metalnessTexture from '../../../assets/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_metallic.jpg';
import oaTexture from '../../../assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_ambientOcclusion.jpg';
import heightTexture from '../../../assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_height.png';
import roughnessTexture from '../../../assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_roughness.jpg';
import leftTexture from '../../../assets/textures/fullscreen/1.left.jpg';
import rightTexture from '../../../assets/textures/fullscreen/1.right.jpg';
import topTexture from '../../../assets/textures/fullscreen/1.top.jpg';
import bottomTexture from '../../../assets/textures/fullscreen/1.bottom.jpg';
import frontTexture from '../../../assets/textures/fullscreen/1.front.jpg';
import backTexture from '../../../assets/textures/fullscreen/1.back.jpg';
import * as dat from 'dat.gui';

const MetallicSphere = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 创建场景
    const scene = new THREE.Scene();

    // 创建相机
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // 添加色调映射
    renderer.toneMappingExposure = 1;
    // 添加这些重要的渲染器设置
renderer.outputColorSpace = THREE.SRGBColorSpace;  // 新版本使用这个替代 outputEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;
    mountRef.current.appendChild(renderer.domElement);

   


    // 调整光源
    const ambientLight = new THREE.AmbientLight(0xffffff); // 增加环境光强度
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.85);
    dirLight.position.set(2,2,2);
    scene.add(dirLight);

    // 修改点光源
    const pointLight1 = new THREE.PointLight(0xffffff, 100); // 改为白色光，增加强度
    pointLight1.position.set(2, 2, 2);
    // scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 100); // 改为白色光，增加强度
    pointLight2.position.set(-2, -2, 2);
    // scene.add(pointLight2);



        const roughnessTexture1 = new THREE.TextureLoader().load(roughnessTexture, (t) => {
          t.needsUpdate = true;
        });


        const metalnessTexture1 = new THREE.TextureLoader().load(metalnessTexture, (t) => {
          t.needsUpdate = true;
        });

        const woodTexture1 = new THREE.TextureLoader().load(woodTexture, (t) => {
          t.needsUpdate = true;
        });

    // 添加环境贴图
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const environmentMap = cubeTextureLoader.load([
      leftTexture,
      rightTexture,
      topTexture,
      bottomTexture,
      frontTexture,
      backTexture,
    ], () => {
          console.log('环境贴图加载成功');
    },   (progress) => {
        console.log('环境贴图加载进度:', (progress.loaded / progress.total * 100) + '%');
    },
    (error) => {
        console.error('环境贴图加载失败:', error);
    });
    // scene.background = environmentMap;
    // scene.environment = environmentMap;

    // 设置环境贴图的颜色空间
// environmentMap.colorSpace = THREE.SRGBColorSpace;  // 新版本使用这个


     // 创建金属球
    const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      // metalness: 0.9,     // 稍微降低金属度，让材质不会太黑
      roughness: 0.5,     // 降低粗糙度，增加反射的清晰度
      // color: 0xcccccc,    // 使用更亮的银色
      envMapIntensity: 1.0, // 增加环境贴图的强度
      envMap: environmentMap,
      roughnessMap: roughnessTexture1,
      metalnessMap: metalnessTexture1,
      map: woodTexture1,
          side: THREE.DoubleSide,
    // transparent: true,
    depthWrite: true,
      depthTest: true,
    // opacity: 0.5,
    });


    const sphereMaterial1 = new THREE.MeshPhysicalMaterial({

      roughness: 0.1,     // 降低粗糙度，增加反射的清晰度
      // color: 0xcccccc,    // 使用更亮的银色
      envMapIntensity: 1.0, // 增加环境贴图的强度
      envMap: environmentMap,
      roughnessMap: roughnessTexture1,
      // metalnessMap: metalnessTexture1,
      // map: woodTexture1,
    // transparent: true,
    // depthWrite: true,
      // depthTest: true,
      transparent: true,
      clearcoat: 1, // 具有反光特性  (透明球体主要参数)
        transmission: 1, // 控制薄厚
        ior: 1.0, // 折射率  范围 1.0 - 2.33
      thickness: 1,  // 曲面下薄厚   效果与ior有关
      side: THREE.DoubleSide
        // specularIntensity: 1,
      // opacity: 0.9,
        //  specularColor: 0x00ffff,
    });

     const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    
     const sphere1 = new THREE.Mesh(sphereGeometry, sphereMaterial1);

    sphere.position.set(-2, 0, 0);
    scene.add(sphere);

    sphere1.position.set(2, 0, 0);
    scene.add(sphere1);

    // 添加轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const gui = new dat.GUI();
    gui.add(sphereMaterial1, 'clearcoat',0,1,0.01);
    gui.add(sphereMaterial1, 'transmission',0,1,0.01);
    gui.add(sphereMaterial1, 'ior', 1, 2.33, 0.01);
    
    gui.add(sphereMaterial1, 'thickness',0,1,0.01).onChange((value)=>{
      sphereMaterial1.thickness = value;
      sphereMaterial1.needsUpdate = true;
    });


    const gridHelper = new THREE.GridHelper(10,10,0xffffff,0x000fff);
    scene.add(gridHelper);

    // 动画循环
    const animate = () => {
      sphereMaterial.needsUpdate = true;
      sphereMaterial1.needsUpdate = true;
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // 处理窗口大小变化
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} />;
};

export default MetallicSphere; 