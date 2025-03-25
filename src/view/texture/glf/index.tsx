import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui';
// 导入/src/assets/tooth文件夹下所有文件
const toothFiles = import.meta.glob('/src/assets/tooth/*.glf');


import toothMap from '../../../assets/textures/tooth/map.png';
import qipanMap from '../../../assets/textures/tooth/qipan.png';
import yayinMap from '../../../assets/textures/yayin/map.png';
import yayinnormalMap from '../../../assets/textures/yayin/normalMap.png';
import yayinspecularMap from '../../../assets/textures/yayin/specularMap.png';
import normalMap from '../../../assets/textures/tooth/normalMap.png';
import specularMap from '../../../assets/textures/tooth/specularMap.png';
import envMap from '../../../assets/textures/tooth/reflectMap.png';

import woodTexture from '../../../assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_basecolor.jpg';

import { generateSphereUVs, convertTo3DArray, planeGenerateUVs, generateCylinderUVs, generateCylinderUVsWithCaps } from '../../../utils/index';




const ObjView = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 创建场景
    const scene = new THREE.Scene();


    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 20);

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);



    // 创建控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 调整光照
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // 降低环境光强度
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
    directionalLight.position.set(0, 0, 0);
    directionalLight.target.position.set(1000, 0, 0);
    scene.add(directionalLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.2);
    directionalLight.position.set(0, 0, 0);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.2);
    directionalLight.position.set(0, 0, -1000);
    scene.add(directionalLight2);



    // 添加坐标轴
    const axes = new THREE.AxesHelper(5);
    scene.add(axes);



    // 1. 创建PMREMGenerator
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envMapT = new THREE.TextureLoader().load(envMap, (t) => {
      t.mapping = THREE.EquirectangularReflectionMapping;
      t.needsUpdate = true;
      t.colorSpace = THREE.SRGBColorSpace;


      // 生成预处理的环境贴图
      const envMap = pmremGenerator.fromEquirectangular(t).texture;
      t.colorSpace = THREE.SRGBColorSpace;
      // 应用到材质
      // material.envMap = envMap;
      material.needsUpdate = true;
      material1.envMap = envMap;
      material1.needsUpdate = true;

      // 释放资源
      t.dispose();
      pmremGenerator.dispose();
    });



    const normalMapT = new THREE.TextureLoader().load(normalMap, (t) => {
      t.needsUpdate = true;
    });

    const specularMapT = new THREE.TextureLoader().load(specularMap, (t) => {
      t.needsUpdate = true;
    });


    const baseColorTexture = new THREE.TextureLoader().load(qipanMap, (t) => {
      t.needsUpdate = true;
      t.colorSpace = THREE.SRGBColorSpace;
      // t.mapping = THREE.EquirectangularReflectionMapping;

      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.center.set(0.5, 0.5);
    });


    const yayinBaseColorTexture = new THREE.TextureLoader().load(yayinMap, (t) => {
      t.needsUpdate = true;
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(1, 1);
      t.center.set(0.5, 0.5);
    });

    const yayinNormalMap = new THREE.TextureLoader().load(yayinnormalMap, (t) => {
      t.needsUpdate = true;
      t.colorSpace = THREE.SRGBColorSpace;
    });

    const yayinSpecularMap = new THREE.TextureLoader().load(yayinspecularMap, (t) => {
      t.needsUpdate = true;
      t.colorSpace = THREE.SRGBColorSpace;
    });
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const material1 = new THREE.MeshPhysicalMaterial({
      map: yayinBaseColorTexture,

      // color: 0xffffff, // 陶瓷的基色（白色或浅灰ee
      color: 0xCA706B,
      // 自发光
      // emissive: 0xCC1520,
      // emissiveIntensity: 1,
      envMap: envMapT,
      metalness: 0.1,
      // roughnessMap: yayinSpecularMap,
      roughness: 0,
      // normalMap: yayinNormalMap,
      envMapIntensity: 1,
    });
    const mesh = new THREE.Mesh(geometry, material1);
    mesh.position.set(0, 0, 0);
    // scene.add(mesh);


    // 加入网格
    const gridHelper = new THREE.GridHelper(100, 100);
    // scene.add(gridHelper);




    // 创建OBJ加载器
    const loader = new GLTFLoader();

    const material = new THREE.MeshPhysicalMaterial({
      // roughnessMap: roughnessTexture1,
      envMap: envMapT,
      clearcoat: 0.6,
      reflectivity: 0.1,
      map: baseColorTexture,
      specularColorMap: specularMapT,
      //  vertexColors: true,
      //  normalMap: normalMapT,
      color: 0xffffee, // 陶瓷的基色（白色或浅灰ee
      roughness: 0.4,  // 粗糙度（0 为光滑，1 为粗糙）
      metalness: 0.3,  // 金属感（0 为非金属，1 为金属）
      side: THREE.DoubleSide,
      bumpScale: 0.1, // 凹凸强度
      // map: baseColorTexture,
    });


    Object.entries(toothFiles).forEach(([path], index) => {
      // 加载第一个牙齿（基础材质
      loader.load(
        path,
        (object) => {
          // const gui = new dat.GUI();

          console.log(object);
          

          object.scene.traverse((child) => {


            if (child instanceof THREE.Mesh) {

              // 优化几何体
              if (child.geometry) {


                child.geometry.deleteAttribute('normal');
                /** (2) 合并顶点 */
                child.geometry = BufferGeometryUtils.mergeVertices(child.geometry);
                /** (3) 计算平滑法线 */
                child.geometry.computeVertexNormals();




              }

              if (path.includes('gum')) {
                child.material = material1;
              } else {
                child.material = material;
              }
              // 设置材质

              //      gui.add(child, 'position').onChange((value) => {
              //   console.log(value);
              //  });

              let uv: any;
              if (path.includes('gum')) {
                // uv = generateCylinderUVs(child.geometry.attributes.position.array, child);
                //  uv = generateCylinderUVs(child.geometry.attributes.position.array,child);
                 uv = generateCylinderUVs(child.geometry.attributes.position.array,child);

              // uv = planeGenerateUVs(child.geometry.attributes.position.array,child);

              } else {
                //  uv = generateSphereUVs(child.geometry.attributes.position.array,child);
                uv = generateCylinderUVs(child.geometry.attributes.position.array, child);
                //  uv = planeGenerateUVs(child.geometry.attributes.position.array,child);

              }

              // 设置uv
              child.geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));

              geometry.attributes.uv.needsUpdate = true;


            }
          });

          // if (!path.includes('gum')) {
          scene.add(object.scene);
          // }



        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
          console.error('加载OBJ文件时出错:', error);
        }
      );

    });





    const gui = new dat.GUI();
    gui.add(material, 'clearcoat', 0, 1, 0.1);
    gui.add(material, 'clearcoatRoughness', 0, 1, 0.1);
    gui.add(material, 'reflectivity', 0, 1, 0.1);

    gui.add(material, 'transmission', 0, 1, 0.1);
    gui.add(material, 'roughness', 0, 1, 0.1);
    gui.add(material, 'metalness', 0, 1, 0.1);

    gui.add(material, 'bumpScale', 0, 1, 0.1);
    gui.add(material, 'ior', 0, 1, 0.1);


    const envMapFolder = gui.addFolder('环境贴图');
    envMapFolder.open();
    envMapFolder.add(material, 'envMapIntensity', 0, 2, 0.1);


    // 旋转贴图Y baseColorTexture
    gui.add({ rotation: 0 }, 'rotation', 0, Math.PI * 2, 0.01).onChange((value) => {

      // 让贴图以x轴旋转
      baseColorTexture.rotation = value;
      baseColorTexture.needsUpdate = true;
    }).name('旋转');


    gui.add({ rotation: 0 }, 'rotation', 0, Math.PI * 2, 0.01).onChange((value) => {

      // 让贴图以x轴旋转
      yayinBaseColorTexture.rotation = value;
      yayinBaseColorTexture.needsUpdate = true;
    }).name('yayin旋转');



    gui.add(yayinBaseColorTexture.offset, 'y', 0, 1, 0.01).name('Yy');
    gui.add(yayinBaseColorTexture.offset, 'x', 0, 1, 0.01).name('Yx');


    gui.add(baseColorTexture.offset, 'y', 0, 1, 0.01).name('y');
    gui.add(baseColorTexture.offset, 'x', 0, 1, 0.01).name('x');






    // 控制平行光

    const directionalLightFolder = gui.addFolder('平行光');

    // 第一个平行光控制
    const light1Folder = directionalLightFolder.addFolder('平行光1');
    light1Folder.add(directionalLight, 'intensity', 0, 1, 0.1).name('强度');
    light1Folder.add(directionalLight.position, 'x', -1000, 1000, 10).name('X位置');
    light1Folder.add(directionalLight.position, 'y', -1000, 1000, 10).name('Y位置');
    light1Folder.add(directionalLight.position, 'z', -1000, 1000, 10).name('Z位置');

    // 第二个平行光控制
    const light2Folder = directionalLightFolder.addFolder('平行光2');
    light2Folder.add(directionalLight1, 'intensity', 0, 1, 0.1).name('强度');
    light2Folder.add(directionalLight1.position, 'x', -1000, 1000, 10).name('X位置');
    light2Folder.add(directionalLight1.position, 'y', -1000, 1000, 10).name('Y位置');
    light2Folder.add(directionalLight1.position, 'z', -1000, 1000, 10).name('Z位置');

    // 第三个平行光控制
    const light3Folder = directionalLightFolder.addFolder('平行光3');
    light3Folder.add(directionalLight2, 'intensity', 0, 1, 0.1).name('强度');
    light3Folder.add(directionalLight2.position, 'x', -1000, 1000, 10).name('X位置');
    light3Folder.add(directionalLight2.position, 'y', -1000, 1000, 10).name('Y位置');
    light3Folder.add(directionalLight2.position, 'z', -1000, 1000, 10).name('Z位置');

    // 默认展开平行光文件夹
    directionalLightFolder.open();

    // 添加红色点光源
    const redPointLight = new THREE.PointLight(0xffffff, 0.6, 1000, 0.1); // 红色,强度为1
    redPointLight.position.set(-1.7, 99, 0.9); // 放置在模型正前方
    scene.add(redPointLight);

    // 添加点光源辅助器以便于调试
    const pointLightHelper = new THREE.PointLightHelper(redPointLight);
    scene.add(pointLightHelper);

    // 在GUI中添加点光源控制
    const redLightFolder = gui.addFolder('红色点光源');
    redLightFolder.add(redPointLight, 'visible').name('显示光源');
    redLightFolder.add(pointLightHelper, 'visible').name('显示辅助器');
    redLightFolder.add(redPointLight, 'intensity', 0, 2, 0.1).name('强度');
    redLightFolder.add(redPointLight.position, 'x', -20, 20, 0.1).name('X位置');
    redLightFolder.add(redPointLight.position, 'y', -20, 20, 0.1).name('Y位置');
    redLightFolder.add(redPointLight.position, 'z', -20, 20, 0.1).name('Z位置');
    redLightFolder.add(redPointLight, 'distance', 0, 100, 1).name('照射距离');
    redLightFolder.add(redPointLight, 'decay', 0, 2, 0.1).name('衰减');
    redLightFolder.open();

    // 环境光控制
    const ambientLightFolder = gui.addFolder('环境光');
    ambientLightFolder.add(ambientLight, 'intensity', 0, 2, 0.1).name('强度');
    ambientLightFolder.addColor({ color: '#ffffff' }, 'color')
      .onChange((value) => {
        ambientLight.color.set(value);
      })
      .name('颜色');
    ambientLightFolder.open();

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
      gui.destroy();
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} />;
};

export default ObjView;
