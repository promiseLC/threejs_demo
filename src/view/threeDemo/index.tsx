import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';

const ThreeScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  

  useEffect(() => {
    
    if (!mountRef.current) return;

    // 创建性能监视器
    const stats = new Stats();

    // 创建场景
    const scene = new THREE.Scene();

    // 设置监视器面板，传入面板id（0: fps, 1: ms, 2: mb）
    stats.showPanel(0);
    
    // 设置stats的样式
    stats.dom.style.position = 'absolute';
    stats.dom.style.top = '0px';
    stats.dom.style.left = '0px';

    // 将监视器添加到页面中
    mountRef.current.appendChild(stats.dom);

    const statsTick = () => {
      stats.update();
      requestAnimationFrame(statsTick);
    }

    statsTick();

    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // 设置相机位置
    camera.position.set(0, 0, 5); // 相机默认的坐标是在(0,0,0);

    // 设置相机方向,将相机朝向场景
      // camera.lookAt(scene.position); 
    
    // camera.position.z = 5;
    // camera.position.y = 2;
    // camera.position.x = 2;
    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    // 设置渲染器大小
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 设置渲染器的像素比,使其与设备的像素比相匹配,以获得更清晰的显示效果
    // 在高分辨率显示器(如Retina屏幕)上特别有用,可以避免画面模糊
    renderer.setPixelRatio(window.devicePixelRatio);

    mountRef.current.appendChild(renderer.domElement);

    // 创建立方体
    const geometry = new THREE.BoxGeometry(2, 2, 2);

    const mats = [];

   for (let index = 0; index < geometry.groups.length; index++) {
      // 生成材质 , 每个面可以是不同的材质,也可以是不同的颜色
      const material = new THREE.MeshLambertMaterial({ color: new THREE.Color(Math.random() * 0xffffff) });
       mats.push(material);
   }
    
    // 创建材质 单一材质和颜色
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // 使用漫反射材质
    // const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });

    // 使用网格创建立方体&&加入材质 生层物体对象
    const cube = new THREE.Mesh(geometry, mats);


    cube.rotation.set(0, 0, 0, 'XYZ'); // 'XYZ' 表示旋转顺序的字符串 默认为 xyz


    cube.scale.set(1, 1, 1); // 物体缩放

// const clock = new THREE.Clock();
//   const cubeTick = () => {
//   const currentTime = Date.now();
//   const elapsedTime = clock.getElapsedTime(); // 两次渲染时间间隔


//   cube.position.y = Math.sin(elapsedTime); 
//   cube.position.x = Math.cos(elapsedTime); 
//   renderer.render(scene, camera);
//   window.requestAnimationFrame(cubeTick);
// }

//     cubeTick();

    // 相机做圆规运动

    const clock = new THREE.Clock();
    const cameraTick = () => {


      if (cube.position.x > 10) {
        cube.position.x = 0;
      } else {
        cube.position.x += 0.01;
      }
      
      renderer.render(scene, camera);
      window.requestAnimationFrame(cameraTick);
    }
    cameraTick();


    // 添加网格辅助线
    const gridHelper = new THREE.GridHelper(window.innerWidth, window.innerHeight, 0xcd37aa, 0xffffff);
    
    scene.add(gridHelper);


    // 添加控制器

    const controls = new OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true; // 启用拖拽惯性效果

    controls.enableZoom = false;

 // 启用惯性渲染
    const tick = () => {
      
      // update objects
      controls.update();
      // 重新渲染整个场景
      renderer.render(scene, camera);
      // 使用 requestAnimationFrame 进行下一帧的渲染
      requestAnimationFrame(tick);
    };

    tick();

    // 创建全局光源
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);
    scene.add(cube);

    // 添加方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);

    scene.add(directionalLight);


    // 创建坐标系

    const axesHelper = new THREE.AxesHelper(4);

    scene.add(axesHelper);


    // 动画函数
    const animate = () => {
      // requestAnimationFrame(animate);

      // 旋转立方体
      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    // animate();

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

  return <div style={{position: 'relative'}} ref={mountRef} />;
}; 

export default ThreeScene;
