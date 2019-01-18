/**
 * videojs-flvjs
 * @version 0.2.1
 * @copyright 2019 mister-ben <git@misterben.me>
 * @license Apache-2.0
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.videojsFlvjs = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _video = _interopRequireDefault((typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return _get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Html5 = _video.default.getTech('Html5');

var mergeOptions = _video.default.mergeOptions || _video.default.util.mergeOptions;
var defaults = {
  mediaDataSource: {},
  config: {}
};

var Flvjs =
/*#__PURE__*/
function (_Html) {
  _inherits(Flvjs, _Html);

  /**
   * Create an instance of this Tech.
   *
   * @param {Object} [options]
   *        The key/value store of player options.
   *
   * @param {Component~ReadyCallback} ready
   *        Callback function to call when the `Flvjs` Tech is ready.
   */
  function Flvjs(options, ready) {
    _classCallCheck(this, Flvjs);

    options = mergeOptions(defaults, options);
    return _possibleConstructorReturn(this, (Flvjs.__proto__ || Object.getPrototypeOf(Flvjs)).call(this, options, ready));
  }
  /**
   * A getter/setter for the `Flvjs` Tech's source object.
   *
   * @param {Tech~SourceObject} [src]
   *        The source object you want to set on the `Flvjs` techs.
   *
   * @return {Tech~SourceObject|undefined}
   *         - The current source object when a source is not passed in.
   *         - undefined when setting
   */


  _createClass(Flvjs, [{
    key: "setSrc",
    value: function setSrc(src) {
      if (this.flvPlayer) {
        // Is this necessary to change source?
        this.flvPlayer.detachMediaElement();
        this.flvPlayer.destroy();
      }

      var mediaDataSource = this.options_.mediaDataSource;
      var config = this.options_.config;
      mediaDataSource.type = mediaDataSource.type === undefined ? 'flv' : mediaDataSource.type;
      mediaDataSource.url = src;
      this.flvPlayer = window.flvjs.createPlayer(mediaDataSource, config);
      this.flvPlayer.attachMediaElement(this.el_);
      this.flvPlayer.load();
    }
    /**
     * Dispose of flvjs.
     */

  }, {
    key: "dispose",
    value: function dispose() {
      if (this.flvPlayer) {
        this.flvPlayer.detachMediaElement();
        this.flvPlayer.destroy();
      }

      _get(Flvjs.prototype.__proto__ || Object.getPrototypeOf(Flvjs.prototype), "dispose", this).call(this);
    }
  }]);

  return Flvjs;
}(Html5);
/**
 * Check if the Flvjs tech is currently supported.
 *
 * @return {boolean}
 *          - True if the Flvjs tech is supported.
 *          - False otherwise.
 */


Flvjs.isSupported = function () {
  return window.flvjs && window.flvjs.isSupported();
};
/**
 * Flvjs supported mime types.
 *
 * @constant {Object}
 */


Flvjs.formats = {
  'video/flv': 'FLV',
  'video/x-flv': 'FLV'
};
/**
 * Check if the tech can support the given type
 *
 * @param {string} type
 *        The mimetype to check
 * @return {string} 'probably', 'maybe', or '' (empty string)
 */

Flvjs.canPlayType = function (type) {
  if (Flvjs.isSupported() && type in Flvjs.formats) {
    return 'maybe';
  }

  return '';
};
/**
 * Check if the tech can support the given source
 * @param {Object} srcObj
 *        The source object
 * @param {Object} options
 *        The options passed to the tech
 * @return {string} 'probably', 'maybe', or '' (empty string)
 */


Flvjs.canPlaySource = function (srcObj, options) {
  return Flvjs.canPlayType(srcObj.type);
}; // Include the version number.


Flvjs.VERSION = '0.2.1';

_video.default.registerTech('Flvjs', Flvjs);

var _default = Flvjs;
exports.default = _default;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});