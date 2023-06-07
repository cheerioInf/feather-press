var p = { exports: {} },
  w = {},
  y = { exports: {} },
  i = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var h = Symbol.for('react.element'),
  U = Symbol.for('react.portal'),
  q = Symbol.for('react.fragment'),
  V = Symbol.for('react.strict_mode'),
  F = Symbol.for('react.profiler'),
  M = Symbol.for('react.provider'),
  z = Symbol.for('react.context'),
  Y = Symbol.for('react.forward_ref'),
  G = Symbol.for('react.suspense'),
  J = Symbol.for('react.memo'),
  W = Symbol.for('react.lazy'),
  j = Symbol.iterator;
function K(e) {
  return e === null || typeof e != 'object'
    ? null
    : ((e = (j && e[j]) || e['@@iterator']), typeof e == 'function' ? e : null);
}
var O = {
    isMounted: function () {
      return !1;
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {}
  },
  T = Object.assign,
  A = {};
function m(e, t, o) {
  (this.props = e),
    (this.context = t),
    (this.refs = A),
    (this.updater = o || O);
}
m.prototype.isReactComponent = {};
m.prototype.setState = function (e, t) {
  if (typeof e != 'object' && typeof e != 'function' && e != null)
    throw Error(
      'setState(...): takes an object of state variables to update or a function which returns an object of state variables.'
    );
  this.updater.enqueueSetState(this, e, t, 'setState');
};
m.prototype.forceUpdate = function (e) {
  this.updater.enqueueForceUpdate(this, e, 'forceUpdate');
};
function P() {}
P.prototype = m.prototype;
function k(e, t, o) {
  (this.props = e),
    (this.context = t),
    (this.refs = A),
    (this.updater = o || O);
}
var b = (k.prototype = new P());
b.constructor = k;
T(b, m.prototype);
b.isPureReactComponent = !0;
var C = Array.isArray,
  N = Object.prototype.hasOwnProperty,
  R = { current: null },
  L = { key: !0, ref: !0, __self: !0, __source: !0 };
function H(e, t, o) {
  var r,
    u = {},
    s = null,
    n = null;
  if (t != null)
    for (r in (t.ref !== void 0 && (n = t.ref),
    t.key !== void 0 && (s = '' + t.key),
    t))
      N.call(t, r) && !L.hasOwnProperty(r) && (u[r] = t[r]);
  var c = arguments.length - 2;
  if (c === 1) u.children = o;
  else if (1 < c) {
    for (var l = Array(c), f = 0; f < c; f++) l[f] = arguments[f + 2];
    u.children = l;
  }
  if (e && e.defaultProps)
    for (r in ((c = e.defaultProps), c)) u[r] === void 0 && (u[r] = c[r]);
  return { $$typeof: h, type: e, key: s, ref: n, props: u, _owner: R.current };
}
function Q(e, t) {
  return {
    $$typeof: h,
    type: e.type,
    key: t,
    ref: e.ref,
    props: e.props,
    _owner: e._owner
  };
}
function $(e) {
  return typeof e == 'object' && e !== null && e.$$typeof === h;
}
function X(e) {
  var t = { '=': '=0', ':': '=2' };
  return (
    '$' +
    e.replace(/[=:]/g, function (o) {
      return t[o];
    })
  );
}
var I = /\/+/g;
function E(e, t) {
  return typeof e == 'object' && e !== null && e.key != null
    ? X('' + e.key)
    : t.toString(36);
}
function x(e, t, o, r, u) {
  var s = typeof e;
  (s === 'undefined' || s === 'boolean') && (e = null);
  var n = !1;
  if (e === null) n = !0;
  else
    switch (s) {
      case 'string':
      case 'number':
        n = !0;
        break;
      case 'object':
        switch (e.$$typeof) {
          case h:
          case U:
            n = !0;
        }
    }
  if (n)
    return (
      (n = e),
      (u = u(n)),
      (e = r === '' ? '.' + E(n, 0) : r),
      C(u)
        ? ((o = ''),
          e != null && (o = e.replace(I, '$&/') + '/'),
          x(u, t, o, '', function (f) {
            return f;
          }))
        : u != null &&
          ($(u) &&
            (u = Q(
              u,
              o +
                (!u.key || (n && n.key === u.key)
                  ? ''
                  : ('' + u.key).replace(I, '$&/') + '/') +
                e
            )),
          t.push(u)),
      1
    );
  if (((n = 0), (r = r === '' ? '.' : r + ':'), C(e)))
    for (var c = 0; c < e.length; c++) {
      s = e[c];
      var l = r + E(s, c);
      n += x(s, t, o, l, u);
    }
  else if (((l = K(e)), typeof l == 'function'))
    for (e = l.call(e), c = 0; !(s = e.next()).done; )
      (s = s.value), (l = r + E(s, c++)), (n += x(s, t, o, l, u));
  else if (s === 'object')
    throw (
      ((t = String(e)),
      Error(
        'Objects are not valid as a React child (found: ' +
          (t === '[object Object]'
            ? 'object with keys {' + Object.keys(e).join(', ') + '}'
            : t) +
          '). If you meant to render a collection of children, use an array instead.'
      ))
    );
  return n;
}
function _(e, t, o) {
  if (e == null) return e;
  var r = [],
    u = 0;
  return (
    x(e, r, '', '', function (s) {
      return t.call(o, s, u++);
    }),
    r
  );
}
function Z(e) {
  if (e._status === -1) {
    var t = e._result;
    (t = t()),
      t.then(
        function (o) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 1), (e._result = o));
        },
        function (o) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 2), (e._result = o));
        }
      ),
      e._status === -1 && ((e._status = 0), (e._result = t));
  }
  if (e._status === 1) return e._result.default;
  throw e._result;
}
var a = { current: null },
  S = { transition: null },
  ee = {
    ReactCurrentDispatcher: a,
    ReactCurrentBatchConfig: S,
    ReactCurrentOwner: R
  };
i.Children = {
  map: _,
  forEach: function (e, t, o) {
    _(
      e,
      function () {
        t.apply(this, arguments);
      },
      o
    );
  },
  count: function (e) {
    var t = 0;
    return (
      _(e, function () {
        t++;
      }),
      t
    );
  },
  toArray: function (e) {
    return (
      _(e, function (t) {
        return t;
      }) || []
    );
  },
  only: function (e) {
    if (!$(e))
      throw Error(
        'React.Children.only expected to receive a single React element child.'
      );
    return e;
  }
};
i.Component = m;
i.Fragment = q;
i.Profiler = F;
i.PureComponent = k;
i.StrictMode = V;
i.Suspense = G;
i.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ee;
i.cloneElement = function (e, t, o) {
  if (e == null)
    throw Error(
      'React.cloneElement(...): The argument must be a React element, but you passed ' +
        e +
        '.'
    );
  var r = T({}, e.props),
    u = e.key,
    s = e.ref,
    n = e._owner;
  if (t != null) {
    if (
      (t.ref !== void 0 && ((s = t.ref), (n = R.current)),
      t.key !== void 0 && (u = '' + t.key),
      e.type && e.type.defaultProps)
    )
      var c = e.type.defaultProps;
    for (l in t)
      N.call(t, l) &&
        !L.hasOwnProperty(l) &&
        (r[l] = t[l] === void 0 && c !== void 0 ? c[l] : t[l]);
  }
  var l = arguments.length - 2;
  if (l === 1) r.children = o;
  else if (1 < l) {
    c = Array(l);
    for (var f = 0; f < l; f++) c[f] = arguments[f + 2];
    r.children = c;
  }
  return { $$typeof: h, type: e.type, key: u, ref: s, props: r, _owner: n };
};
i.createContext = function (e) {
  return (
    (e = {
      $$typeof: z,
      _currentValue: e,
      _currentValue2: e,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null
    }),
    (e.Provider = { $$typeof: M, _context: e }),
    (e.Consumer = e)
  );
};
i.createElement = H;
i.createFactory = function (e) {
  var t = H.bind(null, e);
  return (t.type = e), t;
};
i.createRef = function () {
  return { current: null };
};
i.forwardRef = function (e) {
  return { $$typeof: Y, render: e };
};
i.isValidElement = $;
i.lazy = function (e) {
  return { $$typeof: W, _payload: { _status: -1, _result: e }, _init: Z };
};
i.memo = function (e, t) {
  return { $$typeof: J, type: e, compare: t === void 0 ? null : t };
};
i.startTransition = function (e) {
  var t = S.transition;
  S.transition = {};
  try {
    e();
  } finally {
    S.transition = t;
  }
};
i.unstable_act = function () {
  throw Error('act(...) is not supported in production builds of React.');
};
i.useCallback = function (e, t) {
  return a.current.useCallback(e, t);
};
i.useContext = function (e) {
  return a.current.useContext(e);
};
i.useDebugValue = function () {};
i.useDeferredValue = function (e) {
  return a.current.useDeferredValue(e);
};
i.useEffect = function (e, t) {
  return a.current.useEffect(e, t);
};
i.useId = function () {
  return a.current.useId();
};
i.useImperativeHandle = function (e, t, o) {
  return a.current.useImperativeHandle(e, t, o);
};
i.useInsertionEffect = function (e, t) {
  return a.current.useInsertionEffect(e, t);
};
i.useLayoutEffect = function (e, t) {
  return a.current.useLayoutEffect(e, t);
};
i.useMemo = function (e, t) {
  return a.current.useMemo(e, t);
};
i.useReducer = function (e, t, o) {
  return a.current.useReducer(e, t, o);
};
i.useRef = function (e) {
  return a.current.useRef(e);
};
i.useState = function (e) {
  return a.current.useState(e);
};
i.useSyncExternalStore = function (e, t, o) {
  return a.current.useSyncExternalStore(e, t, o);
};
i.useTransition = function () {
  return a.current.useTransition();
};
i.version = '18.2.0';
(function (e) {
  e.exports = i;
})(y);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var te = y.exports,
  re = Symbol.for('react.element'),
  ne = Symbol.for('react.fragment'),
  oe = Object.prototype.hasOwnProperty,
  ue = te.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  ie = { key: !0, ref: !0, __self: !0, __source: !0 };
function B(e, t, o) {
  var r,
    u = {},
    s = null,
    n = null;
  o !== void 0 && (s = '' + o),
    t.key !== void 0 && (s = '' + t.key),
    t.ref !== void 0 && (n = t.ref);
  for (r in t) oe.call(t, r) && !ie.hasOwnProperty(r) && (u[r] = t[r]);
  if (e && e.defaultProps)
    for (r in ((t = e.defaultProps), t)) u[r] === void 0 && (u[r] = t[r]);
  return {
    $$typeof: re,
    type: e,
    key: s,
    ref: n,
    props: u,
    _owner: ue.current
  };
}
w.Fragment = ne;
w.jsx = B;
w.jsxs = B;
(function (e) {
  e.exports = w;
})(p);
let d = [];
const g = 56;
function se() {
  const e = document.getElementById('aside-marker'),
    t = document.getElementById('aside-container');
  if (!t) return;
  const o = Array.from(
      (t == null ? void 0 : t.getElementsByTagName('a')) || []
    ).map((s) => decodeURIComponent(s.hash)),
    r = (s, n) => {
      if (s[n]) {
        const c = s[n].getAttribute('href'),
          l = o.findIndex((v) => v === c);
        (t == null ? void 0 : t.querySelector(`a[href="#${c.slice(1)}"]`)) &&
          ((e.style.top = `${33 + l * 28}px`), (e.style.opacity = '1'));
      }
    },
    u = () => {
      if (
        ((d = Array.from(
          document.querySelectorAll('.feather-doc .header-anchor')
        ).filter((n) => {
          var c;
          return ((c = n.parentElement) == null ? void 0 : c.tagName) !== 'H1';
        })),
        document.documentElement.scrollTop + window.innerHeight >=
          document.documentElement.scrollHeight)
      ) {
        r(d, d.length - 1);
        return;
      }
      for (let n = 0; n < d.length; n++) {
        const c = d[n],
          l = d[n + 1],
          f = Math.ceil(window.scrollY),
          v = c.parentElement.offsetTop - g;
        if (!l) {
          r(d, n);
          break;
        }
        if ((n === 0 && f < v) || f == 0) {
          r(d, 0);
          break;
        }
        const D = l.parentElement.offsetTop - g;
        if (f >= v && f < D) {
          r(d, n);
          break;
        }
      }
    };
  return (
    window.addEventListener('scroll', u),
    () => {
      window.removeEventListener('scroll', u);
    }
  );
}
function ce(e, t) {
  const o = parseInt(window.getComputedStyle(e).paddingTop, 10),
    r = window.scrollY + e.getBoundingClientRect().top + o - g;
  window.scrollTo({ left: 0, top: r, behavior: t ? 'smooth' : 'auto' });
}
function le(e) {
  const [t, o] = y.exports.useState(e);
  return y.exports.useEffect(() => {}), t;
}
function fe(e) {
  const { headers: t = [] } = e,
    o = le(t),
    r = o.length > 0,
    u = y.exports.useRef(null);
  y.exports.useEffect(() => {
    const n = se();
    return () => {
      n();
    };
  }, []);
  const s = (n) =>
    p.exports.jsx(
      'li',
      {
        children: p.exports.jsx('a', {
          href: `#${n.id}`,
          className: 'block leading-7 text-text-2 hover:text-text-1',
          transition: 'color duration-300',
          style: { paddingLeft: (n.depth - 2) * 12 },
          onClick: (c) => {
            c.preventDefault();
            const l = document.getElementById(n.id);
            l && ce(l, !1);
          },
          children: n.text
        })
      },
      n.id
    );
  return p.exports.jsx('div', {
    flex: '~ col 1',
    style: { width: 'var(--feather-aside-width)' },
    children: p.exports.jsx('div', {
      children:
        r &&
        p.exports.jsxs('div', {
          id: 'aside-container',
          className: 'relative divider-left pl-4 text-13px font-medium',
          children: [
            p.exports.jsx('div', {
              ref: u,
              id: 'aside-marker',
              className: 'absolute top-33px opacity-0 w-1px h-18px bg-brand',
              style: {
                left: '-1px',
                transition:
                  'top 0.25s cubic-bezier(0, 1, 0.5, 1), background-color 0.5s, opacity 0.25s'
              }
            }),
            p.exports.jsx('div', {
              'leading-7': '~',
              text: '13px',
              font: 'semibold',
              children: 'ON THIS PAGE'
            }),
            p.exports.jsx('nav', {
              children: p.exports.jsx('ul', {
                relative: '~',
                children: o.map(s)
              })
            })
          ]
        })
    })
  });
}
window.ISLANDS = { Aside: fe };
window.ISLAND_PROPS = JSON.parse(
  document.getElementById('island-props').textContent
);
