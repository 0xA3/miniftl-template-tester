var $global = typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this;
var $estr = function() { return js_Boot.__string_rec(this,''); },$hxEnums = $hxEnums || {},$_;
class DateTools {
	static __format_get(d,e) {
		switch(e) {
		case "%":
			return "%";
		case "A":
			return DateTools.DAY_NAMES[d.getDay()];
		case "B":
			return DateTools.MONTH_NAMES[d.getMonth()];
		case "C":
			return StringTools.lpad(Std.string(d.getFullYear() / 100 | 0),"0",2);
		case "D":
			return DateTools.__format(d,"%m/%d/%y");
		case "F":
			return DateTools.__format(d,"%Y-%m-%d");
		case "I":case "l":
			let hour = d.getHours() % 12;
			return StringTools.lpad(Std.string(hour == 0 ? 12 : hour),e == "I" ? "0" : " ",2);
		case "M":
			return StringTools.lpad(Std.string(d.getMinutes()),"0",2);
		case "R":
			return DateTools.__format(d,"%H:%M");
		case "S":
			return StringTools.lpad(Std.string(d.getSeconds()),"0",2);
		case "T":
			return DateTools.__format(d,"%H:%M:%S");
		case "Y":
			return Std.string(d.getFullYear());
		case "a":
			return DateTools.DAY_SHORT_NAMES[d.getDay()];
		case "b":case "h":
			return DateTools.MONTH_SHORT_NAMES[d.getMonth()];
		case "d":
			return StringTools.lpad(Std.string(d.getDate()),"0",2);
		case "e":
			return Std.string(d.getDate());
		case "H":case "k":
			return StringTools.lpad(Std.string(d.getHours()),e == "H" ? "0" : " ",2);
		case "m":
			return StringTools.lpad(Std.string(d.getMonth() + 1),"0",2);
		case "n":
			return "\n";
		case "p":
			if(d.getHours() > 11) {
				return "PM";
			} else {
				return "AM";
			}
			break;
		case "r":
			return DateTools.__format(d,"%I:%M:%S %p");
		case "s":
			return Std.string(d.getTime() / 1000 | 0);
		case "t":
			return "\t";
		case "u":
			let t = d.getDay();
			if(t == 0) {
				return "7";
			} else if(t == null) {
				return "null";
			} else {
				return "" + t;
			}
			break;
		case "w":
			return Std.string(d.getDay());
		case "y":
			return StringTools.lpad(Std.string(d.getFullYear() % 100),"0",2);
		default:
			throw new haxe_exceptions_NotImplementedException("Date.format %" + e + "- not implemented yet.",null,{ fileName : "DateTools.hx", lineNumber : 101, className : "DateTools", methodName : "__format_get"});
		}
	}
	static __format(d,f) {
		let r_b = "";
		let p = 0;
		while(true) {
			let np = f.indexOf("%",p);
			if(np < 0) {
				break;
			}
			let len = np - p;
			r_b += len == null ? HxOverrides.substr(f,p,null) : HxOverrides.substr(f,p,len);
			r_b += Std.string(DateTools.__format_get(d,HxOverrides.substr(f,np + 1,1)));
			p = np + 2;
		}
		let len = f.length - p;
		r_b += len == null ? HxOverrides.substr(f,p,null) : HxOverrides.substr(f,p,len);
		return r_b;
	}
	static format(d,f) {
		return DateTools.__format(d,f);
	}
}
DateTools.__name__ = true;
class EReg {
	constructor(r,opt) {
		this.r = new RegExp(r,opt.split("u").join(""));
	}
	match(s) {
		if(this.r.global) {
			this.r.lastIndex = 0;
		}
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	matched(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) {
			return this.r.m[n];
		} else {
			throw haxe_Exception.thrown("EReg::matched");
		}
	}
	matchedPos() {
		if(this.r.m == null) {
			throw haxe_Exception.thrown("No string matched");
		}
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	matchSub(s,pos,len) {
		if(len == null) {
			len = -1;
		}
		if(this.r.global) {
			this.r.lastIndex = pos;
			this.r.m = this.r.exec(len < 0 ? s : HxOverrides.substr(s,0,pos + len));
			let b = this.r.m != null;
			if(b) {
				this.r.s = s;
			}
			return b;
		} else {
			let b = this.match(len < 0 ? HxOverrides.substr(s,pos,null) : HxOverrides.substr(s,pos,len));
			if(b) {
				this.r.s = s;
				this.r.m.index += pos;
			}
			return b;
		}
	}
	map(s,f) {
		let offset = 0;
		let buf_b = "";
		while(true) {
			if(offset >= s.length) {
				break;
			} else if(!this.matchSub(s,offset)) {
				buf_b += Std.string(HxOverrides.substr(s,offset,null));
				break;
			}
			let p = this.matchedPos();
			buf_b += Std.string(HxOverrides.substr(s,offset,p.pos - offset));
			buf_b += Std.string(f(this));
			if(p.len == 0) {
				buf_b += Std.string(HxOverrides.substr(s,p.pos,1));
				offset = p.pos + 1;
			} else {
				offset = p.pos + p.len;
			}
			if(!this.r.global) {
				break;
			}
		}
		if(!this.r.global && offset > 0 && offset < s.length) {
			buf_b += Std.string(HxOverrides.substr(s,offset,null));
		}
		return buf_b;
	}
}
EReg.__name__ = true;
Object.assign(EReg.prototype, {
	__class__: EReg
});
class HxOverrides {
	static strDate(s) {
		switch(s.length) {
		case 8:
			let k = s.split(":");
			let d = new Date();
			d["setTime"](0);
			d["setUTCHours"](k[0]);
			d["setUTCMinutes"](k[1]);
			d["setUTCSeconds"](k[2]);
			return d;
		case 10:
			let k1 = s.split("-");
			return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
		case 19:
			let k2 = s.split(" ");
			let y = k2[0].split("-");
			let t = k2[1].split(":");
			return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
		default:
			throw haxe_Exception.thrown("Invalid date format : " + s);
		}
	}
	static cca(s,index) {
		let x = s.charCodeAt(index);
		if(x != x) {
			return undefined;
		}
		return x;
	}
	static substr(s,pos,len) {
		if(len == null) {
			len = s.length;
		} else if(len < 0) {
			if(pos == 0) {
				len = s.length + len;
			} else {
				return "";
			}
		}
		return s.substr(pos,len);
	}
	static remove(a,obj) {
		let i = a.indexOf(obj);
		if(i == -1) {
			return false;
		}
		a.splice(i,1);
		return true;
	}
	static now() {
		return Date.now();
	}
}
HxOverrides.__name__ = true;
class Lambda {
	static exists(it,f) {
		let x = $getIterator(it);
		while(x.hasNext()) if(f(x.next())) {
			return true;
		}
		return false;
	}
}
Lambda.__name__ = true;
Math.__name__ = true;
class Reflect {
	static field(o,field) {
		try {
			return o[field];
		} catch( _g ) {
			return null;
		}
	}
	static getProperty(o,field) {
		let tmp;
		if(o == null) {
			return null;
		} else {
			let tmp1;
			if(o.__properties__) {
				tmp = o.__properties__["get_" + field];
				tmp1 = tmp;
			} else {
				tmp1 = false;
			}
			if(tmp1) {
				return o[tmp]();
			} else {
				return o[field];
			}
		}
	}
	static setProperty(o,field,value) {
		let tmp;
		let tmp1;
		if(o.__properties__) {
			tmp = o.__properties__["set_" + field];
			tmp1 = tmp;
		} else {
			tmp1 = false;
		}
		if(tmp1) {
			o[tmp](value);
		} else {
			o[field] = value;
		}
	}
	static fields(o) {
		let a = [];
		if(o != null) {
			let hasOwnProperty = Object.prototype.hasOwnProperty;
			for( var f in o ) {
			if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) {
				a.push(f);
			}
			}
		}
		return a;
	}
	static compare(a,b) {
		if(a == b) {
			return 0;
		} else if(a > b) {
			return 1;
		} else {
			return -1;
		}
	}
	static isObject(v) {
		if(v == null) {
			return false;
		}
		let t = typeof(v);
		if(!(t == "string" || t == "object" && v.__enum__ == null)) {
			if(t == "function") {
				return (v.__name__ || v.__ename__) != null;
			} else {
				return false;
			}
		} else {
			return true;
		}
	}
	static isEnumValue(v) {
		if(v != null) {
			return v.__enum__ != null;
		} else {
			return false;
		}
	}
	static makeVarArgs(f) {
		return function() {
			let a = Array.prototype.slice;
			let a1 = arguments;
			let a2 = a.call(a1);
			return f(a2);
		};
	}
}
Reflect.__name__ = true;
class Std {
	static string(s) {
		return js_Boot.__string_rec(s,"");
	}
	static parseInt(x) {
		if(x != null) {
			let _g = 0;
			let _g1 = x.length;
			while(_g < _g1) {
				let i = _g++;
				let c = x.charCodeAt(i);
				if(c <= 8 || c >= 14 && c != 32 && c != 45) {
					let nc = x.charCodeAt(i + 1);
					let v = parseInt(x,nc == 120 || nc == 88 ? 16 : 10);
					if(isNaN(v)) {
						return null;
					} else {
						return v;
					}
				}
			}
		}
		return null;
	}
}
Std.__name__ = true;
class StringBuf {
	constructor() {
		this.b = "";
	}
}
StringBuf.__name__ = true;
Object.assign(StringBuf.prototype, {
	__class__: StringBuf
});
class StringTools {
	static htmlEscape(s,quotes) {
		let buf_b = "";
		let _g_offset = 0;
		let _g_s = s;
		while(_g_offset < _g_s.length) {
			let s = _g_s;
			let index = _g_offset++;
			let c = s.charCodeAt(index);
			if(c >= 55296 && c <= 56319) {
				c = c - 55232 << 10 | s.charCodeAt(index + 1) & 1023;
			}
			let c1 = c;
			if(c1 >= 65536) {
				++_g_offset;
			}
			let code = c1;
			switch(code) {
			case 34:
				if(quotes) {
					buf_b += "&quot;";
				} else {
					buf_b += String.fromCodePoint(code);
				}
				break;
			case 38:
				buf_b += "&amp;";
				break;
			case 39:
				if(quotes) {
					buf_b += "&#039;";
				} else {
					buf_b += String.fromCodePoint(code);
				}
				break;
			case 60:
				buf_b += "&lt;";
				break;
			case 62:
				buf_b += "&gt;";
				break;
			default:
				buf_b += String.fromCodePoint(code);
			}
		}
		return buf_b;
	}
	static isSpace(s,pos) {
		let c = HxOverrides.cca(s,pos);
		if(!(c > 8 && c < 14)) {
			return c == 32;
		} else {
			return true;
		}
	}
	static ltrim(s) {
		let l = s.length;
		let r = 0;
		while(r < l && StringTools.isSpace(s,r)) ++r;
		if(r > 0) {
			return HxOverrides.substr(s,r,l - r);
		} else {
			return s;
		}
	}
	static rtrim(s) {
		let l = s.length;
		let r = 0;
		while(r < l && StringTools.isSpace(s,l - r - 1)) ++r;
		if(r > 0) {
			return HxOverrides.substr(s,0,l - r);
		} else {
			return s;
		}
	}
	static trim(s) {
		return StringTools.ltrim(StringTools.rtrim(s));
	}
	static lpad(s,c,l) {
		if(c.length <= 0) {
			return s;
		}
		let buf_b = "";
		l -= s.length;
		while(buf_b.length < l) buf_b += c == null ? "null" : "" + c;
		buf_b += s == null ? "null" : "" + s;
		return buf_b;
	}
	static replace(s,sub,by) {
		return s.split(sub).join(by);
	}
}
StringTools.__name__ = true;
var ValueType = $hxEnums["ValueType"] = { __ename__:true,__constructs__:null
	,TNull: {_hx_name:"TNull",_hx_index:0,__enum__:"ValueType",toString:$estr}
	,TInt: {_hx_name:"TInt",_hx_index:1,__enum__:"ValueType",toString:$estr}
	,TFloat: {_hx_name:"TFloat",_hx_index:2,__enum__:"ValueType",toString:$estr}
	,TBool: {_hx_name:"TBool",_hx_index:3,__enum__:"ValueType",toString:$estr}
	,TObject: {_hx_name:"TObject",_hx_index:4,__enum__:"ValueType",toString:$estr}
	,TFunction: {_hx_name:"TFunction",_hx_index:5,__enum__:"ValueType",toString:$estr}
	,TClass: ($_=function(c) { return {_hx_index:6,c:c,__enum__:"ValueType",toString:$estr}; },$_._hx_name="TClass",$_.__params__ = ["c"],$_)
	,TEnum: ($_=function(e) { return {_hx_index:7,e:e,__enum__:"ValueType",toString:$estr}; },$_._hx_name="TEnum",$_.__params__ = ["e"],$_)
	,TUnknown: {_hx_name:"TUnknown",_hx_index:8,__enum__:"ValueType",toString:$estr}
};
ValueType.__constructs__ = [ValueType.TNull,ValueType.TInt,ValueType.TFloat,ValueType.TBool,ValueType.TObject,ValueType.TFunction,ValueType.TClass,ValueType.TEnum,ValueType.TUnknown];
class Type {
	static typeof(v) {
		switch(typeof(v)) {
		case "boolean":
			return ValueType.TBool;
		case "function":
			if(v.__name__ || v.__ename__) {
				return ValueType.TObject;
			}
			return ValueType.TFunction;
		case "number":
			if(Math.ceil(v) == v % 2147483648.0) {
				return ValueType.TInt;
			}
			return ValueType.TFloat;
		case "object":
			if(v == null) {
				return ValueType.TNull;
			}
			let e = v.__enum__;
			if(e != null) {
				return ValueType.TEnum($hxEnums[e]);
			}
			let c = js_Boot.getClass(v);
			if(c != null) {
				return ValueType.TClass(c);
			}
			return ValueType.TObject;
		case "string":
			return ValueType.TClass(String);
		case "undefined":
			return ValueType.TNull;
		default:
			return ValueType.TUnknown;
		}
	}
	static enumEq(a,b) {
		if(a == b) {
			return true;
		}
		try {
			let e = a.__enum__;
			if(e == null || e != b.__enum__) {
				return false;
			}
			if(a._hx_index != b._hx_index) {
				return false;
			}
			let enm = $hxEnums[e];
			let params = enm.__constructs__[a._hx_index].__params__;
			let _g = 0;
			while(_g < params.length) {
				let f = params[_g];
				++_g;
				if(!Type.enumEq(a[f],b[f])) {
					return false;
				}
			}
		} catch( _g ) {
			return false;
		}
		return true;
	}
	static enumParameters(e) {
		let enm = $hxEnums[e.__enum__];
		let params = enm.__constructs__[e._hx_index].__params__;
		if(params != null) {
			let _g = [];
			let _g1 = 0;
			while(_g1 < params.length) {
				let p = params[_g1];
				++_g1;
				_g.push(e[p]);
			}
			return _g;
		} else {
			return [];
		}
	}
}
Type.__name__ = true;
class haxe_IMap {
}
haxe_IMap.__name__ = true;
haxe_IMap.__isInterface__ = true;
Object.assign(haxe_IMap.prototype, {
	__class__: haxe_IMap
});
class haxe_Exception extends Error {
	constructor(message,previous,native) {
		super(message);
		this.message = message;
		this.__previousException = previous;
		this.__nativeException = native != null ? native : this;
	}
	unwrap() {
		return this.__nativeException;
	}
	toString() {
		return this.get_message();
	}
	get_message() {
		return this.message;
	}
	get_native() {
		return this.__nativeException;
	}
	static caught(value) {
		if(((value) instanceof haxe_Exception)) {
			return value;
		} else if(((value) instanceof Error)) {
			return new haxe_Exception(value.message,null,value);
		} else {
			return new haxe_ValueException(value,null,value);
		}
	}
	static thrown(value) {
		if(((value) instanceof haxe_Exception)) {
			return value.get_native();
		} else if(((value) instanceof Error)) {
			return value;
		} else {
			let e = new haxe_ValueException(value);
			return e;
		}
	}
}
haxe_Exception.__name__ = true;
haxe_Exception.__super__ = Error;
Object.assign(haxe_Exception.prototype, {
	__class__: haxe_Exception
	,__properties__: {get_native: "get_native",get_message: "get_message"}
});
class haxe_Log {
	static formatOutput(v,infos) {
		let str = Std.string(v);
		if(infos == null) {
			return str;
		}
		let pstr = infos.fileName + ":" + infos.lineNumber;
		if(infos.customParams != null) {
			let _g = 0;
			let _g1 = infos.customParams;
			while(_g < _g1.length) str += ", " + Std.string(_g1[_g++]);
		}
		return pstr + ": " + str;
	}
	static trace(v,infos) {
		let str = haxe_Log.formatOutput(v,infos);
		if(typeof(console) != "undefined" && console.log != null) {
			console.log(str);
		}
	}
}
haxe_Log.__name__ = true;
class haxe_Timer {
	constructor(time_ms) {
		let me = this;
		this.id = setInterval(function() {
			me.run();
		},time_ms);
	}
	stop() {
		if(this.id == null) {
			return;
		}
		clearInterval(this.id);
		this.id = null;
	}
	run() {
	}
	static delay(f,time_ms) {
		let t = new haxe_Timer(time_ms);
		t.run = function() {
			t.stop();
			f();
		};
		return t;
	}
}
haxe_Timer.__name__ = true;
Object.assign(haxe_Timer.prototype, {
	__class__: haxe_Timer
});
class haxe_ValueException extends haxe_Exception {
	constructor(value,previous,native) {
		super(String(value),previous,native);
		this.value = value;
	}
	unwrap() {
		return this.value;
	}
}
haxe_ValueException.__name__ = true;
haxe_ValueException.__super__ = haxe_Exception;
Object.assign(haxe_ValueException.prototype, {
	__class__: haxe_ValueException
});
class haxe_ds_BalancedTree {
	constructor() {
	}
	set(key,value) {
		this.root = this.setLoop(key,value,this.root);
	}
	get(key) {
		let node = this.root;
		while(node != null) {
			let c = this.compare(key,node.key);
			if(c == 0) {
				return node.value;
			}
			if(c < 0) {
				node = node.left;
			} else {
				node = node.right;
			}
		}
		return null;
	}
	keys() {
		let ret = [];
		this.keysLoop(this.root,ret);
		return new haxe_iterators_ArrayIterator(ret);
	}
	setLoop(k,v,node) {
		if(node == null) {
			return new haxe_ds_TreeNode(null,k,v,null);
		}
		let c = this.compare(k,node.key);
		if(c == 0) {
			return new haxe_ds_TreeNode(node.left,k,v,node.right,node == null ? 0 : node._height);
		} else if(c < 0) {
			return this.balance(this.setLoop(k,v,node.left),node.key,node.value,node.right);
		} else {
			let nr = this.setLoop(k,v,node.right);
			return this.balance(node.left,node.key,node.value,nr);
		}
	}
	keysLoop(node,acc) {
		if(node != null) {
			this.keysLoop(node.left,acc);
			acc.push(node.key);
			this.keysLoop(node.right,acc);
		}
	}
	balance(l,k,v,r) {
		let hl = l == null ? 0 : l._height;
		let hr = r == null ? 0 : r._height;
		if(hl > hr + 2) {
			let _this = l.left;
			let _this1 = l.right;
			if((_this == null ? 0 : _this._height) >= (_this1 == null ? 0 : _this1._height)) {
				return new haxe_ds_TreeNode(l.left,l.key,l.value,new haxe_ds_TreeNode(l.right,k,v,r));
			} else {
				return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l.left,l.key,l.value,l.right.left),l.right.key,l.right.value,new haxe_ds_TreeNode(l.right.right,k,v,r));
			}
		} else if(hr > hl + 2) {
			let _this = r.right;
			let _this1 = r.left;
			if((_this == null ? 0 : _this._height) > (_this1 == null ? 0 : _this1._height)) {
				return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l,k,v,r.left),r.key,r.value,r.right);
			} else {
				return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l,k,v,r.left.left),r.left.key,r.left.value,new haxe_ds_TreeNode(r.left.right,r.key,r.value,r.right));
			}
		} else {
			return new haxe_ds_TreeNode(l,k,v,r,(hl > hr ? hl : hr) + 1);
		}
	}
	compare(k1,k2) {
		return Reflect.compare(k1,k2);
	}
}
haxe_ds_BalancedTree.__name__ = true;
haxe_ds_BalancedTree.__interfaces__ = [haxe_IMap];
Object.assign(haxe_ds_BalancedTree.prototype, {
	__class__: haxe_ds_BalancedTree
});
class haxe_ds_TreeNode {
	constructor(l,k,v,r,h) {
		if(h == null) {
			h = -1;
		}
		this.left = l;
		this.key = k;
		this.value = v;
		this.right = r;
		if(h == -1) {
			let tmp;
			let _this = this.left;
			let _this1 = this.right;
			if((_this == null ? 0 : _this._height) > (_this1 == null ? 0 : _this1._height)) {
				let _this = this.left;
				tmp = _this == null ? 0 : _this._height;
			} else {
				let _this = this.right;
				tmp = _this == null ? 0 : _this._height;
			}
			this._height = tmp + 1;
		} else {
			this._height = h;
		}
	}
}
haxe_ds_TreeNode.__name__ = true;
Object.assign(haxe_ds_TreeNode.prototype, {
	__class__: haxe_ds_TreeNode
});
class haxe_ds_EnumValueMap extends haxe_ds_BalancedTree {
	constructor() {
		super();
	}
	compare(k1,k2) {
		let d = k1._hx_index - k2._hx_index;
		if(d != 0) {
			return d;
		}
		let p1 = Type.enumParameters(k1);
		let p2 = Type.enumParameters(k2);
		if(p1.length == 0 && p2.length == 0) {
			return 0;
		}
		return this.compareArgs(p1,p2);
	}
	compareArgs(a1,a2) {
		let ld = a1.length - a2.length;
		if(ld != 0) {
			return ld;
		}
		let _g = 0;
		let _g1 = a1.length;
		while(_g < _g1) {
			let i = _g++;
			let d = this.compareArg(a1[i],a2[i]);
			if(d != 0) {
				return d;
			}
		}
		return 0;
	}
	compareArg(v1,v2) {
		if(Reflect.isEnumValue(v1) && Reflect.isEnumValue(v2)) {
			return this.compare(v1,v2);
		} else if(((v1) instanceof Array) && ((v2) instanceof Array)) {
			return this.compareArgs(v1,v2);
		} else {
			return Reflect.compare(v1,v2);
		}
	}
}
haxe_ds_EnumValueMap.__name__ = true;
haxe_ds_EnumValueMap.__interfaces__ = [haxe_IMap];
haxe_ds_EnumValueMap.__super__ = haxe_ds_BalancedTree;
Object.assign(haxe_ds_EnumValueMap.prototype, {
	__class__: haxe_ds_EnumValueMap
});
class haxe_ds_GenericCell {
	constructor(elt,next) {
		this.elt = elt;
		this.next = next;
	}
}
haxe_ds_GenericCell.__name__ = true;
Object.assign(haxe_ds_GenericCell.prototype, {
	__class__: haxe_ds_GenericCell
});
class haxe_ds_GenericStack {
	constructor() {
	}
}
haxe_ds_GenericStack.__name__ = true;
Object.assign(haxe_ds_GenericStack.prototype, {
	__class__: haxe_ds_GenericStack
});
class haxe_ds_IntMap {
	constructor() {
		this.h = { };
	}
	set(key,value) {
		this.h[key] = value;
	}
	get(key) {
		return this.h[key];
	}
	keys() {
		let a = [];
		for( var key in this.h ) if(this.h.hasOwnProperty(key)) a.push(+key);
		return new haxe_iterators_ArrayIterator(a);
	}
}
haxe_ds_IntMap.__name__ = true;
haxe_ds_IntMap.__interfaces__ = [haxe_IMap];
Object.assign(haxe_ds_IntMap.prototype, {
	__class__: haxe_ds_IntMap
});
class haxe_ds_ObjectMap {
	constructor() {
		this.h = { __keys__ : { }};
	}
	set(key,value) {
		let id = key.__id__;
		if(id == null) {
			id = (key.__id__ = $global.$haxeUID++);
		}
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	get(key) {
		return this.h[key.__id__];
	}
	keys() {
		let a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) {
			a.push(this.h.__keys__[key]);
		}
		}
		return new haxe_iterators_ArrayIterator(a);
	}
}
haxe_ds_ObjectMap.__name__ = true;
haxe_ds_ObjectMap.__interfaces__ = [haxe_IMap];
Object.assign(haxe_ds_ObjectMap.prototype, {
	__class__: haxe_ds_ObjectMap
});
class haxe_ds_StringMap {
	constructor() {
		this.h = Object.create(null);
	}
	get(key) {
		return this.h[key];
	}
	set(key,value) {
		this.h[key] = value;
	}
	keys() {
		return new haxe_ds__$StringMap_StringMapKeyIterator(this.h);
	}
	static createCopy(h) {
		let copy = new haxe_ds_StringMap();
		for (var key in h) copy.h[key] = h[key];
		return copy;
	}
}
haxe_ds_StringMap.__name__ = true;
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
Object.assign(haxe_ds_StringMap.prototype, {
	__class__: haxe_ds_StringMap
});
class haxe_ds__$StringMap_StringMapKeyIterator {
	constructor(h) {
		this.h = h;
		this.keys = Object.keys(h);
		this.length = this.keys.length;
		this.current = 0;
	}
	hasNext() {
		return this.current < this.length;
	}
	next() {
		return this.keys[this.current++];
	}
}
haxe_ds__$StringMap_StringMapKeyIterator.__name__ = true;
Object.assign(haxe_ds__$StringMap_StringMapKeyIterator.prototype, {
	__class__: haxe_ds__$StringMap_StringMapKeyIterator
});
class haxe_exceptions_PosException extends haxe_Exception {
	constructor(message,previous,pos) {
		super(message,previous);
		if(pos == null) {
			this.posInfos = { fileName : "(unknown)", lineNumber : 0, className : "(unknown)", methodName : "(unknown)"};
		} else {
			this.posInfos = pos;
		}
	}
	toString() {
		return "" + super.toString() + " in " + this.posInfos.className + "." + this.posInfos.methodName + " at " + this.posInfos.fileName + ":" + this.posInfos.lineNumber;
	}
}
haxe_exceptions_PosException.__name__ = true;
haxe_exceptions_PosException.__super__ = haxe_Exception;
Object.assign(haxe_exceptions_PosException.prototype, {
	__class__: haxe_exceptions_PosException
});
class haxe_exceptions_NotImplementedException extends haxe_exceptions_PosException {
	constructor(message,previous,pos) {
		if(message == null) {
			message = "Not implemented";
		}
		super(message,previous,pos);
	}
}
haxe_exceptions_NotImplementedException.__name__ = true;
haxe_exceptions_NotImplementedException.__super__ = haxe_exceptions_PosException;
Object.assign(haxe_exceptions_NotImplementedException.prototype, {
	__class__: haxe_exceptions_NotImplementedException
});
class haxe_io_Bytes {
	constructor(data) {
		this.length = data.byteLength;
		this.b = new Uint8Array(data);
		this.b.bufferValue = data;
		data.hxBytes = this;
		data.bytes = this.b;
	}
	getString(pos,len,encoding) {
		if(pos < 0 || len < 0 || pos + len > this.length) {
			throw haxe_Exception.thrown(haxe_io_Error.OutsideBounds);
		}
		if(encoding == null) {
			encoding = haxe_io_Encoding.UTF8;
		}
		let s = "";
		let b = this.b;
		let i = pos;
		let max = pos + len;
		switch(encoding._hx_index) {
		case 0:
			while(i < max) {
				let c = b[i++];
				if(c < 128) {
					if(c == 0) {
						break;
					}
					s += String.fromCodePoint(c);
				} else if(c < 224) {
					let code = (c & 63) << 6 | b[i++] & 127;
					s += String.fromCodePoint(code);
				} else if(c < 240) {
					let code = (c & 31) << 12 | (b[i++] & 127) << 6 | b[i++] & 127;
					s += String.fromCodePoint(code);
				} else {
					let u = (c & 15) << 18 | (b[i++] & 127) << 12 | (b[i++] & 127) << 6 | b[i++] & 127;
					s += String.fromCodePoint(u);
				}
			}
			break;
		case 1:
			while(i < max) {
				let c = b[i++] | b[i++] << 8;
				s += String.fromCodePoint(c);
			}
			break;
		}
		return s;
	}
	toString() {
		return this.getString(0,this.length);
	}
	static ofString(s,encoding) {
		if(encoding == haxe_io_Encoding.RawNative) {
			let buf = new Uint8Array(s.length << 1);
			let _g = 0;
			let _g1 = s.length;
			while(_g < _g1) {
				let i = _g++;
				let c = s.charCodeAt(i);
				buf[i << 1] = c & 255;
				buf[i << 1 | 1] = c >> 8;
			}
			return new haxe_io_Bytes(buf.buffer);
		}
		let a = [];
		let i = 0;
		while(i < s.length) {
			let c = s.charCodeAt(i++);
			if(55296 <= c && c <= 56319) {
				c = c - 55232 << 10 | s.charCodeAt(i++) & 1023;
			}
			if(c <= 127) {
				a.push(c);
			} else if(c <= 2047) {
				a.push(192 | c >> 6);
				a.push(128 | c & 63);
			} else if(c <= 65535) {
				a.push(224 | c >> 12);
				a.push(128 | c >> 6 & 63);
				a.push(128 | c & 63);
			} else {
				a.push(240 | c >> 18);
				a.push(128 | c >> 12 & 63);
				a.push(128 | c >> 6 & 63);
				a.push(128 | c & 63);
			}
		}
		return new haxe_io_Bytes(new Uint8Array(a).buffer);
	}
}
haxe_io_Bytes.__name__ = true;
Object.assign(haxe_io_Bytes.prototype, {
	__class__: haxe_io_Bytes
});
class haxe_io_BytesBuffer {
	constructor() {
		this.pos = 0;
		this.size = 0;
	}
	addByte(byte) {
		if(this.pos == this.size) {
			this.grow(1);
		}
		this.view.setUint8(this.pos++,byte);
	}
	grow(delta) {
		let req = this.pos + delta;
		let nsize = this.size == 0 ? 16 : this.size;
		while(nsize < req) nsize = nsize * 3 >> 1;
		let nbuf = new ArrayBuffer(nsize);
		let nu8 = new Uint8Array(nbuf);
		if(this.size > 0) {
			nu8.set(this.u8);
		}
		this.size = nsize;
		this.buffer = nbuf;
		this.u8 = nu8;
		this.view = new DataView(this.buffer);
	}
	getBytes() {
		if(this.size == 0) {
			return new haxe_io_Bytes(new ArrayBuffer(0));
		}
		let b = new haxe_io_Bytes(this.buffer);
		b.length = this.pos;
		return b;
	}
}
haxe_io_BytesBuffer.__name__ = true;
Object.assign(haxe_io_BytesBuffer.prototype, {
	__class__: haxe_io_BytesBuffer
});
class haxe_io_Input {
	readByte() {
		throw new haxe_exceptions_NotImplementedException(null,null,{ fileName : "haxe/io/Input.hx", lineNumber : 53, className : "haxe.io.Input", methodName : "readByte"});
	}
	readBytes(s,pos,len) {
		let k = len;
		let b = s.b;
		if(pos < 0 || len < 0 || pos + len > s.length) {
			throw haxe_Exception.thrown(haxe_io_Error.OutsideBounds);
		}
		try {
			while(k > 0) {
				b[pos] = this.readByte();
				++pos;
				--k;
			}
		} catch( _g ) {
			if(!((haxe_Exception.caught(_g).unwrap()) instanceof haxe_io_Eof)) {
				throw _g;
			}
		}
		return len - k;
	}
	readFullBytes(s,pos,len) {
		while(len > 0) {
			let k = this.readBytes(s,pos,len);
			if(k == 0) {
				throw haxe_Exception.thrown(haxe_io_Error.Blocked);
			}
			pos += k;
			len -= k;
		}
	}
	readString(len,encoding) {
		let b = new haxe_io_Bytes(new ArrayBuffer(len));
		this.readFullBytes(b,0,len);
		return b.getString(0,len,encoding);
	}
}
haxe_io_Input.__name__ = true;
Object.assign(haxe_io_Input.prototype, {
	__class__: haxe_io_Input
});
class haxe_io_BytesInput extends haxe_io_Input {
	constructor(b,pos,len) {
		super();
		if(pos == null) {
			pos = 0;
		}
		if(len == null) {
			len = b.length - pos;
		}
		if(pos < 0 || len < 0 || pos + len > b.length) {
			throw haxe_Exception.thrown(haxe_io_Error.OutsideBounds);
		}
		this.b = b.b;
		this.pos = pos;
		this.len = len;
		this.totlen = len;
	}
	readByte() {
		if(this.len == 0) {
			throw haxe_Exception.thrown(new haxe_io_Eof());
		}
		this.len--;
		return this.b[this.pos++];
	}
	readBytes(buf,pos,len) {
		if(pos < 0 || len < 0 || pos + len > buf.length) {
			throw haxe_Exception.thrown(haxe_io_Error.OutsideBounds);
		}
		if(this.len == 0 && len > 0) {
			throw haxe_Exception.thrown(new haxe_io_Eof());
		}
		if(this.len < len) {
			len = this.len;
		}
		let b1 = this.b;
		let b2 = buf.b;
		let _g = 0;
		let _g1 = len;
		while(_g < _g1) {
			let i = _g++;
			b2[pos + i] = b1[this.pos + i];
		}
		this.pos += len;
		this.len -= len;
		return len;
	}
}
haxe_io_BytesInput.__name__ = true;
haxe_io_BytesInput.__super__ = haxe_io_Input;
Object.assign(haxe_io_BytesInput.prototype, {
	__class__: haxe_io_BytesInput
});
class haxe_io_Output {
}
haxe_io_Output.__name__ = true;
class haxe_io_BytesOutput extends haxe_io_Output {
	constructor() {
		super();
		this.b = new haxe_io_BytesBuffer();
	}
	writeByte(c) {
		this.b.addByte(c);
	}
	getBytes() {
		return this.b.getBytes();
	}
}
haxe_io_BytesOutput.__name__ = true;
haxe_io_BytesOutput.__super__ = haxe_io_Output;
Object.assign(haxe_io_BytesOutput.prototype, {
	__class__: haxe_io_BytesOutput
});
var haxe_io_Encoding = $hxEnums["haxe.io.Encoding"] = { __ename__:true,__constructs__:null
	,UTF8: {_hx_name:"UTF8",_hx_index:0,__enum__:"haxe.io.Encoding",toString:$estr}
	,RawNative: {_hx_name:"RawNative",_hx_index:1,__enum__:"haxe.io.Encoding",toString:$estr}
};
haxe_io_Encoding.__constructs__ = [haxe_io_Encoding.UTF8,haxe_io_Encoding.RawNative];
class haxe_io_Eof {
	constructor() {
	}
	toString() {
		return "Eof";
	}
}
haxe_io_Eof.__name__ = true;
Object.assign(haxe_io_Eof.prototype, {
	__class__: haxe_io_Eof
});
var haxe_io_Error = $hxEnums["haxe.io.Error"] = { __ename__:true,__constructs__:null
	,Blocked: {_hx_name:"Blocked",_hx_index:0,__enum__:"haxe.io.Error",toString:$estr}
	,Overflow: {_hx_name:"Overflow",_hx_index:1,__enum__:"haxe.io.Error",toString:$estr}
	,OutsideBounds: {_hx_name:"OutsideBounds",_hx_index:2,__enum__:"haxe.io.Error",toString:$estr}
	,Custom: ($_=function(e) { return {_hx_index:3,e:e,__enum__:"haxe.io.Error",toString:$estr}; },$_._hx_name="Custom",$_.__params__ = ["e"],$_)
};
haxe_io_Error.__constructs__ = [haxe_io_Error.Blocked,haxe_io_Error.Overflow,haxe_io_Error.OutsideBounds,haxe_io_Error.Custom];
class haxe_io_StringInput extends haxe_io_BytesInput {
	constructor(s) {
		super(haxe_io_Bytes.ofString(s));
	}
}
haxe_io_StringInput.__name__ = true;
haxe_io_StringInput.__super__ = haxe_io_BytesInput;
Object.assign(haxe_io_StringInput.prototype, {
	__class__: haxe_io_StringInput
});
class haxe_iterators_ArrayIterator {
	constructor(array) {
		this.current = 0;
		this.array = array;
	}
	hasNext() {
		return this.current < this.array.length;
	}
	next() {
		return this.array[this.current++];
	}
}
haxe_iterators_ArrayIterator.__name__ = true;
Object.assign(haxe_iterators_ArrayIterator.prototype, {
	__class__: haxe_iterators_ArrayIterator
});
class js_Boot {
	static getClass(o) {
		if(o == null) {
			return null;
		} else if(((o) instanceof Array)) {
			return Array;
		} else {
			let cl = o.__class__;
			if(cl != null) {
				return cl;
			}
			let name = js_Boot.__nativeClassName(o);
			if(name != null) {
				return js_Boot.__resolveNativeClass(name);
			}
			return null;
		}
	}
	static __string_rec(o,s) {
		if(o == null) {
			return "null";
		}
		if(s.length >= 5) {
			return "<...>";
		}
		let t = typeof(o);
		if(t == "function" && (o.__name__ || o.__ename__)) {
			t = "object";
		}
		switch(t) {
		case "function":
			return "<function>";
		case "object":
			if(o.__enum__) {
				let e = $hxEnums[o.__enum__];
				let con = e.__constructs__[o._hx_index];
				let n = con._hx_name;
				if(con.__params__) {
					s = s + "\t";
					return n + "(" + ((function($this) {
						var $r;
						let _g = [];
						{
							let _g1 = 0;
							let _g2 = con.__params__;
							while(true) {
								if(!(_g1 < _g2.length)) {
									break;
								}
								let p = _g2[_g1];
								_g1 = _g1 + 1;
								_g.push(js_Boot.__string_rec(o[p],s));
							}
						}
						$r = _g;
						return $r;
					}(this))).join(",") + ")";
				} else {
					return n;
				}
			}
			if(((o) instanceof Array)) {
				let str = "[";
				s += "\t";
				let _g = 0;
				let _g1 = o.length;
				while(_g < _g1) {
					let i = _g++;
					str += (i > 0 ? "," : "") + js_Boot.__string_rec(o[i],s);
				}
				str += "]";
				return str;
			}
			let tostr;
			try {
				tostr = o.toString;
			} catch( _g ) {
				return "???";
			}
			if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
				let s2 = o.toString();
				if(s2 != "[object Object]") {
					return s2;
				}
			}
			let str = "{\n";
			s += "\t";
			let hasp = o.hasOwnProperty != null;
			let k = null;
			for( k in o ) {
			if(hasp && !o.hasOwnProperty(k)) {
				continue;
			}
			if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
				continue;
			}
			if(str.length != 2) {
				str += ", \n";
			}
			str += s + k + " : " + js_Boot.__string_rec(o[k],s);
			}
			s = s.substring(1);
			str += "\n" + s + "}";
			return str;
		case "string":
			return o;
		default:
			return String(o);
		}
	}
	static __interfLoop(cc,cl) {
		while(true) {
			if(cc == null) {
				return false;
			}
			if(cc == cl) {
				return true;
			}
			let intf = cc.__interfaces__;
			if(intf != null && (cc.__super__ == null || cc.__super__.__interfaces__ != intf)) {
				let _g = 0;
				let _g1 = intf.length;
				while(_g < _g1) {
					let i = intf[_g++];
					if(i == cl || js_Boot.__interfLoop(i,cl)) {
						return true;
					}
				}
			}
			cc = cc.__super__;
		}
	}
	static __instanceof(o,cl) {
		if(cl == null) {
			return false;
		}
		switch(cl) {
		case Array:
			return ((o) instanceof Array);
		case Bool:
			return typeof(o) == "boolean";
		case Dynamic:
			return o != null;
		case Float:
			return typeof(o) == "number";
		case Int:
			if(typeof(o) == "number") {
				return ((o | 0) === o);
			} else {
				return false;
			}
			break;
		case String:
			return typeof(o) == "string";
		default:
			if(o != null) {
				if(typeof(cl) == "function") {
					if(js_Boot.__downcastCheck(o,cl)) {
						return true;
					}
				} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
					if(((o) instanceof cl)) {
						return true;
					}
				}
			} else {
				return false;
			}
			if(cl == Class ? o.__name__ != null : false) {
				return true;
			}
			if(cl == Enum ? o.__ename__ != null : false) {
				return true;
			}
			return o.__enum__ != null ? $hxEnums[o.__enum__] == cl : false;
		}
	}
	static __downcastCheck(o,cl) {
		if(!((o) instanceof cl)) {
			if(cl.__isInterface__) {
				return js_Boot.__interfLoop(js_Boot.getClass(o),cl);
			} else {
				return false;
			}
		} else {
			return true;
		}
	}
	static __implements(o,iface) {
		return js_Boot.__interfLoop(js_Boot.getClass(o),iface);
	}
	static __cast(o,t) {
		if(o == null || js_Boot.__instanceof(o,t)) {
			return o;
		} else {
			throw haxe_Exception.thrown("Cannot cast " + Std.string(o) + " to " + Std.string(t));
		}
	}
	static __nativeClassName(o) {
		let name = js_Boot.__toStr.call(o).slice(8,-1);
		if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") {
			return null;
		}
		return name;
	}
	static __isNativeObj(o) {
		return js_Boot.__nativeClassName(o) != null;
	}
	static __resolveNativeClass(name) {
		return $global[name];
	}
}
js_Boot.__name__ = true;
class miniftl_DateParse {
	static parse(s,pattern) {
		if(pattern == null) {
			return HxOverrides.strDate(s);
		}
		return null;
	}
}
miniftl_DateParse.__name__ = true;
var miniftl_Scalar = $hxEnums["miniftl.Scalar"] = { __ename__:true,__constructs__:null
	,CNumber: ($_=function(f) { return {_hx_index:0,f:f,__enum__:"miniftl.Scalar",toString:$estr}; },$_._hx_name="CNumber",$_.__params__ = ["f"],$_)
	,CString: ($_=function(s) { return {_hx_index:1,s:s,__enum__:"miniftl.Scalar",toString:$estr}; },$_._hx_name="CString",$_.__params__ = ["s"],$_)
	,CDate: ($_=function(d) { return {_hx_index:2,d:d,__enum__:"miniftl.Scalar",toString:$estr}; },$_._hx_name="CDate",$_.__params__ = ["d"],$_)
	,CTime: ($_=function(d) { return {_hx_index:3,d:d,__enum__:"miniftl.Scalar",toString:$estr}; },$_._hx_name="CTime",$_.__params__ = ["d"],$_)
	,CDateTime: ($_=function(d) { return {_hx_index:4,d:d,__enum__:"miniftl.Scalar",toString:$estr}; },$_._hx_name="CDateTime",$_.__params__ = ["d"],$_)
};
miniftl_Scalar.__constructs__ = [miniftl_Scalar.CNumber,miniftl_Scalar.CString,miniftl_Scalar.CDate,miniftl_Scalar.CTime,miniftl_Scalar.CDateTime];
var miniftl_Expr = $hxEnums["miniftl.Expr"] = { __ename__:true,__constructs__:null
	,EArray: ($_=function(e,index) { return {_hx_index:0,e:e,index:index,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="EArray",$_.__params__ = ["e","index"],$_)
	,EArrayDecl: ($_=function(e) { return {_hx_index:1,e:e,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="EArrayDecl",$_.__params__ = ["e"],$_)
	,EAssign: ($_=function(n,t,e) { return {_hx_index:2,n:n,t:t,e:e,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="EAssign",$_.__params__ = ["n","t","e"],$_)
	,EAttempt: ($_=function(e,v,t,ecatch) { return {_hx_index:3,e:e,v:v,t:t,ecatch:ecatch,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="EAttempt",$_.__params__ = ["e","v","t","ecatch"],$_)
	,EAutoesc: ($_=function(e) { return {_hx_index:4,e:e,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="EAutoesc",$_.__params__ = ["e"],$_)
	,EBinop: ($_=function(op,e1,e2) { return {_hx_index:5,op:op,e1:e1,e2:e2,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="EBinop",$_.__params__ = ["op","e1","e2"],$_)
	,EBlock: ($_=function(el) { return {_hx_index:6,el:el,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="EBlock",$_.__params__ = ["el"],$_)
	,EBreak: {_hx_name:"EBreak",_hx_index:7,__enum__:"miniftl.Expr",toString:$estr}
	,ECall: ($_=function(e,params) { return {_hx_index:8,e:e,params:params,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="ECall",$_.__params__ = ["e","params"],$_)
	,ECallMacro: ($_=function(e1,e2,params) { return {_hx_index:9,e1:e1,e2:e2,params:params,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="ECallMacro",$_.__params__ = ["e1","e2","params"],$_)
	,ECase: ($_=function(e1,e2) { return {_hx_index:10,e1:e1,e2:e2,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="ECase",$_.__params__ = ["e1","e2"],$_)
	,ECollection: ($_=function(el) { return {_hx_index:11,el:el,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="ECollection",$_.__params__ = ["el"],$_)
	,EComment: ($_=function(s) { return {_hx_index:12,s:s,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="EComment",$_.__params__ = ["s"],$_)
	,ECompress: ($_=function(e) { return {_hx_index:13,e:e,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="ECompress",$_.__params__ = ["e"],$_)
	,EContinue: {_hx_name:"EContinue",_hx_index:14,__enum__:"miniftl.Expr",toString:$estr}
	,EData: ($_=function(d,n,option,e) { return {_hx_index:15,d:d,n:n,option:option,e:e,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="EData",$_.__params__ = ["d","n","option","e"],$_)
	,EDefault: ($_=function(e) { return {_hx_index:16,e:e,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="EDefault",$_.__params__ = ["e"],$_)
	,EField: ($_=function(e,f) { return {_hx_index:17,e:e,f:f,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="EField",$_.__params__ = ["e","f"],$_)
	,EFields: ($_=function(ns) { return {_hx_index:18,ns:ns,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="EFields",$_.__params__ = ["ns"],$_)
	,EFilter: ($_=function(a) { return {_hx_index:19,a:a,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="EFilter",$_.__params__ = ["a"],$_)
	,EFunction: ($_=function(args,e,name,ret) { return {_hx_index:20,args:args,e:e,name:name,ret:ret,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="EFunction",$_.__params__ = ["args","e","name","ret"],$_)
	,EHash: ($_=function(fl) { return {_hx_index:21,fl:fl,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="EHash",$_.__params__ = ["fl"],$_)
	,EIdent: ($_=function(v) { return {_hx_index:22,v:v,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="EIdent",$_.__params__ = ["v"],$_)
	,EIf: ($_=function(cond,e1,e2) { return {_hx_index:23,cond:cond,e1:e1,e2:e2,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="EIf",$_.__params__ = ["cond","e1","e2"],$_)
	,EImport: ($_=function(e,n) { return {_hx_index:24,e:e,n:n,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="EImport",$_.__params__ = ["e","n"],$_)
	,EInclude: ($_=function(e) { return {_hx_index:25,e:e,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="EInclude",$_.__params__ = ["e"],$_)
	,EList: ($_=function(v1,v2,it,e) { return {_hx_index:26,v1:v1,v2:v2,it:it,e:e,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="EList",$_.__params__ = ["v1","v2","it","e"],$_)
	,ELocal: ($_=function(n,t,e) { return {_hx_index:27,n:n,t:t,e:e,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="ELocal",$_.__params__ = ["n","t","e"],$_)
	,EMacro: ($_=function(args,e,name,ret) { return {_hx_index:28,args:args,e:e,name:name,ret:ret,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="EMacro",$_.__params__ = ["args","e","name","ret"],$_)
	,ENested: {_hx_name:"ENested",_hx_index:29,__enum__:"miniftl.Expr",toString:$estr}
	,EParent: ($_=function(e) { return {_hx_index:30,e:e,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="EParent",$_.__params__ = ["e"],$_)
	,EReturn: ($_=function(e) { return {_hx_index:31,e:e,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="EReturn",$_.__params__ = ["e"],$_)
	,EScalar: ($_=function(s) { return {_hx_index:32,s:s,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="EScalar",$_.__params__ = ["s"],$_)
	,ESetting: ($_=function(s) { return {_hx_index:33,s:s,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="ESetting",$_.__params__ = ["s"],$_)
	,ESpecialIdent: ($_=function(v) { return {_hx_index:34,v:v,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="ESpecialIdent",$_.__params__ = ["v"],$_)
	,EStop: ($_=function(e) { return {_hx_index:35,e:e,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="EStop",$_.__params__ = ["e"],$_)
	,ESwitch: ($_=function(e,cases,defaultExpr) { return {_hx_index:36,e:e,cases:cases,defaultExpr:defaultExpr,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="ESwitch",$_.__params__ = ["e","cases","defaultExpr"],$_)
	,EThrow: ($_=function(e) { return {_hx_index:37,e:e,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="EThrow",$_.__params__ = ["e"],$_)
	,EUnop: ($_=function(op,prefix,e) { return {_hx_index:38,op:op,prefix:prefix,e:e,__enum__:"miniftl.Expr",toString:$estr}; },$_._hx_name="EUnop",$_.__params__ = ["op","prefix","e"],$_)
};
miniftl_Expr.__constructs__ = [miniftl_Expr.EArray,miniftl_Expr.EArrayDecl,miniftl_Expr.EAssign,miniftl_Expr.EAttempt,miniftl_Expr.EAutoesc,miniftl_Expr.EBinop,miniftl_Expr.EBlock,miniftl_Expr.EBreak,miniftl_Expr.ECall,miniftl_Expr.ECallMacro,miniftl_Expr.ECase,miniftl_Expr.ECollection,miniftl_Expr.EComment,miniftl_Expr.ECompress,miniftl_Expr.EContinue,miniftl_Expr.EData,miniftl_Expr.EDefault,miniftl_Expr.EField,miniftl_Expr.EFields,miniftl_Expr.EFilter,miniftl_Expr.EFunction,miniftl_Expr.EHash,miniftl_Expr.EIdent,miniftl_Expr.EIf,miniftl_Expr.EImport,miniftl_Expr.EInclude,miniftl_Expr.EList,miniftl_Expr.ELocal,miniftl_Expr.EMacro,miniftl_Expr.ENested,miniftl_Expr.EParent,miniftl_Expr.EReturn,miniftl_Expr.EScalar,miniftl_Expr.ESetting,miniftl_Expr.ESpecialIdent,miniftl_Expr.EStop,miniftl_Expr.ESwitch,miniftl_Expr.EThrow,miniftl_Expr.EUnop];
var miniftl_CType = $hxEnums["miniftl.CType"] = { __ename__:true,__constructs__:null
	,CTAnon: ($_=function(fields) { return {_hx_index:0,fields:fields,__enum__:"miniftl.CType",toString:$estr}; },$_._hx_name="CTAnon",$_.__params__ = ["fields"],$_)
	,CTFun: ($_=function(args,ret) { return {_hx_index:1,args:args,ret:ret,__enum__:"miniftl.CType",toString:$estr}; },$_._hx_name="CTFun",$_.__params__ = ["args","ret"],$_)
	,CTNamed: ($_=function(n,t) { return {_hx_index:2,n:n,t:t,__enum__:"miniftl.CType",toString:$estr}; },$_._hx_name="CTNamed",$_.__params__ = ["n","t"],$_)
	,CTOpt: ($_=function(t) { return {_hx_index:3,t:t,__enum__:"miniftl.CType",toString:$estr}; },$_._hx_name="CTOpt",$_.__params__ = ["t"],$_)
	,CTParent: ($_=function(t) { return {_hx_index:4,t:t,__enum__:"miniftl.CType",toString:$estr}; },$_._hx_name="CTParent",$_.__params__ = ["t"],$_)
	,CTPath: ($_=function(path,params) { return {_hx_index:5,path:path,params:params,__enum__:"miniftl.CType",toString:$estr}; },$_._hx_name="CTPath",$_.__params__ = ["path","params"],$_)
};
miniftl_CType.__constructs__ = [miniftl_CType.CTAnon,miniftl_CType.CTFun,miniftl_CType.CTNamed,miniftl_CType.CTOpt,miniftl_CType.CTParent,miniftl_CType.CTPath];
var miniftl_Error = $hxEnums["miniftl.Error"] = { __ename__:true,__constructs__:null
	,ECustom: ($_=function(msg) { return {_hx_index:0,msg:msg,__enum__:"miniftl.Error",toString:$estr}; },$_._hx_name="ECustom",$_.__params__ = ["msg"],$_)
	,EFileNotFound: ($_=function(s) { return {_hx_index:1,s:s,__enum__:"miniftl.Error",toString:$estr}; },$_._hx_name="EFileNotFound",$_.__params__ = ["s"],$_)
	,EInvalidAccess: ($_=function(f) { return {_hx_index:2,f:f,__enum__:"miniftl.Error",toString:$estr}; },$_._hx_name="EInvalidAccess",$_.__params__ = ["f"],$_)
	,EInvalidChar: ($_=function(c) { return {_hx_index:3,c:c,__enum__:"miniftl.Error",toString:$estr}; },$_._hx_name="EInvalidChar",$_.__params__ = ["c"],$_)
	,EInvalidIterator: ($_=function(v) { return {_hx_index:4,v:v,__enum__:"miniftl.Error",toString:$estr}; },$_._hx_name="EInvalidIterator",$_.__params__ = ["v"],$_)
	,EInvalidOp: ($_=function(op) { return {_hx_index:5,op:op,__enum__:"miniftl.Error",toString:$estr}; },$_._hx_name="EInvalidOp",$_.__params__ = ["op"],$_)
	,EInvalidPreprocessor: ($_=function(msg) { return {_hx_index:6,msg:msg,__enum__:"miniftl.Error",toString:$estr}; },$_._hx_name="EInvalidPreprocessor",$_.__params__ = ["msg"],$_)
	,EUnexpected: ($_=function(s) { return {_hx_index:7,s:s,__enum__:"miniftl.Error",toString:$estr}; },$_._hx_name="EUnexpected",$_.__params__ = ["s"],$_)
	,EUnknownVariable: ($_=function(v) { return {_hx_index:8,v:v,__enum__:"miniftl.Error",toString:$estr}; },$_._hx_name="EUnknownVariable",$_.__params__ = ["v"],$_)
	,EUnterminatedBracket: ($_=function(s) { return {_hx_index:9,s:s,__enum__:"miniftl.Error",toString:$estr}; },$_._hx_name="EUnterminatedBracket",$_.__params__ = ["s"],$_)
	,EUnterminatedComment: {_hx_name:"EUnterminatedComment",_hx_index:10,__enum__:"miniftl.Error",toString:$estr}
	,EUnterminatedString: {_hx_name:"EUnterminatedString",_hx_index:11,__enum__:"miniftl.Error",toString:$estr}
};
miniftl_Error.__constructs__ = [miniftl_Error.ECustom,miniftl_Error.EFileNotFound,miniftl_Error.EInvalidAccess,miniftl_Error.EInvalidChar,miniftl_Error.EInvalidIterator,miniftl_Error.EInvalidOp,miniftl_Error.EInvalidPreprocessor,miniftl_Error.EUnexpected,miniftl_Error.EUnknownVariable,miniftl_Error.EUnterminatedBracket,miniftl_Error.EUnterminatedComment,miniftl_Error.EUnterminatedString];
var miniftl_DataOption = $hxEnums["miniftl.DataOption"] = { __ename__:true,__constructs__:null
	,None: {_hx_name:"None",_hx_index:0,__enum__:"miniftl.DataOption",toString:$estr}
	,Limit: ($_=function(e) { return {_hx_index:1,e:e,__enum__:"miniftl.DataOption",toString:$estr}; },$_._hx_name="Limit",$_.__params__ = ["e"],$_)
	,SingleKey: ($_=function(e) { return {_hx_index:2,e:e,__enum__:"miniftl.DataOption",toString:$estr}; },$_._hx_name="SingleKey",$_.__params__ = ["e"],$_)
};
miniftl_DataOption.__constructs__ = [miniftl_DataOption.None,miniftl_DataOption.Limit,miniftl_DataOption.SingleKey];
class miniftl_Ftl {
	static process(template,data,source,isDebugMode) {
		if(isDebugMode == null) {
			isDebugMode = false;
		}
		let globals = data == null ? new haxe_ds_StringMap() : miniftl_Obj2Map.convert(data);
		let templateSource = source == null ? new miniftl_TemplateSource() : source;
		templateSource.setTemplate("template",template);
		return miniftl_Ftl.execute("template",templateSource,globals,isDebugMode);
	}
	static execute(templateName,templateSource,globals,isDebugMode) {
		let interp = new miniftl_Interp(templateSource,isDebugMode);
		try {
			return new tink_core__$Future_SyncFuture(new tink_core__$Lazy_LazyConst(tink_core_OutcomeTools.map(templateSource.getTemplate(templateName),function(ast) {
				return interp.execute(ast,globals);
			})));
		} catch( _g ) {
			let _g1 = haxe_Exception.caught(_g).unwrap();
			if(js_Boot.__instanceof(_g1,miniftl_TTSourceError)) {
				return tink_core_Future.flatMap(templateSource.loadTemplate(_g1.name),function(_) {
					return miniftl_Ftl.execute(templateName,templateSource,globals,isDebugMode);
				});
			} else {
				return new tink_core__$Future_SyncFuture(new tink_core__$Lazy_LazyConst(tink_core_Outcome.Failure("Error " + Std.string(_g1))));
			}
		}
	}
}
miniftl_Ftl.__name__ = true;
var miniftl_Stop = $hxEnums["miniftl.Stop"] = { __ename__:true,__constructs__:null
	,SBreak: ($_=function(s) { return {_hx_index:0,s:s,__enum__:"miniftl.Stop",toString:$estr}; },$_._hx_name="SBreak",$_.__params__ = ["s"],$_)
	,SContinue: {_hx_name:"SContinue",_hx_index:1,__enum__:"miniftl.Stop",toString:$estr}
	,SReturn: ($_=function(s) { return {_hx_index:2,s:s,__enum__:"miniftl.Stop",toString:$estr}; },$_._hx_name="SReturn",$_.__params__ = ["s"],$_)
	,StopException: ($_=function(s) { return {_hx_index:3,s:s,__enum__:"miniftl.Stop",toString:$estr}; },$_._hx_name="StopException",$_.__params__ = ["s"],$_)
};
miniftl_Stop.__constructs__ = [miniftl_Stop.SBreak,miniftl_Stop.SContinue,miniftl_Stop.SReturn,miniftl_Stop.StopException];
var miniftl__$Interp_VarContext = $hxEnums["miniftl._Interp.VarContext"] = { __ename__:true,__constructs__:null
	,InTemplate: {_hx_name:"InTemplate",_hx_index:0,__enum__:"miniftl._Interp.VarContext",toString:$estr}
	,InFunction: {_hx_name:"InFunction",_hx_index:1,__enum__:"miniftl._Interp.VarContext",toString:$estr}
	,InMacro: {_hx_name:"InMacro",_hx_index:2,__enum__:"miniftl._Interp.VarContext",toString:$estr}
};
miniftl__$Interp_VarContext.__constructs__ = [miniftl__$Interp_VarContext.InTemplate,miniftl__$Interp_VarContext.InFunction,miniftl__$Interp_VarContext.InMacro];
class miniftl_Interp {
	constructor(templateSource,isDebugMode) {
		if(isDebugMode == null) {
			isDebugMode = false;
		}
		this.isDebugMode = false;
		this.errorSpecialVar = "";
		this.builtInDirectives = new haxe_ds_StringMap();
		this.specialVars = new haxe_ds_StringMap();
		this.templateSource = templateSource == null ? new miniftl_TemplateSource() : templateSource;
		this.isDebugMode = isDebugMode;
		this.variables = new haxe_ds_StringMap();
		this.declaredVariables = [];
		this.initOps();
		this.initSpecialVars();
		this.initBuiltIns();
	}
	getInterp(templateSource,isDebugMode) {
		if(isDebugMode == null) {
			isDebugMode = false;
		}
		return new miniftl_Interp(templateSource,isDebugMode);
	}
	setDefaultGlobals() {
		this.globals.h["null"] = null;
		this.globals.h["true"] = true;
		this.globals.h["false"] = false;
		let _gthis = this;
		let this1 = this.globals;
		let value = Reflect.makeVarArgs(function(el) {
			let inf = _gthis.posInfos();
			let v = el.shift();
			if(el.length > 0) {
				inf.customParams = el;
			}
			haxe_Log.trace(Std.string(v),inf);
		});
		this1.h["trace"] = value;
	}
	posInfos() {
		return { fileName : "miniftl", lineNumber : 0};
	}
	initOps() {
		let me = this;
		this.binops = new haxe_ds_StringMap();
		this.binops.h["+"] = function(e1,e2) {
			if(e2 == null) {
				return null;
			}
			if(e2._hx_index == 1) {
				let a = e2.e;
				let firstElement;
				try {
					firstElement = a[0];
				} catch( _g ) {
					throw haxe_Exception.thrown(miniftl_Error.ECustom("has no element"));
				}
				if(firstElement == null) {
					return me.expr(e1).concat(me.expr(e2));
				} else if(firstElement._hx_index == 5) {
					if(firstElement.op == ":") {
						let ex1 = me.expr(e1);
						let length1;
						try {
							length1 = ex1.length;
						} catch( _g ) {
							throw haxe_Exception.thrown(miniftl_Error.ECustom("" + ex1 + " has no length"));
						}
						let r1 = length1 == 0 ? new haxe_ds_StringMap() : me.expr(e1);
						let r2 = me.expr(e2);
						let union = haxe_ds_StringMap.createCopy(r1.h);
						let h = r2.h;
						let _g_keys = Object.keys(h);
						let _g_length = _g_keys.length;
						let _g_current = 0;
						while(_g_current < _g_length) {
							let key = _g_keys[_g_current++];
							union.h[key] = h[key];
						}
						return union;
					} else {
						return me.expr(e1).concat(me.expr(e2));
					}
				} else {
					return me.expr(e1).concat(me.expr(e2));
				}
			} else {
				return me.expr(e1) + me.expr(e2);
			}
		};
		this.binops.h["-"] = function(e1,e2) {
			return me.expr(e1) - me.expr(e2);
		};
		this.binops.h["*"] = function(e1,e2) {
			return me.expr(e1) * me.expr(e2);
		};
		this.binops.h["/"] = function(e1,e2) {
			return me.expr(e1) / me.expr(e2);
		};
		this.binops.h["%"] = function(e1,e2) {
			return me.expr(e1) % me.expr(e2);
		};
		this.binops.h["&"] = function(e1,e2) {
			return me.expr(e1) & me.expr(e2);
		};
		this.binops.h["|"] = function(e1,e2) {
			return me.expr(e1) | me.expr(e2);
		};
		this.binops.h["^"] = function(e1,e2) {
			return me.expr(e1) ^ me.expr(e2);
		};
		this.binops.h["<<"] = function(e1,e2) {
			return me.expr(e1) << me.expr(e2);
		};
		this.binops.h[">>"] = function(e1,e2) {
			return me.expr(e1) >> me.expr(e2);
		};
		this.binops.h[">>>"] = function(e1,e2) {
			return me.expr(e1) >>> me.expr(e2);
		};
		this.binops.h["=="] = function(e1,e2) {
			return me.expr(e1) == me.expr(e2);
		};
		this.binops.h["!="] = function(e1,e2) {
			return me.expr(e1) != me.expr(e2);
		};
		this.binops.h[">="] = function(e1,e2) {
			return me.expr(e1) >= me.expr(e2);
		};
		this.binops.h["<="] = function(e1,e2) {
			return me.expr(e1) <= me.expr(e2);
		};
		this.binops.h[">"] = function(e1,e2) {
			return me.expr(e1) > me.expr(e2);
		};
		this.binops.h["<"] = function(e1,e2) {
			return me.expr(e1) < me.expr(e2);
		};
		this.binops.h["||"] = function(e1,e2) {
			if(me.expr(e1) != true) {
				return me.expr(e2) == true;
			} else {
				return true;
			}
		};
		this.binops.h["&&"] = function(e1,e2) {
			if(me.expr(e1) == true) {
				return me.expr(e2) == true;
			} else {
				return false;
			}
		};
		this.binops.h["="] = $bind(this,this.assign);
		this.binops.h[".."] = function(e1,e2) {
			let start = me.expr(e1);
			let end = me.expr(e2);
			if(start <= end) {
				let _g = [];
				let _g1 = start;
				let _g2 = end + 1;
				while(_g1 < _g2) _g.push(_g1++);
				return _g;
			} else {
				let _g = [];
				let _g1 = -start;
				let _g2 = -end + 1;
				while(_g1 < _g2) _g.push(-(_g1++));
				return _g;
			}
		};
		this.binops.h["..<"] = function(e1,e2) {
			let start = me.expr(e1);
			let end = me.expr(e2);
			if(start <= end) {
				let _g = [];
				let _g1 = start;
				while(_g1 < end) _g.push(_g1++);
				return _g;
			} else {
				let _g = [];
				let _g1 = -start;
				let _g2 = -end;
				while(_g1 < _g2) _g.push(-(_g1++));
				return _g;
			}
		};
		this.binops.h["..!"] = this.binops.h["..<"];
		this.binops.h["..*"] = function(e1,e2) {
			let start = me.expr(e1);
			let length = me.expr(e2);
			if(length == 0) {
				return [];
			}
			if(length > 0) {
				let _g = [];
				let _g1 = start;
				let _g2 = start + length;
				while(_g1 < _g2) _g.push(_g1++);
				return _g;
			} else {
				let _g = [];
				let _g1 = -start;
				let _g2 = -start - length;
				while(_g1 < _g2) _g.push(-(_g1++));
				return _g;
			}
		};
		let _gthis = this;
		this.binops.h["?"] = function(e1,e2) {
			switch(e2._hx_index) {
			case 0:
				let _g = e2.e;
				if(_g._hx_index == 22) {
					let c = _g.v + Std.string(me.expr(e2.index));
					if(Object.prototype.hasOwnProperty.call(_gthis.builtInDirectives.h,c)) {
						let expr1;
						try {
							expr1 = me.expr(e1);
						} catch( _g ) {
							let _g1 = haxe_Exception.caught(_g).unwrap();
							if(js_Boot.__instanceof(_g1,miniftl_Error)) {
								throw haxe_Exception.thrown(_g1);
							} else {
								throw _g;
							}
						}
						return _gthis.builtInDirectives.h[c](expr1);
					} else {
						throw haxe_Exception.thrown(miniftl_Error.ECustom("" + c + " is not implemented yet."));
					}
				} else {
					throw haxe_Exception.thrown(miniftl_Error.ECustom("name must be an identifier"));
				}
				break;
			case 8:
				let _g1 = e2.e;
				let _g2 = e2.params;
				if(_g1._hx_index == 22) {
					let _g = _g1.v;
					if(Object.prototype.hasOwnProperty.call(_gthis.builtInDirectives.h,_g)) {
						let result = new Array(_g2.length);
						let _g1 = 0;
						let _g11 = _g2.length;
						while(_g1 < _g11) {
							let i = _g1++;
							result[i] = me.expr(_g2[i]);
						}
						return _gthis.builtInDirectives.h[_g]([me.expr(e1)].concat(result));
					} else {
						throw haxe_Exception.thrown(miniftl_Error.ECustom("" + _g + " is not implemented yet."));
					}
				} else {
					throw haxe_Exception.thrown(miniftl_Error.ECustom("name must be an identifier"));
				}
				break;
			case 22:
				let _g3 = e2.v;
				if(Object.prototype.hasOwnProperty.call(_gthis.builtInDirectives.h,_g3)) {
					let expr1;
					try {
						expr1 = me.expr(e1);
					} catch( _g ) {
						let _g1 = haxe_Exception.caught(_g).unwrap();
						if(js_Boot.__instanceof(_g1,miniftl_Error)) {
							if(_g3 == "has_content") {
								expr1 = null;
							} else {
								throw haxe_Exception.thrown(_g1);
							}
						} else {
							throw _g;
						}
					}
					return _gthis.builtInDirectives.h[_g3](expr1);
				} else {
					throw haxe_Exception.thrown(miniftl_Error.ECustom("" + _g3 + " is not implemented yet."));
				}
				break;
			default:
				throw haxe_Exception.thrown(miniftl_Error.ECustom("name must be an identifier"));
			}
		};
		this.binops.h["!"] = function(e1,e2) {
			if(e1._hx_index == 0) {
				let _g = e1.e;
				try {
					me.expr(_g);
				} catch( _g ) {
					let _g1 = haxe_Exception.caught(_g).unwrap();
					if(js_Boot.__instanceof(_g1,miniftl_Error)) {
						throw haxe_Exception.thrown(_g1);
					} else {
						throw _g;
					}
				}
			}
			try {
				let ex1 = me.expr(e1);
				if(ex1 == null) {
					if(e2 == null) {
						return null;
					}
					return me.expr(e2);
				}
				return ex1;
			} catch( _g ) {
				let _g1 = haxe_Exception.caught(_g).unwrap();
				if(js_Boot.__instanceof(_g1,miniftl_Error)) {
					if(e2 == null) {
						throw haxe_Exception.thrown(_g1);
					}
					return me.expr(e2);
				} else {
					throw _g;
				}
			}
		};
		this.assignOp("+=",function(v1,v2) {
			return v1 + v2;
		});
		this.assignOp("-=",function(v1,v2) {
			return v1 - v2;
		});
		this.assignOp("*=",function(v1,v2) {
			return v1 * v2;
		});
		this.assignOp("/=",function(v1,v2) {
			return v1 / v2;
		});
		this.assignOp("%=",function(v1,v2) {
			return v1 % v2;
		});
		this.assignOp("&=",function(v1,v2) {
			return v1 & v2;
		});
		this.assignOp("|=",function(v1,v2) {
			return v1 | v2;
		});
		this.assignOp("^=",function(v1,v2) {
			return v1 ^ v2;
		});
		this.assignOp("<<=",function(v1,v2) {
			return v1 << v2;
		});
		this.assignOp(">>=",function(v1,v2) {
			return v1 >> v2;
		});
		this.assignOp(">>>=",function(v1,v2) {
			return v1 >>> v2;
		});
	}
	initSpecialVars() {
		this.specialVars.h["current_template_name"] = function() {
			return "nameless";
		};
		this.specialVars.h["now"] = function() {
			return new Date();
		};
		let _gthis = this;
		this.specialVars.h["error"] = function() {
			return _gthis.errorSpecialVar;
		};
		this.specialVars.h["template_name"] = function() {
			return "nameless";
		};
		this.specialVars.h["version"] = function() {
			return "2.3.29";
		};
	}
	initBuiltIns() {
		this.builtInDirectives.h["abs"] = function(arg) {
			return Math.abs(arg);
		};
		this.builtInDirectives.h["boolean"] = function(arg) {
			if(typeof(arg) == "string") {
				if(arg != "true" && arg != "false") {
					throw haxe_Exception.thrown(miniftl_Error.ECustom("Value must be 'true' or 'false'."));
				}
				if(arg == "true") {
					return true;
				} else {
					return false;
				}
			} else {
				throw haxe_Exception.thrown(miniftl_Error.ECustom("Value must be string."));
			}
		};
		this.builtInDirectives.h["c"] = function(arg) {
			return Std.string(arg);
		};
		this.builtInDirectives.h["cap_first"] = function(arg) {
			let s = arg;
			let re = new EReg("(\\b[a-z](?!\\s))","");
			if(re.match(s)) {
				let by = re.matched(1).toUpperCase();
				s = s.replace(re.r,by);
			}
			return s;
		};
		this.builtInDirectives.h["capitalize"] = function(arg) {
			let s = arg;
			s = new EReg("(\\b[a-z](?!\\s))","g").map(s,function(m) {
				return m.matched(1).toUpperCase();
			});
			return s;
		};
		this.builtInDirectives.h["ceiling"] = function(arg) {
			return Math.ceil(arg);
		};
		this.builtInDirectives.h["contains"] = function(arg) {
			return arg[0].includes(arg[1]);
		};
		this.builtInDirectives.h["date"] = $bind(this,this.dateBuiltIn);
		this.builtInDirectives.h["datetime"] = $bind(this,this.dateBuiltIn);
		let _gthis = this;
		this.builtInDirectives.h["eval"] = function(arg) {
			if(arg == null) {
				throw haxe_Exception.thrown(miniftl_Error.ECustom("Arg for eval is null"));
			}
			let ast = new miniftl_Parser().parseExpression(arg);
			return _gthis.getInterp(null,_gthis.isDebugMode).execute(ast,_gthis.globals,_gthis.variables,_gthis.declaredVariables);
		};
		this.builtInDirectives.h["first"] = function(arg) {
			return arg[0];
		};
		this.builtInDirectives.h["floor"] = function(arg) {
			return Math.floor(arg);
		};
		this.builtInDirectives.h["has_content"] = function(arg) {
			if(arg != null) {
				return arg != "";
			} else {
				return false;
			}
		};
		this.builtInDirectives.h["int"] = function(arg) {
			return arg | 0;
		};
		this.builtInDirectives.h["interpret"] = function(arg) {
			let ast = new miniftl_Parser().parseTemplate(arg);
			return _gthis.getInterp(null,_gthis.isDebugMode).execute(ast,_gthis.globals,_gthis.variables,_gthis.declaredVariables);
		};
		this.builtInDirectives.h["keys"] = function(arg) {
			return arg.keys();
		};
		this.builtInDirectives.h["last"] = function(arg) {
			return arg[(arg.length | 0) - 1];
		};
		this.builtInDirectives.h["length"] = function(arg) {
			return arg.length;
		};
		this.builtInDirectives.h["lower_case"] = function(arg) {
			return arg.toLowerCase();
		};
		this.builtInDirectives.h["number"] = function(arg) {
			return parseFloat(arg);
		};
		this.builtInDirectives.h["replace"] = function(arg) {
			if(arg.length != 3) {
				throw haxe_Exception.thrown(miniftl_Error.ECustom("Replace must have 2 arguments"));
			}
			return StringTools.replace(arg[0],arg[1],arg[2]);
		};
		this.builtInDirectives.h["size"] = function(arg) {
			return arg.length;
		};
		this.builtInDirectives.h["seq_contains"] = function(arg) {
			return arg[0].indexOf(arg[1]) != -1;
		};
		this.builtInDirectives.h["seq_index_of"] = function(arg) {
			return arg[0].indexOf(arg[1]);
		};
		this.builtInDirectives.h["split"] = function(arg) {
			return arg[0].split(arg[1]);
		};
		this.builtInDirectives.h["starts_with"] = function(arg) {
			return arg[0].substr(0,arg[1].length) == arg[1];
		};
		this.builtInDirectives.h["string"] = $bind(this,this.stringBuiltIn);
		this.builtInDirectives.h["stringcomputer"] = function(arg) {
			return Std.string(arg);
		};
		this.builtInDirectives.h["time"] = $bind(this,this.dateBuiltIn);
		this.builtInDirectives.h["trim"] = function(arg) {
			return StringTools.trim(arg);
		};
		this.builtInDirectives.h["upper_case"] = function(arg) {
			return arg.toUpperCase();
		};
		this.builtInDirectives.h["url"] = function(arg) {
			if(typeof(arg) == "string") {
				return encodeURIComponent(arg);
			} else if(((arg) instanceof Array)) {
				return encodeURIComponent(arg[0]);
			} else {
				let s = Std.string(arg);
				return encodeURIComponent(s);
			}
		};
	}
	stringBuiltIn(arg) {
		switch(Type.typeof(arg)._hx_index) {
		case 1:
			return Std.string(arg);
		case 2:
			return xa3_format_NumberFormat.number(arg);
		case 3:
			return Std.string(arg);
		case 6:
			if(typeof(arg) == "string") {
				return arg;
			} else if(((arg) instanceof Date)) {
				return miniftl_format_DateFormat.format(arg);
			} else if(((arg) instanceof Array)) {
				return this.stringBuiltInWithArgument(arg[0],arg[1]);
			}
			break;
		default:
		}
		return "";
	}
	stringBuiltInWithArgument(value,format) {
		switch(Type.typeof(value)._hx_index) {
		case 1:case 2:
			let hasGroupingSeparator = format.indexOf(",") != -1;
			let _this = format.split("");
			let _g = [];
			let _g1 = 0;
			while(_g1 < _this.length) {
				let v = _this[_g1];
				++_g1;
				if(v == "0") {
					_g.push(v);
				}
			}
			let minWholeNumbers = _g.length;
			if(hasGroupingSeparator) {
				return xa3_format_NumberFormat.number(value,0,null,minWholeNumbers);
			} else {
				return xa3_format_NumberFormat.fixed(value,0,null,minWholeNumbers);
			}
			break;
		case 3:
			return Std.string(value);
		case 6:
			if(typeof(value) == "string") {
				return value;
			} else if(((value) instanceof Date)) {
				return miniftl_format_DateFormat.javaSimpleDate(value,format);
			} else if(((value) instanceof Array)) {
				return Std.string(value);
			}
			break;
		default:
		}
		return "";
	}
	dateBuiltIn(arg) {
		if(Type.typeof(arg)._hx_index == 6) {
			if(typeof(arg) == "string") {
				return miniftl_DateParse.parse(arg);
			} else if(((arg) instanceof Date)) {
				return arg;
			} else if(((arg) instanceof Array)) {
				return this.dateBuiltInWithArgument(arg[0],arg[1]);
			}
		} else {
			throw haxe_Exception.thrown(miniftl_Error.ECustom("call of ?date or ?datetime with invalid arguments"));
		}
		return null;
	}
	dateBuiltInWithArgument(value,pattern) {
		if(Type.typeof(value)._hx_index == 6) {
			if(typeof(value) == "string") {
				return miniftl_DateParse.parse(value);
			} else if(((value) instanceof Date)) {
				return value;
			} else {
				throw haxe_Exception.thrown(miniftl_Error.ECustom("call of ?date or ?datetime with invalid arguments"));
			}
		} else {
			throw haxe_Exception.thrown(miniftl_Error.ECustom("call of ?date or ?datetime with invalid arguments"));
		}
	}
	assign(e1,e2) {
		let v = this.expr(e2);
		switch(e1._hx_index) {
		case 0:
			let arr = this.expr(e1.e);
			let index = this.expr(e1.index);
			if(js_Boot.__implements(arr,haxe_IMap)) {
				(js_Boot.__cast(arr , haxe_IMap)).set(index,v);
			} else {
				arr[index] = v;
			}
			break;
		case 17:
			v = this.set(this.expr(e1.e),e1.f,v);
			break;
		case 22:
			let _g = e1.v;
			let l = this.variables.h[_g];
			if(l == null) {
				this.globals.h[_g] = v;
			} else {
				l.r = v;
			}
			break;
		default:
			throw haxe_Exception.thrown(miniftl_Error.EInvalidOp("="));
		}
		return v;
	}
	assignOp(op,fop) {
		let me = this;
		this.binops.h[op] = function(e1,e2) {
			return me.evalAssignOp(op,fop,e1,e2);
		};
	}
	evalAssignOp(op,fop,e1,e2) {
		let v;
		switch(e1._hx_index) {
		case 0:
			let arr = this.expr(e1.e);
			let index = this.expr(e1.index);
			if(js_Boot.__implements(arr,haxe_IMap)) {
				v = fop((js_Boot.__cast(arr , haxe_IMap)).get(index),this.expr(e2));
				(js_Boot.__cast(arr , haxe_IMap)).set(index,v);
			} else {
				v = fop(arr[index],this.expr(e2));
				arr[index] = v;
			}
			break;
		case 17:
			let _g = e1.f;
			let obj = this.expr(e1.e);
			v = fop(this.get(obj,_g),this.expr(e2));
			v = this.set(obj,_g,v);
			break;
		case 22:
			let _g1 = e1.v;
			let l = this.variables.h[_g1];
			v = fop(this.expr(e1),this.expr(e2));
			if(l == null) {
				this.globals.h[_g1] = v;
			} else {
				l.r = v;
			}
			break;
		default:
			throw haxe_Exception.thrown(miniftl_Error.EInvalidOp(op));
		}
		return v;
	}
	increment(e,prefix,delta) {
		switch(e._hx_index) {
		case 0:
			let arr = this.expr(e.e);
			let index = this.expr(e.index);
			if(js_Boot.__implements(arr,haxe_IMap)) {
				let v = (js_Boot.__cast(arr , haxe_IMap)).get(index);
				if(prefix) {
					v += delta;
					(js_Boot.__cast(arr , haxe_IMap)).set(index,v);
				} else {
					(js_Boot.__cast(arr , haxe_IMap)).set(index,v + delta);
				}
				return v;
			} else {
				let v = arr[index];
				if(prefix) {
					v += delta;
					arr[index] = v;
				} else {
					arr[index] = v + delta;
				}
				return v;
			}
			break;
		case 2:
			let _g = e.n;
			let l = this.variables.h[_g];
			let v = l == null ? this.globals.h[_g] : l.r;
			if(prefix) {
				v += delta;
				if(l == null) {
					this.globals.h[_g] = v;
				} else {
					l.r = v;
				}
			} else if(l == null) {
				this.globals.h[_g] = v + delta;
			} else {
				l.r = v + delta;
			}
			return v;
		case 17:
			let _g1 = e.f;
			let obj = this.expr(e.e);
			let v1 = this.get(obj,_g1);
			if(prefix) {
				v1 += delta;
				this.set(obj,_g1,v1);
			} else {
				this.set(obj,_g1,v1 + delta);
			}
			return v1;
		case 22:
			let _g2 = e.v;
			let l1 = this.variables.h[_g2];
			let v2 = l1 == null ? this.globals.h[_g2] : l1.r;
			if(prefix) {
				v2 += delta;
				if(l1 == null) {
					this.globals.h[_g2] = v2;
				} else {
					l1.r = v2;
				}
			} else if(l1 == null) {
				this.globals.h[_g2] = v2 + delta;
			} else {
				l1.r = v2 + delta;
			}
			return v2;
		default:
			throw haxe_Exception.thrown(miniftl_Error.EInvalidOp(delta > 0 ? "++" : "--"));
		}
	}
	execute(expr,globals,variables,declaredVariables) {
		this.globals = globals == null ? new haxe_ds_StringMap() : globals;
		this.setDefaultGlobals();
		this.variables = variables == null ? new haxe_ds_StringMap() : variables;
		this.declaredVariables = this.declaredVariables == null ? [] : this.declaredVariables;
		this.locals = new haxe_ds_StringMap();
		this.declaredLocals = [];
		this.depth = 0;
		this.varContext = miniftl__$Interp_VarContext.InTemplate;
		return this.exprReturn(expr);
	}
	exprReturn(e) {
		try {
			return this.expr(e);
		} catch( _g ) {
			let _g1 = haxe_Exception.caught(_g).unwrap();
			if(js_Boot.__instanceof(_g1,miniftl_Stop)) {
				let e = _g1;
				switch(e._hx_index) {
				case 0:
					throw haxe_Exception.thrown("Invalid break");
				case 1:
					throw haxe_Exception.thrown("Invalid continue");
				case 2:
					let v = this.returnValue;
					this.returnValue = null;
					return v;
				case 3:
					let _g = e.s;
					if(_g == "") {
						return "[No error description was available.]";
					} else {
						return _g;
					}
					break;
				}
			} else {
				throw _g;
			}
		}
	}
	duplicate(h) {
		let h2 = new haxe_ds_StringMap();
		let k_keys = Object.keys(h.h);
		let k_length = k_keys.length;
		let k_current = 0;
		while(k_current < k_length) {
			let k = k_keys[k_current++];
			h2.h[k] = h.h[k];
		}
		return h2;
	}
	restore(old) {
		while(this.declaredVariables.length > old) {
			let d = this.declaredVariables.pop();
			this.variables.h[d.n] = d.old;
		}
	}
	resolve(id) {
		let l = this.locals.h[id];
		if(l != null) {
			return l.r;
		}
		let v = this.variables.h[id];
		if(v != null) {
			return v.r;
		}
		let g = this.globals.h[id];
		if(g == null && !Object.prototype.hasOwnProperty.call(this.globals.h,id)) {
			throw haxe_Exception.thrown(miniftl_Error.EUnknownVariable(id));
		}
		return g;
	}
	resolveSpecialIdent(id) {
		if(Object.prototype.hasOwnProperty.call(this.specialVars.h,id)) {
			return this.specialVars.h[id]();
		}
		let _g = [];
		let key_keys = Object.keys(this.specialVars.h);
		let key_length = key_keys.length;
		let key_current = 0;
		while(key_current < key_length) _g.push(key_keys[key_current++]);
		throw haxe_Exception.thrown(miniftl_Error.ECustom("Unknown special variable name: \"" + id + "\". The allowed special variable names are: " + _g.toString()));
	}
	expr(e) {
		let _gthis = this;
		switch(e._hx_index) {
		case 0:
			let a = this.expr(e.e);
			if(a == null) {
				return null;
			}
			let rIndex = this.expr(e.index);
			if(js_Boot.__implements(a,haxe_IMap)) {
				return (js_Boot.__cast(a , haxe_IMap)).get(rIndex);
			} else if(typeof(a) == "string") {
				if(typeof(rIndex) == "number" && ((rIndex | 0) === rIndex)) {
					return a.charAt(rIndex);
				}
				if(((rIndex) instanceof Array)) {
					let rArray = js_Boot.__cast(rIndex , Array);
					let buf_b = "";
					let _g = 0;
					while(_g < rArray.length) {
						let c = a.charCodeAt(rArray[_g++]);
						buf_b += String.fromCodePoint(c);
					}
					return buf_b;
				}
			} else {
				return a[rIndex];
			}
			break;
		case 1:
			let arr = e.e;
			let tmp;
			if(arr.length > 0) {
				let _g = arr[0];
				tmp = _g._hx_index == 5 && _g.op == ":";
			} else {
				tmp = false;
			}
			if(tmp) {
				let isAllString = true;
				let isAllInt = true;
				let isAllObject = true;
				let isAllEnum = true;
				let keys = [];
				let values = [];
				let _g = 0;
				while(_g < arr.length) {
					let e = arr[_g];
					++_g;
					if(e._hx_index == 5) {
						if(e.op == ":") {
							let key = this.expr(e.e1);
							let value = this.expr(e.e2);
							isAllString = isAllString && typeof(key) == "string";
							isAllInt = isAllInt && (typeof(key) == "number" && ((key | 0) === key));
							isAllObject = isAllObject && Reflect.isObject(key);
							isAllEnum = isAllEnum && Reflect.isEnumValue(key);
							keys.push(key);
							values.push(value);
						} else {
							throw haxe_Exception.thrown(": expected");
						}
					} else {
						throw haxe_Exception.thrown(": expected");
					}
				}
				let map;
				if(isAllInt) {
					map = new haxe_ds_IntMap();
				} else if(isAllString) {
					map = new haxe_ds_StringMap();
				} else if(isAllEnum) {
					map = new haxe_ds_EnumValueMap();
				} else if(isAllObject) {
					map = new haxe_ds_ObjectMap();
				} else {
					throw haxe_Exception.thrown("Inconsistent key types");
				}
				let _g1 = 0;
				let _g2 = keys.length;
				while(_g1 < _g2) {
					let n = _g1++;
					(js_Boot.__cast(map , haxe_IMap)).set(keys[n],values[n]);
				}
				return map;
			} else {
				let a = [];
				let _g = 0;
				while(_g < arr.length) a.push(this.expr(arr[_g++]));
				return a;
			}
			break;
		case 2:
			let n = e.n;
			let e1 = e.e;
			this.declaredVariables.push({ n : n, old : this.variables.h[n]});
			let this1 = this.variables;
			let value = e1 == null ? null : this.expr(e1);
			this1.h[n] = { r : value};
			if(this.isDebugMode) {
				return "<!-- assign " + n + " = " + StringTools.replace(Std.string(this.variables.h[n].r),"-->","->") + " -->";
			}
			break;
		case 3:
			let e2 = e.e;
			let ecatch = e.ecatch;
			let oldTry = this.inTry;
			try {
				this.inTry = true;
				let v = this.expr(e2);
				this.inTry = oldTry;
				return v;
			} catch( _g ) {
				let _g1 = haxe_Exception.caught(_g).unwrap();
				if(js_Boot.__instanceof(_g1,miniftl_Stop)) {
					this.inTry = oldTry;
					throw haxe_Exception.thrown(_g1);
				} else if(js_Boot.__instanceof(_g1,miniftl_TTSourceError)) {
					throw haxe_Exception.thrown(_g1);
				} else {
					this.errorSpecialVar = Std.string(_g1);
					this.inTry = oldTry;
					return this.expr(ecatch);
				}
			}
			break;
		case 4:
			return StringTools.htmlEscape(this.expr(e.e));
		case 5:
			let op = e.op;
			let e11 = e.e1;
			let e21 = e.e2;
			let fop = this.binops.h[op];
			if(fop == null) {
				throw haxe_Exception.thrown(miniftl_Error.EInvalidOp(op));
			}
			try {
				return fop(e11,e21);
			} catch( _g ) {
				throw haxe_Exception.thrown(miniftl_Error.ECustom(haxe_Exception.caught(_g).unwrap()));
			}
			break;
		case 6:
			let exprs = e.el;
			let old = this.declaredVariables.length;
			let v = null;
			let _g = 0;
			while(_g < exprs.length) v = this.expr(exprs[_g++]);
			this.restore(old);
			return v;
		case 7:
			throw haxe_Exception.thrown(miniftl_Stop.SBreak(""));
		case 8:
			let e3 = e.e;
			let params = e.params;
			let args = [];
			let _g1 = 0;
			while(_g1 < params.length) args.push(this.expr(params[_g1++]));
			if(e3._hx_index == 17) {
				let f = e3.f;
				let obj = this.expr(e3.e);
				if(obj == null) {
					throw haxe_Exception.thrown(miniftl_Error.EInvalidAccess(f));
				}
				return this.fcall(obj,f,args);
			} else {
				return this.call(null,this.expr(e3),args);
			}
			break;
		case 9:
			let e12 = e.e1;
			let e22 = e.e2;
			let params1 = e.params;
			let arg = new haxe_ds_StringMap();
			arg.h["MACRO_CALL_BODY_VAR_4482834"] = e22 != null ? { r : e22} : { r : miniftl_Expr.EScalar(miniftl_Scalar.CString(""))};
			if(params1 != null) {
				let _g = 0;
				while(_g < params1.length) {
					let p = params1[_g];
					++_g;
					if(p._hx_index == 5) {
						let e1 = p.e1;
						if(p.op == "=") {
							let varName;
							if(e1._hx_index == 22) {
								varName = e1.v;
							} else {
								throw haxe_Exception.thrown(miniftl_Error.EUnexpected("Parameter should be variable name"));
							}
							let value = this.expr(p.e2);
							arg.h[varName] = value;
						} else {
							throw haxe_Exception.thrown(miniftl_Error.EUnexpected("Expected variable assignment"));
						}
					} else {
						throw haxe_Exception.thrown(miniftl_Error.EUnexpected("Expected variable assignment"));
					}
				}
			}
			return this.call(null,this.expr(e12),[arg]);
		case 10:
			break;
		case 11:
			let exprs1 = e.el;
			let v1 = "";
			let _g2 = 0;
			while(_g2 < exprs1.length) {
				let e = exprs1[_g2];
				++_g2;
				switch(e._hx_index) {
				case 20:
					this.expr(e);
					break;
				case 28:
					this.expr(e);
					break;
				default:
					try {
						let re = this.expr(e);
						if(re != null) {
							v1 += re;
						}
					} catch( _g ) {
						let _g1 = haxe_Exception.caught(_g).unwrap();
						if(js_Boot.__instanceof(_g1,miniftl_Stop)) {
							let err = _g1;
							switch(err._hx_index) {
							case 0:
								throw haxe_Exception.thrown(miniftl_Stop.SBreak(v1 + err.s));
							case 1:
								throw haxe_Exception.thrown(err);
							case 2:
								throw haxe_Exception.thrown(miniftl_Stop.SReturn(v1 + err.s));
							case 3:
								throw haxe_Exception.thrown(err);
							}
						} else {
							throw _g;
						}
					}
				}
			}
			return v1;
		case 12:
			if(this.isDebugMode) {
				return "<!--" + e.s + "-->";
			}
			break;
		case 13:
			let b = e.e;
			switch(b._hx_index) {
			case 11:
				let exprs2 = b.el;
				if(exprs2.length == 0) {
					return "";
				}
				let result = new Array(exprs2.length);
				let _g3 = 0;
				let _g11 = exprs2.length;
				while(_g3 < _g11) {
					let i = _g3++;
					result[i] = _gthis.expr(exprs2[i]);
				}
				let _g4 = [];
				let _g12 = 0;
				let _g5 = result;
				while(_g12 < _g5.length) {
					let v = _g5[_g12];
					++_g12;
					if(v != null) {
						_g4.push(v);
					}
				}
				return this.compress(_g4.join(""));
			case 32:
				let s = b.s;
				switch(s._hx_index) {
				case 0:
					return s.f;
				case 1:
					return this.compress(s.s);
				case 2:
					return s.d;
				case 3:
					return s.d;
				case 4:
					return s.d;
				}
				break;
			default:
				throw haxe_Exception.thrown(miniftl_Error.ECustom("Internal Error: Compress contains no block"));
			}
			break;
		case 14:
			throw haxe_Exception.thrown(miniftl_Stop.SContinue);
		case 15:
			break;
		case 16:
			break;
		case 17:
			return this.get(this.expr(e.e),e.f);
		case 18:
			break;
		case 19:
			break;
		case 20:
			let params2 = e.args;
			let fexpr = e.e;
			let name = e.name;
			let capturedVariables = this.duplicate(this.variables);
			let me = this;
			let minParams = 0;
			let _g6 = 0;
			while(_g6 < params2.length) if(params2[_g6++].value == null) {
				minParams += 1;
			}
			let f = Reflect.makeVarArgs(function(args) {
				if(args.length != params2.length) {
					if(args.length < minParams) {
						let str = "Invalid number of parameters. Got " + args.length + ", required " + minParams;
						if(name != null) {
							str += " for function '" + name + "'";
						}
						throw haxe_Exception.thrown(miniftl_Error.ECustom(str));
					}
					let _g = 0;
					let _g1 = params2.length;
					while(_g < _g1) {
						let i = _g++;
						if(i >= args.length) {
							args[i] = _gthis.expr(params2[i].value);
						}
					}
				}
				let old = me.variables;
				let depth = me.depth;
				me.depth++;
				me.variables = me.duplicate(capturedVariables);
				let _g = 0;
				let _g1 = params2.length;
				while(_g < _g1) {
					let i = _g++;
					me.variables.h[params2[i].name] = { r : args[i]};
				}
				let tempVarContext = _gthis.varContext;
				_gthis.varContext = miniftl__$Interp_VarContext.InFunction;
				let r = null;
				if(_gthis.inTry) {
					try {
						r = me.exprReturn(fexpr);
					} catch( _g ) {
						let _g1 = haxe_Exception.caught(_g).unwrap();
						me.variables = old;
						me.depth = depth;
						throw haxe_Exception.thrown(_g1);
					}
				} else {
					r = me.exprReturn(fexpr);
				}
				me.variables = old;
				me.depth = depth;
				_gthis.varContext = tempVarContext;
				return r;
			});
			if(name != null) {
				if(this.depth == 0) {
					this.globals.h[name] = f;
				} else {
					this.declaredVariables.push({ n : name, old : this.variables.h[name]});
					let ref = { r : f};
					this.variables.h[name] = ref;
					capturedVariables.h[name] = ref;
				}
			}
			return "";
		case 21:
			let fl = e.fl;
			let o = { };
			let _g7 = 0;
			while(_g7 < fl.length) {
				let f = fl[_g7];
				++_g7;
				this.set(o,f.name,this.expr(f.e));
			}
			return o;
		case 22:
			return this.resolve(e.v);
		case 23:
			let econd = e.cond;
			let e23 = e.e2;
			let cond = this.expr(econd);
			let result1 = cond != false && cond != null ? this.expr(e.e1) : e23 == null ? null : this.expr(e23);
			if(this.isDebugMode) {
				let debugOutput = "<!-- if " + miniftl_Printer.toString(econd) + ": " + (cond == null ? "null" : "" + cond) + " -->";
				if(result1 == null) {
					return debugOutput;
				} else {
					return debugOutput + result1;
				}
			} else {
				return result1;
			}
			break;
		case 24:
			let n1 = e.n;
			let path = this.expr(e.e);
			let outcome;
			try {
				outcome = this.templateSource.getTemplate(path);
			} catch( _g ) {
				throw haxe_Exception.thrown(haxe_Exception.caught(_g).unwrap());
			}
			switch(outcome._hx_index) {
			case 0:
				let interp = this.getInterp(this.templateSource,this.isDebugMode);
				let ex = interp.execute(outcome.data,this.globals,this.variables,this.declaredVariables);
				this.declaredVariables.push({ n : n1, old : this.variables.h[n1]});
				let interpVariables = new haxe_ds_StringMap();
				let h = interp.variables.h;
				let _g_h = h;
				let _g_keys = Object.keys(h);
				let _g_length = _g_keys.length;
				let _g_current = 0;
				while(_g_current < _g_length) {
					let key = _g_keys[_g_current++];
					interpVariables.h[key] = _g_h[key].r;
				}
				this.variables.h[n1] = { r : interpVariables};
				if(this.isDebugMode) {
					return "<!-- import " + path + " as " + n1 + " -->\n" + ex;
				}
				break;
			case 1:
				throw haxe_Exception.thrown(miniftl_Error.EFileNotFound(path));
			}
			break;
		case 25:
			let path1 = this.expr(e.e);
			let outcome1;
			try {
				outcome1 = this.templateSource.getTemplate(path1);
			} catch( _g ) {
				throw haxe_Exception.thrown(haxe_Exception.caught(_g).unwrap());
			}
			switch(outcome1._hx_index) {
			case 0:
				let included = this.getInterp(this.templateSource).execute(outcome1.data,this.globals,this.variables,this.declaredVariables);
				if(this.isDebugMode) {
					return "<!-- start include " + path1 + " -->\n" + included + "\n<!-- end " + path1 + " -->";
				} else {
					return included;
				}
				break;
			case 1:
				throw haxe_Exception.thrown(miniftl_Error.EFileNotFound(path1));
			}
			break;
		case 26:
			let v11 = e.v1;
			let v2 = e.v2;
			let iter = e.it;
			let e4 = e.e;
			if(v2 == null) {
				return this.listLoop(v11,iter,e4);
			} else {
				return this.listKeyValue(v11,v2,iter,e4);
			}
			break;
		case 27:
			let n2 = e.n;
			let e5 = e.e;
			if(this.varContext != miniftl__$Interp_VarContext.InFunction && this.varContext != miniftl__$Interp_VarContext.InMacro) {
				throw haxe_Exception.thrown(miniftl_Error.ECustom("Error: locals can only be assigned in a function or in a macro."));
			}
			this.declaredLocals.push({ n : n2, old : this.locals.h[n2]});
			let this2 = this.locals;
			let value1 = e5 == null ? null : this.expr(e5);
			this2.h[n2] = { r : value1};
			return null;
		case 28:
			let params3 = e.args;
			let fexpr1 = e.e;
			let name1 = e.name;
			let capturedVariables1 = this.duplicate(this.variables);
			let me1 = this;
			let minParams1 = 0;
			let _g8 = 0;
			while(_g8 < params3.length) if(params3[_g8++].value == null) {
				minParams1 += 1;
			}
			let f1 = Reflect.makeVarArgs(function(args) {
				let argMap = args[0];
				let _g = [];
				let field_keys = Object.keys(argMap.h);
				let field_length = field_keys.length;
				let field_current = 0;
				while(field_current < field_length) _g.push(field_keys[field_current++]);
				let argFields = _g;
				HxOverrides.remove(argFields,"MACRO_CALL_BODY_VAR_4482834");
				if(argFields.length != params3.length) {
					if(argFields.length < minParams1) {
						let str = "Invalid number of parameters. Got " + argFields.length + ", required " + minParams1;
						if(name1 != null) {
							str += " for function '" + name1 + "'";
						}
						throw haxe_Exception.thrown(miniftl_Error.ECustom(str));
					}
				}
				let old = me1.variables;
				let depth = me1.depth;
				me1.depth++;
				me1.variables = me1.duplicate(capturedVariables1);
				let _g1 = 0;
				while(_g1 < params3.length) {
					let param = params3[_g1];
					++_g1;
					let argValue = argMap.h[param.name];
					let this1 = me1.variables;
					let key = param.name;
					let value = argValue == null ? _gthis.expr(param.value) : argValue;
					this1.h[key] = { r : value};
				}
				me1.variables.h["MACRO_CALL_BODY_VAR_4482834"] = argMap.h["MACRO_CALL_BODY_VAR_4482834"];
				let tempVarContext = _gthis.varContext;
				_gthis.varContext = miniftl__$Interp_VarContext.InFunction;
				let r = null;
				if(_gthis.inTry) {
					try {
						r = me1.exprReturn(fexpr1);
					} catch( _g ) {
						let _g1 = haxe_Exception.caught(_g).unwrap();
						me1.variables = old;
						me1.depth = depth;
						throw haxe_Exception.thrown(_g1);
					}
				} else {
					r = me1.exprReturn(fexpr1);
				}
				me1.variables = old;
				me1.depth = depth;
				_gthis.varContext = tempVarContext;
				return r;
			});
			if(name1 != null) {
				this.declaredVariables.push({ n : name1, old : this.variables.h[name1]});
				let ref = { r : f1};
				this.variables.h[name1] = ref;
				capturedVariables1.h[name1] = ref;
			}
			return "";
		case 29:
			return this.expr(this.resolve("MACRO_CALL_BODY_VAR_4482834"));
		case 30:
			return this.expr(e.e);
		case 31:
			let e6 = e.e;
			this.returnValue = e6 == null ? null : this.expr(e6);
			throw haxe_Exception.thrown(miniftl_Stop.SReturn(""));
		case 32:
			let c = e.s;
			switch(c._hx_index) {
			case 0:
				return c.f;
			case 1:
				return c.s;
			case 2:
				return c.d;
			case 3:
				return c.d;
			case 4:
				return c.d;
			}
			break;
		case 33:
			break;
		case 34:
			return this.resolveSpecialIdent(e.v);
		case 35:
			let e7 = e.e;
			throw haxe_Exception.thrown(miniftl_Stop.StopException(e7 == null ? "" : this.expr(e7)));
		case 36:
			let cases = e.cases;
			let def = e.defaultExpr;
			let cond1 = this.expr(e.e);
			let val = "";
			let match = false;
			let isLoop = true;
			let i = 0;
			while(i < cases.length && isLoop) {
				let c = cases[i];
				let _g = 0;
				let _g1 = c.values;
				while(_g < _g1.length) if(this.expr(_g1[_g++]) == cond1) {
					match = true;
				}
				if(match) {
					let result = null;
					try {
						result = this.expr(c.expr);
					} catch( _g ) {
						let _g1 = haxe_Exception.caught(_g).unwrap();
						if(js_Boot.__instanceof(_g1,miniftl_Stop)) {
							let e = _g1;
							if(e._hx_index == 0) {
								result = e.s;
								isLoop = false;
							} else {
								throw haxe_Exception.thrown(e);
							}
						} else {
							throw _g;
						}
					}
					val += result;
				}
				++i;
			}
			if(isLoop) {
				val += def == null ? "" : this.expr(def);
			}
			return val;
		case 37:
			throw haxe_Exception.thrown(this.expr(e.e));
		case 38:
			let op1 = e.op;
			let prefix = e.prefix;
			let e8 = e.e;
			switch(op1) {
			case "!":
				return this.expr(e8) != true;
			case "++":
				return this.increment(e8,prefix,1);
			case "-":
				return -this.expr(e8);
			case "--":
				return this.increment(e8,prefix,-1);
			case "??":
				try {
					if(this.expr(e8) != null) {
						return true;
					}
				} catch( _g ) {
					if(js_Boot.__instanceof(haxe_Exception.caught(_g).unwrap(),miniftl_Error)) {
						return false;
					} else {
						throw _g;
					}
				}
				break;
			case "~":
				return ~this.expr(e8);
			default:
				throw haxe_Exception.thrown(miniftl_Error.EInvalidOp(op1));
			}
			break;
		}
		return null;
	}
	compress(s) {
		s = StringTools.replace(s,"\r","");
		let newLineReplace_r = new RegExp("\n+","g".split("u").join(""));
		s = s.replace(newLineReplace_r,"\n");
		let spaceReplace_r = new RegExp(" +","g".split("u").join(""));
		s = s.replace(spaceReplace_r," ");
		if(s.charAt(0) == "\n") {
			s = HxOverrides.substr(s,1,null);
		}
		if(s.charAt(s.length - 1) == "\n") {
			s = HxOverrides.substr(s,0,s.length - 1);
		}
		return s;
	}
	makeIterator(v) {
		try {
			v = $getIterator(v);
		} catch( _g ) {
		}
		if(v.hasNext == null || v.next == null) {
			throw haxe_Exception.thrown(miniftl_Error.EInvalidIterator(v));
		}
		return v;
	}
	listLoop(n,it,e) {
		let it1 = this.makeIterator(this.expr(it));
		let output = "";
		let i = 0;
		_hx_loop1: while(it1.hasNext()) {
			let this1 = this.variables;
			let value = { r : it1.next()};
			this1.h[n] = value;
			this.variables.h["" + n + "_index"] = { r : i};
			let this2 = this.variables;
			let value1 = { r : it1.hasNext()};
			this2.h["" + n + "_has_next"] = value1;
			try {
				let ex = this.expr(e);
				if(ex != null) {
					output += ex;
				}
			} catch( _g ) {
				let _g1 = haxe_Exception.caught(_g).unwrap();
				if(js_Boot.__instanceof(_g1,miniftl_Stop)) {
					let err = _g1;
					switch(err._hx_index) {
					case 0:
						output += err.s;
						break _hx_loop1;
					case 1:
						break;
					case 2:
						output += err.s;
						throw haxe_Exception.thrown(err);
					case 3:
						throw haxe_Exception.thrown(err);
					}
				} else {
					throw _g;
				}
			}
			++i;
		}
		if(output == "") {
			return null;
		} else {
			return output;
		}
	}
	makeStringMap(v) {
		if(js_Boot.__implements(v,haxe_IMap)) {
			return js_Boot.__cast(v , haxe_IMap);
		}
		throw haxe_Exception.thrown(miniftl_Error.EInvalidAccess(v));
	}
	listKeyValue(n1,n2,it,e) {
		let old = this.declaredVariables.length;
		this.declaredVariables.push({ n : n1, old : this.variables.h[n1]});
		this.declaredVariables.push({ n : n2, old : this.variables.h[n2]});
		let map = this.makeStringMap(this.expr(it));
		let output = "";
		let k = map.keys();
		_hx_loop1: while(k.hasNext()) {
			let k1 = k.next();
			let v = map.get(k1);
			this.variables.h[n1] = { r : k1};
			this.variables.h[n2] = { r : v};
			try {
				let ex = this.expr(e);
				if(ex != null) {
					output += ex;
				}
			} catch( _g ) {
				let _g1 = haxe_Exception.caught(_g).unwrap();
				if(js_Boot.__instanceof(_g1,miniftl_Stop)) {
					let err = _g1;
					switch(err._hx_index) {
					case 0:
						break _hx_loop1;
					case 1:
						break;
					case 2:
						throw haxe_Exception.thrown(err);
					case 3:
						throw haxe_Exception.thrown(err);
					}
				} else {
					throw _g;
				}
			}
		}
		this.restore(old);
		if(output == "") {
			return null;
		} else {
			return output;
		}
	}
	get(o,f) {
		if(o == null) {
			throw haxe_Exception.thrown(miniftl_Error.EInvalidAccess(f));
		}
		return Reflect.getProperty(o,f);
	}
	set(o,f,v) {
		if(o == null) {
			throw haxe_Exception.thrown(miniftl_Error.EInvalidAccess(f));
		}
		Reflect.setProperty(o,f,v);
		return v;
	}
	fcall(o,f,args) {
		return this.call(o,this.get(o,f),args);
	}
	call(o,f,args) {
		return f.apply(o,args);
	}
}
miniftl_Interp.__name__ = true;
Object.assign(miniftl_Interp.prototype, {
	__class__: miniftl_Interp
});
class miniftl_Obj2Map {
	static convert(obj) {
		let map = new haxe_ds_StringMap();
		let fields = Reflect.fields(obj);
		let _g = 0;
		while(_g < fields.length) {
			let field = fields[_g];
			++_g;
			let v = Reflect.field(obj,field);
			if(Reflect.isObject(v)) {
				if(typeof(v) == "string") {
					map.h[field] = v;
				} else if(((v) instanceof Array)) {
					map.h[field] = v;
				} else {
					let value = miniftl_Obj2Map.convert(v);
					map.h[field] = value;
				}
			} else {
				map.h[field] = v;
			}
		}
		return map;
	}
}
miniftl_Obj2Map.__name__ = true;
var miniftl_Token = $hxEnums["miniftl.Token"] = { __ename__:true,__constructs__:null
	,TBaClose: {_hx_name:"TBaClose",_hx_index:0,__enum__:"miniftl.Token",toString:$estr}
	,TBkClose: {_hx_name:"TBkClose",_hx_index:1,__enum__:"miniftl.Token",toString:$estr}
	,TBkOpen: {_hx_name:"TBkOpen",_hx_index:2,__enum__:"miniftl.Token",toString:$estr}
	,TBrClose: {_hx_name:"TBrClose",_hx_index:3,__enum__:"miniftl.Token",toString:$estr}
	,TBrOpen: {_hx_name:"TBrOpen",_hx_index:4,__enum__:"miniftl.Token",toString:$estr}
	,TComma: {_hx_name:"TComma",_hx_index:5,__enum__:"miniftl.Token",toString:$estr}
	,TConst: ($_=function(c) { return {_hx_index:6,c:c,__enum__:"miniftl.Token",toString:$estr}; },$_._hx_name="TConst",$_.__params__ = ["c"],$_)
	,TDirective: ($_=function(s) { return {_hx_index:7,s:s,__enum__:"miniftl.Token",toString:$estr}; },$_._hx_name="TDirective",$_.__params__ = ["s"],$_)
	,TDot: {_hx_name:"TDot",_hx_index:8,__enum__:"miniftl.Token",toString:$estr}
	,TEof: {_hx_name:"TEof",_hx_index:9,__enum__:"miniftl.Token",toString:$estr}
	,TId: ($_=function(s) { return {_hx_index:10,s:s,__enum__:"miniftl.Token",toString:$estr}; },$_._hx_name="TId",$_.__params__ = ["s"],$_)
	,TMeta: ($_=function(s) { return {_hx_index:11,s:s,__enum__:"miniftl.Token",toString:$estr}; },$_._hx_name="TMeta",$_.__params__ = ["s"],$_)
	,TOp: ($_=function(s) { return {_hx_index:12,s:s,__enum__:"miniftl.Token",toString:$estr}; },$_._hx_name="TOp",$_.__params__ = ["s"],$_)
	,TPClose: {_hx_name:"TPClose",_hx_index:13,__enum__:"miniftl.Token",toString:$estr}
	,TPOpen: {_hx_name:"TPOpen",_hx_index:14,__enum__:"miniftl.Token",toString:$estr}
	,TSemicolon: {_hx_name:"TSemicolon",_hx_index:15,__enum__:"miniftl.Token",toString:$estr}
};
miniftl_Token.__constructs__ = [miniftl_Token.TBaClose,miniftl_Token.TBkClose,miniftl_Token.TBkOpen,miniftl_Token.TBrClose,miniftl_Token.TBrOpen,miniftl_Token.TComma,miniftl_Token.TConst,miniftl_Token.TDirective,miniftl_Token.TDot,miniftl_Token.TEof,miniftl_Token.TId,miniftl_Token.TMeta,miniftl_Token.TOp,miniftl_Token.TPClose,miniftl_Token.TPOpen,miniftl_Token.TSemicolon];
var miniftl_VarType = $hxEnums["miniftl.VarType"] = { __ename__:true,__constructs__:null
	,Assign: {_hx_name:"Assign",_hx_index:0,__enum__:"miniftl.VarType",toString:$estr}
	,Local: {_hx_name:"Local",_hx_index:1,__enum__:"miniftl.VarType",toString:$estr}
};
miniftl_VarType.__constructs__ = [miniftl_VarType.Assign,miniftl_VarType.Local];
var miniftl_SwitchType = $hxEnums["miniftl.SwitchType"] = { __ename__:true,__constructs__:null
	,Case: {_hx_name:"Case",_hx_index:0,__enum__:"miniftl.SwitchType",toString:$estr}
	,Default: {_hx_name:"Default",_hx_index:1,__enum__:"miniftl.SwitchType",toString:$estr}
};
miniftl_SwitchType.__constructs__ = [miniftl_SwitchType.Case,miniftl_SwitchType.Default];
class miniftl_Parser {
	constructor() {
		this.pLevel = 0;
		this.uid = 0;
		this.line = 1;
		this.opChars = "+*/-=!?&|^%~:<";
		this.opCharsWithTBAClose = this.opChars + ">";
		this.identChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
		this.specialCompareChars = "glte;";
		let priorities = [["?"],["!"],["%"],["*","/"],["+","-"],["<<",">>",">>>"],["|","&","^"],["=","==","!=",">","<",">=","<="],["..","..<","..!","..*"],["&&"],["||"],["+=","-=","*=","/=","%=","<<=",">>=",">>>=","|=","&=","^=",":"]];
		this.opPriority = new haxe_ds_StringMap();
		this.opRightAssoc = new haxe_ds_StringMap();
		this.unops = new haxe_ds_StringMap();
		let _g = 0;
		let _g1 = priorities.length;
		while(_g < _g1) {
			let i = _g++;
			let _g1 = 0;
			let _g2 = priorities[i];
			while(_g1 < _g2.length) {
				let x = _g2[_g1];
				++_g1;
				this.opPriority.h[x] = i;
				if(i == 11) {
					this.opRightAssoc.h[x] = true;
				}
			}
		}
		this.unops.h["!"] = true;
		this.unops.h["??"] = true;
		this.unops.h["++"] = true;
		this.unops.h["--"] = true;
		this.unops.h["-"] = false;
		this.unops.h["~"] = false;
	}
	invalidChar(c) {
		throw haxe_Exception.thrown(miniftl_Error.EInvalidChar(c));
	}
	initParser(origin) {
		this.preprocStack = [];
		this.origin = origin;
		this.tokens = new haxe_ds_GenericStack();
		this.char = -1;
		this.ops = [];
		this.opsWithTBAClose = [];
		this.idents = [];
		this.specialCompares = [];
		this.uid = 0;
		let _g = 0;
		let _g1 = this.opChars.length;
		while(_g < _g1) this.ops[HxOverrides.cca(this.opChars,_g++)] = true;
		let _g2 = 0;
		let _g3 = this.opCharsWithTBAClose.length;
		while(_g2 < _g3) this.opsWithTBAClose[HxOverrides.cca(this.opCharsWithTBAClose,_g2++)] = true;
		let _g4 = 0;
		let _g5 = this.identChars.length;
		while(_g4 < _g5) this.idents[HxOverrides.cca(this.identChars,_g4++)] = true;
		let _g6 = 0;
		let _g7 = this.specialCompareChars.length;
		while(_g6 < _g7) this.specialCompares[HxOverrides.cca(this.specialCompareChars,_g6++)] = true;
	}
	parseTemplate(content,origin) {
		if(origin == null) {
			origin = "nameless";
		}
		this.input = new haxe_io_StringInput(content);
		this.initParser(origin);
		try {
			return this.parseBlock("");
		} catch( _g ) {
			return miniftl_Expr.EScalar(miniftl_Scalar.CString("Error " + Std.string(haxe_Exception.caught(_g).unwrap())));
		}
	}
	parseStringInterpolation(content,origin) {
		if(origin == null) {
			origin = "nameless";
		}
		this.input = new haxe_io_StringInput(content);
		this.initParser(origin);
		let exprs = [];
		let c = 0;
		let b = new haxe_io_BytesOutput();
		while(true) {
			if(this.char < 0) {
				try {
					c = this.input.readByte();
				} catch( _g ) {
					break;
				}
			} else {
				c = this.char;
				this.char = -1;
			}
			if(c == 36) {
				let c2 = this.readChar();
				if(c2 == 123) {
					if(b.b.pos > 0) {
						exprs.push(this.bytesToStringConstant(b));
					}
					b = new haxe_io_BytesOutput();
					let expr = this.parseInterpolation();
					let t = this.token();
					if(!Type.enumEq(t,miniftl_Token.TBrClose)) {
						this.unexpected(t);
					}
					if(expr != null) {
						exprs.push(expr);
					}
				} else {
					b.writeByte(c);
					b.writeByte(c2);
				}
			} else {
				if(c == 10) {
					this.line++;
				}
				b.writeByte(c);
			}
		}
		if(b.b.pos > 0) {
			exprs.push(this.bytesToStringConstant(b));
		}
		return this.collectExprs(exprs);
	}
	parseExpression(content,origin) {
		if(origin == null) {
			origin = "nameless";
		}
		this.input = new haxe_io_StringInput(content);
		this.initParser(origin);
		return this.parseExpr();
	}
	parseBlock(id) {
		let exprs = [];
		let c = 0;
		let b = new haxe_io_BytesOutput();
		while(true) {
			if(this.char < 0) {
				try {
					c = this.input.readByte();
				} catch( _g ) {
					break;
				}
			} else {
				c = this.char;
				this.char = -1;
			}
			switch(c) {
			case 36:
				let c2 = this.readChar();
				if(c2 == 123) {
					if(b.b.pos > 0) {
						exprs.push(this.bytesToStringConstant(b));
					}
					b = new haxe_io_BytesOutput();
					let expr = this.parseInterpolation();
					let t = this.token();
					if(!Type.enumEq(t,miniftl_Token.TBrClose)) {
						this.unexpected(t);
					}
					if(expr != null) {
						exprs.push(expr);
					}
				} else {
					b.writeByte(c);
					b.writeByte(c2);
				}
				break;
			case 60:
				let c21 = this.readChar();
				switch(c21) {
				case 35:
					if(b.b.pos > 0) {
						exprs.push(this.bytesToStringConstant(b));
					}
					b = new haxe_io_BytesOutput();
					let tk = this.token();
					switch(id) {
					case "attempt":
						if(tk == null) {
							haxe_Log.trace("" + this.origin + " line " + this.line + " token " + this.tokenString(tk) + " no directive - add token as string to exprs",{ fileName : "miniftl/Parser.hx", lineNumber : 309, className : "miniftl.Parser", methodName : "parseBlock"});
							exprs.push(miniftl_Expr.EScalar(miniftl_Scalar.CString(this.tokenString(tk))));
						} else {
							switch(tk._hx_index) {
							case 10:
								let _g = tk.s;
								if(_g == "recover") {
									this.maybe(miniftl_Token.TOp("/"));
									let t = this.token();
									if(t != miniftl_Token.TBaClose) {
										this.unexpected(t);
									}
									return this.collectExprs(exprs);
								} else {
									exprs.push(this.parseStructure(_g));
								}
								break;
							case 12:
								if(tk.s == "--") {
									exprs.push(this.parseComment());
								} else {
									haxe_Log.trace("" + this.origin + " line " + this.line + " token " + this.tokenString(tk) + " no directive - add token as string to exprs",{ fileName : "miniftl/Parser.hx", lineNumber : 309, className : "miniftl.Parser", methodName : "parseBlock"});
									exprs.push(miniftl_Expr.EScalar(miniftl_Scalar.CString(this.tokenString(tk))));
								}
								break;
							default:
								haxe_Log.trace("" + this.origin + " line " + this.line + " token " + this.tokenString(tk) + " no directive - add token as string to exprs",{ fileName : "miniftl/Parser.hx", lineNumber : 309, className : "miniftl.Parser", methodName : "parseBlock"});
								exprs.push(miniftl_Expr.EScalar(miniftl_Scalar.CString(this.tokenString(tk))));
							}
						}
						break;
					case "case":
						if(tk == null) {
							haxe_Log.trace("" + this.origin + " line " + this.line + " token " + this.tokenString(tk) + " no directive - add token as string to exprs",{ fileName : "miniftl/Parser.hx", lineNumber : 309, className : "miniftl.Parser", methodName : "parseBlock"});
							exprs.push(miniftl_Expr.EScalar(miniftl_Scalar.CString(this.tokenString(tk))));
						} else {
							switch(tk._hx_index) {
							case 10:
								let _g1 = tk.s;
								switch(_g1) {
								case "case":
									let _this = this.tokens;
									_this.head = new haxe_ds_GenericCell(tk,_this.head);
									return this.collectExprs(exprs);
								case "default":
									this.maybe(miniftl_Token.TOp("/"));
									let t = this.token();
									if(t != miniftl_Token.TBaClose) {
										this.unexpected(t);
									}
									let _this1 = this.tokens;
									_this1.head = new haxe_ds_GenericCell(tk,_this1.head);
									return this.collectExprs(exprs);
								default:
									exprs.push(this.parseStructure(_g1));
								}
								break;
							case 12:
								if(tk.s == "--") {
									exprs.push(this.parseComment());
								} else {
									haxe_Log.trace("" + this.origin + " line " + this.line + " token " + this.tokenString(tk) + " no directive - add token as string to exprs",{ fileName : "miniftl/Parser.hx", lineNumber : 309, className : "miniftl.Parser", methodName : "parseBlock"});
									exprs.push(miniftl_Expr.EScalar(miniftl_Scalar.CString(this.tokenString(tk))));
								}
								break;
							default:
								haxe_Log.trace("" + this.origin + " line " + this.line + " token " + this.tokenString(tk) + " no directive - add token as string to exprs",{ fileName : "miniftl/Parser.hx", lineNumber : 309, className : "miniftl.Parser", methodName : "parseBlock"});
								exprs.push(miniftl_Expr.EScalar(miniftl_Scalar.CString(this.tokenString(tk))));
							}
						}
						break;
					case "if":
						if(tk == null) {
							haxe_Log.trace("" + this.origin + " line " + this.line + " token " + this.tokenString(tk) + " no directive - add token as string to exprs",{ fileName : "miniftl/Parser.hx", lineNumber : 309, className : "miniftl.Parser", methodName : "parseBlock"});
							exprs.push(miniftl_Expr.EScalar(miniftl_Scalar.CString(this.tokenString(tk))));
						} else {
							switch(tk._hx_index) {
							case 10:
								let _g2 = tk.s;
								switch(_g2) {
								case "else":
									this.maybe(miniftl_Token.TOp("/"));
									let t1 = this.token();
									if(t1 != miniftl_Token.TBaClose) {
										this.unexpected(t1);
									}
									let _this2 = this.tokens;
									_this2.head = new haxe_ds_GenericCell(tk,_this2.head);
									return this.collectExprs(exprs);
								case "elseif":
									let _this3 = this.tokens;
									_this3.head = new haxe_ds_GenericCell(tk,_this3.head);
									return this.collectExprs(exprs);
								default:
									exprs.push(this.parseStructure(_g2));
								}
								break;
							case 12:
								if(tk.s == "--") {
									exprs.push(this.parseComment());
								} else {
									haxe_Log.trace("" + this.origin + " line " + this.line + " token " + this.tokenString(tk) + " no directive - add token as string to exprs",{ fileName : "miniftl/Parser.hx", lineNumber : 309, className : "miniftl.Parser", methodName : "parseBlock"});
									exprs.push(miniftl_Expr.EScalar(miniftl_Scalar.CString(this.tokenString(tk))));
								}
								break;
							default:
								haxe_Log.trace("" + this.origin + " line " + this.line + " token " + this.tokenString(tk) + " no directive - add token as string to exprs",{ fileName : "miniftl/Parser.hx", lineNumber : 309, className : "miniftl.Parser", methodName : "parseBlock"});
								exprs.push(miniftl_Expr.EScalar(miniftl_Scalar.CString(this.tokenString(tk))));
							}
						}
						break;
					case "switch":
						if(tk == null) {
							haxe_Log.trace("" + this.origin + " line " + this.line + " token " + this.tokenString(tk) + " no directive - add token as string to exprs",{ fileName : "miniftl/Parser.hx", lineNumber : 309, className : "miniftl.Parser", methodName : "parseBlock"});
							exprs.push(miniftl_Expr.EScalar(miniftl_Scalar.CString(this.tokenString(tk))));
						} else {
							switch(tk._hx_index) {
							case 10:
								let _g3 = tk.s;
								switch(_g3) {
								case "case":
									return this.parseStructure("case");
								case "default":
									return this.parseStructure("default");
								default:
									exprs.push(this.parseStructure(_g3));
								}
								break;
							case 12:
								if(tk.s == "--") {
									exprs.push(this.parseComment());
								} else {
									haxe_Log.trace("" + this.origin + " line " + this.line + " token " + this.tokenString(tk) + " no directive - add token as string to exprs",{ fileName : "miniftl/Parser.hx", lineNumber : 309, className : "miniftl.Parser", methodName : "parseBlock"});
									exprs.push(miniftl_Expr.EScalar(miniftl_Scalar.CString(this.tokenString(tk))));
								}
								break;
							default:
								haxe_Log.trace("" + this.origin + " line " + this.line + " token " + this.tokenString(tk) + " no directive - add token as string to exprs",{ fileName : "miniftl/Parser.hx", lineNumber : 309, className : "miniftl.Parser", methodName : "parseBlock"});
								exprs.push(miniftl_Expr.EScalar(miniftl_Scalar.CString(this.tokenString(tk))));
							}
						}
						break;
					default:
						if(tk == null) {
							haxe_Log.trace("" + this.origin + " line " + this.line + " token " + this.tokenString(tk) + " no directive - add token as string to exprs",{ fileName : "miniftl/Parser.hx", lineNumber : 309, className : "miniftl.Parser", methodName : "parseBlock"});
							exprs.push(miniftl_Expr.EScalar(miniftl_Scalar.CString(this.tokenString(tk))));
						} else {
							switch(tk._hx_index) {
							case 10:
								exprs.push(this.parseStructure(tk.s));
								break;
							case 12:
								if(tk.s == "--") {
									exprs.push(this.parseComment());
								} else {
									haxe_Log.trace("" + this.origin + " line " + this.line + " token " + this.tokenString(tk) + " no directive - add token as string to exprs",{ fileName : "miniftl/Parser.hx", lineNumber : 309, className : "miniftl.Parser", methodName : "parseBlock"});
									exprs.push(miniftl_Expr.EScalar(miniftl_Scalar.CString(this.tokenString(tk))));
								}
								break;
							default:
								haxe_Log.trace("" + this.origin + " line " + this.line + " token " + this.tokenString(tk) + " no directive - add token as string to exprs",{ fileName : "miniftl/Parser.hx", lineNumber : 309, className : "miniftl.Parser", methodName : "parseBlock"});
								exprs.push(miniftl_Expr.EScalar(miniftl_Scalar.CString(this.tokenString(tk))));
							}
						}
					}
					break;
				case 47:
					let c3 = this.readChar();
					switch(c3) {
					case 35:case 64:
						if(b.b.pos > 0) {
							exprs.push(this.bytesToStringConstant(b));
						}
						b = new haxe_io_BytesOutput();
						let tk1 = this.token();
						this.maybe(miniftl_Token.TOp("/"));
						let t2 = this.token();
						if(t2 != miniftl_Token.TBaClose) {
							this.unexpected(t2);
						}
						switch(id) {
						case "case":
							if(tk1 == null) {
								this.unexpected(tk1);
							} else if(tk1._hx_index == 10) {
								let _g = tk1.s;
								if(_g == "switch") {
									let _this = this.tokens;
									_this.head = new haxe_ds_GenericCell(tk1,_this.head);
									return this.collectExprs(exprs);
								} else if(_g == id) {
									return this.collectExprs(exprs);
								} else {
									this.unexpected(tk1);
								}
							} else {
								this.unexpected(tk1);
							}
							break;
						case "default":
							if(tk1 == null) {
								this.unexpected(tk1);
							} else if(tk1._hx_index == 10) {
								let _g = tk1.s;
								if(_g == "switch") {
									let _this = this.tokens;
									_this.head = new haxe_ds_GenericCell(tk1,_this.head);
									return this.collectExprs(exprs);
								} else if(_g == id) {
									return this.collectExprs(exprs);
								} else {
									this.unexpected(tk1);
								}
							} else {
								this.unexpected(tk1);
							}
							break;
						case "else":
							if(tk1 == null) {
								this.unexpected(tk1);
							} else if(tk1._hx_index == 10) {
								let _g = tk1.s;
								if(_g == "if") {
									return this.collectExprs(exprs);
								} else if(_g == id) {
									return this.collectExprs(exprs);
								} else {
									this.unexpected(tk1);
								}
							} else {
								this.unexpected(tk1);
							}
							break;
						case "if":
							if(tk1 == null) {
								this.unexpected(tk1);
							} else if(tk1._hx_index == 10) {
								let _g = tk1.s;
								if(_g == "if") {
									let _this = this.tokens;
									_this.head = new haxe_ds_GenericCell(tk1,_this.head);
									return this.collectExprs(exprs);
								} else if(_g == id) {
									return this.collectExprs(exprs);
								} else {
									this.unexpected(tk1);
								}
							} else {
								this.unexpected(tk1);
							}
							break;
						default:
							if(tk1 == null) {
								this.unexpected(tk1);
							} else if(tk1._hx_index == 10) {
								if(tk1.s == id) {
									return this.collectExprs(exprs);
								} else {
									this.unexpected(tk1);
								}
							} else {
								this.unexpected(tk1);
							}
						}
						break;
					default:
						b.writeByte(c);
						b.writeByte(c21);
						b.writeByte(c3);
					}
					break;
				case 64:
					if(b.b.pos > 0) {
						exprs.push(this.bytesToStringConstant(b));
					}
					b = new haxe_io_BytesOutput();
					let tk2 = this.token();
					if(tk2 == null) {
						exprs.push(miniftl_Expr.EScalar(miniftl_Scalar.CString(this.tokenString(tk2))));
					} else if(tk2._hx_index == 10) {
						let _g = tk2.s;
						let inf = this.parseMacroCallDecl(_g);
						exprs.push(miniftl_Expr.ECallMacro(miniftl_Expr.EIdent(_g),inf.body,inf.args));
					} else {
						exprs.push(miniftl_Expr.EScalar(miniftl_Scalar.CString(this.tokenString(tk2))));
					}
					break;
				default:
					b.writeByte(c);
					b.writeByte(c21);
				}
				break;
			default:
				if(c == 10) {
					this.line++;
				}
				b.writeByte(c);
			}
		}
		if(b.b.pos > 0) {
			exprs.push(this.bytesToStringConstant(b));
		}
		return this.collectExprs(exprs);
	}
	collectExprs(exprs) {
		if(exprs.length == 1) {
			return exprs[0];
		} else {
			return miniftl_Expr.ECollection(exprs);
		}
	}
	bytesToStringConstant(b) {
		return miniftl_Expr.EScalar(miniftl_Scalar.CString(b.getBytes().toString()));
	}
	parseComment() {
		let b = new haxe_io_BytesOutput();
		b.writeByte(this.char);
		let s = this.input;
		let old = this.line;
		try {
			let isComment = true;
			while(isComment) {
				while(this.char != 45) {
					if(this.char == 10) {
						this.line++;
					}
					this.char = s.readByte();
					if(this.char != 45) {
						b.writeByte(this.char);
					}
				}
				this.char = s.readByte();
				while(this.char == 45) {
					this.char = s.readByte();
					if(this.char == 62) {
						isComment = false;
						break;
					}
				}
			}
		} catch( _g ) {
			this.line = old;
			throw haxe_Exception.thrown(miniftl_Error.EUnterminatedComment);
		}
		let t = this.token();
		if(t != miniftl_Token.TBaClose) {
			this.unexpected(t);
		}
		return miniftl_Expr.EComment(b.getBytes().toString());
	}
	unexpected(tk) {
		throw haxe_Exception.thrown(miniftl_Error.EUnexpected(this.tokenString(tk)));
	}
	maybe(tk) {
		let t = this.token();
		if(Type.enumEq(t,tk)) {
			return true;
		}
		let _this = this.tokens;
		_this.head = new haxe_ds_GenericCell(t,_this.head);
		return false;
	}
	getIdent() {
		let tk = this.token();
		if(tk == null) {
			this.unexpected(tk);
			return null;
		} else if(tk._hx_index == 10) {
			return tk.s;
		} else {
			this.unexpected(tk);
			return null;
		}
	}
	isBlock(e) {
		switch(e._hx_index) {
		case 2:
			let _g = e.t;
			let _g1 = e.e;
			if(_g1 != null) {
				return this.isBlock(_g1);
			} else if(_g != null) {
				if(_g == null) {
					return false;
				} else if(_g._hx_index == 0) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
			break;
		case 3:
			return this.isBlock(e.ecatch);
		case 5:
			return this.isBlock(e.e2);
		case 6:
			return true;
		case 20:
			return this.isBlock(e.e);
		case 23:
			let _g2 = e.e2;
			if(_g2 != null) {
				return this.isBlock(_g2);
			} else {
				return this.isBlock(e.e1);
			}
			break;
		case 26:
			return this.isBlock(e.e);
		case 31:
			let _g3 = e.e;
			if(_g3 != null) {
				return this.isBlock(_g3);
			} else {
				return false;
			}
			break;
		case 38:
			if(!e.prefix) {
				return this.isBlock(e.e);
			} else {
				return false;
			}
			break;
		default:
			return false;
		}
	}
	parseExpr() {
		let tk = this.token();
		if(tk == null) {
			return this.unexpected(tk);
		} else {
			switch(tk._hx_index) {
			case 0:
				let _this = this.tokens;
				_this.head = new haxe_ds_GenericCell(tk,_this.head);
				return null;
			case 1:
				return null;
			case 2:case 4:
				let closeT = tk == miniftl_Token.TBkOpen ? miniftl_Token.TBkClose : miniftl_Token.TBrClose;
				let a = [];
				tk = this.token();
				while(tk != closeT) {
					let _this = this.tokens;
					_this.head = new haxe_ds_GenericCell(tk,_this.head);
					a.push(this.parseExpr());
					tk = this.token();
					if(tk == miniftl_Token.TComma) {
						tk = this.token();
					}
				}
				if(a.length == 1) {
					if(a[0]._hx_index == 26) {
						let tmp = "__a_" + this.uid++;
						return this.parseExprNext(miniftl_Expr.EBlock([miniftl_Expr.EAssign(tmp,null,miniftl_Expr.EArrayDecl([])),this.mapCompr(tmp,a[0]),miniftl_Expr.EIdent(tmp)]));
					}
				}
				return this.parseExprNext(miniftl_Expr.EArrayDecl(a));
			case 6:
				let _g = tk.c;
				if(_g._hx_index == 1) {
					let _g1 = _g.s;
					if(_g1.indexOf("${") != -1) {
						return this.parseExprNext(new miniftl_Parser().parseStringInterpolation(_g1,_g1));
					} else {
						return this.parseExprNext(miniftl_Expr.EScalar(_g));
					}
				} else {
					return this.parseExprNext(miniftl_Expr.EScalar(_g));
				}
				break;
			case 8:
				let tk1 = this.token();
				if(tk1 == null) {
					this.unexpected(tk1);
				} else if(tk1._hx_index == 10) {
					return this.parseExprNext(this.parseSpecialVariable(tk1.s));
				} else {
					this.unexpected(tk1);
				}
				return null;
			case 10:
				return this.parseExprNext(miniftl_Expr.EIdent(tk.s));
			case 12:
				let _g1 = tk.s;
				if(Object.prototype.hasOwnProperty.call(this.unops.h,_g1)) {
					let e = this.parseExpr();
					if(_g1 == "-") {
						if(e._hx_index == 32) {
							let _g = e.s;
							if(_g._hx_index == 0) {
								return miniftl_Expr.EScalar(miniftl_Scalar.CNumber(-_g.f));
							}
						}
					}
					return this.makeUnop(_g1,e);
				}
				return this.unexpected(tk);
			case 14:
				let e = this.parseExpr();
				tk = this.token();
				if(tk != null) {
					switch(tk._hx_index) {
					case 5:
						if(e._hx_index == 22) {
							return this.parseLambda([{ name : e.v}],0);
						}
						break;
					case 13:
						return this.parseExprNext(miniftl_Expr.EParent(e));
					default:
					}
				}
				return this.unexpected(tk);
			default:
				return this.unexpected(tk);
			}
		}
	}
	parseInterpolation() {
		let tk = this.token();
		if(tk == null) {
			throw haxe_Exception.thrown(miniftl_Error.EUnterminatedBracket("Unclosed '}'"));
		} else {
			switch(tk._hx_index) {
			case 2:
				let a = [];
				tk = this.token();
				while(tk != miniftl_Token.TBkClose) {
					let _this = this.tokens;
					_this.head = new haxe_ds_GenericCell(tk,_this.head);
					a.push(this.parseInterpolation());
					tk = this.token();
					if(tk == miniftl_Token.TComma) {
						tk = this.token();
					}
				}
				if(a.length == 1) {
					if(a[0]._hx_index == 26) {
						let tmp = "__a_" + this.uid++;
						return this.parseInterpolationNext(miniftl_Expr.EBlock([miniftl_Expr.EAssign(tmp,null,miniftl_Expr.EArrayDecl([])),this.mapCompr(tmp,a[0]),miniftl_Expr.EIdent(tmp)]));
					}
				}
				return this.parseInterpolationNext(miniftl_Expr.EArrayDecl(a));
			case 3:
				let _this = this.tokens;
				_this.head = new haxe_ds_GenericCell(tk,_this.head);
				return null;
			case 6:
				return this.parseInterpolationNext(miniftl_Expr.EScalar(tk.c));
			case 8:
				let tk1 = this.token();
				if(tk1 == null) {
					this.unexpected(tk1);
				} else if(tk1._hx_index == 10) {
					return this.parseInterpolationNext(this.parseSpecialVariable(tk1.s));
				} else {
					this.unexpected(tk1);
				}
				return null;
			case 10:
				return this.parseInterpolationNext(miniftl_Expr.EIdent(tk.s));
			case 12:
				let _g = tk.s;
				if(Object.prototype.hasOwnProperty.call(this.unops.h,_g)) {
					let e = this.parseInterpolation();
					if(_g == "-") {
						if(e._hx_index == 32) {
							let _g = e.s;
							if(_g._hx_index == 0) {
								return miniftl_Expr.EScalar(miniftl_Scalar.CNumber(-_g.f));
							}
						}
					}
					return this.makeUnop(_g,e);
				}
				return this.unexpected(tk);
			case 14:
				let e = this.parseInterpolation();
				tk = this.token();
				if(tk == null) {
					return this.unexpected(tk);
				} else if(tk._hx_index == 13) {
					return this.parseInterpolationNext(miniftl_Expr.EParent(e));
				} else {
					return this.unexpected(tk);
				}
				break;
			default:
				throw haxe_Exception.thrown(miniftl_Error.EUnterminatedBracket("Unclosed '}'"));
			}
		}
	}
	parseLambda(args,pmin) {
		_hx_loop1: while(true) {
			args.push({ name : this.getIdent(), t : null});
			let tk = this.token();
			if(tk == null) {
				this.unexpected(tk);
			} else {
				switch(tk._hx_index) {
				case 5:
					break;
				case 13:
					break _hx_loop1;
				default:
					this.unexpected(tk);
				}
			}
		}
		let t = this.token();
		if(!Type.enumEq(t,miniftl_Token.TOp("->"))) {
			this.unexpected(t);
		}
		return miniftl_Expr.EFunction(args,miniftl_Expr.EReturn(this.parseExpr()));
	}
	mapCompr(tmp,e) {
		let edef;
		switch(e._hx_index) {
		case 6:
			let _g = e.el;
			edef = _g.length == 1 ? miniftl_Expr.EBlock([this.mapCompr(tmp,_g[0])]) : miniftl_Expr.ECall(miniftl_Expr.EField(miniftl_Expr.EIdent(tmp),"push"),[e]);
			break;
		case 23:
			edef = e.e2 == null ? miniftl_Expr.EIf(e.cond,this.mapCompr(tmp,e.e1),null) : miniftl_Expr.ECall(miniftl_Expr.EField(miniftl_Expr.EIdent(tmp),"push"),[e]);
			break;
		case 26:
			edef = miniftl_Expr.EList(e.v1,e.v2,e.it,this.mapCompr(tmp,e.e));
			break;
		case 30:
			edef = miniftl_Expr.EParent(this.mapCompr(tmp,e.e));
			break;
		default:
			edef = miniftl_Expr.ECall(miniftl_Expr.EField(miniftl_Expr.EIdent(tmp),"push"),[e]);
		}
		return edef;
	}
	makeUnop(op,e) {
		if(e._hx_index == 5) {
			let _g = e.op;
			let _g1 = e.e1;
			let _g2 = e.e2;
			switch(op) {
			case "!":case "?":
				return miniftl_Expr.EUnop(op,true,e);
			case "-":
				return miniftl_Expr.EBinop(_g,this.makeUnop(op,_g1),_g2);
			default:
				return miniftl_Expr.EBinop(_g,this.makeUnop(op,_g1),_g2);
			}
		} else {
			return miniftl_Expr.EUnop(op,true,e);
		}
	}
	makeBinop(op,e1,e) {
		if(e == null) {
			return miniftl_Expr.EBinop(op,e1,e);
		}
		if(e._hx_index == 5) {
			let _g = e.op;
			if(this.opPriority.h[op] <= this.opPriority.h[_g] && !Object.prototype.hasOwnProperty.call(this.opRightAssoc.h,op)) {
				return miniftl_Expr.EBinop(_g,this.makeBinop(op,e1,e.e1),e.e2);
			} else {
				return miniftl_Expr.EBinop(op,e1,e);
			}
		} else {
			return miniftl_Expr.EBinop(op,e1,e);
		}
	}
	parseSpecialVariable(v) {
		return miniftl_Expr.ESpecialIdent(v);
	}
	parseStructure(id) {
		switch(id) {
		case "assign":
			let exprs = this.parseAssigns(miniftl_VarType.Assign);
			this.maybe(miniftl_Token.TOp("/"));
			let t = this.token();
			if(t != miniftl_Token.TBaClose) {
				this.unexpected(t);
			}
			if(exprs.length == 1) {
				return exprs[0];
			} else {
				return miniftl_Expr.ECollection(exprs);
			}
			break;
		case "attempt":
			this.maybe(miniftl_Token.TOp("/"));
			let t1 = this.token();
			if(t1 != miniftl_Token.TBaClose) {
				this.unexpected(t1);
			}
			return miniftl_Expr.EAttempt(this.parseBlock(id),"vname",null,this.parseBlock(id));
		case "autoesc":
			this.maybe(miniftl_Token.TOp("/"));
			let t2 = this.token();
			if(t2 != miniftl_Token.TBaClose) {
				this.unexpected(t2);
			}
			return miniftl_Expr.EAutoesc(this.parseBlock(id));
		case "break":
			this.maybe(miniftl_Token.TOp("/"));
			let t3 = this.token();
			if(t3 != miniftl_Token.TBaClose) {
				this.unexpected(t3);
			}
			return miniftl_Expr.EBreak;
		case "case":
			let condition = this.parseExpr();
			this.maybe(miniftl_Token.TOp("/"));
			let t4 = this.token();
			if(t4 != miniftl_Token.TBaClose) {
				this.unexpected(t4);
			}
			let cases = [];
			let switchType = miniftl_SwitchType.Case;
			_hx_loop1: while(true) {
				let block = this.parseBlock(id);
				switch(switchType._hx_index) {
				case 0:
					cases.push(miniftl_Expr.ECase(condition,block));
					break;
				case 1:
					cases.push(miniftl_Expr.EDefault(block));
					break;
				}
				let tk = this.token();
				if(tk == null) {
					this.unexpected(tk);
					break;
				} else if(tk._hx_index == 10) {
					switch(tk.s) {
					case "case":
						condition = this.parseExpr();
						this.maybe(miniftl_Token.TOp("/"));
						let t = this.token();
						if(t != miniftl_Token.TBaClose) {
							this.unexpected(t);
						}
						break;
					case "default":
						switchType = miniftl_SwitchType.Default;
						break;
					case "switch":
						break _hx_loop1;
					default:
						this.unexpected(tk);
						break _hx_loop1;
					}
				} else {
					this.unexpected(tk);
					break;
				}
			}
			return miniftl_Expr.ECollection(cases);
		case "compress":
			this.maybe(miniftl_Token.TOp("/"));
			let t5 = this.token();
			if(t5 != miniftl_Token.TBaClose) {
				this.unexpected(t5);
			}
			return miniftl_Expr.ECompress(this.parseBlock(id));
		case "continue":
			this.maybe(miniftl_Token.TOp("/"));
			let t6 = this.token();
			if(t6 != miniftl_Token.TBaClose) {
				this.unexpected(t6);
			}
			return miniftl_Expr.EContinue;
		case "default":
			this.maybe(miniftl_Token.TOp("/"));
			let t7 = this.token();
			if(t7 != miniftl_Token.TBaClose) {
				this.unexpected(t7);
			}
			let block = this.parseBlock(id);
			let t8 = this.token();
			if(!Type.enumEq(t8,miniftl_Token.TId("switch"))) {
				this.unexpected(t8);
			}
			return miniftl_Expr.EDefault(block);
		case "function":
			let tk = this.token();
			let name = null;
			if(tk == null) {
				this.unexpected(tk);
			} else if(tk._hx_index == 10) {
				name = tk.s;
			} else {
				this.unexpected(tk);
			}
			let inf = this.parseFunctionDecl();
			return miniftl_Expr.EFunction(inf.args,inf.body,name,inf.ret);
		case "elseif":case "if":
			let cond = this.correctEqualsOp(this.parseExpr());
			this.maybe(miniftl_Token.TOp("/"));
			let t9 = this.token();
			if(t9 != miniftl_Token.TBaClose) {
				this.unexpected(t9);
			}
			let e1 = this.parseBlock(id);
			let e2 = null;
			let tk1 = this.token();
			if(tk1 == null) {
				this.unexpected(tk1);
			} else if(tk1._hx_index == 10) {
				switch(tk1.s) {
				case "else":
					e2 = this.parseBlock("else");
					break;
				case "elseif":
					e2 = this.parseStructure(id);
					break;
				case "if":
					break;
				default:
					this.unexpected(tk1);
				}
			} else {
				this.unexpected(tk1);
			}
			return miniftl_Expr.EIf(cond,e1,e2);
		case "import":
			let path = this.parseExpr();
			let t10 = this.token();
			if(!Type.enumEq(t10,miniftl_Token.TId("as"))) {
				this.unexpected(t10);
			}
			let vname = this.getIdent();
			this.maybe(miniftl_Token.TOp("/"));
			let t11 = this.token();
			if(t11 != miniftl_Token.TBaClose) {
				this.unexpected(t11);
			}
			return miniftl_Expr.EImport(path,vname);
		case "include":
			let path1 = this.parseExpr();
			this.maybe(miniftl_Token.TOp("/"));
			let t12 = this.token();
			if(t12 != miniftl_Token.TBaClose) {
				this.unexpected(t12);
			}
			return miniftl_Expr.EInclude(path1);
		case "list":
			let iter = this.parseExpr();
			let t13 = this.token();
			if(!Type.enumEq(t13,miniftl_Token.TId("as"))) {
				this.unexpected(t13);
			}
			let vname1 = this.getIdent();
			let vname2 = null;
			if(this.maybe(miniftl_Token.TComma)) {
				vname2 = this.getIdent();
			}
			this.maybe(miniftl_Token.TOp("/"));
			let t14 = this.token();
			if(t14 != miniftl_Token.TBaClose) {
				this.unexpected(t14);
			}
			return miniftl_Expr.EList(vname1,vname2,iter,this.parseBlock(id));
		case "local":
			let exprs1 = this.parseAssigns(miniftl_VarType.Local);
			this.maybe(miniftl_Token.TOp("/"));
			let t15 = this.token();
			if(t15 != miniftl_Token.TBaClose) {
				this.unexpected(t15);
			}
			if(exprs1.length == 1) {
				return exprs1[0];
			} else {
				return miniftl_Expr.ECollection(exprs1);
			}
			break;
		case "macro":
			let tk2 = this.token();
			let name1 = null;
			if(tk2 == null) {
				let _this = this.tokens;
				_this.head = new haxe_ds_GenericCell(tk2,_this.head);
			} else if(tk2._hx_index == 10) {
				name1 = tk2.s;
			} else {
				let _this = this.tokens;
				_this.head = new haxe_ds_GenericCell(tk2,_this.head);
			}
			let inf1 = this.parseMacroDecl();
			return miniftl_Expr.EMacro(inf1.args,inf1.body,name1,inf1.ret);
		case "nested":
			this.maybe(miniftl_Token.TOp("/"));
			let t16 = this.token();
			if(t16 != miniftl_Token.TBaClose) {
				this.unexpected(t16);
			}
			return miniftl_Expr.ENested;
		case "return":
			let tk3 = this.token();
			let _this = this.tokens;
			_this.head = new haxe_ds_GenericCell(tk3,_this.head);
			let e = null;
			if(tk3 == null) {
				e = this.parseExpr();
			} else {
				switch(tk3._hx_index) {
				case 0:
					break;
				case 12:
					if(tk3.s != "/") {
						e = this.parseExpr();
					}
					break;
				default:
					e = this.parseExpr();
				}
			}
			this.maybe(miniftl_Token.TOp("/"));
			let t17 = this.token();
			if(t17 != miniftl_Token.TBaClose) {
				this.unexpected(t17);
			}
			return miniftl_Expr.EReturn(e);
		case "stop":
			let tkReason = this.token();
			if(tkReason == null) {
				throw haxe_Exception.thrown(miniftl_Error.EUnexpected(this.tokenString(tkReason)));
			} else {
				switch(tkReason._hx_index) {
				case 0:
					return miniftl_Expr.EStop(null);
				case 6:
					return miniftl_Expr.EStop(new miniftl_Parser().parseTemplate(this.tokenString(tkReason)));
				case 12:
					if(tkReason.s == "/") {
						this.maybe(miniftl_Token.TOp("/"));
						let t = this.token();
						if(t != miniftl_Token.TBaClose) {
							this.unexpected(t);
						}
						return miniftl_Expr.EStop(null);
					} else {
						throw haxe_Exception.thrown(miniftl_Error.EUnexpected(this.tokenString(tkReason)));
					}
					break;
				default:
					throw haxe_Exception.thrown(miniftl_Error.EUnexpected(this.tokenString(tkReason)));
				}
			}
			break;
		case "switch":
			let e3 = this.parseExpr();
			this.maybe(miniftl_Token.TOp("/"));
			let t18 = this.token();
			if(t18 != miniftl_Token.TBaClose) {
				this.unexpected(t18);
			}
			let cases1 = [];
			let def = null;
			let caseCollection = this.parseBlock(id);
			switch(caseCollection._hx_index) {
			case 10:
				cases1.push({ values : [caseCollection.e1], expr : caseCollection.e2});
				break;
			case 11:
				let _g = caseCollection.el;
				let _g1 = 0;
				while(_g1 < _g.length) {
					let ecase = _g[_g1];
					++_g1;
					switch(ecase._hx_index) {
					case 10:
						cases1.push({ values : [ecase.e1], expr : ecase.e2});
						break;
					case 16:
						def = ecase.e;
						break;
					default:
						throw haxe_Exception.thrown(miniftl_Error.ECustom("Unexpected expression in switch: " + Std.string(ecase)));
					}
				}
				break;
			case 16:
				def = caseCollection.e;
				break;
			default:
				throw haxe_Exception.thrown(miniftl_Error.ECustom("Unexpected expression in switch: " + Std.string(caseCollection)));
			}
			return miniftl_Expr.ESwitch(e3,cases1,def);
		case "throw":
			let e4 = this.parseExpr();
			this.maybe(miniftl_Token.TOp("/"));
			let t19 = this.token();
			if(t19 != miniftl_Token.TBaClose) {
				this.unexpected(t19);
			}
			return miniftl_Expr.EThrow(e4);
		default:
			throw haxe_Exception.thrown(miniftl_Error.ECustom("Unknown directive: #" + id));
		}
	}
	correctEqualsOp(cond) {
		switch(cond._hx_index) {
		case 5:
			let _g = cond.op;
			let _g1 = cond.e1;
			let _g2 = cond.e2;
			if(_g == "=") {
				haxe_Log.trace("Warning: found \"=\" instead of \"==\" in condition: file " + this.origin + " line " + this.line,{ fileName : "miniftl/Parser.hx", lineNumber : 986, className : "miniftl.Parser", methodName : "correctEqualsOp"});
				return miniftl_Expr.EBinop("==",this.correctEqualsOp(_g1),this.correctEqualsOp(_g2));
			} else {
				return miniftl_Expr.EBinop(_g,this.correctEqualsOp(_g1),this.correctEqualsOp(_g2));
			}
			break;
		case 30:
			return this.correctEqualsOp(cond.e);
		default:
			return cond;
		}
	}
	parseExprNext(e1) {
		let tk = this.token();
		if(tk == null) {
			let _this = this.tokens;
			_this.head = new haxe_ds_GenericCell(tk,_this.head);
			return e1;
		} else {
			switch(tk._hx_index) {
			case 2:
				let e2 = this.parseExpr();
				let t = this.token();
				if(t != miniftl_Token.TBkClose) {
					this.unexpected(t);
				}
				return this.parseExprNext(miniftl_Expr.EArray(e1,e2));
			case 6:
				throw haxe_Exception.thrown(miniftl_Error.EUnexpected(this.tokenString(tk)));
			case 8:
				return this.parseExprNext(miniftl_Expr.EArray(e1,miniftl_Expr.EScalar(miniftl_Scalar.CString(this.getIdent()))));
			case 10:
				switch(tk.s) {
				case "&gt;":case "gt":
					return this.makeBinop(">",e1,this.parseExpr());
				case "&lt;":case "lt":
					return this.makeBinop("<",e1,this.parseExpr());
				case "&gte;":case "gte":
					return this.makeBinop(">=",e1,this.parseExpr());
				case "&lte;":case "lte":
					return this.makeBinop("<=",e1,this.parseExpr());
				default:
					let _this = this.tokens;
					_this.head = new haxe_ds_GenericCell(tk,_this.head);
					return e1;
				}
				break;
			case 12:
				let _g = tk.s;
				if(_g == "->") {
					switch(e1._hx_index) {
					case 22:
						let tmp = miniftl_Expr.EReturn(this.parseExpr());
						return miniftl_Expr.EFunction([{ name : e1.v}],tmp);
					case 30:
						let _g = e1.e;
						if(_g._hx_index == 22) {
							let tmp = miniftl_Expr.EReturn(this.parseExpr());
							return miniftl_Expr.EFunction([{ name : _g.v}],tmp);
						}
						break;
					default:
					}
					this.unexpected(tk);
				}
				if(this.unops.h[_g] && _g != "!") {
					if(_g != "??") {
						if(this.isBlock(e1) || e1._hx_index == 30) {
							let _this = this.tokens;
							_this.head = new haxe_ds_GenericCell(tk,_this.head);
							return e1;
						}
					}
					return this.parseExprNext(miniftl_Expr.EUnop(_g,false,e1));
				}
				if(_g == "/") {
					tk = this.token();
					if(tk == null) {
						let _this = this.tokens;
						_this.head = new haxe_ds_GenericCell(tk,_this.head);
					} else if(tk._hx_index == 0) {
						let _this = this.tokens;
						_this.head = new haxe_ds_GenericCell(miniftl_Token.TBaClose,_this.head);
						let _this1 = this.tokens;
						_this1.head = new haxe_ds_GenericCell(miniftl_Token.TOp("/"),_this1.head);
						return e1;
					} else {
						let _this = this.tokens;
						_this.head = new haxe_ds_GenericCell(tk,_this.head);
					}
				}
				return this.makeBinop(_g,e1,this.parseExpr());
			case 14:
				return this.parseExprNext(miniftl_Expr.ECall(e1,this.parseExprList(miniftl_Token.TPClose)));
			default:
				let _this1 = this.tokens;
				_this1.head = new haxe_ds_GenericCell(tk,_this1.head);
				return e1;
			}
		}
	}
	parseInterpolationNext(e1) {
		let tk = this.token();
		if(tk == null) {
			let _this = this.tokens;
			_this.head = new haxe_ds_GenericCell(tk,_this.head);
			return e1;
		} else {
			switch(tk._hx_index) {
			case 2:
				let e2 = this.parseInterpolation();
				let t = this.token();
				if(t != miniftl_Token.TBkClose) {
					this.unexpected(t);
				}
				return this.parseInterpolationNext(miniftl_Expr.EArray(e1,e2));
			case 6:
				throw haxe_Exception.thrown(miniftl_Error.EUnexpected(this.tokenString(tk)));
			case 8:
				return this.parseInterpolationNext(miniftl_Expr.EArray(e1,miniftl_Expr.EScalar(miniftl_Scalar.CString(this.getIdent()))));
			case 9:
				throw haxe_Exception.thrown(miniftl_Error.EUnterminatedBracket("Unclosed '}'"));
			case 10:
				throw haxe_Exception.thrown(miniftl_Error.EUnexpected(this.tokenString(tk)));
			case 12:
				let _g = tk.s;
				if(this.unops.h[_g] && _g != "!") {
					if(this.isBlock(e1) || e1._hx_index == 30) {
						let _this = this.tokens;
						_this.head = new haxe_ds_GenericCell(tk,_this.head);
						return e1;
					}
					return this.parseInterpolationNext(miniftl_Expr.EUnop(_g,false,e1));
				}
				return this.makeBinop(_g,e1,this.parseInterpolation());
			case 14:
				return this.parseInterpolationNext(miniftl_Expr.ECall(e1,this.parseExprList(miniftl_Token.TPClose)));
			default:
				let _this = this.tokens;
				_this.head = new haxe_ds_GenericCell(tk,_this.head);
				return e1;
			}
		}
	}
	parseAssigns(type) {
		let ident = this.getIdent();
		let tk = this.token();
		if(tk == miniftl_Token.TBaClose) {
			switch(type._hx_index) {
			case 0:
				let e = this.parseBlock("assign");
				let _this = this.tokens;
				_this.head = new haxe_ds_GenericCell(miniftl_Token.TBaClose,_this.head);
				return [miniftl_Expr.EAssign(ident,null,e)];
			case 1:
				let e1 = this.parseBlock("local");
				let _this1 = this.tokens;
				_this1.head = new haxe_ds_GenericCell(miniftl_Token.TBaClose,_this1.head);
				return [miniftl_Expr.ELocal(ident,null,e1)];
			}
		}
		let args = [];
		while(true) {
			let e = null;
			if(tk == null) {
				this.unexpected(tk);
			} else if(tk._hx_index == 12) {
				let _g = tk.s;
				if(_g == "=") {
					e = this.parseExpr();
				} else if(Object.prototype.hasOwnProperty.call(this.opRightAssoc.h,_g)) {
					e = miniftl_Expr.EBinop(_g,miniftl_Expr.EIdent(ident),this.parseExpr());
				} else if(Object.prototype.hasOwnProperty.call(this.unops.h,_g)) {
					e = this.makeUnop(_g,miniftl_Expr.EIdent(ident));
				} else {
					this.unexpected(tk);
				}
			} else {
				this.unexpected(tk);
			}
			let expr;
			switch(type._hx_index) {
			case 0:
				expr = miniftl_Expr.EAssign(ident,null,e);
				break;
			case 1:
				expr = miniftl_Expr.ELocal(ident,null,e);
				break;
			}
			args.push(expr);
			if(this.maybe(miniftl_Token.TOp("/"))) {
				let _this = this.tokens;
				_this.head = new haxe_ds_GenericCell(miniftl_Token.TOp("/"),_this.head);
				return args;
			}
			if(this.maybe(miniftl_Token.TBaClose)) {
				let _this = this.tokens;
				_this.head = new haxe_ds_GenericCell(miniftl_Token.TBaClose,_this.head);
				return args;
			}
			ident = this.getIdent();
			tk = this.token();
		}
	}
	parseFunctionArgs() {
		let args = [];
		while(true) {
			let tk = this.token();
			let name = null;
			if(tk == null) {
				this.unexpected(tk);
			} else {
				switch(tk._hx_index) {
				case 0:
					let _this = this.tokens;
					_this.head = new haxe_ds_GenericCell(tk,_this.head);
					return args;
				case 10:
					name = tk.s;
					break;
				case 12:
					if(tk.s == "/") {
						let _this = this.tokens;
						_this.head = new haxe_ds_GenericCell(tk,_this.head);
						return args;
					} else {
						this.unexpected(tk);
					}
					break;
				default:
					this.unexpected(tk);
				}
			}
			let arg = { name : name};
			args.push(arg);
			if(this.maybe(miniftl_Token.TOp("="))) {
				arg.value = this.parseExpr();
			}
			if(this.maybe(miniftl_Token.TOp("..."))) {
				arg.isTrailing = true;
				let t = this.token();
				if(t != miniftl_Token.TBaClose) {
					this.unexpected(t);
				}
				return args;
			}
		}
	}
	parseFunctionDecl() {
		let args = this.parseFunctionArgs();
		this.maybe(miniftl_Token.TOp("/"));
		let t = this.token();
		if(t != miniftl_Token.TBaClose) {
			this.unexpected(t);
		}
		return { args : args, ret : null, body : this.parseBlock("function")};
	}
	parseMacroDecl() {
		let args = this.parseFunctionArgs();
		this.maybe(miniftl_Token.TOp("/"));
		let t = this.token();
		if(t != miniftl_Token.TBaClose) {
			this.unexpected(t);
		}
		return { args : args, ret : null, body : this.parseBlock("macro")};
	}
	parseExprList(etk) {
		let args = [];
		let tk = this.token();
		if(tk == etk) {
			return args;
		}
		let _this = this.tokens;
		_this.head = new haxe_ds_GenericCell(tk,_this.head);
		while(true) {
			args.push(this.parseExpr());
			tk = this.token();
			if(tk == null) {
				if(tk == etk) {
					break;
				}
				this.unexpected(tk);
			} else if(tk._hx_index != 5) {
				if(tk == etk) {
					break;
				}
				this.unexpected(tk);
			}
		}
		return args;
	}
	parseMacroCallDecl(id) {
		let args = [];
		let tk = this.token();
		let _this = this.tokens;
		_this.head = new haxe_ds_GenericCell(tk,_this.head);
		if(tk == null) {
			_hx_loop1: while(true) {
				args.push(this.parseExpr());
				tk = this.token();
				let _this = this.tokens;
				_this.head = new haxe_ds_GenericCell(tk,_this.head);
				if(tk != null) {
					switch(tk._hx_index) {
					case 0:
						break _hx_loop1;
					case 12:
						if(tk.s == "/") {
							break _hx_loop1;
						}
						break;
					default:
					}
				}
			}
		} else {
			switch(tk._hx_index) {
			case 0:
				break;
			case 12:
				if(tk.s != "/") {
					_hx_loop2: while(true) {
						args.push(this.parseExpr());
						tk = this.token();
						let _this = this.tokens;
						_this.head = new haxe_ds_GenericCell(tk,_this.head);
						if(tk != null) {
							switch(tk._hx_index) {
							case 0:
								break _hx_loop2;
							case 12:
								if(tk.s == "/") {
									break _hx_loop2;
								}
								break;
							default:
							}
						}
					}
				}
				break;
			default:
				_hx_loop3: while(true) {
					args.push(this.parseExpr());
					tk = this.token();
					let _this = this.tokens;
					_this.head = new haxe_ds_GenericCell(tk,_this.head);
					if(tk != null) {
						switch(tk._hx_index) {
						case 0:
							break _hx_loop3;
						case 12:
							if(tk.s == "/") {
								break _hx_loop3;
							}
							break;
						default:
						}
					}
				}
			}
		}
		tk = this.token();
		let body;
		if(tk == null) {
			this.unexpected(tk);
			body = null;
		} else {
			switch(tk._hx_index) {
			case 0:
				body = this.parseBlock(id);
				break;
			case 12:
				if(tk.s == "/") {
					this.maybe(miniftl_Token.TOp("/"));
					let t = this.token();
					if(t != miniftl_Token.TBaClose) {
						this.unexpected(t);
					}
					body = null;
				} else {
					this.unexpected(tk);
					body = null;
				}
				break;
			default:
				this.unexpected(tk);
				body = null;
			}
		}
		return { args : args, body : body};
	}
	readChar() {
		try {
			return this.input.readByte();
		} catch( _g ) {
			return 0;
		}
	}
	readString(until) {
		let c = 0;
		let b = new haxe_io_BytesOutput();
		let esc = false;
		let old = this.line;
		let s = this.input;
		while(true) {
			try {
				c = s.readByte();
			} catch( _g ) {
				this.line = old;
				throw haxe_Exception.thrown(miniftl_Error.EUnterminatedString);
			}
			if(esc) {
				esc = false;
				switch(c) {
				case 34:case 39:case 92:
					b.writeByte(c);
					break;
				case 47:
					if(this.allowJSON) {
						b.writeByte(c);
					} else {
						this.invalidChar(c);
					}
					break;
				case 110:
					b.writeByte(10);
					break;
				case 114:
					b.writeByte(13);
					break;
				case 116:
					b.writeByte(9);
					break;
				case 117:
					if(!this.allowJSON) {
						this.invalidChar(c);
					}
					let code = null;
					try {
						code = s.readString(4);
					} catch( _g ) {
						this.line = old;
						throw haxe_Exception.thrown(miniftl_Error.EUnterminatedString);
					}
					let k = 0;
					k = 0;
					let char = HxOverrides.cca(code,0);
					if(char == null) {
						this.invalidChar(char);
					} else {
						switch(char) {
						case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
							k = char - 48;
							break;
						case 65:case 66:case 67:case 68:case 69:case 70:
							k = char - 55;
							break;
						case 97:case 98:case 99:case 100:case 101:case 102:
							k = char - 87;
							break;
						default:
							this.invalidChar(char);
						}
					}
					k <<= 4;
					let char1 = HxOverrides.cca(code,1);
					if(char1 == null) {
						this.invalidChar(char1);
					} else {
						switch(char1) {
						case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
							k += char1 - 48;
							break;
						case 65:case 66:case 67:case 68:case 69:case 70:
							k += char1 - 55;
							break;
						case 97:case 98:case 99:case 100:case 101:case 102:
							k += char1 - 87;
							break;
						default:
							this.invalidChar(char1);
						}
					}
					k <<= 4;
					let char2 = HxOverrides.cca(code,2);
					if(char2 == null) {
						this.invalidChar(char2);
					} else {
						switch(char2) {
						case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
							k += char2 - 48;
							break;
						case 65:case 66:case 67:case 68:case 69:case 70:
							k += char2 - 55;
							break;
						case 97:case 98:case 99:case 100:case 101:case 102:
							k += char2 - 87;
							break;
						default:
							this.invalidChar(char2);
						}
					}
					k <<= 4;
					let char3 = HxOverrides.cca(code,3);
					if(char3 == null) {
						this.invalidChar(char3);
					} else {
						switch(char3) {
						case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
							k += char3 - 48;
							break;
						case 65:case 66:case 67:case 68:case 69:case 70:
							k += char3 - 55;
							break;
						case 97:case 98:case 99:case 100:case 101:case 102:
							k += char3 - 87;
							break;
						default:
							this.invalidChar(char3);
						}
					}
					if(k <= 127) {
						b.writeByte(k);
					} else if(k <= 2047) {
						b.writeByte(192 | k >> 6);
						b.writeByte(128 | k & 63);
					} else {
						b.writeByte(224 | k >> 12);
						b.writeByte(128 | k >> 6 & 63);
						b.writeByte(128 | k & 63);
					}
					break;
				default:
					this.invalidChar(c);
				}
			} else if(c == 92) {
				esc = true;
			} else if(c == until) {
				break;
			} else {
				if(c == 10) {
					this.line++;
				}
				b.writeByte(c);
			}
		}
		return b.getBytes().toString();
	}
	token() {
		if(this.tokens.head != null) {
			let _this = this.tokens;
			let k = _this.head;
			if(k == null) {
				return null;
			} else {
				_this.head = k.next;
				return k.elt;
			}
		}
		let char;
		if(this.char < 0) {
			char = this.readChar();
		} else {
			char = this.char;
			this.char = -1;
		}
		while(true) {
			switch(char) {
			case 0:
				return miniftl_Token.TEof;
			case 10:
				this.line++;
				break;
			case 9:case 13:case 32:
				break;
			case 35:
				char = this.readChar();
				if(this.idents[char]) {
					let id = String.fromCodePoint(char);
					while(true) {
						char = this.readChar();
						if(!this.idents[char]) {
							this.char = char;
							return miniftl_Token.TDirective(id);
						}
						id += String.fromCodePoint(char);
					}
				}
				this.invalidChar(char);
				break;
			case 34:case 39:
				return miniftl_Token.TConst(miniftl_Scalar.CString(this.readString(char)));
			case 40:
				this.pLevel++;
				return miniftl_Token.TPOpen;
			case 41:
				this.pLevel--;
				return miniftl_Token.TPClose;
			case 44:
				return miniftl_Token.TComma;
			case 46:
				char = this.readChar();
				switch(char) {
				case 46:
					char = this.readChar();
					switch(char) {
					case 33:
						return miniftl_Token.TOp("..!");
					case 42:
						return miniftl_Token.TOp("..*");
					case 46:
						return miniftl_Token.TOp("...");
					case 60:
						return miniftl_Token.TOp("..<");
					default:
						this.char = char;
						return miniftl_Token.TOp("..");
					}
					break;
				case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
					let n = char - 48;
					let exp = 1;
					while(true) {
						char = this.readChar();
						exp *= 10;
						switch(char) {
						case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
							n = n * 10 + (char - 48);
							break;
						default:
							this.char = char;
							return miniftl_Token.TConst(miniftl_Scalar.CNumber(n / exp));
						}
					}
					break;
				default:
					this.char = char;
					return miniftl_Token.TDot;
				}
				break;
			case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
				let n1 = (char - 48) * 1.0;
				let exp1 = 0.;
				while(true) {
					char = this.readChar();
					exp1 *= 10;
					switch(char) {
					case 46:
						if(exp1 > 0) {
							if(exp1 == 10) {
								char = this.readChar();
								switch(char) {
								case 33:
									let _this = this.tokens;
									_this.head = new haxe_ds_GenericCell(miniftl_Token.TOp("..!"),_this.head);
									break;
								case 42:
									let _this1 = this.tokens;
									_this1.head = new haxe_ds_GenericCell(miniftl_Token.TOp("..*"),_this1.head);
									break;
								case 46:
									let _this2 = this.tokens;
									_this2.head = new haxe_ds_GenericCell(miniftl_Token.TOp("..."),_this2.head);
									break;
								case 60:
									let _this3 = this.tokens;
									_this3.head = new haxe_ds_GenericCell(miniftl_Token.TOp("..<"),_this3.head);
									break;
								default:
									this.char = char;
									let _this4 = this.tokens;
									_this4.head = new haxe_ds_GenericCell(miniftl_Token.TOp(".."),_this4.head);
								}
								return miniftl_Token.TConst(miniftl_Scalar.CNumber(n1));
							}
							this.invalidChar(char);
						}
						exp1 = 1.;
						break;
					case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
						n1 = n1 * 10 + (char - 48);
						break;
					case 69:case 101:
						let tk = this.token();
						let pow = null;
						if(tk == null) {
							let _this = this.tokens;
							_this.head = new haxe_ds_GenericCell(tk,_this.head);
						} else {
							switch(tk._hx_index) {
							case 6:
								let _g = tk.c;
								if(_g._hx_index == 0) {
									pow = _g.f;
								} else {
									let _this = this.tokens;
									_this.head = new haxe_ds_GenericCell(tk,_this.head);
								}
								break;
							case 12:
								if(tk.s == "-") {
									tk = this.token();
									if(tk == null) {
										let _this = this.tokens;
										_this.head = new haxe_ds_GenericCell(tk,_this.head);
									} else if(tk._hx_index == 6) {
										let _g = tk.c;
										if(_g._hx_index == 0) {
											pow = -_g.f;
										} else {
											let _this = this.tokens;
											_this.head = new haxe_ds_GenericCell(tk,_this.head);
										}
									} else {
										let _this = this.tokens;
										_this.head = new haxe_ds_GenericCell(tk,_this.head);
									}
								} else {
									let _this = this.tokens;
									_this.head = new haxe_ds_GenericCell(tk,_this.head);
								}
								break;
							default:
								let _this = this.tokens;
								_this.head = new haxe_ds_GenericCell(tk,_this.head);
							}
						}
						if(pow == null) {
							this.invalidChar(char);
						}
						return miniftl_Token.TConst(miniftl_Scalar.CNumber(Math.pow(10,pow) / exp1 * n1 * 10));
					case 120:
						if(n1 > 0 || exp1 > 0) {
							this.invalidChar(char);
						}
						let n = 0;
						while(true) {
							char = this.readChar();
							switch(char) {
							case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
								n = (n << 4) + char - 48;
								break;
							case 65:case 66:case 67:case 68:case 69:case 70:
								n = (n << 4) + (char - 55);
								break;
							case 97:case 98:case 99:case 100:case 101:case 102:
								n = (n << 4) + (char - 87);
								break;
							default:
								this.char = char;
								return miniftl_Token.TConst(miniftl_Scalar.CNumber(n));
							}
						}
						break;
					default:
						this.char = char;
						return miniftl_Token.TConst(exp1 > 0 ? miniftl_Scalar.CNumber(n1 * 10 / exp1) : miniftl_Scalar.CNumber(n1));
					}
				}
				break;
			case 58:
				return miniftl_Token.TOp(":");
			case 59:
				return miniftl_Token.TSemicolon;
			case 61:
				char = this.readChar();
				if(char == 61) {
					return miniftl_Token.TOp("==");
				} else if(char == 62) {
					return miniftl_Token.TOp("=>");
				}
				this.char = char;
				return miniftl_Token.TOp("=");
			case 62:
				if(this.pLevel == 0) {
					return miniftl_Token.TBaClose;
				} else {
					let ops = this.pLevel == 0 ? this.ops : this.opsWithTBAClose;
					if(ops[char]) {
						let op = String.fromCodePoint(char);
						let prev = -1;
						while(true) {
							char = this.readChar();
							if(!ops[char] || prev == 61) {
								if(HxOverrides.cca(op,0) == 60 && char == 35) {
									return this.tokenComment();
								}
								if(HxOverrides.cca(op,0) == 38) {
									if(this.specialCompares[char]) {
										let id = op + String.fromCodePoint(char);
										while(true) {
											char = this.readChar();
											if(!this.specialCompares[char]) {
												this.char = char;
												return miniftl_Token.TId(id);
											}
											id += String.fromCodePoint(char);
										}
									}
								}
								this.char = char;
								return miniftl_Token.TOp(op);
							}
							prev = char;
							op += String.fromCodePoint(char);
						}
					}
					if(this.idents[char]) {
						let id = String.fromCodePoint(char);
						while(true) {
							char = this.readChar();
							if(!this.idents[char]) {
								this.char = char;
								return miniftl_Token.TId(id);
							}
							id += String.fromCodePoint(char);
						}
					}
					this.invalidChar(char);
				}
				break;
			case 64:
				char = this.readChar();
				if(this.idents[char] || char == 58) {
					let id = String.fromCodePoint(char);
					while(true) {
						char = this.readChar();
						if(!this.idents[char]) {
							this.char = char;
							return miniftl_Token.TMeta(id);
						}
						id += String.fromCodePoint(char);
					}
				}
				this.invalidChar(char);
				break;
			case 91:
				return miniftl_Token.TBkOpen;
			case 93:
				return miniftl_Token.TBkClose;
			case 123:
				return miniftl_Token.TBrOpen;
			case 125:
				return miniftl_Token.TBrClose;
			default:
				let ops = this.pLevel == 0 ? this.ops : this.opsWithTBAClose;
				if(ops[char]) {
					let op = String.fromCodePoint(char);
					let prev = -1;
					while(true) {
						char = this.readChar();
						if(!ops[char] || prev == 61) {
							if(HxOverrides.cca(op,0) == 60 && char == 35) {
								return this.tokenComment();
							}
							if(HxOverrides.cca(op,0) == 38) {
								if(this.specialCompares[char]) {
									let id = op + String.fromCodePoint(char);
									while(true) {
										char = this.readChar();
										if(!this.specialCompares[char]) {
											this.char = char;
											return miniftl_Token.TId(id);
										}
										id += String.fromCodePoint(char);
									}
								}
							}
							this.char = char;
							return miniftl_Token.TOp(op);
						}
						prev = char;
						op += String.fromCodePoint(char);
					}
				}
				if(this.idents[char]) {
					let id = String.fromCodePoint(char);
					while(true) {
						char = this.readChar();
						if(!this.idents[char]) {
							this.char = char;
							return miniftl_Token.TId(id);
						}
						id += String.fromCodePoint(char);
					}
				}
				this.invalidChar(char);
			}
			char = this.readChar();
		}
	}
	tokenComment() {
		let s = this.input;
		let old = this.line;
		let c3 = this.readChar();
		let c4 = this.readChar();
		if(c3 != 45 || c4 != 45) {
			let unexpected = "<#";
			if(c3 != 32) {
				unexpected += String.fromCodePoint(c3);
				if(c4 != 32) {
					unexpected += String.fromCodePoint(c4);
				}
			}
			throw haxe_Exception.thrown(miniftl_Error.EUnexpected(unexpected));
		}
		try {
			while(true) {
				while(this.char != 45) {
					if(this.char == 10) {
						this.line++;
					}
					this.char = s.readByte();
				}
				this.char = s.readByte();
				this.char = s.readByte();
				if(this.char == 62) {
					break;
				}
			}
		} catch( _g ) {
			this.line = old;
			throw haxe_Exception.thrown(miniftl_Error.EUnterminatedComment);
		}
		this.token();
		return this.token();
	}
	constString(c) {
		switch(c._hx_index) {
		case 0:
			let _g = c.f;
			if(_g == null) {
				return "null";
			} else {
				return "" + _g;
			}
			break;
		case 1:
			return c.s;
		case 2:
			return Std.string(c.d);
		case 3:
			return Std.string(c.d);
		case 4:
			return Std.string(c.d);
		}
	}
	tokenString(t) {
		switch(t._hx_index) {
		case 0:
			return ">";
		case 1:
			return "]";
		case 2:
			return "[";
		case 3:
			return "}";
		case 4:
			return "{";
		case 5:
			return ",";
		case 6:
			return this.constString(t.c);
		case 7:
			return "#" + t.s;
		case 8:
			return ".";
		case 9:
			return "<eof>";
		case 10:
			return t.s;
		case 11:
			return "@" + t.s;
		case 12:
			return t.s;
		case 13:
			return ")";
		case 14:
			return "(";
		case 15:
			return ";";
		}
	}
}
miniftl_Parser.__name__ = true;
Object.assign(miniftl_Parser.prototype, {
	__class__: miniftl_Parser
});
class miniftl_Printer {
	constructor() {
	}
	exprToString(e) {
		this.buf = new StringBuf();
		this.tabs = "";
		this.expr(e);
		return this.buf.b;
	}
	type(t) {
		switch(t._hx_index) {
		case 0:
			let _g = t.fields;
			this.buf.b += "{";
			let first = true;
			let _g1 = 0;
			while(_g1 < _g.length) {
				let f = _g[_g1];
				++_g1;
				if(first) {
					first = false;
					this.buf.b += " ";
				} else {
					this.buf.b += ", ";
				}
				this.buf.b += Std.string(f.name + " : ");
				this.type(f.t);
			}
			this.buf.b += first ? "}" : " }";
			break;
		case 1:
			let _g2 = t.args;
			let _g3 = t.ret;
			if(Lambda.exists(_g2,function(a) {
				if(a._hx_index == 2) {
					return true;
				} else {
					return false;
				}
			})) {
				this.buf.b += "(";
				let _g = 0;
				while(_g < _g2.length) {
					let a = _g2[_g];
					++_g;
					if(a._hx_index == 2) {
						this.type(a);
					} else {
						this.type(miniftl_CType.CTNamed("_",a));
					}
				}
				this.buf.b += ")->";
				this.type(_g3);
			} else {
				if(_g2.length == 0) {
					this.buf.b += "Void -> ";
				} else {
					let _g = 0;
					while(_g < _g2.length) {
						this.type(_g2[_g++]);
						this.buf.b += " -> ";
					}
				}
				this.type(_g3);
			}
			break;
		case 2:
			let _g4 = t.n;
			this.buf.b += _g4 == null ? "null" : "" + _g4;
			this.buf.b += ":";
			this.type(t.t);
			break;
		case 3:
			this.buf.b += "?";
			this.type(t.t);
			break;
		case 4:
			this.buf.b += "(";
			this.type(t.t);
			this.buf.b += ")";
			break;
		case 5:
			let _g5 = t.params;
			let s = t.path.join(".");
			this.buf.b += Std.string(s);
			if(_g5 != null) {
				this.buf.b += "<";
				let first = true;
				let _g = 0;
				while(_g < _g5.length) {
					let p = _g5[_g++];
					if(first) {
						first = false;
					} else {
						this.buf.b += ", ";
					}
					this.type(p);
				}
				this.buf.b += ">";
			}
			break;
		}
	}
	addType(t) {
		if(t != null) {
			this.buf.b += " : ";
			this.type(t);
		}
	}
	expr(e) {
		if(e == null) {
			this.buf.b += "??NULL??";
			return;
		}
		switch(e._hx_index) {
		case 0:
			this.expr(e.e);
			this.buf.b += "[";
			this.expr(e.index);
			this.buf.b += "]";
			break;
		case 1:
			let _g = e.e;
			this.buf.b += "[";
			let first = true;
			let _g1 = 0;
			while(_g1 < _g.length) {
				let e = _g[_g1++];
				if(first) {
					first = false;
				} else {
					this.buf.b += ", ";
				}
				this.expr(e);
			}
			this.buf.b += "]";
			break;
		case 2:
			let _g2 = e.e;
			this.buf.b += Std.string("<assign " + e.n);
			this.addType(e.t);
			if(_g2 != null) {
				this.buf.b += " = ";
				this.expr(_g2);
			}
			this.buf.b += ">";
			break;
		case 3:
			this.buf.b += "try ";
			this.expr(e.e);
			this.buf.b += Std.string(" catch( " + e.v);
			this.addType(e.t);
			this.buf.b += ") ";
			this.expr(e.ecatch);
			break;
		case 4:
			this.buf.b += "autoesc";
			break;
		case 5:
			this.expr(e.e1);
			this.buf.b += Std.string(" " + e.op + " ");
			this.expr(e.e2);
			break;
		case 6:
			let _g3 = e.el;
			if(_g3.length == 0) {
				this.buf.b += "{}";
			} else {
				this.tabs += "\t";
				this.buf.b += "{\n";
				let _g = 0;
				while(_g < _g3.length) {
					let e = _g3[_g++];
					this.buf.b += Std.string(this.tabs);
					this.expr(e);
					this.buf.b += ";\n";
				}
				this.tabs = HxOverrides.substr(this.tabs,1,null);
				this.buf.b += "}";
			}
			break;
		case 7:
			this.buf.b += "break";
			break;
		case 8:
			let _g4 = e.e;
			let _g5 = e.params;
			if(_g4 == null) {
				this.expr(_g4);
			} else {
				switch(_g4._hx_index) {
				case 17:
					this.expr(_g4);
					break;
				case 22:
					this.expr(_g4);
					break;
				case 32:
					this.expr(_g4);
					break;
				default:
					this.buf.b += "(";
					this.expr(_g4);
					this.buf.b += ")";
				}
			}
			this.buf.b += "(";
			let first1 = true;
			let _g6 = 0;
			while(_g6 < _g5.length) {
				let a = _g5[_g6++];
				if(first1) {
					first1 = false;
				} else {
					this.buf.b += ", ";
				}
				this.expr(a);
			}
			this.buf.b += ")";
			break;
		case 9:
			let _g7 = e.e2;
			let _g8 = e.params;
			this.expr(e.e1);
			this.buf.b += "(";
			let first2 = true;
			let _g9 = 0;
			while(_g9 < _g8.length) {
				let p = _g8[_g9++];
				if(first2) {
					first2 = false;
				} else {
					this.buf.b += ", ";
				}
				this.expr(p);
			}
			this.buf.b += ")";
			if(_g7 != null) {
				this.buf.b += "{";
				this.expr(_g7);
				this.buf.b += "}";
			}
			break;
		case 10:
			this.buf.b += "case";
			this.expr(e.e1);
			this.buf.b += "{\n";
			this.expr(e.e2);
			this.buf.b += "}";
			break;
		case 11:
			let _g10 = e.el;
			if(_g10.length == 0) {
				this.buf.b += "{}";
			} else {
				this.tabs += "\t";
				this.buf.b += "{\n";
				let _g = 0;
				while(_g < _g10.length) {
					let e = _g10[_g++];
					this.buf.b += Std.string(this.tabs);
					this.expr(e);
					this.buf.b += ";\n";
				}
				this.tabs = HxOverrides.substr(this.tabs,1,null);
				this.buf.b += "}";
			}
			break;
		case 12:
			this.buf.b += Std.string("comment(" + e.s + ")");
			break;
		case 13:
			this.buf.b += "{ compress";
			this.expr(e.e);
			this.buf.b += "}";
			break;
		case 14:
			this.buf.b += "continue";
			break;
		case 15:
			this.buf.b += Std.string("data " + e.d + " as " + e.n + " (");
			this.expr(e.e);
			this.buf.b += ")";
			break;
		case 16:
			this.buf.b += "default";
			break;
		case 17:
			this.expr(e.e);
			this.buf.b += Std.string("." + e.f);
			break;
		case 18:
			let _g11 = e.ns;
			this.buf.b += "fields (";
			let _g12 = [];
			let _g13 = 0;
			while(_g13 < _g11.length) _g12.push(_g11[_g13++]);
			let s = _g12.join(", ");
			this.buf.b += Std.string(s);
			this.buf.b += ")";
			break;
		case 19:
			let _g14 = e.a;
			this.buf.b += "filter (";
			let _g15 = [];
			let _g16 = 0;
			while(_g16 < _g14.length) {
				let arg = _g14[_g16];
				++_g16;
				_g15.push("" + arg.name + "=" + Std.string(arg.value));
			}
			let s1 = _g15.join(", ");
			this.buf.b += Std.string(s1);
			this.buf.b += ")";
			break;
		case 20:
			let _g17 = e.args;
			let _g18 = e.e;
			let _g19 = e.name;
			let _g20 = e.ret;
			this.buf.b += "function";
			if(_g19 != null) {
				this.buf.b += Std.string(" " + _g19);
			}
			this.buf.b += "(";
			let first3 = true;
			let _g21 = 0;
			while(_g21 < _g17.length) {
				let a = _g17[_g21];
				++_g21;
				if(first3) {
					first3 = false;
				} else {
					this.buf.b += ", ";
				}
				this.buf.b += Std.string(a.name);
				this.addType(a.t);
			}
			this.buf.b += ")";
			this.addType(_g20);
			this.buf.b += " ";
			this.expr(_g18);
			break;
		case 21:
			let _g22 = e.fl;
			if(_g22.length == 0) {
				this.buf.b += "{}";
			} else {
				this.tabs += "\t";
				this.buf.b += "{\n";
				let _g = 0;
				while(_g < _g22.length) {
					let f = _g22[_g];
					++_g;
					this.buf.b += Std.string(this.tabs);
					this.buf.b += Std.string(f.name + " : ");
					this.expr(f.e);
					this.buf.b += ",\n";
				}
				this.tabs = HxOverrides.substr(this.tabs,1,null);
				this.buf.b += "}";
			}
			break;
		case 22:
			let _g23 = e.v;
			this.buf.b += _g23 == null ? "null" : "" + _g23;
			break;
		case 23:
			let _g24 = e.e2;
			this.buf.b += "if( ";
			this.expr(e.cond);
			this.buf.b += " ) ";
			this.expr(e.e1);
			if(_g24 != null) {
				this.buf.b += " else ";
				this.expr(_g24);
			}
			break;
		case 24:
			this.expr(e.e);
			this.buf.b += Std.string("." + e.n);
			break;
		case 25:
			this.buf.b += "(";
			this.expr(e.e);
			this.buf.b += ")";
			break;
		case 26:
			this.buf.b += "list( '$it as $v' ";
			this.expr(e.it);
			this.buf.b += " ) ";
			this.expr(e.e);
			break;
		case 27:
			let _g25 = e.e;
			this.buf.b += Std.string("assign " + e.n);
			this.addType(e.t);
			if(_g25 != null) {
				this.buf.b += " = ";
				this.expr(_g25);
			}
			break;
		case 28:
			let _g26 = e.args;
			let _g27 = e.e;
			let _g28 = e.name;
			let _g29 = e.ret;
			this.buf.b += "function";
			if(_g28 != null) {
				this.buf.b += Std.string(" " + _g28);
			}
			this.buf.b += "(";
			let first4 = true;
			let _g30 = 0;
			while(_g30 < _g26.length) {
				let a = _g26[_g30];
				++_g30;
				if(first4) {
					first4 = false;
				} else {
					this.buf.b += ", ";
				}
				this.buf.b += Std.string(a.name);
				this.addType(a.t);
			}
			this.buf.b += ")";
			this.addType(_g29);
			this.buf.b += " ";
			this.expr(_g27);
			break;
		case 29:
			this.buf.b += "nested";
			break;
		case 30:
			this.buf.b += "(";
			this.expr(e.e);
			this.buf.b += ")";
			break;
		case 31:
			let _g31 = e.e;
			this.buf.b += "return";
			if(_g31 != null) {
				this.buf.b += " ";
				this.expr(_g31);
			}
			break;
		case 32:
			let _g32 = e.s;
			switch(_g32._hx_index) {
			case 0:
				let _g33 = _g32.f;
				this.buf.b += _g33 == null ? "null" : "" + _g33;
				break;
			case 1:
				this.buf.b += "\"";
				let s2 = _g32.s.split("\"").join("\\\"").split("\n").join("\\n").split("\r").join("\\r").split("\t").join("\\t");
				this.buf.b += Std.string(s2);
				this.buf.b += "\"";
				break;
			case 2:
				this.buf.b += Std.string(_g32.d);
				break;
			case 3:
				this.buf.b += Std.string(_g32.d);
				break;
			case 4:
				this.buf.b += Std.string(_g32.d);
				break;
			}
			break;
		case 33:
			this.buf.b += "<setting = ";
			this.expr(e);
			this.buf.b += ">";
			break;
		case 34:
			let _g34 = e.v;
			this.buf.b += _g34 == null ? "null" : "" + _g34;
			break;
		case 35:
			this.buf.b += "stop";
			break;
		case 36:
			let _g35 = e.cases;
			let _g36 = e.defaultExpr;
			this.buf.b += "switch( ";
			this.expr(e.e);
			this.buf.b += ") {";
			let _g37 = 0;
			while(_g37 < _g35.length) {
				let c = _g35[_g37];
				++_g37;
				this.buf.b += "case ";
				let first = true;
				let _g = 0;
				let _g1 = c.values;
				while(_g < _g1.length) {
					let v = _g1[_g++];
					if(first) {
						first = false;
					} else {
						this.buf.b += ", ";
					}
					this.expr(v);
				}
				this.buf.b += ": ";
				this.expr(c.expr);
				this.buf.b += ";\n";
			}
			if(_g36 != null) {
				this.buf.b += "default: ";
				this.expr(_g36);
				this.buf.b += ";\n";
			}
			this.buf.b += "}";
			break;
		case 37:
			this.buf.b += "throw ";
			this.expr(e.e);
			break;
		case 38:
			let _g38 = e.op;
			let _g39 = e.e;
			if(e.prefix) {
				this.buf.b += _g38 == null ? "null" : "" + _g38;
				this.expr(_g39);
			} else {
				this.expr(_g39);
				this.buf.b += _g38 == null ? "null" : "" + _g38;
			}
			break;
		}
	}
	static toString(e) {
		return new miniftl_Printer().exprToString(e);
	}
}
miniftl_Printer.__name__ = true;
Object.assign(miniftl_Printer.prototype, {
	__class__: miniftl_Printer
});
var miniftl_TTSourceError = $hxEnums["miniftl.TTSourceError"] = { __ename__:true,__constructs__:null
	,FileNotLoaded: ($_=function(name) { return {_hx_index:0,name:name,__enum__:"miniftl.TTSourceError",toString:$estr}; },$_._hx_name="FileNotLoaded",$_.__params__ = ["name"],$_)
};
miniftl_TTSourceError.__constructs__ = [miniftl_TTSourceError.FileNotLoaded];
class miniftl_TemplateSource {
	constructor(loader,pathReplacements) {
		this.cachedTemplates = new haxe_ds_StringMap();
		this.loader = loader == null ? new miniftl_loader_StringLoader() : loader;
		this.pathReplacements = pathReplacements == null ? [] : pathReplacements;
	}
	getTemplate(name) {
		if(Object.prototype.hasOwnProperty.call(this.cachedTemplates.h,name)) {
			return this.cachedTemplates.h[name];
		} else {
			throw haxe_Exception.thrown(miniftl_TTSourceError.FileNotLoaded(name));
		}
	}
	loadTemplate(name) {
		let _gthis = this;
		let template = tink_core_Future.map(this.loader.getContent(name),function(content) {
			return _gthis.processTemplate(content,name);
		});
		template.handle(function(outcome) {
			_gthis.cachedTemplates.h[name] = outcome;
		});
		return template;
	}
	setTemplate(name,content) {
		try {
			let ast = this.parseTemplate(name,content);
			this.cachedTemplates.h[name] = tink_core_Outcome.Success(ast);
		} catch( _g ) {
			let _g1 = haxe_Exception.caught(_g).unwrap();
			this.cachedTemplates.h[name] = tink_core_Outcome.Failure(Std.string(_g1));
		}
	}
	processTemplate(o,name) {
		switch(o._hx_index) {
		case 0:
			return tink_core_Outcome.Success(this.parseTemplate(name,o.data));
		case 1:
			return tink_core_Outcome.Failure(o.failure);
		}
	}
	parseTemplate(name,content) {
		let _g = 0;
		let _g1 = this.pathReplacements;
		while(_g < _g1.length) {
			let replacement = _g1[_g];
			++_g;
			content = StringTools.replace(content,replacement.from,replacement.to);
		}
		return new miniftl_Parser().parseTemplate(content,name);
	}
}
miniftl_TemplateSource.__name__ = true;
Object.assign(miniftl_TemplateSource.prototype, {
	__class__: miniftl_TemplateSource
});
class miniftl_format_DateFormat {
	static format(d) {
		return DateTools.format(d,"%b ") + d.getDate() + DateTools.format(d,", %Y %H:%M:%S %p");
	}
	static javaSimpleDate(d,format) {
		let p = StringTools.replace(format,"yyyy","%Y");
		p = StringTools.replace(p,"yy","%y");
		p = StringTools.replace(p,"MM","%m");
		p = StringTools.replace(p,"M","%m");
		p = p.includes("dd") ? StringTools.replace(p,"dd","%d") : StringTools.replace(p,"d","%d");
		p = StringTools.replace(p,"HH","%H");
		p = StringTools.replace(p,"mm","%M");
		p = StringTools.replace(p,"ss","%S");
		return DateTools.format(d,p);
	}
}
miniftl_format_DateFormat.__name__ = true;
class miniftl_loader_Loader {
}
miniftl_loader_Loader.__name__ = true;
miniftl_loader_Loader.__isInterface__ = true;
Object.assign(miniftl_loader_Loader.prototype, {
	__class__: miniftl_loader_Loader
});
class miniftl_loader_StringLoader {
	constructor(content) {
		this.content = content == null ? new haxe_ds_StringMap() : content;
	}
	getContent(name) {
		return new tink_core__$Future_SyncFuture(new tink_core__$Lazy_LazyConst(Object.prototype.hasOwnProperty.call(this.content.h,name) ? tink_core_Outcome.Success(this.content.h[name]) : tink_core_Outcome.Failure(name)));
	}
}
miniftl_loader_StringLoader.__name__ = true;
miniftl_loader_StringLoader.__interfaces__ = [miniftl_loader_Loader];
Object.assign(miniftl_loader_StringLoader.prototype, {
	__class__: miniftl_loader_StringLoader
});
class templateTester_Main {
	static main() {
		templateTester_Main.document.getElementById("evaluate").addEventListener("click",templateTester_Main.onEvaluateClick);
	}
	static onEvaluateClick(e) {
		miniftl_Ftl.process((js_Boot.__cast(templateTester_Main.document.getElementById("template") , HTMLTextAreaElement)).value).handle(function(outcome) {
			switch(outcome._hx_index) {
			case 0:
				templateTester_Main.document.getElementById("result").innerHTML = outcome.data;
				break;
			case 1:
				templateTester_Main.document.getElementById("result").innerHTML = outcome.failure;
				break;
			}
		});
	}
}
templateTester_Main.__name__ = true;
class tink_core_Callback {
	static invoke(this1,data) {
		if(tink_core_Callback.depth < 500) {
			tink_core_Callback.depth++;
			this1(data);
			tink_core_Callback.depth--;
		} else {
			tink_core_Callback.defer(function() {
				this1(data);
			});
		}
	}
	static defer(f) {
		haxe_Timer.delay(f,0);
	}
}
class tink_core_LinkObject {
}
tink_core_LinkObject.__name__ = true;
tink_core_LinkObject.__isInterface__ = true;
Object.assign(tink_core_LinkObject.prototype, {
	__class__: tink_core_LinkObject
});
class tink_core_CallbackLinkRef {
	constructor() {
	}
	cancel() {
		let this1 = this.link;
		if(this1 != null) {
			this1.cancel();
		}
	}
}
tink_core_CallbackLinkRef.__name__ = true;
tink_core_CallbackLinkRef.__interfaces__ = [tink_core_LinkObject];
Object.assign(tink_core_CallbackLinkRef.prototype, {
	__class__: tink_core_CallbackLinkRef
});
class tink_core__$Callback_LinkPair {
	constructor(a,b) {
		this.dissolved = false;
		this.a = a;
		this.b = b;
	}
	cancel() {
		if(!this.dissolved) {
			this.dissolved = true;
			let this1 = this.a;
			if(this1 != null) {
				this1.cancel();
			}
			let this2 = this.b;
			if(this2 != null) {
				this2.cancel();
			}
			this.a = null;
			this.b = null;
		}
	}
}
tink_core__$Callback_LinkPair.__name__ = true;
tink_core__$Callback_LinkPair.__interfaces__ = [tink_core_LinkObject];
Object.assign(tink_core__$Callback_LinkPair.prototype, {
	__class__: tink_core__$Callback_LinkPair
});
class tink_core__$Callback_ListCell {
	constructor(cb,list) {
		if(cb == null) {
			throw haxe_Exception.thrown("callback expected but null received");
		}
		this.cb = cb;
		this.list = list;
	}
	cancel() {
		if(this.list != null) {
			let list = this.list;
			this.cb = null;
			this.list = null;
			if(--list.used <= list.cells.length >> 1) {
				list.compact();
			}
		}
	}
}
tink_core__$Callback_ListCell.__name__ = true;
tink_core__$Callback_ListCell.__interfaces__ = [tink_core_LinkObject];
Object.assign(tink_core__$Callback_ListCell.prototype, {
	__class__: tink_core__$Callback_ListCell
});
class tink_core_Disposable {
}
tink_core_Disposable.__name__ = true;
tink_core_Disposable.__isInterface__ = true;
class tink_core_OwnedDisposable {
}
tink_core_OwnedDisposable.__name__ = true;
tink_core_OwnedDisposable.__isInterface__ = true;
tink_core_OwnedDisposable.__interfaces__ = [tink_core_Disposable];
class tink_core_SimpleDisposable {
	constructor(dispose) {
		if(tink_core_SimpleDisposable._hx_skip_constructor) {
			return;
		}
		this._hx_constructor(dispose);
	}
	_hx_constructor(dispose) {
		this.disposeHandlers = [];
		this.f = dispose;
	}
	dispose() {
		let _g = this.disposeHandlers;
		if(_g != null) {
			this.disposeHandlers = null;
			let f = this.f;
			this.f = tink_core_SimpleDisposable.noop;
			f();
			let _g1 = 0;
			while(_g1 < _g.length) _g[_g1++]();
		}
	}
	static noop() {
	}
}
tink_core_SimpleDisposable.__name__ = true;
tink_core_SimpleDisposable.__interfaces__ = [tink_core_OwnedDisposable];
Object.assign(tink_core_SimpleDisposable.prototype, {
	__class__: tink_core_SimpleDisposable
});
class tink_core_CallbackList extends tink_core_SimpleDisposable {
	constructor(destructive) {
		tink_core_SimpleDisposable._hx_skip_constructor = true;
		super();
		tink_core_SimpleDisposable._hx_skip_constructor = false;
		this._hx_constructor(destructive);
	}
	_hx_constructor(destructive) {
		if(destructive == null) {
			destructive = false;
		}
		this.onfill = function() {
		};
		this.ondrain = function() {
		};
		this.busy = false;
		this.queue = [];
		this.used = 0;
		let _gthis = this;
		super._hx_constructor(function() {
			if(!_gthis.busy) {
				_gthis.destroy();
			}
		});
		this.destructive = destructive;
		this.cells = [];
	}
	destroy() {
		let _g = 0;
		let _g1 = this.cells;
		while(_g < _g1.length) {
			let c = _g1[_g];
			++_g;
			c.cb = null;
			c.list = null;
		}
		this.queue = null;
		this.cells = null;
		if(this.used > 0) {
			this.used = 0;
			let fn = this.ondrain;
			if(tink_core_Callback.depth < 500) {
				tink_core_Callback.depth++;
				fn();
				tink_core_Callback.depth--;
			} else {
				tink_core_Callback.defer(fn);
			}
		}
	}
	invoke(data) {
		let _gthis = this;
		if(tink_core_Callback.depth < 500) {
			tink_core_Callback.depth++;
			if(_gthis.disposeHandlers != null) {
				if(_gthis.busy) {
					if(_gthis.destructive != true) {
						let _g = $bind(_gthis,_gthis.invoke);
						let data1 = data;
						let tmp = function() {
							_g(data1);
						};
						_gthis.queue.push(tmp);
					}
				} else {
					_gthis.busy = true;
					if(_gthis.destructive) {
						_gthis.dispose();
					}
					let length = _gthis.cells.length;
					let _g = 0;
					while(_g < length) {
						let _this = _gthis.cells[_g++];
						if(_this.list != null) {
							_this.cb(data);
						}
					}
					_gthis.busy = false;
					if(_gthis.disposeHandlers == null) {
						_gthis.destroy();
					} else {
						if(_gthis.used < _gthis.cells.length) {
							_gthis.compact();
						}
						if(_gthis.queue.length > 0) {
							(_gthis.queue.shift())();
						}
					}
				}
			}
			tink_core_Callback.depth--;
		} else {
			tink_core_Callback.defer(function() {
				if(_gthis.disposeHandlers != null) {
					if(_gthis.busy) {
						if(_gthis.destructive != true) {
							let _g = $bind(_gthis,_gthis.invoke);
							let data1 = data;
							let tmp = function() {
								_g(data1);
							};
							_gthis.queue.push(tmp);
						}
					} else {
						_gthis.busy = true;
						if(_gthis.destructive) {
							_gthis.dispose();
						}
						let length = _gthis.cells.length;
						let _g = 0;
						while(_g < length) {
							let _this = _gthis.cells[_g++];
							if(_this.list != null) {
								_this.cb(data);
							}
						}
						_gthis.busy = false;
						if(_gthis.disposeHandlers == null) {
							_gthis.destroy();
						} else {
							if(_gthis.used < _gthis.cells.length) {
								_gthis.compact();
							}
							if(_gthis.queue.length > 0) {
								(_gthis.queue.shift())();
							}
						}
					}
				}
			});
		}
	}
	compact() {
		if(this.busy) {
			return;
		} else if(this.used == 0) {
			this.resize(0);
			let fn = this.ondrain;
			if(tink_core_Callback.depth < 500) {
				tink_core_Callback.depth++;
				fn();
				tink_core_Callback.depth--;
			} else {
				tink_core_Callback.defer(fn);
			}
		} else {
			let compacted = 0;
			let _g = 0;
			let _g1 = this.cells.length;
			while(_g < _g1) {
				let i = _g++;
				let _g1 = this.cells[i];
				if(_g1.cb != null) {
					if(compacted != i) {
						this.cells[compacted] = _g1;
					}
					if(++compacted == this.used) {
						break;
					}
				}
			}
			this.resize(this.used);
		}
	}
	resize(length) {
		this.cells.length = length;
	}
}
tink_core_CallbackList.__name__ = true;
tink_core_CallbackList.__super__ = tink_core_SimpleDisposable;
Object.assign(tink_core_CallbackList.prototype, {
	__class__: tink_core_CallbackList
});
class tink_core__$Future_FutureObject {
}
tink_core__$Future_FutureObject.__name__ = true;
tink_core__$Future_FutureObject.__isInterface__ = true;
Object.assign(tink_core__$Future_FutureObject.prototype, {
	__class__: tink_core__$Future_FutureObject
});
class tink_core__$Future_NeverFuture {
	constructor() {
	}
	getStatus() {
		return tink_core_FutureStatus.NeverEver;
	}
	handle(callback) {
		return null;
	}
}
tink_core__$Future_NeverFuture.__name__ = true;
tink_core__$Future_NeverFuture.__interfaces__ = [tink_core__$Future_FutureObject];
Object.assign(tink_core__$Future_NeverFuture.prototype, {
	__class__: tink_core__$Future_NeverFuture
});
class tink_core__$Lazy_Computable {
}
tink_core__$Lazy_Computable.__name__ = true;
tink_core__$Lazy_Computable.__isInterface__ = true;
Object.assign(tink_core__$Lazy_Computable.prototype, {
	__class__: tink_core__$Lazy_Computable
});
class tink_core__$Lazy_LazyObject {
}
tink_core__$Lazy_LazyObject.__name__ = true;
tink_core__$Lazy_LazyObject.__isInterface__ = true;
tink_core__$Lazy_LazyObject.__interfaces__ = [tink_core__$Lazy_Computable];
Object.assign(tink_core__$Lazy_LazyObject.prototype, {
	__class__: tink_core__$Lazy_LazyObject
});
class tink_core__$Lazy_LazyConst {
	constructor(value) {
		this.value = value;
	}
	isComputed() {
		return true;
	}
	get() {
		return this.value;
	}
	compute() {
	}
	underlying() {
		return null;
	}
}
tink_core__$Lazy_LazyConst.__name__ = true;
tink_core__$Lazy_LazyConst.__interfaces__ = [tink_core__$Lazy_LazyObject];
Object.assign(tink_core__$Lazy_LazyConst.prototype, {
	__class__: tink_core__$Lazy_LazyConst
});
class tink_core__$Future_SyncFuture {
	constructor(value) {
		this.value = value;
	}
	getStatus() {
		return tink_core_FutureStatus.Ready(this.value);
	}
	handle(cb) {
		tink_core_Callback.invoke(cb,tink_core_Lazy.get(this.value));
		return null;
	}
}
tink_core__$Future_SyncFuture.__name__ = true;
tink_core__$Future_SyncFuture.__interfaces__ = [tink_core__$Future_FutureObject];
Object.assign(tink_core__$Future_SyncFuture.prototype, {
	__class__: tink_core__$Future_SyncFuture
});
class tink_core_Future {
	static map(this1,f,gather) {
		let _g = this1.getStatus();
		switch(_g._hx_index) {
		case 3:
			let this2 = _g.result;
			let f1 = f;
			return new tink_core__$Future_SyncFuture(new tink_core__$Lazy_LazyFunc(function() {
				return f1(this2.get());
			},this2));
		case 4:
			return tink_core_Future.NEVER;
		default:
			return new tink_core__$Future_SuspendableFuture(function(fire) {
				return this1.handle(function(v) {
					fire(f(v));
				});
			});
		}
	}
	static flatMap(this1,next,gather) {
		let _g = this1.getStatus();
		switch(_g._hx_index) {
		case 3:
			let l = _g.result;
			return new tink_core__$Future_SuspendableFuture(function(fire) {
				return next(tink_core_Lazy.get(l)).handle(function(v) {
					fire(v);
				});
			});
		case 4:
			return tink_core_Future.NEVER;
		default:
			return new tink_core__$Future_SuspendableFuture(function($yield) {
				let inner = new tink_core_CallbackLinkRef();
				return new tink_core__$Callback_LinkPair(this1.handle(function(v) {
					let outer = next(v).handle($yield);
					inner.link = outer;
				}),inner);
			});
		}
	}
}
var tink_core_FutureStatus = $hxEnums["tink.core.FutureStatus"] = { __ename__:true,__constructs__:null
	,Suspended: {_hx_name:"Suspended",_hx_index:0,__enum__:"tink.core.FutureStatus",toString:$estr}
	,Awaited: {_hx_name:"Awaited",_hx_index:1,__enum__:"tink.core.FutureStatus",toString:$estr}
	,EagerlyAwaited: {_hx_name:"EagerlyAwaited",_hx_index:2,__enum__:"tink.core.FutureStatus",toString:$estr}
	,Ready: ($_=function(result) { return {_hx_index:3,result:result,__enum__:"tink.core.FutureStatus",toString:$estr}; },$_._hx_name="Ready",$_.__params__ = ["result"],$_)
	,NeverEver: {_hx_name:"NeverEver",_hx_index:4,__enum__:"tink.core.FutureStatus",toString:$estr}
};
tink_core_FutureStatus.__constructs__ = [tink_core_FutureStatus.Suspended,tink_core_FutureStatus.Awaited,tink_core_FutureStatus.EagerlyAwaited,tink_core_FutureStatus.Ready,tink_core_FutureStatus.NeverEver];
class tink_core__$Future_SuspendableFuture {
	constructor(wakeup) {
		this.status = tink_core_FutureStatus.Suspended;
		this.wakeup = wakeup;
		this.callbacks = new tink_core_CallbackList(true);
		let _gthis = this;
		this.callbacks.ondrain = function() {
			if(_gthis.status == tink_core_FutureStatus.Awaited) {
				_gthis.status = tink_core_FutureStatus.Suspended;
				let this1 = _gthis.link;
				if(this1 != null) {
					this1.cancel();
				}
				_gthis.link = null;
			}
		};
		this.callbacks.onfill = function() {
			if(_gthis.status == tink_core_FutureStatus.Suspended) {
				_gthis.status = tink_core_FutureStatus.Awaited;
				_gthis.arm();
			}
		};
	}
	getStatus() {
		return this.status;
	}
	trigger(value) {
		if(this.status._hx_index != 3) {
			this.status = tink_core_FutureStatus.Ready(new tink_core__$Lazy_LazyConst(value));
			let link = this.link;
			this.link = null;
			this.wakeup = null;
			this.callbacks.invoke(value);
			if(link != null) {
				link.cancel();
			}
		}
	}
	handle(callback) {
		let _g = this.status;
		if(_g._hx_index == 3) {
			tink_core_Callback.invoke(callback,tink_core_Lazy.get(_g.result));
			return null;
		} else {
			let _this = this.callbacks;
			if(_this.disposeHandlers == null) {
				return null;
			} else {
				let node = new tink_core__$Callback_ListCell(callback,_this);
				_this.cells.push(node);
				if(_this.used++ == 0) {
					let fn = _this.onfill;
					if(tink_core_Callback.depth < 500) {
						tink_core_Callback.depth++;
						fn();
						tink_core_Callback.depth--;
					} else {
						tink_core_Callback.defer(fn);
					}
				}
				return node;
			}
		}
	}
	arm() {
		let _gthis = this;
		this.link = this.wakeup(function(x) {
			_gthis.trigger(x);
		});
	}
}
tink_core__$Future_SuspendableFuture.__name__ = true;
tink_core__$Future_SuspendableFuture.__interfaces__ = [tink_core__$Future_FutureObject];
Object.assign(tink_core__$Future_SuspendableFuture.prototype, {
	__class__: tink_core__$Future_SuspendableFuture
});
class tink_core_Lazy {
	static get(this1) {
		this1.compute();
		return this1.get();
	}
}
class tink_core__$Lazy_LazyFunc {
	constructor(f,from) {
		this.f = f;
		this.from = from;
	}
	underlying() {
		return this.from;
	}
	isComputed() {
		return this.f == null;
	}
	get() {
		return this.result;
	}
	compute() {
		let _g = this.f;
		if(_g != null) {
			this.f = null;
			let _g1 = this.from;
			if(_g1 != null) {
				let cur = _g1;
				this.from = null;
				let stack = [];
				while(cur != null && !cur.isComputed()) {
					stack.push(cur);
					cur = cur.underlying();
				}
				stack.reverse();
				let _g = 0;
				while(_g < stack.length) stack[_g++].compute();
			}
			this.result = _g();
		}
	}
}
tink_core__$Lazy_LazyFunc.__name__ = true;
tink_core__$Lazy_LazyFunc.__interfaces__ = [tink_core__$Lazy_LazyObject];
Object.assign(tink_core__$Lazy_LazyFunc.prototype, {
	__class__: tink_core__$Lazy_LazyFunc
});
var tink_core_Outcome = $hxEnums["tink.core.Outcome"] = { __ename__:true,__constructs__:null
	,Success: ($_=function(data) { return {_hx_index:0,data:data,__enum__:"tink.core.Outcome",toString:$estr}; },$_._hx_name="Success",$_.__params__ = ["data"],$_)
	,Failure: ($_=function(failure) { return {_hx_index:1,failure:failure,__enum__:"tink.core.Outcome",toString:$estr}; },$_._hx_name="Failure",$_.__params__ = ["failure"],$_)
};
tink_core_Outcome.__constructs__ = [tink_core_Outcome.Success,tink_core_Outcome.Failure];
class tink_core_OutcomeTools {
	static map(outcome,transform) {
		switch(outcome._hx_index) {
		case 0:
			return tink_core_Outcome.Success(transform(outcome.data));
		case 1:
			return tink_core_Outcome.Failure(outcome.failure);
		}
	}
}
tink_core_OutcomeTools.__name__ = true;
class xa3_format_NumberFormat {
	static number(v,decimals,separation,minWholeNumbers) {
		if(minWholeNumbers == null) {
			minWholeNumbers = 1;
		}
		if(decimals == null) {
			decimals = 0;
		}
		if(v == 0 && minWholeNumbers == 0) {
			return "";
		}
		if(separation == null) {
			separation = xa3_format_NumberFormat.en;
		}
		let vRounded = xa3_format_NumberFormat.round(v,decimals);
		let vString = vRounded == null ? "null" : "" + vRounded;
		let sign = vRounded < 0 ? "-" : "";
		let left = xa3_format_NumberFormat.fillLeft(vString.split(".")[0].substring(vRounded < 0 ? 1 : 0),minWholeNumbers);
		let right = decimals > 0 ? separation.decimal + xa3_format_NumberFormat.fillRight(vString.indexOf(".") == -1 ? "" : vString.split(".")[1],decimals) : "";
		let formattedLeft = HxOverrides.substr(left,Math.max(0,left.length - 3) | 0,null);
		let separators = (left.length - 1) / 3 | 0;
		let _g = 0;
		while(_g < separators) {
			let i = _g++;
			formattedLeft = left.substring(left.length - (i + 2) * 3,left.length - (i + 1) * 3) + separation.thousands + formattedLeft;
		}
		return sign + formattedLeft + right;
	}
	static fixed(v,decimals,separation,minWholeNumbers) {
		if(minWholeNumbers == null) {
			minWholeNumbers = 1;
		}
		if(decimals == null) {
			decimals = 0;
		}
		if(v == 0 && minWholeNumbers == 0) {
			return "";
		}
		if(separation == null) {
			separation = xa3_format_NumberFormat.en;
		}
		let vRounded = xa3_format_NumberFormat.round(v,decimals);
		let vString = vRounded == null ? "null" : "" + vRounded;
		return xa3_format_NumberFormat.fillLeft(vString.split(".")[0],minWholeNumbers) + (decimals > 0 ? separation.decimal + xa3_format_NumberFormat.fillRight(vString.indexOf(".") == -1 ? "" : vString.split(".")[1],decimals) : "");
	}
	static round(v,decimals) {
		if(decimals == null) {
			decimals = 0;
		}
		if(decimals == 0) {
			return Math.round(v);
		}
		let stringV = v == null ? "null" : "" + v;
		if(stringV.indexOf("e") != -1) {
			let pow = Math.pow(10,decimals);
			return Math.round(v * pow) / pow;
		} else {
			let stringVParts = stringV.split(".");
			let sInt = stringVParts[0];
			let sDec = stringVParts.length == 2 ? stringVParts[1] : "";
			if(sDec.length <= decimals) {
				return v;
			}
			if(Std.parseInt(sDec.charAt(decimals)) < 5) {
				return parseFloat(("" + sInt + "." + HxOverrides.substr(sDec,0,decimals)));
			}
			let sUp = "0";
			let _g = 1;
			let _g1 = decimals + 1;
			while(_g < _g1) {
				let i = _g++;
				let vUp = Std.parseInt(sDec.charAt(decimals - i)) + 1;
				if(vUp < 10) {
					sUp = (vUp == null ? "null" : "" + vUp) + sUp;
					return parseFloat(("" + sInt + "." + sDec.substring(0,decimals - i) + sUp));
				} else {
					sUp += "0";
				}
			}
			let int = parseFloat(sInt);
			return int < 0 ? int - 1 : int + 1;
		}
	}
	static fillLeft(s,length) {
		while(s.length < length) s = "0" + s;
		return s;
	}
	static fillRight(s,length) {
		while(s.length < length) s += "0";
		return s;
	}
}
xa3_format_NumberFormat.__name__ = true;
function $getIterator(o) { if( o instanceof Array ) return new haxe_iterators_ArrayIterator(o); else return o.iterator(); }
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $global.$haxeUID++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = m.bind(o); o.hx__closures__[m.__id__] = f; } return f; }
$global.$haxeUID |= 0;
if(typeof(performance) != "undefined" ? typeof(performance.now) == "function" : false) {
	HxOverrides.now = performance.now.bind(performance);
}
if( String.fromCodePoint == null ) String.fromCodePoint = function(c) { return c < 0x10000 ? String.fromCharCode(c) : String.fromCharCode((c>>10)+0xD7C0)+String.fromCharCode((c&0x3FF)+0xDC00); }
{
	String.prototype.__class__ = String;
	String.__name__ = true;
	Array.__name__ = true;
	Date.prototype.__class__ = Date;
	Date.__name__ = "Date";
	var Int = { };
	var Dynamic = { };
	var Float = Number;
	var Bool = Boolean;
	var Class = { };
	var Enum = { };
}
haxe_ds_ObjectMap.count = 0;
js_Boot.__toStr = ({ }).toString;
DateTools.DAY_SHORT_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
DateTools.DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
DateTools.MONTH_SHORT_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
DateTools.MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
templateTester_Main.document = window.document;
tink_core_Callback.depth = 0;
tink_core_SimpleDisposable._hx_skip_constructor = false;
tink_core_Future.NEVER = new tink_core__$Future_NeverFuture();
xa3_format_NumberFormat.dotComma = { decimal : ".", thousands : ","};
xa3_format_NumberFormat.en = xa3_format_NumberFormat.dotComma;
templateTester_Main.main();
