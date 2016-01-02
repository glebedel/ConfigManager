
# ConfigManager
ConfigManager is a simple interface on top of browsers' ```localStorage``` to handle expiry of data and easy storing of javascript objects.

This library uses localStorage and if localStorage is not present, it will throw errors.  You can find a pollyfill for local storage [on mdn](https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage)

The tests are under the ```__tests__``` folder and created using jest. You can launch them with ```npm test``` command. 
<br/>

## Creating and modifying a config

These are the few operations you can make with ConfigManager to set-up a config (item stored in localStorage)
<br/>

### Install and use in your project

```
npm install --save localstorage-configmanager
```
### Set a javascript variable into configuration:

```javascript
let config = {name:"Guillaume Lebedel", age:99};
ConfigManager.setConfig("myConfig", config);
```

### Get back the configuration data:

```javascript
ConfigManager.getConfig("myConfig");
//Object {name: "Guillaume Lebedel", age: 99}
```

### Augmenting or incrementing config data:

You can augment/assign your config with another javascript object

```javascript
ConfigManager.assignToConfig("myConfig", {age:24});
ConfigManager.addToConfigProperties("myConfig", {age:1});
ConfigManager.getConfig("myConfig");
//Object {name: "Guillaume Lebedel", age: 25}
```

### Remove the configuration

```javascript
ConfigManager.removeConfig("myConfig");
ConfigManager.getConfig("myConfig");
//null
```

<br/>

## Expiry

You can set an expiry time in seconds to your configs upon creation or later on.
When the config is required after it has expired, it will return ```null```.
<br/>

### Create a config with an expiry time

```javascript
ConfigManager.setConfig("myConfig", {a:1}, 5) //expires in 5 seconds
```

### Or Set an expiry date after creating the store

```javascript
ConfigManager.setExpiry("myConfig", 20) //expires in 20 seconds
```

### Which you can get:

```javascript
ConfigManager.getExpiry("myConfig");
```

### You can also verify how many seconds are left until expiry

```javascript
ConfigManager.getSecondsUntilExpiry("myConfig");
//20
```
