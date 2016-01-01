jest.dontMock('../ConfigManager');
var ConfigManager = require('../ConfigManager.js').default;

describe('setConfig', function () {
    var store = {};
    beforeEach(function () {
        localStorage = {
            getItem: function () {
            }, setItem: function () {
            }, removeItem: function () {
            }
        };
        sessionStorage = {
            getItem: function () {
            }, setItem: function () {
            }, removeItem: function () {
            }
        };
        // LocalStorage mock.
        spyOn(localStorage, 'getItem').andCallFake(function (key) {
            return store[key];
        });
        spyOn(localStorage, 'setItem').andCallFake(function (key, value) {
            store[key] = value;
        });
        spyOn(localStorage, 'removeItem').andCallFake(function (key) {
            delete store[key];
        });
    });
    it('stores config with 2 properties', function () {
        ConfigManager.setConfig("test", {a: 1, b: 2});
        expect(ConfigManager.getConfig("test")).toNotBe(undefined);
        expect(ConfigManager.getConfig("test").a + ConfigManager.getConfig("test").b).toBe(3);
    });
    it('sets future and past expiry date on exisiting configs', function () {
        ConfigManager.setExpiry("test", 0.5);
        expect(ConfigManager.isExpired("test")).toBe(false);
        expect(ConfigManager.getExpiry("test")).toBeTruthy();
        ConfigManager.setExpiry("test", -0.1);
        expect(ConfigManager.isExpired("test")).toBe(true);
        expect(ConfigManager.getConfig("test")).toBeFalsy();
    });
    it('creates a new config with past and future expiry date', function () {
        ConfigManager.setConfig("test2", {a:1, b:2}, 20);
        expect(ConfigManager.getConfig("test2")).toBeTruthy();
        expect(ConfigManager.getExpiry("test2")).toBeTruthy();
        ConfigManager.setConfig("test3", {c:3}, -1);
        expect(ConfigManager.getExpiry("test3")).toBeTruthy();
        expect(ConfigManager.getConfig("test3")).toBeFalsy();
        expect(ConfigManager.getExpiry("test3")).toBeFalsy();
    });
    it('removes previously created config', function () {
        expect(ConfigManager.getConfig("test2")).toBeTruthy();
        ConfigManager.removeConfig("test2");
        expect(ConfigManager.getConfig("test2")).toBeFalsy();
        expect(ConfigManager.getExpiry("test2")).toBeFalsy();
    })
    it('tries to get non-existing config data', function(){
        expect(ConfigManager.getConfig("blabla")).toBeFalsy();
    })
});