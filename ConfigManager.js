"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by guillaume lebedel on 18/12/15.
 * ConfigManager is a simple interface on top of localStorage to handle expiry of data
 * and easy storing of javascript objects.
 */

/*global localStorage: false, console: false, $: false */

var ConfigManager = (function () {
    function ConfigManager() {
        _classCallCheck(this, ConfigManager);
    }

    _createClass(ConfigManager, null, [{
        key: "setConfig",

        /**
         * sets a config data (in localStorage)
         * @param {string} item key used for storing in localStorage
         * @param {object} itemContent content which will be stored under that key
         * @param {number} expirySeconds in how many seconds will that key/value pair expire
         * @returns undefined
         */
        value: function setConfig(item, itemContent, expirySeconds) {
            if (!item || !item.length || !itemContent) return;
            ConfigManager.setExpiry(item, expirySeconds);
            localStorage.setItem(item, JSON.stringify(itemContent));
        }

        //augment a config object with passed by newContent

    }, {
        key: "assignToConfig",
        value: function assignToConfig(item, newContent) {
            if (!item || !item.length || !newContent) return;
            var currentConfig = ConfigManager.getConfig(item);
            if (currentConfig === null) return ConfigManager.setConfig(item, newContent);else if ((typeof currentConfig === "undefined" ? "undefined" : _typeof(currentConfig)) === "object") return ConfigManager.setConfig(item, Object.assign(currentConfig, newContent));
        }
        //increment or append data to a property of a config content

    }, {
        key: "addToConfigProperties",
        value: function addToConfigProperties(item, contentToAdd) {
            if (!item || !item.length || !contentToAdd || (typeof contentToAdd === "undefined" ? "undefined" : _typeof(contentToAdd)) !== "object") return;
            var currentConfig = ConfigManager.getConfig(item) || {};
            if ((typeof currentConfig === "undefined" ? "undefined" : _typeof(currentConfig)) === "object") {
                for (var key in contentToAdd) {
                    currentConfig[key] = currentConfig[key] ? currentConfig[key] + contentToAdd[key] : contentToAdd[key];
                }
                return ConfigManager.setConfig(item, currentConfig);
            }
        }
        //add an expiry timestamp for specific config item

    }, {
        key: "setExpiry",
        value: function setExpiry(item, expirySeconds) {
            if (typeof expirySeconds === "number") localStorage.setItem(item + ConfigManager.EXPIRY_SUFFIX, Date.now() + expirySeconds * 1000);
        }
    }, {
        key: "getExpiry",
        value: function getExpiry(item) {
            return parseInt(localStorage.getItem(item + ConfigManager.EXPIRY_SUFFIX));
        }
    }, {
        key: "removeExpiry",
        value: function removeExpiry(item) {
            return localStorage.removeItem(item + ConfigManager.EXPIRY_SUFFIX);
        }
    }, {
        key: "isExpired",
        value: function isExpired(item) {
            var expTimestamp = ConfigManager.getExpiry(item);
            if (expTimestamp) {
                return Date.now() - expTimestamp > 0;
            }
            return false;
        }
    }, {
        key: "getConfig",
        value: function getConfig(item) {
            if (!item || !item.length) return null;
            if (ConfigManager.isExpired(item)) ConfigManager.removeConfig(item);
            var content = localStorage.getItem(item);
            return content && JSON.parse(content);
        }
    }, {
        key: "removeConfig",
        value: function removeConfig(item) {
            if (!item || !item.length) return null;
            ConfigManager.removeExpiry(item);
            return localStorage.removeItem(item);
        }
    }, {
        key: "EXPIRY_SUFFIX",
        get: function get() {
            return "_EXPIRYDATE";
        }
    }]);

    return ConfigManager;
})();

exports.default = ConfigManager;