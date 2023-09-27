import { useState, useEffect } from 'react';
import { MOBILE_WIDTH } from '../constants';

export default function isMobile() {
  if (typeof window !== 'undefined') {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return width <= MOBILE_WIDTH;
  }
}
