/**
 * Created by guillaume lebedel on 18/12/15.
 * ConfigManager is a simple interface on top of localStorage to handle expiry of data
 * and easy storing of javascript objects.
 */

/*global localStorage: false, console: false, $: false */

export default class ConfigManager {
    static get EXPIRY_SUFFIX() {
        return ("_EXPIRYDATE");
    }

    /**
     * sets a config data (in localStorage)
     * @param {string} item key used for storing in localStorage
     * @param {object} itemContent content which will be stored under that key
     * @param {number} expirySeconds in how many seconds will that key/value pair expire
     * @returns undefined
     */
    static setConfig(item, itemContent, expirySeconds) {
        if (!item || !item.length || !itemContent)
            return;
        ConfigManager.setExpiry(item, expirySeconds);
        localStorage.setItem(item, JSON.stringify(itemContent));
    }

    //augment a config object with passed by newContent
    static assignToConfig(item, newContent){
        if (!item || !item.length || !newContent)
            return;
        let currentConfig = ConfigManager.getConfig(item);
        if (currentConfig === null)
            return ConfigManager.setConfig(item, newContent);
        else if (typeof currentConfig === "object")
            return ConfigManager.setConfig(item, Object.assign(currentConfig, newContent));
    }
    //increment or append data to a property of a config content
    static addToConfigProperties(item, contentToAdd){
        if (!item || !item.length || !contentToAdd || typeof contentToAdd !== "object")
            return;
        let currentConfig = ConfigManager.getConfig(item) || {};
        if (typeof currentConfig === "object") {
            for (let key in contentToAdd) {
                currentConfig[key] = currentConfig[key] ? currentConfig[key] + contentToAdd[key] : contentToAdd[key];
            }
            return ConfigManager.setConfig(item, currentConfig);
        }
    }
    //add an expiry timestamp for specific config item
    static setExpiry(item, expirySeconds) {
        if (typeof expirySeconds === "number")
            localStorage.setItem(item + ConfigManager.EXPIRY_SUFFIX, Date.now() + expirySeconds * 1000);
    }

    static getExpiry(item) {
        return parseInt(localStorage.getItem(item + ConfigManager.EXPIRY_SUFFIX));
    }
    static removeExpiry(item){
        return localStorage.removeItem(item + ConfigManager.EXPIRY_SUFFIX);
    }
    static isExpired(item) {
        let expTimestamp = ConfigManager.getExpiry(item);
        if (expTimestamp) {
            return ((Date.now() - expTimestamp) > 0);
        }
        return false;
    }

    static getConfig(item) {
        if (!item || !item.length)
            return null;
        if (ConfigManager.isExpired(item))
            ConfigManager.removeConfig(item);
        let content = localStorage.getItem(item);
        return content && JSON.parse(content);
    }

    static removeConfig(item) {
        if (!item || !item.length)
            return null;
        ConfigManager.removeExpiry(item);
        return localStorage.removeItem(item);
    }
}