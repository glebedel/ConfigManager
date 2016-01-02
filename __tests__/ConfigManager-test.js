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
        //creates config "test" with two properties a & b
        ConfigManager.setConfig("test", {a: 1, b: 2});
        //checks that the config test is not empty
        expect(ConfigManager.getConfig("test")).toNotBe(undefined);
        //stored properly since a + b = 1 + 2 = 3
        expect(ConfigManager.getConfig("test").a + ConfigManager.getConfig("test").b).toBe(3);
    });
    it('sets future and past expiry date on exisiting configs', function () {
        ConfigManager.setExpiry("test", 0.5);
        //config "test" is not expired since 500ms didn't elapse
        expect(ConfigManager.isExpired("test")).toBe(false);
        //it means we can still get the config content
        expect(ConfigManager.getExpiry("test")).toBeTruthy();
        ConfigManager.setExpiry("test", -0.1);
        //"test" is now expired because we set a negative expiry
        expect(ConfigManager.isExpired("test")).toBe(true);
        //since it's expired it gets removed on the next getConfig and cannot be retrieved anymore
        expect(ConfigManager.getConfig("test")).toBeFalsy();
    });
    it('creates a new config with past and future expiry date', function () {
        ConfigManager.setConfig("test2", {a:1, b:2}, 20);
        expect(ConfigManager.getConfig("test2")).toBeTruthy();
        //config "test2" can be retrieved because of future expiry date
        expect(ConfigManager.getExpiry("test2")).toBeTruthy();
        ConfigManager.setConfig("test3", {c:3}, -1);
        expect(ConfigManager.getExpiry("test3")).toBeTruthy();
        //config "test2" cannot be retrieved because set to expire in -1 seconds
        expect(ConfigManager.getConfig("test3")).toBeFalsy();
        //we verify that the associated item storing "test3"'s expiry date is also gone
        expect(ConfigManager.getExpiry("test3")).toBeFalsy();
    });
    it('tries to get non-existing config data', function(){
        expect(ConfigManager.getConfig("blabla")).toBeFalsy();
    });
    it('removes an expiry date on an expired config', function(){
        ConfigManager.setConfig("blabla", {car:1}, -1);
        expect(ConfigManager.getExpiry("blabla")).toBeLessThan(Date.now());
        ConfigManager.removeExpiry("blabla");
        //since we removed the past expiry date, we should always be able to retrieve the config
        expect(ConfigManager.getConfig("blabla")).toBeTruthy();
    });
    it('aguments and increments previously created config', function(){
        ConfigManager.assignToConfig("blabla", {moto:1, tricycle:"nope"});
        expect(ConfigManager.getConfig("blabla").car).toBe(1);
        expect(ConfigManager.getConfig("blabla").tricycle).toBe("nope");
        ConfigManager.assignToConfig("blabla", {moto:2});
        expect(ConfigManager.getConfig("blabla").car).toBe(1);
        expect(ConfigManager.getConfig("blabla").moto).toBe(2);
        ConfigManager.addToConfigProperties("blabla", {car:1, tricycle:"yes"});
        expect(ConfigManager.getConfig("blabla").car).toBe(2);
        expect(ConfigManager.getConfig("blabla").tricycle).toBe("nopeyes");
    });
    it('removes all previously created config', function () {
        expect(ConfigManager.getConfig("test2")).toBeTruthy();
        ConfigManager.removeConfig("test2");
        expect(ConfigManager.getConfig("test2")).toBeFalsy();
        expect(ConfigManager.getExpiry("test2")).toBeFalsy();
        //other way to remove a config by giving a past expiry date which removes it on next getConfig
        ConfigManager.setExpiry("blabla", -1)
        expect(ConfigManager.getConfig("blabla")).toBeFalsy();
    })
});