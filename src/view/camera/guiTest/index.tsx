import React, { useEffect, useRef } from 'react';
import Renderer from '../../../utils';
import * as dat from 'dat.gui';
import * as THREE from 'three';

const Test = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(1);

    if (!mountRef.current) return;
    const Render = new Renderer(mountRef.current);

    // 创建透视相机
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    Render.init();

    Render.createCamera(camera);
    Render.controls();

    const gui = new dat.GUI();

    // 添加gui对象
    gui.add(camera.position, 'x').min(-4).max(4).step(0.01);
    gui.add(camera, 'fov').min(-4).max(100).step(1).onChange(() => {
      camera.updateProjectionMatrix(); // FOV 改变时更新投影矩阵
    });
    gui.add(camera, 'aspect').min(-4).max(4).step(0.01).onChange(() => {
      camera.updateProjectionMatrix(); // FOV 改变时更新投影矩阵
    });
    gui.add(camera, 'near').min(0.1).max(4).step(0.01).onChange(() => {
      camera.updateProjectionMatrix(); // FOV 改变时更新投影矩阵
    });
    gui.add(camera, 'far').min(1).max(200).step(1);
    gui.add(camera, 'zoom').min(1).max(20).step(0.1).onChange(e => {
      camera.updateProjectionMatrix();
      const angle = camera.getEffectiveFOV();

      console.log(angle);
    });

    const params = { color: '#1890ff', wireframe: false };

    gui.add(Render.mesh, 'visible');
    gui.addColor(params, 'color').onChange(val => {
      Render.mesh.material.forEach(m => {
        m.color.set(val);
      });
    });
    // gui.add(Render.mesh.material, 'wireframe');

    return () => {
      Render.clean();
    };
  }, []);

  return <div ref={mountRef} />;
};

export default Test;
