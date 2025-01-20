export function setAttributes(el, attrs) {
  const { class: className, style, ...rest } = attrs;

  if (className) { setClass(el, className) };
  if (style) {
    Object.entries(style).forEach(([prop, value]) => { setStyle(el, prop, value) });
  }
  
  for (const [name, value] of Object.entries(rest)) {
    setAttribute(el, name, value);
  }
}

export function setAttribute(el, name, value) {
  if (value === null) { //TODO: undefined may broke this equality
    removeAttribute(el, name);
  } else if (name.startsWith("data-")) {
    el.setAttribute(name, value);
  } else {
    el[name] = value;
  }
}

export function removeAttribute(el, name) {
  el[name] = null;
  el.removeAttribute(name);
}



function setClass(el, className) {
  el.className = "";

  if (typeof className == "string") { 
    el.className = className 
  };
  
  if (Array.isArray(className)) { 
    el.classList.add(...className) 
  };
}


export function setStyle(el, name, value) {
  el.style[name] = value;
}

export function removeStyle(el, name) {
  el.style[name] = null;
}


