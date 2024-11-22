(() => {
  // node_modules/.deno/urlpattern-polyfill@10.0.0/node_modules/urlpattern-polyfill/dist/urlpattern.js
  var R = class {
    type = 3;
    name = "";
    prefix = "";
    value = "";
    suffix = "";
    modifier = 3;
    constructor(t, r, n, o, c, l) {
      this.type = t, this.name = r, this.prefix = n, this.value = o, this.suffix = c, this.modifier = l;
    }
    hasCustomName() {
      return this.name !== "" && typeof this.name != "number";
    }
  };
  var be = /[$_\p{ID_Start}]/u;
  var Pe = /[$_\u200C\u200D\p{ID_Continue}]/u;
  var M = ".*";
  function Re(e, t) {
    return (t ? /^[\x00-\xFF]*$/ : /^[\x00-\x7F]*$/).test(e);
  }
  function v(e, t = false) {
    let r = [], n = 0;
    for (; n < e.length; ) {
      let o = e[n], c = function(l) {
        if (!t) throw new TypeError(l);
        r.push({ type: "INVALID_CHAR", index: n, value: e[n++] });
      };
      if (o === "*") {
        r.push({ type: "ASTERISK", index: n, value: e[n++] });
        continue;
      }
      if (o === "+" || o === "?") {
        r.push({ type: "OTHER_MODIFIER", index: n, value: e[n++] });
        continue;
      }
      if (o === "\\") {
        r.push({ type: "ESCAPED_CHAR", index: n++, value: e[n++] });
        continue;
      }
      if (o === "{") {
        r.push({ type: "OPEN", index: n, value: e[n++] });
        continue;
      }
      if (o === "}") {
        r.push({ type: "CLOSE", index: n, value: e[n++] });
        continue;
      }
      if (o === ":") {
        let l = "", s = n + 1;
        for (; s < e.length; ) {
          let i = e.substr(s, 1);
          if (s === n + 1 && be.test(i) || s !== n + 1 && Pe.test(i)) {
            l += e[s++];
            continue;
          }
          break;
        }
        if (!l) {
          c(`Missing parameter name at ${n}`);
          continue;
        }
        r.push({ type: "NAME", index: n, value: l }), n = s;
        continue;
      }
      if (o === "(") {
        let l = 1, s = "", i = n + 1, a = false;
        if (e[i] === "?") {
          c(`Pattern cannot start with "?" at ${i}`);
          continue;
        }
        for (; i < e.length; ) {
          if (!Re(e[i], false)) {
            c(`Invalid character '${e[i]}' at ${i}.`), a = true;
            break;
          }
          if (e[i] === "\\") {
            s += e[i++] + e[i++];
            continue;
          }
          if (e[i] === ")") {
            if (l--, l === 0) {
              i++;
              break;
            }
          } else if (e[i] === "(" && (l++, e[i + 1] !== "?")) {
            c(`Capturing groups are not allowed at ${i}`), a = true;
            break;
          }
          s += e[i++];
        }
        if (a) continue;
        if (l) {
          c(`Unbalanced pattern at ${n}`);
          continue;
        }
        if (!s) {
          c(`Missing pattern at ${n}`);
          continue;
        }
        r.push({ type: "REGEX", index: n, value: s }), n = i;
        continue;
      }
      r.push({ type: "CHAR", index: n, value: e[n++] });
    }
    return r.push({ type: "END", index: n, value: "" }), r;
  }
  function D(e, t = {}) {
    let r = v(e);
    t.delimiter ??= "/#?", t.prefixes ??= "./";
    let n = `[^${S(t.delimiter)}]+?`, o = [], c = 0, l = 0, s = "", i = /* @__PURE__ */ new Set(), a = (h) => {
      if (l < r.length && r[l].type === h) return r[l++].value;
    }, f = () => a("OTHER_MODIFIER") ?? a("ASTERISK"), d = (h) => {
      let u = a(h);
      if (u !== void 0) return u;
      let { type: p, index: A } = r[l];
      throw new TypeError(`Unexpected ${p} at ${A}, expected ${h}`);
    }, T = () => {
      let h = "", u;
      for (; u = a("CHAR") ?? a("ESCAPED_CHAR"); ) h += u;
      return h;
    }, Se = (h) => h, L = t.encodePart || Se, I = "", U = (h) => {
      I += h;
    }, $ = () => {
      I.length && (o.push(new R(3, "", "", L(I), "", 3)), I = "");
    }, V = (h, u, p, A, Y) => {
      let g = 3;
      switch (Y) {
        case "?":
          g = 1;
          break;
        case "*":
          g = 0;
          break;
        case "+":
          g = 2;
          break;
      }
      if (!u && !p && g === 3) {
        U(h);
        return;
      }
      if ($(), !u && !p) {
        if (!h) return;
        o.push(new R(3, "", "", L(h), "", g));
        return;
      }
      let m;
      p ? p === "*" ? m = M : m = p : m = n;
      let O = 2;
      m === n ? (O = 1, m = "") : m === M && (O = 0, m = "");
      let P;
      if (u ? P = u : p && (P = c++), i.has(P)) throw new TypeError(`Duplicate name '${P}'.`);
      i.add(P), o.push(new R(O, P, L(h), m, L(A), g));
    };
    for (; l < r.length; ) {
      let h = a("CHAR"), u = a("NAME"), p = a("REGEX");
      if (!u && !p && (p = a("ASTERISK")), u || p) {
        let g = h ?? "";
        t.prefixes.indexOf(g) === -1 && (U(g), g = ""), $();
        let m = f();
        V(g, u, p, "", m);
        continue;
      }
      let A = h ?? a("ESCAPED_CHAR");
      if (A) {
        U(A);
        continue;
      }
      if (a("OPEN")) {
        let g = T(), m = a("NAME"), O = a("REGEX");
        !m && !O && (O = a("ASTERISK"));
        let P = T();
        d("CLOSE");
        let xe = f();
        V(g, m, O, P, xe);
        continue;
      }
      $(), d("END");
    }
    return o;
  }
  function S(e) {
    return e.replace(/([.+*?^${}()[\]|/\\])/g, "\\$1");
  }
  function X(e) {
    return e && e.ignoreCase ? "ui" : "u";
  }
  function Z(e, t, r) {
    return F(D(e, r), t, r);
  }
  function k(e) {
    switch (e) {
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
  function F(e, t, r = {}) {
    r.delimiter ??= "/#?", r.prefixes ??= "./", r.sensitive ??= false, r.strict ??= false, r.end ??= true, r.start ??= true, r.endsWith = "";
    let n = r.start ? "^" : "";
    for (let s of e) {
      if (s.type === 3) {
        s.modifier === 3 ? n += S(s.value) : n += `(?:${S(s.value)})${k(s.modifier)}`;
        continue;
      }
      t && t.push(s.name);
      let i = `[^${S(r.delimiter)}]+?`, a = s.value;
      if (s.type === 1 ? a = i : s.type === 0 && (a = M), !s.prefix.length && !s.suffix.length) {
        s.modifier === 3 || s.modifier === 1 ? n += `(${a})${k(s.modifier)}` : n += `((?:${a})${k(s.modifier)})`;
        continue;
      }
      if (s.modifier === 3 || s.modifier === 1) {
        n += `(?:${S(s.prefix)}(${a})${S(s.suffix)})`, n += k(s.modifier);
        continue;
      }
      n += `(?:${S(s.prefix)}`, n += `((?:${a})(?:`, n += S(s.suffix), n += S(s.prefix), n += `(?:${a}))*)${S(s.suffix)})`, s.modifier === 0 && (n += "?");
    }
    let o = `[${S(r.endsWith)}]|$`, c = `[${S(r.delimiter)}]`;
    if (r.end) return r.strict || (n += `${c}?`), r.endsWith.length ? n += `(?=${o})` : n += "$", new RegExp(n, X(r));
    r.strict || (n += `(?:${c}(?=${o}))?`);
    let l = false;
    if (e.length) {
      let s = e[e.length - 1];
      s.type === 3 && s.modifier === 3 && (l = r.delimiter.indexOf(s) > -1);
    }
    return l || (n += `(?=${c}|${o})`), new RegExp(n, X(r));
  }
  var x = { delimiter: "", prefixes: "", sensitive: true, strict: true };
  var B = { delimiter: ".", prefixes: "", sensitive: true, strict: true };
  var q = { delimiter: "/", prefixes: "/", sensitive: true, strict: true };
  function J(e, t) {
    return e.length ? e[0] === "/" ? true : !t || e.length < 2 ? false : (e[0] == "\\" || e[0] == "{") && e[1] == "/" : false;
  }
  function Q(e, t) {
    return e.startsWith(t) ? e.substring(t.length, e.length) : e;
  }
  function Ee(e, t) {
    return e.endsWith(t) ? e.substr(0, e.length - t.length) : e;
  }
  function W(e) {
    return !e || e.length < 2 ? false : e[0] === "[" || (e[0] === "\\" || e[0] === "{") && e[1] === "[";
  }
  var ee = ["ftp", "file", "http", "https", "ws", "wss"];
  function N(e) {
    if (!e) return true;
    for (let t of ee) if (e.test(t)) return true;
    return false;
  }
  function te(e, t) {
    if (e = Q(e, "#"), t || e === "") return e;
    let r = new URL("https://example.com");
    return r.hash = e, r.hash ? r.hash.substring(1, r.hash.length) : "";
  }
  function re(e, t) {
    if (e = Q(e, "?"), t || e === "") return e;
    let r = new URL("https://example.com");
    return r.search = e, r.search ? r.search.substring(1, r.search.length) : "";
  }
  function ne(e, t) {
    return t || e === "" ? e : W(e) ? j(e) : z(e);
  }
  function se(e, t) {
    if (t || e === "") return e;
    let r = new URL("https://example.com");
    return r.password = e, r.password;
  }
  function ie(e, t) {
    if (t || e === "") return e;
    let r = new URL("https://example.com");
    return r.username = e, r.username;
  }
  function ae(e, t, r) {
    if (r || e === "") return e;
    if (t && !ee.includes(t)) return new URL(`${t}:${e}`).pathname;
    let n = e[0] == "/";
    return e = new URL(n ? e : "/-" + e, "https://example.com").pathname, n || (e = e.substring(2, e.length)), e;
  }
  function oe(e, t, r) {
    return _(t) === e && (e = ""), r || e === "" ? e : K(e);
  }
  function ce(e, t) {
    return e = Ee(e, ":"), t || e === "" ? e : y(e);
  }
  function _(e) {
    switch (e) {
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
  function y(e) {
    if (e === "") return e;
    if (/^[-+.A-Za-z0-9]*$/.test(e)) return e.toLowerCase();
    throw new TypeError(`Invalid protocol '${e}'.`);
  }
  function le(e) {
    if (e === "") return e;
    let t = new URL("https://example.com");
    return t.username = e, t.username;
  }
  function fe(e) {
    if (e === "") return e;
    let t = new URL("https://example.com");
    return t.password = e, t.password;
  }
  function z(e) {
    if (e === "") return e;
    if (/[\t\n\r #%/:<>?@[\]^\\|]/g.test(e)) throw new TypeError(`Invalid hostname '${e}'`);
    let t = new URL("https://example.com");
    return t.hostname = e, t.hostname;
  }
  function j(e) {
    if (e === "") return e;
    if (/[^0-9a-fA-F[\]:]/g.test(e)) throw new TypeError(`Invalid IPv6 hostname '${e}'`);
    return e.toLowerCase();
  }
  function K(e) {
    if (e === "" || /^[0-9]*$/.test(e) && parseInt(e) <= 65535) return e;
    throw new TypeError(`Invalid port '${e}'.`);
  }
  function he(e) {
    if (e === "") return e;
    let t = new URL("https://example.com");
    return t.pathname = e[0] !== "/" ? "/-" + e : e, e[0] !== "/" ? t.pathname.substring(2, t.pathname.length) : t.pathname;
  }
  function ue(e) {
    return e === "" ? e : new URL(`data:${e}`).pathname;
  }
  function de(e) {
    if (e === "") return e;
    let t = new URL("https://example.com");
    return t.search = e, t.search.substring(1, t.search.length);
  }
  function pe(e) {
    if (e === "") return e;
    let t = new URL("https://example.com");
    return t.hash = e, t.hash.substring(1, t.hash.length);
  }
  var H = class {
    #i;
    #n = [];
    #t = {};
    #e = 0;
    #s = 1;
    #l = 0;
    #o = 0;
    #d = 0;
    #p = 0;
    #g = false;
    constructor(t) {
      this.#i = t;
    }
    get result() {
      return this.#t;
    }
    parse() {
      for (this.#n = v(this.#i, true); this.#e < this.#n.length; this.#e += this.#s) {
        if (this.#s = 1, this.#n[this.#e].type === "END") {
          if (this.#o === 0) {
            this.#b(), this.#f() ? this.#r(9, 1) : this.#h() ? this.#r(8, 1) : this.#r(7, 0);
            continue;
          } else if (this.#o === 2) {
            this.#u(5);
            continue;
          }
          this.#r(10, 0);
          break;
        }
        if (this.#d > 0) if (this.#A()) this.#d -= 1;
        else continue;
        if (this.#T()) {
          this.#d += 1;
          continue;
        }
        switch (this.#o) {
          case 0:
            this.#P() && this.#u(1);
            break;
          case 1:
            if (this.#P()) {
              this.#C();
              let t = 7, r = 1;
              this.#E() ? (t = 2, r = 3) : this.#g && (t = 2), this.#r(t, r);
            }
            break;
          case 2:
            this.#S() ? this.#u(3) : (this.#x() || this.#h() || this.#f()) && this.#u(5);
            break;
          case 3:
            this.#O() ? this.#r(4, 1) : this.#S() && this.#r(5, 1);
            break;
          case 4:
            this.#S() && this.#r(5, 1);
            break;
          case 5:
            this.#y() ? this.#p += 1 : this.#w() && (this.#p -= 1), this.#k() && !this.#p ? this.#r(6, 1) : this.#x() ? this.#r(7, 0) : this.#h() ? this.#r(8, 1) : this.#f() && this.#r(9, 1);
            break;
          case 6:
            this.#x() ? this.#r(7, 0) : this.#h() ? this.#r(8, 1) : this.#f() && this.#r(9, 1);
            break;
          case 7:
            this.#h() ? this.#r(8, 1) : this.#f() && this.#r(9, 1);
            break;
          case 8:
            this.#f() && this.#r(9, 1);
            break;
          case 9:
            break;
          case 10:
            break;
        }
      }
      this.#t.hostname !== void 0 && this.#t.port === void 0 && (this.#t.port = "");
    }
    #r(t, r) {
      switch (this.#o) {
        case 0:
          break;
        case 1:
          this.#t.protocol = this.#c();
          break;
        case 2:
          break;
        case 3:
          this.#t.username = this.#c();
          break;
        case 4:
          this.#t.password = this.#c();
          break;
        case 5:
          this.#t.hostname = this.#c();
          break;
        case 6:
          this.#t.port = this.#c();
          break;
        case 7:
          this.#t.pathname = this.#c();
          break;
        case 8:
          this.#t.search = this.#c();
          break;
        case 9:
          this.#t.hash = this.#c();
          break;
        case 10:
          break;
      }
      this.#o !== 0 && t !== 10 && ([1, 2, 3, 4].includes(this.#o) && [6, 7, 8, 9].includes(t) && (this.#t.hostname ??= ""), [1, 2, 3, 4, 5, 6].includes(this.#o) && [8, 9].includes(t) && (this.#t.pathname ??= this.#g ? "/" : ""), [1, 2, 3, 4, 5, 6, 7].includes(this.#o) && t === 9 && (this.#t.search ??= "")), this.#R(t, r);
    }
    #R(t, r) {
      this.#o = t, this.#l = this.#e + r, this.#e += r, this.#s = 0;
    }
    #b() {
      this.#e = this.#l, this.#s = 0;
    }
    #u(t) {
      this.#b(), this.#o = t;
    }
    #m(t) {
      return t < 0 && (t = this.#n.length - t), t < this.#n.length ? this.#n[t] : this.#n[this.#n.length - 1];
    }
    #a(t, r) {
      let n = this.#m(t);
      return n.value === r && (n.type === "CHAR" || n.type === "ESCAPED_CHAR" || n.type === "INVALID_CHAR");
    }
    #P() {
      return this.#a(this.#e, ":");
    }
    #E() {
      return this.#a(this.#e + 1, "/") && this.#a(this.#e + 2, "/");
    }
    #S() {
      return this.#a(this.#e, "@");
    }
    #O() {
      return this.#a(this.#e, ":");
    }
    #k() {
      return this.#a(this.#e, ":");
    }
    #x() {
      return this.#a(this.#e, "/");
    }
    #h() {
      if (this.#a(this.#e, "?")) return true;
      if (this.#n[this.#e].value !== "?") return false;
      let t = this.#m(this.#e - 1);
      return t.type !== "NAME" && t.type !== "REGEX" && t.type !== "CLOSE" && t.type !== "ASTERISK";
    }
    #f() {
      return this.#a(this.#e, "#");
    }
    #T() {
      return this.#n[this.#e].type == "OPEN";
    }
    #A() {
      return this.#n[this.#e].type == "CLOSE";
    }
    #y() {
      return this.#a(this.#e, "[");
    }
    #w() {
      return this.#a(this.#e, "]");
    }
    #c() {
      let t = this.#n[this.#e], r = this.#m(this.#l).index;
      return this.#i.substring(r, t.index);
    }
    #C() {
      let t = {};
      Object.assign(t, x), t.encodePart = y;
      let r = Z(this.#c(), void 0, t);
      this.#g = N(r);
    }
  };
  var G = ["protocol", "username", "password", "hostname", "port", "pathname", "search", "hash"];
  var E = "*";
  function ge(e, t) {
    if (typeof e != "string") throw new TypeError("parameter 1 is not of type 'string'.");
    let r = new URL(e, t);
    return { protocol: r.protocol.substring(0, r.protocol.length - 1), username: r.username, password: r.password, hostname: r.hostname, port: r.port, pathname: r.pathname, search: r.search !== "" ? r.search.substring(1, r.search.length) : void 0, hash: r.hash !== "" ? r.hash.substring(1, r.hash.length) : void 0 };
  }
  function b(e, t) {
    return t ? C(e) : e;
  }
  function w(e, t, r) {
    let n;
    if (typeof t.baseURL == "string") try {
      n = new URL(t.baseURL), t.protocol === void 0 && (e.protocol = b(n.protocol.substring(0, n.protocol.length - 1), r)), !r && t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.username === void 0 && (e.username = b(n.username, r)), !r && t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.username === void 0 && t.password === void 0 && (e.password = b(n.password, r)), t.protocol === void 0 && t.hostname === void 0 && (e.hostname = b(n.hostname, r)), t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && (e.port = b(n.port, r)), t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.pathname === void 0 && (e.pathname = b(n.pathname, r)), t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.pathname === void 0 && t.search === void 0 && (e.search = b(n.search.substring(1, n.search.length), r)), t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.pathname === void 0 && t.search === void 0 && t.hash === void 0 && (e.hash = b(n.hash.substring(1, n.hash.length), r));
    } catch {
      throw new TypeError(`invalid baseURL '${t.baseURL}'.`);
    }
    if (typeof t.protocol == "string" && (e.protocol = ce(t.protocol, r)), typeof t.username == "string" && (e.username = ie(t.username, r)), typeof t.password == "string" && (e.password = se(t.password, r)), typeof t.hostname == "string" && (e.hostname = ne(t.hostname, r)), typeof t.port == "string" && (e.port = oe(t.port, e.protocol, r)), typeof t.pathname == "string") {
      if (e.pathname = t.pathname, n && !J(e.pathname, r)) {
        let o = n.pathname.lastIndexOf("/");
        o >= 0 && (e.pathname = b(n.pathname.substring(0, o + 1), r) + e.pathname);
      }
      e.pathname = ae(e.pathname, e.protocol, r);
    }
    return typeof t.search == "string" && (e.search = re(t.search, r)), typeof t.hash == "string" && (e.hash = te(t.hash, r)), e;
  }
  function C(e) {
    return e.replace(/([+*?:{}()\\])/g, "\\$1");
  }
  function Oe(e) {
    return e.replace(/([.+*?^${}()[\]|/\\])/g, "\\$1");
  }
  function ke(e, t) {
    t.delimiter ??= "/#?", t.prefixes ??= "./", t.sensitive ??= false, t.strict ??= false, t.end ??= true, t.start ??= true, t.endsWith = "";
    let r = ".*", n = `[^${Oe(t.delimiter)}]+?`, o = /[$_\u200C\u200D\p{ID_Continue}]/u, c = "";
    for (let l = 0; l < e.length; ++l) {
      let s = e[l];
      if (s.type === 3) {
        if (s.modifier === 3) {
          c += C(s.value);
          continue;
        }
        c += `{${C(s.value)}}${k(s.modifier)}`;
        continue;
      }
      let i = s.hasCustomName(), a = !!s.suffix.length || !!s.prefix.length && (s.prefix.length !== 1 || !t.prefixes.includes(s.prefix)), f = l > 0 ? e[l - 1] : null, d = l < e.length - 1 ? e[l + 1] : null;
      if (!a && i && s.type === 1 && s.modifier === 3 && d && !d.prefix.length && !d.suffix.length) if (d.type === 3) {
        let T = d.value.length > 0 ? d.value[0] : "";
        a = o.test(T);
      } else a = !d.hasCustomName();
      if (!a && !s.prefix.length && f && f.type === 3) {
        let T = f.value[f.value.length - 1];
        a = t.prefixes.includes(T);
      }
      a && (c += "{"), c += C(s.prefix), i && (c += `:${s.name}`), s.type === 2 ? c += `(${s.value})` : s.type === 1 ? i || (c += `(${n})`) : s.type === 0 && (!i && (!f || f.type === 3 || f.modifier !== 3 || a || s.prefix !== "") ? c += "*" : c += `(${r})`), s.type === 1 && i && s.suffix.length && o.test(s.suffix[0]) && (c += "\\"), c += C(s.suffix), a && (c += "}"), s.modifier !== 3 && (c += k(s.modifier));
    }
    return c;
  }
  var me = class {
    #i;
    #n = {};
    #t = {};
    #e = {};
    #s = {};
    #l = false;
    constructor(t = {}, r, n) {
      try {
        let o;
        if (typeof r == "string" ? o = r : n = r, typeof t == "string") {
          let i = new H(t);
          if (i.parse(), t = i.result, o === void 0 && typeof t.protocol != "string") throw new TypeError("A base URL must be provided for a relative constructor string.");
          t.baseURL = o;
        } else {
          if (!t || typeof t != "object") throw new TypeError("parameter 1 is not of type 'string' and cannot convert to dictionary.");
          if (o) throw new TypeError("parameter 1 is not of type 'string'.");
        }
        typeof n > "u" && (n = { ignoreCase: false });
        let c = { ignoreCase: n.ignoreCase === true }, l = { pathname: E, protocol: E, username: E, password: E, hostname: E, port: E, search: E, hash: E };
        this.#i = w(l, t, true), _(this.#i.protocol) === this.#i.port && (this.#i.port = "");
        let s;
        for (s of G) {
          if (!(s in this.#i)) continue;
          let i = {}, a = this.#i[s];
          switch (this.#t[s] = [], s) {
            case "protocol":
              Object.assign(i, x), i.encodePart = y;
              break;
            case "username":
              Object.assign(i, x), i.encodePart = le;
              break;
            case "password":
              Object.assign(i, x), i.encodePart = fe;
              break;
            case "hostname":
              Object.assign(i, B), W(a) ? i.encodePart = j : i.encodePart = z;
              break;
            case "port":
              Object.assign(i, x), i.encodePart = K;
              break;
            case "pathname":
              N(this.#n.protocol) ? (Object.assign(i, q, c), i.encodePart = he) : (Object.assign(i, x, c), i.encodePart = ue);
              break;
            case "search":
              Object.assign(i, x, c), i.encodePart = de;
              break;
            case "hash":
              Object.assign(i, x, c), i.encodePart = pe;
              break;
          }
          try {
            this.#s[s] = D(a, i), this.#n[s] = F(this.#s[s], this.#t[s], i), this.#e[s] = ke(this.#s[s], i), this.#l = this.#l || this.#s[s].some((f) => f.type === 2);
          } catch {
            throw new TypeError(`invalid ${s} pattern '${this.#i[s]}'.`);
          }
        }
      } catch (o) {
        throw new TypeError(`Failed to construct 'URLPattern': ${o.message}`);
      }
    }
    test(t = {}, r) {
      let n = { pathname: "", protocol: "", username: "", password: "", hostname: "", port: "", search: "", hash: "" };
      if (typeof t != "string" && r) throw new TypeError("parameter 1 is not of type 'string'.");
      if (typeof t > "u") return false;
      try {
        typeof t == "object" ? n = w(n, t, false) : n = w(n, ge(t, r), false);
      } catch {
        return false;
      }
      let o;
      for (o of G) if (!this.#n[o].exec(n[o])) return false;
      return true;
    }
    exec(t = {}, r) {
      let n = { pathname: "", protocol: "", username: "", password: "", hostname: "", port: "", search: "", hash: "" };
      if (typeof t != "string" && r) throw new TypeError("parameter 1 is not of type 'string'.");
      if (typeof t > "u") return;
      try {
        typeof t == "object" ? n = w(n, t, false) : n = w(n, ge(t, r), false);
      } catch {
        return null;
      }
      let o = {};
      r ? o.inputs = [t, r] : o.inputs = [t];
      let c;
      for (c of G) {
        let l = this.#n[c].exec(n[c]);
        if (!l) return null;
        let s = {};
        for (let [i, a] of this.#t[c].entries()) if (typeof a == "string" || typeof a == "number") {
          let f = l[i + 1];
          s[a] = f;
        }
        o[c] = { input: n[c] ?? "", groups: s };
      }
      return o;
    }
    static compareComponent(t, r, n) {
      let o = (i, a) => {
        for (let f of ["type", "modifier", "prefix", "value", "suffix"]) {
          if (i[f] < a[f]) return -1;
          if (i[f] === a[f]) continue;
          return 1;
        }
        return 0;
      }, c = new R(3, "", "", "", "", 3), l = new R(0, "", "", "", "", 3), s = (i, a) => {
        let f = 0;
        for (; f < Math.min(i.length, a.length); ++f) {
          let d = o(i[f], a[f]);
          if (d) return d;
        }
        return i.length === a.length ? 0 : o(i[f] ?? c, a[f] ?? c);
      };
      return !r.#e[t] && !n.#e[t] ? 0 : r.#e[t] && !n.#e[t] ? s(r.#s[t], [l]) : !r.#e[t] && n.#e[t] ? s([l], n.#s[t]) : s(r.#s[t], n.#s[t]);
    }
    get protocol() {
      return this.#e.protocol;
    }
    get username() {
      return this.#e.username;
    }
    get password() {
      return this.#e.password;
    }
    get hostname() {
      return this.#e.hostname;
    }
    get port() {
      return this.#e.port;
    }
    get pathname() {
      return this.#e.pathname;
    }
    get search() {
      return this.#e.search;
    }
    get hash() {
      return this.#e.hash;
    }
    get hasRegExpGroups() {
      return this.#l;
    }
  };

  // node_modules/.deno/urlpattern-polyfill@10.0.0/node_modules/urlpattern-polyfill/index.js
  if (!globalThis.URLPattern) {
    globalThis.URLPattern = me;
  }

  // https://jsr.io/@http/route/0.24.0/as_url_pattern.ts
  function asURLPattern(pattern) {
    return typeof pattern === "string" ? new URLPattern({ pathname: pattern }) : pattern instanceof URLPattern ? pattern : new URLPattern(pattern);
  }
  function asURLPatterns(pattern) {
    return Array.isArray(pattern) ? pattern.map(asURLPattern) : [asURLPattern(pattern)];
  }

  // https://jsr.io/@http/route/0.24.0/by_pattern.ts
  function byPattern(pattern, handler) {
    const patterns = asURLPatterns(pattern);
    return async (req, ...args) => {
      for (const pattern2 of patterns) {
        const match = pattern2.exec(req.url);
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

  // https://jsr.io/@http/route/0.24.0/cascade.ts
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

  // https://jsr.io/@http/response/0.24.0/plain_error.ts
  function plainError(status, statusText, message) {
    return new Response(message ?? statusText, {
      status,
      statusText,
      headers: {
        "Content-Type": "text/plain"
      }
    });
  }

  // https://jsr.io/@http/response/0.24.0/method_not_allowed.ts
  function methodNotAllowed(message) {
    return plainError(405, "Method Not Allowed", message);
  }

  // https://jsr.io/@http/response/0.24.0/no_content.ts
  function noContent(headers) {
    return new Response(null, {
      status: 204,
      statusText: "No Content",
      headers
    });
  }

  // https://jsr.io/@http/response/0.24.0/replace_body.ts
  function replaceBody(res, body) {
    return res.body === body ? res : new Response(body, {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers
    });
  }

  // https://jsr.io/@http/route/0.24.0/by_method.ts
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

  // https://jsr.io/@std/html/1.0.3/entities.ts
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

  // https://jsr.io/@http/html-stream/0.6.0/util.ts
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
  var SPECIAL_ATTRS = /* @__PURE__ */ new Set([
    "dangerouslySetInnerHTML"
  ]);
  function isValidAttr(name, value) {
    return value !== false && value !== void 0 && value !== null && !SPECIAL_ATTRS.has(name) && // deno-lint-ignore no-control-regex
    /^[^\u0000-\u001F\u007F-\u009F\s"'>/=\uFDD0-\uFDEF\p{NChar}]+$/u.test(name);
  }

  // https://jsr.io/@http/html-stream/0.6.0/token.ts
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
  function docType(type = "html") {
    const token = new _Token(`<!DOCTYPE ${type}>`);
    token.tagName = "!DOCTYPE";
    token.attributes = { type };
    return token;
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

  // https://jsr.io/@http/html-stream/0.6.0/transform/prepend_doctype.ts
  function prependDocType(type = "html") {
    return async function* (tokens) {
      yield docType(type);
      yield* tokens;
    };
  }

  // https://jsr.io/@http/token-stream/0.6.0/transform/safety_filter.ts
  function safetyFilter(isSafe2) {
    return async function* (tokens) {
      for await (const token of tokens) {
        if (isSafe2(token)) {
          yield token;
        } else if (typeof token === "string") {
          console.warn("%cWARNING: raw string detected:", "color: red", token);
        } else {
          console.warn("%cWARNING: unknown token:", "color: red", token);
        }
      }
    };
  }

  // https://jsr.io/@http/token-stream/0.6.0/readable_stream_from_iterable.ts
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

  // https://jsr.io/@http/token-stream/0.6.0/guards.ts
  function isPrimitiveValue(value) {
    return typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint";
  }
  function isPromiseLike(value) {
    return typeof value?.then === "function";
  }
  function isIterable(value) {
    return typeof value !== "string" && !(value instanceof String) && typeof value?.[Symbol.iterator] === "function";
  }
  function isAsyncIterable(value) {
    return typeof value?.[Symbol.asyncIterator] === "function";
  }
  function isNodeIteration(node) {
    return typeof node?.iterator?.next === "function";
  }

  // https://jsr.io/@http/token-stream/0.6.0/flatten_tokens.ts
  async function* flattenTokens(node, deferrals) {
    yield* flatten_(node);
    if (deferrals) {
      yield* deferrals;
    }
    async function* flatten_(node2) {
      if (isPromiseLike(node2)) {
        if (deferrals) {
          const awaited = await deferrals.timeout(node2);
          if (awaited) {
            yield* flatten_(awaited);
          } else {
            yield deferrals.defer(flattenAwaited(node2));
          }
        } else {
          yield* flatten_(await node2);
        }
      } else if (isIterable(node2)) {
        for (const child of node2) {
          yield* flatten_(child);
        }
      } else if (isAsyncIterable(node2)) {
        if (deferrals) {
          yield* flatten_(firstNodeIteration(node2));
        } else {
          for await (const child of node2) {
            yield* flatten_(child);
          }
        }
      } else if (isNodeIteration(node2)) {
        if (!node2.done) {
          yield* flatten_(node2.value);
          yield* flatten_(nextNodeIteration(node2.iterator));
        }
      } else {
        yield node2;
      }
    }
    async function* flattenAwaited(node2) {
      const awaited = await node2;
      yield* flatten_(awaited);
    }
    function firstNodeIteration(iterable) {
      return nextNodeIteration(iterable[Symbol.asyncIterator]());
    }
    async function nextNodeIteration(iterator) {
      const result = await iterator.next();
      return {
        ...result,
        iterator
      };
    }
  }

  // https://jsr.io/@http/token-stream/0.6.0/transform_tokens.ts
  function transformTokens(transformers) {
    return (tokens) => {
      if (transformers) {
        for (const transform of transformers) {
          tokens = transform(tokens);
        }
      }
      return tokens;
    };
  }

  // https://jsr.io/@http/token-stream/0.6.0/transform/as_encoded.ts
  function asEncoded() {
    const encoder = new TextEncoder();
    return async function* (tokens) {
      for await (const token of tokens) {
        yield encoder.encode(token);
      }
    };
  }

  // https://jsr.io/@http/token-stream/0.6.0/render_body.ts
  function renderBody(node, options) {
    let tokens = flattenTokens(node, options?.deferralHandler);
    tokens = transformTokens(options?.transformers)(tokens);
    const chunks = asEncoded()(tokens);
    return readableStreamFromIterable(chunks);
  }

  // https://jsr.io/@http/html-stream/0.6.0/render_html_body.ts
  function renderHtmlBody(node, options) {
    const transformers = [
      prependDocType(),
      ...options?.transformers ?? [],
      safetyFilter(isSafe)
    ];
    return renderBody(node, {
      ...options,
      transformers
    });
  }

  // https://jsr.io/@http/html-stream/0.6.0/render_html_response.ts
  function renderHtmlResponse(node, options) {
    const headers = new Headers(options?.headers);
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "text/html");
    }
    return new Response(renderHtmlBody(node, options), {
      status: 200,
      statusText: "OK",
      headers
    });
  }

  // https://jsr.io/@http/jsx-stream/0.6.0/stream_component.ts
  function streamComponent(component, props) {
    return component(props);
  }

  // https://jsr.io/@http/jsx-stream/0.6.0/awaited_props.ts
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

  // https://jsr.io/@http/jsx-stream/0.6.0/stream_fragment.ts
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

  // https://jsr.io/@http/jsx-stream/0.6.0/stream_element.ts
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

  // https://jsr.io/@http/jsx-stream/0.6.0/stream_unknown.ts
  async function* streamUnknown(type) {
    console.warn(`Unknown JSX type: ${type}`);
  }

  // https://jsr.io/@http/jsx-stream/0.6.0/jsx_runtime.ts
  function jsx(type, props) {
    if (typeof type === "function") {
      return streamComponent(type, props);
    } else if (type === null) {
      return streamFragment(props.children);
    } else if (isValidTag(type)) {
      return streamElement(type, props);
    } else {
      return streamUnknown(type);
    }
  }
  function isValidTag(tag) {
    return /^[a-zA-Z][a-zA-Z0-9\-]*$/.test(tag);
  }

  // app/lib/handle_fragment.tsx
  function handleFragment(Component, headers) {
    return byMethod({
      GET: (req, match) => renderHtmlResponse(/* @__PURE__ */ jsx(Component, { req, match }), { headers })
    });
  }

  // app/routes/calc/_lib/evaluate.js
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
    const b2 = stack.pop();
    switch (operator) {
      case "+":
        return b2 + a;
      case "-":
        return b2 - a;
      case "*":
        return b2 * a;
      case "/":
        return b2 / a;
      case "^":
        return Math.pow(b2, a);
      default:
        throw new Error(`Invalid operator: ${operator}`);
    }
  }
  function evaluate(input) {
    return evalRPN(toRPN(tokenize(input)));
  }

  // https://jsr.io/@http/request/0.24.0/search_values.ts
  function getSearchValues(input, param, separator) {
    const searchParams = input instanceof Request ? new URL(input.url).searchParams : input instanceof URL ? input.searchParams : input instanceof URLSearchParams ? input : input && "search" in input && "input" in input.search ? new URLSearchParams(input.search.input) : void 0;
    return searchParams ? separator ? searchParams.getAll(param).join(separator).split(separator).filter(
      (v2) => v2 !== ""
    ) : searchParams.getAll(param) : [];
  }

  // app/routes/calc/_components/Evaluate.tsx
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
      expr: req && getSearchValues(req, "expr")[0] || ""
    };
  }

  // app/routes/calc/eval.tsx
  var eval_default = handleFragment(({ req }) => {
    return /* @__PURE__ */ jsx(Evaluate, { ...evaluatePropsFrom(req) });
  });

  // service_worker/routes.ts
  var routes_default = cascade(
    byPattern("/calc/eval", eval_default)
  );

  // service_worker/sw.js
  self.addEventListener("fetch", async (event) => {
    const response = await routes_default(event.request);
    if (response) {
      event.respondWith(response);
    }
  });
})();
