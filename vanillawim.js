(((window, undefined) => {
  'use strict';

  var document = window.document;

  // Flexible Add Event Listener
  // ===========================
  // by John Resig - http://ejohn.org/projects/flexible-javascript-events/
  function addEvent( obj, type, fn ) {
    if ( obj.addEventListener ) {
      obj.addEventListener( type, fn, false );
    } else if ( obj.attachEvent ) {
      obj[ 'e' + type + fn ] = fn;
      obj[ type + fn ] = () => {
        obj[ 'e' + type + fn ]( window.event );
      };
      obj.attachEvent( "on" + type, obj[ type + fn ] );
    }
  }


  // Get computed styles.
  // ====================
  var defaultView = document.defaultView;
  var getStyles = defaultView && defaultView.getComputedStyle ?
    element => defaultView.getComputedStyle(element, null) :
    element => element.currentStyle;


  // Returns the width of an element, like getting width().
  // Fallback to computed width, then uncomputed CSS if necessary.
  // =============================================================
  // Refactored from jQuery & Masonry
  function getWidth(element) {
    var value = element.offsetWidth;
    var computedStyle = getStyles(element);
    var paddingLeft = parseFloat(computedStyle['paddingLeft']) || 0;
    var paddingRight = parseFloat(computedStyle['paddingRight']) || 0;
    var borderLeft = parseFloat(computedStyle['borderLeftWidth']) || 0;
    var borderRight = parseFloat(computedStyle['borderRightWidth']) || 0;

    if (0 < value) {
      value -= paddingLeft + paddingRight + borderLeft + borderRight;
    } else {
      value = computedStyle['width'];

      if (value < 0 || value === null) {
        value = element.style.width || 0;
      }

      value = parseFloat(value) || 0;
    }

    return value;
  }

  // VanillaWim
  // ==========
  function VanillaWim(selector, options) {
    if (!selector) {
      return;
    }

    this.init_(selector, options);
  }

  VanillaWim.defaults = {
    maxWidth: 9999,
    minWidth: 1,
    maxFont: 9999,
    minFont: 1,
    fontRatio: 35,
    lineHeight: 1.45 // unitless line-height
  };

  VanillaWim.prototype.update = function() {
    for (var i = 0, l = this.elements.length; i < l; i++) {
      var element = this.elements[i];
      var elWidth = getWidth(element);
      var width = Math.max(Math.min(this.options.maxWidth, elWidth), this.options.minWidth);
      var fontBase = ~~(width / this.options.fontRatio);
      var fontSize = Math.max(Math.min(this.options.maxFont, fontBase), this.options.minFont);

      element.style.fontSize = fontSize + 'px';
      element.style.lineHeight = this.options.lineHeight;
    }
  };

  VanillaWim.prototype.init_ = function(selector, options) {
    var self = this;

    this.elements = document.querySelectorAll(selector);
    this.options = {};

    for (var prop in VanillaWim.defaults) {
      this.options[prop] = VanillaWim.defaults[prop];
    }

    for (prop in options) {
      this.options[prop] = options[prop];
    }

    this.update();
    addEvent(window, 'resize', () => {
      self.update();
    });
  };

  window.VanillaWim = VanillaWim;
}))(window);
