/*! Titon Toolkit v1.4.1 | BSD-3 License | http://titon.io */
(function(window, $) {
    "use strict";
    var instances = {};
    var hasTransition = function() {
        var prefixes = "transition WebkitTransition MozTransition OTransition msTransition".split(" "), style = document.createElement("div").style;
        for (var i = 0; i < prefixes.length; i++) {
            if (prefixes[i] in style) {
                return prefixes[i];
            }
        }
        return false;
    }();
    var Toolkit = {
        version: "1.4.1",
        build: "hvsd55um",
        vendor: "",
        aria: true,
        messages: {
            loading: "Loading...",
            error: "An error has occurred!"
        },
        hasTransition: hasTransition,
        transitionEnd: function() {
            var eventMap = {
                WebkitTransition: "webkitTransitionEnd",
                OTransition: "oTransitionEnd otransitionend"
            };
            return eventMap[hasTransition] || "transitionend";
        }(),
        isTouch: !!("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch),
        isRetina: window.devicePixelRatio > 1,
        create: function(component, callback, collection) {
            var name = component;
            if ($.fn[name]) {
                name = "toolkit" + name.charAt(0).toUpperCase() + name.slice(1);
            }
            $.fn[name] = collection ? function() {
                var instance = instances[component + "." + this.selector] = callback.apply(this, arguments);
                return this.each(function() {
                    $(this).addData("toolkit." + component, instance);
                });
            } : function() {
                var args = arguments;
                return this.each(function() {
                    $(this).addData("toolkit." + component, callback.apply(this, args));
                });
            };
        },
        Class: function() {}
    };
    window.Toolkit = Toolkit;
    var vendor = Toolkit.vendor;
    Toolkit.Class.extend = function(base, properties, options) {
        var Class = function() {
            for (var key in this) {
                if (typeof this[key] === "function") {
                    this[key] = this[key].bind(this);
                }
            }
            this.uid = Class.count += 1;
            base.apply(this, arguments);
        };
        $.extend(Class.prototype, this.prototype, properties || {});
        Class.options = $.extend(true, {}, this.options || {}, options || {});
        Class.extend = this.extend;
        Class.count = 0;
        Class.prototype.constructor = base;
        return Class;
    };
    $.fn.toolkit = function(component, method, args) {
        var selector = this.selector, instance = this.data("toolkit." + component);
        if (!instance && instances[component + "." + selector]) {
            instance = instances[component + "." + selector];
        }
        if (!instance) {
            return null;
        }
        if (method && instance[method]) {
            instance[method].apply(instance, $.makeArray(args));
        }
        return instance;
    };
    $.fn.reveal = function() {
        return this.removeClass("hide").addClass("show").aria("hidden", false);
    };
    $.fn.conceal = function() {
        return this.removeClass("show").addClass("hide").aria("hidden", true);
    };
    function doAria(element, key, value) {
        if (value === true) {
            value = "true";
        } else if (value === false) {
            value = "false";
        }
        element.setAttribute("aria-" + key, value);
    }
    $.fn.aria = function(key, value) {
        if (!Toolkit.aria) {
            return this;
        }
        if (key === "toggled") {
            key = {
                expanded: value,
                selected: value
            };
            value = null;
        }
        return $.access(this, doAria, key, value, arguments.length > 1);
    };
    $.fn.addData = function(key, value) {
        var data = this.data(key);
        if (data) {
            return data;
        } else if (typeof value === "function") {
            value = value.call(this);
        }
        this.data(key, value);
        return value;
    };
    $.fn.positionTo = function(position, relativeTo, baseOffset, isMouse) {
        if (!position) {
            return this;
        }
        var newPosition = position, offset = baseOffset || {
            left: 0,
            top: 0
        }, relOffset, relHeight = 0, relWidth = 0, eHeight = this.outerHeight(true), eWidth = this.outerWidth(true), win = $(window), wWidth = win.width(), wHeight = win.height(), wsTop = win.scrollTop();
        if (relativeTo.preventDefault) {
            relOffset = {
                left: relativeTo.pageX,
                top: relativeTo.pageY
            };
        } else {
            relOffset = relativeTo.offset();
            relHeight = relativeTo.outerHeight();
            relWidth = relativeTo.outerWidth();
        }
        offset.left += relOffset.left;
        offset.top += relOffset.top;
        if (relOffset.top - eHeight - wsTop < 0) {
            newPosition = newPosition.replace("top", "bottom");
        } else if (relOffset.top + relHeight + eHeight > wHeight) {
            newPosition = newPosition.replace("bottom", "top");
        }
        if (relOffset.left - eWidth < 0) {
            newPosition = newPosition.replace("left", "right");
        } else if (relOffset.left + relWidth + eWidth > wWidth) {
            newPosition = newPosition.replace("right", "left");
        }
        if (position !== newPosition) {
            this.removeClass(position).addClass(newPosition).data("new-position", newPosition);
            position = newPosition;
        }
        var parts = position.split("-"), edge = {
            y: parts[0],
            x: parts[1]
        };
        if (edge.y === "top") {
            offset.top -= eHeight;
        } else if (edge.y === "bottom") {
            offset.top += relHeight;
        } else if (edge.y === "center") {
            offset.top -= Math.round(eHeight / 2 - relHeight / 2);
        }
        if (edge.x === "left") {
            offset.left -= eWidth;
        } else if (edge.x === "right") {
            offset.left += relWidth;
        } else if (edge.x === "center") {
            offset.left -= Math.round(eWidth / 2 - relWidth / 2);
        }
        if (isMouse) {
            if (edge.y === "center") {
                if (edge.x === "left") {
                    offset.left -= 15;
                } else if (edge.x === "right") {
                    offset.left += 15;
                }
            }
            if (edge.x === "center") {
                if (edge.y === "top") {
                    offset.top -= 10;
                } else if (edge.y === "bottom") {
                    offset.top += 10;
                }
            }
        }
        return this.css(offset);
    };
    $.fn.transitionend = function(data, fn) {
        var name = Toolkit.transitionEnd;
        if (arguments.length > 0) {
            this.one(name, null, data, fn);
            if (this.css("transition-duration") === "0s") {
                this.trigger(name);
            }
        } else {
            this.trigger(name);
        }
        return this;
    };
    $.debounce = function(func, threshold, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            }, threshold || 150);
            if (immediate && !timeout) {
                func.apply(context, args);
            }
        };
    };
    $.throttle = function(func, delay) {
        if (!delay) {
            return func;
        }
        var throttled = false;
        return function() {
            var context = this, args = arguments;
            if (!throttled) {
                throttled = true;
                setTimeout(function() {
                    func.apply(context, args);
                    throttled = false;
                }, delay);
            }
        };
    };
    $.expr[":"].shown = function(obj) {
        return $(obj).css("visibility") !== "hidden";
    };
    $.bound = function(value, max, min) {
        min = min || 0;
        if (value >= max) {
            value = 0;
        } else if (value < min) {
            value = max - 1;
        }
        return value;
    };
    if (!$.cookie) {
        $.cookie = function(key, value, options) {
            options = $.extend({
                expires: null,
                path: "/",
                domain: "",
                secure: false
            }, options);
            if (typeof value !== "undefined") {
                if (typeof options.expires === "number") {
                    var date = new Date();
                    date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1e3);
                    options.expires = date.toUTCString();
                }
                return document.cookie = [ key + "=" + encodeURIComponent(value), options.expires ? "; expires=" + options.expires : "", options.path ? "; path=" + options.path : "", options.domain ? "; domain=" + options.domain : "", options.secure ? "; secure" : "" ].join("");
            } else {
                value = document.cookie.match("(?:^|;)\\s*" + key.replace(/[\-\.\+\*]/g, "\\$&") + "=([^;]*)");
                if (value && value.length) {
                    return decodeURIComponent(value[1]);
                }
            }
            return null;
        };
        $.removeCookie = function(key, options) {
            options = options || {};
            options.expires = -1;
            return $.cookie(key, "", options);
        };
    }
    if (!$.event.special.clickout) {
        $.event.special.clickout = function() {
            var elements = [];
            $(document).on("click.toolkit.out", function(e) {
                if (!elements.length) {
                    return;
                }
                var trigger = true, collection = $(document), target = $(e.target);
                $.each(elements, function(i, item) {
                    var self = $(item);
                    if ($.type(item) === "string") {
                        trigger = !target.is(item) && !self.has(e.target).length;
                    } else {
                        trigger = !self.is(e.target) && !self.has(e.target).length;
                    }
                    if (trigger) {
                        collection = collection.add(self);
                    } else {
                        return false;
                    }
                });
                if (trigger) {
                    collection.trigger("clickout", [ e.target ]);
                }
            });
            return {
                add: function(handler) {
                    var context = this;
                    if (this === document) {
                        context = handler.selector;
                    }
                    if ($.inArray(context, elements) === -1) {
                        elements.push(context);
                    }
                },
                remove: function(handler) {
                    var context = this;
                    if (this === document) {
                        context = handler.selector;
                    }
                    elements = $.grep(elements, function(item) {
                        return item !== context;
                    });
                }
            };
        }();
    }
    if (!$.event.special.swipe) {
        $.event.special.swipe = function() {
            var isTouch = Toolkit.isTouch, startEvent = isTouch ? "touchstart" : "mousedown", moveEvent = isTouch ? "touchmove" : "mousemove", stopEvent = isTouch ? "touchend" : "mouseup", swiping = false, abs = Math.abs;
            function coords(e) {
                var data = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;
                return {
                    time: new Date().getTime(),
                    x: data.pageX,
                    y: data.pageY
                };
            }
            function swipe(start, stop, selfTarget, origTarget) {
                if (!start || !stop) {
                    return;
                }
                var settings = $.event.special.swipe, x = stop.x - start.x, y = stop.y - start.y, direction;
                if (stop.time - start.time <= settings.duration) {
                    if (abs(x) >= settings.distance && abs(y) <= settings.restraint) {
                        direction = x < 0 ? "left" : "right";
                    } else if (abs(y) >= settings.distance && abs(x) <= settings.restraint) {
                        direction = y < 0 ? "up" : "down";
                    } else {
                        return;
                    }
                    var props = {
                        target: origTarget,
                        swipestart: start,
                        swipestop: stop
                    };
                    selfTarget.trigger($.Event("swipe", props)).trigger($.Event("swipe" + direction, props));
                }
            }
            return {
                duration: 1e3,
                distance: 50,
                restraint: 75,
                setup: function() {
                    var self = $(this), start, target;
                    function move(e) {
                        var to = coords(e);
                        if (abs(start.x - to.x) > abs(start.y - to.y)) {
                            e.preventDefault();
                        }
                    }
                    function cleanup() {
                        start = target = null;
                        swiping = false;
                        self.off(moveEvent, move);
                    }
                    self.on(startEvent, function(e) {
                        if (!isTouch && e.target.tagName.toLowerCase() === "img") {
                            e.preventDefault();
                        }
                        if (swiping) {
                            return;
                        }
                        start = coords(e);
                        target = e.target;
                        swiping = true;
                        if (isTouch) {
                            self.on(moveEvent, move);
                        }
                    });
                    self.on(stopEvent, function(e) {
                        swipe(start, coords(e), self, target);
                        cleanup();
                    });
                    self.on("touchcancel", cleanup);
                },
                teardown: function() {
                    $(this).off(startEvent).off(moveEvent).off(stopEvent).off("touchcancel");
                }
            };
        }();
        $.each("swipe swipeleft swiperight swipeup swipedown".split(" "), function(i, name) {
            if (name !== "swipe") {
                $.event.special[name] = {
                    setup: function() {
                        $(this).on("swipe", $.noop);
                    },
                    teardown: function() {
                        $(this).off("swipe");
                    }
                };
            }
        });
    }
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(context) {
            var self = this, args = [].slice.call(arguments, 1), Func = function() {}, bound = function() {
                return self.apply(this instanceof Func && context ? this : context, args.concat([].slice.call(arguments)));
            };
            Func.prototype = this.prototype;
            bound.prototype = new Func();
            return bound;
        };
    }
    Toolkit.Component = Toolkit.Class.extend(function() {}, {
        component: "Component",
        version: "1.4.1",
        enabled: false,
        events: {},
        cache: {},
        runtime: {},
        createElement: function() {
            var template, options = this.options;
            if (options.templateFrom) {
                template = $(options.templateFrom);
            }
            if ((!template || !template.length) && options.template) {
                template = $(options.template);
                if (template.length) {
                    template.conceal().appendTo("body");
                }
            }
            if (!template) {
                throw new Error("Failed to create template element");
            }
            if (options.className) {
                template.addClass(options.className);
            }
            if (options.animation) {
                template.addClass(options.animation);
            }
            this.created = true;
            return template.attr("id", this.id());
        },
        bindEvents: function(type) {
            var self = this, options = this.options, event, keys, context, selector, funcs, win = $(window), doc = $(document);
            $.each(this.events, function(key, value) {
                funcs = $.isArray(value) ? value : [ value ];
                key = key.replace("{mode}", options.mode);
                key = key.replace("{selector}", self.nodes ? self.nodes.selector : "");
                keys = key.split(" ");
                event = keys.shift();
                context = keys.shift();
                selector = keys.join(" ").replace("@", vendor);
                if (self[context]) {
                    context = self[context];
                } else if (context === "window") {
                    context = win;
                } else if (context === "document") {
                    context = doc;
                }
                $.each(funcs, function(i, func) {
                    if (!$.isFunction(func)) {
                        func = self[func];
                    }
                    if (event === "ready") {
                        doc.ready(func);
                    } else if (selector) {
                        $(context)[type](event, selector, func);
                    } else {
                        $(context)[type](event, func);
                    }
                });
            });
        },
        destroy: function() {
            this.fireEvent("destroy");
            if (this.hide) {
                this.hide();
            }
            if (this.doDestroy) {
                this.doDestroy();
            }
            this.disable();
            if (this.created) {
                this.element.remove();
            }
            var key = this._keyName();
            if (this.nodes) {
                this.nodes.removeData("toolkit." + key);
                delete instances[key + "." + this.nodes.selector];
            } else if (this.element) {
                this.element.removeData("toolkit." + key);
            }
        },
        disable: function() {
            if (this.enabled) {
                this.bindEvents("off");
            }
            this.enabled = false;
        },
        enable: function() {
            if (!this.enabled) {
                this.bindEvents("on");
            }
            this.enabled = true;
        },
        fireEvent: function(type, args) {
            if (!$.isArray(args)) {
                args = [ args ];
            }
            var onType = "on" + type.charAt(0).toUpperCase() + type.slice(1);
            if (this.options[onType]) {
                this.options[onType].apply(this, args || []);
            }
            var element = this.element, node = this.node, event = jQuery.Event(type + ".toolkit." + this._keyName());
            event.context = this;
            if (element && element.length) {
                element.trigger(event, args || []);
            }
            if (node && node.length) {
                node.trigger(event, args || []);
            }
        },
        id: function() {
            var list = $.makeArray(arguments);
            list.unshift("toolkit", this._cssClass(), this.uid);
            return list.join("-");
        },
        inheritOptions: function(options, element) {
            var key, value, obj = {};
            for (key in options) {
                if (key === "context" || key === "template") {
                    continue;
                }
                value = element.data((this._keyName() + "-" + key).toLowerCase());
                if ($.type(value) !== "undefined") {
                    obj[key] = value;
                }
            }
            return $.extend(true, {}, options, obj);
        },
        initialize: function() {
            this.enable();
            this.fireEvent("init");
        },
        process: function(content) {
            this.hide();
            if (content.callback) {
                var namespaces = content.callback.split("."), func = window, prev = func;
                for (var i = 0; i < namespaces.length; i++) {
                    prev = func;
                    func = func[namespaces[i]];
                }
                func.call(prev, content);
            }
            this.fireEvent("process", content);
        },
        readOption: function(element, key) {
            var value = element.data((this._keyName() + "-" + key).toLowerCase());
            if ($.type(value) === "undefined") {
                value = this.options[key];
            }
            return value;
        },
        readValue: function(element, query) {
            if (!query) {
                return null;
            }
            element = $(element);
            if ($.type(query) === "function") {
                return query.call(this, element);
            }
            return element.attr(query);
        },
        requestData: function(options, before, done, fail) {
            var url = options.url || options;
            var ajax = $.extend({}, {
                url: url,
                type: "GET",
                context: this,
                beforeSend: before || function() {
                    this.cache[url] = true;
                    this.element.addClass("is-loading").aria("busy", true);
                }
            }, options);
            if ($.type(this.options.ajax) === "object") {
                ajax = $.extend({}, this.options.ajax, ajax);
            }
            var cache = ajax.type.toUpperCase() === "GET" && this.options.cache;
            return $.ajax(ajax).done(done || function(response, status, xhr) {
                    this.element.removeClass("is-loading").aria("busy", false);
                    if (xhr.getResponseHeader("Content-Type").indexOf("text/html") >= 0) {
                        if (cache) {
                            this.cache[url] = response;
                        } else {
                            delete this.cache[url];
                        }
                        this.position(response);
                    } else {
                        delete this.cache[url];
                        this.process(response);
                    }
                }).fail(fail || function() {
                    delete this.cache[url];
                    this.element.removeClass("is-loading").addClass("has-failed").aria("busy", false);
                    this.position(Toolkit.messages.error);
                });
        },
        setOptions: function(options, inheritFrom) {
            var opts = $.extend(true, {}, Toolkit[this.component].options, options || {});
            if (inheritFrom) {
                opts = this.inheritOptions(opts, inheritFrom);
            }
            if (opts.responsive && window.matchMedia) {
                $.each(opts.responsive, function(key, resOpts) {
                    if (matchMedia(resOpts.breakpoint).matches) {
                        $.extend(opts, resOpts);
                        return false;
                    }
                });
            }
            if (opts.mode && opts.mode === "hover") {
                if (Toolkit.isTouch) {
                    opts.mode = "click";
                } else {
                    opts.mode = "mouseenter";
                }
            }
            return opts;
        },
        _cssClass: function() {
            if (this.cssClass) {
                return this.cssClass;
            }
            return this.cssClass = this.component.replace(/[A-Z]/g, function(match) {
                return "-" + match.charAt(0).toLowerCase();
            }).slice(1);
        },
        _keyName: function() {
            if (this.keyName) {
                return this.keyName;
            }
            var name = this.component;
            return this.keyName = name.charAt(0).toLowerCase() + name.slice(1);
        }
    }, {
        cache: true,
        context: null,
        className: "",
        template: "",
        templateFrom: ""
    });
    Toolkit.Accordion = Toolkit.Component.extend(function(element, options) {
        var self = this;
        this.component = "Accordion";
        this.version = "1.4.0";
        this.element = element = $(element).attr("role", "tablist");
        this.options = options = this.setOptions(options, element);
        this.headers = element.find("." + vendor + "accordion-header").each(function(index) {
            $(this).data("index", index).attr({
                role: "tab",
                id: self.id("header", index)
            }).aria({
                controls: self.id("section", index),
                selected: false,
                expanded: false
            });
        });
        this.sections = element.find("." + vendor + "accordion-section").each(function(index) {
            $(this).data("height", $(this).height()).attr({
                role: "tabpanel",
                id: self.id("section", index)
            }).aria("labelledby", self.id("header", index)).conceal();
        });
        this.index = 0;
        this.node = null;
        this.events = {
            "{mode} element .@accordion-header": "onShow"
        };
        this.initialize();
        this.jump(options.defaultIndex);
    }, {
        doDestroy: function() {
            this.headers.parent().removeClass("is-active");
            this.sections.removeAttr("style").reveal();
        },
        jump: function(index) {
            index = $.bound(index, this.headers.length);
            this.fireEvent("jump", index);
            this.show(this.headers[index]);
        },
        show: function(header) {
            header = $(header);
            var options = this.options, parent = header.parent(), section = header.next(), index = header.data("index"), height = parseInt(section.data("height"), 10), isNode = this.node && this.node.is(header);
            if (options.mode === "click" && (options.multiple || options.collapsible && isNode)) {
                if (section.is(":shown") && this.node) {
                    section.css("max-height", 0).conceal();
                    parent.removeClass("is-active");
                    header.aria("toggled", false);
                } else {
                    section.css("max-height", height).reveal();
                    parent.addClass("is-active");
                    header.aria("toggled", true);
                }
            } else {
                if (isNode) {
                    return;
                }
                this.sections.css("max-height", 0).conceal();
                section.css("max-height", height).reveal();
                this.headers.aria("toggled", false);
                header.aria("toggled", true);
                this.element.children("li").removeClass("is-active");
                parent.addClass("is-active");
            }
            this.index = index;
            this.node = header;
            this.fireEvent("show", [ section, header, index ]);
        },
        onShow: function(e) {
            e.preventDefault();
            this.show(e.currentTarget);
        }
    }, {
        mode: "click",
        defaultIndex: 0,
        multiple: false,
        collapsible: false
    });
    Toolkit.create("accordion", function(options) {
        return new Toolkit.Accordion(this, options);
    });
    Toolkit.Blackout = Toolkit.Component.extend(function(options) {
        this.component = "Blackout";
        this.version = "1.4.0";
        this.options = options = this.setOptions(options);
        this.element = this.createElement();
        this.count = 0;
        var count = options.loader === "bubble-spinner" ? 8 : options.waveCount, loader = $("<div/>").addClass(vendor + "loader").addClass(options.loader).appendTo(this.element);
        var spans = "", i;
        for (i = 0; i < count; i++) {
            spans += "<span></span>";
        }
        if (options.loader === "bubble-spinner") {
            $("<div/>").addClass(vendor + "loader-spinner").html(spans).appendTo(loader);
        } else {
            loader.html(spans);
        }
        this.loader = loader;
        this.message = $("<div/>").addClass(vendor + "loader-message").html(Toolkit.messages.loading).appendTo(loader);
        this.initialize();
    }, {
        hide: function() {
            var count = this.count - 1;
            if (count <= 0) {
                this.count = 0;
                this.element.conceal();
                this.hideLoader();
            } else {
                this.count = count;
            }
            this.fireEvent("hide", count <= 0);
        },
        hideLoader: function() {
            this.loader.conceal();
            this.fireEvent("hideLoader");
        },
        show: function() {
            var show = false;
            this.count++;
            if (this.count === 1) {
                this.element.reveal();
                show = true;
            }
            this.showLoader();
            this.fireEvent("show", show);
        },
        showLoader: function() {
            this.loader.reveal();
            this.fireEvent("showLoader");
        }
    }, {
        loader: "bar-wave",
        waveCount: 5,
        template: '<div class="' + vendor + 'blackout"></div>',
        templateFrom: "#toolkit-blackout-1"
    });
    var blackout = null;
    Toolkit.Blackout.factory = function(options) {
        if (blackout) {
            return blackout;
        }
        return blackout = new Toolkit.Blackout(options);
    };
    Toolkit.Carousel = Toolkit.Component.extend(function(element, options) {
        var items, self = this;
        this.component = "Carousel";
        this.version = "1.5.0";
        this.element = element = $(element);
        this.options = options = this.setOptions(options, element);
        element.aria("live", options.autoCycle ? "assertive" : "off").addClass(options.animation);
        this.container = element.find("." + vendor + "carousel-items ul").addClass("no-transition");
        this.items = items = this.container.find("li").each(function(index) {
            $(this).attr({
                role: "tabpanel",
                id: self.id("item", index)
            }).data("carousel-index", index).aria("hidden", index > 0);
        });
        this.tabs = element.find("." + vendor + "carousel-tabs").attr("role", "tablist").find("a").each(function(index) {
            $(this).data("carousel-index", index).attr({
                role: "tab",
                id: self.id("tab", index)
            }).aria({
                controls: self.id("item", index),
                selected: false,
                expanded: false
            });
        });
        this.index = -1;
        this.timer = null;
        this.stopped = false;
        this.animating = false;
        this._dimension = null;
        this._position = null;
        this._size = 0;
        this._resetTo = null;
        this.events = {
            "resize window": $.throttle(this.calculate, 50),
            "keydown window": "onKeydown",
            "swipeleft element": "next",
            "swipeup element": "next",
            "swiperight element": "prev",
            "swipedown element": "prev",
            "click element .@carousel-tabs a": "onJump",
            "click element .@carousel-next": "next",
            "click element .@carousel-prev": "prev",
            "click element .@carousel-start": "start",
            "click element .@carousel-stop": "stop"
        };
        if (options.stopOnHover) {
            this.events["mouseenter element"] = "stop";
            this.events["mouseleave element"] = "start";
        }
        this.initialize();
        this._setupState();
        this._buildClones();
        this.calculate();
        this.start();
        this.jump(options.defaultIndex);
    }, {
        calculate: function() {
            if (this.options.animation === "fade") {
                return;
            }
            var dimension = this._dimension, size;
            this._size = size = this.element[dimension]() / this.options.itemsToShow;
            var items = this.items.css(dimension, size);
            this.container.css(dimension, size * items.length);
        },
        doDestroy: function() {
            this.jump(0);
            clearInterval(this.timer);
            this.container.transitionend(function() {
                $(this).addClass("no-transition").css("left", 0).find("li.is-cloned").remove();
            });
        },
        jump: function(index) {
            if (this.animating) {
                return;
            }
            var indexes = this._getIndex(index), cloneIndex = indexes[0], visualIndex = indexes[1];
            if (visualIndex === this.index) {
                return;
            }
            this._updateTabs(visualIndex);
            this._updateItems(cloneIndex);
            this._beforeCycle();
            if (this.options.animation === "fade") {
                this.items.conceal().eq(visualIndex).transitionend(this._afterCycle).reveal();
            } else {
                this.container.transitionend(this._afterCycle).css(this._position, -(cloneIndex * this._size));
            }
            this.index = visualIndex;
            this.reset();
            this.fireEvent("jump", visualIndex);
        },
        next: function() {
            this.jump(this.index + this.options.itemsToCycle);
        },
        prev: function() {
            this.jump(this.index - this.options.itemsToCycle);
        },
        reset: function() {
            if (this.options.autoCycle) {
                clearInterval(this.timer);
                this.timer = setInterval(this.onCycle, this.options.duration);
            }
        },
        start: function() {
            this.element.removeClass("is-stopped");
            this.stopped = false;
            this.fireEvent("start");
        },
        stop: function() {
            this.element.addClass("is-stopped");
            this.stopped = true;
            this.fireEvent("stop");
        },
        _afterCycle: function() {
            this.animating = false;
            var container = this.container, resetTo = this._resetTo;
            if (resetTo !== null) {
                container.addClass("no-transition").css(this._position, -(resetTo * this._size));
                this._updateItems(resetTo);
                this._resetTo = null;
            }
            setTimeout(function() {
                container.removeClass("no-transition");
            }, 10);
        },
        _beforeCycle: function() {
            this.animating = true;
        },
        _buildClones: function() {
            var options = this.options, items = this.items, container = this.container, itemsToShow = options.itemsToShow;
            if (!options.infinite) {
                return;
            }
            items.slice(0, itemsToShow).clone().addClass("is-cloned").removeAttr("id").removeAttr("role").appendTo(container);
            items.slice(-itemsToShow).clone().addClass("is-cloned").removeAttr("id").removeAttr("role").prependTo(container);
            this.items = container.find("li");
        },
        _getIndex: function(index) {
            var options = this.options, itemsToShow = options.itemsToShow, visualIndex, cloneIndex;
            if (options.infinite) {
                var lengthWithClones = this.items.length, lengthWithoutClones = lengthWithClones - itemsToShow * 2;
                if (index >= lengthWithoutClones) {
                    this._resetTo = 0 + itemsToShow;
                    cloneIndex = lengthWithClones - itemsToShow;
                    visualIndex = 0;
                } else if (index <= -itemsToShow) {
                    this._resetTo = lengthWithoutClones;
                    cloneIndex = 0;
                    visualIndex = lengthWithoutClones - itemsToShow;
                } else {
                    this._resetTo = null;
                    visualIndex = index;
                    cloneIndex = index + itemsToShow;
                }
            } else {
                var element = this.element.removeClass("no-next no-prev"), maxIndex = this.items.length - itemsToShow;
                if (index >= maxIndex) {
                    index = maxIndex;
                    if (options.loop) {
                        if (index == this.index && this.index === maxIndex) {
                            index = 0;
                        }
                    } else {
                        element.addClass("no-next");
                    }
                } else if (index <= 0) {
                    index = 0;
                    if (options.loop) {
                        if (index == this.index && this.index === 0) {
                            index = maxIndex;
                        }
                    } else {
                        element.addClass("no-prev");
                    }
                }
                cloneIndex = visualIndex = index;
            }
            return [ cloneIndex, visualIndex ];
        },
        _setupState: function() {
            var options = this.options, animation = options.animation;
            if (options.itemsToCycle > options.itemsToShow) {
                options.itemsToCycle = options.itemsToShow;
            }
            if (animation === "fade") {
                options.itemsToShow = options.itemsToCycle = 1;
                options.infinite = false;
            }
            if (animation === "slide-up") {
                this._dimension = "height";
                this._position = "top";
            } else if (animation === "slide") {
                this._dimension = "width";
                this._position = "left";
            }
        },
        _updateItems: function(index) {
            this.items.removeClass("is-active").aria("hidden", true).slice(index, index + this.options.itemsToShow).addClass("is-active").aria("hidden", false);
        },
        _updateTabs: function(start) {
            var itemsToShow = this.options.itemsToShow, length = this.items.length, stop = start + itemsToShow, set = $([]), tabs = this.tabs.removeClass("is-active").aria("toggled", false);
            if (!tabs.length) {
                return;
            }
            if (this.options.infinite) {
                length = length - itemsToShow * 2;
            }
            if (start >= 0) {
                set = set.add(tabs.slice(start, stop));
            } else {
                set = set.add(tabs.slice(0, stop));
                set = set.add(tabs.slice(start));
            }
            if (stop > length) {
                set = set.add(tabs.slice(0, stop - length));
            }
            set.addClass("is-active").aria("toggled", false);
        },
        onCycle: function() {
            if (!this.stopped) {
                this.fireEvent("cycle", this.index);
                if (this.options.reverse) {
                    this.prev();
                } else {
                    this.next();
                }
            }
        },
        onJump: function(e) {
            e.preventDefault();
            this.jump($(e.currentTarget).data("carousel-index") || 0);
        },
        onKeydown: function(e) {
            if ($.inArray(e.keyCode, [ 37, 38, 39, 40 ]) >= 0) {
                e.preventDefault();
            } else {
                return;
            }
            switch (e.keyCode) {
                case 37:
                    this.prev();
                    break;

                case 38:
                    this.jump(0);
                    break;

                case 39:
                    this.next();
                    break;

                case 40:
                    this.jump(-1);
                    break;
            }
        }
    }, {
        animation: "slide",
        duration: 5e3,
        autoCycle: true,
        stopOnHover: true,
        infinite: true,
        loop: true,
        reverse: false,
        itemsToShow: 1,
        itemsToCycle: 1,
        defaultIndex: 0
    });
    Toolkit.create("carousel", function(options) {
        return new Toolkit.Carousel(this, options);
    });
    Toolkit.Drop = Toolkit.Component.extend(function(nodes, options) {
        this.component = "Drop";
        this.version = "1.4.0";
        this.options = this.setOptions(options);
        this.element = null;
        this.nodes = $(nodes);
        this.node = null;
        this.events = {
            "clickout document .@drop": "hide",
            "clickout document {selector}": "hide",
            "{mode} document {selector}": "onShow"
        };
        this.initialize();
    }, {
        hide: function() {
            var element = this.element;
            if (element && element.is(":shown")) {
                element.conceal();
                this.node.aria("toggled", false).removeClass("is-active");
                this.fireEvent("hide", [ element, this.node ]);
            }
        },
        show: function(node) {
            this.element.reveal();
            this.node = node = $(node).aria("toggled", true).addClass("is-active");
            this.fireEvent("show", [ this.element, node ]);
        },
        onShow: function(e) {
            e.preventDefault();
            var node = $(e.currentTarget), options = this.options, target = this.readValue(node, options.getTarget);
            if (!target || target.substr(0, 1) !== "#") {
                return;
            }
            if (options.hideOpened && this.node && !this.node.is(node)) {
                this.hide();
            }
            this.element = $(target);
            this.node = node;
            if (!this.element.is(":shown")) {
                this.show(node);
            } else {
                this.hide();
            }
        }
    }, {
        mode: "click",
        getTarget: "data-drop",
        hideOpened: true
    });
    Toolkit.create("drop", function(options) {
        return new Toolkit.Drop(this, options);
    }, true);
    Toolkit.Flyout = Toolkit.Component.extend(function(nodes, url, options) {
        if (!url) {
            throw new Error("Flyout URL required to download sitemap JSON");
        }
        this.component = "Flyout";
        this.version = "1.4.0";
        this.options = options = this.setOptions(options);
        this.element = null;
        this.nodes = $(nodes);
        this.node = null;
        this.current = null;
        this.menus = {};
        this.data = [];
        this.dataMap = {};
        this.timers = {};
        this.events = {};
        if (options.mode === "click") {
            this.events["click document {selector}"] = "onShow";
        } else {
            this.events["mouseenter document {selector}"] = [ "onShow", "onEnter" ];
            this.events["mouseleave document {selector}"] = "onLeave";
        }
        this.initialize();
        $.getJSON(url, this.load);
    }, {
        clearTimer: function(key) {
            clearTimeout(this.timers[key]);
            delete this.timers[key];
        },
        doDestroy: function() {
            $.each(this.menus, function(i, menu) {
                menu.remove();
            });
            this.clearTimer("show");
            this.clearTimer("hide");
        },
        hide: function() {
            if (this.node) {
                this.node.removeClass("is-active");
            }
            if (!this.current || !this.isVisible()) {
                return;
            }
            this.menus[this.current].conceal();
            this.fireEvent("hide");
            this.current = null;
        },
        isVisible: function() {
            if (this.current && this.menus[this.current]) {
                this.element = this.menus[this.current];
            }
            return this.element && this.element.is(":shown");
        },
        load: function(data, depth) {
            depth = depth || 0;
            if (depth === 0) {
                this.data = data;
            }
            if (data.url) {
                this.dataMap[data.url] = data;
            }
            if (data.children) {
                for (var i = 0, l = data.children.length; i < l; i++) {
                    this.load(data.children[i], depth + 1);
                }
            }
        },
        position: function() {
            var target = this.current, options = this.options;
            if (!this.menus[target]) {
                return;
            }
            var menu = this.menus[target], height = menu.outerHeight(), coords = this.node.offset(), x = coords.left + options.xOffset, y = coords.top + options.yOffset + this.node.outerHeight(), windowScroll = $(window).height();
            if (y > windowScroll / 2) {
                y = coords.top - options.yOffset - height;
            }
            menu.css({
                left: x,
                top: y
            }).reveal();
            this.fireEvent("show");
        },
        show: function(node) {
            var target = this._getTarget(node);
            if (this.current && target !== this.current) {
                this.hide();
                this.startTimer("show", this.options.showDelay);
            }
            this.node = $(node);
            if (!this._getMenu()) {
                return;
            }
            this.node.addClass("is-active");
            if (this.options.mode === "click") {
                this.position();
            }
        },
        startTimer: function(key, delay, args) {
            this.clearTimer(key);
            var func;
            if (key === "show") {
                func = this.position;
            } else {
                func = this.hide;
            }
            if (func) {
                this.timers[key] = setTimeout(function() {
                    func.apply(this, args || []);
                }.bind(this), delay);
            }
        },
        _buildMenu: function(parent, data) {
            if (!data.children || !data.children.length) {
                return null;
            }
            var options = this.options, menu = $(options.template).attr("role", "menu").aria("hidden", true), groups = [], ul, li, tag, limit = options.itemLimit, i, l;
            if (options.className) {
                menu.addClass(options.className);
            }
            if (parent.is("body")) {
                menu.addClass("is-root");
            } else {
                menu.aria("expanded", false);
            }
            if (limit && data.children.length > limit) {
                i = 0;
                l = data.children.length;
                while (i < l) {
                    groups.push(data.children.slice(i, i += limit));
                }
            } else {
                groups.push(data.children);
            }
            for (var g = 0, group, child; group = groups[g]; g++) {
                ul = $("<ul/>");
                for (i = 0, l = group.length; i < l; i++) {
                    child = group[i];
                    li = $("<li/>");
                    if (child.url) {
                        tag = $("<a/>", {
                            text: child.title,
                            href: child.url,
                            role: "menuitem"
                        });
                        $("<span/>").addClass(child.icon || "caret-right").prependTo(tag);
                    } else {
                        tag = $("<span/>", {
                            text: child.title,
                            role: "presentation"
                        });
                        li.addClass(vendor + "flyout-heading");
                    }
                    if (child.attributes) {
                        tag.attr(child.attributes);
                    }
                    if (child.className) {
                        li.addClass(child.className);
                    }
                    li.append(tag).appendTo(ul);
                    if (child.children && child.children.length) {
                        this._buildMenu(li, child);
                        li.addClass("has-children").aria("haspopup", true).on("mouseenter", this.onPositionChild.bind(this, li)).on("mouseleave", this.onHideChild.bind(this, li));
                    }
                }
                menu.append(ul);
            }
            menu.appendTo(parent);
            return menu;
        },
        _getMenu: function() {
            var target = this._getTarget();
            if (this.menus[target]) {
                this.current = target;
                return this.menus[target];
            }
            if (this.dataMap[target]) {
                var menu = this._buildMenu($("body"), this.dataMap[target]);
                if (!menu) {
                    return null;
                }
                menu.conceal();
                if (this.options.mode !== "click") {
                    menu.on({
                        mouseenter: function() {
                            this.clearTimer("hide");
                        }.bind(this),
                        mouseleave: function() {
                            this.startTimer("hide", this.options.hideDelay);
                        }.bind(this)
                    });
                }
                this.current = target;
                this.menus[target] = menu;
                return this.menus[target];
            }
            return null;
        },
        _getTarget: function(node) {
            node = $(node || this.node);
            return this.readValue(node, this.options.getUrl) || node.attr("href");
        },
        onEnter: function() {
            this.clearTimer("hide");
            this.startTimer("show", this.options.showDelay);
        },
        onHideChild: function(parent) {
            parent = $(parent);
            parent.removeClass("is-open");
            parent.children("." + vendor + "flyout").removeAttr("style").aria({
                expanded: false,
                hidden: false
            });
            this.fireEvent("hideChild", parent);
        },
        onLeave: function() {
            this.clearTimer("show");
            this.startTimer("hide", this.options.showDelay);
        },
        onPositionChild: function(parent) {
            var menu = parent.children("." + vendor + "flyout");
            if (!menu) {
                return;
            }
            menu.aria({
                expanded: true,
                hidden: true
            });
            var children = menu.children();
            menu.css("width", children.outerWidth() * children.length + "px");
            var win = $(window), winHeight = win.height() + win.scrollTop(), winWidth = win.width(), parentTop = parent.offset().top, parentHeight = parent.outerHeight(), parentRight = parent.offset().left + parent.outerWidth();
            var hWidth = parentRight + menu.outerWidth();
            if (hWidth >= winWidth) {
                menu.addClass("push-left");
            } else {
                menu.removeClass("push-left");
            }
            if (parentTop > winHeight / 2) {
                menu.css("top", "-" + (menu.outerHeight() - parentHeight) + "px");
            } else {
                menu.css("top", 0);
            }
            parent.addClass("is-open");
            this.fireEvent("showChild", parent);
        },
        onShow: function(e) {
            if (Toolkit.isTouch) {
                return;
            }
            var node = $(e.target), isNode = this.node && node[0] === this.node[0];
            if (this.isVisible()) {
                if (Toolkit.isTouch) {
                    if (!isNode || this.node.prop("tagName").toLowerCase() !== "a") {
                        e.preventDefault();
                    }
                } else {
                    e.preventDefault();
                }
                if (this.options.mode === "click") {
                    this.hide();
                }
                if (isNode) {
                    return;
                }
            } else {
                e.preventDefault();
            }
            this.show(node);
        }
    }, {
        mode: "hover",
        getUrl: "href",
        xOffset: 0,
        yOffset: 0,
        showDelay: 350,
        hideDelay: 1e3,
        itemLimit: 15,
        template: '<div class="flyout"></div>'
    });
    Toolkit.create("flyout", function(url, options) {
        return new Toolkit.Flyout(this, url, options);
    }, true);
    Toolkit.Input = Toolkit.Component.extend(function(element, options) {
        this.component = "Input";
        this.version = "1.4.0";
        this.element = element = $(element);
        this.options = options = this.setOptions(options, element);
        if (options.checkbox) {
            element.find(options.checkbox).inputCheckbox(options);
        }
        if (options.radio) {
            element.find(options.radio).inputRadio(options);
        }
        if (options.select) {
            element.find(options.select).inputSelect(options);
        }
        this.initialize();
    }, {
        copyClasses: function(from, to) {
            var classes = ($(from).attr("class") || "").replace(/\binput\b/, "").trim();
            if (classes) {
                $(to).addClass(classes);
            }
        },
        doDestroy: function() {
            var options = this.options, element = this.element;
            if (this.component === "Input") {
                if (options.checkbox) {
                    element.find(options.checkbox).each(function() {
                        $(this).toolkit("inputCheckbox", "destroy");
                    });
                }
                if (options.radio) {
                    element.find(options.radio).each(function() {
                        $(this).toolkit("inputRadio", "destroy");
                    });
                }
                if (options.select) {
                    element.find(options.select).each(function() {
                        $(this).toolkit("inputSelect", "destroy");
                    });
                }
            } else {
                this.wrapper.replaceWith(this.input);
                this.input.removeAttr("style");
            }
        },
        _buildWrapper: function() {
            var input = this.input, wrapper = $("<div/>").addClass(vendor + "custom-input").insertBefore(input).append(input);
            if (this.options.copyClasses) {
                this.copyClasses(input, wrapper);
            }
            return wrapper;
        }
    }, {
        copyClasses: true,
        checkbox: "input:checkbox",
        radio: "input:radio",
        select: "select"
    });
    Toolkit.InputCheckbox = Toolkit.Input.extend(function(checkbox, options) {
        this.component = "InputCheckbox";
        this.version = "1.4.0";
        this.input = checkbox = $(checkbox);
        this.options = this.setOptions(options, checkbox);
        this.wrapper = this._buildWrapper();
        this.element = $("<label/>").addClass(vendor + "checkbox").attr("for", checkbox.attr("id")).insertAfter(checkbox);
        this.initialize();
    });
    Toolkit.InputRadio = Toolkit.Input.extend(function(radio, options) {
        this.component = "InputRadio";
        this.version = "1.4.0";
        this.input = radio = $(radio);
        this.options = this.setOptions(options, radio);
        this.wrapper = this._buildWrapper();
        this.element = $("<label/>").addClass(vendor + "radio").attr("for", radio.attr("id")).insertAfter(radio);
        this.initialize();
    });
    Toolkit.InputSelect = Toolkit.Input.extend(function(select, options) {
        var events = {};
        this.component = "InputSelect";
        this.version = "1.4.0";
        this.input = select = $(select);
        this.multiple = select.prop("multiple");
        this.options = options = this.setOptions(options, select);
        if (this.multiple && options.native) {
            return;
        }
        this.wrapper = this._buildWrapper();
        this.element = this._buildButton();
        this.dropdown = null;
        this.index = 0;
        events["change input"] = "onChange";
        if (!options.native) {
            events["blur input"] = "hide";
            events["clickout document .@select-options"] = "hide";
            events["clickout element"] = "hide";
            events["click element"] = "onToggle";
            if (!this.multiple) {
                events["keydown window"] = "onCycle";
            }
            this._buildDropdown();
            this.input.css("z-index", 1);
        }
        this.events = events;
        this.initialize();
        this.input.change();
    }, {
        hide: function() {
            this.element.removeClass("is-active");
            if (this.dropdown) {
                this.dropdown.conceal();
            }
            this.fireEvent("hide");
        },
        show: function() {
            if (this.options.hideOpened) {
                $("." + vendor + "drop.select-options").each(function() {
                    $(this).siblings("select").toolkit("inputSelect", "hide");
                });
            }
            this.element.addClass("is-active");
            if (this.dropdown) {
                this.dropdown.reveal();
            }
            this.fireEvent("show");
        },
        _buildButton: function() {
            var button = $("<div/>").addClass(vendor + "select").append($("<div/>").addClass(vendor + "select-arrow").html(this.options.arrowContent)).append($("<div/>").addClass(vendor + "select-label").html(Toolkit.messages.loading)).css("min-width", this.input.width()).insertAfter(this.input);
            if (this.multiple) {
                this.input.css("max-height", button.height());
            }
            return button;
        },
        _buildDropdown: function() {
            var select = this.input, options = this.options, buildOption = this._buildOption, dropdown = $("<div/>").addClass(vendor + "drop " + vendor + "drop--down " + vendor + "select-options").attr("role", "listbox").aria("multiselectable", this.multiple), list = $("<ul/>"), index = 0, self = this;
            this.dropdown = dropdown;
            select.children().each(function() {
                var optgroup = $(this);
                if (optgroup.prop("tagName").toLowerCase() === "optgroup") {
                    if (index === 0) {
                        options.hideFirst = false;
                    }
                    list.append($("<li/>").addClass(vendor + "drop-heading").text(optgroup.attr("label")));
                    optgroup.children().each(function() {
                        var option = $(this);
                        if (optgroup.prop("disabled")) {
                            option.prop("disabled", true);
                        }
                        if (option.prop("selected")) {
                            self.index = index;
                        }
                        list.append(buildOption(option, index));
                        index++;
                    });
                } else {
                    if (optgroup.prop("selected")) {
                        self.index = index;
                    }
                    list.append(buildOption(optgroup, index));
                    index++;
                }
            });
            if (options.hideSelected && !options.multiple) {
                dropdown.addClass("hide-selected");
            }
            if (options.hideFirst) {
                dropdown.addClass("hide-first");
            }
            if (this.multiple) {
                dropdown.addClass("is-multiple");
            }
            this.wrapper.append(dropdown.append(list));
            return dropdown;
        },
        _buildOption: function(option, index) {
            var select = this.input, dropdown = this.dropdown, selected = option.prop("selected"), activeClass = "is-active";
            var li = $("<li/>"), content = option.text(), description;
            if (selected) {
                li.addClass(activeClass);
            }
            if (description = this.readValue(option, this.options.getDescription)) {
                content += ' <span class="' + vendor + 'drop-desc">' + description + "</span>";
            }
            var a = $("<a/>", {
                html: content,
                href: "javascript:;",
                role: "option"
            }).aria("selected", selected);
            if (this.options.copyClasses) {
                this.copyClasses(option, li);
            }
            li.append(a);
            if (option.prop("disabled")) {
                li.addClass("is-disabled");
                a.aria("disabled", true);
                return li;
            }
            if (this.multiple) {
                a.click(function() {
                    var self = $(this), selected = false;
                    if (option.prop("selected")) {
                        self.parent().removeClass(activeClass);
                    } else {
                        selected = true;
                        self.parent().addClass(activeClass);
                    }
                    option.prop("selected", selected);
                    self.aria("selected", selected);
                    select.change();
                });
            } else {
                var self = this;
                a.click(function() {
                    dropdown.find("li").removeClass(activeClass).end().find("a").aria("selected", false);
                    $(this).aria("selected", true).parent().addClass(activeClass);
                    self.hide();
                    self.index = index;
                    select.val(option.val());
                    select.change();
                });
            }
            return li;
        },
        _loop: function(index, step, options) {
            var hideFirst = this.options.hideFirst;
            index += step;
            while (typeof options[index] === "undefined" || options[index].disabled || index === 0 && hideFirst) {
                index += step;
                if (index >= options.length) {
                    index = 0;
                } else if (index < 0) {
                    index = options.length - 1;
                }
            }
            return index;
        },
        onChange: function(e) {
            var select = $(e.target), options = select.find("option"), opts = this.options, selected = [], label = [], self = this;
            options.each(function() {
                if (this.selected) {
                    selected.push(this);
                    label.push(self.readValue(this, opts.getOptionLabel) || this.textContent);
                }
            });
            if (this.multiple) {
                var title = this.readValue(select, opts.getDefaultLabel), format = opts.multipleFormat, count = label.length;
                if (!label.length && title) {
                    label = title;
                } else if (format === "count") {
                    label = opts.countMessage.replace("{count}", count).replace("{total}", options.length);
                } else if (format === "list") {
                    var limit = opts.listLimit;
                    label = label.splice(0, limit).join(", ");
                    if (limit < count) {
                        label += " ...";
                    }
                }
            } else {
                label = label.join(", ");
            }
            select.parent().find("." + vendor + "select-label").text(label);
            this.fireEvent("change", [ select.val(), selected ]);
        },
        onCycle: function(e) {
            if (!this.dropdown.is(":shown")) {
                return;
            }
            if ($.inArray(e.keyCode, [ 38, 40, 13, 27 ]) >= 0) {
                e.preventDefault();
            } else {
                return;
            }
            var options = this.input.find("option"), items = this.dropdown.find("a"), activeClass = "is-active", index = this.index;
            switch (e.keyCode) {
                case 13:
                case 27:
                    this.hide();
                    return;

                case 38:
                    index = this._loop(index, -1, options);
                    break;

                case 40:
                    index = this._loop(index, 1, options);
                    break;
            }
            options.prop("selected", false);
            options[index].selected = true;
            items.parent().removeClass(activeClass);
            items.eq(index).parent().addClass(activeClass);
            this.index = index;
            this.input.change();
        },
        onToggle: function() {
            if (this.input.prop("disabled")) {
                return;
            }
            if (this.dropdown.is(":shown")) {
                this.hide();
            } else {
                this.show();
            }
        }
    }, {
        "native": Toolkit.isTouch,
        multipleFormat: "count",
        countMessage: "{count} of {total} selected",
        listLimit: 3,
        hideOpened: true,
        hideFirst: false,
        hideSelected: false,
        arrowContent: '<span class="caret-down"></span>',
        getDefaultLabel: "title",
        getOptionLabel: "title",
        getDescription: "data-description"
    });
    Toolkit.create("input", function(options) {
        return new Toolkit.Input(this, options);
    });
    Toolkit.create("inputRadio", function(options) {
        return new Toolkit.InputRadio(this, options);
    });
    Toolkit.create("inputCheckbox", function(options) {
        return new Toolkit.InputCheckbox(this, options);
    });
    Toolkit.create("inputSelect", function(options) {
        return new Toolkit.InputSelect(this, options);
    });
    Toolkit.LazyLoad = Toolkit.Component.extend(function(container, options) {
        container = $(container);
        this.component = "LazyLoad";
        this.version = "1.4.0";
        this.options = options = this.setOptions(options, container);
        this.container = container.css("overflow") === "auto" ? container : $(window);
        this.elements = container.find(".lazy-load");
        this.element = null;
        this.loaded = 0;
        var callback = $.throttle(this.load, options.throttle);
        this.events = {
            "scroll container": callback,
            "resize window": callback,
            "ready document": "onReady"
        };
        this.initialize();
    }, {
        doDestroy: function() {
            this.loadAll();
        },
        inViewport: function(node) {
            node = $(node);
            var container = this.container, threshold = this.options.threshold, conHeight = container.height(), conWidth = container.width(), scrollTop = container.scrollTop(), scrollLeft = container.scrollLeft(), nodeOffset = node.offset(), left = nodeOffset.left, top = nodeOffset.top;
            if (container[0] !== window) {
                var conOffset = container.offset();
                left -= conOffset.left;
                top -= conOffset.top;
            }
            return node.is(":visible") && top >= scrollTop - threshold && top <= scrollTop + conHeight + threshold && left >= scrollLeft - threshold && left <= scrollLeft + conWidth + threshold;
        },
        load: function() {
            if (this.loaded >= this.elements.length) {
                this.shutdown();
                return;
            }
            this.elements.each(function(index, node) {
                if (node && this.inViewport(node)) {
                    this.show(node, index);
                }
            }.bind(this));
            this.fireEvent("load");
        },
        loadAll: function() {
            this.elements.each(function(index, node) {
                this.show(node, index);
            }.bind(this));
            this.fireEvent("loadAll");
            this.shutdown();
        },
        show: function(node, index) {
            node = $(node);
            node.removeClass("lazy-load");
            this.element = node;
            node.find("img").each(function() {
                var image = $(this), src;
                if (Toolkit.isRetina) {
                    src = image.data("src-retina");
                }
                if (!src) {
                    src = image.data("src");
                }
                if (src) {
                    image.attr("src", src);
                }
            });
            this.elements.splice(index, 1, null);
            this.loaded++;
            this.fireEvent("show", node);
        },
        shutdown: function() {
            if (this.enabled) {
                this.disable();
                this.fireEvent("shutdown");
            }
        },
        onReady: function() {
            this.load();
            if (this.options.forceLoad) {
                setTimeout(this.loadAll, this.options.delay);
            }
        }
    }, {
        forceLoad: false,
        delay: 1e4,
        threshold: 150,
        throttle: 50
    });
    Toolkit.create("lazyLoad", function(options) {
        return new Toolkit.LazyLoad(this, options);
    });
    Toolkit.Mask = Toolkit.Component.extend(function(element, options) {
        this.component = "Mask";
        this.version = "1.4.0";
        this.element = element = $(element);
        this.options = options = this.setOptions(options, element);
        if (!element.is("body")) {
            element.addClass(vendor + "mask-target");
            if (element.css("position") === "static") {
                element.css("position", "relative");
            }
        }
        var maskClass = vendor + "mask", mask = element.find("> ." + maskClass);
        if (!mask.length) {
            mask = $("<div/>").addClass(maskClass);
        }
        this.setMask(mask);
        this.events = {};
        if (options.selector) {
            this.events["click document " + options.selector] = "toggle";
        }
        this.initialize();
    }, {
        doDestroy: function() {
            this.mask.remove();
            this.element.removeClass(vendor + "mask-target").removeClass("is-masked").css("position", "");
        },
        hide: function() {
            this.mask.conceal();
            this.element.removeClass("is-masked");
            this.fireEvent("hide");
        },
        setMask: function(mask) {
            var options = this.options, message;
            mask.addClass("hide").appendTo(this.element);
            if (this.element.is("body")) {
                mask.css("position", "fixed");
            }
            if (options.revealOnClick) {
                mask.click(this.hide);
            }
            this.mask = mask;
            message = mask.find("> ." + vendor + "mask-message");
            if (!message.length) {
                message = $("<div/>").addClass(vendor + "mask-message").appendTo(mask);
                if (options.messageContent) {
                    message.html(options.messageContent);
                }
            }
            this.message = message;
        },
        show: function() {
            this.mask.reveal();
            this.element.addClass("is-masked");
            this.fireEvent("show");
        },
        toggle: function() {
            if (this.mask.is(":shown")) {
                this.hide();
            } else {
                this.show();
            }
        }
    }, {
        selector: "",
        revealOnClick: false,
        messageContent: ""
    });
    Toolkit.create("mask", function(options) {
        return new Toolkit.Mask(this, options);
    });
    Toolkit.Matrix = Toolkit.Component.extend(function(element, options) {
        this.component = "Matrix";
        this.version = "1.5.0";
        this.element = element = $(element).addClass(vendor + "matrix");
        this.options = options = this.setOptions(options, element);
        this.items = element.find("> li");
        this.matrix = [];
        this.wrapperWidth = 0;
        this.colWidth = 0;
        this.colCount = 0;
        this.images = [];
        this.events = {
            "resize window": $.debounce(this.onResize)
        };
        this.initialize();
        if (options.defer) {
            this._deferRender();
        } else {
            this.render();
        }
    }, {
        append: function(item) {
            $(item).appendTo(this.element).css("opacity", 0);
            this.refresh();
        },
        doDestroy: function() {
            this.element.removeAttr("style");
            this.items.removeAttr("style");
        },
        prepend: function(item) {
            $(item).prependTo(this.element).css("opacity", 0);
            this.refresh();
        },
        refresh: function() {
            this.items = this.element.find("> li");
            this.render();
        },
        remove: function(item) {
            this.items.each(function() {
                var self = $(this);
                if (self.is(item)) {
                    self.remove();
                    return false;
                }
                return true;
            });
            this.refresh();
        },
        render: function() {
            this._calculateColumns();
            if (this.items.length < this.colCount) {
                this.element.removeAttr("style");
            } else if (this.colCount <= 1) {
                this.element.addClass("no-columns");
                this.items.removeAttr("style");
            } else {
                this.element.removeClass("no-columns");
                this._organizeItems();
                this._positionItems();
            }
            this.fireEvent("render");
        },
        _calculateColumns: function() {
            var wrapperWidth = this.element.outerWidth(), colWidth = this.options.width, gutter = this.options.gutter, cols = Math.max(Math.floor(wrapperWidth / colWidth), 1), colsWidth = cols * (colWidth + gutter) - gutter, diff;
            if (cols > 1) {
                if (colsWidth > wrapperWidth) {
                    diff = colsWidth - wrapperWidth;
                    colWidth -= diff / cols;
                } else if (colsWidth < wrapperWidth) {
                    diff = wrapperWidth - colsWidth;
                    colWidth += diff / cols;
                }
            }
            this.wrapperWidth = wrapperWidth;
            this.colWidth = colWidth;
            this.colCount = cols;
        },
        _deferRender: function() {
            var promises = [];
            this.images = this.element.find("img").each(function(index, image) {
                var src = image.src, def = $.Deferred();
                image.onload = def.resolve;
                image.onerror = image.onabort = def.reject;
                image.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
                image.src = src;
                promises.push(def.promise());
            });
            $.when.apply($, promises).always(this.render);
        },
        _organizeItems: function() {
            var item, span, size, c = 0, l = this.items.length;
            this.matrix = [];
            for (var i = 0; i < l; i++) {
                item = this.items.eq(i);
                size = item.outerWidth();
                span = Math.max(Math.round(size / this.colWidth), 1);
                this.matrix.push({
                    item: item,
                    span: span
                });
                if (span > 1) {
                    for (var s = 1; s < span; s++) {
                        c++;
                        if (this.matrix) {
                            this.matrix.push({
                                item: item,
                                span: false
                            });
                        }
                    }
                }
                c++;
                if (c >= this.colCount) {
                    c = 0;
                }
            }
        },
        _positionItems: function() {
            var gutter = this.options.gutter, items = this.matrix, item, span, dir = this.options.rtl ? "right" : "left", x = 0, y = [], top, c = 0, i, l, s, pos = {
                margin: 0,
                position: "absolute"
            };
            for (i = 0; i < this.colCount; i++) {
                y.push(0);
            }
            for (i = 0, l = items.length; i < l; i++) {
                item = items[i];
                span = item.span;
                if (c >= this.colCount || span + c > this.colCount) {
                    c = 0;
                    x = 0;
                }
                if (span) {
                    top = 0;
                    for (s = 0; s < span; s++) {
                        if (y[c + s] > top) {
                            top = y[c + s];
                        }
                    }
                    pos.top = top;
                    pos[dir] = x;
                    pos.width = (this.colWidth + gutter) * span - gutter;
                    item.item.css(pos).reveal();
                    for (s = 0; s < span; s++) {
                        y[c + s] = item.item.outerHeight() + gutter + top;
                    }
                }
                x += this.colWidth + gutter;
                c++;
            }
            this.element.css("height", Math.max.apply(Math, y));
        },
        onResize: function() {
            this.refresh();
        }
    }, {
        width: 200,
        gutter: 20,
        rtl: false,
        defer: true
    });
    Toolkit.create("matrix", function(options) {
        return new Toolkit.Matrix(this, options);
    });
    Toolkit.Modal = Toolkit.Component.extend(function(nodes, options) {
        var element;
        this.component = "Modal";
        this.version = "1.4.0";
        this.options = options = this.setOptions(options);
        this.element = element = this.createElement().attr("role", "dialog").aria("labelledby", this.id("title")).aria("describedby", this.id("content"));
        if (options.fullScreen) {
            element.addClass("is-fullscreen");
        }
        this.nodes = $(nodes);
        this.node = null;
        this.blackout = options.blackout ? Toolkit.Blackout.factory() : null;
        if (options.blackout && options.stopScroll) {
            this.blackout.element.on("hide.toolkit.blackout", function(e, hidden) {
                if (hidden) {
                    $("body").removeClass("no-scroll");
                }
            });
        }
        this.events = {
            "keydown window": "onKeydown",
            "clickout element": "onHide",
            "clickout document {selector}": "onHide",
            "click document {selector}": "onShow",
            "click element .@modal-hide": "onHide",
            "click element .@modal-submit": "onSubmit"
        };
        this.initialize();
    }, {
        hide: function() {
            this.element.conceal();
            if (this.blackout) {
                this.blackout.hide();
            }
            this.fireEvent("hide");
        },
        position: function(content) {
            if (content === true) {
                return;
            }
            if (this.blackout) {
                this.blackout.hideLoader();
            }
            var body = this.element.find("." + vendor + "modal-inner");
            body.html(content);
            this.fireEvent("load", content);
            this.element.reveal();
            if (this.options.fullScreen) {
                body.css("min-height", $(window).height());
            }
            this.fireEvent("show");
        },
        show: function(node, content) {
            var options = this.options, ajax = options.ajax;
            if (content) {
                ajax = false;
            } else if (node) {
                this.node = node = $(node);
                ajax = this.readOption(node, "ajax");
                content = this.readValue(node, this.readOption(node, "getContent")) || node.attr("href");
                if (content && content.match(/^#[a-z0-9_\-\.:]+$/i)) {
                    content = $(content).html();
                    ajax = false;
                }
            }
            if (!content) {
                return;
            }
            if (this.blackout && !this.element.is(":shown")) {
                this.blackout.show();
            }
            if (options.stopScroll) {
                $("body").addClass("no-scroll");
            }
            if (ajax) {
                if (this.cache[content]) {
                    this.position(this.cache[content]);
                } else {
                    this.requestData(content);
                }
            } else {
                this.position(content);
            }
        },
        submit: function() {
            var form = this.element.find("form:first");
            if (!form) {
                return;
            }
            this.fireEvent("submit", [ form ]);
            var options = {
                url: form.attr("action"),
                type: (form.attr("method") || "post").toUpperCase()
            };
            if (window.FormData) {
                options.processData = false;
                options.contentType = false;
                options.data = new FormData(form[0]);
            } else {
                options.data = form.serialize();
            }
            this.requestData(options);
        },
        onHide: function(e) {
            e.preventDefault();
            var element = this.element;
            if (!element.is(":shown") || element.hasClass("is-loading")) {
                return;
            }
            this.hide();
        },
        onKeydown: function(e) {
            if (e.keyCode === 27 && this.element.is(":shown")) {
                this.hide();
            }
        },
        onShow: function(e) {
            e.preventDefault();
            this.show(e.currentTarget);
        },
        onSubmit: function(e) {
            e.preventDefault();
            this.submit();
        }
    }, {
        animation: "fade",
        ajax: true,
        draggable: false,
        blackout: true,
        fullScreen: false,
        stopScroll: true,
        getContent: "data-modal",
        template: '<div class="modal">' + '<div class="modal-outer">' + '<div class="modal-inner"></div>' + '<button class="modal-close modal-hide"><span class="x"></span></button>' + "</div>" + "</div>"
    });
    Toolkit.create("modal", function(options) {
        return new Toolkit.Modal(this, options);
    }, true);
    Toolkit.OffCanvas = Toolkit.Component.extend(function(element, options) {
        this.component = "OffCanvas";
        this.version = "1.4.1";
        this.element = element = $(element).addClass(vendor + "off-canvas").attr("role", "complementary").conceal();
        this.options = options = this.setOptions(options, element);
        var events = {}, animation = options.animation;
        if (Toolkit.isTouch && animation === "squish") {
            options.animation = animation = "push";
        }
        if (animation !== "on-top" && animation !== "squish") {
            options.hideOthers = true;
        }
        this.container = element.parents("." + vendor + "canvas").addClass(animation);
        this.primary = element.siblings("." + vendor + "on-canvas");
        this.secondary = element.siblings("." + vendor + "off-canvas");
        this.side = element.hasClass(vendor + "off-canvas--left") ? "left" : "right";
        this.opposite = this.side === "left" ? "right" : "left";
        events["ready document"] = "onReady";
        events["resize window"] = "onResize";
        if (this.side === "left") {
            events["swipeleft element"] = "hide";
            events["swiperight container"] = "onSwipe";
        } else {
            events["swipeleft container"] = "onSwipe";
            events["swiperight element"] = "hide";
        }
        if (options.selector) {
            events["click document " + options.selector] = "toggle";
        }
        this.events = events;
        this.initialize();
    }, {
        hide: function() {
            this.container.removeClass("move-" + this.opposite);
            this.element.conceal().removeClass("is-expanded").aria("expanded", false);
            if (this.options.stopScroll) {
                $("body").removeClass("no-scroll");
            }
            this.fireEvent("hide");
        },
        show: function() {
            var options = this.options;
            if (options.hideOthers) {
                this.secondary.each(function() {
                    var sidebar = $(this);
                    if (sidebar.hasClass("is-expanded")) {
                        sidebar.toolkit("offCanvas", "hide");
                    }
                });
            }
            this.container.addClass("move-" + this.opposite);
            this.element.reveal().addClass("is-expanded").aria("expanded", true);
            if (options.stopScroll) {
                $("body").addClass("no-scroll");
            }
            this.fireEvent("show");
        },
        toggle: function() {
            if (this.element.hasClass("is-expanded")) {
                this.hide();
            } else {
                this.show();
            }
        },
        onReady: function() {
            if (!this.options.openOnLoad) {
                return;
            }
            var sidebar = this.element, inner = this.primary, transClass = "no-transition";
            sidebar.addClass(transClass);
            inner.addClass(transClass);
            this.show();
            setTimeout(function() {
                sidebar.removeClass(transClass);
                inner.removeClass(transClass);
            }, 1);
        },
        onResize: function() {
            this.fireEvent("resize");
        },
        onSwipe: function(e) {
            e.preventDefault();
            var target = $(e.target), sideClass = "." + vendor + "off-canvas";
            if (target.is(sideClass) || target.parents(sideClass).length) {
                return;
            }
            this.show();
        }
    }, {
        selector: "",
        animation: "push",
        openOnLoad: false,
        hideOthers: true,
        stopScroll: true
    });
    Toolkit.create("offCanvas", function(options) {
        return new Toolkit.OffCanvas(this, options);
    });
    Toolkit.Pin = Toolkit.Component.extend(function(element, options) {
        this.component = "Pin";
        this.version = "1.4.0";
        this.element = element = $(element);
        this.options = options = this.setOptions(options, element);
        element.attr("role", "complementary").addClass(vendor + "pin").addClass(options.animation);
        this.elementHeight = null;
        this.elementTop = parseInt(element.css("top"), 10);
        this.parentHeight = null;
        this.parentTop = null;
        this.viewport = null;
        this.active = true;
        var throttle = options.throttle;
        this.events = {
            "scroll window": $.throttle(this.onScroll, throttle),
            "resize window": $.throttle(this.onResize, throttle),
            "ready document": "onResize"
        };
        this.initialize();
    }, {
        calculate: function() {
            var win = $(window), options = this.options, parent = options.context ? this.element.parents(options.context) : this.element.parent();
            this.viewport = {
                width: win.width(),
                height: win.height()
            };
            this.elementHeight = this.element.outerHeight(true);
            this.parentHeight = parent.height();
            this.parentTop = parent.offset().top;
            if (options.lock && this.elementHeight >= this.viewport.height) {
                this.active = false;
            } else {
                this.active = this.element.is(":visible") && this.parentHeight > this.elementHeight;
            }
        },
        doDestroy: function() {
            this.active = false;
            setTimeout(function() {
                this.element.removeAttr("style").removeClass("is-pinned");
            }.bind(this), 10);
        },
        pin: function() {
            var options = this.options;
            if (options.calculate) {
                this.calculate();
            }
            if (!this.active) {
                return;
            }
            var isFixed = options.fixed, eHeight = this.elementHeight, eTop = this.elementTop, pHeight = this.parentHeight, pTop = this.parentTop, scrollTop = $(window).scrollTop(), pos = {}, x = options.xOffset, y = 0;
            if (scrollTop < pTop) {
                this.element.removeAttr("style").removeClass("is-pinned");
                return;
            }
            var elementMaxPos = scrollTop + eHeight, parentMaxHeight = pHeight + pTop;
            if (isFixed) {
                if (elementMaxPos >= parentMaxHeight) {
                    y = "auto";
                    pos.position = "absolute";
                    pos.bottom = 0;
                } else {
                    y = options.yOffset;
                    pos.position = "fixed";
                    pos.bottom = "auto";
                }
            } else {
                pos.position = "absolute";
                if (elementMaxPos >= parentMaxHeight) {
                    y += pHeight - eHeight;
                } else {
                    y += scrollTop - pTop + options.yOffset;
                }
                if (eTop && y < eTop) {
                    y = eTop;
                }
            }
            pos[options.location] = x;
            pos.top = y;
            this.element.css(pos).addClass("is-pinned");
        },
        onResize: function() {
            this.calculate();
            this.pin();
            this.fireEvent("resize");
        },
        onScroll: function() {
            this.pin();
            this.fireEvent("scroll");
        }
    }, {
        location: "right",
        xOffset: 0,
        yOffset: 0,
        throttle: 50,
        fixed: false,
        calculate: false,
        lock: true
    });
    Toolkit.create("pin", function(options) {
        return new Toolkit.Pin(this, options);
    });
    Toolkit.Tooltip = Toolkit.Component.extend(function(nodes, options) {
        var element;
        this.component = "Tooltip";
        this.version = "1.4.1";
        this.options = options = this.setOptions(options);
        this.element = element = this.createElement().attr("role", "tooltip").removeClass(options.className);
        if (options.getTitle === "title") {
            options.getTitle = "data-tooltip-title";
        }
        this.elementHead = element.find("." + vendor + "tooltip-head");
        this.elementBody = element.find("." + vendor + "tooltip-body");
        this.nodes = $(nodes).each(function(i, node) {
            $(node).attr("data-tooltip-title", $(node).attr("title")).removeAttr("title");
        });
        this.node = null;
        this.events = {
            "{mode} document {selector}": "onShow"
        };
        if (options.mode === "click") {
            this.events["clickout element"] = "hide";
            this.events["clickout document {selector}"] = "hide";
        } else {
            this.events["mouseleave document {selector}"] = "hide";
        }
        this.initialize();
    }, {
        hide: function() {
            var options = this.options, element = this.element, position = element.data("new-position") || this.runtime.position || options.position, className = this.runtime.className || options.className;
            this.runtime = {};
            element.removeClass(position).removeClass(className).removeData("new-position").conceal();
            if (this.node) {
                this.node.removeAttr("aria-describedby");
            }
            this.fireEvent("hide");
        },
        position: function(content, title) {
            var options = $.isEmptyObject(this.runtime) ? this.options : this.runtime;
            if (content === true) {
                return;
            }
            this.element.addClass(options.position).addClass(options.className);
            if (this.node) {
                this.node.aria("describedby", this.id());
            }
            title = title || this.readValue(this.node, options.getTitle);
            if (title && options.showTitle) {
                this.elementHead.html(title).show();
            } else {
                this.elementHead.hide();
            }
            if (content) {
                this.elementBody.html(content).show();
            } else {
                this.elementBody.hide();
            }
            this.fireEvent("load", content);
            if (options.follow) {
                var follow = this.onFollow;
                this.node.off("mousemove", follow).on("mousemove", follow);
                this.fireEvent("show");
            } else {
                this.element.positionTo(options.position, this.node, {
                    left: options.xOffset,
                    top: options.yOffset
                });
                setTimeout(function() {
                    this.element.reveal();
                    this.fireEvent("show");
                }.bind(this), options.delay || 0);
            }
        },
        show: function(node, content, title) {
            var options;
            if (node) {
                this.node = node = $(node);
                this.runtime = options = this.inheritOptions(this.options, node);
                content = content || this.readValue(node, options.getContent);
            } else {
                this.runtime = options = this.options;
            }
            if (!content) {
                return;
            }
            if (options.ajax) {
                if (this.cache[content]) {
                    this.position(this.cache[content], title);
                } else {
                    if (options.showLoading) {
                        this.position(Toolkit.messages.loading);
                    }
                    this.requestData(content);
                }
            } else {
                if (content.match(/^#[a-z0-9_\-\.:]+$/i)) {
                    content = $(content).html();
                }
                this.position(content, title);
            }
        },
        onFollow: function(e) {
            e.preventDefault();
            var options = this.runtime;
            this.element.positionTo(options.position, e, {
                left: options.xOffset,
                top: options.yOffset
            }, true).reveal();
        },
        onShow: function(e) {
            var node = $(e.currentTarget), isNode = this.node && this.node.is(node);
            if (this.element.is(":shown")) {
                if (Toolkit.isTouch) {
                    if (!isNode || this.node.prop("tagName").toLowerCase() !== "a") {
                        e.preventDefault();
                    }
                } else {
                    e.preventDefault();
                }
                if (this.options.mode === "click") {
                    this.hide();
                }
                if (isNode) {
                    return;
                }
            } else {
                e.preventDefault();
            }
            this.show(node);
        }
    }, {
        mode: "hover",
        animation: "fade",
        ajax: false,
        follow: false,
        position: "top-center",
        showLoading: true,
        showTitle: true,
        getTitle: "title",
        getContent: "data-tooltip",
        mouseThrottle: 50,
        xOffset: 0,
        yOffset: 0,
        delay: 0,
        template: '<div class="tooltip">' + '<div class="tooltip-inner">' + '<div class="tooltip-head"></div>' + '<div class="tooltip-body"></div>' + "</div>" + '<div class="tooltip-arrow"></div>' + "</div>"
    });
    Toolkit.create("tooltip", function(options) {
        return new Toolkit.Tooltip(this, options);
    }, true);
    Toolkit.Popover = Toolkit.Tooltip.extend(function(nodes, options) {
        var element;
        this.component = "Popover";
        this.version = "1.4.0";
        this.options = options = this.setOptions(options);
        this.element = element = this.createElement().attr("role", "tooltip").removeClass(options.className);
        options.mode = "click";
        if (options.getTitle === "title") {
            options.getTitle = "data-popover-title";
        }
        this.elementHead = element.find("." + vendor + "popover-head");
        this.elementBody = element.find("." + vendor + "popover-body");
        this.nodes = $(nodes).each(function(i, node) {
            $(node).attr("data-popover-title", $(node).attr("title")).removeAttr("title");
        });
        this.node = null;
        this.events = {
            "clickout element": "hide",
            "clickout document {selector}": "hide",
            "click document {selector}": "onShow"
        };
        this.initialize();
    }, {}, {
        getContent: "data-popover",
        template: '<div class="popover">' + '<div class="popover-inner">' + '<div class="popover-head"></div>' + '<div class="popover-body"></div>' + "</div>" + '<div class="popover-arrow"></div>' + "</div>"
    });
    Toolkit.create("popover", function(options) {
        return new Toolkit.Popover(this, options);
    }, true);
    Toolkit.Showcase = Toolkit.Component.extend(function(nodes, options) {
        var element;
        this.component = "Showcase";
        this.version = "1.5.0";
        this.options = options = this.setOptions(options);
        this.element = element = this.createElement();
        this.nodes = $(nodes);
        this.items = element.find("." + vendor + "showcase-items");
        this.tabs = element.find("." + vendor + "showcase-tabs");
        this.caption = element.find("." + vendor + "showcase-caption");
        this.data = [];
        this.index = -1;
        this.blackout = options.blackout ? Toolkit.Blackout.factory() : null;
        this.animating = false;
        this.events = {
            "clickout element": "onHide",
            "clickout document {selector}": "onHide",
            "swipeleft element": "next",
            "swiperight element": "prev",
            "keydown window": "onKeydown",
            "click document {selector}": "onShow",
            "click element .@showcase-hide": "onHide",
            "click element .@showcase-next": "next",
            "click element .@showcase-prev": "prev",
            "click element .@showcase-tabs a": "onJump"
        };
        this.events[Toolkit.transitionEnd + " element .showcase-items"] = function(e) {
            e.stopPropagation();
        };
        this.initialize();
    }, {
        hide: function() {
            if (this.blackout) {
                this.blackout.hide();
            }
            if (this.options.stopScroll) {
                $("body").removeClass("no-scroll");
            }
            this.element.conceal().removeClass("is-single");
            this.items.removeAttr("style").children("li").conceal();
            this.fireEvent("hide");
        },
        jump: function(index) {
            if (this.animating) {
                return;
            }
            index = $.bound(index, this.data.length);
            if (index === this.index) {
                return;
            }
            var self = this, element = this.element, caption = this.caption, list = this.items, listItems = list.children("li"), listItem = listItems.eq(index), items = this.data, item = items[index], deferred = $.Deferred();
            this.tabs.find("a").removeClass("is-active").eq(index).addClass("is-active");
            listItems.conceal();
            caption.conceal();
            element.addClass("is-loading").aria("busy", true);
            this.animating = true;
            deferred.always(function(width, height) {
                list.transitionend(function() {
                    caption.html(item.title).reveal();
                    listItem.reveal();
                    self.position();
                    self.animating = false;
                });
                self._resize(width, height);
                element.removeClass("is-loading").aria("busy", false);
                listItem.data("width", width).data("height", height);
            });
            deferred.fail(function() {
                element.addClass("has-failed");
                listItem.html(Toolkit.messages.error);
            });
            if (listItem.data("width")) {
                deferred.resolve(listItem.data("width"), listItem.data("height"));
            } else {
                var img = new Image();
                img.src = item.image;
                img.onerror = function() {
                    deferred.reject(150, 150);
                };
                img.onload = function() {
                    deferred.resolve(this.width, this.height);
                    listItem.append(img);
                };
            }
            this.index = index;
            this.fireEvent("jump", index);
        },
        next: function() {
            this.jump(this.index + 1);
        },
        position: function() {
            if (this.blackout) {
                this.blackout.hideLoader();
            }
            this.element.reveal();
            this.fireEvent("show");
        },
        prev: function() {
            this.jump(this.index - 1);
        },
        show: function(node) {
            this.node = node = $(node);
            this.index = -1;
            this.element.addClass("is-loading").aria("busy", true);
            var options = this.inheritOptions(this.options, node), read = this.readValue, category = read(node, options.getCategory), items = [], index = 0;
            if (category) {
                for (var i = 0, x = 0, n; n = this.nodes[i]; i++) {
                    if (read(n, options.getCategory) === category) {
                        if (node.is(n)) {
                            index = x;
                        }
                        items.push({
                            title: read(n, options.getTitle),
                            category: category,
                            image: read(n, options.getImage)
                        });
                        x++;
                    }
                }
            } else {
                items.push({
                    title: read(node, options.getTitle),
                    category: category,
                    image: read(node, options.getImage)
                });
            }
            if (this.blackout) {
                this.blackout.show();
            }
            if (options.stopScroll) {
                $("body").addClass("no-scroll");
            }
            this._buildItems(items);
            this.jump(index);
        },
        _buildItems: function(items) {
            this.data = items;
            this.items.empty();
            this.tabs.empty();
            for (var li, a, item, i = 0; item = items[i]; i++) {
                li = $("<li/>");
                li.appendTo(this.items);
                a = $("<a/>").attr("href", "javascript:;").data("index", i);
                li = $("<li/>");
                li.appendTo(this.tabs).append(a);
            }
            if (items.length <= 1) {
                this.element.addClass("is-single");
            }
            this.fireEvent("load", items);
        },
        _resize: function(width, height) {
            var gutter = this.options.gutter * 2, wWidth = $(window).width() - gutter, wHeight = $(window).height() - gutter, ratio, diff;
            if (width > wWidth) {
                ratio = width / height;
                diff = width - wWidth;
                width = wWidth;
                height -= Math.round(diff / ratio);
            }
            if (height > wHeight) {
                ratio = height / width;
                diff = height - wHeight;
                width -= Math.round(diff / ratio);
                height = wHeight;
            }
            this.items.css({
                width: width,
                height: height
            });
        },
        onHide: function(e) {
            e.preventDefault();
            var element = this.element;
            if (!element.is(":shown") || element.hasClass("is-loading")) {
                return;
            }
            this.hide();
        },
        onJump: function(e) {
            e.preventDefault();
            this.jump($(e.target).data("index") || 0);
        },
        onKeydown: function(e) {
            if (this.element.is(":shown")) {
                if ($.inArray(e.keyCode, [ 37, 38, 39, 40 ]) >= 0) {
                    e.preventDefault();
                }
                switch (e.keyCode) {
                    case 27:
                        this.hide();
                        break;

                    case 37:
                        this.prev();
                        break;

                    case 38:
                        this.jump(0);
                        break;

                    case 39:
                        this.next();
                        break;

                    case 40:
                        this.jump(-1);
                        break;
                }
            }
        },
        onShow: function(e) {
            e.preventDefault();
            this.show(e.currentTarget);
        }
    }, {
        blackout: true,
        stopScroll: true,
        gutter: 50,
        getCategory: "data-showcase",
        getImage: "href",
        getTitle: "title",
        template: '<div class="showcase">' + '<div class="showcase-inner">' + '<ul class="showcase-items"></ul>' + '<ol class="showcase-tabs bullets"></ol>' + '<button class="showcase-prev"><span class="arrow-left"></span></button>' + '<button class="showcase-next"><span class="arrow-right"></span></button>' + "</div>" + '<button class="showcase-close showcase-hide"><span class="x"></span></button>' + '<div class="showcase-caption"></div>' + "</div>"
    });
    Toolkit.create("showcase", function(options) {
        return new Toolkit.Showcase(this, options);
    }, true);
    Toolkit.Stalker = Toolkit.Component.extend(function(element, options) {
        this.component = "Stalker";
        this.version = "1.4.0";
        this.element = element = $(element).addClass(vendor + "stalker");
        this.options = options = this.setOptions(options);
        if (!options.target || !options.marker) {
            throw new Error("A marker and target is required");
        }
        this.container = element.css("overflow") === "auto" ? element : $(window);
        this.targets = [];
        this.markers = [];
        this.offsets = [];
        this.events = {
            "scroll container": $.throttle(this.onScroll, options.throttle),
            "ready document": "onScroll"
        };
        this.initialize();
        this.refresh();
    }, {
        activate: function(marker) {
            this._stalk(marker, "activate");
        },
        deactivate: function(marker) {
            this._stalk(marker, "deactivate");
        },
        doDestroy: function() {
            var targets = this.targets, markers = this.markers;
            targets.removeClass(vendor + "stalker-target");
            markers.removeClass(vendor + "stalker-marker");
            if (this.options.applyToParent) {
                targets.parent().removeClass("is-active");
                markers.parent().removeClass("is-marked");
            } else {
                targets.removeClass("is-active");
                markers.removeClass("is-marked");
            }
        },
        refresh: function() {
            var isWindow = this.container.is(window), eTop = this.element.offset().top, offset, offsets = [];
            if (this.element.css("overflow") === "auto" && !this.element.is("body")) {
                this.element[0].scrollTop = 0;
            }
            this.targets = $(this.options.target).addClass(vendor + "stalker-target");
            this.markers = $(this.options.marker).addClass(vendor + "stalker-marker").each(function(index, marker) {
                offset = $(marker).offset();
                if (!isWindow) {
                    offset.top -= eTop;
                }
                offsets.push(offset);
            });
            this.offsets = offsets;
        },
        _stalk: function(marker, type) {
            marker = $(marker);
            if (type === "activate" && marker.hasClass("is-stalked")) {
                return;
            }
            var options = this.options, targetBy = options.targetBy, markBy = options.markBy, method = type === "activate" ? "addClass" : "removeClass", target = this.targets.filter(function() {
                return $(this).attr(targetBy).replace("#", "") === marker.attr(markBy);
            });
            marker[method]("is-stalked");
            if (options.applyToParent) {
                target.parent()[method]("is-active");
            } else {
                target[method]("is-active");
            }
            this.fireEvent(type, [ marker, target ]);
        },
        onScroll: function() {
            var scroll = this.container.scrollTop(), offsets = this.offsets, onlyWithin = this.options.onlyWithin, threshold = this.options.threshold;
            this.markers.each(function(index, marker) {
                marker = $(marker);
                var offset = offsets[index], top = offset.top - threshold, bot = offset.top + marker.height() + threshold;
                if (onlyWithin && scroll >= top && scroll <= bot || !onlyWithin && scroll >= top) {
                    this.activate(marker);
                } else {
                    this.deactivate(marker);
                }
            }.bind(this));
            this.fireEvent("scroll");
        }
    }, {
        target: "",
        targetBy: "href",
        marker: "",
        markBy: "id",
        threshold: 50,
        throttle: 50,
        onlyWithin: true,
        applyToParent: true
    });
    Toolkit.create("stalker", function(options) {
        return new Toolkit.Stalker(this, options);
    });
    Toolkit.Tabs = Toolkit.Component.extend(function(element, options) {
        var sections, tabs, self = this;
        this.component = "Tabs";
        this.version = "1.4.0";
        this.element = element = $(element);
        this.options = options = this.setOptions(options, element);
        if (!options.cookie) {
            options.cookie = element.attr("id");
        }
        this.sections = sections = element.find("." + vendor + "tabs-section").each(function(index, section) {
            section = $(section);
            section.attr("role", "tabpanel").attr("id", section.attr("id") || self.id("section", index)).aria("labelledby", self.id("tab", index)).conceal();
        });
        this.nav = element.find("." + vendor + "tabs-nav").attr("role", "tablist");
        this.tabs = tabs = this.nav.find("a").each(function(index) {
            $(this).data("index", index).attr({
                role: "tab",
                id: self.id("tab", index)
            }).aria({
                controls: sections.eq(index).attr("id"),
                selected: false,
                expanded: false
            }).removeClass("is-active");
        });
        this.index = 0;
        this.events = {
            "{mode} element .@tabs-nav a": "onShow"
        };
        if (options.mode !== "click" && options.preventDefault) {
            this.events["click element .@tabs-nav a"] = function(e) {
                e.preventDefault();
            };
        }
        this.initialize();
        var index = options.defaultIndex;
        if (options.persistState && options.cookie) {
            index = $.cookie("toolkit.tabs." + options.cookie);
        }
        if (!index && options.loadFragment && location.hash) {
            index = tabs.filter(function() {
                return $(this).attr("href") === location.hash;
            }).eq(0).data("index");
        }
        if (!index || !tabs[index]) {
            index = options.defaultIndex;
        }
        this.jump(index);
    }, {
        doDestroy: function() {
            this.sections.eq(this.index).reveal();
        },
        hide: function() {
            this.sections.conceal();
            this.fireEvent("hide", this.node);
        },
        jump: function(index) {
            this.show(this.tabs[$.bound(index, this.tabs.length)]);
        },
        show: function(tab) {
            tab = $(tab);
            var index = tab.data("index"), section = this.sections.eq(index), options = this.options, ajax = this.readOption(tab, "ajax"), url = this.readValue(tab, this.readOption(tab, "getUrl"));
            if (ajax && url && url.substr(0, 1) !== "#" && !this.cache[url]) {
                this.requestData(url, function() {
                    section.html(Toolkit.messages.loading).addClass("is-loading").aria("busy", true);
                }, function(response) {
                    if (options.cache) {
                        this.cache[url] = true;
                    }
                    this.fireEvent("load", response);
                    section.html(response).removeClass("is-loading").aria("busy", false);
                }, function() {
                    section.html(Toolkit.messages.error).removeClass("is-loading").addClass("has-failed").aria("busy", false);
                });
            }
            this.tabs.aria("toggled", false).parent().removeClass("is-active");
            if (index === this.index && options.collapsible) {
                if (section.is(":shown")) {
                    section.conceal();
                } else {
                    tab.aria("toggled", true).parent().addClass("is-active");
                    section.reveal();
                }
            } else {
                this.hide();
                tab.aria("toggled", true).parent().addClass("is-active");
                section.reveal();
            }
            if (options.persistState) {
                $.cookie("toolkit.tabs." + options.cookie, index, {
                    expires: options.cookieDuration
                });
            }
            this.index = index;
            this.node = tab;
            this.fireEvent("show", tab);
        },
        onShow: function(e) {
            if (this.options.preventDefault || this.options.ajax && e.currentTarget.getAttribute("href").substr(0, 1) !== "#") {
                e.preventDefault();
            }
            this.show(e.currentTarget);
        }
    }, {
        mode: "click",
        ajax: true,
        collapsible: false,
        defaultIndex: 0,
        persistState: false,
        preventDefault: true,
        loadFragment: true,
        cookie: null,
        cookieDuration: 30,
        getUrl: "href"
    });
    Toolkit.create("tabs", function(options) {
        return new Toolkit.Tabs(this, options);
    });
    Toolkit.Toast = Toolkit.Component.extend(function(element, options) {
        this.component = "Toast";
        this.version = "1.4.0";
        this.options = options = this.setOptions(options);
        this.element = this.createElement().addClass(options.position).removeClass(options.animation).attr("role", "log").aria({
            relevant: "additions",
            hidden: "false"
        }).appendTo(element).reveal();
        this.initialize();
    }, {
        create: function(content, options) {
            options = $.extend({}, this.options, options || {});
            var self = this, toast = $("<div/>").addClass(vendor + "toast").addClass(options.animation).attr("role", "note").html(content).conceal().prependTo(this.element);
            this.fireEvent("create", toast);
            setTimeout(function() {
                self.show(toast);
            }, 10);
            if (options.duration) {
                setTimeout(function() {
                    self.hide(toast);
                }, options.duration + 10);
            }
        },
        hide: function(element) {
            element = $(element);
            this.fireEvent("hide", element);
            element.transitionend(function() {
                $(this).remove();
            }).conceal();
        },
        show: function(element) {
            element = $(element);
            element.reveal();
            this.fireEvent("show", element);
        }
    }, {
        position: "bottom-left",
        animation: "slide-up",
        duration: 5e3,
        template: '<aside class="toasts"></aside>'
    });
    Toolkit.create("toast", function(options) {
        return new Toolkit.Toast(this, options);
    });
    Toolkit.TypeAhead = Toolkit.Component.extend(function(input, options) {
        input = $(input);
        if (input.prop("tagName").toLowerCase() !== "input") {
            throw new Error("TypeAhead must be initialized on an input field");
        }
        var self = this;
        this.component = "TypeAhead";
        this.version = "1.4.0";
        this.options = options = this.setOptions(options, input);
        this.element = this.createElement().attr("role", "listbox").aria("multiselectable", false);
        this.input = input;
        this.shadow = null;
        this.index = -1;
        this.items = [];
        this.term = "";
        this.timer = null;
        this.cache = {};
        $.each({
            sorter: "sort",
            matcher: "match",
            builder: "build"
        }, function(key, fn) {
            if (options[key] === false) {
                return;
            }
            var callback;
            if (options[key] === null || $.type(options[key]) !== "function") {
                callback = self[fn];
            } else {
                callback = options[key];
            }
            options[key] = callback.bind(self);
        });
        if (options.prefetch && $.type(options.source) === "string") {
            var url = options.source;
            $.getJSON(url, options.query, function(items) {
                self.cache[url] = items;
            });
        }
        if (options.shadow) {
            this.wrapper = $("<div/>").addClass(vendor + "type-ahead-shadow");
            this.shadow = this.input.clone().addClass("is-shadow").removeAttr("id").prop("readonly", true).aria("readonly", true);
            this.input.addClass("not-shadow").replaceWith(this.wrapper);
            this.wrapper.append(this.shadow).append(this.input);
        }
        input.attr({
            autocomplete: "off",
            autocapitalize: "off",
            autocorrect: "off",
            spellcheck: "false",
            role: "combobox"
        }).aria({
            autocomplete: "list",
            owns: this.element.attr("id"),
            expanded: false
        });
        this.events = {
            "keyup input": "onLookup",
            "keydown input": "onCycle",
            "clickout element": "hide"
        };
        this.initialize();
    }, {
        build: function(item) {
            var a = $("<a/>", {
                href: "javascript:;",
                role: "option",
                "aria-selected": "false"
            });
            a.append($("<span/>", {
                "class": vendor + "type-ahead-title",
                html: this.highlight(item.title)
            }));
            if (item.description) {
                a.append($("<span/>", {
                    "class": vendor + "type-ahead-desc",
                    html: item.description
                }));
            }
            return a;
        },
        doDestroy: function() {
            if (this.shadow) {
                this.shadow.parent().replaceWith(this.input);
                this.input.removeClass("not-shadow");
            }
        },
        hide: function() {
            if (this.shadow) {
                this.shadow.val("");
            }
            this.input.aria("expanded", false);
            this.element.conceal();
            this.fireEvent("hide");
        },
        highlight: function(item) {
            var terms = this.term.replace(/[\-\[\]\{\}()*+?.,\\^$|#]/g, "\\$&").split(" "), callback = function(match) {
                return '<mark class="' + vendor + 'type-ahead-highlight">' + match + "</mark>";
            };
            for (var i = 0, t; t = terms[i]; i++) {
                item = item.replace(new RegExp(t, "ig"), callback);
            }
            return item;
        },
        lookup: function(term) {
            this.term = term;
            this.timer = setTimeout(this.onFind, this.options.throttle);
        },
        match: function(item, term) {
            return item.toLowerCase().indexOf(term.toLowerCase()) >= 0;
        },
        position: function() {
            if (!this.items.length) {
                this.hide();
                return;
            }
            var iPos = this.input.offset();
            this.element.css({
                left: iPos.left,
                top: iPos.top + this.input.outerHeight()
            }).reveal();
            this.input.aria("expanded", true);
            this.fireEvent("show");
        },
        rewind: function() {
            this.index = -1;
            this.element.find("li").removeClass("is-active");
        },
        select: function(index, event) {
            this.index = index;
            var rows = this.element.find("li");
            rows.removeClass("is-active").find("a").aria("selected", false);
            if (index >= 0) {
                if (this.items[index]) {
                    var item = this.items[index];
                    rows.eq(index).addClass("is-active").find("a").aria("selected", true);
                    this.input.val(item.title);
                    this.fireEvent(event || "select", [ item, index ]);
                }
            } else {
                this.input.val(this.term);
                this.fireEvent("reset");
            }
        },
        sort: function(items) {
            return items.sort(function(a, b) {
                return a.title.localeCompare(b.title);
            });
        },
        source: function(items) {
            if (!this.term.length || !items.length) {
                this.hide();
                return;
            }
            var options = this.options, term = this.term, categories = {
                _empty_: []
            }, item, list = $("<ul/>");
            this.items = [];
            this.index = -1;
            if ($.type(options.sorter) === "function") {
                items = options.sorter(items);
            }
            if ($.type(options.matcher) === "function") {
                items = items.filter(function(item) {
                    return options.matcher(item.title, term);
                });
            }
            for (var i = 0; item = items[i]; i++) {
                if (item.category) {
                    if (!categories[item.category]) {
                        categories[item.category] = [];
                    }
                    categories[item.category].push(item);
                } else {
                    categories._empty_.push(item);
                }
            }
            var results = [], count = 0;
            $.each(categories, function(category, items) {
                var elements = [];
                if (category !== "_empty_") {
                    results.push(null);
                    elements.push($("<li/>").addClass(vendor + "type-ahead-heading").append($("<span/>", {
                        text: category
                    })));
                }
                for (var i = 0, a; item = items[i]; i++) {
                    if (count >= options.itemLimit) {
                        break;
                    }
                    a = options.builder(item);
                    a.on({
                        mouseover: this.rewind,
                        click: $.proxy(this.onSelect, this, results.length)
                    });
                    elements.push($("<li/>").append(a));
                    results.push(item);
                    count++;
                }
                list.append(elements);
            }.bind(this));
            this.element.empty().append(list);
            this.items = results;
            this.cache[term.toLowerCase()] = results.filter(function(item) {
                return item !== null;
            });
            this.fireEvent("load");
            this._shadow();
            this.position();
        },
        _shadow: function() {
            if (!this.shadow) {
                return;
            }
            var term = this.input.val(), termLower = term.toLowerCase(), value = "";
            if (this.cache[termLower] && this.cache[termLower][0]) {
                var title = this.cache[termLower][0].title;
                if (title.toLowerCase().indexOf(termLower) === 0) {
                    value = term + title.substr(term.length, title.length - term.length);
                }
            }
            this.shadow.val(value);
        },
        onCycle: function(e) {
            var items = this.items, length = Math.min(this.options.itemLimit, Math.max(0, items.length)), event = "cycle";
            if (!length || !this.element.is(":shown")) {
                return;
            }
            switch (e.keyCode) {
                case 38:
                    this.index -= items[this.index - 1] ? 1 : 2;
                    if (this.index < 0) {
                        this.index = length;
                    }
                    break;

                case 40:
                    this.index += items[this.index + 1] ? 1 : 2;
                    if (this.index >= length) {
                        this.index = -1;
                    }
                    break;

                case 9:
                    e.preventDefault();
                    var i = 0;
                    while (!this.items[i]) {
                        i++;
                    }
                    event = "select";
                    this.index = i;
                    this.hide();
                    break;

                case 13:
                    e.preventDefault();
                    event = "select";
                    this.hide();
                    break;

                case 27:
                    this.index = -1;
                    this.hide();
                    break;

                default:
                    return;
            }
            if (this.shadow) {
                this.shadow.val("");
            }
            this.select(this.index, event);
        },
        onFind: function() {
            var term = this.term, options = this.options, sourceType = $.type(options.source);
            if (this.cache[term.toLowerCase()]) {
                this.source(this.cache[term.toLowerCase()]);
            } else if (sourceType === "string") {
                var url = options.source, cache = this.cache[url];
                if (cache) {
                    this.source(cache);
                } else {
                    var query = options.query;
                    query.term = term;
                    $.getJSON(url, query, this.source);
                }
            } else if (sourceType === "array") {
                this.source(options.source);
            } else if (sourceType === "function") {
                var response = options.source.call(this);
                if (response) {
                    this.source(response);
                }
            } else {
                throw new Error("Invalid TypeAhead source type");
            }
        },
        onLookup: function(e) {
            if ($.inArray(e.keyCode, [ 38, 40, 27, 9, 13 ]) >= 0) {
                return;
            }
            clearTimeout(this.timer);
            var term = this.input.val().trim();
            if (term.length < this.options.minLength) {
                this.fireEvent("reset");
                this.hide();
            } else {
                this._shadow();
                this.lookup(term);
            }
        },
        onSelect: function(index) {
            this.select(index);
            this.hide();
        }
    }, {
        source: [],
        minLength: 1,
        itemLimit: 15,
        throttle: 250,
        prefetch: false,
        shadow: false,
        query: {},
        template: '<div class="type-ahead"></div>',
        sorter: null,
        matcher: null,
        builder: null
    });
    Toolkit.create("typeAhead", function(options) {
        return new Toolkit.TypeAhead(this, options);
    });
})(window, jQuery);