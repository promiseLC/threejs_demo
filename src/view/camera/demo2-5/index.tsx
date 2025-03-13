import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { HeartCurve } from 'three/examples/jsm/curves/CurveExtras.js';

const Basic = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  // 创建相机
  const createCamera = () => {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 20);
    return camera;
  };

  // 创建正交相机
  const createOrthographicCamera = () => {
    const size = 4;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 3);
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

    // const gridHelper = new THREE.GridHelper(100, 50, 0xcd37aa, 0xffffff);

    const cameraHelper = new THREE.CameraHelper(camera);

    scene.add(axesHelper);
    // scene.add(gridHelper);
    scene.add(cameraHelper);
    return cameraHelper;
  };

  useEffect(() => {
    if (!mountRef.current) return;

    let Index = 0;

    const scene = createScene();

    const Pcamera = createCamera();

    Pcamera.lookAt(scene.position);

    const Ocamera = createOrthographicCamera();

    Ocamera.lookAt(scene.position);

    const cube = createGeometry();

    scene.add(Pcamera);
    scene.add(Ocamera);

    let camera: any = Pcamera;

    scene.add(cube);

    // 创建曲线
    const curve = new HeartCurve(0.5);
    const tubeGeometry = new THREE.TubeGeometry(curve, 200, 0.01, 8, true);
    const basicMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const tubeMesh = new THREE.Mesh(tubeGeometry, basicMaterial);
    scene.add(tubeMesh);

    camera.updateProjectionMatrix();

    const points = curve.getPoints(3000);
    // 分割点计数
    let count = 0;

    const renderer = createRenderer();

    mountRef.current.appendChild(renderer.domElement);

    const cameraHelper = createHelper(scene, Ocamera);

    let controls = new OrbitControls(camera, renderer.domElement);

    const gui = new dat.GUI();

    const params = {
      switchCamera() {
        controls.dispose(); // 销毁旧的控制器
        if (Index === 1) {
          camera = Pcamera; // 切换相机
          Index = 0;
        } else {
          console.log(22);

          camera = Ocamera;
          Index = 1;
        }
        // 重新创建控制器
        controls = new OrbitControls(camera, renderer.domElement);
      },
    };
    gui.add(Ocamera.position, 'x').min(-10).max(10).step(0.01);

    gui.add(Ocamera, 'zoom').min(0.1).max(4).step(0.1).onChange(zoom => {
      console.log(zoom);
      Ocamera.updateProjectionMatrix();
      cameraHelper.update();
    });

    gui.add(Ocamera, 'near').min(0.001).max(4).step(0.01).onChange(val => {
      Ocamera.near = val;
      Ocamera.updateProjectionMatrix();
      cameraHelper.update();
    });
    gui.add(Ocamera, 'far').min(0.1).max(40).step(0.1).onChange(val => {
      Ocamera.far = val;
      Ocamera.updateProjectionMatrix();
      cameraHelper.update();
    });

    gui.add(params, 'switchCamera');

    renderer.render(scene, camera);

    controls.enableDamping = true;

    const tick = () => {
      const index = count % 3000;
      const point = points[index];

      const nextPoint = points[index + 1 > 3000 ? 0 : index + 1];

      // console.log(point, nextPoint);

      Ocamera.position.set(point.x, point.y, point.z);
      Ocamera.lookAt(nextPoint.x, nextPoint.y, nextPoint.z);
      Ocamera.updateProjectionMatrix();
      count++;

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
