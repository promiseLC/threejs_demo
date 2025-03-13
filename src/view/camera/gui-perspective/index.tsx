import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import * as dat from 'dat.gui';

const Basic = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  // 创建相机
  const createCamera = () => {
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(1, 0, 10);
    return camera;
  };

  // 创建场景
  const createScene = () => {
    const scene = new THREE.Scene();
    return scene;
  };

  // 创建几何体
  const createGeometry = () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    let faces = [];

    for (let i = 0; i < geometry.groups.length; i++) {
      // 重新生成新的材质
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(Math.random() * 0x00ffff),
      });
      faces.push(material);
    }

    const cube = new THREE.Mesh(geometry, faces);

    return cube;
  };

  const createRenderer = () => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    return renderer;
  };

  const createHelper = (scene: THREE.Scene, camera: THREE.Camera) => {
    const axesHelper = new THREE.AxesHelper(4);

    const gridHelper = new THREE.GridHelper(100, 50, 0xcd37aa, 0xffffff);

    const cameraHelper = new THREE.CameraHelper(camera);

    scene.add(axesHelper);
    scene.add(gridHelper);
    scene.add(cameraHelper);
    return cameraHelper;
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = createScene();

    const Pcamera = createCamera();

    Pcamera.lookAt(scene.position);

    const cube = createGeometry();

    scene.add(Pcamera);

    let camera: any = Pcamera;

    scene.add(cube);

    const renderer = createRenderer();

    mountRef.current.appendChild(renderer.domElement);

    const cameraHelper = createHelper(scene, camera);

    let controls = new OrbitControls(camera, renderer.domElement);

    const gui = new dat.GUI();

    // const params = {
    //   switchCamera() {
    //     controls.dispose(); // 销毁旧的控制器
    //     if (camera.type === 'OrthographicCamera') {
    //       camera = Pcamera; // 切换相机
    //     } else {
    //       camera = Ocamera;
    //     }
    //     // 重新创建控制器
    //     controls = new OrbitControls(camera, renderer.domElement);
    //   },
    // };

    gui.add(camera.position, 'x').min(-10).max(10).step(0.01);
    gui.add(camera, 'fov').min(-4).max(100).step(1).onChange(val => {
      camera.fov = val;
      camera.updateProjectionMatrix();
      cameraHelper.update();
    });
    gui.add(camera, 'zoom').min(0.1).max(4).step(0.1).onChange(zoom => {
      console.log(zoom);
      camera.updateProjectionMatrix();
      // cameraHelper.update();
    });
    gui.add(camera, 'aspect').min(-4).max(4).step(0.01).onChange(val => {
      camera.aspect = val;
      camera.updateProjectionMatrix();
      // cameraHelper.update();
    });
    gui.add(camera, 'near').min(0.001).max(4).step(0.01).onChange(val => {
      camera.near = val;
      camera.updateProjectionMatrix();
      cameraHelper.update();
    });
    gui.add(camera, 'far').min(0.1).max(40).step(0.1).onChange(val => {
      camera.far = val;
      camera.updateProjectionMatrix();
      cameraHelper.update();
    });

    // gui.add(params, 'switchCamera');

    renderer.render(scene, camera);

    controls.enableDamping = true;

    const tick = () => {
      controls.update();
      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    };

    tick();

    // 处理窗口大小变化
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      // controls.dispose();
      gui.destroy();
      renderer.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div ref={mountRef} />;
};

export default Basic;
