const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const { JSDOM } = require('jsdom');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');


chai.use(chaiAsPromised);
enzyme.configure({ adapter: new Adapter() });

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window: win } = jsdom;

const copyProps = (src, target) => {
  const check = (prop) => typeof target[prop] === 'undefined';
  const collect = (acc, prop) => ({
    ...acc,
    [prop]: Object.getOwnPropertyDescriptor(src, prop),
  });

  const props = Object.getOwnPropertyNames(src).filter(check).reduce(collect, {});
  Object.defineProperties(target, props);
};

global.window = win;
global.document = win.document;
global.navigator = {
  userAgent: 'node.js',
};

copyProps(win, global);
