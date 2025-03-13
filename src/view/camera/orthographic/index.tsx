import { useRef, useEffect } from 'react';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as THREE from 'three';

const OrthographicCameraDemo = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();

    // 创建相机

    const camera = new THREE.OrthographicCamera(
      window.innerWidth / -200,
      window.innerWidth / 200,
      window.innerHeight / 200,
      window.innerHeight / -200,
      0.1,
      1000
    );

    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    // 创建几何体
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    // 创建材质
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    // 创建网格
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);

    // 将网格添加到场景中

    scene.add(mesh);

    const controls = new OrbitControls(camera, renderer.domElement);

    // 光源
    const light = new THREE.DirectionalLight(0xffffff, 1);

    light.position.set(0, 0, 10);

    // scene.add(light);

    // 设置渲染器大小
    renderer.setSize(window.innerWidth, window.innerHeight);

    mountRef.current.appendChild(renderer.domElement);

    const animate = () => {
      // mesh.rotation.x += 0.01;
      // mesh.rotation.y += 0.01;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return <div ref={mountRef} />;
};

export default OrthographicCameraDemo;
