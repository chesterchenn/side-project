import { h, diff, createElement } from "vdom";

let state = { num: 5 };
let timer;
let preVDom;

/** @jsx createElement */
function view() {
  return (
    <div>
      <ul>
        {[...Array(state.num).keys()].map((i) => (
          <li id={i} class={`li-${i}`}>
            第{i * state.num}
          </li>
        ))}
      </ul>
    </div>
  );
}

function tick(element) {
  if (state.num > 20) {
    clearTimeout(timer);
    return;
  }
  const newVDOM = view();

  diff(preVDom, newVDOM, element);
}

function render(element) {
  const vdom = view();
  preVDom = vdom;

  const dom = createElement(vdom);
  element.appendChild(dom)

  timer = setInterval(() => {
    state.num += 1;
    tick(element);
  }, 500);
}

render(renderRoot)
