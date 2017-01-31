"use strict";
const vm = require("vm");
var corescript = require("fs").readFileSync(__dirname+"/corescript.js");
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
            out = Error.prototype.toString.apply(e);
            console.log("Error!");
        } catch (e) {
            console.log("Something failed badly, someone may be trying to escape");
        }
    }
    context.global = "[Circular]";
    if (typeof context.obuf == 'string' && context.obuf != "" && context.obuf)
        return context.obuf;
    return require("util").inspect(out,{customInspect:false});
}

process.on('message', (m) => {
    process.send(jssb(m));
    process.exit();
});
