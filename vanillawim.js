/**
 * Stefanie Hatcher
 * Vanilla Javascript Flexible Type.
 * IE 8+, FF 3.5+, Chrome 4+, Android 2.1+
 */
(function(window, undefined) {
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
      obj[ type + fn ] = function() {
        obj[ 'e' + type + fn ]( window.event );
      };
      obj.attachEvent( "on" + type, obj[ type + fn ] );
    }
  }


  // Get computed styles.
  // ===================
  // https://raw.github.com/desandro/vanilla-masonry/master/masonry.js
  var defaultView = document.defaultView;
  var getStyles = defaultView && defaultView.getComputedStyle ?
    function(element) {
      return defaultView.getComputedStyle( element, null );
    } :
    function(element) {
      return element.currentStyle;
    };


  // Returns the width of an element, like getting width().
  // Fallback to computed width, then uncomputed CSS if necessary.
  // ==========
  // Refactored from jQuery
  function getWidth(element) {
    var value = element.offsetWidth,
        computedStyle = getStyles(element),
        paddingLeft = parseFloat(computedStyle['paddingLeft']) || 0,
        paddingRight = parseFloat(computedStyle['paddingRight']) || 0,
        borderLeft = parseFloat(computedStyle['borderLeftWidth']) || 0,
        borderRight = parseFloat(computedStyle['borderRightWidth']) || 0;

    if (value > 0) {
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
  // ============
  function VanillaWim(selector, options) {
    if (!selector) {
      return;
    }

    this.init_(selector, options);
  }

  VanillaWim.defaults = {
    max: 9999,
    min: 1,
    maxFont: 9999,
    minFont: 1,
    fontRatio: 35,
    lineRatio: 1.45
  };

  VanillaWim.prototype.update = function() {
    for (var i = 0, l = this.elements.length; i < l; i++) {
      var el = this.elements[i],
          elw = getWidth(el),
          width = Math.max(Math.min(this.options.max, elw), this.options.min),
          fontBase = ~~(width / this.options.fontRatio),
          fontSize = Math.max(Math.min(this.options.maxFont, fontBase), this.options.minFont);

      el.style.fontSize = fontSize + 'px';
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

    for (var i = 0, l = this.elements.length; i < l; i++) {
      var el = this.elements[i],
          elw = getWidth(el),
          width = Math.max(Math.min(this.options.max, elw), this.options.min),
          fontBase = ~~(width / this.options.fontRatio),
          fontSize = Math.max(Math.min(this.options.maxFont, fontBase), this.options.minFont);

      // populate unitless line-height
      el.style.lineHeight = this.options.lineRatio;
    }

    this.update();

    addEvent(window, 'resize', function() {
      self.update();
    });
  }

  window.VanillaWim = VanillaWim;
})(window);
