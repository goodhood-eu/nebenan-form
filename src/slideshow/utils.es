import { getMedia, media } from 'nebenan-helpers/lib/utils/dom';


export const BOUNDARIES_EXCESS = 40;
export const DISABLE_SCROLL_DISTANCE = 10;
export const SWIPE_TRIGGER_DISTANCE = 20;

export const getItemWidth = (win, sceneWidth, props) => {
  let mediaType = 'Mobile';
  if (getMedia(win, media.mediaM)) mediaType = 'Tablet';
  if (getMedia(win, media.mediaL)) mediaType = 'Desktop';

  return sceneWidth / props[`visible${mediaType}`];
};

export const getGridPosition = (position, sceneWidth, direction) => {
  let gridPosition = position - (position % sceneWidth);
  if (direction > 0) gridPosition -= sceneWidth;
  return gridPosition;
};

export const getSectionsCount = (sceneWidth, listWidth) => (
  Math.ceil(listWidth / sceneWidth) || 1
);

export const getActiveSection = (position, sceneWidth) => (
  Math.round(Math.abs(position / sceneWidth))
);

export const isItemWidthChanged = (prevProps, props) => {
  if (prevProps.visibleMobile !== props.visibleMobile) return true;
  if (prevProps.visibleTablet !== props.visibleTablet) return true;
  if (prevProps.visibleDesktop !== props.visibleDesktop) return true;

  return false;
};

export const getPositionOptions = () => ({
  animated: true,
});
