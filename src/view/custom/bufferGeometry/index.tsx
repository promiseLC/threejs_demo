
import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';



const CustomBufferGeometry = () => {
    const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    
    if(!containerRef.current) return;

        const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

      const renderer = new THREE.WebGLRenderer({
          antialias: true,
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    
    
    containerRef.current?.appendChild(renderer.domElement);
    
    const geometry = new THREE.BufferGeometry();

    const vertices = new Float32Array([
      0, 0, 0,
      5, 0, 0,
      0, -5, 0,
      5, -5, 0,
      0, 0, 5,
      5, 0, 5,
      0, -5, 5,
      5, -5, 5, 
    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));


    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      side: THREE.DoubleSide,
      // wireframe: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    camera.position.z = 5;

    camera.lookAt(mesh.position);



      const animate = () => {
        renderer.render(scene, camera);

        requestAnimationFrame(animate);
      }

      animate();



    }, []);
    return (
        <div ref={containerRef}></div>
    )
}

export default CustomBufferGeometry;