import React, { useEffect, useState, forwardRef } from 'react';

import Time from './time';
import Input from '../input';


const mobileDeviceRegex = /iPad|iPhone|iPod|Android|Windows Phone/;

const AdaptiveTimeInput = (props, ref) => {
  const [isMobile, setMobile] = useState(false);

  useEffect(() => {
    const mobile = mobileDeviceRegex.test(global.navigator.userAgent);
    setMobile(mobile);
  }, []);

  if (isMobile) return <Input {...props} ref={ref} type="time" />;
  return <Time {...props} ref={ref} />;
};

export default forwardRef(AdaptiveTimeInput);
