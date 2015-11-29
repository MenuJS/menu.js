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
