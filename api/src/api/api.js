"use strict";

const Promise = require("bluebird");
const http = require("http");

// API Call Object:
// Generates a callable express middleware. Preconditions can be installed.

const isResult = (result) => {
    if(typeof(result) === "number" && Math.floor(result) === result) {
        return true;
    }

    if(result instanceof Array) {
        return result.length === 1 || (result.length === 2 && typeof(result[0]) === "number" && Math.floor(result[0]) === result[0]);
    }

    return false;
}

// By default we "normalise" result objects with a 200 status if it's missing.
const normaliseResult = (result, statusCodeIfMissing) => {
    if(typeof(result) === "number") {
        if(http.STATUS_CODES.hasOwnProperty(result)) {
            return [result, http.STATUS_CODES[result]];
        }
        return [result, ""];
    }

    if(result.length === 1) {
        return [statusCodeIfMissing, result[0]];
    }

    return result;
}

// Coerces anything into a full array result object.
const encapsulateResult = (rawResult, statusCodeIfMissing) => {
    statusCodeIfMissing = statusCodeIfMissing || 200;
    if(isResult(rawResult)) {
        return normaliseResult(rawResult, statusCodeIfMissing);
    }
    else {
        return [statusCodeIfMissing, rawResult];
    }
}

const makePreconditionFn = (fn) => {
    if(fn && typeof(fn) !== "function") {
        throw new Error("Invalid precondition function");
    }
    else {
        fn = () => true;
    }

    return fn;
}

// Are there any plugins installed?
const pluginRegistry = {};

const registerPlugin = (pluginClass) => {
    const restrictedKeywords = ["params", "body", "main", "fail", "format", "seal"];
    if(!pluginClass || !pluginClass.name || !(pluginClass.prototype instanceof APIPlugin)) {
        throw new Error("The plugin is not an API Plugin or has no name");
    }

    if(restrictedKeywords.indexOf(pluginClass.name) !== -1) {
        throw new Error("The plugin name cannot be a reserved keyword.")
    }

    pluginRegistry[pluginClass.name] = pluginClass;
};

const unregisterPlugin = (pluginClass) => {
    delete pluginRegistry[pluginClass.name];
}

class APIPlugin {
    // Plugins: pre-hook
    // Future: preHookFailed, preconditionFailed, mainErrorHook, mainPreHook, mainPostHook, failPreHook, formatPreHook, formatPostHook
    constructor() {}

    // Return name of the plugin. This is static per-class. 
    // Should not be a reserved keyword.
    static get name() {
        return "";
    }

    // API Prehook. Gets executed before the request is processed or any preconditions are run.
    // Returns a result, or nothing if the request is to proceed. If a result is returned,
    // it is formatted and immediately output, without passing to the failure chain.
    // may return a promise.
    preHook(req, res, scope) { }

    // Inject. Gets executed whenever a plugin is used on an endpoint (i.e. any property of the plugin is accessed).
    // The purpose of this method is to configure the plugin's property object, which is passed as the only argument to this function.
    inject(pluginProperty) { }
};

const API_SCOPE_NAME = "__apiScope";
class APIDynamicParameter {
    constructor() {
        this.__name = API_SCOPE_NAME;

        const nameProxyHandler = {
            get: (target, prop) => {
                if(prop === "__isApiParameter") {
                    return true;
                }

                if(prop === "__name") {
                    return target[prop];
                }

                if(!target.hasOwnProperty(prop)) {
                    target[prop] = new Proxy({__name: target.__name + "." + prop}, nameProxyHandler);
                }    
                
                return target[prop];
            }
        };

        this.proxy = new Proxy(this, nameProxyHandler);
    }
};

class APIParameter {
    static resolve(param, scope) {
        // Find out what property to use.
        const props = param.__name.split('.');
        let value = scope;
        
        for(let i = 1; i < props.length; ++i) {
            value = value[props[i]];
        }

        return value;
    }

    static isParameter(param) {
        return param.__isApiParameter === true;
    }
};

class APIEndpoint {
    constructor() {
        this.preconditions = [];        // Predicate which fails with certain Message
        const mainDefaultResult = Promise.resolve(encapsulateResult(501));
        this._main = () => { return mainDefaultResult; };
        this._fail = (req, res, status, message) => { return [status, http.STATUS_CODES[status] !== undefined ? http.STATUS_CODES[status] : message]; };
        this._format = (req, res, status, message) => { res.status(status).json(message).end(); }; 
        this._dynamicParams = new APIDynamicParameter();

        const propertyProxyHandler = {
            get: (target, prop) => {
                if(prop in target) {
                    return target[prop];
                }
                else {
                    return this._dynamicParams.proxy[prop];
                }
            }
        }

        this._params = new Proxy({
            need: (name, fn) => {
                fn = makePreconditionFn(fn);

                this.preconditions.push((req) => {
                    if(!req.params.hasOwnProperty(name)) {
                        return 400;
                    }
                    return fn(req);
                });
            }
        }, propertyProxyHandler);

        this._body = new Proxy({
            need: (name, fn) => {
                fn = makePreconditionFn(fn);

                this.preconditions.push((req) => {
                    if(!req.body || !req.body.hasOwnProperty(name)) {
                        return 400;
                    }
                    return fn(req);
                });
            }
        }, propertyProxyHandler);

        this._injectPlugins();
    }

    _injectPlugins() {
        // Install the plugin config params
        const lazyPluginInstall = (name) => {
            // Returns a function that lazily instantiates the plugin if and when needed.
            return () => {
                // First remove the property
                const pluginClass = pluginRegistry[name];
                const plugin = new pluginClass();
                const pluginProperty = {};
                plugin.inject(pluginProperty);
                this.enabledPlugins.push(plugin);

                Object.defineProperty(this, name, {
                    configurable: false,
                    enumerable: true,
                    value: pluginProperty,
                    writeable: false
                });

                return pluginProperty;
            };
        }

        // Install lazy instantiators for all plugins we have
        this.enabledPlugins = [];       // Which plugins are installed.
        for(let pluginName in pluginRegistry) {
            Object.defineProperty(this, pluginName, {
                configurable: true,
                enumerable: true,
                writeable: false,
                get: lazyPluginInstall(pluginName)
            });
        }
    }

    get params() {
        return this._params;
    }

    get body() {
        return this._body;
    }

    main(fn) {
        // Main wraps the fn into a try/catch that coerces the return value into an api result.
        this._main = (req, res) => {
            let resultPromise = null;
            try {
                resultPromise = fn(req, res);
                // if we don't have a promise, coerce the function into one.
                if(!resultPromise.then || typeof(resultPromise.then) !== "function") {
                    resultPromise = Promise.resolve(resultPromise);
                }
            }
            catch(e) {
                // if we get here it means the function threw an error, so coerce the error into a result and reject.
                resultPromise = Promise.reject(e);
            }

            return resultPromise.then((result) => { return encapsulateResult(result); }, 
                                    (e) => { throw encapsulateResult(e, 500); });
        };
    };

    // fn(req, res, status, message); Returns a [status, message] object.
    // Special action on fail. Stuff like log a failed request. This is the last line of defense.
    fail(fn) {
        this._fail = fn;
    };

    // fn(req, res, status, message); returns nothing, but writes the data to the stream. Only use if you want to override default JSON behaviour.
    format(fn) {
        this._format = fn; 
    };

    // returns an express endpoint.
    // all preconditions etc are copied over.
    seal() {
        return (req, res) => {
            // Create scope.
            const scope = {params: req.params, body: req.body};

            // Step 0: if any plugins, run their hooks.
            const preHook = Promise.map(this.enabledPlugins, p => {
                return p.preHook(req, res, scope);
            }).then(preHookResults => {
                // if any prehook returned a result, return it;
                const results = preHookResults.filter(v => isResult(v));
                if(results && results.length !== 0) {
                    throw encapsulateResult(results[0], 500);
                }
            });

            // Step 1: Run preconditions. Pick first one that fails (i.e. not all return TRUE);
            // And coerce their output into a result.
            const failedPreconditions = this.preconditions.map(p => p(req)).filter(p => p !== true);
            
            let reqPromise = null;
            if(failedPreconditions.length !== 0) {
                // Go straight to failre mode.
                reqPromise = Promise.reject(encapsulateResult(failedPreconditions[0]));
            }
            else {
                reqPromise = this._main(req, res);
            }

            return preHook
            .then(() => reqPromise)
            .catch((result) => { return this._fail(req, res, result[0], result[1]); })
            .then((result) => { this._format(req, res, result[0], result[1]); });
        }      
    };
};

const createEndpoint = (fn) => {
    const ep = new APIEndpoint();
    fn(ep);
    return ep.seal();
};

module.exports = {
    endpoint: APIEndpoint,
    createEndpoint: createEndpoint,
    registerPlugin: registerPlugin,
    Plugin: APIPlugin,
    Parameter: APIParameter,
    test: {
        isResult: isResult,
        normaliseResult: normaliseResult,
        encapsulateResult: encapsulateResult,
        unregisterPlugin: unregisterPlugin,
        DynamicParameter: APIDynamicParameter
    }
};
