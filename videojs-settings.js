/*! @name @guaclive/videojs-settings @version 0.0.0 @license MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('video.js')) :
  typeof define === 'function' && define.amd ? define(['video.js'], factory) :
  (global = global || self, global.videojsSettings = factory(global.videojs));
}(this, (function (videojs) { 'use strict';

  videojs = videojs && Object.prototype.hasOwnProperty.call(videojs, 'default') ? videojs['default'] : videojs;

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  var assertThisInitialized = _assertThisInitialized;

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  var inheritsLoose = _inheritsLoose;

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var _extends_1 = createCommonjsModule(function (module) {
  function _extends() {
    module.exports = _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  module.exports = _extends;
  });

  (function(window, vjs){
  vjs.utils = vjs.utils||{};

  function local_storage_init(){
      // Cookie functions from
      // https://developer.mozilla.org/en-US/docs/DOM/document.cookie
      function get_cookie_item(key){
          if (!key || !has_cookie_item(key))
              return null;
          var reg_ex = new RegExp('(?:^|.*;\\s*)'
          +window.escape(key).replace(/[\-\.\+\*]/g, '\\$&')
          +'\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*');
          return window.unescape(document.cookie.replace(reg_ex, '$1'));
      }
      function set_cookie_item(key, value, end, path, domain, secure){
          if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key))
              return;
          var expires = '';
          if (end)
          {
              switch (end.constructor)
              {
              case Number:
                  expires = end===Infinity
                      ? '; expires=Tue, 19 Jan 2038 03:14:07 GMT'
                      : '; max-age=' + end;
                  break;
              case String:
                  expires = '; expires=' + end;
                  break;
              case Date:
                  expires = '; expires=' + end.toGMTString();
                  break;
              }
          }
          document.cookie = window.escape(key)+'='+window.escape(value)+
              expires+(domain ? '; domain='+domain : '')+
              (path ? '; path=' + path : '')+
              (secure ? '; secure' : '');
      }
      function has_cookie_item(key){
          return (new RegExp('(?:^|;\\s*)'
              +window.escape(key).replace(/[\-\.\+\*]/g, '\\$&')+'\\s*\\=')
          ).test(document.cookie);
      }
      function has_local_storage(){
          try {
              window.localStorage.setItem('vjs-storage-test', 'value');
              window.localStorage.removeItem('vjs-storage-test');
              return true;
          } catch(e){ return false; }
      }
      vjs.utils.localStorage = has_local_storage() ? window.localStorage : {
          getItem: get_cookie_item,
          setItem: function(key, value){
              set_cookie_item(key, value, Infinity, '/');
          }
      };
  }
  local_storage_init();

  })(window, window.videojs);

  var version = "0.0.0";

  var Component = videojs.getComponent('Component');
  var Overlay = videojs.extend(Component, {
    constructor: function constructor(player, options) {
      Component.call(this, player, options);
      this.hide();
    },
    createEl: function createEl(type, props) {
      var custom_class = this.options_['class'];
      custom_class = custom_class ? ' ' + custom_class : '';
      var proto_component = Component.prototype;
      var container = proto_component.createEl.call(this, 'div', videojs.mergeOptions({
        className: 'vjs-info-overlay' + custom_class
      }, props));
      this.createContent(container);
      return container;
    },
    createContent: function createContent() {}
  });
  videojs.registerComponent('Overlay', Overlay);

  var Component$1 = videojs.getComponent('Component');
  var Overlay$1 = videojs.getComponent('Overlay');

  function round(val) {
    if (typeof val != 'number') {
      return val;
    }

    return val.toFixed(3);
  }

  var InfoOverlay = videojs.extend(Overlay$1, {
    constructor: function constructor(player, options) {
      this.updateInterval = null;
      this.info_data = {
        videoResolution: {
          units: '',
          title: player.localize('Video Resolution'),
          get: function get(p) {
            return p.videoWidth() + "x" + p.videoHeight();
          }
        },
        displayResolution: {
          units: '',
          title: player.localize('Display Resolution'),
          get: function get(p) {
            return p.currentWidth() + "x" + p.currentHeight();
          }
        },
        droppedFrames: {
          units: '',
          title: player.localize('Dropped frames'),
          get: function get(p) {
            var videoPlaybackQuality = p.getVideoPlaybackQuality();

            if (videoPlaybackQuality) {
              return videoPlaybackQuality.droppedVideoFrames + "/" + videoPlaybackQuality.totalVideoFrames;
            } else {
              return '--';
            }
          }
        },
        duration: {
          units: 'sec',
          title: player.localize('Duration'),
          get: function get(p) {
            return round(p.duration());
          }
        },
        position: {
          units: 'sec',
          title: player.localize('Position'),
          get: function get(p) {
            return round(p.currentTime());
          }
        },
        buffered: {
          units: 'sec',
          title: player.localize('Current buffer'),
          get: function get(p) {
            var range = p.buffered();
            var pos = p.currentTime();

            if (range && range.length) {
              for (var i = 0; i < range.length; i++) {
                if (range.start(i) <= pos && range.end(i) >= pos) return round(range.end(i) - pos);
              }
            }

            return '--';
          }
        },
        downloaded: {
          units: 'sec',
          title: player.localize('Downloaded'),
          get: function get(p) {
            var range = p.buffered();
            var buf_sec = 0;

            if (range && range.length) {
              for (var i = 0; i < range.length; i++) {
                buf_sec += range.end(i) - range.start(i);
              }
            }

            return round(buf_sec);
          }
        },
        vjs_version: {
          units: '',
          title: player.localize('VideoJS Version'),
          get: function get() {
            return window.videojs.VERSION;
          }
        },
        stream_uri: {
          units: '',
          title: player.localize('Stream URI'),
          get: function get(p) {
            return p.cache_.src;
          }
        }
      };
      Overlay$1.call(this, player, options);
    },
    createContent: function createContent(container) {
      var _this = this;

      var player = this.player_;

      function create_el(el, opt) {
        opt = opt ? videojs.mergeOptions(opt) : opt;
        var proto_component = Component$1.prototype;
        return proto_component.createEl.call(_this, el, opt);
      }

      var title = create_el('div', {
        className: 'vjs-info-overlay-title',
        innerHTML: player.localize('Video Stats')
      });
      var close_btn = create_el('div', {
        className: 'vjs-info-overlay-x'
      });
      var close = this.toggle.bind(this, null, true);
      close_btn.addEventListener('click', close);
      close_btn.addEventListener('touchend', close);
      var content = create_el('div', {
        className: 'vjs-info-overlay-content'
      });
      var list = create_el('ul', {
        className: 'vjs-info-overlay-list'
      });
      var item;
      var title_text;

      for (var i in this.info_data) {
        item = create_el('li', {
          className: 'vjs-info-overlay-list-item'
        });
        title_text = player.localize(this.info_data[i].title);
        if (this.info_data[i].units) title_text += ' [' + player.localize(this.info_data[i].units) + ']';
        title_text += ': ';
        item.appendChild(create_el('strong', {
          innerHTML: title_text
        }));
        this.info_data[i].el = create_el('span');
        item.appendChild(this.info_data[i].el);
        list.appendChild(item);
      }

      content.appendChild(list);
      container.appendChild(title);
      container.appendChild(close_btn);
      container.appendChild(content);
      this.update();
      player.on('timeupdate', this.update.bind(this)); // force updates when player is paused

      this.updateInterval = setInterval(this.update.bind(this), 2000);
    },
    update: function update() {
      var player = this.player_;
      var info = this.info_data;

      for (var i in info) {
        info[i].el.innerHTML = info[i].get(player);
      }
    },
    toggle: function toggle(caller, hide) {
      if (caller) this.last_caller = caller;

      if (this.visible || hide) {
        this.visible = false;
        if (this.last_caller) this.last_caller.selected(false);
        this.addClass('vjs-hidden');
        return;
      }

      this.update();
      this.visible = true;
      this.removeClass('vjs-hidden');
    },
    dispose: function dispose() {
      if (this.updateInterval !== null) {
        clearInterval(this.updateInterval);
      }

      this.player_.off('timeupdate');
    }
  });
  videojs.registerComponent('InfoOverlay', InfoOverlay);

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var defineProperty = _defineProperty;

  var Menu = videojs.getComponent('Menu');
  var MenuItem = videojs.getComponent('MenuItem');
  var Component$2 = videojs.getComponent('Component');

  var PoweredBy = /*#__PURE__*/function (_MenuItem) {
    inheritsLoose(PoweredBy, _MenuItem);

    function PoweredBy(player, options) {
      var _this2;

      _this2 = _MenuItem.call(this, player, options) || this;
      var ver = options.version;
      if (ver) options.label += ' ' + ver;
      MenuItem.call(assertThisInitialized(_this2), player, options);

      _this2.addClass('vjs-powered-by');

      return _this2;
    }

    return PoweredBy;
  }(MenuItem);

  var ReportButton = /*#__PURE__*/function (_MenuItem2) {
    inheritsLoose(ReportButton, _MenuItem2);

    function ReportButton() {
      return _MenuItem2.apply(this, arguments) || this;
    }

    var _proto = ReportButton.prototype;

    _proto.handleClick = function handleClick() {
      this.player_.trigger('guac-report');
    };

    return ReportButton;
  }(MenuItem);

  var InfoButton = /*#__PURE__*/function (_MenuItem3) {
    inheritsLoose(InfoButton, _MenuItem3);

    function InfoButton() {
      return _MenuItem3.apply(this, arguments) || this;
    }

    var _proto2 = InfoButton.prototype;

    _proto2.handleClick = function handleClick() {
      var overlay;

      if (overlay = this.player_.getChild('InfoOverlay')) {
        overlay.toggle(this);
      }
    };

    return InfoButton;
  }(MenuItem);
  var PopupMenu = /*#__PURE__*/function (_Menu) {
    inheritsLoose(PopupMenu, _Menu);

    function PopupMenu(player, options) {
      var _this3;

      _this3 = _Menu.call(this, player, options) || this;

      defineProperty(assertThisInitialized(_this3), "className", 'vjs-rightclick-popup');

      defineProperty(assertThisInitialized(_this3), "popped", false);

      _this3.addClass(_this3.className);

      _this3.hide();

      var _this = assertThisInitialized(_this3);

      var opt = _this3.options_;
      _this.menuEnabled = true;

      _this3.addChild(new PoweredBy(player, {
        label: opt.poweredBy,
        version: opt.version
      }));

      if (opt.report) {
        opt.report = videojs.mergeOptions({
          label: _this3.localize('Report Stream')
        }, opt.report);

        _this3.addChild(new ReportButton(player, opt.report));
      }

      if (opt.info) {
        opt.info = videojs.mergeOptions({
          label: _this3.localize('Video Stats')
        }, opt.info);

        _this3.addChild(new InfoButton(player, opt.info));
      }

      function get_overflow_parent(el) {
        var parent = el;

        while (parent = parent.parentElement) {
          if (!parent) {
            return;
          }

          var style = window.getComputedStyle(parent);

          if (style.overflowX != 'visible' || style.overflowY != 'visible') {
            return parent;
          }
        }
      }

      function oncontextmenu(evt) {
        evt.preventDefault();
        if (_this.popped) return void _this.hide();

        _this.show();

        _this.check_items();

        var el = _this.el(),
            x = evt.clientX,
            y = evt.clientY;

        var max_right = window.innerWidth;
        var max_bottom = window.innerHeight;
        var parent = get_overflow_parent(el);

        if (parent) {
          var parent_rect = parent.getBoundingClientRect();
          max_right = Math.min(max_right, parent_rect.right);
          max_bottom = Math.min(max_bottom, parent_rect.bottom);
        }

        var left_shift = x + el.offsetWidth - max_right + 5;
        left_shift = Math.max(0, left_shift);
        var top_shift = y + el.offsetHeight - max_bottom + 5;
        top_shift = Math.max(0, top_shift);

        var rect = _this.player().el().getBoundingClientRect();

        el.style.left = Math.max(0, x - rect.left - left_shift) + 'px';
        el.style.top = Math.max(0, y - rect.top - top_shift) + 'px';
      }

      player.on('contextmenu', oncontextmenu);
      player.on(['tap', 'click'], function (evt) {
        if (_this.popped) {
          _this.hide();

          evt.stopPropagation();
          evt.preventDefault();
          return false;
        }
      });
      videojs.on(document, ['tap', 'click'], function () {
        if (_this.popped) _this.hide();
      });
      player.on('guac.wrapper_attached', _this3.check_items.bind(assertThisInitialized(_this3)));
      player.on('guac.wrapper_detached', _this3.check_items.bind(assertThisInitialized(_this3)));

      _this3.children().forEach(function (item) {
        item.on(['tap', 'click'], function () {
          _this.hide();
        });
      });

      player.enablePopupMenu = function () {
        if (!_this.menuEnabled) {
          player.off('contextmenu');
          player.on('contextmenu', oncontextmenu);
          _this.menuEnabled = true;
        }
      };

      player.disablePopupMenu = function () {
        if (_this.menuEnabled) {
          player.off('contextmenu');
          player.on('contextmenu', function (evt) {
            evt.preventDefault();
          });
          _this.menuEnabled = false;
        }
      };

      return _this3;
    }

    var _proto3 = PopupMenu.prototype;

    _proto3.createEl = function createEl() {
      this.contentEl_ = videojs.dom.createEl('ul', {
        className: 'vjs-menu-content'
      });
      this.contentEl_.setAttribute('role', 'menu');
      var el = Component$2.prototype.createEl('div', {
        append: this.contentEl_,
        className: 'vjs-menu'
      });
      el.setAttribute('role', 'presentation');
      el.appendChild(this.contentEl_);

      var _this = this;

      videojs.on(el, 'click', function (event) {
        _this.hide();

        event.preventDefault();
        event.stopImmediatePropagation();
      });
      return el;
    };

    _proto3.show = function show() {
      this.removeClass('vjs-hidden');
      this.popped = true;
    };

    _proto3.hide = function hide() {
      this.addClass('vjs-hidden');
      this.popped = false;
    };

    _proto3.check_items = function check_items() {
      this.children().forEach(function (item) {
        if (item.is_visible) item.toggleClass('vjs-hidden', !item.is_visible());
      });
    };

    return PopupMenu;
  }(Menu);
  videojs.registerComponent('PopupMenu', PopupMenu);

  var Menu$1 = videojs.getComponent('Menu');
  var MenuItem$1 = videojs.getComponent('MenuItem');
  var Component$3 = videojs.getComponent('Component');
  var SubMenu = videojs.extend(Menu$1, {
    addToMain: true,
    constructor: function constructor(player, options, parent) {
      Menu$1.call(this, player, options);
      this.items = [];
      this.parent = parent;
      this.createMenuItem();
      this.createTitleItem();

      if (this.className) {
        this.addClass(this.className);
      }

      this.update();
    },
    createEl: function createEl() {
      var el = Component$3.prototype.createEl.call(this, 'div', {
        className: 'vjs-menu-content'
      });
      el.setAttribute('role', 'menu');
      return el;
    },
    createTitleItem: function createTitleItem() {
      if (!this.title) {
        return;
      }

      var _this = this;

      var title = new MenuItem$1(this.player_, {
        label: this.title
      });
      title.addClass('vjs-submenu-title');
      title.on(['tap', 'click'], function () {
        _this.parent.back();
      });
      this.addChild(title);
      this.titleItem = title;
    },
    createMenuItem: function createMenuItem() {
      if (!this.title || !this.addToMain || typeof this.title == 'undefined') {
        return;
      }

      var player = this.player(),
          _this = this;

      var item = this.menuItem = new MenuItem$1(player, {
        label: this.title
      });
      item.addClass('vjs-menu-item-next');
      var span = videojs.dom.createEl('span', {
        className: 'vjs-menu-item-content'
      });
      item.minorLabel = videojs.dom.createEl('span', {
        className: 'vjs-minor-label'
      });
      item.contentLabel = videojs.dom.createEl('span');
      span.appendChild(item.contentLabel);
      span.appendChild(item.minorLabel);
      item.el().insertBefore(span, item.el().firstChild);
      item.on(['tap', 'click'], function () {
        _this.parent.next(_this);
      });
    },
    update: function update() {
      var _this2 = this;

      this.items.forEach(function (item) {
        _this2.removeChild(item);
      });
      this.items = [];

      if (this.createItems) {
        this.createItems();
      }

      this.items.forEach(function (item) {
        _this2.addChild(item);

        if (_this2.handleItemClick) {
          item.on(['tap', 'click'], _this2.handleItemClick.bind(_this2, item));
        }
      });
    }
  });
  videojs.registerComponent('SubMenu', SubMenu);

  var SubMenu$1 = videojs.getComponent('SubMenu');
  var MenuItem$2 = videojs.getComponent('MenuItem');
  var QualityMenuItem = videojs.extend(MenuItem$2, {
    constructor: function constructor(player, options) {
      options = videojs.mergeOptions({
        selectable: true,
        selected: options.active || false
      }, options);
      MenuItem$2.call(this, player, options);
    },
    handleClick: function handleClick(event) {
      MenuItem$2.prototype.handleClick.call(this, event);
      this.player().trigger('qualityRequested', this.options_.source);
    }
  });
  videojs.registerComponent('QualityMenuItem', QualityMenuItem);
  var QualitySubMenu = videojs.extend(SubMenu$1, {
    className: 'vjs-quality-submenu',
    title: 'Quality',
    sources: [],
    currentSource: '',
    constructor: function constructor(player, options, parent) {
      SubMenu$1.call(this, player, options, parent);

      var _this = this;

      this.title = player.localize('Quality');
      player.on('qualityRequested', function (event, newSource) {
        _this.updateCurrentSource(event, newSource);
      }); // Update the list of menu items only when the list of sources change

      player.on('playerSourcesChanged', function () {
        this.update();
      }.bind(this)); // Update the selected source with the source that was actually selected

      player.on('qualitySelected', function (event, newSource) {
        _this.updateCurrentSource(event, newSource);
      }.bind(this)); // Since it's possible for the player to get a source before the selector is
      // created, make sure to update once we get a "ready" signal.

      player.one('ready', function () {
        this.currentSource = player.src();
        this.update();
      }.bind(this));
    },
    createItems: function createItems() {
      var _this2 = this;

      this.player().currentSources().forEach(function (source) {
        var item = new QualityMenuItem(_this2.player(), {
          active: source.src === _this2.currentSource,
          label: _this2.localize(source.label),
          src: source.src,
          callback: _this2.handleClick,
          source: source
        });
        console.log(item);

        if (item.options_.active) {
          _this2.menuItem.minorLabel.innerHTML = _this2.localize(source.label);
        }

        _this2.items.push(item);
      });
    },
    updateCurrentSource: function updateCurrentSource(event, source) {
      this.menuItem.minorLabel.innerHTML = this.localize(source.label);
      this.currentSource = source.src;
      this.update();
    }
  });
  videojs.registerComponent('QualitySubMenu', QualitySubMenu);

  var SubMenu$2 = videojs.getComponent('SubMenu');
  var MenuItem$3 = videojs.getComponent('MenuItem');
  var Component$4 = videojs.getComponent('Component');
  var ExtendedSubMenu = videojs.extend(SubMenu$2, {
    className: 'vjs-select-value-submenu',
    title: '',
    addToMain: true,
    menuItems: [],
    constructor: function constructor(player, options, parent) {
      SubMenu$2.call(this, player, options, parent);
    },
    createEl: function createEl() {
      var el = Component$4.prototype.createEl.call(this, 'div', {
        className: 'vjs-menu-content'
      });
      el.setAttribute('role', 'menu');
      return el;
    },
    createTitleItem: function createTitleItem() {},
    createMenuItem: function createMenuItem() {
      this.menuItems = [];

      if (this.options_.popout) {
        this.createMenuItemInternal('Popout', 'guac-popout');
      }

      if (this.options_.report) {
        this.createMenuItemInternal('Report', 'guac-report');
      }

      if (this.options_.info) {
        this.createMenuItemInternal('Video Stats', 'guac-info-overlay');
      }
    },
    createMenuItemInternal: function createMenuItemInternal(title, event) {
      var player = this.player();
      var item = new MenuItem$3(player, {
        label: this.player().localize(title)
      });
      var span = videojs.dom.createEl('span', {
        className: 'vjs-menu-item-content'
      });
      item.minorLabel = videojs.dom.createEl('span', {
        className: 'vjs-minor-label'
      });
      item.contentLabel = videojs.dom.createEl('span');
      span.appendChild(item.contentLabel);
      span.appendChild(item.minorLabel);
      item.el().insertBefore(span, item.el().firstChild);
      item.on(['tap', 'click'], function () {
        this.player().trigger(event);
      });
      this.menuItems.push(item);
    }
  });
  videojs.registerComponent('ExtendedSubMenu', ExtendedSubMenu);

  var Menu$2 = videojs.getComponent('Menu');
  var Component$5 = videojs.getComponent('Component');
  var SettingsMenu = /*#__PURE__*/function (_Menu) {
    inheritsLoose(SettingsMenu, _Menu);

    function SettingsMenu(player, options, settings_button) {
      var _this2;

      _this2 = _Menu.call(this, player, options) || this;

      defineProperty(assertThisInitialized(_this2), "className", 'vjs-settings-menu');

      defineProperty(assertThisInitialized(_this2), "history", []);

      _this2.settings_button = settings_button;

      _this2.addClass(_this2.className);

      _this2.update();

      _this2.on(['tap', 'click', 'touchstart', 'touchend'], function (event) {
        event.stopPropagation();
      });

      return _this2;
    }

    var _proto = SettingsMenu.prototype;

    _proto.createEl = function createEl() {
      var el = Component$5.prototype.createEl.call(this, 'div', {
        className: 'vjs-menu'
      });
      el.setAttribute('role', 'presentation');
      return el;
    };

    _proto.update = function update() {
      this.children().forEach(this.removeChild.bind(this));
      this.createItems();
    };

    _proto.addSubMenu = function addSubMenu(menu) {
      var _this3 = this;

      this.addChild(menu);
      if (menu.menuItem) this.mainMenu.addChild(menu.menuItem);

      if (menu.menuItems) {
        menu.menuItems.forEach(function (item) {
          _this3.mainMenu.addChild(item);
        });
      }
    };

    _proto.createItems = function createItems() {
      this.mainMenu = new SubMenu(this.player_, this.options_, this);
      this.mainMenu.addClass('vjs-main-submenu');
      this.addChild(this.mainMenu);
      var menus = [];

      if (this.options_.quality) {
        menus.push(QualitySubMenu);
      }

      menus.push(ExtendedSubMenu);

      for (var i = 0; i < menus.length; i++) {
        this.addSubMenu(new menus[i](this.player_, this.options_, this));
      }

      this.selectMain(true);
    };

    _proto.selectMain = function selectMain(no_transition) {
      this.history = [];
      this.setActive(this.mainMenu, no_transition);
    };

    _proto.show = function show(visible) {
      if (visible) {
        this.el_.style.height = '';
        this.el_.style.width = '';
        this.selectMain(true);
        this.addClass('vjs-lock-showing');
        return;
      }

      var _this = this;

      this.el_.style.opacity = '0';
      this.setTimeout(function () {
        this.el_.style.opacity = '';

        _this.removeClass('vjs-lock-showing');
      }, 100);
    };

    _proto.getSize = function getSize(el) {
      el = el || this.el_;
      return {
        width: el.offsetWidth,
        height: el.offsetHeight
      };
    };

    _proto.setSize = function setSize(size) {
      this.el_.style.height = size ? size.height + 'px' : '';
      this.el_.style.width = size ? size.width + 'px' : '';
    };

    _proto.setActive = function setActive(menu, no_transition) {
      if (!no_transition && window.requestAnimationFrame) {
        var menu_el = menu.el();
        menu_el.style.maxHeight = this.player().el().offsetHeight - 5 + 'px';

        var _this = this,
            new_size = this.getSize(menu_el);

        this.setSize(this.getSize());
        window.requestAnimationFrame(function () {
          _this.addClass('vjs-size-transition');

          window.requestAnimationFrame(function () {
            var on_end = function on_end() {
              _this.removeClass('vjs-size-transition');

              _this.setSize();

              _this.clearTimeout(timeout);
            };

            _this.setSize(new_size);

            _this.one('transitionend', on_end);

            var timeout = _this.setTimeout(on_end, 300);
          });
        });
      }

      this.active = menu;
      this.children().forEach(function (item) {
        item.toggleClass('vjs-active-submenu', item == menu);
      });
    };

    _proto.next = function next(menu) {
      this.history.push(this.active);
      this.setActive(menu);
    };

    _proto.back = function back() {
      this.setActive(this.history.pop() || this.mainMenu);
    };

    return SettingsMenu;
  }(Menu$2);
  videojs.registerComponent('SettingsMenu', SettingsMenu);

  var MenuButton = videojs.getComponent('MenuButton');
  var Component$6 = videojs.getComponent('Component');
  var SettingsButton = /*#__PURE__*/function (_MenuButton) {
    inheritsLoose(SettingsButton, _MenuButton);

    function SettingsButton(player, options) {
      var _this2;

      _this2 = _MenuButton.call(this, player, options) || this;
      _this2.controlText_ = player.localize('Settings');
      return _this2;
    }

    var _proto = SettingsButton.prototype;

    _proto.update = function update() {
      var player = this.player_;
      var menu = new SettingsMenu(player, this.options_, this);
      if (this.menu) player.removeChild(this.menu);
      this.menu = menu;
      player.addChild(menu);
      this.buttonPressed_ = false;
      this.el_.setAttribute('aria-expanded', 'false');
      if (this.items && !this.items.length) this.hide();else if (this.items && this.items.length > 1) this.show();
    };

    _proto.buildCSSClass = function buildCSSClass() {
      // vjs-icon-cog can be removed when the settings menu is integrated in video.js
      return "vjs-settings-button vjs-icon-cog " + _MenuButton.prototype.buildCSSClass.call(this);
    };

    _proto.handleClick = function handleClick() {
      if (this.buttonPressed_) this.unpressButton();else this.pressButton();
    };

    _proto.updateState = function updateState() {
      this.player_.toggleClass('vjs-settings-expanded', this.buttonPressed_);
      this.el_.setAttribute('aria-expanded', this.buttonPressed_);
      this.menu.show(this.buttonPressed_);
    };

    _proto.unpressButton = function unpressButton() {
      if (!this.enabled_) return;
      this.buttonPressed_ = false;
      this.updateState();
      this.el_.focus();
      this.clearInterval(this.activityInterval);

      if (this.clickListener) {
        videojs.off(document, ['tap', 'click'], this.clickListener);
        this.player_.off(['tap', 'click'], this.clickListener);
        this.clickListener = null;
      }
    };

    _proto.pressButton = function pressButton() {
      if (!this.enabled_) return;
      this.buttonPressed_ = true;
      this.updateState();
      this.menu.focus(); // prevent setting vjs-user-inactive when menu is opened

      this.activityInterval = this.setInterval(this.player_.reportUserActivity.bind(this.player_), 250);

      var _this = this;

      this.setTimeout(function () {
        _this.clickListener = _this.unpressButton.bind(_this);
        videojs.on(document, ['tap', 'click'], this.clickListener);

        _this.player_.on(['tap', 'click'], this.clickListener);
      });
    };

    _proto.tooltipHandler = function tooltipHandler() {
      return this.icon_;
    };

    return SettingsButton;
  }(MenuButton);
  Component$6.registerComponent('SettingsButton', SettingsButton);

  var Plugin = videojs.getPlugin('plugin'); // Default options for the plugin.

  var defaults = {
    info: true,
    report: false,
    popout: false,
    quality: true,
    debugging: true,
    about: true,
    before: 'fullscreenToggle',
    poweredBy: 'GuacPlayer',
    onReport: function onReport() {},
    onPopout: function onPopout() {}
  };
  var ClickableComponent = videojs.getComponent('ClickableComponent');
  var MenuItem$4 = videojs.getComponent('MenuItem');

  MenuItem$4.prototype.createEl = function (type, props, attrs) {
    props = _extends_1({
      className: 'vjs-menu-item',
      innerHTML: '<span class="vjs-menu-item-label" data-i18n="' + this.options_.label + '">' + this.options_.label + '</span>',
      tabIndex: -1
    }, props);
    return ClickableComponent.prototype.createEl('li', props, attrs);
  };
  /**
   * An advanced Video.js plugin. For more information on the API
   *
   * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
   */

  var Settings = /*#__PURE__*/function (_Plugin) {
    inheritsLoose(Settings, _Plugin);

    /**
     * Create a Settings plugin instance.
     *
     * @param  {Player} player
     *         A Video.js Player instance.
     *
     * @param  {Object} [options]
     *         An optional options object.
     *
     *         While not a core part of the Video.js plugin architecture, a
     *         second argument of options is a convenient way to accept inputs
     *         from your plugin's caller.
     */
    function Settings(player, options) {
      var _this;

      // the parent class will add player under this.player
      _this = _Plugin.call(this, player) || this;

      function showInfoOverlay() {
        if (!player) {
          return;
        }

        var overlay = player.getChild('InfoOverlay');

        if (typeof overlay !== 'undefined') {
          overlay.toggle();
        }
      }

      _this.options = videojs.mergeOptions(defaults, options);

      _this.player.ready(function () {
        _this.player.addClass('vjs-settings');

        if (!player.options().controls || !player.options().controls.settingsButton == false) {
          return;
        } // prevents duplicates


        if (player.isSettingsButtonInitialized === true) {
          return;
        }

        player.isSettingsButtonInitialized = true; // Inserts the settings menu button in control bar

        var controlBar = player.controlBar;

        if (controlBar) {
          player.controlBar.settingsButton = controlBar.addChild('SettingsButton', _this.options);
          var before = controlBar.getChild(options.before);

          if (before) {
            controlBar.el().insertBefore(player.controlBar.settingsButton.el(), before.el());
          } else {
            controlBar.el().append(player.controlBar.settingsButton.el());
          }
        }

        if (_this.options.info) _this.player.addChild('InfoOverlay');

        _this.player.addChild('PopupMenu', _this.options);

        if (_this.options.report) _this.player.on('guac-report', _this.options.onReport.bind(assertThisInitialized(_this)));
        if (_this.options.popout) _this.player.on('guac-popout', _this.options.onPopout.bind(assertThisInitialized(_this)));

        _this.player.on('guac-info-overlay', showInfoOverlay.bind(assertThisInitialized(_this)));
      });

      return _this;
    }

    return Settings;
  }(Plugin); // Define default values for the plugin's `state` object here.


  Settings.defaultState = {}; // Include the version number.

  Settings.VERSION = version; // Register the plugin with video.js.

  videojs.registerPlugin('settings', Settings);

  return Settings;

})));
