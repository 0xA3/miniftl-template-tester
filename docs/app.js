(function ($global) { "use strict";
class HxOverrides {
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
	static now() {
		return Date.now();
	}
}
class Main {
	static main() {
		console.log("src/Main.hx:9:",xa3_format_NumberFormat.fixed(2.46999,2));
	}
}
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
class xa3_format_NumberFormat {
	static fixed(v,decimals,decimalSeparator,minWholeNumbers) {
		if(minWholeNumbers == null) {
			minWholeNumbers = 1;
		}
		if(decimalSeparator == null) {
			decimalSeparator = ".";
		}
		if(decimals == null) {
			decimals = 0;
		}
		if(v == 0 && minWholeNumbers == 0) {
			return "";
		}
		let vRounded = xa3_format_NumberFormat.round(v,decimals);
		let vString = vRounded == null ? "null" : "" + vRounded;
		let wholeNumbers = vString.split(".")[0];
		let left = xa3_format_NumberFormat.fillLeft(wholeNumbers,minWholeNumbers);
		let decimalString = vString.indexOf(".") == -1 ? "" : vString.split(".")[1];
		let filledDecimal = xa3_format_NumberFormat.fillRight(decimalString,decimals);
		let right = decimals > 0 ? decimalSeparator + filledDecimal : "";
		return left + right;
	}
	static round(v,decimals) {
		let pow = Math.pow(10,decimals);
		let vString = v == null ? "null" : "" + v;
		if(vString.indexOf("e") != -1) {
			return Math.round(v * pow) / pow;
		} else {
			let vParts = vString.split(".");
			let intString = vParts[0];
			let decimalString = vParts.length == 2 ? vParts[1] : "";
			let decimal = parseFloat(("0." + decimalString));
			let roundedDecimals = Math.round(decimal * pow) / pow;
			return parseFloat((intString + "." + HxOverrides.substr(roundedDecimals == null ? "null" : "" + roundedDecimals,2,null)));
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
if(typeof(performance) != "undefined" ? typeof(performance.now) == "function" : false) {
	HxOverrides.now = performance.now.bind(performance);
}
{
}
Main.main();
})({});

//# sourceMappingURL=app.js.map