# NullBox
[![NPM](https://nodei.co/npm/nullbox.png?downloads=true&stars=true)](https://nodei.co/npm/nullbox/)
# NullBox
##About
Nullbox is a sandbox for JS made in JS. It provides corescript which adds some feautres such as emulation of events, utils and Buffer (100% JS). Its named NullBox because of the method to initialize the context of sandbox.

##Features
* Its very safe
* Provides a corescript which emulates some NodeJS modules (util, events and buffer)
### Why is it safe?
* no variables are passed to sandbox (or else a hacker can use .constructor and climb to another scope)
* sandbox is executed in another process (avoids freezing of main process)
* constructors inside sandbox dont point outside it
* functions used aganist output are carefully called to avoid exploits (such as a object with a toJSON property)

## Usage

### sandbox.execute ( code, timeout )
Accepts code, which contains the code that will be executed and timeout that is the milliseconds the sandbox will wait before killing the process (to avoid infinite loops and similar).

Returns a promise which, if resolved, contains the output and if rejected the reason it was rejected (currently Timeout is only reason)

## Example
```
var sandbox = require("nullbox");
console.log(sandbox);
sandbox.execute("console.log(\'Hello, World!\')").then((res)=>{
    console.log(res);
})
```

## Contributors
* @moonheart08
* @io4
* @iczero

## Contact/Issues
If you think your issue is something that should be solved fast (a vulnerability or something serious) you can contact us in #valoran at freenode.

If you want a new feature, or something does not work you can submit a issue.
