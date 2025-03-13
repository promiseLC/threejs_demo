import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { BufferGeometryUtils, FlakesTexture } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// 导入/src/assets/tooth文件夹下所有文件
const toothFiles = import.meta.glob('/src/assets/tooth/*.obj');

const ToothViewer = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 创建场景
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true // 添加透明支持
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5; // 增加曝光度
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    // 启用物理正确的光照
    // renderer.physicallyCorrectLights = true;
    mountRef.current.appendChild(renderer.domElement);

    // 添加轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 加载环境贴图
    const rgbeLoader = new RGBELoader()
      .setPath('/src/assets/textures/rectangular/'); // 确保路径正确
    
    
     
          const normalTexture = new THREE.CanvasTexture(new FlakesTexture());

          // normalTexture.wrapS = THREE.RepeatWrapping;
          // normalTexture.wrapT = THREE.RepeatWrapping;
          normalTexture.repeat.set(10, 6);

    rgbeLoader.load('school_hall_1k.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.colorSpace = THREE.SRGBColorSpace;
      
      // 设置场景环境
      scene.environment = texture;
      scene.background = texture;

      // 更新材质
      toothMaterial.envMap = texture;
      toothMaterial.needsUpdate = true;
    });

    // 修改材质参数，使其更接近真实牙齿的物理特性
    const toothMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf3f3f3,  // 略微偏黄的白色
      metalness: 0.1,    // 降低金属感
      roughness: 0.2,    // 适当的粗糙度
      transmission: 0.4,  // 增加透光度
      thickness: 1.0,    // 增加厚度
      clearcoat: 0.4,    // 增加表面涂层
      clearcoatRoughness: 0.2,
      envMapIntensity: 0.8,
      ior: 1.5,          // 牙齿的折射率
      attenuationColor: new THREE.Color(0xf9f9d0), // 略微发黄的衰减颜色
      attenuationDistance: 0.5,   // 衰减距离
      sheen: 0.35,       // 添加光泽
      sheenRoughness: 0.4,
      sheenColor: new THREE.Color(0xffffff),
      normalScale: new THREE.Vector2(0.15, 0.15), // 调整法线贴图强度
    });


    // 添加新的光照系统
    // 柔和的环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // 主要平行光
    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    // 优化阴影设置
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.1;
    mainLight.shadow.camera.far = 100;
    mainLight.shadow.bias = -0.001;
    scene.add(mainLight);

    
    // 添加多个点光源模拟口腔环境
    const createPointLight = (position: [number, number, number], intensity: number, color: number) => {
      const light = new THREE.PointLight(color, intensity, 10);
      light.position.set(...position);
      return light;
    };

    const pointLights = [
      createPointLight([2, 1, 3], 0.6, 0xffffff),
      createPointLight([-2, 1, 3], 0.6, 0xffffff),
      createPointLight([0, -2, 3], 0.4, 0xffd5d5),
    ];
    pointLights.forEach(light => scene.add(light));

    // 添加后期处理
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 创建OBJ加载器
    const loader = new OBJLoader();
    
Object.entries(toothFiles).forEach(([path]) => {
   // 加载第一个牙齿（基础材质
    loader.load(
      path,
      (object) => {
    // const gui = new dat.GUI();

        object.traverse((child) => {
          
          if (child instanceof THREE.Mesh) {


            // 优化几何体
            if (child.geometry) {

              
        child.geometry.deleteAttribute('normal');
        /** (2) 合并顶点 */
        child.geometry = BufferGeometryUtils.mergeVertices(child.geometry);
        /** (3) 计算平滑法线 */
              child.geometry.computeVertexNormals();


              // 添加顶点信息为uv信息
              child.geometry.setAttribute('uv', child.geometry.attributes.position);

            }
            // 设置材质
            child.material = toothMaterial; 

          //      gui.add(child, 'position').onChange((value) => {
          //   console.log(value);
          //  });

          }
        });

        scene.add(object);

      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (error) => {
        console.error('加载OBJ文件时出错:', error);
      }
    );
  
});
  
    // 优化光照系统
    // 移除之前的光源
    scene.remove(ambientLight);


    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
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
    };
  }, []);

  return <div ref={mountRef} />;
};

export default ToothViewer;
