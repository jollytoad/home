(() => {
  // https://esm.sh/v126/urlpattern-polyfill@9.0.0/denonext/urlpattern-polyfill.mjs
  var P = class {
    type = 3;
    name = "";
    prefix = "";
    value = "";
    suffix = "";
    modifier = 3;
    constructor(t, e, s, i, o, u) {
      this.type = t, this.name = e, this.prefix = s, this.value = i, this.suffix = o, this.modifier = u;
    }
    hasCustomName() {
      return this.name !== "" && typeof this.name != "number";
    }
  };
  var Y = /[$_\p{ID_Start}]/u;
  var tt = /[$_\u200C\u200D\p{ID_Continue}]/u;
  var D = ".*";
  function et(t, e) {
    return (e ? /^[\x00-\xFF]*$/ : /^[\x00-\x7F]*$/).test(t);
  }
  function M(t, e = false) {
    let s = [], i = 0;
    for (; i < t.length; ) {
      let o = t[i], u = function(h) {
        if (!e)
          throw new TypeError(h);
        s.push({ type: "INVALID_CHAR", index: i, value: t[i++] });
      };
      if (o === "*") {
        s.push({ type: "ASTERISK", index: i, value: t[i++] });
        continue;
      }
      if (o === "+" || o === "?") {
        s.push({ type: "OTHER_MODIFIER", index: i, value: t[i++] });
        continue;
      }
      if (o === "\\") {
        s.push({ type: "ESCAPED_CHAR", index: i++, value: t[i++] });
        continue;
      }
      if (o === "{") {
        s.push({ type: "OPEN", index: i, value: t[i++] });
        continue;
      }
      if (o === "}") {
        s.push({ type: "CLOSE", index: i, value: t[i++] });
        continue;
      }
      if (o === ":") {
        let h = "", r = i + 1;
        for (; r < t.length; ) {
          let a = t.substr(r, 1);
          if (r === i + 1 && Y.test(a) || r !== i + 1 && tt.test(a)) {
            h += t[r++];
            continue;
          }
          break;
        }
        if (!h) {
          u(`Missing parameter name at ${i}`);
          continue;
        }
        s.push({ type: "NAME", index: i, value: h }), i = r;
        continue;
      }
      if (o === "(") {
        let h = 1, r = "", a = i + 1, n = false;
        if (t[a] === "?") {
          u(`Pattern cannot start with "?" at ${a}`);
          continue;
        }
        for (; a < t.length; ) {
          if (!et(t[a], false)) {
            u(`Invalid character '${t[a]}' at ${a}.`), n = true;
            break;
          }
          if (t[a] === "\\") {
            r += t[a++] + t[a++];
            continue;
          }
          if (t[a] === ")") {
            if (h--, h === 0) {
              a++;
              break;
            }
          } else if (t[a] === "(" && (h++, t[a + 1] !== "?")) {
            u(`Capturing groups are not allowed at ${a}`), n = true;
            break;
          }
          r += t[a++];
        }
        if (n)
          continue;
        if (h) {
          u(`Unbalanced pattern at ${i}`);
          continue;
        }
        if (!r) {
          u(`Missing pattern at ${i}`);
          continue;
        }
        s.push({ type: "REGEX", index: i, value: r }), i = a;
        continue;
      }
      s.push({ type: "CHAR", index: i, value: t[i++] });
    }
    return s.push({ type: "END", index: i, value: "" }), s;
  }
  function F(t, e = {}) {
    let s = M(t);
    e.delimiter ??= "/#?", e.prefixes ??= "./";
    let i = `[^${g(e.delimiter)}]+?`, o = [], u = 0, h = 0, r = "", a = /* @__PURE__ */ new Set(), n = (p) => {
      if (h < s.length && s[h].type === p)
        return s[h++].value;
    }, f = () => n("OTHER_MODIFIER") ?? n("ASTERISK"), w = (p) => {
      let c = n(p);
      if (c !== void 0)
        return c;
      let { type: l, index: v } = s[h];
      throw new TypeError(`Unexpected ${l} at ${v}, expected ${p}`);
    }, R = () => {
      let p = "", c;
      for (; c = n("CHAR") ?? n("ESCAPED_CHAR"); )
        p += c;
      return p;
    }, Q = (p) => p, U = e.encodePart || Q, O = "", T = (p) => {
      O += p;
    }, I = () => {
      O.length && (o.push(new P(3, "", "", U(O), "", 3)), O = "");
    }, _ = (p, c, l, v, b) => {
      let d = 3;
      switch (b) {
        case "?":
          d = 1;
          break;
        case "*":
          d = 0;
          break;
        case "+":
          d = 2;
          break;
      }
      if (!c && !l && d === 3) {
        T(p);
        return;
      }
      if (I(), !c && !l) {
        if (!p)
          return;
        o.push(new P(3, "", "", U(p), "", d));
        return;
      }
      let m;
      l ? l === "*" ? m = D : m = l : m = i;
      let C = 2;
      m === i ? (C = 1, m = "") : m === D && (C = 0, m = "");
      let x;
      if (c ? x = c : l && (x = u++), a.has(x))
        throw new TypeError(`Duplicate name '${x}'.`);
      a.add(x), o.push(new P(C, x, U(p), m, U(v), d));
    };
    for (; h < s.length; ) {
      let p = n("CHAR"), c = n("NAME"), l = n("REGEX");
      if (!c && !l && (l = n("ASTERISK")), c || l) {
        let b = p ?? "";
        e.prefixes.indexOf(b) === -1 && (T(b), b = ""), I();
        let d = f();
        _(b, c, l, "", d);
        continue;
      }
      let v = p ?? n("ESCAPED_CHAR");
      if (v) {
        T(v);
        continue;
      }
      if (n("OPEN")) {
        let b = R(), d = n("NAME"), m = n("REGEX");
        !d && !m && (m = n("ASTERISK"));
        let C = R();
        w("CLOSE");
        let x = f();
        _(b, d, m, C, x);
        continue;
      }
      I(), w("END");
    }
    return o;
  }
  function g(t) {
    return t.replace(/([.+*?^${}()[\]|/\\])/g, "\\$1");
  }
  function j(t) {
    return t && t.ignoreCase ? "ui" : "u";
  }
  function st(t, e, s) {
    return W(F(t, s), e, s);
  }
  function k(t) {
    switch (t) {
      case 0:
        return "*";
      case 1:
        return "?";
      case 2:
        return "+";
      case 3:
        return "";
    }
  }
  function W(t, e, s = {}) {
    s.delimiter ??= "/#?", s.prefixes ??= "./", s.sensitive ??= false, s.strict ??= false, s.end ??= true, s.start ??= true, s.endsWith = "";
    let i = s.start ? "^" : "";
    for (let r of t) {
      if (r.type === 3) {
        r.modifier === 3 ? i += g(r.value) : i += `(?:${g(r.value)})${k(r.modifier)}`;
        continue;
      }
      e && e.push(r.name);
      let a = `[^${g(s.delimiter)}]+?`, n = r.value;
      if (r.type === 1 ? n = a : r.type === 0 && (n = D), !r.prefix.length && !r.suffix.length) {
        r.modifier === 3 || r.modifier === 1 ? i += `(${n})${k(r.modifier)}` : i += `((?:${n})${k(r.modifier)})`;
        continue;
      }
      if (r.modifier === 3 || r.modifier === 1) {
        i += `(?:${g(r.prefix)}(${n})${g(r.suffix)})`, i += k(r.modifier);
        continue;
      }
      i += `(?:${g(r.prefix)}`, i += `((?:${n})(?:`, i += g(r.suffix), i += g(r.prefix), i += `(?:${n}))*)${g(r.suffix)})`, r.modifier === 0 && (i += "?");
    }
    let o = `[${g(s.endsWith)}]|$`, u = `[${g(s.delimiter)}]`;
    if (s.end)
      return s.strict || (i += `${u}?`), s.endsWith.length ? i += `(?=${o})` : i += "$", new RegExp(i, j(s));
    s.strict || (i += `(?:${u}(?=${o}))?`);
    let h = false;
    if (t.length) {
      let r = t[t.length - 1];
      r.type === 3 && r.modifier === 3 && (h = s.delimiter.indexOf(r) > -1);
    }
    return h || (i += `(?=${u}|${o})`), new RegExp(i, j(s));
  }
  var E = { delimiter: "", prefixes: "", sensitive: true, strict: true };
  var rt = { delimiter: ".", prefixes: "", sensitive: true, strict: true };
  var it = { delimiter: "/", prefixes: "/", sensitive: true, strict: true };
  function nt(t, e) {
    return t.length ? t[0] === "/" ? true : !e || t.length < 2 ? false : (t[0] == "\\" || t[0] == "{") && t[1] == "/" : false;
  }
  function K(t, e) {
    return t.startsWith(e) ? t.substring(e.length, t.length) : t;
  }
  function ht(t, e) {
    return t.endsWith(e) ? t.substr(0, t.length - e.length) : t;
  }
  function G(t) {
    return !t || t.length < 2 ? false : t[0] === "[" || (t[0] === "\\" || t[0] === "{") && t[1] === "[";
  }
  var X = ["ftp", "file", "http", "https", "ws", "wss"];
  function V(t) {
    if (!t)
      return true;
    for (let e of X)
      if (t.test(e))
        return true;
    return false;
  }
  function at(t, e) {
    if (t = K(t, "#"), e || t === "")
      return t;
    let s = new URL("https://example.com");
    return s.hash = t, s.hash ? s.hash.substring(1, s.hash.length) : "";
  }
  function ot(t, e) {
    if (t = K(t, "?"), e || t === "")
      return t;
    let s = new URL("https://example.com");
    return s.search = t, s.search ? s.search.substring(1, s.search.length) : "";
  }
  function ut(t, e) {
    return e || t === "" ? t : G(t) ? q(t) : Z(t);
  }
  function pt(t, e) {
    if (e || t === "")
      return t;
    let s = new URL("https://example.com");
    return s.password = t, s.password;
  }
  function ct(t, e) {
    if (e || t === "")
      return t;
    let s = new URL("https://example.com");
    return s.username = t, s.username;
  }
  function ft(t, e, s) {
    if (s || t === "")
      return t;
    if (e && !X.includes(e))
      return new URL(`${e}:${t}`).pathname;
    let i = t[0] == "/";
    return t = new URL(i ? t : "/-" + t, "https://example.com").pathname, i || (t = t.substring(2, t.length)), t;
  }
  function lt(t, e, s) {
    return z(e) === t && (t = ""), s || t === "" ? t : B(t);
  }
  function mt(t, e) {
    return t = ht(t, ":"), e || t === "" ? t : N(t);
  }
  function z(t) {
    switch (t) {
      case "ws":
      case "http":
        return "80";
      case "wws":
      case "https":
        return "443";
      case "ftp":
        return "21";
      default:
        return "";
    }
  }
  function N(t) {
    if (t === "")
      return t;
    if (/^[-+.A-Za-z0-9]*$/.test(t))
      return t.toLowerCase();
    throw new TypeError(`Invalid protocol '${t}'.`);
  }
  function gt(t) {
    if (t === "")
      return t;
    let e = new URL("https://example.com");
    return e.username = t, e.username;
  }
  function dt(t) {
    if (t === "")
      return t;
    let e = new URL("https://example.com");
    return e.password = t, e.password;
  }
  function Z(t) {
    if (t === "")
      return t;
    if (/[\t\n\r #%/:<>?@[\]^\\|]/g.test(t))
      throw new TypeError(`Invalid hostname '${t}'`);
    let e = new URL("https://example.com");
    return e.hostname = t, e.hostname;
  }
  function q(t) {
    if (t === "")
      return t;
    if (/[^0-9a-fA-F[\]:]/g.test(t))
      throw new TypeError(`Invalid IPv6 hostname '${t}'`);
    return t.toLowerCase();
  }
  function B(t) {
    if (t === "" || /^[0-9]*$/.test(t) && parseInt(t) <= 65535)
      return t;
    throw new TypeError(`Invalid port '${t}'.`);
  }
  function wt(t) {
    if (t === "")
      return t;
    let e = new URL("https://example.com");
    return e.pathname = t[0] !== "/" ? "/-" + t : t, t[0] !== "/" ? e.pathname.substring(2, e.pathname.length) : e.pathname;
  }
  function yt(t) {
    return t === "" ? t : new URL(`data:${t}`).pathname;
  }
  function bt(t) {
    if (t === "")
      return t;
    let e = new URL("https://example.com");
    return e.search = t, e.search.substring(1, e.search.length);
  }
  function xt(t) {
    if (t === "")
      return t;
    let e = new URL("https://example.com");
    return e.hash = t, e.hash.substring(1, e.hash.length);
  }
  var $t = class {
    #n;
    #r = [];
    #e = {};
    #t = 0;
    #i = 1;
    #f = 0;
    #o = 0;
    #l = 0;
    #m = 0;
    #g = false;
    constructor(t) {
      this.#n = t;
    }
    get result() {
      return this.#e;
    }
    parse() {
      for (this.#r = M(this.#n, true); this.#t < this.#r.length; this.#t += this.#i) {
        if (this.#i = 1, this.#r[this.#t].type === "END") {
          if (this.#o === 0) {
            this.#b(), this.#u() ? this.#s(9, 1) : this.#p() ? (this.#s(8, 1), this.#e.hash = "") : (this.#s(7, 0), this.#e.search = "", this.#e.hash = "");
            continue;
          } else if (this.#o === 2) {
            this.#c(5);
            continue;
          }
          this.#s(10, 0);
          break;
        }
        if (this.#l > 0)
          if (this.#C())
            this.#l -= 1;
          else
            continue;
        if (this.#k()) {
          this.#l += 1;
          continue;
        }
        switch (this.#o) {
          case 0:
            this.#x() && (this.#e.username = "", this.#e.password = "", this.#e.hostname = "", this.#e.port = "", this.#e.pathname = "", this.#e.search = "", this.#e.hash = "", this.#c(1));
            break;
          case 1:
            if (this.#x()) {
              this.#P();
              let t = 7, e = 1;
              this.#g && (this.#e.pathname = "/"), this.#E() ? (t = 2, e = 3) : this.#g && (t = 2), this.#s(t, e);
            }
            break;
          case 2:
            this.#w() ? this.#c(3) : (this.#y() || this.#p() || this.#u()) && this.#c(5);
            break;
          case 3:
            this.#R() ? this.#s(4, 1) : this.#w() && this.#s(5, 1);
            break;
          case 4:
            this.#w() && this.#s(5, 1);
            break;
          case 5:
            this.#L() ? this.#m += 1 : this.#A() && (this.#m -= 1), this.#v() && !this.#m ? this.#s(6, 1) : this.#y() ? this.#s(7, 0) : this.#p() ? this.#s(8, 1) : this.#u() && this.#s(9, 1);
            break;
          case 6:
            this.#y() ? this.#s(7, 0) : this.#p() ? this.#s(8, 1) : this.#u() && this.#s(9, 1);
            break;
          case 7:
            this.#p() ? this.#s(8, 1) : this.#u() && this.#s(9, 1);
            break;
          case 8:
            this.#u() && this.#s(9, 1);
            break;
          case 9:
            break;
          case 10:
            break;
        }
      }
    }
    #s(t, e) {
      switch (this.#o) {
        case 0:
          break;
        case 1:
          this.#e.protocol = this.#a();
          break;
        case 2:
          break;
        case 3:
          this.#e.username = this.#a();
          break;
        case 4:
          this.#e.password = this.#a();
          break;
        case 5:
          this.#e.hostname = this.#a();
          break;
        case 6:
          this.#e.port = this.#a();
          break;
        case 7:
          this.#e.pathname = this.#a();
          break;
        case 8:
          this.#e.search = this.#a();
          break;
        case 9:
          this.#e.hash = this.#a();
          break;
        case 10:
          break;
      }
      this.#$(t, e);
    }
    #$(t, e) {
      this.#o = t, this.#f = this.#t + e, this.#t += e, this.#i = 0;
    }
    #b() {
      this.#t = this.#f, this.#i = 0;
    }
    #c(t) {
      this.#b(), this.#o = t;
    }
    #d(t) {
      return t < 0 && (t = this.#r.length - t), t < this.#r.length ? this.#r[t] : this.#r[this.#r.length - 1];
    }
    #h(t, e) {
      let s = this.#d(t);
      return s.value === e && (s.type === "CHAR" || s.type === "ESCAPED_CHAR" || s.type === "INVALID_CHAR");
    }
    #x() {
      return this.#h(this.#t, ":");
    }
    #E() {
      return this.#h(this.#t + 1, "/") && this.#h(this.#t + 2, "/");
    }
    #w() {
      return this.#h(this.#t, "@");
    }
    #R() {
      return this.#h(this.#t, ":");
    }
    #v() {
      return this.#h(this.#t, ":");
    }
    #y() {
      return this.#h(this.#t, "/");
    }
    #p() {
      if (this.#h(this.#t, "?"))
        return true;
      if (this.#r[this.#t].value !== "?")
        return false;
      let t = this.#d(this.#t - 1);
      return t.type !== "NAME" && t.type !== "REGEX" && t.type !== "CLOSE" && t.type !== "ASTERISK";
    }
    #u() {
      return this.#h(this.#t, "#");
    }
    #k() {
      return this.#r[this.#t].type == "OPEN";
    }
    #C() {
      return this.#r[this.#t].type == "CLOSE";
    }
    #L() {
      return this.#h(this.#t, "[");
    }
    #A() {
      return this.#h(this.#t, "]");
    }
    #a() {
      let t = this.#r[this.#t], e = this.#d(this.#f).index;
      return this.#n.substring(e, t.index);
    }
    #P() {
      let t = {};
      Object.assign(t, E), t.encodePart = N;
      let e = st(this.#a(), void 0, t);
      this.#g = V(e);
    }
  };
  var S = ["protocol", "username", "password", "hostname", "port", "pathname", "search", "hash"];
  var $ = "*";
  function H(t, e) {
    if (typeof t != "string")
      throw new TypeError("parameter 1 is not of type 'string'.");
    let s = new URL(t, e);
    return { protocol: s.protocol.substring(0, s.protocol.length - 1), username: s.username, password: s.password, hostname: s.hostname, port: s.port, pathname: s.pathname, search: s.search !== "" ? s.search.substring(1, s.search.length) : void 0, hash: s.hash !== "" ? s.hash.substring(1, s.hash.length) : void 0 };
  }
  function y(t, e) {
    return e ? A(t) : t;
  }
  function L(t, e, s) {
    let i;
    if (typeof e.baseURL == "string")
      try {
        i = new URL(e.baseURL), t.protocol = y(i.protocol.substring(0, i.protocol.length - 1), s), t.username = y(i.username, s), t.password = y(i.password, s), t.hostname = y(i.hostname, s), t.port = y(i.port, s), t.pathname = y(i.pathname, s), t.search = y(i.search.substring(1, i.search.length), s), t.hash = y(i.hash.substring(1, i.hash.length), s);
      } catch {
        throw new TypeError(`invalid baseURL '${e.baseURL}'.`);
      }
    if (typeof e.protocol == "string" && (t.protocol = mt(e.protocol, s)), typeof e.username == "string" && (t.username = ct(e.username, s)), typeof e.password == "string" && (t.password = pt(e.password, s)), typeof e.hostname == "string" && (t.hostname = ut(e.hostname, s)), typeof e.port == "string" && (t.port = lt(e.port, t.protocol, s)), typeof e.pathname == "string") {
      if (t.pathname = e.pathname, i && !nt(t.pathname, s)) {
        let o = i.pathname.lastIndexOf("/");
        o >= 0 && (t.pathname = y(i.pathname.substring(0, o + 1), s) + t.pathname);
      }
      t.pathname = ft(t.pathname, t.protocol, s);
    }
    return typeof e.search == "string" && (t.search = ot(e.search, s)), typeof e.hash == "string" && (t.hash = at(e.hash, s)), t;
  }
  function A(t) {
    return t.replace(/([+*?:{}()\\])/g, "\\$1");
  }
  function Et(t) {
    return t.replace(/([.+*?^${}()[\]|/\\])/g, "\\$1");
  }
  function Rt(t, e) {
    e.delimiter ??= "/#?", e.prefixes ??= "./", e.sensitive ??= false, e.strict ??= false, e.end ??= true, e.start ??= true, e.endsWith = "";
    let s = ".*", i = `[^${Et(e.delimiter)}]+?`, o = /[$_\u200C\u200D\p{ID_Continue}]/u, u = "";
    for (let h = 0; h < t.length; ++h) {
      let r = t[h];
      if (r.type === 3) {
        if (r.modifier === 3) {
          u += A(r.value);
          continue;
        }
        u += `{${A(r.value)}}${k(r.modifier)}`;
        continue;
      }
      let a = r.hasCustomName(), n = !!r.suffix.length || !!r.prefix.length && (r.prefix.length !== 1 || !e.prefixes.includes(r.prefix)), f = h > 0 ? t[h - 1] : null, w = h < t.length - 1 ? t[h + 1] : null;
      if (!n && a && r.type === 1 && r.modifier === 3 && w && !w.prefix.length && !w.suffix.length)
        if (w.type === 3) {
          let R = w.value.length > 0 ? w.value[0] : "";
          n = o.test(R);
        } else
          n = !w.hasCustomName();
      if (!n && !r.prefix.length && f && f.type === 3) {
        let R = f.value[f.value.length - 1];
        n = e.prefixes.includes(R);
      }
      n && (u += "{"), u += A(r.prefix), a && (u += `:${r.name}`), r.type === 2 ? u += `(${r.value})` : r.type === 1 ? a || (u += `(${i})`) : r.type === 0 && (!a && (!f || f.type === 3 || f.modifier !== 3 || n || r.prefix !== "") ? u += "*" : u += `(${s})`), r.type === 1 && a && r.suffix.length && o.test(r.suffix[0]) && (u += "\\"), u += A(r.suffix), n && (u += "}"), r.modifier !== 3 && (u += k(r.modifier));
    }
    return u;
  }
  var J = class {
    #n;
    #r = {};
    #e = {};
    #t = {};
    #i = {};
    constructor(t = {}, e, s) {
      try {
        let i;
        if (typeof e == "string" ? i = e : s = e, typeof t == "string") {
          let r = new $t(t);
          if (r.parse(), t = r.result, i === void 0 && typeof t.protocol != "string")
            throw new TypeError("A base URL must be provided for a relative constructor string.");
          t.baseURL = i;
        } else {
          if (!t || typeof t != "object")
            throw new TypeError("parameter 1 is not of type 'string' and cannot convert to dictionary.");
          if (i)
            throw new TypeError("parameter 1 is not of type 'string'.");
        }
        typeof s > "u" && (s = { ignoreCase: false });
        let o = { ignoreCase: s.ignoreCase === true }, u = { pathname: $, protocol: $, username: $, password: $, hostname: $, port: $, search: $, hash: $ };
        this.#n = L(u, t, true), z(this.#n.protocol) === this.#n.port && (this.#n.port = "");
        let h;
        for (h of S) {
          if (!(h in this.#n))
            continue;
          let r = {}, a = this.#n[h];
          switch (this.#e[h] = [], h) {
            case "protocol":
              Object.assign(r, E), r.encodePart = N;
              break;
            case "username":
              Object.assign(r, E), r.encodePart = gt;
              break;
            case "password":
              Object.assign(r, E), r.encodePart = dt;
              break;
            case "hostname":
              Object.assign(r, rt), G(a) ? r.encodePart = q : r.encodePart = Z;
              break;
            case "port":
              Object.assign(r, E), r.encodePart = B;
              break;
            case "pathname":
              V(this.#r.protocol) ? (Object.assign(r, it, o), r.encodePart = wt) : (Object.assign(r, E, o), r.encodePart = yt);
              break;
            case "search":
              Object.assign(r, E, o), r.encodePart = bt;
              break;
            case "hash":
              Object.assign(r, E, o), r.encodePart = xt;
              break;
          }
          try {
            this.#i[h] = F(a, r), this.#r[h] = W(this.#i[h], this.#e[h], r), this.#t[h] = Rt(this.#i[h], r);
          } catch {
            throw new TypeError(`invalid ${h} pattern '${this.#n[h]}'.`);
          }
        }
      } catch (i) {
        throw new TypeError(`Failed to construct 'URLPattern': ${i.message}`);
      }
    }
    test(t = {}, e) {
      let s = { pathname: "", protocol: "", username: "", password: "", hostname: "", port: "", search: "", hash: "" };
      if (typeof t != "string" && e)
        throw new TypeError("parameter 1 is not of type 'string'.");
      if (typeof t > "u")
        return false;
      try {
        typeof t == "object" ? s = L(s, t, false) : s = L(s, H(t, e), false);
      } catch {
        return false;
      }
      let i;
      for (i of S)
        if (!this.#r[i].exec(s[i]))
          return false;
      return true;
    }
    exec(t = {}, e) {
      let s = { pathname: "", protocol: "", username: "", password: "", hostname: "", port: "", search: "", hash: "" };
      if (typeof t != "string" && e)
        throw new TypeError("parameter 1 is not of type 'string'.");
      if (typeof t > "u")
        return;
      try {
        typeof t == "object" ? s = L(s, t, false) : s = L(s, H(t, e), false);
      } catch {
        return null;
      }
      let i = {};
      e ? i.inputs = [t, e] : i.inputs = [t];
      let o;
      for (o of S) {
        let u = this.#r[o].exec(s[o]);
        if (!u)
          return null;
        let h = {};
        for (let [r, a] of this.#e[o].entries())
          if (typeof a == "string" || typeof a == "number") {
            let n = u[r + 1];
            h[a] = n;
          }
        i[o] = { input: s[o] ?? "", groups: h };
      }
      return i;
    }
    static compareComponent(t, e, s) {
      let i = (r, a) => {
        for (let n of ["type", "modifier", "prefix", "value", "suffix"]) {
          if (r[n] < a[n])
            return -1;
          if (r[n] !== a[n])
            return 1;
        }
        return 0;
      }, o = new P(3, "", "", "", "", 3), u = new P(0, "", "", "", "", 3), h = (r, a) => {
        let n = 0;
        for (; n < Math.min(r.length, a.length); ++n) {
          let f = i(r[n], a[n]);
          if (f)
            return f;
        }
        return r.length === a.length ? 0 : i(r[n] ?? o, a[n] ?? o);
      };
      return !e.#t[t] && !s.#t[t] ? 0 : e.#t[t] && !s.#t[t] ? h(e.#i[t], [u]) : !e.#t[t] && s.#t[t] ? h([u], s.#i[t]) : h(e.#i[t], s.#i[t]);
    }
    get protocol() {
      return this.#t.protocol;
    }
    get username() {
      return this.#t.username;
    }
    get password() {
      return this.#t.password;
    }
    get hostname() {
      return this.#t.hostname;
    }
    get port() {
      return this.#t.port;
    }
    get pathname() {
      return this.#t.pathname;
    }
    get search() {
      return this.#t.search;
    }
    get hash() {
      return this.#t.hash;
    }
  };
  globalThis.URLPattern || (globalThis.URLPattern = J);

  // https://deno.land/x/http_fns@v0.1.0/lib/as_url_pattern.ts
  function asURLPattern(pattern) {
    return typeof pattern === "string" ? new URLPattern({ pathname: pattern }) : pattern instanceof URLPattern ? pattern : new URLPattern(pattern);
  }

  // https://deno.land/x/http_fns@v0.1.0/lib/by_pattern.ts
  function byPattern(pattern, handler) {
    return async (req, ...args) => {
      const patterns = Array.isArray(pattern) ? pattern : [pattern];
      const url = new URL(req.url);
      for (const pattern2 of patterns) {
        const match = asURLPattern(pattern2).exec(url);
        if (match) {
          const res = await handler(req, match, ...args);
          if (res) {
            return res;
          }
        }
      }
      return null;
    };
  }

  // https://deno.land/x/http_fns@v0.1.0/lib/cascade.ts
  function cascade(...handlers) {
    return async (req, ...args) => {
      for (const handler of handlers) {
        const res = await handler(req, ...args);
        if (res) {
          return res;
        }
      }
      return null;
    };
  }

  // https://deno.land/x/jsx_stream@v0.0.13/_internal/readable_stream_from_iterable.ts
  function readableStreamFromIterable(iterable) {
    if ("from" in ReadableStream && typeof ReadableStream.from === "function") {
      return ReadableStream.from(iterable);
    }
    const iterator = iterable[Symbol.asyncIterator]?.() ?? iterable[Symbol.iterator]?.();
    return new ReadableStream({
      async pull(controller) {
        const { value, done } = await iterator.next();
        if (done) {
          controller.close();
        } else {
          controller.enqueue(value);
        }
      },
      async cancel(reason) {
        if (typeof iterator.throw == "function") {
          try {
            await iterator.throw(reason);
          } catch {
          }
        }
      }
    });
  }

  // https://deno.land/x/jsx_stream@v0.0.13/guards.ts
  function isPrimitiveValue(value) {
    return typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint";
  }
  function isPromiseLike(value) {
    return typeof value?.then === "function";
  }
  function isIterable(value) {
    return typeof value !== "string" && typeof value?.[Symbol.iterator] === "function";
  }
  function isAsyncIterable(value) {
    return typeof value?.[Symbol.asyncIterator] === "function";
  }

  // https://deno.land/std@0.208.0/html/entities.ts
  var rawToEntityEntries = [
    ["&", "&amp;"],
    ["<", "&lt;"],
    [">", "&gt;"],
    ['"', "&quot;"],
    ["'", "&#39;"]
  ];
  var defaultEntityList = Object.fromEntries([
    ...rawToEntityEntries.map(([raw, entity]) => [entity, raw]),
    ["&apos;", "'"],
    ["&nbsp;", "\xA0"]
  ]);
  var rawToEntity = new Map(rawToEntityEntries);
  var rawRe = new RegExp(`[${[...rawToEntity.keys()].join("")}]`, "g");
  function escape(str) {
    return str.replaceAll(rawRe, (m) => rawToEntity.get(m));
  }

  // https://deno.land/x/jsx_stream@v0.0.13/_internal/util.ts
  var VOID_ELEMENTS = /* @__PURE__ */ new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ]);
  function isVoidElement(tag) {
    return VOID_ELEMENTS.has(tag);
  }
  function isValidTag(tag) {
    return /^[a-zA-Z][a-zA-Z0-9\-]*$/.test(tag);
  }
  var SPECIAL_ATTRS = /* @__PURE__ */ new Set([
    "dangerouslySetInnerHTML"
  ]);
  function isValidAttr(name, value) {
    return value !== false && value !== void 0 && value !== null && !SPECIAL_ATTRS.has(name) && // deno-lint-ignore no-control-regex
    /^[^\u0000-\u001F\u007F-\u009F\s"'>/=\uFDD0-\uFDEF\p{NChar}]+$/u.test(name);
  }

  // https://deno.land/x/jsx_stream@v0.0.13/_internal/token.ts
  var _Token = class extends String {
    kind;
    tagName;
    attributes;
  };
  function safe(value) {
    return new _Token(value);
  }
  function escape2(value) {
    return safe(escape(String(value)));
  }
  function openTag(tagName, attrs) {
    return _tag(tagName, attrs, "open");
  }
  function voidTag(tagName, attrs) {
    return _tag(tagName, attrs, "void", "/");
  }
  function closeTag(tagName) {
    const token = new _Token(`</${tagName}>`);
    token.kind = "close";
    token.tagName = tagName;
    return token;
  }
  function isSafe(value) {
    return value instanceof _Token;
  }
  function isTag(value, kind) {
    return value instanceof _Token && !!value.kind && !!value.tagName && (kind ? value.kind === kind : true);
  }
  function _tag(tagName, attributes, kind, close = "") {
    let attrStr = "";
    for (const [name, value] of Object.entries(attributes)) {
      if (isValidAttr(name, value)) {
        attrStr += ` ${name}`;
        if (value !== true) {
          attrStr += `="${escape2(value)}"`;
        }
      }
    }
    const token = new _Token(`<${tagName}${attrStr}${close}>`);
    token.kind = kind;
    token.tagName = tagName;
    token.attributes = attributes;
    return token;
  }

  // https://deno.land/x/jsx_stream@v0.0.13/_internal/stream_node_sw.ts
  async function* streamNode(node, options) {
    const tagStack = [];
    const context = {
      scripts: /* @__PURE__ */ new Set(),
      stylesheets: /* @__PURE__ */ new Set()
    };
    yield* streamNode_(node);
    async function* streamNode_(node2) {
      if (isTag(node2, "open")) {
        tagStack.unshift([node2, []]);
        stashTokens(node2);
        yield* applyTagHooks("beforeStart", node2);
        yield String(node2);
        yield* applyTagHooks("afterStart", node2);
      } else if (isTag(node2, "void")) {
        stashTokens(node2);
        yield* applyTagHooks("beforeStart", node2);
        yield String(node2);
        yield* applyTagHooks("afterEnd", node2);
      } else if (isTag(node2, "close")) {
        stashTokens(node2);
        if (!tagStack.length) {
          console.error(
            `%cTag mismatch, closing tag </${node2.tagName}> has no opening tag.`,
            "color: red"
          );
        } else {
          const [[tag, tokens]] = tagStack;
          if (tag.tagName !== node2.tagName) {
            console.error(
              `%cTag mismatch, closing tag </${node2.tagName}> does not match expected opening tag <${tag.tagName}>`,
              "color: red"
            );
          }
          yield* applyTagHooks("beforeEnd", tag, tokens);
          yield String(node2);
          yield* applyTagHooks("afterEnd", tag, tokens);
          tagStack.shift();
        }
      } else if (isSafe(node2)) {
        stashTokens(node2);
        yield String(node2);
      } else if (typeof node2 === "string") {
        console.warn("%cWARNING: raw string detected:", "color: red", node2);
      } else if (isPromiseLike(node2)) {
        yield* streamNode_(await node2);
      } else if (isIterable(node2)) {
        for (const child of node2) {
          yield* streamNode_(child);
        }
      } else if (isAsyncIterable(node2)) {
        for await (const child of node2) {
          yield* streamNode_(child);
        }
      }
    }
    async function* applyTagHooks(place, tag, tokens) {
      const wildcards = tag.tagName.split("-").map(
        (_v, i, a) => [...a.slice(0, i), "*"].join("-")
      ).reverse();
      for (const name of [tag.tagName, ...wildcards]) {
        if (name) {
          const fn = asFunction(options?.tagHandlers?.[name]?.[place]);
          const node2 = fn?.(tag, context, tokens);
          if (node2) {
            yield* streamNode_(node2);
          }
        }
      }
    }
    function stashTokens(token) {
      for (const [tag, tokens] of tagStack) {
        const tagHooks = options?.tagHandlers?.[tag.tagName];
        if (tagHooks?.collectTokens && (tagHooks?.beforeEnd || tagHooks?.afterEnd)) {
          tokens?.push(token);
        }
      }
    }
  }
  function asFunction(fn) {
    return typeof fn === "function" ? fn : void 0;
  }

  // https://deno.land/x/jsx_stream@v0.0.13/serialize_sw.ts
  function renderBody(node, options) {
    return readableStreamFromIterable(streamNode(node, options)).pipeThrough(
      new TextEncoderStream()
    );
  }

  // https://deno.land/x/jsx_stream@v0.0.13/_internal/stream_component.ts
  function streamComponent(component, props) {
    return component(props);
  }

  // https://deno.land/x/jsx_stream@v0.0.13/_internal/awaited_props.ts
  function awaitedProps(props) {
    const promisedEntries = [];
    for (const [name, value] of Object.entries(props)) {
      if (isPromiseLike(value)) {
        promisedEntries.push((async () => [name, await value])());
      }
    }
    if (promisedEntries.length) {
      return Promise.all(promisedEntries).then((entries) => ({
        ...props,
        ...Object.fromEntries(entries)
      }));
    } else {
      return props;
    }
  }

  // https://deno.land/x/jsx_stream@v0.0.13/_internal/stream_fragment.ts
  function* streamFragment(children) {
    if (isSafe(children)) {
      yield children;
    } else if (isPrimitiveValue(children)) {
      yield escape2(children);
    } else if (isPromiseLike(children)) {
      yield children.then(streamFragment);
    } else if (isIterable(children)) {
      for (const child of children) {
        yield* streamFragment(child);
      }
    } else if (isAsyncIterable(children)) {
      yield async function* map(iterable) {
        for await (const node of iterable) {
          yield streamFragment(node);
        }
      }(children);
    }
  }

  // https://deno.land/x/jsx_stream@v0.0.13/_internal/stream_element.ts
  function* streamElement(tagName, props) {
    const { children, ...attrs } = props && typeof props === "object" ? props : {};
    const awaitedAttrs = awaitedProps(attrs);
    if (isPromiseLike(awaitedAttrs)) {
      yield awaitedAttrs.then((attrs2) => {
        return streamElement(tagName, { children, attrs: attrs2 });
      });
    } else {
      if (isVoidElement(tagName)) {
        yield voidTag(tagName, awaitedAttrs);
      } else {
        yield openTag(tagName, awaitedAttrs);
        const __html = awaitedAttrs.dangerouslySetInnerHTML?.__html;
        if (typeof __html === "string") {
          yield safe(__html);
        } else {
          yield* streamFragment(children);
        }
        yield closeTag(tagName);
      }
    }
  }

  // https://deno.land/x/jsx_stream@v0.0.13/_internal/stream_unknown.ts
  async function* streamUnknown(type) {
    console.warn(`Unknown JSX type: ${type}`);
  }

  // https://deno.land/x/jsx_stream@v0.0.13/jsx-runtime.ts
  function jsx(type, props) {
    try {
      if (typeof type === "function") {
        return streamComponent(type, props);
      } else if (type === null) {
        return streamFragment(props.children);
      } else if (isValidTag(type)) {
        return streamElement(type, props);
      } else {
        return streamUnknown(type);
      }
    } finally {
    }
  }

  // https://deno.land/x/http_render_fns@v0.1.0/lib/render_html.tsx
  var DOCTYPE = "<!DOCTYPE html>\n";
  var ENCODED_DOCTYPE = new TextEncoder().encode(DOCTYPE);
  var streamDelay = 0;
  function renderHTML(Component, headers, options) {
    return async (_req, props) => {
      const start = performance.now();
      const vnode = /* @__PURE__ */ jsx(Component, { ...props });
      let bodyInit = await renderBody(vnode, options);
      if (isData(bodyInit)) {
        return new Response(bodyInit, {
          status: 200,
          statusText: "OK",
          headers
        });
      } else if (isStream(bodyInit)) {
        const reader = bodyInit.getReader();
        bodyInit = new ReadableStream({
          start(controller) {
            controller.enqueue(ENCODED_DOCTYPE);
          },
          async pull(controller) {
            const { value, done } = await reader.read();
            if (done) {
              controller.close();
              logTiming("Stream");
            } else {
              controller.enqueue(value);
              if (streamDelay) {
                await new Promise((resolve) => setTimeout(resolve, streamDelay));
              }
            }
          }
        });
      } else {
        bodyInit = new Blob([
          DOCTYPE,
          bodyInit
        ]);
        logTiming("Blob");
      }
      const headersWithType = new Headers(headers);
      if (!headersWithType.has("Content-Type")) {
        headersWithType.set("Content-Type", "text/html; charset=utf-8");
      }
      return new Response(bodyInit, {
        status: 200,
        statusText: "OK",
        headers: headersWithType
      });
      function logTiming(note) {
        const end = performance.now();
        console.debug("Render took:", end - start, "ms", note);
      }
    };
  }
  function isStream(bodyInit) {
    return !!bodyInit && typeof bodyInit === "object" && "getReader" in bodyInit && typeof bodyInit.getReader === "function";
  }
  function isData(bodyInit) {
    return bodyInit instanceof FormData || bodyInit instanceof URLSearchParams;
  }

  // https://deno.land/x/http_fns@v0.1.0/lib/response/plain_error.ts
  function plainError(status, statusText, message) {
    return new Response(message ?? statusText, {
      status,
      statusText,
      headers: {
        "Content-Type": "text/plain"
      }
    });
  }

  // https://deno.land/x/http_fns@v0.1.0/lib/response/method_not_allowed.ts
  function methodNotAllowed(message) {
    return plainError(405, "Method Not Allowed", message);
  }

  // https://deno.land/x/http_fns@v0.1.0/lib/response/no_content.ts
  function noContent(headers) {
    return new Response(null, {
      status: 204,
      statusText: "No Content",
      headers
    });
  }

  // https://deno.land/x/http_fns@v0.1.0/lib/response/replace_body.ts
  function replaceBody(res, body) {
    return res.body === body ? res : new Response(body, {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers
    });
  }

  // https://deno.land/x/http_fns@v0.1.0/lib/by_method.ts
  function byMethod(handlers, fallback = () => methodNotAllowed()) {
    const defaultHandlers = {
      OPTIONS: optionsHandler(handlers)
    };
    if (handlers.GET) {
      defaultHandlers.HEAD = headHandler(handlers.GET);
    }
    return (req, ...args) => {
      const method = req.method;
      const handler = handlers[method] ?? defaultHandlers[method];
      if (handler) {
        return handler(req, ...args);
      }
      return fallback(req, ...args);
    };
  }
  function optionsHandler(handlers) {
    const methods = Object.keys(handlers);
    if ("GET" in handlers && !("HEAD" in handlers)) {
      methods.push("HEAD");
    }
    if (!("OPTIONS" in handlers)) {
      methods.push("OPTIONS");
    }
    const allow = methods.join(", ");
    return () => noContent({ allow });
  }
  var headHandler = (handler) => async (req, ...args) => {
    const response = await handler(req, ...args);
    return response ? replaceBody(response, null) : response;
  };

  // https://deno.land/x/http_fns@v0.1.0/lib/map_data.ts
  function mapData(mapper, handler) {
    return async (req, data) => handler(req, await mapper(req, data));
  }

  // config_fragment.ts
  var FRAGMENT_RENDER_OPTIONS = {
    deferredTimeout: false
  };

  // lib/route.ts
  function asRouteProps(req, match) {
    return { req, match };
  }

  // lib/handle_fragment.ts
  function handleFragment(Component, headers) {
    return byMethod({
      GET: mapData(
        asRouteProps,
        renderHTML(Component, headers, FRAGMENT_RENDER_OPTIONS)
      )
    });
  }

  // lib/evaluate.js
  function tokenize(input) {
    let scanner = 0;
    const tokens = [];
    while (scanner < input.length) {
      const char = input[scanner];
      if (/[0-9]/.test(char)) {
        let digits = "";
        while (scanner < input.length && /[0-9\.]/.test(input[scanner])) {
          digits += input[scanner++];
        }
        const number = parseFloat(digits);
        tokens.push(number);
        continue;
      }
      if (/[+\-/*()^]/.test(char)) {
        tokens.push(char);
        scanner++;
        continue;
      }
      if (char === " ") {
        scanner++;
        continue;
      }
      throw new Error(`Invalid token ${char} at position ${scanner}`);
    }
    return tokens;
  }
  function toRPN(tokens) {
    const operators = [];
    const out = [];
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (typeof token === "number") {
        out.push(token);
        continue;
      }
      if (/[+\-/*<>=^]/.test(token)) {
        while (shouldUnwindOperatorStack(operators, token)) {
          out.push(operators.pop());
        }
        operators.push(token);
        continue;
      }
      if (token === "(") {
        operators.push(token);
        continue;
      }
      if (token === ")") {
        while (operators.length > 0 && operators[operators.length - 1] !== "(") {
          out.push(operators.pop());
        }
        operators.pop();
        continue;
      }
      throw new Error(`Unparsed token ${token} at position ${i}`);
    }
    for (let i = operators.length - 1; i >= 0; i--) {
      out.push(operators[i]);
    }
    return out;
  }
  var precedence = { "^": 3, "*": 2, "/": 2, "+": 1, "-": 1 };
  function shouldUnwindOperatorStack(operators, nextToken) {
    if (operators.length === 0) {
      return false;
    }
    const lastOperator = operators[operators.length - 1];
    return precedence[lastOperator] >= precedence[nextToken];
  }
  function evalRPN(rpn) {
    const stack = [];
    for (let i = 0; i < rpn.length; i++) {
      const token = rpn[i];
      if (/[+\-/*^]/.test(token)) {
        stack.push(operate(token, stack));
        continue;
      }
      stack.push(token);
    }
    return stack.pop();
  }
  function operate(operator, stack) {
    const a = stack.pop();
    const b = stack.pop();
    switch (operator) {
      case "+":
        return b + a;
      case "-":
        return b - a;
      case "*":
        return b * a;
      case "/":
        return b / a;
      case "^":
        return Math.pow(b, a);
      default:
        throw new Error(`Invalid operator: ${operator}`);
    }
  }
  function evaluate(input) {
    return evalRPN(toRPN(tokenize(input)));
  }

  // https://deno.land/x/http_fns@v0.1.0/lib/request/search_values.ts
  function getSearchValues(input) {
    const searchParams = input instanceof Request ? new URL(input.url).searchParams : input instanceof URL ? input.searchParams : input instanceof URLSearchParams ? input : input && "search" in input && "input" in input.search ? new URLSearchParams(input.search.input) : void 0;
    return (param, separator) => {
      return searchParams ? separator ? searchParams.getAll(param).join(separator).split(separator).filter(
        (v) => v !== ""
      ) : searchParams.getAll(param) : [];
    };
  }

  // components/Evaluate.tsx
  async function Evaluate({ expr }) {
    if (expr) {
      console.log("Calculating...", expr);
      await new Promise((resolve) => setTimeout(resolve, 1));
      try {
        const result = evaluate(expr);
        console.log("The answer is:", result);
        if (!Number.isNaN(result)) {
          return /* @__PURE__ */ jsx("output", { class: "result", id: "result", children: result });
        }
      } catch (e) {
        console.error(e);
      }
      return /* @__PURE__ */ jsx("output", { class: "error", id: "result", children: "Error" });
    } else {
      return /* @__PURE__ */ jsx("output", { class: "blank", id: "result", children: "\xA0" });
    }
  }
  function evaluatePropsFrom(req) {
    return {
      expr: req && getSearchValues(req)("expr")[0] || ""
    };
  }

  // routes/calc/eval.tsx
  var eval_default = handleFragment(({ req }) => {
    return /* @__PURE__ */ jsx(Evaluate, { ...evaluatePropsFrom(req) });
  });

  // service_worker/routes.ts
  var routes_default = cascade(
    byPattern("/calc/eval", eval_default)
  );

  // service_worker/sw.js
  console.log("SERVICE WORKER");
  self.addEventListener("fetch", async (event) => {
    console.log("FETCH");
    const response = await routes_default(event.request);
    if (response) {
      event.respondWith(response);
    }
  });
})();
