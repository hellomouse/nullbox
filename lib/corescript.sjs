"use strict";
var obuf = "";
var console = {};
console.log = (msg) => {
  obuf += msg + "\n";
  return;
};
var Buffer = function(val){
  this.data = [];
  val = val.split("");
  for(var i in val){
    this.data.push(val[i].charCodeAt(0).toString(16));
  }
  this.toString = function(type){
    if(!type){
      return "<Buffer "+this.data.join(" ")+">";
    } else if(type=="ascii"||type=="utf-8") {
      var str="";
      for(var i in this.data){
        str += String.fromCharCode(parseInt(this.data[i],16));
      }
      return str;
    } else if(type=="hex"){
      return this.data.join("");
    }
  };
  this.alloc = function(num,fill){
    if (typeof num != 'number') {
      throw new TypeError(num.toString()+" is not a number!");
    }
    if (fill.split) {
      fill = fill.split("");
      for (var i = num;i>0;i--) {
      fill.forEach((element)=> {
        this.data.push(element.charCodeAt(0).toString(16));
      });
      };
      return this;
    }
    for (var i = num;i>0;i--) {
      this.data.push(fill||'\x00'.charCodeAt(0).toString(16));
    }
    return this;
  }
};
var EventEmitter = function(){
  this._events = {};
  this.on = function(type, func) {
    if(!this._events[type]) this._events[type] = [];
    this._events[type].push(func);
    return this;
  };
  this.once = function(type, func) {
    if(!this._events[type]) this._events[type] = [];
    var index = this._events[type].length;
    this._events[type].push(function(){
      func(arguments);
      //delete this._events[type].splice
      this._events[type][index]=_=>{};
    });
    return this;
  };
  this.emit = function(type) {
    if(!this._events[type]) return;
    var args = arguments.slice(1);
    for(var i in this._events[type]){
      this._events[type][i](...args);
    }
    return this;
  };
  return this;
};
var util = {};
util.__isCyclic = (obj) => {
  var seenObjects = [];

  function detect(obj) {
    if (obj && typeof obj === 'object') {
      if (seenObjects.indexOf(obj) !== -1) {
        return true;
      }
      seenObjects.push(obj);
      for (var key in obj) {
        if (obj.hasOwnProperty(key) && detect(obj[key])) {
          console.log(obj, 'cycle at ' + key);
          return true;
        }
      }
    }
    return false;
  }

  return detect(obj);
}
util.__objtype = (obj) => {
  if (typeof obj == 'function') {
    return "[Function: " + obj + " ]";
  }
  else if (util.__isCyclic(obj)) {
    return "[Cyclic object]";
  }
  else {
    return obj;
  }
}
util.inspect = (obj) => {
  var keys = Object.keys(obj);
  var out = "{";
  keys.forEach((element) => {
    out += element + ": " + util.__objtype(obj[element]).toString('utf8') + ", ";
  })
  return out += "}";
};
// the following code is from util.js in node.js's repo
util.tryStringify = (arg) => {
  try {
    return JSON.stringify(arg);
  }
  catch (_) {
    return '[Circular]';
  }
}



util.format = function(f) {
  if (typeof f !== 'string') {
    const objects = new Array(arguments.length);
    for (var index = 0; index < arguments.length; index++) {
      objects[index] = util.inspect(arguments[index]);
    }
    return objects.join(' ');
  }

  var argLen = arguments.length;

  if (argLen === 1) return f;

  var str = '';
  var a = 1;
  var lastPos = 0;
  for (var i = 0; i < f.length;) {
    if (f.charCodeAt(i) === 37 /*'%'*/ && i + 1 < f.length) {
      switch (f.charCodeAt(i + 1)) {
        case 100: // 'd'
          if (a >= argLen)
            break;
          if (lastPos < i)
            str += f.slice(lastPos, i);
          str += Number(arguments[a++]);
          lastPos = i = i + 2;
          continue;
        case 106: // 'j'
          if (a >= argLen)
            break;
          if (lastPos < i)
            str += f.slice(lastPos, i);
          str += util.tryStringify(arguments[a++]);
          lastPos = i = i + 2;
          continue;
        case 115: // 's'
          if (a >= argLen)
            break;
          if (lastPos < i)
            str += f.slice(lastPos, i);
          str += String(arguments[a++]);
          lastPos = i = i + 2;
          continue;
        case 37: // '%'
          if (lastPos < i)
            str += f.slice(lastPos, i);
          str += '%';
          lastPos = i = i + 2;
          continue;
      }
    }
    ++i;
  }
  if (lastPos === 0)
    str = f;
  else if (lastPos < f.length)
    str += f.slice(lastPos);
  while (a < argLen) {
    const x = arguments[a++];
    if (x === null || (typeof x !== 'object' && typeof x !== 'symbol')) {
      str += ' ' + x;
    }
    else {
      str += ' ' + util.inspect(x);
    }
  }
  return str;
};

// end that little block
var global = this;