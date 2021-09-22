import { createElement } from "./createElement";
import { render } from "./render";

export const diff = (oldVNode, newVNode, parent, oldVDOM, index = 0) => {
  // 新建 node
  if (oldVNode === undefined) {
    console.log("create");
    console.log(oldVNode, newVNode);
    Object.assign(oldVDOM, oldVNode)
    render(oldVDOM, parent);
    return;
  }

  // const element = parent.childNodes[index];
  const element = oldVNode.props.children[index];

  // 删除 node
  if (newVNode === undefined) {
    console.log("delete");
    parent.removeChild(element);
    return;
  }

  // 替换 node
  if (!isSameType(oldVNode, newVNode)) {
    console.log("repalce");
    console.log(oldVNode, newVNode, oldVDOM);
    Object.assign(oldVDOM, oldVNode)
    render(oldVDOM, parent);
    return newVNode;
  }
  // 更新 node
  if (oldVNode.type !== "TEXT_ELEMENT") {
    // 比较 props 的变化
    diffProps(oldVNode, newVNode, parent);

    // 比较 children 的变化
    diffChildren(oldVNode, newVNode, parent, oldVDOM);
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
function diffChildren(oldVNode, newVNode, parent, oldVDOM) {
  // 获取子元素最大长度
  const childLength = Math.max(
    oldVNode.props.children.length,
    newVNode.props.children.length
  );

  // 遍历并 diff 子元素
  for (let i = 0; i < childLength; i++) {
    diff(
      oldVNode.props.children[i],
      newVNode.props.children[i],
      parent,
      oldVDOM,
      i
    );
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
