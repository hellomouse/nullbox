'use strict';
const child_process = require("child_process");
function execute(script, timeout) {
    var executer = child_process.fork(__dirname+"/lib/sandbox.js");
    return new Promise((resolve,reject) => {
        var timekill = setTimeout(()=>{
            executer.kill("SIGHUP");
            reject("Timeout");
        }, timeout || 3000);
        executer.on('message',(m)=>{
            resolve(m);
            clearTimeout(timekill); // prevent issues.
        });
        executer.send(script);
    });
}
exports.execute = execute;
