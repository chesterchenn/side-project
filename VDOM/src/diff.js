function flatten(arr) {
  return [].concat.apply([], arr);
}

// 生成vdom
export function h(type, props, ...children) {
  return {
    type,
    props: props || {},
    children: flatten(children) || [],
  };
}

export function createElement(vdom) {
  if (typeof vdom === "string" || typeof vdom === "number") {
    return document.createTextNode(vdom);
  }
  const { type, props, children } = vdom;

  // 1. 创建元素
  const element = document.createElement(type);

  // 2. 属性赋值
  setProps(element, props);

  // 3. 创建子元素
  children.map(createElement).forEach(element.appendChild.bind(element));

  return element;
}

const ATTR_KEY = "__preprops_";

// 属性赋值
function setProps(element, props) {
  // 属性赋值
  element[ATTR_KEY] = props;

  for (let key in props) {
    element.setAttribute(key, props[key]);
  }
}

export const diff = (oldVNode, newVNode, parent, index = 0) => {
  const element = parent.childNodes[index];

  // 新建 node
  if (oldVNode === undefined) {
    console.log("create");
    parent.appendChild(createElement(newVNode));
    return;
  }

  // 删除 node
  if (newVNode === undefined) {
    console.log("delete");
    parent.removeChild(element);
    return;
  }

  // 替换 node
  if (!isSameType(oldVNode, newVNode)) {
    console.log("repalce");
    parent.replaceChild(createElement(newVNode), element);
    return;
  }
  // 更新 node
  //
  if (element.nodeType === Node.ELEMENT_NODE) {
    // 比较 props 的变化
    diffProps(oldVNode, newVNode, element);

    // 比较 children 的变化
    diffChildren(oldVNode, newVNode, element);
  }
};

// 比较 props 的变化
function diffProps(oldVNode, newVNode, element) {
  const allProps = { ...oldVNode.props, ...newVNode.props };

  // 获取新旧所有属性名后，再逐一判断新旧属性值
  Object.keys(allProps).forEach((key) => {
    if (key === undefined) return null;
    const oldValue = oldVNode.props[key];
    const newValue = newVNode.props[key];

    // 删除属性
    if (key !== "children" && newValue === undefined) {
      element.removeAttribute(key);
    } else if (
      key !== "children" &&
      (oldValue === undefined || oldValue !== newValue)
    ) {
      element.setAttribute(key, newValue);
    }
  });
}

// 比较 children 的变化
function diffChildren(oldVNode, newVNode, parent) {
  const childLength = Math.max(
    oldVNode.children.length,
    newVNode.children.length
  );

  // 遍历并 diff 子元素
  for (let i = 0; i < childLength; i++) {
    diff(oldVNode.children[i], newVNode.children[i], parent, i);
  }
}

function isSameType(oldVNode, newVNode) {
  if (oldVNode.type === "TEXT_ELEMENT" && newVNode.type === "TEXT_ELEMENT") {
    if (oldVNode.props.nodeValue === newVNode.props.nodeValue) {
      return true;
    } else {
      return false;
    }
  }

  if (oldVNode.type === newVNode.type) {
    return true;
  }
  return false;
}
