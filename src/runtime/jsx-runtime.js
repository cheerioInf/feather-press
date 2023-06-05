import * as jsxRuntime from 'react/jsx-runtime';

const originJsx = jsxRuntime.jsx;
const originJsxs = jsxRuntime.jsxs;

export const data = {
  islandProps: [],
  islandToPathMap: {}
};

const internalJsx = (jsx, type, props, ...args) => {
  // 如果发现有 __island 这个 prop，则视为一个 Island 组件，记录下来
  if (props && props.__island) {
    data.islandProps.push(props);
    const id = type.name;
    data['islandToPathMap'][id] = props.__island;

    delete props.__island;
    return jsx('div', {
      __island: `${id}:${data.islandProps.length - 1}`,
      children: jsx(type, props, ...args)
    });
  }
  // 否则走原始的 jsx/jsxs 方法
  return jsx(type, props, ...args);
};

// 下面是我们自定义的 jsx 和 jsxs
export const jsx = (...args) => internalJsx(originJsx, ...args);

export const jsxs = (...args) => internalJsx(originJsxs, ...args);

export const Fragment = jsxRuntime.Fragment;

export const clearIslandData = () => {
  data.islandProps = [];
  data.islandToPathMap = {};
};
