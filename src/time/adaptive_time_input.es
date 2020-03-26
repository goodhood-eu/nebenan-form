import React, { useEffect, useState, forwardRef } from 'react';

import TimeInput from './time_input';


const mobileDeviceRegex = /iPad|iPhone|iPod|Android|Windows Phone/;

const AdaptiveTimeInput = (props, ref) => {
  const [isMobile, setMobile] = useState(false);

  useEffect(() => {
    const mobile = mobileDeviceRegex.test(global.navigator.userAgent);
    setMobile(mobile);
  }, []);

  if (isMobile) return <input ref={ref} type="time" {...props} />;
  return <TimeInput {...props} ref={ref} />;
};

export default forwardRef(AdaptiveTimeInput);
