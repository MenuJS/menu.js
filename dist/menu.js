(function(global){
  'use strict';
  /**
   * menu.js JavaScript Library
   * Released under the MIT license
   */

  /* global MenuItem */

  var Menu = function () {
    this._menuItems = {};
    this._toArray = function (items) {
      var arr = [];
      for (var key in items) {
        if (items.hasOwnProperty(key)) {
          arr.push(items[key]);
        }
      }
      return arr;
    };
  };

  /**
   * Recursively map a flat array of menu items to a nested object suitable to generate hierarchical HTML from.
   */
  Menu.prototype.buildAncestorChain = function (name, items, config) {
    var keys = name.split('.');
    if (name.length === 0 || keys.length === 0) {
      return;
    }
    var key = keys.shift();
    if (typeof items[key] === 'undefined') {
      items[key] = keys.length === 0 ? config : {};
      if (keys.length === 0) {
        items[key] = config;
      }
    }
    this.buildAncestorChain(keys.join('.'), items[key], config);
  };

  Menu.prototype.menuItemTree = function (menuName) {
    var items = {};
    var self = this;
    var menuItemsToTransform = {};
    if (typeof menuName !== 'undefined') {
      var menuNameRegex = new RegExp('^' + menuName + '.');
      for (var menuItemName in this._menuItems) {
        if (this._menuItems.hasOwnProperty(menuItemName)) {
          if (menuItemName.match(menuNameRegex) !== null) {
            menuItemsToTransform[menuItemName.replace(menuNameRegex, '')] = this._menuItems[menuItemName];
          }
        }
      }
    } else {
      menuItemsToTransform = this._menuItems;
    }
    for (var menuItemNameToTransform in menuItemsToTransform) {
      if (menuItemsToTransform.hasOwnProperty(menuItemNameToTransform)) {
        self.buildAncestorChain(menuItemNameToTransform, items, menuItemsToTransform[menuItemNameToTransform]);
      }
    }
    return this._toArray(items);
  };

  Menu.prototype.menuItem = function (name, config) {
    if (typeof config === 'undefined') {
      if (typeof this._menuItems[name] === 'undefined') {
        throw name + ' is not a menu item';
      }
      return this._menuItems[name];
    }
    this._menuItems[name] = new MenuItem(config);
    return this;
  };

  Menu.prototype.menuItems = function () {
    return this._menuItems;
  };

  /**
   * Borrowed from jQuery JavaScript Library v2.1.4
   * http://jquery.com/
   *
   * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
   * Released under the MIT license
   * http://jquery.org/license
   */

  var extend = function () {
    var options, name, src, copy, copyIsArray, clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;

    // Handle a deep copy situation
    if (typeof target === 'boolean') {
      deep = target;

      // Skip the boolean and the target
      target = arguments[i] || {};
      i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== 'object' && !jQuery.isFunction(target)) {
      target = {};
    }

    // Extend jQuery itself if only one argument is passed
    if (i === length) {
      target = this;
      i--;
    }

    for (; i < length; i++) {
      // Only deal with non-null/undefined values
      if ((options = arguments[i]) != null) {
        // Extend the base object
        for (name in options) {
          src = target[name];
          copy = options[name];

          // Prevent never-ending loop
          if (target === copy) {
            continue;
          }

          // Recurse if we're merging plain objects or arrays
          if (deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) )) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && jQuery.isArray(src) ? src : [];

            } else {
              clone = src && jQuery.isPlainObject(src) ? src : {};
            }

            // Never move original objects, clone them
            target[name] = jQuery.extend(deep, clone, copy);

            // Don't bring in undefined values
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }

    // Return the modified object
    return target;
  };

  /**
   * menu.js JavaScript Library
   * Released under the MIT license
   */

  /* global extend */

  var MenuItem = function (config) {
    this.weight = 0;
    extend(this, config);
  };

  MenuItem.prototype.children = function () {
    var children = [];
    for (var propertyName in this) {
      if (this.hasOwnProperty(propertyName)) {
        if (this[propertyName] !== null &&
          typeof this[propertyName] === 'object' &&
          this[propertyName] instanceof MenuItem) {
          children.push(this[propertyName]);
        }
      }
    }
    return children;
  };

  MenuItem.prototype.hasChildren = function () {
    return this.children().length > 0;
  };

  MenuItem.prototype.hasVisibleChildren = function () {
    return this.children().filter(function (child) {
        return child.isVisible() !== false;
      }).length > 0;
  };

  MenuItem.prototype.isVisible = function () {
    return true;
  };

  MenuItem.prototype.isHeavy = function () {
    if (this.hasOwnProperty('weight')) {
      return this.weight >= 0;
    }
  };

  /* global Menu, MenuItem, global */

  var moduleExports = {
    Menu: Menu,
    MenuItem: MenuItem
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = moduleExports;
    }
    exports.MenuJs = moduleExports;
  } else {
    global.MenuJs = moduleExports;
  }

})(this);