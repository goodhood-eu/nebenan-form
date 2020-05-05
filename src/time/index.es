import React, { useEffect, useState, forwardRef } from 'react';

import Time from './time';
import Input from '../input';


const MEDIA_M = '(min-width: 690px)';
const getMedia = (node, query) => node.matchMedia(query).matches;

export const useMediumScreen = (defaultState) => {
  const [value, setValue] = useState(defaultState);

  useEffect(() => {
    setValue(getMedia(global, MEDIA_M));
  }, []);

  return value;
};

const AdaptiveTimeInput = forwardRef((props, ref) => {
  const isMediumScreen = useMediumScreen(true);

  if (isMediumScreen) return <Time {...props} ref={ref} />;
  return <Input {...props} className="c-time-native" ref={ref} type="time" />;
});

export default AdaptiveTimeInput;
