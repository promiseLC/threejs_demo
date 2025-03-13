import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const Basic = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  // 创建相机
  const createCamera = () => {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
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
      const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(Math.random() * 0x00ffff) });
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

  const createHelper = (scene: THREE.Scene) => {
    const axesHelper = new THREE.AxesHelper(4);

    const gridHelper = new THREE.GridHelper(100, 50, 0xcd37aa, 0xffffff);

    scene.add(axesHelper);
    scene.add(gridHelper);
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = createScene();

    const camera = createCamera();

    camera.lookAt(scene.position);

    const cube = createGeometry();

    scene.add(cube);

    const renderer = createRenderer();

    mountRef.current.appendChild(renderer.domElement);

    createHelper(scene);

    renderer.render(scene, camera);

    const controls = new OrbitControls(camera, renderer.domElement);

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
      controls.dispose();
      renderer.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div ref={mountRef} />;
};

export default Basic;
