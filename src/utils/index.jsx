export const bindTo = (context, ...funcs) => funcs.forEach((func) => {
  if (context[func]) context[func] = context[func].bind(context);
});

export const has = (...args) => Object.prototype.hasOwnProperty.call(...args);

export const invoke = (fn, ...args) => {
  if (typeof fn === 'function') return fn(...args);
};

export const objectPropsMatch = (obj1, obj2, props = []) => (
  props.every((key) => obj1[key] === obj2[key])
);
