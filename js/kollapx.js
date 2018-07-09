/**
 * Kollapx.js
 *  1. openAtStart : Available to set the banner opened when the website finish the loading .
 *  2. transition  : Banner will be opening with transition when the button is triggered.
 *  3. customProps : Default settings will be replaced by custom settings.Following settings are available to modified:
 *    a. button : Object Class & Text.
 *
 */

(function($) {
  "use strict";
  var moduleName = "Kollapx";

  var Module = function(element, opt) {
    this.el = element;
    this.$ele = $(element);
    this.$btn = $('<div class="' + opt.button.class + '"></div>');
    //this.$btn = $('<div class="btn"></div>');
    this.option = opt;
    this.statusCycle = ["closed", "opened"];
    this.status = 0; // 0:closed, 1:opening, 2:opened, 3:closing
    this.timer;
    this.transitionEndEvent = (function(transitions) {
      var el = document.createElement("fakeelement");
      for (var t in transitions) {
        if (el.style[t] !== undefined) {
          console.log(transitions[t]);
          return transitions[t];
        }
      }
    })({
      transition: "transitionend",
      OTransition: "oTransitionEnd",
      MozTransition: "transitionend",
      WebkitTransition: "webkitTransitionEnd"
    });
  };
  Module._DEFAULT = {
    openAtStart: false,
    autoOpenClose: false, // open, close
    closeDays: false, // days string
    button: {
      closeText: "收合",
      openText: "展開",
      class: "btn"
    },
    class: {
      closed: "closed",
      //closing: "closing",
      opened: "opened"
      //opening: "opening"
    },
    transition: true,
    countTime: 100,
    whenTransition: function() {
      console.log("whenTransition");
    }
  };
  Module.prototype.clearTimer = function() {
    clearInterval(this.timer);
    clearTimeout(this.timer);
  };
  /**
   * .transitionEnd 結束後執行
   */
  Module.prototype.transitionEnd = function() {
    this.clearTimer();
  };
  /**
   * .nextClass() 更換 class
   */
  Module.prototype.nextStatus = function() {
    this.status++;
    if (this.status > this.statusCycle.length - 1) {
      this.status = 0;
    }
    return this.status;
  };
  /**
   * .matchClass() 依狀態尋找該呈現的 class
   */
  Module.prototype.matchClass = function(status) {
    return this.option.class[this.statusCycle[status]];
  };
  /**
   * .open() 打開 Banner 內容
   */
  Module.prototype.open = function() {
    this.$ele
      .removeClass(this.matchClass(this.status))
      .addClass(this.matchClass(this.nextStatus()));
    this.$btn.text(this.option.button.closeText);
  };
  /**
   * .close() 關閉 Banner 內容
   */
  Module.prototype.close = function() {
    this.$ele
      .removeClass(this.matchClass(this.status))
      .addClass(this.matchClass(this.nextStatus()));
    this.$btn.text(this.option.button.openText);
  };
  /**
   * .toggle() Banner 顯示開關
   */
  Module.prototype.toggle = function() {
    this.timer = setInterval(this.option.whenTransition, 25);
    if (this.status === 1) {
      this.close();
    } else if (this.status === 0) {
      this.open();
    }
    //this.timer = setInterval(this.option.whenTransition, 25);
  };
  /**
   * .addTransition() 加入動畫
   */
  Module.prototype.addTransition = function() {
    if (this.option.transition && !this.$ele.hasClass("transition")) {
      this.$ele.addClass("transition");
      this.$ele.find("img").addClass("imgTransition");
    }
  };
  /**
   * .init() 初始化
   */
  Module.prototype.init = function() {
    this.$ele.append(this.$btn);
    this.addTransition();
    if (this.option.openAtStart) {
      this.status = 1;
      this.$btn.text(this.option.button.closeText);
    } else {
      this.status = 0;
      this.$btn.text(this.option.button.openText);
    }
    this.$ele.addClass(this.matchClass(this.status));
  };
  /**
   * Register [moduleName] as jQuery Plugin, and start
   */
  $.fn[moduleName] = function(options, options2) {
    return this.each(function() {
      var $this = $(this);
      var module = $this.data(moduleName);
      var opts = null;
      if (!!module) {
        if (typeof options === "string" && typeof options2 === "undefined") {
          module[options]();
        } else {
          throw "[WARNING] Unsupported options!";
        }
      } else {
        opts = $.extend(
          {},
          Module._DEFAULT,
          typeof options === "object" && options,
          typeof options2 === "object" && options2
        );
        module = new Module(this, opts);
        $this.data(moduleName, module);
        module.init();
        // 註冊 Click 事件
        module.$btn.on("click", function(e) {
          module.toggle(0);
        });
        if (options.transition) {
          module.$ele.on(module.transitionEndEvent, function(e, ignore) {
            module.transitionEnd();
          });
        }
        else{
          module.transitionEnd();
        }
      }
    });
  };
})(jQuery);
