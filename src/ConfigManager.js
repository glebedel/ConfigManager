/**
 * Created by guillaume lebedel on 18/12/15.
 */

/*global localStorage: false, console: false, $: false */

export default class ConfigManager {
    static get EXPIRY_SUFFIX() {
        return ("_EXPIRYDATE");
    }

    //set the javascript content in localstorage
    static setConfig(item, itemContent, expirySeconds) {
        if (!item || !item.length || !itemContent)
            return;
        ConfigManager.setExpiry(item, expirySeconds);
        return localStorage.setItem(item, JSON.stringify(itemContent));
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