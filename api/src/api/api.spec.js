"use strict";
const should = require("chai").should();
const expect = require("chai").expect;
const sinon = require("sinon");
const api = require("./api");

describe("API Framework", () => {
    describe("helper functions", () => {
        describe("isResult", () => {
            it("correctly identifies integers as results", () => {
                api.test.isResult(100).should.be.equal(true);
                api.test.isResult(999).should.be.equal(true);
                api.test.isResult(100.1).should.be.equal(false);
            });

            it("correctly identifies [status, message] arrays as results", () => {
                api.test.isResult([100, []]).should.be.equal(true);
                api.test.isResult([100, {}]).should.be.equal(true);
                api.test.isResult([100, null]).should.be.equal(true);
                api.test.isResult([100.1, []]).should.be.equal(false);
            });

            it("correctly identifies [message] arrays as results", () => {
                api.test.isResult([]).should.be.equal(false);
                api.test.isResult([100]).should.be.equal(true);
                api.test.isResult([{}]).should.be.equal(true);
            });

            it("correctly identifies anything else as not results", () => {
                api.test.isResult({}).should.be.equal(false);
                api.test.isResult("10").should.be.equal(false);
                api.test.isResult(null).should.be.equal(false);
                api.test.isResult().should.be.equal(false);
            });
        });

        describe("normaliseResult", () => {
            it("correctly normalises a normal result", () => {
                const result = api.test.normaliseResult([200, "OK"]);
                result.should.be.an("array");
                result.should.have.ordered.members([200, "OK"]);
            });

            it("correctly normalises a number result", () => {
                const result = api.test.normaliseResult(200);
                result.should.be.an("array");
                result.should.have.ordered.members([200, "OK"]);

                const result2 = api.test.normaliseResult(999);
                result2.should.be.an("array");
                result2.should.have.ordered.members([999, ""]);
            });

            it("correctly normalises a message-only result with the supplied status code", () => {
                const result = api.test.normaliseResult(["TestData"], 404);
                result.should.be.an("array");
                result.should.have.ordered.members([404, "TestData"]);
            });
        });

        describe("encapsulateResult", () => {
            it("passes through a result, just normalising it", () => {
                api.test.encapsulateResult(["TestData"], 404).should.have.ordered.members([404, "TestData"]);
                api.test.encapsulateResult(200).should.have.ordered.members([200, "OK"]);
                api.test.encapsulateResult([200, "OK"]).should.have.ordered.members([200, "OK"]);
            });

            it("encapsulates a non-result object into a result", () => {
                const result = api.test.encapsulateResult("TestData", 505);
                result.should.be.an("array");
                result.should.have.ordered.members([505, "TestData"]);
            });

            it("encapsulates a non-result object into a result with a default status code of 200 (OK)", () => {
                const result = api.test.encapsulateResult("TestData");
                result.should.be.an("array");
                result.should.have.ordered.members([200, "TestData"]);
            });
        });

        // TODO
        describe("makeEndpoint", () => {
            it("returns a valid API endpoint");
            it("only accepts a function");
            it("throws errors on function fail");
        });
    });

    describe("Dynamic Parameters", () => {
        describe("Internal Root Class", () => {
            it("instantiates correctly", () => {
                const root = new api.test.DynamicParameter();
                root.__name.should.be.equal("__apiScope");
                root.should.have.property("proxy");
            });

            it("propagates names correctly", () => {
                const root = new api.test.DynamicParameter();
                const rootProxy = root.proxy;
                rootProxy.req.params.username.__name.should.be.equals(rootProxy.__name + ".req.params.username");
            });
        });

        describe("APIParameter", () => {
            it("correctly identifies an APIParameter instance", () => {
                const root = new api.test.DynamicParameter();
                const param = root.proxy.req.test;
                api.Parameter.isParameter(param).should.be.equal(true);
            });

            it("correctly identifies things that are not an APIParameter instance", () => {
                api.Parameter.isParameter("testString").should.be.equal(false);
                api.Parameter.isParameter(10).should.be.equal(false);
                api.Parameter.isParameter({}).should.be.equal(false);
                api.Parameter.isParameter([]).should.be.equal(false);
                api.Parameter.isParameter(() => {}).should.be.equal(false);
            });

            it("resolves a dynamic parameter from a scope successfully", () => {
                const root = new api.test.DynamicParameter();
                const param1 = root.proxy.req.test;
                const param2 = root.proxy.req.params.username;
                const param3 = root.proxy.req.params.username[0];
                const scope = {
                    req: {
                        test: "testString",
                        params: {
                            username: [1, 2, 3]
                        }
                    }
                };

                api.Parameter.resolve(param1, scope).should.be.equal(scope.req.test);
                api.Parameter.resolve(param2, scope).should.be.equal(scope.req.params.username);
                api.Parameter.resolve(param3, scope).should.be.equal(scope.req.params.username[0]);
            });
        });
    });

    describe("Endpoint", () => {
        it("initialises correctly", () => {
            const ep = new api.endpoint();
            ep.fail.should.be.a("function");
            ep.main.should.be.a("function");
            ep.format.should.be.a("function");

            ep.params.should.be.a("object");
            ep.params.need.should.be.a("function");

            ep.body.should.be.a("object");
            ep.body.need.should.be.a("function");
        });

        const createMockResponse = () => {
            const res = {
                status: sinon.expectation.create(),
                json: sinon.expectation.create(),
                end: sinon.expectation.create()
            }

            res.status.returns(res);
            res.json.returns(res);

            return res;
        }

        describe("Methods", () => {
            describe("main function", () => {
                it("produces a default 501 if not initialised", () => {
                    const ep = new api.endpoint();
                    return ep._main().then((result) => {
                        api.test.isResult(result).should.be.equal(true);
                        result.should.be.an("array");
                        result.should.have.ordered.members([501, "Not Implemented"]);
                    });    
                });

                it("allows setting of any function as main function, and coerces result into a promise", () => {
                    const ep = new api.endpoint();
                    ep.main(() => "Test Message");

                    return ep._main().then((result) => {
                        api.test.isResult(result).should.be.equal(true);
                        result.should.be.an("array");
                        result.should.have.ordered.members([200, "Test Message"]);
                    });
                });

                it("allows setting of any promise as main function, and coerces result into a promise", () => {
                    const ep = new api.endpoint();
                    ep.main(() => { return Promise.resolve("Test Message"); });

                    return ep._main().then((result) => {
                        api.test.isResult(result).should.be.equal(true);
                        result.should.be.an("array");
                        result.should.have.ordered.members([200, "Test Message"]);
                    });
                });

                it("gracefully handles exceptions thrown in main function, and coerces them into a result", () => {
                    const ep = new api.endpoint();
                    ep.main(() => { throw "Test Message"; });

                    return ep._main().catch((result) => {
                        api.test.isResult(result).should.be.equal(true);
                        result.should.be.an("array");
                        result.should.have.ordered.members([500, "Test Message"]);
                    });
                });
            });

            describe("fail function", () => {
                it("masks any error message by default to the HTTP status code", () => {
                    const ep = new api.endpoint();
                    api.test.isResult(ep._fail(null, null, 500)).should.be.equal(true);
                    ep._fail(null, null, 500)[1].should.be.equal("Internal Server Error");

                    api.test.isResult(ep._fail(null, null, 999, "Bad Status")).should.be.equal(true);
                    ep._fail(null, null, 999, "Bad Status")[1].should.be.equal("Bad Status");
                });

                it("allows setting of any fail function, preserving arguments correctly", () => {
                    const ep = new api.endpoint();
                    ep.fail((req, res, status, message) => {
                        status.should.be.equals(200);
                        message.should.be.equals("Test Status Message");
                    });

                    ep._fail(null, null, 200, "Test Status Message");
                });
            });

            describe("format function", () => {
                it("outputs json by default", () => {
                    const res = createMockResponse();

                    const xs = res.status.once().withExactArgs(501);
                    const xj = res.json.once().withExactArgs("Not Implemented");
                    const xe = res.end.once();

                    const ep = new api.endpoint();
                    ep._format(null, res, 501, "Not Implemented");

                    xs.verify();
                    xj.verify();
                    xe.verify();
                });

                it("allows setting of custom format functions", () => {
                    const res = createMockResponse();

                    const xs = res.status.once().withExactArgs(501);
                    const xj = res.json.once().withExactArgs("This is a fixed message");
                    const xe = res.end.once();

                    const ep = new api.endpoint();
                    ep.format((req, res, status, message) => { res.status(status).json("This is a fixed message").end(); });
                    ep._format(null, res, 501, "Not Implemented");

                    xs.verify();
                    xj.verify();
                    xe.verify();
                });
            });

            describe("preconditions", () => {
                it("accepts a function as a precondition", () => {
                    const ep = new api.endpoint();
                    (() => ep.params.need('apiTest', () => 0)).should.not.throw();
                });

                it("does not accept anything but a function as a precondition", () => {
                    const ep = new api.endpoint();
                    (() => ep.params.need('apiTest', "asdf")).should.throw();
                    (() => ep.params.need('apiTest', [])).should.throw();
                    (() => ep.params.need('apiTest', {})).should.throw();
                    (() => ep.params.need('apiTest', 10)).should.throw();
                });
            });

            describe("sealing", () => {
                it("produces a function", () => {
                    const ep = new api.endpoint();
                    ep.seal().should.be.a("function");
                });

                it("returns a 501 Not Implemented response by default", () => {
                    const res = createMockResponse();

                    const xs = res.status.once().withExactArgs(501);
                    const xj = res.json.once().withExactArgs("Not Implemented");
                    const xe = res.end.once();

                    const ep = new api.endpoint();
                    return (ep.seal())({}, res).then(() => {
                        xs.verify();
                        xj.verify();
                        xe.verify();
                    });
                });
            });
        });

        describe("Behaviour", () => {
            it("returns a 500 Internal Error if the main function errors", () => {
                const res = createMockResponse();

                const xs = res.status.once().withExactArgs(500);
                const xj = res.json.once().withExactArgs("Internal Server Error");
                const xe = res.end.once();

                const ep = new api.endpoint();
                ep.main(() => { throw new Error("Test") });
                return (ep.seal())({}, res).then(() => {
                    xs.verify();
                    xj.verify();
                    xe.verify();
                });
            });

            it("returns a 400 Bad Request if a param precondition fails.", () => {
                const res = createMockResponse();

                const xs = res.status.once().withExactArgs(400);
                const xj = res.json.once().withExactArgs("Bad Request");
                const xe = res.end.once();

                const ep = new api.endpoint();
                ep.params.need('testParam');
                return (ep.seal())({params: {}}, res).then(() => {
                    xs.verify();
                    xj.verify();
                    xe.verify();
                });
            });

            it("executes the main method if the simple params preconditions are satisfied", () => {
                const res = createMockResponse();

                const xs = res.status.once().withExactArgs(501);
                const xj = res.json.once().withExactArgs("Not Implemented");
                const xe = res.end.once();

                const ep = new api.endpoint();
                ep.params.need('testParam');
                return (ep.seal())({params: {testParam: "yes"}}, res).then(() => {
                    xs.verify();
                    xj.verify();
                    xe.verify();
                });
            });

            it("executes the main method if the function param preconditions are satisfied", () => {
                const res = createMockResponse();

                const xs = res.status.once().withExactArgs(501);
                const xj = res.json.once().withExactArgs("Not Implemented");
                const xe = res.end.once();

                const ep = new api.endpoint();
                ep.body.need('testParam', () => true);
                return (ep.seal())({body: {testParam: "yes"}}, res).then(() => {
                    xs.verify();
                    xj.verify();
                    xe.verify();
                });
            });

            it("returns a 400 Bad Request if a body precondition fails, and there is no request body.", () => {
                const res = createMockResponse();

                const xs = res.status.once().withExactArgs(400);
                const xj = res.json.once().withExactArgs("Bad Request");
                const xe = res.end.once();

                const ep = new api.endpoint();
                ep.body.need('testParam');
                return (ep.seal())({}, res).then(() => {
                    xs.verify();
                    xj.verify();
                    xe.verify();
                });
            });

            it("returns a 400 Bad Request if a body precondition fails, and the request body does not contain the specified parameter.", () => {
                const res = createMockResponse();

                const xs = res.status.once().withExactArgs(400);
                const xj = res.json.once().withExactArgs("Bad Request");
                const xe = res.end.once();

                const ep = new api.endpoint();
                ep.body.need('testParam');
                return (ep.seal())({body: {}}, res).then(() => {
                    xs.verify();
                    xj.verify();
                    xe.verify();
                });
            });

            it("executes the main method if the simple body preconditions are satisfied", () => {
                const res = createMockResponse();

                const xs = res.status.once().withExactArgs(501);
                const xj = res.json.once().withExactArgs("Not Implemented");
                const xe = res.end.once();

                const ep = new api.endpoint();
                ep.body.need('testParam');
                return (ep.seal())({body: {testParam: "yes"}}, res).then(() => {
                    xs.verify();
                    xj.verify();
                    xe.verify();
                });
            });

            it("executes the main method if the function body preconditions are satisfied", () => {
                const res = createMockResponse();

                const xs = res.status.once().withExactArgs(501);
                const xj = res.json.once().withExactArgs("Not Implemented");
                const xe = res.end.once();

                const ep = new api.endpoint();
                ep.body.need('testParam', () => true);
                return (ep.seal())({body: {testParam: "yes"}}, res).then(() => {
                    xs.verify();
                    xj.verify();
                    xe.verify();
                });
            });
        });
    });

    describe("Plugin System", () => {
        // Make a small test plugin
        class TestPlugin extends api.Plugin {
            constructor() {
                super();
            }

            static get name() {
                return "testPlugin";
            }

            preHook(req, res, scope) {
                return 400;
            }

            inject(obj) {
                obj.injected = true;
            }
        };

        it("correctly registers plugins", () => {
            (() => { api.registerPlugin(TestPlugin); }).should.not.throw();
            api.test.unregisterPlugin(TestPlugin);
        });

        it("rejects invalid plugins", () => {
            (() => api.registerPlugin({})).should.throw();
            (() => api.registerPlugin({name: "test2"})).should.throw();
        });

        it("rejects plugins with reserved keywords", () => {
            class paramsPlugin extends api.Plugin {
                static get name() {
                    return "params";
                }
            };

            (() => api.registerPlugin(paramsPlugin)).should.throw();
        });

        it("rejects the barebones APIPlugin class", () => {
            (() => api.registerPlugin(api.Plugin)).should.throw();
        });

        it("correctly injects the plugin function", () => {
            (() => { api.registerPlugin(TestPlugin); }).should.not.throw();
            const ep = new api.endpoint();
            ep.testPlugin.injected.should.be.equal(true);
            api.test.unregisterPlugin(TestPlugin);
        });

        let prehookInstance = null;
        let failPrehook = false;
        class preHookTest extends api.Plugin {
            constructor() { super(); this.prehookCalled = 0; prehookInstance = this; };
            static get name() { return "prehook" };
            preHook(req, res, scope) {
                this.prehookCalled++;
                if(failPrehook) {
                    return [400, "Bad Credentials"];
                }
            };
        }
        describe("preHook", () => {
            it("calls the prehook function when a request is executed", () => {
                api.registerPlugin(preHookTest);

                const ep = new api.endpoint();
                ep.format(() => {});
                
                // Set a value on prehook so as to trigger the plugin injecting.
                ep.prehook.value = "yes";
                return (ep.seal())({}, null).then(() => {
                    prehookInstance.prehookCalled.should.be.equal(1);
                });
            });

            it("calls the fail function when a prehook returns a result", () => {
                api.registerPlugin(preHookTest);

                failPrehook = true;
                const ep = new api.endpoint();
                ep.format(() => {});
                const ex = sinon.spy(ep, '_fail');
                
                // Set a value on prehook so as to trigger the plugin injecting.
                ep.prehook.value = "yes";
                const req = {};
                return (ep.seal())(req, null).then(() => {
                    ex.calledOnce.should.be.equal(true);
                    ex.args[0].should.have.ordered.members([req, null, 400, "Bad Credentials"]);
                });
            });
        });
    });
});
