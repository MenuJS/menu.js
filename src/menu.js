'use strict';
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
