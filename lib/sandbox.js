"use strict";
const vm = require("vm");
var corescript = require("fs").readFileSync(__dirname+"/corescript.sjs");
function jssb(script) {
    var context = vm.createContext(Object.create(null));
    var out;
    try {
        out = new vm.Script(corescript + script).runInContext(context, {
            timeout: 2000,
            filename: "/virtual.js"
        });
    }
    catch (e) {
        try {
            out = e; //do NOT tostring
            console.log("Error!");
        } catch (e) {
            console.log("Something failed badly, someone may be trying to escape");
        }
    }
    context.global = "[Circular]";
    if (context.obuf != "" && typeof context.obuf == 'string' && context.obuf) 
        return context.obuf;
    return require("util").inspect(out,{customInspect:false});
}

process.on('message',(m)=>{
    process.send(jssb(m));
    process.exit();
})