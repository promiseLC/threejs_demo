import React, { useEffect, useRef } from 'react';
import Renderer from '../../../utils';

const Test = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(1);

    if (!mountRef.current) return;
    const renderer = new Renderer(mountRef.current);
    renderer.init();

    return () => {
      renderer.clean();
    };
  }, []);

  return <div ref={mountRef} />;
};

export default Test;
