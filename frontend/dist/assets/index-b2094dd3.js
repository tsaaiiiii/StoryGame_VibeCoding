(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const r of document.querySelectorAll('link[rel="modulepreload"]')) s(r);
  new MutationObserver((r) => {
    for (const i of r)
      if (i.type === "childList")
        for (const o of i.addedNodes)
          o.tagName === "LINK" && o.rel === "modulepreload" && s(o);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(r) {
    const i = {};
    return (
      r.integrity && (i.integrity = r.integrity),
      r.referrerPolicy && (i.referrerPolicy = r.referrerPolicy),
      r.crossOrigin === "use-credentials"
        ? (i.credentials = "include")
        : r.crossOrigin === "anonymous"
        ? (i.credentials = "omit")
        : (i.credentials = "same-origin"),
      i
    );
  }
  function s(r) {
    if (r.ep) return;
    r.ep = !0;
    const i = n(r);
    fetch(r.href, i);
  }
})();
/**
 * @vue/shared v3.5.22
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ function mr(e) {
  const t = Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const ne = {},
  Ut = [],
  $e = () => {},
  to = () => !1,
  Qn = (e) =>
    e.charCodeAt(0) === 111 &&
    e.charCodeAt(1) === 110 &&
    (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97),
  gr = (e) => e.startsWith("onUpdate:"),
  he = Object.assign,
  br = (e, t) => {
    const n = e.indexOf(t);
    n > -1 && e.splice(n, 1);
  },
  Zl = Object.prototype.hasOwnProperty,
  Q = (e, t) => Zl.call(e, t),
  B = Array.isArray,
  $t = (e) => es(e) === "[object Map]",
  no = (e) => es(e) === "[object Set]",
  q = (e) => typeof e == "function",
  ue = (e) => typeof e == "string",
  mt = (e) => typeof e == "symbol",
  oe = (e) => e !== null && typeof e == "object",
  so = (e) => (oe(e) || q(e)) && q(e.then) && q(e.catch),
  ro = Object.prototype.toString,
  es = (e) => ro.call(e),
  Ql = (e) => es(e).slice(8, -1),
  io = (e) => es(e) === "[object Object]",
  yr = (e) =>
    ue(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e,
  nn = mr(
    ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
  ),
  ts = (e) => {
    const t = Object.create(null);
    return (n) => t[n] || (t[n] = e(n));
  },
  ec = /-\w/g,
  ft = ts((e) => e.replace(ec, (t) => t.slice(1).toUpperCase())),
  tc = /\B([A-Z])/g,
  Ot = ts((e) => e.replace(tc, "-$1").toLowerCase()),
  oo = ts((e) => e.charAt(0).toUpperCase() + e.slice(1)),
  Es = ts((e) => (e ? `on${oo(e)}` : "")),
  lt = (e, t) => !Object.is(e, t),
  Fn = (e, ...t) => {
    for (let n = 0; n < e.length; n++) e[n](...t);
  },
  lo = (e, t, n, s = !1) => {
    Object.defineProperty(e, t, {
      configurable: !0,
      enumerable: !1,
      writable: s,
      value: n,
    });
  },
  Ws = (e) => {
    const t = parseFloat(e);
    return isNaN(t) ? e : t;
  };
let Wr;
const ns = () =>
  Wr ||
  (Wr =
    typeof globalThis < "u"
      ? globalThis
      : typeof self < "u"
      ? self
      : typeof window < "u"
      ? window
      : typeof global < "u"
      ? global
      : {});
function ss(e) {
  if (B(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n],
        r = ue(s) ? ic(s) : ss(s);
      if (r) for (const i in r) t[i] = r[i];
    }
    return t;
  } else if (ue(e) || oe(e)) return e;
}
const nc = /;(?![^(]*\))/g,
  sc = /:([^]+)/,
  rc = /\/\*[^]*?\*\//g;
function ic(e) {
  const t = {};
  return (
    e
      .replace(rc, "")
      .split(nc)
      .forEach((n) => {
        if (n) {
          const s = n.split(sc);
          s.length > 1 && (t[s[0].trim()] = s[1].trim());
        }
      }),
    t
  );
}
function rs(e) {
  let t = "";
  if (ue(e)) t = e;
  else if (B(e))
    for (let n = 0; n < e.length; n++) {
      const s = rs(e[n]);
      s && (t += s + " ");
    }
  else if (oe(e)) for (const n in e) e[n] && (t += n + " ");
  return t.trim();
}
const oc =
    "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",
  lc = mr(oc);
function co(e) {
  return !!e || e === "";
}
const ao = (e) => !!(e && e.__v_isRef === !0),
  ie = (e) =>
    ue(e)
      ? e
      : e == null
      ? ""
      : B(e) || (oe(e) && (e.toString === ro || !q(e.toString)))
      ? ao(e)
        ? ie(e.value)
        : JSON.stringify(e, uo, 2)
      : String(e),
  uo = (e, t) =>
    ao(t)
      ? uo(e, t.value)
      : $t(t)
      ? {
          [`Map(${t.size})`]: [...t.entries()].reduce(
            (n, [s, r], i) => ((n[Ts(s, i) + " =>"] = r), n),
            {}
          ),
        }
      : no(t)
      ? { [`Set(${t.size})`]: [...t.values()].map((n) => Ts(n)) }
      : mt(t)
      ? Ts(t)
      : oe(t) && !B(t) && !io(t)
      ? String(t)
      : t,
  Ts = (e, t = "") => {
    var n;
    return mt(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e;
  };
/**
 * @vue/reactivity v3.5.22
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ let _e;
class fo {
  constructor(t = !1) {
    (this.detached = t),
      (this._active = !0),
      (this._on = 0),
      (this.effects = []),
      (this.cleanups = []),
      (this._isPaused = !1),
      (this.parent = _e),
      !t && _e && (this.index = (_e.scopes || (_e.scopes = [])).push(this) - 1);
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = !0;
      let t, n;
      if (this.scopes)
        for (t = 0, n = this.scopes.length; t < n; t++) this.scopes[t].pause();
      for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].pause();
    }
  }
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let t, n;
      if (this.scopes)
        for (t = 0, n = this.scopes.length; t < n; t++) this.scopes[t].resume();
      for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const n = _e;
      try {
        return (_e = this), t();
      } finally {
        _e = n;
      }
    }
  }
  on() {
    ++this._on === 1 && ((this.prevScope = _e), (_e = this));
  }
  off() {
    this._on > 0 &&
      --this._on === 0 &&
      ((_e = this.prevScope), (this.prevScope = void 0));
  }
  stop(t) {
    if (this._active) {
      this._active = !1;
      let n, s;
      for (n = 0, s = this.effects.length; n < s; n++) this.effects[n].stop();
      for (this.effects.length = 0, n = 0, s = this.cleanups.length; n < s; n++)
        this.cleanups[n]();
      if (((this.cleanups.length = 0), this.scopes)) {
        for (n = 0, s = this.scopes.length; n < s; n++) this.scopes[n].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !t) {
        const r = this.parent.scopes.pop();
        r &&
          r !== this &&
          ((this.parent.scopes[this.index] = r), (r.index = this.index));
      }
      this.parent = void 0;
    }
  }
}
function ho(e) {
  return new fo(e);
}
function po() {
  return _e;
}
function cc(e, t = !1) {
  _e && _e.cleanups.push(e);
}
let re;
const Os = new WeakSet();
class mo {
  constructor(t) {
    (this.fn = t),
      (this.deps = void 0),
      (this.depsTail = void 0),
      (this.flags = 5),
      (this.next = void 0),
      (this.cleanup = void 0),
      (this.scheduler = void 0),
      _e && _e.active && _e.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 &&
      ((this.flags &= -65), Os.has(this) && (Os.delete(this), this.trigger()));
  }
  notify() {
    (this.flags & 2 && !(this.flags & 32)) || this.flags & 8 || bo(this);
  }
  run() {
    if (!(this.flags & 1)) return this.fn();
    (this.flags |= 2), zr(this), yo(this);
    const t = re,
      n = Be;
    (re = this), (Be = !0);
    try {
      return this.fn();
    } finally {
      _o(this), (re = t), (Be = n), (this.flags &= -3);
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep) wr(t);
      (this.deps = this.depsTail = void 0),
        zr(this),
        this.onStop && this.onStop(),
        (this.flags &= -2);
    }
  }
  trigger() {
    this.flags & 64
      ? Os.add(this)
      : this.scheduler
      ? this.scheduler()
      : this.runIfDirty();
  }
  runIfDirty() {
    zs(this) && this.run();
  }
  get dirty() {
    return zs(this);
  }
}
let go = 0,
  sn,
  rn;
function bo(e, t = !1) {
  if (((e.flags |= 8), t)) {
    (e.next = rn), (rn = e);
    return;
  }
  (e.next = sn), (sn = e);
}
function _r() {
  go++;
}
function xr() {
  if (--go > 0) return;
  if (rn) {
    let t = rn;
    for (rn = void 0; t; ) {
      const n = t.next;
      (t.next = void 0), (t.flags &= -9), (t = n);
    }
  }
  let e;
  for (; sn; ) {
    let t = sn;
    for (sn = void 0; t; ) {
      const n = t.next;
      if (((t.next = void 0), (t.flags &= -9), t.flags & 1))
        try {
          t.trigger();
        } catch (s) {
          e || (e = s);
        }
      t = n;
    }
  }
  if (e) throw e;
}
function yo(e) {
  for (let t = e.deps; t; t = t.nextDep)
    (t.version = -1),
      (t.prevActiveLink = t.dep.activeLink),
      (t.dep.activeLink = t);
}
function _o(e) {
  let t,
    n = e.depsTail,
    s = n;
  for (; s; ) {
    const r = s.prevDep;
    s.version === -1 ? (s === n && (n = r), wr(s), ac(s)) : (t = s),
      (s.dep.activeLink = s.prevActiveLink),
      (s.prevActiveLink = void 0),
      (s = r);
  }
  (e.deps = t), (e.depsTail = n);
}
function zs(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (
      t.dep.version !== t.version ||
      (t.dep.computed && (xo(t.dep.computed) || t.dep.version !== t.version))
    )
      return !0;
  return !!e._dirty;
}
function xo(e) {
  if (
    (e.flags & 4 && !(e.flags & 16)) ||
    ((e.flags &= -17), e.globalVersion === dn) ||
    ((e.globalVersion = dn),
    !e.isSSR && e.flags & 128 && ((!e.deps && !e._dirty) || !zs(e)))
  )
    return;
  e.flags |= 2;
  const t = e.dep,
    n = re,
    s = Be;
  (re = e), (Be = !0);
  try {
    yo(e);
    const r = e.fn(e._value);
    (t.version === 0 || lt(r, e._value)) &&
      ((e.flags |= 128), (e._value = r), t.version++);
  } catch (r) {
    throw (t.version++, r);
  } finally {
    (re = n), (Be = s), _o(e), (e.flags &= -3);
  }
}
function wr(e, t = !1) {
  const { dep: n, prevSub: s, nextSub: r } = e;
  if (
    (s && ((s.nextSub = r), (e.prevSub = void 0)),
    r && ((r.prevSub = s), (e.nextSub = void 0)),
    n.subs === e && ((n.subs = s), !s && n.computed))
  ) {
    n.computed.flags &= -5;
    for (let i = n.computed.deps; i; i = i.nextDep) wr(i, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function ac(e) {
  const { prevDep: t, nextDep: n } = e;
  t && ((t.nextDep = n), (e.prevDep = void 0)),
    n && ((n.prevDep = t), (e.nextDep = void 0));
}
let Be = !0;
const wo = [];
function et() {
  wo.push(Be), (Be = !1);
}
function tt() {
  const e = wo.pop();
  Be = e === void 0 ? !0 : e;
}
function zr(e) {
  const { cleanup: t } = e;
  if (((e.cleanup = void 0), t)) {
    const n = re;
    re = void 0;
    try {
      t();
    } finally {
      re = n;
    }
  }
}
let dn = 0;
class uc {
  constructor(t, n) {
    (this.sub = t),
      (this.dep = n),
      (this.version = n.version),
      (this.nextDep =
        this.prevDep =
        this.nextSub =
        this.prevSub =
        this.prevActiveLink =
          void 0);
  }
}
class vr {
  constructor(t) {
    (this.computed = t),
      (this.version = 0),
      (this.activeLink = void 0),
      (this.subs = void 0),
      (this.map = void 0),
      (this.key = void 0),
      (this.sc = 0),
      (this.__v_skip = !0);
  }
  track(t) {
    if (!re || !Be || re === this.computed) return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== re)
      (n = this.activeLink = new uc(re, this)),
        re.deps
          ? ((n.prevDep = re.depsTail),
            (re.depsTail.nextDep = n),
            (re.depsTail = n))
          : (re.deps = re.depsTail = n),
        vo(n);
    else if (n.version === -1 && ((n.version = this.version), n.nextDep)) {
      const s = n.nextDep;
      (s.prevDep = n.prevDep),
        n.prevDep && (n.prevDep.nextDep = s),
        (n.prevDep = re.depsTail),
        (n.nextDep = void 0),
        (re.depsTail.nextDep = n),
        (re.depsTail = n),
        re.deps === n && (re.deps = s);
    }
    return n;
  }
  trigger(t) {
    this.version++, dn++, this.notify(t);
  }
  notify(t) {
    _r();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      xr();
    }
  }
}
function vo(e) {
  if ((e.dep.sc++, e.sub.flags & 4)) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep) vo(s);
    }
    const n = e.dep.subs;
    n !== e && ((e.prevSub = n), n && (n.nextSub = e)), (e.dep.subs = e);
  }
}
const Bn = new WeakMap(),
  wt = Symbol(""),
  Js = Symbol(""),
  hn = Symbol("");
function xe(e, t, n) {
  if (Be && re) {
    let s = Bn.get(e);
    s || Bn.set(e, (s = new Map()));
    let r = s.get(n);
    r || (s.set(n, (r = new vr())), (r.map = s), (r.key = n)), r.track();
  }
}
function Ze(e, t, n, s, r, i) {
  const o = Bn.get(e);
  if (!o) {
    dn++;
    return;
  }
  const l = (c) => {
    c && c.trigger();
  };
  if ((_r(), t === "clear")) o.forEach(l);
  else {
    const c = B(e),
      u = c && yr(n);
    if (c && n === "length") {
      const a = Number(s);
      o.forEach((h, b) => {
        (b === "length" || b === hn || (!mt(b) && b >= a)) && l(h);
      });
    } else
      switch (
        ((n !== void 0 || o.has(void 0)) && l(o.get(n)), u && l(o.get(hn)), t)
      ) {
        case "add":
          c ? u && l(o.get("length")) : (l(o.get(wt)), $t(e) && l(o.get(Js)));
          break;
        case "delete":
          c || (l(o.get(wt)), $t(e) && l(o.get(Js)));
          break;
        case "set":
          $t(e) && l(o.get(wt));
          break;
      }
  }
  xr();
}
function fc(e, t) {
  const n = Bn.get(e);
  return n && n.get(t);
}
function Ft(e) {
  const t = Y(e);
  return t === e ? t : (xe(t, "iterate", hn), Le(e) ? t : t.map(me));
}
function is(e) {
  return xe((e = Y(e)), "iterate", hn), e;
}
const dc = {
  __proto__: null,
  [Symbol.iterator]() {
    return As(this, Symbol.iterator, me);
  },
  concat(...e) {
    return Ft(this).concat(...e.map((t) => (B(t) ? Ft(t) : t)));
  },
  entries() {
    return As(this, "entries", (e) => ((e[1] = me(e[1])), e));
  },
  every(e, t) {
    return Xe(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return Xe(this, "filter", e, t, (n) => n.map(me), arguments);
  },
  find(e, t) {
    return Xe(this, "find", e, t, me, arguments);
  },
  findIndex(e, t) {
    return Xe(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return Xe(this, "findLast", e, t, me, arguments);
  },
  findLastIndex(e, t) {
    return Xe(this, "findLastIndex", e, t, void 0, arguments);
  },
  forEach(e, t) {
    return Xe(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return Rs(this, "includes", e);
  },
  indexOf(...e) {
    return Rs(this, "indexOf", e);
  },
  join(e) {
    return Ft(this).join(e);
  },
  lastIndexOf(...e) {
    return Rs(this, "lastIndexOf", e);
  },
  map(e, t) {
    return Xe(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return Yt(this, "pop");
  },
  push(...e) {
    return Yt(this, "push", e);
  },
  reduce(e, ...t) {
    return Jr(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Jr(this, "reduceRight", e, t);
  },
  shift() {
    return Yt(this, "shift");
  },
  some(e, t) {
    return Xe(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return Yt(this, "splice", e);
  },
  toReversed() {
    return Ft(this).toReversed();
  },
  toSorted(e) {
    return Ft(this).toSorted(e);
  },
  toSpliced(...e) {
    return Ft(this).toSpliced(...e);
  },
  unshift(...e) {
    return Yt(this, "unshift", e);
  },
  values() {
    return As(this, "values", me);
  },
};
function As(e, t, n) {
  const s = is(e),
    r = s[t]();
  return (
    s !== e &&
      !Le(e) &&
      ((r._next = r.next),
      (r.next = () => {
        const i = r._next();
        return i.done || (i.value = n(i.value)), i;
      })),
    r
  );
}
const hc = Array.prototype;
function Xe(e, t, n, s, r, i) {
  const o = is(e),
    l = o !== e && !Le(e),
    c = o[t];
  if (c !== hc[t]) {
    const h = c.apply(e, i);
    return l ? me(h) : h;
  }
  let u = n;
  o !== e &&
    (l
      ? (u = function (h, b) {
          return n.call(this, me(h), b, e);
        })
      : n.length > 2 &&
        (u = function (h, b) {
          return n.call(this, h, b, e);
        }));
  const a = c.call(o, u, s);
  return l && r ? r(a) : a;
}
function Jr(e, t, n, s) {
  const r = is(e);
  let i = n;
  return (
    r !== e &&
      (Le(e)
        ? n.length > 3 &&
          (i = function (o, l, c) {
            return n.call(this, o, l, c, e);
          })
        : (i = function (o, l, c) {
            return n.call(this, o, me(l), c, e);
          })),
    r[t](i, ...s)
  );
}
function Rs(e, t, n) {
  const s = Y(e);
  xe(s, "iterate", hn);
  const r = s[t](...n);
  return (r === -1 || r === !1) && Tr(n[0])
    ? ((n[0] = Y(n[0])), s[t](...n))
    : r;
}
function Yt(e, t, n = []) {
  et(), _r();
  const s = Y(e)[t].apply(e, n);
  return xr(), tt(), s;
}
const pc = mr("__proto__,__v_isRef,__isVue"),
  So = new Set(
    Object.getOwnPropertyNames(Symbol)
      .filter((e) => e !== "arguments" && e !== "caller")
      .map((e) => Symbol[e])
      .filter(mt)
  );
function mc(e) {
  mt(e) || (e = String(e));
  const t = Y(this);
  return xe(t, "has", e), t.hasOwnProperty(e);
}
class Eo {
  constructor(t = !1, n = !1) {
    (this._isReadonly = t), (this._isShallow = n);
  }
  get(t, n, s) {
    if (n === "__v_skip") return t.__v_skip;
    const r = this._isReadonly,
      i = this._isShallow;
    if (n === "__v_isReactive") return !r;
    if (n === "__v_isReadonly") return r;
    if (n === "__v_isShallow") return i;
    if (n === "__v_raw")
      return s === (r ? (i ? Tc : Ro) : i ? Ao : Oo).get(t) ||
        Object.getPrototypeOf(t) === Object.getPrototypeOf(s)
        ? t
        : void 0;
    const o = B(t);
    if (!r) {
      let c;
      if (o && (c = dc[n])) return c;
      if (n === "hasOwnProperty") return mc;
    }
    const l = Reflect.get(t, n, ae(t) ? t : s);
    if ((mt(n) ? So.has(n) : pc(n)) || (r || xe(t, "get", n), i)) return l;
    if (ae(l)) {
      const c = o && yr(n) ? l : l.value;
      return r && oe(c) ? Xs(c) : c;
    }
    return oe(l) ? (r ? Xs(l) : os(l)) : l;
  }
}
class To extends Eo {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, r) {
    let i = t[n];
    if (!this._isShallow) {
      const c = dt(i);
      if (
        (!Le(s) && !dt(s) && ((i = Y(i)), (s = Y(s))), !B(t) && ae(i) && !ae(s))
      )
        return c || (i.value = s), !0;
    }
    const o = B(t) && yr(n) ? Number(n) < t.length : Q(t, n),
      l = Reflect.set(t, n, s, ae(t) ? t : r);
    return (
      t === Y(r) && (o ? lt(s, i) && Ze(t, "set", n, s) : Ze(t, "add", n, s)), l
    );
  }
  deleteProperty(t, n) {
    const s = Q(t, n);
    t[n];
    const r = Reflect.deleteProperty(t, n);
    return r && s && Ze(t, "delete", n, void 0), r;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!mt(n) || !So.has(n)) && xe(t, "has", n), s;
  }
  ownKeys(t) {
    return xe(t, "iterate", B(t) ? "length" : wt), Reflect.ownKeys(t);
  }
}
class gc extends Eo {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return !0;
  }
  deleteProperty(t, n) {
    return !0;
  }
}
const bc = new To(),
  yc = new gc(),
  _c = new To(!0);
const Gs = (e) => e,
  Rn = (e) => Reflect.getPrototypeOf(e);
function xc(e, t, n) {
  return function (...s) {
    const r = this.__v_raw,
      i = Y(r),
      o = $t(i),
      l = e === "entries" || (e === Symbol.iterator && o),
      c = e === "keys" && o,
      u = r[e](...s),
      a = n ? Gs : t ? kn : me;
    return (
      !t && xe(i, "iterate", c ? Js : wt),
      {
        next() {
          const { value: h, done: b } = u.next();
          return b
            ? { value: h, done: b }
            : { value: l ? [a(h[0]), a(h[1])] : a(h), done: b };
        },
        [Symbol.iterator]() {
          return this;
        },
      }
    );
  };
}
function Cn(e) {
  return function (...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function wc(e, t) {
  const n = {
    get(r) {
      const i = this.__v_raw,
        o = Y(i),
        l = Y(r);
      e || (lt(r, l) && xe(o, "get", r), xe(o, "get", l));
      const { has: c } = Rn(o),
        u = t ? Gs : e ? kn : me;
      if (c.call(o, r)) return u(i.get(r));
      if (c.call(o, l)) return u(i.get(l));
      i !== o && i.get(r);
    },
    get size() {
      const r = this.__v_raw;
      return !e && xe(Y(r), "iterate", wt), r.size;
    },
    has(r) {
      const i = this.__v_raw,
        o = Y(i),
        l = Y(r);
      return (
        e || (lt(r, l) && xe(o, "has", r), xe(o, "has", l)),
        r === l ? i.has(r) : i.has(r) || i.has(l)
      );
    },
    forEach(r, i) {
      const o = this,
        l = o.__v_raw,
        c = Y(l),
        u = t ? Gs : e ? kn : me;
      return (
        !e && xe(c, "iterate", wt),
        l.forEach((a, h) => r.call(i, u(a), u(h), o))
      );
    },
  };
  return (
    he(
      n,
      e
        ? {
            add: Cn("add"),
            set: Cn("set"),
            delete: Cn("delete"),
            clear: Cn("clear"),
          }
        : {
            add(r) {
              !t && !Le(r) && !dt(r) && (r = Y(r));
              const i = Y(this);
              return (
                Rn(i).has.call(i, r) || (i.add(r), Ze(i, "add", r, r)), this
              );
            },
            set(r, i) {
              !t && !Le(i) && !dt(i) && (i = Y(i));
              const o = Y(this),
                { has: l, get: c } = Rn(o);
              let u = l.call(o, r);
              u || ((r = Y(r)), (u = l.call(o, r)));
              const a = c.call(o, r);
              return (
                o.set(r, i),
                u ? lt(i, a) && Ze(o, "set", r, i) : Ze(o, "add", r, i),
                this
              );
            },
            delete(r) {
              const i = Y(this),
                { has: o, get: l } = Rn(i);
              let c = o.call(i, r);
              c || ((r = Y(r)), (c = o.call(i, r))), l && l.call(i, r);
              const u = i.delete(r);
              return c && Ze(i, "delete", r, void 0), u;
            },
            clear() {
              const r = Y(this),
                i = r.size !== 0,
                o = r.clear();
              return i && Ze(r, "clear", void 0, void 0), o;
            },
          }
    ),
    ["keys", "values", "entries", Symbol.iterator].forEach((r) => {
      n[r] = xc(r, e, t);
    }),
    n
  );
}
function Sr(e, t) {
  const n = wc(e, t);
  return (s, r, i) =>
    r === "__v_isReactive"
      ? !e
      : r === "__v_isReadonly"
      ? e
      : r === "__v_raw"
      ? s
      : Reflect.get(Q(n, r) && r in s ? n : s, r, i);
}
const vc = { get: Sr(!1, !1) },
  Sc = { get: Sr(!1, !0) },
  Ec = { get: Sr(!0, !1) };
const Oo = new WeakMap(),
  Ao = new WeakMap(),
  Ro = new WeakMap(),
  Tc = new WeakMap();
function Oc(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function Ac(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : Oc(Ql(e));
}
function os(e) {
  return dt(e) ? e : Er(e, !1, bc, vc, Oo);
}
function Rc(e) {
  return Er(e, !1, _c, Sc, Ao);
}
function Xs(e) {
  return Er(e, !0, yc, Ec, Ro);
}
function Er(e, t, n, s, r) {
  if (!oe(e) || (e.__v_raw && !(t && e.__v_isReactive))) return e;
  const i = Ac(e);
  if (i === 0) return e;
  const o = r.get(e);
  if (o) return o;
  const l = new Proxy(e, i === 2 ? s : n);
  return r.set(e, l), l;
}
function ct(e) {
  return dt(e) ? ct(e.__v_raw) : !!(e && e.__v_isReactive);
}
function dt(e) {
  return !!(e && e.__v_isReadonly);
}
function Le(e) {
  return !!(e && e.__v_isShallow);
}
function Tr(e) {
  return e ? !!e.__v_raw : !1;
}
function Y(e) {
  const t = e && e.__v_raw;
  return t ? Y(t) : e;
}
function Or(e) {
  return (
    !Q(e, "__v_skip") && Object.isExtensible(e) && lo(e, "__v_skip", !0), e
  );
}
const me = (e) => (oe(e) ? os(e) : e),
  kn = (e) => (oe(e) ? Xs(e) : e);
function ae(e) {
  return e ? e.__v_isRef === !0 : !1;
}
function Et(e) {
  return Cc(e, !1);
}
function Cc(e, t) {
  return ae(e) ? e : new Pc(e, t);
}
class Pc {
  constructor(t, n) {
    (this.dep = new vr()),
      (this.__v_isRef = !0),
      (this.__v_isShallow = !1),
      (this._rawValue = n ? t : Y(t)),
      (this._value = n ? t : me(t)),
      (this.__v_isShallow = n);
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue,
      s = this.__v_isShallow || Le(t) || dt(t);
    (t = s ? t : Y(t)),
      lt(t, n) &&
        ((this._rawValue = t),
        (this._value = s ? t : me(t)),
        this.dep.trigger());
  }
}
function K(e) {
  return ae(e) ? e.value : e;
}
const Mc = {
  get: (e, t, n) => (t === "__v_raw" ? e : K(Reflect.get(e, t, n))),
  set: (e, t, n, s) => {
    const r = e[t];
    return ae(r) && !ae(n) ? ((r.value = n), !0) : Reflect.set(e, t, n, s);
  },
};
function Co(e) {
  return ct(e) ? e : new Proxy(e, Mc);
}
function Fc(e) {
  const t = B(e) ? new Array(e.length) : {};
  for (const n in e) t[n] = Dc(e, n);
  return t;
}
class Ic {
  constructor(t, n, s) {
    (this._object = t),
      (this._key = n),
      (this._defaultValue = s),
      (this.__v_isRef = !0),
      (this._value = void 0);
  }
  get value() {
    const t = this._object[this._key];
    return (this._value = t === void 0 ? this._defaultValue : t);
  }
  set value(t) {
    this._object[this._key] = t;
  }
  get dep() {
    return fc(Y(this._object), this._key);
  }
}
function Dc(e, t, n) {
  const s = e[t];
  return ae(s) ? s : new Ic(e, t, n);
}
class Lc {
  constructor(t, n, s) {
    (this.fn = t),
      (this.setter = n),
      (this._value = void 0),
      (this.dep = new vr(this)),
      (this.__v_isRef = !0),
      (this.deps = void 0),
      (this.depsTail = void 0),
      (this.flags = 16),
      (this.globalVersion = dn - 1),
      (this.next = void 0),
      (this.effect = this),
      (this.__v_isReadonly = !n),
      (this.isSSR = s);
  }
  notify() {
    if (((this.flags |= 16), !(this.flags & 8) && re !== this))
      return bo(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return xo(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
function jc(e, t, n = !1) {
  let s, r;
  return q(e) ? (s = e) : ((s = e.get), (r = e.set)), new Lc(s, r, n);
}
const Pn = {},
  Hn = new WeakMap();
let _t;
function Nc(e, t = !1, n = _t) {
  if (n) {
    let s = Hn.get(n);
    s || Hn.set(n, (s = [])), s.push(e);
  }
}
function Uc(e, t, n = ne) {
  const {
      immediate: s,
      deep: r,
      once: i,
      scheduler: o,
      augmentJob: l,
      call: c,
    } = n,
    u = (A) => (r ? A : Le(A) || r === !1 || r === 0 ? Qe(A, 1) : Qe(A));
  let a,
    h,
    b,
    w,
    m = !1,
    y = !1;
  if (
    (ae(e)
      ? ((h = () => e.value), (m = Le(e)))
      : ct(e)
      ? ((h = () => u(e)), (m = !0))
      : B(e)
      ? ((y = !0),
        (m = e.some((A) => ct(A) || Le(A))),
        (h = () =>
          e.map((A) => {
            if (ae(A)) return A.value;
            if (ct(A)) return u(A);
            if (q(A)) return c ? c(A, 2) : A();
          })))
      : q(e)
      ? t
        ? (h = c ? () => c(e, 2) : e)
        : (h = () => {
            if (b) {
              et();
              try {
                b();
              } finally {
                tt();
              }
            }
            const A = _t;
            _t = a;
            try {
              return c ? c(e, 3, [w]) : e(w);
            } finally {
              _t = A;
            }
          })
      : (h = $e),
    t && r)
  ) {
    const A = h,
      j = r === !0 ? 1 / 0 : r;
    h = () => Qe(A(), j);
  }
  const _ = po(),
    M = () => {
      a.stop(), _ && _.active && br(_.effects, a);
    };
  if (i && t) {
    const A = t;
    t = (...j) => {
      A(...j), M();
    };
  }
  let U = y ? new Array(e.length).fill(Pn) : Pn;
  const D = (A) => {
    if (!(!(a.flags & 1) || (!a.dirty && !A)))
      if (t) {
        const j = a.run();
        if (r || m || (y ? j.some((ee, L) => lt(ee, U[L])) : lt(j, U))) {
          b && b();
          const ee = _t;
          _t = a;
          try {
            const L = [j, U === Pn ? void 0 : y && U[0] === Pn ? [] : U, w];
            (U = j), c ? c(t, 3, L) : t(...L);
          } finally {
            _t = ee;
          }
        }
      } else a.run();
  };
  return (
    l && l(D),
    (a = new mo(h)),
    (a.scheduler = o ? () => o(D, !1) : D),
    (w = (A) => Nc(A, !1, a)),
    (b = a.onStop =
      () => {
        const A = Hn.get(a);
        if (A) {
          if (c) c(A, 4);
          else for (const j of A) j();
          Hn.delete(a);
        }
      }),
    t ? (s ? D(!0) : (U = a.run())) : o ? o(D.bind(null, !0), !0) : a.run(),
    (M.pause = a.pause.bind(a)),
    (M.resume = a.resume.bind(a)),
    (M.stop = M),
    M
  );
}
function Qe(e, t = 1 / 0, n) {
  if (
    t <= 0 ||
    !oe(e) ||
    e.__v_skip ||
    ((n = n || new Map()), (n.get(e) || 0) >= t)
  )
    return e;
  if ((n.set(e, t), t--, ae(e))) Qe(e.value, t, n);
  else if (B(e)) for (let s = 0; s < e.length; s++) Qe(e[s], t, n);
  else if (no(e) || $t(e))
    e.forEach((s) => {
      Qe(s, t, n);
    });
  else if (io(e)) {
    for (const s in e) Qe(e[s], t, n);
    for (const s of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, s) && Qe(e[s], t, n);
  }
  return e;
}
/**
 * @vue/runtime-core v3.5.22
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ function _n(e, t, n, s) {
  try {
    return s ? e(...s) : e();
  } catch (r) {
    ls(r, t, n);
  }
}
function Ge(e, t, n, s) {
  if (q(e)) {
    const r = _n(e, t, n, s);
    return (
      r &&
        so(r) &&
        r.catch((i) => {
          ls(i, t, n);
        }),
      r
    );
  }
  if (B(e)) {
    const r = [];
    for (let i = 0; i < e.length; i++) r.push(Ge(e[i], t, n, s));
    return r;
  }
}
function ls(e, t, n, s = !0) {
  const r = t ? t.vnode : null,
    { errorHandler: i, throwUnhandledErrorInProduction: o } =
      (t && t.appContext.config) || ne;
  if (t) {
    let l = t.parent;
    const c = t.proxy,
      u = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; l; ) {
      const a = l.ec;
      if (a) {
        for (let h = 0; h < a.length; h++) if (a[h](e, c, u) === !1) return;
      }
      l = l.parent;
    }
    if (i) {
      et(), _n(i, null, 10, [e, c, u]), tt();
      return;
    }
  }
  $c(e, n, r, s, o);
}
function $c(e, t, n, s = !0, r = !1) {
  if (r) throw e;
  console.error(e);
}
const Te = [];
let ze = -1;
const Bt = [];
let it = null,
  Dt = 0;
const Po = Promise.resolve();
let Vn = null;
function Mo(e) {
  const t = Vn || Po;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function Bc(e) {
  let t = ze + 1,
    n = Te.length;
  for (; t < n; ) {
    const s = (t + n) >>> 1,
      r = Te[s],
      i = pn(r);
    i < e || (i === e && r.flags & 2) ? (t = s + 1) : (n = s);
  }
  return t;
}
function Ar(e) {
  if (!(e.flags & 1)) {
    const t = pn(e),
      n = Te[Te.length - 1];
    !n || (!(e.flags & 2) && t >= pn(n)) ? Te.push(e) : Te.splice(Bc(t), 0, e),
      (e.flags |= 1),
      Fo();
  }
}
function Fo() {
  Vn || (Vn = Po.then(Do));
}
function kc(e) {
  B(e)
    ? Bt.push(...e)
    : it && e.id === -1
    ? it.splice(Dt + 1, 0, e)
    : e.flags & 1 || (Bt.push(e), (e.flags |= 1)),
    Fo();
}
function Gr(e, t, n = ze + 1) {
  for (; n < Te.length; n++) {
    const s = Te[n];
    if (s && s.flags & 2) {
      if (e && s.id !== e.uid) continue;
      Te.splice(n, 1),
        n--,
        s.flags & 4 && (s.flags &= -2),
        s(),
        s.flags & 4 || (s.flags &= -2);
    }
  }
}
function Io(e) {
  if (Bt.length) {
    const t = [...new Set(Bt)].sort((n, s) => pn(n) - pn(s));
    if (((Bt.length = 0), it)) {
      it.push(...t);
      return;
    }
    for (it = t, Dt = 0; Dt < it.length; Dt++) {
      const n = it[Dt];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), (n.flags &= -2);
    }
    (it = null), (Dt = 0);
  }
}
const pn = (e) => (e.id == null ? (e.flags & 2 ? -1 : 1 / 0) : e.id);
function Do(e) {
  const t = $e;
  try {
    for (ze = 0; ze < Te.length; ze++) {
      const n = Te[ze];
      n &&
        !(n.flags & 8) &&
        (n.flags & 4 && (n.flags &= -2),
        _n(n, n.i, n.i ? 15 : 14),
        n.flags & 4 || (n.flags &= -2));
    }
  } finally {
    for (; ze < Te.length; ze++) {
      const n = Te[ze];
      n && (n.flags &= -2);
    }
    (ze = -1),
      (Te.length = 0),
      Io(),
      (Vn = null),
      (Te.length || Bt.length) && Do();
  }
}
let De = null,
  Lo = null;
function qn(e) {
  const t = De;
  return (De = e), (Lo = (e && e.type.__scopeId) || null), t;
}
function xn(e, t = De, n) {
  if (!t || e._n) return e;
  const s = (...r) => {
    s._d && zn(-1);
    const i = qn(t);
    let o;
    try {
      o = e(...r);
    } finally {
      qn(i), s._d && zn(1);
    }
    return o;
  };
  return (s._n = !0), (s._c = !0), (s._d = !0), s;
}
function Hc(e, t) {
  if (De === null) return e;
  const n = fs(De),
    s = e.dirs || (e.dirs = []);
  for (let r = 0; r < t.length; r++) {
    let [i, o, l, c = ne] = t[r];
    i &&
      (q(i) && (i = { mounted: i, updated: i }),
      i.deep && Qe(o),
      s.push({
        dir: i,
        instance: n,
        value: o,
        oldValue: void 0,
        arg: l,
        modifiers: c,
      }));
  }
  return e;
}
function bt(e, t, n, s) {
  const r = e.dirs,
    i = t && t.dirs;
  for (let o = 0; o < r.length; o++) {
    const l = r[o];
    i && (l.oldValue = i[o].value);
    let c = l.dir[s];
    c && (et(), Ge(c, n, 8, [e.el, l, e, t]), tt());
  }
}
const Vc = Symbol("_vte"),
  qc = (e) => e.__isTeleport,
  Kc = Symbol("_leaveCb");
function Rr(e, t) {
  e.shapeFlag & 6 && e.component
    ? ((e.transition = t), Rr(e.component.subTree, t))
    : e.shapeFlag & 128
    ? ((e.ssContent.transition = t.clone(e.ssContent)),
      (e.ssFallback.transition = t.clone(e.ssFallback)))
    : (e.transition = t);
}
function At(e, t) {
  return q(e) ? (() => he({ name: e.name }, t, { setup: e }))() : e;
}
function jo(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
const Kn = new WeakMap();
function on(e, t, n, s, r = !1) {
  if (B(e)) {
    e.forEach((m, y) => on(m, t && (B(t) ? t[y] : t), n, s, r));
    return;
  }
  if (ln(s) && !r) {
    s.shapeFlag & 512 &&
      s.type.__asyncResolved &&
      s.component.subTree.component &&
      on(e, t, n, s.component.subTree);
    return;
  }
  const i = s.shapeFlag & 4 ? fs(s.component) : s.el,
    o = r ? null : i,
    { i: l, r: c } = e,
    u = t && t.r,
    a = l.refs === ne ? (l.refs = {}) : l.refs,
    h = l.setupState,
    b = Y(h),
    w = h === ne ? to : (m) => Q(b, m);
  if (u != null && u !== c) {
    if ((Xr(t), ue(u))) (a[u] = null), w(u) && (h[u] = null);
    else if (ae(u)) {
      u.value = null;
      const m = t;
      m.k && (a[m.k] = null);
    }
  }
  if (q(c)) _n(c, l, 12, [o, a]);
  else {
    const m = ue(c),
      y = ae(c);
    if (m || y) {
      const _ = () => {
        if (e.f) {
          const M = m ? (w(c) ? h[c] : a[c]) : c.value;
          if (r) B(M) && br(M, i);
          else if (B(M)) M.includes(i) || M.push(i);
          else if (m) (a[c] = [i]), w(c) && (h[c] = a[c]);
          else {
            const U = [i];
            (c.value = U), e.k && (a[e.k] = U);
          }
        } else
          m
            ? ((a[c] = o), w(c) && (h[c] = o))
            : y && ((c.value = o), e.k && (a[e.k] = o));
      };
      if (o) {
        const M = () => {
          _(), Kn.delete(e);
        };
        (M.id = -1), Kn.set(e, M), Fe(M, n);
      } else Xr(e), _();
    }
  }
}
function Xr(e) {
  const t = Kn.get(e);
  t && ((t.flags |= 8), Kn.delete(e));
}
ns().requestIdleCallback;
ns().cancelIdleCallback;
const ln = (e) => !!e.type.__asyncLoader,
  No = (e) => e.type.__isKeepAlive;
function Wc(e, t) {
  Uo(e, "a", t);
}
function zc(e, t) {
  Uo(e, "da", t);
}
function Uo(e, t, n = Oe) {
  const s =
    e.__wdc ||
    (e.__wdc = () => {
      let r = n;
      for (; r; ) {
        if (r.isDeactivated) return;
        r = r.parent;
      }
      return e();
    });
  if ((cs(t, s, n), n)) {
    let r = n.parent;
    for (; r && r.parent; )
      No(r.parent.vnode) && Jc(s, t, n, r), (r = r.parent);
  }
}
function Jc(e, t, n, s) {
  const r = cs(t, e, s, !0);
  Ho(() => {
    br(s[t], r);
  }, n);
}
function cs(e, t, n = Oe, s = !1) {
  if (n) {
    const r = n[e] || (n[e] = []),
      i =
        t.__weh ||
        (t.__weh = (...o) => {
          et();
          const l = wn(n),
            c = Ge(t, n, e, o);
          return l(), tt(), c;
        });
    return s ? r.unshift(i) : r.push(i), i;
  }
}
const nt =
    (e) =>
    (t, n = Oe) => {
      (!gn || e === "sp") && cs(e, (...s) => t(...s), n);
    },
  Gc = nt("bm"),
  $o = nt("m"),
  Xc = nt("bu"),
  Bo = nt("u"),
  ko = nt("bum"),
  Ho = nt("um"),
  Yc = nt("sp"),
  Zc = nt("rtg"),
  Qc = nt("rtc");
function ea(e, t = Oe) {
  cs("ec", e, t);
}
const ta = Symbol.for("v-ndc");
function kt(e, t, n, s) {
  let r;
  const i = n && n[s],
    o = B(e);
  if (o || ue(e)) {
    const l = o && ct(e);
    let c = !1,
      u = !1;
    l && ((c = !Le(e)), (u = dt(e)), (e = is(e))), (r = new Array(e.length));
    for (let a = 0, h = e.length; a < h; a++)
      r[a] = t(c ? (u ? kn(me(e[a])) : me(e[a])) : e[a], a, void 0, i && i[a]);
  } else if (typeof e == "number") {
    r = new Array(e);
    for (let l = 0; l < e; l++) r[l] = t(l + 1, l, void 0, i && i[l]);
  } else if (oe(e))
    if (e[Symbol.iterator])
      r = Array.from(e, (l, c) => t(l, c, void 0, i && i[c]));
    else {
      const l = Object.keys(e);
      r = new Array(l.length);
      for (let c = 0, u = l.length; c < u; c++) {
        const a = l[c];
        r[c] = t(e[a], a, c, i && i[c]);
      }
    }
  else r = [];
  return n && (n[s] = r), r;
}
const Ys = (e) => (e ? (ul(e) ? fs(e) : Ys(e.parent)) : null),
  cn = he(Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => Ys(e.parent),
    $root: (e) => Ys(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => Cr(e),
    $forceUpdate: (e) =>
      e.f ||
      (e.f = () => {
        Ar(e.update);
      }),
    $nextTick: (e) => e.n || (e.n = Mo.bind(e.proxy)),
    $watch: (e) => Sa.bind(e),
  }),
  Cs = (e, t) => e !== ne && !e.__isScriptSetup && Q(e, t),
  na = {
    get({ _: e }, t) {
      if (t === "__v_skip") return !0;
      const {
        ctx: n,
        setupState: s,
        data: r,
        props: i,
        accessCache: o,
        type: l,
        appContext: c,
      } = e;
      let u;
      if (t[0] !== "$") {
        const w = o[t];
        if (w !== void 0)
          switch (w) {
            case 1:
              return s[t];
            case 2:
              return r[t];
            case 4:
              return n[t];
            case 3:
              return i[t];
          }
        else {
          if (Cs(s, t)) return (o[t] = 1), s[t];
          if (r !== ne && Q(r, t)) return (o[t] = 2), r[t];
          if ((u = e.propsOptions[0]) && Q(u, t)) return (o[t] = 3), i[t];
          if (n !== ne && Q(n, t)) return (o[t] = 4), n[t];
          Zs && (o[t] = 0);
        }
      }
      const a = cn[t];
      let h, b;
      if (a) return t === "$attrs" && xe(e.attrs, "get", ""), a(e);
      if ((h = l.__cssModules) && (h = h[t])) return h;
      if (n !== ne && Q(n, t)) return (o[t] = 4), n[t];
      if (((b = c.config.globalProperties), Q(b, t))) return b[t];
    },
    set({ _: e }, t, n) {
      const { data: s, setupState: r, ctx: i } = e;
      return Cs(r, t)
        ? ((r[t] = n), !0)
        : s !== ne && Q(s, t)
        ? ((s[t] = n), !0)
        : Q(e.props, t) || (t[0] === "$" && t.slice(1) in e)
        ? !1
        : ((i[t] = n), !0);
    },
    has(
      {
        _: {
          data: e,
          setupState: t,
          accessCache: n,
          ctx: s,
          appContext: r,
          propsOptions: i,
          type: o,
        },
      },
      l
    ) {
      let c, u;
      return !!(
        n[l] ||
        (e !== ne && l[0] !== "$" && Q(e, l)) ||
        Cs(t, l) ||
        ((c = i[0]) && Q(c, l)) ||
        Q(s, l) ||
        Q(cn, l) ||
        Q(r.config.globalProperties, l) ||
        ((u = o.__cssModules) && u[l])
      );
    },
    defineProperty(e, t, n) {
      return (
        n.get != null
          ? (e._.accessCache[t] = 0)
          : Q(n, "value") && this.set(e, t, n.value, null),
        Reflect.defineProperty(e, t, n)
      );
    },
  };
function Yr(e) {
  return B(e) ? e.reduce((t, n) => ((t[n] = null), t), {}) : e;
}
let Zs = !0;
function sa(e) {
  const t = Cr(e),
    n = e.proxy,
    s = e.ctx;
  (Zs = !1), t.beforeCreate && Zr(t.beforeCreate, e, "bc");
  const {
    data: r,
    computed: i,
    methods: o,
    watch: l,
    provide: c,
    inject: u,
    created: a,
    beforeMount: h,
    mounted: b,
    beforeUpdate: w,
    updated: m,
    activated: y,
    deactivated: _,
    beforeDestroy: M,
    beforeUnmount: U,
    destroyed: D,
    unmounted: A,
    render: j,
    renderTracked: ee,
    renderTriggered: L,
    errorCaptured: P,
    serverPrefetch: $,
    expose: H,
    inheritAttrs: ce,
    components: le,
    directives: ge,
    filters: Ce,
  } = t;
  if ((u && ra(u, s, null), o))
    for (const W in o) {
      const J = o[W];
      q(J) && (s[W] = J.bind(n));
    }
  if (r) {
    const W = r.call(n, n);
    oe(W) && (e.data = os(W));
  }
  if (((Zs = !0), i))
    for (const W in i) {
      const J = i[W],
        Ve = q(J) ? J.bind(n, n) : q(J.get) ? J.get.bind(n, n) : $e,
        Rt = !q(J) && q(J.set) ? J.set.bind(n) : $e,
        be = Ne({ get: Ve, set: Rt });
      Object.defineProperty(s, W, {
        enumerable: !0,
        configurable: !0,
        get: () => be.value,
        set: (pe) => (be.value = pe),
      });
    }
  if (l) for (const W in l) Vo(l[W], s, n, W);
  if (c) {
    const W = q(c) ? c.call(n) : c;
    Reflect.ownKeys(W).forEach((J) => {
      Ko(J, W[J]);
    });
  }
  a && Zr(a, e, "c");
  function X(W, J) {
    B(J) ? J.forEach((Ve) => W(Ve.bind(n))) : J && W(J.bind(n));
  }
  if (
    (X(Gc, h),
    X($o, b),
    X(Xc, w),
    X(Bo, m),
    X(Wc, y),
    X(zc, _),
    X(ea, P),
    X(Qc, ee),
    X(Zc, L),
    X(ko, U),
    X(Ho, A),
    X(Yc, $),
    B(H))
  )
    if (H.length) {
      const W = e.exposed || (e.exposed = {});
      H.forEach((J) => {
        Object.defineProperty(W, J, {
          get: () => n[J],
          set: (Ve) => (n[J] = Ve),
          enumerable: !0,
        });
      });
    } else e.exposed || (e.exposed = {});
  j && e.render === $e && (e.render = j),
    ce != null && (e.inheritAttrs = ce),
    le && (e.components = le),
    ge && (e.directives = ge),
    $ && jo(e);
}
function ra(e, t, n = $e) {
  B(e) && (e = Qs(e));
  for (const s in e) {
    const r = e[s];
    let i;
    oe(r)
      ? "default" in r
        ? (i = St(r.from || s, r.default, !0))
        : (i = St(r.from || s))
      : (i = St(r)),
      ae(i)
        ? Object.defineProperty(t, s, {
            enumerable: !0,
            configurable: !0,
            get: () => i.value,
            set: (o) => (i.value = o),
          })
        : (t[s] = i);
  }
}
function Zr(e, t, n) {
  Ge(B(e) ? e.map((s) => s.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function Vo(e, t, n, s) {
  let r = s.includes(".") ? sl(n, s) : () => n[s];
  if (ue(e)) {
    const i = t[e];
    q(i) && an(r, i);
  } else if (q(e)) an(r, e.bind(n));
  else if (oe(e))
    if (B(e)) e.forEach((i) => Vo(i, t, n, s));
    else {
      const i = q(e.handler) ? e.handler.bind(n) : t[e.handler];
      q(i) && an(r, i, e);
    }
}
function Cr(e) {
  const t = e.type,
    { mixins: n, extends: s } = t,
    {
      mixins: r,
      optionsCache: i,
      config: { optionMergeStrategies: o },
    } = e.appContext,
    l = i.get(t);
  let c;
  return (
    l
      ? (c = l)
      : !r.length && !n && !s
      ? (c = t)
      : ((c = {}), r.length && r.forEach((u) => Wn(c, u, o, !0)), Wn(c, t, o)),
    oe(t) && i.set(t, c),
    c
  );
}
function Wn(e, t, n, s = !1) {
  const { mixins: r, extends: i } = t;
  i && Wn(e, i, n, !0), r && r.forEach((o) => Wn(e, o, n, !0));
  for (const o in t)
    if (!(s && o === "expose")) {
      const l = ia[o] || (n && n[o]);
      e[o] = l ? l(e[o], t[o]) : t[o];
    }
  return e;
}
const ia = {
  data: Qr,
  props: ei,
  emits: ei,
  methods: en,
  computed: en,
  beforeCreate: Ee,
  created: Ee,
  beforeMount: Ee,
  mounted: Ee,
  beforeUpdate: Ee,
  updated: Ee,
  beforeDestroy: Ee,
  beforeUnmount: Ee,
  destroyed: Ee,
  unmounted: Ee,
  activated: Ee,
  deactivated: Ee,
  errorCaptured: Ee,
  serverPrefetch: Ee,
  components: en,
  directives: en,
  watch: la,
  provide: Qr,
  inject: oa,
};
function Qr(e, t) {
  return t
    ? e
      ? function () {
          return he(
            q(e) ? e.call(this, this) : e,
            q(t) ? t.call(this, this) : t
          );
        }
      : t
    : e;
}
function oa(e, t) {
  return en(Qs(e), Qs(t));
}
function Qs(e) {
  if (B(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
    return t;
  }
  return e;
}
function Ee(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function en(e, t) {
  return e ? he(Object.create(null), e, t) : t;
}
function ei(e, t) {
  return e
    ? B(e) && B(t)
      ? [...new Set([...e, ...t])]
      : he(Object.create(null), Yr(e), Yr(t ?? {}))
    : t;
}
function la(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = he(Object.create(null), e);
  for (const s in t) n[s] = Ee(e[s], t[s]);
  return n;
}
function qo() {
  return {
    app: null,
    config: {
      isNativeTag: to,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {},
    },
    mixins: [],
    components: {},
    directives: {},
    provides: Object.create(null),
    optionsCache: new WeakMap(),
    propsCache: new WeakMap(),
    emitsCache: new WeakMap(),
  };
}
let ca = 0;
function aa(e, t) {
  return function (s, r = null) {
    q(s) || (s = he({}, s)), r != null && !oe(r) && (r = null);
    const i = qo(),
      o = new WeakSet(),
      l = [];
    let c = !1;
    const u = (i.app = {
      _uid: ca++,
      _component: s,
      _props: r,
      _container: null,
      _context: i,
      _instance: null,
      version: Ka,
      get config() {
        return i.config;
      },
      set config(a) {},
      use(a, ...h) {
        return (
          o.has(a) ||
            (a && q(a.install)
              ? (o.add(a), a.install(u, ...h))
              : q(a) && (o.add(a), a(u, ...h))),
          u
        );
      },
      mixin(a) {
        return i.mixins.includes(a) || i.mixins.push(a), u;
      },
      component(a, h) {
        return h ? ((i.components[a] = h), u) : i.components[a];
      },
      directive(a, h) {
        return h ? ((i.directives[a] = h), u) : i.directives[a];
      },
      mount(a, h, b) {
        if (!c) {
          const w = u._ceVNode || Se(s, r);
          return (
            (w.appContext = i),
            b === !0 ? (b = "svg") : b === !1 && (b = void 0),
            h && t ? t(w, a) : e(w, a, b),
            (c = !0),
            (u._container = a),
            (a.__vue_app__ = u),
            fs(w.component)
          );
        }
      },
      onUnmount(a) {
        l.push(a);
      },
      unmount() {
        c &&
          (Ge(l, u._instance, 16),
          e(null, u._container),
          delete u._container.__vue_app__);
      },
      provide(a, h) {
        return (i.provides[a] = h), u;
      },
      runWithContext(a) {
        const h = vt;
        vt = u;
        try {
          return a();
        } finally {
          vt = h;
        }
      },
    });
    return u;
  };
}
let vt = null;
function Ko(e, t) {
  if (Oe) {
    let n = Oe.provides;
    const s = Oe.parent && Oe.parent.provides;
    s === n && (n = Oe.provides = Object.create(s)), (n[e] = t);
  }
}
function St(e, t, n = !1) {
  const s = al();
  if (s || vt) {
    let r = vt
      ? vt._context.provides
      : s
      ? s.parent == null || s.ce
        ? s.vnode.appContext && s.vnode.appContext.provides
        : s.parent.provides
      : void 0;
    if (r && e in r) return r[e];
    if (arguments.length > 1) return n && q(t) ? t.call(s && s.proxy) : t;
  }
}
function ua() {
  return !!(al() || vt);
}
const Wo = {},
  zo = () => Object.create(Wo),
  Jo = (e) => Object.getPrototypeOf(e) === Wo;
function fa(e, t, n, s = !1) {
  const r = {},
    i = zo();
  (e.propsDefaults = Object.create(null)), Go(e, t, r, i);
  for (const o in e.propsOptions[0]) o in r || (r[o] = void 0);
  n ? (e.props = s ? r : Rc(r)) : e.type.props ? (e.props = r) : (e.props = i),
    (e.attrs = i);
}
function da(e, t, n, s) {
  const {
      props: r,
      attrs: i,
      vnode: { patchFlag: o },
    } = e,
    l = Y(r),
    [c] = e.propsOptions;
  let u = !1;
  if ((s || o > 0) && !(o & 16)) {
    if (o & 8) {
      const a = e.vnode.dynamicProps;
      for (let h = 0; h < a.length; h++) {
        let b = a[h];
        if (as(e.emitsOptions, b)) continue;
        const w = t[b];
        if (c)
          if (Q(i, b)) w !== i[b] && ((i[b] = w), (u = !0));
          else {
            const m = ft(b);
            r[m] = er(c, l, m, w, e, !1);
          }
        else w !== i[b] && ((i[b] = w), (u = !0));
      }
    }
  } else {
    Go(e, t, r, i) && (u = !0);
    let a;
    for (const h in l)
      (!t || (!Q(t, h) && ((a = Ot(h)) === h || !Q(t, a)))) &&
        (c
          ? n &&
            (n[h] !== void 0 || n[a] !== void 0) &&
            (r[h] = er(c, l, h, void 0, e, !0))
          : delete r[h]);
    if (i !== l) for (const h in i) (!t || !Q(t, h)) && (delete i[h], (u = !0));
  }
  u && Ze(e.attrs, "set", "");
}
function Go(e, t, n, s) {
  const [r, i] = e.propsOptions;
  let o = !1,
    l;
  if (t)
    for (let c in t) {
      if (nn(c)) continue;
      const u = t[c];
      let a;
      r && Q(r, (a = ft(c)))
        ? !i || !i.includes(a)
          ? (n[a] = u)
          : ((l || (l = {}))[a] = u)
        : as(e.emitsOptions, c) ||
          ((!(c in s) || u !== s[c]) && ((s[c] = u), (o = !0)));
    }
  if (i) {
    const c = Y(n),
      u = l || ne;
    for (let a = 0; a < i.length; a++) {
      const h = i[a];
      n[h] = er(r, c, h, u[h], e, !Q(u, h));
    }
  }
  return o;
}
function er(e, t, n, s, r, i) {
  const o = e[n];
  if (o != null) {
    const l = Q(o, "default");
    if (l && s === void 0) {
      const c = o.default;
      if (o.type !== Function && !o.skipFactory && q(c)) {
        const { propsDefaults: u } = r;
        if (n in u) s = u[n];
        else {
          const a = wn(r);
          (s = u[n] = c.call(null, t)), a();
        }
      } else s = c;
      r.ce && r.ce._setProp(n, s);
    }
    o[0] &&
      (i && !l ? (s = !1) : o[1] && (s === "" || s === Ot(n)) && (s = !0));
  }
  return s;
}
const ha = new WeakMap();
function Xo(e, t, n = !1) {
  const s = n ? ha : t.propsCache,
    r = s.get(e);
  if (r) return r;
  const i = e.props,
    o = {},
    l = [];
  let c = !1;
  if (!q(e)) {
    const a = (h) => {
      c = !0;
      const [b, w] = Xo(h, t, !0);
      he(o, b), w && l.push(...w);
    };
    !n && t.mixins.length && t.mixins.forEach(a),
      e.extends && a(e.extends),
      e.mixins && e.mixins.forEach(a);
  }
  if (!i && !c) return oe(e) && s.set(e, Ut), Ut;
  if (B(i))
    for (let a = 0; a < i.length; a++) {
      const h = ft(i[a]);
      ti(h) && (o[h] = ne);
    }
  else if (i)
    for (const a in i) {
      const h = ft(a);
      if (ti(h)) {
        const b = i[a],
          w = (o[h] = B(b) || q(b) ? { type: b } : he({}, b)),
          m = w.type;
        let y = !1,
          _ = !0;
        if (B(m))
          for (let M = 0; M < m.length; ++M) {
            const U = m[M],
              D = q(U) && U.name;
            if (D === "Boolean") {
              y = !0;
              break;
            } else D === "String" && (_ = !1);
          }
        else y = q(m) && m.name === "Boolean";
        (w[0] = y), (w[1] = _), (y || Q(w, "default")) && l.push(h);
      }
    }
  const u = [o, l];
  return oe(e) && s.set(e, u), u;
}
function ti(e) {
  return e[0] !== "$" && !nn(e);
}
const Pr = (e) => e === "_" || e === "_ctx" || e === "$stable",
  Mr = (e) => (B(e) ? e.map(Je) : [Je(e)]),
  pa = (e, t, n) => {
    if (t._n) return t;
    const s = xn((...r) => Mr(t(...r)), n);
    return (s._c = !1), s;
  },
  Yo = (e, t, n) => {
    const s = e._ctx;
    for (const r in e) {
      if (Pr(r)) continue;
      const i = e[r];
      if (q(i)) t[r] = pa(r, i, s);
      else if (i != null) {
        const o = Mr(i);
        t[r] = () => o;
      }
    }
  },
  Zo = (e, t) => {
    const n = Mr(t);
    e.slots.default = () => n;
  },
  Qo = (e, t, n) => {
    for (const s in t) (n || !Pr(s)) && (e[s] = t[s]);
  },
  ma = (e, t, n) => {
    const s = (e.slots = zo());
    if (e.vnode.shapeFlag & 32) {
      const r = t._;
      r ? (Qo(s, t, n), n && lo(s, "_", r, !0)) : Yo(t, s);
    } else t && Zo(e, t);
  },
  ga = (e, t, n) => {
    const { vnode: s, slots: r } = e;
    let i = !0,
      o = ne;
    if (s.shapeFlag & 32) {
      const l = t._;
      l
        ? n && l === 1
          ? (i = !1)
          : Qo(r, t, n)
        : ((i = !t.$stable), Yo(t, r)),
        (o = t);
    } else t && (Zo(e, t), (o = { default: 1 }));
    if (i) for (const l in r) !Pr(l) && o[l] == null && delete r[l];
  },
  Fe = Ma;
function ba(e) {
  return ya(e);
}
function ya(e, t) {
  const n = ns();
  n.__VUE__ = !0;
  const {
      insert: s,
      remove: r,
      patchProp: i,
      createElement: o,
      createText: l,
      createComment: c,
      setText: u,
      setElementText: a,
      parentNode: h,
      nextSibling: b,
      setScopeId: w = $e,
      insertStaticContent: m,
    } = e,
    y = (
      f,
      d,
      g,
      S = null,
      x = null,
      v = null,
      R = void 0,
      O = null,
      T = !!d.dynamicChildren
    ) => {
      if (f === d) return;
      f && !Zt(f, d) && ((S = An(f)), pe(f, x, v, !0), (f = null)),
        d.patchFlag === -2 && ((T = !1), (d.dynamicChildren = null));
      const { type: E, ref: N, shapeFlag: C } = d;
      switch (E) {
        case us:
          _(f, d, g, S);
          break;
        case ht:
          M(f, d, g, S);
          break;
        case Fs:
          f == null && U(d, g, S, R);
          break;
        case we:
          le(f, d, g, S, x, v, R, O, T);
          break;
        default:
          C & 1
            ? j(f, d, g, S, x, v, R, O, T)
            : C & 6
            ? ge(f, d, g, S, x, v, R, O, T)
            : (C & 64 || C & 128) && E.process(f, d, g, S, x, v, R, O, T, Mt);
      }
      N != null && x
        ? on(N, f && f.ref, v, d || f, !d)
        : N == null && f && f.ref != null && on(f.ref, null, v, f, !0);
    },
    _ = (f, d, g, S) => {
      if (f == null) s((d.el = l(d.children)), g, S);
      else {
        const x = (d.el = f.el);
        d.children !== f.children && u(x, d.children);
      }
    },
    M = (f, d, g, S) => {
      f == null ? s((d.el = c(d.children || "")), g, S) : (d.el = f.el);
    },
    U = (f, d, g, S) => {
      [f.el, f.anchor] = m(f.children, d, g, S, f.el, f.anchor);
    },
    D = ({ el: f, anchor: d }, g, S) => {
      let x;
      for (; f && f !== d; ) (x = b(f)), s(f, g, S), (f = x);
      s(d, g, S);
    },
    A = ({ el: f, anchor: d }) => {
      let g;
      for (; f && f !== d; ) (g = b(f)), r(f), (f = g);
      r(d);
    },
    j = (f, d, g, S, x, v, R, O, T) => {
      d.type === "svg" ? (R = "svg") : d.type === "math" && (R = "mathml"),
        f == null ? ee(d, g, S, x, v, R, O, T) : $(f, d, x, v, R, O, T);
    },
    ee = (f, d, g, S, x, v, R, O) => {
      let T, E;
      const { props: N, shapeFlag: C, transition: I, dirs: k } = f;
      if (
        ((T = f.el = o(f.type, v, N && N.is, N)),
        C & 8
          ? a(T, f.children)
          : C & 16 && P(f.children, T, null, S, x, Ps(f, v), R, O),
        k && bt(f, null, S, "created"),
        L(T, f, f.scopeId, R, S),
        N)
      ) {
        for (const se in N)
          se !== "value" && !nn(se) && i(T, se, null, N[se], v, S);
        "value" in N && i(T, "value", null, N.value, v),
          (E = N.onVnodeBeforeMount) && Ke(E, S, f);
      }
      k && bt(f, null, S, "beforeMount");
      const G = _a(x, I);
      G && I.beforeEnter(T),
        s(T, d, g),
        ((E = N && N.onVnodeMounted) || G || k) &&
          Fe(() => {
            E && Ke(E, S, f), G && I.enter(T), k && bt(f, null, S, "mounted");
          }, x);
    },
    L = (f, d, g, S, x) => {
      if ((g && w(f, g), S)) for (let v = 0; v < S.length; v++) w(f, S[v]);
      if (x) {
        let v = x.subTree;
        if (
          d === v ||
          (il(v.type) && (v.ssContent === d || v.ssFallback === d))
        ) {
          const R = x.vnode;
          L(f, R, R.scopeId, R.slotScopeIds, x.parent);
        }
      }
    },
    P = (f, d, g, S, x, v, R, O, T = 0) => {
      for (let E = T; E < f.length; E++) {
        const N = (f[E] = O ? ot(f[E]) : Je(f[E]));
        y(null, N, d, g, S, x, v, R, O);
      }
    },
    $ = (f, d, g, S, x, v, R) => {
      const O = (d.el = f.el);
      let { patchFlag: T, dynamicChildren: E, dirs: N } = d;
      T |= f.patchFlag & 16;
      const C = f.props || ne,
        I = d.props || ne;
      let k;
      if (
        (g && yt(g, !1),
        (k = I.onVnodeBeforeUpdate) && Ke(k, g, d, f),
        N && bt(d, f, g, "beforeUpdate"),
        g && yt(g, !0),
        ((C.innerHTML && I.innerHTML == null) ||
          (C.textContent && I.textContent == null)) &&
          a(O, ""),
        E
          ? H(f.dynamicChildren, E, O, g, S, Ps(d, x), v)
          : R || J(f, d, O, null, g, S, Ps(d, x), v, !1),
        T > 0)
      ) {
        if (T & 16) ce(O, C, I, g, x);
        else if (
          (T & 2 && C.class !== I.class && i(O, "class", null, I.class, x),
          T & 4 && i(O, "style", C.style, I.style, x),
          T & 8)
        ) {
          const G = d.dynamicProps;
          for (let se = 0; se < G.length; se++) {
            const te = G[se],
              Ae = C[te],
              ye = I[te];
            (ye !== Ae || te === "value") && i(O, te, Ae, ye, x, g);
          }
        }
        T & 1 && f.children !== d.children && a(O, d.children);
      } else !R && E == null && ce(O, C, I, g, x);
      ((k = I.onVnodeUpdated) || N) &&
        Fe(() => {
          k && Ke(k, g, d, f), N && bt(d, f, g, "updated");
        }, S);
    },
    H = (f, d, g, S, x, v, R) => {
      for (let O = 0; O < d.length; O++) {
        const T = f[O],
          E = d[O],
          N =
            T.el && (T.type === we || !Zt(T, E) || T.shapeFlag & 198)
              ? h(T.el)
              : g;
        y(T, E, N, null, S, x, v, R, !0);
      }
    },
    ce = (f, d, g, S, x) => {
      if (d !== g) {
        if (d !== ne)
          for (const v in d) !nn(v) && !(v in g) && i(f, v, d[v], null, x, S);
        for (const v in g) {
          if (nn(v)) continue;
          const R = g[v],
            O = d[v];
          R !== O && v !== "value" && i(f, v, O, R, x, S);
        }
        "value" in g && i(f, "value", d.value, g.value, x);
      }
    },
    le = (f, d, g, S, x, v, R, O, T) => {
      const E = (d.el = f ? f.el : l("")),
        N = (d.anchor = f ? f.anchor : l(""));
      let { patchFlag: C, dynamicChildren: I, slotScopeIds: k } = d;
      k && (O = O ? O.concat(k) : k),
        f == null
          ? (s(E, g, S), s(N, g, S), P(d.children || [], g, N, x, v, R, O, T))
          : C > 0 && C & 64 && I && f.dynamicChildren
          ? (H(f.dynamicChildren, I, g, x, v, R, O),
            (d.key != null || (x && d === x.subTree)) && el(f, d, !0))
          : J(f, d, g, N, x, v, R, O, T);
    },
    ge = (f, d, g, S, x, v, R, O, T) => {
      (d.slotScopeIds = O),
        f == null
          ? d.shapeFlag & 512
            ? x.ctx.activate(d, g, S, R, T)
            : Ce(d, g, S, x, v, R, T)
          : gt(f, d, T);
    },
    Ce = (f, d, g, S, x, v, R) => {
      const O = (f.component = Ua(f, S, x));
      if ((No(f) && (O.ctx.renderer = Mt), $a(O, !1, R), O.asyncDep)) {
        if ((x && x.registerDep(O, X, R), !f.el)) {
          const T = (O.subTree = Se(ht));
          M(null, T, d, g), (f.placeholder = T.el);
        }
      } else X(O, f, d, g, x, v, R);
    },
    gt = (f, d, g) => {
      const S = (d.component = f.component);
      if (Ca(f, d, g))
        if (S.asyncDep && !S.asyncResolved) {
          W(S, d, g);
          return;
        } else (S.next = d), S.update();
      else (d.el = f.el), (S.vnode = d);
    },
    X = (f, d, g, S, x, v, R) => {
      const O = () => {
        if (f.isMounted) {
          let { next: C, bu: I, u: k, parent: G, vnode: se } = f;
          {
            const Pe = tl(f);
            if (Pe) {
              C && ((C.el = se.el), W(f, C, R)),
                Pe.asyncDep.then(() => {
                  f.isUnmounted || O();
                });
              return;
            }
          }
          let te = C,
            Ae;
          yt(f, !1),
            C ? ((C.el = se.el), W(f, C, R)) : (C = se),
            I && Fn(I),
            (Ae = C.props && C.props.onVnodeBeforeUpdate) && Ke(Ae, G, C, se),
            yt(f, !0);
          const ye = Ms(f),
            je = f.subTree;
          (f.subTree = ye),
            y(je, ye, h(je.el), An(je), f, x, v),
            (C.el = ye.el),
            te === null && Pa(f, ye.el),
            k && Fe(k, x),
            (Ae = C.props && C.props.onVnodeUpdated) &&
              Fe(() => Ke(Ae, G, C, se), x);
        } else {
          let C;
          const { el: I, props: k } = d,
            { bm: G, m: se, parent: te, root: Ae, type: ye } = f,
            je = ln(d);
          if (
            (yt(f, !1),
            G && Fn(G),
            !je && (C = k && k.onVnodeBeforeMount) && Ke(C, te, d),
            yt(f, !0),
            I && Ss)
          ) {
            const Pe = () => {
              (f.subTree = Ms(f)), Ss(I, f.subTree, f, x, null);
            };
            je && ye.__asyncHydrate ? ye.__asyncHydrate(I, f, Pe) : Pe();
          } else {
            Ae.ce &&
              Ae.ce._def.shadowRoot !== !1 &&
              Ae.ce._injectChildStyle(ye);
            const Pe = (f.subTree = Ms(f));
            y(null, Pe, g, S, f, x, v), (d.el = Pe.el);
          }
          if ((se && Fe(se, x), !je && (C = k && k.onVnodeMounted))) {
            const Pe = d;
            Fe(() => Ke(C, te, Pe), x);
          }
          (d.shapeFlag & 256 ||
            (te && ln(te.vnode) && te.vnode.shapeFlag & 256)) &&
            f.a &&
            Fe(f.a, x),
            (f.isMounted = !0),
            (d = g = S = null);
        }
      };
      f.scope.on();
      const T = (f.effect = new mo(O));
      f.scope.off();
      const E = (f.update = T.run.bind(T)),
        N = (f.job = T.runIfDirty.bind(T));
      (N.i = f), (N.id = f.uid), (T.scheduler = () => Ar(N)), yt(f, !0), E();
    },
    W = (f, d, g) => {
      d.component = f;
      const S = f.vnode.props;
      (f.vnode = d),
        (f.next = null),
        da(f, d.props, S, g),
        ga(f, d.children, g),
        et(),
        Gr(f),
        tt();
    },
    J = (f, d, g, S, x, v, R, O, T = !1) => {
      const E = f && f.children,
        N = f ? f.shapeFlag : 0,
        C = d.children,
        { patchFlag: I, shapeFlag: k } = d;
      if (I > 0) {
        if (I & 128) {
          Rt(E, C, g, S, x, v, R, O, T);
          return;
        } else if (I & 256) {
          Ve(E, C, g, S, x, v, R, O, T);
          return;
        }
      }
      k & 8
        ? (N & 16 && Gt(E, x, v), C !== E && a(g, C))
        : N & 16
        ? k & 16
          ? Rt(E, C, g, S, x, v, R, O, T)
          : Gt(E, x, v, !0)
        : (N & 8 && a(g, ""), k & 16 && P(C, g, S, x, v, R, O, T));
    },
    Ve = (f, d, g, S, x, v, R, O, T) => {
      (f = f || Ut), (d = d || Ut);
      const E = f.length,
        N = d.length,
        C = Math.min(E, N);
      let I;
      for (I = 0; I < C; I++) {
        const k = (d[I] = T ? ot(d[I]) : Je(d[I]));
        y(f[I], k, g, null, x, v, R, O, T);
      }
      E > N ? Gt(f, x, v, !0, !1, C) : P(d, g, S, x, v, R, O, T, C);
    },
    Rt = (f, d, g, S, x, v, R, O, T) => {
      let E = 0;
      const N = d.length;
      let C = f.length - 1,
        I = N - 1;
      for (; E <= C && E <= I; ) {
        const k = f[E],
          G = (d[E] = T ? ot(d[E]) : Je(d[E]));
        if (Zt(k, G)) y(k, G, g, null, x, v, R, O, T);
        else break;
        E++;
      }
      for (; E <= C && E <= I; ) {
        const k = f[C],
          G = (d[I] = T ? ot(d[I]) : Je(d[I]));
        if (Zt(k, G)) y(k, G, g, null, x, v, R, O, T);
        else break;
        C--, I--;
      }
      if (E > C) {
        if (E <= I) {
          const k = I + 1,
            G = k < N ? d[k].el : S;
          for (; E <= I; )
            y(null, (d[E] = T ? ot(d[E]) : Je(d[E])), g, G, x, v, R, O, T), E++;
        }
      } else if (E > I) for (; E <= C; ) pe(f[E], x, v, !0), E++;
      else {
        const k = E,
          G = E,
          se = new Map();
        for (E = G; E <= I; E++) {
          const Me = (d[E] = T ? ot(d[E]) : Je(d[E]));
          Me.key != null && se.set(Me.key, E);
        }
        let te,
          Ae = 0;
        const ye = I - G + 1;
        let je = !1,
          Pe = 0;
        const Xt = new Array(ye);
        for (E = 0; E < ye; E++) Xt[E] = 0;
        for (E = k; E <= C; E++) {
          const Me = f[E];
          if (Ae >= ye) {
            pe(Me, x, v, !0);
            continue;
          }
          let qe;
          if (Me.key != null) qe = se.get(Me.key);
          else
            for (te = G; te <= I; te++)
              if (Xt[te - G] === 0 && Zt(Me, d[te])) {
                qe = te;
                break;
              }
          qe === void 0
            ? pe(Me, x, v, !0)
            : ((Xt[qe - G] = E + 1),
              qe >= Pe ? (Pe = qe) : (je = !0),
              y(Me, d[qe], g, null, x, v, R, O, T),
              Ae++);
        }
        const Vr = je ? xa(Xt) : Ut;
        for (te = Vr.length - 1, E = ye - 1; E >= 0; E--) {
          const Me = G + E,
            qe = d[Me],
            qr = d[Me + 1],
            Kr = Me + 1 < N ? qr.el || qr.placeholder : S;
          Xt[E] === 0
            ? y(null, qe, g, Kr, x, v, R, O, T)
            : je && (te < 0 || E !== Vr[te] ? be(qe, g, Kr, 2) : te--);
        }
      }
    },
    be = (f, d, g, S, x = null) => {
      const { el: v, type: R, transition: O, children: T, shapeFlag: E } = f;
      if (E & 6) {
        be(f.component.subTree, d, g, S);
        return;
      }
      if (E & 128) {
        f.suspense.move(d, g, S);
        return;
      }
      if (E & 64) {
        R.move(f, d, g, Mt);
        return;
      }
      if (R === we) {
        s(v, d, g);
        for (let C = 0; C < T.length; C++) be(T[C], d, g, S);
        s(f.anchor, d, g);
        return;
      }
      if (R === Fs) {
        D(f, d, g);
        return;
      }
      if (S !== 2 && E & 1 && O)
        if (S === 0) O.beforeEnter(v), s(v, d, g), Fe(() => O.enter(v), x);
        else {
          const { leave: C, delayLeave: I, afterLeave: k } = O,
            G = () => {
              f.ctx.isUnmounted ? r(v) : s(v, d, g);
            },
            se = () => {
              v._isLeaving && v[Kc](!0),
                C(v, () => {
                  G(), k && k();
                });
            };
          I ? I(v, G, se) : se();
        }
      else s(v, d, g);
    },
    pe = (f, d, g, S = !1, x = !1) => {
      const {
        type: v,
        props: R,
        ref: O,
        children: T,
        dynamicChildren: E,
        shapeFlag: N,
        patchFlag: C,
        dirs: I,
        cacheIndex: k,
      } = f;
      if (
        (C === -2 && (x = !1),
        O != null && (et(), on(O, null, g, f, !0), tt()),
        k != null && (d.renderCache[k] = void 0),
        N & 256)
      ) {
        d.ctx.deactivate(f);
        return;
      }
      const G = N & 1 && I,
        se = !ln(f);
      let te;
      if ((se && (te = R && R.onVnodeBeforeUnmount) && Ke(te, d, f), N & 6))
        On(f.component, g, S);
      else {
        if (N & 128) {
          f.suspense.unmount(g, S);
          return;
        }
        G && bt(f, null, d, "beforeUnmount"),
          N & 64
            ? f.type.remove(f, d, g, Mt, S)
            : E && !E.hasOnce && (v !== we || (C > 0 && C & 64))
            ? Gt(E, d, g, !1, !0)
            : ((v === we && C & 384) || (!x && N & 16)) && Gt(T, d, g),
          S && Ct(f);
      }
      ((se && (te = R && R.onVnodeUnmounted)) || G) &&
        Fe(() => {
          te && Ke(te, d, f), G && bt(f, null, d, "unmounted");
        }, g);
    },
    Ct = (f) => {
      const { type: d, el: g, anchor: S, transition: x } = f;
      if (d === we) {
        Pt(g, S);
        return;
      }
      if (d === Fs) {
        A(f);
        return;
      }
      const v = () => {
        r(g), x && !x.persisted && x.afterLeave && x.afterLeave();
      };
      if (f.shapeFlag & 1 && x && !x.persisted) {
        const { leave: R, delayLeave: O } = x,
          T = () => R(g, v);
        O ? O(f.el, v, T) : T();
      } else v();
    },
    Pt = (f, d) => {
      let g;
      for (; f !== d; ) (g = b(f)), r(f), (f = g);
      r(d);
    },
    On = (f, d, g) => {
      const { bum: S, scope: x, job: v, subTree: R, um: O, m: T, a: E } = f;
      ni(T),
        ni(E),
        S && Fn(S),
        x.stop(),
        v && ((v.flags |= 8), pe(R, f, d, g)),
        O && Fe(O, d),
        Fe(() => {
          f.isUnmounted = !0;
        }, d);
    },
    Gt = (f, d, g, S = !1, x = !1, v = 0) => {
      for (let R = v; R < f.length; R++) pe(f[R], d, g, S, x);
    },
    An = (f) => {
      if (f.shapeFlag & 6) return An(f.component.subTree);
      if (f.shapeFlag & 128) return f.suspense.next();
      const d = b(f.anchor || f.el),
        g = d && d[Vc];
      return g ? b(g) : d;
    };
  let ws = !1;
  const Hr = (f, d, g) => {
      f == null
        ? d._vnode && pe(d._vnode, null, null, !0)
        : y(d._vnode || null, f, d, null, null, null, g),
        (d._vnode = f),
        ws || ((ws = !0), Gr(), Io(), (ws = !1));
    },
    Mt = {
      p: y,
      um: pe,
      m: be,
      r: Ct,
      mt: Ce,
      mc: P,
      pc: J,
      pbc: H,
      n: An,
      o: e,
    };
  let vs, Ss;
  return (
    t && ([vs, Ss] = t(Mt)), { render: Hr, hydrate: vs, createApp: aa(Hr, vs) }
  );
}
function Ps({ type: e, props: t }, n) {
  return (n === "svg" && e === "foreignObject") ||
    (n === "mathml" &&
      e === "annotation-xml" &&
      t &&
      t.encoding &&
      t.encoding.includes("html"))
    ? void 0
    : n;
}
function yt({ effect: e, job: t }, n) {
  n ? ((e.flags |= 32), (t.flags |= 4)) : ((e.flags &= -33), (t.flags &= -5));
}
function _a(e, t) {
  return (!e || (e && !e.pendingBranch)) && t && !t.persisted;
}
function el(e, t, n = !1) {
  const s = e.children,
    r = t.children;
  if (B(s) && B(r))
    for (let i = 0; i < s.length; i++) {
      const o = s[i];
      let l = r[i];
      l.shapeFlag & 1 &&
        !l.dynamicChildren &&
        ((l.patchFlag <= 0 || l.patchFlag === 32) &&
          ((l = r[i] = ot(r[i])), (l.el = o.el)),
        !n && l.patchFlag !== -2 && el(o, l)),
        l.type === us && l.patchFlag !== -1 && (l.el = o.el),
        l.type === ht && !l.el && (l.el = o.el);
    }
}
function xa(e) {
  const t = e.slice(),
    n = [0];
  let s, r, i, o, l;
  const c = e.length;
  for (s = 0; s < c; s++) {
    const u = e[s];
    if (u !== 0) {
      if (((r = n[n.length - 1]), e[r] < u)) {
        (t[s] = r), n.push(s);
        continue;
      }
      for (i = 0, o = n.length - 1; i < o; )
        (l = (i + o) >> 1), e[n[l]] < u ? (i = l + 1) : (o = l);
      u < e[n[i]] && (i > 0 && (t[s] = n[i - 1]), (n[i] = s));
    }
  }
  for (i = n.length, o = n[i - 1]; i-- > 0; ) (n[i] = o), (o = t[o]);
  return n;
}
function tl(e) {
  const t = e.subTree.component;
  if (t) return t.asyncDep && !t.asyncResolved ? t : tl(t);
}
function ni(e) {
  if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
const wa = Symbol.for("v-scx"),
  va = () => St(wa);
function an(e, t, n) {
  return nl(e, t, n);
}
function nl(e, t, n = ne) {
  const { immediate: s, deep: r, flush: i, once: o } = n,
    l = he({}, n),
    c = (t && s) || (!t && i !== "post");
  let u;
  if (gn) {
    if (i === "sync") {
      const w = va();
      u = w.__watcherHandles || (w.__watcherHandles = []);
    } else if (!c) {
      const w = () => {};
      return (w.stop = $e), (w.resume = $e), (w.pause = $e), w;
    }
  }
  const a = Oe;
  l.call = (w, m, y) => Ge(w, a, m, y);
  let h = !1;
  i === "post"
    ? (l.scheduler = (w) => {
        Fe(w, a && a.suspense);
      })
    : i !== "sync" &&
      ((h = !0),
      (l.scheduler = (w, m) => {
        m ? w() : Ar(w);
      })),
    (l.augmentJob = (w) => {
      t && (w.flags |= 4),
        h && ((w.flags |= 2), a && ((w.id = a.uid), (w.i = a)));
    });
  const b = Uc(e, t, l);
  return gn && (u ? u.push(b) : c && b()), b;
}
function Sa(e, t, n) {
  const s = this.proxy,
    r = ue(e) ? (e.includes(".") ? sl(s, e) : () => s[e]) : e.bind(s, s);
  let i;
  q(t) ? (i = t) : ((i = t.handler), (n = t));
  const o = wn(this),
    l = nl(r, i.bind(s), n);
  return o(), l;
}
function sl(e, t) {
  const n = t.split(".");
  return () => {
    let s = e;
    for (let r = 0; r < n.length && s; r++) s = s[n[r]];
    return s;
  };
}
const Ea = (e, t) =>
  t === "modelValue" || t === "model-value"
    ? e.modelModifiers
    : e[`${t}Modifiers`] || e[`${ft(t)}Modifiers`] || e[`${Ot(t)}Modifiers`];
function Ta(e, t, ...n) {
  if (e.isUnmounted) return;
  const s = e.vnode.props || ne;
  let r = n;
  const i = t.startsWith("update:"),
    o = i && Ea(s, t.slice(7));
  o &&
    (o.trim && (r = n.map((a) => (ue(a) ? a.trim() : a))),
    o.number && (r = n.map(Ws)));
  let l,
    c = s[(l = Es(t))] || s[(l = Es(ft(t)))];
  !c && i && (c = s[(l = Es(Ot(t)))]), c && Ge(c, e, 6, r);
  const u = s[l + "Once"];
  if (u) {
    if (!e.emitted) e.emitted = {};
    else if (e.emitted[l]) return;
    (e.emitted[l] = !0), Ge(u, e, 6, r);
  }
}
const Oa = new WeakMap();
function rl(e, t, n = !1) {
  const s = n ? Oa : t.emitsCache,
    r = s.get(e);
  if (r !== void 0) return r;
  const i = e.emits;
  let o = {},
    l = !1;
  if (!q(e)) {
    const c = (u) => {
      const a = rl(u, t, !0);
      a && ((l = !0), he(o, a));
    };
    !n && t.mixins.length && t.mixins.forEach(c),
      e.extends && c(e.extends),
      e.mixins && e.mixins.forEach(c);
  }
  return !i && !l
    ? (oe(e) && s.set(e, null), null)
    : (B(i) ? i.forEach((c) => (o[c] = null)) : he(o, i),
      oe(e) && s.set(e, o),
      o);
}
function as(e, t) {
  return !e || !Qn(t)
    ? !1
    : ((t = t.slice(2).replace(/Once$/, "")),
      Q(e, t[0].toLowerCase() + t.slice(1)) || Q(e, Ot(t)) || Q(e, t));
}
function Ms(e) {
  const {
      type: t,
      vnode: n,
      proxy: s,
      withProxy: r,
      propsOptions: [i],
      slots: o,
      attrs: l,
      emit: c,
      render: u,
      renderCache: a,
      props: h,
      data: b,
      setupState: w,
      ctx: m,
      inheritAttrs: y,
    } = e,
    _ = qn(e);
  let M, U;
  try {
    if (n.shapeFlag & 4) {
      const A = r || s,
        j = A;
      (M = Je(u.call(j, A, a, h, w, b, m))), (U = l);
    } else {
      const A = t;
      (M = Je(
        A.length > 1 ? A(h, { attrs: l, slots: o, emit: c }) : A(h, null)
      )),
        (U = t.props ? l : Aa(l));
    }
  } catch (A) {
    (un.length = 0), ls(A, e, 1), (M = Se(ht));
  }
  let D = M;
  if (U && y !== !1) {
    const A = Object.keys(U),
      { shapeFlag: j } = D;
    A.length &&
      j & 7 &&
      (i && A.some(gr) && (U = Ra(U, i)), (D = Vt(D, U, !1, !0)));
  }
  return (
    n.dirs &&
      ((D = Vt(D, null, !1, !0)),
      (D.dirs = D.dirs ? D.dirs.concat(n.dirs) : n.dirs)),
    n.transition && Rr(D, n.transition),
    (M = D),
    qn(_),
    M
  );
}
const Aa = (e) => {
    let t;
    for (const n in e)
      (n === "class" || n === "style" || Qn(n)) && ((t || (t = {}))[n] = e[n]);
    return t;
  },
  Ra = (e, t) => {
    const n = {};
    for (const s in e) (!gr(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
    return n;
  };
function Ca(e, t, n) {
  const { props: s, children: r, component: i } = e,
    { props: o, children: l, patchFlag: c } = t,
    u = i.emitsOptions;
  if (t.dirs || t.transition) return !0;
  if (n && c >= 0) {
    if (c & 1024) return !0;
    if (c & 16) return s ? si(s, o, u) : !!o;
    if (c & 8) {
      const a = t.dynamicProps;
      for (let h = 0; h < a.length; h++) {
        const b = a[h];
        if (o[b] !== s[b] && !as(u, b)) return !0;
      }
    }
  } else
    return (r || l) && (!l || !l.$stable)
      ? !0
      : s === o
      ? !1
      : s
      ? o
        ? si(s, o, u)
        : !0
      : !!o;
  return !1;
}
function si(e, t, n) {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length) return !0;
  for (let r = 0; r < s.length; r++) {
    const i = s[r];
    if (t[i] !== e[i] && !as(n, i)) return !0;
  }
  return !1;
}
function Pa({ vnode: e, parent: t }, n) {
  for (; t; ) {
    const s = t.subTree;
    if ((s.suspense && s.suspense.activeBranch === e && (s.el = e.el), s === e))
      ((e = t.vnode).el = n), (t = t.parent);
    else break;
  }
}
const il = (e) => e.__isSuspense;
function Ma(e, t) {
  t && t.pendingBranch
    ? B(e)
      ? t.effects.push(...e)
      : t.effects.push(e)
    : kc(e);
}
const we = Symbol.for("v-fgt"),
  us = Symbol.for("v-txt"),
  ht = Symbol.for("v-cmt"),
  Fs = Symbol.for("v-stc"),
  un = [];
let Ie = null;
function z(e = !1) {
  un.push((Ie = e ? null : []));
}
function Fa() {
  un.pop(), (Ie = un[un.length - 1] || null);
}
let mn = 1;
function zn(e, t = !1) {
  (mn += e), e < 0 && Ie && t && (Ie.hasOnce = !0);
}
function ol(e) {
  return (
    (e.dynamicChildren = mn > 0 ? Ie || Ut : null),
    Fa(),
    mn > 0 && Ie && Ie.push(e),
    e
  );
}
function Z(e, t, n, s, r, i) {
  return ol(F(e, t, n, s, r, i, !0));
}
function pt(e, t, n, s, r) {
  return ol(Se(e, t, n, s, r, !0));
}
function Jn(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function Zt(e, t) {
  return e.type === t.type && e.key === t.key;
}
const ll = ({ key: e }) => e ?? null,
  In = ({ ref: e, ref_key: t, ref_for: n }) => (
    typeof e == "number" && (e = "" + e),
    e != null
      ? ue(e) || ae(e) || q(e)
        ? { i: De, r: e, k: t, f: !!n }
        : e
      : null
  );
function F(
  e,
  t = null,
  n = null,
  s = 0,
  r = null,
  i = e === we ? 0 : 1,
  o = !1,
  l = !1
) {
  const c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && ll(t),
    ref: t && In(t),
    scopeId: Lo,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: i,
    patchFlag: s,
    dynamicProps: r,
    dynamicChildren: null,
    appContext: null,
    ctx: De,
  };
  return (
    l
      ? (Fr(c, n), i & 128 && e.normalize(c))
      : n && (c.shapeFlag |= ue(n) ? 8 : 16),
    mn > 0 &&
      !o &&
      Ie &&
      (c.patchFlag > 0 || i & 6) &&
      c.patchFlag !== 32 &&
      Ie.push(c),
    c
  );
}
const Se = Ia;
function Ia(e, t = null, n = null, s = 0, r = null, i = !1) {
  if (((!e || e === ta) && (e = ht), Jn(e))) {
    const l = Vt(e, t, !0);
    return (
      n && Fr(l, n),
      mn > 0 &&
        !i &&
        Ie &&
        (l.shapeFlag & 6 ? (Ie[Ie.indexOf(e)] = l) : Ie.push(l)),
      (l.patchFlag = -2),
      l
    );
  }
  if ((Va(e) && (e = e.__vccOpts), t)) {
    t = Da(t);
    let { class: l, style: c } = t;
    l && !ue(l) && (t.class = rs(l)),
      oe(c) && (Tr(c) && !B(c) && (c = he({}, c)), (t.style = ss(c)));
  }
  const o = ue(e) ? 1 : il(e) ? 128 : qc(e) ? 64 : oe(e) ? 4 : q(e) ? 2 : 0;
  return F(e, t, n, s, r, o, i, !0);
}
function Da(e) {
  return e ? (Tr(e) || Jo(e) ? he({}, e) : e) : null;
}
function Vt(e, t, n = !1, s = !1) {
  const { props: r, ref: i, patchFlag: o, children: l, transition: c } = e,
    u = t ? La(r || {}, t) : r,
    a = {
      __v_isVNode: !0,
      __v_skip: !0,
      type: e.type,
      props: u,
      key: u && ll(u),
      ref:
        t && t.ref
          ? n && i
            ? B(i)
              ? i.concat(In(t))
              : [i, In(t)]
            : In(t)
          : i,
      scopeId: e.scopeId,
      slotScopeIds: e.slotScopeIds,
      children: l,
      target: e.target,
      targetStart: e.targetStart,
      targetAnchor: e.targetAnchor,
      staticCount: e.staticCount,
      shapeFlag: e.shapeFlag,
      patchFlag: t && e.type !== we ? (o === -1 ? 16 : o | 16) : o,
      dynamicProps: e.dynamicProps,
      dynamicChildren: e.dynamicChildren,
      appContext: e.appContext,
      dirs: e.dirs,
      transition: c,
      component: e.component,
      suspense: e.suspense,
      ssContent: e.ssContent && Vt(e.ssContent),
      ssFallback: e.ssFallback && Vt(e.ssFallback),
      placeholder: e.placeholder,
      el: e.el,
      anchor: e.anchor,
      ctx: e.ctx,
      ce: e.ce,
    };
  return c && s && Rr(a, c.clone(a)), a;
}
function cl(e = " ", t = 0) {
  return Se(us, null, e, t);
}
function de(e = "", t = !1) {
  return t ? (z(), pt(ht, null, e)) : Se(ht, null, e);
}
function Je(e) {
  return e == null || typeof e == "boolean"
    ? Se(ht)
    : B(e)
    ? Se(we, null, e.slice())
    : Jn(e)
    ? ot(e)
    : Se(us, null, String(e));
}
function ot(e) {
  return (e.el === null && e.patchFlag !== -1) || e.memo ? e : Vt(e);
}
function Fr(e, t) {
  let n = 0;
  const { shapeFlag: s } = e;
  if (t == null) t = null;
  else if (B(t)) n = 16;
  else if (typeof t == "object")
    if (s & 65) {
      const r = t.default;
      r && (r._c && (r._d = !1), Fr(e, r()), r._c && (r._d = !0));
      return;
    } else {
      n = 32;
      const r = t._;
      !r && !Jo(t)
        ? (t._ctx = De)
        : r === 3 &&
          De &&
          (De.slots._ === 1 ? (t._ = 1) : ((t._ = 2), (e.patchFlag |= 1024)));
    }
  else
    q(t)
      ? ((t = { default: t, _ctx: De }), (n = 32))
      : ((t = String(t)), s & 64 ? ((n = 16), (t = [cl(t)])) : (n = 8));
  (e.children = t), (e.shapeFlag |= n);
}
function La(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    for (const r in s)
      if (r === "class")
        t.class !== s.class && (t.class = rs([t.class, s.class]));
      else if (r === "style") t.style = ss([t.style, s.style]);
      else if (Qn(r)) {
        const i = t[r],
          o = s[r];
        o &&
          i !== o &&
          !(B(i) && i.includes(o)) &&
          (t[r] = i ? [].concat(i, o) : o);
      } else r !== "" && (t[r] = s[r]);
  }
  return t;
}
function Ke(e, t, n, s = null) {
  Ge(e, t, 7, [n, s]);
}
const ja = qo();
let Na = 0;
function Ua(e, t, n) {
  const s = e.type,
    r = (t ? t.appContext : e.appContext) || ja,
    i = {
      uid: Na++,
      vnode: e,
      type: s,
      parent: t,
      appContext: r,
      root: null,
      next: null,
      subTree: null,
      effect: null,
      update: null,
      job: null,
      scope: new fo(!0),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: t ? t.provides : Object.create(r.provides),
      ids: t ? t.ids : ["", 0, 0],
      accessCache: null,
      renderCache: [],
      components: null,
      directives: null,
      propsOptions: Xo(s, r),
      emitsOptions: rl(s, r),
      emit: null,
      emitted: null,
      propsDefaults: ne,
      inheritAttrs: s.inheritAttrs,
      ctx: ne,
      data: ne,
      props: ne,
      attrs: ne,
      slots: ne,
      refs: ne,
      setupState: ne,
      setupContext: null,
      suspense: n,
      suspenseId: n ? n.pendingId : 0,
      asyncDep: null,
      asyncResolved: !1,
      isMounted: !1,
      isUnmounted: !1,
      isDeactivated: !1,
      bc: null,
      c: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
      um: null,
      bum: null,
      da: null,
      a: null,
      rtg: null,
      rtc: null,
      ec: null,
      sp: null,
    };
  return (
    (i.ctx = { _: i }),
    (i.root = t ? t.root : i),
    (i.emit = Ta.bind(null, i)),
    e.ce && e.ce(i),
    i
  );
}
let Oe = null;
const al = () => Oe || De;
let Gn, tr;
{
  const e = ns(),
    t = (n, s) => {
      let r;
      return (
        (r = e[n]) || (r = e[n] = []),
        r.push(s),
        (i) => {
          r.length > 1 ? r.forEach((o) => o(i)) : r[0](i);
        }
      );
    };
  (Gn = t("__VUE_INSTANCE_SETTERS__", (n) => (Oe = n))),
    (tr = t("__VUE_SSR_SETTERS__", (n) => (gn = n)));
}
const wn = (e) => {
    const t = Oe;
    return (
      Gn(e),
      e.scope.on(),
      () => {
        e.scope.off(), Gn(t);
      }
    );
  },
  ri = () => {
    Oe && Oe.scope.off(), Gn(null);
  };
function ul(e) {
  return e.vnode.shapeFlag & 4;
}
let gn = !1;
function $a(e, t = !1, n = !1) {
  t && tr(t);
  const { props: s, children: r } = e.vnode,
    i = ul(e);
  fa(e, s, i, t), ma(e, r, n || t);
  const o = i ? Ba(e, t) : void 0;
  return t && tr(!1), o;
}
function Ba(e, t) {
  const n = e.type;
  (e.accessCache = Object.create(null)), (e.proxy = new Proxy(e.ctx, na));
  const { setup: s } = n;
  if (s) {
    et();
    const r = (e.setupContext = s.length > 1 ? Ha(e) : null),
      i = wn(e),
      o = _n(s, e, 0, [e.props, r]),
      l = so(o);
    if ((tt(), i(), (l || e.sp) && !ln(e) && jo(e), l)) {
      if ((o.then(ri, ri), t))
        return o
          .then((c) => {
            ii(e, c, t);
          })
          .catch((c) => {
            ls(c, e, 0);
          });
      e.asyncDep = o;
    } else ii(e, o, t);
  } else fl(e, t);
}
function ii(e, t, n) {
  q(t)
    ? e.type.__ssrInlineRender
      ? (e.ssrRender = t)
      : (e.render = t)
    : oe(t) && (e.setupState = Co(t)),
    fl(e, n);
}
let oi;
function fl(e, t, n) {
  const s = e.type;
  if (!e.render) {
    if (!t && oi && !s.render) {
      const r = s.template || Cr(e).template;
      if (r) {
        const { isCustomElement: i, compilerOptions: o } = e.appContext.config,
          { delimiters: l, compilerOptions: c } = s,
          u = he(he({ isCustomElement: i, delimiters: l }, o), c);
        s.render = oi(r, u);
      }
    }
    e.render = s.render || $e;
  }
  {
    const r = wn(e);
    et();
    try {
      sa(e);
    } finally {
      tt(), r();
    }
  }
}
const ka = {
  get(e, t) {
    return xe(e, "get", ""), e[t];
  },
};
function Ha(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, ka),
    slots: e.slots,
    emit: e.emit,
    expose: t,
  };
}
function fs(e) {
  return e.exposed
    ? e.exposeProxy ||
        (e.exposeProxy = new Proxy(Co(Or(e.exposed)), {
          get(t, n) {
            if (n in t) return t[n];
            if (n in cn) return cn[n](e);
          },
          has(t, n) {
            return n in t || n in cn;
          },
        }))
    : e.proxy;
}
function Va(e) {
  return q(e) && "__vccOpts" in e;
}
const Ne = (e, t) => jc(e, t, gn);
function qa(e, t, n) {
  try {
    zn(-1);
    const s = arguments.length;
    return s === 2
      ? oe(t) && !B(t)
        ? Jn(t)
          ? Se(e, null, [t])
          : Se(e, t)
        : Se(e, null, t)
      : (s > 3
          ? (n = Array.prototype.slice.call(arguments, 2))
          : s === 3 && Jn(n) && (n = [n]),
        Se(e, t, n));
  } finally {
    zn(1);
  }
}
const Ka = "3.5.22";
/**
 * @vue/runtime-dom v3.5.22
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ let nr;
const li = typeof window < "u" && window.trustedTypes;
if (li)
  try {
    nr = li.createPolicy("vue", { createHTML: (e) => e });
  } catch {}
const dl = nr ? (e) => nr.createHTML(e) : (e) => e,
  Wa = "http://www.w3.org/2000/svg",
  za = "http://www.w3.org/1998/Math/MathML",
  Ye = typeof document < "u" ? document : null,
  ci = Ye && Ye.createElement("template"),
  Ja = {
    insert: (e, t, n) => {
      t.insertBefore(e, n || null);
    },
    remove: (e) => {
      const t = e.parentNode;
      t && t.removeChild(e);
    },
    createElement: (e, t, n, s) => {
      const r =
        t === "svg"
          ? Ye.createElementNS(Wa, e)
          : t === "mathml"
          ? Ye.createElementNS(za, e)
          : n
          ? Ye.createElement(e, { is: n })
          : Ye.createElement(e);
      return (
        e === "select" &&
          s &&
          s.multiple != null &&
          r.setAttribute("multiple", s.multiple),
        r
      );
    },
    createText: (e) => Ye.createTextNode(e),
    createComment: (e) => Ye.createComment(e),
    setText: (e, t) => {
      e.nodeValue = t;
    },
    setElementText: (e, t) => {
      e.textContent = t;
    },
    parentNode: (e) => e.parentNode,
    nextSibling: (e) => e.nextSibling,
    querySelector: (e) => Ye.querySelector(e),
    setScopeId(e, t) {
      e.setAttribute(t, "");
    },
    insertStaticContent(e, t, n, s, r, i) {
      const o = n ? n.previousSibling : t.lastChild;
      if (r && (r === i || r.nextSibling))
        for (
          ;
          t.insertBefore(r.cloneNode(!0), n),
            !(r === i || !(r = r.nextSibling));

        );
      else {
        ci.innerHTML = dl(
          s === "svg"
            ? `<svg>${e}</svg>`
            : s === "mathml"
            ? `<math>${e}</math>`
            : e
        );
        const l = ci.content;
        if (s === "svg" || s === "mathml") {
          const c = l.firstChild;
          for (; c.firstChild; ) l.appendChild(c.firstChild);
          l.removeChild(c);
        }
        t.insertBefore(l, n);
      }
      return [
        o ? o.nextSibling : t.firstChild,
        n ? n.previousSibling : t.lastChild,
      ];
    },
  },
  Ga = Symbol("_vtc");
function Xa(e, t, n) {
  const s = e[Ga];
  s && (t = (t ? [t, ...s] : [...s]).join(" ")),
    t == null
      ? e.removeAttribute("class")
      : n
      ? e.setAttribute("class", t)
      : (e.className = t);
}
const ai = Symbol("_vod"),
  Ya = Symbol("_vsh"),
  Za = Symbol(""),
  Qa = /(?:^|;)\s*display\s*:/;
function eu(e, t, n) {
  const s = e.style,
    r = ue(n);
  let i = !1;
  if (n && !r) {
    if (t)
      if (ue(t))
        for (const o of t.split(";")) {
          const l = o.slice(0, o.indexOf(":")).trim();
          n[l] == null && Dn(s, l, "");
        }
      else for (const o in t) n[o] == null && Dn(s, o, "");
    for (const o in n) o === "display" && (i = !0), Dn(s, o, n[o]);
  } else if (r) {
    if (t !== n) {
      const o = s[Za];
      o && (n += ";" + o), (s.cssText = n), (i = Qa.test(n));
    }
  } else t && e.removeAttribute("style");
  ai in e && ((e[ai] = i ? s.display : ""), e[Ya] && (s.display = "none"));
}
const ui = /\s*!important$/;
function Dn(e, t, n) {
  if (B(n)) n.forEach((s) => Dn(e, t, s));
  else if ((n == null && (n = ""), t.startsWith("--"))) e.setProperty(t, n);
  else {
    const s = tu(e, t);
    ui.test(n)
      ? e.setProperty(Ot(s), n.replace(ui, ""), "important")
      : (e[s] = n);
  }
}
const fi = ["Webkit", "Moz", "ms"],
  Is = {};
function tu(e, t) {
  const n = Is[t];
  if (n) return n;
  let s = ft(t);
  if (s !== "filter" && s in e) return (Is[t] = s);
  s = oo(s);
  for (let r = 0; r < fi.length; r++) {
    const i = fi[r] + s;
    if (i in e) return (Is[t] = i);
  }
  return t;
}
const di = "http://www.w3.org/1999/xlink";
function hi(e, t, n, s, r, i = lc(t)) {
  s && t.startsWith("xlink:")
    ? n == null
      ? e.removeAttributeNS(di, t.slice(6, t.length))
      : e.setAttributeNS(di, t, n)
    : n == null || (i && !co(n))
    ? e.removeAttribute(t)
    : e.setAttribute(t, i ? "" : mt(n) ? String(n) : n);
}
function pi(e, t, n, s, r) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? dl(n) : n);
    return;
  }
  const i = e.tagName;
  if (t === "value" && i !== "PROGRESS" && !i.includes("-")) {
    const l = i === "OPTION" ? e.getAttribute("value") || "" : e.value,
      c = n == null ? (e.type === "checkbox" ? "on" : "") : String(n);
    (l !== c || !("_value" in e)) && (e.value = c),
      n == null && e.removeAttribute(t),
      (e._value = n);
    return;
  }
  let o = !1;
  if (n === "" || n == null) {
    const l = typeof e[t];
    l === "boolean"
      ? (n = co(n))
      : n == null && l === "string"
      ? ((n = ""), (o = !0))
      : l === "number" && ((n = 0), (o = !0));
  }
  try {
    e[t] = n;
  } catch {}
  o && e.removeAttribute(r || t);
}
function Lt(e, t, n, s) {
  e.addEventListener(t, n, s);
}
function nu(e, t, n, s) {
  e.removeEventListener(t, n, s);
}
const mi = Symbol("_vei");
function su(e, t, n, s, r = null) {
  const i = e[mi] || (e[mi] = {}),
    o = i[t];
  if (s && o) o.value = s;
  else {
    const [l, c] = ru(t);
    if (s) {
      const u = (i[t] = lu(s, r));
      Lt(e, l, u, c);
    } else o && (nu(e, l, o, c), (i[t] = void 0));
  }
}
const gi = /(?:Once|Passive|Capture)$/;
function ru(e) {
  let t;
  if (gi.test(e)) {
    t = {};
    let s;
    for (; (s = e.match(gi)); )
      (e = e.slice(0, e.length - s[0].length)), (t[s[0].toLowerCase()] = !0);
  }
  return [e[2] === ":" ? e.slice(3) : Ot(e.slice(2)), t];
}
let Ds = 0;
const iu = Promise.resolve(),
  ou = () => Ds || (iu.then(() => (Ds = 0)), (Ds = Date.now()));
function lu(e, t) {
  const n = (s) => {
    if (!s._vts) s._vts = Date.now();
    else if (s._vts <= n.attached) return;
    Ge(cu(s, n.value), t, 5, [s]);
  };
  return (n.value = e), (n.attached = ou()), n;
}
function cu(e, t) {
  if (B(t)) {
    const n = e.stopImmediatePropagation;
    return (
      (e.stopImmediatePropagation = () => {
        n.call(e), (e._stopped = !0);
      }),
      t.map((s) => (r) => !r._stopped && s && s(r))
    );
  } else return t;
}
const bi = (e) =>
    e.charCodeAt(0) === 111 &&
    e.charCodeAt(1) === 110 &&
    e.charCodeAt(2) > 96 &&
    e.charCodeAt(2) < 123,
  au = (e, t, n, s, r, i) => {
    const o = r === "svg";
    t === "class"
      ? Xa(e, s, o)
      : t === "style"
      ? eu(e, n, s)
      : Qn(t)
      ? gr(t) || su(e, t, n, s, i)
      : (
          t[0] === "."
            ? ((t = t.slice(1)), !0)
            : t[0] === "^"
            ? ((t = t.slice(1)), !1)
            : uu(e, t, s, o)
        )
      ? (pi(e, t, s),
        !e.tagName.includes("-") &&
          (t === "value" || t === "checked" || t === "selected") &&
          hi(e, t, s, o, i, t !== "value"))
      : e._isVueCE && (/[A-Z]/.test(t) || !ue(s))
      ? pi(e, ft(t), s, i, t)
      : (t === "true-value"
          ? (e._trueValue = s)
          : t === "false-value" && (e._falseValue = s),
        hi(e, t, s, o));
  };
function uu(e, t, n, s) {
  if (s)
    return !!(
      t === "innerHTML" ||
      t === "textContent" ||
      (t in e && bi(t) && q(n))
    );
  if (
    t === "spellcheck" ||
    t === "draggable" ||
    t === "translate" ||
    t === "autocorrect" ||
    t === "form" ||
    (t === "list" && e.tagName === "INPUT") ||
    (t === "type" && e.tagName === "TEXTAREA")
  )
    return !1;
  if (t === "width" || t === "height") {
    const r = e.tagName;
    if (r === "IMG" || r === "VIDEO" || r === "CANVAS" || r === "SOURCE")
      return !1;
  }
  return bi(t) && ue(n) ? !1 : t in e;
}
const yi = (e) => {
  const t = e.props["onUpdate:modelValue"] || !1;
  return B(t) ? (n) => Fn(t, n) : t;
};
function fu(e) {
  e.target.composing = !0;
}
function _i(e) {
  const t = e.target;
  t.composing && ((t.composing = !1), t.dispatchEvent(new Event("input")));
}
const Ls = Symbol("_assign"),
  du = {
    created(e, { modifiers: { lazy: t, trim: n, number: s } }, r) {
      e[Ls] = yi(r);
      const i = s || (r.props && r.props.type === "number");
      Lt(e, t ? "change" : "input", (o) => {
        if (o.target.composing) return;
        let l = e.value;
        n && (l = l.trim()), i && (l = Ws(l)), e[Ls](l);
      }),
        n &&
          Lt(e, "change", () => {
            e.value = e.value.trim();
          }),
        t ||
          (Lt(e, "compositionstart", fu),
          Lt(e, "compositionend", _i),
          Lt(e, "change", _i));
    },
    mounted(e, { value: t }) {
      e.value = t ?? "";
    },
    beforeUpdate(
      e,
      { value: t, oldValue: n, modifiers: { lazy: s, trim: r, number: i } },
      o
    ) {
      if (((e[Ls] = yi(o)), e.composing)) return;
      const l =
          (i || e.type === "number") && !/^0\d/.test(e.value)
            ? Ws(e.value)
            : e.value,
        c = t ?? "";
      l !== c &&
        ((document.activeElement === e &&
          e.type !== "range" &&
          ((s && t === n) || (r && e.value.trim() === c))) ||
          (e.value = c));
    },
  },
  hu = ["ctrl", "shift", "alt", "meta"],
  pu = {
    stop: (e) => e.stopPropagation(),
    prevent: (e) => e.preventDefault(),
    self: (e) => e.target !== e.currentTarget,
    ctrl: (e) => !e.ctrlKey,
    shift: (e) => !e.shiftKey,
    alt: (e) => !e.altKey,
    meta: (e) => !e.metaKey,
    left: (e) => "button" in e && e.button !== 0,
    middle: (e) => "button" in e && e.button !== 1,
    right: (e) => "button" in e && e.button !== 2,
    exact: (e, t) => hu.some((n) => e[`${n}Key`] && !t.includes(n)),
  },
  hl = (e, t) => {
    const n = e._withMods || (e._withMods = {}),
      s = t.join(".");
    return (
      n[s] ||
      (n[s] = (r, ...i) => {
        for (let o = 0; o < t.length; o++) {
          const l = pu[t[o]];
          if (l && l(r, t)) return;
        }
        return e(r, ...i);
      })
    );
  },
  mu = he({ patchProp: au }, Ja);
let xi;
function gu() {
  return xi || (xi = ba(mu));
}
const bu = (...e) => {
  const t = gu().createApp(...e),
    { mount: n } = t;
  return (
    (t.mount = (s) => {
      const r = _u(s);
      if (!r) return;
      const i = t._component;
      !q(i) && !i.render && !i.template && (i.template = r.innerHTML),
        r.nodeType === 1 && (r.textContent = "");
      const o = n(r, !1, yu(r));
      return (
        r instanceof Element &&
          (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")),
        o
      );
    }),
    t
  );
};
function yu(e) {
  if (e instanceof SVGElement) return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function _u(e) {
  return ue(e) ? document.querySelector(e) : e;
}
var xu = !1;
/*!
 * pinia v2.3.1
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */ let pl;
const ds = (e) => (pl = e),
  ml = Symbol();
function sr(e) {
  return (
    e &&
    typeof e == "object" &&
    Object.prototype.toString.call(e) === "[object Object]" &&
    typeof e.toJSON != "function"
  );
}
var fn;
(function (e) {
  (e.direct = "direct"),
    (e.patchObject = "patch object"),
    (e.patchFunction = "patch function");
})(fn || (fn = {}));
function wu() {
  const e = ho(!0),
    t = e.run(() => Et({}));
  let n = [],
    s = [];
  const r = Or({
    install(i) {
      ds(r),
        (r._a = i),
        i.provide(ml, r),
        (i.config.globalProperties.$pinia = r),
        s.forEach((o) => n.push(o)),
        (s = []);
    },
    use(i) {
      return !this._a && !xu ? s.push(i) : n.push(i), this;
    },
    _p: n,
    _a: null,
    _e: e,
    _s: new Map(),
    state: t,
  });
  return r;
}
const gl = () => {};
function wi(e, t, n, s = gl) {
  e.push(t);
  const r = () => {
    const i = e.indexOf(t);
    i > -1 && (e.splice(i, 1), s());
  };
  return !n && po() && cc(r), r;
}
function It(e, ...t) {
  e.slice().forEach((n) => {
    n(...t);
  });
}
const vu = (e) => e(),
  vi = Symbol(),
  js = Symbol();
function rr(e, t) {
  e instanceof Map && t instanceof Map
    ? t.forEach((n, s) => e.set(s, n))
    : e instanceof Set && t instanceof Set && t.forEach(e.add, e);
  for (const n in t) {
    if (!t.hasOwnProperty(n)) continue;
    const s = t[n],
      r = e[n];
    sr(r) && sr(s) && e.hasOwnProperty(n) && !ae(s) && !ct(s)
      ? (e[n] = rr(r, s))
      : (e[n] = s);
  }
  return e;
}
const Su = Symbol();
function Eu(e) {
  return !sr(e) || !e.hasOwnProperty(Su);
}
const { assign: rt } = Object;
function Tu(e) {
  return !!(ae(e) && e.effect);
}
function Ou(e, t, n, s) {
  const { state: r, actions: i, getters: o } = t,
    l = n.state.value[e];
  let c;
  function u() {
    l || (n.state.value[e] = r ? r() : {});
    const a = Fc(n.state.value[e]);
    return rt(
      a,
      i,
      Object.keys(o || {}).reduce(
        (h, b) => (
          (h[b] = Or(
            Ne(() => {
              ds(n);
              const w = n._s.get(e);
              return o[b].call(w, w);
            })
          )),
          h
        ),
        {}
      )
    );
  }
  return (c = bl(e, u, t, n, s, !0)), c;
}
function bl(e, t, n = {}, s, r, i) {
  let o;
  const l = rt({ actions: {} }, n),
    c = { deep: !0 };
  let u,
    a,
    h = [],
    b = [],
    w;
  const m = s.state.value[e];
  !i && !m && (s.state.value[e] = {}), Et({});
  let y;
  function _(P) {
    let $;
    (u = a = !1),
      typeof P == "function"
        ? (P(s.state.value[e]),
          ($ = { type: fn.patchFunction, storeId: e, events: w }))
        : (rr(s.state.value[e], P),
          ($ = { type: fn.patchObject, payload: P, storeId: e, events: w }));
    const H = (y = Symbol());
    Mo().then(() => {
      y === H && (u = !0);
    }),
      (a = !0),
      It(h, $, s.state.value[e]);
  }
  const M = i
    ? function () {
        const { state: $ } = n,
          H = $ ? $() : {};
        this.$patch((ce) => {
          rt(ce, H);
        });
      }
    : gl;
  function U() {
    o.stop(), (h = []), (b = []), s._s.delete(e);
  }
  const D = (P, $ = "") => {
      if (vi in P) return (P[js] = $), P;
      const H = function () {
        ds(s);
        const ce = Array.from(arguments),
          le = [],
          ge = [];
        function Ce(W) {
          le.push(W);
        }
        function gt(W) {
          ge.push(W);
        }
        It(b, { args: ce, name: H[js], store: j, after: Ce, onError: gt });
        let X;
        try {
          X = P.apply(this && this.$id === e ? this : j, ce);
        } catch (W) {
          throw (It(ge, W), W);
        }
        return X instanceof Promise
          ? X.then((W) => (It(le, W), W)).catch(
              (W) => (It(ge, W), Promise.reject(W))
            )
          : (It(le, X), X);
      };
      return (H[vi] = !0), (H[js] = $), H;
    },
    A = {
      _p: s,
      $id: e,
      $onAction: wi.bind(null, b),
      $patch: _,
      $reset: M,
      $subscribe(P, $ = {}) {
        const H = wi(h, P, $.detached, () => ce()),
          ce = o.run(() =>
            an(
              () => s.state.value[e],
              (le) => {
                ($.flush === "sync" ? a : u) &&
                  P({ storeId: e, type: fn.direct, events: w }, le);
              },
              rt({}, c, $)
            )
          );
        return H;
      },
      $dispose: U,
    },
    j = os(A);
  s._s.set(e, j);
  const L = ((s._a && s._a.runWithContext) || vu)(() =>
    s._e.run(() => (o = ho()).run(() => t({ action: D })))
  );
  for (const P in L) {
    const $ = L[P];
    if ((ae($) && !Tu($)) || ct($))
      i ||
        (m && Eu($) && (ae($) ? ($.value = m[P]) : rr($, m[P])),
        (s.state.value[e][P] = $));
    else if (typeof $ == "function") {
      const H = D($, P);
      (L[P] = H), (l.actions[P] = $);
    }
  }
  return (
    rt(j, L),
    rt(Y(j), L),
    Object.defineProperty(j, "$state", {
      get: () => s.state.value[e],
      set: (P) => {
        _(($) => {
          rt($, P);
        });
      },
    }),
    s._p.forEach((P) => {
      rt(
        j,
        o.run(() => P({ store: j, app: s._a, pinia: s, options: l }))
      );
    }),
    m && i && n.hydrate && n.hydrate(j.$state, m),
    (u = !0),
    (a = !0),
    j
  );
}
/*! #__NO_SIDE_EFFECTS__ */ function Au(e, t, n) {
  let s, r;
  const i = typeof t == "function";
  typeof e == "string" ? ((s = e), (r = i ? n : t)) : ((r = e), (s = e.id));
  function o(l, c) {
    const u = ua();
    return (
      (l = l || (u ? St(ml, null) : null)),
      l && ds(l),
      (l = pl),
      l._s.has(s) || (i ? bl(s, t, r, l) : Ou(s, r, l)),
      l._s.get(s)
    );
  }
  return (o.$id = s), o;
}
function yl(e, t) {
  return function () {
    return e.apply(t, arguments);
  };
}
const { toString: Ru } = Object.prototype,
  { getPrototypeOf: Ir } = Object,
  { iterator: hs, toStringTag: _l } = Symbol,
  ps = ((e) => (t) => {
    const n = Ru.call(t);
    return e[n] || (e[n] = n.slice(8, -1).toLowerCase());
  })(Object.create(null)),
  He = (e) => ((e = e.toLowerCase()), (t) => ps(t) === e),
  ms = (e) => (t) => typeof t === e,
  { isArray: zt } = Array,
  qt = ms("undefined");
function vn(e) {
  return (
    e !== null &&
    !qt(e) &&
    e.constructor !== null &&
    !qt(e.constructor) &&
    Re(e.constructor.isBuffer) &&
    e.constructor.isBuffer(e)
  );
}
const xl = He("ArrayBuffer");
function Cu(e) {
  let t;
  return (
    typeof ArrayBuffer < "u" && ArrayBuffer.isView
      ? (t = ArrayBuffer.isView(e))
      : (t = e && e.buffer && xl(e.buffer)),
    t
  );
}
const Pu = ms("string"),
  Re = ms("function"),
  wl = ms("number"),
  Sn = (e) => e !== null && typeof e == "object",
  Mu = (e) => e === !0 || e === !1,
  Ln = (e) => {
    if (ps(e) !== "object") return !1;
    const t = Ir(e);
    return (
      (t === null ||
        t === Object.prototype ||
        Object.getPrototypeOf(t) === null) &&
      !(_l in e) &&
      !(hs in e)
    );
  },
  Fu = (e) => {
    if (!Sn(e) || vn(e)) return !1;
    try {
      return (
        Object.keys(e).length === 0 &&
        Object.getPrototypeOf(e) === Object.prototype
      );
    } catch {
      return !1;
    }
  },
  Iu = He("Date"),
  Du = He("File"),
  Lu = He("Blob"),
  ju = He("FileList"),
  Nu = (e) => Sn(e) && Re(e.pipe),
  Uu = (e) => {
    let t;
    return (
      e &&
      ((typeof FormData == "function" && e instanceof FormData) ||
        (Re(e.append) &&
          ((t = ps(e)) === "formdata" ||
            (t === "object" &&
              Re(e.toString) &&
              e.toString() === "[object FormData]"))))
    );
  },
  $u = He("URLSearchParams"),
  [Bu, ku, Hu, Vu] = ["ReadableStream", "Request", "Response", "Headers"].map(
    He
  ),
  qu = (e) =>
    e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function En(e, t, { allOwnKeys: n = !1 } = {}) {
  if (e === null || typeof e > "u") return;
  let s, r;
  if ((typeof e != "object" && (e = [e]), zt(e)))
    for (s = 0, r = e.length; s < r; s++) t.call(null, e[s], s, e);
  else {
    if (vn(e)) return;
    const i = n ? Object.getOwnPropertyNames(e) : Object.keys(e),
      o = i.length;
    let l;
    for (s = 0; s < o; s++) (l = i[s]), t.call(null, e[l], l, e);
  }
}
function vl(e, t) {
  if (vn(e)) return null;
  t = t.toLowerCase();
  const n = Object.keys(e);
  let s = n.length,
    r;
  for (; s-- > 0; ) if (((r = n[s]), t === r.toLowerCase())) return r;
  return null;
}
const xt = (() =>
    typeof globalThis < "u"
      ? globalThis
      : typeof self < "u"
      ? self
      : typeof window < "u"
      ? window
      : global)(),
  Sl = (e) => !qt(e) && e !== xt;
function ir() {
  const { caseless: e, skipUndefined: t } = (Sl(this) && this) || {},
    n = {},
    s = (r, i) => {
      const o = (e && vl(n, i)) || i;
      Ln(n[o]) && Ln(r)
        ? (n[o] = ir(n[o], r))
        : Ln(r)
        ? (n[o] = ir({}, r))
        : zt(r)
        ? (n[o] = r.slice())
        : (!t || !qt(r)) && (n[o] = r);
    };
  for (let r = 0, i = arguments.length; r < i; r++)
    arguments[r] && En(arguments[r], s);
  return n;
}
const Ku = (e, t, n, { allOwnKeys: s } = {}) => (
    En(
      t,
      (r, i) => {
        n && Re(r) ? (e[i] = yl(r, n)) : (e[i] = r);
      },
      { allOwnKeys: s }
    ),
    e
  ),
  Wu = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e),
  zu = (e, t, n, s) => {
    (e.prototype = Object.create(t.prototype, s)),
      (e.prototype.constructor = e),
      Object.defineProperty(e, "super", { value: t.prototype }),
      n && Object.assign(e.prototype, n);
  },
  Ju = (e, t, n, s) => {
    let r, i, o;
    const l = {};
    if (((t = t || {}), e == null)) return t;
    do {
      for (r = Object.getOwnPropertyNames(e), i = r.length; i-- > 0; )
        (o = r[i]), (!s || s(o, e, t)) && !l[o] && ((t[o] = e[o]), (l[o] = !0));
      e = n !== !1 && Ir(e);
    } while (e && (!n || n(e, t)) && e !== Object.prototype);
    return t;
  },
  Gu = (e, t, n) => {
    (e = String(e)),
      (n === void 0 || n > e.length) && (n = e.length),
      (n -= t.length);
    const s = e.indexOf(t, n);
    return s !== -1 && s === n;
  },
  Xu = (e) => {
    if (!e) return null;
    if (zt(e)) return e;
    let t = e.length;
    if (!wl(t)) return null;
    const n = new Array(t);
    for (; t-- > 0; ) n[t] = e[t];
    return n;
  },
  Yu = (
    (e) => (t) =>
      e && t instanceof e
  )(typeof Uint8Array < "u" && Ir(Uint8Array)),
  Zu = (e, t) => {
    const s = (e && e[hs]).call(e);
    let r;
    for (; (r = s.next()) && !r.done; ) {
      const i = r.value;
      t.call(e, i[0], i[1]);
    }
  },
  Qu = (e, t) => {
    let n;
    const s = [];
    for (; (n = e.exec(t)) !== null; ) s.push(n);
    return s;
  },
  ef = He("HTMLFormElement"),
  tf = (e) =>
    e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function (n, s, r) {
      return s.toUpperCase() + r;
    }),
  Si = (
    ({ hasOwnProperty: e }) =>
    (t, n) =>
      e.call(t, n)
  )(Object.prototype),
  nf = He("RegExp"),
  El = (e, t) => {
    const n = Object.getOwnPropertyDescriptors(e),
      s = {};
    En(n, (r, i) => {
      let o;
      (o = t(r, i, e)) !== !1 && (s[i] = o || r);
    }),
      Object.defineProperties(e, s);
  },
  sf = (e) => {
    El(e, (t, n) => {
      if (Re(e) && ["arguments", "caller", "callee"].indexOf(n) !== -1)
        return !1;
      const s = e[n];
      if (Re(s)) {
        if (((t.enumerable = !1), "writable" in t)) {
          t.writable = !1;
          return;
        }
        t.set ||
          (t.set = () => {
            throw Error("Can not rewrite read-only method '" + n + "'");
          });
      }
    });
  },
  rf = (e, t) => {
    const n = {},
      s = (r) => {
        r.forEach((i) => {
          n[i] = !0;
        });
      };
    return zt(e) ? s(e) : s(String(e).split(t)), n;
  },
  of = () => {},
  lf = (e, t) => (e != null && Number.isFinite((e = +e)) ? e : t);
function cf(e) {
  return !!(e && Re(e.append) && e[_l] === "FormData" && e[hs]);
}
const af = (e) => {
    const t = new Array(10),
      n = (s, r) => {
        if (Sn(s)) {
          if (t.indexOf(s) >= 0) return;
          if (vn(s)) return s;
          if (!("toJSON" in s)) {
            t[r] = s;
            const i = zt(s) ? [] : {};
            return (
              En(s, (o, l) => {
                const c = n(o, r + 1);
                !qt(c) && (i[l] = c);
              }),
              (t[r] = void 0),
              i
            );
          }
        }
        return s;
      };
    return n(e, 0);
  },
  uf = He("AsyncFunction"),
  ff = (e) => e && (Sn(e) || Re(e)) && Re(e.then) && Re(e.catch),
  Tl = ((e, t) =>
    e
      ? setImmediate
      : t
      ? ((n, s) => (
          xt.addEventListener(
            "message",
            ({ source: r, data: i }) => {
              r === xt && i === n && s.length && s.shift()();
            },
            !1
          ),
          (r) => {
            s.push(r), xt.postMessage(n, "*");
          }
        ))(`axios@${Math.random()}`, [])
      : (n) => setTimeout(n))(
    typeof setImmediate == "function",
    Re(xt.postMessage)
  ),
  df =
    typeof queueMicrotask < "u"
      ? queueMicrotask.bind(xt)
      : (typeof process < "u" && process.nextTick) || Tl,
  hf = (e) => e != null && Re(e[hs]),
  p = {
    isArray: zt,
    isArrayBuffer: xl,
    isBuffer: vn,
    isFormData: Uu,
    isArrayBufferView: Cu,
    isString: Pu,
    isNumber: wl,
    isBoolean: Mu,
    isObject: Sn,
    isPlainObject: Ln,
    isEmptyObject: Fu,
    isReadableStream: Bu,
    isRequest: ku,
    isResponse: Hu,
    isHeaders: Vu,
    isUndefined: qt,
    isDate: Iu,
    isFile: Du,
    isBlob: Lu,
    isRegExp: nf,
    isFunction: Re,
    isStream: Nu,
    isURLSearchParams: $u,
    isTypedArray: Yu,
    isFileList: ju,
    forEach: En,
    merge: ir,
    extend: Ku,
    trim: qu,
    stripBOM: Wu,
    inherits: zu,
    toFlatObject: Ju,
    kindOf: ps,
    kindOfTest: He,
    endsWith: Gu,
    toArray: Xu,
    forEachEntry: Zu,
    matchAll: Qu,
    isHTMLForm: ef,
    hasOwnProperty: Si,
    hasOwnProp: Si,
    reduceDescriptors: El,
    freezeMethods: sf,
    toObjectSet: rf,
    toCamelCase: tf,
    noop: of,
    toFiniteNumber: lf,
    findKey: vl,
    global: xt,
    isContextDefined: Sl,
    isSpecCompliantForm: cf,
    toJSONObject: af,
    isAsyncFn: uf,
    isThenable: ff,
    setImmediate: Tl,
    asap: df,
    isIterable: hf,
  };
function V(e, t, n, s, r) {
  Error.call(this),
    Error.captureStackTrace
      ? Error.captureStackTrace(this, this.constructor)
      : (this.stack = new Error().stack),
    (this.message = e),
    (this.name = "AxiosError"),
    t && (this.code = t),
    n && (this.config = n),
    s && (this.request = s),
    r && ((this.response = r), (this.status = r.status ? r.status : null));
}
p.inherits(V, Error, {
  toJSON: function () {
    return {
      message: this.message,
      name: this.name,
      description: this.description,
      number: this.number,
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      config: p.toJSONObject(this.config),
      code: this.code,
      status: this.status,
    };
  },
});
const Ol = V.prototype,
  Al = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL",
].forEach((e) => {
  Al[e] = { value: e };
});
Object.defineProperties(V, Al);
Object.defineProperty(Ol, "isAxiosError", { value: !0 });
V.from = (e, t, n, s, r, i) => {
  const o = Object.create(Ol);
  p.toFlatObject(
    e,
    o,
    function (a) {
      return a !== Error.prototype;
    },
    (u) => u !== "isAxiosError"
  );
  const l = e && e.message ? e.message : "Error",
    c = t == null && e ? e.code : t;
  return (
    V.call(o, l, c, n, s, r),
    e &&
      o.cause == null &&
      Object.defineProperty(o, "cause", { value: e, configurable: !0 }),
    (o.name = (e && e.name) || "Error"),
    i && Object.assign(o, i),
    o
  );
};
const pf = null;
function or(e) {
  return p.isPlainObject(e) || p.isArray(e);
}
function Rl(e) {
  return p.endsWith(e, "[]") ? e.slice(0, -2) : e;
}
function Ei(e, t, n) {
  return e
    ? e
        .concat(t)
        .map(function (r, i) {
          return (r = Rl(r)), !n && i ? "[" + r + "]" : r;
        })
        .join(n ? "." : "")
    : t;
}
function mf(e) {
  return p.isArray(e) && !e.some(or);
}
const gf = p.toFlatObject(p, {}, null, function (t) {
  return /^is[A-Z]/.test(t);
});
function gs(e, t, n) {
  if (!p.isObject(e)) throw new TypeError("target must be an object");
  (t = t || new FormData()),
    (n = p.toFlatObject(
      n,
      { metaTokens: !0, dots: !1, indexes: !1 },
      !1,
      function (y, _) {
        return !p.isUndefined(_[y]);
      }
    ));
  const s = n.metaTokens,
    r = n.visitor || a,
    i = n.dots,
    o = n.indexes,
    c = (n.Blob || (typeof Blob < "u" && Blob)) && p.isSpecCompliantForm(t);
  if (!p.isFunction(r)) throw new TypeError("visitor must be a function");
  function u(m) {
    if (m === null) return "";
    if (p.isDate(m)) return m.toISOString();
    if (p.isBoolean(m)) return m.toString();
    if (!c && p.isBlob(m))
      throw new V("Blob is not supported. Use a Buffer instead.");
    return p.isArrayBuffer(m) || p.isTypedArray(m)
      ? c && typeof Blob == "function"
        ? new Blob([m])
        : Buffer.from(m)
      : m;
  }
  function a(m, y, _) {
    let M = m;
    if (m && !_ && typeof m == "object") {
      if (p.endsWith(y, "{}"))
        (y = s ? y : y.slice(0, -2)), (m = JSON.stringify(m));
      else if (
        (p.isArray(m) && mf(m)) ||
        ((p.isFileList(m) || p.endsWith(y, "[]")) && (M = p.toArray(m)))
      )
        return (
          (y = Rl(y)),
          M.forEach(function (D, A) {
            !(p.isUndefined(D) || D === null) &&
              t.append(
                o === !0 ? Ei([y], A, i) : o === null ? y : y + "[]",
                u(D)
              );
          }),
          !1
        );
    }
    return or(m) ? !0 : (t.append(Ei(_, y, i), u(m)), !1);
  }
  const h = [],
    b = Object.assign(gf, {
      defaultVisitor: a,
      convertValue: u,
      isVisitable: or,
    });
  function w(m, y) {
    if (!p.isUndefined(m)) {
      if (h.indexOf(m) !== -1)
        throw Error("Circular reference detected in " + y.join("."));
      h.push(m),
        p.forEach(m, function (M, U) {
          (!(p.isUndefined(M) || M === null) &&
            r.call(t, M, p.isString(U) ? U.trim() : U, y, b)) === !0 &&
            w(M, y ? y.concat(U) : [U]);
        }),
        h.pop();
    }
  }
  if (!p.isObject(e)) throw new TypeError("data must be an object");
  return w(e), t;
}
function Ti(e) {
  const t = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0",
  };
  return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function (s) {
    return t[s];
  });
}
function Dr(e, t) {
  (this._pairs = []), e && gs(e, this, t);
}
const Cl = Dr.prototype;
Cl.append = function (t, n) {
  this._pairs.push([t, n]);
};
Cl.toString = function (t) {
  const n = t
    ? function (s) {
        return t.call(this, s, Ti);
      }
    : Ti;
  return this._pairs
    .map(function (r) {
      return n(r[0]) + "=" + n(r[1]);
    }, "")
    .join("&");
};
function bf(e) {
  return encodeURIComponent(e)
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",")
    .replace(/%20/g, "+");
}
function Pl(e, t, n) {
  if (!t) return e;
  const s = (n && n.encode) || bf;
  p.isFunction(n) && (n = { serialize: n });
  const r = n && n.serialize;
  let i;
  if (
    (r
      ? (i = r(t, n))
      : (i = p.isURLSearchParams(t) ? t.toString() : new Dr(t, n).toString(s)),
    i)
  ) {
    const o = e.indexOf("#");
    o !== -1 && (e = e.slice(0, o)),
      (e += (e.indexOf("?") === -1 ? "?" : "&") + i);
  }
  return e;
}
class yf {
  constructor() {
    this.handlers = [];
  }
  use(t, n, s) {
    return (
      this.handlers.push({
        fulfilled: t,
        rejected: n,
        synchronous: s ? s.synchronous : !1,
        runWhen: s ? s.runWhen : null,
      }),
      this.handlers.length - 1
    );
  }
  eject(t) {
    this.handlers[t] && (this.handlers[t] = null);
  }
  clear() {
    this.handlers && (this.handlers = []);
  }
  forEach(t) {
    p.forEach(this.handlers, function (s) {
      s !== null && t(s);
    });
  }
}
const Oi = yf,
  Ml = {
    silentJSONParsing: !0,
    forcedJSONParsing: !0,
    clarifyTimeoutError: !1,
  },
  _f = typeof URLSearchParams < "u" ? URLSearchParams : Dr,
  xf = typeof FormData < "u" ? FormData : null,
  wf = typeof Blob < "u" ? Blob : null,
  vf = {
    isBrowser: !0,
    classes: { URLSearchParams: _f, FormData: xf, Blob: wf },
    protocols: ["http", "https", "file", "blob", "url", "data"],
  },
  Lr = typeof window < "u" && typeof document < "u",
  lr = (typeof navigator == "object" && navigator) || void 0,
  Sf =
    Lr &&
    (!lr || ["ReactNative", "NativeScript", "NS"].indexOf(lr.product) < 0),
  Ef = (() =>
    typeof WorkerGlobalScope < "u" &&
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts == "function")(),
  Tf = (Lr && window.location.href) || "http://localhost",
  Of = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        hasBrowserEnv: Lr,
        hasStandardBrowserEnv: Sf,
        hasStandardBrowserWebWorkerEnv: Ef,
        navigator: lr,
        origin: Tf,
      },
      Symbol.toStringTag,
      { value: "Module" }
    )
  ),
  ve = { ...Of, ...vf };
function Af(e, t) {
  return gs(e, new ve.classes.URLSearchParams(), {
    visitor: function (n, s, r, i) {
      return ve.isNode && p.isBuffer(n)
        ? (this.append(s, n.toString("base64")), !1)
        : i.defaultVisitor.apply(this, arguments);
    },
    ...t,
  });
}
function Rf(e) {
  return p
    .matchAll(/\w+|\[(\w*)]/g, e)
    .map((t) => (t[0] === "[]" ? "" : t[1] || t[0]));
}
function Cf(e) {
  const t = {},
    n = Object.keys(e);
  let s;
  const r = n.length;
  let i;
  for (s = 0; s < r; s++) (i = n[s]), (t[i] = e[i]);
  return t;
}
function Fl(e) {
  function t(n, s, r, i) {
    let o = n[i++];
    if (o === "__proto__") return !0;
    const l = Number.isFinite(+o),
      c = i >= n.length;
    return (
      (o = !o && p.isArray(r) ? r.length : o),
      c
        ? (p.hasOwnProp(r, o) ? (r[o] = [r[o], s]) : (r[o] = s), !l)
        : ((!r[o] || !p.isObject(r[o])) && (r[o] = []),
          t(n, s, r[o], i) && p.isArray(r[o]) && (r[o] = Cf(r[o])),
          !l)
    );
  }
  if (p.isFormData(e) && p.isFunction(e.entries)) {
    const n = {};
    return (
      p.forEachEntry(e, (s, r) => {
        t(Rf(s), r, n, 0);
      }),
      n
    );
  }
  return null;
}
function Pf(e, t, n) {
  if (p.isString(e))
    try {
      return (t || JSON.parse)(e), p.trim(e);
    } catch (s) {
      if (s.name !== "SyntaxError") throw s;
    }
  return (n || JSON.stringify)(e);
}
const jr = {
  transitional: Ml,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [
    function (t, n) {
      const s = n.getContentType() || "",
        r = s.indexOf("application/json") > -1,
        i = p.isObject(t);
      if ((i && p.isHTMLForm(t) && (t = new FormData(t)), p.isFormData(t)))
        return r ? JSON.stringify(Fl(t)) : t;
      if (
        p.isArrayBuffer(t) ||
        p.isBuffer(t) ||
        p.isStream(t) ||
        p.isFile(t) ||
        p.isBlob(t) ||
        p.isReadableStream(t)
      )
        return t;
      if (p.isArrayBufferView(t)) return t.buffer;
      if (p.isURLSearchParams(t))
        return (
          n.setContentType(
            "application/x-www-form-urlencoded;charset=utf-8",
            !1
          ),
          t.toString()
        );
      let l;
      if (i) {
        if (s.indexOf("application/x-www-form-urlencoded") > -1)
          return Af(t, this.formSerializer).toString();
        if ((l = p.isFileList(t)) || s.indexOf("multipart/form-data") > -1) {
          const c = this.env && this.env.FormData;
          return gs(
            l ? { "files[]": t } : t,
            c && new c(),
            this.formSerializer
          );
        }
      }
      return i || r ? (n.setContentType("application/json", !1), Pf(t)) : t;
    },
  ],
  transformResponse: [
    function (t) {
      const n = this.transitional || jr.transitional,
        s = n && n.forcedJSONParsing,
        r = this.responseType === "json";
      if (p.isResponse(t) || p.isReadableStream(t)) return t;
      if (t && p.isString(t) && ((s && !this.responseType) || r)) {
        const o = !(n && n.silentJSONParsing) && r;
        try {
          return JSON.parse(t, this.parseReviver);
        } catch (l) {
          if (o)
            throw l.name === "SyntaxError"
              ? V.from(l, V.ERR_BAD_RESPONSE, this, null, this.response)
              : l;
        }
      }
      return t;
    },
  ],
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: { FormData: ve.classes.FormData, Blob: ve.classes.Blob },
  validateStatus: function (t) {
    return t >= 200 && t < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": void 0,
    },
  },
};
p.forEach(["delete", "get", "head", "post", "put", "patch"], (e) => {
  jr.headers[e] = {};
});
const Nr = jr,
  Mf = p.toObjectSet([
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent",
  ]),
  Ff = (e) => {
    const t = {};
    let n, s, r;
    return (
      e &&
        e
          .split(
            `
`
          )
          .forEach(function (o) {
            (r = o.indexOf(":")),
              (n = o.substring(0, r).trim().toLowerCase()),
              (s = o.substring(r + 1).trim()),
              !(!n || (t[n] && Mf[n])) &&
                (n === "set-cookie"
                  ? t[n]
                    ? t[n].push(s)
                    : (t[n] = [s])
                  : (t[n] = t[n] ? t[n] + ", " + s : s));
          }),
      t
    );
  },
  Ai = Symbol("internals");
function Qt(e) {
  return e && String(e).trim().toLowerCase();
}
function jn(e) {
  return e === !1 || e == null ? e : p.isArray(e) ? e.map(jn) : String(e);
}
function If(e) {
  const t = Object.create(null),
    n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let s;
  for (; (s = n.exec(e)); ) t[s[1]] = s[2];
  return t;
}
const Df = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());
function Ns(e, t, n, s, r) {
  if (p.isFunction(s)) return s.call(this, t, n);
  if ((r && (t = n), !!p.isString(t))) {
    if (p.isString(s)) return t.indexOf(s) !== -1;
    if (p.isRegExp(s)) return s.test(t);
  }
}
function Lf(e) {
  return e
    .trim()
    .toLowerCase()
    .replace(/([a-z\d])(\w*)/g, (t, n, s) => n.toUpperCase() + s);
}
function jf(e, t) {
  const n = p.toCamelCase(" " + t);
  ["get", "set", "has"].forEach((s) => {
    Object.defineProperty(e, s + n, {
      value: function (r, i, o) {
        return this[s].call(this, t, r, i, o);
      },
      configurable: !0,
    });
  });
}
class bs {
  constructor(t) {
    t && this.set(t);
  }
  set(t, n, s) {
    const r = this;
    function i(l, c, u) {
      const a = Qt(c);
      if (!a) throw new Error("header name must be a non-empty string");
      const h = p.findKey(r, a);
      (!h || r[h] === void 0 || u === !0 || (u === void 0 && r[h] !== !1)) &&
        (r[h || c] = jn(l));
    }
    const o = (l, c) => p.forEach(l, (u, a) => i(u, a, c));
    if (p.isPlainObject(t) || t instanceof this.constructor) o(t, n);
    else if (p.isString(t) && (t = t.trim()) && !Df(t)) o(Ff(t), n);
    else if (p.isObject(t) && p.isIterable(t)) {
      let l = {},
        c,
        u;
      for (const a of t) {
        if (!p.isArray(a))
          throw TypeError("Object iterator must return a key-value pair");
        l[(u = a[0])] = (c = l[u])
          ? p.isArray(c)
            ? [...c, a[1]]
            : [c, a[1]]
          : a[1];
      }
      o(l, n);
    } else t != null && i(n, t, s);
    return this;
  }
  get(t, n) {
    if (((t = Qt(t)), t)) {
      const s = p.findKey(this, t);
      if (s) {
        const r = this[s];
        if (!n) return r;
        if (n === !0) return If(r);
        if (p.isFunction(n)) return n.call(this, r, s);
        if (p.isRegExp(n)) return n.exec(r);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(t, n) {
    if (((t = Qt(t)), t)) {
      const s = p.findKey(this, t);
      return !!(s && this[s] !== void 0 && (!n || Ns(this, this[s], s, n)));
    }
    return !1;
  }
  delete(t, n) {
    const s = this;
    let r = !1;
    function i(o) {
      if (((o = Qt(o)), o)) {
        const l = p.findKey(s, o);
        l && (!n || Ns(s, s[l], l, n)) && (delete s[l], (r = !0));
      }
    }
    return p.isArray(t) ? t.forEach(i) : i(t), r;
  }
  clear(t) {
    const n = Object.keys(this);
    let s = n.length,
      r = !1;
    for (; s--; ) {
      const i = n[s];
      (!t || Ns(this, this[i], i, t, !0)) && (delete this[i], (r = !0));
    }
    return r;
  }
  normalize(t) {
    const n = this,
      s = {};
    return (
      p.forEach(this, (r, i) => {
        const o = p.findKey(s, i);
        if (o) {
          (n[o] = jn(r)), delete n[i];
          return;
        }
        const l = t ? Lf(i) : String(i).trim();
        l !== i && delete n[i], (n[l] = jn(r)), (s[l] = !0);
      }),
      this
    );
  }
  concat(...t) {
    return this.constructor.concat(this, ...t);
  }
  toJSON(t) {
    const n = Object.create(null);
    return (
      p.forEach(this, (s, r) => {
        s != null && s !== !1 && (n[r] = t && p.isArray(s) ? s.join(", ") : s);
      }),
      n
    );
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([t, n]) => t + ": " + n).join(`
`);
  }
  getSetCookie() {
    return this.get("set-cookie") || [];
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(t) {
    return t instanceof this ? t : new this(t);
  }
  static concat(t, ...n) {
    const s = new this(t);
    return n.forEach((r) => s.set(r)), s;
  }
  static accessor(t) {
    const s = (this[Ai] = this[Ai] = { accessors: {} }).accessors,
      r = this.prototype;
    function i(o) {
      const l = Qt(o);
      s[l] || (jf(r, o), (s[l] = !0));
    }
    return p.isArray(t) ? t.forEach(i) : i(t), this;
  }
}
bs.accessor([
  "Content-Type",
  "Content-Length",
  "Accept",
  "Accept-Encoding",
  "User-Agent",
  "Authorization",
]);
p.reduceDescriptors(bs.prototype, ({ value: e }, t) => {
  let n = t[0].toUpperCase() + t.slice(1);
  return {
    get: () => e,
    set(s) {
      this[n] = s;
    },
  };
});
p.freezeMethods(bs);
const ke = bs;
function Us(e, t) {
  const n = this || Nr,
    s = t || n,
    r = ke.from(s.headers);
  let i = s.data;
  return (
    p.forEach(e, function (l) {
      i = l.call(n, i, r.normalize(), t ? t.status : void 0);
    }),
    r.normalize(),
    i
  );
}
function Il(e) {
  return !!(e && e.__CANCEL__);
}
function Jt(e, t, n) {
  V.call(this, e ?? "canceled", V.ERR_CANCELED, t, n),
    (this.name = "CanceledError");
}
p.inherits(Jt, V, { __CANCEL__: !0 });
function Dl(e, t, n) {
  const s = n.config.validateStatus;
  !n.status || !s || s(n.status)
    ? e(n)
    : t(
        new V(
          "Request failed with status code " + n.status,
          [V.ERR_BAD_REQUEST, V.ERR_BAD_RESPONSE][
            Math.floor(n.status / 100) - 4
          ],
          n.config,
          n.request,
          n
        )
      );
}
function Nf(e) {
  const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
  return (t && t[1]) || "";
}
function Uf(e, t) {
  e = e || 10;
  const n = new Array(e),
    s = new Array(e);
  let r = 0,
    i = 0,
    o;
  return (
    (t = t !== void 0 ? t : 1e3),
    function (c) {
      const u = Date.now(),
        a = s[i];
      o || (o = u), (n[r] = c), (s[r] = u);
      let h = i,
        b = 0;
      for (; h !== r; ) (b += n[h++]), (h = h % e);
      if (((r = (r + 1) % e), r === i && (i = (i + 1) % e), u - o < t)) return;
      const w = a && u - a;
      return w ? Math.round((b * 1e3) / w) : void 0;
    }
  );
}
function $f(e, t) {
  let n = 0,
    s = 1e3 / t,
    r,
    i;
  const o = (u, a = Date.now()) => {
    (n = a), (r = null), i && (clearTimeout(i), (i = null)), e(...u);
  };
  return [
    (...u) => {
      const a = Date.now(),
        h = a - n;
      h >= s
        ? o(u, a)
        : ((r = u),
          i ||
            (i = setTimeout(() => {
              (i = null), o(r);
            }, s - h)));
    },
    () => r && o(r),
  ];
}
const Xn = (e, t, n = 3) => {
    let s = 0;
    const r = Uf(50, 250);
    return $f((i) => {
      const o = i.loaded,
        l = i.lengthComputable ? i.total : void 0,
        c = o - s,
        u = r(c),
        a = o <= l;
      s = o;
      const h = {
        loaded: o,
        total: l,
        progress: l ? o / l : void 0,
        bytes: c,
        rate: u || void 0,
        estimated: u && l && a ? (l - o) / u : void 0,
        event: i,
        lengthComputable: l != null,
        [t ? "download" : "upload"]: !0,
      };
      e(h);
    }, n);
  },
  Ri = (e, t) => {
    const n = e != null;
    return [(s) => t[0]({ lengthComputable: n, total: e, loaded: s }), t[1]];
  },
  Ci =
    (e) =>
    (...t) =>
      p.asap(() => e(...t)),
  Bf = ve.hasStandardBrowserEnv
    ? ((e, t) => (n) => (
        (n = new URL(n, ve.origin)),
        e.protocol === n.protocol &&
          e.host === n.host &&
          (t || e.port === n.port)
      ))(
        new URL(ve.origin),
        ve.navigator && /(msie|trident)/i.test(ve.navigator.userAgent)
      )
    : () => !0,
  kf = ve.hasStandardBrowserEnv
    ? {
        write(e, t, n, s, r, i) {
          const o = [e + "=" + encodeURIComponent(t)];
          p.isNumber(n) && o.push("expires=" + new Date(n).toGMTString()),
            p.isString(s) && o.push("path=" + s),
            p.isString(r) && o.push("domain=" + r),
            i === !0 && o.push("secure"),
            (document.cookie = o.join("; "));
        },
        read(e) {
          const t = document.cookie.match(
            new RegExp("(^|;\\s*)(" + e + ")=([^;]*)")
          );
          return t ? decodeURIComponent(t[3]) : null;
        },
        remove(e) {
          this.write(e, "", Date.now() - 864e5);
        },
      }
    : {
        write() {},
        read() {
          return null;
        },
        remove() {},
      };
function Hf(e) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
}
function Vf(e, t) {
  return t ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "") : e;
}
function Ll(e, t, n) {
  let s = !Hf(t);
  return e && (s || n == !1) ? Vf(e, t) : t;
}
const Pi = (e) => (e instanceof ke ? { ...e } : e);
function Tt(e, t) {
  t = t || {};
  const n = {};
  function s(u, a, h, b) {
    return p.isPlainObject(u) && p.isPlainObject(a)
      ? p.merge.call({ caseless: b }, u, a)
      : p.isPlainObject(a)
      ? p.merge({}, a)
      : p.isArray(a)
      ? a.slice()
      : a;
  }
  function r(u, a, h, b) {
    if (p.isUndefined(a)) {
      if (!p.isUndefined(u)) return s(void 0, u, h, b);
    } else return s(u, a, h, b);
  }
  function i(u, a) {
    if (!p.isUndefined(a)) return s(void 0, a);
  }
  function o(u, a) {
    if (p.isUndefined(a)) {
      if (!p.isUndefined(u)) return s(void 0, u);
    } else return s(void 0, a);
  }
  function l(u, a, h) {
    if (h in t) return s(u, a);
    if (h in e) return s(void 0, u);
  }
  const c = {
    url: i,
    method: i,
    data: i,
    baseURL: o,
    transformRequest: o,
    transformResponse: o,
    paramsSerializer: o,
    timeout: o,
    timeoutMessage: o,
    withCredentials: o,
    withXSRFToken: o,
    adapter: o,
    responseType: o,
    xsrfCookieName: o,
    xsrfHeaderName: o,
    onUploadProgress: o,
    onDownloadProgress: o,
    decompress: o,
    maxContentLength: o,
    maxBodyLength: o,
    beforeRedirect: o,
    transport: o,
    httpAgent: o,
    httpsAgent: o,
    cancelToken: o,
    socketPath: o,
    responseEncoding: o,
    validateStatus: l,
    headers: (u, a, h) => r(Pi(u), Pi(a), h, !0),
  };
  return (
    p.forEach(Object.keys({ ...e, ...t }), function (a) {
      const h = c[a] || r,
        b = h(e[a], t[a], a);
      (p.isUndefined(b) && h !== l) || (n[a] = b);
    }),
    n
  );
}
const jl = (e) => {
    const t = Tt({}, e);
    let {
      data: n,
      withXSRFToken: s,
      xsrfHeaderName: r,
      xsrfCookieName: i,
      headers: o,
      auth: l,
    } = t;
    if (
      ((t.headers = o = ke.from(o)),
      (t.url = Pl(
        Ll(t.baseURL, t.url, t.allowAbsoluteUrls),
        e.params,
        e.paramsSerializer
      )),
      l &&
        o.set(
          "Authorization",
          "Basic " +
            btoa(
              (l.username || "") +
                ":" +
                (l.password ? unescape(encodeURIComponent(l.password)) : "")
            )
        ),
      p.isFormData(n))
    ) {
      if (ve.hasStandardBrowserEnv || ve.hasStandardBrowserWebWorkerEnv)
        o.setContentType(void 0);
      else if (p.isFunction(n.getHeaders)) {
        const c = n.getHeaders(),
          u = ["content-type", "content-length"];
        Object.entries(c).forEach(([a, h]) => {
          u.includes(a.toLowerCase()) && o.set(a, h);
        });
      }
    }
    if (
      ve.hasStandardBrowserEnv &&
      (s && p.isFunction(s) && (s = s(t)), s || (s !== !1 && Bf(t.url)))
    ) {
      const c = r && i && kf.read(i);
      c && o.set(r, c);
    }
    return t;
  },
  qf = typeof XMLHttpRequest < "u",
  Kf =
    qf &&
    function (e) {
      return new Promise(function (n, s) {
        const r = jl(e);
        let i = r.data;
        const o = ke.from(r.headers).normalize();
        let { responseType: l, onUploadProgress: c, onDownloadProgress: u } = r,
          a,
          h,
          b,
          w,
          m;
        function y() {
          w && w(),
            m && m(),
            r.cancelToken && r.cancelToken.unsubscribe(a),
            r.signal && r.signal.removeEventListener("abort", a);
        }
        let _ = new XMLHttpRequest();
        _.open(r.method.toUpperCase(), r.url, !0), (_.timeout = r.timeout);
        function M() {
          if (!_) return;
          const D = ke.from(
              "getAllResponseHeaders" in _ && _.getAllResponseHeaders()
            ),
            j = {
              data:
                !l || l === "text" || l === "json"
                  ? _.responseText
                  : _.response,
              status: _.status,
              statusText: _.statusText,
              headers: D,
              config: e,
              request: _,
            };
          Dl(
            function (L) {
              n(L), y();
            },
            function (L) {
              s(L), y();
            },
            j
          ),
            (_ = null);
        }
        "onloadend" in _
          ? (_.onloadend = M)
          : (_.onreadystatechange = function () {
              !_ ||
                _.readyState !== 4 ||
                (_.status === 0 &&
                  !(_.responseURL && _.responseURL.indexOf("file:") === 0)) ||
                setTimeout(M);
            }),
          (_.onabort = function () {
            _ &&
              (s(new V("Request aborted", V.ECONNABORTED, e, _)), (_ = null));
          }),
          (_.onerror = function (A) {
            const j = A && A.message ? A.message : "Network Error",
              ee = new V(j, V.ERR_NETWORK, e, _);
            (ee.event = A || null), s(ee), (_ = null);
          }),
          (_.ontimeout = function () {
            let A = r.timeout
              ? "timeout of " + r.timeout + "ms exceeded"
              : "timeout exceeded";
            const j = r.transitional || Ml;
            r.timeoutErrorMessage && (A = r.timeoutErrorMessage),
              s(
                new V(
                  A,
                  j.clarifyTimeoutError ? V.ETIMEDOUT : V.ECONNABORTED,
                  e,
                  _
                )
              ),
              (_ = null);
          }),
          i === void 0 && o.setContentType(null),
          "setRequestHeader" in _ &&
            p.forEach(o.toJSON(), function (A, j) {
              _.setRequestHeader(j, A);
            }),
          p.isUndefined(r.withCredentials) ||
            (_.withCredentials = !!r.withCredentials),
          l && l !== "json" && (_.responseType = r.responseType),
          u && (([b, m] = Xn(u, !0)), _.addEventListener("progress", b)),
          c &&
            _.upload &&
            (([h, w] = Xn(c)),
            _.upload.addEventListener("progress", h),
            _.upload.addEventListener("loadend", w)),
          (r.cancelToken || r.signal) &&
            ((a = (D) => {
              _ &&
                (s(!D || D.type ? new Jt(null, e, _) : D),
                _.abort(),
                (_ = null));
            }),
            r.cancelToken && r.cancelToken.subscribe(a),
            r.signal &&
              (r.signal.aborted ? a() : r.signal.addEventListener("abort", a)));
        const U = Nf(r.url);
        if (U && ve.protocols.indexOf(U) === -1) {
          s(new V("Unsupported protocol " + U + ":", V.ERR_BAD_REQUEST, e));
          return;
        }
        _.send(i || null);
      });
    },
  Wf = (e, t) => {
    const { length: n } = (e = e ? e.filter(Boolean) : []);
    if (t || n) {
      let s = new AbortController(),
        r;
      const i = function (u) {
        if (!r) {
          (r = !0), l();
          const a = u instanceof Error ? u : this.reason;
          s.abort(
            a instanceof V ? a : new Jt(a instanceof Error ? a.message : a)
          );
        }
      };
      let o =
        t &&
        setTimeout(() => {
          (o = null), i(new V(`timeout ${t} of ms exceeded`, V.ETIMEDOUT));
        }, t);
      const l = () => {
        e &&
          (o && clearTimeout(o),
          (o = null),
          e.forEach((u) => {
            u.unsubscribe
              ? u.unsubscribe(i)
              : u.removeEventListener("abort", i);
          }),
          (e = null));
      };
      e.forEach((u) => u.addEventListener("abort", i));
      const { signal: c } = s;
      return (c.unsubscribe = () => p.asap(l)), c;
    }
  },
  zf = Wf,
  Jf = function* (e, t) {
    let n = e.byteLength;
    if (!t || n < t) {
      yield e;
      return;
    }
    let s = 0,
      r;
    for (; s < n; ) (r = s + t), yield e.slice(s, r), (s = r);
  },
  Gf = async function* (e, t) {
    for await (const n of Xf(e)) yield* Jf(n, t);
  },
  Xf = async function* (e) {
    if (e[Symbol.asyncIterator]) {
      yield* e;
      return;
    }
    const t = e.getReader();
    try {
      for (;;) {
        const { done: n, value: s } = await t.read();
        if (n) break;
        yield s;
      }
    } finally {
      await t.cancel();
    }
  },
  Mi = (e, t, n, s) => {
    const r = Gf(e, t);
    let i = 0,
      o,
      l = (c) => {
        o || ((o = !0), s && s(c));
      };
    return new ReadableStream(
      {
        async pull(c) {
          try {
            const { done: u, value: a } = await r.next();
            if (u) {
              l(), c.close();
              return;
            }
            let h = a.byteLength;
            if (n) {
              let b = (i += h);
              n(b);
            }
            c.enqueue(new Uint8Array(a));
          } catch (u) {
            throw (l(u), u);
          }
        },
        cancel(c) {
          return l(c), r.return();
        },
      },
      { highWaterMark: 2 }
    );
  },
  Fi = 64 * 1024,
  { isFunction: Mn } = p,
  Yf = (({ Request: e, Response: t }) => ({ Request: e, Response: t }))(
    p.global
  ),
  { ReadableStream: Ii, TextEncoder: Di } = p.global,
  Li = (e, ...t) => {
    try {
      return !!e(...t);
    } catch {
      return !1;
    }
  },
  Zf = (e) => {
    e = p.merge.call({ skipUndefined: !0 }, Yf, e);
    const { fetch: t, Request: n, Response: s } = e,
      r = t ? Mn(t) : typeof fetch == "function",
      i = Mn(n),
      o = Mn(s);
    if (!r) return !1;
    const l = r && Mn(Ii),
      c =
        r &&
        (typeof Di == "function"
          ? (
              (m) => (y) =>
                m.encode(y)
            )(new Di())
          : async (m) => new Uint8Array(await new n(m).arrayBuffer())),
      u =
        i &&
        l &&
        Li(() => {
          let m = !1;
          const y = new n(ve.origin, {
            body: new Ii(),
            method: "POST",
            get duplex() {
              return (m = !0), "half";
            },
          }).headers.has("Content-Type");
          return m && !y;
        }),
      a = o && l && Li(() => p.isReadableStream(new s("").body)),
      h = { stream: a && ((m) => m.body) };
    r &&
      ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((m) => {
        !h[m] &&
          (h[m] = (y, _) => {
            let M = y && y[m];
            if (M) return M.call(y);
            throw new V(
              `Response type '${m}' is not supported`,
              V.ERR_NOT_SUPPORT,
              _
            );
          });
      });
    const b = async (m) => {
        if (m == null) return 0;
        if (p.isBlob(m)) return m.size;
        if (p.isSpecCompliantForm(m))
          return (
            await new n(ve.origin, { method: "POST", body: m }).arrayBuffer()
          ).byteLength;
        if (p.isArrayBufferView(m) || p.isArrayBuffer(m)) return m.byteLength;
        if ((p.isURLSearchParams(m) && (m = m + ""), p.isString(m)))
          return (await c(m)).byteLength;
      },
      w = async (m, y) => {
        const _ = p.toFiniteNumber(m.getContentLength());
        return _ ?? b(y);
      };
    return async (m) => {
      let {
          url: y,
          method: _,
          data: M,
          signal: U,
          cancelToken: D,
          timeout: A,
          onDownloadProgress: j,
          onUploadProgress: ee,
          responseType: L,
          headers: P,
          withCredentials: $ = "same-origin",
          fetchOptions: H,
        } = jl(m),
        ce = t || fetch;
      L = L ? (L + "").toLowerCase() : "text";
      let le = zf([U, D && D.toAbortSignal()], A),
        ge = null;
      const Ce =
        le &&
        le.unsubscribe &&
        (() => {
          le.unsubscribe();
        });
      let gt;
      try {
        if (
          ee &&
          u &&
          _ !== "get" &&
          _ !== "head" &&
          (gt = await w(P, M)) !== 0
        ) {
          let be = new n(y, { method: "POST", body: M, duplex: "half" }),
            pe;
          if (
            (p.isFormData(M) &&
              (pe = be.headers.get("content-type")) &&
              P.setContentType(pe),
            be.body)
          ) {
            const [Ct, Pt] = Ri(gt, Xn(Ci(ee)));
            M = Mi(be.body, Fi, Ct, Pt);
          }
        }
        p.isString($) || ($ = $ ? "include" : "omit");
        const X = i && "credentials" in n.prototype,
          W = {
            ...H,
            signal: le,
            method: _.toUpperCase(),
            headers: P.normalize().toJSON(),
            body: M,
            duplex: "half",
            credentials: X ? $ : void 0,
          };
        ge = i && new n(y, W);
        let J = await (i ? ce(ge, H) : ce(y, W));
        const Ve = a && (L === "stream" || L === "response");
        if (a && (j || (Ve && Ce))) {
          const be = {};
          ["status", "statusText", "headers"].forEach((On) => {
            be[On] = J[On];
          });
          const pe = p.toFiniteNumber(J.headers.get("content-length")),
            [Ct, Pt] = (j && Ri(pe, Xn(Ci(j), !0))) || [];
          J = new s(
            Mi(J.body, Fi, Ct, () => {
              Pt && Pt(), Ce && Ce();
            }),
            be
          );
        }
        L = L || "text";
        let Rt = await h[p.findKey(h, L) || "text"](J, m);
        return (
          !Ve && Ce && Ce(),
          await new Promise((be, pe) => {
            Dl(be, pe, {
              data: Rt,
              headers: ke.from(J.headers),
              status: J.status,
              statusText: J.statusText,
              config: m,
              request: ge,
            });
          })
        );
      } catch (X) {
        throw (
          (Ce && Ce(),
          X && X.name === "TypeError" && /Load failed|fetch/i.test(X.message)
            ? Object.assign(new V("Network Error", V.ERR_NETWORK, m, ge), {
                cause: X.cause || X,
              })
            : V.from(X, X && X.code, m, ge))
        );
      }
    };
  },
  Qf = new Map(),
  Nl = (e) => {
    let t = e ? e.env : {};
    const { fetch: n, Request: s, Response: r } = t,
      i = [s, r, n];
    let o = i.length,
      l = o,
      c,
      u,
      a = Qf;
    for (; l--; )
      (c = i[l]),
        (u = a.get(c)),
        u === void 0 && a.set(c, (u = l ? new Map() : Zf(t))),
        (a = u);
    return u;
  };
Nl();
const cr = { http: pf, xhr: Kf, fetch: { get: Nl } };
p.forEach(cr, (e, t) => {
  if (e) {
    try {
      Object.defineProperty(e, "name", { value: t });
    } catch {}
    Object.defineProperty(e, "adapterName", { value: t });
  }
});
const ji = (e) => `- ${e}`,
  ed = (e) => p.isFunction(e) || e === null || e === !1,
  Ul = {
    getAdapter: (e, t) => {
      e = p.isArray(e) ? e : [e];
      const { length: n } = e;
      let s, r;
      const i = {};
      for (let o = 0; o < n; o++) {
        s = e[o];
        let l;
        if (
          ((r = s),
          !ed(s) && ((r = cr[(l = String(s)).toLowerCase()]), r === void 0))
        )
          throw new V(`Unknown adapter '${l}'`);
        if (r && (p.isFunction(r) || (r = r.get(t)))) break;
        i[l || "#" + o] = r;
      }
      if (!r) {
        const o = Object.entries(i).map(
          ([c, u]) =>
            `adapter ${c} ` +
            (u === !1
              ? "is not supported by the environment"
              : "is not available in the build")
        );
        let l = n
          ? o.length > 1
            ? `since :
` +
              o.map(ji).join(`
`)
            : " " + ji(o[0])
          : "as no adapter specified";
        throw new V(
          "There is no suitable adapter to dispatch the request " + l,
          "ERR_NOT_SUPPORT"
        );
      }
      return r;
    },
    adapters: cr,
  };
function $s(e) {
  if (
    (e.cancelToken && e.cancelToken.throwIfRequested(),
    e.signal && e.signal.aborted)
  )
    throw new Jt(null, e);
}
function Ni(e) {
  return (
    $s(e),
    (e.headers = ke.from(e.headers)),
    (e.data = Us.call(e, e.transformRequest)),
    ["post", "put", "patch"].indexOf(e.method) !== -1 &&
      e.headers.setContentType("application/x-www-form-urlencoded", !1),
    Ul.getAdapter(
      e.adapter || Nr.adapter,
      e
    )(e).then(
      function (s) {
        return (
          $s(e),
          (s.data = Us.call(e, e.transformResponse, s)),
          (s.headers = ke.from(s.headers)),
          s
        );
      },
      function (s) {
        return (
          Il(s) ||
            ($s(e),
            s &&
              s.response &&
              ((s.response.data = Us.call(e, e.transformResponse, s.response)),
              (s.response.headers = ke.from(s.response.headers)))),
          Promise.reject(s)
        );
      }
    )
  );
}
const $l = "1.12.2",
  ys = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach(
  (e, t) => {
    ys[e] = function (s) {
      return typeof s === e || "a" + (t < 1 ? "n " : " ") + e;
    };
  }
);
const Ui = {};
ys.transitional = function (t, n, s) {
  function r(i, o) {
    return (
      "[Axios v" +
      $l +
      "] Transitional option '" +
      i +
      "'" +
      o +
      (s ? ". " + s : "")
    );
  }
  return (i, o, l) => {
    if (t === !1)
      throw new V(
        r(o, " has been removed" + (n ? " in " + n : "")),
        V.ERR_DEPRECATED
      );
    return (
      n &&
        !Ui[o] &&
        ((Ui[o] = !0),
        console.warn(
          r(
            o,
            " has been deprecated since v" +
              n +
              " and will be removed in the near future"
          )
        )),
      t ? t(i, o, l) : !0
    );
  };
};
ys.spelling = function (t) {
  return (n, s) => (console.warn(`${s} is likely a misspelling of ${t}`), !0);
};
function td(e, t, n) {
  if (typeof e != "object")
    throw new V("options must be an object", V.ERR_BAD_OPTION_VALUE);
  const s = Object.keys(e);
  let r = s.length;
  for (; r-- > 0; ) {
    const i = s[r],
      o = t[i];
    if (o) {
      const l = e[i],
        c = l === void 0 || o(l, i, e);
      if (c !== !0)
        throw new V("option " + i + " must be " + c, V.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (n !== !0) throw new V("Unknown option " + i, V.ERR_BAD_OPTION);
  }
}
const Nn = { assertOptions: td, validators: ys },
  We = Nn.validators;
class Yn {
  constructor(t) {
    (this.defaults = t || {}),
      (this.interceptors = { request: new Oi(), response: new Oi() });
  }
  async request(t, n) {
    try {
      return await this._request(t, n);
    } catch (s) {
      if (s instanceof Error) {
        let r = {};
        Error.captureStackTrace
          ? Error.captureStackTrace(r)
          : (r = new Error());
        const i = r.stack ? r.stack.replace(/^.+\n/, "") : "";
        try {
          s.stack
            ? i &&
              !String(s.stack).endsWith(i.replace(/^.+\n.+\n/, "")) &&
              (s.stack +=
                `
` + i)
            : (s.stack = i);
        } catch {}
      }
      throw s;
    }
  }
  _request(t, n) {
    typeof t == "string" ? ((n = n || {}), (n.url = t)) : (n = t || {}),
      (n = Tt(this.defaults, n));
    const { transitional: s, paramsSerializer: r, headers: i } = n;
    s !== void 0 &&
      Nn.assertOptions(
        s,
        {
          silentJSONParsing: We.transitional(We.boolean),
          forcedJSONParsing: We.transitional(We.boolean),
          clarifyTimeoutError: We.transitional(We.boolean),
        },
        !1
      ),
      r != null &&
        (p.isFunction(r)
          ? (n.paramsSerializer = { serialize: r })
          : Nn.assertOptions(
              r,
              { encode: We.function, serialize: We.function },
              !0
            )),
      n.allowAbsoluteUrls !== void 0 ||
        (this.defaults.allowAbsoluteUrls !== void 0
          ? (n.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls)
          : (n.allowAbsoluteUrls = !0)),
      Nn.assertOptions(
        n,
        {
          baseUrl: We.spelling("baseURL"),
          withXsrfToken: We.spelling("withXSRFToken"),
        },
        !0
      ),
      (n.method = (n.method || this.defaults.method || "get").toLowerCase());
    let o = i && p.merge(i.common, i[n.method]);
    i &&
      p.forEach(
        ["delete", "get", "head", "post", "put", "patch", "common"],
        (m) => {
          delete i[m];
        }
      ),
      (n.headers = ke.concat(o, i));
    const l = [];
    let c = !0;
    this.interceptors.request.forEach(function (y) {
      (typeof y.runWhen == "function" && y.runWhen(n) === !1) ||
        ((c = c && y.synchronous), l.unshift(y.fulfilled, y.rejected));
    });
    const u = [];
    this.interceptors.response.forEach(function (y) {
      u.push(y.fulfilled, y.rejected);
    });
    let a,
      h = 0,
      b;
    if (!c) {
      const m = [Ni.bind(this), void 0];
      for (
        m.unshift(...l), m.push(...u), b = m.length, a = Promise.resolve(n);
        h < b;

      )
        a = a.then(m[h++], m[h++]);
      return a;
    }
    b = l.length;
    let w = n;
    for (; h < b; ) {
      const m = l[h++],
        y = l[h++];
      try {
        w = m(w);
      } catch (_) {
        y.call(this, _);
        break;
      }
    }
    try {
      a = Ni.call(this, w);
    } catch (m) {
      return Promise.reject(m);
    }
    for (h = 0, b = u.length; h < b; ) a = a.then(u[h++], u[h++]);
    return a;
  }
  getUri(t) {
    t = Tt(this.defaults, t);
    const n = Ll(t.baseURL, t.url, t.allowAbsoluteUrls);
    return Pl(n, t.params, t.paramsSerializer);
  }
}
p.forEach(["delete", "get", "head", "options"], function (t) {
  Yn.prototype[t] = function (n, s) {
    return this.request(
      Tt(s || {}, { method: t, url: n, data: (s || {}).data })
    );
  };
});
p.forEach(["post", "put", "patch"], function (t) {
  function n(s) {
    return function (i, o, l) {
      return this.request(
        Tt(l || {}, {
          method: t,
          headers: s ? { "Content-Type": "multipart/form-data" } : {},
          url: i,
          data: o,
        })
      );
    };
  }
  (Yn.prototype[t] = n()), (Yn.prototype[t + "Form"] = n(!0));
});
const Un = Yn;
class Ur {
  constructor(t) {
    if (typeof t != "function")
      throw new TypeError("executor must be a function.");
    let n;
    this.promise = new Promise(function (i) {
      n = i;
    });
    const s = this;
    this.promise.then((r) => {
      if (!s._listeners) return;
      let i = s._listeners.length;
      for (; i-- > 0; ) s._listeners[i](r);
      s._listeners = null;
    }),
      (this.promise.then = (r) => {
        let i;
        const o = new Promise((l) => {
          s.subscribe(l), (i = l);
        }).then(r);
        return (
          (o.cancel = function () {
            s.unsubscribe(i);
          }),
          o
        );
      }),
      t(function (i, o, l) {
        s.reason || ((s.reason = new Jt(i, o, l)), n(s.reason));
      });
  }
  throwIfRequested() {
    if (this.reason) throw this.reason;
  }
  subscribe(t) {
    if (this.reason) {
      t(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(t) : (this._listeners = [t]);
  }
  unsubscribe(t) {
    if (!this._listeners) return;
    const n = this._listeners.indexOf(t);
    n !== -1 && this._listeners.splice(n, 1);
  }
  toAbortSignal() {
    const t = new AbortController(),
      n = (s) => {
        t.abort(s);
      };
    return (
      this.subscribe(n),
      (t.signal.unsubscribe = () => this.unsubscribe(n)),
      t.signal
    );
  }
  static source() {
    let t;
    return {
      token: new Ur(function (r) {
        t = r;
      }),
      cancel: t,
    };
  }
}
const nd = Ur;
function sd(e) {
  return function (n) {
    return e.apply(null, n);
  };
}
function rd(e) {
  return p.isObject(e) && e.isAxiosError === !0;
}
const ar = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};
Object.entries(ar).forEach(([e, t]) => {
  ar[t] = e;
});
const id = ar;
function Bl(e) {
  const t = new Un(e),
    n = yl(Un.prototype.request, t);
  return (
    p.extend(n, Un.prototype, t, { allOwnKeys: !0 }),
    p.extend(n, t, null, { allOwnKeys: !0 }),
    (n.create = function (r) {
      return Bl(Tt(e, r));
    }),
    n
  );
}
const fe = Bl(Nr);
fe.Axios = Un;
fe.CanceledError = Jt;
fe.CancelToken = nd;
fe.isCancel = Il;
fe.VERSION = $l;
fe.toFormData = gs;
fe.AxiosError = V;
fe.Cancel = fe.CanceledError;
fe.all = function (t) {
  return Promise.all(t);
};
fe.spread = sd;
fe.isAxiosError = rd;
fe.mergeConfig = Tt;
fe.AxiosHeaders = ke;
fe.formToJSON = (e) => Fl(p.isHTMLForm(e) ? new FormData(e) : e);
fe.getAdapter = Ul.getAdapter;
fe.HttpStatusCode = id;
fe.default = fe;
const od = fe,
  $r = od.create({ baseURL: {}.VITE_API_BASE_URL || "http://localhost:5001" });
async function ld(e) {
  const { data: t } = await $r.post("/api/start", e);
  return t;
}
async function cd(e) {
  const { data: t } = await $r.post("/api/next", e);
  return t;
}
async function ad(e) {
  const { data: t } = await $r.get(`/api/state/${e}`);
  return t;
}
function ud(e) {
  return {
    sessionId: e.sessionId,
    theme: e.theme,
    length: e.length,
    turn: e.turn,
    maxTurns: e.maxTurns,
    status: e.status,
    storyLog: e.storyLog,
    latest: e.latest,
    progress: e.progress ?? 0,
    keyPoints: e.keyPoints ?? [],
    pendingThreads: e.pendingThreads ?? [],
    tone: e.tone ?? "",
  };
}
const Tn = Au("game", {
  state: () => ({
    sessionId: "",
    theme: "wuxia",
    length: "short",
    turn: 0,
    maxTurns: 0,
    status: "idle",
    storyLog: [],
    latest: null,
    progress: 0,
    keyPoints: [],
    pendingThreads: [],
    tone: "",
    loading: !1,
    error: null,
  }),
  getters: {
    isReady(e) {
      return !!e.sessionId;
    },
    isActive(e) {
      return e.status === "in-progress";
    },
    isComplete(e) {
      return e.status === "completed";
    },
    progressLabel(e) {
      return Math.max(0, Math.min(100, Math.round(e.progress)));
    },
  },
  actions: {
    async startNewGame(e) {
      (this.loading = !0), (this.error = null);
      try {
        const t = await ld(e);
        this.assignPayload(t);
      } catch (t) {
        this.captureError(t);
      } finally {
        this.loading = !1;
      }
    },
    async submitInput(e) {
      if (!(!this.sessionId || this.loading)) {
        (this.loading = !0), (this.error = null);
        try {
          const t = await cd({ sessionId: this.sessionId, userInput: e });
          this.assignPayload(t);
        } catch (t) {
          this.captureError(t);
        } finally {
          this.loading = !1;
        }
      }
    },
    async refreshState() {
      if (this.sessionId) {
        (this.loading = !0), (this.error = null);
        try {
          const e = await ad(this.sessionId);
          this.assignPayload(e);
        } catch (e) {
          this.captureError(e);
        } finally {
          this.loading = !1;
        }
      }
    },
    resetGame() {
      (this.sessionId = ""),
        (this.turn = 0),
        (this.maxTurns = 0),
        (this.storyLog = []),
        (this.latest = null),
        (this.status = "idle"),
        (this.progress = 0),
        (this.keyPoints = []),
        (this.pendingThreads = []),
        (this.tone = ""),
        (this.error = null);
    },
    assignPayload(e) {
      const t = ud(e);
      (this.sessionId = t.sessionId),
        (this.theme = t.theme),
        (this.length = t.length),
        (this.turn = t.turn),
        (this.maxTurns = t.maxTurns),
        (this.status = t.status),
        (this.storyLog = t.storyLog),
        (this.latest = t.latest),
        (this.progress = t.progress),
        (this.keyPoints = t.keyPoints),
        (this.pendingThreads = t.pendingThreads),
        (this.tone = t.tone);
    },
    captureError(e) {
      e instanceof Error
        ? (this.error = e.message)
        : typeof e == "string"
        ? (this.error = e)
        : (this.error = "發生未知錯誤，請稍後再試。");
    },
  },
});
function kl(e, t) {
  e.indexOf(t) === -1 && e.push(t);
}
function fd(e, t) {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
const Hl = (e, t, n) => Math.min(Math.max(n, e), t),
  Ue = { duration: 0.3, delay: 0, endDelay: 0, repeat: 0, easing: "ease" },
  bn = (e) => typeof e == "number",
  Ht = (e) => Array.isArray(e) && !bn(e[0]),
  dd = (e, t, n) => {
    const s = t - e;
    return ((((n - e) % s) + s) % s) + e;
  };
function hd(e, t) {
  return Ht(e) ? e[dd(0, e.length, t)] : e;
}
const Vl = (e, t, n) => -n * e + n * t + e,
  ql = () => {},
  at = (e) => e,
  Br = (e, t, n) => (t - e === 0 ? 1 : (n - e) / (t - e));
function Kl(e, t) {
  const n = e[e.length - 1];
  for (let s = 1; s <= t; s++) {
    const r = Br(0, t, s);
    e.push(Vl(n, 1, r));
  }
}
function pd(e) {
  const t = [0];
  return Kl(t, e - 1), t;
}
function md(e) {
  let t =
      arguments.length > 1 && arguments[1] !== void 0
        ? arguments[1]
        : pd(e.length),
    n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : at;
  const s = e.length,
    r = s - t.length;
  return (
    r > 0 && Kl(t, r),
    (i) => {
      let o = 0;
      for (; o < s - 2 && !(i < t[o + 1]); o++);
      let l = Hl(0, 1, Br(t[o], t[o + 1], i));
      return (l = hd(n, o)(l)), Vl(e[o], e[o + 1], l);
    }
  );
}
const Wl = (e) => Array.isArray(e) && bn(e[0]),
  ur = (e) => typeof e == "object" && !!e.createAnimation,
  yn = (e) => typeof e == "function",
  gd = (e) => typeof e == "string",
  Bs = { ms: (e) => e * 1e3, s: (e) => e / 1e3 },
  zl = (e, t, n) =>
    (((1 - 3 * n + 3 * t) * e + (3 * n - 6 * t)) * e + 3 * t) * e,
  bd = 1e-7,
  yd = 12;
function _d(e, t, n, s, r) {
  let i,
    o,
    l = 0;
  do (o = t + (n - t) / 2), (i = zl(o, s, r) - e), i > 0 ? (n = o) : (t = o);
  while (Math.abs(i) > bd && ++l < yd);
  return o;
}
function tn(e, t, n, s) {
  if (e === t && n === s) return at;
  const r = (i) => _d(i, 0, 1, e, n);
  return (i) => (i === 0 || i === 1 ? i : zl(r(i), t, s));
}
const xd = function (e) {
    let t =
      arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "end";
    return (n) => {
      n = t === "end" ? Math.min(n, 0.999) : Math.max(n, 0.001);
      const s = n * e,
        r = t === "end" ? Math.floor(s) : Math.ceil(s);
      return Hl(0, 1, r / e);
    };
  },
  $i = {
    ease: tn(0.25, 0.1, 0.25, 1),
    "ease-in": tn(0.42, 0, 1, 1),
    "ease-in-out": tn(0.42, 0, 0.58, 1),
    "ease-out": tn(0, 0, 0.58, 1),
  },
  wd = /\((.*?)\)/;
function Bi(e) {
  if (yn(e)) return e;
  if (Wl(e)) return tn(...e);
  if ($i[e]) return $i[e];
  if (e.startsWith("steps")) {
    const t = wd.exec(e);
    if (t) {
      const n = t[1].split(",");
      return xd(parseFloat(n[0]), n[1].trim());
    }
  }
  return at;
}
class vd {
  constructor(t) {
    let n =
        arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [0, 1],
      {
        easing: s,
        duration: r = Ue.duration,
        delay: i = Ue.delay,
        endDelay: o = Ue.endDelay,
        repeat: l = Ue.repeat,
        offset: c,
        direction: u = "normal",
      } = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    if (
      ((this.startTime = null),
      (this.rate = 1),
      (this.t = 0),
      (this.cancelTimestamp = null),
      (this.easing = at),
      (this.duration = 0),
      (this.totalDuration = 0),
      (this.repeat = 0),
      (this.playState = "idle"),
      (this.finished = new Promise((h, b) => {
        (this.resolve = h), (this.reject = b);
      })),
      (s = s || Ue.easing),
      ur(s))
    ) {
      const h = s.createAnimation(n);
      (s = h.easing), (n = h.keyframes || n), (r = h.duration || r);
    }
    (this.repeat = l),
      (this.easing = Ht(s) ? at : Bi(s)),
      this.updateDuration(r);
    const a = md(n, c, Ht(s) ? s.map(Bi) : at);
    (this.tick = (h) => {
      var b;
      i = i;
      let w = 0;
      this.pauseTime !== void 0
        ? (w = this.pauseTime)
        : (w = (h - this.startTime) * this.rate),
        (this.t = w),
        (w /= 1e3),
        (w = Math.max(w - i, 0)),
        this.playState === "finished" &&
          this.pauseTime === void 0 &&
          (w = this.totalDuration);
      const m = w / this.duration;
      let y = Math.floor(m),
        _ = m % 1;
      !_ && m >= 1 && (_ = 1), _ === 1 && y--;
      const M = y % 2;
      (u === "reverse" ||
        (u === "alternate" && M) ||
        (u === "alternate-reverse" && !M)) &&
        (_ = 1 - _);
      const U = w >= this.totalDuration ? 1 : Math.min(_, 1),
        D = a(this.easing(U));
      t(D),
        this.pauseTime === void 0 &&
        (this.playState === "finished" || w >= this.totalDuration + o)
          ? ((this.playState = "finished"),
            (b = this.resolve) === null || b === void 0 || b.call(this, D))
          : this.playState !== "idle" &&
            (this.frameRequestId = requestAnimationFrame(this.tick));
    }),
      this.play();
  }
  play() {
    const t = performance.now();
    (this.playState = "running"),
      this.pauseTime !== void 0
        ? (this.startTime = t - this.pauseTime)
        : this.startTime || (this.startTime = t),
      (this.cancelTimestamp = this.startTime),
      (this.pauseTime = void 0),
      (this.frameRequestId = requestAnimationFrame(this.tick));
  }
  pause() {
    (this.playState = "paused"), (this.pauseTime = this.t);
  }
  finish() {
    (this.playState = "finished"), this.tick(0);
  }
  stop() {
    var t;
    (this.playState = "idle"),
      this.frameRequestId !== void 0 &&
        cancelAnimationFrame(this.frameRequestId),
      (t = this.reject) === null || t === void 0 || t.call(this, !1);
  }
  cancel() {
    this.stop(), this.tick(this.cancelTimestamp);
  }
  reverse() {
    this.rate *= -1;
  }
  commitStyles() {}
  updateDuration(t) {
    (this.duration = t), (this.totalDuration = t * (this.repeat + 1));
  }
  get currentTime() {
    return this.t;
  }
  set currentTime(t) {
    this.pauseTime !== void 0 || this.rate === 0
      ? (this.pauseTime = t)
      : (this.startTime = performance.now() - t / this.rate);
  }
  get playbackRate() {
    return this.rate;
  }
  set playbackRate(t) {
    this.rate = t;
  }
}
class Sd {
  setAnimation(t) {
    (this.animation = t),
      t == null || t.finished.then(() => this.clearAnimation()).catch(() => {});
  }
  clearAnimation() {
    this.animation = this.generator = void 0;
  }
}
const ks = new WeakMap();
function Jl(e) {
  return (
    ks.has(e) || ks.set(e, { transforms: [], values: new Map() }), ks.get(e)
  );
}
function Ed(e, t) {
  return e.has(t) || e.set(t, new Sd()), e.get(t);
}
const Td = ["", "X", "Y", "Z"],
  Od = ["translate", "scale", "rotate", "skew"],
  Kt = { x: "translateX", y: "translateY", z: "translateZ" },
  ki = {
    syntax: "<angle>",
    initialValue: "0deg",
    toDefaultUnit: (e) => e + "deg",
  },
  Ad = {
    translate: {
      syntax: "<length-percentage>",
      initialValue: "0px",
      toDefaultUnit: (e) => e + "px",
    },
    rotate: ki,
    scale: { syntax: "<number>", initialValue: 1, toDefaultUnit: at },
    skew: ki,
  },
  Wt = new Map(),
  _s = (e) => `--motion-${e}`,
  Zn = ["x", "y", "z"];
Od.forEach((e) => {
  Td.forEach((t) => {
    Zn.push(e + t), Wt.set(_s(e + t), Ad[e]);
  });
});
const Rd = (e, t) => Zn.indexOf(e) - Zn.indexOf(t),
  Cd = new Set(Zn),
  kr = (e) => Cd.has(e),
  Pd = (e, t) => {
    Kt[t] && (t = Kt[t]);
    const { transforms: n } = Jl(e);
    kl(n, t), (e.style.transform = Gl(n));
  },
  Gl = (e) => e.sort(Rd).reduce(Md, "").trim(),
  Md = (e, t) => `${e} ${t}(var(${_s(t)}))`,
  fr = (e) => e.startsWith("--"),
  Hi = new Set();
function Fd(e) {
  if (!Hi.has(e)) {
    Hi.add(e);
    try {
      const { syntax: t, initialValue: n } = Wt.has(e) ? Wt.get(e) : {};
      CSS.registerProperty({
        name: e,
        inherits: !1,
        syntax: t,
        initialValue: n,
      });
    } catch {}
  }
}
const Hs = (e, t) => document.createElement("div").animate(e, t),
  Vi = {
    cssRegisterProperty: () =>
      typeof CSS < "u" && Object.hasOwnProperty.call(CSS, "registerProperty"),
    waapi: () => Object.hasOwnProperty.call(Element.prototype, "animate"),
    partialKeyframes: () => {
      try {
        Hs({ opacity: [1] });
      } catch {
        return !1;
      }
      return !0;
    },
    finished: () => !!Hs({ opacity: [0, 1] }, { duration: 0.001 }).finished,
    linearEasing: () => {
      try {
        Hs({ opacity: 0 }, { easing: "linear(0, 1)" });
      } catch {
        return !1;
      }
      return !0;
    },
  },
  Vs = {},
  jt = {};
for (const e in Vi)
  jt[e] = () => (Vs[e] === void 0 && (Vs[e] = Vi[e]()), Vs[e]);
const Id = 0.015,
  Dd = (e, t) => {
    let n = "";
    const s = Math.round(t / Id);
    for (let r = 0; r < s; r++) n += e(Br(0, s - 1, r)) + ", ";
    return n.substring(0, n.length - 2);
  },
  qi = (e, t) =>
    yn(e)
      ? jt.linearEasing()
        ? `linear(${Dd(e, t)})`
        : Ue.easing
      : Wl(e)
      ? Ld(e)
      : e,
  Ld = (e) => {
    let [t, n, s, r] = e;
    return `cubic-bezier(${t}, ${n}, ${s}, ${r})`;
  };
function jd(e, t) {
  for (let n = 0; n < e.length; n++)
    e[n] === null && (e[n] = n ? e[n - 1] : t());
  return e;
}
const Nd = (e) => (Array.isArray(e) ? e : [e]);
function dr(e) {
  return Kt[e] && (e = Kt[e]), kr(e) ? _s(e) : e;
}
const Nt = {
  get: (e, t) => {
    t = dr(t);
    let n = fr(t) ? e.style.getPropertyValue(t) : getComputedStyle(e)[t];
    if (!n && n !== 0) {
      const s = Wt.get(t);
      s && (n = s.initialValue);
    }
    return n;
  },
  set: (e, t, n) => {
    (t = dr(t)), fr(t) ? e.style.setProperty(t, n) : (e.style[t] = n);
  },
};
function Ud(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  if (!(!e || e.playState === "finished"))
    try {
      e.stop ? e.stop() : (t && e.commitStyles(), e.cancel());
    } catch {}
}
function $d(e, t) {
  var n;
  let s = (t == null ? void 0 : t.toDefaultUnit) || at;
  const r = e[e.length - 1];
  if (gd(r)) {
    const i =
      ((n = r.match(/(-?[\d.]+)([a-z%]*)/)) === null || n === void 0
        ? void 0
        : n[2]) || "";
    i && (s = (o) => o + i);
  }
  return s;
}
function Bd() {
  return window.__MOTION_DEV_TOOLS_RECORD;
}
function kd(e, t, n) {
  let s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {},
    r = arguments.length > 4 ? arguments[4] : void 0;
  const i = Bd(),
    o = s.record !== !1 && i;
  let l,
    {
      duration: c = Ue.duration,
      delay: u = Ue.delay,
      endDelay: a = Ue.endDelay,
      repeat: h = Ue.repeat,
      easing: b = Ue.easing,
      persist: w = !1,
      direction: m,
      offset: y,
      allowWebkitAcceleration: _ = !1,
    } = s;
  const M = Jl(e),
    U = kr(t);
  let D = jt.waapi();
  U && Pd(e, t);
  const A = dr(t),
    j = Ed(M.values, A),
    ee = Wt.get(A);
  return (
    Ud(j.animation, !(ur(b) && j.generator) && s.record !== !1),
    () => {
      const L = () => {
        var H, ce;
        return (ce =
          (H = Nt.get(e, A)) !== null && H !== void 0
            ? H
            : ee == null
            ? void 0
            : ee.initialValue) !== null && ce !== void 0
          ? ce
          : 0;
      };
      let P = jd(Nd(n), L);
      const $ = $d(P, ee);
      if (ur(b)) {
        const H = b.createAnimation(P, t !== "opacity", L, A, j);
        (b = H.easing), (P = H.keyframes || P), (c = H.duration || c);
      }
      if (
        (fr(A) && (jt.cssRegisterProperty() ? Fd(A) : (D = !1)),
        U && !jt.linearEasing() && (yn(b) || (Ht(b) && b.some(yn))) && (D = !1),
        D)
      ) {
        ee && (P = P.map((le) => (bn(le) ? ee.toDefaultUnit(le) : le))),
          P.length === 1 && (!jt.partialKeyframes() || o) && P.unshift(L());
        const H = {
          delay: Bs.ms(u),
          duration: Bs.ms(c),
          endDelay: Bs.ms(a),
          easing: Ht(b) ? void 0 : qi(b, c),
          direction: m,
          iterations: h + 1,
          fill: "both",
        };
        (l = e.animate(
          {
            [A]: P,
            offset: y,
            easing: Ht(b) ? b.map((le) => qi(le, c)) : void 0,
          },
          H
        )),
          l.finished ||
            (l.finished = new Promise((le, ge) => {
              (l.onfinish = le), (l.oncancel = ge);
            }));
        const ce = P[P.length - 1];
        l.finished
          .then(() => {
            w || (Nt.set(e, A, ce), l.cancel());
          })
          .catch(ql),
          _ || (l.playbackRate = 1.000001);
      } else if (r && U)
        (P = P.map((H) => (typeof H == "string" ? parseFloat(H) : H))),
          P.length === 1 && P.unshift(parseFloat(L())),
          (l = new r(
            (H) => {
              Nt.set(e, A, $ ? $(H) : H);
            },
            P,
            Object.assign(Object.assign({}, s), { duration: c, easing: b })
          ));
      else {
        const H = P[P.length - 1];
        Nt.set(e, A, ee && bn(H) ? ee.toDefaultUnit(H) : H);
      }
      return (
        o &&
          i(
            e,
            t,
            P,
            { duration: c, delay: u, easing: b, repeat: h, offset: y },
            "motion-one"
          ),
        j.setAnimation(l),
        l
      );
    }
  );
}
const Hd = (e, t) =>
  e[t] ? Object.assign(Object.assign({}, e), e[t]) : Object.assign({}, e);
function Vd(e, t) {
  var n;
  return (
    typeof e == "string"
      ? t
        ? (((n = t[e]) !== null && n !== void 0) ||
            (t[e] = document.querySelectorAll(e)),
          (e = t[e]))
        : (e = document.querySelectorAll(e))
      : e instanceof Element && (e = [e]),
    Array.from(e || [])
  );
}
function Xl(e, t) {
  var n = {};
  for (var s in e)
    Object.prototype.hasOwnProperty.call(e, s) &&
      t.indexOf(s) < 0 &&
      (n[s] = e[s]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var r = 0, s = Object.getOwnPropertySymbols(e); r < s.length; r++)
      t.indexOf(s[r]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(e, s[r]) &&
        (n[s[r]] = e[s[r]]);
  return n;
}
const qd = { any: 0, all: 1 };
function Kd(e, t) {
  let {
    root: n,
    margin: s,
    amount: r = "any",
  } = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  if (typeof IntersectionObserver > "u") return () => {};
  const i = Vd(e),
    o = new WeakMap(),
    l = (u) => {
      u.forEach((a) => {
        const h = o.get(a.target);
        if (a.isIntersecting !== !!h)
          if (a.isIntersecting) {
            const b = t(a);
            yn(b) ? o.set(a.target, b) : c.unobserve(a.target);
          } else h && (h(a), o.delete(a.target));
      });
    },
    c = new IntersectionObserver(l, {
      root: n,
      rootMargin: s,
      threshold: typeof r == "number" ? r : qd[r],
    });
  return i.forEach((u) => c.observe(u)), () => c.disconnect();
}
function Wd(e, t) {
  return typeof e != typeof t
    ? !0
    : Array.isArray(e) && Array.isArray(t)
    ? !zd(e, t)
    : e !== t;
}
function zd(e, t) {
  const n = t.length;
  if (n !== e.length) return !1;
  for (let s = 0; s < n; s++) if (t[s] !== e[s]) return !1;
  return !0;
}
function Jd(e) {
  return typeof e == "object";
}
function Ki(e, t) {
  if (Jd(e)) return e;
  if (e && t) return t[e];
}
let ut;
function Gd() {
  if (!ut) return;
  const e = ut.sort(Yd).map(Zd);
  e.forEach(Wi), e.forEach(Wi), (ut = void 0);
}
function qs(e) {
  ut ? kl(ut, e) : ((ut = [e]), requestAnimationFrame(Gd));
}
function Xd(e) {
  ut && fd(ut, e);
}
const Yd = (e, t) => e.getDepth() - t.getDepth(),
  Zd = (e) => e.animateUpdates(),
  Wi = (e) => e.next(),
  zi = (e, t) => new CustomEvent(e, { detail: { target: t } });
function hr(e, t, n) {
  e.dispatchEvent(new CustomEvent(t, { detail: { originalEvent: n } }));
}
function Ji(e, t, n) {
  e.dispatchEvent(new CustomEvent(t, { detail: { originalEntry: n } }));
}
const Qd = {
    isActive: (e) => !!e.inView,
    subscribe: (e, t, n) => {
      let { enable: s, disable: r } = t,
        { inViewOptions: i = {} } = n;
      const { once: o } = i,
        l = Xl(i, ["once"]);
      return Kd(
        e,
        (c) => {
          if ((s(), Ji(e, "viewenter", c), !o))
            return (u) => {
              r(), Ji(e, "viewleave", u);
            };
        },
        l
      );
    },
  },
  Gi = (e, t, n) => (s) => {
    (s.pointerType && s.pointerType !== "mouse") || (n(), hr(e, t, s));
  },
  eh = {
    isActive: (e) => !!e.hover,
    subscribe: (e, t) => {
      let { enable: n, disable: s } = t;
      const r = Gi(e, "hoverstart", n),
        i = Gi(e, "hoverend", s);
      return (
        e.addEventListener("pointerenter", r),
        e.addEventListener("pointerleave", i),
        () => {
          e.removeEventListener("pointerenter", r),
            e.removeEventListener("pointerleave", i);
        }
      );
    },
  },
  th = {
    isActive: (e) => !!e.press,
    subscribe: (e, t) => {
      let { enable: n, disable: s } = t;
      const r = (o) => {
          s(), hr(e, "pressend", o), window.removeEventListener("pointerup", r);
        },
        i = (o) => {
          n(), hr(e, "pressstart", o), window.addEventListener("pointerup", r);
        };
      return (
        e.addEventListener("pointerdown", i),
        () => {
          e.removeEventListener("pointerdown", i),
            window.removeEventListener("pointerup", r);
        }
      );
    },
  },
  $n = { inView: Qd, hover: eh, press: th },
  Xi = ["initial", "animate", ...Object.keys($n), "exit"],
  Yi = new WeakMap();
function nh() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {},
    t = arguments.length > 1 ? arguments[1] : void 0,
    n,
    s = t ? t.getDepth() + 1 : 0;
  const r = { initial: !0, animate: !0 },
    i = {},
    o = {};
  for (const y of Xi)
    o[y] =
      typeof e[y] == "string" ? e[y] : t == null ? void 0 : t.getContext()[y];
  const l = e.initial === !1 ? "animate" : "initial";
  let c = Ki(e[l] || o[l], e.variants) || {},
    u = Xl(c, ["transition"]);
  const a = Object.assign({}, u);
  function* h() {
    var y, _;
    const M = u;
    u = {};
    const U = {};
    for (const L of Xi) {
      if (!r[L]) continue;
      const P = Ki(e[L]);
      if (P)
        for (const $ in P)
          $ !== "transition" &&
            ((u[$] = P[$]),
            (U[$] = Hd(
              (_ =
                (y = P.transition) !== null && y !== void 0
                  ? y
                  : e.transition) !== null && _ !== void 0
                ? _
                : {},
              $
            )));
    }
    const D = new Set([...Object.keys(u), ...Object.keys(M)]),
      A = [];
    D.forEach((L) => {
      var P;
      u[L] === void 0 && (u[L] = a[L]),
        Wd(M[L], u[L]) &&
          (((P = a[L]) !== null && P !== void 0) || (a[L] = Nt.get(n, L)),
          A.push(kd(n, L, u[L], U[L], vd)));
    }),
      yield;
    const j = A.map((L) => L()).filter(Boolean);
    if (!j.length) return;
    const ee = u;
    n.dispatchEvent(zi("motionstart", ee)),
      Promise.all(j.map((L) => L.finished))
        .then(() => {
          n.dispatchEvent(zi("motioncomplete", ee));
        })
        .catch(ql);
  }
  const b = (y, _) => () => {
      (r[y] = _), qs(m);
    },
    w = () => {
      for (const y in $n) {
        const _ = $n[y].isActive(e),
          M = i[y];
        _ && !M
          ? (i[y] = $n[y].subscribe(
              n,
              { enable: b(y, !0), disable: b(y, !1) },
              e
            ))
          : !_ && M && (M(), delete i[y]);
      }
    },
    m = {
      update: (y) => {
        n && ((e = y), w(), qs(m));
      },
      setActive: (y, _) => {
        n && ((r[y] = _), qs(m));
      },
      animateUpdates: h,
      getDepth: () => s,
      getTarget: () => u,
      getOptions: () => e,
      getContext: () => o,
      mount: (y) => (
        (n = y),
        Yi.set(n, m),
        w(),
        () => {
          Yi.delete(n), Xd(m);
          for (const _ in i) i[_]();
        }
      ),
      isMounted: () => !!n,
    };
  return m;
}
function Zi(e) {
  const t = {},
    n = [];
  for (let s in e) {
    const r = e[s];
    kr(s) && (Kt[s] && (s = Kt[s]), n.push(s), (s = _s(s)));
    let i = Array.isArray(r) ? r[0] : r;
    const o = Wt.get(s);
    o && (i = bn(r) ? o.toDefaultUnit(r) : r), (t[s] = i);
  }
  return n.length && (t.transform = Gl(n)), t;
}
const Qi = "motion-state",
  sh = "motion-presence",
  st = () => ({ type: Object }),
  xs = At({
    name: "Motion",
    inheritAttrs: !0,
    props: {
      tag: { type: String, default: "div" },
      initial: { type: [Object, Boolean] },
      animate: st(),
      inView: st(),
      hover: st(),
      press: st(),
      exit: st(),
      inViewOptions: st(),
      transition: st(),
      style: st(),
    },
    setup(e) {
      const t = Et(null),
        n = St(Qi, void 0),
        s = St(sh, void 0),
        r = nh(
          Object.assign(Object.assign({}, e), {
            initial:
              (s == null ? void 0 : s.initial) === !1
                ? s.initial
                : e.initial === !0
                ? void 0
                : e.initial,
          }),
          n
        );
      Ko(Qi, r),
        $o(() => {
          const o = r.mount(t.value);
          return (
            r.update(
              Object.assign(Object.assign({}, e), {
                initial: e.initial === !0 ? void 0 : e.initial,
              })
            ),
            o
          );
        });
      let i = !1;
      return (
        Bo(() => {
          if (!i && t.value) {
            i = !0;
            const o = Zi(r.getTarget());
            for (const l in o) Nt.set(t.value, l, o[l]);
          }
          r.update(
            Object.assign(Object.assign({}, e), {
              initial: e.initial === !0 ? void 0 : e.initial,
            })
          );
        }),
        { state: r, root: t, initialStyles: Zi(r.getTarget()) }
      );
    },
    render() {
      var e, t;
      return qa(
        this.tag,
        {
          ref: "root",
          style: this.state.isMounted()
            ? this.style
            : Object.assign(Object.assign({}, this.style), this.initialStyles),
        },
        (t = (e = this.$slots).default) === null || t === void 0
          ? void 0
          : t.call(e)
      );
    },
  }),
  pr = {
    wuxia: {
      gradient: "linear-gradient(135deg, #E6D5C3 0%, #D4BBA4 100%)",
      imageUrl:
        "https://images.unsplash.com/photo-1500534314209-4186bf10ae0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      baseColor: "#F7EFE5",
      textColor: "#5C5145",
      scrimStart: "rgba(247, 239, 229, 0.88)",
      scrimEnd: "rgba(247, 239, 229, 0.85)",
      imageOpacity: "0.42",
    },
    detective: {
      gradient: "linear-gradient(135deg, #C8C3B9 0%, #9F988B 100%)",
      imageUrl:
        "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=2000&q=80",
      baseColor: "#F0ECE6",
      textColor: "#4C433A",
      scrimStart: "rgba(240, 236, 230, 0.9)",
      scrimEnd: "rgba(223, 218, 209, 0.86)",
      imageOpacity: "0.40",
    },
    apocalypse: {
      gradient: "linear-gradient(135deg, #C2B8A3 0%, #A39B8B 100%)",
      imageUrl:
        "https://images.unsplash.com/photo-1582719478250-04d1e6f58a8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      baseColor: "#EDE7DE",
      textColor: "#51493E",
      scrimStart: "rgba(237, 231, 222, 0.88)",
      scrimEnd: "rgba(214, 206, 192, 0.84)",
      imageOpacity: "0.36",
    },
    school: {
      gradient: "linear-gradient(135deg, #F4EAE2 0%, #E8D3C1 100%)",
      imageUrl:
        "https://images.unsplash.com/photo-1582719478442-74f570122068?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      baseColor: "#FAF0E8",
      textColor: "#5A4E44",
      scrimStart: "rgba(250, 240, 232, 0.9)",
      scrimEnd: "rgba(240, 222, 208, 0.86)",
      imageOpacity: "0.38",
    },
  },
  Ks = new Map();
function rh(e) {
  const t = pr[e];
  if (!t || typeof window > "u" || typeof window.Image > "u")
    return Promise.resolve();
  const { imageUrl: n } = t;
  if (!n) return Promise.resolve();
  if (Ks.has(n)) return Ks.get(n);
  const s = new Promise((r, i) => {
    const o = new Image();
    (o.onload = () => r()), (o.onerror = () => r()), (o.src = n);
  });
  return Ks.set(n, s), s;
}
const ih = { class: "grid gap-3 md:grid-cols-2" },
  oh = ["onClick"],
  lh = { class: "text-lg font-semibold" },
  ch = { class: "mt-2 text-sm text-cocoa/65" },
  ah = { class: "flex flex-wrap items-center justify-between gap-3" },
  uh = { key: 0, class: "text-sm text-rose-500" },
  fh = ["disabled"],
  dh = At({
    __name: "ThemeSelector",
    setup(e) {
      const t = [
          {
            value: "wuxia",
            label: "武俠冒險",
            description: "江湖風起雲湧，俠骨柔情一念之間。",
          },
          {
            value: "detective",
            label: "偵探推理",
            description: "解開謎團的唯一線索，就藏在細節裡。",
          },
          {
            value: "apocalypse",
            label: "末日生存",
            description: "在文明瓦解後，尋找仍存的希望。",
          },
          {
            value: "school",
            label: "青春校園",
            description: "日常裡的悸動與秘密，悄悄延伸。",
          },
        ],
        n = Et("wuxia"),
        s = Tn(),
        r = Et(!1);
      async function i() {
        if (s.loading || r.value) return;
        const o = n.value;
        r.value = !0;
        try {
          await rh(o);
        } finally {
          r.value = !1;
        }
        s.startNewGame({ theme: n.value });
      }
      return (o, l) => (
        z(),
        pt(
          K(xs),
          {
            tag: "div",
            initial: { opacity: 0, y: 32 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, easing: "ease-out" },
            class:
              "rounded-[16px] border border-sand/70 bg-white/90 p-8 shadow-latteSoft backdrop-blur-sm",
          },
          {
            default: xn(() => [
              F(
                "form",
                { class: "flex flex-col gap-7", onSubmit: hl(i, ["prevent"]) },
                [
                  l[1] ||
                    (l[1] = F(
                      "div",
                      { class: "space-y-2" },
                      [
                        F(
                          "h2",
                          { class: "text-2xl font-semibold text-cocoa" },
                          "開啟新章節"
                        ),
                        F(
                          "p",
                          { class: "text-sm text-cocoa/70" },
                          "選擇主題，即可開始與 AI 的沉浸式共筆旅程。"
                        ),
                      ],
                      -1
                    )),
                  F("fieldset", null, [
                    l[0] ||
                      (l[0] = F(
                        "legend",
                        {
                          class:
                            "mb-3 text-xs font-semibold uppercase tracking-[0.35rem] text-cocoa/50",
                        },
                        "故事主題",
                        -1
                      )),
                    F("div", ih, [
                      (z(),
                      Z(
                        we,
                        null,
                        kt(t, (c) =>
                          F(
                            "button",
                            {
                              key: c.value,
                              type: "button",
                              class: rs([
                                "rounded-[16px] border px-5 py-4 text-left transition-colors duration-300 ease-in-out",
                                n.value === c.value
                                  ? "border-latte bg-latte/10 text-cocoa shadow-latte"
                                  : "border-sand/60 bg-white/70 text-cocoa/80 hover:border-latte/70 hover:bg-cream",
                              ]),
                              onClick: (u) => (n.value = c.value),
                            },
                            [
                              F("h3", lh, ie(c.label), 1),
                              F("p", ch, ie(c.description), 1),
                            ],
                            10,
                            oh
                          )
                        ),
                        64
                      )),
                    ]),
                  ]),
                  F("div", ah, [
                    K(s).error
                      ? (z(), Z("span", uh, ie(K(s).error), 1))
                      : de("", !0),
                    F(
                      "button",
                      {
                        type: "submit",
                        class:
                          "ml-auto rounded-full bg-latte px-6 py-2 text-sm font-semibold text-white shadow-latteSoft transition-colors duration-300 ease-in-out hover:bg-latteHover focus:outline-none focus:ring-2 focus:ring-latte/60 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-60",
                        disabled: K(s).loading || r.value,
                      },
                      ie(
                        r.value
                          ? "載入背景…"
                          : K(s).loading
                          ? "建立中…"
                          : K(s).isReady
                          ? "重新開始"
                          : "開始冒險"
                      ),
                      9,
                      fh
                    ),
                  ]),
                ],
                32
              ),
            ]),
            _: 1,
          }
        )
      );
    },
  }),
  hh = {
    class: "whitespace-pre-line text-lg leading-relaxed text-cocoa font-medium",
  },
  eo = At({
    __name: "TypingText",
    props: {
      text: { type: String, required: !0 },
      speed: { type: Number, default: 18 },
    },
    setup(e) {
      const t = e,
        n = Et("");
      let s = null;
      function r() {
        s && (clearTimeout(s), (s = null));
      }
      function i(o, l = 0) {
        if ((r(), l >= o.length)) {
          n.value = o;
          return;
        }
        (n.value = o.slice(0, l + 1)),
          (s = setTimeout(() => i(o, l + 1), t.speed));
      }
      return (
        an(
          () => t.text,
          (o) => {
            if (!o) {
              (n.value = ""), r();
              return;
            }
            i(o, 0);
          },
          { immediate: !0 }
        ),
        ko(() => {
          r();
        }),
        (o, l) => (z(), Z("p", hh, ie(n.value), 1))
      );
    },
  }),
  ph = { class: "flex items-baseline justify-between" },
  mh = { class: "text-xs uppercase tracking-[0.35rem] text-cocoaMuted/70" },
  gh = {
    class:
      "rounded-full border border-sand px-3 py-1 text-xs uppercase tracking-[0.35rem] text-cocoaMuted/70",
  },
  bh = { class: "mt-6 space-y-4" },
  yh = { key: 0, class: "space-y-3" },
  _h = { class: "space-y-1" },
  xh = { class: "text-xs uppercase tracking-[0.4rem] text-latte" },
  wh = { key: 0, class: "text-xs text-cocoaMuted/70" },
  vh = { class: "text-base text-cocoa font-medium" },
  Sh = { class: "text-sm italic text-cocoaMuted/80" },
  Eh = { key: 2, class: "text-sm text-cocoaMuted/75" },
  Th = { key: 3, class: "space-y-2 text-sm text-cocoaMuted/85" },
  Oh = { key: 4, class: "pt-2 text-sm text-cocoaMuted/70" },
  Ah = {
    key: 5,
    class: "rounded-[12px] bg-cream/70 p-4 text-sm text-cocoaMuted/85",
  },
  Rh = { class: "mt-2 space-y-1" },
  Ch = {
    key: 6,
    class: "rounded-[12px] bg-cream/70 p-4 text-sm text-cocoaMuted/85",
  },
  Ph = { class: "mt-2 space-y-1" },
  Mh = { key: 7, class: "text-xs text-cocoaMuted/60" },
  Fh = At({
    __name: "StoryPanel",
    setup(e) {
      const t = Tn(),
        n = Ne(() =>
          t.isComplete ? "Completed" : t.isActive ? "In Progress" : "Ready"
        ),
        s = Ne(() => {
          var c;
          return ((c = t.latest) == null ? void 0 : c.options) ?? [];
        }),
        r = Ne(() => {
          var c;
          return ((c = t.latest) == null ? void 0 : c.display) ?? null;
        }),
        i = Ne(() =>
          r.value
            ? r.value.background.join(`
`)
            : ""
        ),
        o = Ne(() => {
          var c;
          return ((c = t.latest) == null ? void 0 : c.playerAction) ?? "";
        }),
        l = Ne(() => Math.max(0, Math.min(100, Math.round(t.progress))));
      return (c, u) => (
        z(),
        pt(
          K(xs),
          {
            tag: "article",
            initial: { opacity: 0, y: 16 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.35 },
            class:
              "relative overflow-hidden rounded-[16px] border border-sand/70 bg-white/92 p-6 shadow-latteSoft backdrop-blur-sm",
          },
          {
            default: xn(() => [
              u[3] ||
                (u[3] = F(
                  "div",
                  {
                    class:
                      "pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-latte/20 blur-3xl",
                  },
                  null,
                  -1
                )),
              F("header", ph, [
                F("div", null, [
                  u[0] ||
                    (u[0] = F(
                      "h2",
                      { class: "text-xl font-semibold text-cocoa" },
                      "目前劇情",
                      -1
                    )),
                  F("p", mh, " 進度 " + ie(l.value) + "% ", 1),
                ]),
                F("span", gh, ie(n.value), 1),
              ]),
              F("div", bh, [
                r.value
                  ? (z(),
                    Z("div", yh, [
                      F("div", _h, [
                        F("p", xh, ie(r.value.sceneTitle), 1),
                        Se(eo, { text: i.value }, null, 8, ["text"]),
                      ]),
                      r.value.recap
                        ? (z(), Z("p", wh, ie(r.value.recap), 1))
                        : de("", !0),
                      F("p", vh, ie(r.value.interaction), 1),
                      F("p", Sh, ie(r.value.progress), 1),
                    ]))
                  : K(t).latest
                  ? (z(),
                    pt(eo, { key: 1, text: K(t).latest.narrative }, null, 8, [
                      "text",
                    ]))
                  : (z(),
                    Z("p", Eh, "請以第一人稱輸入行動或對話，讓故事繼續發展。")),
                s.value.length
                  ? (z(),
                    Z("ul", Th, [
                      (z(!0),
                      Z(
                        we,
                        null,
                        kt(
                          s.value,
                          (a) => (
                            z(),
                            Z(
                              "li",
                              {
                                key: a,
                                class:
                                  "rounded-[12px] border border-latte/50 bg-latte/10 px-3 py-2",
                              },
                              ie(a),
                              1
                            )
                          )
                        ),
                        128
                      )),
                    ]))
                  : de("", !0),
                o.value
                  ? (z(), Z("p", Oh, " 【玩家行動】" + ie(o.value), 1))
                  : de("", !0),
                K(t).pendingThreads.length
                  ? (z(),
                    Z("div", Ah, [
                      u[1] ||
                        (u[1] = F(
                          "p",
                          {
                            class:
                              "text-xs font-semibold uppercase tracking-[0.25rem] text-cocoaMuted/60",
                          },
                          "未決線索",
                          -1
                        )),
                      F("ul", Rh, [
                        (z(!0),
                        Z(
                          we,
                          null,
                          kt(
                            K(t).pendingThreads,
                            (a) => (z(), Z("li", { key: a }, "- " + ie(a), 1))
                          ),
                          128
                        )),
                      ]),
                    ]))
                  : de("", !0),
                K(t).keyPoints.length
                  ? (z(),
                    Z("div", Ch, [
                      u[2] ||
                        (u[2] = F(
                          "p",
                          {
                            class:
                              "text-xs font-semibold uppercase tracking-[0.25rem] text-cocoaMuted/60",
                          },
                          "重點摘要",
                          -1
                        )),
                      F("ul", Ph, [
                        (z(!0),
                        Z(
                          we,
                          null,
                          kt(
                            K(t).keyPoints,
                            (a) => (z(), Z("li", { key: a }, "- " + ie(a), 1))
                          ),
                          128
                        )),
                      ]),
                    ]))
                  : de("", !0),
                K(t).tone
                  ? (z(), Z("p", Mh, "【氛圍】" + ie(K(t).tone), 1))
                  : de("", !0),
              ]),
            ]),
            _: 1,
          }
        )
      );
    },
  }),
  Ih = { class: "mt-4 max-h-80 space-y-4 overflow-y-auto pr-2" },
  Dh = {
    class:
      "mb-2 flex items-center justify-between text-xs uppercase tracking-[0.35rem] text-cocoa/45",
  },
  Lh = { key: 0, class: "text-latte" },
  jh = { class: "whitespace-pre-line leading-relaxed" },
  Nh = { key: 0, class: "mt-3 text-xs text-cocoaMuted/70" },
  Uh = { key: 1, class: "text-xs text-cocoaMuted/60" },
  $h = { key: 0, class: "text-sm text-cocoaMuted/70" },
  Bh = At({
    __name: "StoryTimeline",
    setup(e) {
      const t = Tn();
      return (n, s) => (
        z(),
        pt(
          K(xs),
          {
            tag: "section",
            initial: { opacity: 0, y: 16 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.35, delay: 0.1 },
            class:
              "rounded-[16px] border border-sand/70 bg-white/85 p-5 shadow-latteSoft backdrop-blur-sm",
          },
          {
            default: xn(() => [
              s[0] ||
                (s[0] = F(
                  "header",
                  { class: "flex items-center justify-between" },
                  [
                    F(
                      "h3",
                      { class: "text-lg font-semibold text-cocoa" },
                      "故事紀錄"
                    ),
                    F(
                      "span",
                      { class: "text-xs text-cocoaMuted/70" },
                      "自動滾動顯示最近兩回合"
                    ),
                  ],
                  -1
                )),
              F("div", Ih, [
                (z(!0),
                Z(
                  we,
                  null,
                  kt(
                    K(t).storyLog,
                    (r, i) => (
                      z(),
                      Z(
                        "div",
                        {
                          key: i,
                          class:
                            "relative rounded-[14px] border border-sand/70 bg-cream/90 p-4 text-sm text-cocoaMuted/90 shadow-latteSoft",
                        },
                        [
                          F("div", Dh, [
                            F("span", null, "記錄 " + ie(i + 1), 1),
                            i === K(t).storyLog.length - 1
                              ? (z(), Z("span", Lh, "Latest"))
                              : de("", !0),
                          ]),
                          F("p", jh, ie(r.narrative), 1),
                          r.playerAction
                            ? (z(),
                              Z(
                                "p",
                                Nh,
                                " 【玩家行動】" + ie(r.playerAction),
                                1
                              ))
                            : de("", !0),
                          r.progress !== void 0
                            ? (z(),
                              Z(
                                "p",
                                Uh,
                                " 進度 " +
                                  ie(Math.round(r.progress ?? 0)) +
                                  "% ",
                                1
                              ))
                            : de("", !0),
                        ]
                      )
                    )
                  ),
                  128
                )),
                K(t).storyLog.length
                  ? de("", !0)
                  : (z(), Z("p", $h, " 尚未開始回合，請輸入行動或選擇選項。 ")),
              ]),
            ]),
            _: 1,
          }
        )
      );
    },
  }),
  kh = { class: "text-sm text-cocoaMuted/85" },
  Hh = ["disabled"],
  Vh = { key: 0, class: "space-y-2" },
  qh = { class: "flex flex-wrap gap-2" },
  Kh = ["onClick", "disabled"],
  Wh = { class: "flex items-center justify-between" },
  zh = { class: "text-xs text-cocoaMuted/70" },
  Jh = ["disabled"],
  Gh = At({
    __name: "InteractionPanel",
    setup(e) {
      const t = Tn(),
        n = Et(""),
        s = Ne(() => {
          var o;
          return ((o = t.latest) == null ? void 0 : o.options) ?? [];
        });
      function r(o) {
        t.loading ||
          t.isComplete ||
          ((n.value = o.replace(/^[A-C]\.\s?/, "")), i());
      }
      function i() {
        !n.value.trim() ||
          t.loading ||
          t.isComplete ||
          (t.submitInput(n.value.trim()), (n.value = ""));
      }
      return (o, l) => (
        z(),
        pt(
          K(xs),
          {
            tag: "aside",
            initial: { opacity: 0, x: 22 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.4, easing: "ease-out" },
            class:
              "rounded-[16px] border border-sand/70 bg-white/95 p-6 shadow-latteSoft backdrop-blur-sm",
          },
          {
            default: xn(() => [
              l[3] ||
                (l[3] = F(
                  "header",
                  { class: "space-y-1" },
                  [
                    F(
                      "h3",
                      { class: "text-xl font-semibold text-cocoa" },
                      "回合指令"
                    ),
                    F(
                      "p",
                      {
                        class:
                          "text-xs uppercase tracking-[0.35rem] text-cocoa/45",
                      },
                      "Input / Choices"
                    ),
                    F(
                      "p",
                      { class: "text-xs text-cocoaMuted/75" },
                      "請使用第一人稱描述（例如：「我要...」、「我決定...」）。"
                    ),
                  ],
                  -1
                )),
              F(
                "form",
                {
                  class: "mt-5 flex flex-col gap-4",
                  onSubmit: hl(i, ["prevent"]),
                },
                [
                  F("label", kh, [
                    l[1] || (l[1] = cl(" 自由輸入 ", -1)),
                    Hc(
                      F(
                        "textarea",
                        {
                          "onUpdate:modelValue":
                            l[0] || (l[0] = (c) => (n.value = c)),
                          rows: "4",
                          placeholder:
                            "以「我」開頭描述你的行動、對話或策略...",
                          class:
                            "mt-2 w-full rounded-[14px] border border-sand bg-cream/70 px-4 py-3 text-sm text-cocoa placeholder:text-cocoa/40 focus:border-latte focus:outline-none focus:ring-2 focus:ring-latte/40 disabled:bg-sand/30",
                          disabled: K(t).loading || K(t).isComplete,
                        },
                        null,
                        8,
                        Hh
                      ),
                      [[du, n.value]]
                    ),
                  ]),
                  s.value.length
                    ? (z(),
                      Z("div", Vh, [
                        l[2] ||
                          (l[2] = F(
                            "div",
                            {
                              class:
                                "text-xs uppercase tracking-[0.35rem] text-cocoaMuted/70",
                            },
                            "建議選項",
                            -1
                          )),
                        F("div", qh, [
                          (z(!0),
                          Z(
                            we,
                            null,
                            kt(
                              s.value,
                              (c) => (
                                z(),
                                Z(
                                  "button",
                                  {
                                    key: c,
                                    type: "button",
                                    class:
                                      "rounded-full border border-latte/60 bg-latte/10 px-4 py-2 text-xs font-medium text-cocoa transition-colors duration-300 ease-in-out hover:border-latte hover:bg-latte/20",
                                    onClick: (u) => r(c),
                                    disabled: K(t).loading || K(t).isComplete,
                                  },
                                  ie(c),
                                  9,
                                  Kh
                                )
                              )
                            ),
                            128
                          )),
                        ]),
                      ]))
                    : de("", !0),
                  F("div", Wh, [
                    F("span", zh, "剩餘回合：" + ie(K(t).remainingTurns), 1),
                    F(
                      "button",
                      {
                        type: "submit",
                        class:
                          "rounded-full bg-latte px-5 py-2 text-sm font-semibold text-white shadow-latte transition-colors duration-300 ease-in-out hover:bg-latteHover focus:outline-none focus:ring-2 focus:ring-latte/60 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-60",
                        disabled:
                          !n.value.trim() || K(t).loading || K(t).isComplete,
                      },
                      ie(
                        K(t).loading
                          ? "生成中…"
                          : K(t).isComplete
                          ? "故事已完結"
                          : "送出行動"
                      ),
                      9,
                      Jh
                    ),
                  ]),
                ],
                32
              ),
            ]),
            _: 1,
          }
        )
      );
    },
  }),
  Xh = { class: "app-shell__content" },
  Yh = {
    class:
      "mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-12 md:py-16",
  },
  Zh = { class: "flex flex-1 flex-col gap-8 lg:flex-row" },
  Qh = { class: "flex-1 space-y-6" },
  ep = {
    key: 0,
    class:
      "rounded-[16px] border border-sand/70 bg-white/92 p-6 shadow-latteSoft backdrop-blur-sm",
  },
  tp = {
    class:
      "flex flex-wrap items-center justify-between gap-4 text-xs text-cocoa/60",
  },
  np = { class: "flex items-center gap-2" },
  sp = { key: 0 },
  rp = At({
    __name: "App",
    setup(e) {
      const t = Tn(),
        n = Ne(() => Math.max(0, Math.min(100, Math.round(t.progress ?? 0))));
      function s() {
        t.resetGame(),
          typeof window < "u" &&
            typeof window.scrollTo == "function" &&
            window.scrollTo({ top: 0, behavior: "smooth" });
      }
      const r = Ne(() => {
        const i = t.theme || "wuxia",
          o = pr[i] || pr.wuxia;
        return {
          "--theme-gradient": o.gradient,
          "--theme-image": `url(${o.imageUrl})`,
          "--theme-base-color": o.baseColor,
          "--theme-text-color": o.textColor,
          "--theme-scrim-start": o.scrimStart,
          "--theme-scrim-end": o.scrimEnd,
          "--theme-image-opacity": o.imageOpacity,
        };
      });
      return (i, o) => (
        z(),
        Z(
          "div",
          { class: "app-shell", style: ss(r.value) },
          [
            o[5] || (o[5] = F("div", { class: "app-shell__scrim" }, null, -1)),
            F("div", Xh, [
              F("div", Yh, [
                o[4] ||
                  (o[4] = F(
                    "header",
                    { class: "text-center" },
                    [
                      F(
                        "h1",
                        {
                          class:
                            "text-4xl font-semibold tracking-tight text-cocoa md:text-5xl",
                        },
                        " 互動式 AI 故事體驗 "
                      ),
                      F(
                        "p",
                        { class: "mt-4 text-base text-cocoa/80 md:text-lg" },
                        " 選擇主題，讓故事依照劇情完整度自然延展，與 AI 共同編織專屬劇情。 "
                      ),
                    ],
                    -1
                  )),
                F("main", Zh, [
                  F("section", Qh, [
                    K(t).isReady ? de("", !0) : (z(), pt(dh, { key: 0 })),
                    K(t).isReady
                      ? (z(),
                        Z(
                          we,
                          { key: 1 },
                          [
                            Se(Fh),
                            Se(Bh),
                            K(t).isComplete
                              ? (z(),
                                Z("div", ep, [
                                  o[1] ||
                                    (o[1] = F(
                                      "h3",
                                      {
                                        class:
                                          "text-lg font-semibold text-cocoa",
                                      },
                                      "想再來一段故事嗎？",
                                      -1
                                    )),
                                  o[2] ||
                                    (o[2] = F(
                                      "p",
                                      {
                                        class:
                                          "mt-2 text-sm text-cocoaMuted/80",
                                      },
                                      " 結局已經寫下，但俠骨、真相、求生與青春仍在等你。回到主題選單，挑戰另一種命運。 ",
                                      -1
                                    )),
                                  F(
                                    "div",
                                    { class: "mt-4 flex flex-wrap gap-3" },
                                    [
                                      F(
                                        "button",
                                        {
                                          type: "button",
                                          class:
                                            "rounded-full bg-latte px-5 py-2 text-sm font-semibold text-white shadow-latteSoft transition-colors duration-300 ease-in-out hover:bg-latteHover focus:outline-none focus:ring-2 focus:ring-latte/60 focus:ring-offset-2 focus:ring-offset-white",
                                          onClick: s,
                                        },
                                        " 重新選擇主題 "
                                      ),
                                    ]
                                  ),
                                ]))
                              : de("", !0),
                          ],
                          64
                        ))
                      : de("", !0),
                  ]),
                  K(t).isReady && !K(t).isComplete
                    ? (z(),
                      pt(Gh, {
                        key: 0,
                        class: "w-full max-w-md self-start lg:sticky lg:top-16",
                      }))
                    : de("", !0),
                ]),
                F("footer", tp, [
                  F("div", np, [
                    o[3] || (o[3] = F("span", null, "Prototype POC", -1)),
                    K(t).isReady
                      ? (z(), Z("span", sp, "· 進度：" + ie(n.value) + "%", 1))
                      : de("", !0),
                  ]),
                  K(t).isReady && !K(t).isComplete
                    ? (z(),
                      Z(
                        "button",
                        {
                          key: 0,
                          class:
                            "rounded-full border border-sand px-4 py-2 text-sm font-medium text-cocoa transition-colors duration-300 ease-in-out hover:border-latte hover:text-latte",
                          onClick:
                            o[0] ||
                            (o[0] = (...l) =>
                              K(t).resetGame && K(t).resetGame(...l)),
                        },
                        " 中止故事 "
                      ))
                    : de("", !0),
                ]),
              ]),
            ]),
          ],
          4
        )
      );
    },
  });
const Yl = bu(rp);
Yl.use(wu());
Yl.mount("#app");
