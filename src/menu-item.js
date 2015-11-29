'use strict';

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
