import { useEffect, useRef } from 'react';

import { $ } from '../../../utils';
const Basic = () => {
  useEffect(() => {
    $.init();
  }, []);

  return <canvas id="c" />;
};

export default Basic;
