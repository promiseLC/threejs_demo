import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import * as dat from 'dat.gui';
// 导入/src/assets/tooth文件夹下所有文件
const toothFiles = import.meta.glob('/src/assets/tooth/*.obj');
import HDR from '../../../assets/textures/rectangular/san_giuseppe_bridge_2k.hdr';
import HDR1 from '../../../assets/textures/rectangular/warm_restaurant_night_1k.hdr';
import HDR2 from '../../../assets/textures/rectangular/vestibule_1k.hdr';
import HDR3 from '../../../assets/textures/rectangular/zhou1.hdr';
import HDR4 from '../../../assets/textures/rectangular/zhou2.hdr';
import HDR5 from '../../../assets/textures/rectangular/zhou3.hdr';
import HDR6 from '../../../assets/textures/rectangular/pine_attic_1k.hdr';
import HDR7 from '../../../assets/textures/rectangular/creepy_bathroom_1k.hdr';
import HDR8 from '../../../assets/textures/rectangular/industrial_workshop_foundry_1k.hdr';
import HDR9 from '../../../assets/textures/rectangular/school_hall_1k.hdr';
import toothMap from '../../../assets/textures/tooth/map.png';

import woodTexture from '../../../assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_basecolor.jpg';

import nx from '../../../assets/textures/Standard-Cube-Map/nx.png';
import ny from '../../../assets/textures/Standard-Cube-Map/ny.png';
import nz from '../../../assets/textures/Standard-Cube-Map/nz.png';
import px from '../../../assets/textures/Standard-Cube-Map/px.png';
import py from '../../../assets/textures/Standard-Cube-Map/py.png';
import pz from '../../../assets/textures/Standard-Cube-Map/pz.png';

// 引入HDR
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import roughnessTexture from '../../../assets/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_roughness.jpg';

import leftTexture from '../../../assets/textures/fullscreen/1.left.jpg';
import rightTexture from '../../../assets/textures/fullscreen/1.right.jpg';
import topTexture from '../../../assets/textures/fullscreen/1.top.jpg';
import bottomTexture from '../../../assets/textures/fullscreen/1.bottom.jpg';
import frontTexture from '../../../assets/textures/fullscreen/1.front.jpg';
import backTexture from '../../../assets/textures/fullscreen/1.back.jpg'; 
import { FlakesTexture } from 'three/examples/jsm/Addons.js';






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

    // const light = new THREE.HemisphereLight(0x0fff00, 0x080888, 0.5);
    
// scene.add( light );

    // 创建控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 调整光照
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 降低环境光强度
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
    directionalLight.position.set(0, 0, 0);
    directionalLight.target.position.set(1000, 0, 0);
    scene.add(directionalLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0 , 0, 0);
    scene.add(directionalLight1);

          const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(0, 0, -1000);
    scene.add(directionalLight2);
    


    // 添加坐标轴
    const axes = new THREE.AxesHelper(5);
    scene.add(axes);


    const roughnessTexture1 = new THREE.TextureLoader().load(roughnessTexture, (t) => {
          t.needsUpdate = true;
    });
   
    
    const baseColorTexture = new THREE.TextureLoader().load(toothMap, (t) => {
      t.needsUpdate = true;
      // t.colorSpace = THREE.SRGBColorSpace;
    });


     const baseColorTexture1 = new THREE.TextureLoader().load(woodTexture, (t) => {
      t.needsUpdate = true;
      t.colorSpace = THREE.SRGBColorSpace;
    });
  

    
    
    
    
    
    
          const normalTexture = new THREE.CanvasTexture(new FlakesTexture());

          normalTexture.wrapS = THREE.RepeatWrapping;
          normalTexture.wrapT = THREE.RepeatWrapping;
          normalTexture.repeat.set(10, 6);



    
      const rgbeLoader = new RGBELoader();
    const hdrT = rgbeLoader.load(HDR, (texture) => {
      
      texture.mapping = THREE.EquirectangularReflectionMapping;
    });
    
        const hdrT1 = rgbeLoader.load(HDR1, (texture) => {
      
        texture.mapping = THREE.EquirectangularReflectionMapping;
    });

    const hdrT2 = rgbeLoader.load(HDR2, (texture) => {
      
      texture.mapping = THREE.EquirectangularReflectionMapping;
    });


        const hdrT3 = rgbeLoader.load(HDR3, (texture) => {
      
      texture.mapping = THREE.EquirectangularReflectionMapping;
        });
    
        const hdrT4 = rgbeLoader.load(HDR4, (texture) => {
      
      texture.mapping = THREE.EquirectangularReflectionMapping;
        });
    
        const hdrT5 = rgbeLoader.load(HDR5, (texture) => {
      
      texture.mapping = THREE.EquirectangularReflectionMapping;
    });

        const hdrT6 = rgbeLoader.load(HDR6, (texture) => {
      
      texture.mapping = THREE.EquirectangularReflectionMapping;
    });

        const hdrT7 = rgbeLoader.load(HDR7, (texture) => {
      
      texture.mapping = THREE.EquirectangularReflectionMapping;
        });
    
        const hdrT8 = rgbeLoader.load(HDR8, (texture) => {
      
      texture.mapping = THREE.EquirectangularReflectionMapping;
        });
    
        const hdrT9 = rgbeLoader.load(HDR9, (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;



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

    const environmentMap1 = cubeTextureLoader.load([
      px,
      nx,
      py,
      ny,
      pz,
      nz,

    ], () => {
          console.log('环境贴图加载成功');
    },   (progress) => {
        console.log('环境贴图加载进度:', (progress.loaded / progress.total * 100) + '%');
    },
    (error) => {
        console.error('环境贴图加载失败:', error);
    });


    const asbValue = (a:number, b:number) => {
      return Math.abs(Math.abs(a)-Math.abs(b));
    }
    


    // 创建OBJ加载器
    const loader = new OBJLoader();
    
   const material = new THREE.MeshPhysicalMaterial({
     // roughnessMap: roughnessTexture1,
     clearcoat: 0.6,
     reflectivity: 0.1,
    //  envMap: hdrT4,
    //  map: baseColorTexture1,
     vertexColors: true,
    envMapIntensity: 1,
    color: 0xffffee, // 陶瓷的基色（白色或浅灰ee
    roughness: 0.4,  // 粗糙度（0 为光滑，1 为粗糙）
    metalness: 0.3,  // 金属感（0 为非金属，1 为金属）
    side: THREE.DoubleSide,
    bumpScale: 0.1, // 凹凸强度
    // map: baseColorTexture,
            });

    
       const material1 = new THREE.MeshPhysicalMaterial({
     // roughnessMap: roughnessTexture1,
     clearcoat: 0.6,
     reflectivity: 0.1,
    //  envMap: hdrT4,
    //  map: baseColorTexture1,
    //  vertexColors: true,
    envMapIntensity: 1,
    color: 0xCA706B, // 陶瓷的基色（白色或浅灰ee
    roughness: 0.2,  // 粗糙度（0 为光滑，1 为粗糙）
    metalness: 0.2,  // 金属感（0 为非金属，1 为金属）
    side: THREE.DoubleSide,
    bumpScale: 0.1, // 凹凸强度
    // map: baseColorTexture,
            });
       
            
    
Object.entries(toothFiles).forEach(([path],index) => {
   // 加载第一个牙齿（基础材质
    loader.load(
      path,
      (object) => {
        // const gui = new dat.GUI();
        

        object.traverse((child) => {
          
          if (child instanceof THREE.Mesh) {


            const center =  new THREE.Box3().setFromObject(child).getCenter(new THREE.Vector3());
            const min = new THREE.Box3().setFromObject(child).min;
            const max = new THREE.Box3().setFromObject(child).max;

            const all = max.distanceTo(min)/2;

            if (index===0&&!path.includes('gum')) {
              console.log(all);
              
            }
          
            // 优化几何体
            if (child.geometry) {



              // 拿到模型顶点信息,并根据xy坐标做颜色渐变 由黄色渐变为白色
              
              const positions = child.geometry.attributes.position;
              const colors = new Float32Array(positions.count * 3);


              // 根据z坐标做颜色渐变 由黄色渐变为白色





              const color = new THREE.Color(0xF8C554);
              const color1 = new THREE.Color(0xeeeeee);
              // 将color渐变为白色


              for (let i = 0; i < positions.count; i++) {
                const x = positions.getX(i);
                const y = positions.getY(i);
                const z = positions.getZ(i);



                const [cx, cy, cz] = [center.x, center.y, center.z];

                const distance = center.distanceTo(new THREE.Vector3(x, y, z));
                
                const a = distance/all;

                // 两个数最小值
                const min = Math.max( (1-a)/10+0.7,0.8);


                

                const afterColor = new THREE.Color().copy(color).lerp(color1,min);
                const afterColor1 = new THREE.Color().copy(color).lerp(color1,0.9);


                

                // if ( z + 1000 < mid + 1000 && z + 1000 >= cz + 1000 && i % 2 === 0) {
                // colors[i * 3] = afterColor.r;
                // colors[i * 3 + 1] = afterColor.g;
                //   colors[i * 3 + 2] = afterColor.b;
                //   console.log(1);
                  
                // } else {
                //   colors[i * 3] = afterColor1.r;
                // colors[i * 3 + 1] = afterColor1.g;
                // colors[i * 3 + 2] = afterColor1.b;
                // }

                if (z+1000 > cz+1000) {
                colors[i * 3] = afterColor.r;
                colors[i * 3 + 1] = afterColor.g;
                colors[i * 3 + 2] = afterColor.b;
                } else if(z+1000 === cz+1000) {
                      colors[i * 3] = afterColor.r;
                colors[i * 3 + 1] = afterColor.g;
                colors[i * 3 + 2] = afterColor.b;
        }else {
               colors[i * 3] = afterColor1.r;
                colors[i * 3 + 1] = afterColor1.g;
                colors[i * 3 + 2] = afterColor1.b;
                }

               
              }
              child.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));


              
        child.geometry.deleteAttribute('normal');
        /** (2) 合并顶点 */
        child.geometry = BufferGeometryUtils.mergeVertices(child.geometry);
        /** (3) 计算平滑法线 */
              child.geometry.computeVertexNormals();


            }
            // 设置材质


            if (path.includes('gum')) {
              child.material = material1; 
            }else{
              child.material = material; 
            }

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
    
     gui.add(material, 'envMap', [
      'none', 'environmentMap', 'environmentMap1', 'hdrT', 'hdrT1', 'hdrT2', 'hdrT3', 'hdrT4', 'hdrT5', 'hdrT6', 'hdrT7', 'hdrT8', 'hdrT9',
    ]).onChange(val => {
      if (val === 'none') {
        material.envMap = null;
      } else if (val === 'environmentMap') {

        material.envMap = environmentMap;
      } else if (val === 'environmentMap1') {

        material.envMap = environmentMap1;
      } else if (val === 'hdrT') {

        material.envMap = hdrT;
      } else if (val === 'hdrT1') {

        material.envMap = hdrT1;
      } else if (val === 'hdrT2') {

        material.envMap = hdrT2;
      } else if (val === 'hdrT3') {

        material.envMap = hdrT3;
      } else if (val === 'hdrT4') {

        material.envMap = hdrT4;
      } else if (val === 'hdrT5') {

        material.envMap = hdrT5;
      } else if (val === 'hdrT6') {

        material.envMap = hdrT6;
      } else if (val === 'hdrT7') {

        material.envMap = hdrT7;
      } else if (val === 'hdrT8') {

        material.envMap = hdrT8;
      } else if (val === 'hdrT9') {

        material.envMap = hdrT9;
      }
      material.needsUpdate = true;
    }).name('切换环境贴图');

    const mapFolder = gui.addFolder('贴图');
    mapFolder.open();
    mapFolder.add({ rotation: 0 }, 'rotation', -Math.PI, Math.PI).onChange((value) => {
      if(hdrT9) {
        hdrT9.rotation = value;
        hdrT9.needsUpdate = true;
      } else {
         if(baseColorTexture) {
        baseColorTexture.rotation = value;
        baseColorTexture.needsUpdate = true;
      }
      }

     

    });

    // const pointLightFolder = gui.addFolder('点光源');
    // // gui控制点光源颜色
    // pointLightFolder.addColor(pointLight, 'color').onChange((value) => {

    //   pointLight.color= value;
      
    // });

    // pointLightFolder.open();


// pointLightFolder.add(pointLight, 'intensity', 0, 1, 0.1).name('P1强度');

// pointLightFolder.add(pointLight.position, 'x', -100, 100, 0.1).name('P1X').onChange(val => {
//   pointLight.position.x = val;
//   pointHelper.update();
// });
// pointLightFolder.add(pointLight.position, 'y', -100, 100, 0.1).name('P1Y').onChange(val => {
//   pointLight.position.y = val;
//   pointHelper.update();
// });
// pointLightFolder.add(pointLight.position, 'z', -100, 100, 0.1).name('P1Z').onChange(val => {
//   pointLight.position.z = val;
//   pointHelper.update();
// });
// pointLightFolder.add(pointLight, 'distance', 0, 10000, 0.1).name('P1照射距离');
    // pointLightFolder.add(pointLight, 'decay', 0, 20, 0.1).name('P1衰退量');
    
   


    
    
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
    ambientLightFolder.addColor({color: '#ffffff'}, 'color')
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
