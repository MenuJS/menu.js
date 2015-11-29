/* global Menu, MenuItem */

var moduleExports = {
  Menu: Menu,
  MenuItem: MenuItem
};

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = moduleExports;
  }
  exports.Menu = moduleExports;

} else {
  this.Menu = moduleExports;
}
