'use strict';
var sandbox = require("../index.js");
console.log(sandbox);
sandbox.execute("console.log(\'Hello, World!\')").then((res)=>{
    console.log(res);
})