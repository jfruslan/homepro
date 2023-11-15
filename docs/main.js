// src/js/modules.js
var flsModules = {};

// src/js/functions.js
function isWebp() {
  function testWebP(callback) {
    let webP = new Image();
    webP.onload = webP.onerror = function() {
      callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  }
  testWebP(function(support) {
    let className = support === true ? "webp" : "no-webp";
    document.documentElement.classList.add(className);
  });
}
var _slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty("height") : null;
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      !showmore ? target.style.removeProperty("overflow") : null;
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(new CustomEvent("slideUpDone", {
        detail: {
          target
        }
      }));
    }, duration);
  }
};
var _slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty("height") : null;
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout(() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(new CustomEvent("slideDownDone", {
        detail: {
          target
        }
      }));
    }, duration);
  }
};
var _slideToggle = (target, duration = 500) => {
  if (target.hidden) {
    return _slideDown(target, duration);
  } else {
    return _slideUp(target, duration);
  }
};
function spollers() {
  const spollersArray = document.querySelectorAll("[data-spollers]");
  if (spollersArray.length > 0) {
    let initSpollers = function(spollersArray2, matchMedia = false) {
      spollersArray2.forEach((spollersBlock) => {
        spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
        if (matchMedia.matches || !matchMedia) {
          spollersBlock.classList.add("_spoller-init");
          initSpollerBody(spollersBlock);
        } else {
          spollersBlock.classList.remove("_spoller-init");
          initSpollerBody(spollersBlock, false);
        }
      });
    }, initSpollerBody = function(spollersBlock, hideSpollerBody = true) {
      let spollerItems = spollersBlock.querySelectorAll("details");
      if (spollerItems.length) {
        spollerItems.forEach((spollerItem) => {
          let spollerTitle = spollerItem.querySelector("summary");
          if (hideSpollerBody) {
            spollerTitle.removeAttribute("tabindex");
            if (!spollerItem.hasAttribute("data-open")) {
              spollerItem.open = false;
              spollerTitle.nextElementSibling.hidden = true;
            } else {
              spollerTitle.classList.add("_spoller-active");
              spollerItem.open = true;
            }
          } else {
            spollerTitle.setAttribute("tabindex", "-1");
            spollerTitle.classList.remove("_spoller-active");
            spollerItem.open = true;
            spollerTitle.nextElementSibling.hidden = false;
          }
        });
      }
    }, setSpollerAction = function(e) {
      const el = e.target;
      if (el.closest("summary") && el.closest("[data-spollers]")) {
        e.preventDefault();
        if (el.closest("[data-spollers]").classList.contains("_spoller-init")) {
          const spollerTitle = el.closest("summary");
          const spollerBlock = spollerTitle.closest("details");
          const spollersBlock = spollerTitle.closest("[data-spollers]");
          const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
          const scrollSpoller = spollerBlock.hasAttribute("data-spoller-scroll");
          const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
          if (!spollersBlock.querySelectorAll("._slide").length) {
            if (oneSpoller && !spollerBlock.open) {
              hideSpollersBody(spollersBlock);
            }
            !spollerBlock.open ? spollerBlock.open = true : setTimeout(() => {
              spollerBlock.open = false;
            }, spollerSpeed);
            spollerTitle.classList.toggle("_spoller-active");
            _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
            if (scrollSpoller && spollerTitle.classList.contains("_spoller-active")) {
              const scrollSpollerValue = spollerBlock.dataset.spollerScroll;
              const scrollSpollerOffset = +scrollSpollerValue ? +scrollSpollerValue : 0;
              const scrollSpollerNoHeader = spollerBlock.hasAttribute("data-spoller-scroll-noheader") ? document.querySelector(".header").offsetHeight : 0;
              window.scrollTo(
                {
                  top: spollerBlock.offsetTop - (scrollSpollerOffset + scrollSpollerNoHeader),
                  behavior: "smooth"
                }
              );
            }
          }
        }
      }
      if (!el.closest("[data-spollers]")) {
        const spollersClose = document.querySelectorAll("[data-spoller-close]");
        if (spollersClose.length) {
          spollersClose.forEach((spollerClose) => {
            const spollersBlock = spollerClose.closest("[data-spollers]");
            const spollerCloseBlock = spollerClose.parentNode;
            if (spollersBlock.classList.contains("_spoller-init")) {
              const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
              spollerClose.classList.remove("_spoller-active");
              _slideUp(spollerClose.nextElementSibling, spollerSpeed);
              setTimeout(() => {
                spollerCloseBlock.open = false;
              }, spollerSpeed);
            }
          });
        }
      }
    }, hideSpollersBody = function(spollersBlock) {
      const spollerActiveBlock = spollersBlock.querySelector("details[open]");
      if (spollerActiveBlock && !spollersBlock.querySelectorAll("._slide").length) {
        const spollerActiveTitle = spollerActiveBlock.querySelector("summary");
        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
        spollerActiveTitle.classList.remove("_spoller-active");
        _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
        setTimeout(() => {
          spollerActiveBlock.open = false;
        }, spollerSpeed);
      }
    };
    document.addEventListener("click", setSpollerAction);
    const spollersRegular = Array.from(spollersArray).filter(function(item, index, self2) {
      return !item.dataset.spollers.split(",")[0];
    });
    if (spollersRegular.length) {
      initSpollers(spollersRegular);
    }
    let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
    if (mdQueriesArray && mdQueriesArray.length) {
      mdQueriesArray.forEach((mdQueriesItem) => {
        mdQueriesItem.matchMedia.addEventListener("change", function() {
          initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
        initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
  }
}
function FLS(message) {
  setTimeout(() => {
    if (window.FLS) {
      console.log(message);
    }
  }, 0);
}
function uniqArray(array) {
  return array.filter(function(item, index, self2) {
    return self2.indexOf(item) === index;
  });
}
function dataMediaQueries(array, dataSetValue) {
  const media = Array.from(array).filter(function(item, index, self2) {
    if (item.dataset[dataSetValue]) {
      return item.dataset[dataSetValue].split(",")[0];
    }
  });
  if (media.length) {
    const breakpointsArray = [];
    media.forEach((item) => {
      const params = item.dataset[dataSetValue];
      const breakpoint = {};
      const paramsArray = params.split(",");
      breakpoint.value = paramsArray[0];
      breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
      breakpoint.item = item;
      breakpointsArray.push(breakpoint);
    });
    let mdQueries = breakpointsArray.map(function(item) {
      return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
    });
    mdQueries = uniqArray(mdQueries);
    const mdQueriesArray = [];
    if (mdQueries.length) {
      mdQueries.forEach((breakpoint) => {
        const paramsArray = breakpoint.split(",");
        const mediaBreakpoint = paramsArray[1];
        const mediaType = paramsArray[2];
        const matchMedia = window.matchMedia(paramsArray[0]);
        const itemsArray = breakpointsArray.filter(function(item) {
          if (item.value === mediaBreakpoint && item.type === mediaType) {
            return true;
          }
        });
        mdQueriesArray.push({
          itemsArray,
          matchMedia
        });
      });
      return mdQueriesArray;
    }
  }
}

// src/js/swiper-bundle.js
function swpr() {
  (function(global, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Swiper = factory());
  })(this, function() {
    "use strict";
    function isObject$1(obj) {
      return obj !== null && typeof obj === "object" && "constructor" in obj && obj.constructor === Object;
    }
    function extend$1(target, src) {
      if (target === void 0) {
        target = {};
      }
      if (src === void 0) {
        src = {};
      }
      Object.keys(src).forEach((key) => {
        if (typeof target[key] === "undefined")
          target[key] = src[key];
        else if (isObject$1(src[key]) && isObject$1(target[key]) && Object.keys(src[key]).length > 0) {
          extend$1(target[key], src[key]);
        }
      });
    }
    const ssrDocument = {
      body: {},
      addEventListener() {
      },
      removeEventListener() {
      },
      activeElement: {
        blur() {
        },
        nodeName: ""
      },
      querySelector() {
        return null;
      },
      querySelectorAll() {
        return [];
      },
      getElementById() {
        return null;
      },
      createEvent() {
        return {
          initEvent() {
          }
        };
      },
      createElement() {
        return {
          children: [],
          childNodes: [],
          style: {},
          setAttribute() {
          },
          getElementsByTagName() {
            return [];
          }
        };
      },
      createElementNS() {
        return {};
      },
      importNode() {
        return null;
      },
      location: {
        hash: "",
        host: "",
        hostname: "",
        href: "",
        origin: "",
        pathname: "",
        protocol: "",
        search: ""
      }
    };
    function getDocument() {
      const doc = typeof document !== "undefined" ? document : {};
      extend$1(doc, ssrDocument);
      return doc;
    }
    const ssrWindow = {
      document: ssrDocument,
      navigator: {
        userAgent: ""
      },
      location: {
        hash: "",
        host: "",
        hostname: "",
        href: "",
        origin: "",
        pathname: "",
        protocol: "",
        search: ""
      },
      history: {
        replaceState() {
        },
        pushState() {
        },
        go() {
        },
        back() {
        }
      },
      CustomEvent: function CustomEvent2() {
        return this;
      },
      addEventListener() {
      },
      removeEventListener() {
      },
      getComputedStyle() {
        return {
          getPropertyValue() {
            return "";
          }
        };
      },
      Image() {
      },
      Date() {
      },
      screen: {},
      setTimeout() {
      },
      clearTimeout() {
      },
      matchMedia() {
        return {};
      },
      requestAnimationFrame(callback) {
        if (typeof setTimeout === "undefined") {
          callback();
          return null;
        }
        return setTimeout(callback, 0);
      },
      cancelAnimationFrame(id) {
        if (typeof setTimeout === "undefined") {
          return;
        }
        clearTimeout(id);
      }
    };
    function getWindow() {
      const win = typeof window !== "undefined" ? window : {};
      extend$1(win, ssrWindow);
      return win;
    }
    function deleteProps(obj) {
      const object = obj;
      Object.keys(object).forEach((key) => {
        try {
          object[key] = null;
        } catch (e) {
        }
        try {
          delete object[key];
        } catch (e) {
        }
      });
    }
    function nextTick(callback, delay) {
      if (delay === void 0) {
        delay = 0;
      }
      return setTimeout(callback, delay);
    }
    function now() {
      return Date.now();
    }
    function getComputedStyle$1(el) {
      const window2 = getWindow();
      let style;
      if (window2.getComputedStyle) {
        style = window2.getComputedStyle(el, null);
      }
      if (!style && el.currentStyle) {
        style = el.currentStyle;
      }
      if (!style) {
        style = el.style;
      }
      return style;
    }
    function getTranslate(el, axis) {
      if (axis === void 0) {
        axis = "x";
      }
      const window2 = getWindow();
      let matrix;
      let curTransform;
      let transformMatrix;
      const curStyle = getComputedStyle$1(el);
      if (window2.WebKitCSSMatrix) {
        curTransform = curStyle.transform || curStyle.webkitTransform;
        if (curTransform.split(",").length > 6) {
          curTransform = curTransform.split(", ").map((a) => a.replace(",", ".")).join(", ");
        }
        transformMatrix = new window2.WebKitCSSMatrix(curTransform === "none" ? "" : curTransform);
      } else {
        transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
        matrix = transformMatrix.toString().split(",");
      }
      if (axis === "x") {
        if (window2.WebKitCSSMatrix)
          curTransform = transformMatrix.m41;
        else if (matrix.length === 16)
          curTransform = parseFloat(matrix[12]);
        else
          curTransform = parseFloat(matrix[4]);
      }
      if (axis === "y") {
        if (window2.WebKitCSSMatrix)
          curTransform = transformMatrix.m42;
        else if (matrix.length === 16)
          curTransform = parseFloat(matrix[13]);
        else
          curTransform = parseFloat(matrix[5]);
      }
      return curTransform || 0;
    }
    function isObject(o) {
      return typeof o === "object" && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === "Object";
    }
    function isNode(node) {
      if (typeof window !== "undefined" && typeof window.HTMLElement !== "undefined") {
        return node instanceof HTMLElement;
      }
      return node && (node.nodeType === 1 || node.nodeType === 11);
    }
    function extend() {
      const to = Object(arguments.length <= 0 ? void 0 : arguments[0]);
      const noExtend = ["__proto__", "constructor", "prototype"];
      for (let i = 1; i < arguments.length; i += 1) {
        const nextSource = i < 0 || arguments.length <= i ? void 0 : arguments[i];
        if (nextSource !== void 0 && nextSource !== null && !isNode(nextSource)) {
          const keysArray = Object.keys(Object(nextSource)).filter((key) => noExtend.indexOf(key) < 0);
          for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
            const nextKey = keysArray[nextIndex];
            const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
            if (desc !== void 0 && desc.enumerable) {
              if (isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
                if (nextSource[nextKey].__swiper__) {
                  to[nextKey] = nextSource[nextKey];
                } else {
                  extend(to[nextKey], nextSource[nextKey]);
                }
              } else if (!isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
                to[nextKey] = {};
                if (nextSource[nextKey].__swiper__) {
                  to[nextKey] = nextSource[nextKey];
                } else {
                  extend(to[nextKey], nextSource[nextKey]);
                }
              } else {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
      }
      return to;
    }
    function setCSSProperty(el, varName, varValue) {
      el.style.setProperty(varName, varValue);
    }
    function animateCSSModeScroll(_ref) {
      let {
        swiper: swiper2,
        targetPosition,
        side
      } = _ref;
      const window2 = getWindow();
      const startPosition = -swiper2.translate;
      let startTime = null;
      let time;
      const duration = swiper2.params.speed;
      swiper2.wrapperEl.style.scrollSnapType = "none";
      window2.cancelAnimationFrame(swiper2.cssModeFrameID);
      const dir = targetPosition > startPosition ? "next" : "prev";
      const isOutOfBound = (current, target) => {
        return dir === "next" && current >= target || dir === "prev" && current <= target;
      };
      const animate = () => {
        time = (/* @__PURE__ */ new Date()).getTime();
        if (startTime === null) {
          startTime = time;
        }
        const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
        const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
        let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
        if (isOutOfBound(currentPosition, targetPosition)) {
          currentPosition = targetPosition;
        }
        swiper2.wrapperEl.scrollTo({
          [side]: currentPosition
        });
        if (isOutOfBound(currentPosition, targetPosition)) {
          swiper2.wrapperEl.style.overflow = "hidden";
          swiper2.wrapperEl.style.scrollSnapType = "";
          setTimeout(() => {
            swiper2.wrapperEl.style.overflow = "";
            swiper2.wrapperEl.scrollTo({
              [side]: currentPosition
            });
          });
          window2.cancelAnimationFrame(swiper2.cssModeFrameID);
          return;
        }
        swiper2.cssModeFrameID = window2.requestAnimationFrame(animate);
      };
      animate();
    }
    function getSlideTransformEl(slideEl) {
      return slideEl.querySelector(".swiper-slide-transform") || slideEl.shadowEl && slideEl.shadowEl.querySelector(".swiper-slide-transform") || slideEl;
    }
    function elementChildren(element, selector) {
      if (selector === void 0) {
        selector = "";
      }
      return [...element.children].filter((el) => el.matches(selector));
    }
    function createElement(tag, classes2) {
      if (classes2 === void 0) {
        classes2 = [];
      }
      const el = document.createElement(tag);
      el.classList.add(...Array.isArray(classes2) ? classes2 : [classes2]);
      return el;
    }
    function elementOffset(el) {
      const window2 = getWindow();
      const document2 = getDocument();
      const box = el.getBoundingClientRect();
      const body = document2.body;
      const clientTop = el.clientTop || body.clientTop || 0;
      const clientLeft = el.clientLeft || body.clientLeft || 0;
      const scrollTop = el === window2 ? window2.scrollY : el.scrollTop;
      const scrollLeft = el === window2 ? window2.scrollX : el.scrollLeft;
      return {
        top: box.top + scrollTop - clientTop,
        left: box.left + scrollLeft - clientLeft
      };
    }
    function elementPrevAll(el, selector) {
      const prevEls = [];
      while (el.previousElementSibling) {
        const prev = el.previousElementSibling;
        if (selector) {
          if (prev.matches(selector))
            prevEls.push(prev);
        } else
          prevEls.push(prev);
        el = prev;
      }
      return prevEls;
    }
    function elementNextAll(el, selector) {
      const nextEls = [];
      while (el.nextElementSibling) {
        const next = el.nextElementSibling;
        if (selector) {
          if (next.matches(selector))
            nextEls.push(next);
        } else
          nextEls.push(next);
        el = next;
      }
      return nextEls;
    }
    function elementStyle(el, prop) {
      const window2 = getWindow();
      return window2.getComputedStyle(el, null).getPropertyValue(prop);
    }
    function elementIndex(el) {
      let child = el;
      let i;
      if (child) {
        i = 0;
        while ((child = child.previousSibling) !== null) {
          if (child.nodeType === 1)
            i += 1;
        }
        return i;
      }
      return void 0;
    }
    function elementParents(el, selector) {
      const parents = [];
      let parent = el.parentElement;
      while (parent) {
        if (selector) {
          if (parent.matches(selector))
            parents.push(parent);
        } else {
          parents.push(parent);
        }
        parent = parent.parentElement;
      }
      return parents;
    }
    function elementTransitionEnd(el, callback) {
      function fireCallBack(e) {
        if (e.target !== el)
          return;
        callback.call(el, e);
        el.removeEventListener("transitionend", fireCallBack);
      }
      if (callback) {
        el.addEventListener("transitionend", fireCallBack);
      }
    }
    function elementOuterSize(el, size, includeMargins) {
      const window2 = getWindow();
      if (includeMargins) {
        return el[size === "width" ? "offsetWidth" : "offsetHeight"] + parseFloat(window2.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-right" : "margin-top")) + parseFloat(window2.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-left" : "margin-bottom"));
      }
      return el.offsetWidth;
    }
    let support;
    function calcSupport() {
      const window2 = getWindow();
      const document2 = getDocument();
      return {
        smoothScroll: document2.documentElement && "scrollBehavior" in document2.documentElement.style,
        touch: !!("ontouchstart" in window2 || window2.DocumentTouch && document2 instanceof window2.DocumentTouch)
      };
    }
    function getSupport() {
      if (!support) {
        support = calcSupport();
      }
      return support;
    }
    let deviceCached;
    function calcDevice(_temp) {
      let {
        userAgent
      } = _temp === void 0 ? {} : _temp;
      const support2 = getSupport();
      const window2 = getWindow();
      const platform = window2.navigator.platform;
      const ua = userAgent || window2.navigator.userAgent;
      const device = {
        ios: false,
        android: false
      };
      const screenWidth = window2.screen.width;
      const screenHeight = window2.screen.height;
      const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
      let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
      const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
      const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
      const windows = platform === "Win32";
      let macos = platform === "MacIntel";
      const iPadScreens = ["1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810"];
      if (!ipad && macos && support2.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
        ipad = ua.match(/(Version)\/([\d.]+)/);
        if (!ipad)
          ipad = [0, 1, "13_0_0"];
        macos = false;
      }
      if (android && !windows) {
        device.os = "android";
        device.android = true;
      }
      if (ipad || iphone || ipod) {
        device.os = "ios";
        device.ios = true;
      }
      return device;
    }
    function getDevice(overrides) {
      if (overrides === void 0) {
        overrides = {};
      }
      if (!deviceCached) {
        deviceCached = calcDevice(overrides);
      }
      return deviceCached;
    }
    let browser;
    function calcBrowser() {
      const window2 = getWindow();
      let needPerspectiveFix = false;
      function isSafari() {
        const ua = window2.navigator.userAgent.toLowerCase();
        return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
      }
      if (isSafari()) {
        const ua = String(window2.navigator.userAgent);
        if (ua.includes("Version/")) {
          const [major, minor] = ua.split("Version/")[1].split(" ")[0].split(".").map((num) => Number(num));
          needPerspectiveFix = major < 16 || major === 16 && minor < 2;
        }
      }
      return {
        isSafari: needPerspectiveFix || isSafari(),
        needPerspectiveFix,
        isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window2.navigator.userAgent)
      };
    }
    function getBrowser() {
      if (!browser) {
        browser = calcBrowser();
      }
      return browser;
    }
    function Resize(_ref) {
      let {
        swiper: swiper2,
        on,
        emit
      } = _ref;
      const window2 = getWindow();
      let observer = null;
      let animationFrame = null;
      const resizeHandler = () => {
        if (!swiper2 || swiper2.destroyed || !swiper2.initialized)
          return;
        emit("beforeResize");
        emit("resize");
      };
      const createObserver = () => {
        if (!swiper2 || swiper2.destroyed || !swiper2.initialized)
          return;
        observer = new ResizeObserver((entries) => {
          animationFrame = window2.requestAnimationFrame(() => {
            const {
              width,
              height
            } = swiper2;
            let newWidth = width;
            let newHeight = height;
            entries.forEach((_ref2) => {
              let {
                contentBoxSize,
                contentRect,
                target
              } = _ref2;
              if (target && target !== swiper2.el)
                return;
              newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
              newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
            });
            if (newWidth !== width || newHeight !== height) {
              resizeHandler();
            }
          });
        });
        observer.observe(swiper2.el);
      };
      const removeObserver = () => {
        if (animationFrame) {
          window2.cancelAnimationFrame(animationFrame);
        }
        if (observer && observer.unobserve && swiper2.el) {
          observer.unobserve(swiper2.el);
          observer = null;
        }
      };
      const orientationChangeHandler = () => {
        if (!swiper2 || swiper2.destroyed || !swiper2.initialized)
          return;
        emit("orientationchange");
      };
      on("init", () => {
        if (swiper2.params.resizeObserver && typeof window2.ResizeObserver !== "undefined") {
          createObserver();
          return;
        }
        window2.addEventListener("resize", resizeHandler);
        window2.addEventListener("orientationchange", orientationChangeHandler);
      });
      on("destroy", () => {
        removeObserver();
        window2.removeEventListener("resize", resizeHandler);
        window2.removeEventListener("orientationchange", orientationChangeHandler);
      });
    }
    function Observer(_ref) {
      let {
        swiper: swiper2,
        extendParams,
        on,
        emit
      } = _ref;
      const observers = [];
      const window2 = getWindow();
      const attach = function(target, options) {
        if (options === void 0) {
          options = {};
        }
        const ObserverFunc = window2.MutationObserver || window2.WebkitMutationObserver;
        const observer = new ObserverFunc((mutations) => {
          if (swiper2.__preventObserver__)
            return;
          if (mutations.length === 1) {
            emit("observerUpdate", mutations[0]);
            return;
          }
          const observerUpdate = function observerUpdate2() {
            emit("observerUpdate", mutations[0]);
          };
          if (window2.requestAnimationFrame) {
            window2.requestAnimationFrame(observerUpdate);
          } else {
            window2.setTimeout(observerUpdate, 0);
          }
        });
        observer.observe(target, {
          attributes: typeof options.attributes === "undefined" ? true : options.attributes,
          childList: typeof options.childList === "undefined" ? true : options.childList,
          characterData: typeof options.characterData === "undefined" ? true : options.characterData
        });
        observers.push(observer);
      };
      const init = () => {
        if (!swiper2.params.observer)
          return;
        if (swiper2.params.observeParents) {
          const containerParents = elementParents(swiper2.el);
          for (let i = 0; i < containerParents.length; i += 1) {
            attach(containerParents[i]);
          }
        }
        attach(swiper2.el, {
          childList: swiper2.params.observeSlideChildren
        });
        attach(swiper2.wrapperEl, {
          attributes: false
        });
      };
      const destroy = () => {
        observers.forEach((observer) => {
          observer.disconnect();
        });
        observers.splice(0, observers.length);
      };
      extendParams({
        observer: false,
        observeParents: false,
        observeSlideChildren: false
      });
      on("init", init);
      on("destroy", destroy);
    }
    var eventsEmitter = {
      on(events2, handler, priority) {
        const self2 = this;
        if (!self2.eventsListeners || self2.destroyed)
          return self2;
        if (typeof handler !== "function")
          return self2;
        const method = priority ? "unshift" : "push";
        events2.split(" ").forEach((event2) => {
          if (!self2.eventsListeners[event2])
            self2.eventsListeners[event2] = [];
          self2.eventsListeners[event2][method](handler);
        });
        return self2;
      },
      once(events2, handler, priority) {
        const self2 = this;
        if (!self2.eventsListeners || self2.destroyed)
          return self2;
        if (typeof handler !== "function")
          return self2;
        function onceHandler() {
          self2.off(events2, onceHandler);
          if (onceHandler.__emitterProxy) {
            delete onceHandler.__emitterProxy;
          }
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          handler.apply(self2, args);
        }
        onceHandler.__emitterProxy = handler;
        return self2.on(events2, onceHandler, priority);
      },
      onAny(handler, priority) {
        const self2 = this;
        if (!self2.eventsListeners || self2.destroyed)
          return self2;
        if (typeof handler !== "function")
          return self2;
        const method = priority ? "unshift" : "push";
        if (self2.eventsAnyListeners.indexOf(handler) < 0) {
          self2.eventsAnyListeners[method](handler);
        }
        return self2;
      },
      offAny(handler) {
        const self2 = this;
        if (!self2.eventsListeners || self2.destroyed)
          return self2;
        if (!self2.eventsAnyListeners)
          return self2;
        const index = self2.eventsAnyListeners.indexOf(handler);
        if (index >= 0) {
          self2.eventsAnyListeners.splice(index, 1);
        }
        return self2;
      },
      off(events2, handler) {
        const self2 = this;
        if (!self2.eventsListeners || self2.destroyed)
          return self2;
        if (!self2.eventsListeners)
          return self2;
        events2.split(" ").forEach((event2) => {
          if (typeof handler === "undefined") {
            self2.eventsListeners[event2] = [];
          } else if (self2.eventsListeners[event2]) {
            self2.eventsListeners[event2].forEach((eventHandler, index) => {
              if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) {
                self2.eventsListeners[event2].splice(index, 1);
              }
            });
          }
        });
        return self2;
      },
      emit() {
        const self2 = this;
        if (!self2.eventsListeners || self2.destroyed)
          return self2;
        if (!self2.eventsListeners)
          return self2;
        let events2;
        let data;
        let context;
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        if (typeof args[0] === "string" || Array.isArray(args[0])) {
          events2 = args[0];
          data = args.slice(1, args.length);
          context = self2;
        } else {
          events2 = args[0].events;
          data = args[0].data;
          context = args[0].context || self2;
        }
        data.unshift(context);
        const eventsArray = Array.isArray(events2) ? events2 : events2.split(" ");
        eventsArray.forEach((event2) => {
          if (self2.eventsAnyListeners && self2.eventsAnyListeners.length) {
            self2.eventsAnyListeners.forEach((eventHandler) => {
              eventHandler.apply(context, [event2, ...data]);
            });
          }
          if (self2.eventsListeners && self2.eventsListeners[event2]) {
            self2.eventsListeners[event2].forEach((eventHandler) => {
              eventHandler.apply(context, data);
            });
          }
        });
        return self2;
      }
    };
    function updateSize() {
      const swiper2 = this;
      let width;
      let height;
      const el = swiper2.el;
      if (typeof swiper2.params.width !== "undefined" && swiper2.params.width !== null) {
        width = swiper2.params.width;
      } else {
        width = el.clientWidth;
      }
      if (typeof swiper2.params.height !== "undefined" && swiper2.params.height !== null) {
        height = swiper2.params.height;
      } else {
        height = el.clientHeight;
      }
      if (width === 0 && swiper2.isHorizontal() || height === 0 && swiper2.isVertical()) {
        return;
      }
      width = width - parseInt(elementStyle(el, "padding-left") || 0, 10) - parseInt(elementStyle(el, "padding-right") || 0, 10);
      height = height - parseInt(elementStyle(el, "padding-top") || 0, 10) - parseInt(elementStyle(el, "padding-bottom") || 0, 10);
      if (Number.isNaN(width))
        width = 0;
      if (Number.isNaN(height))
        height = 0;
      Object.assign(swiper2, {
        width,
        height,
        size: swiper2.isHorizontal() ? width : height
      });
    }
    function updateSlides() {
      const swiper2 = this;
      function getDirectionLabel(property) {
        if (swiper2.isHorizontal()) {
          return property;
        }
        return {
          "width": "height",
          "margin-top": "margin-left",
          "margin-bottom ": "margin-right",
          "margin-left": "margin-top",
          "margin-right": "margin-bottom",
          "padding-left": "padding-top",
          "padding-right": "padding-bottom",
          "marginRight": "marginBottom"
        }[property];
      }
      function getDirectionPropertyValue(node, label) {
        return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
      }
      const params = swiper2.params;
      const {
        wrapperEl,
        slidesEl,
        size: swiperSize,
        rtlTranslate: rtl,
        wrongRTL
      } = swiper2;
      const isVirtual = swiper2.virtual && params.virtual.enabled;
      const previousSlidesLength = isVirtual ? swiper2.virtual.slides.length : swiper2.slides.length;
      const slides = elementChildren(slidesEl, `.${swiper2.params.slideClass}, swiper-slide`);
      const slidesLength = isVirtual ? swiper2.virtual.slides.length : slides.length;
      let snapGrid = [];
      const slidesGrid = [];
      const slidesSizesGrid = [];
      let offsetBefore = params.slidesOffsetBefore;
      if (typeof offsetBefore === "function") {
        offsetBefore = params.slidesOffsetBefore.call(swiper2);
      }
      let offsetAfter = params.slidesOffsetAfter;
      if (typeof offsetAfter === "function") {
        offsetAfter = params.slidesOffsetAfter.call(swiper2);
      }
      const previousSnapGridLength = swiper2.snapGrid.length;
      const previousSlidesGridLength = swiper2.slidesGrid.length;
      let spaceBetween = params.spaceBetween;
      let slidePosition = -offsetBefore;
      let prevSlideSize = 0;
      let index = 0;
      if (typeof swiperSize === "undefined") {
        return;
      }
      if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) {
        spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize;
      } else if (typeof spaceBetween === "string") {
        spaceBetween = parseFloat(spaceBetween);
      }
      swiper2.virtualSize = -spaceBetween;
      slides.forEach((slideEl) => {
        if (rtl) {
          slideEl.style.marginLeft = "";
        } else {
          slideEl.style.marginRight = "";
        }
        slideEl.style.marginBottom = "";
        slideEl.style.marginTop = "";
      });
      if (params.centeredSlides && params.cssMode) {
        setCSSProperty(wrapperEl, "--swiper-centered-offset-before", "");
        setCSSProperty(wrapperEl, "--swiper-centered-offset-after", "");
      }
      const gridEnabled = params.grid && params.grid.rows > 1 && swiper2.grid;
      if (gridEnabled) {
        swiper2.grid.initSlides(slidesLength);
      }
      let slideSize;
      const shouldResetSlideSize = params.slidesPerView === "auto" && params.breakpoints && Object.keys(params.breakpoints).filter((key) => {
        return typeof params.breakpoints[key].slidesPerView !== "undefined";
      }).length > 0;
      for (let i = 0; i < slidesLength; i += 1) {
        slideSize = 0;
        let slide2;
        if (slides[i])
          slide2 = slides[i];
        if (gridEnabled) {
          swiper2.grid.updateSlide(i, slide2, slidesLength, getDirectionLabel);
        }
        if (slides[i] && elementStyle(slide2, "display") === "none")
          continue;
        if (params.slidesPerView === "auto") {
          if (shouldResetSlideSize) {
            slides[i].style[getDirectionLabel("width")] = ``;
          }
          const slideStyles = getComputedStyle(slide2);
          const currentTransform = slide2.style.transform;
          const currentWebKitTransform = slide2.style.webkitTransform;
          if (currentTransform) {
            slide2.style.transform = "none";
          }
          if (currentWebKitTransform) {
            slide2.style.webkitTransform = "none";
          }
          if (params.roundLengths) {
            slideSize = swiper2.isHorizontal() ? elementOuterSize(slide2, "width", true) : elementOuterSize(slide2, "height", true);
          } else {
            const width = getDirectionPropertyValue(slideStyles, "width");
            const paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
            const paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
            const marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
            const marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
            const boxSizing = slideStyles.getPropertyValue("box-sizing");
            if (boxSizing && boxSizing === "border-box") {
              slideSize = width + marginLeft + marginRight;
            } else {
              const {
                clientWidth,
                offsetWidth
              } = slide2;
              slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
            }
          }
          if (currentTransform) {
            slide2.style.transform = currentTransform;
          }
          if (currentWebKitTransform) {
            slide2.style.webkitTransform = currentWebKitTransform;
          }
          if (params.roundLengths)
            slideSize = Math.floor(slideSize);
        } else {
          slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
          if (params.roundLengths)
            slideSize = Math.floor(slideSize);
          if (slides[i]) {
            slides[i].style[getDirectionLabel("width")] = `${slideSize}px`;
          }
        }
        if (slides[i]) {
          slides[i].swiperSlideSize = slideSize;
        }
        slidesSizesGrid.push(slideSize);
        if (params.centeredSlides) {
          slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
          if (prevSlideSize === 0 && i !== 0)
            slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
          if (i === 0)
            slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
          if (Math.abs(slidePosition) < 1 / 1e3)
            slidePosition = 0;
          if (params.roundLengths)
            slidePosition = Math.floor(slidePosition);
          if (index % params.slidesPerGroup === 0)
            snapGrid.push(slidePosition);
          slidesGrid.push(slidePosition);
        } else {
          if (params.roundLengths)
            slidePosition = Math.floor(slidePosition);
          if ((index - Math.min(swiper2.params.slidesPerGroupSkip, index)) % swiper2.params.slidesPerGroup === 0)
            snapGrid.push(slidePosition);
          slidesGrid.push(slidePosition);
          slidePosition = slidePosition + slideSize + spaceBetween;
        }
        swiper2.virtualSize += slideSize + spaceBetween;
        prevSlideSize = slideSize;
        index += 1;
      }
      swiper2.virtualSize = Math.max(swiper2.virtualSize, swiperSize) + offsetAfter;
      if (rtl && wrongRTL && (params.effect === "slide" || params.effect === "coverflow")) {
        wrapperEl.style.width = `${swiper2.virtualSize + spaceBetween}px`;
      }
      if (params.setWrapperSize) {
        wrapperEl.style[getDirectionLabel("width")] = `${swiper2.virtualSize + spaceBetween}px`;
      }
      if (gridEnabled) {
        swiper2.grid.updateWrapperSize(slideSize, snapGrid, getDirectionLabel);
      }
      if (!params.centeredSlides) {
        const newSlidesGrid = [];
        for (let i = 0; i < snapGrid.length; i += 1) {
          let slidesGridItem = snapGrid[i];
          if (params.roundLengths)
            slidesGridItem = Math.floor(slidesGridItem);
          if (snapGrid[i] <= swiper2.virtualSize - swiperSize) {
            newSlidesGrid.push(slidesGridItem);
          }
        }
        snapGrid = newSlidesGrid;
        if (Math.floor(swiper2.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
          snapGrid.push(swiper2.virtualSize - swiperSize);
        }
      }
      if (isVirtual && params.loop) {
        const size = slidesSizesGrid[0] + spaceBetween;
        if (params.slidesPerGroup > 1) {
          const groups = Math.ceil((swiper2.virtual.slidesBefore + swiper2.virtual.slidesAfter) / params.slidesPerGroup);
          const groupSize = size * params.slidesPerGroup;
          for (let i = 0; i < groups; i += 1) {
            snapGrid.push(snapGrid[snapGrid.length - 1] + groupSize);
          }
        }
        for (let i = 0; i < swiper2.virtual.slidesBefore + swiper2.virtual.slidesAfter; i += 1) {
          if (params.slidesPerGroup === 1) {
            snapGrid.push(snapGrid[snapGrid.length - 1] + size);
          }
          slidesGrid.push(slidesGrid[slidesGrid.length - 1] + size);
          swiper2.virtualSize += size;
        }
      }
      if (snapGrid.length === 0)
        snapGrid = [0];
      if (spaceBetween !== 0) {
        const key = swiper2.isHorizontal() && rtl ? "marginLeft" : getDirectionLabel("marginRight");
        slides.filter((_, slideIndex) => {
          if (!params.cssMode || params.loop)
            return true;
          if (slideIndex === slides.length - 1) {
            return false;
          }
          return true;
        }).forEach((slideEl) => {
          slideEl.style[key] = `${spaceBetween}px`;
        });
      }
      if (params.centeredSlides && params.centeredSlidesBounds) {
        let allSlidesSize = 0;
        slidesSizesGrid.forEach((slideSizeValue) => {
          allSlidesSize += slideSizeValue + (spaceBetween || 0);
        });
        allSlidesSize -= spaceBetween;
        const maxSnap = allSlidesSize - swiperSize;
        snapGrid = snapGrid.map((snap) => {
          if (snap < 0)
            return -offsetBefore;
          if (snap > maxSnap)
            return maxSnap + offsetAfter;
          return snap;
        });
      }
      if (params.centerInsufficientSlides) {
        let allSlidesSize = 0;
        slidesSizesGrid.forEach((slideSizeValue) => {
          allSlidesSize += slideSizeValue + (spaceBetween || 0);
        });
        allSlidesSize -= spaceBetween;
        if (allSlidesSize < swiperSize) {
          const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
          snapGrid.forEach((snap, snapIndex) => {
            snapGrid[snapIndex] = snap - allSlidesOffset;
          });
          slidesGrid.forEach((snap, snapIndex) => {
            slidesGrid[snapIndex] = snap + allSlidesOffset;
          });
        }
      }
      Object.assign(swiper2, {
        slides,
        snapGrid,
        slidesGrid,
        slidesSizesGrid
      });
      if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
        setCSSProperty(wrapperEl, "--swiper-centered-offset-before", `${-snapGrid[0]}px`);
        setCSSProperty(wrapperEl, "--swiper-centered-offset-after", `${swiper2.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
        const addToSnapGrid = -swiper2.snapGrid[0];
        const addToSlidesGrid = -swiper2.slidesGrid[0];
        swiper2.snapGrid = swiper2.snapGrid.map((v) => v + addToSnapGrid);
        swiper2.slidesGrid = swiper2.slidesGrid.map((v) => v + addToSlidesGrid);
      }
      if (slidesLength !== previousSlidesLength) {
        swiper2.emit("slidesLengthChange");
      }
      if (snapGrid.length !== previousSnapGridLength) {
        if (swiper2.params.watchOverflow)
          swiper2.checkOverflow();
        swiper2.emit("snapGridLengthChange");
      }
      if (slidesGrid.length !== previousSlidesGridLength) {
        swiper2.emit("slidesGridLengthChange");
      }
      if (params.watchSlidesProgress) {
        swiper2.updateSlidesOffset();
      }
      if (!isVirtual && !params.cssMode && (params.effect === "slide" || params.effect === "fade")) {
        const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
        const hasClassBackfaceClassAdded = swiper2.el.classList.contains(backFaceHiddenClass);
        if (slidesLength <= params.maxBackfaceHiddenSlides) {
          if (!hasClassBackfaceClassAdded)
            swiper2.el.classList.add(backFaceHiddenClass);
        } else if (hasClassBackfaceClassAdded) {
          swiper2.el.classList.remove(backFaceHiddenClass);
        }
      }
    }
    function updateAutoHeight(speed) {
      const swiper2 = this;
      const activeSlides = [];
      const isVirtual = swiper2.virtual && swiper2.params.virtual.enabled;
      let newHeight = 0;
      let i;
      if (typeof speed === "number") {
        swiper2.setTransition(speed);
      } else if (speed === true) {
        swiper2.setTransition(swiper2.params.speed);
      }
      const getSlideByIndex = (index) => {
        if (isVirtual) {
          return swiper2.slides[swiper2.getSlideIndexByData(index)];
        }
        return swiper2.slides[index];
      };
      if (swiper2.params.slidesPerView !== "auto" && swiper2.params.slidesPerView > 1) {
        if (swiper2.params.centeredSlides) {
          (swiper2.visibleSlides || []).forEach((slide2) => {
            activeSlides.push(slide2);
          });
        } else {
          for (i = 0; i < Math.ceil(swiper2.params.slidesPerView); i += 1) {
            const index = swiper2.activeIndex + i;
            if (index > swiper2.slides.length && !isVirtual)
              break;
            activeSlides.push(getSlideByIndex(index));
          }
        }
      } else {
        activeSlides.push(getSlideByIndex(swiper2.activeIndex));
      }
      for (i = 0; i < activeSlides.length; i += 1) {
        if (typeof activeSlides[i] !== "undefined") {
          const height = activeSlides[i].offsetHeight;
          newHeight = height > newHeight ? height : newHeight;
        }
      }
      if (newHeight || newHeight === 0)
        swiper2.wrapperEl.style.height = `${newHeight}px`;
    }
    function updateSlidesOffset() {
      const swiper2 = this;
      const slides = swiper2.slides;
      const minusOffset = swiper2.isElement ? swiper2.isHorizontal() ? swiper2.wrapperEl.offsetLeft : swiper2.wrapperEl.offsetTop : 0;
      for (let i = 0; i < slides.length; i += 1) {
        slides[i].swiperSlideOffset = (swiper2.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop) - minusOffset - swiper2.cssOverflowAdjustment();
      }
    }
    function updateSlidesProgress(translate2) {
      if (translate2 === void 0) {
        translate2 = this && this.translate || 0;
      }
      const swiper2 = this;
      const params = swiper2.params;
      const {
        slides,
        rtlTranslate: rtl,
        snapGrid
      } = swiper2;
      if (slides.length === 0)
        return;
      if (typeof slides[0].swiperSlideOffset === "undefined")
        swiper2.updateSlidesOffset();
      let offsetCenter = -translate2;
      if (rtl)
        offsetCenter = translate2;
      slides.forEach((slideEl) => {
        slideEl.classList.remove(params.slideVisibleClass);
      });
      swiper2.visibleSlidesIndexes = [];
      swiper2.visibleSlides = [];
      let spaceBetween = params.spaceBetween;
      if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) {
        spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiper2.size;
      } else if (typeof spaceBetween === "string") {
        spaceBetween = parseFloat(spaceBetween);
      }
      for (let i = 0; i < slides.length; i += 1) {
        const slide2 = slides[i];
        let slideOffset = slide2.swiperSlideOffset;
        if (params.cssMode && params.centeredSlides) {
          slideOffset -= slides[0].swiperSlideOffset;
        }
        const slideProgress = (offsetCenter + (params.centeredSlides ? swiper2.minTranslate() : 0) - slideOffset) / (slide2.swiperSlideSize + spaceBetween);
        const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper2.minTranslate() : 0) - slideOffset) / (slide2.swiperSlideSize + spaceBetween);
        const slideBefore = -(offsetCenter - slideOffset);
        const slideAfter = slideBefore + swiper2.slidesSizesGrid[i];
        const isVisible = slideBefore >= 0 && slideBefore < swiper2.size - 1 || slideAfter > 1 && slideAfter <= swiper2.size || slideBefore <= 0 && slideAfter >= swiper2.size;
        if (isVisible) {
          swiper2.visibleSlides.push(slide2);
          swiper2.visibleSlidesIndexes.push(i);
          slides[i].classList.add(params.slideVisibleClass);
        }
        slide2.progress = rtl ? -slideProgress : slideProgress;
        slide2.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
      }
    }
    function updateProgress(translate2) {
      const swiper2 = this;
      if (typeof translate2 === "undefined") {
        const multiplier = swiper2.rtlTranslate ? -1 : 1;
        translate2 = swiper2 && swiper2.translate && swiper2.translate * multiplier || 0;
      }
      const params = swiper2.params;
      const translatesDiff = swiper2.maxTranslate() - swiper2.minTranslate();
      let {
        progress,
        isBeginning,
        isEnd,
        progressLoop
      } = swiper2;
      const wasBeginning = isBeginning;
      const wasEnd = isEnd;
      if (translatesDiff === 0) {
        progress = 0;
        isBeginning = true;
        isEnd = true;
      } else {
        progress = (translate2 - swiper2.minTranslate()) / translatesDiff;
        const isBeginningRounded = Math.abs(translate2 - swiper2.minTranslate()) < 1;
        const isEndRounded = Math.abs(translate2 - swiper2.maxTranslate()) < 1;
        isBeginning = isBeginningRounded || progress <= 0;
        isEnd = isEndRounded || progress >= 1;
        if (isBeginningRounded)
          progress = 0;
        if (isEndRounded)
          progress = 1;
      }
      if (params.loop) {
        const firstSlideIndex = swiper2.getSlideIndexByData(0);
        const lastSlideIndex = swiper2.getSlideIndexByData(swiper2.slides.length - 1);
        const firstSlideTranslate = swiper2.slidesGrid[firstSlideIndex];
        const lastSlideTranslate = swiper2.slidesGrid[lastSlideIndex];
        const translateMax = swiper2.slidesGrid[swiper2.slidesGrid.length - 1];
        const translateAbs = Math.abs(translate2);
        if (translateAbs >= firstSlideTranslate) {
          progressLoop = (translateAbs - firstSlideTranslate) / translateMax;
        } else {
          progressLoop = (translateAbs + translateMax - lastSlideTranslate) / translateMax;
        }
        if (progressLoop > 1)
          progressLoop -= 1;
      }
      Object.assign(swiper2, {
        progress,
        progressLoop,
        isBeginning,
        isEnd
      });
      if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight)
        swiper2.updateSlidesProgress(translate2);
      if (isBeginning && !wasBeginning) {
        swiper2.emit("reachBeginning toEdge");
      }
      if (isEnd && !wasEnd) {
        swiper2.emit("reachEnd toEdge");
      }
      if (wasBeginning && !isBeginning || wasEnd && !isEnd) {
        swiper2.emit("fromEdge");
      }
      swiper2.emit("progress", progress);
    }
    function updateSlidesClasses() {
      const swiper2 = this;
      const {
        slides,
        params,
        slidesEl,
        activeIndex
      } = swiper2;
      const isVirtual = swiper2.virtual && params.virtual.enabled;
      const getFilteredSlide = (selector) => {
        return elementChildren(slidesEl, `.${params.slideClass}${selector}, swiper-slide${selector}`)[0];
      };
      slides.forEach((slideEl) => {
        slideEl.classList.remove(params.slideActiveClass, params.slideNextClass, params.slidePrevClass);
      });
      let activeSlide;
      if (isVirtual) {
        if (params.loop) {
          let slideIndex = activeIndex - swiper2.virtual.slidesBefore;
          if (slideIndex < 0)
            slideIndex = swiper2.virtual.slides.length + slideIndex;
          if (slideIndex >= swiper2.virtual.slides.length)
            slideIndex -= swiper2.virtual.slides.length;
          activeSlide = getFilteredSlide(`[data-swiper-slide-index="${slideIndex}"]`);
        } else {
          activeSlide = getFilteredSlide(`[data-swiper-slide-index="${activeIndex}"]`);
        }
      } else {
        activeSlide = slides[activeIndex];
      }
      if (activeSlide) {
        activeSlide.classList.add(params.slideActiveClass);
        let nextSlide = elementNextAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
        if (params.loop && !nextSlide) {
          nextSlide = slides[0];
        }
        if (nextSlide) {
          nextSlide.classList.add(params.slideNextClass);
        }
        let prevSlide = elementPrevAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
        if (params.loop && !prevSlide === 0) {
          prevSlide = slides[slides.length - 1];
        }
        if (prevSlide) {
          prevSlide.classList.add(params.slidePrevClass);
        }
      }
      swiper2.emitSlidesClasses();
    }
    const processLazyPreloader = (swiper2, imageEl) => {
      if (!swiper2 || swiper2.destroyed || !swiper2.params)
        return;
      const slideSelector = () => swiper2.isElement ? `swiper-slide` : `.${swiper2.params.slideClass}`;
      const slideEl = imageEl.closest(slideSelector());
      if (slideEl) {
        const lazyEl = slideEl.querySelector(`.${swiper2.params.lazyPreloaderClass}`);
        if (lazyEl)
          lazyEl.remove();
      }
    };
    const unlazy = (swiper2, index) => {
      if (!swiper2.slides[index])
        return;
      const imageEl = swiper2.slides[index].querySelector('[loading="lazy"]');
      if (imageEl)
        imageEl.removeAttribute("loading");
    };
    const preload = (swiper2) => {
      if (!swiper2 || swiper2.destroyed || !swiper2.params)
        return;
      let amount = swiper2.params.lazyPreloadPrevNext;
      const len = swiper2.slides.length;
      if (!len || !amount || amount < 0)
        return;
      amount = Math.min(amount, len);
      const slidesPerView = swiper2.params.slidesPerView === "auto" ? swiper2.slidesPerViewDynamic() : Math.ceil(swiper2.params.slidesPerView);
      const activeIndex = swiper2.activeIndex;
      const slideIndexLastInView = activeIndex + slidesPerView - 1;
      if (swiper2.params.rewind) {
        for (let i = activeIndex - amount; i <= slideIndexLastInView + amount; i += 1) {
          const realIndex = (i % len + len) % len;
          if (realIndex !== activeIndex && realIndex > slideIndexLastInView)
            unlazy(swiper2, realIndex);
        }
      } else {
        for (let i = Math.max(slideIndexLastInView - amount, 0); i <= Math.min(slideIndexLastInView + amount, len - 1); i += 1) {
          if (i !== activeIndex && i > slideIndexLastInView)
            unlazy(swiper2, i);
        }
      }
    };
    function getActiveIndexByTranslate(swiper2) {
      const {
        slidesGrid,
        params
      } = swiper2;
      const translate2 = swiper2.rtlTranslate ? swiper2.translate : -swiper2.translate;
      let activeIndex;
      for (let i = 0; i < slidesGrid.length; i += 1) {
        if (typeof slidesGrid[i + 1] !== "undefined") {
          if (translate2 >= slidesGrid[i] && translate2 < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) {
            activeIndex = i;
          } else if (translate2 >= slidesGrid[i] && translate2 < slidesGrid[i + 1]) {
            activeIndex = i + 1;
          }
        } else if (translate2 >= slidesGrid[i]) {
          activeIndex = i;
        }
      }
      if (params.normalizeSlideIndex) {
        if (activeIndex < 0 || typeof activeIndex === "undefined")
          activeIndex = 0;
      }
      return activeIndex;
    }
    function updateActiveIndex(newActiveIndex) {
      const swiper2 = this;
      const translate2 = swiper2.rtlTranslate ? swiper2.translate : -swiper2.translate;
      const {
        snapGrid,
        params,
        activeIndex: previousIndex,
        realIndex: previousRealIndex,
        snapIndex: previousSnapIndex
      } = swiper2;
      let activeIndex = newActiveIndex;
      let snapIndex;
      const getVirtualRealIndex = (aIndex) => {
        let realIndex2 = aIndex - swiper2.virtual.slidesBefore;
        if (realIndex2 < 0) {
          realIndex2 = swiper2.virtual.slides.length + realIndex2;
        }
        if (realIndex2 >= swiper2.virtual.slides.length) {
          realIndex2 -= swiper2.virtual.slides.length;
        }
        return realIndex2;
      };
      if (typeof activeIndex === "undefined") {
        activeIndex = getActiveIndexByTranslate(swiper2);
      }
      if (snapGrid.indexOf(translate2) >= 0) {
        snapIndex = snapGrid.indexOf(translate2);
      } else {
        const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
        snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
      }
      if (snapIndex >= snapGrid.length)
        snapIndex = snapGrid.length - 1;
      if (activeIndex === previousIndex) {
        if (snapIndex !== previousSnapIndex) {
          swiper2.snapIndex = snapIndex;
          swiper2.emit("snapIndexChange");
        }
        if (swiper2.params.loop && swiper2.virtual && swiper2.params.virtual.enabled) {
          swiper2.realIndex = getVirtualRealIndex(activeIndex);
        }
        return;
      }
      let realIndex;
      if (swiper2.virtual && params.virtual.enabled && params.loop) {
        realIndex = getVirtualRealIndex(activeIndex);
      } else if (swiper2.slides[activeIndex]) {
        realIndex = parseInt(swiper2.slides[activeIndex].getAttribute("data-swiper-slide-index") || activeIndex, 10);
      } else {
        realIndex = activeIndex;
      }
      Object.assign(swiper2, {
        previousSnapIndex,
        snapIndex,
        previousRealIndex,
        realIndex,
        previousIndex,
        activeIndex
      });
      if (swiper2.initialized) {
        preload(swiper2);
      }
      swiper2.emit("activeIndexChange");
      swiper2.emit("snapIndexChange");
      if (previousRealIndex !== realIndex) {
        swiper2.emit("realIndexChange");
      }
      if (swiper2.initialized || swiper2.params.runCallbacksOnInit) {
        swiper2.emit("slideChange");
      }
    }
    function updateClickedSlide(e) {
      const swiper2 = this;
      const params = swiper2.params;
      const slide2 = e.closest(`.${params.slideClass}, swiper-slide`);
      let slideFound = false;
      let slideIndex;
      if (slide2) {
        for (let i = 0; i < swiper2.slides.length; i += 1) {
          if (swiper2.slides[i] === slide2) {
            slideFound = true;
            slideIndex = i;
            break;
          }
        }
      }
      if (slide2 && slideFound) {
        swiper2.clickedSlide = slide2;
        if (swiper2.virtual && swiper2.params.virtual.enabled) {
          swiper2.clickedIndex = parseInt(slide2.getAttribute("data-swiper-slide-index"), 10);
        } else {
          swiper2.clickedIndex = slideIndex;
        }
      } else {
        swiper2.clickedSlide = void 0;
        swiper2.clickedIndex = void 0;
        return;
      }
      if (params.slideToClickedSlide && swiper2.clickedIndex !== void 0 && swiper2.clickedIndex !== swiper2.activeIndex) {
        swiper2.slideToClickedSlide();
      }
    }
    var update = {
      updateSize,
      updateSlides,
      updateAutoHeight,
      updateSlidesOffset,
      updateSlidesProgress,
      updateProgress,
      updateSlidesClasses,
      updateActiveIndex,
      updateClickedSlide
    };
    function getSwiperTranslate(axis) {
      if (axis === void 0) {
        axis = this.isHorizontal() ? "x" : "y";
      }
      const swiper2 = this;
      const {
        params,
        rtlTranslate: rtl,
        translate: translate2,
        wrapperEl
      } = swiper2;
      if (params.virtualTranslate) {
        return rtl ? -translate2 : translate2;
      }
      if (params.cssMode) {
        return translate2;
      }
      let currentTranslate = getTranslate(wrapperEl, axis);
      currentTranslate += swiper2.cssOverflowAdjustment();
      if (rtl)
        currentTranslate = -currentTranslate;
      return currentTranslate || 0;
    }
    function setTranslate(translate2, byController) {
      const swiper2 = this;
      const {
        rtlTranslate: rtl,
        params,
        wrapperEl,
        progress
      } = swiper2;
      let x = 0;
      let y = 0;
      const z = 0;
      if (swiper2.isHorizontal()) {
        x = rtl ? -translate2 : translate2;
      } else {
        y = translate2;
      }
      if (params.roundLengths) {
        x = Math.floor(x);
        y = Math.floor(y);
      }
      swiper2.previousTranslate = swiper2.translate;
      swiper2.translate = swiper2.isHorizontal() ? x : y;
      if (params.cssMode) {
        wrapperEl[swiper2.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper2.isHorizontal() ? -x : -y;
      } else if (!params.virtualTranslate) {
        if (swiper2.isHorizontal()) {
          x -= swiper2.cssOverflowAdjustment();
        } else {
          y -= swiper2.cssOverflowAdjustment();
        }
        wrapperEl.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
      }
      let newProgress;
      const translatesDiff = swiper2.maxTranslate() - swiper2.minTranslate();
      if (translatesDiff === 0) {
        newProgress = 0;
      } else {
        newProgress = (translate2 - swiper2.minTranslate()) / translatesDiff;
      }
      if (newProgress !== progress) {
        swiper2.updateProgress(translate2);
      }
      swiper2.emit("setTranslate", swiper2.translate, byController);
    }
    function minTranslate() {
      return -this.snapGrid[0];
    }
    function maxTranslate() {
      return -this.snapGrid[this.snapGrid.length - 1];
    }
    function translateTo(translate2, speed, runCallbacks, translateBounds, internal) {
      if (translate2 === void 0) {
        translate2 = 0;
      }
      if (speed === void 0) {
        speed = this.params.speed;
      }
      if (runCallbacks === void 0) {
        runCallbacks = true;
      }
      if (translateBounds === void 0) {
        translateBounds = true;
      }
      const swiper2 = this;
      const {
        params,
        wrapperEl
      } = swiper2;
      if (swiper2.animating && params.preventInteractionOnTransition) {
        return false;
      }
      const minTranslate2 = swiper2.minTranslate();
      const maxTranslate2 = swiper2.maxTranslate();
      let newTranslate;
      if (translateBounds && translate2 > minTranslate2)
        newTranslate = minTranslate2;
      else if (translateBounds && translate2 < maxTranslate2)
        newTranslate = maxTranslate2;
      else
        newTranslate = translate2;
      swiper2.updateProgress(newTranslate);
      if (params.cssMode) {
        const isH = swiper2.isHorizontal();
        if (speed === 0) {
          wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate;
        } else {
          if (!swiper2.support.smoothScroll) {
            animateCSSModeScroll({
              swiper: swiper2,
              targetPosition: -newTranslate,
              side: isH ? "left" : "top"
            });
            return true;
          }
          wrapperEl.scrollTo({
            [isH ? "left" : "top"]: -newTranslate,
            behavior: "smooth"
          });
        }
        return true;
      }
      if (speed === 0) {
        swiper2.setTransition(0);
        swiper2.setTranslate(newTranslate);
        if (runCallbacks) {
          swiper2.emit("beforeTransitionStart", speed, internal);
          swiper2.emit("transitionEnd");
        }
      } else {
        swiper2.setTransition(speed);
        swiper2.setTranslate(newTranslate);
        if (runCallbacks) {
          swiper2.emit("beforeTransitionStart", speed, internal);
          swiper2.emit("transitionStart");
        }
        if (!swiper2.animating) {
          swiper2.animating = true;
          if (!swiper2.onTranslateToWrapperTransitionEnd) {
            swiper2.onTranslateToWrapperTransitionEnd = function transitionEnd2(e) {
              if (!swiper2 || swiper2.destroyed)
                return;
              if (e.target !== this)
                return;
              swiper2.wrapperEl.removeEventListener("transitionend", swiper2.onTranslateToWrapperTransitionEnd);
              swiper2.onTranslateToWrapperTransitionEnd = null;
              delete swiper2.onTranslateToWrapperTransitionEnd;
              if (runCallbacks) {
                swiper2.emit("transitionEnd");
              }
            };
          }
          swiper2.wrapperEl.addEventListener("transitionend", swiper2.onTranslateToWrapperTransitionEnd);
        }
      }
      return true;
    }
    var translate = {
      getTranslate: getSwiperTranslate,
      setTranslate,
      minTranslate,
      maxTranslate,
      translateTo
    };
    function setTransition(duration, byController) {
      const swiper2 = this;
      if (!swiper2.params.cssMode) {
        swiper2.wrapperEl.style.transitionDuration = `${duration}ms`;
      }
      swiper2.emit("setTransition", duration, byController);
    }
    function transitionEmit(_ref) {
      let {
        swiper: swiper2,
        runCallbacks,
        direction,
        step
      } = _ref;
      const {
        activeIndex,
        previousIndex
      } = swiper2;
      let dir = direction;
      if (!dir) {
        if (activeIndex > previousIndex)
          dir = "next";
        else if (activeIndex < previousIndex)
          dir = "prev";
        else
          dir = "reset";
      }
      swiper2.emit(`transition${step}`);
      if (runCallbacks && activeIndex !== previousIndex) {
        if (dir === "reset") {
          swiper2.emit(`slideResetTransition${step}`);
          return;
        }
        swiper2.emit(`slideChangeTransition${step}`);
        if (dir === "next") {
          swiper2.emit(`slideNextTransition${step}`);
        } else {
          swiper2.emit(`slidePrevTransition${step}`);
        }
      }
    }
    function transitionStart(runCallbacks, direction) {
      if (runCallbacks === void 0) {
        runCallbacks = true;
      }
      const swiper2 = this;
      const {
        params
      } = swiper2;
      if (params.cssMode)
        return;
      if (params.autoHeight) {
        swiper2.updateAutoHeight();
      }
      transitionEmit({
        swiper: swiper2,
        runCallbacks,
        direction,
        step: "Start"
      });
    }
    function transitionEnd(runCallbacks, direction) {
      if (runCallbacks === void 0) {
        runCallbacks = true;
      }
      const swiper2 = this;
      const {
        params
      } = swiper2;
      swiper2.animating = false;
      if (params.cssMode)
        return;
      swiper2.setTransition(0);
      transitionEmit({
        swiper: swiper2,
        runCallbacks,
        direction,
        step: "End"
      });
    }
    var transition = {
      setTransition,
      transitionStart,
      transitionEnd
    };
    function slideTo(index, speed, runCallbacks, internal, initial) {
      if (index === void 0) {
        index = 0;
      }
      if (speed === void 0) {
        speed = this.params.speed;
      }
      if (runCallbacks === void 0) {
        runCallbacks = true;
      }
      if (typeof index === "string") {
        index = parseInt(index, 10);
      }
      const swiper2 = this;
      let slideIndex = index;
      if (slideIndex < 0)
        slideIndex = 0;
      const {
        params,
        snapGrid,
        slidesGrid,
        previousIndex,
        activeIndex,
        rtlTranslate: rtl,
        wrapperEl,
        enabled
      } = swiper2;
      if (swiper2.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) {
        return false;
      }
      const skip = Math.min(swiper2.params.slidesPerGroupSkip, slideIndex);
      let snapIndex = skip + Math.floor((slideIndex - skip) / swiper2.params.slidesPerGroup);
      if (snapIndex >= snapGrid.length)
        snapIndex = snapGrid.length - 1;
      const translate2 = -snapGrid[snapIndex];
      if (params.normalizeSlideIndex) {
        for (let i = 0; i < slidesGrid.length; i += 1) {
          const normalizedTranslate = -Math.floor(translate2 * 100);
          const normalizedGrid = Math.floor(slidesGrid[i] * 100);
          const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);
          if (typeof slidesGrid[i + 1] !== "undefined") {
            if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) {
              slideIndex = i;
            } else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) {
              slideIndex = i + 1;
            }
          } else if (normalizedTranslate >= normalizedGrid) {
            slideIndex = i;
          }
        }
      }
      if (swiper2.initialized && slideIndex !== activeIndex) {
        if (!swiper2.allowSlideNext && translate2 < swiper2.translate && translate2 < swiper2.minTranslate()) {
          return false;
        }
        if (!swiper2.allowSlidePrev && translate2 > swiper2.translate && translate2 > swiper2.maxTranslate()) {
          if ((activeIndex || 0) !== slideIndex) {
            return false;
          }
        }
      }
      if (slideIndex !== (previousIndex || 0) && runCallbacks) {
        swiper2.emit("beforeSlideChangeStart");
      }
      swiper2.updateProgress(translate2);
      let direction;
      if (slideIndex > activeIndex)
        direction = "next";
      else if (slideIndex < activeIndex)
        direction = "prev";
      else
        direction = "reset";
      if (rtl && -translate2 === swiper2.translate || !rtl && translate2 === swiper2.translate) {
        swiper2.updateActiveIndex(slideIndex);
        if (params.autoHeight) {
          swiper2.updateAutoHeight();
        }
        swiper2.updateSlidesClasses();
        if (params.effect !== "slide") {
          swiper2.setTranslate(translate2);
        }
        if (direction !== "reset") {
          swiper2.transitionStart(runCallbacks, direction);
          swiper2.transitionEnd(runCallbacks, direction);
        }
        return false;
      }
      if (params.cssMode) {
        const isH = swiper2.isHorizontal();
        const t = rtl ? translate2 : -translate2;
        if (speed === 0) {
          const isVirtual = swiper2.virtual && swiper2.params.virtual.enabled;
          if (isVirtual) {
            swiper2.wrapperEl.style.scrollSnapType = "none";
            swiper2._immediateVirtual = true;
          }
          if (isVirtual && !swiper2._cssModeVirtualInitialSet && swiper2.params.initialSlide > 0) {
            swiper2._cssModeVirtualInitialSet = true;
            requestAnimationFrame(() => {
              wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
            });
          } else {
            wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
          }
          if (isVirtual) {
            requestAnimationFrame(() => {
              swiper2.wrapperEl.style.scrollSnapType = "";
              swiper2._immediateVirtual = false;
            });
          }
        } else {
          if (!swiper2.support.smoothScroll) {
            animateCSSModeScroll({
              swiper: swiper2,
              targetPosition: t,
              side: isH ? "left" : "top"
            });
            return true;
          }
          wrapperEl.scrollTo({
            [isH ? "left" : "top"]: t,
            behavior: "smooth"
          });
        }
        return true;
      }
      swiper2.setTransition(speed);
      swiper2.setTranslate(translate2);
      swiper2.updateActiveIndex(slideIndex);
      swiper2.updateSlidesClasses();
      swiper2.emit("beforeTransitionStart", speed, internal);
      swiper2.transitionStart(runCallbacks, direction);
      if (speed === 0) {
        swiper2.transitionEnd(runCallbacks, direction);
      } else if (!swiper2.animating) {
        swiper2.animating = true;
        if (!swiper2.onSlideToWrapperTransitionEnd) {
          swiper2.onSlideToWrapperTransitionEnd = function transitionEnd2(e) {
            if (!swiper2 || swiper2.destroyed)
              return;
            if (e.target !== this)
              return;
            swiper2.wrapperEl.removeEventListener("transitionend", swiper2.onSlideToWrapperTransitionEnd);
            swiper2.onSlideToWrapperTransitionEnd = null;
            delete swiper2.onSlideToWrapperTransitionEnd;
            swiper2.transitionEnd(runCallbacks, direction);
          };
        }
        swiper2.wrapperEl.addEventListener("transitionend", swiper2.onSlideToWrapperTransitionEnd);
      }
      return true;
    }
    function slideToLoop(index, speed, runCallbacks, internal) {
      if (index === void 0) {
        index = 0;
      }
      if (speed === void 0) {
        speed = this.params.speed;
      }
      if (runCallbacks === void 0) {
        runCallbacks = true;
      }
      if (typeof index === "string") {
        const indexAsNumber = parseInt(index, 10);
        index = indexAsNumber;
      }
      const swiper2 = this;
      let newIndex = index;
      if (swiper2.params.loop) {
        if (swiper2.virtual && swiper2.params.virtual.enabled) {
          newIndex = newIndex + swiper2.virtual.slidesBefore;
        } else {
          newIndex = swiper2.getSlideIndexByData(newIndex);
        }
      }
      return swiper2.slideTo(newIndex, speed, runCallbacks, internal);
    }
    function slideNext(speed, runCallbacks, internal) {
      if (speed === void 0) {
        speed = this.params.speed;
      }
      if (runCallbacks === void 0) {
        runCallbacks = true;
      }
      const swiper2 = this;
      const {
        enabled,
        params,
        animating
      } = swiper2;
      if (!enabled)
        return swiper2;
      let perGroup = params.slidesPerGroup;
      if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
        perGroup = Math.max(swiper2.slidesPerViewDynamic("current", true), 1);
      }
      const increment = swiper2.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
      const isVirtual = swiper2.virtual && params.virtual.enabled;
      if (params.loop) {
        if (animating && !isVirtual && params.loopPreventsSliding)
          return false;
        swiper2.loopFix({
          direction: "next"
        });
        swiper2._clientLeft = swiper2.wrapperEl.clientLeft;
      }
      if (params.rewind && swiper2.isEnd) {
        return swiper2.slideTo(0, speed, runCallbacks, internal);
      }
      return swiper2.slideTo(swiper2.activeIndex + increment, speed, runCallbacks, internal);
    }
    function slidePrev(speed, runCallbacks, internal) {
      if (speed === void 0) {
        speed = this.params.speed;
      }
      if (runCallbacks === void 0) {
        runCallbacks = true;
      }
      const swiper2 = this;
      const {
        params,
        snapGrid,
        slidesGrid,
        rtlTranslate,
        enabled,
        animating
      } = swiper2;
      if (!enabled)
        return swiper2;
      const isVirtual = swiper2.virtual && params.virtual.enabled;
      if (params.loop) {
        if (animating && !isVirtual && params.loopPreventsSliding)
          return false;
        swiper2.loopFix({
          direction: "prev"
        });
        swiper2._clientLeft = swiper2.wrapperEl.clientLeft;
      }
      const translate2 = rtlTranslate ? swiper2.translate : -swiper2.translate;
      function normalize(val) {
        if (val < 0)
          return -Math.floor(Math.abs(val));
        return Math.floor(val);
      }
      const normalizedTranslate = normalize(translate2);
      const normalizedSnapGrid = snapGrid.map((val) => normalize(val));
      let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
      if (typeof prevSnap === "undefined" && params.cssMode) {
        let prevSnapIndex;
        snapGrid.forEach((snap, snapIndex) => {
          if (normalizedTranslate >= snap) {
            prevSnapIndex = snapIndex;
          }
        });
        if (typeof prevSnapIndex !== "undefined") {
          prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
        }
      }
      let prevIndex = 0;
      if (typeof prevSnap !== "undefined") {
        prevIndex = slidesGrid.indexOf(prevSnap);
        if (prevIndex < 0)
          prevIndex = swiper2.activeIndex - 1;
        if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
          prevIndex = prevIndex - swiper2.slidesPerViewDynamic("previous", true) + 1;
          prevIndex = Math.max(prevIndex, 0);
        }
      }
      if (params.rewind && swiper2.isBeginning) {
        const lastIndex = swiper2.params.virtual && swiper2.params.virtual.enabled && swiper2.virtual ? swiper2.virtual.slides.length - 1 : swiper2.slides.length - 1;
        return swiper2.slideTo(lastIndex, speed, runCallbacks, internal);
      }
      return swiper2.slideTo(prevIndex, speed, runCallbacks, internal);
    }
    function slideReset(speed, runCallbacks, internal) {
      if (speed === void 0) {
        speed = this.params.speed;
      }
      if (runCallbacks === void 0) {
        runCallbacks = true;
      }
      const swiper2 = this;
      return swiper2.slideTo(swiper2.activeIndex, speed, runCallbacks, internal);
    }
    function slideToClosest(speed, runCallbacks, internal, threshold) {
      if (speed === void 0) {
        speed = this.params.speed;
      }
      if (runCallbacks === void 0) {
        runCallbacks = true;
      }
      if (threshold === void 0) {
        threshold = 0.5;
      }
      const swiper2 = this;
      let index = swiper2.activeIndex;
      const skip = Math.min(swiper2.params.slidesPerGroupSkip, index);
      const snapIndex = skip + Math.floor((index - skip) / swiper2.params.slidesPerGroup);
      const translate2 = swiper2.rtlTranslate ? swiper2.translate : -swiper2.translate;
      if (translate2 >= swiper2.snapGrid[snapIndex]) {
        const currentSnap = swiper2.snapGrid[snapIndex];
        const nextSnap = swiper2.snapGrid[snapIndex + 1];
        if (translate2 - currentSnap > (nextSnap - currentSnap) * threshold) {
          index += swiper2.params.slidesPerGroup;
        }
      } else {
        const prevSnap = swiper2.snapGrid[snapIndex - 1];
        const currentSnap = swiper2.snapGrid[snapIndex];
        if (translate2 - prevSnap <= (currentSnap - prevSnap) * threshold) {
          index -= swiper2.params.slidesPerGroup;
        }
      }
      index = Math.max(index, 0);
      index = Math.min(index, swiper2.slidesGrid.length - 1);
      return swiper2.slideTo(index, speed, runCallbacks, internal);
    }
    function slideToClickedSlide() {
      const swiper2 = this;
      const {
        params,
        slidesEl
      } = swiper2;
      const slidesPerView = params.slidesPerView === "auto" ? swiper2.slidesPerViewDynamic() : params.slidesPerView;
      let slideToIndex = swiper2.clickedIndex;
      let realIndex;
      const slideSelector = swiper2.isElement ? `swiper-slide` : `.${params.slideClass}`;
      if (params.loop) {
        if (swiper2.animating)
          return;
        realIndex = parseInt(swiper2.clickedSlide.getAttribute("data-swiper-slide-index"), 10);
        if (params.centeredSlides) {
          if (slideToIndex < swiper2.loopedSlides - slidesPerView / 2 || slideToIndex > swiper2.slides.length - swiper2.loopedSlides + slidesPerView / 2) {
            swiper2.loopFix();
            slideToIndex = swiper2.getSlideIndex(elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
            nextTick(() => {
              swiper2.slideTo(slideToIndex);
            });
          } else {
            swiper2.slideTo(slideToIndex);
          }
        } else if (slideToIndex > swiper2.slides.length - slidesPerView) {
          swiper2.loopFix();
          slideToIndex = swiper2.getSlideIndex(elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
          nextTick(() => {
            swiper2.slideTo(slideToIndex);
          });
        } else {
          swiper2.slideTo(slideToIndex);
        }
      } else {
        swiper2.slideTo(slideToIndex);
      }
    }
    var slide = {
      slideTo,
      slideToLoop,
      slideNext,
      slidePrev,
      slideReset,
      slideToClosest,
      slideToClickedSlide
    };
    function loopCreate(slideRealIndex) {
      const swiper2 = this;
      const {
        params,
        slidesEl
      } = swiper2;
      if (!params.loop || swiper2.virtual && swiper2.params.virtual.enabled)
        return;
      const slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
      slides.forEach((el, index) => {
        el.setAttribute("data-swiper-slide-index", index);
      });
      swiper2.loopFix({
        slideRealIndex,
        direction: params.centeredSlides ? void 0 : "next"
      });
    }
    function loopFix(_temp) {
      let {
        slideRealIndex,
        slideTo: slideTo2 = true,
        direction,
        setTranslate: setTranslate2,
        activeSlideIndex,
        byController,
        byMousewheel
      } = _temp === void 0 ? {} : _temp;
      const swiper2 = this;
      if (!swiper2.params.loop)
        return;
      swiper2.emit("beforeLoopFix");
      const {
        slides,
        allowSlidePrev,
        allowSlideNext,
        slidesEl,
        params
      } = swiper2;
      swiper2.allowSlidePrev = true;
      swiper2.allowSlideNext = true;
      if (swiper2.virtual && params.virtual.enabled) {
        if (slideTo2) {
          if (!params.centeredSlides && swiper2.snapIndex === 0) {
            swiper2.slideTo(swiper2.virtual.slides.length, 0, false, true);
          } else if (params.centeredSlides && swiper2.snapIndex < params.slidesPerView) {
            swiper2.slideTo(swiper2.virtual.slides.length + swiper2.snapIndex, 0, false, true);
          } else if (swiper2.snapIndex === swiper2.snapGrid.length - 1) {
            swiper2.slideTo(swiper2.virtual.slidesBefore, 0, false, true);
          }
        }
        swiper2.allowSlidePrev = allowSlidePrev;
        swiper2.allowSlideNext = allowSlideNext;
        swiper2.emit("loopFix");
        return;
      }
      const slidesPerView = params.slidesPerView === "auto" ? swiper2.slidesPerViewDynamic() : Math.ceil(parseFloat(params.slidesPerView, 10));
      let loopedSlides = params.loopedSlides || slidesPerView;
      if (loopedSlides % params.slidesPerGroup !== 0) {
        loopedSlides += params.slidesPerGroup - loopedSlides % params.slidesPerGroup;
      }
      swiper2.loopedSlides = loopedSlides;
      const prependSlidesIndexes = [];
      const appendSlidesIndexes = [];
      let activeIndex = swiper2.activeIndex;
      if (typeof activeSlideIndex === "undefined") {
        activeSlideIndex = swiper2.getSlideIndex(swiper2.slides.filter((el) => el.classList.contains(params.slideActiveClass))[0]);
      } else {
        activeIndex = activeSlideIndex;
      }
      const isNext = direction === "next" || !direction;
      const isPrev = direction === "prev" || !direction;
      let slidesPrepended = 0;
      let slidesAppended = 0;
      if (activeSlideIndex < loopedSlides) {
        slidesPrepended = Math.max(loopedSlides - activeSlideIndex, params.slidesPerGroup);
        for (let i = 0; i < loopedSlides - activeSlideIndex; i += 1) {
          const index = i - Math.floor(i / slides.length) * slides.length;
          prependSlidesIndexes.push(slides.length - index - 1);
        }
      } else if (activeSlideIndex > swiper2.slides.length - loopedSlides * 2) {
        slidesAppended = Math.max(activeSlideIndex - (swiper2.slides.length - loopedSlides * 2), params.slidesPerGroup);
        for (let i = 0; i < slidesAppended; i += 1) {
          const index = i - Math.floor(i / slides.length) * slides.length;
          appendSlidesIndexes.push(index);
        }
      }
      if (isPrev) {
        prependSlidesIndexes.forEach((index) => {
          swiper2.slides[index].swiperLoopMoveDOM = true;
          slidesEl.prepend(swiper2.slides[index]);
          swiper2.slides[index].swiperLoopMoveDOM = false;
        });
      }
      if (isNext) {
        appendSlidesIndexes.forEach((index) => {
          swiper2.slides[index].swiperLoopMoveDOM = true;
          slidesEl.append(swiper2.slides[index]);
          swiper2.slides[index].swiperLoopMoveDOM = false;
        });
      }
      swiper2.recalcSlides();
      if (params.slidesPerView === "auto") {
        swiper2.updateSlides();
      }
      if (params.watchSlidesProgress) {
        swiper2.updateSlidesOffset();
      }
      if (slideTo2) {
        if (prependSlidesIndexes.length > 0 && isPrev) {
          if (typeof slideRealIndex === "undefined") {
            const currentSlideTranslate = swiper2.slidesGrid[activeIndex];
            const newSlideTranslate = swiper2.slidesGrid[activeIndex + slidesPrepended];
            const diff = newSlideTranslate - currentSlideTranslate;
            if (byMousewheel) {
              swiper2.setTranslate(swiper2.translate - diff);
            } else {
              swiper2.slideTo(activeIndex + slidesPrepended, 0, false, true);
              if (setTranslate2) {
                swiper2.touches[swiper2.isHorizontal() ? "startX" : "startY"] += diff;
              }
            }
          } else {
            if (setTranslate2) {
              swiper2.slideToLoop(slideRealIndex, 0, false, true);
            }
          }
        } else if (appendSlidesIndexes.length > 0 && isNext) {
          if (typeof slideRealIndex === "undefined") {
            const currentSlideTranslate = swiper2.slidesGrid[activeIndex];
            const newSlideTranslate = swiper2.slidesGrid[activeIndex - slidesAppended];
            const diff = newSlideTranslate - currentSlideTranslate;
            if (byMousewheel) {
              swiper2.setTranslate(swiper2.translate - diff);
            } else {
              swiper2.slideTo(activeIndex - slidesAppended, 0, false, true);
              if (setTranslate2) {
                swiper2.touches[swiper2.isHorizontal() ? "startX" : "startY"] += diff;
              }
            }
          } else {
            swiper2.slideToLoop(slideRealIndex, 0, false, true);
          }
        }
      }
      swiper2.allowSlidePrev = allowSlidePrev;
      swiper2.allowSlideNext = allowSlideNext;
      if (swiper2.controller && swiper2.controller.control && !byController) {
        const loopParams = {
          slideRealIndex,
          slideTo: false,
          direction,
          setTranslate: setTranslate2,
          activeSlideIndex,
          byController: true
        };
        if (Array.isArray(swiper2.controller.control)) {
          swiper2.controller.control.forEach((c) => {
            if (!c.destroyed && c.params.loop)
              c.loopFix(loopParams);
          });
        } else if (swiper2.controller.control instanceof swiper2.constructor && swiper2.controller.control.params.loop) {
          swiper2.controller.control.loopFix(loopParams);
        }
      }
      swiper2.emit("loopFix");
    }
    function loopDestroy() {
      const swiper2 = this;
      const {
        params,
        slidesEl
      } = swiper2;
      if (!params.loop || swiper2.virtual && swiper2.params.virtual.enabled)
        return;
      swiper2.recalcSlides();
      const newSlidesOrder = [];
      swiper2.slides.forEach((slideEl) => {
        const index = typeof slideEl.swiperSlideIndex === "undefined" ? slideEl.getAttribute("data-swiper-slide-index") * 1 : slideEl.swiperSlideIndex;
        newSlidesOrder[index] = slideEl;
      });
      swiper2.slides.forEach((slideEl) => {
        slideEl.removeAttribute("data-swiper-slide-index");
      });
      newSlidesOrder.forEach((slideEl) => {
        slidesEl.append(slideEl);
      });
      swiper2.recalcSlides();
      swiper2.slideTo(swiper2.realIndex, 0);
    }
    var loop = {
      loopCreate,
      loopFix,
      loopDestroy
    };
    function setGrabCursor(moving) {
      const swiper2 = this;
      if (!swiper2.params.simulateTouch || swiper2.params.watchOverflow && swiper2.isLocked || swiper2.params.cssMode)
        return;
      const el = swiper2.params.touchEventsTarget === "container" ? swiper2.el : swiper2.wrapperEl;
      if (swiper2.isElement) {
        swiper2.__preventObserver__ = true;
      }
      el.style.cursor = "move";
      el.style.cursor = moving ? "grabbing" : "grab";
      if (swiper2.isElement) {
        requestAnimationFrame(() => {
          swiper2.__preventObserver__ = false;
        });
      }
    }
    function unsetGrabCursor() {
      const swiper2 = this;
      if (swiper2.params.watchOverflow && swiper2.isLocked || swiper2.params.cssMode) {
        return;
      }
      if (swiper2.isElement) {
        swiper2.__preventObserver__ = true;
      }
      swiper2[swiper2.params.touchEventsTarget === "container" ? "el" : "wrapperEl"].style.cursor = "";
      if (swiper2.isElement) {
        requestAnimationFrame(() => {
          swiper2.__preventObserver__ = false;
        });
      }
    }
    var grabCursor = {
      setGrabCursor,
      unsetGrabCursor
    };
    function closestElement(selector, base) {
      if (base === void 0) {
        base = this;
      }
      function __closestFrom(el) {
        if (!el || el === getDocument() || el === getWindow())
          return null;
        if (el.assignedSlot)
          el = el.assignedSlot;
        const found = el.closest(selector);
        if (!found && !el.getRootNode) {
          return null;
        }
        return found || __closestFrom(el.getRootNode().host);
      }
      return __closestFrom(base);
    }
    function onTouchStart(event2) {
      const swiper2 = this;
      const document2 = getDocument();
      const window2 = getWindow();
      const data = swiper2.touchEventsData;
      data.evCache.push(event2);
      const {
        params,
        touches,
        enabled
      } = swiper2;
      if (!enabled)
        return;
      if (!params.simulateTouch && event2.pointerType === "mouse")
        return;
      if (swiper2.animating && params.preventInteractionOnTransition) {
        return;
      }
      if (!swiper2.animating && params.cssMode && params.loop) {
        swiper2.loopFix();
      }
      let e = event2;
      if (e.originalEvent)
        e = e.originalEvent;
      let targetEl = e.target;
      if (params.touchEventsTarget === "wrapper") {
        if (!swiper2.wrapperEl.contains(targetEl))
          return;
      }
      if ("which" in e && e.which === 3)
        return;
      if ("button" in e && e.button > 0)
        return;
      if (data.isTouched && data.isMoved)
        return;
      const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== "";
      const eventPath = event2.composedPath ? event2.composedPath() : event2.path;
      if (swipingClassHasValue && e.target && e.target.shadowRoot && eventPath) {
        targetEl = eventPath[0];
      }
      const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
      const isTargetShadow = !!(e.target && e.target.shadowRoot);
      if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, targetEl) : targetEl.closest(noSwipingSelector))) {
        swiper2.allowClick = true;
        return;
      }
      if (params.swipeHandler) {
        if (!targetEl.closest(params.swipeHandler))
          return;
      }
      touches.currentX = e.pageX;
      touches.currentY = e.pageY;
      const startX = touches.currentX;
      const startY = touches.currentY;
      const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
      const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;
      if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window2.innerWidth - edgeSwipeThreshold)) {
        if (edgeSwipeDetection === "prevent") {
          event2.preventDefault();
        } else {
          return;
        }
      }
      Object.assign(data, {
        isTouched: true,
        isMoved: false,
        allowTouchCallbacks: true,
        isScrolling: void 0,
        startMoving: void 0
      });
      touches.startX = startX;
      touches.startY = startY;
      data.touchStartTime = now();
      swiper2.allowClick = true;
      swiper2.updateSize();
      swiper2.swipeDirection = void 0;
      if (params.threshold > 0)
        data.allowThresholdMove = false;
      let preventDefault = true;
      if (targetEl.matches(data.focusableElements)) {
        preventDefault = false;
        if (targetEl.nodeName === "SELECT") {
          data.isTouched = false;
        }
      }
      if (document2.activeElement && document2.activeElement.matches(data.focusableElements) && document2.activeElement !== targetEl) {
        document2.activeElement.blur();
      }
      const shouldPreventDefault = preventDefault && swiper2.allowTouchMove && params.touchStartPreventDefault;
      if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !targetEl.isContentEditable) {
        e.preventDefault();
      }
      if (swiper2.params.freeMode && swiper2.params.freeMode.enabled && swiper2.freeMode && swiper2.animating && !params.cssMode) {
        swiper2.freeMode.onTouchStart();
      }
      swiper2.emit("touchStart", e);
    }
    function onTouchMove(event2) {
      const document2 = getDocument();
      const swiper2 = this;
      const data = swiper2.touchEventsData;
      const {
        params,
        touches,
        rtlTranslate: rtl,
        enabled
      } = swiper2;
      if (!enabled)
        return;
      if (!params.simulateTouch && event2.pointerType === "mouse")
        return;
      let e = event2;
      if (e.originalEvent)
        e = e.originalEvent;
      if (!data.isTouched) {
        if (data.startMoving && data.isScrolling) {
          swiper2.emit("touchMoveOpposite", e);
        }
        return;
      }
      const pointerIndex = data.evCache.findIndex((cachedEv) => cachedEv.pointerId === e.pointerId);
      if (pointerIndex >= 0)
        data.evCache[pointerIndex] = e;
      const targetTouch = data.evCache.length > 1 ? data.evCache[0] : e;
      const pageX = targetTouch.pageX;
      const pageY = targetTouch.pageY;
      if (e.preventedByNestedSwiper) {
        touches.startX = pageX;
        touches.startY = pageY;
        return;
      }
      if (!swiper2.allowTouchMove) {
        if (!e.target.matches(data.focusableElements)) {
          swiper2.allowClick = false;
        }
        if (data.isTouched) {
          Object.assign(touches, {
            startX: pageX,
            startY: pageY,
            prevX: swiper2.touches.currentX,
            prevY: swiper2.touches.currentY,
            currentX: pageX,
            currentY: pageY
          });
          data.touchStartTime = now();
        }
        return;
      }
      if (params.touchReleaseOnEdges && !params.loop) {
        if (swiper2.isVertical()) {
          if (pageY < touches.startY && swiper2.translate <= swiper2.maxTranslate() || pageY > touches.startY && swiper2.translate >= swiper2.minTranslate()) {
            data.isTouched = false;
            data.isMoved = false;
            return;
          }
        } else if (pageX < touches.startX && swiper2.translate <= swiper2.maxTranslate() || pageX > touches.startX && swiper2.translate >= swiper2.minTranslate()) {
          return;
        }
      }
      if (document2.activeElement) {
        if (e.target === document2.activeElement && e.target.matches(data.focusableElements)) {
          data.isMoved = true;
          swiper2.allowClick = false;
          return;
        }
      }
      if (data.allowTouchCallbacks) {
        swiper2.emit("touchMove", e);
      }
      if (e.targetTouches && e.targetTouches.length > 1)
        return;
      touches.currentX = pageX;
      touches.currentY = pageY;
      const diffX = touches.currentX - touches.startX;
      const diffY = touches.currentY - touches.startY;
      if (swiper2.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper2.params.threshold)
        return;
      if (typeof data.isScrolling === "undefined") {
        let touchAngle;
        if (swiper2.isHorizontal() && touches.currentY === touches.startY || swiper2.isVertical() && touches.currentX === touches.startX) {
          data.isScrolling = false;
        } else {
          if (diffX * diffX + diffY * diffY >= 25) {
            touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
            data.isScrolling = swiper2.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
          }
        }
      }
      if (data.isScrolling) {
        swiper2.emit("touchMoveOpposite", e);
      }
      if (typeof data.startMoving === "undefined") {
        if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
          data.startMoving = true;
        }
      }
      if (data.isScrolling || swiper2.zoom && swiper2.params.zoom && swiper2.params.zoom.enabled && data.evCache.length > 1) {
        data.isTouched = false;
        return;
      }
      if (!data.startMoving) {
        return;
      }
      swiper2.allowClick = false;
      if (!params.cssMode && e.cancelable) {
        e.preventDefault();
      }
      if (params.touchMoveStopPropagation && !params.nested) {
        e.stopPropagation();
      }
      let diff = swiper2.isHorizontal() ? diffX : diffY;
      let touchesDiff = swiper2.isHorizontal() ? touches.currentX - touches.previousX : touches.currentY - touches.previousY;
      if (params.oneWayMovement) {
        diff = Math.abs(diff) * (rtl ? 1 : -1);
        touchesDiff = Math.abs(touchesDiff) * (rtl ? 1 : -1);
      }
      touches.diff = diff;
      diff *= params.touchRatio;
      if (rtl) {
        diff = -diff;
        touchesDiff = -touchesDiff;
      }
      const prevTouchesDirection = swiper2.touchesDirection;
      swiper2.swipeDirection = diff > 0 ? "prev" : "next";
      swiper2.touchesDirection = touchesDiff > 0 ? "prev" : "next";
      const isLoop = swiper2.params.loop && !params.cssMode;
      if (!data.isMoved) {
        if (isLoop) {
          swiper2.loopFix({
            direction: swiper2.swipeDirection
          });
        }
        data.startTranslate = swiper2.getTranslate();
        swiper2.setTransition(0);
        if (swiper2.animating) {
          const evt = new window.CustomEvent("transitionend", {
            bubbles: true,
            cancelable: true
          });
          swiper2.wrapperEl.dispatchEvent(evt);
        }
        data.allowMomentumBounce = false;
        if (params.grabCursor && (swiper2.allowSlideNext === true || swiper2.allowSlidePrev === true)) {
          swiper2.setGrabCursor(true);
        }
        swiper2.emit("sliderFirstMove", e);
      }
      let loopFixed;
      if (data.isMoved && prevTouchesDirection !== swiper2.touchesDirection && isLoop && Math.abs(diff) >= 1) {
        swiper2.loopFix({
          direction: swiper2.swipeDirection,
          setTranslate: true
        });
        loopFixed = true;
      }
      swiper2.emit("sliderMove", e);
      data.isMoved = true;
      data.currentTranslate = diff + data.startTranslate;
      let disableParentSwiper = true;
      let resistanceRatio = params.resistanceRatio;
      if (params.touchReleaseOnEdges) {
        resistanceRatio = 0;
      }
      if (diff > 0) {
        if (isLoop && !loopFixed && data.currentTranslate > (params.centeredSlides ? swiper2.minTranslate() - swiper2.size / 2 : swiper2.minTranslate())) {
          swiper2.loopFix({
            direction: "prev",
            setTranslate: true,
            activeSlideIndex: 0
          });
        }
        if (data.currentTranslate > swiper2.minTranslate()) {
          disableParentSwiper = false;
          if (params.resistance) {
            data.currentTranslate = swiper2.minTranslate() - 1 + (-swiper2.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
          }
        }
      } else if (diff < 0) {
        if (isLoop && !loopFixed && data.currentTranslate < (params.centeredSlides ? swiper2.maxTranslate() + swiper2.size / 2 : swiper2.maxTranslate())) {
          swiper2.loopFix({
            direction: "next",
            setTranslate: true,
            activeSlideIndex: swiper2.slides.length - (params.slidesPerView === "auto" ? swiper2.slidesPerViewDynamic() : Math.ceil(parseFloat(params.slidesPerView, 10)))
          });
        }
        if (data.currentTranslate < swiper2.maxTranslate()) {
          disableParentSwiper = false;
          if (params.resistance) {
            data.currentTranslate = swiper2.maxTranslate() + 1 - (swiper2.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
          }
        }
      }
      if (disableParentSwiper) {
        e.preventedByNestedSwiper = true;
      }
      if (!swiper2.allowSlideNext && swiper2.swipeDirection === "next" && data.currentTranslate < data.startTranslate) {
        data.currentTranslate = data.startTranslate;
      }
      if (!swiper2.allowSlidePrev && swiper2.swipeDirection === "prev" && data.currentTranslate > data.startTranslate) {
        data.currentTranslate = data.startTranslate;
      }
      if (!swiper2.allowSlidePrev && !swiper2.allowSlideNext) {
        data.currentTranslate = data.startTranslate;
      }
      if (params.threshold > 0) {
        if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
          if (!data.allowThresholdMove) {
            data.allowThresholdMove = true;
            touches.startX = touches.currentX;
            touches.startY = touches.currentY;
            data.currentTranslate = data.startTranslate;
            touches.diff = swiper2.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
            return;
          }
        } else {
          data.currentTranslate = data.startTranslate;
          return;
        }
      }
      if (!params.followFinger || params.cssMode)
        return;
      if (params.freeMode && params.freeMode.enabled && swiper2.freeMode || params.watchSlidesProgress) {
        swiper2.updateActiveIndex();
        swiper2.updateSlidesClasses();
      }
      if (swiper2.params.freeMode && params.freeMode.enabled && swiper2.freeMode) {
        swiper2.freeMode.onTouchMove();
      }
      swiper2.updateProgress(data.currentTranslate);
      swiper2.setTranslate(data.currentTranslate);
    }
    function onTouchEnd(event2) {
      const swiper2 = this;
      const data = swiper2.touchEventsData;
      const pointerIndex = data.evCache.findIndex((cachedEv) => cachedEv.pointerId === event2.pointerId);
      if (pointerIndex >= 0) {
        data.evCache.splice(pointerIndex, 1);
      }
      if (["pointercancel", "pointerout", "pointerleave"].includes(event2.type)) {
        const proceed = event2.type === "pointercancel" && (swiper2.browser.isSafari || swiper2.browser.isWebView);
        if (!proceed) {
          return;
        }
      }
      const {
        params,
        touches,
        rtlTranslate: rtl,
        slidesGrid,
        enabled
      } = swiper2;
      if (!enabled)
        return;
      if (!params.simulateTouch && event2.pointerType === "mouse")
        return;
      let e = event2;
      if (e.originalEvent)
        e = e.originalEvent;
      if (data.allowTouchCallbacks) {
        swiper2.emit("touchEnd", e);
      }
      data.allowTouchCallbacks = false;
      if (!data.isTouched) {
        if (data.isMoved && params.grabCursor) {
          swiper2.setGrabCursor(false);
        }
        data.isMoved = false;
        data.startMoving = false;
        return;
      }
      if (params.grabCursor && data.isMoved && data.isTouched && (swiper2.allowSlideNext === true || swiper2.allowSlidePrev === true)) {
        swiper2.setGrabCursor(false);
      }
      const touchEndTime = now();
      const timeDiff = touchEndTime - data.touchStartTime;
      if (swiper2.allowClick) {
        const pathTree = e.path || e.composedPath && e.composedPath();
        swiper2.updateClickedSlide(pathTree && pathTree[0] || e.target);
        swiper2.emit("tap click", e);
        if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
          swiper2.emit("doubleTap doubleClick", e);
        }
      }
      data.lastClickTime = now();
      nextTick(() => {
        if (!swiper2.destroyed)
          swiper2.allowClick = true;
      });
      if (!data.isTouched || !data.isMoved || !swiper2.swipeDirection || touches.diff === 0 || data.currentTranslate === data.startTranslate) {
        data.isTouched = false;
        data.isMoved = false;
        data.startMoving = false;
        return;
      }
      data.isTouched = false;
      data.isMoved = false;
      data.startMoving = false;
      let currentPos;
      if (params.followFinger) {
        currentPos = rtl ? swiper2.translate : -swiper2.translate;
      } else {
        currentPos = -data.currentTranslate;
      }
      if (params.cssMode) {
        return;
      }
      if (swiper2.params.freeMode && params.freeMode.enabled) {
        swiper2.freeMode.onTouchEnd({
          currentPos
        });
        return;
      }
      let stopIndex = 0;
      let groupSize = swiper2.slidesSizesGrid[0];
      for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
        const increment2 = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
        if (typeof slidesGrid[i + increment2] !== "undefined") {
          if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment2]) {
            stopIndex = i;
            groupSize = slidesGrid[i + increment2] - slidesGrid[i];
          }
        } else if (currentPos >= slidesGrid[i]) {
          stopIndex = i;
          groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
        }
      }
      let rewindFirstIndex = null;
      let rewindLastIndex = null;
      if (params.rewind) {
        if (swiper2.isBeginning) {
          rewindLastIndex = swiper2.params.virtual && swiper2.params.virtual.enabled && swiper2.virtual ? swiper2.virtual.slides.length - 1 : swiper2.slides.length - 1;
        } else if (swiper2.isEnd) {
          rewindFirstIndex = 0;
        }
      }
      const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
      const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
      if (timeDiff > params.longSwipesMs) {
        if (!params.longSwipes) {
          swiper2.slideTo(swiper2.activeIndex);
          return;
        }
        if (swiper2.swipeDirection === "next") {
          if (ratio >= params.longSwipesRatio)
            swiper2.slideTo(params.rewind && swiper2.isEnd ? rewindFirstIndex : stopIndex + increment);
          else
            swiper2.slideTo(stopIndex);
        }
        if (swiper2.swipeDirection === "prev") {
          if (ratio > 1 - params.longSwipesRatio) {
            swiper2.slideTo(stopIndex + increment);
          } else if (rewindLastIndex !== null && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) {
            swiper2.slideTo(rewindLastIndex);
          } else {
            swiper2.slideTo(stopIndex);
          }
        }
      } else {
        if (!params.shortSwipes) {
          swiper2.slideTo(swiper2.activeIndex);
          return;
        }
        const isNavButtonTarget = swiper2.navigation && (e.target === swiper2.navigation.nextEl || e.target === swiper2.navigation.prevEl);
        if (!isNavButtonTarget) {
          if (swiper2.swipeDirection === "next") {
            swiper2.slideTo(rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment);
          }
          if (swiper2.swipeDirection === "prev") {
            swiper2.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
          }
        } else if (e.target === swiper2.navigation.nextEl) {
          swiper2.slideTo(stopIndex + increment);
        } else {
          swiper2.slideTo(stopIndex);
        }
      }
    }
    function onResize() {
      const swiper2 = this;
      const {
        params,
        el
      } = swiper2;
      if (el && el.offsetWidth === 0)
        return;
      if (params.breakpoints) {
        swiper2.setBreakpoint();
      }
      const {
        allowSlideNext,
        allowSlidePrev,
        snapGrid
      } = swiper2;
      const isVirtual = swiper2.virtual && swiper2.params.virtual.enabled;
      swiper2.allowSlideNext = true;
      swiper2.allowSlidePrev = true;
      swiper2.updateSize();
      swiper2.updateSlides();
      swiper2.updateSlidesClasses();
      const isVirtualLoop = isVirtual && params.loop;
      if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper2.isEnd && !swiper2.isBeginning && !swiper2.params.centeredSlides && !isVirtualLoop) {
        swiper2.slideTo(swiper2.slides.length - 1, 0, false, true);
      } else {
        if (swiper2.params.loop && !isVirtual) {
          swiper2.slideToLoop(swiper2.realIndex, 0, false, true);
        } else {
          swiper2.slideTo(swiper2.activeIndex, 0, false, true);
        }
      }
      if (swiper2.autoplay && swiper2.autoplay.running && swiper2.autoplay.paused) {
        clearTimeout(swiper2.autoplay.resizeTimeout);
        swiper2.autoplay.resizeTimeout = setTimeout(() => {
          if (swiper2.autoplay && swiper2.autoplay.running && swiper2.autoplay.paused) {
            swiper2.autoplay.resume();
          }
        }, 500);
      }
      swiper2.allowSlidePrev = allowSlidePrev;
      swiper2.allowSlideNext = allowSlideNext;
      if (swiper2.params.watchOverflow && snapGrid !== swiper2.snapGrid) {
        swiper2.checkOverflow();
      }
    }
    function onClick(e) {
      const swiper2 = this;
      if (!swiper2.enabled)
        return;
      if (!swiper2.allowClick) {
        if (swiper2.params.preventClicks)
          e.preventDefault();
        if (swiper2.params.preventClicksPropagation && swiper2.animating) {
          e.stopPropagation();
          e.stopImmediatePropagation();
        }
      }
    }
    function onScroll() {
      const swiper2 = this;
      const {
        wrapperEl,
        rtlTranslate,
        enabled
      } = swiper2;
      if (!enabled)
        return;
      swiper2.previousTranslate = swiper2.translate;
      if (swiper2.isHorizontal()) {
        swiper2.translate = -wrapperEl.scrollLeft;
      } else {
        swiper2.translate = -wrapperEl.scrollTop;
      }
      if (swiper2.translate === 0)
        swiper2.translate = 0;
      swiper2.updateActiveIndex();
      swiper2.updateSlidesClasses();
      let newProgress;
      const translatesDiff = swiper2.maxTranslate() - swiper2.minTranslate();
      if (translatesDiff === 0) {
        newProgress = 0;
      } else {
        newProgress = (swiper2.translate - swiper2.minTranslate()) / translatesDiff;
      }
      if (newProgress !== swiper2.progress) {
        swiper2.updateProgress(rtlTranslate ? -swiper2.translate : swiper2.translate);
      }
      swiper2.emit("setTranslate", swiper2.translate, false);
    }
    function onLoad(e) {
      const swiper2 = this;
      processLazyPreloader(swiper2, e.target);
      swiper2.update();
    }
    let dummyEventAttached = false;
    function dummyEventListener() {
    }
    const events = (swiper2, method) => {
      const document2 = getDocument();
      const {
        params,
        el,
        wrapperEl,
        device
      } = swiper2;
      const capture = !!params.nested;
      const domMethod = method === "on" ? "addEventListener" : "removeEventListener";
      const swiperMethod = method;
      el[domMethod]("pointerdown", swiper2.onTouchStart, {
        passive: false
      });
      document2[domMethod]("pointermove", swiper2.onTouchMove, {
        passive: false,
        capture
      });
      document2[domMethod]("pointerup", swiper2.onTouchEnd, {
        passive: true
      });
      document2[domMethod]("pointercancel", swiper2.onTouchEnd, {
        passive: true
      });
      document2[domMethod]("pointerout", swiper2.onTouchEnd, {
        passive: true
      });
      document2[domMethod]("pointerleave", swiper2.onTouchEnd, {
        passive: true
      });
      if (params.preventClicks || params.preventClicksPropagation) {
        el[domMethod]("click", swiper2.onClick, true);
      }
      if (params.cssMode) {
        wrapperEl[domMethod]("scroll", swiper2.onScroll);
      }
      if (params.updateOnWindowResize) {
        swiper2[swiperMethod](device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, true);
      } else {
        swiper2[swiperMethod]("observerUpdate", onResize, true);
      }
      el[domMethod]("load", swiper2.onLoad, {
        capture: true
      });
    };
    function attachEvents() {
      const swiper2 = this;
      const document2 = getDocument();
      const {
        params
      } = swiper2;
      swiper2.onTouchStart = onTouchStart.bind(swiper2);
      swiper2.onTouchMove = onTouchMove.bind(swiper2);
      swiper2.onTouchEnd = onTouchEnd.bind(swiper2);
      if (params.cssMode) {
        swiper2.onScroll = onScroll.bind(swiper2);
      }
      swiper2.onClick = onClick.bind(swiper2);
      swiper2.onLoad = onLoad.bind(swiper2);
      if (!dummyEventAttached) {
        document2.addEventListener("touchstart", dummyEventListener);
        dummyEventAttached = true;
      }
      events(swiper2, "on");
    }
    function detachEvents() {
      const swiper2 = this;
      events(swiper2, "off");
    }
    var events$1 = {
      attachEvents,
      detachEvents
    };
    const isGridEnabled = (swiper2, params) => {
      return swiper2.grid && params.grid && params.grid.rows > 1;
    };
    function setBreakpoint() {
      const swiper2 = this;
      const {
        realIndex,
        initialized,
        params,
        el
      } = swiper2;
      const breakpoints2 = params.breakpoints;
      if (!breakpoints2 || breakpoints2 && Object.keys(breakpoints2).length === 0)
        return;
      const breakpoint = swiper2.getBreakpoint(breakpoints2, swiper2.params.breakpointsBase, swiper2.el);
      if (!breakpoint || swiper2.currentBreakpoint === breakpoint)
        return;
      const breakpointOnlyParams = breakpoint in breakpoints2 ? breakpoints2[breakpoint] : void 0;
      const breakpointParams = breakpointOnlyParams || swiper2.originalParams;
      const wasMultiRow = isGridEnabled(swiper2, params);
      const isMultiRow = isGridEnabled(swiper2, breakpointParams);
      const wasEnabled = params.enabled;
      if (wasMultiRow && !isMultiRow) {
        el.classList.remove(`${params.containerModifierClass}grid`, `${params.containerModifierClass}grid-column`);
        swiper2.emitContainerClasses();
      } else if (!wasMultiRow && isMultiRow) {
        el.classList.add(`${params.containerModifierClass}grid`);
        if (breakpointParams.grid.fill && breakpointParams.grid.fill === "column" || !breakpointParams.grid.fill && params.grid.fill === "column") {
          el.classList.add(`${params.containerModifierClass}grid-column`);
        }
        swiper2.emitContainerClasses();
      }
      ["navigation", "pagination", "scrollbar"].forEach((prop) => {
        const wasModuleEnabled = params[prop] && params[prop].enabled;
        const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
        if (wasModuleEnabled && !isModuleEnabled) {
          swiper2[prop].disable();
        }
        if (!wasModuleEnabled && isModuleEnabled) {
          swiper2[prop].enable();
        }
      });
      const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
      const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
      if (directionChanged && initialized) {
        swiper2.changeDirection();
      }
      extend(swiper2.params, breakpointParams);
      const isEnabled = swiper2.params.enabled;
      Object.assign(swiper2, {
        allowTouchMove: swiper2.params.allowTouchMove,
        allowSlideNext: swiper2.params.allowSlideNext,
        allowSlidePrev: swiper2.params.allowSlidePrev
      });
      if (wasEnabled && !isEnabled) {
        swiper2.disable();
      } else if (!wasEnabled && isEnabled) {
        swiper2.enable();
      }
      swiper2.currentBreakpoint = breakpoint;
      swiper2.emit("_beforeBreakpoint", breakpointParams);
      if (needsReLoop && initialized) {
        swiper2.loopDestroy();
        swiper2.loopCreate(realIndex);
        swiper2.updateSlides();
      }
      swiper2.emit("breakpoint", breakpointParams);
    }
    function getBreakpoint(breakpoints2, base, containerEl) {
      if (base === void 0) {
        base = "window";
      }
      if (!breakpoints2 || base === "container" && !containerEl)
        return void 0;
      let breakpoint = false;
      const window2 = getWindow();
      const currentHeight = base === "window" ? window2.innerHeight : containerEl.clientHeight;
      const points = Object.keys(breakpoints2).map((point) => {
        if (typeof point === "string" && point.indexOf("@") === 0) {
          const minRatio = parseFloat(point.substr(1));
          const value = currentHeight * minRatio;
          return {
            value,
            point
          };
        }
        return {
          value: point,
          point
        };
      });
      points.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));
      for (let i = 0; i < points.length; i += 1) {
        const {
          point,
          value
        } = points[i];
        if (base === "window") {
          if (window2.matchMedia(`(min-width: ${value}px)`).matches) {
            breakpoint = point;
          }
        } else if (value <= containerEl.clientWidth) {
          breakpoint = point;
        }
      }
      return breakpoint || "max";
    }
    var breakpoints = {
      setBreakpoint,
      getBreakpoint
    };
    function prepareClasses(entries, prefix) {
      const resultClasses = [];
      entries.forEach((item) => {
        if (typeof item === "object") {
          Object.keys(item).forEach((classNames) => {
            if (item[classNames]) {
              resultClasses.push(prefix + classNames);
            }
          });
        } else if (typeof item === "string") {
          resultClasses.push(prefix + item);
        }
      });
      return resultClasses;
    }
    function addClasses() {
      const swiper2 = this;
      const {
        classNames,
        params,
        rtl,
        el,
        device
      } = swiper2;
      const suffixes = prepareClasses(["initialized", params.direction, {
        "free-mode": swiper2.params.freeMode && params.freeMode.enabled
      }, {
        "autoheight": params.autoHeight
      }, {
        "rtl": rtl
      }, {
        "grid": params.grid && params.grid.rows > 1
      }, {
        "grid-column": params.grid && params.grid.rows > 1 && params.grid.fill === "column"
      }, {
        "android": device.android
      }, {
        "ios": device.ios
      }, {
        "css-mode": params.cssMode
      }, {
        "centered": params.cssMode && params.centeredSlides
      }, {
        "watch-progress": params.watchSlidesProgress
      }], params.containerModifierClass);
      classNames.push(...suffixes);
      el.classList.add(...classNames);
      swiper2.emitContainerClasses();
    }
    function removeClasses() {
      const swiper2 = this;
      const {
        el,
        classNames
      } = swiper2;
      el.classList.remove(...classNames);
      swiper2.emitContainerClasses();
    }
    var classes = {
      addClasses,
      removeClasses
    };
    function checkOverflow() {
      const swiper2 = this;
      const {
        isLocked: wasLocked,
        params
      } = swiper2;
      const {
        slidesOffsetBefore
      } = params;
      if (slidesOffsetBefore) {
        const lastSlideIndex = swiper2.slides.length - 1;
        const lastSlideRightEdge = swiper2.slidesGrid[lastSlideIndex] + swiper2.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
        swiper2.isLocked = swiper2.size > lastSlideRightEdge;
      } else {
        swiper2.isLocked = swiper2.snapGrid.length === 1;
      }
      if (params.allowSlideNext === true) {
        swiper2.allowSlideNext = !swiper2.isLocked;
      }
      if (params.allowSlidePrev === true) {
        swiper2.allowSlidePrev = !swiper2.isLocked;
      }
      if (wasLocked && wasLocked !== swiper2.isLocked) {
        swiper2.isEnd = false;
      }
      if (wasLocked !== swiper2.isLocked) {
        swiper2.emit(swiper2.isLocked ? "lock" : "unlock");
      }
    }
    var checkOverflow$1 = {
      checkOverflow
    };
    var defaults = {
      init: true,
      direction: "horizontal",
      oneWayMovement: false,
      touchEventsTarget: "wrapper",
      initialSlide: 0,
      speed: 300,
      cssMode: false,
      updateOnWindowResize: true,
      resizeObserver: true,
      nested: false,
      createElements: false,
      enabled: true,
      focusableElements: "input, select, option, textarea, button, video, label",
      // Overrides
      width: null,
      height: null,
      //
      preventInteractionOnTransition: false,
      // ssr
      userAgent: null,
      url: null,
      // To support iOS's swipe-to-go-back gesture (when being used in-app).
      edgeSwipeDetection: false,
      edgeSwipeThreshold: 20,
      // Autoheight
      autoHeight: false,
      // Set wrapper width
      setWrapperSize: false,
      // Virtual Translate
      virtualTranslate: false,
      // Effects
      effect: "slide",
      // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
      // Breakpoints
      breakpoints: void 0,
      breakpointsBase: "window",
      // Slides grid
      spaceBetween: 0,
      slidesPerView: 1,
      slidesPerGroup: 1,
      slidesPerGroupSkip: 0,
      slidesPerGroupAuto: false,
      centeredSlides: false,
      centeredSlidesBounds: false,
      slidesOffsetBefore: 0,
      // in px
      slidesOffsetAfter: 0,
      // in px
      normalizeSlideIndex: true,
      centerInsufficientSlides: false,
      // Disable swiper and hide navigation when container not overflow
      watchOverflow: true,
      // Round length
      roundLengths: false,
      // Touches
      touchRatio: 1,
      touchAngle: 45,
      simulateTouch: true,
      shortSwipes: true,
      longSwipes: true,
      longSwipesRatio: 0.5,
      longSwipesMs: 300,
      followFinger: true,
      allowTouchMove: true,
      threshold: 5,
      touchMoveStopPropagation: false,
      touchStartPreventDefault: true,
      touchStartForcePreventDefault: false,
      touchReleaseOnEdges: false,
      // Unique Navigation Elements
      uniqueNavElements: true,
      // Resistance
      resistance: true,
      resistanceRatio: 0.85,
      // Progress
      watchSlidesProgress: false,
      // Cursor
      grabCursor: false,
      // Clicks
      preventClicks: true,
      preventClicksPropagation: true,
      slideToClickedSlide: false,
      // loop
      loop: false,
      loopedSlides: null,
      loopPreventsSliding: true,
      // rewind
      rewind: false,
      // Swiping/no swiping
      allowSlidePrev: true,
      allowSlideNext: true,
      swipeHandler: null,
      // '.swipe-handler',
      noSwiping: true,
      noSwipingClass: "swiper-no-swiping",
      noSwipingSelector: null,
      // Passive Listeners
      passiveListeners: true,
      maxBackfaceHiddenSlides: 10,
      // NS
      containerModifierClass: "swiper-",
      // NEW
      slideClass: "swiper-slide",
      slideActiveClass: "swiper-slide-active",
      slideVisibleClass: "swiper-slide-visible",
      slideNextClass: "swiper-slide-next",
      slidePrevClass: "swiper-slide-prev",
      wrapperClass: "swiper-wrapper",
      lazyPreloaderClass: "swiper-lazy-preloader",
      lazyPreloadPrevNext: 0,
      // Callbacks
      runCallbacksOnInit: true,
      // Internals
      _emitClasses: false
    };
    function moduleExtendParams(params, allModulesParams) {
      return function extendParams(obj) {
        if (obj === void 0) {
          obj = {};
        }
        const moduleParamName = Object.keys(obj)[0];
        const moduleParams = obj[moduleParamName];
        if (typeof moduleParams !== "object" || moduleParams === null) {
          extend(allModulesParams, obj);
          return;
        }
        if (["navigation", "pagination", "scrollbar"].indexOf(moduleParamName) >= 0 && params[moduleParamName] === true) {
          params[moduleParamName] = {
            auto: true
          };
        }
        if (!(moduleParamName in params && "enabled" in moduleParams)) {
          extend(allModulesParams, obj);
          return;
        }
        if (params[moduleParamName] === true) {
          params[moduleParamName] = {
            enabled: true
          };
        }
        if (typeof params[moduleParamName] === "object" && !("enabled" in params[moduleParamName])) {
          params[moduleParamName].enabled = true;
        }
        if (!params[moduleParamName])
          params[moduleParamName] = {
            enabled: false
          };
        extend(allModulesParams, obj);
      };
    }
    const prototypes = {
      eventsEmitter,
      update,
      translate,
      transition,
      slide,
      loop,
      grabCursor,
      events: events$1,
      breakpoints,
      checkOverflow: checkOverflow$1,
      classes
    };
    const extendedDefaults = {};
    class Swiper2 {
      constructor() {
        let el;
        let params;
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === "Object") {
          params = args[0];
        } else {
          [el, params] = args;
        }
        if (!params)
          params = {};
        params = extend({}, params);
        if (el && !params.el)
          params.el = el;
        const document2 = getDocument();
        if (params.el && typeof params.el === "string" && document2.querySelectorAll(params.el).length > 1) {
          const swipers = [];
          document2.querySelectorAll(params.el).forEach((containerEl) => {
            const newParams = extend({}, params, {
              el: containerEl
            });
            swipers.push(new Swiper2(newParams));
          });
          return swipers;
        }
        const swiper2 = this;
        swiper2.__swiper__ = true;
        swiper2.support = getSupport();
        swiper2.device = getDevice({
          userAgent: params.userAgent
        });
        swiper2.browser = getBrowser();
        swiper2.eventsListeners = {};
        swiper2.eventsAnyListeners = [];
        swiper2.modules = [...swiper2.__modules__];
        if (params.modules && Array.isArray(params.modules)) {
          swiper2.modules.push(...params.modules);
        }
        const allModulesParams = {};
        swiper2.modules.forEach((mod) => {
          mod({
            params,
            swiper: swiper2,
            extendParams: moduleExtendParams(params, allModulesParams),
            on: swiper2.on.bind(swiper2),
            once: swiper2.once.bind(swiper2),
            off: swiper2.off.bind(swiper2),
            emit: swiper2.emit.bind(swiper2)
          });
        });
        const swiperParams = extend({}, defaults, allModulesParams);
        swiper2.params = extend({}, swiperParams, extendedDefaults, params);
        swiper2.originalParams = extend({}, swiper2.params);
        swiper2.passedParams = extend({}, params);
        if (swiper2.params && swiper2.params.on) {
          Object.keys(swiper2.params.on).forEach((eventName) => {
            swiper2.on(eventName, swiper2.params.on[eventName]);
          });
        }
        if (swiper2.params && swiper2.params.onAny) {
          swiper2.onAny(swiper2.params.onAny);
        }
        Object.assign(swiper2, {
          enabled: swiper2.params.enabled,
          el,
          // Classes
          classNames: [],
          // Slides
          slides: [],
          slidesGrid: [],
          snapGrid: [],
          slidesSizesGrid: [],
          // isDirection
          isHorizontal() {
            return swiper2.params.direction === "horizontal";
          },
          isVertical() {
            return swiper2.params.direction === "vertical";
          },
          // Indexes
          activeIndex: 0,
          realIndex: 0,
          //
          isBeginning: true,
          isEnd: false,
          // Props
          translate: 0,
          previousTranslate: 0,
          progress: 0,
          velocity: 0,
          animating: false,
          cssOverflowAdjustment() {
            return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
          },
          // Locks
          allowSlideNext: swiper2.params.allowSlideNext,
          allowSlidePrev: swiper2.params.allowSlidePrev,
          // Touch Events
          touchEventsData: {
            isTouched: void 0,
            isMoved: void 0,
            allowTouchCallbacks: void 0,
            touchStartTime: void 0,
            isScrolling: void 0,
            currentTranslate: void 0,
            startTranslate: void 0,
            allowThresholdMove: void 0,
            // Form elements to match
            focusableElements: swiper2.params.focusableElements,
            // Last click time
            lastClickTime: 0,
            clickTimeout: void 0,
            // Velocities
            velocities: [],
            allowMomentumBounce: void 0,
            startMoving: void 0,
            evCache: []
          },
          // Clicks
          allowClick: true,
          // Touches
          allowTouchMove: swiper2.params.allowTouchMove,
          touches: {
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            diff: 0
          },
          // Images
          imagesToLoad: [],
          imagesLoaded: 0
        });
        swiper2.emit("_swiper");
        if (swiper2.params.init) {
          swiper2.init();
        }
        return swiper2;
      }
      getSlideIndex(slideEl) {
        const {
          slidesEl,
          params
        } = this;
        const slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
        const firstSlideIndex = elementIndex(slides[0]);
        return elementIndex(slideEl) - firstSlideIndex;
      }
      getSlideIndexByData(index) {
        return this.getSlideIndex(this.slides.filter((slideEl) => slideEl.getAttribute("data-swiper-slide-index") * 1 === index)[0]);
      }
      recalcSlides() {
        const swiper2 = this;
        const {
          slidesEl,
          params
        } = swiper2;
        swiper2.slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
      }
      enable() {
        const swiper2 = this;
        if (swiper2.enabled)
          return;
        swiper2.enabled = true;
        if (swiper2.params.grabCursor) {
          swiper2.setGrabCursor();
        }
        swiper2.emit("enable");
      }
      disable() {
        const swiper2 = this;
        if (!swiper2.enabled)
          return;
        swiper2.enabled = false;
        if (swiper2.params.grabCursor) {
          swiper2.unsetGrabCursor();
        }
        swiper2.emit("disable");
      }
      setProgress(progress, speed) {
        const swiper2 = this;
        progress = Math.min(Math.max(progress, 0), 1);
        const min = swiper2.minTranslate();
        const max = swiper2.maxTranslate();
        const current = (max - min) * progress + min;
        swiper2.translateTo(current, typeof speed === "undefined" ? 0 : speed);
        swiper2.updateActiveIndex();
        swiper2.updateSlidesClasses();
      }
      emitContainerClasses() {
        const swiper2 = this;
        if (!swiper2.params._emitClasses || !swiper2.el)
          return;
        const cls = swiper2.el.className.split(" ").filter((className) => {
          return className.indexOf("swiper") === 0 || className.indexOf(swiper2.params.containerModifierClass) === 0;
        });
        swiper2.emit("_containerClasses", cls.join(" "));
      }
      getSlideClasses(slideEl) {
        const swiper2 = this;
        if (swiper2.destroyed)
          return "";
        return slideEl.className.split(" ").filter((className) => {
          return className.indexOf("swiper-slide") === 0 || className.indexOf(swiper2.params.slideClass) === 0;
        }).join(" ");
      }
      emitSlidesClasses() {
        const swiper2 = this;
        if (!swiper2.params._emitClasses || !swiper2.el)
          return;
        const updates = [];
        swiper2.slides.forEach((slideEl) => {
          const classNames = swiper2.getSlideClasses(slideEl);
          updates.push({
            slideEl,
            classNames
          });
          swiper2.emit("_slideClass", slideEl, classNames);
        });
        swiper2.emit("_slideClasses", updates);
      }
      slidesPerViewDynamic(view, exact) {
        if (view === void 0) {
          view = "current";
        }
        if (exact === void 0) {
          exact = false;
        }
        const swiper2 = this;
        const {
          params,
          slides,
          slidesGrid,
          slidesSizesGrid,
          size: swiperSize,
          activeIndex
        } = swiper2;
        let spv = 1;
        if (params.centeredSlides) {
          let slideSize = slides[activeIndex].swiperSlideSize;
          let breakLoop;
          for (let i = activeIndex + 1; i < slides.length; i += 1) {
            if (slides[i] && !breakLoop) {
              slideSize += slides[i].swiperSlideSize;
              spv += 1;
              if (slideSize > swiperSize)
                breakLoop = true;
            }
          }
          for (let i = activeIndex - 1; i >= 0; i -= 1) {
            if (slides[i] && !breakLoop) {
              slideSize += slides[i].swiperSlideSize;
              spv += 1;
              if (slideSize > swiperSize)
                breakLoop = true;
            }
          }
        } else {
          if (view === "current") {
            for (let i = activeIndex + 1; i < slides.length; i += 1) {
              const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
              if (slideInView) {
                spv += 1;
              }
            }
          } else {
            for (let i = activeIndex - 1; i >= 0; i -= 1) {
              const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
              if (slideInView) {
                spv += 1;
              }
            }
          }
        }
        return spv;
      }
      update() {
        const swiper2 = this;
        if (!swiper2 || swiper2.destroyed)
          return;
        const {
          snapGrid,
          params
        } = swiper2;
        if (params.breakpoints) {
          swiper2.setBreakpoint();
        }
        [...swiper2.el.querySelectorAll('[loading="lazy"]')].forEach((imageEl) => {
          if (imageEl.complete) {
            processLazyPreloader(swiper2, imageEl);
          }
        });
        swiper2.updateSize();
        swiper2.updateSlides();
        swiper2.updateProgress();
        swiper2.updateSlidesClasses();
        function setTranslate2() {
          const translateValue = swiper2.rtlTranslate ? swiper2.translate * -1 : swiper2.translate;
          const newTranslate = Math.min(Math.max(translateValue, swiper2.maxTranslate()), swiper2.minTranslate());
          swiper2.setTranslate(newTranslate);
          swiper2.updateActiveIndex();
          swiper2.updateSlidesClasses();
        }
        let translated;
        if (swiper2.params.freeMode && swiper2.params.freeMode.enabled) {
          setTranslate2();
          if (swiper2.params.autoHeight) {
            swiper2.updateAutoHeight();
          }
        } else {
          if ((swiper2.params.slidesPerView === "auto" || swiper2.params.slidesPerView > 1) && swiper2.isEnd && !swiper2.params.centeredSlides) {
            const slides = swiper2.virtual && swiper2.params.virtual.enabled ? swiper2.virtual.slides : swiper2.slides;
            translated = swiper2.slideTo(slides.length - 1, 0, false, true);
          } else {
            translated = swiper2.slideTo(swiper2.activeIndex, 0, false, true);
          }
          if (!translated) {
            setTranslate2();
          }
        }
        if (params.watchOverflow && snapGrid !== swiper2.snapGrid) {
          swiper2.checkOverflow();
        }
        swiper2.emit("update");
      }
      changeDirection(newDirection, needUpdate) {
        if (needUpdate === void 0) {
          needUpdate = true;
        }
        const swiper2 = this;
        const currentDirection = swiper2.params.direction;
        if (!newDirection) {
          newDirection = currentDirection === "horizontal" ? "vertical" : "horizontal";
        }
        if (newDirection === currentDirection || newDirection !== "horizontal" && newDirection !== "vertical") {
          return swiper2;
        }
        swiper2.el.classList.remove(`${swiper2.params.containerModifierClass}${currentDirection}`);
        swiper2.el.classList.add(`${swiper2.params.containerModifierClass}${newDirection}`);
        swiper2.emitContainerClasses();
        swiper2.params.direction = newDirection;
        swiper2.slides.forEach((slideEl) => {
          if (newDirection === "vertical") {
            slideEl.style.width = "";
          } else {
            slideEl.style.height = "";
          }
        });
        swiper2.emit("changeDirection");
        if (needUpdate)
          swiper2.update();
        return swiper2;
      }
      changeLanguageDirection(direction) {
        const swiper2 = this;
        if (swiper2.rtl && direction === "rtl" || !swiper2.rtl && direction === "ltr")
          return;
        swiper2.rtl = direction === "rtl";
        swiper2.rtlTranslate = swiper2.params.direction === "horizontal" && swiper2.rtl;
        if (swiper2.rtl) {
          swiper2.el.classList.add(`${swiper2.params.containerModifierClass}rtl`);
          swiper2.el.dir = "rtl";
        } else {
          swiper2.el.classList.remove(`${swiper2.params.containerModifierClass}rtl`);
          swiper2.el.dir = "ltr";
        }
        swiper2.update();
      }
      mount(element) {
        const swiper2 = this;
        if (swiper2.mounted)
          return true;
        let el = element || swiper2.params.el;
        if (typeof el === "string") {
          el = document.querySelector(el);
        }
        if (!el) {
          return false;
        }
        el.swiper = swiper2;
        if (el.shadowEl) {
          swiper2.isElement = true;
        }
        const getWrapperSelector = () => {
          return `.${(swiper2.params.wrapperClass || "").trim().split(" ").join(".")}`;
        };
        const getWrapper = () => {
          if (el && el.shadowRoot && el.shadowRoot.querySelector) {
            const res = el.shadowRoot.querySelector(getWrapperSelector());
            return res;
          }
          return elementChildren(el, getWrapperSelector())[0];
        };
        let wrapperEl = getWrapper();
        if (!wrapperEl && swiper2.params.createElements) {
          wrapperEl = createElement("div", swiper2.params.wrapperClass);
          el.append(wrapperEl);
          elementChildren(el, `.${swiper2.params.slideClass}`).forEach((slideEl) => {
            wrapperEl.append(slideEl);
          });
        }
        Object.assign(swiper2, {
          el,
          wrapperEl,
          slidesEl: swiper2.isElement ? el : wrapperEl,
          mounted: true,
          // RTL
          rtl: el.dir.toLowerCase() === "rtl" || elementStyle(el, "direction") === "rtl",
          rtlTranslate: swiper2.params.direction === "horizontal" && (el.dir.toLowerCase() === "rtl" || elementStyle(el, "direction") === "rtl"),
          wrongRTL: elementStyle(wrapperEl, "display") === "-webkit-box"
        });
        return true;
      }
      init(el) {
        const swiper2 = this;
        if (swiper2.initialized)
          return swiper2;
        const mounted = swiper2.mount(el);
        if (mounted === false)
          return swiper2;
        swiper2.emit("beforeInit");
        if (swiper2.params.breakpoints) {
          swiper2.setBreakpoint();
        }
        swiper2.addClasses();
        swiper2.updateSize();
        swiper2.updateSlides();
        if (swiper2.params.watchOverflow) {
          swiper2.checkOverflow();
        }
        if (swiper2.params.grabCursor && swiper2.enabled) {
          swiper2.setGrabCursor();
        }
        if (swiper2.params.loop && swiper2.virtual && swiper2.params.virtual.enabled) {
          swiper2.slideTo(swiper2.params.initialSlide + swiper2.virtual.slidesBefore, 0, swiper2.params.runCallbacksOnInit, false, true);
        } else {
          swiper2.slideTo(swiper2.params.initialSlide, 0, swiper2.params.runCallbacksOnInit, false, true);
        }
        if (swiper2.params.loop) {
          swiper2.loopCreate();
        }
        swiper2.attachEvents();
        [...swiper2.el.querySelectorAll('[loading="lazy"]')].forEach((imageEl) => {
          if (imageEl.complete) {
            processLazyPreloader(swiper2, imageEl);
          } else {
            imageEl.addEventListener("load", (e) => {
              processLazyPreloader(swiper2, e.target);
            });
          }
        });
        preload(swiper2);
        swiper2.initialized = true;
        preload(swiper2);
        swiper2.emit("init");
        swiper2.emit("afterInit");
        return swiper2;
      }
      destroy(deleteInstance, cleanStyles) {
        if (deleteInstance === void 0) {
          deleteInstance = true;
        }
        if (cleanStyles === void 0) {
          cleanStyles = true;
        }
        const swiper2 = this;
        const {
          params,
          el,
          wrapperEl,
          slides
        } = swiper2;
        if (typeof swiper2.params === "undefined" || swiper2.destroyed) {
          return null;
        }
        swiper2.emit("beforeDestroy");
        swiper2.initialized = false;
        swiper2.detachEvents();
        if (params.loop) {
          swiper2.loopDestroy();
        }
        if (cleanStyles) {
          swiper2.removeClasses();
          el.removeAttribute("style");
          wrapperEl.removeAttribute("style");
          if (slides && slides.length) {
            slides.forEach((slideEl) => {
              slideEl.classList.remove(params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass);
              slideEl.removeAttribute("style");
              slideEl.removeAttribute("data-swiper-slide-index");
            });
          }
        }
        swiper2.emit("destroy");
        Object.keys(swiper2.eventsListeners).forEach((eventName) => {
          swiper2.off(eventName);
        });
        if (deleteInstance !== false) {
          swiper2.el.swiper = null;
          deleteProps(swiper2);
        }
        swiper2.destroyed = true;
        return null;
      }
      static extendDefaults(newDefaults) {
        extend(extendedDefaults, newDefaults);
      }
      static get extendedDefaults() {
        return extendedDefaults;
      }
      static get defaults() {
        return defaults;
      }
      static installModule(mod) {
        if (!Swiper2.prototype.__modules__)
          Swiper2.prototype.__modules__ = [];
        const modules2 = Swiper2.prototype.__modules__;
        if (typeof mod === "function" && modules2.indexOf(mod) < 0) {
          modules2.push(mod);
        }
      }
      static use(module2) {
        if (Array.isArray(module2)) {
          module2.forEach((m) => Swiper2.installModule(m));
          return Swiper2;
        }
        Swiper2.installModule(module2);
        return Swiper2;
      }
    }
    Object.keys(prototypes).forEach((prototypeGroup) => {
      Object.keys(prototypes[prototypeGroup]).forEach((protoMethod) => {
        Swiper2.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
      });
    });
    Swiper2.use([Resize, Observer]);
    function Virtual(_ref) {
      let {
        swiper: swiper2,
        extendParams,
        on,
        emit
      } = _ref;
      extendParams({
        virtual: {
          enabled: false,
          slides: [],
          cache: true,
          renderSlide: null,
          renderExternal: null,
          renderExternalUpdate: true,
          addSlidesBefore: 0,
          addSlidesAfter: 0
        }
      });
      let cssModeTimeout;
      const document2 = getDocument();
      swiper2.virtual = {
        cache: {},
        from: void 0,
        to: void 0,
        slides: [],
        offset: 0,
        slidesGrid: []
      };
      const tempDOM = document2.createElement("div");
      function renderSlide(slide2, index) {
        const params = swiper2.params.virtual;
        if (params.cache && swiper2.virtual.cache[index]) {
          return swiper2.virtual.cache[index];
        }
        let slideEl;
        if (params.renderSlide) {
          slideEl = params.renderSlide.call(swiper2, slide2, index);
          if (typeof slideEl === "string") {
            tempDOM.innerHTML = slideEl;
            slideEl = tempDOM.children[0];
          }
        } else if (swiper2.isElement) {
          slideEl = createElement("swiper-slide");
        } else {
          slideEl = createElement("div", swiper2.params.slideClass);
        }
        slideEl.setAttribute("data-swiper-slide-index", index);
        if (!params.renderSlide) {
          slideEl.innerHTML = slide2;
        }
        if (params.cache)
          swiper2.virtual.cache[index] = slideEl;
        return slideEl;
      }
      function update2(force) {
        const {
          slidesPerView,
          slidesPerGroup,
          centeredSlides,
          loop: isLoop
        } = swiper2.params;
        const {
          addSlidesBefore,
          addSlidesAfter
        } = swiper2.params.virtual;
        const {
          from: previousFrom,
          to: previousTo,
          slides,
          slidesGrid: previousSlidesGrid,
          offset: previousOffset
        } = swiper2.virtual;
        if (!swiper2.params.cssMode) {
          swiper2.updateActiveIndex();
        }
        const activeIndex = swiper2.activeIndex || 0;
        let offsetProp;
        if (swiper2.rtlTranslate)
          offsetProp = "right";
        else
          offsetProp = swiper2.isHorizontal() ? "left" : "top";
        let slidesAfter;
        let slidesBefore;
        if (centeredSlides) {
          slidesAfter = Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesAfter;
          slidesBefore = Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesBefore;
        } else {
          slidesAfter = slidesPerView + (slidesPerGroup - 1) + addSlidesAfter;
          slidesBefore = (isLoop ? slidesPerView : slidesPerGroup) + addSlidesBefore;
        }
        let from = activeIndex - slidesBefore;
        let to = activeIndex + slidesAfter;
        if (!isLoop) {
          from = Math.max(from, 0);
          to = Math.min(to, slides.length - 1);
        }
        let offset = (swiper2.slidesGrid[from] || 0) - (swiper2.slidesGrid[0] || 0);
        if (isLoop && activeIndex >= slidesBefore) {
          from -= slidesBefore;
          if (!centeredSlides)
            offset += swiper2.slidesGrid[0];
        } else if (isLoop && activeIndex < slidesBefore) {
          from = -slidesBefore;
          if (centeredSlides)
            offset += swiper2.slidesGrid[0];
        }
        Object.assign(swiper2.virtual, {
          from,
          to,
          offset,
          slidesGrid: swiper2.slidesGrid,
          slidesBefore,
          slidesAfter
        });
        function onRendered() {
          swiper2.updateSlides();
          swiper2.updateProgress();
          swiper2.updateSlidesClasses();
          emit("virtualUpdate");
        }
        if (previousFrom === from && previousTo === to && !force) {
          if (swiper2.slidesGrid !== previousSlidesGrid && offset !== previousOffset) {
            swiper2.slides.forEach((slideEl) => {
              slideEl.style[offsetProp] = `${offset - Math.abs(swiper2.cssOverflowAdjustment())}px`;
            });
          }
          swiper2.updateProgress();
          emit("virtualUpdate");
          return;
        }
        if (swiper2.params.virtual.renderExternal) {
          swiper2.params.virtual.renderExternal.call(swiper2, {
            offset,
            from,
            to,
            slides: function getSlides() {
              const slidesToRender = [];
              for (let i = from; i <= to; i += 1) {
                slidesToRender.push(slides[i]);
              }
              return slidesToRender;
            }()
          });
          if (swiper2.params.virtual.renderExternalUpdate) {
            onRendered();
          } else {
            emit("virtualUpdate");
          }
          return;
        }
        const prependIndexes = [];
        const appendIndexes = [];
        const getSlideIndex = (index) => {
          let slideIndex = index;
          if (index < 0) {
            slideIndex = slides.length + index;
          } else if (slideIndex >= slides.length) {
            slideIndex = slideIndex - slides.length;
          }
          return slideIndex;
        };
        if (force) {
          swiper2.slidesEl.querySelectorAll(`.${swiper2.params.slideClass}, swiper-slide`).forEach((slideEl) => {
            slideEl.remove();
          });
        } else {
          for (let i = previousFrom; i <= previousTo; i += 1) {
            if (i < from || i > to) {
              const slideIndex = getSlideIndex(i);
              swiper2.slidesEl.querySelectorAll(`.${swiper2.params.slideClass}[data-swiper-slide-index="${slideIndex}"], swiper-slide[data-swiper-slide-index="${slideIndex}"]`).forEach((slideEl) => {
                slideEl.remove();
              });
            }
          }
        }
        const loopFrom = isLoop ? -slides.length : 0;
        const loopTo = isLoop ? slides.length * 2 : slides.length;
        for (let i = loopFrom; i < loopTo; i += 1) {
          if (i >= from && i <= to) {
            const slideIndex = getSlideIndex(i);
            if (typeof previousTo === "undefined" || force) {
              appendIndexes.push(slideIndex);
            } else {
              if (i > previousTo)
                appendIndexes.push(slideIndex);
              if (i < previousFrom)
                prependIndexes.push(slideIndex);
            }
          }
        }
        appendIndexes.forEach((index) => {
          swiper2.slidesEl.append(renderSlide(slides[index], index));
        });
        if (isLoop) {
          for (let i = prependIndexes.length - 1; i >= 0; i -= 1) {
            const index = prependIndexes[i];
            swiper2.slidesEl.prepend(renderSlide(slides[index], index));
          }
        } else {
          prependIndexes.sort((a, b) => b - a);
          prependIndexes.forEach((index) => {
            swiper2.slidesEl.prepend(renderSlide(slides[index], index));
          });
        }
        elementChildren(swiper2.slidesEl, ".swiper-slide, swiper-slide").forEach((slideEl) => {
          slideEl.style[offsetProp] = `${offset - Math.abs(swiper2.cssOverflowAdjustment())}px`;
        });
        onRendered();
      }
      function appendSlide2(slides) {
        if (typeof slides === "object" && "length" in slides) {
          for (let i = 0; i < slides.length; i += 1) {
            if (slides[i])
              swiper2.virtual.slides.push(slides[i]);
          }
        } else {
          swiper2.virtual.slides.push(slides);
        }
        update2(true);
      }
      function prependSlide2(slides) {
        const activeIndex = swiper2.activeIndex;
        let newActiveIndex = activeIndex + 1;
        let numberOfNewSlides = 1;
        if (Array.isArray(slides)) {
          for (let i = 0; i < slides.length; i += 1) {
            if (slides[i])
              swiper2.virtual.slides.unshift(slides[i]);
          }
          newActiveIndex = activeIndex + slides.length;
          numberOfNewSlides = slides.length;
        } else {
          swiper2.virtual.slides.unshift(slides);
        }
        if (swiper2.params.virtual.cache) {
          const cache = swiper2.virtual.cache;
          const newCache = {};
          Object.keys(cache).forEach((cachedIndex) => {
            const cachedEl = cache[cachedIndex];
            const cachedElIndex = cachedEl.getAttribute("data-swiper-slide-index");
            if (cachedElIndex) {
              cachedEl.setAttribute("data-swiper-slide-index", parseInt(cachedElIndex, 10) + numberOfNewSlides);
            }
            newCache[parseInt(cachedIndex, 10) + numberOfNewSlides] = cachedEl;
          });
          swiper2.virtual.cache = newCache;
        }
        update2(true);
        swiper2.slideTo(newActiveIndex, 0);
      }
      function removeSlide2(slidesIndexes) {
        if (typeof slidesIndexes === "undefined" || slidesIndexes === null)
          return;
        let activeIndex = swiper2.activeIndex;
        if (Array.isArray(slidesIndexes)) {
          for (let i = slidesIndexes.length - 1; i >= 0; i -= 1) {
            swiper2.virtual.slides.splice(slidesIndexes[i], 1);
            if (swiper2.params.virtual.cache) {
              delete swiper2.virtual.cache[slidesIndexes[i]];
            }
            if (slidesIndexes[i] < activeIndex)
              activeIndex -= 1;
            activeIndex = Math.max(activeIndex, 0);
          }
        } else {
          swiper2.virtual.slides.splice(slidesIndexes, 1);
          if (swiper2.params.virtual.cache) {
            delete swiper2.virtual.cache[slidesIndexes];
          }
          if (slidesIndexes < activeIndex)
            activeIndex -= 1;
          activeIndex = Math.max(activeIndex, 0);
        }
        update2(true);
        swiper2.slideTo(activeIndex, 0);
      }
      function removeAllSlides2() {
        swiper2.virtual.slides = [];
        if (swiper2.params.virtual.cache) {
          swiper2.virtual.cache = {};
        }
        update2(true);
        swiper2.slideTo(0, 0);
      }
      on("beforeInit", () => {
        if (!swiper2.params.virtual.enabled)
          return;
        let domSlidesAssigned;
        if (typeof swiper2.passedParams.virtual.slides === "undefined") {
          const slides = [...swiper2.slidesEl.children].filter((el) => el.matches(`.${swiper2.params.slideClass}, swiper-slide`));
          if (slides && slides.length) {
            swiper2.virtual.slides = [...slides];
            domSlidesAssigned = true;
            slides.forEach((slideEl, slideIndex) => {
              slideEl.setAttribute("data-swiper-slide-index", slideIndex);
              swiper2.virtual.cache[slideIndex] = slideEl;
              slideEl.remove();
            });
          }
        }
        if (!domSlidesAssigned) {
          swiper2.virtual.slides = swiper2.params.virtual.slides;
        }
        swiper2.classNames.push(`${swiper2.params.containerModifierClass}virtual`);
        swiper2.params.watchSlidesProgress = true;
        swiper2.originalParams.watchSlidesProgress = true;
        if (!swiper2.params.initialSlide) {
          update2();
        }
      });
      on("setTranslate", () => {
        if (!swiper2.params.virtual.enabled)
          return;
        if (swiper2.params.cssMode && !swiper2._immediateVirtual) {
          clearTimeout(cssModeTimeout);
          cssModeTimeout = setTimeout(() => {
            update2();
          }, 100);
        } else {
          update2();
        }
      });
      on("init update resize", () => {
        if (!swiper2.params.virtual.enabled)
          return;
        if (swiper2.params.cssMode) {
          setCSSProperty(swiper2.wrapperEl, "--swiper-virtual-size", `${swiper2.virtualSize}px`);
        }
      });
      Object.assign(swiper2.virtual, {
        appendSlide: appendSlide2,
        prependSlide: prependSlide2,
        removeSlide: removeSlide2,
        removeAllSlides: removeAllSlides2,
        update: update2
      });
    }
    function Keyboard(_ref) {
      let {
        swiper: swiper2,
        extendParams,
        on,
        emit
      } = _ref;
      const document2 = getDocument();
      const window2 = getWindow();
      swiper2.keyboard = {
        enabled: false
      };
      extendParams({
        keyboard: {
          enabled: false,
          onlyInViewport: true,
          pageUpDown: true
        }
      });
      function handle(event2) {
        if (!swiper2.enabled)
          return;
        const {
          rtlTranslate: rtl
        } = swiper2;
        let e = event2;
        if (e.originalEvent)
          e = e.originalEvent;
        const kc = e.keyCode || e.charCode;
        const pageUpDown = swiper2.params.keyboard.pageUpDown;
        const isPageUp = pageUpDown && kc === 33;
        const isPageDown = pageUpDown && kc === 34;
        const isArrowLeft = kc === 37;
        const isArrowRight = kc === 39;
        const isArrowUp = kc === 38;
        const isArrowDown = kc === 40;
        if (!swiper2.allowSlideNext && (swiper2.isHorizontal() && isArrowRight || swiper2.isVertical() && isArrowDown || isPageDown)) {
          return false;
        }
        if (!swiper2.allowSlidePrev && (swiper2.isHorizontal() && isArrowLeft || swiper2.isVertical() && isArrowUp || isPageUp)) {
          return false;
        }
        if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
          return void 0;
        }
        if (document2.activeElement && document2.activeElement.nodeName && (document2.activeElement.nodeName.toLowerCase() === "input" || document2.activeElement.nodeName.toLowerCase() === "textarea")) {
          return void 0;
        }
        if (swiper2.params.keyboard.onlyInViewport && (isPageUp || isPageDown || isArrowLeft || isArrowRight || isArrowUp || isArrowDown)) {
          let inView = false;
          if (elementParents(swiper2.el, `.${swiper2.params.slideClass}, swiper-slide`).length > 0 && elementParents(swiper2.el, `.${swiper2.params.slideActiveClass}`).length === 0) {
            return void 0;
          }
          const el = swiper2.el;
          const swiperWidth = el.clientWidth;
          const swiperHeight = el.clientHeight;
          const windowWidth = window2.innerWidth;
          const windowHeight = window2.innerHeight;
          const swiperOffset = elementOffset(el);
          if (rtl)
            swiperOffset.left -= el.scrollLeft;
          const swiperCoord = [[swiperOffset.left, swiperOffset.top], [swiperOffset.left + swiperWidth, swiperOffset.top], [swiperOffset.left, swiperOffset.top + swiperHeight], [swiperOffset.left + swiperWidth, swiperOffset.top + swiperHeight]];
          for (let i = 0; i < swiperCoord.length; i += 1) {
            const point = swiperCoord[i];
            if (point[0] >= 0 && point[0] <= windowWidth && point[1] >= 0 && point[1] <= windowHeight) {
              if (point[0] === 0 && point[1] === 0)
                continue;
              inView = true;
            }
          }
          if (!inView)
            return void 0;
        }
        if (swiper2.isHorizontal()) {
          if (isPageUp || isPageDown || isArrowLeft || isArrowRight) {
            if (e.preventDefault)
              e.preventDefault();
            else
              e.returnValue = false;
          }
          if ((isPageDown || isArrowRight) && !rtl || (isPageUp || isArrowLeft) && rtl)
            swiper2.slideNext();
          if ((isPageUp || isArrowLeft) && !rtl || (isPageDown || isArrowRight) && rtl)
            swiper2.slidePrev();
        } else {
          if (isPageUp || isPageDown || isArrowUp || isArrowDown) {
            if (e.preventDefault)
              e.preventDefault();
            else
              e.returnValue = false;
          }
          if (isPageDown || isArrowDown)
            swiper2.slideNext();
          if (isPageUp || isArrowUp)
            swiper2.slidePrev();
        }
        emit("keyPress", kc);
        return void 0;
      }
      function enable() {
        if (swiper2.keyboard.enabled)
          return;
        document2.addEventListener("keydown", handle);
        swiper2.keyboard.enabled = true;
      }
      function disable() {
        if (!swiper2.keyboard.enabled)
          return;
        document2.removeEventListener("keydown", handle);
        swiper2.keyboard.enabled = false;
      }
      on("init", () => {
        if (swiper2.params.keyboard.enabled) {
          enable();
        }
      });
      on("destroy", () => {
        if (swiper2.keyboard.enabled) {
          disable();
        }
      });
      Object.assign(swiper2.keyboard, {
        enable,
        disable
      });
    }
    function Mousewheel(_ref) {
      let {
        swiper: swiper2,
        extendParams,
        on,
        emit
      } = _ref;
      const window2 = getWindow();
      extendParams({
        mousewheel: {
          enabled: false,
          releaseOnEdges: false,
          invert: false,
          forceToAxis: false,
          sensitivity: 1,
          eventsTarget: "container",
          thresholdDelta: null,
          thresholdTime: null
        }
      });
      swiper2.mousewheel = {
        enabled: false
      };
      let timeout;
      let lastScrollTime = now();
      let lastEventBeforeSnap;
      const recentWheelEvents = [];
      function normalize(e) {
        const PIXEL_STEP = 10;
        const LINE_HEIGHT = 40;
        const PAGE_HEIGHT = 800;
        let sX = 0;
        let sY = 0;
        let pX = 0;
        let pY = 0;
        if ("detail" in e) {
          sY = e.detail;
        }
        if ("wheelDelta" in e) {
          sY = -e.wheelDelta / 120;
        }
        if ("wheelDeltaY" in e) {
          sY = -e.wheelDeltaY / 120;
        }
        if ("wheelDeltaX" in e) {
          sX = -e.wheelDeltaX / 120;
        }
        if ("axis" in e && e.axis === e.HORIZONTAL_AXIS) {
          sX = sY;
          sY = 0;
        }
        pX = sX * PIXEL_STEP;
        pY = sY * PIXEL_STEP;
        if ("deltaY" in e) {
          pY = e.deltaY;
        }
        if ("deltaX" in e) {
          pX = e.deltaX;
        }
        if (e.shiftKey && !pX) {
          pX = pY;
          pY = 0;
        }
        if ((pX || pY) && e.deltaMode) {
          if (e.deltaMode === 1) {
            pX *= LINE_HEIGHT;
            pY *= LINE_HEIGHT;
          } else {
            pX *= PAGE_HEIGHT;
            pY *= PAGE_HEIGHT;
          }
        }
        if (pX && !sX) {
          sX = pX < 1 ? -1 : 1;
        }
        if (pY && !sY) {
          sY = pY < 1 ? -1 : 1;
        }
        return {
          spinX: sX,
          spinY: sY,
          pixelX: pX,
          pixelY: pY
        };
      }
      function handleMouseEnter() {
        if (!swiper2.enabled)
          return;
        swiper2.mouseEntered = true;
      }
      function handleMouseLeave() {
        if (!swiper2.enabled)
          return;
        swiper2.mouseEntered = false;
      }
      function animateSlider(newEvent) {
        if (swiper2.params.mousewheel.thresholdDelta && newEvent.delta < swiper2.params.mousewheel.thresholdDelta) {
          return false;
        }
        if (swiper2.params.mousewheel.thresholdTime && now() - lastScrollTime < swiper2.params.mousewheel.thresholdTime) {
          return false;
        }
        if (newEvent.delta >= 6 && now() - lastScrollTime < 60) {
          return true;
        }
        if (newEvent.direction < 0) {
          if ((!swiper2.isEnd || swiper2.params.loop) && !swiper2.animating) {
            swiper2.slideNext();
            emit("scroll", newEvent.raw);
          }
        } else if ((!swiper2.isBeginning || swiper2.params.loop) && !swiper2.animating) {
          swiper2.slidePrev();
          emit("scroll", newEvent.raw);
        }
        lastScrollTime = new window2.Date().getTime();
        return false;
      }
      function releaseScroll(newEvent) {
        const params = swiper2.params.mousewheel;
        if (newEvent.direction < 0) {
          if (swiper2.isEnd && !swiper2.params.loop && params.releaseOnEdges) {
            return true;
          }
        } else if (swiper2.isBeginning && !swiper2.params.loop && params.releaseOnEdges) {
          return true;
        }
        return false;
      }
      function handle(event2) {
        let e = event2;
        let disableParentSwiper = true;
        if (!swiper2.enabled)
          return;
        const params = swiper2.params.mousewheel;
        if (swiper2.params.cssMode) {
          e.preventDefault();
        }
        let targetEl = swiper2.el;
        if (swiper2.params.mousewheel.eventsTarget !== "container") {
          targetEl = document.querySelector(swiper2.params.mousewheel.eventsTarget);
        }
        const targetElContainsTarget = targetEl && targetEl.contains(e.target);
        if (!swiper2.mouseEntered && !targetElContainsTarget && !params.releaseOnEdges)
          return true;
        if (e.originalEvent)
          e = e.originalEvent;
        let delta = 0;
        const rtlFactor = swiper2.rtlTranslate ? -1 : 1;
        const data = normalize(e);
        if (params.forceToAxis) {
          if (swiper2.isHorizontal()) {
            if (Math.abs(data.pixelX) > Math.abs(data.pixelY))
              delta = -data.pixelX * rtlFactor;
            else
              return true;
          } else if (Math.abs(data.pixelY) > Math.abs(data.pixelX))
            delta = -data.pixelY;
          else
            return true;
        } else {
          delta = Math.abs(data.pixelX) > Math.abs(data.pixelY) ? -data.pixelX * rtlFactor : -data.pixelY;
        }
        if (delta === 0)
          return true;
        if (params.invert)
          delta = -delta;
        let positions = swiper2.getTranslate() + delta * params.sensitivity;
        if (positions >= swiper2.minTranslate())
          positions = swiper2.minTranslate();
        if (positions <= swiper2.maxTranslate())
          positions = swiper2.maxTranslate();
        disableParentSwiper = swiper2.params.loop ? true : !(positions === swiper2.minTranslate() || positions === swiper2.maxTranslate());
        if (disableParentSwiper && swiper2.params.nested)
          e.stopPropagation();
        if (!swiper2.params.freeMode || !swiper2.params.freeMode.enabled) {
          const newEvent = {
            time: now(),
            delta: Math.abs(delta),
            direction: Math.sign(delta),
            raw: event2
          };
          if (recentWheelEvents.length >= 2) {
            recentWheelEvents.shift();
          }
          const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : void 0;
          recentWheelEvents.push(newEvent);
          if (prevEvent) {
            if (newEvent.direction !== prevEvent.direction || newEvent.delta > prevEvent.delta || newEvent.time > prevEvent.time + 150) {
              animateSlider(newEvent);
            }
          } else {
            animateSlider(newEvent);
          }
          if (releaseScroll(newEvent)) {
            return true;
          }
        } else {
          const newEvent = {
            time: now(),
            delta: Math.abs(delta),
            direction: Math.sign(delta)
          };
          const ignoreWheelEvents = lastEventBeforeSnap && newEvent.time < lastEventBeforeSnap.time + 500 && newEvent.delta <= lastEventBeforeSnap.delta && newEvent.direction === lastEventBeforeSnap.direction;
          if (!ignoreWheelEvents) {
            lastEventBeforeSnap = void 0;
            let position = swiper2.getTranslate() + delta * params.sensitivity;
            const wasBeginning = swiper2.isBeginning;
            const wasEnd = swiper2.isEnd;
            if (position >= swiper2.minTranslate())
              position = swiper2.minTranslate();
            if (position <= swiper2.maxTranslate())
              position = swiper2.maxTranslate();
            swiper2.setTransition(0);
            swiper2.setTranslate(position);
            swiper2.updateProgress();
            swiper2.updateActiveIndex();
            swiper2.updateSlidesClasses();
            if (!wasBeginning && swiper2.isBeginning || !wasEnd && swiper2.isEnd) {
              swiper2.updateSlidesClasses();
            }
            if (swiper2.params.loop) {
              swiper2.loopFix({
                direction: newEvent.direction < 0 ? "next" : "prev",
                byMousewheel: true
              });
            }
            if (swiper2.params.freeMode.sticky) {
              clearTimeout(timeout);
              timeout = void 0;
              if (recentWheelEvents.length >= 15) {
                recentWheelEvents.shift();
              }
              const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : void 0;
              const firstEvent = recentWheelEvents[0];
              recentWheelEvents.push(newEvent);
              if (prevEvent && (newEvent.delta > prevEvent.delta || newEvent.direction !== prevEvent.direction)) {
                recentWheelEvents.splice(0);
              } else if (recentWheelEvents.length >= 15 && newEvent.time - firstEvent.time < 500 && firstEvent.delta - newEvent.delta >= 1 && newEvent.delta <= 6) {
                const snapToThreshold = delta > 0 ? 0.8 : 0.2;
                lastEventBeforeSnap = newEvent;
                recentWheelEvents.splice(0);
                timeout = nextTick(() => {
                  swiper2.slideToClosest(swiper2.params.speed, true, void 0, snapToThreshold);
                }, 0);
              }
              if (!timeout) {
                timeout = nextTick(() => {
                  const snapToThreshold = 0.5;
                  lastEventBeforeSnap = newEvent;
                  recentWheelEvents.splice(0);
                  swiper2.slideToClosest(swiper2.params.speed, true, void 0, snapToThreshold);
                }, 500);
              }
            }
            if (!ignoreWheelEvents)
              emit("scroll", e);
            if (swiper2.params.autoplay && swiper2.params.autoplayDisableOnInteraction)
              swiper2.autoplay.stop();
            if (position === swiper2.minTranslate() || position === swiper2.maxTranslate())
              return true;
          }
        }
        if (e.preventDefault)
          e.preventDefault();
        else
          e.returnValue = false;
        return false;
      }
      function events2(method) {
        let targetEl = swiper2.el;
        if (swiper2.params.mousewheel.eventsTarget !== "container") {
          targetEl = document.querySelector(swiper2.params.mousewheel.eventsTarget);
        }
        targetEl[method]("mouseenter", handleMouseEnter);
        targetEl[method]("mouseleave", handleMouseLeave);
        targetEl[method]("wheel", handle);
      }
      function enable() {
        if (swiper2.params.cssMode) {
          swiper2.wrapperEl.removeEventListener("wheel", handle);
          return true;
        }
        if (swiper2.mousewheel.enabled)
          return false;
        events2("addEventListener");
        swiper2.mousewheel.enabled = true;
        return true;
      }
      function disable() {
        if (swiper2.params.cssMode) {
          swiper2.wrapperEl.addEventListener(event, handle);
          return true;
        }
        if (!swiper2.mousewheel.enabled)
          return false;
        events2("removeEventListener");
        swiper2.mousewheel.enabled = false;
        return true;
      }
      on("init", () => {
        if (!swiper2.params.mousewheel.enabled && swiper2.params.cssMode) {
          disable();
        }
        if (swiper2.params.mousewheel.enabled)
          enable();
      });
      on("destroy", () => {
        if (swiper2.params.cssMode) {
          enable();
        }
        if (swiper2.mousewheel.enabled)
          disable();
      });
      Object.assign(swiper2.mousewheel, {
        enable,
        disable
      });
    }
    function createElementIfNotDefined(swiper2, originalParams, params, checkProps) {
      if (swiper2.params.createElements) {
        Object.keys(checkProps).forEach((key) => {
          if (!params[key] && params.auto === true) {
            let element = elementChildren(swiper2.el, `.${checkProps[key]}`)[0];
            if (!element) {
              element = createElement("div", checkProps[key]);
              element.className = checkProps[key];
              swiper2.el.append(element);
            }
            params[key] = element;
            originalParams[key] = element;
          }
        });
      }
      return params;
    }
    function Navigation(_ref) {
      let {
        swiper: swiper2,
        extendParams,
        on,
        emit
      } = _ref;
      extendParams({
        navigation: {
          nextEl: null,
          prevEl: null,
          hideOnClick: false,
          disabledClass: "swiper-button-disabled",
          hiddenClass: "swiper-button-hidden",
          lockClass: "swiper-button-lock",
          navigationDisabledClass: "swiper-navigation-disabled"
        }
      });
      swiper2.navigation = {
        nextEl: null,
        prevEl: null
      };
      const makeElementsArray = (el) => {
        if (!Array.isArray(el))
          el = [el].filter((e) => !!e);
        return el;
      };
      function getEl(el) {
        let res;
        if (el && typeof el === "string" && swiper2.isElement) {
          res = swiper2.el.shadowRoot.querySelector(el);
          if (res)
            return res;
        }
        if (el) {
          if (typeof el === "string")
            res = [...document.querySelectorAll(el)];
          if (swiper2.params.uniqueNavElements && typeof el === "string" && res.length > 1 && swiper2.el.querySelectorAll(el).length === 1) {
            res = swiper2.el.querySelector(el);
          }
        }
        if (el && !res)
          return el;
        return res;
      }
      function toggleEl(el, disabled) {
        const params = swiper2.params.navigation;
        el = makeElementsArray(el);
        el.forEach((subEl) => {
          if (subEl) {
            subEl.classList[disabled ? "add" : "remove"](...params.disabledClass.split(" "));
            if (subEl.tagName === "BUTTON")
              subEl.disabled = disabled;
            if (swiper2.params.watchOverflow && swiper2.enabled) {
              subEl.classList[swiper2.isLocked ? "add" : "remove"](params.lockClass);
            }
          }
        });
      }
      function update2() {
        const {
          nextEl,
          prevEl
        } = swiper2.navigation;
        if (swiper2.params.loop) {
          toggleEl(prevEl, false);
          toggleEl(nextEl, false);
          return;
        }
        toggleEl(prevEl, swiper2.isBeginning && !swiper2.params.rewind);
        toggleEl(nextEl, swiper2.isEnd && !swiper2.params.rewind);
      }
      function onPrevClick(e) {
        e.preventDefault();
        if (swiper2.isBeginning && !swiper2.params.loop && !swiper2.params.rewind)
          return;
        swiper2.slidePrev();
        emit("navigationPrev");
      }
      function onNextClick(e) {
        e.preventDefault();
        if (swiper2.isEnd && !swiper2.params.loop && !swiper2.params.rewind)
          return;
        swiper2.slideNext();
        emit("navigationNext");
      }
      function init() {
        const params = swiper2.params.navigation;
        swiper2.params.navigation = createElementIfNotDefined(swiper2, swiper2.originalParams.navigation, swiper2.params.navigation, {
          nextEl: "swiper-button-next",
          prevEl: "swiper-button-prev"
        });
        if (!(params.nextEl || params.prevEl))
          return;
        let nextEl = getEl(params.nextEl);
        let prevEl = getEl(params.prevEl);
        Object.assign(swiper2.navigation, {
          nextEl,
          prevEl
        });
        nextEl = makeElementsArray(nextEl);
        prevEl = makeElementsArray(prevEl);
        const initButton = (el, dir) => {
          if (el) {
            el.addEventListener("click", dir === "next" ? onNextClick : onPrevClick);
          }
          if (!swiper2.enabled && el) {
            el.classList.add(...params.lockClass.split(" "));
          }
        };
        nextEl.forEach((el) => initButton(el, "next"));
        prevEl.forEach((el) => initButton(el, "prev"));
      }
      function destroy() {
        let {
          nextEl,
          prevEl
        } = swiper2.navigation;
        nextEl = makeElementsArray(nextEl);
        prevEl = makeElementsArray(prevEl);
        const destroyButton = (el, dir) => {
          el.removeEventListener("click", dir === "next" ? onNextClick : onPrevClick);
          el.classList.remove(...swiper2.params.navigation.disabledClass.split(" "));
        };
        nextEl.forEach((el) => destroyButton(el, "next"));
        prevEl.forEach((el) => destroyButton(el, "prev"));
      }
      on("init", () => {
        if (swiper2.params.navigation.enabled === false) {
          disable();
        } else {
          init();
          update2();
        }
      });
      on("toEdge fromEdge lock unlock", () => {
        update2();
      });
      on("destroy", () => {
        destroy();
      });
      on("enable disable", () => {
        let {
          nextEl,
          prevEl
        } = swiper2.navigation;
        nextEl = makeElementsArray(nextEl);
        prevEl = makeElementsArray(prevEl);
        [...nextEl, ...prevEl].filter((el) => !!el).forEach((el) => el.classList[swiper2.enabled ? "remove" : "add"](swiper2.params.navigation.lockClass));
      });
      on("click", (_s, e) => {
        let {
          nextEl,
          prevEl
        } = swiper2.navigation;
        nextEl = makeElementsArray(nextEl);
        prevEl = makeElementsArray(prevEl);
        const targetEl = e.target;
        if (swiper2.params.navigation.hideOnClick && !prevEl.includes(targetEl) && !nextEl.includes(targetEl)) {
          if (swiper2.pagination && swiper2.params.pagination && swiper2.params.pagination.clickable && (swiper2.pagination.el === targetEl || swiper2.pagination.el.contains(targetEl)))
            return;
          let isHidden;
          if (nextEl.length) {
            isHidden = nextEl[0].classList.contains(swiper2.params.navigation.hiddenClass);
          } else if (prevEl.length) {
            isHidden = prevEl[0].classList.contains(swiper2.params.navigation.hiddenClass);
          }
          if (isHidden === true) {
            emit("navigationShow");
          } else {
            emit("navigationHide");
          }
          [...nextEl, ...prevEl].filter((el) => !!el).forEach((el) => el.classList.toggle(swiper2.params.navigation.hiddenClass));
        }
      });
      const enable = () => {
        swiper2.el.classList.remove(...swiper2.params.navigation.navigationDisabledClass.split(" "));
        init();
        update2();
      };
      const disable = () => {
        swiper2.el.classList.add(...swiper2.params.navigation.navigationDisabledClass.split(" "));
        destroy();
      };
      Object.assign(swiper2.navigation, {
        enable,
        disable,
        update: update2,
        init,
        destroy
      });
    }
    function classesToSelector(classes2) {
      if (classes2 === void 0) {
        classes2 = "";
      }
      return `.${classes2.trim().replace(/([\.:!+\/])/g, "\\$1").replace(/ /g, ".")}`;
    }
    function Pagination(_ref) {
      let {
        swiper: swiper2,
        extendParams,
        on,
        emit
      } = _ref;
      const pfx = "swiper-pagination";
      extendParams({
        pagination: {
          el: null,
          bulletElement: "span",
          clickable: false,
          hideOnClick: false,
          renderBullet: null,
          renderProgressbar: null,
          renderFraction: null,
          renderCustom: null,
          progressbarOpposite: false,
          type: "bullets",
          // 'bullets' or 'progressbar' or 'fraction' or 'custom'
          dynamicBullets: false,
          dynamicMainBullets: 1,
          formatFractionCurrent: (number) => number,
          formatFractionTotal: (number) => number,
          bulletClass: `${pfx}-bullet`,
          bulletActiveClass: `${pfx}-bullet-active`,
          modifierClass: `${pfx}-`,
          currentClass: `${pfx}-current`,
          totalClass: `${pfx}-total`,
          hiddenClass: `${pfx}-hidden`,
          progressbarFillClass: `${pfx}-progressbar-fill`,
          progressbarOppositeClass: `${pfx}-progressbar-opposite`,
          clickableClass: `${pfx}-clickable`,
          lockClass: `${pfx}-lock`,
          horizontalClass: `${pfx}-horizontal`,
          verticalClass: `${pfx}-vertical`,
          paginationDisabledClass: `${pfx}-disabled`
        }
      });
      swiper2.pagination = {
        el: null,
        bullets: []
      };
      let bulletSize;
      let dynamicBulletIndex = 0;
      const makeElementsArray = (el) => {
        if (!Array.isArray(el))
          el = [el].filter((e) => !!e);
        return el;
      };
      function isPaginationDisabled() {
        return !swiper2.params.pagination.el || !swiper2.pagination.el || Array.isArray(swiper2.pagination.el) && swiper2.pagination.el.length === 0;
      }
      function setSideBullets(bulletEl, position) {
        const {
          bulletActiveClass
        } = swiper2.params.pagination;
        if (!bulletEl)
          return;
        bulletEl = bulletEl[`${position === "prev" ? "previous" : "next"}ElementSibling`];
        if (bulletEl) {
          bulletEl.classList.add(`${bulletActiveClass}-${position}`);
          bulletEl = bulletEl[`${position === "prev" ? "previous" : "next"}ElementSibling`];
          if (bulletEl) {
            bulletEl.classList.add(`${bulletActiveClass}-${position}-${position}`);
          }
        }
      }
      function onBulletClick(e) {
        const bulletEl = e.target.closest(classesToSelector(swiper2.params.pagination.bulletClass));
        if (!bulletEl) {
          return;
        }
        e.preventDefault();
        const index = elementIndex(bulletEl) * swiper2.params.slidesPerGroup;
        if (swiper2.params.loop) {
          if (swiper2.realIndex === index)
            return;
          const newSlideIndex = swiper2.getSlideIndexByData(index);
          const currentSlideIndex = swiper2.getSlideIndexByData(swiper2.realIndex);
          if (newSlideIndex > swiper2.slides.length - swiper2.loopedSlides) {
            swiper2.loopFix({
              direction: newSlideIndex > currentSlideIndex ? "next" : "prev",
              activeSlideIndex: newSlideIndex,
              slideTo: false
            });
          }
          swiper2.slideToLoop(index);
        } else {
          swiper2.slideTo(index);
        }
      }
      function update2() {
        const rtl = swiper2.rtl;
        const params = swiper2.params.pagination;
        if (isPaginationDisabled())
          return;
        let el = swiper2.pagination.el;
        el = makeElementsArray(el);
        let current;
        let previousIndex;
        const slidesLength = swiper2.virtual && swiper2.params.virtual.enabled ? swiper2.virtual.slides.length : swiper2.slides.length;
        const total = swiper2.params.loop ? Math.ceil(slidesLength / swiper2.params.slidesPerGroup) : swiper2.snapGrid.length;
        if (swiper2.params.loop) {
          previousIndex = swiper2.previousRealIndex || 0;
          current = swiper2.params.slidesPerGroup > 1 ? Math.floor(swiper2.realIndex / swiper2.params.slidesPerGroup) : swiper2.realIndex;
        } else if (typeof swiper2.snapIndex !== "undefined") {
          current = swiper2.snapIndex;
          previousIndex = swiper2.previousSnapIndex;
        } else {
          previousIndex = swiper2.previousIndex || 0;
          current = swiper2.activeIndex || 0;
        }
        if (params.type === "bullets" && swiper2.pagination.bullets && swiper2.pagination.bullets.length > 0) {
          const bullets = swiper2.pagination.bullets;
          let firstIndex;
          let lastIndex;
          let midIndex;
          if (params.dynamicBullets) {
            bulletSize = elementOuterSize(bullets[0], swiper2.isHorizontal() ? "width" : "height", true);
            el.forEach((subEl) => {
              subEl.style[swiper2.isHorizontal() ? "width" : "height"] = `${bulletSize * (params.dynamicMainBullets + 4)}px`;
            });
            if (params.dynamicMainBullets > 1 && previousIndex !== void 0) {
              dynamicBulletIndex += current - (previousIndex || 0);
              if (dynamicBulletIndex > params.dynamicMainBullets - 1) {
                dynamicBulletIndex = params.dynamicMainBullets - 1;
              } else if (dynamicBulletIndex < 0) {
                dynamicBulletIndex = 0;
              }
            }
            firstIndex = Math.max(current - dynamicBulletIndex, 0);
            lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
            midIndex = (lastIndex + firstIndex) / 2;
          }
          bullets.forEach((bulletEl) => {
            const classesToRemove = [...["", "-next", "-next-next", "-prev", "-prev-prev", "-main"].map((suffix) => `${params.bulletActiveClass}${suffix}`)].map((s) => typeof s === "string" && s.includes(" ") ? s.split(" ") : s).flat();
            bulletEl.classList.remove(...classesToRemove);
          });
          if (el.length > 1) {
            bullets.forEach((bullet) => {
              const bulletIndex = elementIndex(bullet);
              if (bulletIndex === current) {
                bullet.classList.add(...params.bulletActiveClass.split(" "));
              }
              if (params.dynamicBullets) {
                if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) {
                  bullet.classList.add(...`${params.bulletActiveClass}-main`.split(" "));
                }
                if (bulletIndex === firstIndex) {
                  setSideBullets(bullet, "prev");
                }
                if (bulletIndex === lastIndex) {
                  setSideBullets(bullet, "next");
                }
              }
            });
          } else {
            const bullet = bullets[current];
            if (bullet) {
              bullet.classList.add(...params.bulletActiveClass.split(" "));
            }
            if (params.dynamicBullets) {
              const firstDisplayedBullet = bullets[firstIndex];
              const lastDisplayedBullet = bullets[lastIndex];
              for (let i = firstIndex; i <= lastIndex; i += 1) {
                if (bullets[i]) {
                  bullets[i].classList.add(...`${params.bulletActiveClass}-main`.split(" "));
                }
              }
              setSideBullets(firstDisplayedBullet, "prev");
              setSideBullets(lastDisplayedBullet, "next");
            }
          }
          if (params.dynamicBullets) {
            const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
            const bulletsOffset = (bulletSize * dynamicBulletsLength - bulletSize) / 2 - midIndex * bulletSize;
            const offsetProp = rtl ? "right" : "left";
            bullets.forEach((bullet) => {
              bullet.style[swiper2.isHorizontal() ? offsetProp : "top"] = `${bulletsOffset}px`;
            });
          }
        }
        el.forEach((subEl, subElIndex) => {
          if (params.type === "fraction") {
            subEl.querySelectorAll(classesToSelector(params.currentClass)).forEach((fractionEl) => {
              fractionEl.textContent = params.formatFractionCurrent(current + 1);
            });
            subEl.querySelectorAll(classesToSelector(params.totalClass)).forEach((totalEl) => {
              totalEl.textContent = params.formatFractionTotal(total);
            });
          }
          if (params.type === "progressbar") {
            let progressbarDirection;
            if (params.progressbarOpposite) {
              progressbarDirection = swiper2.isHorizontal() ? "vertical" : "horizontal";
            } else {
              progressbarDirection = swiper2.isHorizontal() ? "horizontal" : "vertical";
            }
            const scale = (current + 1) / total;
            let scaleX = 1;
            let scaleY = 1;
            if (progressbarDirection === "horizontal") {
              scaleX = scale;
            } else {
              scaleY = scale;
            }
            subEl.querySelectorAll(classesToSelector(params.progressbarFillClass)).forEach((progressEl) => {
              progressEl.style.transform = `translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`;
              progressEl.style.transitionDuration = `${swiper2.params.speed}ms`;
            });
          }
          if (params.type === "custom" && params.renderCustom) {
            subEl.innerHTML = params.renderCustom(swiper2, current + 1, total);
            if (subElIndex === 0)
              emit("paginationRender", subEl);
          } else {
            if (subElIndex === 0)
              emit("paginationRender", subEl);
            emit("paginationUpdate", subEl);
          }
          if (swiper2.params.watchOverflow && swiper2.enabled) {
            subEl.classList[swiper2.isLocked ? "add" : "remove"](params.lockClass);
          }
        });
      }
      function render() {
        const params = swiper2.params.pagination;
        if (isPaginationDisabled())
          return;
        const slidesLength = swiper2.virtual && swiper2.params.virtual.enabled ? swiper2.virtual.slides.length : swiper2.slides.length;
        let el = swiper2.pagination.el;
        el = makeElementsArray(el);
        let paginationHTML = "";
        if (params.type === "bullets") {
          let numberOfBullets = swiper2.params.loop ? Math.ceil(slidesLength / swiper2.params.slidesPerGroup) : swiper2.snapGrid.length;
          if (swiper2.params.freeMode && swiper2.params.freeMode.enabled && numberOfBullets > slidesLength) {
            numberOfBullets = slidesLength;
          }
          for (let i = 0; i < numberOfBullets; i += 1) {
            if (params.renderBullet) {
              paginationHTML += params.renderBullet.call(swiper2, i, params.bulletClass);
            } else {
              paginationHTML += `<${params.bulletElement} class="${params.bulletClass}"></${params.bulletElement}>`;
            }
          }
        }
        if (params.type === "fraction") {
          if (params.renderFraction) {
            paginationHTML = params.renderFraction.call(swiper2, params.currentClass, params.totalClass);
          } else {
            paginationHTML = `<span class="${params.currentClass}"></span> / <span class="${params.totalClass}"></span>`;
          }
        }
        if (params.type === "progressbar") {
          if (params.renderProgressbar) {
            paginationHTML = params.renderProgressbar.call(swiper2, params.progressbarFillClass);
          } else {
            paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
          }
        }
        swiper2.pagination.bullets = [];
        el.forEach((subEl) => {
          if (params.type !== "custom") {
            subEl.innerHTML = paginationHTML || "";
          }
          if (params.type === "bullets") {
            swiper2.pagination.bullets.push(...subEl.querySelectorAll(classesToSelector(params.bulletClass)));
          }
        });
        if (params.type !== "custom") {
          emit("paginationRender", el[0]);
        }
      }
      function init() {
        swiper2.params.pagination = createElementIfNotDefined(swiper2, swiper2.originalParams.pagination, swiper2.params.pagination, {
          el: "swiper-pagination"
        });
        const params = swiper2.params.pagination;
        if (!params.el)
          return;
        let el;
        if (typeof params.el === "string" && swiper2.isElement) {
          el = swiper2.el.shadowRoot.querySelector(params.el);
        }
        if (!el && typeof params.el === "string") {
          el = [...document.querySelectorAll(params.el)];
        }
        if (!el) {
          el = params.el;
        }
        if (!el || el.length === 0)
          return;
        if (swiper2.params.uniqueNavElements && typeof params.el === "string" && Array.isArray(el) && el.length > 1) {
          el = [...swiper2.el.querySelectorAll(params.el)];
          if (el.length > 1) {
            el = el.filter((subEl) => {
              if (elementParents(subEl, ".swiper")[0] !== swiper2.el)
                return false;
              return true;
            })[0];
          }
        }
        if (Array.isArray(el) && el.length === 1)
          el = el[0];
        Object.assign(swiper2.pagination, {
          el
        });
        el = makeElementsArray(el);
        el.forEach((subEl) => {
          if (params.type === "bullets" && params.clickable) {
            subEl.classList.add(params.clickableClass);
          }
          subEl.classList.add(params.modifierClass + params.type);
          subEl.classList.add(swiper2.isHorizontal() ? params.horizontalClass : params.verticalClass);
          if (params.type === "bullets" && params.dynamicBullets) {
            subEl.classList.add(`${params.modifierClass}${params.type}-dynamic`);
            dynamicBulletIndex = 0;
            if (params.dynamicMainBullets < 1) {
              params.dynamicMainBullets = 1;
            }
          }
          if (params.type === "progressbar" && params.progressbarOpposite) {
            subEl.classList.add(params.progressbarOppositeClass);
          }
          if (params.clickable) {
            subEl.addEventListener("click", onBulletClick);
          }
          if (!swiper2.enabled) {
            subEl.classList.add(params.lockClass);
          }
        });
      }
      function destroy() {
        const params = swiper2.params.pagination;
        if (isPaginationDisabled())
          return;
        let el = swiper2.pagination.el;
        if (el) {
          el = makeElementsArray(el);
          el.forEach((subEl) => {
            subEl.classList.remove(params.hiddenClass);
            subEl.classList.remove(params.modifierClass + params.type);
            subEl.classList.remove(swiper2.isHorizontal() ? params.horizontalClass : params.verticalClass);
            if (params.clickable) {
              subEl.removeEventListener("click", onBulletClick);
            }
          });
        }
        if (swiper2.pagination.bullets)
          swiper2.pagination.bullets.forEach((subEl) => subEl.classList.remove(...params.bulletActiveClass.split(" ")));
      }
      on("changeDirection", () => {
        if (!swiper2.pagination || !swiper2.pagination.el)
          return;
        const params = swiper2.params.pagination;
        let {
          el
        } = swiper2.pagination;
        el = makeElementsArray(el);
        el.forEach((subEl) => {
          subEl.classList.remove(params.horizontalClass, params.verticalClass);
          subEl.classList.add(swiper2.isHorizontal() ? params.horizontalClass : params.verticalClass);
        });
      });
      on("init", () => {
        if (swiper2.params.pagination.enabled === false) {
          disable();
        } else {
          init();
          render();
          update2();
        }
      });
      on("activeIndexChange", () => {
        if (typeof swiper2.snapIndex === "undefined") {
          update2();
        }
      });
      on("snapIndexChange", () => {
        update2();
      });
      on("snapGridLengthChange", () => {
        render();
        update2();
      });
      on("destroy", () => {
        destroy();
      });
      on("enable disable", () => {
        let {
          el
        } = swiper2.pagination;
        if (el) {
          el = makeElementsArray(el);
          el.forEach((subEl) => subEl.classList[swiper2.enabled ? "remove" : "add"](swiper2.params.pagination.lockClass));
        }
      });
      on("lock unlock", () => {
        update2();
      });
      on("click", (_s, e) => {
        const targetEl = e.target;
        let {
          el
        } = swiper2.pagination;
        if (!Array.isArray(el))
          el = [el].filter((element) => !!element);
        if (swiper2.params.pagination.el && swiper2.params.pagination.hideOnClick && el && el.length > 0 && !targetEl.classList.contains(swiper2.params.pagination.bulletClass)) {
          if (swiper2.navigation && (swiper2.navigation.nextEl && targetEl === swiper2.navigation.nextEl || swiper2.navigation.prevEl && targetEl === swiper2.navigation.prevEl))
            return;
          const isHidden = el[0].classList.contains(swiper2.params.pagination.hiddenClass);
          if (isHidden === true) {
            emit("paginationShow");
          } else {
            emit("paginationHide");
          }
          el.forEach((subEl) => subEl.classList.toggle(swiper2.params.pagination.hiddenClass));
        }
      });
      const enable = () => {
        swiper2.el.classList.remove(swiper2.params.pagination.paginationDisabledClass);
        let {
          el
        } = swiper2.pagination;
        if (el) {
          el = makeElementsArray(el);
          el.forEach((subEl) => subEl.classList.remove(swiper2.params.pagination.paginationDisabledClass));
        }
        init();
        render();
        update2();
      };
      const disable = () => {
        swiper2.el.classList.add(swiper2.params.pagination.paginationDisabledClass);
        let {
          el
        } = swiper2.pagination;
        if (el) {
          el = makeElementsArray(el);
          el.forEach((subEl) => subEl.classList.add(swiper2.params.pagination.paginationDisabledClass));
        }
        destroy();
      };
      Object.assign(swiper2.pagination, {
        enable,
        disable,
        render,
        update: update2,
        init,
        destroy
      });
    }
    function Scrollbar(_ref) {
      let {
        swiper: swiper2,
        extendParams,
        on,
        emit
      } = _ref;
      const document2 = getDocument();
      let isTouched = false;
      let timeout = null;
      let dragTimeout = null;
      let dragStartPos;
      let dragSize;
      let trackSize;
      let divider;
      extendParams({
        scrollbar: {
          el: null,
          dragSize: "auto",
          hide: false,
          draggable: false,
          snapOnRelease: true,
          lockClass: "swiper-scrollbar-lock",
          dragClass: "swiper-scrollbar-drag",
          scrollbarDisabledClass: "swiper-scrollbar-disabled",
          horizontalClass: `swiper-scrollbar-horizontal`,
          verticalClass: `swiper-scrollbar-vertical`
        }
      });
      swiper2.scrollbar = {
        el: null,
        dragEl: null
      };
      function setTranslate2() {
        if (!swiper2.params.scrollbar.el || !swiper2.scrollbar.el)
          return;
        const {
          scrollbar,
          rtlTranslate: rtl
        } = swiper2;
        const {
          dragEl,
          el
        } = scrollbar;
        const params = swiper2.params.scrollbar;
        const progress = swiper2.params.loop ? swiper2.progressLoop : swiper2.progress;
        let newSize = dragSize;
        let newPos = (trackSize - dragSize) * progress;
        if (rtl) {
          newPos = -newPos;
          if (newPos > 0) {
            newSize = dragSize - newPos;
            newPos = 0;
          } else if (-newPos + dragSize > trackSize) {
            newSize = trackSize + newPos;
          }
        } else if (newPos < 0) {
          newSize = dragSize + newPos;
          newPos = 0;
        } else if (newPos + dragSize > trackSize) {
          newSize = trackSize - newPos;
        }
        if (swiper2.isHorizontal()) {
          dragEl.style.transform = `translate3d(${newPos}px, 0, 0)`;
          dragEl.style.width = `${newSize}px`;
        } else {
          dragEl.style.transform = `translate3d(0px, ${newPos}px, 0)`;
          dragEl.style.height = `${newSize}px`;
        }
        if (params.hide) {
          clearTimeout(timeout);
          el.style.opacity = 1;
          timeout = setTimeout(() => {
            el.style.opacity = 0;
            el.style.transitionDuration = "400ms";
          }, 1e3);
        }
      }
      function setTransition2(duration) {
        if (!swiper2.params.scrollbar.el || !swiper2.scrollbar.el)
          return;
        swiper2.scrollbar.dragEl.style.transitionDuration = `${duration}ms`;
      }
      function updateSize2() {
        if (!swiper2.params.scrollbar.el || !swiper2.scrollbar.el)
          return;
        const {
          scrollbar
        } = swiper2;
        const {
          dragEl,
          el
        } = scrollbar;
        dragEl.style.width = "";
        dragEl.style.height = "";
        trackSize = swiper2.isHorizontal() ? el.offsetWidth : el.offsetHeight;
        divider = swiper2.size / (swiper2.virtualSize + swiper2.params.slidesOffsetBefore - (swiper2.params.centeredSlides ? swiper2.snapGrid[0] : 0));
        if (swiper2.params.scrollbar.dragSize === "auto") {
          dragSize = trackSize * divider;
        } else {
          dragSize = parseInt(swiper2.params.scrollbar.dragSize, 10);
        }
        if (swiper2.isHorizontal()) {
          dragEl.style.width = `${dragSize}px`;
        } else {
          dragEl.style.height = `${dragSize}px`;
        }
        if (divider >= 1) {
          el.style.display = "none";
        } else {
          el.style.display = "";
        }
        if (swiper2.params.scrollbar.hide) {
          el.style.opacity = 0;
        }
        if (swiper2.params.watchOverflow && swiper2.enabled) {
          scrollbar.el.classList[swiper2.isLocked ? "add" : "remove"](swiper2.params.scrollbar.lockClass);
        }
      }
      function getPointerPosition(e) {
        return swiper2.isHorizontal() ? e.clientX : e.clientY;
      }
      function setDragPosition(e) {
        const {
          scrollbar,
          rtlTranslate: rtl
        } = swiper2;
        const {
          el
        } = scrollbar;
        let positionRatio;
        positionRatio = (getPointerPosition(e) - elementOffset(el)[swiper2.isHorizontal() ? "left" : "top"] - (dragStartPos !== null ? dragStartPos : dragSize / 2)) / (trackSize - dragSize);
        positionRatio = Math.max(Math.min(positionRatio, 1), 0);
        if (rtl) {
          positionRatio = 1 - positionRatio;
        }
        const position = swiper2.minTranslate() + (swiper2.maxTranslate() - swiper2.minTranslate()) * positionRatio;
        swiper2.updateProgress(position);
        swiper2.setTranslate(position);
        swiper2.updateActiveIndex();
        swiper2.updateSlidesClasses();
      }
      function onDragStart(e) {
        const params = swiper2.params.scrollbar;
        const {
          scrollbar,
          wrapperEl
        } = swiper2;
        const {
          el,
          dragEl
        } = scrollbar;
        isTouched = true;
        dragStartPos = e.target === dragEl ? getPointerPosition(e) - e.target.getBoundingClientRect()[swiper2.isHorizontal() ? "left" : "top"] : null;
        e.preventDefault();
        e.stopPropagation();
        wrapperEl.style.transitionDuration = "100ms";
        dragEl.style.transitionDuration = "100ms";
        setDragPosition(e);
        clearTimeout(dragTimeout);
        el.style.transitionDuration = "0ms";
        if (params.hide) {
          el.style.opacity = 1;
        }
        if (swiper2.params.cssMode) {
          swiper2.wrapperEl.style["scroll-snap-type"] = "none";
        }
        emit("scrollbarDragStart", e);
      }
      function onDragMove(e) {
        const {
          scrollbar,
          wrapperEl
        } = swiper2;
        const {
          el,
          dragEl
        } = scrollbar;
        if (!isTouched)
          return;
        if (e.preventDefault)
          e.preventDefault();
        else
          e.returnValue = false;
        setDragPosition(e);
        wrapperEl.style.transitionDuration = "0ms";
        el.style.transitionDuration = "0ms";
        dragEl.style.transitionDuration = "0ms";
        emit("scrollbarDragMove", e);
      }
      function onDragEnd(e) {
        const params = swiper2.params.scrollbar;
        const {
          scrollbar,
          wrapperEl
        } = swiper2;
        const {
          el
        } = scrollbar;
        if (!isTouched)
          return;
        isTouched = false;
        if (swiper2.params.cssMode) {
          swiper2.wrapperEl.style["scroll-snap-type"] = "";
          wrapperEl.style.transitionDuration = "";
        }
        if (params.hide) {
          clearTimeout(dragTimeout);
          dragTimeout = nextTick(() => {
            el.style.opacity = 0;
            el.style.transitionDuration = "400ms";
          }, 1e3);
        }
        emit("scrollbarDragEnd", e);
        if (params.snapOnRelease) {
          swiper2.slideToClosest();
        }
      }
      function events2(method) {
        const {
          scrollbar,
          params
        } = swiper2;
        const el = scrollbar.el;
        if (!el)
          return;
        const target = el;
        const activeListener = params.passiveListeners ? {
          passive: false,
          capture: false
        } : false;
        const passiveListener = params.passiveListeners ? {
          passive: true,
          capture: false
        } : false;
        if (!target)
          return;
        const eventMethod = method === "on" ? "addEventListener" : "removeEventListener";
        target[eventMethod]("pointerdown", onDragStart, activeListener);
        document2[eventMethod]("pointermove", onDragMove, activeListener);
        document2[eventMethod]("pointerup", onDragEnd, passiveListener);
      }
      function enableDraggable() {
        if (!swiper2.params.scrollbar.el || !swiper2.scrollbar.el)
          return;
        events2("on");
      }
      function disableDraggable() {
        if (!swiper2.params.scrollbar.el || !swiper2.scrollbar.el)
          return;
        events2("off");
      }
      function init() {
        const {
          scrollbar,
          el: swiperEl
        } = swiper2;
        swiper2.params.scrollbar = createElementIfNotDefined(swiper2, swiper2.originalParams.scrollbar, swiper2.params.scrollbar, {
          el: "swiper-scrollbar"
        });
        const params = swiper2.params.scrollbar;
        if (!params.el)
          return;
        let el;
        if (typeof params.el === "string" && swiper2.isElement) {
          el = swiper2.el.shadowRoot.querySelector(params.el);
        }
        if (!el && typeof params.el === "string") {
          el = document2.querySelectorAll(params.el);
        } else if (!el) {
          el = params.el;
        }
        if (swiper2.params.uniqueNavElements && typeof params.el === "string" && el.length > 1 && swiperEl.querySelectorAll(params.el).length === 1) {
          el = swiperEl.querySelector(params.el);
        }
        if (el.length > 0)
          el = el[0];
        el.classList.add(swiper2.isHorizontal() ? params.horizontalClass : params.verticalClass);
        let dragEl;
        if (el) {
          dragEl = el.querySelector(`.${swiper2.params.scrollbar.dragClass}`);
          if (!dragEl) {
            dragEl = createElement("div", swiper2.params.scrollbar.dragClass);
            el.append(dragEl);
          }
        }
        Object.assign(scrollbar, {
          el,
          dragEl
        });
        if (params.draggable) {
          enableDraggable();
        }
        if (el) {
          el.classList[swiper2.enabled ? "remove" : "add"](swiper2.params.scrollbar.lockClass);
        }
      }
      function destroy() {
        const params = swiper2.params.scrollbar;
        const el = swiper2.scrollbar.el;
        if (el) {
          el.classList.remove(swiper2.isHorizontal() ? params.horizontalClass : params.verticalClass);
        }
        disableDraggable();
      }
      on("init", () => {
        if (swiper2.params.scrollbar.enabled === false) {
          disable();
        } else {
          init();
          updateSize2();
          setTranslate2();
        }
      });
      on("update resize observerUpdate lock unlock", () => {
        updateSize2();
      });
      on("setTranslate", () => {
        setTranslate2();
      });
      on("setTransition", (_s, duration) => {
        setTransition2(duration);
      });
      on("enable disable", () => {
        const {
          el
        } = swiper2.scrollbar;
        if (el) {
          el.classList[swiper2.enabled ? "remove" : "add"](swiper2.params.scrollbar.lockClass);
        }
      });
      on("destroy", () => {
        destroy();
      });
      const enable = () => {
        swiper2.el.classList.remove(swiper2.params.scrollbar.scrollbarDisabledClass);
        if (swiper2.scrollbar.el) {
          swiper2.scrollbar.el.classList.remove(swiper2.params.scrollbar.scrollbarDisabledClass);
        }
        init();
        updateSize2();
        setTranslate2();
      };
      const disable = () => {
        swiper2.el.classList.add(swiper2.params.scrollbar.scrollbarDisabledClass);
        if (swiper2.scrollbar.el) {
          swiper2.scrollbar.el.classList.add(swiper2.params.scrollbar.scrollbarDisabledClass);
        }
        destroy();
      };
      Object.assign(swiper2.scrollbar, {
        enable,
        disable,
        updateSize: updateSize2,
        setTranslate: setTranslate2,
        init,
        destroy
      });
    }
    function Parallax(_ref) {
      let {
        swiper: swiper2,
        extendParams,
        on
      } = _ref;
      extendParams({
        parallax: {
          enabled: false
        }
      });
      const setTransform = (el, progress) => {
        const {
          rtl
        } = swiper2;
        const rtlFactor = rtl ? -1 : 1;
        const p = el.getAttribute("data-swiper-parallax") || "0";
        let x = el.getAttribute("data-swiper-parallax-x");
        let y = el.getAttribute("data-swiper-parallax-y");
        const scale = el.getAttribute("data-swiper-parallax-scale");
        const opacity = el.getAttribute("data-swiper-parallax-opacity");
        const rotate = el.getAttribute("data-swiper-parallax-rotate");
        if (x || y) {
          x = x || "0";
          y = y || "0";
        } else if (swiper2.isHorizontal()) {
          x = p;
          y = "0";
        } else {
          y = p;
          x = "0";
        }
        if (x.indexOf("%") >= 0) {
          x = `${parseInt(x, 10) * progress * rtlFactor}%`;
        } else {
          x = `${x * progress * rtlFactor}px`;
        }
        if (y.indexOf("%") >= 0) {
          y = `${parseInt(y, 10) * progress}%`;
        } else {
          y = `${y * progress}px`;
        }
        if (typeof opacity !== "undefined" && opacity !== null) {
          const currentOpacity = opacity - (opacity - 1) * (1 - Math.abs(progress));
          el.style.opacity = currentOpacity;
        }
        let transform = `translate3d(${x}, ${y}, 0px)`;
        if (typeof scale !== "undefined" && scale !== null) {
          const currentScale = scale - (scale - 1) * (1 - Math.abs(progress));
          transform += ` scale(${currentScale})`;
        }
        if (rotate && typeof rotate !== "undefined" && rotate !== null) {
          const currentRotate = rotate * progress * -1;
          transform += ` rotate(${currentRotate}deg)`;
        }
        el.style.transform = transform;
      };
      const setTranslate2 = () => {
        const {
          el,
          slides,
          progress,
          snapGrid
        } = swiper2;
        elementChildren(el, "[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").forEach((subEl) => {
          setTransform(subEl, progress);
        });
        slides.forEach((slideEl, slideIndex) => {
          let slideProgress = slideEl.progress;
          if (swiper2.params.slidesPerGroup > 1 && swiper2.params.slidesPerView !== "auto") {
            slideProgress += Math.ceil(slideIndex / 2) - progress * (snapGrid.length - 1);
          }
          slideProgress = Math.min(Math.max(slideProgress, -1), 1);
          slideEl.querySelectorAll("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale], [data-swiper-parallax-rotate]").forEach((subEl) => {
            setTransform(subEl, slideProgress);
          });
        });
      };
      const setTransition2 = function(duration) {
        if (duration === void 0) {
          duration = swiper2.params.speed;
        }
        const {
          el
        } = swiper2;
        el.querySelectorAll("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").forEach((parallaxEl) => {
          let parallaxDuration = parseInt(parallaxEl.getAttribute("data-swiper-parallax-duration"), 10) || duration;
          if (duration === 0)
            parallaxDuration = 0;
          parallaxEl.style.transitionDuration = `${parallaxDuration}ms`;
        });
      };
      on("beforeInit", () => {
        if (!swiper2.params.parallax.enabled)
          return;
        swiper2.params.watchSlidesProgress = true;
        swiper2.originalParams.watchSlidesProgress = true;
      });
      on("init", () => {
        if (!swiper2.params.parallax.enabled)
          return;
        setTranslate2();
      });
      on("setTranslate", () => {
        if (!swiper2.params.parallax.enabled)
          return;
        setTranslate2();
      });
      on("setTransition", (_swiper, duration) => {
        if (!swiper2.params.parallax.enabled)
          return;
        setTransition2(duration);
      });
    }
    function Zoom(_ref) {
      let {
        swiper: swiper2,
        extendParams,
        on,
        emit
      } = _ref;
      const window2 = getWindow();
      extendParams({
        zoom: {
          enabled: false,
          maxRatio: 3,
          minRatio: 1,
          toggle: true,
          containerClass: "swiper-zoom-container",
          zoomedSlideClass: "swiper-slide-zoomed"
        }
      });
      swiper2.zoom = {
        enabled: false
      };
      let currentScale = 1;
      let isScaling = false;
      let fakeGestureTouched;
      let fakeGestureMoved;
      const evCache = [];
      const gesture = {
        originX: 0,
        originY: 0,
        slideEl: void 0,
        slideWidth: void 0,
        slideHeight: void 0,
        imageEl: void 0,
        imageWrapEl: void 0,
        maxRatio: 3
      };
      const image = {
        isTouched: void 0,
        isMoved: void 0,
        currentX: void 0,
        currentY: void 0,
        minX: void 0,
        minY: void 0,
        maxX: void 0,
        maxY: void 0,
        width: void 0,
        height: void 0,
        startX: void 0,
        startY: void 0,
        touchesStart: {},
        touchesCurrent: {}
      };
      const velocity = {
        x: void 0,
        y: void 0,
        prevPositionX: void 0,
        prevPositionY: void 0,
        prevTime: void 0
      };
      let scale = 1;
      Object.defineProperty(swiper2.zoom, "scale", {
        get() {
          return scale;
        },
        set(value) {
          if (scale !== value) {
            const imageEl = gesture.imageEl;
            const slideEl = gesture.slideEl;
            emit("zoomChange", value, imageEl, slideEl);
          }
          scale = value;
        }
      });
      function getDistanceBetweenTouches() {
        if (evCache.length < 2)
          return 1;
        const x1 = evCache[0].pageX;
        const y1 = evCache[0].pageY;
        const x2 = evCache[1].pageX;
        const y2 = evCache[1].pageY;
        const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        return distance;
      }
      function getScaleOrigin() {
        if (evCache.length < 2)
          return {
            x: null,
            y: null
          };
        const box = gesture.imageEl.getBoundingClientRect();
        return [(evCache[0].pageX + (evCache[1].pageX - evCache[0].pageX) / 2 - box.x) / currentScale, (evCache[0].pageY + (evCache[1].pageY - evCache[0].pageY) / 2 - box.y) / currentScale];
      }
      function getSlideSelector() {
        return swiper2.isElement ? `swiper-slide` : `.${swiper2.params.slideClass}`;
      }
      function eventWithinSlide(e) {
        const slideSelector = getSlideSelector();
        if (e.target.matches(slideSelector))
          return true;
        if (swiper2.slides.filter((slideEl) => slideEl.contains(e.target)).length > 0)
          return true;
        return false;
      }
      function eventWithinZoomContainer(e) {
        const selector = `.${swiper2.params.zoom.containerClass}`;
        if (e.target.matches(selector))
          return true;
        if ([...swiper2.el.querySelectorAll(selector)].filter((containerEl) => containerEl.contains(e.target)).length > 0)
          return true;
        return false;
      }
      function onGestureStart(e) {
        if (e.pointerType === "mouse") {
          evCache.splice(0, evCache.length);
        }
        if (!eventWithinSlide(e))
          return;
        const params = swiper2.params.zoom;
        fakeGestureTouched = false;
        fakeGestureMoved = false;
        evCache.push(e);
        if (evCache.length < 2) {
          return;
        }
        fakeGestureTouched = true;
        gesture.scaleStart = getDistanceBetweenTouches();
        if (!gesture.slideEl) {
          gesture.slideEl = e.target.closest(`.${swiper2.params.slideClass}, swiper-slide`);
          if (!gesture.slideEl)
            gesture.slideEl = swiper2.slides[swiper2.activeIndex];
          let imageEl = gesture.slideEl.querySelector(`.${params.containerClass}`);
          if (imageEl) {
            imageEl = imageEl.querySelectorAll("picture, img, svg, canvas, .swiper-zoom-target")[0];
          }
          gesture.imageEl = imageEl;
          if (imageEl) {
            gesture.imageWrapEl = elementParents(gesture.imageEl, `.${params.containerClass}`)[0];
          } else {
            gesture.imageWrapEl = void 0;
          }
          if (!gesture.imageWrapEl) {
            gesture.imageEl = void 0;
            return;
          }
          gesture.maxRatio = gesture.imageWrapEl.getAttribute("data-swiper-zoom") || params.maxRatio;
        }
        if (gesture.imageEl) {
          const [originX, originY] = getScaleOrigin();
          gesture.originX = originX;
          gesture.originY = originY;
          gesture.imageEl.style.transitionDuration = "0ms";
        }
        isScaling = true;
      }
      function onGestureChange(e) {
        if (!eventWithinSlide(e))
          return;
        const params = swiper2.params.zoom;
        const zoom = swiper2.zoom;
        const pointerIndex = evCache.findIndex((cachedEv) => cachedEv.pointerId === e.pointerId);
        if (pointerIndex >= 0)
          evCache[pointerIndex] = e;
        if (evCache.length < 2) {
          return;
        }
        fakeGestureMoved = true;
        gesture.scaleMove = getDistanceBetweenTouches();
        if (!gesture.imageEl) {
          return;
        }
        zoom.scale = gesture.scaleMove / gesture.scaleStart * currentScale;
        if (zoom.scale > gesture.maxRatio) {
          zoom.scale = gesture.maxRatio - 1 + (zoom.scale - gesture.maxRatio + 1) ** 0.5;
        }
        if (zoom.scale < params.minRatio) {
          zoom.scale = params.minRatio + 1 - (params.minRatio - zoom.scale + 1) ** 0.5;
        }
        gesture.imageEl.style.transform = `translate3d(0,0,0) scale(${zoom.scale})`;
      }
      function onGestureEnd(e) {
        if (!eventWithinSlide(e))
          return;
        if (e.pointerType === "mouse" && e.type === "pointerout")
          return;
        const params = swiper2.params.zoom;
        const zoom = swiper2.zoom;
        const pointerIndex = evCache.findIndex((cachedEv) => cachedEv.pointerId === e.pointerId);
        if (pointerIndex >= 0)
          evCache.splice(pointerIndex, 1);
        if (!fakeGestureTouched || !fakeGestureMoved) {
          return;
        }
        fakeGestureTouched = false;
        fakeGestureMoved = false;
        if (!gesture.imageEl)
          return;
        zoom.scale = Math.max(Math.min(zoom.scale, gesture.maxRatio), params.minRatio);
        gesture.imageEl.style.transitionDuration = `${swiper2.params.speed}ms`;
        gesture.imageEl.style.transform = `translate3d(0,0,0) scale(${zoom.scale})`;
        currentScale = zoom.scale;
        isScaling = false;
        if (zoom.scale > 1 && gesture.slideEl) {
          gesture.slideEl.classList.add(`${params.zoomedSlideClass}`);
        } else if (zoom.scale <= 1 && gesture.slideEl) {
          gesture.slideEl.classList.remove(`${params.zoomedSlideClass}`);
        }
        if (zoom.scale === 1) {
          gesture.originX = 0;
          gesture.originY = 0;
          gesture.slideEl = void 0;
        }
      }
      function onTouchStart2(e) {
        const device = swiper2.device;
        if (!gesture.imageEl)
          return;
        if (image.isTouched)
          return;
        if (device.android && e.cancelable)
          e.preventDefault();
        image.isTouched = true;
        const event2 = evCache.length > 0 ? evCache[0] : e;
        image.touchesStart.x = event2.pageX;
        image.touchesStart.y = event2.pageY;
      }
      function onTouchMove2(e) {
        if (!eventWithinSlide(e) || !eventWithinZoomContainer(e))
          return;
        const zoom = swiper2.zoom;
        if (!gesture.imageEl)
          return;
        if (!image.isTouched || !gesture.slideEl)
          return;
        if (!image.isMoved) {
          image.width = gesture.imageEl.offsetWidth;
          image.height = gesture.imageEl.offsetHeight;
          image.startX = getTranslate(gesture.imageWrapEl, "x") || 0;
          image.startY = getTranslate(gesture.imageWrapEl, "y") || 0;
          gesture.slideWidth = gesture.slideEl.offsetWidth;
          gesture.slideHeight = gesture.slideEl.offsetHeight;
          gesture.imageWrapEl.style.transitionDuration = "0ms";
        }
        const scaledWidth = image.width * zoom.scale;
        const scaledHeight = image.height * zoom.scale;
        if (scaledWidth < gesture.slideWidth && scaledHeight < gesture.slideHeight)
          return;
        image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
        image.maxX = -image.minX;
        image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
        image.maxY = -image.minY;
        image.touchesCurrent.x = evCache.length > 0 ? evCache[0].pageX : e.pageX;
        image.touchesCurrent.y = evCache.length > 0 ? evCache[0].pageY : e.pageY;
        const touchesDiff = Math.max(Math.abs(image.touchesCurrent.x - image.touchesStart.x), Math.abs(image.touchesCurrent.y - image.touchesStart.y));
        if (touchesDiff > 5) {
          swiper2.allowClick = false;
        }
        if (!image.isMoved && !isScaling) {
          if (swiper2.isHorizontal() && (Math.floor(image.minX) === Math.floor(image.startX) && image.touchesCurrent.x < image.touchesStart.x || Math.floor(image.maxX) === Math.floor(image.startX) && image.touchesCurrent.x > image.touchesStart.x)) {
            image.isTouched = false;
            return;
          }
          if (!swiper2.isHorizontal() && (Math.floor(image.minY) === Math.floor(image.startY) && image.touchesCurrent.y < image.touchesStart.y || Math.floor(image.maxY) === Math.floor(image.startY) && image.touchesCurrent.y > image.touchesStart.y)) {
            image.isTouched = false;
            return;
          }
        }
        if (e.cancelable) {
          e.preventDefault();
        }
        e.stopPropagation();
        image.isMoved = true;
        const scaleRatio = (zoom.scale - currentScale) / (gesture.maxRatio - swiper2.params.zoom.minRatio);
        const {
          originX,
          originY
        } = gesture;
        image.currentX = image.touchesCurrent.x - image.touchesStart.x + image.startX + scaleRatio * (image.width - originX * 2);
        image.currentY = image.touchesCurrent.y - image.touchesStart.y + image.startY + scaleRatio * (image.height - originY * 2);
        if (image.currentX < image.minX) {
          image.currentX = image.minX + 1 - (image.minX - image.currentX + 1) ** 0.8;
        }
        if (image.currentX > image.maxX) {
          image.currentX = image.maxX - 1 + (image.currentX - image.maxX + 1) ** 0.8;
        }
        if (image.currentY < image.minY) {
          image.currentY = image.minY + 1 - (image.minY - image.currentY + 1) ** 0.8;
        }
        if (image.currentY > image.maxY) {
          image.currentY = image.maxY - 1 + (image.currentY - image.maxY + 1) ** 0.8;
        }
        if (!velocity.prevPositionX)
          velocity.prevPositionX = image.touchesCurrent.x;
        if (!velocity.prevPositionY)
          velocity.prevPositionY = image.touchesCurrent.y;
        if (!velocity.prevTime)
          velocity.prevTime = Date.now();
        velocity.x = (image.touchesCurrent.x - velocity.prevPositionX) / (Date.now() - velocity.prevTime) / 2;
        velocity.y = (image.touchesCurrent.y - velocity.prevPositionY) / (Date.now() - velocity.prevTime) / 2;
        if (Math.abs(image.touchesCurrent.x - velocity.prevPositionX) < 2)
          velocity.x = 0;
        if (Math.abs(image.touchesCurrent.y - velocity.prevPositionY) < 2)
          velocity.y = 0;
        velocity.prevPositionX = image.touchesCurrent.x;
        velocity.prevPositionY = image.touchesCurrent.y;
        velocity.prevTime = Date.now();
        gesture.imageWrapEl.style.transform = `translate3d(${image.currentX}px, ${image.currentY}px,0)`;
      }
      function onTouchEnd2() {
        const zoom = swiper2.zoom;
        if (!gesture.imageEl)
          return;
        if (!image.isTouched || !image.isMoved) {
          image.isTouched = false;
          image.isMoved = false;
          return;
        }
        image.isTouched = false;
        image.isMoved = false;
        let momentumDurationX = 300;
        let momentumDurationY = 300;
        const momentumDistanceX = velocity.x * momentumDurationX;
        const newPositionX = image.currentX + momentumDistanceX;
        const momentumDistanceY = velocity.y * momentumDurationY;
        const newPositionY = image.currentY + momentumDistanceY;
        if (velocity.x !== 0)
          momentumDurationX = Math.abs((newPositionX - image.currentX) / velocity.x);
        if (velocity.y !== 0)
          momentumDurationY = Math.abs((newPositionY - image.currentY) / velocity.y);
        const momentumDuration = Math.max(momentumDurationX, momentumDurationY);
        image.currentX = newPositionX;
        image.currentY = newPositionY;
        const scaledWidth = image.width * zoom.scale;
        const scaledHeight = image.height * zoom.scale;
        image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
        image.maxX = -image.minX;
        image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
        image.maxY = -image.minY;
        image.currentX = Math.max(Math.min(image.currentX, image.maxX), image.minX);
        image.currentY = Math.max(Math.min(image.currentY, image.maxY), image.minY);
        gesture.imageWrapEl.style.transitionDuration = `${momentumDuration}ms`;
        gesture.imageWrapEl.style.transform = `translate3d(${image.currentX}px, ${image.currentY}px,0)`;
      }
      function onTransitionEnd() {
        const zoom = swiper2.zoom;
        if (gesture.slideEl && swiper2.activeIndex !== swiper2.slides.indexOf(gesture.slideEl)) {
          if (gesture.imageEl) {
            gesture.imageEl.style.transform = "translate3d(0,0,0) scale(1)";
          }
          if (gesture.imageWrapEl) {
            gesture.imageWrapEl.style.transform = "translate3d(0,0,0)";
          }
          gesture.slideEl.classList.remove(`${swiper2.params.zoom.zoomedSlideClass}`);
          zoom.scale = 1;
          currentScale = 1;
          gesture.slideEl = void 0;
          gesture.imageEl = void 0;
          gesture.imageWrapEl = void 0;
          gesture.originX = 0;
          gesture.originY = 0;
        }
      }
      function zoomIn(e) {
        const zoom = swiper2.zoom;
        const params = swiper2.params.zoom;
        if (!gesture.slideEl) {
          if (e && e.target) {
            gesture.slideEl = e.target.closest(`.${swiper2.params.slideClass}, swiper-slide`);
          }
          if (!gesture.slideEl) {
            if (swiper2.params.virtual && swiper2.params.virtual.enabled && swiper2.virtual) {
              gesture.slideEl = elementChildren(swiper2.slidesEl, `.${swiper2.params.slideActiveClass}`)[0];
            } else {
              gesture.slideEl = swiper2.slides[swiper2.activeIndex];
            }
          }
          let imageEl = gesture.slideEl.querySelector(`.${params.containerClass}`);
          if (imageEl) {
            imageEl = imageEl.querySelectorAll("picture, img, svg, canvas, .swiper-zoom-target")[0];
          }
          gesture.imageEl = imageEl;
          if (imageEl) {
            gesture.imageWrapEl = elementParents(gesture.imageEl, `.${params.containerClass}`)[0];
          } else {
            gesture.imageWrapEl = void 0;
          }
        }
        if (!gesture.imageEl || !gesture.imageWrapEl)
          return;
        if (swiper2.params.cssMode) {
          swiper2.wrapperEl.style.overflow = "hidden";
          swiper2.wrapperEl.style.touchAction = "none";
        }
        gesture.slideEl.classList.add(`${params.zoomedSlideClass}`);
        let touchX;
        let touchY;
        let offsetX;
        let offsetY;
        let diffX;
        let diffY;
        let translateX;
        let translateY;
        let imageWidth;
        let imageHeight;
        let scaledWidth;
        let scaledHeight;
        let translateMinX;
        let translateMinY;
        let translateMaxX;
        let translateMaxY;
        let slideWidth;
        let slideHeight;
        if (typeof image.touchesStart.x === "undefined" && e) {
          touchX = e.pageX;
          touchY = e.pageY;
        } else {
          touchX = image.touchesStart.x;
          touchY = image.touchesStart.y;
        }
        const forceZoomRatio = typeof e === "number" ? e : null;
        if (currentScale === 1 && forceZoomRatio) {
          touchX = void 0;
          touchY = void 0;
        }
        zoom.scale = forceZoomRatio || gesture.imageWrapEl.getAttribute("data-swiper-zoom") || params.maxRatio;
        currentScale = forceZoomRatio || gesture.imageWrapEl.getAttribute("data-swiper-zoom") || params.maxRatio;
        if (e && !(currentScale === 1 && forceZoomRatio)) {
          slideWidth = gesture.slideEl.offsetWidth;
          slideHeight = gesture.slideEl.offsetHeight;
          offsetX = elementOffset(gesture.slideEl).left + window2.scrollX;
          offsetY = elementOffset(gesture.slideEl).top + window2.scrollY;
          diffX = offsetX + slideWidth / 2 - touchX;
          diffY = offsetY + slideHeight / 2 - touchY;
          imageWidth = gesture.imageEl.offsetWidth;
          imageHeight = gesture.imageEl.offsetHeight;
          scaledWidth = imageWidth * zoom.scale;
          scaledHeight = imageHeight * zoom.scale;
          translateMinX = Math.min(slideWidth / 2 - scaledWidth / 2, 0);
          translateMinY = Math.min(slideHeight / 2 - scaledHeight / 2, 0);
          translateMaxX = -translateMinX;
          translateMaxY = -translateMinY;
          translateX = diffX * zoom.scale;
          translateY = diffY * zoom.scale;
          if (translateX < translateMinX) {
            translateX = translateMinX;
          }
          if (translateX > translateMaxX) {
            translateX = translateMaxX;
          }
          if (translateY < translateMinY) {
            translateY = translateMinY;
          }
          if (translateY > translateMaxY) {
            translateY = translateMaxY;
          }
        } else {
          translateX = 0;
          translateY = 0;
        }
        if (forceZoomRatio && zoom.scale === 1) {
          gesture.originX = 0;
          gesture.originY = 0;
        }
        gesture.imageWrapEl.style.transitionDuration = "300ms";
        gesture.imageWrapEl.style.transform = `translate3d(${translateX}px, ${translateY}px,0)`;
        gesture.imageEl.style.transitionDuration = "300ms";
        gesture.imageEl.style.transform = `translate3d(0,0,0) scale(${zoom.scale})`;
      }
      function zoomOut() {
        const zoom = swiper2.zoom;
        const params = swiper2.params.zoom;
        if (!gesture.slideEl) {
          if (swiper2.params.virtual && swiper2.params.virtual.enabled && swiper2.virtual) {
            gesture.slideEl = elementChildren(swiper2.slidesEl, `.${swiper2.params.slideActiveClass}`)[0];
          } else {
            gesture.slideEl = swiper2.slides[swiper2.activeIndex];
          }
          let imageEl = gesture.slideEl.querySelector(`.${params.containerClass}`);
          if (imageEl) {
            imageEl = imageEl.querySelectorAll("picture, img, svg, canvas, .swiper-zoom-target")[0];
          }
          gesture.imageEl = imageEl;
          if (imageEl) {
            gesture.imageWrapEl = elementParents(gesture.imageEl, `.${params.containerClass}`)[0];
          } else {
            gesture.imageWrapEl = void 0;
          }
        }
        if (!gesture.imageEl || !gesture.imageWrapEl)
          return;
        if (swiper2.params.cssMode) {
          swiper2.wrapperEl.style.overflow = "";
          swiper2.wrapperEl.style.touchAction = "";
        }
        zoom.scale = 1;
        currentScale = 1;
        gesture.imageWrapEl.style.transitionDuration = "300ms";
        gesture.imageWrapEl.style.transform = "translate3d(0,0,0)";
        gesture.imageEl.style.transitionDuration = "300ms";
        gesture.imageEl.style.transform = "translate3d(0,0,0) scale(1)";
        gesture.slideEl.classList.remove(`${params.zoomedSlideClass}`);
        gesture.slideEl = void 0;
        gesture.originX = 0;
        gesture.originY = 0;
      }
      function zoomToggle(e) {
        const zoom = swiper2.zoom;
        if (zoom.scale && zoom.scale !== 1) {
          zoomOut();
        } else {
          zoomIn(e);
        }
      }
      function getListeners() {
        const passiveListener = swiper2.params.passiveListeners ? {
          passive: true,
          capture: false
        } : false;
        const activeListenerWithCapture = swiper2.params.passiveListeners ? {
          passive: false,
          capture: true
        } : true;
        return {
          passiveListener,
          activeListenerWithCapture
        };
      }
      function enable() {
        const zoom = swiper2.zoom;
        if (zoom.enabled)
          return;
        zoom.enabled = true;
        const {
          passiveListener,
          activeListenerWithCapture
        } = getListeners();
        swiper2.wrapperEl.addEventListener("pointerdown", onGestureStart, passiveListener);
        swiper2.wrapperEl.addEventListener("pointermove", onGestureChange, activeListenerWithCapture);
        ["pointerup", "pointercancel", "pointerout"].forEach((eventName) => {
          swiper2.wrapperEl.addEventListener(eventName, onGestureEnd, passiveListener);
        });
        swiper2.wrapperEl.addEventListener("pointermove", onTouchMove2, activeListenerWithCapture);
      }
      function disable() {
        const zoom = swiper2.zoom;
        if (!zoom.enabled)
          return;
        zoom.enabled = false;
        const {
          passiveListener,
          activeListenerWithCapture
        } = getListeners();
        swiper2.wrapperEl.removeEventListener("pointerdown", onGestureStart, passiveListener);
        swiper2.wrapperEl.removeEventListener("pointermove", onGestureChange, activeListenerWithCapture);
        ["pointerup", "pointercancel", "pointerout"].forEach((eventName) => {
          swiper2.wrapperEl.removeEventListener(eventName, onGestureEnd, passiveListener);
        });
        swiper2.wrapperEl.removeEventListener("pointermove", onTouchMove2, activeListenerWithCapture);
      }
      on("init", () => {
        if (swiper2.params.zoom.enabled) {
          enable();
        }
      });
      on("destroy", () => {
        disable();
      });
      on("touchStart", (_s, e) => {
        if (!swiper2.zoom.enabled)
          return;
        onTouchStart2(e);
      });
      on("touchEnd", (_s, e) => {
        if (!swiper2.zoom.enabled)
          return;
        onTouchEnd2();
      });
      on("doubleTap", (_s, e) => {
        if (!swiper2.animating && swiper2.params.zoom.enabled && swiper2.zoom.enabled && swiper2.params.zoom.toggle) {
          zoomToggle(e);
        }
      });
      on("transitionEnd", () => {
        if (swiper2.zoom.enabled && swiper2.params.zoom.enabled) {
          onTransitionEnd();
        }
      });
      on("slideChange", () => {
        if (swiper2.zoom.enabled && swiper2.params.zoom.enabled && swiper2.params.cssMode) {
          onTransitionEnd();
        }
      });
      Object.assign(swiper2.zoom, {
        enable,
        disable,
        in: zoomIn,
        out: zoomOut,
        toggle: zoomToggle
      });
    }
    function Controller(_ref) {
      let {
        swiper: swiper2,
        extendParams,
        on
      } = _ref;
      extendParams({
        controller: {
          control: void 0,
          inverse: false,
          by: "slide"
          // or 'container'
        }
      });
      swiper2.controller = {
        control: void 0
      };
      function LinearSpline(x, y) {
        const binarySearch = function search() {
          let maxIndex;
          let minIndex;
          let guess;
          return (array, val) => {
            minIndex = -1;
            maxIndex = array.length;
            while (maxIndex - minIndex > 1) {
              guess = maxIndex + minIndex >> 1;
              if (array[guess] <= val) {
                minIndex = guess;
              } else {
                maxIndex = guess;
              }
            }
            return maxIndex;
          };
        }();
        this.x = x;
        this.y = y;
        this.lastIndex = x.length - 1;
        let i1;
        let i3;
        this.interpolate = function interpolate(x2) {
          if (!x2)
            return 0;
          i3 = binarySearch(this.x, x2);
          i1 = i3 - 1;
          return (x2 - this.x[i1]) * (this.y[i3] - this.y[i1]) / (this.x[i3] - this.x[i1]) + this.y[i1];
        };
        return this;
      }
      function getInterpolateFunction(c) {
        swiper2.controller.spline = swiper2.params.loop ? new LinearSpline(swiper2.slidesGrid, c.slidesGrid) : new LinearSpline(swiper2.snapGrid, c.snapGrid);
      }
      function setTranslate2(_t, byController) {
        const controlled = swiper2.controller.control;
        let multiplier;
        let controlledTranslate;
        const Swiper3 = swiper2.constructor;
        function setControlledTranslate(c) {
          if (c.destroyed)
            return;
          const translate2 = swiper2.rtlTranslate ? -swiper2.translate : swiper2.translate;
          if (swiper2.params.controller.by === "slide") {
            getInterpolateFunction(c);
            controlledTranslate = -swiper2.controller.spline.interpolate(-translate2);
          }
          if (!controlledTranslate || swiper2.params.controller.by === "container") {
            multiplier = (c.maxTranslate() - c.minTranslate()) / (swiper2.maxTranslate() - swiper2.minTranslate());
            if (Number.isNaN(multiplier) || !Number.isFinite(multiplier)) {
              multiplier = 1;
            }
            controlledTranslate = (translate2 - swiper2.minTranslate()) * multiplier + c.minTranslate();
          }
          if (swiper2.params.controller.inverse) {
            controlledTranslate = c.maxTranslate() - controlledTranslate;
          }
          c.updateProgress(controlledTranslate);
          c.setTranslate(controlledTranslate, swiper2);
          c.updateActiveIndex();
          c.updateSlidesClasses();
        }
        if (Array.isArray(controlled)) {
          for (let i = 0; i < controlled.length; i += 1) {
            if (controlled[i] !== byController && controlled[i] instanceof Swiper3) {
              setControlledTranslate(controlled[i]);
            }
          }
        } else if (controlled instanceof Swiper3 && byController !== controlled) {
          setControlledTranslate(controlled);
        }
      }
      function setTransition2(duration, byController) {
        const Swiper3 = swiper2.constructor;
        const controlled = swiper2.controller.control;
        let i;
        function setControlledTransition(c) {
          if (c.destroyed)
            return;
          c.setTransition(duration, swiper2);
          if (duration !== 0) {
            c.transitionStart();
            if (c.params.autoHeight) {
              nextTick(() => {
                c.updateAutoHeight();
              });
            }
            elementTransitionEnd(c.wrapperEl, () => {
              if (!controlled)
                return;
              c.transitionEnd();
            });
          }
        }
        if (Array.isArray(controlled)) {
          for (i = 0; i < controlled.length; i += 1) {
            if (controlled[i] !== byController && controlled[i] instanceof Swiper3) {
              setControlledTransition(controlled[i]);
            }
          }
        } else if (controlled instanceof Swiper3 && byController !== controlled) {
          setControlledTransition(controlled);
        }
      }
      function removeSpline() {
        if (!swiper2.controller.control)
          return;
        if (swiper2.controller.spline) {
          swiper2.controller.spline = void 0;
          delete swiper2.controller.spline;
        }
      }
      on("beforeInit", () => {
        if (typeof window !== "undefined" && // eslint-disable-line
        (typeof swiper2.params.controller.control === "string" || swiper2.params.controller.control instanceof HTMLElement)) {
          const controlElement = document.querySelector(swiper2.params.controller.control);
          if (controlElement && controlElement.swiper) {
            swiper2.controller.control = controlElement.swiper;
          } else if (controlElement) {
            const onControllerSwiper = (e) => {
              swiper2.controller.control = e.detail[0];
              swiper2.update();
              controlElement.removeEventListener("init", onControllerSwiper);
            };
            controlElement.addEventListener("init", onControllerSwiper);
          }
          return;
        }
        swiper2.controller.control = swiper2.params.controller.control;
      });
      on("update", () => {
        removeSpline();
      });
      on("resize", () => {
        removeSpline();
      });
      on("observerUpdate", () => {
        removeSpline();
      });
      on("setTranslate", (_s, translate2, byController) => {
        if (!swiper2.controller.control || swiper2.controller.control.destroyed)
          return;
        swiper2.controller.setTranslate(translate2, byController);
      });
      on("setTransition", (_s, duration, byController) => {
        if (!swiper2.controller.control || swiper2.controller.control.destroyed)
          return;
        swiper2.controller.setTransition(duration, byController);
      });
      Object.assign(swiper2.controller, {
        setTranslate: setTranslate2,
        setTransition: setTransition2
      });
    }
    function A11y(_ref) {
      let {
        swiper: swiper2,
        extendParams,
        on
      } = _ref;
      extendParams({
        a11y: {
          enabled: true,
          notificationClass: "swiper-notification",
          prevSlideMessage: "Previous slide",
          nextSlideMessage: "Next slide",
          firstSlideMessage: "This is the first slide",
          lastSlideMessage: "This is the last slide",
          paginationBulletMessage: "Go to slide {{index}}",
          slideLabelMessage: "{{index}} / {{slidesLength}}",
          containerMessage: null,
          containerRoleDescriptionMessage: null,
          itemRoleDescriptionMessage: null,
          slideRole: "group",
          id: null
        }
      });
      swiper2.a11y = {
        clicked: false
      };
      let liveRegion = null;
      function notify(message) {
        const notification = liveRegion;
        if (notification.length === 0)
          return;
        notification.innerHTML = "";
        notification.innerHTML = message;
      }
      const makeElementsArray = (el) => {
        if (!Array.isArray(el))
          el = [el].filter((e) => !!e);
        return el;
      };
      function getRandomNumber(size) {
        if (size === void 0) {
          size = 16;
        }
        const randomChar = () => Math.round(16 * Math.random()).toString(16);
        return "x".repeat(size).replace(/x/g, randomChar);
      }
      function makeElFocusable(el) {
        el = makeElementsArray(el);
        el.forEach((subEl) => {
          subEl.setAttribute("tabIndex", "0");
        });
      }
      function makeElNotFocusable(el) {
        el = makeElementsArray(el);
        el.forEach((subEl) => {
          subEl.setAttribute("tabIndex", "-1");
        });
      }
      function addElRole(el, role) {
        el = makeElementsArray(el);
        el.forEach((subEl) => {
          subEl.setAttribute("role", role);
        });
      }
      function addElRoleDescription(el, description) {
        el = makeElementsArray(el);
        el.forEach((subEl) => {
          subEl.setAttribute("aria-roledescription", description);
        });
      }
      function addElControls(el, controls) {
        el = makeElementsArray(el);
        el.forEach((subEl) => {
          subEl.setAttribute("aria-controls", controls);
        });
      }
      function addElLabel(el, label) {
        el = makeElementsArray(el);
        el.forEach((subEl) => {
          subEl.setAttribute("aria-label", label);
        });
      }
      function addElId(el, id) {
        el = makeElementsArray(el);
        el.forEach((subEl) => {
          subEl.setAttribute("id", id);
        });
      }
      function addElLive(el, live) {
        el = makeElementsArray(el);
        el.forEach((subEl) => {
          subEl.setAttribute("aria-live", live);
        });
      }
      function disableEl(el) {
        el = makeElementsArray(el);
        el.forEach((subEl) => {
          subEl.setAttribute("aria-disabled", true);
        });
      }
      function enableEl(el) {
        el = makeElementsArray(el);
        el.forEach((subEl) => {
          subEl.setAttribute("aria-disabled", false);
        });
      }
      function onEnterOrSpaceKey(e) {
        if (e.keyCode !== 13 && e.keyCode !== 32)
          return;
        const params = swiper2.params.a11y;
        const targetEl = e.target;
        if (swiper2.pagination && swiper2.pagination.el && (targetEl === swiper2.pagination.el || swiper2.pagination.el.contains(e.target))) {
          if (!e.target.matches(classesToSelector(swiper2.params.pagination.bulletClass)))
            return;
        }
        if (swiper2.navigation && swiper2.navigation.nextEl && targetEl === swiper2.navigation.nextEl) {
          if (!(swiper2.isEnd && !swiper2.params.loop)) {
            swiper2.slideNext();
          }
          if (swiper2.isEnd) {
            notify(params.lastSlideMessage);
          } else {
            notify(params.nextSlideMessage);
          }
        }
        if (swiper2.navigation && swiper2.navigation.prevEl && targetEl === swiper2.navigation.prevEl) {
          if (!(swiper2.isBeginning && !swiper2.params.loop)) {
            swiper2.slidePrev();
          }
          if (swiper2.isBeginning) {
            notify(params.firstSlideMessage);
          } else {
            notify(params.prevSlideMessage);
          }
        }
        if (swiper2.pagination && targetEl.matches(classesToSelector(swiper2.params.pagination.bulletClass))) {
          targetEl.click();
        }
      }
      function updateNavigation() {
        if (swiper2.params.loop || swiper2.params.rewind || !swiper2.navigation)
          return;
        const {
          nextEl,
          prevEl
        } = swiper2.navigation;
        if (prevEl) {
          if (swiper2.isBeginning) {
            disableEl(prevEl);
            makeElNotFocusable(prevEl);
          } else {
            enableEl(prevEl);
            makeElFocusable(prevEl);
          }
        }
        if (nextEl) {
          if (swiper2.isEnd) {
            disableEl(nextEl);
            makeElNotFocusable(nextEl);
          } else {
            enableEl(nextEl);
            makeElFocusable(nextEl);
          }
        }
      }
      function hasPagination() {
        return swiper2.pagination && swiper2.pagination.bullets && swiper2.pagination.bullets.length;
      }
      function hasClickablePagination() {
        return hasPagination() && swiper2.params.pagination.clickable;
      }
      function updatePagination() {
        const params = swiper2.params.a11y;
        if (!hasPagination())
          return;
        swiper2.pagination.bullets.forEach((bulletEl) => {
          if (swiper2.params.pagination.clickable) {
            makeElFocusable(bulletEl);
            if (!swiper2.params.pagination.renderBullet) {
              addElRole(bulletEl, "button");
              addElLabel(bulletEl, params.paginationBulletMessage.replace(/\{\{index\}\}/, elementIndex(bulletEl) + 1));
            }
          }
          if (bulletEl.matches(classesToSelector(swiper2.params.pagination.bulletActiveClass))) {
            bulletEl.setAttribute("aria-current", "true");
          } else {
            bulletEl.removeAttribute("aria-current");
          }
        });
      }
      const initNavEl = (el, wrapperId, message) => {
        makeElFocusable(el);
        if (el.tagName !== "BUTTON") {
          addElRole(el, "button");
          el.addEventListener("keydown", onEnterOrSpaceKey);
        }
        addElLabel(el, message);
        addElControls(el, wrapperId);
      };
      const handlePointerDown = () => {
        swiper2.a11y.clicked = true;
      };
      const handlePointerUp = () => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!swiper2.destroyed) {
              swiper2.a11y.clicked = false;
            }
          });
        });
      };
      const handleFocus = (e) => {
        if (swiper2.a11y.clicked)
          return;
        const slideEl = e.target.closest(`.${swiper2.params.slideClass}, swiper-slide`);
        if (!slideEl || !swiper2.slides.includes(slideEl))
          return;
        const isActive = swiper2.slides.indexOf(slideEl) === swiper2.activeIndex;
        const isVisible = swiper2.params.watchSlidesProgress && swiper2.visibleSlides && swiper2.visibleSlides.includes(slideEl);
        if (isActive || isVisible)
          return;
        if (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents)
          return;
        if (swiper2.isHorizontal()) {
          swiper2.el.scrollLeft = 0;
        } else {
          swiper2.el.scrollTop = 0;
        }
        swiper2.slideTo(swiper2.slides.indexOf(slideEl), 0);
      };
      const initSlides = () => {
        const params = swiper2.params.a11y;
        if (params.itemRoleDescriptionMessage) {
          addElRoleDescription(swiper2.slides, params.itemRoleDescriptionMessage);
        }
        if (params.slideRole) {
          addElRole(swiper2.slides, params.slideRole);
        }
        const slidesLength = swiper2.slides.length;
        if (params.slideLabelMessage) {
          swiper2.slides.forEach((slideEl, index) => {
            const slideIndex = swiper2.params.loop ? parseInt(slideEl.getAttribute("data-swiper-slide-index"), 10) : index;
            const ariaLabelMessage = params.slideLabelMessage.replace(/\{\{index\}\}/, slideIndex + 1).replace(/\{\{slidesLength\}\}/, slidesLength);
            addElLabel(slideEl, ariaLabelMessage);
          });
        }
      };
      const init = () => {
        const params = swiper2.params.a11y;
        if (swiper2.isElement) {
          swiper2.el.shadowEl.append(liveRegion);
        } else {
          swiper2.el.append(liveRegion);
        }
        const containerEl = swiper2.el;
        if (params.containerRoleDescriptionMessage) {
          addElRoleDescription(containerEl, params.containerRoleDescriptionMessage);
        }
        if (params.containerMessage) {
          addElLabel(containerEl, params.containerMessage);
        }
        const wrapperEl = swiper2.wrapperEl;
        const wrapperId = params.id || wrapperEl.getAttribute("id") || `swiper-wrapper-${getRandomNumber(16)}`;
        const live = swiper2.params.autoplay && swiper2.params.autoplay.enabled ? "off" : "polite";
        addElId(wrapperEl, wrapperId);
        addElLive(wrapperEl, live);
        initSlides();
        let {
          nextEl,
          prevEl
        } = swiper2.navigation ? swiper2.navigation : {};
        nextEl = makeElementsArray(nextEl);
        prevEl = makeElementsArray(prevEl);
        if (nextEl) {
          nextEl.forEach((el) => initNavEl(el, wrapperId, params.nextSlideMessage));
        }
        if (prevEl) {
          prevEl.forEach((el) => initNavEl(el, wrapperId, params.prevSlideMessage));
        }
        if (hasClickablePagination()) {
          const paginationEl = Array.isArray(swiper2.pagination.el) ? swiper2.pagination.el : [swiper2.pagination.el];
          paginationEl.forEach((el) => {
            el.addEventListener("keydown", onEnterOrSpaceKey);
          });
        }
        swiper2.el.addEventListener("focus", handleFocus, true);
        swiper2.el.addEventListener("pointerdown", handlePointerDown, true);
        swiper2.el.addEventListener("pointerup", handlePointerUp, true);
      };
      function destroy() {
        if (liveRegion)
          liveRegion.remove();
        let {
          nextEl,
          prevEl
        } = swiper2.navigation ? swiper2.navigation : {};
        nextEl = makeElementsArray(nextEl);
        prevEl = makeElementsArray(prevEl);
        if (nextEl) {
          nextEl.forEach((el) => el.removeEventListener("keydown", onEnterOrSpaceKey));
        }
        if (prevEl) {
          prevEl.forEach((el) => el.removeEventListener("keydown", onEnterOrSpaceKey));
        }
        if (hasClickablePagination()) {
          const paginationEl = Array.isArray(swiper2.pagination.el) ? swiper2.pagination.el : [swiper2.pagination.el];
          paginationEl.forEach((el) => {
            el.removeEventListener("keydown", onEnterOrSpaceKey);
          });
        }
        swiper2.el.removeEventListener("focus", handleFocus, true);
        swiper2.el.removeEventListener("pointerdown", handlePointerDown, true);
        swiper2.el.removeEventListener("pointerup", handlePointerUp, true);
      }
      on("beforeInit", () => {
        liveRegion = createElement("span", swiper2.params.a11y.notificationClass);
        liveRegion.setAttribute("aria-live", "assertive");
        liveRegion.setAttribute("aria-atomic", "true");
      });
      on("afterInit", () => {
        if (!swiper2.params.a11y.enabled)
          return;
        init();
      });
      on("slidesLengthChange snapGridLengthChange slidesGridLengthChange", () => {
        if (!swiper2.params.a11y.enabled)
          return;
        initSlides();
      });
      on("fromEdge toEdge afterInit lock unlock", () => {
        if (!swiper2.params.a11y.enabled)
          return;
        updateNavigation();
      });
      on("paginationUpdate", () => {
        if (!swiper2.params.a11y.enabled)
          return;
        updatePagination();
      });
      on("destroy", () => {
        if (!swiper2.params.a11y.enabled)
          return;
        destroy();
      });
    }
    function History(_ref) {
      let {
        swiper: swiper2,
        extendParams,
        on
      } = _ref;
      extendParams({
        history: {
          enabled: false,
          root: "",
          replaceState: false,
          key: "slides",
          keepQuery: false
        }
      });
      let initialized = false;
      let paths = {};
      const slugify = (text) => {
        return text.toString().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
      };
      const getPathValues = (urlOverride) => {
        const window2 = getWindow();
        let location2;
        if (urlOverride) {
          location2 = new URL(urlOverride);
        } else {
          location2 = window2.location;
        }
        const pathArray = location2.pathname.slice(1).split("/").filter((part) => part !== "");
        const total = pathArray.length;
        const key = pathArray[total - 2];
        const value = pathArray[total - 1];
        return {
          key,
          value
        };
      };
      const setHistory = (key, index) => {
        const window2 = getWindow();
        if (!initialized || !swiper2.params.history.enabled)
          return;
        let location2;
        if (swiper2.params.url) {
          location2 = new URL(swiper2.params.url);
        } else {
          location2 = window2.location;
        }
        const slide2 = swiper2.slides[index];
        let value = slugify(slide2.getAttribute("data-history"));
        if (swiper2.params.history.root.length > 0) {
          let root = swiper2.params.history.root;
          if (root[root.length - 1] === "/")
            root = root.slice(0, root.length - 1);
          value = `${root}/${key ? `${key}/` : ""}${value}`;
        } else if (!location2.pathname.includes(key)) {
          value = `${key ? `${key}/` : ""}${value}`;
        }
        if (swiper2.params.history.keepQuery) {
          value += location2.search;
        }
        const currentState = window2.history.state;
        if (currentState && currentState.value === value) {
          return;
        }
        if (swiper2.params.history.replaceState) {
          window2.history.replaceState({
            value
          }, null, value);
        } else {
          window2.history.pushState({
            value
          }, null, value);
        }
      };
      const scrollToSlide = (speed, value, runCallbacks) => {
        if (value) {
          for (let i = 0, length = swiper2.slides.length; i < length; i += 1) {
            const slide2 = swiper2.slides[i];
            const slideHistory = slugify(slide2.getAttribute("data-history"));
            if (slideHistory === value) {
              const index = swiper2.getSlideIndex(slide2);
              swiper2.slideTo(index, speed, runCallbacks);
            }
          }
        } else {
          swiper2.slideTo(0, speed, runCallbacks);
        }
      };
      const setHistoryPopState = () => {
        paths = getPathValues(swiper2.params.url);
        scrollToSlide(swiper2.params.speed, paths.value, false);
      };
      const init = () => {
        const window2 = getWindow();
        if (!swiper2.params.history)
          return;
        if (!window2.history || !window2.history.pushState) {
          swiper2.params.history.enabled = false;
          swiper2.params.hashNavigation.enabled = true;
          return;
        }
        initialized = true;
        paths = getPathValues(swiper2.params.url);
        if (!paths.key && !paths.value) {
          if (!swiper2.params.history.replaceState) {
            window2.addEventListener("popstate", setHistoryPopState);
          }
          return;
        }
        scrollToSlide(0, paths.value, swiper2.params.runCallbacksOnInit);
        if (!swiper2.params.history.replaceState) {
          window2.addEventListener("popstate", setHistoryPopState);
        }
      };
      const destroy = () => {
        const window2 = getWindow();
        if (!swiper2.params.history.replaceState) {
          window2.removeEventListener("popstate", setHistoryPopState);
        }
      };
      on("init", () => {
        if (swiper2.params.history.enabled) {
          init();
        }
      });
      on("destroy", () => {
        if (swiper2.params.history.enabled) {
          destroy();
        }
      });
      on("transitionEnd _freeModeNoMomentumRelease", () => {
        if (initialized) {
          setHistory(swiper2.params.history.key, swiper2.activeIndex);
        }
      });
      on("slideChange", () => {
        if (initialized && swiper2.params.cssMode) {
          setHistory(swiper2.params.history.key, swiper2.activeIndex);
        }
      });
    }
    function HashNavigation(_ref) {
      let {
        swiper: swiper2,
        extendParams,
        emit,
        on
      } = _ref;
      let initialized = false;
      const document2 = getDocument();
      const window2 = getWindow();
      extendParams({
        hashNavigation: {
          enabled: false,
          replaceState: false,
          watchState: false,
          getSlideIndex(_s, hash) {
            if (swiper2.virtual && swiper2.params.virtual.enabled) {
              const slideWithHash = swiper2.slides.filter((slideEl) => slideEl.getAttribute("data-hash") === hash)[0];
              if (!slideWithHash)
                return 0;
              const index = parseInt(slideWithHash.getAttribute("data-swiper-slide-index"), 10);
              return index;
            }
            return swiper2.getSlideIndex(elementChildren(swiper2.slidesEl, `.${swiper2.params.slideClass}[data-hash="${hash}"], swiper-slide[data-hash="${hash}"]`)[0]);
          }
        }
      });
      const onHashChange = () => {
        emit("hashChange");
        const newHash = document2.location.hash.replace("#", "");
        const activeSlideEl = swiper2.slidesEl.querySelector(`[data-swiper-slide-index="${swiper2.activeIndex}"]`);
        const activeSlideHash = activeSlideEl ? activeSlideEl.getAttribute("data-hash") : "";
        if (newHash !== activeSlideHash) {
          const newIndex = swiper2.params.hashNavigation.getSlideIndex(swiper2, newHash);
          console.log(newIndex);
          if (typeof newIndex === "undefined")
            return;
          swiper2.slideTo(newIndex);
        }
      };
      const setHash = () => {
        if (!initialized || !swiper2.params.hashNavigation.enabled)
          return;
        const activeSlideEl = swiper2.slidesEl.querySelector(`[data-swiper-slide-index="${swiper2.activeIndex}"]`);
        const activeSlideHash = activeSlideEl ? activeSlideEl.getAttribute("data-hash") || activeSlideEl.getAttribute("data-history") : "";
        if (swiper2.params.hashNavigation.replaceState && window2.history && window2.history.replaceState) {
          window2.history.replaceState(null, null, `#${activeSlideHash}` || "");
          emit("hashSet");
        } else {
          document2.location.hash = activeSlideHash || "";
          emit("hashSet");
        }
      };
      const init = () => {
        if (!swiper2.params.hashNavigation.enabled || swiper2.params.history && swiper2.params.history.enabled)
          return;
        initialized = true;
        const hash = document2.location.hash.replace("#", "");
        if (hash) {
          const speed = 0;
          const index = swiper2.params.hashNavigation.getSlideIndex(swiper2, hash);
          swiper2.slideTo(index || 0, speed, swiper2.params.runCallbacksOnInit, true);
        }
        if (swiper2.params.hashNavigation.watchState) {
          window2.addEventListener("hashchange", onHashChange);
        }
      };
      const destroy = () => {
        if (swiper2.params.hashNavigation.watchState) {
          window2.removeEventListener("hashchange", onHashChange);
        }
      };
      on("init", () => {
        if (swiper2.params.hashNavigation.enabled) {
          init();
        }
      });
      on("destroy", () => {
        if (swiper2.params.hashNavigation.enabled) {
          destroy();
        }
      });
      on("transitionEnd _freeModeNoMomentumRelease", () => {
        if (initialized) {
          setHash();
        }
      });
      on("slideChange", () => {
        if (initialized && swiper2.params.cssMode) {
          setHash();
        }
      });
    }
    function Autoplay(_ref) {
      let {
        swiper: swiper2,
        extendParams,
        on,
        emit,
        params
      } = _ref;
      swiper2.autoplay = {
        running: false,
        paused: false,
        timeLeft: 0
      };
      extendParams({
        autoplay: {
          enabled: false,
          delay: 3e3,
          waitForTransition: true,
          disableOnInteraction: true,
          stopOnLastSlide: false,
          reverseDirection: false,
          pauseOnMouseEnter: false
        }
      });
      let timeout;
      let raf;
      let autoplayDelayTotal = params && params.autoplay ? params.autoplay.delay : 3e3;
      let autoplayDelayCurrent = params && params.autoplay ? params.autoplay.delay : 3e3;
      let autoplayTimeLeft;
      let autoplayStartTime = (/* @__PURE__ */ new Date()).getTime;
      let wasPaused;
      let isTouched;
      let pausedByTouch;
      let touchStartTimeout;
      let slideChanged;
      let pausedByInteraction;
      function onTransitionEnd(e) {
        if (!swiper2 || swiper2.destroyed || !swiper2.wrapperEl)
          return;
        if (e.target !== swiper2.wrapperEl)
          return;
        swiper2.wrapperEl.removeEventListener("transitionend", onTransitionEnd);
        resume();
      }
      const calcTimeLeft = () => {
        if (swiper2.destroyed || !swiper2.autoplay.running)
          return;
        if (swiper2.autoplay.paused) {
          wasPaused = true;
        } else if (wasPaused) {
          autoplayDelayCurrent = autoplayTimeLeft;
          wasPaused = false;
        }
        const timeLeft = swiper2.autoplay.paused ? autoplayTimeLeft : autoplayStartTime + autoplayDelayCurrent - (/* @__PURE__ */ new Date()).getTime();
        swiper2.autoplay.timeLeft = timeLeft;
        emit("autoplayTimeLeft", timeLeft, timeLeft / autoplayDelayTotal);
        raf = requestAnimationFrame(() => {
          calcTimeLeft();
        });
      };
      const getSlideDelay = () => {
        let activeSlideEl;
        if (swiper2.virtual && swiper2.params.virtual.enabled) {
          activeSlideEl = swiper2.slides.filter((slideEl) => slideEl.classList.contains("swiper-slide-active"))[0];
        } else {
          activeSlideEl = swiper2.slides[swiper2.activeIndex];
        }
        if (!activeSlideEl)
          return void 0;
        const currentSlideDelay = parseInt(activeSlideEl.getAttribute("data-swiper-autoplay"), 10);
        return currentSlideDelay;
      };
      const run = (delayForce) => {
        if (swiper2.destroyed || !swiper2.autoplay.running)
          return;
        cancelAnimationFrame(raf);
        calcTimeLeft();
        let delay = typeof delayForce === "undefined" ? swiper2.params.autoplay.delay : delayForce;
        autoplayDelayTotal = swiper2.params.autoplay.delay;
        autoplayDelayCurrent = swiper2.params.autoplay.delay;
        const currentSlideDelay = getSlideDelay();
        if (!Number.isNaN(currentSlideDelay) && currentSlideDelay > 0 && typeof delayForce === "undefined") {
          delay = currentSlideDelay;
          autoplayDelayTotal = currentSlideDelay;
          autoplayDelayCurrent = currentSlideDelay;
        }
        autoplayTimeLeft = delay;
        const speed = swiper2.params.speed;
        const proceed = () => {
          if (!swiper2 || swiper2.destroyed)
            return;
          if (swiper2.params.autoplay.reverseDirection) {
            if (!swiper2.isBeginning || swiper2.params.loop || swiper2.params.rewind) {
              swiper2.slidePrev(speed, true, true);
              emit("autoplay");
            } else if (!swiper2.params.autoplay.stopOnLastSlide) {
              swiper2.slideTo(swiper2.slides.length - 1, speed, true, true);
              emit("autoplay");
            }
          } else {
            if (!swiper2.isEnd || swiper2.params.loop || swiper2.params.rewind) {
              swiper2.slideNext(speed, true, true);
              emit("autoplay");
            } else if (!swiper2.params.autoplay.stopOnLastSlide) {
              swiper2.slideTo(0, speed, true, true);
              emit("autoplay");
            }
          }
          if (swiper2.params.cssMode) {
            autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
            requestAnimationFrame(() => {
              run();
            });
          }
        };
        if (delay > 0) {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            proceed();
          }, delay);
        } else {
          requestAnimationFrame(() => {
            proceed();
          });
        }
        return delay;
      };
      const start = () => {
        swiper2.autoplay.running = true;
        run();
        emit("autoplayStart");
      };
      const stop = () => {
        swiper2.autoplay.running = false;
        clearTimeout(timeout);
        cancelAnimationFrame(raf);
        emit("autoplayStop");
      };
      const pause = (internal, reset) => {
        if (swiper2.destroyed || !swiper2.autoplay.running)
          return;
        clearTimeout(timeout);
        if (!internal) {
          pausedByInteraction = true;
        }
        const proceed = () => {
          emit("autoplayPause");
          if (swiper2.params.autoplay.waitForTransition) {
            swiper2.wrapperEl.addEventListener("transitionend", onTransitionEnd);
          } else {
            resume();
          }
        };
        swiper2.autoplay.paused = true;
        if (reset) {
          if (slideChanged) {
            autoplayTimeLeft = swiper2.params.autoplay.delay;
          }
          slideChanged = false;
          proceed();
          return;
        }
        const delay = autoplayTimeLeft || swiper2.params.autoplay.delay;
        autoplayTimeLeft = delay - ((/* @__PURE__ */ new Date()).getTime() - autoplayStartTime);
        if (swiper2.isEnd && autoplayTimeLeft < 0 && !swiper2.params.loop)
          return;
        if (autoplayTimeLeft < 0)
          autoplayTimeLeft = 0;
        proceed();
      };
      const resume = () => {
        if (swiper2.isEnd && autoplayTimeLeft < 0 && !swiper2.params.loop || swiper2.destroyed || !swiper2.autoplay.running)
          return;
        autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
        if (pausedByInteraction) {
          pausedByInteraction = false;
          run(autoplayTimeLeft);
        } else {
          run();
        }
        swiper2.autoplay.paused = false;
        emit("autoplayResume");
      };
      const onVisibilityChange = () => {
        if (swiper2.destroyed || !swiper2.autoplay.running)
          return;
        const document2 = getDocument();
        if (document2.visibilityState === "hidden") {
          pausedByInteraction = true;
          pause(true);
        }
        if (document2.visibilityState === "visible") {
          resume();
        }
      };
      const onPointerEnter = (e) => {
        if (e.pointerType !== "mouse")
          return;
        pausedByInteraction = true;
        pause(true);
      };
      const onPointerLeave = (e) => {
        if (e.pointerType !== "mouse")
          return;
        if (swiper2.autoplay.paused) {
          resume();
        }
      };
      const attachMouseEvents = () => {
        if (swiper2.params.autoplay.pauseOnMouseEnter) {
          swiper2.el.addEventListener("pointerenter", onPointerEnter);
          swiper2.el.addEventListener("pointerleave", onPointerLeave);
        }
      };
      const detachMouseEvents = () => {
        swiper2.el.removeEventListener("pointerenter", onPointerEnter);
        swiper2.el.removeEventListener("pointerleave", onPointerLeave);
      };
      const attachDocumentEvents = () => {
        const document2 = getDocument();
        document2.addEventListener("visibilitychange", onVisibilityChange);
      };
      const detachDocumentEvents = () => {
        const document2 = getDocument();
        document2.removeEventListener("visibilitychange", onVisibilityChange);
      };
      on("init", () => {
        if (swiper2.params.autoplay.enabled) {
          attachMouseEvents();
          attachDocumentEvents();
          autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
          start();
        }
      });
      on("destroy", () => {
        detachMouseEvents();
        detachDocumentEvents();
        if (swiper2.autoplay.running) {
          stop();
        }
      });
      on("beforeTransitionStart", (_s, speed, internal) => {
        if (swiper2.destroyed || !swiper2.autoplay.running)
          return;
        if (internal || !swiper2.params.autoplay.disableOnInteraction) {
          pause(true, true);
        } else {
          stop();
        }
      });
      on("sliderFirstMove", () => {
        if (swiper2.destroyed || !swiper2.autoplay.running)
          return;
        if (swiper2.params.autoplay.disableOnInteraction) {
          stop();
          return;
        }
        isTouched = true;
        pausedByTouch = false;
        pausedByInteraction = false;
        touchStartTimeout = setTimeout(() => {
          pausedByInteraction = true;
          pausedByTouch = true;
          pause(true);
        }, 200);
      });
      on("touchEnd", () => {
        if (swiper2.destroyed || !swiper2.autoplay.running || !isTouched)
          return;
        clearTimeout(touchStartTimeout);
        clearTimeout(timeout);
        if (swiper2.params.autoplay.disableOnInteraction) {
          pausedByTouch = false;
          isTouched = false;
          return;
        }
        if (pausedByTouch && swiper2.params.cssMode)
          resume();
        pausedByTouch = false;
        isTouched = false;
      });
      on("slideChange", () => {
        if (swiper2.destroyed || !swiper2.autoplay.running)
          return;
        slideChanged = true;
      });
      Object.assign(swiper2.autoplay, {
        start,
        stop,
        pause,
        resume
      });
    }
    function Thumb(_ref) {
      let {
        swiper: swiper2,
        extendParams,
        on
      } = _ref;
      extendParams({
        thumbs: {
          swiper: null,
          multipleActiveThumbs: true,
          autoScrollOffset: 0,
          slideThumbActiveClass: "swiper-slide-thumb-active",
          thumbsContainerClass: "swiper-thumbs"
        }
      });
      let initialized = false;
      let swiperCreated = false;
      swiper2.thumbs = {
        swiper: null
      };
      function onThumbClick() {
        const thumbsSwiper = swiper2.thumbs.swiper;
        if (!thumbsSwiper || thumbsSwiper.destroyed)
          return;
        const clickedIndex = thumbsSwiper.clickedIndex;
        const clickedSlide = thumbsSwiper.clickedSlide;
        if (clickedSlide && clickedSlide.classList.contains(swiper2.params.thumbs.slideThumbActiveClass))
          return;
        if (typeof clickedIndex === "undefined" || clickedIndex === null)
          return;
        let slideToIndex;
        if (thumbsSwiper.params.loop) {
          slideToIndex = parseInt(thumbsSwiper.clickedSlide.getAttribute("data-swiper-slide-index"), 10);
        } else {
          slideToIndex = clickedIndex;
        }
        if (swiper2.params.loop) {
          swiper2.slideToLoop(slideToIndex);
        } else {
          swiper2.slideTo(slideToIndex);
        }
      }
      function init() {
        const {
          thumbs: thumbsParams
        } = swiper2.params;
        if (initialized)
          return false;
        initialized = true;
        const SwiperClass = swiper2.constructor;
        if (thumbsParams.swiper instanceof SwiperClass) {
          swiper2.thumbs.swiper = thumbsParams.swiper;
          Object.assign(swiper2.thumbs.swiper.originalParams, {
            watchSlidesProgress: true,
            slideToClickedSlide: false
          });
          Object.assign(swiper2.thumbs.swiper.params, {
            watchSlidesProgress: true,
            slideToClickedSlide: false
          });
          swiper2.thumbs.swiper.update();
        } else if (isObject(thumbsParams.swiper)) {
          const thumbsSwiperParams = Object.assign({}, thumbsParams.swiper);
          Object.assign(thumbsSwiperParams, {
            watchSlidesProgress: true,
            slideToClickedSlide: false
          });
          swiper2.thumbs.swiper = new SwiperClass(thumbsSwiperParams);
          swiperCreated = true;
        }
        swiper2.thumbs.swiper.el.classList.add(swiper2.params.thumbs.thumbsContainerClass);
        swiper2.thumbs.swiper.on("tap", onThumbClick);
        return true;
      }
      function update2(initial) {
        const thumbsSwiper = swiper2.thumbs.swiper;
        if (!thumbsSwiper || thumbsSwiper.destroyed)
          return;
        const slidesPerView = thumbsSwiper.params.slidesPerView === "auto" ? thumbsSwiper.slidesPerViewDynamic() : thumbsSwiper.params.slidesPerView;
        let thumbsToActivate = 1;
        const thumbActiveClass = swiper2.params.thumbs.slideThumbActiveClass;
        if (swiper2.params.slidesPerView > 1 && !swiper2.params.centeredSlides) {
          thumbsToActivate = swiper2.params.slidesPerView;
        }
        if (!swiper2.params.thumbs.multipleActiveThumbs) {
          thumbsToActivate = 1;
        }
        thumbsToActivate = Math.floor(thumbsToActivate);
        thumbsSwiper.slides.forEach((slideEl) => slideEl.classList.remove(thumbActiveClass));
        if (thumbsSwiper.params.loop || thumbsSwiper.params.virtual && thumbsSwiper.params.virtual.enabled) {
          for (let i = 0; i < thumbsToActivate; i += 1) {
            elementChildren(thumbsSwiper.slidesEl, `[data-swiper-slide-index="${swiper2.realIndex + i}"]`).forEach((slideEl) => {
              slideEl.classList.add(thumbActiveClass);
            });
          }
        } else {
          for (let i = 0; i < thumbsToActivate; i += 1) {
            if (thumbsSwiper.slides[swiper2.realIndex + i]) {
              thumbsSwiper.slides[swiper2.realIndex + i].classList.add(thumbActiveClass);
            }
          }
        }
        const autoScrollOffset = swiper2.params.thumbs.autoScrollOffset;
        const useOffset = autoScrollOffset && !thumbsSwiper.params.loop;
        if (swiper2.realIndex !== thumbsSwiper.realIndex || useOffset) {
          const currentThumbsIndex = thumbsSwiper.activeIndex;
          let newThumbsIndex;
          let direction;
          if (thumbsSwiper.params.loop) {
            const newThumbsSlide = thumbsSwiper.slides.filter((slideEl) => slideEl.getAttribute("data-swiper-slide-index") === `${swiper2.realIndex}`)[0];
            newThumbsIndex = thumbsSwiper.slides.indexOf(newThumbsSlide);
            direction = swiper2.activeIndex > swiper2.previousIndex ? "next" : "prev";
          } else {
            newThumbsIndex = swiper2.realIndex;
            direction = newThumbsIndex > swiper2.previousIndex ? "next" : "prev";
          }
          if (useOffset) {
            newThumbsIndex += direction === "next" ? autoScrollOffset : -1 * autoScrollOffset;
          }
          if (thumbsSwiper.visibleSlidesIndexes && thumbsSwiper.visibleSlidesIndexes.indexOf(newThumbsIndex) < 0) {
            if (thumbsSwiper.params.centeredSlides) {
              if (newThumbsIndex > currentThumbsIndex) {
                newThumbsIndex = newThumbsIndex - Math.floor(slidesPerView / 2) + 1;
              } else {
                newThumbsIndex = newThumbsIndex + Math.floor(slidesPerView / 2) - 1;
              }
            } else if (newThumbsIndex > currentThumbsIndex && thumbsSwiper.params.slidesPerGroup === 1)
              ;
            thumbsSwiper.slideTo(newThumbsIndex, initial ? 0 : void 0);
          }
        }
      }
      on("beforeInit", () => {
        const {
          thumbs
        } = swiper2.params;
        if (!thumbs || !thumbs.swiper)
          return;
        if (typeof thumbs.swiper === "string" || thumbs.swiper instanceof HTMLElement) {
          const document2 = getDocument();
          const getThumbsElementAndInit = () => {
            const thumbsElement = typeof thumbs.swiper === "string" ? document2.querySelector(thumbs.swiper) : thumbs.swiper;
            if (thumbsElement && thumbsElement.swiper) {
              thumbs.swiper = thumbsElement.swiper;
              init();
              update2(true);
            } else if (thumbsElement) {
              const onThumbsSwiper = (e) => {
                thumbs.swiper = e.detail[0];
                thumbsElement.removeEventListener("init", onThumbsSwiper);
                init();
                update2(true);
                thumbs.swiper.update();
                swiper2.update();
              };
              thumbsElement.addEventListener("init", onThumbsSwiper);
            }
            return thumbsElement;
          };
          const watchForThumbsToAppear = () => {
            if (swiper2.destroyed)
              return;
            const thumbsElement = getThumbsElementAndInit();
            if (!thumbsElement) {
              requestAnimationFrame(watchForThumbsToAppear);
            }
          };
          requestAnimationFrame(watchForThumbsToAppear);
        } else {
          init();
          update2(true);
        }
      });
      on("slideChange update resize observerUpdate", () => {
        update2();
      });
      on("setTransition", (_s, duration) => {
        const thumbsSwiper = swiper2.thumbs.swiper;
        if (!thumbsSwiper || thumbsSwiper.destroyed)
          return;
        thumbsSwiper.setTransition(duration);
      });
      on("beforeDestroy", () => {
        const thumbsSwiper = swiper2.thumbs.swiper;
        if (!thumbsSwiper || thumbsSwiper.destroyed)
          return;
        if (swiperCreated) {
          thumbsSwiper.destroy();
        }
      });
      Object.assign(swiper2.thumbs, {
        init,
        update: update2
      });
    }
    function freeMode(_ref) {
      let {
        swiper: swiper2,
        extendParams,
        emit,
        once
      } = _ref;
      extendParams({
        freeMode: {
          enabled: false,
          momentum: true,
          momentumRatio: 1,
          momentumBounce: true,
          momentumBounceRatio: 1,
          momentumVelocityRatio: 1,
          sticky: false,
          minimumVelocity: 0.02
        }
      });
      function onTouchStart2() {
        const translate2 = swiper2.getTranslate();
        swiper2.setTranslate(translate2);
        swiper2.setTransition(0);
        swiper2.touchEventsData.velocities.length = 0;
        swiper2.freeMode.onTouchEnd({
          currentPos: swiper2.rtl ? swiper2.translate : -swiper2.translate
        });
      }
      function onTouchMove2() {
        const {
          touchEventsData: data,
          touches
        } = swiper2;
        if (data.velocities.length === 0) {
          data.velocities.push({
            position: touches[swiper2.isHorizontal() ? "startX" : "startY"],
            time: data.touchStartTime
          });
        }
        data.velocities.push({
          position: touches[swiper2.isHorizontal() ? "currentX" : "currentY"],
          time: now()
        });
      }
      function onTouchEnd2(_ref2) {
        let {
          currentPos
        } = _ref2;
        const {
          params,
          wrapperEl,
          rtlTranslate: rtl,
          snapGrid,
          touchEventsData: data
        } = swiper2;
        const touchEndTime = now();
        const timeDiff = touchEndTime - data.touchStartTime;
        if (currentPos < -swiper2.minTranslate()) {
          swiper2.slideTo(swiper2.activeIndex);
          return;
        }
        if (currentPos > -swiper2.maxTranslate()) {
          if (swiper2.slides.length < snapGrid.length) {
            swiper2.slideTo(snapGrid.length - 1);
          } else {
            swiper2.slideTo(swiper2.slides.length - 1);
          }
          return;
        }
        if (params.freeMode.momentum) {
          if (data.velocities.length > 1) {
            const lastMoveEvent = data.velocities.pop();
            const velocityEvent = data.velocities.pop();
            const distance = lastMoveEvent.position - velocityEvent.position;
            const time = lastMoveEvent.time - velocityEvent.time;
            swiper2.velocity = distance / time;
            swiper2.velocity /= 2;
            if (Math.abs(swiper2.velocity) < params.freeMode.minimumVelocity) {
              swiper2.velocity = 0;
            }
            if (time > 150 || now() - lastMoveEvent.time > 300) {
              swiper2.velocity = 0;
            }
          } else {
            swiper2.velocity = 0;
          }
          swiper2.velocity *= params.freeMode.momentumVelocityRatio;
          data.velocities.length = 0;
          let momentumDuration = 1e3 * params.freeMode.momentumRatio;
          const momentumDistance = swiper2.velocity * momentumDuration;
          let newPosition = swiper2.translate + momentumDistance;
          if (rtl)
            newPosition = -newPosition;
          let doBounce = false;
          let afterBouncePosition;
          const bounceAmount = Math.abs(swiper2.velocity) * 20 * params.freeMode.momentumBounceRatio;
          let needsLoopFix;
          if (newPosition < swiper2.maxTranslate()) {
            if (params.freeMode.momentumBounce) {
              if (newPosition + swiper2.maxTranslate() < -bounceAmount) {
                newPosition = swiper2.maxTranslate() - bounceAmount;
              }
              afterBouncePosition = swiper2.maxTranslate();
              doBounce = true;
              data.allowMomentumBounce = true;
            } else {
              newPosition = swiper2.maxTranslate();
            }
            if (params.loop && params.centeredSlides)
              needsLoopFix = true;
          } else if (newPosition > swiper2.minTranslate()) {
            if (params.freeMode.momentumBounce) {
              if (newPosition - swiper2.minTranslate() > bounceAmount) {
                newPosition = swiper2.minTranslate() + bounceAmount;
              }
              afterBouncePosition = swiper2.minTranslate();
              doBounce = true;
              data.allowMomentumBounce = true;
            } else {
              newPosition = swiper2.minTranslate();
            }
            if (params.loop && params.centeredSlides)
              needsLoopFix = true;
          } else if (params.freeMode.sticky) {
            let nextSlide;
            for (let j = 0; j < snapGrid.length; j += 1) {
              if (snapGrid[j] > -newPosition) {
                nextSlide = j;
                break;
              }
            }
            if (Math.abs(snapGrid[nextSlide] - newPosition) < Math.abs(snapGrid[nextSlide - 1] - newPosition) || swiper2.swipeDirection === "next") {
              newPosition = snapGrid[nextSlide];
            } else {
              newPosition = snapGrid[nextSlide - 1];
            }
            newPosition = -newPosition;
          }
          if (needsLoopFix) {
            once("transitionEnd", () => {
              swiper2.loopFix();
            });
          }
          if (swiper2.velocity !== 0) {
            if (rtl) {
              momentumDuration = Math.abs((-newPosition - swiper2.translate) / swiper2.velocity);
            } else {
              momentumDuration = Math.abs((newPosition - swiper2.translate) / swiper2.velocity);
            }
            if (params.freeMode.sticky) {
              const moveDistance = Math.abs((rtl ? -newPosition : newPosition) - swiper2.translate);
              const currentSlideSize = swiper2.slidesSizesGrid[swiper2.activeIndex];
              if (moveDistance < currentSlideSize) {
                momentumDuration = params.speed;
              } else if (moveDistance < 2 * currentSlideSize) {
                momentumDuration = params.speed * 1.5;
              } else {
                momentumDuration = params.speed * 2.5;
              }
            }
          } else if (params.freeMode.sticky) {
            swiper2.slideToClosest();
            return;
          }
          if (params.freeMode.momentumBounce && doBounce) {
            swiper2.updateProgress(afterBouncePosition);
            swiper2.setTransition(momentumDuration);
            swiper2.setTranslate(newPosition);
            swiper2.transitionStart(true, swiper2.swipeDirection);
            swiper2.animating = true;
            elementTransitionEnd(wrapperEl, () => {
              if (!swiper2 || swiper2.destroyed || !data.allowMomentumBounce)
                return;
              emit("momentumBounce");
              swiper2.setTransition(params.speed);
              setTimeout(() => {
                swiper2.setTranslate(afterBouncePosition);
                elementTransitionEnd(wrapperEl, () => {
                  if (!swiper2 || swiper2.destroyed)
                    return;
                  swiper2.transitionEnd();
                });
              }, 0);
            });
          } else if (swiper2.velocity) {
            emit("_freeModeNoMomentumRelease");
            swiper2.updateProgress(newPosition);
            swiper2.setTransition(momentumDuration);
            swiper2.setTranslate(newPosition);
            swiper2.transitionStart(true, swiper2.swipeDirection);
            if (!swiper2.animating) {
              swiper2.animating = true;
              elementTransitionEnd(wrapperEl, () => {
                if (!swiper2 || swiper2.destroyed)
                  return;
                swiper2.transitionEnd();
              });
            }
          } else {
            swiper2.updateProgress(newPosition);
          }
          swiper2.updateActiveIndex();
          swiper2.updateSlidesClasses();
        } else if (params.freeMode.sticky) {
          swiper2.slideToClosest();
          return;
        } else if (params.freeMode) {
          emit("_freeModeNoMomentumRelease");
        }
        if (!params.freeMode.momentum || timeDiff >= params.longSwipesMs) {
          swiper2.updateProgress();
          swiper2.updateActiveIndex();
          swiper2.updateSlidesClasses();
        }
      }
      Object.assign(swiper2, {
        freeMode: {
          onTouchStart: onTouchStart2,
          onTouchMove: onTouchMove2,
          onTouchEnd: onTouchEnd2
        }
      });
    }
    function Grid(_ref) {
      let {
        swiper: swiper2,
        extendParams
      } = _ref;
      extendParams({
        grid: {
          rows: 1,
          fill: "column"
        }
      });
      let slidesNumberEvenToRows;
      let slidesPerRow;
      let numFullColumns;
      const getSpaceBetween = () => {
        let spaceBetween = swiper2.params.spaceBetween;
        if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) {
          spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiper2.size;
        } else if (typeof spaceBetween === "string") {
          spaceBetween = parseFloat(spaceBetween);
        }
        return spaceBetween;
      };
      const initSlides = (slidesLength) => {
        const {
          slidesPerView
        } = swiper2.params;
        const {
          rows,
          fill
        } = swiper2.params.grid;
        slidesPerRow = slidesNumberEvenToRows / rows;
        numFullColumns = Math.floor(slidesLength / rows);
        if (Math.floor(slidesLength / rows) === slidesLength / rows) {
          slidesNumberEvenToRows = slidesLength;
        } else {
          slidesNumberEvenToRows = Math.ceil(slidesLength / rows) * rows;
        }
        if (slidesPerView !== "auto" && fill === "row") {
          slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, slidesPerView * rows);
        }
      };
      const updateSlide = (i, slide2, slidesLength, getDirectionLabel) => {
        const {
          slidesPerGroup
        } = swiper2.params;
        const spaceBetween = getSpaceBetween();
        const {
          rows,
          fill
        } = swiper2.params.grid;
        let newSlideOrderIndex;
        let column;
        let row;
        if (fill === "row" && slidesPerGroup > 1) {
          const groupIndex = Math.floor(i / (slidesPerGroup * rows));
          const slideIndexInGroup = i - rows * slidesPerGroup * groupIndex;
          const columnsInGroup = groupIndex === 0 ? slidesPerGroup : Math.min(Math.ceil((slidesLength - groupIndex * rows * slidesPerGroup) / rows), slidesPerGroup);
          row = Math.floor(slideIndexInGroup / columnsInGroup);
          column = slideIndexInGroup - row * columnsInGroup + groupIndex * slidesPerGroup;
          newSlideOrderIndex = column + row * slidesNumberEvenToRows / rows;
          slide2.style.order = newSlideOrderIndex;
        } else if (fill === "column") {
          column = Math.floor(i / rows);
          row = i - column * rows;
          if (column > numFullColumns || column === numFullColumns && row === rows - 1) {
            row += 1;
            if (row >= rows) {
              row = 0;
              column += 1;
            }
          }
        } else {
          row = Math.floor(i / slidesPerRow);
          column = i - row * slidesPerRow;
        }
        slide2.style[getDirectionLabel("margin-top")] = row !== 0 ? spaceBetween && `${spaceBetween}px` : "";
      };
      const updateWrapperSize = (slideSize, snapGrid, getDirectionLabel) => {
        const {
          centeredSlides,
          roundLengths
        } = swiper2.params;
        const spaceBetween = getSpaceBetween();
        const {
          rows
        } = swiper2.params.grid;
        swiper2.virtualSize = (slideSize + spaceBetween) * slidesNumberEvenToRows;
        swiper2.virtualSize = Math.ceil(swiper2.virtualSize / rows) - spaceBetween;
        swiper2.wrapperEl.style[getDirectionLabel("width")] = `${swiper2.virtualSize + spaceBetween}px`;
        if (centeredSlides) {
          const newSlidesGrid = [];
          for (let i = 0; i < snapGrid.length; i += 1) {
            let slidesGridItem = snapGrid[i];
            if (roundLengths)
              slidesGridItem = Math.floor(slidesGridItem);
            if (snapGrid[i] < swiper2.virtualSize + snapGrid[0])
              newSlidesGrid.push(slidesGridItem);
          }
          snapGrid.splice(0, snapGrid.length);
          snapGrid.push(...newSlidesGrid);
        }
      };
      swiper2.grid = {
        initSlides,
        updateSlide,
        updateWrapperSize
      };
    }
    function appendSlide(slides) {
      const swiper2 = this;
      const {
        params,
        slidesEl
      } = swiper2;
      if (params.loop) {
        swiper2.loopDestroy();
      }
      const appendElement = (slideEl) => {
        if (typeof slideEl === "string") {
          const tempDOM = document.createElement("div");
          tempDOM.innerHTML = slideEl;
          slidesEl.append(tempDOM.children[0]);
          tempDOM.innerHTML = "";
        } else {
          slidesEl.append(slideEl);
        }
      };
      if (typeof slides === "object" && "length" in slides) {
        for (let i = 0; i < slides.length; i += 1) {
          if (slides[i])
            appendElement(slides[i]);
        }
      } else {
        appendElement(slides);
      }
      swiper2.recalcSlides();
      if (params.loop) {
        swiper2.loopCreate();
      }
      if (!params.observer || swiper2.isElement) {
        swiper2.update();
      }
    }
    function prependSlide(slides) {
      const swiper2 = this;
      const {
        params,
        activeIndex,
        slidesEl
      } = swiper2;
      if (params.loop) {
        swiper2.loopDestroy();
      }
      let newActiveIndex = activeIndex + 1;
      const prependElement = (slideEl) => {
        if (typeof slideEl === "string") {
          const tempDOM = document.createElement("div");
          tempDOM.innerHTML = slideEl;
          slidesEl.prepend(tempDOM.children[0]);
          tempDOM.innerHTML = "";
        } else {
          slidesEl.prepend(slideEl);
        }
      };
      if (typeof slides === "object" && "length" in slides) {
        for (let i = 0; i < slides.length; i += 1) {
          if (slides[i])
            prependElement(slides[i]);
        }
        newActiveIndex = activeIndex + slides.length;
      } else {
        prependElement(slides);
      }
      swiper2.recalcSlides();
      if (params.loop) {
        swiper2.loopCreate();
      }
      if (!params.observer || swiper2.isElement) {
        swiper2.update();
      }
      swiper2.slideTo(newActiveIndex, 0, false);
    }
    function addSlide(index, slides) {
      const swiper2 = this;
      const {
        params,
        activeIndex,
        slidesEl
      } = swiper2;
      let activeIndexBuffer = activeIndex;
      if (params.loop) {
        activeIndexBuffer -= swiper2.loopedSlides;
        swiper2.loopDestroy();
        swiper2.recalcSlides();
      }
      const baseLength = swiper2.slides.length;
      if (index <= 0) {
        swiper2.prependSlide(slides);
        return;
      }
      if (index >= baseLength) {
        swiper2.appendSlide(slides);
        return;
      }
      let newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + 1 : activeIndexBuffer;
      const slidesBuffer = [];
      for (let i = baseLength - 1; i >= index; i -= 1) {
        const currentSlide = swiper2.slides[i];
        currentSlide.remove();
        slidesBuffer.unshift(currentSlide);
      }
      if (typeof slides === "object" && "length" in slides) {
        for (let i = 0; i < slides.length; i += 1) {
          if (slides[i])
            slidesEl.append(slides[i]);
        }
        newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + slides.length : activeIndexBuffer;
      } else {
        slidesEl.append(slides);
      }
      for (let i = 0; i < slidesBuffer.length; i += 1) {
        slidesEl.append(slidesBuffer[i]);
      }
      swiper2.recalcSlides();
      if (params.loop) {
        swiper2.loopCreate();
      }
      if (!params.observer || swiper2.isElement) {
        swiper2.update();
      }
      if (params.loop) {
        swiper2.slideTo(newActiveIndex + swiper2.loopedSlides, 0, false);
      } else {
        swiper2.slideTo(newActiveIndex, 0, false);
      }
    }
    function removeSlide(slidesIndexes) {
      const swiper2 = this;
      const {
        params,
        activeIndex
      } = swiper2;
      let activeIndexBuffer = activeIndex;
      if (params.loop) {
        activeIndexBuffer -= swiper2.loopedSlides;
        swiper2.loopDestroy();
      }
      let newActiveIndex = activeIndexBuffer;
      let indexToRemove;
      if (typeof slidesIndexes === "object" && "length" in slidesIndexes) {
        for (let i = 0; i < slidesIndexes.length; i += 1) {
          indexToRemove = slidesIndexes[i];
          if (swiper2.slides[indexToRemove])
            swiper2.slides[indexToRemove].remove();
          if (indexToRemove < newActiveIndex)
            newActiveIndex -= 1;
        }
        newActiveIndex = Math.max(newActiveIndex, 0);
      } else {
        indexToRemove = slidesIndexes;
        if (swiper2.slides[indexToRemove])
          swiper2.slides[indexToRemove].remove();
        if (indexToRemove < newActiveIndex)
          newActiveIndex -= 1;
        newActiveIndex = Math.max(newActiveIndex, 0);
      }
      swiper2.recalcSlides();
      if (params.loop) {
        swiper2.loopCreate();
      }
      if (!params.observer || swiper2.isElement) {
        swiper2.update();
      }
      if (params.loop) {
        swiper2.slideTo(newActiveIndex + swiper2.loopedSlides, 0, false);
      } else {
        swiper2.slideTo(newActiveIndex, 0, false);
      }
    }
    function removeAllSlides() {
      const swiper2 = this;
      const slidesIndexes = [];
      for (let i = 0; i < swiper2.slides.length; i += 1) {
        slidesIndexes.push(i);
      }
      swiper2.removeSlide(slidesIndexes);
    }
    function Manipulation(_ref) {
      let {
        swiper: swiper2
      } = _ref;
      Object.assign(swiper2, {
        appendSlide: appendSlide.bind(swiper2),
        prependSlide: prependSlide.bind(swiper2),
        addSlide: addSlide.bind(swiper2),
        removeSlide: removeSlide.bind(swiper2),
        removeAllSlides: removeAllSlides.bind(swiper2)
      });
    }
    function effectInit(params) {
      const {
        effect,
        swiper: swiper2,
        on,
        setTranslate: setTranslate2,
        setTransition: setTransition2,
        overwriteParams,
        perspective,
        recreateShadows,
        getEffectParams
      } = params;
      on("beforeInit", () => {
        if (swiper2.params.effect !== effect)
          return;
        swiper2.classNames.push(`${swiper2.params.containerModifierClass}${effect}`);
        if (perspective && perspective()) {
          swiper2.classNames.push(`${swiper2.params.containerModifierClass}3d`);
        }
        const overwriteParamsResult = overwriteParams ? overwriteParams() : {};
        Object.assign(swiper2.params, overwriteParamsResult);
        Object.assign(swiper2.originalParams, overwriteParamsResult);
      });
      on("setTranslate", () => {
        if (swiper2.params.effect !== effect)
          return;
        setTranslate2();
      });
      on("setTransition", (_s, duration) => {
        if (swiper2.params.effect !== effect)
          return;
        setTransition2(duration);
      });
      on("transitionEnd", () => {
        if (swiper2.params.effect !== effect)
          return;
        if (recreateShadows) {
          if (!getEffectParams || !getEffectParams().slideShadows)
            return;
          swiper2.slides.forEach((slideEl) => {
            slideEl.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach((shadowEl) => shadowEl.remove());
          });
          recreateShadows();
        }
      });
      let requireUpdateOnVirtual;
      on("virtualUpdate", () => {
        if (swiper2.params.effect !== effect)
          return;
        if (!swiper2.slides.length) {
          requireUpdateOnVirtual = true;
        }
        requestAnimationFrame(() => {
          if (requireUpdateOnVirtual && swiper2.slides && swiper2.slides.length) {
            setTranslate2();
            requireUpdateOnVirtual = false;
          }
        });
      });
    }
    function effectTarget(effectParams, slideEl) {
      const transformEl = getSlideTransformEl(slideEl);
      if (transformEl !== slideEl) {
        transformEl.style.backfaceVisibility = "hidden";
        transformEl.style["-webkit-backface-visibility"] = "hidden";
      }
      return transformEl;
    }
    function effectVirtualTransitionEnd(_ref) {
      let {
        swiper: swiper2,
        duration,
        transformElements,
        allSlides
      } = _ref;
      const {
        activeIndex
      } = swiper2;
      const getSlide = (el) => {
        if (!el.parentElement) {
          const slide2 = swiper2.slides.filter((slideEl) => slideEl.shadowEl && slideEl.shadowEl === el.parentNode)[0];
          return slide2;
        }
        return el.parentElement;
      };
      if (swiper2.params.virtualTranslate && duration !== 0) {
        let eventTriggered = false;
        let transitionEndTarget;
        if (allSlides) {
          transitionEndTarget = transformElements;
        } else {
          transitionEndTarget = transformElements.filter((transformEl) => {
            const el = transformEl.classList.contains("swiper-slide-transform") ? getSlide(transformEl) : transformEl;
            return swiper2.getSlideIndex(el) === activeIndex;
          });
        }
        transitionEndTarget.forEach((el) => {
          elementTransitionEnd(el, () => {
            if (eventTriggered)
              return;
            if (!swiper2 || swiper2.destroyed)
              return;
            eventTriggered = true;
            swiper2.animating = false;
            const evt = new window.CustomEvent("transitionend", {
              bubbles: true,
              cancelable: true
            });
            swiper2.wrapperEl.dispatchEvent(evt);
          });
        });
      }
    }
    function EffectFade(_ref) {
      let {
        swiper: swiper2,
        extendParams,
        on
      } = _ref;
      extendParams({
        fadeEffect: {
          crossFade: false
        }
      });
      const setTranslate2 = () => {
        const {
          slides
        } = swiper2;
        const params = swiper2.params.fadeEffect;
        for (let i = 0; i < slides.length; i += 1) {
          const slideEl = swiper2.slides[i];
          const offset = slideEl.swiperSlideOffset;
          let tx = -offset;
          if (!swiper2.params.virtualTranslate)
            tx -= swiper2.translate;
          let ty = 0;
          if (!swiper2.isHorizontal()) {
            ty = tx;
            tx = 0;
          }
          const slideOpacity = swiper2.params.fadeEffect.crossFade ? Math.max(1 - Math.abs(slideEl.progress), 0) : 1 + Math.min(Math.max(slideEl.progress, -1), 0);
          const targetEl = effectTarget(params, slideEl);
          targetEl.style.opacity = slideOpacity;
          targetEl.style.transform = `translate3d(${tx}px, ${ty}px, 0px)`;
        }
      };
      const setTransition2 = (duration) => {
        const transformElements = swiper2.slides.map((slideEl) => getSlideTransformEl(slideEl));
        transformElements.forEach((el) => {
          el.style.transitionDuration = `${duration}ms`;
        });
        effectVirtualTransitionEnd({
          swiper: swiper2,
          duration,
          transformElements,
          allSlides: true
        });
      };
      effectInit({
        effect: "fade",
        swiper: swiper2,
        on,
        setTranslate: setTranslate2,
        setTransition: setTransition2,
        overwriteParams: () => ({
          slidesPerView: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          spaceBetween: 0,
          virtualTranslate: !swiper2.params.cssMode
        })
      });
    }
    function EffectCube(_ref) {
      let {
        swiper: swiper2,
        extendParams,
        on
      } = _ref;
      extendParams({
        cubeEffect: {
          slideShadows: true,
          shadow: true,
          shadowOffset: 20,
          shadowScale: 0.94
        }
      });
      const createSlideShadows = (slideEl, progress, isHorizontal) => {
        let shadowBefore = isHorizontal ? slideEl.querySelector(".swiper-slide-shadow-left") : slideEl.querySelector(".swiper-slide-shadow-top");
        let shadowAfter = isHorizontal ? slideEl.querySelector(".swiper-slide-shadow-right") : slideEl.querySelector(".swiper-slide-shadow-bottom");
        if (!shadowBefore) {
          shadowBefore = createElement("div", `swiper-slide-shadow-${isHorizontal ? "left" : "top"}`);
          slideEl.append(shadowBefore);
        }
        if (!shadowAfter) {
          shadowAfter = createElement("div", `swiper-slide-shadow-${isHorizontal ? "right" : "bottom"}`);
          slideEl.append(shadowAfter);
        }
        if (shadowBefore)
          shadowBefore.style.opacity = Math.max(-progress, 0);
        if (shadowAfter)
          shadowAfter.style.opacity = Math.max(progress, 0);
      };
      const recreateShadows = () => {
        const isHorizontal = swiper2.isHorizontal();
        swiper2.slides.forEach((slideEl) => {
          const progress = Math.max(Math.min(slideEl.progress, 1), -1);
          createSlideShadows(slideEl, progress, isHorizontal);
        });
      };
      const setTranslate2 = () => {
        const {
          el,
          wrapperEl,
          slides,
          width: swiperWidth,
          height: swiperHeight,
          rtlTranslate: rtl,
          size: swiperSize,
          browser: browser2
        } = swiper2;
        const params = swiper2.params.cubeEffect;
        const isHorizontal = swiper2.isHorizontal();
        const isVirtual = swiper2.virtual && swiper2.params.virtual.enabled;
        let wrapperRotate = 0;
        let cubeShadowEl;
        if (params.shadow) {
          if (isHorizontal) {
            cubeShadowEl = swiper2.slidesEl.querySelector(".swiper-cube-shadow");
            if (!cubeShadowEl) {
              cubeShadowEl = createElement("div", "swiper-cube-shadow");
              swiper2.slidesEl.append(cubeShadowEl);
            }
            cubeShadowEl.style.height = `${swiperWidth}px`;
          } else {
            cubeShadowEl = el.querySelector(".swiper-cube-shadow");
            if (!cubeShadowEl) {
              cubeShadowEl = createElement("div", "swiper-cube-shadow");
              el.append(cubeShadowEl);
            }
          }
        }
        for (let i = 0; i < slides.length; i += 1) {
          const slideEl = slides[i];
          let slideIndex = i;
          if (isVirtual) {
            slideIndex = parseInt(slideEl.getAttribute("data-swiper-slide-index"), 10);
          }
          let slideAngle = slideIndex * 90;
          let round = Math.floor(slideAngle / 360);
          if (rtl) {
            slideAngle = -slideAngle;
            round = Math.floor(-slideAngle / 360);
          }
          const progress = Math.max(Math.min(slideEl.progress, 1), -1);
          let tx = 0;
          let ty = 0;
          let tz = 0;
          if (slideIndex % 4 === 0) {
            tx = -round * 4 * swiperSize;
            tz = 0;
          } else if ((slideIndex - 1) % 4 === 0) {
            tx = 0;
            tz = -round * 4 * swiperSize;
          } else if ((slideIndex - 2) % 4 === 0) {
            tx = swiperSize + round * 4 * swiperSize;
            tz = swiperSize;
          } else if ((slideIndex - 3) % 4 === 0) {
            tx = -swiperSize;
            tz = 3 * swiperSize + swiperSize * 4 * round;
          }
          if (rtl) {
            tx = -tx;
          }
          if (!isHorizontal) {
            ty = tx;
            tx = 0;
          }
          const transform = `rotateX(${isHorizontal ? 0 : -slideAngle}deg) rotateY(${isHorizontal ? slideAngle : 0}deg) translate3d(${tx}px, ${ty}px, ${tz}px)`;
          if (progress <= 1 && progress > -1) {
            wrapperRotate = slideIndex * 90 + progress * 90;
            if (rtl)
              wrapperRotate = -slideIndex * 90 - progress * 90;
          }
          slideEl.style.transform = transform;
          if (params.slideShadows) {
            createSlideShadows(slideEl, progress, isHorizontal);
          }
        }
        wrapperEl.style.transformOrigin = `50% 50% -${swiperSize / 2}px`;
        wrapperEl.style["-webkit-transform-origin"] = `50% 50% -${swiperSize / 2}px`;
        if (params.shadow) {
          if (isHorizontal) {
            cubeShadowEl.style.transform = `translate3d(0px, ${swiperWidth / 2 + params.shadowOffset}px, ${-swiperWidth / 2}px) rotateX(90deg) rotateZ(0deg) scale(${params.shadowScale})`;
          } else {
            const shadowAngle = Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;
            const multiplier = 1.5 - (Math.sin(shadowAngle * 2 * Math.PI / 360) / 2 + Math.cos(shadowAngle * 2 * Math.PI / 360) / 2);
            const scale1 = params.shadowScale;
            const scale2 = params.shadowScale / multiplier;
            const offset = params.shadowOffset;
            cubeShadowEl.style.transform = `scale3d(${scale1}, 1, ${scale2}) translate3d(0px, ${swiperHeight / 2 + offset}px, ${-swiperHeight / 2 / scale2}px) rotateX(-90deg)`;
          }
        }
        const zFactor = (browser2.isSafari || browser2.isWebView) && browser2.needPerspectiveFix ? -swiperSize / 2 : 0;
        wrapperEl.style.transform = `translate3d(0px,0,${zFactor}px) rotateX(${swiper2.isHorizontal() ? 0 : wrapperRotate}deg) rotateY(${swiper2.isHorizontal() ? -wrapperRotate : 0}deg)`;
        wrapperEl.style.setProperty("--swiper-cube-translate-z", `${zFactor}px`);
      };
      const setTransition2 = (duration) => {
        const {
          el,
          slides
        } = swiper2;
        slides.forEach((slideEl) => {
          slideEl.style.transitionDuration = `${duration}ms`;
          slideEl.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach((subEl) => {
            subEl.style.transitionDuration = `${duration}ms`;
          });
        });
        if (swiper2.params.cubeEffect.shadow && !swiper2.isHorizontal()) {
          const shadowEl = el.querySelector(".swiper-cube-shadow");
          if (shadowEl)
            shadowEl.style.transitionDuration = `${duration}ms`;
        }
      };
      effectInit({
        effect: "cube",
        swiper: swiper2,
        on,
        setTranslate: setTranslate2,
        setTransition: setTransition2,
        recreateShadows,
        getEffectParams: () => swiper2.params.cubeEffect,
        perspective: () => true,
        overwriteParams: () => ({
          slidesPerView: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          resistanceRatio: 0,
          spaceBetween: 0,
          centeredSlides: false,
          virtualTranslate: true
        })
      });
    }
    function createShadow(params, slideEl, side) {
      const shadowClass = `swiper-slide-shadow${side ? `-${side}` : ""}`;
      const shadowContainer = getSlideTransformEl(slideEl);
      let shadowEl = shadowContainer.querySelector(`.${shadowClass}`);
      if (!shadowEl) {
        shadowEl = createElement("div", `swiper-slide-shadow${side ? `-${side}` : ""}`);
        shadowContainer.append(shadowEl);
      }
      return shadowEl;
    }
    function EffectFlip(_ref) {
      let {
        swiper: swiper2,
        extendParams,
        on
      } = _ref;
      extendParams({
        flipEffect: {
          slideShadows: true,
          limitRotation: true
        }
      });
      const createSlideShadows = (slideEl, progress, params) => {
        let shadowBefore = swiper2.isHorizontal() ? slideEl.querySelector(".swiper-slide-shadow-left") : slideEl.querySelector(".swiper-slide-shadow-top");
        let shadowAfter = swiper2.isHorizontal() ? slideEl.querySelector(".swiper-slide-shadow-right") : slideEl.querySelector(".swiper-slide-shadow-bottom");
        if (!shadowBefore) {
          shadowBefore = createShadow(params, slideEl, swiper2.isHorizontal() ? "left" : "top");
        }
        if (!shadowAfter) {
          shadowAfter = createShadow(params, slideEl, swiper2.isHorizontal() ? "right" : "bottom");
        }
        if (shadowBefore)
          shadowBefore.style.opacity = Math.max(-progress, 0);
        if (shadowAfter)
          shadowAfter.style.opacity = Math.max(progress, 0);
      };
      const recreateShadows = () => {
        const params = swiper2.params.flipEffect;
        swiper2.slides.forEach((slideEl) => {
          let progress = slideEl.progress;
          if (swiper2.params.flipEffect.limitRotation) {
            progress = Math.max(Math.min(slideEl.progress, 1), -1);
          }
          createSlideShadows(slideEl, progress, params);
        });
      };
      const setTranslate2 = () => {
        const {
          slides,
          rtlTranslate: rtl
        } = swiper2;
        const params = swiper2.params.flipEffect;
        for (let i = 0; i < slides.length; i += 1) {
          const slideEl = slides[i];
          let progress = slideEl.progress;
          if (swiper2.params.flipEffect.limitRotation) {
            progress = Math.max(Math.min(slideEl.progress, 1), -1);
          }
          const offset = slideEl.swiperSlideOffset;
          const rotate = -180 * progress;
          let rotateY = rotate;
          let rotateX = 0;
          let tx = swiper2.params.cssMode ? -offset - swiper2.translate : -offset;
          let ty = 0;
          if (!swiper2.isHorizontal()) {
            ty = tx;
            tx = 0;
            rotateX = -rotateY;
            rotateY = 0;
          } else if (rtl) {
            rotateY = -rotateY;
          }
          slideEl.style.zIndex = -Math.abs(Math.round(progress)) + slides.length;
          if (params.slideShadows) {
            createSlideShadows(slideEl, progress, params);
          }
          const transform = `translate3d(${tx}px, ${ty}px, 0px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
          const targetEl = effectTarget(params, slideEl);
          targetEl.style.transform = transform;
        }
      };
      const setTransition2 = (duration) => {
        const transformElements = swiper2.slides.map((slideEl) => getSlideTransformEl(slideEl));
        transformElements.forEach((el) => {
          el.style.transitionDuration = `${duration}ms`;
          el.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach((shadowEl) => {
            shadowEl.style.transitionDuration = `${duration}ms`;
          });
        });
        effectVirtualTransitionEnd({
          swiper: swiper2,
          duration,
          transformElements
        });
      };
      effectInit({
        effect: "flip",
        swiper: swiper2,
        on,
        setTranslate: setTranslate2,
        setTransition: setTransition2,
        recreateShadows,
        getEffectParams: () => swiper2.params.flipEffect,
        perspective: () => true,
        overwriteParams: () => ({
          slidesPerView: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          spaceBetween: 0,
          virtualTranslate: !swiper2.params.cssMode
        })
      });
    }
    function EffectCoverflow(_ref) {
      let {
        swiper: swiper2,
        extendParams,
        on
      } = _ref;
      extendParams({
        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          scale: 1,
          modifier: 1,
          slideShadows: true
        }
      });
      const setTranslate2 = () => {
        const {
          width: swiperWidth,
          height: swiperHeight,
          slides,
          slidesSizesGrid
        } = swiper2;
        const params = swiper2.params.coverflowEffect;
        const isHorizontal = swiper2.isHorizontal();
        const transform = swiper2.translate;
        const center = isHorizontal ? -transform + swiperWidth / 2 : -transform + swiperHeight / 2;
        const rotate = isHorizontal ? params.rotate : -params.rotate;
        const translate2 = params.depth;
        for (let i = 0, length = slides.length; i < length; i += 1) {
          const slideEl = slides[i];
          const slideSize = slidesSizesGrid[i];
          const slideOffset = slideEl.swiperSlideOffset;
          const centerOffset = (center - slideOffset - slideSize / 2) / slideSize;
          const offsetMultiplier = typeof params.modifier === "function" ? params.modifier(centerOffset) : centerOffset * params.modifier;
          let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
          let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier;
          let translateZ = -translate2 * Math.abs(offsetMultiplier);
          let stretch = params.stretch;
          if (typeof stretch === "string" && stretch.indexOf("%") !== -1) {
            stretch = parseFloat(params.stretch) / 100 * slideSize;
          }
          let translateY = isHorizontal ? 0 : stretch * offsetMultiplier;
          let translateX = isHorizontal ? stretch * offsetMultiplier : 0;
          let scale = 1 - (1 - params.scale) * Math.abs(offsetMultiplier);
          if (Math.abs(translateX) < 1e-3)
            translateX = 0;
          if (Math.abs(translateY) < 1e-3)
            translateY = 0;
          if (Math.abs(translateZ) < 1e-3)
            translateZ = 0;
          if (Math.abs(rotateY) < 1e-3)
            rotateY = 0;
          if (Math.abs(rotateX) < 1e-3)
            rotateX = 0;
          if (Math.abs(scale) < 1e-3)
            scale = 0;
          const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
          const targetEl = effectTarget(params, slideEl);
          targetEl.style.transform = slideTransform;
          slideEl.style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
          if (params.slideShadows) {
            let shadowBeforeEl = isHorizontal ? slideEl.querySelector(".swiper-slide-shadow-left") : slideEl.querySelector(".swiper-slide-shadow-top");
            let shadowAfterEl = isHorizontal ? slideEl.querySelector(".swiper-slide-shadow-right") : slideEl.querySelector(".swiper-slide-shadow-bottom");
            if (!shadowBeforeEl) {
              shadowBeforeEl = createShadow(params, slideEl, isHorizontal ? "left" : "top");
            }
            if (!shadowAfterEl) {
              shadowAfterEl = createShadow(params, slideEl, isHorizontal ? "right" : "bottom");
            }
            if (shadowBeforeEl)
              shadowBeforeEl.style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
            if (shadowAfterEl)
              shadowAfterEl.style.opacity = -offsetMultiplier > 0 ? -offsetMultiplier : 0;
          }
        }
      };
      const setTransition2 = (duration) => {
        const transformElements = swiper2.slides.map((slideEl) => getSlideTransformEl(slideEl));
        transformElements.forEach((el) => {
          el.style.transitionDuration = `${duration}ms`;
          el.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach((shadowEl) => {
            shadowEl.style.transitionDuration = `${duration}ms`;
          });
        });
      };
      effectInit({
        effect: "coverflow",
        swiper: swiper2,
        on,
        setTranslate: setTranslate2,
        setTransition: setTransition2,
        perspective: () => true,
        overwriteParams: () => ({
          watchSlidesProgress: true
        })
      });
    }
    function EffectCreative(_ref) {
      let {
        swiper: swiper2,
        extendParams,
        on
      } = _ref;
      extendParams({
        creativeEffect: {
          limitProgress: 1,
          shadowPerProgress: false,
          progressMultiplier: 1,
          perspective: true,
          prev: {
            translate: [0, 0, 0],
            rotate: [0, 0, 0],
            opacity: 1,
            scale: 1
          },
          next: {
            translate: [0, 0, 0],
            rotate: [0, 0, 0],
            opacity: 1,
            scale: 1
          }
        }
      });
      const getTranslateValue = (value) => {
        if (typeof value === "string")
          return value;
        return `${value}px`;
      };
      const setTranslate2 = () => {
        const {
          slides,
          wrapperEl,
          slidesSizesGrid
        } = swiper2;
        const params = swiper2.params.creativeEffect;
        const {
          progressMultiplier: multiplier
        } = params;
        const isCenteredSlides = swiper2.params.centeredSlides;
        if (isCenteredSlides) {
          const margin = slidesSizesGrid[0] / 2 - swiper2.params.slidesOffsetBefore || 0;
          wrapperEl.style.transform = `translateX(calc(50% - ${margin}px))`;
        }
        for (let i = 0; i < slides.length; i += 1) {
          const slideEl = slides[i];
          const slideProgress = slideEl.progress;
          const progress = Math.min(Math.max(slideEl.progress, -params.limitProgress), params.limitProgress);
          let originalProgress = progress;
          if (!isCenteredSlides) {
            originalProgress = Math.min(Math.max(slideEl.originalProgress, -params.limitProgress), params.limitProgress);
          }
          const offset = slideEl.swiperSlideOffset;
          const t = [swiper2.params.cssMode ? -offset - swiper2.translate : -offset, 0, 0];
          const r = [0, 0, 0];
          let custom = false;
          if (!swiper2.isHorizontal()) {
            t[1] = t[0];
            t[0] = 0;
          }
          let data = {
            translate: [0, 0, 0],
            rotate: [0, 0, 0],
            scale: 1,
            opacity: 1
          };
          if (progress < 0) {
            data = params.next;
            custom = true;
          } else if (progress > 0) {
            data = params.prev;
            custom = true;
          }
          t.forEach((value, index) => {
            t[index] = `calc(${value}px + (${getTranslateValue(data.translate[index])} * ${Math.abs(progress * multiplier)}))`;
          });
          r.forEach((value, index) => {
            r[index] = data.rotate[index] * Math.abs(progress * multiplier);
          });
          slideEl.style.zIndex = -Math.abs(Math.round(slideProgress)) + slides.length;
          const translateString = t.join(", ");
          const rotateString = `rotateX(${r[0]}deg) rotateY(${r[1]}deg) rotateZ(${r[2]}deg)`;
          const scaleString = originalProgress < 0 ? `scale(${1 + (1 - data.scale) * originalProgress * multiplier})` : `scale(${1 - (1 - data.scale) * originalProgress * multiplier})`;
          const opacityString = originalProgress < 0 ? 1 + (1 - data.opacity) * originalProgress * multiplier : 1 - (1 - data.opacity) * originalProgress * multiplier;
          const transform = `translate3d(${translateString}) ${rotateString} ${scaleString}`;
          if (custom && data.shadow || !custom) {
            let shadowEl = slideEl.querySelector(".swiper-slide-shadow");
            if (!shadowEl && data.shadow) {
              shadowEl = createShadow(params, slideEl);
            }
            if (shadowEl) {
              const shadowOpacity = params.shadowPerProgress ? progress * (1 / params.limitProgress) : progress;
              shadowEl.style.opacity = Math.min(Math.max(Math.abs(shadowOpacity), 0), 1);
            }
          }
          const targetEl = effectTarget(params, slideEl);
          targetEl.style.transform = transform;
          targetEl.style.opacity = opacityString;
          if (data.origin) {
            targetEl.style.transformOrigin = data.origin;
          }
        }
      };
      const setTransition2 = (duration) => {
        const transformElements = swiper2.slides.map((slideEl) => getSlideTransformEl(slideEl));
        transformElements.forEach((el) => {
          el.style.transitionDuration = `${duration}ms`;
          el.querySelectorAll(".swiper-slide-shadow").forEach((shadowEl) => {
            shadowEl.style.transitionDuration = `${duration}ms`;
          });
        });
        effectVirtualTransitionEnd({
          swiper: swiper2,
          duration,
          transformElements,
          allSlides: true
        });
      };
      effectInit({
        effect: "creative",
        swiper: swiper2,
        on,
        setTranslate: setTranslate2,
        setTransition: setTransition2,
        perspective: () => swiper2.params.creativeEffect.perspective,
        overwriteParams: () => ({
          watchSlidesProgress: true,
          virtualTranslate: !swiper2.params.cssMode
        })
      });
    }
    function EffectCards(_ref) {
      let {
        swiper: swiper2,
        extendParams,
        on
      } = _ref;
      extendParams({
        cardsEffect: {
          slideShadows: true,
          rotate: true,
          perSlideRotate: 2,
          perSlideOffset: 8
        }
      });
      const setTranslate2 = () => {
        const {
          slides,
          activeIndex
        } = swiper2;
        const params = swiper2.params.cardsEffect;
        const {
          startTranslate,
          isTouched
        } = swiper2.touchEventsData;
        const currentTranslate = swiper2.translate;
        for (let i = 0; i < slides.length; i += 1) {
          const slideEl = slides[i];
          const slideProgress = slideEl.progress;
          const progress = Math.min(Math.max(slideProgress, -4), 4);
          let offset = slideEl.swiperSlideOffset;
          if (swiper2.params.centeredSlides && !swiper2.params.cssMode) {
            swiper2.wrapperEl.style.transform = `translateX(${swiper2.minTranslate()}px)`;
          }
          if (swiper2.params.centeredSlides && swiper2.params.cssMode) {
            offset -= slides[0].swiperSlideOffset;
          }
          let tX = swiper2.params.cssMode ? -offset - swiper2.translate : -offset;
          let tY = 0;
          const tZ = -100 * Math.abs(progress);
          let scale = 1;
          let rotate = -params.perSlideRotate * progress;
          let tXAdd = params.perSlideOffset - Math.abs(progress) * 0.75;
          const slideIndex = swiper2.virtual && swiper2.params.virtual.enabled ? swiper2.virtual.from + i : i;
          const isSwipeToNext = (slideIndex === activeIndex || slideIndex === activeIndex - 1) && progress > 0 && progress < 1 && (isTouched || swiper2.params.cssMode) && currentTranslate < startTranslate;
          const isSwipeToPrev = (slideIndex === activeIndex || slideIndex === activeIndex + 1) && progress < 0 && progress > -1 && (isTouched || swiper2.params.cssMode) && currentTranslate > startTranslate;
          if (isSwipeToNext || isSwipeToPrev) {
            const subProgress = (1 - Math.abs((Math.abs(progress) - 0.5) / 0.5)) ** 0.5;
            rotate += -28 * progress * subProgress;
            scale += -0.5 * subProgress;
            tXAdd += 96 * subProgress;
            tY = `${-25 * subProgress * Math.abs(progress)}%`;
          }
          if (progress < 0) {
            tX = `calc(${tX}px + (${tXAdd * Math.abs(progress)}%))`;
          } else if (progress > 0) {
            tX = `calc(${tX}px + (-${tXAdd * Math.abs(progress)}%))`;
          } else {
            tX = `${tX}px`;
          }
          if (!swiper2.isHorizontal()) {
            const prevY = tY;
            tY = tX;
            tX = prevY;
          }
          const scaleString = progress < 0 ? `${1 + (1 - scale) * progress}` : `${1 - (1 - scale) * progress}`;
          const transform = `
        translate3d(${tX}, ${tY}, ${tZ}px)
        rotateZ(${params.rotate ? rotate : 0}deg)
        scale(${scaleString})
      `;
          if (params.slideShadows) {
            let shadowEl = slideEl.querySelector(".swiper-slide-shadow");
            if (!shadowEl) {
              shadowEl = createShadow(params, slideEl);
            }
            if (shadowEl)
              shadowEl.style.opacity = Math.min(Math.max((Math.abs(progress) - 0.5) / 0.5, 0), 1);
          }
          slideEl.style.zIndex = -Math.abs(Math.round(slideProgress)) + slides.length;
          const targetEl = effectTarget(params, slideEl);
          targetEl.style.transform = transform;
        }
      };
      const setTransition2 = (duration) => {
        const transformElements = swiper2.slides.map((slideEl) => getSlideTransformEl(slideEl));
        transformElements.forEach((el) => {
          el.style.transitionDuration = `${duration}ms`;
          el.querySelectorAll(".swiper-slide-shadow").forEach((shadowEl) => {
            shadowEl.style.transitionDuration = `${duration}ms`;
          });
        });
        effectVirtualTransitionEnd({
          swiper: swiper2,
          duration,
          transformElements
        });
      };
      effectInit({
        effect: "cards",
        swiper: swiper2,
        on,
        setTranslate: setTranslate2,
        setTransition: setTransition2,
        perspective: () => true,
        overwriteParams: () => ({
          watchSlidesProgress: true,
          virtualTranslate: !swiper2.params.cssMode
        })
      });
    }
    const modules = [Virtual, Keyboard, Mousewheel, Navigation, Pagination, Scrollbar, Parallax, Zoom, Controller, A11y, History, HashNavigation, Autoplay, Thumb, freeMode, Grid, Manipulation, EffectFade, EffectCube, EffectFlip, EffectCoverflow, EffectCreative, EffectCards];
    Swiper2.use(modules);
    return Swiper2;
  });
}

// src/js/watcher.js
var ScrollWatcher = class {
  constructor(props) {
    let defaultConfig = {
      logging: true
    };
    this.config = Object.assign(defaultConfig, props);
    this.observer;
    !document.documentElement.classList.contains("watcher") ? this.scrollWatcherRun() : null;
  }
  // Оновлюємо конструктор
  scrollWatcherUpdate() {
    this.scrollWatcherRun();
  }
  // Запускаємо конструктор
  scrollWatcherRun() {
    document.documentElement.classList.add("watcher");
    this.scrollWatcherConstructor(document.querySelectorAll("[data-watch]"));
  }
  // Конструктор спостерігачів
  scrollWatcherConstructor(items) {
    if (items.length) {
      this.scrollWatcherLogging(`Прокинувся, стежу за об'єктами (${items.length})...`);
      let uniqParams = uniqArray(Array.from(items).map(function(item) {
        return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : "0px"}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
      }));
      uniqParams.forEach((uniqParam) => {
        let uniqParamArray = uniqParam.split("|");
        let paramsWatch = {
          root: uniqParamArray[0],
          margin: uniqParamArray[1],
          threshold: uniqParamArray[2]
        };
        let groupItems = Array.from(items).filter(function(item) {
          let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
          let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : "0px";
          let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
          if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) {
            return item;
          }
        });
        let configWatcher = this.getScrollWatcherConfig(paramsWatch);
        this.scrollWatcherInit(groupItems, configWatcher);
      });
    } else {
      this.scrollWatcherLogging("Сплю, немає об'єктів для стеження. ZzzZZzz");
    }
  }
  // Функція створення налаштувань
  getScrollWatcherConfig(paramsWatch) {
    let configWatcher = {};
    if (document.querySelector(paramsWatch.root)) {
      configWatcher.root = document.querySelector(paramsWatch.root);
    } else if (paramsWatch.root !== "null") {
      this.scrollWatcherLogging(`Эмм... батьківського об'єкта ${paramsWatch.root} немає на сторінці`);
    }
    configWatcher.rootMargin = paramsWatch.margin;
    if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) {
      this.scrollWatcherLogging(`йой, налаштування data-watch-margin потрібно задавати в PX або %`);
      return;
    }
    if (paramsWatch.threshold === "prx") {
      paramsWatch.threshold = [];
      for (let i = 0; i <= 1; i += 5e-3) {
        paramsWatch.threshold.push(i);
      }
    } else {
      paramsWatch.threshold = paramsWatch.threshold.split(",");
    }
    configWatcher.threshold = paramsWatch.threshold;
    return configWatcher;
  }
  // Функція створення нового спостерігача зі своїми налаштуваннями
  scrollWatcherCreate(configWatcher) {
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        this.scrollWatcherCallback(entry, observer);
      });
    }, configWatcher);
  }
  // Функція ініціалізації спостерігача зі своїми налаштуваннями
  scrollWatcherInit(items, configWatcher) {
    this.scrollWatcherCreate(configWatcher);
    items.forEach((item) => this.observer.observe(item));
  }
  // Функція обробки базових дій точок спрацьовування
  scrollWatcherIntersecting(entry, targetElement) {
    if (entry.isIntersecting) {
      !targetElement.classList.contains("_watcher-view") ? targetElement.classList.add("_watcher-view") : null;
      this.scrollWatcherLogging(`Я бачу ${targetElement.classList}, додав клас _watcher-view`);
    } else {
      targetElement.classList.contains("_watcher-view") ? targetElement.classList.remove("_watcher-view") : null;
      this.scrollWatcherLogging(`Я не бачу ${targetElement.classList}, прибрав клас _watcher-view`);
    }
  }
  // Функція відключення стеження за об'єктом
  scrollWatcherOff(targetElement, observer) {
    observer.unobserve(targetElement);
    this.scrollWatcherLogging(`Я перестав стежити за ${targetElement.classList}`);
  }
  // Функція виведення в консоль
  scrollWatcherLogging(message) {
    this.config.logging ? FLS(`[Спостерігач]: ${message}`) : null;
  }
  // Функція обробки спостереження
  scrollWatcherCallback(entry, observer) {
    const targetElement = entry.target;
    this.scrollWatcherIntersecting(entry, targetElement);
    targetElement.hasAttribute("data-watch-once") && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
    document.dispatchEvent(new CustomEvent("watcherCallback", {
      detail: {
        entry
      }
    }));
  }
};

// src/js/functions-my.js
function burgerMenu() {
  const burger = document.querySelector(".burger");
  const bodyshadow = document.querySelector(".body__shadow");
  const menu = document.querySelector(".menu-wrap");
  const body = document.querySelector("body");
  burger.addEventListener("click", () => {
    if (!menu.classList.contains("active")) {
      menu.classList.add("active");
      bodyshadow.classList.add("active");
      burger.classList.add("active");
      body.classList.add("locked");
    } else {
      menu.classList.remove("active");
      burger.classList.remove("active");
      body.classList.remove("locked");
    }
  });
  bodyshadow.addEventListener("click", () => {
    if (bodyshadow.classList.contains("active")) {
      menu.classList.remove("active");
      bodyshadow.classList.remove("active");
      burger.classList.remove("active");
      body.classList.remove("locked");
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 991.98) {
      menu.classList.remove("active");
      burger.classList.remove("active");
      body.classList.remove("locked");
    }
  });
}
function placeholderСhange() {
  let input = document.querySelector("input");
  let placeholderMin = "email address";
  if (window.innerWidth < 450) {
    input.placeholder = placeholderMin;
  }
}

// workfolder/main.js
isWebp();
spollers();
swpr();
var swiper = new Swiper(".swiper", {
  // Optional parameters
  loop: false,
  autoHeight: true,
  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  },
  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  }
});
flsModules.watcher = new ScrollWatcher({});
burgerMenu();
placeholderСhange();
