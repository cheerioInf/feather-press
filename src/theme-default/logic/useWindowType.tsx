import { useState, useEffect } from 'react';

export default function useWindowType() {
  const [windowType, setWindowType] = useState<'mobile' | 'ipad' | 'pc'>('pc');

  useEffect(() => {
    const handleResize = () => {
      const { innerWidth } = window;
      if (innerWidth < 768) {
        setWindowType('mobile');
      } else if (innerWidth < 1024) {
        setWindowType('ipad');
      } else {
        setWindowType('pc');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowType;
}
