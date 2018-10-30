!(function() {
  function a(a, b) {
    var c = this
    ;(c.scope = a), (c.options = { offline: !b.shouldResolveSourceMaps })
  }
  function b(a, b, c, d) {
    var e = this
    ;(e.settings = {}),
      (e.handlers = []),
      $sessionstackjq.each(d, function(d, f) {
        e.handlers.push(new f(a, b, c))
      })
  }
  function c(a, b) {
    var c = this,
      d = a.onerror
    ;(c.isLogging = !1),
      (c.recorderQueue = b),
      (a.onerror = function(a, b, e, f, g) {
        return (
          c.autoLogErrors && c.isLogging && c.recorderQueue.addLog(new n(g, { level: n.LOG_LEVELS.ERROR })),
          $sessionstackjq.isFunction(d) ? d.apply(c, arguments) : void 0
        )
      })
  }
  function d(a, b, c) {
    function d(a) {
      if (!a || 'function' != typeof a.forEach) return {}
      var b = {}
      return (
        a.forEach(function(a, c) {
          var d = c.toLowerCase()
          k(d) || (b[d] = a)
        }),
        b
      )
    }
    function f(a) {
      ia.isNullOrUndefined(a) ||
        h(a.url) ||
        !l.isLogging ||
        (l.autoLogAllNetworkRequests
          ? l.networkRequestLogger.log(a)
          : l.autoLogFailedNetworkRequests && g(a) && l.networkRequestLogger.log(a))
    }
    function g(a) {
      return a.isFailed || (a.statusCode >= 400 && a.statusCode <= 599)
    }
    function h(a) {
      var b = ja.getServerUrl()
      return 0 === a.indexOf(b)
    }
    function i(a) {
      if (!a) return {}
      var b = a.split('\n'),
        c = {}
      return (
        $sessionstackjq.each(b, function(a, b) {
          if (b) {
            var d = b.indexOf(':'),
              e = b.slice(0, d).trim(),
              f = b.slice(d + 1, b.length).trim()
            c[e] = f
          }
        }),
        c
      )
    }
    function j(a) {
      if (!a) return {}
      var b = {}
      for (var c in a) {
        var d = c.toLowerCase()
        k(d) || (b[d] = a[c])
      }
      return b
    }
    function k(a) {
      return m.indexOf(a) > -1
    }
    var l = this,
      m = ['authorization']
    if (((l.networkRequestLogger = new e(b, c)), !ia.isNullOrUndefined(a.XMLHttpRequest))) {
      var n = a.XMLHttpRequest.prototype.open,
        o = a.XMLHttpRequest.prototype.send,
        p = a.XMLHttpRequest.prototype.setRequestHeader,
        q = a.fetch
      ;(a.XMLHttpRequest.prototype.open = function(a, b) {
        ;(ka.sessionstackPropertyObject(this).xhr = { method: a, url: b, timestamp: $sessionstackjq.now() }),
          $sessionstackjq.isFunction(n) && n.apply(this, arguments)
      }),
        (a.XMLHttpRequest.prototype.send = function() {
          $sessionstackjq.isFunction(o) && o.apply(this, arguments)
          var a = ka.sessionstackPropertyObject(this).xhr,
            b = this.onload
          this.onload = function() {
            ;(a.endTime = $sessionstackjq.now()), (a.statusCode = this.status), (a.statusText = this.statusText)
            var c = this.getAllResponseHeaders()
            ;(a.responseHeaders = i(c)), f(a), $sessionstackjq.isFunction(b) && b.apply(this, arguments)
          }
        }),
        (a.XMLHttpRequest.prototype.setRequestHeader = function(a, b) {
          var c = a.toLowerCase()
          if (!k(c)) {
            var d = ka.sessionstackPropertyObject(this).xhr
            ;(d.requestHeaders = d.requestHeaders || {}), (d.requestHeaders[c] = b)
          }
          $sessionstackjq.isFunction(p) && p.apply(this, arguments)
        }),
        (a.fetch = function(b, c) {
          if ($sessionstackjq.isFunction(q)) {
            var e,
              g,
              h,
              i = this,
              k = arguments
            try {
              b instanceof a.Request ? ((e = b.url), (g = b.method)) : 'string' == typeof b && (e = b),
                c ? ((g = c.method), (h = c.headers)) : (g = g || 'get')
              var l = { method: g, url: e, requestHeaders: j(h), timestamp: $sessionstackjq.now() }
              return new a.Promise(function(a, b) {
                q.apply(i, k).then(
                  function(b) {
                    a.apply(i, arguments),
                      (l.endTime = $sessionstackjq.now()),
                      (l.url = b.url),
                      (l.responseHeaders = d(b.headers)),
                      (l.statusCode = b.status),
                      (l.statusText = b.statusText),
                      f(l)
                  },
                  function(a) {
                    b.apply(i, arguments), (l.endTime = $sessionstackjq.now()), (l.message = a ? a.message : ''), (l.isFailed = !0), f(l)
                  }
                )
              })
            } catch (m) {
              return q.apply(i, k)
            }
          }
        })
    }
  }
  function e(a, b) {
    ;(this.recorderQueue = a), (this.recorderObject = b)
  }
  function f(a) {
    return a.method + ' ' + a.url + ' ' + a.statusCode + ' (' + a.statusText + ')'
  }
  function g(a) {
    return ia.isObject(a)
      ? a.url && !ia.isString(a.url)
        ? (console.warn(
            'Url type is invalid. The original data will not be modified. https://docs.sessionstack.com/v2.0/reference#data-scrubbing'
          ),
          !1)
        : a.requestHeaders && !ia.isObject(a.requestHeaders)
          ? (console.warn(
              'Request headers type is invalid. The original data will not be modified. https://docs.sessionstack.com/v2.0/reference#data-scrubbing'
            ),
            !1)
          : h(a.requestHeaders)
            ? a.responseHeaders && !ia.isObject(a.responseHeaders)
              ? (console.warn(
                  'Response headers type is invalid. The original data will not be modified. https://docs.sessionstack.com/v2.0/reference#data-scrubbing'
                ),
                !1)
              : h(a.responseHeaders)
                ? !0
                : !1
            : !1
      : (console.warn(
          'Returned value type is invalid. The original data will not be modified. https://docs.sessionstack.com/v2.0/reference#data-scrubbing'
        ),
        !1)
  }
  function h(a) {
    if (!a) return !0
    var b = !0
    return (
      $sessionstackjq.each(a, function(a, c) {
        return ia.isString(c)
          ? void 0
          : (console.warn(
              a +
                ' value type is invalid. The original data will not be modified. https://docs.sessionstack.com/v2.0/reference#data-scrubbing'
            ),
            void (b = !1))
      }),
      b
    )
  }
  function i(a, b) {
    var c = this
    ;(c.recorderQueue = b),
      (c.isLogging = !1),
      (c.enabledMethods = {}),
      $sessionstackjq.each(i.CONSOLE_METHODS, function(d, e) {
        var f = a.console[e]
        a.console[e] = function() {
          if (($sessionstackjq.isFunction(f) && f.apply(a.console, arguments), c.enabledMethods[e] && c.isLogging)) {
            var d = e
            'log' === d && (d = n.LOG_LEVELS.INFO),
              $sessionstackjq.each(arguments, function(a, c) {
                b.addLog(new n(c, { level: d }))
              })
          }
        }
      })
  }
  function j(b) {
    var c = this
    ;(c.scope = b), (c.errorResolver = new a(b, { shouldResolveSourceMaps: ja.SHOULD_RESOLVE_SOURCE_MAPS }))
  }
  function k(a, b, c, d, e) {
    ;(this.jqScope = $sessionstackjq(a)),
      (this.event = b),
      (this.handler = c),
      (this.selector = d || null),
      (this.dispatchToRegisteredListener = e)
  }
  function l(a) {
    this.listeners = a
  }
  function m(a, b) {
    ;(this.type = a), (this.data = b)
  }
  function n(a, b, c) {
    var d = this
    ;(d.entry = a), (d.type = c), (b = $sessionstackjq.isPlainObject(b) ? b : {}), n.isValidLogLevel(b.level) && (d.level = b.level)
  }
  function o(a, b) {
    ;(this.item = a), (this.timestamp = b)
  }
  function p(a, b, c, d, e) {
    var f = ''
    if (d) {
      var g = new Date()
      g.setTime(g.getTime() + 60 * d * 1e3), (f = '; expires=' + g.toUTCString())
    }
    var h = encodeURIComponent(b) + '=' + encodeURIComponent(c) + f
    e && (h += ';domain=' + e + ';path=/'), (a.cookie = h)
  }
  function q(a) {
    for (var b = [], c = r(a), d = c.split('.'), e = d.length - 1; e >= 0; e--) {
      var f = d.slice(e).join('.')
      b.push(f)
    }
    return b
  }
  function r(a) {
    var b = a.location.hostname
    return 0 === b.indexOf(sa) ? b.substring(sa.length) : b
  }
  function s(a) {
    var b = a.location.protocol
    return b === ta || b === ua
  }
  function t() {
    var a = this
    ;(a.events = []), (a.logs = []), (a.onAddEventAtCallback = function() {}), (a.onAddLogAtCallback = function() {})
  }
  function u() {}
  function v(a) {
    this.receiverWindow = a
  }
  function w(a, b) {
    ;(this.headers = { Authorization: a }), (this.nrManager = b)
  }
  function x(a, b, c) {
    var d = this
    return x.isSupported() ? ((d.url = a), (d.requests = []), void d.openNewSocket(b, c)) : c()
  }
  function y(a) {
    var b = this
    ;(b.websocketClient = a),
      (b.listeners = {}),
      (b.dispatchers = {}),
      (b.dispatchers[y.EVENTS.PLAYER_CONNECTED] = function(a, c) {
        c.call(b)
      }),
      (b.dispatchers[y.EVENTS.NUMBER_OF_PLAYERS_CONNECTED] = function(a, c) {
        c.call(b, a.data.numberOfPlayersConnected)
      }),
      (b.dispatchers[y.EVENTS.PATH] = function(a, c) {
        c.call(b, a.path)
      }),
      (b.dispatchers[y.EVENTS.MOUSEMOVE] = function(a, c) {
        c.call(b, a.x, a.y)
      }),
      (b.dispatchers[y.EVENTS.CLICK] = function(a, c) {
        c.call(b, a.x, a.y)
      }),
      (b.dispatchers[y.EVENTS.EXIT_CURSOR] = function(a, c) {
        c.call(b)
      }),
      b.websocketClient.addEventListener('message', function(a) {
        var c,
          d,
          e = JSON.parse(a.data),
          f = b.dispatchers[e.type]
        if (f) {
          var g = b.listeners[e.type] || []
          for (c = 0; c < g.length; c++) (d = g[c]), f.call(b, e, d)
        }
      })
  }
  function z(a) {
    var b = this
    ;(b.eventListeners = []),
      (b.requestsQueue = []),
      (a = a || {}),
      (heartbeatInterval = a.heartbeatInterval || z.DEFAULT_HEARTBEAT_INTERVAL),
      (retries = a.retries || z.DEFAULT_AUTORECONNECT_RETRIES),
      (b.reconnectService = new A(b, heartbeatInterval, retries))
  }
  function A(a, b, c) {
    var d = this
    ;(d.client = a), (d.heartbeatInterval = b), (d.maxRetries = c), (d.retries = 0), (d.interval = null)
  }
  function B(a, b, c) {
    var d = this
    ;(d.scope = a), (d.restClient = b), (d.nrManager = c), (d.logResolver = new j(d.scope))
  }
  function C() {}
  function D(a, b, c) {
    var d = this
    ;(d.restClient = c), (d.sessionManager = b)
  }
  function E(a, e, f, g, h, j, k) {
    var l = this
    ;(l.documentNode = a),
      (l.recorderQueue = e),
      (l.callback = g),
      (l.scope = h),
      (l.depth = j || 1),
      (l.recorderObject = k),
      (l.nestedDocumentsRecorders = {}),
      (l.queuedFrames = []),
      (l.crossOriginFramesManager = f),
      (l.StylesRecorder = new J(l.callback)),
      (l.recorders = [
        new G(a, l.callback),
        new H(a, l.callback),
        new F(a, l.callback, h, l, f, l.StylesRecorder),
        new I(a, l.callback),
        l.StylesRecorder
      ]),
      (l.automaticLoggingHandler = new b(a.defaultView, l.recorderQueue, l.recorderObject, [c, d, i]))
  }
  function F(a, b, c, d, e, f) {
    var g = this
    ;(g.rootNode = a),
      (g.callback = b),
      (g.scope = c),
      (g.documentRecorder = d),
      (g.crossOriginFramesManager = e),
      (g.stylesRecorder = f),
      (g.mutationSummaryConfig = {
        rootNode: g.rootNode,
        callback: g.handleMutationSummaryChanges.bind(g),
        queries: [{ all: !0 }],
        oldPreviousSibling: !0
      })
  }
  function G(a, b) {
    var c = this
    ;(c.lastMouseMoveTime = 0), (c.lastMouseMovePosition = { x: 0, y: 0 })
    var d = '*',
      e = new k(a, 'mousemove', function(a) {
        if ($sessionstackjq.isFunction(b)) {
          var d = $sessionstackjq.now()
          ;(c.lastMouseMovePosition.x !== a.clientX || c.lastMouseMovePosition.y !== a.clientY) &&
            d - c.lastMouseMoveTime > G.MOUSE_CAPTURE_INTERVAL &&
            ((c.lastMouseMoveTime = d),
            (c.lastMouseMovePosition = { x: a.clientX, y: a.clientY }),
            b(
              new m(ha.MOUSE_MOVE, {
                x: a.clientX,
                y: a.clientY,
                pageX: a.pageX,
                pageY: a.pageY,
                frameElementId: ka.getFrameElementId(a.target.ownerDocument)
              })
            ))
        }
      }),
      f = new k(a, 'mousedown', function(a) {
        if ($sessionstackjq.isFunction(b)) {
          var c = ka.getElementNodeSelector(a.target)
          b(
            new m(ha.MOUSE_CLICK, {
              x: a.clientX,
              y: a.clientY,
              pageX: a.pageX,
              pageY: a.pageY,
              frameElementId: ka.getFrameElementId(a.target.ownerDocument),
              selector: c
            })
          )
        }
      }),
      g = new k(
        a,
        'mouseover',
        function(a) {
          a.stopPropagation(), $sessionstackjq.isFunction(b) && b(new m(ha.MOUSE_OVER, { id: ka.getId(a.target) }))
        },
        d
      ),
      h = new k(
        a,
        'mouseout',
        function(a) {
          a.stopPropagation(), $sessionstackjq.isFunction(b) && b(new m(ha.MOUSE_OUT, { id: ka.getId(a.target) }))
        },
        d
      ),
      i = new k(
        a,
        'scroll',
        function(a) {
          if ($sessionstackjq.isFunction(b)) {
            var c = { top: $sessionstackjq(a.target).scrollTop(), left: $sessionstackjq(a.target).scrollLeft(), id: ka.getId(a.target) }
            ka.isDocumentNode(a.target) && ((c.id = ka.getFrameElementId(a.target)), (c.windowScroll = !0)),
              b(new m(ha.SCROLL_POSITION_CHANGE, c))
          }
        },
        null,
        !0
      ),
      j = new k(a.defaultView, 'resize', function(a) {
        if (a.target === window && $sessionstackjq.isFunction(b)) {
          var c = la.capture()
          b(new m(ha.WINDOW_RESIZE, { width: c.screenWidth, height: c.screenHeight }))
        }
      }),
      n = new k(a, ia.VISIBILITY_CHANGE_EVENT_NAME, function() {
        a === document &&
          a.defaultView === window.top &&
          $sessionstackjq.isFunction(b) &&
          b(new m(ha.VISIBILITY_CHANGE, { visibilityState: a[ia.VISIBILITY_STATE_PROPERTY_NAME] }))
      })
    ;(c.recordInitialVisibilityState = function(c) {
      var d = a === document && a.defaultView === window.top,
        e = a[ia.VISIBILITY_STATE_PROPERTY_NAME] !== c,
        f = !ia.isNullOrUndefined(a[ia.VISIBILITY_STATE_PROPERTY_NAME])
      d &&
        e &&
        f &&
        $sessionstackjq.isFunction(b) &&
        b(new m(ha.VISIBILITY_CHANGE, { visibilityState: a[ia.VISIBILITY_STATE_PROPERTY_NAME] }))
    }),
      (c.listeners = new l([e, f, g, h, i, j, n]))
  }
  function H(a, b) {
    var c = this
    ;(c.root = a),
      (c.callback = b),
      $sessionstackjq.isFunction(c.callback) && ((c.listeners = c.createInputEventListeners()), c.createPropertyChangeListeners())
  }
  function I(a, b) {
    var c = this
    ;(c.document = a),
      (c.window = a.defaultView),
      (function(a) {
        if (a) {
          var b = a.pushState
          b &&
            (a.pushState = function() {
              var d = b.apply(a, arguments)
              return $sessionstackjq(c.window).trigger('sessionstack.pushstate', arguments[0]), d
            })
        }
      })(c.window.history)
    var d = function() {
      c.lastRecordedHistoryState !== c.document.URL &&
        ((c.lastRecordedHistoryState = c.document.URL),
        $sessionstackjq.isFunction(b) && b(new m(ha.URL_CHANGE, { url: c.lastRecordedHistoryState })))
    }
    ;(c.listeners = new l([
      new k(c.window, 'popstate', d),
      new k(c.window, 'sessionstack.pushstate', d),
      new k(c.window, 'hashchange', d)
    ])),
      (c.recordInitialHistoryState = function() {
        c.lastRecordedHistoryState ||
          ((c.lastRecordedHistoryState = c.document.URL),
          $sessionstackjq.isFunction(b) && b(new m(ha.URL_CHANGE, { url: c.lastRecordedHistoryState })))
      })
  }
  function J(a) {
    ;(this.callback = a), (this.isStarted = !1)
  }
  function K(a, b, c) {
    return new m(ha.CSS_RULE_INSERT, { nodeId: a, rule: b, index: c })
  }
  function L(a, b) {
    return new m(ha.CSS_RULE_DELETE, { nodeId: a, index: b })
  }
  function M(a, b) {
    var c = this
    ;(c.isStarted = !1), (c.recorderQueue = a), (c.sessionDataClient = b)
  }
  function N(a, b, c) {
    var d = this
    ;(d.isStarted = !1), (d.isStreaming = !1), (d.queue = a), (d.brokerClient = b), (d.sessionDataClient = c)
  }
  function O() {}
  function P() {}
  function Q(a) {
    ;(this.restClient = a), (this.onPingSuccessCallback = function() {}), (this.onPingFailureCallback = function() {})
  }
  function R() {}
  function S(a, b, c, d, e, f, g) {
    var h = this,
      i = a.isIframe,
      j = function() {
        h.recordEvent.apply(h, arguments)
      }
    ;(h.sessionDataClient = i ? new C() : new B(f, d, c)),
      (h.token = a.token),
      (h.scope = f),
      (h.recorderObject = g),
      (h.nrManager = c),
      (h.sessionManager = b),
      (h.restClient = d),
      (h.brokerClient = e),
      (h.liveStreamRecorderQueue = i ? new u() : new t()),
      (h.recorderQueue = i ? new v(window.top) : new t()),
      i ||
        (h.recorderQueue.onAddEventAt(function(a, b) {
          h.liveStreamRecorderQueue.addEventAt(a, b)
        }),
        h.recorderQueue.onAddLogAt(function(a, b) {
          h.liveStreamRecorderQueue.addLogAt(a, b)
        })),
      (h.crossOriginFramesManager = new qa(window)),
      (h.documentRecorder = new E(document, h.recorderQueue, h.crossOriginFramesManager, j, h.scope, null, h.recorderObject)),
      (h.pingService = i ? new R() : new Q(d)),
      h.pingService.onPingFailure(function(a) {
        var b = 401 === a.status
        b && h.stop({ keepSessionId: !0 })
      }),
      (h.recorderDataService = i ? new P() : new M(h.recorderQueue, h.sessionDataClient)),
      (h.liveStreamDataService = i ? new O() : new N(h.liveStreamRecorderQueue, h.brokerClient, h.sessionDataClient)),
      (h.domSnapshot = new Aa(document)),
      (h.host = new ma(document)),
      (h.isRecording = !1),
      (h.isSendingData = !1),
      (h.hasLoadedSessionId = !1),
      (h.settings = {}),
      (h.sessionRecordingStartedCallbacks = []),
      $sessionstackjq(window).on('beforeunload', function() {
        h.recorderDataService.sendPendingData()
      }),
      i ||
        window.addEventListener('message', function(a) {
          $sessionstackjq.isPlainObject(a.data) && a.data.isSessionStackData && h.recorderQueue.addEntity(a.data)
        }),
      h.brokerClient.onPlayerConnected(function() {
        h.liveStreamDataService.startStreaming(), h.snapshotWholePage()
      }),
      h.brokerClient.onNumberOfPlayersConnected(function(a) {
        a > 0
          ? h.liveStreamDataService.isStreaming || (h.liveStreamDataService.startStreaming(), h.snapshotWholePage())
          : h.liveStreamDataService.stopStreaming()
      })
  }
  function T() {
    this.commands = {}
  }
  function U(a, b) {
    ;(this.recorder = a),
      (this.sessionManager = b),
      this.registerCommand(U.START_RECORDING_COMMAND, this.executeStartRecording),
      this.registerCommand(U.START_COMMAND, this.executeStartRecording),
      this.registerCommand(U.STOP_RECORDING_COMMAND, this.executeStopRecording),
      this.registerCommand(U.STOP_COMMAND, this.executeStopRecording),
      this.registerCommand(U.IS_RECORDING_COMMAND, this.executeIsRecording),
      this.registerCommand(U.GET_SESSION_ID, this.executeGetSessionId)
  }
  function V(a) {
    ;(this.recorder = a), this.registerCommand(V.LOG_COMMAND, this.executeLog)
  }
  function W(a, b) {
    ;(this.sessionManager = a),
      (this.userIdentityManager = b),
      this.registerCommand(W.IDENTIFY, this.executeIdentify),
      this.registerCommand(W.CLEAR_USER_COOKIE, this.executeClearUserCookie)
  }
  function X(a) {
    var b = this
    ;(b.commandHandlers = {}),
      $sessionstackjq.each(a, function(a, c) {
        var d = c.getCommands()
        $sessionstackjq.each(d, function(a, d) {
          b.registerCommandHandler(c, a, d)
        })
      })
  }
  function Y(a) {
    ;(this.recorderObject = a), this.registerCommand(Y.SET_ON_DATA_CALLBACK, this.setOnDataCallback)
  }
  !(function(a, b) {
    b(a)
  })('undefined' != typeof window ? window : this, function(a, b) {
    function c(a) {
      var b = 'length' in a && a.length,
        c = ea.type(a)
      return 'function' === c || ea.isWindow(a)
        ? !1
        : 1 === a.nodeType && b
          ? !0
          : 'array' === c || 0 === b || ('number' == typeof b && b > 0 && b - 1 in a)
    }
    function d(a, b, c) {
      if (ea.isFunction(b))
        return ea.grep(a, function(a, d) {
          return !!b.call(a, d, a) !== c
        })
      if (b.nodeType)
        return ea.grep(a, function(a) {
          return (a === b) !== c
        })
      if ('string' == typeof b) {
        if (ma.test(b)) return ea.filter(b, a, c)
        b = ea.filter(b, a)
      }
      return ea.grep(a, function(a) {
        return ea.inArray(a, b) >= 0 !== c
      })
    }
    function e(a, b) {
      do a = a[b]
      while (a && 1 !== a.nodeType)
      return a
    }
    function f(a) {
      var b = (ua[a] = {})
      return (
        ea.each(a.match(ta) || [], function(a, c) {
          b[c] = !0
        }),
        b
      )
    }
    function g() {
      oa.addEventListener
        ? (oa.removeEventListener('DOMContentLoaded', h, !1), a.removeEventListener('load', h, !1))
        : (oa.detachEvent('onreadystatechange', h), a.detachEvent('onload', h))
    }
    function h() {
      ;(oa.addEventListener || 'load' === event.type || 'complete' === oa.readyState) && (g(), ea.ready())
    }
    function i(a, b, c) {
      if (void 0 === c && 1 === a.nodeType) {
        var d = 'data-' + b.replace(za, '-$1').toLowerCase()
        if (((c = a.getAttribute(d)), 'string' == typeof c)) {
          try {
            c = 'true' === c ? !0 : 'false' === c ? !1 : 'null' === c ? null : +c + '' === c ? +c : ya.test(c) ? ea.parseJSON(c) : c
          } catch (e) {}
          ea.data(a, b, c)
        } else c = void 0
      }
      return c
    }
    function j(a) {
      var b
      for (b in a) if (('data' !== b || !ea.isEmptyObject(a[b])) && 'toJSON' !== b) return !1
      return !0
    }
    function k(a, b, c, d) {
      var e,
        f,
        g = ea.expando,
        h = a.nodeType,
        i = h ? ea.cache : a,
        j = h ? a[g] : a[g] && g
      if ((j && i[j] && (d || i[j].data)) || void 0 !== c || 'string' != typeof b)
        return (
          j || (j = h ? (a[g] = W.pop() || ea.guid++) : g),
          i[j] || (i[j] = h ? {} : { toJSON: ea.noop }),
          ('object' == typeof b || 'function' == typeof b) && (d ? (i[j] = ea.extend(i[j], b)) : (i[j].data = ea.extend(i[j].data, b))),
          (f = i[j]),
          d || (f.data || (f.data = {}), (f = f.data)),
          void 0 !== c && (f[ea.camelCase(b)] = c),
          'string' == typeof b ? ((e = f[b]), null == e && (e = f[ea.camelCase(b)])) : (e = f),
          e
        )
    }
    function l(a, b, c) {
      if (ea.acceptData(a)) {
        var d,
          e,
          f = a.nodeType,
          g = f ? ea.cache : a,
          h = f ? a[ea.expando] : ea.expando
        if (g[h]) {
          if (b && (d = c ? g[h] : g[h].data)) {
            ea.isArray(b)
              ? (b = b.concat(ea.map(b, ea.camelCase)))
              : b in d
                ? (b = [b])
                : ((b = ea.camelCase(b)), (b = b in d ? [b] : b.split(' '))),
              (e = b.length)
            for (; e--; ) delete d[b[e]]
            if (c ? !j(d) : !ea.isEmptyObject(d)) return
          }
          ;(c || (delete g[h].data, j(g[h]))) &&
            (f ? ea.cleanData([a], !0) : ca.deleteExpando || g != g.window ? delete g[h] : (g[h] = null))
        }
      }
    }
    function m() {
      return !0
    }
    function n() {
      return !1
    }
    function o() {
      try {
        return oa.activeElement
      } catch (a) {}
    }
    function p(a) {
      var b = Ka.split('|'),
        c = a.createDocumentFragment()
      if (c.createElement) for (; b.length; ) c.createElement(b.pop())
      return c
    }
    function q(a, b) {
      var c,
        d,
        e = 0,
        f =
          typeof a.getElementsByTagName !== xa
            ? a.getElementsByTagName(b || '*')
            : typeof a.querySelectorAll !== xa
              ? a.querySelectorAll(b || '*')
              : void 0
      if (!f) for (f = [], c = a.childNodes || a; null != (d = c[e]); e++) !b || ea.nodeName(d, b) ? f.push(d) : ea.merge(f, q(d, b))
      return void 0 === b || (b && ea.nodeName(a, b)) ? ea.merge([a], f) : f
    }
    function r(a) {
      Ea.test(a.type) && (a.defaultChecked = a.checked)
    }
    function s(a, b) {
      return ea.nodeName(a, 'table') && ea.nodeName(11 !== b.nodeType ? b : b.firstChild, 'tr')
        ? a.getElementsByTagName('tbody')[0] || a.appendChild(a.ownerDocument.createElement('tbody'))
        : a
    }
    function t(a) {
      return (a.type = (null !== ea.find.attr(a, 'type')) + '/' + a.type), a
    }
    function u(a) {
      var b = Va.exec(a.type)
      return b ? (a.type = b[1]) : a.removeAttribute('type'), a
    }
    function v(a, b) {
      for (var c, d = 0; null != (c = a[d]); d++) ea._data(c, 'globalEval', !b || ea._data(b[d], 'globalEval'))
    }
    function w(a, b) {
      if (1 === b.nodeType && ea.hasData(a)) {
        var c,
          d,
          e,
          f = ea._data(a),
          g = ea._data(b, f),
          h = f.events
        if (h) {
          delete g.handle, (g.events = {})
          for (c in h) for (d = 0, e = h[c].length; e > d; d++) ea.event.add(b, c, h[c][d])
        }
        g.data && (g.data = ea.extend({}, g.data))
      }
    }
    function x(a, b) {
      var c, d, e
      if (1 === b.nodeType) {
        if (((c = b.nodeName.toLowerCase()), !ca.noCloneEvent && b[ea.expando])) {
          e = ea._data(b)
          for (d in e.events) ea.removeEvent(b, d, e.handle)
          b.removeAttribute(ea.expando)
        }
        'script' === c && b.text !== a.text
          ? ((t(b).text = a.text), u(b))
          : 'object' === c
            ? (b.parentNode && (b.outerHTML = a.outerHTML),
              ca.html5Clone && a.innerHTML && !ea.trim(b.innerHTML) && (b.innerHTML = a.innerHTML))
            : 'input' === c && Ea.test(a.type)
              ? ((b.defaultChecked = b.checked = a.checked), b.value !== a.value && (b.value = a.value))
              : 'option' === c
                ? (b.defaultSelected = b.selected = a.defaultSelected)
                : ('input' === c || 'textarea' === c) && (b.defaultValue = a.defaultValue)
      }
    }
    function y(b, c) {
      var d,
        e = ea(c.createElement(b)).appendTo(c.body),
        f = a.getDefaultComputedStyle && (d = a.getDefaultComputedStyle(e[0])) ? d.display : ea.css(e[0], 'display')
      return e.detach(), f
    }
    function z(a) {
      var b = oa,
        c = _a[a]
      return (
        c ||
          ((c = y(a, b)),
          ('none' !== c && c) ||
            (($a = ($a || ea("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement)),
            (b = ($a[0].contentWindow || $a[0].contentDocument).document),
            b.write(),
            b.close(),
            (c = y(a, b)),
            $a.detach()),
          (_a[a] = c)),
        c
      )
    }
    function A(a, b) {
      return {
        get: function() {
          var c = a()
          if (null != c) return c ? void delete this.get : (this.get = b).apply(this, arguments)
        }
      }
    }
    function B(a, b) {
      if (b in a) return b
      for (var c = b.charAt(0).toUpperCase() + b.slice(1), d = b, e = mb.length; e--; ) if (((b = mb[e] + c), b in a)) return b
      return d
    }
    function C(a, b) {
      for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++)
        (d = a[g]),
          d.style &&
            ((f[g] = ea._data(d, 'olddisplay')),
            (c = d.style.display),
            b
              ? (f[g] || 'none' !== c || (d.style.display = ''),
                '' === d.style.display && Ca(d) && (f[g] = ea._data(d, 'olddisplay', z(d.nodeName))))
              : ((e = Ca(d)), ((c && 'none' !== c) || !e) && ea._data(d, 'olddisplay', e ? c : ea.css(d, 'display'))))
      for (g = 0; h > g; g++)
        (d = a[g]), d.style && ((b && 'none' !== d.style.display && '' !== d.style.display) || (d.style.display = b ? f[g] || '' : 'none'))
      return a
    }
    function D(a, b, c) {
      var d = ib.exec(b)
      return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || 'px') : b
    }
    function E(a, b, c, d, e) {
      for (var f = c === (d ? 'border' : 'content') ? 4 : 'width' === b ? 1 : 0, g = 0; 4 > f; f += 2)
        'margin' === c && (g += ea.css(a, c + Ba[f], !0, e)),
          d
            ? ('content' === c && (g -= ea.css(a, 'padding' + Ba[f], !0, e)),
              'margin' !== c && (g -= ea.css(a, 'border' + Ba[f] + 'Width', !0, e)))
            : ((g += ea.css(a, 'padding' + Ba[f], !0, e)), 'padding' !== c && (g += ea.css(a, 'border' + Ba[f] + 'Width', !0, e)))
      return g
    }
    function F(a, b, c) {
      var d = !0,
        e = 'width' === b ? a.offsetWidth : a.offsetHeight,
        f = ab(a),
        g = ca.boxSizing && 'border-box' === ea.css(a, 'boxSizing', !1, f)
      if (0 >= e || null == e) {
        if (((e = bb(a, b, f)), (0 > e || null == e) && (e = a.style[b]), db.test(e))) return e
        ;(d = g && (ca.boxSizingReliable() || e === a.style[b])), (e = parseFloat(e) || 0)
      }
      return e + E(a, b, c || (g ? 'border' : 'content'), d, f) + 'px'
    }
    function G(a, b, c, d, e) {
      return new G.prototype.init(a, b, c, d, e)
    }
    function H() {
      return (
        setTimeout(function() {
          nb = void 0
        }),
        (nb = ea.now())
      )
    }
    function I(a, b) {
      var c,
        d = { height: a },
        e = 0
      for (b = b ? 1 : 0; 4 > e; e += 2 - b) (c = Ba[e]), (d['margin' + c] = d['padding' + c] = a)
      return b && (d.opacity = d.width = a), d
    }
    function J(a, b, c) {
      for (var d, e = (tb[b] || []).concat(tb['*']), f = 0, g = e.length; g > f; f++) if ((d = e[f].call(c, b, a))) return d
    }
    function K(a, b, c) {
      var d,
        e,
        f,
        g,
        h,
        i,
        j,
        k,
        l = this,
        m = {},
        n = a.style,
        o = a.nodeType && Ca(a),
        p = ea._data(a, 'fxshow')
      c.queue ||
        ((h = ea._queueHooks(a, 'fx')),
        null == h.unqueued &&
          ((h.unqueued = 0),
          (i = h.empty.fire),
          (h.empty.fire = function() {
            h.unqueued || i()
          })),
        h.unqueued++,
        l.always(function() {
          l.always(function() {
            h.unqueued--, ea.queue(a, 'fx').length || h.empty.fire()
          })
        })),
        1 === a.nodeType &&
          ('height' in b || 'width' in b) &&
          ((c.overflow = [n.overflow, n.overflowX, n.overflowY]),
          (j = ea.css(a, 'display')),
          (k = 'none' === j ? ea._data(a, 'olddisplay') || z(a.nodeName) : j),
          'inline' === k &&
            'none' === ea.css(a, 'float') &&
            (ca.inlineBlockNeedsLayout && 'inline' !== z(a.nodeName) ? (n.zoom = 1) : (n.display = 'inline-block'))),
        c.overflow &&
          ((n.overflow = 'hidden'),
          ca.shrinkWrapBlocks() ||
            l.always(function() {
              ;(n.overflow = c.overflow[0]), (n.overflowX = c.overflow[1]), (n.overflowY = c.overflow[2])
            }))
      for (d in b)
        if (((e = b[d]), pb.exec(e))) {
          if ((delete b[d], (f = f || 'toggle' === e), e === (o ? 'hide' : 'show'))) {
            if ('show' !== e || !p || void 0 === p[d]) continue
            o = !0
          }
          m[d] = (p && p[d]) || ea.style(a, d)
        } else j = void 0
      if (ea.isEmptyObject(m)) 'inline' === ('none' === j ? z(a.nodeName) : j) && (n.display = j)
      else {
        p ? 'hidden' in p && (o = p.hidden) : (p = ea._data(a, 'fxshow', {})),
          f && (p.hidden = !o),
          o
            ? ea(a).show()
            : l.done(function() {
                ea(a).hide()
              }),
          l.done(function() {
            var b
            ea._removeData(a, 'fxshow')
            for (b in m) ea.style(a, b, m[b])
          })
        for (d in m)
          (g = J(o ? p[d] : 0, d, l)),
            d in p || ((p[d] = g.start), o && ((g.end = g.start), (g.start = 'width' === d || 'height' === d ? 1 : 0)))
      }
    }
    function L(a, b) {
      var c, d, e, f, g
      for (c in a)
        if (
          ((d = ea.camelCase(c)),
          (e = b[d]),
          (f = a[c]),
          ea.isArray(f) && ((e = f[1]), (f = a[c] = f[0])),
          c !== d && ((a[d] = f), delete a[c]),
          (g = ea.cssHooks[d]),
          g && 'expand' in g)
        ) {
          ;(f = g.expand(f)), delete a[d]
          for (c in f) c in a || ((a[c] = f[c]), (b[c] = e))
        } else b[d] = e
    }
    function M(a, b, c) {
      var d,
        e,
        f = 0,
        g = sb.length,
        h = ea.Deferred().always(function() {
          delete i.elem
        }),
        i = function() {
          if (e) return !1
          for (
            var b = nb || H(),
              c = Math.max(0, j.startTime + j.duration - b),
              d = c / j.duration || 0,
              f = 1 - d,
              g = 0,
              i = j.tweens.length;
            i > g;
            g++
          )
            j.tweens[g].run(f)
          return h.notifyWith(a, [j, f, c]), 1 > f && i ? c : (h.resolveWith(a, [j]), !1)
        },
        j = h.promise({
          elem: a,
          props: ea.extend({}, b),
          opts: ea.extend(!0, { specialEasing: {} }, c),
          originalProperties: b,
          originalOptions: c,
          startTime: nb || H(),
          duration: c.duration,
          tweens: [],
          createTween: function(b, c) {
            var d = ea.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing)
            return j.tweens.push(d), d
          },
          stop: function(b) {
            var c = 0,
              d = b ? j.tweens.length : 0
            if (e) return this
            for (e = !0; d > c; c++) j.tweens[c].run(1)
            return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]), this
          }
        }),
        k = j.props
      for (L(k, j.opts.specialEasing); g > f; f++) if ((d = sb[f].call(j, a, k, j.opts))) return d
      return (
        ea.map(k, J, j),
        ea.isFunction(j.opts.start) && j.opts.start.call(a, j),
        ea.fx.timer(ea.extend(i, { elem: a, anim: j, queue: j.opts.queue })),
        j
          .progress(j.opts.progress)
          .done(j.opts.done, j.opts.complete)
          .fail(j.opts.fail)
          .always(j.opts.always)
      )
    }
    function N(a) {
      return function(b, c) {
        'string' != typeof b && ((c = b), (b = '*'))
        var d,
          e = 0,
          f = b.toLowerCase().match(ta) || []
        if (ea.isFunction(c))
          for (; (d = f[e++]); )
            '+' === d.charAt(0) ? ((d = d.slice(1) || '*'), (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c)
      }
    }
    function O(a, b, c, d) {
      function e(h) {
        var i
        return (
          (f[h] = !0),
          ea.each(a[h] || [], function(a, h) {
            var j = h(b, c, d)
            return 'string' != typeof j || g || f[j] ? (g ? !(i = j) : void 0) : (b.dataTypes.unshift(j), e(j), !1)
          }),
          i
        )
      }
      var f = {},
        g = a === Rb
      return e(b.dataTypes[0]) || (!f['*'] && e('*'))
    }
    function P(a, b) {
      var c,
        d,
        e = ea.ajaxSettings.flatOptions || {}
      for (d in b) void 0 !== b[d] && ((e[d] ? a : c || (c = {}))[d] = b[d])
      return c && ea.extend(!0, a, c), a
    }
    function Q(a, b, c) {
      for (var d, e, f, g, h = a.contents, i = a.dataTypes; '*' === i[0]; )
        i.shift(), void 0 === e && (e = a.mimeType || b.getResponseHeader('Content-Type'))
      if (e)
        for (g in h)
          if (h[g] && h[g].test(e)) {
            i.unshift(g)
            break
          }
      if (i[0] in c) f = i[0]
      else {
        for (g in c) {
          if (!i[0] || a.converters[g + ' ' + i[0]]) {
            f = g
            break
          }
          d || (d = g)
        }
        f = f || d
      }
      return f ? (f !== i[0] && i.unshift(f), c[f]) : void 0
    }
    function R(a, b, c, d) {
      var e,
        f,
        g,
        h,
        i,
        j = {},
        k = a.dataTypes.slice()
      if (k[1]) for (g in a.converters) j[g.toLowerCase()] = a.converters[g]
      for (f = k.shift(); f; )
        if (
          (a.responseFields[f] && (c[a.responseFields[f]] = b),
          !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)),
          (i = f),
          (f = k.shift()))
        )
          if ('*' === f) f = i
          else if ('*' !== i && i !== f) {
            if (((g = j[i + ' ' + f] || j['* ' + f]), !g))
              for (e in j)
                if (((h = e.split(' ')), h[1] === f && (g = j[i + ' ' + h[0]] || j['* ' + h[0]]))) {
                  g === !0 ? (g = j[e]) : j[e] !== !0 && ((f = h[0]), k.unshift(h[1]))
                  break
                }
            if (g !== !0)
              if (g && a['throws']) b = g(b)
              else
                try {
                  b = g(b)
                } catch (l) {
                  return { state: 'parsererror', error: g ? l : 'No conversion from ' + i + ' to ' + f }
                }
          }
      return { state: 'success', data: b }
    }
    function S(a, b, c, d) {
      var e
      if (ea.isArray(b))
        ea.each(b, function(b, e) {
          c || Vb.test(a) ? d(a, e) : S(a + '[' + ('object' == typeof e ? b : '') + ']', e, c, d)
        })
      else if (c || 'object' !== ea.type(b)) d(a, b)
      else for (e in b) S(a + '[' + e + ']', b[e], c, d)
    }
    function T() {
      try {
        return new a.XMLHttpRequest()
      } catch (b) {}
    }
    function U() {
      try {
        return new a.ActiveXObject('Microsoft.XMLHTTP')
      } catch (b) {}
    }
    function V(a) {
      return ea.isWindow(a) ? a : 9 === a.nodeType ? a.defaultView || a.parentWindow : !1
    }
    var W = [],
      X = W.slice,
      Y = W.concat,
      Z = W.push,
      $ = W.indexOf,
      _ = {},
      aa = _.toString,
      ba = _.hasOwnProperty,
      ca = {},
      da = '1.11.3',
      ea = function(a, b) {
        return new ea.fn.init(a, b)
      },
      fa = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
      ga = /^-ms-/,
      ha = /-([\da-z])/gi,
      ia = function(a, b) {
        return b.toUpperCase()
      }
    ;(ea.fn = ea.prototype = {
      jquery: da,
      constructor: ea,
      selector: '',
      length: 0,
      toArray: function() {
        return X.call(this)
      },
      get: function(a) {
        return null != a ? (0 > a ? this[a + this.length] : this[a]) : X.call(this)
      },
      pushStack: function(a) {
        var b = ea.merge(this.constructor(), a)
        return (b.prevObject = this), (b.context = this.context), b
      },
      each: function(a, b) {
        return ea.each(this, a, b)
      },
      map: function(a) {
        return this.pushStack(
          ea.map(this, function(b, c) {
            return a.call(b, c, b)
          })
        )
      },
      slice: function() {
        return this.pushStack(X.apply(this, arguments))
      },
      first: function() {
        return this.eq(0)
      },
      last: function() {
        return this.eq(-1)
      },
      eq: function(a) {
        var b = this.length,
          c = +a + (0 > a ? b : 0)
        return this.pushStack(c >= 0 && b > c ? [this[c]] : [])
      },
      end: function() {
        return this.prevObject || this.constructor(null)
      },
      push: Z,
      sort: W.sort,
      splice: W.splice
    }),
      (ea.extend = ea.fn.extend = function() {
        var a,
          b,
          c,
          d,
          e,
          f,
          g = arguments[0] || {},
          h = 1,
          i = arguments.length,
          j = !1
        for (
          'boolean' == typeof g && ((j = g), (g = arguments[h] || {}), h++),
            'object' == typeof g || ea.isFunction(g) || (g = {}),
            h === i && ((g = this), h--);
          i > h;
          h++
        )
          if (null != (e = arguments[h]))
            for (d in e)
              (a = g[d]),
                (c = e[d]),
                g !== c &&
                  (j && c && (ea.isPlainObject(c) || (b = ea.isArray(c)))
                    ? (b ? ((b = !1), (f = a && ea.isArray(a) ? a : [])) : (f = a && ea.isPlainObject(a) ? a : {}),
                      (g[d] = ea.extend(j, f, c)))
                    : void 0 !== c && (g[d] = c))
        return g
      }),
      ea.extend({
        expando: 'jQuery' + (da + Math.random()).replace(/\D/g, ''),
        isReady: !0,
        error: function(a) {
          throw new Error(a)
        },
        noop: function() {},
        isFunction: function(a) {
          return 'function' === ea.type(a)
        },
        isArray:
          Array.isArray ||
          function(a) {
            return 'array' === ea.type(a)
          },
        isWindow: function(a) {
          return null != a && a == a.window
        },
        isNumeric: function(a) {
          return !ea.isArray(a) && a - parseFloat(a) + 1 >= 0
        },
        isEmptyObject: function(a) {
          var b
          for (b in a) return !1
          return !0
        },
        isPlainObject: function(a) {
          var b
          if (!a || 'object' !== ea.type(a) || a.nodeType || ea.isWindow(a)) return !1
          try {
            if (a.constructor && !ba.call(a, 'constructor') && !ba.call(a.constructor.prototype, 'isPrototypeOf')) return !1
          } catch (c) {
            return !1
          }
          if (ca.ownLast) for (b in a) return ba.call(a, b)
          for (b in a);
          return void 0 === b || ba.call(a, b)
        },
        type: function(a) {
          return null == a ? a + '' : 'object' == typeof a || 'function' == typeof a ? _[aa.call(a)] || 'object' : typeof a
        },
        globalEval: function(b) {
          b &&
            ea.trim(b) &&
            (a.execScript ||
              function(b) {
                a.eval.call(a, b)
              })(b)
        },
        camelCase: function(a) {
          return a.replace(ga, 'ms-').replace(ha, ia)
        },
        nodeName: function(a, b) {
          return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
        },
        each: function(a, b, d) {
          var e,
            f = 0,
            g = a.length,
            h = c(a)
          if (d) {
            if (h) for (; g > f && ((e = b.apply(a[f], d)), e !== !1); f++);
            else for (f in a) if (((e = b.apply(a[f], d)), e === !1)) break
          } else if (h) for (; g > f && ((e = b.call(a[f], f, a[f])), e !== !1); f++);
          else for (f in a) if (((e = b.call(a[f], f, a[f])), e === !1)) break
          return a
        },
        trim: function(a) {
          return null == a ? '' : (a + '').replace(fa, '')
        },
        makeArray: function(a, b) {
          var d = b || []
          return null != a && (c(Object(a)) ? ea.merge(d, 'string' == typeof a ? [a] : a) : Z.call(d, a)), d
        },
        inArray: function(a, b, c) {
          var d
          if (b) {
            if ($) return $.call(b, a, c)
            for (d = b.length, c = c ? (0 > c ? Math.max(0, d + c) : c) : 0; d > c; c++) if (c in b && b[c] === a) return c
          }
          return -1
        },
        merge: function(a, b) {
          for (var c = +b.length, d = 0, e = a.length; c > d; ) a[e++] = b[d++]
          if (c !== c) for (; void 0 !== b[d]; ) a[e++] = b[d++]
          return (a.length = e), a
        },
        grep: function(a, b, c) {
          for (var d, e = [], f = 0, g = a.length, h = !c; g > f; f++) (d = !b(a[f], f)), d !== h && e.push(a[f])
          return e
        },
        map: function(a, b, d) {
          var e,
            f = 0,
            g = a.length,
            h = c(a),
            i = []
          if (h) for (; g > f; f++) (e = b(a[f], f, d)), null != e && i.push(e)
          else for (f in a) (e = b(a[f], f, d)), null != e && i.push(e)
          return Y.apply([], i)
        },
        guid: 1,
        proxy: function(a, b) {
          var c, d, e
          return (
            'string' == typeof b && ((e = a[b]), (b = a), (a = e)),
            ea.isFunction(a)
              ? ((c = X.call(arguments, 2)),
                (d = function() {
                  return a.apply(b || this, c.concat(X.call(arguments)))
                }),
                (d.guid = a.guid = a.guid || ea.guid++),
                d)
              : void 0
          )
        },
        now: function() {
          return +new Date()
        },
        support: ca
      }),
      ea.each('Boolean Number String Function Array Date RegExp Object Error'.split(' '), function(a, b) {
        _['[object ' + b + ']'] = b.toLowerCase()
      })
    var ja = (function(a) {
      function b(a, b, c, d) {
        var e, f, g, h, i, j, l, n, o, p
        if (
          ((b ? b.ownerDocument || b : O) !== G && F(b),
          (b = b || G),
          (c = c || []),
          (h = b.nodeType),
          'string' != typeof a || !a || (1 !== h && 9 !== h && 11 !== h))
        )
          return c
        if (!d && I) {
          if (11 !== h && (e = sa.exec(a)))
            if ((g = e[1])) {
              if (9 === h) {
                if (((f = b.getElementById(g)), !f || !f.parentNode)) return c
                if (f.id === g) return c.push(f), c
              } else if (b.ownerDocument && (f = b.ownerDocument.getElementById(g)) && M(b, f) && f.id === g) return c.push(f), c
            } else {
              if (e[2]) return $.apply(c, b.getElementsByTagName(a)), c
              if ((g = e[3]) && v.getElementsByClassName) return $.apply(c, b.getElementsByClassName(g)), c
            }
          if (v.qsa && (!J || !J.test(a))) {
            if (((n = l = N), (o = b), (p = 1 !== h && a), 1 === h && 'object' !== b.nodeName.toLowerCase())) {
              for (
                j = z(a),
                  (l = b.getAttribute('id')) ? (n = l.replace(ua, '\\$&')) : b.setAttribute('id', n),
                  n = "[id='" + n + "'] ",
                  i = j.length;
                i--;

              )
                j[i] = n + m(j[i])
              ;(o = (ta.test(a) && k(b.parentNode)) || b), (p = j.join(','))
            }
            if (p)
              try {
                return $.apply(c, o.querySelectorAll(p)), c
              } catch (q) {
              } finally {
                l || b.removeAttribute('id')
              }
          }
        }
        return B(a.replace(ia, '$1'), b, c, d)
      }
      function c() {
        function a(c, d) {
          return b.push(c + ' ') > w.cacheLength && delete a[b.shift()], (a[c + ' '] = d)
        }
        var b = []
        return a
      }
      function d(a) {
        return (a[N] = !0), a
      }
      function e(a) {
        var b = G.createElement('div')
        try {
          return !!a(b)
        } catch (c) {
          return !1
        } finally {
          b.parentNode && b.parentNode.removeChild(b), (b = null)
        }
      }
      function f(a, b) {
        for (var c = a.split('|'), d = a.length; d--; ) w.attrHandle[c[d]] = b
      }
      function g(a, b) {
        var c = b && a,
          d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || V) - (~a.sourceIndex || V)
        if (d) return d
        if (c) for (; (c = c.nextSibling); ) if (c === b) return -1
        return a ? 1 : -1
      }
      function h(a) {
        return function(b) {
          var c = b.nodeName.toLowerCase()
          return 'input' === c && b.type === a
        }
      }
      function i(a) {
        return function(b) {
          var c = b.nodeName.toLowerCase()
          return ('input' === c || 'button' === c) && b.type === a
        }
      }
      function j(a) {
        return d(function(b) {
          return (
            (b = +b),
            d(function(c, d) {
              for (var e, f = a([], c.length, b), g = f.length; g--; ) c[(e = f[g])] && (c[e] = !(d[e] = c[e]))
            })
          )
        })
      }
      function k(a) {
        return a && 'undefined' != typeof a.getElementsByTagName && a
      }
      function l() {}
      function m(a) {
        for (var b = 0, c = a.length, d = ''; c > b; b++) d += a[b].value
        return d
      }
      function n(a, b, c) {
        var d = b.dir,
          e = c && 'parentNode' === d,
          f = Q++
        return b.first
          ? function(b, c, f) {
              for (; (b = b[d]); ) if (1 === b.nodeType || e) return a(b, c, f)
            }
          : function(b, c, g) {
              var h,
                i,
                j = [P, f]
              if (g) {
                for (; (b = b[d]); ) if ((1 === b.nodeType || e) && a(b, c, g)) return !0
              } else
                for (; (b = b[d]); )
                  if (1 === b.nodeType || e) {
                    if (((i = b[N] || (b[N] = {})), (h = i[d]) && h[0] === P && h[1] === f)) return (j[2] = h[2])
                    if (((i[d] = j), (j[2] = a(b, c, g)))) return !0
                  }
            }
      }
      function o(a) {
        return a.length > 1
          ? function(b, c, d) {
              for (var e = a.length; e--; ) if (!a[e](b, c, d)) return !1
              return !0
            }
          : a[0]
      }
      function p(a, c, d) {
        for (var e = 0, f = c.length; f > e; e++) b(a, c[e], d)
        return d
      }
      function q(a, b, c, d, e) {
        for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++) (f = a[h]) && (!c || c(f, d, e)) && (g.push(f), j && b.push(h))
        return g
      }
      function r(a, b, c, e, f, g) {
        return (
          e && !e[N] && (e = r(e)),
          f && !f[N] && (f = r(f, g)),
          d(function(d, g, h, i) {
            var j,
              k,
              l,
              m = [],
              n = [],
              o = g.length,
              r = d || p(b || '*', h.nodeType ? [h] : h, []),
              s = !a || (!d && b) ? r : q(r, m, a, h, i),
              t = c ? (f || (d ? a : o || e) ? [] : g) : s
            if ((c && c(s, t, h, i), e)) for (j = q(t, n), e(j, [], h, i), k = j.length; k--; ) (l = j[k]) && (t[n[k]] = !(s[n[k]] = l))
            if (d) {
              if (f || a) {
                if (f) {
                  for (j = [], k = t.length; k--; ) (l = t[k]) && j.push((s[k] = l))
                  f(null, (t = []), j, i)
                }
                for (k = t.length; k--; ) (l = t[k]) && (j = f ? aa(d, l) : m[k]) > -1 && (d[j] = !(g[j] = l))
              }
            } else (t = q(t === g ? t.splice(o, t.length) : t)), f ? f(null, g, t, i) : $.apply(g, t)
          })
        )
      }
      function s(a) {
        for (
          var b,
            c,
            d,
            e = a.length,
            f = w.relative[a[0].type],
            g = f || w.relative[' '],
            h = f ? 1 : 0,
            i = n(
              function(a) {
                return a === b
              },
              g,
              !0
            ),
            j = n(
              function(a) {
                return aa(b, a) > -1
              },
              g,
              !0
            ),
            k = [
              function(a, c, d) {
                var e = (!f && (d || c !== C)) || ((b = c).nodeType ? i(a, c, d) : j(a, c, d))
                return (b = null), e
              }
            ];
          e > h;
          h++
        )
          if ((c = w.relative[a[h].type])) k = [n(o(k), c)]
          else {
            if (((c = w.filter[a[h].type].apply(null, a[h].matches)), c[N])) {
              for (d = ++h; e > d && !w.relative[a[d].type]; d++);
              return r(
                h > 1 && o(k),
                h > 1 && m(a.slice(0, h - 1).concat({ value: ' ' === a[h - 2].type ? '*' : '' })).replace(ia, '$1'),
                c,
                d > h && s(a.slice(h, d)),
                e > d && s((a = a.slice(d))),
                e > d && m(a)
              )
            }
            k.push(c)
          }
        return o(k)
      }
      function t(a, c) {
        var e = c.length > 0,
          f = a.length > 0,
          g = function(d, g, h, i, j) {
            var k,
              l,
              m,
              n = 0,
              o = '0',
              p = d && [],
              r = [],
              s = C,
              t = d || (f && w.find.TAG('*', j)),
              u = (P += null == s ? 1 : Math.random() || 0.1),
              v = t.length
            for (j && (C = g !== G && g); o !== v && null != (k = t[o]); o++) {
              if (f && k) {
                for (l = 0; (m = a[l++]); )
                  if (m(k, g, h)) {
                    i.push(k)
                    break
                  }
                j && (P = u)
              }
              e && ((k = !m && k) && n--, d && p.push(k))
            }
            if (((n += o), e && o !== n)) {
              for (l = 0; (m = c[l++]); ) m(p, r, g, h)
              if (d) {
                if (n > 0) for (; o--; ) p[o] || r[o] || (r[o] = Y.call(i))
                r = q(r)
              }
              $.apply(i, r), j && !d && r.length > 0 && n + c.length > 1 && b.uniqueSort(i)
            }
            return j && ((P = u), (C = s)), p
          }
        return e ? d(g) : g
      }
      var u,
        v,
        w,
        x,
        y,
        z,
        A,
        B,
        C,
        D,
        E,
        F,
        G,
        H,
        I,
        J,
        K,
        L,
        M,
        N = 'sizzle' + 1 * new Date(),
        O = a.document,
        P = 0,
        Q = 0,
        R = c(),
        S = c(),
        T = c(),
        U = function(a, b) {
          return a === b && (E = !0), 0
        },
        V = 1 << 31,
        W = {}.hasOwnProperty,
        X = [],
        Y = X.pop,
        Z = X.push,
        $ = X.push,
        _ = X.slice,
        aa = function(a, b) {
          for (var c = 0, d = a.length; d > c; c++) if (a[c] === b) return c
          return -1
        },
        ba = 'checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped',
        ca = '[\\x20\\t\\r\\n\\f]',
        da = '(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+',
        ea = da.replace('w', 'w#'),
        fa =
          '\\[' +
          ca +
          '*(' +
          da +
          ')(?:' +
          ca +
          '*([*^$|!~]?=)' +
          ca +
          '*(?:\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)"|(' +
          ea +
          '))|)' +
          ca +
          '*\\]',
        ga = ':(' + da + ')(?:\\(((\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|' + fa + ')*)|.*)\\)|)',
        ha = new RegExp(ca + '+', 'g'),
        ia = new RegExp('^' + ca + '+|((?:^|[^\\\\])(?:\\\\.)*)' + ca + '+$', 'g'),
        ja = new RegExp('^' + ca + '*,' + ca + '*'),
        ka = new RegExp('^' + ca + '*([>+~]|' + ca + ')' + ca + '*'),
        la = new RegExp('=' + ca + '*([^\\]\'"]*?)' + ca + '*\\]', 'g'),
        ma = new RegExp(ga),
        na = new RegExp('^' + ea + '$'),
        oa = {
          ID: new RegExp('^#(' + da + ')'),
          CLASS: new RegExp('^\\.(' + da + ')'),
          TAG: new RegExp('^(' + da.replace('w', 'w*') + ')'),
          ATTR: new RegExp('^' + fa),
          PSEUDO: new RegExp('^' + ga),
          CHILD: new RegExp(
            '^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(' +
              ca +
              '*(even|odd|(([+-]|)(\\d*)n|)' +
              ca +
              '*(?:([+-]|)' +
              ca +
              '*(\\d+)|))' +
              ca +
              '*\\)|)',
            'i'
          ),
          bool: new RegExp('^(?:' + ba + ')$', 'i'),
          needsContext: new RegExp(
            '^' + ca + '*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(' + ca + '*((?:-\\d)?\\d*)' + ca + '*\\)|)(?=[^-]|$)',
            'i'
          )
        },
        pa = /^(?:input|select|textarea|button)$/i,
        qa = /^h\d$/i,
        ra = /^[^{]+\{\s*\[native \w/,
        sa = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
        ta = /[+~]/,
        ua = /'|\\/g,
        va = new RegExp('\\\\([\\da-f]{1,6}' + ca + '?|(' + ca + ')|.)', 'ig'),
        wa = function(a, b, c) {
          var d = '0x' + b - 65536
          return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode((d >> 10) | 55296, (1023 & d) | 56320)
        },
        xa = function() {
          F()
        }
      try {
        $.apply((X = _.call(O.childNodes)), O.childNodes), X[O.childNodes.length].nodeType
      } catch (ya) {
        $ = {
          apply: X.length
            ? function(a, b) {
                Z.apply(a, _.call(b))
              }
            : function(a, b) {
                for (var c = a.length, d = 0; (a[c++] = b[d++]); );
                a.length = c - 1
              }
        }
      }
      
      ;(v = b.support = {}),
        (y = b.isXML = function(a) {
          var b = a && (a.ownerDocument || a).documentElement
          return b ? 'HTML' !== b.nodeName : !1
        }),
        (F = b.setDocument = function(a) {
          var b,
            c,
            d = a ? a.ownerDocument || a : O
          return d !== G && 9 === d.nodeType && d.documentElement
            ? ((G = d),
              (H = d.documentElement),
              (c = d.defaultView),
              c &&
                c !== c.top &&
                (c.addEventListener ? c.addEventListener('unload', xa, !1) : c.attachEvent && c.attachEvent('onunload', xa)),
              (I = !y(d)),
              (v.attributes = e(function(a) {
                return (a.className = 'i'), !a.getAttribute('className')
              })),
              (v.getElementsByTagName = e(function(a) {
                return a.appendChild(d.createComment('')), !a.getElementsByTagName('*').length
              })),
              (v.getElementsByClassName = ra.test(d.getElementsByClassName)),
              (v.getById = e(function(a) {
                return (H.appendChild(a).id = N), !d.getElementsByName || !d.getElementsByName(N).length
              })),
              v.getById
                ? ((w.find.ID = function(a, b) {
                    if ('undefined' != typeof b.getElementById && I) {
                      var c = b.getElementById(a)
                      return c && c.parentNode ? [c] : []
                    }
                  }),
                  (w.filter.ID = function(a) {
                    var b = a.replace(va, wa)
                    return function(a) {
                      return a.getAttribute('id') === b
                    }
                  }))
                : (delete w.find.ID,
                  (w.filter.ID = function(a) {
                    var b = a.replace(va, wa)
                    return function(a) {
                      var c = 'undefined' != typeof a.getAttributeNode && a.getAttributeNode('id')
                      return c && c.value === b
                    }
                  })),
              (w.find.TAG = v.getElementsByTagName
                ? function(a, b) {
                    return 'undefined' != typeof b.getElementsByTagName ? b.getElementsByTagName(a) : v.qsa ? b.querySelectorAll(a) : void 0
                  }
                : function(a, b) {
                    var c,
                      d = [],
                      e = 0,
                      f = b.getElementsByTagName(a)
                    if ('*' === a) {
                      for (; (c = f[e++]); ) 1 === c.nodeType && d.push(c)
                      return d
                    }
                    return f
                  }),
              (w.find.CLASS =
                v.getElementsByClassName &&
                function(a, b) {
                  return I ? b.getElementsByClassName(a) : void 0
                }),
              (K = []),
              (J = []),
              (v.qsa = ra.test(d.querySelectorAll)) &&
                (e(function(a) {
                  ;(H.appendChild(a).innerHTML =
                    "<a id='" + N + "'></a><select id='" + N + "-\f]' msallowcapture=''><option selected=''></option></select>"),
                    a.querySelectorAll("[msallowcapture^='']").length && J.push('[*^$]=' + ca + '*(?:\'\'|"")'),
                    a.querySelectorAll('[selected]').length || J.push('\\[' + ca + '*(?:value|' + ba + ')'),
                    a.querySelectorAll('[id~=' + N + '-]').length || J.push('~='),
                    a.querySelectorAll(':checked').length || J.push(':checked'),
                    a.querySelectorAll('a#' + N + '+*').length || J.push('.#.+[+~]')
                }),
                e(function(a) {
                  var b = d.createElement('input')
                  b.setAttribute('type', 'hidden'),
                    a.appendChild(b).setAttribute('name', 'D'),
                    a.querySelectorAll('[name=d]').length && J.push('name' + ca + '*[*^$|!~]?='),
                    a.querySelectorAll(':enabled').length || J.push(':enabled', ':disabled'),
                    a.querySelectorAll('*,:x'),
                    J.push(',.*:')
                })),
              (v.matchesSelector = ra.test(
                (L = H.matches || H.webkitMatchesSelector || H.mozMatchesSelector || H.oMatchesSelector || H.msMatchesSelector)
              )) &&
                e(function(a) {
                  ;(v.disconnectedMatch = L.call(a, 'div')), L.call(a, "[s!='']:x"), K.push('!=', ga)
                }),
              (J = J.length && new RegExp(J.join('|'))),
              (K = K.length && new RegExp(K.join('|'))),
              (b = ra.test(H.compareDocumentPosition)),
              (M =
                b || ra.test(H.contains)
                  ? function(a, b) {
                      var c = 9 === a.nodeType ? a.documentElement : a,
                        d = b && b.parentNode
                      return (
                        a === d ||
                        !(
                          !d ||
                          1 !== d.nodeType ||
                          !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d))
                        )
                      )
                    }
                  : function(a, b) {
                      if (b) for (; (b = b.parentNode); ) if (b === a) return !0
                      return !1
                    }),
              (U = b
                ? function(a, b) {
                    if (a === b) return (E = !0), 0
                    var c = !a.compareDocumentPosition - !b.compareDocumentPosition
                    return c
                      ? c
                      : ((c = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1),
                        1 & c || (!v.sortDetached && b.compareDocumentPosition(a) === c)
                          ? a === d || (a.ownerDocument === O && M(O, a))
                            ? -1
                            : b === d || (b.ownerDocument === O && M(O, b))
                              ? 1
                              : D
                                ? aa(D, a) - aa(D, b)
                                : 0
                          : 4 & c
                            ? -1
                            : 1)
                  }
                : function(a, b) {
                    if (a === b) return (E = !0), 0
                    var c,
                      e = 0,
                      f = a.parentNode,
                      h = b.parentNode,
                      i = [a],
                      j = [b]
                    if (!f || !h) return a === d ? -1 : b === d ? 1 : f ? -1 : h ? 1 : D ? aa(D, a) - aa(D, b) : 0
                    if (f === h) return g(a, b)
                    for (c = a; (c = c.parentNode); ) i.unshift(c)
                    for (c = b; (c = c.parentNode); ) j.unshift(c)
                    for (; i[e] === j[e]; ) e++
                    return e ? g(i[e], j[e]) : i[e] === O ? -1 : j[e] === O ? 1 : 0
                  }),
              d)
            : G
        }),
        (b.matches = function(a, c) {
          return b(a, null, null, c)
        }),
        (b.matchesSelector = function(a, c) {
          if (
            ((a.ownerDocument || a) !== G && F(a),
            (c = c.replace(la, "='$1']")),
            v.matchesSelector && I && (!K || !K.test(c)) && (!J || !J.test(c)))
          )
            try {
              var d = L.call(a, c)
              if (d || v.disconnectedMatch || (a.document && 11 !== a.document.nodeType)) return d
            } catch (e) {}
          return b(c, G, null, [a]).length > 0
        }),
        (b.contains = function(a, b) {
          return (a.ownerDocument || a) !== G && F(a), M(a, b)
        }),
        (b.attr = function(a, b) {
          ;(a.ownerDocument || a) !== G && F(a)
          var c = w.attrHandle[b.toLowerCase()],
            d = c && W.call(w.attrHandle, b.toLowerCase()) ? c(a, b, !I) : void 0
          return void 0 !== d ? d : v.attributes || !I ? a.getAttribute(b) : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
        }),
        (b.error = function(a) {
          throw new Error('Syntax error, unrecognized expression: ' + a)
        }),
        (b.uniqueSort = function(a) {
          var b,
            c = [],
            d = 0,
            e = 0
          if (((E = !v.detectDuplicates), (D = !v.sortStable && a.slice(0)), a.sort(U), E)) {
            for (; (b = a[e++]); ) b === a[e] && (d = c.push(e))
            for (; d--; ) a.splice(c[d], 1)
          }
          return (D = null), a
        }),
        (x = b.getText = function(a) {
          var b,
            c = '',
            d = 0,
            e = a.nodeType
          if (e) {
            if (1 === e || 9 === e || 11 === e) {
              if ('string' == typeof a.textContent) return a.textContent
              for (a = a.firstChild; a; a = a.nextSibling) c += x(a)
            } else if (3 === e || 4 === e) return a.nodeValue
          } else for (; (b = a[d++]); ) c += x(b)
          return c
        }),
        (w = b.selectors = {
          cacheLength: 50,
          createPseudo: d,
          match: oa,
          attrHandle: {},
          find: {},
          relative: {
            '>': { dir: 'parentNode', first: !0 },
            ' ': { dir: 'parentNode' },
            '+': { dir: 'previousSibling', first: !0 },
            '~': { dir: 'previousSibling' }
          },
          preFilter: {
            ATTR: function(a) {
              return (
                (a[1] = a[1].replace(va, wa)),
                (a[3] = (a[3] || a[4] || a[5] || '').replace(va, wa)),
                '~=' === a[2] && (a[3] = ' ' + a[3] + ' '),
                a.slice(0, 4)
              )
            },
            CHILD: function(a) {
              return (
                (a[1] = a[1].toLowerCase()),
                'nth' === a[1].slice(0, 3)
                  ? (a[3] || b.error(a[0]),
                    (a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ('even' === a[3] || 'odd' === a[3]))),
                    (a[5] = +(a[7] + a[8] || 'odd' === a[3])))
                  : a[3] && b.error(a[0]),
                a
              )
            },
            PSEUDO: function(a) {
              var b,
                c = !a[6] && a[2]
              return oa.CHILD.test(a[0])
                ? null
                : (a[3]
                    ? (a[2] = a[4] || a[5] || '')
                    : c &&
                      ma.test(c) &&
                      (b = z(c, !0)) &&
                      (b = c.indexOf(')', c.length - b) - c.length) &&
                      ((a[0] = a[0].slice(0, b)), (a[2] = c.slice(0, b))),
                  a.slice(0, 3))
            }
          },
          filter: {
            TAG: function(a) {
              var b = a.replace(va, wa).toLowerCase()
              return '*' === a
                ? function() {
                    return !0
                  }
                : function(a) {
                    return a.nodeName && a.nodeName.toLowerCase() === b
                  }
            },
            CLASS: function(a) {
              var b = R[a + ' ']
              return (
                b ||
                ((b = new RegExp('(^|' + ca + ')' + a + '(' + ca + '|$)')) &&
                  R(a, function(a) {
                    return b.test(
                      ('string' == typeof a.className && a.className) ||
                        ('undefined' != typeof a.getAttribute && a.getAttribute('class')) ||
                        ''
                    )
                  }))
              )
            },
            ATTR: function(a, c, d) {
              return function(e) {
                var f = b.attr(e, a)
                return null == f
                  ? '!=' === c
                  : c
                    ? ((f += ''),
                      '=' === c
                        ? f === d
                        : '!=' === c
                          ? f !== d
                          : '^=' === c
                            ? d && 0 === f.indexOf(d)
                            : '*=' === c
                              ? d && f.indexOf(d) > -1
                              : '$=' === c
                                ? d && f.slice(-d.length) === d
                                : '~=' === c
                                  ? (' ' + f.replace(ha, ' ') + ' ').indexOf(d) > -1
                                  : '|=' === c
                                    ? f === d || f.slice(0, d.length + 1) === d + '-'
                                    : !1)
                    : !0
              }
            },
            CHILD: function(a, b, c, d, e) {
              var f = 'nth' !== a.slice(0, 3),
                g = 'last' !== a.slice(-4),
                h = 'of-type' === b
              return 1 === d && 0 === e
                ? function(a) {
                    return !!a.parentNode
                  }
                : function(b, c, i) {
                    var j,
                      k,
                      l,
                      m,
                      n,
                      o,
                      p = f !== g ? 'nextSibling' : 'previousSibling',
                      q = b.parentNode,
                      r = h && b.nodeName.toLowerCase(),
                      s = !i && !h
                    if (q) {
                      if (f) {
                        for (; p; ) {
                          for (l = b; (l = l[p]); ) if (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) return !1
                          o = p = 'only' === a && !o && 'nextSibling'
                        }
                        return !0
                      }
                      if (((o = [g ? q.firstChild : q.lastChild]), g && s)) {
                        for (
                          k = q[N] || (q[N] = {}), j = k[a] || [], n = j[0] === P && j[1], m = j[0] === P && j[2], l = n && q.childNodes[n];
                          (l = (++n && l && l[p]) || (m = n = 0) || o.pop());

                        )
                          if (1 === l.nodeType && ++m && l === b) {
                            k[a] = [P, n, m]
                            break
                          }
                      } else if (s && (j = (b[N] || (b[N] = {}))[a]) && j[0] === P) m = j[1]
                      else
                        for (
                          ;
                          (l = (++n && l && l[p]) || (m = n = 0) || o.pop()) &&
                          ((h ? l.nodeName.toLowerCase() !== r : 1 !== l.nodeType) ||
                            !++m ||
                            (s && ((l[N] || (l[N] = {}))[a] = [P, m]), l !== b));

                        );
                      return (m -= e), m === d || (m % d === 0 && m / d >= 0)
                    }
                  }
            },
            PSEUDO: function(a, c) {
              var e,
                f = w.pseudos[a] || w.setFilters[a.toLowerCase()] || b.error('unsupported pseudo: ' + a)
              return f[N]
                ? f(c)
                : f.length > 1
                  ? ((e = [a, a, '', c]),
                    w.setFilters.hasOwnProperty(a.toLowerCase())
                      ? d(function(a, b) {
                          for (var d, e = f(a, c), g = e.length; g--; ) (d = aa(a, e[g])), (a[d] = !(b[d] = e[g]))
                        })
                      : function(a) {
                          return f(a, 0, e)
                        })
                  : f
            }
          },
          pseudos: {
            not: d(function(a) {
              var b = [],
                c = [],
                e = A(a.replace(ia, '$1'))
              return e[N]
                ? d(function(a, b, c, d) {
                    for (var f, g = e(a, null, d, []), h = a.length; h--; ) (f = g[h]) && (a[h] = !(b[h] = f))
                  })
                : function(a, d, f) {
                    return (b[0] = a), e(b, null, f, c), (b[0] = null), !c.pop()
                  }
            }),
            has: d(function(a) {
              return function(c) {
                return b(a, c).length > 0
              }
            }),
            contains: d(function(a) {
              return (
                (a = a.replace(va, wa)),
                function(b) {
                  return (b.textContent || b.innerText || x(b)).indexOf(a) > -1
                }
              )
            }),
            lang: d(function(a) {
              return (
                na.test(a || '') || b.error('unsupported lang: ' + a),
                (a = a.replace(va, wa).toLowerCase()),
                function(b) {
                  var c
                  do
                    if ((c = I ? b.lang : b.getAttribute('xml:lang') || b.getAttribute('lang')))
                      return (c = c.toLowerCase()), c === a || 0 === c.indexOf(a + '-')
                  while ((b = b.parentNode) && 1 === b.nodeType)
                  return !1
                }
              )
            }),
            target: function(b) {
              var c = a.location && a.location.hash
              return c && c.slice(1) === b.id
            },
            root: function(a) {
              return a === H
            },
            focus: function(a) {
              return a === G.activeElement && (!G.hasFocus || G.hasFocus()) && !!(a.type || a.href || ~a.tabIndex)
            },
            enabled: function(a) {
              return a.disabled === !1
            },
            disabled: function(a) {
              return a.disabled === !0
            },
            checked: function(a) {
              var b = a.nodeName.toLowerCase()
              return ('input' === b && !!a.checked) || ('option' === b && !!a.selected)
            },
            selected: function(a) {
              return a.parentNode && a.parentNode.selectedIndex, a.selected === !0
            },
            empty: function(a) {
              for (a = a.firstChild; a; a = a.nextSibling) if (a.nodeType < 6) return !1
              return !0
            },
            parent: function(a) {
              return !w.pseudos.empty(a)
            },
            header: function(a) {
              return qa.test(a.nodeName)
            },
            input: function(a) {
              return pa.test(a.nodeName)
            },
            button: function(a) {
              var b = a.nodeName.toLowerCase()
              return ('input' === b && 'button' === a.type) || 'button' === b
            },
            text: function(a) {
              var b
              return (
                'input' === a.nodeName.toLowerCase() &&
                'text' === a.type &&
                (null == (b = a.getAttribute('type')) || 'text' === b.toLowerCase())
              )
            },
            first: j(function() {
              return [0]
            }),
            last: j(function(a, b) {
              return [b - 1]
            }),
            eq: j(function(a, b, c) {
              return [0 > c ? c + b : c]
            }),
            even: j(function(a, b) {
              for (var c = 0; b > c; c += 2) a.push(c)
              return a
            }),
            odd: j(function(a, b) {
              for (var c = 1; b > c; c += 2) a.push(c)
              return a
            }),
            lt: j(function(a, b, c) {
              for (var d = 0 > c ? c + b : c; --d >= 0; ) a.push(d)
              return a
            }),
            gt: j(function(a, b, c) {
              for (var d = 0 > c ? c + b : c; ++d < b; ) a.push(d)
              return a
            })
          }
        }),
        (w.pseudos.nth = w.pseudos.eq)
      for (u in { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 }) w.pseudos[u] = h(u)
      for (u in { submit: !0, reset: !0 }) w.pseudos[u] = i(u)
      return (
        (l.prototype = w.filters = w.pseudos),
        (w.setFilters = new l()),
        (z = b.tokenize = function(a, c) {
          var d,
            e,
            f,
            g,
            h,
            i,
            j,
            k = S[a + ' ']
          if (k) return c ? 0 : k.slice(0)
          for (h = a, i = [], j = w.preFilter; h; ) {
            ;(!d || (e = ja.exec(h))) && (e && (h = h.slice(e[0].length) || h), i.push((f = []))),
              (d = !1),
              (e = ka.exec(h)) && ((d = e.shift()), f.push({ value: d, type: e[0].replace(ia, ' ') }), (h = h.slice(d.length)))
            for (g in w.filter)
              !(e = oa[g].exec(h)) ||
                (j[g] && !(e = j[g](e))) ||
                ((d = e.shift()), f.push({ value: d, type: g, matches: e }), (h = h.slice(d.length)))
            if (!d) break
          }
          return c ? h.length : h ? b.error(a) : S(a, i).slice(0)
        }),
        (A = b.compile = function(a, b) {
          var c,
            d = [],
            e = [],
            f = T[a + ' ']
          if (!f) {
            for (b || (b = z(a)), c = b.length; c--; ) (f = s(b[c])), f[N] ? d.push(f) : e.push(f)
            ;(f = T(a, t(e, d))), (f.selector = a)
          }
          return f
        }),
        (B = b.select = function(a, b, c, d) {
          var e,
            f,
            g,
            h,
            i,
            j = 'function' == typeof a && a,
            l = !d && z((a = j.selector || a))
          if (((c = c || []), 1 === l.length)) {
            if (
              ((f = l[0] = l[0].slice(0)),
              f.length > 2 && 'ID' === (g = f[0]).type && v.getById && 9 === b.nodeType && I && w.relative[f[1].type])
            ) {
              if (((b = (w.find.ID(g.matches[0].replace(va, wa), b) || [])[0]), !b)) return c
              j && (b = b.parentNode), (a = a.slice(f.shift().value.length))
            }
            for (e = oa.needsContext.test(a) ? 0 : f.length; e-- && ((g = f[e]), !w.relative[(h = g.type)]); )
              if ((i = w.find[h]) && (d = i(g.matches[0].replace(va, wa), (ta.test(f[0].type) && k(b.parentNode)) || b))) {
                if ((f.splice(e, 1), (a = d.length && m(f)), !a)) return $.apply(c, d), c
                break
              }
          }
          return (j || A(a, l))(d, b, !I, c, (ta.test(a) && k(b.parentNode)) || b), c
        }),
        (v.sortStable =
          N.split('')
            .sort(U)
            .join('') === N),
        (v.detectDuplicates = !!E),
        F(),
        (v.sortDetached = e(function(a) {
          return 1 & a.compareDocumentPosition(G.createElement('div'))
        })),
        e(function(a) {
          return (a.innerHTML = "<a href='#'></a>"), '#' === a.firstChild.getAttribute('href')
        }) ||
          f('type|href|height|width', function(a, b, c) {
            return c ? void 0 : a.getAttribute(b, 'type' === b.toLowerCase() ? 1 : 2)
          }),
        (v.attributes &&
          e(function(a) {
            return (a.innerHTML = '<input/>'), a.firstChild.setAttribute('value', ''), '' === a.firstChild.getAttribute('value')
          })) ||
          f('value', function(a, b, c) {
            return c || 'input' !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue
          }),
        e(function(a) {
          return null == a.getAttribute('disabled')
        }) ||
          f(ba, function(a, b, c) {
            var d
            return c ? void 0 : a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
          }),
        b
      )
    })(a)
    ;(ea.find = ja),
      (ea.expr = ja.selectors),
      (ea.expr[':'] = ea.expr.pseudos),
      (ea.unique = ja.uniqueSort),
      (ea.text = ja.getText),
      (ea.isXMLDoc = ja.isXML),
      (ea.contains = ja.contains)
    var ka = ea.expr.match.needsContext,
      la = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
      ma = /^.[^:#\[\.,]*$/
    ;(ea.filter = function(a, b, c) {
      var d = b[0]
      return (
        c && (a = ':not(' + a + ')'),
        1 === b.length && 1 === d.nodeType
          ? ea.find.matchesSelector(d, a)
            ? [d]
            : []
          : ea.find.matches(
              a,
              ea.grep(b, function(a) {
                return 1 === a.nodeType
              })
            )
      )
    }),
      ea.fn.extend({
        find: function(a) {
          var b,
            c = [],
            d = this,
            e = d.length
          if ('string' != typeof a)
            return this.pushStack(
              ea(a).filter(function() {
                for (b = 0; e > b; b++) if (ea.contains(d[b], this)) return !0
              })
            )
          for (b = 0; e > b; b++) ea.find(a, d[b], c)
          return (c = this.pushStack(e > 1 ? ea.unique(c) : c)), (c.selector = this.selector ? this.selector + ' ' + a : a), c
        },
        filter: function(a) {
          return this.pushStack(d(this, a || [], !1))
        },
        not: function(a) {
          return this.pushStack(d(this, a || [], !0))
        },
        is: function(a) {
          return !!d(this, 'string' == typeof a && ka.test(a) ? ea(a) : a || [], !1).length
        }
      })
    var na,
      oa = a.document,
      pa = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
      qa = (ea.fn.init = function(a, b) {
        var c, d
        if (!a) return this
        if ('string' == typeof a) {
          if (
            ((c = '<' === a.charAt(0) && '>' === a.charAt(a.length - 1) && a.length >= 3 ? [null, a, null] : pa.exec(a)),
            !c || (!c[1] && b))
          )
            return !b || b.jquery ? (b || na).find(a) : this.constructor(b).find(a)
          if (c[1]) {
            if (
              ((b = b instanceof ea ? b[0] : b),
              ea.merge(this, ea.parseHTML(c[1], b && b.nodeType ? b.ownerDocument || b : oa, !0)),
              la.test(c[1]) && ea.isPlainObject(b))
            )
              for (c in b) ea.isFunction(this[c]) ? this[c](b[c]) : this.attr(c, b[c])
            return this
          }
          if (((d = oa.getElementById(c[2])), d && d.parentNode)) {
            if (d.id !== c[2]) return na.find(a)
            ;(this.length = 1), (this[0] = d)
          }
          return (this.context = oa), (this.selector = a), this
        }
        return a.nodeType
          ? ((this.context = this[0] = a), (this.length = 1), this)
          : ea.isFunction(a)
            ? 'undefined' != typeof na.ready
              ? na.ready(a)
              : a(ea)
            : (void 0 !== a.selector && ((this.selector = a.selector), (this.context = a.context)), ea.makeArray(a, this))
      })
    ;(qa.prototype = ea.fn), (na = ea(oa))
    var ra = /^(?:parents|prev(?:Until|All))/,
      sa = { children: !0, contents: !0, next: !0, prev: !0 }
    ea.extend({
      dir: function(a, b, c) {
        for (var d = [], e = a[b]; e && 9 !== e.nodeType && (void 0 === c || 1 !== e.nodeType || !ea(e).is(c)); )
          1 === e.nodeType && d.push(e), (e = e[b])
        return d
      },
      sibling: function(a, b) {
        for (var c = []; a; a = a.nextSibling) 1 === a.nodeType && a !== b && c.push(a)
        return c
      }
    }),
      ea.fn.extend({
        has: function(a) {
          var b,
            c = ea(a, this),
            d = c.length
          return this.filter(function() {
            for (b = 0; d > b; b++) if (ea.contains(this, c[b])) return !0
          })
        },
        closest: function(a, b) {
          for (var c, d = 0, e = this.length, f = [], g = ka.test(a) || 'string' != typeof a ? ea(a, b || this.context) : 0; e > d; d++)
            for (c = this[d]; c && c !== b; c = c.parentNode)
              if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && ea.find.matchesSelector(c, a))) {
                f.push(c)
                break
              }
          return this.pushStack(f.length > 1 ? ea.unique(f) : f)
        },
        index: function(a) {
          return a
            ? 'string' == typeof a
              ? ea.inArray(this[0], ea(a))
              : ea.inArray(a.jquery ? a[0] : a, this)
            : this[0] && this[0].parentNode
              ? this.first().prevAll().length
              : -1
        },
        add: function(a, b) {
          return this.pushStack(ea.unique(ea.merge(this.get(), ea(a, b))))
        },
        addBack: function(a) {
          return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
        }
      }),
      ea.each(
        {
          parent: function(a) {
            var b = a.parentNode
            return b && 11 !== b.nodeType ? b : null
          },
          parents: function(a) {
            return ea.dir(a, 'parentNode')
          },
          parentsUntil: function(a, b, c) {
            return ea.dir(a, 'parentNode', c)
          },
          next: function(a) {
            return e(a, 'nextSibling')
          },
          prev: function(a) {
            return e(a, 'previousSibling')
          },
          nextAll: function(a) {
            return ea.dir(a, 'nextSibling')
          },
          prevAll: function(a) {
            return ea.dir(a, 'previousSibling')
          },
          nextUntil: function(a, b, c) {
            return ea.dir(a, 'nextSibling', c)
          },
          prevUntil: function(a, b, c) {
            return ea.dir(a, 'previousSibling', c)
          },
          siblings: function(a) {
            return ea.sibling((a.parentNode || {}).firstChild, a)
          },
          children: function(a) {
            return ea.sibling(a.firstChild)
          },
          contents: function(a) {
            return ea.nodeName(a, 'iframe') ? a.contentDocument || a.contentWindow.document : ea.merge([], a.childNodes)
          }
        },
        function(a, b) {
          ea.fn[a] = function(c, d) {
            var e = ea.map(this, b, c)
            return (
              'Until' !== a.slice(-5) && (d = c),
              d && 'string' == typeof d && (e = ea.filter(d, e)),
              this.length > 1 && (sa[a] || (e = ea.unique(e)), ra.test(a) && (e = e.reverse())),
              this.pushStack(e)
            )
          }
        }
      )
    var ta = /\S+/g,
      ua = {}
    ;(ea.Callbacks = function(a) {
      a = 'string' == typeof a ? ua[a] || f(a) : ea.extend({}, a)
      var b,
        c,
        d,
        e,
        g,
        h,
        i = [],
        j = !a.once && [],
        k = function(f) {
          for (c = a.memory && f, d = !0, g = h || 0, h = 0, e = i.length, b = !0; i && e > g; g++)
            if (i[g].apply(f[0], f[1]) === !1 && a.stopOnFalse) {
              c = !1
              break
            }
          ;(b = !1), i && (j ? j.length && k(j.shift()) : c ? (i = []) : l.disable())
        },
        l = {
          add: function() {
            if (i) {
              var d = i.length
              !(function f(b) {
                ea.each(b, function(b, c) {
                  var d = ea.type(c)
                  'function' === d ? (a.unique && l.has(c)) || i.push(c) : c && c.length && 'string' !== d && f(c)
                })
              })(arguments),
                b ? (e = i.length) : c && ((h = d), k(c))
            }
            return this
          },
          remove: function() {
            return (
              i &&
                ea.each(arguments, function(a, c) {
                  for (var d; (d = ea.inArray(c, i, d)) > -1; ) i.splice(d, 1), b && (e >= d && e--, g >= d && g--)
                }),
              this
            )
          },
          has: function(a) {
            return a ? ea.inArray(a, i) > -1 : !(!i || !i.length)
          },
          empty: function() {
            return (i = []), (e = 0), this
          },
          disable: function() {
            return (i = j = c = void 0), this
          },
          disabled: function() {
            return !i
          },
          lock: function() {
            return (j = void 0), c || l.disable(), this
          },
          locked: function() {
            return !j
          },
          fireWith: function(a, c) {
            return !i || (d && !j) || ((c = c || []), (c = [a, c.slice ? c.slice() : c]), b ? j.push(c) : k(c)), this
          },
          fire: function() {
            return l.fireWith(this, arguments), this
          },
          fired: function() {
            return !!d
          }
        }
      return l
    }),
      ea.extend({
        Deferred: function(a) {
          var b = [
              ['resolve', 'done', ea.Callbacks('once memory'), 'resolved'],
              ['reject', 'fail', ea.Callbacks('once memory'), 'rejected'],
              ['notify', 'progress', ea.Callbacks('memory')]
            ],
            c = 'pending',
            d = {
              state: function() {
                return c
              },
              always: function() {
                return e.done(arguments).fail(arguments), this
              },
              then: function() {
                var a = arguments
                return ea
                  .Deferred(function(c) {
                    ea.each(b, function(b, f) {
                      var g = ea.isFunction(a[b]) && a[b]
                      e[f[1]](function() {
                        var a = g && g.apply(this, arguments)
                        a && ea.isFunction(a.promise)
                          ? a
                              .promise()
                              .done(c.resolve)
                              .fail(c.reject)
                              .progress(c.notify)
                          : c[f[0] + 'With'](this === d ? c.promise() : this, g ? [a] : arguments)
                      })
                    }),
                      (a = null)
                  })
                  .promise()
              },
              promise: function(a) {
                return null != a ? ea.extend(a, d) : d
              }
            },
            e = {}
          return (
            (d.pipe = d.then),
            ea.each(b, function(a, f) {
              var g = f[2],
                h = f[3]
              ;(d[f[1]] = g.add),
                h &&
                  g.add(
                    function() {
                      c = h
                    },
                    b[1 ^ a][2].disable,
                    b[2][2].lock
                  ),
                (e[f[0]] = function() {
                  return e[f[0] + 'With'](this === e ? d : this, arguments), this
                }),
                (e[f[0] + 'With'] = g.fireWith)
            }),
            d.promise(e),
            a && a.call(e, e),
            e
          )
        },
        when: function(a) {
          var b,
            c,
            d,
            e = 0,
            f = X.call(arguments),
            g = f.length,
            h = 1 !== g || (a && ea.isFunction(a.promise)) ? g : 0,
            i = 1 === h ? a : ea.Deferred(),
            j = function(a, c, d) {
              return function(e) {
                ;(c[a] = this),
                  (d[a] = arguments.length > 1 ? X.call(arguments) : e),
                  d === b ? i.notifyWith(c, d) : --h || i.resolveWith(c, d)
              }
            }
          if (g > 1)
            for (b = new Array(g), c = new Array(g), d = new Array(g); g > e; e++)
              f[e] && ea.isFunction(f[e].promise)
                ? f[e]
                    .promise()
                    .done(j(e, d, f))
                    .fail(i.reject)
                    .progress(j(e, c, b))
                : --h
          return h || i.resolveWith(d, f), i.promise()
        }
      })
    var va
    ;(ea.fn.ready = function(a) {
      return ea.ready.promise().done(a), this
    }),
      ea.extend({
        isReady: !1,
        readyWait: 1,
        holdReady: function(a) {
          a ? ea.readyWait++ : ea.ready(!0)
        },
        ready: function(a) {
          if (a === !0 ? !--ea.readyWait : !ea.isReady) {
            if (!oa.body) return setTimeout(ea.ready)
            ;(ea.isReady = !0),
              (a !== !0 && --ea.readyWait > 0) ||
                (va.resolveWith(oa, [ea]), ea.fn.triggerHandler && (ea(oa).triggerHandler('ready'), ea(oa).off('ready')))
          }
        }
      }),
      (ea.ready.promise = function(b) {
        if (!va)
          if (((va = ea.Deferred()), 'complete' === oa.readyState)) setTimeout(ea.ready)
          else if (oa.addEventListener) oa.addEventListener('DOMContentLoaded', h, !1), a.addEventListener('load', h, !1)
          else {
            oa.attachEvent('onreadystatechange', h), a.attachEvent('onload', h)
            var c = !1
            try {
              c = null == a.frameElement && oa.documentElement
            } catch (d) {}
            c &&
              c.doScroll &&
              !(function e() {
                if (!ea.isReady) {
                  try {
                    c.doScroll('left')
                  } catch (a) {
                    return setTimeout(e, 50)
                  }
                  g(), ea.ready()
                }
              })()
          }
        return va.promise(b)
      })
    var wa,
      xa = 'undefined'
    for (wa in ea(ca)) break
    ;(ca.ownLast = '0' !== wa),
      (ca.inlineBlockNeedsLayout = !1),
      ea(function() {
        var a, b, c, d
        ;(c = oa.getElementsByTagName('body')[0]),
          c &&
            c.style &&
            ((b = oa.createElement('div')),
            (d = oa.createElement('div')),
            (d.style.cssText = 'position:absolute;border:0;width:0;height:0;top:0;left:-9999px'),
            c.appendChild(d).appendChild(b),
            typeof b.style.zoom !== xa &&
              ((b.style.cssText = 'display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1'),
              (ca.inlineBlockNeedsLayout = a = 3 === b.offsetWidth),
              a && (c.style.zoom = 1)),
            c.removeChild(d))
      }),
      (function() {
        var a = oa.createElement('div')
        if (null == ca.deleteExpando) {
          ca.deleteExpando = !0
          try {
            delete a.test
          } catch (b) {
            ca.deleteExpando = !1
          }
        }
        a = null
      })(),
      (ea.acceptData = function(a) {
        var b = ea.noData[(a.nodeName + ' ').toLowerCase()],
          c = +a.nodeType || 1
        return 1 !== c && 9 !== c ? !1 : !b || (b !== !0 && a.getAttribute('classid') === b)
      })
    var ya = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
      za = /([A-Z])/g
    ea.extend({
      cache: {},
      noData: { 'applet ': !0, 'embed ': !0, 'object ': 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' },
      hasData: function(a) {
        return (a = a.nodeType ? ea.cache[a[ea.expando]] : a[ea.expando]), !!a && !j(a)
      },
      data: function(a, b, c) {
        return k(a, b, c)
      },
      removeData: function(a, b) {
        return l(a, b)
      },
      _data: function(a, b, c) {
        return k(a, b, c, !0)
      },
      _removeData: function(a, b) {
        return l(a, b, !0)
      }
    }),
      ea.fn.extend({
        data: function(a, b) {
          var c,
            d,
            e,
            f = this[0],
            g = f && f.attributes
          if (void 0 === a) {
            if (this.length && ((e = ea.data(f)), 1 === f.nodeType && !ea._data(f, 'parsedAttrs'))) {
              for (c = g.length; c--; )
                g[c] && ((d = g[c].name), 0 === d.indexOf('data-') && ((d = ea.camelCase(d.slice(5))), i(f, d, e[d])))
              ea._data(f, 'parsedAttrs', !0)
            }
            return e
          }
          return 'object' == typeof a
            ? this.each(function() {
                ea.data(this, a)
              })
            : arguments.length > 1
              ? this.each(function() {
                  ea.data(this, a, b)
                })
              : f
                ? i(f, a, ea.data(f, a))
                : void 0
        },
        removeData: function(a) {
          return this.each(function() {
            ea.removeData(this, a)
          })
        }
      }),
      ea.extend({
        queue: function(a, b, c) {
          var d
          return a
            ? ((b = (b || 'fx') + 'queue'),
              (d = ea._data(a, b)),
              c && (!d || ea.isArray(c) ? (d = ea._data(a, b, ea.makeArray(c))) : d.push(c)),
              d || [])
            : void 0
        },
        dequeue: function(a, b) {
          b = b || 'fx'
          var c = ea.queue(a, b),
            d = c.length,
            e = c.shift(),
            f = ea._queueHooks(a, b),
            g = function() {
              ea.dequeue(a, b)
            }
          'inprogress' === e && ((e = c.shift()), d--),
            e && ('fx' === b && c.unshift('inprogress'), delete f.stop, e.call(a, g, f)),
            !d && f && f.empty.fire()
        },
        _queueHooks: function(a, b) {
          var c = b + 'queueHooks'
          return (
            ea._data(a, c) ||
            ea._data(a, c, {
              empty: ea.Callbacks('once memory').add(function() {
                ea._removeData(a, b + 'queue'), ea._removeData(a, c)
              })
            })
          )
        }
      }),
      ea.fn.extend({
        queue: function(a, b) {
          var c = 2
          return (
            'string' != typeof a && ((b = a), (a = 'fx'), c--),
            arguments.length < c
              ? ea.queue(this[0], a)
              : void 0 === b
                ? this
                : this.each(function() {
                    var c = ea.queue(this, a, b)
                    ea._queueHooks(this, a), 'fx' === a && 'inprogress' !== c[0] && ea.dequeue(this, a)
                  })
          )
        },
        dequeue: function(a) {
          return this.each(function() {
            ea.dequeue(this, a)
          })
        },
        clearQueue: function(a) {
          return this.queue(a || 'fx', [])
        },
        promise: function(a, b) {
          var c,
            d = 1,
            e = ea.Deferred(),
            f = this,
            g = this.length,
            h = function() {
              --d || e.resolveWith(f, [f])
            }
          for ('string' != typeof a && ((b = a), (a = void 0)), a = a || 'fx'; g--; )
            (c = ea._data(f[g], a + 'queueHooks')), c && c.empty && (d++, c.empty.add(h))
          return h(), e.promise(b)
        }
      })
    var Aa = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
      Ba = ['Top', 'Right', 'Bottom', 'Left'],
      Ca = function(a, b) {
        return (a = b || a), 'none' === ea.css(a, 'display') || !ea.contains(a.ownerDocument, a)
      },
      Da = (ea.access = function(a, b, c, d, e, f, g) {
        var h = 0,
          i = a.length,
          j = null == c
        if ('object' === ea.type(c)) {
          e = !0
          for (h in c) ea.access(a, b, h, c[h], !0, f, g)
        } else if (
          void 0 !== d &&
          ((e = !0),
          ea.isFunction(d) || (g = !0),
          j &&
            (g
              ? (b.call(a, d), (b = null))
              : ((j = b),
                (b = function(a, b, c) {
                  return j.call(ea(a), c)
                }))),
          b)
        )
          for (; i > h; h++) b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)))
        return e ? a : j ? b.call(a) : i ? b(a[0], c) : f
      }),
      Ea = /^(?:checkbox|radio)$/i
    !(function() {
      var a = oa.createElement('input'),
        b = oa.createElement('div'),
        c = oa.createDocumentFragment()
      if (
        ((b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>"),
        (ca.leadingWhitespace = 3 === b.firstChild.nodeType),
        (ca.tbody = !b.getElementsByTagName('tbody').length),
        (ca.htmlSerialize = !!b.getElementsByTagName('link').length),
        (ca.html5Clone = '<:nav></:nav>' !== oa.createElement('nav').cloneNode(!0).outerHTML),
        (a.type = 'checkbox'),
        (a.checked = !0),
        c.appendChild(a),
        (ca.appendChecked = a.checked),
        (b.innerHTML = '<textarea>x</textarea>'),
        (ca.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue),
        c.appendChild(b),
        (b.innerHTML = "<input type='radio' checked='checked' name='t'/>"),
        (ca.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked),
        (ca.noCloneEvent = !0),
        b.attachEvent &&
          (b.attachEvent('onclick', function() {
            ca.noCloneEvent = !1
          }),
          b.cloneNode(!0).click()),
        null == ca.deleteExpando)
      ) {
        ca.deleteExpando = !0
        try {
          delete b.test
        } catch (d) {
          ca.deleteExpando = !1
        }
      }
    })(),
      (function() {
        var b,
          c,
          d = oa.createElement('div')
        for (b in { submit: !0, change: !0, focusin: !0 })
          (c = 'on' + b), (ca[b + 'Bubbles'] = c in a) || (d.setAttribute(c, 't'), (ca[b + 'Bubbles'] = d.attributes[c].expando === !1))
        d = null
      })()
    var Fa = /^(?:input|select|textarea)$/i,
      Ga = /^key/,
      Ha = /^(?:mouse|pointer|contextmenu)|click/,
      Ia = /^(?:focusinfocus|focusoutblur)$/,
      Ja = /^([^.]*)(?:\.(.+)|)$/
    ;(ea.event = {
      global: {},
      add: function(a, b, c, d, e) {
        var f,
          g,
          h,
          i,
          j,
          k,
          l,
          m,
          n,
          o,
          p,
          q = ea._data(a)
        if (q) {
          for (
            c.handler && ((i = c), (c = i.handler), (e = i.selector)),
              c.guid || (c.guid = ea.guid++),
              (g = q.events) || (g = q.events = {}),
              (k = q.handle) ||
                ((k = q.handle = function(a) {
                  return typeof ea === xa || (a && ea.event.triggered === a.type) ? void 0 : ea.event.dispatch.apply(k.elem, arguments)
                }),
                (k.elem = a)),
              b = (b || '').match(ta) || [''],
              h = b.length;
            h--;

          )
            (f = Ja.exec(b[h]) || []),
              (n = p = f[1]),
              (o = (f[2] || '').split('.').sort()),
              n &&
                ((j = ea.event.special[n] || {}),
                (n = (e ? j.delegateType : j.bindType) || n),
                (j = ea.event.special[n] || {}),
                (l = ea.extend(
                  {
                    type: n,
                    origType: p,
                    data: d,
                    handler: c,
                    guid: c.guid,
                    selector: e,
                    needsContext: e && ea.expr.match.needsContext.test(e),
                    namespace: o.join('.')
                  },
                  i
                )),
                (m = g[n]) ||
                  ((m = g[n] = []),
                  (m.delegateCount = 0),
                  (j.setup && j.setup.call(a, d, o, k) !== !1) ||
                    (a.addEventListener ? a.addEventListener(n, k, !1) : a.attachEvent && a.attachEvent('on' + n, k))),
                j.add && (j.add.call(a, l), l.handler.guid || (l.handler.guid = c.guid)),
                e ? m.splice(m.delegateCount++, 0, l) : m.push(l),
                (ea.event.global[n] = !0))
          a = null
        }
      },
      remove: function(a, b, c, d, e) {
        var f,
          g,
          h,
          i,
          j,
          k,
          l,
          m,
          n,
          o,
          p,
          q = ea.hasData(a) && ea._data(a)
        if (q && (k = q.events)) {
          for (b = (b || '').match(ta) || [''], j = b.length; j--; )
            if (((h = Ja.exec(b[j]) || []), (n = p = h[1]), (o = (h[2] || '').split('.').sort()), n)) {
              for (
                l = ea.event.special[n] || {},
                  n = (d ? l.delegateType : l.bindType) || n,
                  m = k[n] || [],
                  h = h[2] && new RegExp('(^|\\.)' + o.join('\\.(?:.*\\.|)') + '(\\.|$)'),
                  i = f = m.length;
                f--;

              )
                (g = m[f]),
                  (!e && p !== g.origType) ||
                    (c && c.guid !== g.guid) ||
                    (h && !h.test(g.namespace)) ||
                    (d && d !== g.selector && ('**' !== d || !g.selector)) ||
                    (m.splice(f, 1), g.selector && m.delegateCount--, l.remove && l.remove.call(a, g))
              i && !m.length && ((l.teardown && l.teardown.call(a, o, q.handle) !== !1) || ea.removeEvent(a, n, q.handle), delete k[n])
            } else for (n in k) ea.event.remove(a, n + b[j], c, d, !0)
          ea.isEmptyObject(k) && (delete q.handle, ea._removeData(a, 'events'))
        }
      },
      trigger: function(b, c, d, e) {
        var f,
          g,
          h,
          i,
          j,
          k,
          l,
          m = [d || oa],
          n = ba.call(b, 'type') ? b.type : b,
          o = ba.call(b, 'namespace') ? b.namespace.split('.') : []
        if (
          ((h = k = d = d || oa),
          3 !== d.nodeType &&
            8 !== d.nodeType &&
            !Ia.test(n + ea.event.triggered) &&
            (n.indexOf('.') >= 0 && ((o = n.split('.')), (n = o.shift()), o.sort()),
            (g = n.indexOf(':') < 0 && 'on' + n),
            (b = b[ea.expando] ? b : new ea.Event(n, 'object' == typeof b && b)),
            (b.isTrigger = e ? 2 : 3),
            (b.namespace = o.join('.')),
            (b.namespace_re = b.namespace ? new RegExp('(^|\\.)' + o.join('\\.(?:.*\\.|)') + '(\\.|$)') : null),
            (b.result = void 0),
            b.target || (b.target = d),
            (c = null == c ? [b] : ea.makeArray(c, [b])),
            (j = ea.event.special[n] || {}),
            e || !j.trigger || j.trigger.apply(d, c) !== !1))
        ) {
          if (!e && !j.noBubble && !ea.isWindow(d)) {
            for (i = j.delegateType || n, Ia.test(i + n) || (h = h.parentNode); h; h = h.parentNode) m.push(h), (k = h)
            k === (d.ownerDocument || oa) && m.push(k.defaultView || k.parentWindow || a)
          }
          for (l = 0; (h = m[l++]) && !b.isPropagationStopped(); )
            (b.type = l > 1 ? i : j.bindType || n),
              (f = (ea._data(h, 'events') || {})[b.type] && ea._data(h, 'handle')),
              f && f.apply(h, c),
              (f = g && h[g]),
              f && f.apply && ea.acceptData(h) && ((b.result = f.apply(h, c)), b.result === !1 && b.preventDefault())
          if (
            ((b.type = n),
            !e &&
              !b.isDefaultPrevented() &&
              (!j._default || j._default.apply(m.pop(), c) === !1) &&
              ea.acceptData(d) &&
              g &&
              d[n] &&
              !ea.isWindow(d))
          ) {
            ;(k = d[g]), k && (d[g] = null), (ea.event.triggered = n)
            try {
              d[n]()
            } catch (p) {}
            ;(ea.event.triggered = void 0), k && (d[g] = k)
          }
          return b.result
        }
      },
      dispatch: function(a) {
        a = ea.event.fix(a)
        var b,
          c,
          d,
          e,
          f,
          g = [],
          h = X.call(arguments),
          i = (ea._data(this, 'events') || {})[a.type] || [],
          j = ea.event.special[a.type] || {}
        if (((h[0] = a), (a.delegateTarget = this), !j.preDispatch || j.preDispatch.call(this, a) !== !1)) {
          for (g = ea.event.handlers.call(this, a, i), b = 0; (e = g[b++]) && !a.isPropagationStopped(); )
            for (a.currentTarget = e.elem, f = 0; (d = e.handlers[f++]) && !a.isImmediatePropagationStopped(); )
              (!a.namespace_re || a.namespace_re.test(d.namespace)) &&
                ((a.handleObj = d),
                (a.data = d.data),
                (c = ((ea.event.special[d.origType] || {}).handle || d.handler).apply(e.elem, h)),
                void 0 !== c && (a.result = c) === !1 && (a.preventDefault(), a.stopPropagation()))
          return j.postDispatch && j.postDispatch.call(this, a), a.result
        }
      },
      handlers: function(a, b) {
        var c,
          d,
          e,
          f,
          g = [],
          h = b.delegateCount,
          i = a.target
        if (h && i.nodeType && (!a.button || 'click' !== a.type))
          for (; i != this; i = i.parentNode || this)
            if (1 === i.nodeType && (i.disabled !== !0 || 'click' !== a.type)) {
              for (e = [], f = 0; h > f; f++)
                (d = b[f]),
                  (c = d.selector + ' '),
                  void 0 === e[c] && (e[c] = d.needsContext ? ea(c, this).index(i) >= 0 : ea.find(c, this, null, [i]).length),
                  e[c] && e.push(d)
              e.length && g.push({ elem: i, handlers: e })
            }
        return h < b.length && g.push({ elem: this, handlers: b.slice(h) }), g
      },
      fix: function(a) {
        if (a[ea.expando]) return a
        var b,
          c,
          d,
          e = a.type,
          f = a,
          g = this.fixHooks[e]
        for (
          g || (this.fixHooks[e] = g = Ha.test(e) ? this.mouseHooks : Ga.test(e) ? this.keyHooks : {}),
            d = g.props ? this.props.concat(g.props) : this.props,
            a = new ea.Event(f),
            b = d.length;
          b--;

        )
          (c = d[b]), (a[c] = f[c])
        return (
          a.target || (a.target = f.srcElement || oa),
          3 === a.target.nodeType && (a.target = a.target.parentNode),
          (a.metaKey = !!a.metaKey),
          g.filter ? g.filter(a, f) : a
        )
      },
      props: 'altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which'.split(
        ' '
      ),
      fixHooks: {},
      keyHooks: {
        props: 'char charCode key keyCode'.split(' '),
        filter: function(a, b) {
          return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode), a
        }
      },
      mouseHooks: {
        props: 'button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement'.split(' '),
        filter: function(a, b) {
          var c,
            d,
            e,
            f = b.button,
            g = b.fromElement
          return (
            null == a.pageX &&
              null != b.clientX &&
              ((d = a.target.ownerDocument || oa),
              (e = d.documentElement),
              (c = d.body),
              (a.pageX = b.clientX + ((e && e.scrollLeft) || (c && c.scrollLeft) || 0) - ((e && e.clientLeft) || (c && c.clientLeft) || 0)),
              (a.pageY = b.clientY + ((e && e.scrollTop) || (c && c.scrollTop) || 0) - ((e && e.clientTop) || (c && c.clientTop) || 0))),
            !a.relatedTarget && g && (a.relatedTarget = g === a.target ? b.toElement : g),
            a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0),
            a
          )
        }
      },
      special: {
        load: { noBubble: !0 },
        focus: {
          trigger: function() {
            if (this !== o() && this.focus)
              try {
                return this.focus(), !1
              } catch (a) {}
          },
          delegateType: 'focusin'
        },
        blur: {
          trigger: function() {
            return this === o() && this.blur ? (this.blur(), !1) : void 0
          },
          delegateType: 'focusout'
        },
        click: {
          trigger: function() {
            return ea.nodeName(this, 'input') && 'checkbox' === this.type && this.click ? (this.click(), !1) : void 0
          },
          _default: function(a) {
            return ea.nodeName(a.target, 'a')
          }
        },
        beforeunload: {
          postDispatch: function(a) {
            void 0 !== a.result && a.originalEvent && (a.originalEvent.returnValue = a.result)
          }
        }
      },
      simulate: function(a, b, c, d) {
        var e = ea.extend(new ea.Event(), c, { type: a, isSimulated: !0, originalEvent: {} })
        d ? ea.event.trigger(e, null, b) : ea.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault()
      }
    }),
      (ea.removeEvent = oa.removeEventListener
        ? function(a, b, c) {
            a.removeEventListener && a.removeEventListener(b, c, !1)
          }
        : function(a, b, c) {
            var d = 'on' + b
            a.detachEvent && (typeof a[d] === xa && (a[d] = null), a.detachEvent(d, c))
          }),
      (ea.Event = function(a, b) {
        return this instanceof ea.Event
          ? (a && a.type
              ? ((this.originalEvent = a),
                (this.type = a.type),
                (this.isDefaultPrevented = a.defaultPrevented || (void 0 === a.defaultPrevented && a.returnValue === !1) ? m : n))
              : (this.type = a),
            b && ea.extend(this, b),
            (this.timeStamp = (a && a.timeStamp) || ea.now()),
            void (this[ea.expando] = !0))
          : new ea.Event(a, b)
      }),
      (ea.Event.prototype = {
        isDefaultPrevented: n,
        isPropagationStopped: n,
        isImmediatePropagationStopped: n,
        preventDefault: function() {
          var a = this.originalEvent
          ;(this.isDefaultPrevented = m), a && (a.preventDefault ? a.preventDefault() : (a.returnValue = !1))
        },
        stopPropagation: function() {
          var a = this.originalEvent
          ;(this.isPropagationStopped = m), a && (a.stopPropagation && a.stopPropagation(), (a.cancelBubble = !0))
        },
        stopImmediatePropagation: function() {
          var a = this.originalEvent
          ;(this.isImmediatePropagationStopped = m), a && a.stopImmediatePropagation && a.stopImmediatePropagation(), this.stopPropagation()
        }
      }),
      ea.each({ mouseenter: 'mouseover', mouseleave: 'mouseout', pointerenter: 'pointerover', pointerleave: 'pointerout' }, function(a, b) {
        ea.event.special[a] = {
          delegateType: b,
          bindType: b,
          handle: function(a) {
            var c,
              d = this,
              e = a.relatedTarget,
              f = a.handleObj
            return (
              (!e || (e !== d && !ea.contains(d, e))) && ((a.type = f.origType), (c = f.handler.apply(this, arguments)), (a.type = b)), c
            )
          }
        }
      }),
      ca.submitBubbles ||
        (ea.event.special.submit = {
          setup: function() {
            return ea.nodeName(this, 'form')
              ? !1
              : void ea.event.add(this, 'click._submit keypress._submit', function(a) {
                  var b = a.target,
                    c = ea.nodeName(b, 'input') || ea.nodeName(b, 'button') ? b.form : void 0
                  c &&
                    !ea._data(c, 'submitBubbles') &&
                    (ea.event.add(c, 'submit._submit', function(a) {
                      a._submit_bubble = !0
                    }),
                    ea._data(c, 'submitBubbles', !0))
                })
          },
          postDispatch: function(a) {
            a._submit_bubble &&
              (delete a._submit_bubble, this.parentNode && !a.isTrigger && ea.event.simulate('submit', this.parentNode, a, !0))
          },
          teardown: function() {
            return ea.nodeName(this, 'form') ? !1 : void ea.event.remove(this, '._submit')
          }
        }),
      ca.changeBubbles ||
        (ea.event.special.change = {
          setup: function() {
            return Fa.test(this.nodeName)
              ? (('checkbox' === this.type || 'radio' === this.type) &&
                  (ea.event.add(this, 'propertychange._change', function(a) {
                    'checked' === a.originalEvent.propertyName && (this._just_changed = !0)
                  }),
                  ea.event.add(this, 'click._change', function(a) {
                    this._just_changed && !a.isTrigger && (this._just_changed = !1), ea.event.simulate('change', this, a, !0)
                  })),
                !1)
              : void ea.event.add(this, 'beforeactivate._change', function(a) {
                  var b = a.target
                  Fa.test(b.nodeName) &&
                    !ea._data(b, 'changeBubbles') &&
                    (ea.event.add(b, 'change._change', function(a) {
                      !this.parentNode || a.isSimulated || a.isTrigger || ea.event.simulate('change', this.parentNode, a, !0)
                    }),
                    ea._data(b, 'changeBubbles', !0))
                })
          },
          handle: function(a) {
            var b = a.target
            return this !== b || a.isSimulated || a.isTrigger || ('radio' !== b.type && 'checkbox' !== b.type)
              ? a.handleObj.handler.apply(this, arguments)
              : void 0
          },
          teardown: function() {
            return ea.event.remove(this, '._change'), !Fa.test(this.nodeName)
          }
        }),
      ca.focusinBubbles ||
        ea.each({ focus: 'focusin', blur: 'focusout' }, function(a, b) {
          var c = function(a) {
            ea.event.simulate(b, a.target, ea.event.fix(a), !0)
          }
          ea.event.special[b] = {
            setup: function() {
              var d = this.ownerDocument || this,
                e = ea._data(d, b)
              e || d.addEventListener(a, c, !0), ea._data(d, b, (e || 0) + 1)
            },
            teardown: function() {
              var d = this.ownerDocument || this,
                e = ea._data(d, b) - 1
              e ? ea._data(d, b, e) : (d.removeEventListener(a, c, !0), ea._removeData(d, b))
            }
          }
        }),
      ea.fn.extend({
        on: function(a, b, c, d, e) {
          var f, g
          if ('object' == typeof a) {
            'string' != typeof b && ((c = c || b), (b = void 0))
            for (f in a) this.on(f, b, c, a[f], e)
            return this
          }
          if (
            (null == c && null == d
              ? ((d = b), (c = b = void 0))
              : null == d && ('string' == typeof b ? ((d = c), (c = void 0)) : ((d = c), (c = b), (b = void 0))),
            d === !1)
          )
            d = n
          else if (!d) return this
          return (
            1 === e &&
              ((g = d),
              (d = function(a) {
                return ea().off(a), g.apply(this, arguments)
              }),
              (d.guid = g.guid || (g.guid = ea.guid++))),
            this.each(function() {
              ea.event.add(this, a, d, c, b)
            })
          )
        },
        one: function(a, b, c, d) {
          return this.on(a, b, c, d, 1)
        },
        off: function(a, b, c) {
          var d, e
          if (a && a.preventDefault && a.handleObj)
            return (
              (d = a.handleObj),
              ea(a.delegateTarget).off(d.namespace ? d.origType + '.' + d.namespace : d.origType, d.selector, d.handler),
              this
            )
          if ('object' == typeof a) {
            for (e in a) this.off(e, b, a[e])
            return this
          }
          return (
            (b === !1 || 'function' == typeof b) && ((c = b), (b = void 0)),
            c === !1 && (c = n),
            this.each(function() {
              ea.event.remove(this, a, c, b)
            })
          )
        },
        trigger: function(a, b) {
          return this.each(function() {
            ea.event.trigger(a, b, this)
          })
        },
        triggerHandler: function(a, b) {
          var c = this[0]
          return c ? ea.event.trigger(a, b, c, !0) : void 0
        }
      })
    var Ka =
        'abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video',
      La = / jQuery\d+="(?:null|\d+)"/g,
      Ma = new RegExp('<(?:' + Ka + ')[\\s/>]', 'i'),
      Na = /^\s+/,
      Oa = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
      Pa = /<([\w:]+)/,
      Qa = /<tbody/i,
      Ra = /<|&#?\w+;/,
      Sa = /<(?:script|style|link)/i,
      Ta = /checked\s*(?:[^=]|=\s*.checked.)/i,
      Ua = /^$|\/(?:java|ecma)script/i,
      Va = /^true\/(.*)/,
      Wa = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
      Xa = {
        option: [1, "<select multiple='multiple'>", '</select>'],
        legend: [1, '<fieldset>', '</fieldset>'],
        area: [1, '<map>', '</map>'],
        param: [1, '<object>', '</object>'],
        thead: [1, '<table>', '</table>'],
        tr: [2, '<table><tbody>', '</tbody></table>'],
        col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
        td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
        _default: ca.htmlSerialize ? [0, '', ''] : [1, 'X<div>', '</div>']
      },
      Ya = p(oa),
      Za = Ya.appendChild(oa.createElement('div'))
    ;(Xa.optgroup = Xa.option),
      (Xa.tbody = Xa.tfoot = Xa.colgroup = Xa.caption = Xa.thead),
      (Xa.th = Xa.td),
      ea.extend({
        clone: function(a, b, c) {
          var d,
            e,
            f,
            g,
            h,
            i = ea.contains(a.ownerDocument, a)
          if (
            (ca.html5Clone || ea.isXMLDoc(a) || !Ma.test('<' + a.nodeName + '>')
              ? (f = a.cloneNode(!0))
              : ((Za.innerHTML = a.outerHTML), Za.removeChild((f = Za.firstChild))),
            !((ca.noCloneEvent && ca.noCloneChecked) || (1 !== a.nodeType && 11 !== a.nodeType) || ea.isXMLDoc(a)))
          )
            for (d = q(f), h = q(a), g = 0; null != (e = h[g]); ++g) d[g] && x(e, d[g])
          if (b)
            if (c) for (h = h || q(a), d = d || q(f), g = 0; null != (e = h[g]); g++) w(e, d[g])
            else w(a, f)
          return (d = q(f, 'script')), d.length > 0 && v(d, !i && q(a, 'script')), (d = h = e = null), f
        },
        buildFragment: function(a, b, c, d) {
          for (var e, f, g, h, i, j, k, l = a.length, m = p(b), n = [], o = 0; l > o; o++)
            if (((f = a[o]), f || 0 === f))
              if ('object' === ea.type(f)) ea.merge(n, f.nodeType ? [f] : f)
              else if (Ra.test(f)) {
                for (
                  h = h || m.appendChild(b.createElement('div')),
                    i = (Pa.exec(f) || ['', ''])[1].toLowerCase(),
                    k = Xa[i] || Xa._default,
                    h.innerHTML = k[1] + f.replace(Oa, '<$1></$2>') + k[2],
                    e = k[0];
                  e--;

                )
                  h = h.lastChild
                if ((!ca.leadingWhitespace && Na.test(f) && n.push(b.createTextNode(Na.exec(f)[0])), !ca.tbody))
                  for (
                    f = 'table' !== i || Qa.test(f) ? ('<table>' !== k[1] || Qa.test(f) ? 0 : h) : h.firstChild,
                      e = f && f.childNodes.length;
                    e--;

                  )
                    ea.nodeName((j = f.childNodes[e]), 'tbody') && !j.childNodes.length && f.removeChild(j)
                for (ea.merge(n, h.childNodes), h.textContent = ''; h.firstChild; ) h.removeChild(h.firstChild)
                h = m.lastChild
              } else n.push(b.createTextNode(f))
          for (h && m.removeChild(h), ca.appendChecked || ea.grep(q(n, 'input'), r), o = 0; (f = n[o++]); )
            if (
              (!d || -1 === ea.inArray(f, d)) &&
              ((g = ea.contains(f.ownerDocument, f)), (h = q(m.appendChild(f), 'script')), g && v(h), c)
            )
              for (e = 0; (f = h[e++]); ) Ua.test(f.type || '') && c.push(f)
          return (h = null), m
        },
        cleanData: function(a, b) {
          for (var c, d, e, f, g = 0, h = ea.expando, i = ea.cache, j = ca.deleteExpando, k = ea.event.special; null != (c = a[g]); g++)
            if ((b || ea.acceptData(c)) && ((e = c[h]), (f = e && i[e]))) {
              if (f.events) for (d in f.events) k[d] ? ea.event.remove(c, d) : ea.removeEvent(c, d, f.handle)
              i[e] && (delete i[e], j ? delete c[h] : typeof c.removeAttribute !== xa ? c.removeAttribute(h) : (c[h] = null), W.push(e))
            }
        }
      }),
      ea.fn.extend({
        text: function(a) {
          return Da(
            this,
            function(a) {
              return void 0 === a ? ea.text(this) : this.empty().append(((this[0] && this[0].ownerDocument) || oa).createTextNode(a))
            },
            null,
            a,
            arguments.length
          )
        },
        append: function() {
          return this.domManip(arguments, function(a) {
            if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
              var b = s(this, a)
              b.appendChild(a)
            }
          })
        },
        prepend: function() {
          return this.domManip(arguments, function(a) {
            if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
              var b = s(this, a)
              b.insertBefore(a, b.firstChild)
            }
          })
        },
        before: function() {
          return this.domManip(arguments, function(a) {
            this.parentNode && this.parentNode.insertBefore(a, this)
          })
        },
        after: function() {
          return this.domManip(arguments, function(a) {
            this.parentNode && this.parentNode.insertBefore(a, this.nextSibling)
          })
        },
        remove: function(a, b) {
          for (var c, d = a ? ea.filter(a, this) : this, e = 0; null != (c = d[e]); e++)
            b || 1 !== c.nodeType || ea.cleanData(q(c)),
              c.parentNode && (b && ea.contains(c.ownerDocument, c) && v(q(c, 'script')), c.parentNode.removeChild(c))
          return this
        },
        empty: function() {
          for (var a, b = 0; null != (a = this[b]); b++) {
            for (1 === a.nodeType && ea.cleanData(q(a, !1)); a.firstChild; ) a.removeChild(a.firstChild)
            a.options && ea.nodeName(a, 'select') && (a.options.length = 0)
          }
          return this
        },
        clone: function(a, b) {
          return (
            (a = null == a ? !1 : a),
            (b = null == b ? a : b),
            this.map(function() {
              return ea.clone(this, a, b)
            })
          )
        },
        html: function(a) {
          return Da(
            this,
            function(a) {
              var b = this[0] || {},
                c = 0,
                d = this.length
              if (void 0 === a) return 1 === b.nodeType ? b.innerHTML.replace(La, '') : void 0
              if (
                'string' == typeof a &&
                !Sa.test(a) &&
                (ca.htmlSerialize || !Ma.test(a)) &&
                (ca.leadingWhitespace || !Na.test(a)) &&
                !Xa[(Pa.exec(a) || ['', ''])[1].toLowerCase()]
              ) {
                a = a.replace(Oa, '<$1></$2>')
                try {
                  for (; d > c; c++) (b = this[c] || {}), 1 === b.nodeType && (ea.cleanData(q(b, !1)), (b.innerHTML = a))
                  b = 0
                } catch (e) {}
              }
              b && this.empty().append(a)
            },
            null,
            a,
            arguments.length
          )
        },
        replaceWith: function() {
          var a = arguments[0]
          return (
            this.domManip(arguments, function(b) {
              ;(a = this.parentNode), ea.cleanData(q(this)), a && a.replaceChild(b, this)
            }),
            a && (a.length || a.nodeType) ? this : this.remove()
          )
        },
        detach: function(a) {
          return this.remove(a, !0)
        },
        domManip: function(a, b) {
          a = Y.apply([], a)
          var c,
            d,
            e,
            f,
            g,
            h,
            i = 0,
            j = this.length,
            k = this,
            l = j - 1,
            m = a[0],
            n = ea.isFunction(m)
          if (n || (j > 1 && 'string' == typeof m && !ca.checkClone && Ta.test(m)))
            return this.each(function(c) {
              var d = k.eq(c)
              n && (a[0] = m.call(this, c, d.html())), d.domManip(a, b)
            })
          if (
            j &&
            ((h = ea.buildFragment(a, this[0].ownerDocument, !1, this)), (c = h.firstChild), 1 === h.childNodes.length && (h = c), c)
          ) {
            for (f = ea.map(q(h, 'script'), t), e = f.length; j > i; i++)
              (d = h), i !== l && ((d = ea.clone(d, !0, !0)), e && ea.merge(f, q(d, 'script'))), b.call(this[i], d, i)
            if (e)
              for (g = f[f.length - 1].ownerDocument, ea.map(f, u), i = 0; e > i; i++)
                (d = f[i]),
                  Ua.test(d.type || '') &&
                    !ea._data(d, 'globalEval') &&
                    ea.contains(g, d) &&
                    (d.src
                      ? ea._evalUrl && ea._evalUrl(d.src)
                      : ea.globalEval((d.text || d.textContent || d.innerHTML || '').replace(Wa, '')))
            h = c = null
          }
          return this
        }
      }),
      ea.each(
        { appendTo: 'append', prependTo: 'prepend', insertBefore: 'before', insertAfter: 'after', replaceAll: 'replaceWith' },
        function(a, b) {
          ea.fn[a] = function(a) {
            for (var c, d = 0, e = [], f = ea(a), g = f.length - 1; g >= d; d++)
              (c = d === g ? this : this.clone(!0)), ea(f[d])[b](c), Z.apply(e, c.get())
            return this.pushStack(e)
          }
        }
      )
    var $a,
      _a = {}
    !(function() {
      var a
      ca.shrinkWrapBlocks = function() {
        if (null != a) return a
        a = !1
        var b, c, d
        return (
          (c = oa.getElementsByTagName('body')[0]),
          c && c.style
            ? ((b = oa.createElement('div')),
              (d = oa.createElement('div')),
              (d.style.cssText = 'position:absolute;border:0;width:0;height:0;top:0;left:-9999px'),
              c.appendChild(d).appendChild(b),
              typeof b.style.zoom !== xa &&
                ((b.style.cssText =
                  '-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1'),
                (b.appendChild(oa.createElement('div')).style.width = '5px'),
                (a = 3 !== b.offsetWidth)),
              c.removeChild(d),
              a)
            : void 0
        )
      }
    })()
    var ab,
      bb,
      cb = /^margin/,
      db = new RegExp('^(' + Aa + ')(?!px)[a-z%]+$', 'i'),
      eb = /^(top|right|bottom|left)$/
    a.getComputedStyle
      ? ((ab = function(b) {
          return b.ownerDocument.defaultView.opener ? b.ownerDocument.defaultView.getComputedStyle(b, null) : a.getComputedStyle(b, null)
        }),
        (bb = function(a, b, c) {
          var d,
            e,
            f,
            g,
            h = a.style
          return (
            (c = c || ab(a)),
            (g = c ? c.getPropertyValue(b) || c[b] : void 0),
            c &&
              ('' !== g || ea.contains(a.ownerDocument, a) || (g = ea.style(a, b)),
              db.test(g) &&
                cb.test(b) &&
                ((d = h.width),
                (e = h.minWidth),
                (f = h.maxWidth),
                (h.minWidth = h.maxWidth = h.width = g),
                (g = c.width),
                (h.width = d),
                (h.minWidth = e),
                (h.maxWidth = f))),
            void 0 === g ? g : g + ''
          )
        }))
      : oa.documentElement.currentStyle &&
        ((ab = function(a) {
          return a.currentStyle
        }),
        (bb = function(a, b, c) {
          var d,
            e,
            f,
            g,
            h = a.style
          return (
            (c = c || ab(a)),
            (g = c ? c[b] : void 0),
            null == g && h && h[b] && (g = h[b]),
            db.test(g) &&
              !eb.test(b) &&
              ((d = h.left),
              (e = a.runtimeStyle),
              (f = e && e.left),
              f && (e.left = a.currentStyle.left),
              (h.left = 'fontSize' === b ? '1em' : g),
              (g = h.pixelLeft + 'px'),
              (h.left = d),
              f && (e.left = f)),
            void 0 === g ? g : g + '' || 'auto'
          )
        })),
      (function() {
        function b() {
          var b, c, d, e
          ;(c = oa.getElementsByTagName('body')[0]),
            c &&
              c.style &&
              ((b = oa.createElement('div')),
              (d = oa.createElement('div')),
              (d.style.cssText = 'position:absolute;border:0;width:0;height:0;top:0;left:-9999px'),
              c.appendChild(d).appendChild(b),
              (b.style.cssText =
                '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute'),
              (f = g = !1),
              (i = !0),
              a.getComputedStyle &&
                ((f = '1%' !== (a.getComputedStyle(b, null) || {}).top),
                (g = '4px' === (a.getComputedStyle(b, null) || { width: '4px' }).width),
                (e = b.appendChild(oa.createElement('div'))),
                (e.style.cssText = b.style.cssText =
                  '-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0'),
                (e.style.marginRight = e.style.width = '0'),
                (b.style.width = '1px'),
                (i = !parseFloat((a.getComputedStyle(e, null) || {}).marginRight)),
                b.removeChild(e)),
              (b.innerHTML = '<table><tr><td></td><td>t</td></tr></table>'),
              (e = b.getElementsByTagName('td')),
              (e[0].style.cssText = 'margin:0;border:0;padding:0;display:none'),
              (h = 0 === e[0].offsetHeight),
              h && ((e[0].style.display = ''), (e[1].style.display = 'none'), (h = 0 === e[0].offsetHeight)),
              c.removeChild(d))
        }
        var c, d, e, f, g, h, i
        ;(c = oa.createElement('div')),
          (c.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>"),
          (e = c.getElementsByTagName('a')[0]),
          (d = e && e.style),
          d &&
            ((d.cssText = 'float:left;opacity:.5'),
            (ca.opacity = '0.5' === d.opacity),
            (ca.cssFloat = !!d.cssFloat),
            (c.style.backgroundClip = 'content-box'),
            (c.cloneNode(!0).style.backgroundClip = ''),
            (ca.clearCloneStyle = 'content-box' === c.style.backgroundClip),
            (ca.boxSizing = '' === d.boxSizing || '' === d.MozBoxSizing || '' === d.WebkitBoxSizing),
            ea.extend(ca, {
              reliableHiddenOffsets: function() {
                return null == h && b(), h
              },
              boxSizingReliable: function() {
                return null == g && b(), g
              },
              pixelPosition: function() {
                return null == f && b(), f
              },
              reliableMarginRight: function() {
                return null == i && b(), i
              }
            }))
      })(),
      (ea.swap = function(a, b, c, d) {
        var e,
          f,
          g = {}
        for (f in b) (g[f] = a.style[f]), (a.style[f] = b[f])
        e = c.apply(a, d || [])
        for (f in b) a.style[f] = g[f]
        return e
      })
    var fb = /alpha\([^)]*\)/i,
      gb = /opacity\s*=\s*([^)]*)/,
      hb = /^(none|table(?!-c[ea]).+)/,
      ib = new RegExp('^(' + Aa + ')(.*)$', 'i'),
      jb = new RegExp('^([+-])=(' + Aa + ')', 'i'),
      kb = { position: 'absolute', visibility: 'hidden', display: 'block' },
      lb = { letterSpacing: '0', fontWeight: '400' },
      mb = ['Webkit', 'O', 'Moz', 'ms']
    ea.extend({
      cssHooks: {
        opacity: {
          get: function(a, b) {
            if (b) {
              var c = bb(a, 'opacity')
              return '' === c ? '1' : c
            }
          }
        }
      },
      cssNumber: {
        columnCount: !0,
        fillOpacity: !0,
        flexGrow: !0,
        flexShrink: !0,
        fontWeight: !0,
        lineHeight: !0,
        opacity: !0,
        order: !0,
        orphans: !0,
        widows: !0,
        zIndex: !0,
        zoom: !0
      },
      cssProps: { float: ca.cssFloat ? 'cssFloat' : 'styleFloat' },
      style: function(a, b, c, d) {
        if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
          var e,
            f,
            g,
            h = ea.camelCase(b),
            i = a.style
          if (((b = ea.cssProps[h] || (ea.cssProps[h] = B(i, h))), (g = ea.cssHooks[b] || ea.cssHooks[h]), void 0 === c))
            return g && 'get' in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b]
          if (
            ((f = typeof c),
            'string' === f && (e = jb.exec(c)) && ((c = (e[1] + 1) * e[2] + parseFloat(ea.css(a, b))), (f = 'number')),
            null != c &&
              c === c &&
              ('number' !== f || ea.cssNumber[h] || (c += 'px'),
              ca.clearCloneStyle || '' !== c || 0 !== b.indexOf('background') || (i[b] = 'inherit'),
              !(g && 'set' in g && void 0 === (c = g.set(a, c, d)))))
          )
            try {
              i[b] = c
            } catch (j) {}
        }
      },
      css: function(a, b, c, d) {
        var e,
          f,
          g,
          h = ea.camelCase(b)
        return (
          (b = ea.cssProps[h] || (ea.cssProps[h] = B(a.style, h))),
          (g = ea.cssHooks[b] || ea.cssHooks[h]),
          g && 'get' in g && (f = g.get(a, !0, c)),
          void 0 === f && (f = bb(a, b, d)),
          'normal' === f && b in lb && (f = lb[b]),
          '' === c || c ? ((e = parseFloat(f)), c === !0 || ea.isNumeric(e) ? e || 0 : f) : f
        )
      }
    }),
      ea.each(['height', 'width'], function(a, b) {
        ea.cssHooks[b] = {
          get: function(a, c, d) {
            return c
              ? hb.test(ea.css(a, 'display')) && 0 === a.offsetWidth
                ? ea.swap(a, kb, function() {
                    return F(a, b, d)
                  })
                : F(a, b, d)
              : void 0
          },
          set: function(a, c, d) {
            var e = d && ab(a)
            return D(a, c, d ? E(a, b, d, ca.boxSizing && 'border-box' === ea.css(a, 'boxSizing', !1, e), e) : 0)
          }
        }
      }),
      ca.opacity ||
        (ea.cssHooks.opacity = {
          get: function(a, b) {
            return gb.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || '')
              ? 0.01 * parseFloat(RegExp.$1) + ''
              : b
                ? '1'
                : ''
          },
          set: function(a, b) {
            var c = a.style,
              d = a.currentStyle,
              e = ea.isNumeric(b) ? 'alpha(opacity=' + 100 * b + ')' : '',
              f = (d && d.filter) || c.filter || ''
            ;(c.zoom = 1),
              ((b >= 1 || '' === b) &&
                '' === ea.trim(f.replace(fb, '')) &&
                c.removeAttribute &&
                (c.removeAttribute('filter'), '' === b || (d && !d.filter))) ||
                (c.filter = fb.test(f) ? f.replace(fb, e) : f + ' ' + e)
          }
        }),
      (ea.cssHooks.marginRight = A(ca.reliableMarginRight, function(a, b) {
        return b ? ea.swap(a, { display: 'inline-block' }, bb, [a, 'marginRight']) : void 0
      })),
      ea.each({ margin: '', padding: '', border: 'Width' }, function(a, b) {
        ;(ea.cssHooks[a + b] = {
          expand: function(c) {
            for (var d = 0, e = {}, f = 'string' == typeof c ? c.split(' ') : [c]; 4 > d; d++) e[a + Ba[d] + b] = f[d] || f[d - 2] || f[0]
            return e
          }
        }),
          cb.test(a) || (ea.cssHooks[a + b].set = D)
      }),
      ea.fn.extend({
        css: function(a, b) {
          return Da(
            this,
            function(a, b, c) {
              var d,
                e,
                f = {},
                g = 0
              if (ea.isArray(b)) {
                for (d = ab(a), e = b.length; e > g; g++) f[b[g]] = ea.css(a, b[g], !1, d)
                return f
              }
              return void 0 !== c ? ea.style(a, b, c) : ea.css(a, b)
            },
            a,
            b,
            arguments.length > 1
          )
        },
        show: function() {
          return C(this, !0)
        },
        hide: function() {
          return C(this)
        },
        toggle: function(a) {
          return 'boolean' == typeof a
            ? a
              ? this.show()
              : this.hide()
            : this.each(function() {
                Ca(this) ? ea(this).show() : ea(this).hide()
              })
        }
      }),
      (ea.Tween = G),
      (G.prototype = {
        constructor: G,
        init: function(a, b, c, d, e, f) {
          ;(this.elem = a),
            (this.prop = c),
            (this.easing = e || 'swing'),
            (this.options = b),
            (this.start = this.now = this.cur()),
            (this.end = d),
            (this.unit = f || (ea.cssNumber[c] ? '' : 'px'))
        },
        cur: function() {
          var a = G.propHooks[this.prop]
          return a && a.get ? a.get(this) : G.propHooks._default.get(this)
        },
        run: function(a) {
          var b,
            c = G.propHooks[this.prop]
          return (
            this.options.duration
              ? (this.pos = b = ea.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration))
              : (this.pos = b = a),
            (this.now = (this.end - this.start) * b + this.start),
            this.options.step && this.options.step.call(this.elem, this.now, this),
            c && c.set ? c.set(this) : G.propHooks._default.set(this),
            this
          )
        }
      }),
      (G.prototype.init.prototype = G.prototype),
      (G.propHooks = {
        _default: {
          get: function(a) {
            var b
            return null == a.elem[a.prop] || (a.elem.style && null != a.elem.style[a.prop])
              ? ((b = ea.css(a.elem, a.prop, '')), b && 'auto' !== b ? b : 0)
              : a.elem[a.prop]
          },
          set: function(a) {
            ea.fx.step[a.prop]
              ? ea.fx.step[a.prop](a)
              : a.elem.style && (null != a.elem.style[ea.cssProps[a.prop]] || ea.cssHooks[a.prop])
                ? ea.style(a.elem, a.prop, a.now + a.unit)
                : (a.elem[a.prop] = a.now)
          }
        }
      }),
      (G.propHooks.scrollTop = G.propHooks.scrollLeft = {
        set: function(a) {
          a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
        }
      }),
      (ea.easing = {
        linear: function(a) {
          return a
        },
        swing: function(a) {
          return 0.5 - Math.cos(a * Math.PI) / 2
        }
      }),
      (ea.fx = G.prototype.init),
      (ea.fx.step = {})
    var nb,
      ob,
      pb = /^(?:toggle|show|hide)$/,
      qb = new RegExp('^(?:([+-])=|)(' + Aa + ')([a-z%]*)$', 'i'),
      rb = /queueHooks$/,
      sb = [K],
      tb = {
        '*': [
          function(a, b) {
            var c = this.createTween(a, b),
              d = c.cur(),
              e = qb.exec(b),
              f = (e && e[3]) || (ea.cssNumber[a] ? '' : 'px'),
              g = (ea.cssNumber[a] || ('px' !== f && +d)) && qb.exec(ea.css(c.elem, a)),
              h = 1,
              i = 20
            if (g && g[3] !== f) {
              ;(f = f || g[3]), (e = e || []), (g = +d || 1)
              do (h = h || '.5'), (g /= h), ea.style(c.elem, a, g + f)
              while (h !== (h = c.cur() / d) && 1 !== h && --i)
            }
            return e && ((g = c.start = +g || +d || 0), (c.unit = f), (c.end = e[1] ? g + (e[1] + 1) * e[2] : +e[2])), c
          }
        ]
      }
    ;(ea.Animation = ea.extend(M, {
      tweener: function(a, b) {
        ea.isFunction(a) ? ((b = a), (a = ['*'])) : (a = a.split(' '))
        for (var c, d = 0, e = a.length; e > d; d++) (c = a[d]), (tb[c] = tb[c] || []), tb[c].unshift(b)
      },
      prefilter: function(a, b) {
        b ? sb.unshift(a) : sb.push(a)
      }
    })),
      (ea.speed = function(a, b, c) {
        var d =
          a && 'object' == typeof a
            ? ea.extend({}, a)
            : { complete: c || (!c && b) || (ea.isFunction(a) && a), duration: a, easing: (c && b) || (b && !ea.isFunction(b) && b) }
        return (
          (d.duration = ea.fx.off
            ? 0
            : 'number' == typeof d.duration
              ? d.duration
              : d.duration in ea.fx.speeds
                ? ea.fx.speeds[d.duration]
                : ea.fx.speeds._default),
          (null == d.queue || d.queue === !0) && (d.queue = 'fx'),
          (d.old = d.complete),
          (d.complete = function() {
            ea.isFunction(d.old) && d.old.call(this), d.queue && ea.dequeue(this, d.queue)
          }),
          d
        )
      }),
      ea.fn.extend({
        fadeTo: function(a, b, c, d) {
          return this.filter(Ca)
            .css('opacity', 0)
            .show()
            .end()
            .animate({ opacity: b }, a, c, d)
        },
        animate: function(a, b, c, d) {
          var e = ea.isEmptyObject(a),
            f = ea.speed(b, c, d),
            g = function() {
              var b = M(this, ea.extend({}, a), f)
              ;(e || ea._data(this, 'finish')) && b.stop(!0)
            }
          return (g.finish = g), e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
        },
        stop: function(a, b, c) {
          var d = function(a) {
            var b = a.stop
            delete a.stop, b(c)
          }
          return (
            'string' != typeof a && ((c = b), (b = a), (a = void 0)),
            b && a !== !1 && this.queue(a || 'fx', []),
            this.each(function() {
              var b = !0,
                e = null != a && a + 'queueHooks',
                f = ea.timers,
                g = ea._data(this)
              if (e) g[e] && g[e].stop && d(g[e])
              else for (e in g) g[e] && g[e].stop && rb.test(e) && d(g[e])
              for (e = f.length; e--; )
                f[e].elem !== this || (null != a && f[e].queue !== a) || (f[e].anim.stop(c), (b = !1), f.splice(e, 1))
              ;(b || !c) && ea.dequeue(this, a)
            })
          )
        },
        finish: function(a) {
          return (
            a !== !1 && (a = a || 'fx'),
            this.each(function() {
              var b,
                c = ea._data(this),
                d = c[a + 'queue'],
                e = c[a + 'queueHooks'],
                f = ea.timers,
                g = d ? d.length : 0
              for (c.finish = !0, ea.queue(this, a, []), e && e.stop && e.stop.call(this, !0), b = f.length; b--; )
                f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0), f.splice(b, 1))
              for (b = 0; g > b; b++) d[b] && d[b].finish && d[b].finish.call(this)
              delete c.finish
            })
          )
        }
      }),
      ea.each(['toggle', 'show', 'hide'], function(a, b) {
        var c = ea.fn[b]
        ea.fn[b] = function(a, d, e) {
          return null == a || 'boolean' == typeof a ? c.apply(this, arguments) : this.animate(I(b, !0), a, d, e)
        }
      }),
      ea.each(
        {
          slideDown: I('show'),
          slideUp: I('hide'),
          slideToggle: I('toggle'),
          fadeIn: { opacity: 'show' },
          fadeOut: { opacity: 'hide' },
          fadeToggle: { opacity: 'toggle' }
        },
        function(a, b) {
          ea.fn[a] = function(a, c, d) {
            return this.animate(b, a, c, d)
          }
        }
      ),
      (ea.timers = []),
      (ea.fx.tick = function() {
        var a,
          b = ea.timers,
          c = 0
        for (nb = ea.now(); c < b.length; c++) (a = b[c]), a() || b[c] !== a || b.splice(c--, 1)
        b.length || ea.fx.stop(), (nb = void 0)
      }),
      (ea.fx.timer = function(a) {
        ea.timers.push(a), a() ? ea.fx.start() : ea.timers.pop()
      }),
      (ea.fx.interval = 13),
      (ea.fx.start = function() {
        ob || (ob = setInterval(ea.fx.tick, ea.fx.interval))
      }),
      (ea.fx.stop = function() {
        clearInterval(ob), (ob = null)
      }),
      (ea.fx.speeds = { slow: 600, fast: 200, _default: 400 }),
      (ea.fn.delay = function(a, b) {
        return (
          (a = ea.fx ? ea.fx.speeds[a] || a : a),
          (b = b || 'fx'),
          this.queue(b, function(b, c) {
            var d = setTimeout(b, a)
            c.stop = function() {
              clearTimeout(d)
            }
          })
        )
      }),
      (function() {
        var a, b, c, d, e
        ;(b = oa.createElement('div')),
          b.setAttribute('className', 't'),
          (b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>"),
          (d = b.getElementsByTagName('a')[0]),
          (c = oa.createElement('select')),
          (e = c.appendChild(oa.createElement('option'))),
          (a = b.getElementsByTagName('input')[0]),
          (d.style.cssText = 'top:1px'),
          (ca.getSetAttribute = 't' !== b.className),
          (ca.style = /top/.test(d.getAttribute('style'))),
          (ca.hrefNormalized = '/a' === d.getAttribute('href')),
          (ca.checkOn = !!a.value),
          (ca.optSelected = e.selected),
          (ca.enctype = !!oa.createElement('form').enctype),
          (c.disabled = !0),
          (ca.optDisabled = !e.disabled),
          (a = oa.createElement('input')),
          a.setAttribute('value', ''),
          (ca.input = '' === a.getAttribute('value')),
          (a.value = 't'),
          a.setAttribute('type', 'radio'),
          (ca.radioValue = 't' === a.value)
      })()
    var ub = /\r/g
    ea.fn.extend({
      val: function(a) {
        var b,
          c,
          d,
          e = this[0]
        {
          if (arguments.length)
            return (
              (d = ea.isFunction(a)),
              this.each(function(c) {
                var e
                1 === this.nodeType &&
                  ((e = d ? a.call(this, c, ea(this).val()) : a),
                  null == e
                    ? (e = '')
                    : 'number' == typeof e
                      ? (e += '')
                      : ea.isArray(e) &&
                        (e = ea.map(e, function(a) {
                          return null == a ? '' : a + ''
                        })),
                  (b = ea.valHooks[this.type] || ea.valHooks[this.nodeName.toLowerCase()]),
                  (b && 'set' in b && void 0 !== b.set(this, e, 'value')) || (this.value = e))
              })
            )
          if (e)
            return (
              (b = ea.valHooks[e.type] || ea.valHooks[e.nodeName.toLowerCase()]),
              b && 'get' in b && void 0 !== (c = b.get(e, 'value'))
                ? c
                : ((c = e.value), 'string' == typeof c ? c.replace(ub, '') : null == c ? '' : c)
            )
        }
      }
    }),
      ea.extend({
        valHooks: {
          option: {
            get: function(a) {
              var b = ea.find.attr(a, 'value')
              return null != b ? b : ea.trim(ea.text(a))
            }
          },
          select: {
            get: function(a) {
              for (
                var b,
                  c,
                  d = a.options,
                  e = a.selectedIndex,
                  f = 'select-one' === a.type || 0 > e,
                  g = f ? null : [],
                  h = f ? e + 1 : d.length,
                  i = 0 > e ? h : f ? e : 0;
                h > i;
                i++
              )
                if (
                  ((c = d[i]),
                  (c.selected || i === e) &&
                    (ca.optDisabled ? !c.disabled : null === c.getAttribute('disabled')) &&
                    (!c.parentNode.disabled || !ea.nodeName(c.parentNode, 'optgroup')))
                ) {
                  if (((b = ea(c).val()), f)) return b
                  g.push(b)
                }
              return g
            },
            set: function(a, b) {
              for (var c, d, e = a.options, f = ea.makeArray(b), g = e.length; g--; )
                if (((d = e[g]), ea.inArray(ea.valHooks.option.get(d), f) >= 0))
                  try {
                    d.selected = c = !0
                  } catch (h) {
                    d.scrollHeight
                  }
                else d.selected = !1
              return c || (a.selectedIndex = -1), e
            }
          }
        }
      }),
      ea.each(['radio', 'checkbox'], function() {
        ;(ea.valHooks[this] = {
          set: function(a, b) {
            return ea.isArray(b) ? (a.checked = ea.inArray(ea(a).val(), b) >= 0) : void 0
          }
        }),
          ca.checkOn ||
            (ea.valHooks[this].get = function(a) {
              return null === a.getAttribute('value') ? 'on' : a.value
            })
      })
    var vb,
      wb,
      xb = ea.expr.attrHandle,
      yb = /^(?:checked|selected)$/i,
      zb = ca.getSetAttribute,
      Ab = ca.input
    ea.fn.extend({
      attr: function(a, b) {
        return Da(this, ea.attr, a, b, arguments.length > 1)
      },
      removeAttr: function(a) {
        return this.each(function() {
          ea.removeAttr(this, a)
        })
      }
    }),
      ea.extend({
        attr: function(a, b, c) {
          var d,
            e,
            f = a.nodeType
          if (a && 3 !== f && 8 !== f && 2 !== f)
            return typeof a.getAttribute === xa
              ? ea.prop(a, b, c)
              : ((1 === f && ea.isXMLDoc(a)) || ((b = b.toLowerCase()), (d = ea.attrHooks[b] || (ea.expr.match.bool.test(b) ? wb : vb))),
                void 0 === c
                  ? d && 'get' in d && null !== (e = d.get(a, b))
                    ? e
                    : ((e = ea.find.attr(a, b)), null == e ? void 0 : e)
                  : null !== c
                    ? d && 'set' in d && void 0 !== (e = d.set(a, c, b))
                      ? e
                      : (a.setAttribute(b, c + ''), c)
                    : void ea.removeAttr(a, b))
        },
        removeAttr: function(a, b) {
          var c,
            d,
            e = 0,
            f = b && b.match(ta)
          if (f && 1 === a.nodeType)
            for (; (c = f[e++]); )
              (d = ea.propFix[c] || c),
                ea.expr.match.bool.test(c)
                  ? (Ab && zb) || !yb.test(c)
                    ? (a[d] = !1)
                    : (a[ea.camelCase('default-' + c)] = a[d] = !1)
                  : ea.attr(a, c, ''),
                a.removeAttribute(zb ? c : d)
        },
        attrHooks: {
          type: {
            set: function(a, b) {
              if (!ca.radioValue && 'radio' === b && ea.nodeName(a, 'input')) {
                var c = a.value
                return a.setAttribute('type', b), c && (a.value = c), b
              }
            }
          }
        }
      }),
      (wb = {
        set: function(a, b, c) {
          return (
            b === !1
              ? ea.removeAttr(a, c)
              : (Ab && zb) || !yb.test(c)
                ? a.setAttribute((!zb && ea.propFix[c]) || c, c)
                : (a[ea.camelCase('default-' + c)] = a[c] = !0),
            c
          )
        }
      }),
      ea.each(ea.expr.match.bool.source.match(/\w+/g), function(a, b) {
        var c = xb[b] || ea.find.attr
        xb[b] =
          (Ab && zb) || !yb.test(b)
            ? function(a, b, d) {
                var e, f
                return d || ((f = xb[b]), (xb[b] = e), (e = null != c(a, b, d) ? b.toLowerCase() : null), (xb[b] = f)), e
              }
            : function(a, b, c) {
                return c ? void 0 : a[ea.camelCase('default-' + b)] ? b.toLowerCase() : null
              }
      }),
      (Ab && zb) ||
        (ea.attrHooks.value = {
          set: function(a, b, c) {
            return ea.nodeName(a, 'input') ? void (a.defaultValue = b) : vb && vb.set(a, b, c)
          }
        }),
      zb ||
        ((vb = {
          set: function(a, b, c) {
            var d = a.getAttributeNode(c)
            return (
              d || a.setAttributeNode((d = a.ownerDocument.createAttribute(c))),
              (d.value = b += ''),
              'value' === c || b === a.getAttribute(c) ? b : void 0
            )
          }
        }),
        (xb.id = xb.name = xb.coords = function(a, b, c) {
          var d
          return c ? void 0 : (d = a.getAttributeNode(b)) && '' !== d.value ? d.value : null
        }),
        (ea.valHooks.button = {
          get: function(a, b) {
            var c = a.getAttributeNode(b)
            return c && c.specified ? c.value : void 0
          },
          set: vb.set
        }),
        (ea.attrHooks.contenteditable = {
          set: function(a, b, c) {
            vb.set(a, '' === b ? !1 : b, c)
          }
        }),
        ea.each(['width', 'height'], function(a, b) {
          ea.attrHooks[b] = {
            set: function(a, c) {
              return '' === c ? (a.setAttribute(b, 'auto'), c) : void 0
            }
          }
        })),
      ca.style ||
        (ea.attrHooks.style = {
          get: function(a) {
            return a.style.cssText || void 0
          },
          set: function(a, b) {
            return (a.style.cssText = b + '')
          }
        })
    var Bb = /^(?:input|select|textarea|button|object)$/i,
      Cb = /^(?:a|area)$/i
    ea.fn.extend({
      prop: function(a, b) {
        return Da(this, ea.prop, a, b, arguments.length > 1)
      },
      removeProp: function(a) {
        return (
          (a = ea.propFix[a] || a),
          this.each(function() {
            try {
              ;(this[a] = void 0), delete this[a]
            } catch (b) {}
          })
        )
      }
    }),
      ea.extend({
        propFix: { for: 'htmlFor', class: 'className' },
        prop: function(a, b, c) {
          var d,
            e,
            f,
            g = a.nodeType
          if (a && 3 !== g && 8 !== g && 2 !== g)
            return (
              (f = 1 !== g || !ea.isXMLDoc(a)),
              f && ((b = ea.propFix[b] || b), (e = ea.propHooks[b])),
              void 0 !== c
                ? e && 'set' in e && void 0 !== (d = e.set(a, c, b))
                  ? d
                  : (a[b] = c)
                : e && 'get' in e && null !== (d = e.get(a, b))
                  ? d
                  : a[b]
            )
        },
        propHooks: {
          tabIndex: {
            get: function(a) {
              var b = ea.find.attr(a, 'tabindex')
              return b ? parseInt(b, 10) : Bb.test(a.nodeName) || (Cb.test(a.nodeName) && a.href) ? 0 : -1
            }
          }
        }
      }),
      ca.hrefNormalized ||
        ea.each(['href', 'src'], function(a, b) {
          ea.propHooks[b] = {
            get: function(a) {
              return a.getAttribute(b, 4)
            }
          }
        }),
      ca.optSelected ||
        (ea.propHooks.selected = {
          get: function(a) {
            var b = a.parentNode
            return b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex), null
          }
        }),
      ea.each(
        [
          'tabIndex',
          'readOnly',
          'maxLength',
          'cellSpacing',
          'cellPadding',
          'rowSpan',
          'colSpan',
          'useMap',
          'frameBorder',
          'contentEditable'
        ],
        function() {
          ea.propFix[this.toLowerCase()] = this
        }
      ),
      ca.enctype || (ea.propFix.enctype = 'encoding')
    var Db = /[\t\r\n\f]/g
    ea.fn.extend({
      addClass: function(a) {
        var b,
          c,
          d,
          e,
          f,
          g,
          h = 0,
          i = this.length,
          j = 'string' == typeof a && a
        if (ea.isFunction(a))
          return this.each(function(b) {
            ea(this).addClass(a.call(this, b, this.className))
          })
        if (j)
          for (b = (a || '').match(ta) || []; i > h; h++)
            if (((c = this[h]), (d = 1 === c.nodeType && (c.className ? (' ' + c.className + ' ').replace(Db, ' ') : ' ')))) {
              for (f = 0; (e = b[f++]); ) d.indexOf(' ' + e + ' ') < 0 && (d += e + ' ')
              ;(g = ea.trim(d)), c.className !== g && (c.className = g)
            }
        return this
      },
      removeClass: function(a) {
        var b,
          c,
          d,
          e,
          f,
          g,
          h = 0,
          i = this.length,
          j = 0 === arguments.length || ('string' == typeof a && a)
        if (ea.isFunction(a))
          return this.each(function(b) {
            ea(this).removeClass(a.call(this, b, this.className))
          })
        if (j)
          for (b = (a || '').match(ta) || []; i > h; h++)
            if (((c = this[h]), (d = 1 === c.nodeType && (c.className ? (' ' + c.className + ' ').replace(Db, ' ') : '')))) {
              for (f = 0; (e = b[f++]); ) for (; d.indexOf(' ' + e + ' ') >= 0; ) d = d.replace(' ' + e + ' ', ' ')
              ;(g = a ? ea.trim(d) : ''), c.className !== g && (c.className = g)
            }
        return this
      },
      toggleClass: function(a, b) {
        var c = typeof a
        return 'boolean' == typeof b && 'string' === c
          ? b
            ? this.addClass(a)
            : this.removeClass(a)
          : ea.isFunction(a)
            ? this.each(function(c) {
                ea(this).toggleClass(a.call(this, c, this.className, b), b)
              })
            : this.each(function() {
                if ('string' === c)
                  for (var b, d = 0, e = ea(this), f = a.match(ta) || []; (b = f[d++]); ) e.hasClass(b) ? e.removeClass(b) : e.addClass(b)
                else
                  (c === xa || 'boolean' === c) &&
                    (this.className && ea._data(this, '__className__', this.className),
                    (this.className = this.className || a === !1 ? '' : ea._data(this, '__className__') || ''))
              })
      },
      hasClass: function(a) {
        for (var b = ' ' + a + ' ', c = 0, d = this.length; d > c; c++)
          if (1 === this[c].nodeType && (' ' + this[c].className + ' ').replace(Db, ' ').indexOf(b) >= 0) return !0
        return !1
      }
    }),
      ea.each(
        'blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu'.split(
          ' '
        ),
        function(a, b) {
          ea.fn[b] = function(a, c) {
            return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
          }
        }
      ),
      ea.fn.extend({
        hover: function(a, b) {
          return this.mouseenter(a).mouseleave(b || a)
        },
        bind: function(a, b, c) {
          return this.on(a, null, b, c)
        },
        unbind: function(a, b) {
          return this.off(a, null, b)
        },
        delegate: function(a, b, c, d) {
          return this.on(b, a, c, d)
        },
        undelegate: function(a, b, c) {
          return 1 === arguments.length ? this.off(a, '**') : this.off(b, a || '**', c)
        }
      })
    var Eb = ea.now(),
      Fb = /\?/,
      Gb = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g
    ;(ea.parseJSON = function(b) {
      if (a.JSON && a.JSON.parse) return a.JSON.parse(b + '')
      var c,
        d = null,
        e = ea.trim(b + '')
      return e &&
        !ea.trim(
          e.replace(Gb, function(a, b, e, f) {
            return c && b && (d = 0), 0 === d ? a : ((c = e || b), (d += !f - !e), '')
          })
        )
        ? Function('return ' + e)()
        : ea.error('Invalid JSON: ' + b)
    }),
      (ea.parseXML = function(b) {
        var c, d
        if (!b || 'string' != typeof b) return null
        try {
          a.DOMParser
            ? ((d = new DOMParser()), (c = d.parseFromString(b, 'text/xml')))
            : ((c = new ActiveXObject('Microsoft.XMLDOM')), (c.async = 'false'), c.loadXML(b))
        } catch (e) {
          c = void 0
        }
        return (c && c.documentElement && !c.getElementsByTagName('parsererror').length) || ea.error('Invalid XML: ' + b), c
      })
    var Hb,
      Ib,
      Jb = /#.*$/,
      Kb = /([?&])_=[^&]*/,
      Lb = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
      Mb = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
      Nb = /^(?:GET|HEAD)$/,
      Ob = /^\/\//,
      Pb = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
      Qb = {},
      Rb = {},
      Sb = '*/'.concat('*')
    try {
      Ib = location.href
    } catch (Tb) {
      ;(Ib = oa.createElement('a')), (Ib.href = ''), (Ib = Ib.href)
    }
    ;(Hb = Pb.exec(Ib.toLowerCase()) || []),
      ea.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
          url: Ib,
          type: 'GET',
          isLocal: Mb.test(Hb[1]),
          global: !0,
          processData: !0,
          async: !0,
          contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
          accepts: {
            '*': Sb,
            text: 'text/plain',
            html: 'text/html',
            xml: 'application/xml, text/xml',
            json: 'application/json, text/javascript'
          },
          contents: { xml: /xml/, html: /html/, json: /json/ },
          responseFields: { xml: 'responseXML', text: 'responseText', json: 'responseJSON' },
          converters: { '* text': String, 'text html': !0, 'text json': ea.parseJSON, 'text xml': ea.parseXML },
          flatOptions: { url: !0, context: !0 }
        },
        ajaxSetup: function(a, b) {
          return b ? P(P(a, ea.ajaxSettings), b) : P(ea.ajaxSettings, a)
        },
        ajaxPrefilter: N(Qb),
        ajaxTransport: N(Rb),
        ajax: function(a, b) {
          function c(a, b, c, d) {
            var e,
              k,
              r,
              s,
              u,
              w = b
            2 !== t &&
              ((t = 2),
              h && clearTimeout(h),
              (j = void 0),
              (g = d || ''),
              (v.readyState = a > 0 ? 4 : 0),
              (e = (a >= 200 && 300 > a) || 304 === a),
              c && (s = Q(l, v, c)),
              (s = R(l, s, v, e)),
              e
                ? (l.ifModified &&
                    ((u = v.getResponseHeader('Last-Modified')),
                    u && (ea.lastModified[f] = u),
                    (u = v.getResponseHeader('etag')),
                    u && (ea.etag[f] = u)),
                  204 === a || 'HEAD' === l.type
                    ? (w = 'nocontent')
                    : 304 === a
                      ? (w = 'notmodified')
                      : ((w = s.state), (k = s.data), (r = s.error), (e = !r)))
                : ((r = w), (a || !w) && ((w = 'error'), 0 > a && (a = 0))),
              (v.status = a),
              (v.statusText = (b || w) + ''),
              e ? o.resolveWith(m, [k, w, v]) : o.rejectWith(m, [v, w, r]),
              v.statusCode(q),
              (q = void 0),
              i && n.trigger(e ? 'ajaxSuccess' : 'ajaxError', [v, l, e ? k : r]),
              p.fireWith(m, [v, w]),
              i && (n.trigger('ajaxComplete', [v, l]), --ea.active || ea.event.trigger('ajaxStop')))
          }
          'object' == typeof a && ((b = a), (a = void 0)), (b = b || {})
          var d,
            e,
            f,
            g,
            h,
            i,
            j,
            k,
            l = ea.ajaxSetup({}, b),
            m = l.context || l,
            n = l.context && (m.nodeType || m.jquery) ? ea(m) : ea.event,
            o = ea.Deferred(),
            p = ea.Callbacks('once memory'),
            q = l.statusCode || {},
            r = {},
            s = {},
            t = 0,
            u = 'canceled',
            v = {
              readyState: 0,
              getResponseHeader: function(a) {
                var b
                if (2 === t) {
                  if (!k) for (k = {}; (b = Lb.exec(g)); ) k[b[1].toLowerCase()] = b[2]
                  b = k[a.toLowerCase()]
                }
                return null == b ? null : b
              },
              getAllResponseHeaders: function() {
                return 2 === t ? g : null
              },
              setRequestHeader: function(a, b) {
                var c = a.toLowerCase()
                return t || ((a = s[c] = s[c] || a), (r[a] = b)), this
              },
              overrideMimeType: function(a) {
                return t || (l.mimeType = a), this
              },
              statusCode: function(a) {
                var b
                if (a)
                  if (2 > t) for (b in a) q[b] = [q[b], a[b]]
                  else v.always(a[v.status])
                return this
              },
              abort: function(a) {
                var b = a || u
                return j && j.abort(b), c(0, b), this
              }
            }
          if (
            ((o.promise(v).complete = p.add),
            (v.success = v.done),
            (v.error = v.fail),
            (l.url = ((a || l.url || Ib) + '').replace(Jb, '').replace(Ob, Hb[1] + '//')),
            (l.type = b.method || b.type || l.method || l.type),
            (l.dataTypes = ea
              .trim(l.dataType || '*')
              .toLowerCase()
              .match(ta) || ['']),
            null == l.crossDomain &&
              ((d = Pb.exec(l.url.toLowerCase())),
              (l.crossDomain = !(
                !d ||
                (d[1] === Hb[1] &&
                  d[2] === Hb[2] &&
                  (d[3] || ('http:' === d[1] ? '80' : '443')) === (Hb[3] || ('http:' === Hb[1] ? '80' : '443')))
              ))),
            l.data && l.processData && 'string' != typeof l.data && (l.data = ea.param(l.data, l.traditional)),
            O(Qb, l, b, v),
            2 === t)
          )
            return v
          ;(i = ea.event && l.global),
            i && 0 === ea.active++ && ea.event.trigger('ajaxStart'),
            (l.type = l.type.toUpperCase()),
            (l.hasContent = !Nb.test(l.type)),
            (f = l.url),
            l.hasContent ||
              (l.data && ((f = l.url += (Fb.test(f) ? '&' : '?') + l.data), delete l.data),
              l.cache === !1 && (l.url = Kb.test(f) ? f.replace(Kb, '$1_=' + Eb++) : f + (Fb.test(f) ? '&' : '?') + '_=' + Eb++)),
            l.ifModified &&
              (ea.lastModified[f] && v.setRequestHeader('If-Modified-Since', ea.lastModified[f]),
              ea.etag[f] && v.setRequestHeader('If-None-Match', ea.etag[f])),
            ((l.data && l.hasContent && l.contentType !== !1) || b.contentType) && v.setRequestHeader('Content-Type', l.contentType),
            v.setRequestHeader(
              'Accept',
              l.dataTypes[0] && l.accepts[l.dataTypes[0]]
                ? l.accepts[l.dataTypes[0]] + ('*' !== l.dataTypes[0] ? ', ' + Sb + '; q=0.01' : '')
                : l.accepts['*']
            )
          for (e in l.headers) v.setRequestHeader(e, l.headers[e])
          if (l.beforeSend && (l.beforeSend.call(m, v, l) === !1 || 2 === t)) return v.abort()
          u = 'abort'
          for (e in { success: 1, error: 1, complete: 1 }) v[e](l[e])
          if ((j = O(Rb, l, b, v))) {
            ;(v.readyState = 1),
              i && n.trigger('ajaxSend', [v, l]),
              l.async &&
                l.timeout > 0 &&
                (h = setTimeout(function() {
                  v.abort('timeout')
                }, l.timeout))
            try {
              ;(t = 1), j.send(r, c)
            } catch (w) {
              if (!(2 > t)) throw w
              c(-1, w)
            }
          } else c(-1, 'No Transport')
          return v
        },
        getJSON: function(a, b, c) {
          return ea.get(a, b, c, 'json')
        },
        getScript: function(a, b) {
          return ea.get(a, void 0, b, 'script')
        }
      }),
      ea.each(['get', 'post'], function(a, b) {
        ea[b] = function(a, c, d, e) {
          return ea.isFunction(c) && ((e = e || d), (d = c), (c = void 0)), ea.ajax({ url: a, type: b, dataType: e, data: c, success: d })
        }
      }),
      (ea._evalUrl = function(a) {
        return ea.ajax({ url: a, type: 'GET', dataType: 'script', async: !1, global: !1, throws: !0 })
      }),
      ea.fn.extend({
        wrapAll: function(a) {
          if (ea.isFunction(a))
            return this.each(function(b) {
              ea(this).wrapAll(a.call(this, b))
            })
          if (this[0]) {
            var b = ea(a, this[0].ownerDocument)
              .eq(0)
              .clone(!0)
            this[0].parentNode && b.insertBefore(this[0]),
              b
                .map(function() {
                  for (var a = this; a.firstChild && 1 === a.firstChild.nodeType; ) a = a.firstChild
                  return a
                })
                .append(this)
          }
          return this
        },
        wrapInner: function(a) {
          return ea.isFunction(a)
            ? this.each(function(b) {
                ea(this).wrapInner(a.call(this, b))
              })
            : this.each(function() {
                var b = ea(this),
                  c = b.contents()
                c.length ? c.wrapAll(a) : b.append(a)
              })
        },
        wrap: function(a) {
          var b = ea.isFunction(a)
          return this.each(function(c) {
            ea(this).wrapAll(b ? a.call(this, c) : a)
          })
        },
        unwrap: function() {
          return this.parent()
            .each(function() {
              ea.nodeName(this, 'body') || ea(this).replaceWith(this.childNodes)
            })
            .end()
        }
      }),
      (ea.expr.filters.hidden = function(a) {
        return (
          (a.offsetWidth <= 0 && a.offsetHeight <= 0) ||
          (!ca.reliableHiddenOffsets() && 'none' === ((a.style && a.style.display) || ea.css(a, 'display')))
        )
      }),
      (ea.expr.filters.visible = function(a) {
        return !ea.expr.filters.hidden(a)
      })
    var Ub = /%20/g,
      Vb = /\[\]$/,
      Wb = /\r?\n/g,
      Xb = /^(?:submit|button|image|reset|file)$/i,
      Yb = /^(?:input|select|textarea|keygen)/i
    ;(ea.param = function(a, b) {
      var c,
        d = [],
        e = function(a, b) {
          ;(b = ea.isFunction(b) ? b() : null == b ? '' : b), (d[d.length] = encodeURIComponent(a) + '=' + encodeURIComponent(b))
        }
      if ((void 0 === b && (b = ea.ajaxSettings && ea.ajaxSettings.traditional), ea.isArray(a) || (a.jquery && !ea.isPlainObject(a))))
        ea.each(a, function() {
          e(this.name, this.value)
        })
      else for (c in a) S(c, a[c], b, e)
      return d.join('&').replace(Ub, '+')
    }),
      ea.fn.extend({
        serialize: function() {
          return ea.param(this.serializeArray())
        },
        serializeArray: function() {
          return this.map(function() {
            var a = ea.prop(this, 'elements')
            return a ? ea.makeArray(a) : this
          })
            .filter(function() {
              var a = this.type
              return this.name && !ea(this).is(':disabled') && Yb.test(this.nodeName) && !Xb.test(a) && (this.checked || !Ea.test(a))
            })
            .map(function(a, b) {
              var c = ea(this).val()
              return null == c
                ? null
                : ea.isArray(c)
                  ? ea.map(c, function(a) {
                      return { name: b.name, value: a.replace(Wb, '\r\n') }
                    })
                  : { name: b.name, value: c.replace(Wb, '\r\n') }
            })
            .get()
        }
      }),
      (ea.ajaxSettings.xhr =
        void 0 !== a.ActiveXObject
          ? function() {
              return (!this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && T()) || U()
            }
          : T)
    var Zb = 0,
      $b = {},
      _b = ea.ajaxSettings.xhr()
    a.attachEvent &&
      a.attachEvent('onunload', function() {
        for (var a in $b) $b[a](void 0, !0)
      }),
      (ca.cors = !!_b && 'withCredentials' in _b),
      (_b = ca.ajax = !!_b),
      _b &&
        ea.ajaxTransport(function(a) {
          if (!a.crossDomain || ca.cors) {
            var b
            return {
              send: function(c, d) {
                var e,
                  f = a.xhr(),
                  g = ++Zb
                if ((f.open(a.type, a.url, a.async, a.username, a.password), a.xhrFields)) for (e in a.xhrFields) f[e] = a.xhrFields[e]
                a.mimeType && f.overrideMimeType && f.overrideMimeType(a.mimeType),
                  a.crossDomain || c['X-Requested-With'] || (c['X-Requested-With'] = 'XMLHttpRequest')
                for (e in c) void 0 !== c[e] && f.setRequestHeader(e, c[e] + '')
                f.send((a.hasContent && a.data) || null),
                  (b = function(c, e) {
                    var h, i, j
                    if (b && (e || 4 === f.readyState))
                      if ((delete $b[g], (b = void 0), (f.onreadystatechange = ea.noop), e)) 4 !== f.readyState && f.abort()
                      else {
                        ;(j = {}), (h = f.status), 'string' == typeof f.responseText && (j.text = f.responseText)
                        try {
                          i = f.statusText
                        } catch (k) {
                          i = ''
                        }
                        h || !a.isLocal || a.crossDomain ? 1223 === h && (h = 204) : (h = j.text ? 200 : 404)
                      }
                    j && d(h, i, j, f.getAllResponseHeaders())
                  }),
                  a.async ? (4 === f.readyState ? setTimeout(b) : (f.onreadystatechange = $b[g] = b)) : b()
              },
              abort: function() {
                b && b(void 0, !0)
              }
            }
          }
        }),
      ea.ajaxSetup({
        accepts: { script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript' },
        contents: { script: /(?:java|ecma)script/ },
        converters: {
          'text script': function(a) {
            return ea.globalEval(a), a
          }
        }
      }),
      ea.ajaxPrefilter('script', function(a) {
        void 0 === a.cache && (a.cache = !1), a.crossDomain && ((a.type = 'GET'), (a.global = !1))
      }),
      ea.ajaxTransport('script', function(a) {
        if (a.crossDomain) {
          var b,
            c = oa.head || ea('head')[0] || oa.documentElement
          return {
            send: function(d, e) {
              ;(b = oa.createElement('script')),
                (b.async = !0),
                a.scriptCharset && (b.charset = a.scriptCharset),
                (b.src = a.url),
                (b.onload = b.onreadystatechange = function(a, c) {
                  ;(c || !b.readyState || /loaded|complete/.test(b.readyState)) &&
                    ((b.onload = b.onreadystatechange = null),
                    b.parentNode && b.parentNode.removeChild(b),
                    (b = null),
                    c || e(200, 'success'))
                }),
                c.insertBefore(b, c.firstChild)
            },
            abort: function() {
              b && b.onload(void 0, !0)
            }
          }
        }
      })
    var ac = [],
      bc = /(=)\?(?=&|$)|\?\?/
    ea.ajaxSetup({
      jsonp: 'callback',
      jsonpCallback: function() {
        var a = ac.pop() || ea.expando + '_' + Eb++
        return (this[a] = !0), a
      }
    }),
      ea.ajaxPrefilter('json jsonp', function(b, c, d) {
        var e,
          f,
          g,
          h =
            b.jsonp !== !1 &&
            (bc.test(b.url)
              ? 'url'
              : 'string' == typeof b.data &&
                !(b.contentType || '').indexOf('application/x-www-form-urlencoded') &&
                bc.test(b.data) &&
                'data')
        return h || 'jsonp' === b.dataTypes[0]
          ? ((e = b.jsonpCallback = ea.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback),
            h ? (b[h] = b[h].replace(bc, '$1' + e)) : b.jsonp !== !1 && (b.url += (Fb.test(b.url) ? '&' : '?') + b.jsonp + '=' + e),
            (b.converters['script json'] = function() {
              return g || ea.error(e + ' was not called'), g[0]
            }),
            (b.dataTypes[0] = 'json'),
            (f = a[e]),
            (a[e] = function() {
              g = arguments
            }),
            d.always(function() {
              ;(a[e] = f), b[e] && ((b.jsonpCallback = c.jsonpCallback), ac.push(e)), g && ea.isFunction(f) && f(g[0]), (g = f = void 0)
            }),
            'script')
          : void 0
      }),
      (ea.parseHTML = function(a, b, c) {
        if (!a || 'string' != typeof a) return null
        'boolean' == typeof b && ((c = b), (b = !1)), (b = b || oa)
        var d = la.exec(a),
          e = !c && []
        return d
          ? [b.createElement(d[1])]
          : ((d = ea.buildFragment([a], b, e)), e && e.length && ea(e).remove(), ea.merge([], d.childNodes))
      })
    var cc = ea.fn.load
    ;(ea.fn.load = function(a, b, c) {
      if ('string' != typeof a && cc) return cc.apply(this, arguments)
      var d,
        e,
        f,
        g = this,
        h = a.indexOf(' ')
      return (
        h >= 0 && ((d = ea.trim(a.slice(h, a.length))), (a = a.slice(0, h))),
        ea.isFunction(b) ? ((c = b), (b = void 0)) : b && 'object' == typeof b && (f = 'POST'),
        g.length > 0 &&
          ea
            .ajax({ url: a, type: f, dataType: 'html', data: b })
            .done(function(a) {
              ;(e = arguments),
                g.html(
                  d
                    ? ea('<div>')
                        .append(ea.parseHTML(a))
                        .find(d)
                    : a
                )
            })
            .complete(
              c &&
                function(a, b) {
                  g.each(c, e || [a.responseText, b, a])
                }
            ),
        this
      )
    }),
      ea.each(['ajaxStart', 'ajaxStop', 'ajaxComplete', 'ajaxError', 'ajaxSuccess', 'ajaxSend'], function(a, b) {
        ea.fn[b] = function(a) {
          return this.on(b, a)
        }
      }),
      (ea.expr.filters.animated = function(a) {
        return ea.grep(ea.timers, function(b) {
          return a === b.elem
        }).length
      })
    var dc = a.document.documentElement
    ;(ea.offset = {
      setOffset: function(a, b, c) {
        var d,
          e,
          f,
          g,
          h,
          i,
          j,
          k = ea.css(a, 'position'),
          l = ea(a),
          m = {}
        'static' === k && (a.style.position = 'relative'),
          (h = l.offset()),
          (f = ea.css(a, 'top')),
          (i = ea.css(a, 'left')),
          (j = ('absolute' === k || 'fixed' === k) && ea.inArray('auto', [f, i]) > -1),
          j ? ((d = l.position()), (g = d.top), (e = d.left)) : ((g = parseFloat(f) || 0), (e = parseFloat(i) || 0)),
          ea.isFunction(b) && (b = b.call(a, c, h)),
          null != b.top && (m.top = b.top - h.top + g),
          null != b.left && (m.left = b.left - h.left + e),
          'using' in b ? b.using.call(a, m) : l.css(m)
      }
    }),
      ea.fn.extend({
        offset: function(a) {
          if (arguments.length)
            return void 0 === a
              ? this
              : this.each(function(b) {
                  ea.offset.setOffset(this, a, b)
                })
          var b,
            c,
            d = { top: 0, left: 0 },
            e = this[0],
            f = e && e.ownerDocument
          if (f)
            return (
              (b = f.documentElement),
              ea.contains(b, e)
                ? (typeof e.getBoundingClientRect !== xa && (d = e.getBoundingClientRect()),
                  (c = V(f)),
                  {
                    top: d.top + (c.pageYOffset || b.scrollTop) - (b.clientTop || 0),
                    left: d.left + (c.pageXOffset || b.scrollLeft) - (b.clientLeft || 0)
                  })
                : d
            )
        },
        position: function() {
          if (this[0]) {
            var a,
              b,
              c = { top: 0, left: 0 },
              d = this[0]
            return (
              'fixed' === ea.css(d, 'position')
                ? (b = d.getBoundingClientRect())
                : ((a = this.offsetParent()),
                  (b = this.offset()),
                  ea.nodeName(a[0], 'html') || (c = a.offset()),
                  (c.top += ea.css(a[0], 'borderTopWidth', !0)),
                  (c.left += ea.css(a[0], 'borderLeftWidth', !0))),
              { top: b.top - c.top - ea.css(d, 'marginTop', !0), left: b.left - c.left - ea.css(d, 'marginLeft', !0) }
            )
          }
        },
        offsetParent: function() {
          return this.map(function() {
            for (var a = this.offsetParent || dc; a && !ea.nodeName(a, 'html') && 'static' === ea.css(a, 'position'); ) a = a.offsetParent
            return a || dc
          })
        }
      }),
      ea.each({ scrollLeft: 'pageXOffset', scrollTop: 'pageYOffset' }, function(a, b) {
        var c = /Y/.test(b)
        ea.fn[a] = function(d) {
          return Da(
            this,
            function(a, d, e) {
              var f = V(a)
              return void 0 === e
                ? f
                  ? b in f
                    ? f[b]
                    : f.document.documentElement[d]
                  : a[d]
                : void (f ? f.scrollTo(c ? ea(f).scrollLeft() : e, c ? e : ea(f).scrollTop()) : (a[d] = e))
            },
            a,
            d,
            arguments.length,
            null
          )
        }
      }),
      ea.each(['top', 'left'], function(a, b) {
        ea.cssHooks[b] = A(ca.pixelPosition, function(a, c) {
          return c ? ((c = bb(a, b)), db.test(c) ? ea(a).position()[b] + 'px' : c) : void 0
        })
      }),
      ea.each({ Height: 'height', Width: 'width' }, function(a, b) {
        ea.each({ padding: 'inner' + a, content: b, '': 'outer' + a }, function(c, d) {
          ea.fn[d] = function(d, e) {
            var f = arguments.length && (c || 'boolean' != typeof d),
              g = c || (d === !0 || e === !0 ? 'margin' : 'border')
            return Da(
              this,
              function(b, c, d) {
                var e
                return ea.isWindow(b)
                  ? b.document.documentElement['client' + a]
                  : 9 === b.nodeType
                    ? ((e = b.documentElement),
                      Math.max(b.body['scroll' + a], e['scroll' + a], b.body['offset' + a], e['offset' + a], e['client' + a]))
                    : void 0 === d
                      ? ea.css(b, c, g)
                      : ea.style(b, c, d, g)
              },
              b,
              f ? d : void 0,
              f,
              null
            )
          }
        })
      }),
      (ea.fn.size = function() {
        return this.length
      }),
      (ea.fn.andSelf = ea.fn.addBack)
    var ec = a.jQuery,
      fc = a.$
    return (
      (ea.noConflict = function(b) {
        return a.$ === ea && (a.$ = fc), b && a.jQuery === ea && (a.jQuery = ec), ea
      }),
      typeof b === xa && (a.jQuery = a.$ = ea),
      ea
    )
  })
  var Z = function(a) {
      ;(function() {
        'use strict'
        function b(a) {
          return (a = String(a)), a.charAt(0).toUpperCase() + a.slice(1)
        }
        function c(a, b, c) {
          var d = {
            '10.0': '10',
            6.4: '10 Technical Preview',
            6.3: '8.1',
            6.2: '8',
            6.1: 'Server 2008 R2 / 7',
            '6.0': 'Server 2008 / Vista',
            5.2: 'Server 2003 / XP 64-bit',
            5.1: 'XP',
            5.01: '2000 SP1',
            '5.0': '2000',
            '4.0': 'NT',
            '4.90': 'ME'
          }
          return (
            b && c && /^Win/i.test(a) && !/^Windows Phone /i.test(a) && (d = d[/[\d.]+$/.exec(a)]) && (a = 'Windows ' + d),
            (a = String(a)),
            b && c && (a = a.replace(RegExp(b, 'i'), c)),
            (a = e(
              a
                .replace(/ ce$/i, ' CE')
                .replace(/\bhpw/i, 'web')
                .replace(/\bMacintosh\b/, 'Mac OS')
                .replace(/_PowerPC\b/i, ' OS')
                .replace(/\b(OS X) [^ \d]+/i, '$1')
                .replace(/\bMac (OS X)\b/, '$1')
                .replace(/\/(\d)/, ' $1')
                .replace(/_/g, '.')
                .replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, '')
                .replace(/\bx86\.64\b/gi, 'x86_64')
                .replace(/\b(Windows Phone) OS\b/, '$1')
                .replace(/\b(Chrome OS \w+) [\d.]+\b/, '$1')
                .split(' on ')[0]
            ))
          )
        }
        function d(a, b) {
          var c = -1,
            d = a ? a.length : 0
          if ('number' == typeof d && d > -1 && s >= d) for (; ++c < d; ) b(a[c], c, a)
          else f(a, b)
        }
        function e(a) {
          return (a = k(a)), /^(?:webOS|i(?:OS|P))/.test(a) ? a : b(a)
        }
        function f(a, b) {
          for (var c in a) w.call(a, c) && b(a[c], c, a)
        }
        function g(a) {
          return null == a ? b(a) : x.call(a).slice(8, -1)
        }
        function h(a, b) {
          var c = null != a ? typeof a[b] : 'number'
          return !/^(?:boolean|number|string|undefined)$/.test(c) && ('object' == c ? !!a[b] : !0)
        }
        function i(a) {
          return String(a).replace(/([ -])(?!$)/g, '$1?')
        }
        function j(a, b) {
          var c = null
          return (
            d(a, function(d, e) {
              c = b(c, d, e, a)
            }),
            c
          )
        }
        function k(a) {
          return String(a).replace(/^ +| +$/g, '')
        }
        function l(a) {
          function b(b) {
            return j(b, function(b, c) {
              return b || (RegExp('\\b' + (c.pattern || i(c)) + '\\b', 'i').exec(a) && (c.label || c))
            })
          }
          function d(b) {
            return j(b, function(b, c, d) {
              return b || ((c[X] || c[/^[a-z]+(?: +[a-z]+\b)*/i.exec(X)] || RegExp('\\b' + i(d) + '(?:\\b|\\w*\\d)', 'i').exec(a)) && d)
            })
          }
          function m(b) {
            return j(b, function(b, c) {
              return b || (RegExp('\\b' + (c.pattern || i(c)) + '\\b', 'i').exec(a) && (c.label || c))
            })
          }
          function p(b) {
            return j(b, function(b, d) {
              var e = d.pattern || i(d)
              return !b && (b = RegExp('\\b' + e + '(?:/[\\d.]+|[ \\w.]*)', 'i').exec(a)) && (b = c(b, e, d.label || d)), b
            })
          }
          function q(b) {
            return j(b, function(b, c) {
              var d = c.pattern || i(c)
              return (
                !b &&
                  (b =
                    RegExp('\\b' + d + ' *\\d+[.\\w_]*', 'i').exec(a) ||
                    RegExp('\\b' + d + ' *\\w+-[\\w]*', 'i').exec(a) ||
                    RegExp('\\b' + d + '(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)', 'i').exec(a)) &&
                  ((b = String(c.label && !RegExp(d, 'i').test(c.label) ? c.label : b).split('/'))[1] &&
                    !/[\d.]+/.test(b[0]) &&
                    (b[0] += ' ' + b[1]),
                  (c = c.label || c),
                  (b = e(
                    b[0]
                      .replace(RegExp(d, 'i'), c)
                      .replace(RegExp('; *(?:' + c + '[_-])?', 'i'), ' ')
                      .replace(RegExp('(' + c + ')[-_.]?(\\w)', 'i'), '$1 $2')
                  ))),
                b
              )
            })
          }
          function r(b) {
            return j(b, function(b, c) {
              return b || (RegExp(c + '(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)', 'i').exec(a) || 0)[1] || null
            })
          }
          function s() {
            return this.description || ''
          }
          var v = n,
            w = a && 'object' == typeof a && 'String' != g(a)
          w && ((v = a), (a = null))
          var y = v.navigator || {},
            z = y.userAgent || ''
          a || (a = z)
          var A,
            B,
            C = w || u == o,
            D = w ? !!y.likeChrome : /\bChrome\b/.test(a) && !/internal|\n/i.test(x.toString()),
            E = 'Object',
            F = w ? E : 'ScriptBridgingProxyObject',
            G = w ? E : 'Environment',
            H = w && v.java ? 'JavaPackage' : g(v.java),
            I = w ? E : 'RuntimeObject',
            J = /\bJava/.test(H) && v.java,
            K = J && g(v.environment) == G,
            L = J ? 'a' : 'Î±',
            M = J ? 'b' : 'Î²',
            N = v.document || {},
            O = v.operamini || v.opera,
            P = t.test((P = w && O ? O['[[Class]]'] : g(O))) ? P : (O = null),
            Q = a,
            R = [],
            S = null,
            T = a == z,
            U = T && O && 'function' == typeof O.version && O.version(),
            V = b([
              { label: 'EdgeHTML', pattern: 'Edge' },
              'Trident',
              { label: 'WebKit', pattern: 'AppleWebKit' },
              'iCab',
              'Presto',
              'NetFront',
              'Tasman',
              'KHTML',
              'Gecko'
            ]),
            W = m([
              'Adobe AIR',
              'Arora',
              'Avant Browser',
              'Breach',
              'Camino',
              'Electron',
              'Epiphany',
              'Fennec',
              'Flock',
              'Galeon',
              'GreenBrowser',
              'iCab',
              'Iceweasel',
              'K-Meleon',
              'Konqueror',
              'Lunascape',
              'Maxthon',
              { label: 'Microsoft Edge', pattern: 'Edge' },
              'Midori',
              'Nook Browser',
              'PaleMoon',
              'PhantomJS',
              'Raven',
              'Rekonq',
              'RockMelt',
              { label: 'Samsung Internet', pattern: 'SamsungBrowser' },
              'SeaMonkey',
              { label: 'Silk', pattern: '(?:Cloud9|Silk-Accelerated)' },
              'Sleipnir',
              'SlimBrowser',
              { label: 'SRWare Iron', pattern: 'Iron' },
              'Sunrise',
              'Swiftfox',
              'Waterfox',
              'WebPositive',
              'Opera Mini',
              { label: 'Opera Mini', pattern: 'OPiOS' },
              'Opera',
              { label: 'Opera', pattern: 'OPR' },
              'Chrome',
              { label: 'Chrome Mobile', pattern: '(?:CriOS|CrMo)' },
              { label: 'Firefox', pattern: '(?:Firefox|Minefield)' },
              { label: 'Firefox for iOS', pattern: 'FxiOS' },
              { label: 'IE', pattern: 'IEMobile' },
              { label: 'IE', pattern: 'MSIE' },
              'Safari'
            ]),
            X = q([
              { label: 'BlackBerry', pattern: 'BB10' },
              'BlackBerry',
              { label: 'Galaxy S', pattern: 'GT-I9000' },
              { label: 'Galaxy S2', pattern: 'GT-I9100' },
              { label: 'Galaxy S3', pattern: 'GT-I9300' },
              { label: 'Galaxy S4', pattern: 'GT-I9500' },
              { label: 'Galaxy S5', pattern: 'SM-G900' },
              { label: 'Galaxy S6', pattern: 'SM-G920' },
              { label: 'Galaxy S6 Edge', pattern: 'SM-G925' },
              { label: 'Galaxy S7', pattern: 'SM-G930' },
              { label: 'Galaxy S7 Edge', pattern: 'SM-G935' },
              'Google TV',
              'Lumia',
              'iPad',
              'iPod',
              'iPhone',
              'Kindle',
              { label: 'Kindle Fire', pattern: '(?:Cloud9|Silk-Accelerated)' },
              'Nexus',
              'Nook',
              'PlayBook',
              'PlayStation Vita',
              'PlayStation',
              'TouchPad',
              'Transformer',
              { label: 'Wii U', pattern: 'WiiU' },
              'Wii',
              'Xbox One',
              { label: 'Xbox 360', pattern: 'Xbox' },
              'Xoom'
            ]),
            Y = d({
              Apple: { iPad: 1, iPhone: 1, iPod: 1 },
              Archos: {},
              Amazon: { Kindle: 1, 'Kindle Fire': 1 },
              Asus: { Transformer: 1 },
              'Barnes & Noble': { Nook: 1 },
              BlackBerry: { PlayBook: 1 },
              Google: { 'Google TV': 1, Nexus: 1 },
              HP: { TouchPad: 1 },
              HTC: {},
              LG: {},
              Microsoft: { Xbox: 1, 'Xbox One': 1 },
              Motorola: { Xoom: 1 },
              Nintendo: { 'Wii U': 1, Wii: 1 },
              Nokia: { Lumia: 1 },
              Samsung: { 'Galaxy S': 1, 'Galaxy S2': 1, 'Galaxy S3': 1, 'Galaxy S4': 1 },
              Sony: { PlayStation: 1, 'PlayStation Vita': 1 }
            }),
            Z = p([
              'Windows Phone',
              'Android',
              'CentOS',
              { label: 'Chrome OS', pattern: 'CrOS' },
              'Debian',
              'Fedora',
              'FreeBSD',
              'Gentoo',
              'Haiku',
              'Kubuntu',
              'Linux Mint',
              'OpenBSD',
              'Red Hat',
              'SuSE',
              'Ubuntu',
              'Xubuntu',
              'Cygwin',
              'Symbian OS',
              'hpwOS',
              'webOS ',
              'webOS',
              'Tablet OS',
              'Tizen',
              'Linux',
              'Mac OS X',
              'Macintosh',
              'Mac',
              'Windows 98;',
              'Windows '
            ])
          if (
            (V && (V = [V]),
            Y && !X && (X = q([Y])),
            (A = /\bGoogle TV\b/.exec(X)) && (X = A[0]),
            /\bSimulator\b/i.test(a) && (X = (X ? X + ' ' : '') + 'Simulator'),
            'Opera Mini' == W && /\bOPiOS\b/.test(a) && R.push('running in Turbo/Uncompressed mode'),
            'IE' == W && /\blike iPhone OS\b/.test(a)
              ? ((A = l(a.replace(/like iPhone OS/, ''))), (Y = A.manufacturer), (X = A.product))
              : /^iP/.test(X)
                ? (W || (W = 'Safari'), (Z = 'iOS' + ((A = / OS ([\d_]+)/i.exec(a)) ? ' ' + A[1].replace(/_/g, '.') : '')))
                : 'Konqueror' != W || /buntu/i.test(Z)
                  ? (Y && 'Google' != Y && ((/Chrome/.test(W) && !/\bMobile Safari\b/i.test(a)) || /\bVita\b/.test(X))) ||
                    (/\bAndroid\b/.test(Z) && /^Chrome/.test(W) && /\bVersion\//i.test(a))
                    ? ((W = 'Android Browser'), (Z = /\bAndroid\b/.test(Z) ? Z : 'Android'))
                    : 'Silk' == W
                      ? (/\bMobi/i.test(a) || ((Z = 'Android'), R.unshift('desktop mode')),
                        /Accelerated *= *true/i.test(a) && R.unshift('accelerated'))
                      : 'PaleMoon' == W && (A = /\bFirefox\/([\d.]+)\b/.exec(a))
                        ? R.push('identifying as Firefox ' + A[1])
                        : 'Firefox' == W && (A = /\b(Mobile|Tablet|TV)\b/i.exec(a))
                          ? (Z || (Z = 'Firefox OS'), X || (X = A[1]))
                          : !W || (A = !/\bMinefield\b/i.test(a) && /\b(?:Firefox|Safari)\b/.exec(W))
                            ? (W && !X && /[\/,]|^[^(]+?\)/.test(a.slice(a.indexOf(A + '/') + 8)) && (W = null),
                              (A = X || Y || Z) &&
                                (X || Y || /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(Z)) &&
                                (W = /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(Z) ? Z : A) + ' Browser'))
                            : 'Electron' == W && (A = (/\bChrome\/([\d.]+)\b/.exec(a) || 0)[1]) && R.push('Chromium ' + A)
                  : (Z = 'Kubuntu'),
            U ||
              (U = r([
                '(?:Cloud9|CriOS|CrMo|Edge|FxiOS|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|SamsungBrowser|Silk(?!/[\\d.]+$))',
                'Version',
                i(W),
                '(?:Firefox|Minefield|NetFront)'
              ])),
            (A =
              ('iCab' == V && parseFloat(U) > 3 && 'WebKit') ||
              (/\bOpera\b/.test(W) && (/\bOPR\b/.test(a) ? 'Blink' : 'Presto')) ||
              (/\b(?:Midori|Nook|Safari)\b/i.test(a) && !/^(?:Trident|EdgeHTML)$/.test(V) && 'WebKit') ||
              (!V && /\bMSIE\b/i.test(a) && ('Mac OS' == Z ? 'Tasman' : 'Trident')) ||
              ('WebKit' == V && /\bPlayStation\b(?! Vita\b)/i.test(W) && 'NetFront')) && (V = [A]),
            'IE' == W && (A = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(a) || 0)[1])
              ? ((W += ' Mobile'), (Z = 'Windows Phone ' + (/\+$/.test(A) ? A : A + '.x')), R.unshift('desktop mode'))
              : /\bWPDesktop\b/i.test(a)
                ? ((W = 'IE Mobile'), (Z = 'Windows Phone 8.x'), R.unshift('desktop mode'), U || (U = (/\brv:([\d.]+)/.exec(a) || 0)[1]))
                : 'IE' != W &&
                  'Trident' == V &&
                  (A = /\brv:([\d.]+)/.exec(a)) &&
                  (W && R.push('identifying as ' + W + (U ? ' ' + U : '')), (W = 'IE'), (U = A[1])),
            T)
          ) {
            if (h(v, 'global'))
              if (
                (J &&
                  ((A = J.lang.System),
                  (Q = A.getProperty('os.arch')),
                  (Z = Z || A.getProperty('os.name') + ' ' + A.getProperty('os.version'))),
                C && h(v, 'system') && (A = [v.system])[0])
              ) {
                Z || (Z = A[0].os || null)
                try {
                  ;(A[1] = v.require('ringo/engine').version), (U = A[1].join('.')), (W = 'RingoJS')
                } catch ($) {
                  A[0].global.system == v.system && (W = 'Narwhal')
                }
              } else
                'object' == typeof v.process && !v.process.browser && (A = v.process)
                  ? ('object' == typeof A.versions &&
                      ('string' == typeof A.versions.electron
                        ? (R.push('Node ' + A.versions.node), (W = 'Electron'), (U = A.versions.electron))
                        : 'string' == typeof A.versions.nw &&
                          (R.push('Chromium ' + U, 'Node ' + A.versions.node), (W = 'NW.js'), (U = A.versions.nw))),
                    W || ((W = 'Node.js'), (Q = A.arch), (Z = A.platform), (U = /[\d.]+/.exec(A.version)), (U = U ? U[0] : 'unknown')))
                  : K && (W = 'Rhino')
            else
              g((A = v.runtime)) == F
                ? ((W = 'Adobe AIR'), (Z = A.flash.system.Capabilities.os))
                : g((A = v.phantom)) == I
                  ? ((W = 'PhantomJS'), (U = (A = A.version || null) && A.major + '.' + A.minor + '.' + A.patch))
                  : 'number' == typeof N.documentMode && (A = /\bTrident\/(\d+)/i.exec(a))
                    ? ((U = [U, N.documentMode]),
                      (A = +A[1] + 4) != U[1] && (R.push('IE ' + U[1] + ' mode'), V && (V[1] = ''), (U[1] = A)),
                      (U = 'IE' == W ? String(U[1].toFixed(1)) : U[0]))
                    : 'number' == typeof N.documentMode &&
                      /^(?:Chrome|Firefox)\b/.test(W) &&
                      (R.push('masking as ' + W + ' ' + U), (W = 'IE'), (U = '11.0'), (V = ['Trident']), (Z = 'Windows'))
            Z = Z && e(Z)
          }
          if (
            (U &&
              (A =
                /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(U) ||
                /(?:alpha|beta)(?: ?\d)?/i.exec(a + ';' + (T && y.appMinorVersion)) ||
                (/\bMinefield\b/i.test(a) && 'a')) &&
              ((S = /b/i.test(A) ? 'beta' : 'alpha'),
              (U = U.replace(RegExp(A + '\\+?$'), '') + ('beta' == S ? M : L) + (/\d+\+?/.exec(A) || ''))),
            'Fennec' == W || ('Firefox' == W && /\b(?:Android|Firefox OS)\b/.test(Z)))
          )
            W = 'Firefox Mobile'
          else if ('Maxthon' == W && U) U = U.replace(/\.[\d.]+/, '.x')
          else if (/\bXbox\b/i.test(X)) 'Xbox 360' == X && (Z = null), 'Xbox 360' == X && /\bIEMobile\b/.test(a) && R.unshift('mobile mode')
          else if ((!/^(?:Chrome|IE|Opera)$/.test(W) && (!W || X || /Browser|Mobi/.test(W))) || ('Windows CE' != Z && !/Mobi/i.test(a)))
            if ('IE' == W && T)
              try {
                null === v.external && R.unshift('platform preview')
              } catch ($) {
                R.unshift('embedded')
              }
            else
              (/\bBlackBerry\b/.test(X) || /\bBB10\b/.test(a)) &&
              (A = (RegExp(X.replace(/ +/g, ' *') + '/([.\\d]+)', 'i').exec(a) || 0)[1] || U)
                ? ((A = [A, /BB10/.test(a)]), (Z = (A[1] ? ((X = null), (Y = 'BlackBerry')) : 'Device Software') + ' ' + A[0]), (U = null))
                : this != f &&
                  'Wii' != X &&
                  ((T && O) ||
                    (/Opera/.test(W) && /\b(?:MSIE|Firefox)\b/i.test(a)) ||
                    ('Firefox' == W && /\bOS X (?:\d+\.){2,}/.test(Z)) ||
                    ('IE' == W &&
                      ((Z && !/^Win/.test(Z) && U > 5.5) || (/\bWindows XP\b/.test(Z) && U > 8) || (8 == U && !/\bTrident\b/.test(a))))) &&
                  !t.test((A = l.call(f, a.replace(t, '') + ';'))) &&
                  A.name &&
                  ((A = 'ing as ' + A.name + ((A = A.version) ? ' ' + A : '')),
                  t.test(W)
                    ? (/\bIE\b/.test(A) && 'Mac OS' == Z && (Z = null), (A = 'identify' + A))
                    : ((A = 'mask' + A),
                      (W = P ? e(P.replace(/([a-z])([A-Z])/g, '$1 $2')) : 'Opera'),
                      /\bIE\b/.test(A) && (Z = null),
                      T || (U = null)),
                  (V = ['Presto']),
                  R.push(A))
          else W += ' Mobile'
          ;(A = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(a) || 0)[1]) &&
            ((A = [parseFloat(A.replace(/\.(\d)$/, '.0$1')), A]),
            'Safari' == W && '+' == A[1].slice(-1)
              ? ((W = 'WebKit Nightly'), (S = 'alpha'), (U = A[1].slice(0, -1)))
              : (U == A[1] || U == (A[2] = (/\bSafari\/([\d.]+\+?)/i.exec(a) || 0)[1])) && (U = null),
            (A[1] = (/\bChrome\/([\d.]+)/i.exec(a) || 0)[1]),
            537.36 == A[0] && 537.36 == A[2] && parseFloat(A[1]) >= 28 && 'WebKit' == V && (V = ['Blink']),
            T && (D || A[1])
              ? (V && (V[1] = 'like Chrome'),
                (A =
                  A[1] ||
                  ((A = A[0]),
                  530 > A
                    ? 1
                    : 532 > A
                      ? 2
                      : 532.05 > A
                        ? 3
                        : 533 > A
                          ? 4
                          : 534.03 > A
                            ? 5
                            : 534.07 > A
                              ? 6
                              : 534.1 > A
                                ? 7
                                : 534.13 > A
                                  ? 8
                                  : 534.16 > A
                                    ? 9
                                    : 534.24 > A
                                      ? 10
                                      : 534.3 > A
                                        ? 11
                                        : 535.01 > A
                                          ? 12
                                          : 535.02 > A
                                            ? '13+'
                                            : 535.07 > A
                                              ? 15
                                              : 535.11 > A
                                                ? 16
                                                : 535.19 > A
                                                  ? 17
                                                  : 536.05 > A
                                                    ? 18
                                                    : 536.1 > A
                                                      ? 19
                                                      : 537.01 > A
                                                        ? 20
                                                        : 537.11 > A
                                                          ? '21+'
                                                          : 537.13 > A
                                                            ? 23
                                                            : 537.18 > A
                                                              ? 24
                                                              : 537.24 > A
                                                                ? 25
                                                                : 537.36 > A
                                                                  ? 26
                                                                  : 'Blink' != V
                                                                    ? '27'
                                                                    : '28')))
              : (V && (V[1] = 'like Safari'),
                (A = A[0]),
                (A =
                  400 > A
                    ? 1
                    : 500 > A
                      ? 2
                      : 526 > A
                        ? 3
                        : 533 > A
                          ? 4
                          : 534 > A
                            ? '4+'
                            : 535 > A
                              ? 5
                              : 537 > A
                                ? 6
                                : 538 > A
                                  ? 7
                                  : 601 > A
                                    ? 8
                                    : '8')),
            V && (V[1] += ' ' + (A += 'number' == typeof A ? '.x' : /[.+]/.test(A) ? '' : '+')),
            'Safari' == W && (!U || parseInt(U) > 45) && (U = A)),
            'Opera' == W && (A = /\bzbov|zvav$/.exec(Z))
              ? ((W += ' '),
                R.unshift('desktop mode'),
                'zvav' == A ? ((W += 'Mini'), (U = null)) : (W += 'Mobile'),
                (Z = Z.replace(RegExp(' *' + A + '$'), '')))
              : 'Safari' == W &&
                /\bChrome\b/.exec(V && V[1]) &&
                (R.unshift('desktop mode'),
                (W = 'Chrome Mobile'),
                (U = null),
                /\bOS X\b/.test(Z) ? ((Y = 'Apple'), (Z = 'iOS 4.3+')) : (Z = null)),
            U && 0 == U.indexOf((A = /[\d.]+$/.exec(Z))) && a.indexOf('/' + A + '-') > -1 && (Z = k(Z.replace(A, ''))),
            V &&
              !/\b(?:Avant|Nook)\b/.test(W) &&
              (/Browser|Lunascape|Maxthon/.test(W) ||
                ('Safari' != W && /^iOS/.test(Z) && /\bSafari\b/.test(V[1])) ||
                (/^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Samsung Internet|Sleipnir|Web)/.test(W) && V[1])) &&
              (A = V[V.length - 1]) &&
              R.push(A),
            R.length && (R = ['(' + R.join('; ') + ')']),
            Y && X && X.indexOf(Y) < 0 && R.push('on ' + Y),
            X && R.push((/^on /.test(R[R.length - 1]) ? '' : 'on ') + X),
            Z &&
              ((A = / ([\d.+]+)$/.exec(Z)),
              (B = A && '/' == Z.charAt(Z.length - A[0].length - 1)),
              (Z = {
                architecture: 32,
                family: A && !B ? Z.replace(A[0], '') : Z,
                version: A ? A[1] : null,
                toString: function() {
                  var a = this.version
                  return this.family + (a && !B ? ' ' + a : '') + (64 == this.architecture ? ' 64-bit' : '')
                }
              })),
            (A = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(Q)) && !/\bi686\b/i.test(Q)
              ? (Z && ((Z.architecture = 64), (Z.family = Z.family.replace(RegExp(' *' + A), ''))),
                W &&
                  (/\bWOW64\b/i.test(a) || (T && /\w(?:86|32)$/.test(y.cpuClass || y.platform) && !/\bWin64; x64\b/i.test(a))) &&
                  R.unshift('32-bit'))
              : Z && /^OS X/.test(Z.family) && 'Chrome' == W && parseFloat(U) >= 39 && (Z.architecture = 64),
            a || (a = null)
          var _ = {}
          return (
            (_.description = a),
            (_.layout = V && V[0]),
            (_.manufacturer = Y),
            (_.name = W),
            (_.prerelease = S),
            (_.product = X),
            (_.ua = a),
            (_.version = W && U),
            (_.os = Z || {
              architecture: null,
              family: null,
              version: null,
              toString: function() {
                return 'null'
              }
            }),
            (_.parse = l),
            (_.toString = s),
            _.version && R.unshift(U),
            _.name && R.unshift(W),
            Z && W && (Z != String(Z).split(' ')[0] || (Z != W.split(' ')[0] && !X)) && R.push(X ? '(' + Z + ')' : 'on ' + Z),
            R.length && (_.description = R.join(' ')),
            _
          )
        }
        var m = { function: !0, object: !0 },
          n = (m[typeof window] && window) || this,
          o = n,
          p = m[typeof exports] && exports,
          q = m[typeof module] && module && !module.nodeType && module,
          r = p && q && 'object' == typeof global && global
        !r || (r.global !== r && r.window !== r && r.self !== r) || (n = r)
        var s = Math.pow(2, 53) - 1,
          t = /\bOpera/,
          u = this,
          v = Object.prototype,
          w = v.hasOwnProperty,
          x = v.toString,
          y = l()
        'function' == typeof define && 'object' == typeof define.amd && define.amd
          ? (a.Platform = y)
          : p && q
            ? f(y, function(a, b) {
                p[b] = a
              })
            : (a.Platform = y)
      }.call(a))
    },
    $ = function(a) {
      ;(function() {
        'use strict'
        function b(a) {
          return 'function' == typeof a || ('object' == typeof a && null !== a)
        }
        function c(a) {
          return 'function' == typeof a
        }
        function d(a) {
          T = a
        }
        function e(a) {
          X = a
        }
        function f() {
          return function() {
            process.nextTick(k)
          }
        }
        function g() {
          return function() {
            S(k)
          }
        }
        function h() {
          var a = 0,
            b = new $(k),
            c = document.createTextNode('')
          return (
            b.observe(c, { characterData: !0 }),
            function() {
              c.data = a = ++a % 2
            }
          )
        }
        function i() {
          var a = new MessageChannel()
          return (
            (a.port1.onmessage = k),
            function() {
              a.port2.postMessage(0)
            }
          )
        }
        function j() {
          return function() {
            setTimeout(k, 1)
          }
        }
        function k() {
          for (var a = 0; W > a; a += 2) {
            var b = ba[a],
              c = ba[a + 1]
            b(c), (ba[a] = void 0), (ba[a + 1] = void 0)
          }
          W = 0
        }
        function l() {
          try {
            var a = require,
              b = a('vertx')
            return (S = b.runOnLoop || b.runOnContext), g()
          } catch (c) {
            return j()
          }
        }
        function m(a, b) {
          var c = this,
            d = new this.constructor(o)
          void 0 === d[ea] && H(d)
          var e = c._state
          if (e) {
            var f = arguments[e - 1]
            X(function() {
              E(e, d, f, c._result)
            })
          } else A(c, d, a, b)
          return d
        }
        function n(a) {
          var b = this
          if (a && 'object' == typeof a && a.constructor === b) return a
          var c = new b(o)
          return w(c, a), c
        }
        function o() {}
        function p() {
          return new TypeError('You cannot resolve a promise with itself')
        }
        function q() {
          return new TypeError('A promises callback cannot return that same promise.')
        }
        function r(a) {
          try {
            return a.then
          } catch (b) {
            return (ia.error = b), ia
          }
        }
        function s(a, b, c, d) {
          try {
            a.call(b, c, d)
          } catch (e) {
            return e
          }
        }
        function t(a, b, c) {
          X(function(a) {
            var d = !1,
              e = s(
                c,
                b,
                function(c) {
                  d || ((d = !0), b !== c ? w(a, c) : y(a, c))
                },
                function(b) {
                  d || ((d = !0), z(a, b))
                },
                'Settle: ' + (a._label || ' unknown promise')
              )
            !d && e && ((d = !0), z(a, e))
          }, a)
        }
        function u(a, b) {
          b._state === ga
            ? y(a, b._result)
            : b._state === ha
              ? z(a, b._result)
              : A(
                  b,
                  void 0,
                  function(b) {
                    w(a, b)
                  },
                  function(b) {
                    z(a, b)
                  }
                )
        }
        function v(a, b, d) {
          b.constructor === a.constructor && d === ca && constructor.resolve === da
            ? u(a, b)
            : d === ia
              ? z(a, ia.error)
              : void 0 === d
                ? y(a, b)
                : c(d)
                  ? t(a, b, d)
                  : y(a, b)
        }
        function w(a, c) {
          a === c ? z(a, p()) : b(c) ? v(a, c, r(c)) : y(a, c)
        }
        function x(a) {
          a._onerror && a._onerror(a._result), B(a)
        }
        function y(a, b) {
          a._state === fa && ((a._result = b), (a._state = ga), 0 !== a._subscribers.length && X(B, a))
        }
        function z(a, b) {
          a._state === fa && ((a._state = ha), (a._result = b), X(x, a))
        }
        function A(a, b, c, d) {
          var e = a._subscribers,
            f = e.length
          ;(a._onerror = null), (e[f] = b), (e[f + ga] = c), (e[f + ha] = d), 0 === f && a._state && X(B, a)
        }
        function B(a) {
          var b = a._subscribers,
            c = a._state
          if (0 !== b.length) {
            for (var d, e, f = a._result, g = 0; g < b.length; g += 3) (d = b[g]), (e = b[g + c]), d ? E(c, d, e, f) : e(f)
            a._subscribers.length = 0
          }
        }
        function C() {
          this.error = null
        }
        function D(a, b) {
          try {
            return a(b)
          } catch (c) {
            return (ja.error = c), ja
          }
        }
        function E(a, b, d, e) {
          var f,
            g,
            h,
            i,
            j = c(d)
          if (j) {
            if (((f = D(d, e)), f === ja ? ((i = !0), (g = f.error), (f = null)) : (h = !0), b === f)) return void z(b, q())
          } else (f = e), (h = !0)
          b._state !== fa || (j && h ? w(b, f) : i ? z(b, g) : a === ga ? y(b, f) : a === ha && z(b, f))
        }
        function F(a, b) {
          try {
            b(
              function(b) {
                w(a, b)
              },
              function(b) {
                z(a, b)
              }
            )
          } catch (c) {
            z(a, c)
          }
        }
        function G() {
          return ka++
        }
        function H(a) {
          ;(a[ea] = ka++), (a._state = void 0), (a._result = void 0), (a._subscribers = [])
        }
        function I(a) {
          return new pa(this, a).promise
        }
        function J(a) {
          var b = this
          return new b(
            V(a)
              ? function(c, d) {
                  for (var e = a.length, f = 0; e > f; f++) b.resolve(a[f]).then(c, d)
                }
              : function(a, b) {
                  b(new TypeError('You must pass an array to race.'))
                }
          )
        }
        function K(a) {
          var b = this,
            c = new b(o)
          return z(c, a), c
        }
        function L() {
          throw new TypeError('You must pass a resolver function as the first argument to the promise constructor')
        }
        function M() {
          throw new TypeError(
            "Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function."
          )
        }
        function N(a) {
          ;(this[ea] = G()),
            (this._result = this._state = void 0),
            (this._subscribers = []),
            o !== a && ('function' != typeof a && L(), this instanceof N ? F(this, a) : M())
        }
        function O(a, b) {
          ;(this._instanceConstructor = a),
            (this.promise = new a(o)),
            this.promise[ea] || H(this.promise),
            Array.isArray(b)
              ? ((this._input = b),
                (this.length = b.length),
                (this._remaining = b.length),
                (this._result = new Array(this.length)),
                0 === this.length
                  ? y(this.promise, this._result)
                  : ((this.length = this.length || 0), this._enumerate(), 0 === this._remaining && y(this.promise, this._result)))
              : z(this.promise, P())
        }
        function P() {
          return new Error('Array Methods must be provided an Array')
        }
        function Q() {
          var b
          if ('undefined' != typeof global) b = global
          else if ('undefined' != typeof self) b = self
          else
            try {
              b = Function('return this')()
            } catch (c) {
              throw new Error('polyfill failed because global object is unavailable in this environment')
            }
          var d = b.Promise
          ;(!d || '[object Promise]' !== Object.prototype.toString.call(d.resolve()) || d.cast) && (a.Promise = oa)
        }
        var R
        R = Array.isArray
          ? Array.isArray
          : function(a) {
              return '[object Array]' === Object.prototype.toString.call(a)
            }
        var S,
          T,
          U,
          V = R,
          W = 0,
          X = function(a, b) {
            ;(ba[W] = a), (ba[W + 1] = b), (W += 2), 2 === W && (T ? T(k) : U())
          },
          Y = 'undefined' != typeof window ? window : void 0,
          Z = Y || {},
          $ = Z.MutationObserver || Z.WebKitMutationObserver,
          _ = 'undefined' == typeof self && 'undefined' != typeof process && '[object process]' === {}.toString.call(process),
          aa = 'undefined' != typeof Uint8ClampedArray && 'undefined' != typeof importScripts && 'undefined' != typeof MessageChannel,
          ba = new Array(1e3)
        U = _ ? f() : $ ? h() : aa ? i() : void 0 === Y && 'function' == typeof require ? l() : j()
        var ca = m,
          da = n,
          ea = Math.random()
            .toString(36)
            .substring(16),
          fa = void 0,
          ga = 1,
          ha = 2,
          ia = new C(),
          ja = new C(),
          ka = 0,
          la = I,
          ma = J,
          na = K,
          oa = N
        ;(N.all = la),
          (N.race = ma),
          (N.resolve = da),
          (N.reject = na),
          (N._setScheduler = d),
          (N._setAsap = e),
          (N._asap = X),
          (N.prototype = {
            constructor: N,
            then: ca,
            catch: function(a) {
              return this.then(null, a)
            }
          })
        var pa = O
        ;(O.prototype._enumerate = function() {
          for (var a = this.length, b = this._input, c = 0; this._state === fa && a > c; c++) this._eachEntry(b[c], c)
        }),
          (O.prototype._eachEntry = function(a, b) {
            var c = this._instanceConstructor,
              d = c.resolve
            if (d === da) {
              var e = r(a)
              if (e === ca && a._state !== fa) this._settledAt(a._state, b, a._result)
              else if ('function' != typeof e) this._remaining--, (this._result[b] = a)
              else if (c === oa) {
                var f = new c(o)
                v(f, a, e), this._willSettleAt(f, b)
              } else
                this._willSettleAt(
                  new c(function(b) {
                    b(a)
                  }),
                  b
                )
            } else this._willSettleAt(d(a), b)
          }),
          (O.prototype._settledAt = function(a, b, c) {
            var d = this.promise
            d._state === fa && (this._remaining--, a === ha ? z(d, c) : (this._result[b] = c)), 0 === this._remaining && y(d, this._result)
          }),
          (O.prototype._willSettleAt = function(a, b) {
            var c = this
            A(
              a,
              void 0,
              function(a) {
                c._settledAt(ga, b, a)
              },
              function(a) {
                c._settledAt(ha, b, a)
              }
            )
          })
        var qa = Q,
          ra = { Promise: oa, polyfill: qa }
        'undefined' != typeof this && (this.ES6Promise = ra)
      }.call(a))
    },
    _ = function(a) {
      ;(function() {
        Array.isArray ||
          (Array.isArray = function(a) {
            return '[object Array]' === Object.prototype.toString.call(a)
          }),
          'undefined' == typeof Promise ? this.ES6Promise.polyfill.call(a) : (this.Promise = Promise),
          Function.prototype.bind ||
            (Function.prototype.bind = function(a) {
              if ('function' != typeof this) throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable')
              var b = Array.prototype.slice.call(arguments, 1),
                c = this,
                d = function() {},
                e = function() {
                  return c.apply(this instanceof d && a ? this : a, b.concat(Array.prototype.slice.call(arguments)))
                }
              return (d.prototype = this.prototype), (e.prototype = new d()), e
            }),
          Array.prototype.map ||
            (Array.prototype.map = function(a, b) {
              if (void 0 === this || null === this) throw new TypeError('this is null or not defined')
              var c,
                d = Object(this),
                e = d.length >>> 0
              if ('function' != typeof a) throw new TypeError(a + ' is not a function')
              arguments.length > 1 && (c = b)
              for (var f = new Array(e), g = 0; e > g; ) {
                var h, i
                g in d && ((h = d[g]), (i = a.call(c, h, g, d)), (f[g] = i)), g++
              }
              return f
            }),
          Array.prototype.filter ||
            (Array.prototype.filter = function(a) {
              if (void 0 === this || null === this) throw new TypeError('this is null or not defined')
              var b = Object(this),
                c = b.length >>> 0
              if ('function' != typeof a) throw new TypeError(a + ' is not a function')
              for (var d = [], e = arguments.length >= 2 ? arguments[1] : void 0, f = 0; c > f; f++)
                if (f in b) {
                  var g = b[f]
                  a.call(e, g, f, b) && d.push(g)
                }
              return d
            }),
          Array.prototype.forEach ||
            (Array.prototype.forEach = function(a, b) {
              var c, d
              if (null === this || void 0 === this) throw new TypeError(' this is null or not defined')
              var e = Object(this),
                f = e.length >>> 0
              if ('function' != typeof a) throw new TypeError(a + ' is not a function')
              for (arguments.length > 1 && (c = b), d = 0; f > d; ) {
                var g
                d in e && ((g = e[d]), a.call(c, g, d, e)), d++
              }
            })
      }.call(a))
    },
    aa = function(a) {
      ;(function() {
        !(function(a, b) {
          a.sourceMap = b()
        })(this, function() {
          return (function(a) {
            function b(d) {
              if (c[d]) return c[d].exports
              var e = (c[d] = { exports: {}, id: d, loaded: !1 })
              return a[d].call(e.exports, e, e.exports, b), (e.loaded = !0), e.exports
            }
            var c = {}
            return (b.m = a), (b.c = c), (b.p = ''), b(0)
          })([
            function(a, b, c) {
              ;(b.SourceMapGenerator = c(1).SourceMapGenerator),
                (b.SourceMapConsumer = c(7).SourceMapConsumer),
                (b.SourceNode = c(10).SourceNode)
            },
            function(a, b, c) {
              function d(a) {
                a || (a = {}),
                  (this._file = f.getArg(a, 'file', null)),
                  (this._sourceRoot = f.getArg(a, 'sourceRoot', null)),
                  (this._skipValidation = f.getArg(a, 'skipValidation', !1)),
                  (this._sources = new g()),
                  (this._names = new g()),
                  (this._mappings = new h()),
                  (this._sourcesContents = null)
              }
              var e = c(2),
                f = c(4),
                g = c(5).ArraySet,
                h = c(6).MappingList
              ;(d.prototype._version = 3),
                (d.fromSourceMap = function(a) {
                  var b = a.sourceRoot,
                    c = new d({ file: a.file, sourceRoot: b })
                  return (
                    a.eachMapping(function(a) {
                      var d = { generated: { line: a.generatedLine, column: a.generatedColumn } }
                      null != a.source &&
                        ((d.source = a.source),
                        null != b && (d.source = f.relative(b, d.source)),
                        (d.original = { line: a.originalLine, column: a.originalColumn }),
                        null != a.name && (d.name = a.name)),
                        c.addMapping(d)
                    }),
                    a.sources.forEach(function(b) {
                      var d = a.sourceContentFor(b)
                      null != d && c.setSourceContent(b, d)
                    }),
                    c
                  )
                }),
                (d.prototype.addMapping = function(a) {
                  var b = f.getArg(a, 'generated'),
                    c = f.getArg(a, 'original', null),
                    d = f.getArg(a, 'source', null),
                    e = f.getArg(a, 'name', null)
                  this._skipValidation || this._validateMapping(b, c, d, e),
                    null == d || this._sources.has(d) || this._sources.add(d),
                    null == e || this._names.has(e) || this._names.add(e),
                    this._mappings.add({
                      generatedLine: b.line,
                      generatedColumn: b.column,
                      originalLine: null != c && c.line,
                      originalColumn: null != c && c.column,
                      source: d,
                      name: e
                    })
                }),
                (d.prototype.setSourceContent = function(a, b) {
                  var c = a
                  null != this._sourceRoot && (c = f.relative(this._sourceRoot, c)),
                    null != b
                      ? (this._sourcesContents || (this._sourcesContents = {}), (this._sourcesContents[f.toSetString(c)] = b))
                      : this._sourcesContents &&
                        (delete this._sourcesContents[f.toSetString(c)],
                        0 === Object.keys(this._sourcesContents).length && (this._sourcesContents = null))
                }),
                (d.prototype.applySourceMap = function(a, b, c) {
                  var d = b
                  if (null == b) {
                    if (null == a.file)
                      throw new Error(
                        'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map\'s "file" property. Both were omitted.'
                      )
                    d = a.file
                  }
                  var e = this._sourceRoot
                  null != e && (d = f.relative(e, d))
                  var h = new g(),
                    i = new g()
                  this._mappings.unsortedForEach(function(b) {
                    if (b.source === d && null != b.originalLine) {
                      var g = a.originalPositionFor({ line: b.originalLine, column: b.originalColumn })
                      null != g.source &&
                        ((b.source = g.source),
                        null != c && (b.source = f.join(c, b.source)),
                        null != e && (b.source = f.relative(e, b.source)),
                        (b.originalLine = g.line),
                        (b.originalColumn = g.column),
                        null != g.name && (b.name = g.name))
                    }
                    var j = b.source
                    null == j || h.has(j) || h.add(j)
                    var k = b.name
                    null == k || i.has(k) || i.add(k)
                  }, this),
                    (this._sources = h),
                    (this._names = i),
                    a.sources.forEach(function(b) {
                      var d = a.sourceContentFor(b)
                      null != d && (null != c && (b = f.join(c, b)), null != e && (b = f.relative(e, b)), this.setSourceContent(b, d))
                    }, this)
                }),
                (d.prototype._validateMapping = function(a, b, c, d) {
                  if (
                    (!(a && 'line' in a && 'column' in a && a.line > 0 && a.column >= 0) || b || c || d) &&
                    !(
                      a &&
                      'line' in a &&
                      'column' in a &&
                      b &&
                      'line' in b &&
                      'column' in b &&
                      a.line > 0 &&
                      a.column >= 0 &&
                      b.line > 0 &&
                      b.column >= 0 &&
                      c
                    )
                  )
                    throw new Error('Invalid mapping: ' + JSON.stringify({ generated: a, source: c, original: b, name: d }))
                }),
                (d.prototype._serializeMappings = function() {
                  for (
                    var a, b, c, d = 0, g = 1, h = 0, i = 0, j = 0, k = 0, l = '', m = this._mappings.toArray(), n = 0, o = m.length;
                    o > n;
                    n++
                  ) {
                    if (((a = m[n]), a.generatedLine !== g)) for (d = 0; a.generatedLine !== g; ) (l += ';'), g++
                    else if (n > 0) {
                      if (!f.compareByGeneratedPositionsInflated(a, m[n - 1])) continue
                      l += ','
                    }
                    ;(l += e.encode(a.generatedColumn - d)),
                      (d = a.generatedColumn),
                      null != a.source &&
                        ((c = this._sources.indexOf(a.source)),
                        (l += e.encode(c - k)),
                        (k = c),
                        (l += e.encode(a.originalLine - 1 - i)),
                        (i = a.originalLine - 1),
                        (l += e.encode(a.originalColumn - h)),
                        (h = a.originalColumn),
                        null != a.name && ((b = this._names.indexOf(a.name)), (l += e.encode(b - j)), (j = b)))
                  }
                  return l
                }),
                (d.prototype._generateSourcesContent = function(a, b) {
                  return a.map(function(a) {
                    if (!this._sourcesContents) return null
                    null != b && (a = f.relative(b, a))
                    var c = f.toSetString(a)
                    return Object.prototype.hasOwnProperty.call(this._sourcesContents, c) ? this._sourcesContents[c] : null
                  }, this)
                }),
                (d.prototype.toJSON = function() {
                  var a = {
                    version: this._version,
                    sources: this._sources.toArray(),
                    names: this._names.toArray(),
                    mappings: this._serializeMappings()
                  }
                  return (
                    null != this._file && (a.file = this._file),
                    null != this._sourceRoot && (a.sourceRoot = this._sourceRoot),
                    this._sourcesContents && (a.sourcesContent = this._generateSourcesContent(a.sources, a.sourceRoot)),
                    a
                  )
                }),
                (d.prototype.toString = function() {
                  return JSON.stringify(this.toJSON())
                }),
                (b.SourceMapGenerator = d)
            },
            function(a, b, c) {
              function d(a) {
                return 0 > a ? (-a << 1) + 1 : (a << 1) + 0
              }
              function e(a) {
                var b = 1 === (1 & a),
                  c = a >> 1
                return b ? -c : c
              }
              var f = c(3),
                g = 5,
                h = 1 << g,
                i = h - 1,
                j = h
              ;(b.encode = function(a) {
                var b,
                  c = '',
                  e = d(a)
                do (b = e & i), (e >>>= g), e > 0 && (b |= j), (c += f.encode(b))
                while (e > 0)
                return c
              }),
                (b.decode = function(a, b, c) {
                  var d,
                    h,
                    k = a.length,
                    l = 0,
                    m = 0
                  do {
                    if (b >= k) throw new Error('Expected more digits in base 64 VLQ value.')
                    if (((h = f.decode(a.charCodeAt(b++))), -1 === h)) throw new Error('Invalid base64 digit: ' + a.charAt(b - 1))
                    ;(d = !!(h & j)), (h &= i), (l += h << m), (m += g)
                  } while (d)
                  ;(c.value = e(l)), (c.rest = b)
                })
            },
            function(a, b) {
              var c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('')
              ;(b.encode = function(a) {
                if (a >= 0 && a < c.length) return c[a]
                throw new TypeError('Must be between 0 and 63: ' + a)
              }),
                (b.decode = function(a) {
                  var b = 65,
                    c = 90,
                    d = 97,
                    e = 122,
                    f = 48,
                    g = 57,
                    h = 43,
                    i = 47,
                    j = 26,
                    k = 52
                  return a >= b && c >= a
                    ? a - b
                    : a >= d && e >= a
                      ? a - d + j
                      : a >= f && g >= a
                        ? a - f + k
                        : a == h
                          ? 62
                          : a == i
                            ? 63
                            : -1
                })
            },
            function(a, b) {
              function c(a, b, c) {
                if (b in a) return a[b]
                if (3 === arguments.length) return c
                throw new Error('"' + b + '" is a required argument.')
              }
              function d(a) {
                var b = a.match(o)
                return b ? { scheme: b[1], auth: b[2], host: b[3], port: b[4], path: b[5] } : null
              }
              function e(a) {
                var b = ''
                return (
                  a.scheme && (b += a.scheme + ':'),
                  (b += '//'),
                  a.auth && (b += a.auth + '@'),
                  a.host && (b += a.host),
                  a.port && (b += ':' + a.port),
                  a.path && (b += a.path),
                  b
                )
              }
              function f(a) {
                var c = a,
                  f = d(a)
                if (f) {
                  if (!f.path) return a
                  c = f.path
                }
                for (var g, h = b.isAbsolute(c), i = c.split(/\/+/), j = 0, k = i.length - 1; k >= 0; k--)
                  (g = i[k]),
                    '.' === g
                      ? i.splice(k, 1)
                      : '..' === g
                        ? j++
                        : j > 0 && ('' === g ? (i.splice(k + 1, j), (j = 0)) : (i.splice(k, 2), j--))
                return (c = i.join('/')), '' === c && (c = h ? '/' : '.'), f ? ((f.path = c), e(f)) : c
              }
              function g(a, b) {
                '' === a && (a = '.'), '' === b && (b = '.')
                var c = d(b),
                  g = d(a)
                if ((g && (a = g.path || '/'), c && !c.scheme)) return g && (c.scheme = g.scheme), e(c)
                if (c || b.match(p)) return b
                if (g && !g.host && !g.path) return (g.host = b), e(g)
                var h = '/' === b.charAt(0) ? b : f(a.replace(/\/+$/, '') + '/' + b)
                return g ? ((g.path = h), e(g)) : h
              }
              function h(a, b) {
                '' === a && (a = '.'), (a = a.replace(/\/$/, ''))
                for (var c = 0; 0 !== b.indexOf(a + '/'); ) {
                  var d = a.lastIndexOf('/')
                  if (0 > d) return b
                  if (((a = a.slice(0, d)), a.match(/^([^\/]+:\/)?\/*$/))) return b
                  ++c
                }
                return Array(c + 1).join('../') + b.substr(a.length + 1)
              }
              function i(a) {
                return '$' + a
              }
              function j(a) {
                return a.substr(1)
              }
              function k(a, b, c) {
                var d = a.source - b.source
                return 0 !== d
                  ? d
                  : ((d = a.originalLine - b.originalLine),
                    0 !== d
                      ? d
                      : ((d = a.originalColumn - b.originalColumn),
                        0 !== d || c
                          ? d
                          : ((d = a.generatedColumn - b.generatedColumn),
                            0 !== d ? d : ((d = a.generatedLine - b.generatedLine), 0 !== d ? d : a.name - b.name))))
              }
              function l(a, b, c) {
                var d = a.generatedLine - b.generatedLine
                return 0 !== d
                  ? d
                  : ((d = a.generatedColumn - b.generatedColumn),
                    0 !== d || c
                      ? d
                      : ((d = a.source - b.source),
                        0 !== d
                          ? d
                          : ((d = a.originalLine - b.originalLine),
                            0 !== d ? d : ((d = a.originalColumn - b.originalColumn), 0 !== d ? d : a.name - b.name))))
              }
              function m(a, b) {
                return a === b ? 0 : a > b ? 1 : -1
              }
              function n(a, b) {
                var c = a.generatedLine - b.generatedLine
                return 0 !== c
                  ? c
                  : ((c = a.generatedColumn - b.generatedColumn),
                    0 !== c
                      ? c
                      : ((c = m(a.source, b.source)),
                        0 !== c
                          ? c
                          : ((c = a.originalLine - b.originalLine),
                            0 !== c ? c : ((c = a.originalColumn - b.originalColumn), 0 !== c ? c : m(a.name, b.name)))))
              }
              b.getArg = c
              var o = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/,
                p = /^data:.+\,.+$/
              ;(b.urlParse = d),
                (b.urlGenerate = e),
                (b.normalize = f),
                (b.join = g),
                (b.isAbsolute = function(a) {
                  return '/' === a.charAt(0) || !!a.match(o)
                }),
                (b.relative = h),
                (b.toSetString = i),
                (b.fromSetString = j),
                (b.compareByOriginalPositions = k),
                (b.compareByGeneratedPositionsDeflated = l),
                (b.compareByGeneratedPositionsInflated = n)
            },
            function(a, b, c) {
              function d() {
                ;(this._array = []), (this._set = {})
              }
              var e = c(4)
              ;(d.fromArray = function(a, b) {
                for (var c = new d(), e = 0, f = a.length; f > e; e++) c.add(a[e], b)
                return c
              }),
                (d.prototype.size = function() {
                  return Object.getOwnPropertyNames(this._set).length
                }),
                (d.prototype.add = function(a, b) {
                  var c = e.toSetString(a),
                    d = this._set.hasOwnProperty(c),
                    f = this._array.length
                  ;(!d || b) && this._array.push(a), d || (this._set[c] = f)
                }),
                (d.prototype.has = function(a) {
                  var b = e.toSetString(a)
                  return this._set.hasOwnProperty(b)
                }),
                (d.prototype.indexOf = function(a) {
                  var b = e.toSetString(a)
                  if (this._set.hasOwnProperty(b)) return this._set[b]
                  throw new Error('"' + a + '" is not in the set.')
                }),
                (d.prototype.at = function(a) {
                  if (a >= 0 && a < this._array.length) return this._array[a]
                  throw new Error('No element indexed by ' + a)
                }),
                (d.prototype.toArray = function() {
                  return this._array.slice()
                }),
                (b.ArraySet = d)
            },
            function(a, b, c) {
              function d(a, b) {
                var c = a.generatedLine,
                  d = b.generatedLine,
                  e = a.generatedColumn,
                  g = b.generatedColumn
                return d > c || (d == c && g >= e) || f.compareByGeneratedPositionsInflated(a, b) <= 0
              }
              function e() {
                ;(this._array = []), (this._sorted = !0), (this._last = { generatedLine: -1, generatedColumn: 0 })
              }
              var f = c(4)
              ;(e.prototype.unsortedForEach = function(a, b) {
                this._array.forEach(a, b)
              }),
                (e.prototype.add = function(a) {
                  d(this._last, a) ? ((this._last = a), this._array.push(a)) : ((this._sorted = !1), this._array.push(a))
                }),
                (e.prototype.toArray = function() {
                  return this._sorted || (this._array.sort(f.compareByGeneratedPositionsInflated), (this._sorted = !0)), this._array
                }),
                (b.MappingList = e)
            },
            function(a, b, c) {
              function d(a) {
                var b = a
                return 'string' == typeof a && (b = JSON.parse(a.replace(/^\)\]\}'/, ''))), null != b.sections ? new g(b) : new e(b)
              }
              function e(a) {
                var b = a
                'string' == typeof a && (b = JSON.parse(a.replace(/^\)\]\}'/, '')))
                var c = h.getArg(b, 'version'),
                  d = h.getArg(b, 'sources'),
                  e = h.getArg(b, 'names', []),
                  f = h.getArg(b, 'sourceRoot', null),
                  g = h.getArg(b, 'sourcesContent', null),
                  i = h.getArg(b, 'mappings'),
                  k = h.getArg(b, 'file', null)
                if (c != this._version) throw new Error('Unsupported version: ' + c)
                ;(d = d.map(h.normalize).map(function(a) {
                  return f && h.isAbsolute(f) && h.isAbsolute(a) ? h.relative(f, a) : a
                })),
                  (this._names = j.fromArray(e, !0)),
                  (this._sources = j.fromArray(d, !0)),
                  (this.sourceRoot = f),
                  (this.sourcesContent = g),
                  (this._mappings = i),
                  (this.file = k)
              }
              function f() {
                ;(this.generatedLine = 0),
                  (this.generatedColumn = 0),
                  (this.source = null),
                  (this.originalLine = null),
                  (this.originalColumn = null),
                  (this.name = null)
              }
              function g(a) {
                var b = a
                'string' == typeof a && (b = JSON.parse(a.replace(/^\)\]\}'/, '')))
                var c = h.getArg(b, 'version'),
                  e = h.getArg(b, 'sections')
                if (c != this._version) throw new Error('Unsupported version: ' + c)
                ;(this._sources = new j()), (this._names = new j())
                var f = { line: -1, column: 0 }
                this._sections = e.map(function(a) {
                  if (a.url) throw new Error('Support for url field in sections not implemented.')
                  var b = h.getArg(a, 'offset'),
                    c = h.getArg(b, 'line'),
                    e = h.getArg(b, 'column')
                  if (c < f.line || (c === f.line && e < f.column)) throw new Error('Section offsets must be ordered and non-overlapping.')
                  return (f = b), { generatedOffset: { generatedLine: c + 1, generatedColumn: e + 1 }, consumer: new d(h.getArg(a, 'map')) }
                })
              }
              var h = c(4),
                i = c(8),
                j = c(5).ArraySet,
                k = c(2),
                l = c(9).quickSort
              ;(d.fromSourceMap = function(a) {
                return e.fromSourceMap(a)
              }),
                (d.prototype._version = 3),
                (d.prototype.__generatedMappings = null),
                Object.defineProperty(d.prototype, '_generatedMappings', {
                  get: function() {
                    return this.__generatedMappings || this._parseMappings(this._mappings, this.sourceRoot), this.__generatedMappings
                  }
                }),
                (d.prototype.__originalMappings = null),
                Object.defineProperty(d.prototype, '_originalMappings', {
                  get: function() {
                    return this.__originalMappings || this._parseMappings(this._mappings, this.sourceRoot), this.__originalMappings
                  }
                }),
                (d.prototype._charIsMappingSeparator = function(a, b) {
                  var c = a.charAt(b)
                  return ';' === c || ',' === c
                }),
                (d.prototype._parseMappings = function(a, b) {
                  throw new Error('Subclasses must implement _parseMappings')
                }),
                (d.GENERATED_ORDER = 1),
                (d.ORIGINAL_ORDER = 2),
                (d.GREATEST_LOWER_BOUND = 1),
                (d.LEAST_UPPER_BOUND = 2),
                (d.prototype.eachMapping = function(a, b, c) {
                  var e,
                    f = b || null,
                    g = c || d.GENERATED_ORDER
                  switch (g) {
                    case d.GENERATED_ORDER:
                      e = this._generatedMappings
                      break
                    case d.ORIGINAL_ORDER:
                      e = this._originalMappings
                      break
                    default:
                      throw new Error('Unknown order of iteration.')
                  }
                  var i = this.sourceRoot
                  e.map(function(a) {
                    var b = null === a.source ? null : this._sources.at(a.source)
                    return (
                      null != b && null != i && (b = h.join(i, b)),
                      {
                        source: b,
                        generatedLine: a.generatedLine,
                        generatedColumn: a.generatedColumn,
                        originalLine: a.originalLine,
                        originalColumn: a.originalColumn,
                        name: null === a.name ? null : this._names.at(a.name)
                      }
                    )
                  }, this).forEach(a, f)
                }),
                (d.prototype.allGeneratedPositionsFor = function(a) {
                  var b = h.getArg(a, 'line'),
                    c = { source: h.getArg(a, 'source'), originalLine: b, originalColumn: h.getArg(a, 'column', 0) }
                  if ((null != this.sourceRoot && (c.source = h.relative(this.sourceRoot, c.source)), !this._sources.has(c.source)))
                    return []
                  c.source = this._sources.indexOf(c.source)
                  var d = [],
                    e = this._findMapping(
                      c,
                      this._originalMappings,
                      'originalLine',
                      'originalColumn',
                      h.compareByOriginalPositions,
                      i.LEAST_UPPER_BOUND
                    )
                  if (e >= 0) {
                    var f = this._originalMappings[e]
                    if (void 0 === a.column)
                      for (var g = f.originalLine; f && f.originalLine === g; )
                        d.push({
                          line: h.getArg(f, 'generatedLine', null),
                          column: h.getArg(f, 'generatedColumn', null),
                          lastColumn: h.getArg(f, 'lastGeneratedColumn', null)
                        }),
                          (f = this._originalMappings[++e])
                    else
                      for (var j = f.originalColumn; f && f.originalLine === b && f.originalColumn == j; )
                        d.push({
                          line: h.getArg(f, 'generatedLine', null),
                          column: h.getArg(f, 'generatedColumn', null),
                          lastColumn: h.getArg(f, 'lastGeneratedColumn', null)
                        }),
                          (f = this._originalMappings[++e])
                  }
                  return d
                }),
                (b.SourceMapConsumer = d),
                (e.prototype = Object.create(d.prototype)),
                (e.prototype.consumer = d),
                (e.fromSourceMap = function(a) {
                  var b = Object.create(e.prototype),
                    c = (b._names = j.fromArray(a._names.toArray(), !0)),
                    d = (b._sources = j.fromArray(a._sources.toArray(), !0))
                  ;(b.sourceRoot = a._sourceRoot),
                    (b.sourcesContent = a._generateSourcesContent(b._sources.toArray(), b.sourceRoot)),
                    (b.file = a._file)
                  for (
                    var g = a._mappings.toArray().slice(),
                      i = (b.__generatedMappings = []),
                      k = (b.__originalMappings = []),
                      m = 0,
                      n = g.length;
                    n > m;
                    m++
                  ) {
                    var o = g[m],
                      p = new f()
                    ;(p.generatedLine = o.generatedLine),
                      (p.generatedColumn = o.generatedColumn),
                      o.source &&
                        ((p.source = d.indexOf(o.source)),
                        (p.originalLine = o.originalLine),
                        (p.originalColumn = o.originalColumn),
                        o.name && (p.name = c.indexOf(o.name)),
                        k.push(p)),
                      i.push(p)
                  }
                  return l(b.__originalMappings, h.compareByOriginalPositions), b
                }),
                (e.prototype._version = 3),
                Object.defineProperty(e.prototype, 'sources', {
                  get: function() {
                    return this._sources.toArray().map(function(a) {
                      return null != this.sourceRoot ? h.join(this.sourceRoot, a) : a
                    }, this)
                  }
                }),
                (e.prototype._parseMappings = function(a, b) {
                  for (
                    var c, d, e, g, i, j = 1, m = 0, n = 0, o = 0, p = 0, q = 0, r = a.length, s = 0, t = {}, u = {}, v = [], w = [];
                    r > s;

                  )
                    if (';' === a.charAt(s)) j++, s++, (m = 0)
                    else if (',' === a.charAt(s)) s++
                    else {
                      for (c = new f(), c.generatedLine = j, g = s; r > g && !this._charIsMappingSeparator(a, g); g++);
                      if (((d = a.slice(s, g)), (e = t[d]))) s += d.length
                      else {
                        for (e = []; g > s; ) k.decode(a, s, u), (i = u.value), (s = u.rest), e.push(i)
                        if (2 === e.length) throw new Error('Found a source, but no line and column')
                        if (3 === e.length) throw new Error('Found a source and line, but no column')
                        t[d] = e
                      }
                      ;(c.generatedColumn = m + e[0]),
                        (m = c.generatedColumn),
                        e.length > 1 &&
                          ((c.source = p + e[1]),
                          (p += e[1]),
                          (c.originalLine = n + e[2]),
                          (n = c.originalLine),
                          (c.originalLine += 1),
                          (c.originalColumn = o + e[3]),
                          (o = c.originalColumn),
                          e.length > 4 && ((c.name = q + e[4]), (q += e[4]))),
                        w.push(c),
                        'number' == typeof c.originalLine && v.push(c)
                    }
                  l(w, h.compareByGeneratedPositionsDeflated),
                    (this.__generatedMappings = w),
                    l(v, h.compareByOriginalPositions),
                    (this.__originalMappings = v)
                }),
                (e.prototype._findMapping = function(a, b, c, d, e, f) {
                  if (a[c] <= 0) throw new TypeError('Line must be greater than or equal to 1, got ' + a[c])
                  if (a[d] < 0) throw new TypeError('Column must be greater than or equal to 0, got ' + a[d])
                  return i.search(a, b, e, f)
                }),
                (e.prototype.computeColumnSpans = function() {
                  for (var a = 0; a < this._generatedMappings.length; ++a) {
                    var b = this._generatedMappings[a]
                    if (a + 1 < this._generatedMappings.length) {
                      var c = this._generatedMappings[a + 1]
                      if (b.generatedLine === c.generatedLine) {
                        b.lastGeneratedColumn = c.generatedColumn - 1
                        continue
                      }
                    }
                    b.lastGeneratedColumn = 1 / 0
                  }
                }),
                (e.prototype.originalPositionFor = function(a) {
                  var b = { generatedLine: h.getArg(a, 'line'), generatedColumn: h.getArg(a, 'column') },
                    c = this._findMapping(
                      b,
                      this._generatedMappings,
                      'generatedLine',
                      'generatedColumn',
                      h.compareByGeneratedPositionsDeflated,
                      h.getArg(a, 'bias', d.GREATEST_LOWER_BOUND)
                    )
                  if (c >= 0) {
                    var e = this._generatedMappings[c]
                    if (e.generatedLine === b.generatedLine) {
                      var f = h.getArg(e, 'source', null)
                      null !== f && ((f = this._sources.at(f)), null != this.sourceRoot && (f = h.join(this.sourceRoot, f)))
                      var g = h.getArg(e, 'name', null)
                      return (
                        null !== g && (g = this._names.at(g)),
                        { source: f, line: h.getArg(e, 'originalLine', null), column: h.getArg(e, 'originalColumn', null), name: g }
                      )
                    }
                  }
                  return { source: null, line: null, column: null, name: null }
                }),
                (e.prototype.hasContentsOfAllSources = function() {
                  return this.sourcesContent
                    ? this.sourcesContent.length >= this._sources.size() &&
                        !this.sourcesContent.some(function(a) {
                          return null == a
                        })
                    : !1
                }),
                (e.prototype.sourceContentFor = function(a, b) {
                  if (!this.sourcesContent) return null
                  if ((null != this.sourceRoot && (a = h.relative(this.sourceRoot, a)), this._sources.has(a)))
                    return this.sourcesContent[this._sources.indexOf(a)]
                  var c
                  if (null != this.sourceRoot && (c = h.urlParse(this.sourceRoot))) {
                    var d = a.replace(/^file:\/\//, '')
                    if ('file' == c.scheme && this._sources.has(d)) return this.sourcesContent[this._sources.indexOf(d)]
                    if ((!c.path || '/' == c.path) && this._sources.has('/' + a)) return this.sourcesContent[this._sources.indexOf('/' + a)]
                  }
                  if (b) return null
                  throw new Error('"' + a + '" is not in the SourceMap.')
                }),
                (e.prototype.generatedPositionFor = function(a) {
                  var b = h.getArg(a, 'source')
                  if ((null != this.sourceRoot && (b = h.relative(this.sourceRoot, b)), !this._sources.has(b)))
                    return { line: null, column: null, lastColumn: null }
                  b = this._sources.indexOf(b)
                  var c = { source: b, originalLine: h.getArg(a, 'line'), originalColumn: h.getArg(a, 'column') },
                    e = this._findMapping(
                      c,
                      this._originalMappings,
                      'originalLine',
                      'originalColumn',
                      h.compareByOriginalPositions,
                      h.getArg(a, 'bias', d.GREATEST_LOWER_BOUND)
                    )
                  if (e >= 0) {
                    var f = this._originalMappings[e]
                    if (f.source === c.source)
                      return {
                        line: h.getArg(f, 'generatedLine', null),
                        column: h.getArg(f, 'generatedColumn', null),
                        lastColumn: h.getArg(f, 'lastGeneratedColumn', null)
                      }
                  }
                  return { line: null, column: null, lastColumn: null }
                }),
                (b.BasicSourceMapConsumer = e),
                (g.prototype = Object.create(d.prototype)),
                (g.prototype.constructor = d),
                (g.prototype._version = 3),
                Object.defineProperty(g.prototype, 'sources', {
                  get: function() {
                    for (var a = [], b = 0; b < this._sections.length; b++)
                      for (var c = 0; c < this._sections[b].consumer.sources.length; c++) a.push(this._sections[b].consumer.sources[c])
                    return a
                  }
                }),
                (g.prototype.originalPositionFor = function(a) {
                  var b = { generatedLine: h.getArg(a, 'line'), generatedColumn: h.getArg(a, 'column') },
                    c = i.search(b, this._sections, function(a, b) {
                      var c = a.generatedLine - b.generatedOffset.generatedLine
                      return c ? c : a.generatedColumn - b.generatedOffset.generatedColumn
                    }),
                    d = this._sections[c]
                  return d
                    ? d.consumer.originalPositionFor({
                        line: b.generatedLine - (d.generatedOffset.generatedLine - 1),
                        column:
                          b.generatedColumn -
                          (d.generatedOffset.generatedLine === b.generatedLine ? d.generatedOffset.generatedColumn - 1 : 0),
                        bias: a.bias
                      })
                    : { source: null, line: null, column: null, name: null }
                }),
                (g.prototype.hasContentsOfAllSources = function() {
                  return this._sections.every(function(a) {
                    return a.consumer.hasContentsOfAllSources()
                  })
                }),
                (g.prototype.sourceContentFor = function(a, b) {
                  for (var c = 0; c < this._sections.length; c++) {
                    var d = this._sections[c],
                      e = d.consumer.sourceContentFor(a, !0)
                    if (e) return e
                  }
                  if (b) return null
                  throw new Error('"' + a + '" is not in the SourceMap.')
                }),
                (g.prototype.generatedPositionFor = function(a) {
                  for (var b = 0; b < this._sections.length; b++) {
                    var c = this._sections[b]
                    if (-1 !== c.consumer.sources.indexOf(h.getArg(a, 'source'))) {
                      var d = c.consumer.generatedPositionFor(a)
                      if (d) {
                        var e = {
                          line: d.line + (c.generatedOffset.generatedLine - 1),
                          column: d.column + (c.generatedOffset.generatedLine === d.line ? c.generatedOffset.generatedColumn - 1 : 0)
                        }
                        return e
                      }
                    }
                  }
                  return { line: null, column: null }
                }),
                (g.prototype._parseMappings = function(a, b) {
                  ;(this.__generatedMappings = []), (this.__originalMappings = [])
                  for (var c = 0; c < this._sections.length; c++)
                    for (var d = this._sections[c], e = d.consumer._generatedMappings, f = 0; f < e.length; f++) {
                      var g = e[f],
                        i = d.consumer._sources.at(g.source)
                      null !== d.consumer.sourceRoot && (i = h.join(d.consumer.sourceRoot, i)),
                        this._sources.add(i),
                        (i = this._sources.indexOf(i))
                      var j = d.consumer._names.at(g.name)
                      this._names.add(j), (j = this._names.indexOf(j))
                      var k = {
                        source: i,
                        generatedLine: g.generatedLine + (d.generatedOffset.generatedLine - 1),
                        generatedColumn:
                          g.generatedColumn +
                          (d.generatedOffset.generatedLine === g.generatedLine ? d.generatedOffset.generatedColumn - 1 : 0),
                        originalLine: g.originalLine,
                        originalColumn: g.originalColumn,
                        name: j
                      }
                      this.__generatedMappings.push(k), 'number' == typeof k.originalLine && this.__originalMappings.push(k)
                    }
                  l(this.__generatedMappings, h.compareByGeneratedPositionsDeflated),
                    l(this.__originalMappings, h.compareByOriginalPositions)
                }),
                (b.IndexedSourceMapConsumer = g)
            },
            function(a, b) {
              function c(a, d, e, f, g, h) {
                var i = Math.floor((d - a) / 2) + a,
                  j = g(e, f[i], !0)
                return 0 === j
                  ? i
                  : j > 0
                    ? d - i > 1
                      ? c(i, d, e, f, g, h)
                      : h == b.LEAST_UPPER_BOUND
                        ? d < f.length
                          ? d
                          : -1
                        : i
                    : i - a > 1
                      ? c(a, i, e, f, g, h)
                      : h == b.LEAST_UPPER_BOUND
                        ? i
                        : 0 > a
                          ? -1
                          : a
              }
              ;(b.GREATEST_LOWER_BOUND = 1),
                (b.LEAST_UPPER_BOUND = 2),
                (b.search = function(a, d, e, f) {
                  if (0 === d.length) return -1
                  var g = c(-1, d.length, a, d, e, f || b.GREATEST_LOWER_BOUND)
                  if (0 > g) return -1
                  for (; g - 1 >= 0 && 0 === e(d[g], d[g - 1], !0); ) --g
                  return g
                })
            },
            function(a, b) {
              function c(a, b, c) {
                var d = a[b]
                ;(a[b] = a[c]), (a[c] = d)
              }
              function d(a, b) {
                return Math.round(a + Math.random() * (b - a))
              }
              function e(a, b, f, g) {
                if (g > f) {
                  var h = d(f, g),
                    i = f - 1
                  c(a, h, g)
                  for (var j = a[g], k = f; g > k; k++) b(a[k], j) <= 0 && ((i += 1), c(a, i, k))
                  c(a, i + 1, k)
                  var l = i + 1
                  e(a, b, f, l - 1), e(a, b, l + 1, g)
                }
              }
              b.quickSort = function(a, b) {
                e(a, b, 0, a.length - 1)
              }
            },
            function(a, b, c) {
              function d(a, b, c, d, e) {
                ;(this.children = []),
                  (this.sourceContents = {}),
                  (this.line = null == a ? null : a),
                  (this.column = null == b ? null : b),
                  (this.source = null == c ? null : c),
                  (this.name = null == e ? null : e),
                  (this[i] = !0),
                  null != d && this.add(d)
              }
              var e = c(1).SourceMapGenerator,
                f = c(4),
                g = /(\r?\n)/,
                h = 10,
                i = '$$$isSourceNode$$$'
              ;(d.fromStringWithSourceMap = function(a, b, c) {
                function e(a, b) {
                  if (null === a || void 0 === a.source) h.add(b)
                  else {
                    var e = c ? f.join(c, a.source) : a.source
                    h.add(new d(a.originalLine, a.originalColumn, e, b, a.name))
                  }
                }
                var h = new d(),
                  i = a.split(g),
                  j = function() {
                    var a = i.shift(),
                      b = i.shift() || ''
                    return a + b
                  },
                  k = 1,
                  l = 0,
                  m = null
                return (
                  b.eachMapping(function(a) {
                    if (null !== m) {
                      if (!(k < a.generatedLine)) {
                        var b = i[0],
                          c = b.substr(0, a.generatedColumn - l)
                        return (i[0] = b.substr(a.generatedColumn - l)), (l = a.generatedColumn), e(m, c), void (m = a)
                      }
                      e(m, j()), k++, (l = 0)
                    }
                    for (; k < a.generatedLine; ) h.add(j()), k++
                    if (l < a.generatedColumn) {
                      var b = i[0]
                      h.add(b.substr(0, a.generatedColumn)), (i[0] = b.substr(a.generatedColumn)), (l = a.generatedColumn)
                    }
                    m = a
                  }, this),
                  i.length > 0 && (m && e(m, j()), h.add(i.join(''))),
                  b.sources.forEach(function(a) {
                    var d = b.sourceContentFor(a)
                    null != d && (null != c && (a = f.join(c, a)), h.setSourceContent(a, d))
                  }),
                  h
                )
              }),
                (d.prototype.add = function(a) {
                  if (Array.isArray(a))
                    a.forEach(function(a) {
                      this.add(a)
                    }, this)
                  else {
                    if (!a[i] && 'string' != typeof a)
                      throw new TypeError('Expected a SourceNode, string, or an array of SourceNodes and strings. Got ' + a)
                    a && this.children.push(a)
                  }
                  return this
                }),
                (d.prototype.prepend = function(a) {
                  if (Array.isArray(a)) for (var b = a.length - 1; b >= 0; b--) this.prepend(a[b])
                  else {
                    if (!a[i] && 'string' != typeof a)
                      throw new TypeError('Expected a SourceNode, string, or an array of SourceNodes and strings. Got ' + a)
                    this.children.unshift(a)
                  }
                  return this
                }),
                (d.prototype.walk = function(a) {
                  for (var b, c = 0, d = this.children.length; d > c; c++)
                    (b = this.children[c]),
                      b[i] ? b.walk(a) : '' !== b && a(b, { source: this.source, line: this.line, column: this.column, name: this.name })
                }),
                (d.prototype.join = function(a) {
                  var b,
                    c,
                    d = this.children.length
                  if (d > 0) {
                    for (b = [], c = 0; d - 1 > c; c++) b.push(this.children[c]), b.push(a)
                    b.push(this.children[c]), (this.children = b)
                  }
                  return this
                }),
                (d.prototype.replaceRight = function(a, b) {
                  var c = this.children[this.children.length - 1]
                  return (
                    c[i]
                      ? c.replaceRight(a, b)
                      : 'string' == typeof c
                        ? (this.children[this.children.length - 1] = c.replace(a, b))
                        : this.children.push(''.replace(a, b)),
                    this
                  )
                }),
                (d.prototype.setSourceContent = function(a, b) {
                  this.sourceContents[f.toSetString(a)] = b
                }),
                (d.prototype.walkSourceContents = function(a) {
                  for (var b = 0, c = this.children.length; c > b; b++) this.children[b][i] && this.children[b].walkSourceContents(a)
                  for (var d = Object.keys(this.sourceContents), b = 0, c = d.length; c > b; b++)
                    a(f.fromSetString(d[b]), this.sourceContents[d[b]])
                }),
                (d.prototype.toString = function() {
                  var a = ''
                  return (
                    this.walk(function(b) {
                      a += b
                    }),
                    a
                  )
                }),
                (d.prototype.toStringWithSourceMap = function(a) {
                  var b = { code: '', line: 1, column: 0 },
                    c = new e(a),
                    d = !1,
                    f = null,
                    g = null,
                    i = null,
                    j = null
                  return (
                    this.walk(function(a, e) {
                      ;(b.code += a),
                        null !== e.source && null !== e.line && null !== e.column
                          ? ((f !== e.source || g !== e.line || i !== e.column || j !== e.name) &&
                              c.addMapping({
                                source: e.source,
                                original: { line: e.line, column: e.column },
                                generated: { line: b.line, column: b.column },
                                name: e.name
                              }),
                            (f = e.source),
                            (g = e.line),
                            (i = e.column),
                            (j = e.name),
                            (d = !0))
                          : d && (c.addMapping({ generated: { line: b.line, column: b.column } }), (f = null), (d = !1))
                      for (var k = 0, l = a.length; l > k; k++)
                        a.charCodeAt(k) === h
                          ? (b.line++,
                            (b.column = 0),
                            k + 1 === l
                              ? ((f = null), (d = !1))
                              : d &&
                                c.addMapping({
                                  source: e.source,
                                  original: { line: e.line, column: e.column },
                                  generated: { line: b.line, column: b.column },
                                  name: e.name
                                }))
                          : b.column++
                    }),
                    this.walkSourceContents(function(a, b) {
                      c.setSourceContent(a, b)
                    }),
                    { code: b.code, map: c }
                  )
                }),
                (b.SourceNode = d)
            }
          ])
        })
      }.call(a))
    },
    ba = function(a) {
      ;(function() {
        !(function(a, b) {
          'use strict'
          a.ErrorStackParser = b(a.StackFrame)
        })(this, function(a) {
          'use strict'
          function b(a, b, c) {
            if ('function' == typeof Array.prototype.map) return a.map(b, c)
            for (var d = new Array(a.length), e = 0; e < a.length; e++) d[e] = b.call(c, a[e])
            return d
          }
          function c(a, b, c) {
            if ('function' == typeof Array.prototype.filter) return a.filter(b, c)
            for (var d = [], e = 0; e < a.length; e++) b.call(c, a[e]) && d.push(a[e])
            return d
          }
          var d = /(^|@)\S+\:\d+/,
            e = /^\s*at .*(\S+\:\d+|\(native\))/m,
            f = /^(eval@)?(\[native code\])?$/
          return {
            parse: function(a) {
              if ('undefined' != typeof a.stacktrace || 'undefined' != typeof a['opera#sourceloc']) return this.parseOpera(a)
              if (a.stack && a.stack.match(e)) return this.parseV8OrIE(a)
              if (a.stack) return this.parseFFOrSafari(a)
              throw new Error('Cannot parse given Error object')
            },
            extractLocation: function(a) {
              if (-1 === a.indexOf(':')) return [a]
              var b = a.replace(/[\(\)\s]/g, '').split(':'),
                c = b.pop(),
                d = b[b.length - 1]
              if (!isNaN(parseFloat(d)) && isFinite(d)) {
                var e = b.pop()
                return [b.join(':'), e, c]
              }
              return [b.join(':'), c, void 0]
            },
            parseV8OrIE: function(d) {
              var f = c(
                d.stack.split('\n'),
                function(a) {
                  return !!a.match(e)
                },
                this
              )
              return b(
                f,
                function(b) {
                  b.indexOf('(eval ') > -1 && (b = b.replace(/eval code/g, 'eval').replace(/(\(eval at [^\()]*)|(\)\,.*$)/g, ''))
                  var c = b
                      .replace(/^\s+/, '')
                      .replace(/\(eval code/g, '(')
                      .split(/\s+/)
                      .slice(1),
                    d = this.extractLocation(c.pop()),
                    e = c.join(' ') || void 0,
                    f = 'eval' === d[0] ? void 0 : d[0]
                  return new a(e, void 0, f, d[1], d[2], b)
                },
                this
              )
            },
            parseFFOrSafari: function(d) {
              var e = c(
                d.stack.split('\n'),
                function(a) {
                  return !a.match(f)
                },
                this
              )
              return b(
                e,
                function(b) {
                  if (
                    (b.indexOf(' > eval') > -1 && (b = b.replace(/ line (\d+)(?: > eval line \d+)* > eval\:\d+\:\d+/g, ':$1')),
                    -1 === b.indexOf('@') && -1 === b.indexOf(':'))
                  )
                    return new a(b)
                  var c = b.split('@'),
                    d = this.extractLocation(c.pop()),
                    e = c.join('@') || void 0
                  return new a(e, void 0, d[0], d[1], d[2], b)
                },
                this
              )
            },
            parseOpera: function(a) {
              return !a.stacktrace || (a.message.indexOf('\n') > -1 && a.message.split('\n').length > a.stacktrace.split('\n').length)
                ? this.parseOpera9(a)
                : a.stack
                  ? this.parseOpera11(a)
                  : this.parseOpera10(a)
            },
            parseOpera9: function(b) {
              for (var c = /Line (\d+).*script (?:in )?(\S+)/i, d = b.message.split('\n'), e = [], f = 2, g = d.length; g > f; f += 2) {
                var h = c.exec(d[f])
                h && e.push(new a(void 0, void 0, h[2], h[1], void 0, d[f]))
              }
              return e
            },
            parseOpera10: function(b) {
              for (
                var c = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i,
                  d = b.stacktrace.split('\n'),
                  e = [],
                  f = 0,
                  g = d.length;
                g > f;
                f += 2
              ) {
                var h = c.exec(d[f])
                h && e.push(new a(h[3] || void 0, void 0, h[2], h[1], void 0, d[f]))
              }
              return e
            },
            parseOpera11: function(e) {
              var f = c(
                e.stack.split('\n'),
                function(a) {
                  return !!a.match(d) && !a.match(/^Error created at/)
                },
                this
              )
              return b(
                f,
                function(b) {
                  var c,
                    d = b.split('@'),
                    e = this.extractLocation(d.pop()),
                    f = d.shift() || '',
                    g = f.replace(/<anonymous function(: (\w+))?>/, '$2').replace(/\([^\)]*\)/g, '') || void 0
                  f.match(/\(([^\)]*)\)/) && (c = f.replace(/^[^\(]+\(([^\)]*)\)$/, '$1'))
                  var h = void 0 === c || '[arguments not available]' === c ? void 0 : c.split(',')
                  return new a(g, h, e[0], e[1], e[2], b)
                },
                this
              )
            }
          }
        })
      }.call(a))
    },
    ca = function(a) {
      ;(function() {
        !(function(a, b) {
          'use strict'
          a.StackFrame = b()
        })(this, function() {
          'use strict'
          function a(a) {
            return !isNaN(parseFloat(a)) && isFinite(a)
          }
          function b(a) {
            return a[0].toUpperCase() + a.substring(1)
          }
          function c(a) {
            return function() {
              return this[a]
            }
          }
          function d(a, c, d, e, f, g) {
            if (a instanceof Object)
              for (var h = a, j = 0; j < i.length; j++) h.hasOwnProperty(i[j]) && void 0 !== h[i[j]] && this['set' + b(i[j])](h[i[j]])
            else
              this.setFunctionName(a),
                this.setArgs(c || []),
                this.setFileName(d),
                this.setLineNumber(e),
                this.setColumnNumber(f),
                this.setSource(g)
          }
          var e = ['isConstructor', 'isEval', 'isNative', 'isToplevel'],
            f = ['columnNumber', 'lineNumber'],
            g = ['fileName', 'functionName', 'source'],
            h = ['args'],
            i = e.concat(f, g, h)
          d.prototype = {
            getArgs: function() {
              return this.args
            },
            setArgs: function(a) {
              if ('[object Array]' !== Object.prototype.toString.call(a)) throw new TypeError('Args must be an Array')
              this.args = a
            },
            getEvalOrigin: function() {
              return this.evalOrigin
            },
            setEvalOrigin: function(a) {
              if (a instanceof d) this.evalOrigin = a
              else {
                if (!(a instanceof Object)) throw new TypeError('Eval Origin must be an Object or StackFrame')
                this.evalOrigin = new d(a)
              }
            },
            toString: function() {
              var b = this.getFunctionName() || '{anonymous}',
                c = '(' + (this.getArgs() || []).join(',') + ')',
                d = this.getFileName() ? '@' + this.getFileName() : '',
                e = a(this.getLineNumber()) ? ':' + this.getLineNumber() : '',
                f = a(this.getColumnNumber()) ? ':' + this.getColumnNumber() : ''
              return b + c + d + e + f
            }
          }
          for (var j = 0; j < e.length; j++)
            (d.prototype['get' + b(e[j])] = c(e[j])),
              (d.prototype['set' + b(e[j])] = (function(a) {
                return function(b) {
                  this[a] = Boolean(b)
                }
              })(e[j]))
          for (var k = 0; k < f.length; k++)
            (d.prototype['get' + b(f[k])] = c(f[k])),
              (d.prototype['set' + b(f[k])] = (function(b) {
                return function(c) {
                  if (!a(c)) throw new TypeError(b + ' must be a Number')
                  this[b] = Number(c)
                }
              })(f[k]))
          for (var l = 0; l < g.length; l++)
            (d.prototype['get' + b(g[l])] = c(g[l])),
              (d.prototype['set' + b(g[l])] = (function(a) {
                return function(b) {
                  this[a] = String(b)
                }
              })(g[l]))
          return d
        })
      }.call(a))
    },
    da = function(a) {
      ;(function() {
        !(function(a, b) {
          'use strict'
          a.StackTraceGPS = b(a.SourceMap || a.sourceMap, a.StackFrame)
        })(this, function(b, c) {
          'use strict'
          function d(b) {
            return new a.Promise(function(a, c) {
              var d = new XMLHttpRequest()
              d.open('get', b),
                (d.onerror = c),
                (d.onreadystatechange = function() {
                  4 === d.readyState &&
                    (d.status >= 200 && d.status < 300 ? a(d.responseText) : c(new Error('HTTP status: ' + d.status + ' retrieving ' + b)))
                }),
                d.send()
            })
          }
          function e(a) {
            if ('undefined' != typeof window && window.atob) return window.atob(a)
            throw new Error('You must supply a polyfill for window.atob in this environment')
          }
          function f(a) {
            if ('undefined' != typeof JSON && JSON.parse) return JSON.parse(a)
            throw new Error('You must supply a polyfill for JSON.parse in this environment')
          }
          function g(a, b) {
            for (
              var c,
                d = /function\s+([^(]*?)\s*\(([^)]*)\)/,
                e = /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*function\b/,
                f = /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*(?:eval|new Function)\b/,
                g = a.split('\n'),
                h = '',
                i = Math.min(b, 20),
                j = 0;
              i > j;
              ++j
            ) {
              var k = g[b - j - 1],
                l = k.indexOf('//')
              if ((l >= 0 && (k = k.substr(0, l)), k)) {
                if (((h = k + h), (c = e.exec(h)), c && c[1])) return c[1]
                if (((c = d.exec(h)), c && c[1])) return c[1]
                if (((c = f.exec(h)), c && c[1])) return c[1]
              }
            }
            return void 0
          }
          function h() {
            if ('function' != typeof Object.defineProperty || 'function' != typeof Object.create)
              throw new Error('Unable to consume source maps in older browsers')
          }
          function i(a) {
            if ('object' != typeof a) throw new TypeError('Given StackFrame is not an object')
            if ('string' != typeof a.fileName) throw new TypeError('Given file name is not a String')
            if ('number' != typeof a.lineNumber || a.lineNumber % 1 !== 0 || a.lineNumber < 1)
              throw new TypeError('Given line number must be a positive integer')
            if ('number' != typeof a.columnNumber || a.columnNumber % 1 !== 0 || a.columnNumber < 0)
              throw new TypeError('Given column number must be a non-negative integer')
            return !0
          }
          function j(a) {
            var b = /\/\/[#@] ?sourceMappingURL=([^\s'"]+)\s*$/.exec(a)
            if (b && b[1]) return b[1]
            throw new Error('sourceMappingURL not found')
          }
          function k(a, d, e, f, g) {
            var h = new b.SourceMapConsumer(a),
              i = h.originalPositionFor({ line: e, column: f }),
              j = h.sourceContentFor(i.source)
            return j && (g[i.source] = j), new c(i.name, d, i.source, i.line, i.column)
          }
          return function l(b) {
            return this instanceof l
              ? ((b = b || {}),
                (this.sourceCache = b.sourceCache || {}),
                (this.ajax = b.ajax || d),
                (this._atob = b.atob || e),
                (this._get = function(c) {
                  return new a.Promise(
                    function(a, d) {
                      var e = 'data:' === c.substr(0, 5)
                      if (this.sourceCache[c]) a(this.sourceCache[c])
                      else if (b.offline && !e) d(new Error('Cannot make network requests in offline mode'))
                      else if (e) {
                        var f = /^data:application\/json;([\w=:"-]+;)*base64,/,
                          g = c.match(f)
                        if (g) {
                          var h = g[0].length,
                            i = c.substr(h),
                            j = this._atob(i)
                          ;(this.sourceCache[c] = j), a(j)
                        } else d(new Error('The encoding of the inline sourcemap is not supported'))
                      } else {
                        var k = this.ajax(c, { method: 'get' })
                        ;(this.sourceCache[c] = k), k.then(a, d)
                      }
                    }.bind(this)
                  )
                }),
                (this.pinpoint = function(b) {
                  return new a.Promise(
                    function(a, c) {
                      this.getMappedLocation(b).then(
                        function(b) {
                          function c() {
                            a(b)
                          }
                          this.findFunctionName(b)
                            .then(a, c)
                            ['catch'](c)
                        }.bind(this),
                        c
                      )
                    }.bind(this)
                  )
                }),
                (this.findFunctionName = function(b) {
                  return new a.Promise(
                    function(a, d) {
                      i(b),
                        this._get(b.fileName)
                          .then(function(d) {
                            var e = g(d, b.lineNumber, b.columnNumber)
                            a(new c(e, b.args, b.fileName, b.lineNumber, b.columnNumber))
                          }, d)
                          ['catch'](d)
                    }.bind(this)
                  )
                }),
                void (this.getMappedLocation = function(b) {
                  return new a.Promise(
                    function(a, c) {
                      h(), i(b)
                      var d = this.sourceCache,
                        e = b.fileName
                      this._get(e)
                        .then(
                          function(g) {
                            var h = j(g),
                              i = 'data:' === h.substr(0, 5),
                              l = e.substring(0, e.lastIndexOf('/') + 1)
                            '/' === h[0] || i || /^https?:\/\/|^\/\//i.test(h) || (h = l + h),
                              this._get(h)
                                .then(function(c) {
                                  var e = b.lineNumber,
                                    g = b.columnNumber
                                  'string' == typeof c && (c = f(c.replace(/^\)\]\}'/, ''))),
                                    'undefined' == typeof c.sourceRoot && (c.sourceRoot = l),
                                    a(k(c, b.args, e, g, d))
                                }, c)
                                ['catch'](c)
                          }.bind(this),
                          c
                        )
                        ['catch'](c)
                    }.bind(this)
                  )
                }))
              : new l(b)
          }
        })
      }.call(a))
    },
    ea = function(a) {
      ;(function() {
        !(function(a, b) {
          'use strict'
          a.StackTrace = b(a.ErrorStackParser, a.StackGenerator, a.StackTraceGPS)
        })(this, function(b, c, d) {
          function e(a, b) {
            var c = {}
            return (
              [a, b].forEach(function(a) {
                for (var b in a) a.hasOwnProperty(b) && (c[b] = a[b])
                return c
              }),
              c
            )
          }
          var f = {
            filter: function(a) {
              return (
                -1 === (a.functionName || '').indexOf('StackTrace$$') &&
                -1 === (a.functionName || '').indexOf('ErrorStackParser$$') &&
                -1 === (a.functionName || '').indexOf('StackTraceGPS$$') &&
                -1 === (a.functionName || '').indexOf('StackGenerator$$')
              )
            }
          }
          return {
            fromError: function(c, g) {
              g = e(f, g)
              return new a.Promise(
                function(e) {
                  var f = b.parse(c)
                  'function' == typeof g.filter && (f = f.filter(g.filter)),
                    e(
                      a.Promise.all(
                        f.map(function(b) {
                          return new a.Promise(function(a) {
                            function c() {
                              a(b)
                            }
                            new d(g)
                              .pinpoint(b)
                              .then(a, c)
                              ['catch'](c)
                          })
                        })
                      )
                    )
                }.bind(this)
              )
            }
          }
        })
      }.call(a))
    },
    fa = function(a) {
      function b(a) {
        return '"' + a.replace(/"/, '\\"') + '"'
      }
      function c(a) {
        if ('string' != typeof a) throw Error('Invalid request opion. attribute must be a non-zero length string.')
        if (((a = a.trim()), !a)) throw Error('Invalid request opion. attribute must be a non-zero length string.')
        if (!a.match(s)) throw Error('Invalid request option. invalid attribute name: ' + a)
        return a
      }
      function d(a) {
        if (!a.trim().length) throw Error('Invalid request option: elementAttributes must contain at least one attribute.')
        for (var b = {}, d = {}, e = a.split(/\s+/), f = 0; f < e.length; f++) {
          var g = e[f]
          if (g) {
            var g = c(g),
              h = g.toLowerCase()
            if (b[h]) throw Error('Invalid request option: observing multiple case variations of the same attribute is not supported.')
            ;(d[g] = !0), (b[h] = !0)
          }
        }
        return Object.keys(d)
      }
      function e(a) {
        var b = {}
        return (
          a.forEach(function(a) {
            a.qualifiers.forEach(function(a) {
              b[a.attrName] = !0
            })
          }),
          Object.keys(b)
        )
      }
      var f,
        g =
          this.__extends ||
          function(a, b) {
            function c() {
              this.constructor = a
            }
            for (var d in b) b.hasOwnProperty(d) && (a[d] = b[d])
            ;(c.prototype = b.prototype), (a.prototype = new c())
          }
      if (((f = 'undefined' != typeof WebKitMutationObserver ? WebKitMutationObserver : MutationObserver), void 0 === f))
        throw (console.error('DOM Mutation Observers are required.'),
        console.error('https://developer.mozilla.org/en-US/docs/DOM/MutationObserver'),
        Error('DOM Mutation Observers are required'))
      var h,
        i = (function() {
          function a() {
            ;(this.nodes = []), (this.values = [])
          }
          return (
            (a.prototype.isIndex = function(a) {
              return +a === a >>> 0
            }),
            (a.prototype.nodeId = function(b) {
              var c = b[a.ID_PROP]
              return c || (c = b[a.ID_PROP] = a.nextId_++), c
            }),
            (a.prototype.set = function(a, b) {
              var c = this.nodeId(a)
              ;(this.nodes[c] = a), (this.values[c] = b)
            }),
            (a.prototype.get = function(a) {
              var b = this.nodeId(a)
              return this.values[b]
            }),
            (a.prototype.has = function(a) {
              return this.nodeId(a) in this.nodes
            }),
            (a.prototype['delete'] = function(a) {
              var b = this.nodeId(a)
              delete this.nodes[b], (this.values[b] = void 0)
            }),
            (a.prototype.keys = function() {
              var a = []
              for (var b in this.nodes) this.isIndex(b) && a.push(this.nodes[b])
              return a
            }),
            (a.ID_PROP = '__mutation_summary_node_map_id__'),
            (a.nextId_ = 1),
            a
          )
        })()
      !(function(a) {
        ;(a[(a.STAYED_OUT = 0)] = 'STAYED_OUT'),
          (a[(a.ENTERED = 1)] = 'ENTERED'),
          (a[(a.STAYED_IN = 2)] = 'STAYED_IN'),
          (a[(a.REPARENTED = 3)] = 'REPARENTED'),
          (a[(a.REORDERED = 4)] = 'REORDERED'),
          (a[(a.EXITED = 5)] = 'EXITED')
      })(h || (h = {}))
      var j = (function() {
          function a(a, b, c, d, e, f, g, h) {
            void 0 === b && (b = !1),
              void 0 === c && (c = !1),
              void 0 === d && (d = !1),
              void 0 === e && (e = null),
              void 0 === f && (f = !1),
              void 0 === g && (g = null),
              void 0 === h && (h = null),
              (this.node = a),
              (this.childList = b),
              (this.attributes = c),
              (this.characterData = d),
              (this.oldParentNode = e),
              (this.added = f),
              (this.attributeOldValues = g),
              (this.characterDataOldValue = h),
              (this.isCaseInsensitive =
                this.node.nodeType === ka.NODE_TYPE.ELEMENT_NODE &&
                this.node instanceof HTMLElement &&
                this.node.ownerDocument instanceof HTMLDocument)
          }
          return (
            (a.prototype.getAttributeOldValue = function(a) {
              return this.attributeOldValues ? (this.isCaseInsensitive && (a = a.toLowerCase()), this.attributeOldValues[a]) : void 0
            }),
            (a.prototype.getAttributeNamesMutated = function() {
              var a = []
              if (!this.attributeOldValues) return a
              for (var b in this.attributeOldValues) a.push(b)
              return a
            }),
            (a.prototype.attributeMutated = function(a, b) {
              ;(this.attributes = !0),
                (this.attributeOldValues = this.attributeOldValues || {}),
                a in this.attributeOldValues || (this.attributeOldValues[a] = b)
            }),
            (a.prototype.characterDataMutated = function(a) {
              this.characterData || ((this.characterData = !0), (this.characterDataOldValue = a))
            }),
            (a.prototype.removedFromParent = function(a) {
              ;(this.childList = !0), this.added || this.oldParentNode ? (this.added = !1) : (this.oldParentNode = a)
            }),
            (a.prototype.insertedIntoParent = function() {
              ;(this.childList = !0), (this.added = !0)
            }),
            (a.prototype.getOldParent = function() {
              if (this.childList) {
                if (this.oldParentNode) return this.oldParentNode
                if (this.added) return null
              }
              return this.node.parentNode
            }),
            a
          )
        })(),
        k = (function() {
          function a() {
            ;(this.added = new i()),
              (this.removed = new i()),
              (this.maybeMoved = new i()),
              (this.oldPrevious = new i()),
              (this.moved = void 0)
          }
          return a
        })(),
        l = (function(a) {
          function b(b, c) {
            a.call(this),
              (this.rootNode = b),
              (this.reachableCache = void 0),
              (this.wasReachableCache = void 0),
              (this.anyParentsChanged = !1),
              (this.anyAttributesChanged = !1),
              (this.anyCharacterDataChanged = !1)
            for (var d = 0; d < c.length; d++) {
              var e = c[d]
              switch (e.type) {
                case 'childList':
                  this.anyParentsChanged = !0
                  for (var f = 0; f < e.removedNodes.length; f++) {
                    var g = e.removedNodes[f]
                    this.getChange(g).removedFromParent(e.target)
                  }
                  for (var f = 0; f < e.addedNodes.length; f++) {
                    var g = e.addedNodes[f]
                    this.getChange(g).insertedIntoParent()
                  }
                  break
                case 'attributes':
                  this.anyAttributesChanged = !0
                  var h = this.getChange(e.target)
                  h.attributeMutated(e.attributeName, e.oldValue)
                  break
                case 'characterData':
                  this.anyCharacterDataChanged = !0
                  var h = this.getChange(e.target)
                  h.characterDataMutated(e.oldValue)
              }
            }
          }
          return (
            g(b, a),
            (b.prototype.getChange = function(a) {
              var b = this.get(a)
              return b || ((b = new j(a)), this.set(a, b)), b
            }),
            (b.prototype.getOldParent = function(a) {
              var b = this.get(a)
              return b ? b.getOldParent() : a.parentNode
            }),
            (b.prototype.getIsReachable = function(a) {
              if (a === this.rootNode) return !0
              if (!a) return !1
              this.reachableCache = this.reachableCache || new i()
              var b = this.reachableCache.get(a)
              return void 0 === b && ((b = this.getIsReachable(a.parentNode)), this.reachableCache.set(a, b)), b
            }),
            (b.prototype.getWasReachable = function(a) {
              if (a === this.rootNode) return !0
              if (!a) return !1
              this.wasReachableCache = this.wasReachableCache || new i()
              var b = this.wasReachableCache.get(a)
              return void 0 === b && ((b = this.getWasReachable(this.getOldParent(a))), this.wasReachableCache.set(a, b)), b
            }),
            (b.prototype.reachabilityChange = function(a) {
              return this.getIsReachable(a)
                ? this.getWasReachable(a)
                  ? h.STAYED_IN
                  : h.ENTERED
                : this.getWasReachable(a)
                  ? h.EXITED
                  : h.STAYED_OUT
            }),
            b
          )
        })(i),
        m = (function() {
          function a(a, b, c, d, e) {
            ;(this.rootNode = a),
              (this.mutations = b),
              (this.selectors = c),
              (this.calcReordered = d),
              (this.calcOldPreviousSibling = e),
              (this.treeChanges = new l(a, b)),
              (this.entered = []),
              (this.exited = []),
              (this.stayedIn = new i()),
              (this.visited = new i()),
              (this.childListChangeMap = void 0),
              (this.characterDataOnly = void 0),
              (this.matchCache = void 0),
              this.processMutations()
          }
          return (
            (a.prototype.processMutations = function() {
              if (this.treeChanges.anyParentsChanged || this.treeChanges.anyAttributesChanged)
                for (var a = this.treeChanges.keys(), b = 0; b < a.length; b++) this.visitNode(a[b], void 0)
            }),
            (a.prototype.visitNode = function(a, b) {
              if (!this.visited.has(a)) {
                this.visited.set(a, !0)
                var c = this.treeChanges.get(a),
                  d = b
                if ((((c && c.childList) || void 0 == d) && (d = this.treeChanges.reachabilityChange(a)), d !== h.STAYED_OUT)) {
                  if ((this.matchabilityChange(a), d === h.ENTERED)) this.entered.push(a)
                  else if (d === h.EXITED) this.exited.push(a), this.ensureHasOldPreviousSiblingIfNeeded(a)
                  else if (d === h.STAYED_IN) {
                    var e = h.STAYED_IN
                    c &&
                      c.childList &&
                      (c.oldParentNode !== a.parentNode
                        ? ((e = h.REPARENTED), this.ensureHasOldPreviousSiblingIfNeeded(a))
                        : this.calcReordered && this.wasReordered(a) && (e = h.REORDERED)),
                      this.stayedIn.set(a, e)
                  }
                  if (d !== h.STAYED_IN) for (var f = a.firstChild; f; f = f.nextSibling) this.visitNode(f, d)
                }
              }
            }),
            (a.prototype.ensureHasOldPreviousSiblingIfNeeded = function(a) {
              if (this.calcOldPreviousSibling) {
                this.processChildlistChanges()
                var b = a.parentNode,
                  c = this.treeChanges.get(a)
                c && c.oldParentNode && (b = c.oldParentNode)
                var d = this.childListChangeMap.get(b)
                d || ((d = new k()), this.childListChangeMap.set(b, d)), d.oldPrevious.has(a) || d.oldPrevious.set(a, a.previousSibling)
              }
            }),
            (a.prototype.getChanged = function(a, b, c) {
              ;(this.selectors = b), (this.characterDataOnly = c)
              for (var d = 0; d < this.entered.length; d++) {
                var e = this.entered[d],
                  f = this.matchabilityChange(e)
                ;(f === h.ENTERED || f === h.STAYED_IN) && a.added.push(e)
              }
              for (var g = this.stayedIn.keys(), d = 0; d < g.length; d++) {
                var e = g[d],
                  f = this.matchabilityChange(e)
                if (f === h.ENTERED) a.added.push(e)
                else if (f === h.EXITED) a.removed.push(e)
                else if (f === h.STAYED_IN && (a.reparented || a.reordered)) {
                  var i = this.stayedIn.get(e)
                  a.reparented && i === h.REPARENTED ? a.reparented.push(e) : a.reordered && i === h.REORDERED && a.reordered.push(e)
                }
              }
              for (var d = 0; d < this.exited.length; d++) {
                var e = this.exited[d],
                  f = this.matchabilityChange(e)
                ;(f === h.EXITED || f === h.STAYED_IN) && a.removed.push(e)
              }
            }),
            (a.prototype.getOldParentNode = function(a) {
              var b = this.treeChanges.get(a)
              if (b && b.childList) return b.oldParentNode ? b.oldParentNode : null
              var c = this.treeChanges.reachabilityChange(a)
              if (c === h.STAYED_OUT || c === h.ENTERED) throw Error('getOldParentNode requested on invalid node.')
              return a.parentNode
            }),
            (a.prototype.getOldPreviousSibling = function(a) {
              var b = a.parentNode,
                c = this.treeChanges.get(a)
              c && c.oldParentNode && (b = c.oldParentNode)
              var d = this.childListChangeMap.get(b)
              if (!d) throw Error('getOldPreviousSibling requested on invalid node.')
              return d.oldPrevious.get(a)
            }),
            (a.prototype.getOldAttribute = function(a, b) {
              var c = this.treeChanges.get(a)
              if (!c || !c.attributes) throw Error('getOldAttribute requested on invalid node.')
              var d = c.getAttributeOldValue(b)
              if (void 0 === d) throw Error('getOldAttribute requested for unchanged attribute name.')
              return d
            }),
            (a.prototype.attributeChangedNodes = function(a) {
              if (!this.treeChanges.anyAttributesChanged) return {}
              var b, c
              if (a) {
                ;(b = {}), (c = {})
                for (var d = 0; d < a.length; d++) {
                  var e = a[d]
                  ;(b[e] = !0), (c[e.toLowerCase()] = e)
                }
              }
              for (var f = {}, g = this.treeChanges.keys(), d = 0; d < g.length; d++) {
                var i = g[d],
                  j = this.treeChanges.get(i)
                if (j.attributes && h.STAYED_IN === this.treeChanges.reachabilityChange(i) && h.STAYED_IN === this.matchabilityChange(i))
                  for (var k = i, l = j.getAttributeNamesMutated(), m = 0; m < l.length; m++) {
                    var e = l[m]
                    if (!b || b[e] || (j.isCaseInsensitive && c[e])) {
                      var n = j.getAttributeOldValue(e)
                      n !== k.getAttribute(e) && (c && j.isCaseInsensitive && (e = c[e]), (f[e] = f[e] || []), f[e].push(k))
                    }
                  }
              }
              return f
            }),
            (a.prototype.getOldCharacterData = function(a) {
              var b = this.treeChanges.get(a)
              if (!b || !b.characterData) throw Error('getOldCharacterData requested on invalid node.')
              return b.characterDataOldValue
            }),
            (a.prototype.getCharacterDataChanged = function() {
              if (!this.treeChanges.anyCharacterDataChanged) return []
              for (var a = this.treeChanges.keys(), b = [], c = 0; c < a.length; c++) {
                var d = a[c]
                if (h.STAYED_IN === this.treeChanges.reachabilityChange(d)) {
                  var e = this.treeChanges.get(d)
                  e.characterData && d.textContent != e.characterDataOldValue && b.push(d)
                }
              }
              return b
            }),
            (a.prototype.computeMatchabilityChange = function(a, b) {
              this.matchCache || (this.matchCache = []), this.matchCache[a.uid] || (this.matchCache[a.uid] = new i())
              var c = this.matchCache[a.uid],
                d = c.get(b)
              return void 0 === d && ((d = a.matchabilityChange(b, this.treeChanges.get(b))), c.set(b, d)), d
            }),
            (a.prototype.matchabilityChange = function(a) {
              var b = this
              if (this.characterDataOnly)
                switch (a.nodeType) {
                  case ka.NODE_TYPE.COMMENT_NODE:
                  case ka.NODE_TYPE.TEXT_NODE:
                    return h.STAYED_IN
                  default:
                    return h.STAYED_OUT
                }
              if (!this.selectors) return h.STAYED_IN
              if (a.nodeType !== ka.NODE_TYPE.ELEMENT_NODE) return h.STAYED_OUT
              for (
                var c = a,
                  d = this.selectors.map(function(a) {
                    return b.computeMatchabilityChange(a, c)
                  }),
                  e = h.STAYED_OUT,
                  f = 0;
                e !== h.STAYED_IN && f < d.length;

              ) {
                switch (d[f]) {
                  case h.STAYED_IN:
                    e = h.STAYED_IN
                    break
                  case h.ENTERED:
                    e = e === h.EXITED ? h.STAYED_IN : h.ENTERED
                    break
                  case h.EXITED:
                    e = e === h.ENTERED ? h.STAYED_IN : h.EXITED
                }
                f++
              }
              return e
            }),
            (a.prototype.getChildlistChange = function(a) {
              var b = this.childListChangeMap.get(a)
              return b || ((b = new k()), this.childListChangeMap.set(a, b)), b
            }),
            (a.prototype.processChildlistChanges = function() {
              function a(a, b) {
                !a ||
                  d.oldPrevious.has(a) ||
                  d.added.has(a) ||
                  d.maybeMoved.has(a) ||
                  (b && (d.added.has(b) || d.maybeMoved.has(b))) ||
                  d.oldPrevious.set(a, b)
              }
              if (!this.childListChangeMap) {
                this.childListChangeMap = new i()
                for (var b = 0; b < this.mutations.length; b++) {
                  var c = this.mutations[b]
                  if (
                    'childList' == c.type &&
                    (this.treeChanges.reachabilityChange(c.target) === h.STAYED_IN || this.calcOldPreviousSibling)
                  ) {
                    for (var d = this.getChildlistChange(c.target), e = c.previousSibling, f = 0; f < c.removedNodes.length; f++) {
                      var g = c.removedNodes[f]
                      a(g, e), d.added.has(g) ? d.added['delete'](g) : (d.removed.set(g, !0), d.maybeMoved['delete'](g)), (e = g)
                    }
                    a(c.nextSibling, e)
                    for (var f = 0; f < c.addedNodes.length; f++) {
                      var g = c.addedNodes[f]
                      d.removed.has(g) ? (d.removed['delete'](g), d.maybeMoved.set(g, !0)) : d.added.set(g, !0)
                    }
                  }
                }
              }
            }),
            (a.prototype.wasReordered = function(a) {
              function b(a) {
                if (!a) return !1
                if (!g.maybeMoved.has(a)) return !1
                var b = g.moved.get(a)
                return void 0 !== b
                  ? b
                  : (h.has(a) ? (b = !0) : (h.set(a, !0), (b = d(a) !== c(a))),
                    h.has(a) ? (h['delete'](a), g.moved.set(a, b)) : (b = g.moved.get(a)),
                    b)
              }
              function c(a) {
                var d = j.get(a)
                if (void 0 !== d) return d
                for (d = g.oldPrevious.get(a); d && (g.removed.has(d) || b(d)); ) d = c(d)
                return void 0 === d && (d = a.previousSibling), j.set(a, d), d
              }
              function d(a) {
                if (k.has(a)) return k.get(a)
                for (var c = a.previousSibling; c && (g.added.has(c) || b(c)); ) c = c.previousSibling
                return k.set(a, c), c
              }
              if (!this.treeChanges.anyParentsChanged) return !1
              this.processChildlistChanges()
              var e = a.parentNode,
                f = this.treeChanges.get(a)
              f && f.oldParentNode && (e = f.oldParentNode)
              var g = this.childListChangeMap.get(e)
              if (!g) return !1
              if (g.moved) return g.moved.get(a)
              g.moved = new i()
              var h = new i(),
                j = new i(),
                k = new i()
              return g.maybeMoved.keys().forEach(b), g.moved.get(a)
            }),
            a
          )
        })(),
        n = (function() {
          function a(a, b) {
            var c = this
            if (
              ((this.projection = a),
              (this.added = []),
              (this.removed = []),
              (this.reparented = b.all || b.element || b.characterData ? [] : void 0),
              (this.reordered = b.all ? [] : void 0),
              a.getChanged(this, b.elementFilter, b.characterData),
              b.all || b.attribute || b.attributeList)
            ) {
              var d = b.attribute ? [b.attribute] : b.attributeList,
                e = a.attributeChangedNodes(d)
              b.attribute
                ? (this.valueChanged = e[b.attribute] || [])
                : ((this.attributeChanged = e),
                  b.attributeList &&
                    b.attributeList.forEach(function(a) {
                      c.attributeChanged.hasOwnProperty(a) || (c.attributeChanged[a] = [])
                    }))
            }
            if (b.all || b.characterData) {
              var f = a.getCharacterDataChanged()
              b.characterData ? (this.valueChanged = f) : (this.characterDataChanged = f)
            }
            this.reordered && (this.getOldPreviousSibling = a.getOldPreviousSibling.bind(a))
          }
          return (
            (a.prototype.getOldParentNode = function(a) {
              return this.projection.getOldParentNode(a)
            }),
            (a.prototype.getOldAttribute = function(a, b) {
              return this.projection.getOldAttribute(a, b)
            }),
            (a.prototype.getOldCharacterData = function(a) {
              return this.projection.getOldCharacterData(a)
            }),
            (a.prototype.getOldPreviousSibling = function(a) {
              return this.projection.getOldPreviousSibling(a)
            }),
            a
          )
        })(),
        o = /[a-zA-Z_]+/,
        p = /[a-zA-Z0-9_\-]+/,
        q = (function() {
          function a() {}
          return (
            (a.prototype.matches = function(a) {
              if (null === a) return !1
              if (void 0 === this.attrValue) return !0
              if (!this.contains) return this.attrValue == a
              for (var b = a.split(' '), c = 0; c < b.length; c++) if (this.attrValue === b[c]) return !0
              return !1
            }),
            (a.prototype.toString = function() {
              return 'class' === this.attrName && this.contains
                ? '.' + this.attrValue
                : 'id' !== this.attrName || this.contains
                  ? this.contains
                    ? '[' + this.attrName + '~=' + b(this.attrValue) + ']'
                    : 'attrValue' in this
                      ? '[' + this.attrName + '=' + b(this.attrValue) + ']'
                      : '[' + this.attrName + ']'
                  : '#' + this.attrValue
            }),
            a
          )
        })(),
        r = (function() {
          function a() {
            ;(this.uid = a.nextUid++), (this.qualifiers = [])
          }
          return (
            Object.defineProperty(a.prototype, 'caseInsensitiveTagName', {
              get: function() {
                return this.tagName.toUpperCase()
              },
              enumerable: !0,
              configurable: !0
            }),
            Object.defineProperty(a.prototype, 'selectorString', {
              get: function() {
                return this.tagName + this.qualifiers.join('')
              },
              enumerable: !0,
              configurable: !0
            }),
            (a.prototype.isMatching = function(b) {
              return b[a.matchesSelector](this.selectorString)
            }),
            (a.prototype.wasMatching = function(a, b, c) {
              if (!b || !b.attributes) return c
              var d = b.isCaseInsensitive ? this.caseInsensitiveTagName : this.tagName
              if ('*' !== d && d !== a.tagName) return !1
              for (var e = [], f = !1, g = 0; g < this.qualifiers.length; g++) {
                var h = this.qualifiers[g],
                  i = b.getAttributeOldValue(h.attrName)
                e.push(i), (f = f || void 0 !== i)
              }
              if (!f) return c
              for (var g = 0; g < this.qualifiers.length; g++) {
                var h = this.qualifiers[g],
                  i = e[g]
                if ((void 0 === i && (i = a.getAttribute(h.attrName)), !h.matches(i))) return !1
              }
              return !0
            }),
            (a.prototype.matchabilityChange = function(a, b) {
              var c = this.isMatching(a)
              return c ? (this.wasMatching(a, b, c) ? h.STAYED_IN : h.ENTERED) : this.wasMatching(a, b, c) ? h.EXITED : h.STAYED_OUT
            }),
            (a.parseSelectors = function(b) {
              function c() {
                e && (f && (e.qualifiers.push(f), (f = void 0)), h.push(e)), (e = new a())
              }
              function d() {
                f && e.qualifiers.push(f), (f = new q())
              }
              for (
                var e,
                  f,
                  g,
                  h = [],
                  i = /\s/,
                  j = 'Invalid or unsupported selector syntax.',
                  k = 1,
                  l = 2,
                  m = 3,
                  n = 4,
                  r = 5,
                  s = 6,
                  t = 7,
                  u = 8,
                  v = 9,
                  w = 10,
                  x = 11,
                  y = 12,
                  z = 13,
                  A = 14,
                  B = k,
                  C = 0;
                C < b.length;

              ) {
                var D = b[C++]
                switch (B) {
                  case k:
                    if (D.match(o)) {
                      c(), (e.tagName = D), (B = l)
                      break
                    }
                    if ('*' == D) {
                      c(), (e.tagName = '*'), (B = m)
                      break
                    }
                    if ('.' == D) {
                      c(), d(), (e.tagName = '*'), (f.attrName = 'class'), (f.contains = !0), (B = n)
                      break
                    }
                    if ('#' == D) {
                      c(), d(), (e.tagName = '*'), (f.attrName = 'id'), (B = n)
                      break
                    }
                    if ('[' == D) {
                      c(), d(), (e.tagName = '*'), (f.attrName = ''), (B = s)
                      break
                    }
                    if (D.match(i)) break
                    throw Error(j)
                  case l:
                    if (D.match(p)) {
                      e.tagName += D
                      break
                    }
                    if ('.' == D) {
                      d(), (f.attrName = 'class'), (f.contains = !0), (B = n)
                      break
                    }
                    if ('#' == D) {
                      d(), (f.attrName = 'id'), (B = n)
                      break
                    }
                    if ('[' == D) {
                      d(), (f.attrName = ''), (B = s)
                      break
                    }
                    if (D.match(i)) {
                      B = A
                      break
                    }
                    if (',' == D) {
                      B = k
                      break
                    }
                    throw Error(j)
                  case m:
                    if ('.' == D) {
                      d(), (f.attrName = 'class'), (f.contains = !0), (B = n)
                      break
                    }
                    if ('#' == D) {
                      d(), (f.attrName = 'id'), (B = n)
                      break
                    }
                    if ('[' == D) {
                      d(), (f.attrName = ''), (B = s)
                      break
                    }
                    if (D.match(i)) {
                      B = A
                      break
                    }
                    if (',' == D) {
                      B = k
                      break
                    }
                    throw Error(j)
                  case n:
                    if (D.match(o)) {
                      ;(f.attrValue = D), (B = r)
                      break
                    }
                    throw Error(j)
                  case r:
                    if (D.match(p)) {
                      f.attrValue += D
                      break
                    }
                    if ('.' == D) {
                      d(), (f.attrName = 'class'), (f.contains = !0), (B = n)
                      break
                    }
                    if ('#' == D) {
                      d(), (f.attrName = 'id'), (B = n)
                      break
                    }
                    if ('[' == D) {
                      d(), (B = s)
                      break
                    }
                    if (D.match(i)) {
                      B = A
                      break
                    }
                    if (',' == D) {
                      B = k
                      break
                    }
                    throw Error(j)
                  case s:
                    if (D.match(o)) {
                      ;(f.attrName = D), (B = t)
                      break
                    }
                    if (D.match(i)) break
                    throw Error(j)
                  case t:
                    if (D.match(p)) {
                      f.attrName += D
                      break
                    }
                    if (D.match(i)) {
                      B = u
                      break
                    }
                    if ('~' == D) {
                      ;(f.contains = !0), (B = v)
                      break
                    }
                    if ('=' == D) {
                      ;(f.attrValue = ''), (B = x)
                      break
                    }
                    if (']' == D) {
                      B = m
                      break
                    }
                    throw Error(j)
                  case u:
                    if ('~' == D) {
                      ;(f.contains = !0), (B = v)
                      break
                    }
                    if ('=' == D) {
                      ;(f.attrValue = ''), (B = x)
                      break
                    }
                    if (']' == D) {
                      B = m
                      break
                    }
                    if (D.match(i)) break
                    throw Error(j)
                  case v:
                    if ('=' == D) {
                      ;(f.attrValue = ''), (B = x)
                      break
                    }
                    throw Error(j)
                  case w:
                    if (']' == D) {
                      B = m
                      break
                    }
                    if (D.match(i)) break
                    throw Error(j)
                  case x:
                    if (D.match(i)) break
                    if ('"' == D || "'" == D) {
                      ;(g = D), (B = z)
                      break
                    }
                    ;(f.attrValue += D), (B = y)
                    break
                  case y:
                    if (D.match(i)) {
                      B = w
                      break
                    }
                    if (']' == D) {
                      B = m
                      break
                    }
                    if ("'" == D || '"' == D) throw Error(j)
                    f.attrValue += D
                    break
                  case z:
                    if (D == g) {
                      B = w
                      break
                    }
                    f.attrValue += D
                    break
                  case A:
                    if (D.match(i)) break
                    if (',' == D) {
                      B = k
                      break
                    }
                    throw Error(j)
                }
              }
              switch (B) {
                case k:
                case l:
                case m:
                case r:
                case A:
                  c()
                  break
                default:
                  throw Error(j)
              }
              if (!h.length) throw Error(j)
              return h
            }),
            (a.nextUid = 1),
            (a.matchesSelector = (function() {
              var a = document.createElement('div')
              return 'function' == typeof a.webkitMatchesSelector
                ? 'webkitMatchesSelector'
                : 'function' == typeof a.mozMatchesSelector
                  ? 'mozMatchesSelector'
                  : 'function' == typeof a.msMatchesSelector
                    ? 'msMatchesSelector'
                    : 'matchesSelector'
            })()),
            a
          )
        })(),
        s = /^([a-zA-Z:_]+[a-zA-Z0-9_\-:\.]*)$/,
        t = (function() {
          function a(b) {
            var c = this
            ;(this.connected = !1),
              (this.options = a.validateOptions(b)),
              (this.observerOptions = a.createObserverOptions(this.options.queries)),
              (this.root = this.options.rootNode),
              (this.callback = this.options.callback),
              (this.elementFilter = Array.prototype.concat.apply(
                [],
                this.options.queries.map(function(a) {
                  return a.elementFilter ? a.elementFilter : []
                })
              )),
              this.elementFilter.length || (this.elementFilter = void 0),
              (this.calcReordered = this.options.queries.some(function(a) {
                return a.all
              })),
              (this.queryValidators = []),
              a.createQueryValidator &&
                (this.queryValidators = this.options.queries.map(function(b) {
                  return a.createQueryValidator(c.root, b)
                })),
              (this.observer = new f(function(a) {
                c.observerCallback(a)
              })),
              this.reconnect()
          }
          return (
            (a.createObserverOptions = function(a) {
              function b(a) {
                if (!d.attributes || c) {
                  if (((d.attributes = !0), (d.attributeOldValue = !0), !a)) return void (c = void 0)
                  ;(c = c || {}),
                    a.forEach(function(a) {
                      ;(c[a] = !0), (c[a.toLowerCase()] = !0)
                    })
                }
              }
              var c,
                d = { childList: !0, subtree: !0 }
              return (
                a.forEach(function(a) {
                  if (a.characterData) return (d.characterData = !0), void (d.characterDataOldValue = !0)
                  if (a.all) return b(), (d.characterData = !0), void (d.characterDataOldValue = !0)
                  if (a.attribute) return void b([a.attribute.trim()])
                  var c = e(a.elementFilter).concat(a.attributeList || [])
                  c.length && b(c)
                }),
                c && (d.attributeFilter = Object.keys(c)),
                d
              )
            }),
            (a.validateOptions = function(b) {
              for (var e in b) if (!(e in a.optionKeys)) throw Error('Invalid option: ' + e)
              if ('function' != typeof b.callback) throw Error('Invalid options: callback is required and must be a function')
              if (!b.queries || !b.queries.length) throw Error('Invalid options: queries must contain at least one query request object.')
              for (
                var f = {
                    callback: b.callback,
                    rootNode: b.rootNode || document,
                    observeOwnChanges: !!b.observeOwnChanges,
                    oldPreviousSibling: !!b.oldPreviousSibling,
                    queries: []
                  },
                  g = 0;
                g < b.queries.length;
                g++
              ) {
                var h = b.queries[g]
                if (h.all) {
                  if (Object.keys(h).length > 1) throw Error('Invalid request option. all has no options.')
                  f.queries.push({ all: !0 })
                } else if ('attribute' in h) {
                  var i = { attribute: c(h.attribute) }
                  if (((i.elementFilter = r.parseSelectors('*[' + i.attribute + ']')), Object.keys(h).length > 1))
                    throw Error('Invalid request option. attribute has no options.')
                  f.queries.push(i)
                } else if ('element' in h) {
                  var j = Object.keys(h).length,
                    i = { element: h.element, elementFilter: r.parseSelectors(h.element) }
                  if ((h.hasOwnProperty('elementAttributes') && ((i.attributeList = d(h.elementAttributes)), j--), j > 1))
                    throw Error('Invalid request option. element only allows elementAttributes option.')
                  f.queries.push(i)
                } else {
                  if (!h.characterData) throw Error('Invalid request option. Unknown query request.')
                  if (Object.keys(h).length > 1) throw Error('Invalid request option. characterData has no options.')
                  f.queries.push({ characterData: !0 })
                }
              }
              return f
            }),
            (a.prototype.createSummaries = function(a) {
              if (!a || !a.length) return []
              for (
                var b = new m(this.root, a, this.elementFilter, this.calcReordered, this.options.oldPreviousSibling), c = [], d = 0;
                d < this.options.queries.length;
                d++
              )
                c.push(new n(b, this.options.queries[d]))
              return c
            }),
            (a.prototype.checkpointQueryValidators = function() {
              this.queryValidators.forEach(function(a) {
                a && a.recordPreviousState()
              })
            }),
            (a.prototype.runQueryValidators = function(a) {
              this.queryValidators.forEach(function(b, c) {
                b && b.validate(a[c])
              })
            }),
            (a.prototype.changesToReport = function(a) {
              return a.some(function(a) {
                var b = ['added', 'removed', 'reordered', 'reparented', 'valueChanged', 'characterDataChanged']
                if (
                  b.some(function(b) {
                    return a[b] && a[b].length
                  })
                )
                  return !0
                if (a.attributeChanged) {
                  var c = Object.keys(a.attributeChanged),
                    d = c.some(function(b) {
                      return !!a.attributeChanged[b].length
                    })
                  if (d) return !0
                }
                return !1
              })
            }),
            (a.prototype.observerCallback = function(a) {
              this.options.observeOwnChanges || this.observer.disconnect()
              var b = this.createSummaries(a)
              this.runQueryValidators(b),
                this.options.observeOwnChanges && this.checkpointQueryValidators(),
                this.changesToReport(b) && this.callback(b),
                !this.options.observeOwnChanges &&
                  this.connected &&
                  (this.checkpointQueryValidators(), this.observer.observe(this.root, this.observerOptions))
            }),
            (a.prototype.reconnect = function() {
              if (this.connected) throw Error('Already connected')
              this.observer.observe(this.root, this.observerOptions), (this.connected = !0), this.checkpointQueryValidators()
            }),
            (a.prototype.takeSummaries = function() {
              if (!this.connected) throw Error('Not connected')
              var a = 'function' == typeof this.observer.takeRecords ? this.observer.takeRecords() : [],
                b = this.createSummaries(a)
              return this.changesToReport(b) ? b : void 0
            }),
            (a.prototype.disconnect = function() {
              var a = this.takeSummaries()
              return this.observer.disconnect(), (this.connected = !1), a
            }),
            (a.NodeMap = i),
            (a.parseElementFilter = r.parseSelectors),
            (a.optionKeys = { callback: !0, queries: !0, rootNode: !0, oldPreviousSibling: !0, observeOwnChanges: !0 }),
            a
          )
        })()
      a.MutationSummary = t
    }
  !(function() {
    window.$sessionstackjq = jQuery.noConflict(!0)
  })(),
    (a.prototype = {
      extractStackFrames: function(a) {
        var b = this
        return new b.scope.Promise(function(c) {
          b.scope.StackTrace.fromError(a, b.options)
            .then(function(a) {
              var b = []
              $sessionstackjq.each(a, function(a, c) {
                b.push({ column: c.columnNumber, line: c.lineNumber, fileName: c.fileName, functionName: c.functionName, source: c.source })
              }),
                c(b)
            })
            ['catch'](function() {
              c(null)
            })
        })
      }
    }),
    (b.prototype = {
      setSettings: function(a) {
        var b = this
        $sessionstackjq.isPlainObject(a) && (b.settings = a),
          $sessionstackjq.each(b.handlers, function(a, c) {
            c.setSettings(b.settings)
          })
      },
      start: function() {
        $sessionstackjq.each(this.handlers, function(a, b) {
          b.start()
        })
      },
      stop: function() {
        $sessionstackjq.each(this.handlers, function(a, b) {
          b.stop()
        })
      }
    }),
    (c.prototype = {
      setSettings: function(a) {
        this.autoLogErrors = a.autoLogErrors
      },
      start: function() {
        this.isLogging = !0
      },
      stop: function() {
        this.isLogging = !1
      }
    }),
    (d.prototype = {
      setSettings: function(a) {
        ;(this.autoLogAllNetworkRequests = 'all' === a.autoLogNetworkRequests),
          (this.autoLogFailedNetworkRequests = 'failed' === a.autoLogNetworkRequests)
      },
      start: function() {
        this.isLogging = !0
      },
      stop: function() {
        this.isLogging = !1
      }
    }),
    (e.NETWORK_REQUEST = 'NETWORK_REQUEST'),
    (e.prototype.log = function(a) {
      if (!ia.isNullOrUndefined(a)) {
        if (this.recorderObject._onDataCallback) {
          var b = this.recorderObject._onDataCallback({
            type: e.NETWORK_REQUEST,
            data: { method: a.method, url: a.url, requestHeaders: a.requestHeaders, responseHeaders: a.responseHeaders }
          })
          g(b) && ((a.url = b.url), (a.requestHeaders = b.requestHeaders), (a.responseHeaders = b.responseHeaders))
        }
        a.message = a.message || f(a)
        var c = n.LOG_LEVELS.NETWORK
        ;(a.isFailed || (a.statusCode >= 400 && a.statusCode <= 599)) && (c = n.LOG_LEVELS.ERROR), delete a.isFailed
        var d = new n(a, { level: c }, n.TYPES.NETWORK)
        this.addLog(d, a.timestamp)
      }
    }),
    (e.prototype.addLog = function(a, b) {
      b ? this.recorderQueue.addLogAt(a, b) : this.recorderQueue.addLog(a)
    }),
    (i.CONSOLE_METHODS = ['log', 'error', 'warn', 'info', 'debug']),
    (i.prototype = {
      setSettings: function(a) {
        this.enabledMethods = {
          log: a.autoLogConsoleLog,
          error: a.autoLogConsoleError,
          warn: a.autoLogConsoleWarn,
          info: a.autoLogConsoleInfo,
          debug: a.autoLogConsoleDebug
        }
      },
      start: function() {
        this.isLogging = !0
      },
      stop: function() {
        this.isLogging = !1
      }
    })
  var ga = { EXCEPTION: 'exception', STRING: 'string', JSON: 'json' }
  ;(j.prototype = {
    resolve: function(a, b) {
      var c = this,
        d = a.getEntry(),
        e = a.getLevel()
      return ia.isError(d) ? c.resolveError(d, e, b) : a.isNetworkLog() ? c.resolveNetworkLog(d, e, b) : c.resolveMessage(d, e, b)
    },
    resolveError: function(a, b, c) {
      return this.errorResolver.extractStackFrames(a).then(function(d) {
        return {
          timestamp: c,
          type: ga.EXCEPTION,
          exception: { type: a.name, message: a.message, stackFrames: d },
          level: b || n.LOG_LEVELS.ERROR
        }
      })
    },
    resolveNetworkLog: function(a, b, c) {
      var d,
        e = $sessionstackjq.trim(ia.stringify(a.message))
      return (
        self.maxMessageLength && ((d = e.length > self.maxMessageLength), (e = e.substring(0, self.maxMessageLength))),
        delete a.message,
        new this.scope.Promise(function(f) {
          f({ timestamp: c, message: e, request: a, type: ga.JSON, isMessageTrimmed: d, level: b })
        })
      )
    },
    resolveMessage: function(a, b, c) {
      var d,
        e,
        f = this,
        g = ga.STRING
      if (ia.isNullOrUndefined(a)) return null
      var h = $sessionstackjq.isPlainObject(a)
      return (
        h && (g = ga.JSON),
        (d = $sessionstackjq.trim(ia.stringify(a))),
        f.maxMessageLength && ((e = d.length > f.maxMessageLength), (d = d.substring(0, f.maxMessageLength))),
        new this.scope.Promise(function(a) {
          d.length > 0 ? a({ timestamp: c, message: d, type: g, isMessageTrimmed: e, level: b || n.LOG_LEVELS.INFO }) : a()
        })
      )
    },
    setSettings: function(a) {
      this.maxMessageLength = a.maxLogMessageLength
    }
  }),
    (k.prototype = {
      start: function() {
        this.dispatchToRegisteredListener
          ? this.jqScope[0].addEventListener &&
            this.jqScope[0].addEventListener(this.event, this.handler, this.dispatchToRegisteredListener)
          : this.jqScope.on.apply(this.jqScope, [this.event, this.selector, this.handler])
      },
      stop: function() {
        try {
          this.dispatchToRegisteredListener
            ? this.jqScope[0].addEventListener &&
              this.jqScope[0].removeEventListener(this.event, this.handler, this.dispatchToRegisteredListener)
            : this.jqScope.off.apply(this.jqScope, [this.event, this.selector, this.handler])
        } catch (a) {}
      }
    }),
    (l.prototype = {
      start: function() {
        $sessionstackjq.each(this.listeners, function(a, b) {
          b.start()
        })
      },
      stop: function() {
        $sessionstackjq.each(this.listeners, function(a, b) {
          b.stop()
        })
      }
    })
  var ha = {
    DOM_ELEMENT_VALUE_CHANGE: 'dom_element_value_change',
    DOM_MUTATION: 'dom_mutation',
    MOUSE_MOVE: 'mouse_move',
    MOUSE_CLICK: 'mouse_click',
    MOUSE_OVER: 'mouse_over',
    MOUSE_OUT: 'mouse_out',
    WINDOW_RESIZE: 'window_resize',
    DOM_SNAPSHOT: 'dom_snapshot',
    SCROLL_POSITION_CHANGE: 'scroll_position_change',
    RADIO_BUTTON_CHANGE: 'radio_button_change',
    CHECKBOX_CHANGE: 'checkbox_change',
    VISIBILITY_CHANGE: 'visibility_change',
    URL_CHANGE: 'url_change',
    CSS_RULE_INSERT: 'css_rule_insert',
    CSS_RULE_DELETE: 'css_rule_delete'
  }
  ;(m.prototype = {
    getType: function() {
      return this.type
    },
    getData: function() {
      return this.data
    }
  }),
    (n.LOG_LEVELS = { INFO: 'info', WARN: 'warn', ERROR: 'error', DEBUG: 'debug', NETWORK: 'network' }),
    (n.TYPES = { NETWORK: 'network' }),
    (n.isValidLogLevel = function(a) {
      if (!a) return !1
      var b = !1
      return (
        $sessionstackjq.each(n.LOG_LEVELS, function(c, d) {
          d === a && (b = !0)
        }),
        b
      )
    }),
    (n.prototype = {
      getEntry: function() {
        return this.entry
      },
      getLevel: function() {
        return this.level
      },
      isNetworkLog: function() {
        return this.type === n.TYPES.NETWORK
      }
    }),
    (o.prototype = {
      getItem: function() {
        return this.item
      },
      getTimestamp: function() {
        return this.timestamp
      }
    })
  var ia = (function() {
      function a() {
        i(document.visibilityState)
          ? i(document.webkitVisibilityState)
            ? i(document.mozVisibilityState)
              ? i(document.msVisibilityState) || ((w = 'msVisibilityState'), (x = 'msvisibilitychange'))
              : ((w = 'mozVisibilityState'), (x = 'mozvisibilitychange'))
            : ((w = 'webkitVisibilityState'), (x = 'webkitvisibilitychange'))
          : ((w = 'visibilityState'), (x = 'visibilitychange'))
      }
      function b(a) {
        return 'string' == typeof a || a instanceof String
      }
      function c(a) {
        return a ? 'object' == typeof a || a instanceof Object : !1
      }
      function d(a) {
        return '[object Error]' === Object.prototype.toString.call(a) || a instanceof Error
      }
      function e(a) {
        return z.test(a)
      }
      function f(a, b, c) {
        var d = [],
          e = 0,
          f = b + c - 1
        for (e = b; f >= e; e++) d.push(a[e])
        return d
      }
      function g(a, b) {
        var c = $sessionstackjq.merge([], a)
        return $sessionstackjq.merge(c, b)
      }
      function h(a) {
        var b = 0
        return (
          $sessionstackjq.each(a, function() {
            b++
          }),
          b
        )
      }
      function i(a) {
        return 'undefined' == typeof a || null === a
      }
      function j(a) {
        if (b(a)) return a
        try {
          return k(a)
        } catch (c) {
          return n(a)
        }
      }
      function k(a) {
        return (
          (l(String) || l(Array) || l(Object)) &&
            m(a, function(a) {
              a && (a.toJSON = void 0)
            }),
          JSON.stringify(a)
        )
      }
      function l(a) {
        return $sessionstackjq.isFunction(a.prototype.toJSON)
      }
      function m(a, b) {
        for (var c, d, e = [a]; e.length > 0; )
          if (((c = e.pop()), b(c), 'string' != typeof c)) for (d in c) c.hasOwnProperty(d) && e.push(c[d])
      }
      function n(a) {
        try {
          return '' + a
        } catch (b) {
          return null
        }
      }
      function o(a) {
        return (
          '<!DOCTYPE ' +
          a.name +
          (a.publicId ? ' PUBLIC "' + a.publicId + '"' : '') +
          (!a.publicId && a.systemId ? ' SYSTEM' : '') +
          (a.systemId ? ' "' + a.systemId + '"' : '') +
          '>'
        )
      }
      function p(a, b, c) {
        var d, e
        if (q() && $sessionstackjq.isFunction(c)) {
          ;(d = Object.getOwnPropertyDescriptor(a, b)),
            (e = d.set),
            (d.set = function(a) {
              var b = this,
                d = e.call(b, a)
              return c.call(null, b, a), d
            })
          try {
            Object.defineProperty(a, b, d)
          } catch (f) {}
        }
      }
      function q() {
        return $sessionstackjq.isFunction(Object.defineProperty) && $sessionstackjq.isFunction(Object.getOwnPropertyDescriptor)
      }
      function r(a, b) {
        return ((a + b) * (a + b + 1)) / 2 + b
      }
      function s(a, b) {
        if (!b) return a
        for (var c, d = [], e = 0; e < a.length; e += b) (c = a.slice(e, e + b)), d.push(c)
        return d
      }
      function t(a, b) {
        try {
          a.postMessage(b, y)
        } catch (c) {}
      }
      function u(a) {
        return A.test(a)
      }
      function v(a) {
        return a === B.FORBIDDEN
      }
      var w,
        x,
        y = '*',
        z = /^[a-z0-9]+$/i,
        A = /^\s*$/,
        B = { FORBIDDEN: 403 },
        C = 1e3
      return (
        a(),
        {
          VISIBILITY_STATE_PROPERTY_NAME: w,
          VISIBILITY_CHANGE_EVENT_NAME: x,
          DOM_MUTATION_CHUNK_SIZE: C,
          subArray: f,
          mergeArrays: g,
          getObjectSize: h,
          isString: b,
          isObject: c,
          isError: d,
          isAlphaNumeric: e,
          isNullOrUndefined: i,
          stringify: j,
          toJSON: k,
          docTypeNodeToString: o,
          addPropertyChangeListener: p,
          calculateCantorPair: r,
          chunkArray: s,
          postMessageToAllDomains: t,
          isWhitespaceString: u,
          isForbidden: v
        }
      )
    })(),
    ja = (function() {
      function a() {
        return 'recorder.sessionstack.com/api'
      }
      function b() {
        return 'broker.sessionstack.com/api'
      }
      function c(a, b) {
        var c = a
        return (
          Object.keys(b).forEach(function(a) {
            var d = '{' + a + '}'
            c = c.replace(d, b[a])
          }),
          c
        )
      }
      function d(b) {
        return a() + '/' + b
      }
      function e(a) {
        return k + '://' + d(a)
      }
      function f(a) {
        return j + '://' + d(a)
      }
      function g(a) {
        var c = b()
        return j + '://' + c + '/' + a
      }
      function h() {
        return e('')
      }
      var i = '62',
        j = 'wss',
        k = 'https',
        l = !0,
        m = {
          SESSION: e('session'),
          SESSION_INITIAL_DATA: e('session/{id}'),
          SESSION_ACTIVE: e('session/{id}/active'),
          DATA: e('session/{id}/data?server_session_id={ssid}'),
          PING: e('session/{id}/ping?server_session_id={ssid}'),
          SETTINGS: e('settings?url={url}'),
          SET_SESSION_IDENTITY: e('session/{id}/identity'),
          GET_IDENTITY_ROOT_DOMAIN: e('identity/domain?host={host}'),
          UPDATE_SERVER_SESSION: e('session/{id}/server_session/')
        },
        n = { DATA: f('session/{id}/data?server_session_id={ssid}') },
        o = { DATA: g('receiver/session/{id}?server_session_id={ssid}') }
      return {
        formatUrl: c,
        buildHttpUrl: d,
        getServerUrl: h,
        HTTP_URLS: m,
        WEBSOCKET_URLS: n,
        BROKER_URLS: o,
        VERSION: i,
        SHOULD_RESOLVE_SOURCE_MAPS: l
      }
    })(),
    ka = (function() {
      function a(a) {
        if (!a) return {}
        var b = a[X]
        return b || ((b = {}), (a[X] = b)), b
      }
      function b() {
        var a = $,
          b = _.frameElementId || 0
        return $++, ia.calculateCantorPair(b, a)
      }
      function c(a, b) {
        x(a, b)
      }
      function d(a, b, c) {
        x(a, function(a) {
          e(a, b, c)
        })
      }
      function e(a, b, c) {
        var d = l(a)
        return (
          d || (d = n(a)),
          h(a) &&
            (i(a)
              ? (f(a, b),
                $sessionstackjq(a).on('load', function() {
                  i(a) ? (f(a, b), b.startNestedDocumentsRecorders()) : c.pushFrame(a)
                }))
              : c.pushFrame(a)),
          (Z[d] = a),
          d
        )
      }
      function f(a, b) {
        g(a, b) ? b.addNestedDocument(a) : b.restartNestedDocumentRecorders(a)
      }
      function g(a, b) {
        return a && a.contentWindow && l(a) && b && !b.isRecordingNestedDocument(a)
      }
      function h(a) {
        return a && a.nodeType === Y.ELEMENT_NODE && 'contentDocument' in a
      }
      function i(a) {
        try {
          return !!a.contentDocument && j(a)
        } catch (b) {
          return !1
        }
      }
      function j(a) {
        var b = document.createElement('a')
        return (b.href = a.src), b.host === document.location.host && b.protocol === document.location.protocol
      }
      function k(b, c) {
        var d = l(b)
        return h(b) && c && c.removeNestedDocumentRecorders(b), (Z[d] = void 0), (a(b).nodeId = void 0), d
      }
      function l(b) {
        var c = $sessionstackjq(b)
        return c.length > 0 ? a(c[0]).nodeId : void 0
      }
      function m(a) {
        return !!l(a)
      }
      function n(c) {
        var d = b()
        return (a(c).nodeId = d), d
      }
      function o(a) {
        var b = p(a)
        return b ? l(b) : void 0
      }
      function p(a) {
        return a && a.defaultView ? a.defaultView.frameElement || a : void 0
      }
      function q(a) {
        return a && a.nodeType === Y.DOCUMENT_NODE
      }
      function r(a, b) {
        var c = $sessionstackjq(a)
        return ia.isNullOrUndefined(b) && (b = c.is(V)), b && (_.sensitiveInputFields || s(a))
      }
      function s(a) {
        var b = $sessionstackjq(a)
        return b.closest(aa).length > 0
      }
      function t(a) {
        return $sessionstackjq(a).is(S)
      }
      function u(a) {
        var b,
          c,
          d = ''
        if (a) {
          var e = a.length
          for (b = 0; e > b; b++) (c = a[b]), (d += ia.isAlphaNumeric(c) ? P : c)
        }
        return d
      }
      function v(a) {
        var b = $sessionstackjq(a)
        return w(b, b.val())
      }
      function w(a, b) {
        var c = $sessionstackjq(a)
        return t(a) ? '' : r(c, !0) ? u(b) : b
      }
      function x(a, b) {
        for (var c, d = [a]; d.length > 0; )
          (c = d.shift()),
            c &&
              (b(c),
              $sessionstackjq.each(c.childNodes, function(a, b) {
                d.push(b)
              }))
      }
      function y(a, b) {
        var c,
          d,
          e = A(a),
          f = []
        if (b) for (z(f, a, e); f.length > 0; ) (c = f.shift()), (d = A(c.node)), z(f, c.node, d), c.parent.childNodes.push(d)
        return e
      }
      function z(a, b, c) {
        b &&
          b.childNodes &&
          b.childNodes.length > 0 &&
          ((c.childNodes = []),
          $sessionstackjq.each(b.childNodes, function(b, d) {
            a.push({ parent: c, node: d })
          }))
      }
      function A(b) {
        if (!b) return void 0
        var c
        switch (b.nodeType) {
          case Y.COMMENT_NODE:
          case Y.TEXT_NODE:
            c = B(b)
            break
          case Y.ELEMENT_NODE:
            c = C(b)
            break
          case Y.DOCUMENT_TYPE_NODE:
            c = E(b)
            break
          default:
            c = {}
        }
        return (c.nodeType = b.nodeType), (c.id = l(b)), a(b).isCrossOriginFrame && (c.isCrossOriginFrame = !0), c
      }
      function B(a) {
        var b = a.textContent,
          c = $sessionstackjq(a),
          d = c.parent()
        return (
          d.is('textarea') && (b = d.val()),
          (s(c) || (_.sensitiveInputFields && d.is('textarea, option'))) && (b = u(b)),
          { textContent: b }
        )
      }
      function C(a) {
        var b = $sessionstackjq(a),
          c = { tagName: a.tagName },
          d = b.scrollTop(),
          e = b.scrollLeft()
        ;(d || e) && ((c.top = d), (c.left = e))
        var f = {}
        if (
          (a.attributes &&
            a.attributes.length > 0 &&
            $sessionstackjq.each(a.attributes, function(a, b) {
              f[b.name] = b.value
            }),
          b.is('option:selected') && (f.selected = 'selected'),
          b.is('input:checkbox:checked, input:radio:checked') && (f.checked = 'checked'),
          a.namespaceURI === M && (c.isSvg = !0),
          b.is(V))
        ) {
          var g = b.val()
          r(b, !0) && (g = u(g)), (f.value = g)
        }
        if (
          (t(b) && delete f.value,
          $sessionstackjq.isEmptyObject(f) ||
            ((c.attributes = []),
            $sessionstackjq.each(f, function(a, b) {
              c.attributes.push({ name: a, value: b })
            })),
          'STYLE' === a.nodeName)
        ) {
          var h = a.sheet
          if (h)
            try {
              var i = h.rules || h.cssRules,
                j = a.textContent || '',
                k = ia.isWhitespaceString(j)
              i && i.length > 0 && k && D(c, i)
            } catch (l) {}
        }
        return c
      }
      function D(a, b) {
        ;(a.styleRules = []),
          $sessionstackjq.each(b, function(b, c) {
            var d
            try {
              d = c.cssText
            } catch (e) {
              d = 'html{}'
            }
            a.styleRules.push(d)
          })
      }
      function E(a) {
        return { docTypeString: ia.docTypeNodeToString(a) }
      }
      function F(a) {
        var b = a.nodeValue
        return s(a) && (b = u(b)), b
      }
      function G(b) {
        $sessionstackjq.isPlainObject(b) &&
          ((_ = b),
          (X = '__sessionstack_' + _.token + '__'),
          H(b.sensitiveElementsSelector),
          (a(window.document).nodeId = b.frameElementId))
      }
      function H(a) {
        a && (aa = [aa, a].join(', '))
      }
      function I(a) {
        var b = a.tagName,
          c = [],
          d = []
        ia.isString(a.className) && (c = a.className.split(' ')),
          $sessionstackjq.each(c, function(a, b) {
            b && b.length > 0 && d.push(b)
          })
        var e = { tagName: b, classes: d }
        return a.id && (e.id = a.id), e
      }
      function J(a) {
        for (var b = a.ownerDocument, c = []; a && a !== b; ) {
          var d = I(a)
          if ((c.push(d), (a = a.parentNode), d.id)) break
        }
        return c
      }
      function K(a) {
        return $sessionstackjq('base', a).attr('href')
      }
      function L(a, b) {
        return 'value' === b ? w(a) : a.getAttribute(b)
      }
      var M = 'http://www.w3.org/2000/svg',
        N = 'sessionstack-sensitive',
        O = '.' + N,
        P = 'X',
        Q = ', ',
        R = ['input:not([type=password])', 'textarea'],
        S = 'input:password',
        T = ia.mergeArrays(R, ['select', 'datalist', 'option']),
        U = R.join(Q),
        V = T.join(Q),
        W = document.documentElement,
        X = '__sessionstack__',
        Y = { ELEMENT_NODE: 1, TEXT_NODE: 3, COMMENT_NODE: 8, DOCUMENT_NODE: 9, DOCUMENT_TYPE_NODE: 10 },
        Z = {},
        $ = 1,
        _ = {},
        aa = O
      return {
        ROOT_ELEMENT: W,
        INPUT_EVENT_ELEMENTS_SELECTOR: U,
        VALUE_ELEMENTS_SELECTOR: V,
        NODE_TYPE: Y,
        indexDocumentElement: d,
        addNodeIndex: e,
        removeNodeIndex: k,
        getId: l,
        hasId: m,
        getFrameElementId: o,
        isDocumentNode: q,
        isFrameElement: h,
        isAccessibleFrameElement: i,
        getElementValue: v,
        isPasswordElement: t,
        getAttributeValue: L,
        serializeNode: y,
        getTextNodeValue: F,
        setSettings: G,
        sessionstackPropertyObject: a,
        getElementNodeSelector: J,
        getBaseUrl: K,
        processDocumentElement: c
      }
    })(),
    la = (function() {
      function a() {
        var a, b
        return (
          'number' == typeof window.innerWidth
            ? ((a = window.innerWidth), (b = window.innerHeight))
            : document.documentElement && document.documentElement.clientWidth && document.documentElement.clientHeight
              ? ((a = document.documentElement.clientWidth), (b = document.documentElement.clientHeight))
              : document.body && document.body.clientWidth && document.body.clientHeight
                ? ((a = document.body.clientWidth), (b = document.body.clientHeight))
                : ((a = $sessionstackjq(window).width()), (b = $sessionstackjq(window).height())),
          { screenWidth: a, screenHeight: b }
        )
      }
      return { capture: a }
    })(),
    ma = function(a) {
      var b = this
      ;(b.documentNode = a), (b.window = a.defaultView)
    }
  ma.prototype.capture = function() {
    var a,
      b,
      c,
      d,
      e = this
    e.window && ((a = e.window.location), (b = a.protocol + '//' + a.host + a.pathname), (c = a.hostname), (d = a.href))
    var f = e.documentNode.referrer
    f = f && f.length > 0 ? f : null
    var g = ka.getBaseUrl(e.documentNode)
    return { origin: b, pageUrl: d, baseUrl: g, hostname: c, referrer: f }
  }
  var na = (function() {
      function a(a) {
        return {
          browserName: a.Platform.name,
          browserVersion: a.Platform.version,
          layoutName: a.Platform.layout,
          os: a.Platform.os.toString(),
          manufacturer: a.Platform.manufacturer,
          product: a.Platform.product
        }
      }
      return { get: a }
    })(),
    oa = function(a, b, c) {
      var d = this
      if (
        ((d.token = a),
        (d.sessionIdKey = oa.SESSION_ID_KEY_BASE),
        (d.rejectedSessionKey = oa.REJECTED_SESSION_KEY_BASE),
        (d.userIdentityManager = c),
        (d.cookiesManager = b),
        a && ((d.sessionIdKey += '-' + a), (d.rejectedSessionKey += '-' + a)),
        !ia.isNullOrUndefined(window.opener) && window.opener !== window)
      )
        try {
          d.hasScopeStoredSessionId(window) &&
            d.hasScopeStoredSessionId(window.opener) &&
            d.loadScopeSessionId(window) === d.loadScopeSessionId(window.opener) &&
            d.clearScopeSessionId(window)
        } catch (e) {}
    }
  ;(oa.SESSION_ID_KEY_BASE = 'sessionstack-session-id'),
    (oa.REJECTED_SESSION_KEY_BASE = 'sessionstack-rejected'),
    (oa.prototype.storeSessionId = function(a) {
      var b = this
      b.cookiesManager.createCookie(b.sessionIdKey, a)
    }),
    (oa.prototype.loadSessionId = function() {
      var a = this
      return a.cookiesManager.readCookie(a.sessionIdKey)
    }),
    (oa.prototype.clearSessionId = function() {
      var a = this
      a.cookiesManager.deleteCookie(a.sessionIdKey)
    }),
    (oa.prototype.hasStoredSessionId = function() {
      var a = this,
        b = a.loadSessionId()
      return ia.isString(b) && b.length > 0
    }),
    (oa.prototype.setSessionIsRejected = function(a) {
      var b = this
      b.cookiesManager.createCookie(b.rejectedSessionKey, !0, a)
      var c = 60 * a * 1e3
      clearInterval(b.rejectedCookieIntervalId),
        (b.rejectedCookieIntervalId = setInterval(function() {
          b.cookiesManager.createCookie(b.rejectedSessionKey, !0, a)
        }, c))
    }),
    (oa.prototype.getSessionIsRejected = function() {
      var a = this,
        b = a.cookiesManager.readCookie(a.rejectedSessionKey)
      return b === !0
    }),
    (oa.prototype.clearSessionIsRejected = function() {
      var a = this
      clearInterval(a.rejectedCookieIntervalId), a.cookiesManager.deleteCookie(a.rejectedSessionKey)
    }),
    (oa.prototype.updateSessionIdentity = function() {
      var a = this,
        b = a.userIdentityManager.getIdentity(),
        c = { userId: b.userId },
        d = a.loadSessionId()
      a.lastStoredIdentity
        ? a.identify(a.lastStoredIdentity)
        : a.userIdentityManager.setSessionIdentity(c, d, function(c) {
            b.isAnonymous ? a.userIdentityManager.updateAnonymousUserCookie(c) : a.userIdentityManager.updateIdentifiedUserCookie(c)
          })
    }),
    (oa.prototype.identify = function(a) {
      if (a && a.userId) {
        var b = this,
          c = b.loadSessionId()
        c
          ? b.userIdentityManager.setSessionIdentity(a, c, function(a) {
              b.userIdentityManager.updateIdentifiedUserCookie(a), (b.lastStoredIdentity = null)
            })
          : (b.lastStoredIdentity = a)
      }
    })
  var pa = function(a) {
    this.cookiesManager = a
  }
  ;(pa.NR_KEY = 'sessionstack-nr'),
    (pa.prototype.storeNR = function(a) {
      this.cookiesManager.createCookie(pa.NR_KEY, a)
    }),
    (pa.prototype.loadNR = function() {
      return this.cookiesManager.readCookie(pa.NR_KEY)
    }),
    (pa.prototype.formatUrl = function(a) {
      return 'true' !== this.loadNR() ? a : a.indexOf('?') > -1 ? a + '&nr=true' : a + '?nr=true'
    })
  var qa = function(a) {
    ;(this.frames = {}), (this.initializedFrames = {}), (this.window = a), (this.remoteCommandExecutor = new Ba(this.window))
  }
  ;(qa.prototype.pushFrame = function(a) {
    var b = ka.getId(a)
    ;(this.frames[b] = a), this.isRecording && this.startRecordingFrame(b, a)
  }),
    (qa.prototype.startRecording = function(a) {
      var b = this
      ;(b.config = a),
        (b.isRecording = !0),
        $sessionstackjq.each(b.frames, function(a, c) {
          b.startRecordingFrame(a, c)
        })
    }),
    (qa.prototype.startRecordingFrame = function(a, b) {
      var c = this,
        d = b.contentWindow
      setInterval(function() {
        c.remoteCommandExecutor.executeCommand(d, a, 'startRecording', { frameElementId: a, config: c.config })
      }, 500)
    }),
    (qa.prototype.onStartRecording = function(a) {
      this.remoteCommandExecutor.onCommand('startRecording', a)
    }),
    (qa.prototype.onStopRecording = function(a) {
      this.remoteCommandExecutor.onCommand('stopRecording', a)
    }),
    (qa.prototype.onSnapshotWholePage = function(a) {
      this.remoteCommandExecutor.onCommand('snapshotWholePage', a)
    }),
    (qa.prototype.stopRecording = function() {
      var a = this
      $sessionstackjq.each(a.frames, function(b, c) {
        a.stopRecordingFrame(b, c)
      })
    }),
    (qa.prototype.stopRecordingFrame = function(a, b) {
      var c = this
      c.remoteCommandExecutor.executeCommand(b.contentWindow, a, 'stopRecording', { frameElementId: a, config: c.config })
    }),
    (qa.prototype.snapshotWholePage = function() {
      var a = this
      $sessionstackjq.each(a.frames, function(b, c) {
        a.snapshotWholePageFrame(b, c)
      })
    }),
    (qa.prototype.snapshotWholePageFrame = function(a, b) {
      var c = this
      c.remoteCommandExecutor.executeCommand(b.contentWindow, a, 'snapshotWholePage', { frameElementId: a, config: c.config })
    })
  var ra = function(a) {
      this.documentNode = a
    },
    sa = 'www.',
    ta = 'http:',
    ua = 'https:'
  ;(ra.prototype.createCookie = function(a, b, c) {
    var d = this
    if (!s(this.documentNode)) return p(d.documentNode, a, b, c)
    for (var e = q(this.documentNode), f = 0; f < e.length; f++) {
      p(d.documentNode, a, b, c, e[f])
      var g = d.readCookie(a)
      if (b && b === g) break
    }
  }),
    (ra.prototype.readCookie = function(a) {
      for (var b = encodeURIComponent(a) + '=', c = this.documentNode.cookie.split(';'), d = 0; d < c.length; d++) {
        for (var e = c[d]; ' ' === e.charAt(0); ) e = e.substring(1, e.length)
        if (0 === e.indexOf(b)) {
          var f = e.substring(b.length, e.length)
          return decodeURIComponent(f)
        }
      }
      return null
    }),
    (ra.prototype.deleteCookie = function(a) {
      this.createCookie(a, '', -1)
    })
  var va = function(a, b, c, d) {
      var e = this
      ;(e.token = a),
        (e.scope = b),
        (e.cookiesManager = c),
        (e.restClient = d),
        (e.identifiedUserCookieName = wa + '-' + e.token),
        (e.anonymousUserCookieName = xa + '-' + e.token)
    },
    wa = 'sessionstack-identified',
    xa = 'sessionstack-anonymous',
    ya = 525600
  ;(va.prototype.getIdentity = function() {
    var a = this,
      b = a.cookiesManager.readCookie(a.identifiedUserCookieName)
    return b
      ? { isAnonymous: !1, userId: b }
      : ((b = a.cookiesManager.readCookie(a.anonymousUserCookieName)), { isAnonymous: !0, userId: b })
  }),
    (va.prototype.setSessionIdentity = function(a, b, c, d) {
      var e = this,
        f = ja.formatUrl(ja.HTTP_URLS.SET_SESSION_IDENTITY, { id: b })
      a = a || {}
      var g = {
        url: f,
        data: { identityData: a },
        success: function(a) {
          c && c(a.identifier)
        }
      }
      e.restClient.postRequest(g)
    }),
    (va.prototype.updateIdentifiedUserCookie = function(a) {
      var b = this
      b.cookiesManager.createCookie(b.identifiedUserCookieName, a, ya)
    }),
    (va.prototype.updateAnonymousUserCookie = function(a) {
      var b = this
      b.cookiesManager.createCookie(b.anonymousUserCookieName, a, ya)
    }),
    (va.prototype.clearIdentity = function(a) {
      var b = this
      b.cookiesManager.deleteCookie(b.identifiedUserCookieName), a && b.cookiesManager.deleteCookie(b.anonymousUserCookieName)
    })
  var za = function(a, b, c, d) {
    var e = this
    ;(e.isEnabled = !1),
      (e.scope = a),
      (e.sessionManager = c),
      (e.documentNode = b),
      (e.brokerClient = d),
      e.brokerClient.onPath(function(a) {
        e.drawPath(a)
      }),
      e.brokerClient.onMouseMove(function(a, b) {
        e.applyMouseMove(a, b)
      }),
      e.brokerClient.onClick(function(a, b) {
        e.applyMouseClick(a, b)
      }),
      e.brokerClient.onExitCursor(function() {
        e.hideCursor()
      })
  }
  ;(za.prototype.OVERLAY_ID = '_ss-overlay'),
    (za.prototype.PATH_ID = '_ss-path'),
    (za.prototype.CURSOR_OVERLAY_ID = '_ss-cursor-overlay'),
    (za.prototype.CURSOR_ID = '_ss-cursor'),
    (za.prototype.CURSOR_ICON_ID = '_ss-cursor-icon'),
    (za.prototype.INIT_MESSAGE = 'init'),
    (za.prototype.STYLE_SHEET_ID = '_ss-stylesheet'),
    (za.prototype.CLICK_CIRCLE_SIZE = 54),
    (za.prototype.DRAWING_SPEED = 1.25),
    (za.prototype.FADE_OUT_OFFSET_TIME = 1e4),
    (za.prototype.CLICK_ANIMATION_TIME = 3e3),
    (za.prototype.init = function() {
      var a = this
      a.isEnabled = !0
    }),
    (za.prototype.drawPath = function(a) {
      var b = this
      b.hideCursor()
      var c = b.getDrawingPath()
      c.setAttributeNS(null, 'd', a)
      var d = c.getTotalLength(),
        e = d * b.DRAWING_SPEED,
        f = e + b.FADE_OUT_OFFSET_TIME
      $sessionstackjq(c)
        .stop()
        .css({ 'stroke-dasharray': d, 'stroke-dashoffset': d })
        .animate({ 'stroke-dashoffset': 0 }, e),
        setTimeout(function() {
          c.outerHTML = ''
        }, f)
    }),
    (za.prototype.applyMouseMove = function(a, b) {
      var c = this,
        d = c.getCursor()
      ;(d.style.opacity = 1),
        $sessionstackjq(d)
          .stop()
          .animate({ top: b, left: a }, 100)
    }),
    (za.prototype.applyMouseClick = function(a, b) {
      var c = this,
        d = this.getPulsatingCircle()
      ;(d.style.top = b - c.CLICK_CIRCLE_SIZE / 2 + 'px'),
        (d.style.left = a - c.CLICK_CIRCLE_SIZE / 2 + 'px'),
        setTimeout(function() {
          d.outerHTML = ''
        }, c.CLICK_ANIMATION_TIME)
    }),
    (za.prototype.attachDrawingComponents = function(a, b) {
      var c = this
      a.appendChild(b), c.documentNode.body.appendChild(a)
    }),
    (za.prototype.initDrawingOverlay = function() {
      var a = this,
        b = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      return (
        (b.id = a.OVERLAY_ID),
        b.setAttribute('y', '0px'),
        b.setAttribute('x', '0px'),
        a.updateDrawingOverlaySize(b),
        $sessionstackjq(a.scope).resize(function() {
          a.updateDrawingOverlaySize(b)
        }),
        (b.style.position = 'absolute'),
        (b.style.top = 0),
        (b.style.left = 0),
        (b.style.zIndex = 2147483647),
        (b.style.pointerEvents = 'none'),
        b
      )
    }),
    (za.prototype.updateDrawingOverlaySize = function(a) {
      var b = this
      a.setAttribute('width', b.documentNode.body.scrollWidth), a.setAttribute('height', b.documentNode.body.scrollHeight)
    }),
    (za.prototype.initDrawingPath = function() {
      var a = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      return (
        a.setAttributeNS(null, 'stroke-width', '4px'),
        a.setAttributeNS(null, 'stroke', '#ffa001'),
        a.setAttributeNS(null, 'fill', 'none'),
        a.setAttributeNS(null, 'opacity', 1),
        a
      )
    }),
    (za.prototype.getDrawingOverlay = function() {
      var a = this,
        b = document.getElementById(a.OVERLAY_ID)
      return b || a.initDrawingOverlay()
    }),
    (za.prototype.getDrawingPath = function() {
      var a = this,
        b = a.initDrawingPath(),
        c = a.getDrawingOverlay()
      return a.attachDrawingComponents(c, b), b
    }),
    (za.prototype.initCursorOverlay = function() {
      var a = this,
        b = document.createElement('div')
      return (
        (b.id = a.CURSOR_OVERLAY_ID),
        (b.style.position = 'absolute'),
        (b.style.top = 0),
        (b.style.left = 0),
        (b.style.zIndex = 2147483647),
        (b.style.pointerEvents = 'none'),
        (b.style.width = a.documentNode.body.scrollWidth + 'px'),
        (b.style.height = a.documentNode.body.scrollHeight + 'px'),
        document.body.appendChild(b),
        b
      )
    }),
    (za.prototype.hideCursor = function() {
      var a = this,
        b = a.getCursor()
      b.style.opacity = 0
    }),
    (za.prototype.setupAnimationStyles = function() {
      var a = this,
        b = document.getElementById(a.STYLE_SHEET_ID)
      if (!b) {
        var b = document.createElement('style')
        ;(b.id = a.STYLE_SHEET_ID), document.head.appendChild(b)
      }
      if (!(b.sheet.cssRules.length > 0)) {
        var c = '@keyframes _ss-pulse-ring {0% {transform: scale(.33);} 100% {opacity: 0; }}'
        b.sheet.insertRule(c)
      }
    }),
    (za.prototype.getPulsatingCircle = function() {
      var a = this
      a.setupAnimationStyles()
      var b = a.getCursorOverlay(),
        c = document.createElement('div')
      ;(c.style.position = 'absolute'),
        (c.style.zIndex = 2147483647),
        (c.style.top = 0),
        (c.style.left = 0),
        (c.style.width = '100px'),
        (c.style.height = '100px')
      var d = document.createElement('div')
      return (
        (d.style.content = ''),
        (d.style.position = 'relative'),
        (d.style.display = 'block'),
        (d.style.width = a.CLICK_CIRCLE_SIZE + 'px'),
        (d.style.height = a.CLICK_CIRCLE_SIZE + 'px'),
        (d.style.display = 'block'),
        (d.style.boxSizing = 'border-box'),
        (d.style.borderRadius = '45px'),
        (d.style.backgroundColor = '#ffa001'),
        (d.style.animation = '_ss-pulse-ring 1s infinite'),
        c.appendChild(d),
        b.appendChild(c),
        c
      )
    }),
    (za.prototype.getCursorOverlay = function() {
      var a = this,
        b = document.getElementById(a.CURSOR_OVERLAY_ID)
      return b || ((b = a.initCursorOverlay()), document.body.appendChild(b)), document.getElementById(a.CURSOR_OVERLAY_ID)
    }),
    (za.prototype.getCursor = function() {
      var a = this,
        b = document.getElementById(a.CURSOR_ICON_ID)
      if (b) return b
      var b = a.getCursorSvg()
      ;(b.style.position = 'absolute'), (b.style.top = 0), (b.style.left = 0)
      var c = a.getCursorOverlay()
      return c.appendChild(b), b
    }),
    (za.prototype.getCursorSvg = function() {
      var a = this,
        b = document.createElement('div')
      return (
        (b.innerHTML =
          '<svg width="17px" id=' +
          a.CURSOR_ICON_ID +
          ' height="23px" viewBox="0 0 17 23" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="root" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="1.3-Player---Live-Copy-4" transform="translate(-555.000000, -364.000000)" stroke="#F4A618" stroke-width="0.65"><g id="Dark-Player" transform="translate(260.000000, 352.000000)"><g id="Group-13" transform="translate(278.000000, 0.000000)"><g id="Group-2" transform="translate(18.000000, 13.000000)"><path d="M0.984615385,0.162430892 C0.820512821,0.00089243002 0.562637363,-0.0452614161 0.351648352,0.0470462762 C0.140659341,0.139353968 0,0.347046276 0,0.577815507 L0,20.1932001 C0,20.4239694 0.140659341,20.6316617 0.351648352,20.7239694 C0.421978022,20.7470463 0.492307692,20.7701232 0.586080586,20.7701232 C0.75018315,20.7701232 0.890842491,20.7008924 1.00805861,20.6085847 L6.68131868,15.0239694 L14.6989011,15.0239694 C14.9333333,15.0239694 15.1443223,14.8855078 15.2380952,14.6778155 C15.3318681,14.4701232 15.2849817,14.216277 15.1208791,14.0547386 L0.984615385,0.162430892 Z" id="Shape" fill="#F4A618" fill-rule="nonzero"></path><path d="M6.98659372,14.1317096 C6.80992933,14.1317096 6.65850271,14.2062399 6.53231386,14.3056136 L1.33333333,19.4482035 L1.33333333,1.3125 L14.3560224,14.1317096 L6.98659372,14.1317096 Z" id="Path" fill="#FFC55C"></path></g></g></g></g></g></svg>'),
        b.firstChild
      )
    }),
    (t.prototype = {
      addEvent: function(a) {
        this.addEventAt(a, $sessionstackjq.now())
      },
      addEventAt: function(a, b) {
        this.events.push(new o(a, b)), this.onAddEventAtCallback(a, b)
      },
      addLog: function(a) {
        this.addLogAt(a, $sessionstackjq.now())
      },
      addLogAt: function(a, b) {
        this.logs.push(new o(a, b)), this.onAddLogAtCallback(a, b)
      },
      addEntity: function(a) {
        var b = this,
          c = a.timestamp,
          d = a.data
        if (a.isEvent) {
          var e = new m(d.type, d.data)
          b.addEventAt(e, c)
        } else if (a.isLog) {
          var f = new n(d.entry, { level: d.level })
          b.addLogAt(f, c)
        }
      },
      getData: function() {
        return { logs: this.logs, events: this.events }
      },
      clear: function() {
        ;(this.logs = []), (this.events = [])
      },
      isEmpty: function() {
        return 0 === this.events.length && 0 === this.logs.length
      },
      onAddEventAt: function(a) {
        this.onAddEventAtCallback = a
      },
      onAddLogAt: function(a) {
        this.onAddLogAtCallback = a
      }
    }),
    (u.prototype = {
      addEvent: function() {},
      addEventAt: function() {},
      addLog: function() {},
      addLogAt: function() {},
      addEntity: function() {},
      clear: function() {},
      getData: function() {
        return { logs: [], events: [] }
      },
      isEmpty: function() {
        return !0
      },
      onAddEventAt: function() {},
      onAddLogAt: function() {}
    }),
    (v.prototype = {
      addEvent: function(a) {
        this.addEventAt(a, $sessionstackjq.now())
      },
      addEventAt: function(a, b) {
        ia.postMessageToAllDomains(this.receiverWindow, { isSessionStackData: !0, isEvent: !0, data: a, timestamp: b })
      },
      addLog: function(a) {
        this.addLogAt(a, $sessionstackjq.now())
      },
      addLogAt: function(a, b) {
        ia.postMessageToAllDomains(this.receiverWindow, { isSessionStackData: !0, isLog: !0, data: a, timestamp: b })
      },
      getData: function() {
        return { logs: [], events: [] }
      },
      clear: function() {},
      isEmpty: function() {
        return !0
      },
      onAddEventAt: function() {},
      onAddLogAt: function() {}
    }),
    (w.prototype = {
      sendRequest: function(a) {
        var b = !1
        ;(a.url = this.nrManager.formatUrl(a.url)),
          $sessionstackjq.ajax({
            type: a.type,
            url: a.url,
            data: ia.toJSON(a.data),
            contentType: 'application/json',
            dataType: 'json',
            headers: this.headers,
            cache: !1,
            success: function(b) {
              $sessionstackjq.isFunction(a.success) && a.success(b)
            },
            failure: function(b) {
              ;(errorHandled = !0), $sessionstackjq.isFunction(a.failure) && a.failure(b)
            },
            complete: function(c, d) {
              if (!b) {
                var e = c.status,
                  f = (e >= 200 && 300 > e) || 304 === e
                !f && $sessionstackjq.isFunction(a.failure) && a.failure(c)
              }
            }
          })
      },
      getRequest: function(a) {
        ;(a.type = 'GET'), this.sendRequest(a)
      },
      postRequest: function(a) {
        ;(a.type = 'POST'), this.sendRequest(a)
      },
      putRequest: function(a) {
        ;(a.type = 'PUT'), this.sendRequest(a)
      },
      deleteRequest: function(a) {
        ;(a.type = 'DELETE'), this.sendRequest(a)
      }
    }),
    (x.prototype = {
      send: function(a) {
        var b = this
        b.socket.readyState === x.OPEN
          ? 'string' == typeof a
            ? b.socket.send(a)
            : b.socket.send(ia.toJSON(a))
          : (b.requests.push(a), b.socket.readyState !== x.CONNECTING && b.openNewSocket($sessionstackjq.noop, $sessionstackjq.noop))
      },
      close: function() {
        this.socket && this.socket.close()
      },
      openNewSocket: function(a, b) {
        var c = this
        c.close(),
          (c.socket = new WebSocket(c.url)),
          (c.socket.onerror = b),
          c.socket.readyState === x.OPEN || c.socket.readyState === x.CONNECTING
            ? ((c.socket.onopen = function() {
                $sessionstackjq.each(c.requests, function(a, b) {
                  c.send(b)
                }),
                  (c.requests = []),
                  a()
              }),
              (c.socket.onmessage = function(a) {
                a.data === x.PING_MESSAGE && c.send(x.PONG_MESSAGE)
              }))
            : (c.requests = [])
      }
    }),
    (x.isSupported = function() {
      return !!window.WebSocket
    }),
    (x.CONNECTING = 0),
    (x.OPEN = 1),
    (x.PING_MESSAGE = 'ping'),
    (x.PONG_MESSAGE = 'pong'),
    (y.EVENTS = {
      NUMBER_OF_PLAYERS_CONNECTED: 'numberOfPlayersConnected',
      PLAYER_CONNECTED: 'playerConnected',
      PATH: 'path',
      MOUSEMOVE: 'mousemove',
      CLICK: 'click',
      EXIT_CURSOR: 'exitCursor',
      ADD_DATA: 'addData'
    }),
    (y.prototype = {
      attachListener: function(a, b) {
        ;(this.listeners[a] = this.listeners[a] || []), this.listeners[a].push(b)
      },
      connect: function(a, b) {
        this.websocketClient.connect(
          a,
          b
        )
      },
      disconnect: function() {
        this.websocketClient.disconnect()
      },
      sendData: function(a) {
        ;(a.type = y.EVENTS.ADD_DATA), this.websocketClient.send(JSON.stringify(a))
      },
      onPlayerConnected: function(a) {
        this.attachListener(y.EVENTS.PLAYER_CONNECTED, a)
      },
      onNumberOfPlayersConnected: function(a) {
        this.attachListener(y.EVENTS.NUMBER_OF_PLAYERS_CONNECTED, a)
      },
      onPath: function(a) {
        this.attachListener(y.EVENTS.PATH, a)
      },
      onMouseMove: function(a) {
        this.attachListener(y.EVENTS.MOUSEMOVE, a)
      },
      onClick: function(a) {
        this.attachListener(y.EVENTS.CLICK, a)
      },
      onExitCursor: function(a) {
        this.attachListener(y.EVENTS.EXIT_CURSOR, a)
      }
    }),
    (z.isSupported = function() {
      return !!window.WebSocket
    }),
    (z.DEFAULT_HEARTBEAT_INTERVAL = 2e3),
    (z.DEFAULT_AUTORECONNECT_RETRIES = -1),
    (z.prototype = {
      connect: function(a, b) {
        var c = this
        if (z.isSupported()) {
          c.reconnectService.stop()
          var d = ja.formatUrl(ja.BROKER_URLS.DATA, { id: a, ssid: b })
          ;(c.socket = new WebSocket(d)),
            $sessionstackjq.each(c.eventListeners, function(a, b) {
              c.socket.addEventListener(b.type, b.listener)
            }),
            c.isOpen()
              ? c.sendPendingRequests()
              : c.socket.addEventListener(
                  'open',
                  function() {
                    c.sendPendingRequests()
                  },
                  { once: !0 }
                ),
            c.reconnectService.start(a, b)
        }
      },
      disconnect: function() {
        var a = this
        z.isSupported() && (a.reconnectService.stop(), a.socket.close(), (a.socket = null))
      },
      send: function(a) {
        var b = this
        return b.isOpen() ? void b.socket.send(a) : void b.requestsQueue.push(a)
      },
      addEventListener: function(a, b) {
        var c = this
        c.eventListeners.push({ type: a, listener: b }), c.socket && c.socket.addEventListener(a, b)
      },
      isOpen: function() {
        var a = this
        return a.socket.readyState == WebSocket.OPEN
      },
      isConnecting: function() {
        var a = this
        return a.socket.readyState === WebSocket.CONNECTING
      },
      sendPendingRequests: function() {
        var a = this
        $sessionstackjq.each(a.requestsQueue, function(b, c) {
          a.socket.send(c)
        }),
          (a.requestsQueue = [])
      }
    }),
    (A.prototype = {
      start: function(a, b) {
        var c = this
        c.interval = setInterval(function() {
          return c.client.isConnecting() || c.client.isOpen()
            ? void (c.retries = 0)
            : -1 !== c.maxRetries && c.retries > c.maxRetries
              ? void c.stop()
              : ((c.retries += 1),
                void c.client.connect(
                  a,
                  b
                ))
        }, c.heartbeatInterval)
      },
      stop: function() {
        var a = this
        clearInterval(a.interval), (a.interval = null), (a.retries = 0)
      }
    }),
    (B.prototype = {
      connect: function(a, b, c) {
        var d = this
        d.mappings = c
        var e = ja.formatUrl(ja.WEBSOCKET_URLS.DATA, { id: a, ssid: b })
        e = this.nrManager.formatUrl(e)
        var f = []
        ;(d.sendDataFunction = function(a) {
          f.push(a)
        }),
          (d.webSocketClient = new x(
            e,
            function() {
              $sessionstackjq.each(f, function(a, b) {
                d.webSocketClient.send(b)
              }),
                (d.sendDataFunction = function(a) {
                  d.webSocketClient.send(a)
                })
            },
            function() {
              var c = ja.formatUrl(ja.HTTP_URLS.DATA, { id: a, ssid: b })
              $sessionstackjq.each(f, function(a) {
                d.restClient.postRequest({ url: c, data: a })
              }),
                (d.sendDataFunction = function(a) {
                  d.restClient.postRequest({ url: c, data: a })
                })
            }
          ))
      },
      sendData: function(a) {
        var b = this
        b.formatData(a).then(function(a) {
          $sessionstackjq.isEmptyObject(a) || b.sendDataFunction(a)
        })
      },
      formatData: function(a) {
        var b = this
        return new b.scope.Promise(function(c) {
          var d = {},
            e = -1,
            f = []
          $sessionstackjq.each(a.events, function(a, c) {
            ;(e = Math.max(e, c.getTimestamp())), f.push(b.addEventToResult(c, a, d))
          }),
            $sessionstackjq.each(a.logs, function(a, c) {
              ;(e = Math.max(e, c.getTimestamp())), f.push(b.addLogToResult(c, d))
            }),
            -1 !== e && (d.lastActive = e),
            b.scope.Promise.all(f).then(function() {
              var a = b.applyMappings(d)
              c(a)
            })
        })
      },
      getMapping: function(a) {
        return a in this.mappings ? this.mappings[a] : a
      },
      applyMappings: function(a) {
        var b = this,
          c = {}
        return (
          $sessionstackjq.each(a, function(a, d) {
            var e = b.getMapping(a)
            c[e] = d
          }),
          c
        )
      },
      addLogToResult: function(a, b) {
        var c = this
        return new c.scope.Promise(function(d) {
          var e = a.getItem(),
            f = a.getTimestamp(),
            g = c.logResolver.resolve(e, f)
          g
            ? g.then(function(a) {
                a && ((b.logs = b.logs || []), b.logs.push(a)), d()
              })
            : d()
        })
      },
      addEventToResult: function(a, b, c) {
        var d = this
        return new d.scope.Promise(function(d) {
          var e = a.getItem(),
            f = e.getType(),
            g = { timestamp: a.getTimestamp(), data: e.getData(), index: b }
          ;(c[f] = c[f] || []), c[f].push(g), d()
        })
      },
      disconnect: function() {
        this.webSocketClient && this.webSocketClient.close()
      },
      setSettings: function(a) {
        this.logResolver.setSettings(a)
      }
    }),
    (C.prototype = {
      connect: function() {},
      sendData: function() {},
      formatData: function() {},
      getMapping: function() {},
      applyMappings: function() {},
      addLogToResult: function() {},
      addEventToResult: function() {},
      disconnect: function() {},
      setSettings: function() {}
    }),
    (D.prototype = {
      load: function(a, b) {
        var c = this,
          d = ja.formatUrl(ja.HTTP_URLS.SETTINGS, {
            url: encodeURIComponent(window.location.href)
          })
        c.sessionManager.hasStoredSessionId() && (d += '&session_id=' + c.sessionManager.loadSessionId()),
          c.restClient.getRequest({ url: d, success: a, failure: b })
      }
    })
  var Aa = function(a) {
    var b = this
    ;(b.documentNode = a), (b.host = new ma(a))
  }
  ;(Aa.prototype.captureEvent = function(a) {
    var b = this
    a = a || b.capture()
    var c = b.host.capture(),
      d = c.origin,
      e = c.pageUrl,
      f = c.baseUrl,
      g = {
        pageUrl: e,
        baseUrl: f,
        snapshot: a.snapshot,
        docType: a.docType,
        origin: d,
        top: a.top,
        left: a.left,
        frameElementId: a.frameElementId
      }
    return b.documentNode === document && (g.visibilityState = a.visibilityState), new m(ha.DOM_SNAPSHOT, g)
  }),
    (Aa.prototype.capture = function() {
      var a = this,
        b = ka.serializeNode(a.documentNode.documentElement, !0),
        c = $sessionstackjq(a.documentNode).scrollTop(),
        d = $sessionstackjq(a.documentNode).scrollLeft(),
        e = { snapshot: b, top: c, left: d, docType: a.getDocType(), frameElementId: ka.getFrameElementId(a.documentNode) }
      return a.documentNode === document && (e.visibilityState = a.documentNode[ia.VISIBILITY_STATE_PROPERTY_NAME]), e
    }),
    (Aa.prototype.getDocType = function() {
      var a = this,
        b = a.documentNode.doctype
      return b ? ia.docTypeNodeToString(b) : void 0
    }),
    (E.MAX_RECORDING_DEPTH = 3),
    (E.prototype.start = function() {
      var a = this
      a.automaticLoggingHandler.start(),
        $sessionstackjq.each(a.recorders, function(a, b) {
          b.start()
        })
    }),
    (E.prototype.stop = function() {
      var a = this
      $sessionstackjq.each(a.nestedDocumentsRecorders, function(b, c) {
        c && c.stop(), delete a.nestedDocumentsRecorders[b]
      }),
        a.automaticLoggingHandler.stop(),
        $sessionstackjq.each(a.recorders, function(a, b) {
          b.stop()
        })
    }),
    (E.prototype.addNestedDocument = function(a) {
      var b = this
      ka.isFrameElement(a) && ka.isAccessibleFrameElement(a) && b.depth <= E.MAX_RECORDING_DEPTH && b.queuedFrames.push(a)
    }),
    (E.prototype.startNestedDocumentsRecorders = function() {
      var a = this
      $sessionstackjq.each(a.queuedFrames, function(b, c) {
        var d = ka.getId(c),
          e = c.contentDocument,
          f = new E(e, a.recorderQueue, a.crossOriginFramesManager, a.callback, a.scope, a.depth + 1, a.recorderObject)
        f.setSettings(a.settings), (a.nestedDocumentsRecorders[d] = f), f.processDocument(e.documentElement, f, a.crossOriginFramesManager)
        var g = new Aa(e),
          h = g.captureEvent()
        $sessionstackjq.isFunction(a.callback) && a.callback(h), f.start(), f.startNestedDocumentsRecorders()
      }),
        (a.queuedFrames = [])
    }),
    (E.prototype.removeNestedDocumentRecorders = function(a) {
      var b = this,
        c = ka.getId(a),
        d = b.nestedDocumentsRecorders[c]
      d && (d.stop(), delete b.nestedDocumentsRecorders[c])
    }),
    (E.prototype.setSettings = function(a) {
      var b = this
      ;(b.settings = a), b.automaticLoggingHandler.setSettings(a)
    }),
    (E.prototype.isRecordingNestedDocument = function(a) {
      var b = ka.getId(a),
        c = this.nestedDocumentsRecorders[b]
      if (!c || !ka.isAccessibleFrameElement(a)) return !1
      var d = a.contentDocument
      return c.documentNode === d
    }),
    (E.prototype.restartNestedDocumentRecorders = function(a) {
      var b = this,
        c = ka.getId(a),
        d = b.nestedDocumentsRecorders[c]
      d &&
        ($sessionstackjq.each(d.recorders, function(a, b) {
          b.stop(), b.start()
        }),
        d.automaticLoggingHandler.stop(),
        d.automaticLoggingHandler.start())
    }),
    (E.prototype.processDocument = function(a, b, c) {
      var d = this
      ka.processDocumentElement(a, function(a) {
        ka.addNodeIndex(a, b, c), d.StylesRecorder.addNode(a)
      })
    }),
    (E.prototype.snapshotWholePage = function() {
      var a = this
      $sessionstackjq.each(a.nestedDocumentsRecorders, function(b, c) {
        var d = new Aa(c.documentNode)
        a.callback(d.captureEvent())
      })
    }),
    (F.prototype = {
      start: function() {
        var a = this
        a.mutationSummaryConfig && (a.mutationSummary = new a.scope.MutationSummary(this.mutationSummaryConfig))
      },
      stop: function() {
        var a,
          b = this
        b.mutationSummary &&
          b.mutationSummary.connected &&
          ((a = b.mutationSummary.takeSummaries()), b.handleMutationSummaryChanges(a), b.mutationSummary.disconnect())
      },
      handleMutationSummaryChanges: function(a) {
        var b = this
        if (a && a.length > 0) {
          var c = a[0],
            d = b.getAddedOrMovedNodes(c),
            e = new ma(b.rootNode).capture(),
            f = ia.chunkArray(d, ia.DOM_MUTATION_CHUNK_SIZE)
          f.forEach(function(a) {
            b.callback(new m(ha.DOM_MUTATION, { addedOrMoved: b.serializeAddedOrMovedNodes(a), baseUrl: e.baseUrl, pageUrl: e.pageUrl }))
          })
          var g = ia.chunkArray(c.removed, ia.DOM_MUTATION_CHUNK_SIZE)
          $sessionstackjq.each(g, function(a, c) {
            b.callback(new m(ha.DOM_MUTATION, { removed: b.serializeRemovedNodes(c), baseUrl: e.baseUrl, pageUrl: e.pageUrl }))
          })
          var h = ia.chunkArray(c.characterDataChanged, ia.DOM_MUTATION_CHUNK_SIZE)
          $sessionstackjq.each(h, function(a, c) {
            b.callback(
              new m(ha.DOM_MUTATION, { characterData: b.serializeCharacterDataChanges(c), baseUrl: e.baseUrl, pageUrl: e.pageUrl })
            )
          }),
            b.callback(
              new m(ha.DOM_MUTATION, {
                attributes: b.serializeAttributeChanges(c.attributeChanged),
                baseUrl: e.baseUrl,
                pageUrl: e.pageUrl
              })
            ),
            b.documentRecorder.startNestedDocumentsRecorders()
        }
      },
      getAddedOrMovedNodes: function(a) {
        var b = []
        return (
          a.added && (b = b.concat(a.added)), a.reordered && (b = b.concat(a.reordered)), a.reparented && (b = b.concat(a.reparented)), b
        )
      },
      serializeRemovedNodes: function(a) {
        var b = this
        return a && a.length > 0
          ? $sessionstackjq.map(a, function(a) {
              var c = ka.removeNodeIndex(a, b.documentRecorder)
              return { id: c }
            })
          : void 0
      },
      serializeAddedOrMovedNodes: function(a) {
        var b = this,
          c = []
        return (
          this.traverseSortedNodes(a, function(a) {
            var d = { parentId: ka.getId(a.parentNode), previousSiblingId: ka.getId(a.previousSibling) }
            ka.isDocumentNode(a.parentNode) && (d.frameElementId = ka.getFrameElementId(a.parentNode)),
              ka.hasId(a)
                ? (d.id = ka.getId(a))
                : (ka.addNodeIndex(a, b.documentRecorder, b.crossOriginFramesManager),
                  b.stylesRecorder.addNode(a),
                  (d.node = ka.serializeNode(a))),
              c.push(d)
          }),
          c.length > 0 ? c : void 0
        )
      },
      traverseSortedNodes: function(a, b) {
        var c = this
        c.markPendingNodes(a),
          $sessionstackjq.each(a, function(a, d) {
            for (var e, f, g = []; c.nodeIsPending(d); ) {
              for (g.push(d), e = d.previousSibling; c.nodeIsPending(e); ) g.push(e), (e = e.previousSibling)
              d = d.parentNode
            }
            for (; g.length > 0; ) (f = g.pop()), (ka.sessionstackPropertyObject(f).isPending = !1), b(f)
          })
      },
      markPendingNodes: function(a) {
        $sessionstackjq.each(a, function(a, b) {
          ka.sessionstackPropertyObject(b).isPending = !0
        })
      },
      nodeIsPending: function(a) {
        return a ? ka.sessionstackPropertyObject(a).isPending : !1
      },
      serializeAttributeChanges: function(a) {
        if (a && !$sessionstackjq.isEmptyObject(a)) {
          var b = []
          return (
            $sessionstackjq.each(a, function(a, c) {
              $sessionstackjq.each(c, function(c, d) {
                var e = ka.getId(d),
                  f = ka.getAttributeValue(d, a)
                b.push({ id: e, name: a, value: f })
              })
            }),
            b
          )
        }
      },
      serializeCharacterDataChanges: function(a) {
        return a && a.length > 0
          ? $sessionstackjq.map(a, function(a) {
              return { id: ka.getId(a), value: ka.getTextNodeValue(a) }
            })
          : void 0
      }
    }),
    (G.MOUSE_CAPTURE_INTERVAL = 100),
    (G.prototype = {
      start: function() {
        this.listeners.start()
        var a = ka.sessionstackPropertyObject(ka.ROOT_ELEMENT).initialVisibilityState
        this.recordInitialVisibilityState(a)
      },
      stop: function() {
        this.listeners.stop()
      }
    }),
    (H.prototype = {
      createInputEventListeners: function() {
        function a(a) {
          b.handleInputElementChange(a.target)
        }
        var b = this,
          c = b.root
        return new l([
          new k(c, 'change', a, 'input:radio'),
          new k(c, 'change', a, 'input:checkbox'),
          new k(c, 'input', a, ka.INPUT_EVENT_ELEMENTS_SELECTOR),
          new k(c, 'change', a, 'select')
        ])
      },
      createPropertyChangeListeners: function() {
        function a(a) {
          b.handleInputElementChange(a)
        }
        var b = this
        ia.addPropertyChangeListener(HTMLInputElement.prototype, 'value', a),
          ia.addPropertyChangeListener(HTMLInputElement.prototype, 'checked', a),
          ia.addPropertyChangeListener(HTMLSelectElement.prototype, 'value', a),
          ia.addPropertyChangeListener(HTMLTextAreaElement.prototype, 'value', a)
      },
      handleInputElementChange: function(a) {
        var b = this
        if (b.isRecording && !ka.isPasswordElement(a)) {
          var c,
            d,
            e = $sessionstackjq(a),
            f = ka.getId(a)
          e.is(':checkbox')
            ? ((c = e.is(':checked') ? 1 : 0), (d = ha.CHECKBOX_CHANGE))
            : e.is(':radio')
              ? ((c = e.is(':checked') ? 1 : 0), (d = ha.RADIO_BUTTON_CHANGE))
              : ((c = ka.getElementValue(a)), (d = ha.DOM_ELEMENT_VALUE_CHANGE))
          var g = b.createInputElementChangeEvent(f, c, d)
          b.callback(g)
        }
      },
      createInputElementChangeEvent: function(a, b, c) {
        var d = 'state'
        c === ha.DOM_ELEMENT_VALUE_CHANGE && (d = 'value')
        var e = { id: a }
        return (e[d] = b), new m(c, e)
      },
      start: function() {
        var a = this
        a.listeners.start(), (a.isRecording = !0)
      },
      stop: function() {
        var a = this
        a.listeners.stop(), (a.isRecording = !1)
      }
    }),
    (I.prototype = {
      start: function() {
        this.listeners.start(), this.recordInitialHistoryState()
      },
      stop: function() {
        this.listeners.stop()
      }
    }),
    (J.prototype.addNode = function(a) {
      var b = this
      if ('STYLE' === a.nodeName) {
        var c = a.sheet
        if (c) {
          c.nodeId = ka.getId(a)
          var d = c.__proto__.insertRule,
            e = c.__proto__.deleteRule
          ;(c.__proto__.insertRule = function(a, c) {
            d.apply(this, arguments)
            try {
              if (b.isStarted) {
                var e = K(this.nodeId, a, c || 0)
                b.callback(e)
              }
            } catch (f) {}
          }),
            (c.__proto__.deleteRule = function(a) {
              e.apply(this, arguments)
              try {
                if (b.isStarted) {
                  var c = L(this.nodeId, a)
                  b.callback(c)
                }
              } catch (d) {}
            })
        }
      }
    }),
    (J.prototype.start = function() {
      this.isStarted = !0
    }),
    (J.prototype.stop = function() {
      this.isStarted = !1
    }),
    (M.TIMEOUT = 2e3),
    (M.prototype = {
      sendPendingData: function() {
        var a,
          b = this
        b.isStarted &&
          !b.recorderQueue.isEmpty() &&
          ((a = b.recorderQueue.getData()), b.sessionDataClient.sendData(a), b.recorderQueue.clear())
      },
      start: function(a, b, c) {
        var d = this
        ;(d.isStarted = !0),
          d.sessionDataClient.connect(
            a,
            b,
            c
          ),
          (d.intervalId = setInterval(function() {
            d.sendPendingData()
          }, M.TIMEOUT))
      },
      stop: function() {
        var a = this
        clearTimeout(a.intervalId), a.sendPendingData(), a.sessionDataClient.disconnect(), (a.isStarted = !1)
      }
    }),
    (N.TIMEOUT = 200),
    (N.prototype = {
      startStreaming: function() {
        var a = this
        a.isStreaming = !0
      },
      stopStreaming: function() {
        var a = this
        a.isStreaming = !1
      },
      sendPendingData: function() {
        var a = this
        a.isStarted &&
          !a.queue.isEmpty() &&
          ((queueData = a.queue.getData()),
          a.queue.clear(),
          a.isStreaming &&
            a.formatData(queueData).then(function(b) {
              a.brokerClient.sendData(b)
            }))
      },
      start: function(a, b, c) {
        var d = this
        d.isStarted ||
          ((d.isStarted = !0),
          (d.intervalId = setInterval(function() {
            d.sendPendingData()
          }, N.TIMEOUT)))
      },
      stop: function() {
        var a = this
        a.isStarted && (clearInterval(a.intervalId), a.sendPendingData(), (a.isStarted = !1))
      },
      formatData: function(a) {
        var b = this
        return b.sessionDataClient.formatData(a)
      }
    }),
    (O.prototype = {
      startStreaming: function() {},
      stopStreaming: function() {},
      sendPendingData: function() {},
      start: function(a, b, c) {},
      stop: function() {},
      formatData: function(a) {}
    }),
    (P.prototype = { sendPendingData: function() {}, start: function() {}, stop: function() {} }),
    (Q.prototype = {
      onPingSuccess: function(a) {
        this.onPingSuccessCallback = a
      },
      onPingFailure: function(a) {
        this.onPingFailureCallback = a
      },
      ping: function(a, b) {
        var c = ja.formatUrl(ja.HTTP_URLS.PING, { id: a, ssid: b })
        this.restClient.putRequest({ url: c, success: this.onPingSuccessCallback, failure: this.onPingFailureCallback })
      },
      start: function(a, b) {
        var c = this
        c.intervalId = setInterval(function() {
          c.ping(a, b)
        }, Q.PING_TIMEOUT)
      },
      stop: function() {
        clearInterval(this.intervalId)
      }
    }),
    (Q.PING_TIMEOUT = 3e4),
    (R.prototype = {
      onPingSuccess: function() {},
      onPingFailure: function() {},
      ping: function() {},
      start: function() {},
      stop: function() {}
    }),
    (S.prototype = {
      start: function(a, b) {
        var c = this
        c.sessionManager.getSessionIsRejected() ||
          ($sessionstackjq.isPlainObject(a) || (a = {}), c.startRecording(a), c.startSendingData(a, b))
      },
      stop: function(a) {
        var b = this
        b.stopSendingData(), b.stopRecording(a || {})
      },
      startOnTabActivation: function() {
        var a,
          b = this
        window === window.top &&
          ((a = new k(document, ia.VISIBILITY_CHANGE_EVENT_NAME, function() {
            'visible' === document[ia.VISIBILITY_STATE_PROPERTY_NAME] && (b.continueRecording(b.sessionId, b.mappings), a.stop())
          })),
          a.start())
      },
      continueRecording: function(a, b) {
        var c = this
        c.sessionManager.getSessionIsRejected() || (c.startRecording(), c.startSendingDataTo(a, b))
      },
      continueRecordingToParentFrameSession: function() {
        var a = this
        a.crossOriginFramesManager.onStartRecording(function(b) {
          if (!a.isSendingData) {
            var c = parseInt(b.frameElementId)
            ;(b = b.config),
              (b.settings.frameElementId = c),
              b.token === a.token &&
                (a.setSettings(b.settings),
                a.startRecording(),
                a.startSendingDataToParentFrameSession(),
                a.crossOriginFramesManager.startRecording({ token: b.token, settings: a.settings }),
                (a.isSendingData = !0))
          }
        }),
          a.crossOriginFramesManager.onStopRecording(function(b) {
            a.stopRecording({ keepSessionId: !1 })
          }),
          a.crossOriginFramesManager.onSnapshotWholePage(function() {
            a.recorderQueue.addEvent(a.domSnapshot.captureEvent()), a.crossOriginFramesManager.snapshotWholePage()
          })
      },
      setSettings: function(a) {
        var b = this
        ;(b.settings = a || {}), b.documentRecorder.setSettings(a.website), b.sessionDataClient.setSettings(a.website)
      },
      hasLoadedSettings: function() {
        var a = this
        return !$sessionstackjq.isEmptyObject(a.settings)
      },
      startSendingDataTo: function(a, b) {
        var c,
          d = this
        d.isSendingData ||
          ((d.isSendingData = !0),
          (d.mappings = b),
          (d.initialState.frameElementId = d.initialState.frameElementId || d.settings.frameElementId),
          (c = ja.formatUrl(ja.HTTP_URLS.UPDATE_SERVER_SESSION, { id: a })),
          d.restClient.putRequest({
            url: c,
            data: { hostname: d.initialState.hostname },
            success: function(c) {
              ;(d.serverSessionId = c.id),
                (d.sessionId = a),
                d.sessionManager.storeSessionId(a, c.domain),
                d.startDataSendingComponents(b),
                d.recorderQueue.addEventAt(d.domSnapshot.captureEvent(d.initialState), d.initialState.timestamp),
                d.crossOriginFramesManager.startRecording({ token: d.token, settings: d.settings })
            },
            failure: function(a) {
              d.stopRecording({ keepSessionId: !1 })
            }
          }))
      },
      startSendingDataToParentFrameSession: function() {
        var a = this
        ;(a.initialState.frameElementId = a.initialState.frameElementId || a.settings.frameElementId),
          a.recorderQueue.addEventAt(a.domSnapshot.captureEvent(a.initialState), a.initialState.timestamp)
      },
      startSendingData: function(a, b) {
        var c,
          d,
          e = this
        e.isSendingData ||
          ((e.isSendingData = !0),
          a.sessionId
            ? ((c = e.restClient.putRequest), (d = ja.formatUrl(ja.HTTP_URLS.SESSION_INITIAL_DATA, { id: a.sessionId })))
            : ((c = e.restClient.postRequest), (d = ja.HTTP_URLS.SESSION)),
          c.call(e.restClient, {
            url: d,
            data: e.initialState,
            success: function(a) {
              ;(e.sessionId = a.id),
                (e.serverSessionId = a.serverSessionId),
                (e.mappings = a.mappings),
                $sessionstackjq.isFunction(b) && b(e.sessionId),
                e.sessionManager.storeSessionId(a.id, a.domain),
                e.nrManager.storeNR(a.nr),
                e.startDataSendingComponents(a.mappings),
                e.crossOriginFramesManager.startRecording({ token: e.token, settings: e.settings })
            },
            failure: function(a) {
              if ((e.stopRecording({ keepSessionId: !1 }), ia.isForbidden(a.status))) {
                var c = e.settings.session.maxSessionInactivityMinutes
                e.sessionManager.setSessionIsRejected(c)
              }
              $sessionstackjq.isFunction(b) && b(null)
            }
          }))
      },
      stopSendingData: function() {
        var a = this
        a.isSendingData &&
          ((a.isSendingData = !1),
          a.pingService.stop(),
          a.recorderDataService.stop(),
          a.liveStreamDataService.stop(),
          a.brokerClient.disconnect())
      },
      startRecording: function(a) {
        var b = this
        if (($sessionstackjq.isPlainObject(a) || (a = {}), !b.isRecording)) {
          b.isRecording = !0
          var c
          ;(c = ia.isNullOrUndefined(a.sensitiveInputFields)
            ? ia.isNullOrUndefined(b.settings.session.sensitiveInputFields)
              ? b.settings.website.sensitiveInputFields
              : b.settings.session.sensitiveInputFields
            : a.sensitiveInputFields),
            ka.setSettings({
              sensitiveElementsSelector: b.settings.website.sensitiveElementsSelector,
              sensitiveInputFields: c,
              token: b.token,
              frameElementId: b.settings.frameElementId
            }),
            b.documentRecorder.processDocument(ka.ROOT_ELEMENT, b.documentRecorder, b.crossOriginFramesManager)
          var d = b.domSnapshot.capture(),
            e = na.get(b.scope),
            f = la.capture(),
            g = b.host.capture(),
            h = $sessionstackjq.now()
          ;(b.initialState = $sessionstackjq.extend(e, d, f, g, { timestamp: h, version: ja.VERSION, sensitiveInputFields: !!c })),
            (ka.sessionstackPropertyObject(ka.ROOT_ELEMENT).initialVisibilityState = d.visibilityState),
            b.documentRecorder.start(),
            b.documentRecorder.startNestedDocumentsRecorders()
        }
      },
      stopRecording: function(a) {
        var b = this
        b.isRecording &&
          ((b.isRecording = !1),
          b.documentRecorder.stop(),
          b.recorderQueue.clear(),
          a.keepSessionId || b.sessionManager.clearSessionId(),
          b.executeGetSessionIdCallbacks(),
          b.crossOriginFramesManager.stopRecording(),
          b.startOnTabActivation())
      },
      recordEvent: function(a) {
        this.recorderQueue.addEvent(a)
      },
      recordLog: function(a) {
        this.recorderQueue.addLog(a)
      },
      startDataSendingComponents: function(a) {
        var b = this
        b.brokerClient.connect(
          b.sessionId,
          b.serverSessionId
        ),
          b.pingService.start(b.sessionId, b.serverSessionId),
          b.recorderDataService.start(b.sessionId, b.serverSessionId, a),
          b.liveStreamDataService.start(b.sessionId, b.serverSessionId, a),
          b.executeGetSessionIdCallbacks(),
          b.fireSessionRecordingStarted()
      },
      getRecorderQueue: function() {
        return this.recorderQueue
      },
      getSessionId: function(a) {
        var b = this
        $sessionstackjq.isFunction(a) &&
          (b.hasLoadedSettings() && !b.isRecording
            ? a(null)
            : b.hasLoadedSessionId
              ? a(b.sessionManager.loadSessionId())
              : ((b.getSessionIdCallbacks = b.getSessionIdCallbacks || []), b.getSessionIdCallbacks.push(a)))
      },
      executeGetSessionIdCallbacks: function() {
        var a = this,
          b = a.sessionManager.loadSessionId()
        ;(a.hasLoadedSessionId = !!b),
          $sessionstackjq.isArray(a.getSessionIdCallbacks) &&
            ($sessionstackjq.each(a.getSessionIdCallbacks, function(a, c) {
              c(b)
            }),
            (a.getSessionIdCallbacks = []))
      },
      onSessionRecordingStarted: function(a) {
        $sessionstackjq.isFunction(a) && this.sessionRecordingStartedCallbacks.push(a)
      },
      fireSessionRecordingStarted: function() {
        $sessionstackjq.each(this.sessionRecordingStartedCallbacks, function(a, b) {
          b()
        })
      },
      snapshotWholePage: function() {
        this.recorderQueue.addEvent(this.domSnapshot.captureEvent()),
          this.documentRecorder.snapshotWholePage(),
          this.crossOriginFramesManager.snapshotWholePage()
      }
    }),
    (T.prototype = {
      registerCommand: function(a, b) {
        this.commands[a] = b
      },
      getCommands: function() {
        return this.commands
      }
    }),
    (U.START_RECORDING_COMMAND = 'startRecording'),
    (U.START_COMMAND = 'start'),
    (U.STOP_RECORDING_COMMAND = 'stopRecording'),
    (U.STOP_COMMAND = 'stop'),
    (U.IS_RECORDING_COMMAND = 'isRecording'),
    (U.GET_SESSION_ID = 'getSessionId'),
    (U.prototype = new T()),
    (U.prototype.executeStartRecording = function(a) {
      var b, c
      a &&
        a.length > 0 &&
        ($sessionstackjq.isPlainObject(a[0]) ? (b = a[0]) : $sessionstackjq.isFunction(a[0]) && (c = a[0]),
        a.length > 1 && $sessionstackjq.isFunction(a[1]) && (c = a[1])),
        this.recorder.start(b, c)
    }),
    (U.prototype.executeStopRecording = function() {
      this.recorder.stop(), this.sessionManager.clearSessionIsRejected()
    }),
    (U.prototype.executeIsRecording = function(a) {
      if (a && a.length > 0 && $sessionstackjq.isFunction(a[0])) {
        var b = a[0]
        b(!!this.sessionManager.loadSessionId())
      }
    }),
    (U.prototype.executeGetSessionId = function(a) {
      if (a && a.length > 0 && $sessionstackjq.isFunction(a[0])) {
        var b = a[0]
        this.recorder.getSessionId(b)
      }
    }),
    (V.LOG_COMMAND = 'log'),
    (V.prototype = new T()),
    (V.prototype.executeLog = function(a) {
      if (a && a.length > 0) {
        var b = a[0],
          c = a[1],
          d = new n(b, c)
        this.recorder.recordLog(d)
      }
    }),
    (W.IDENTIFY = 'identify'),
    (W.CLEAR_USER_COOKIE = 'clearUserCookie'),
    (W.prototype = new T()),
    (W.prototype.executeIdentify = function(a) {
      if (a && a.length > 0) {
        var b = a[0]
        b === !1 ? this.userIdentityManager.clearIdentity(!0) : this.sessionManager.identify(b)
      }
    }),
    (W.prototype.executeClearUserCookie = function(a) {
      var b = !1
      a && a.length > 0 && (b = a[0] === !0 ? !0 : !1), this.userIdentityManager.clearIdentity(b)
    }),
    (X.prototype = {
      execute: function(a) {
        if (a && a.length > 0) {
          var b = a[0],
            c = ia.subArray(a, 1, a.length - 1),
            d = this.getCommandHandler(b)
          d && d(c)
        }
      },
      getCommandName: function(a) {
        return a && a.length > 0 ? a[0] : null
      },
      registerCommandHandler: function(a, b, c) {
        this.commandHandlers[b] = function() {
          c.apply(a, arguments)
        }
      },
      getCommandHandler: function(a) {
        return this.commandHandlers[a]
      }
    })
  var Ba = function(a) {
    var b = this
    ;(b.window = a),
      (b.listeners = {}),
      b.window.addEventListener('message', function(a) {
        $sessionstackjq.isPlainObject(a.data) && a.data.isSessionStackRemoteCommand && b.callListenerCallback(a.origin, a.data)
      })
  }
  ;(Ba.prototype.callListenerCallback = function(a, b) {
    var c = (b.frameElementId, Ba.getListenerId(b.command)),
      d = this.listeners[c]
    $sessionstackjq.isFunction(d) && d(b.data)
  }),
    (Ba.prototype.executeCommand = function(a, b, c, d) {
      ia.postMessageToAllDomains(a, { isSessionStackRemoteCommand: !0, frameElementId: b, command: c, data: d })
    }),
    (Ba.prototype.onCommand = function(a, b) {
      var c = Ba.getListenerId(a)
      this.listeners[c] = b
    }),
    (Ba.getListenerId = function(a) {
      return a
    }),
    (Y.SET_ON_DATA_CALLBACK = 'setOnDataCallback'),
    (Y.prototype = new T()),
    (Y.prototype.setOnDataCallback = function(a) {
      a && a.length > 0 && (this.recorderObject._onDataCallback = a[0])
    }),
    (function() {
      function a() {
        var a = {}
        return Z(a), $(a), _(a), ca(a), ba(a), aa(a), da(a), ea(a), fa(a), a
      }
      function b() {
        var b = 'string' == typeof window.SessionStack,
          h = f(b),
          j = window[h]
        if (j && !j.isLoaded) {
          j.isLoaded = !0
          var k = a(),
            l = e(j),
            m = new ra(document),
            n = new pa(m),
            o = new w(l.token, n),
            p = new z(),
            q = new y(p),
            r = new va(l.token, window, m, o),
            s = new oa(l.token, m, r),
            t = new za(window, document, s, q),
            u = new S(l, s, n, o, q, k, j),
            v = [new V(u)]
          l.isIframe || (v.push(new U(u, s)), v.push(new W(s, r)), v.push(new Y(j)))
          var x = new X(v),
            A = new D(l.token, s, o)
          if (l.isIframe) {
            var B = j[i] || []
            return (
              c(x, B),
              (window[h] = function() {
                x.execute(arguments)
              }),
              u.continueRecordingToParentFrameSession()
            )
          }
          A.load(function(a) {
            var e = j[i] || []
            ;(identifyCommands = d(e, W.IDENTIFY)),
              u.onSessionRecordingStarted(function() {
                identifyCommands && identifyCommands.length > 0 ? c(x, identifyCommands) : s.updateSessionIdentity(),
                  a.website.isToolkitEnabled && t.init()
              }),
              u.setSettings(a)
            var f = (a.website.autoStartRecording && a.website.shouldRecordPage) || (!a.website.autoStartRecording && a.session.isActive)
            f ? (a.session.isActive ? u.continueRecording(a.session.sessionId, a.mappings) : u.start()) : s.clearSessionId(),
              c(x, e),
              b
                ? (j = function() {
                    x.execute(arguments)
                  })
                : g(j, x),
              (j.isLoaded = !0),
              (window[h] = j)
          })
        }
      }
      function c(a, b) {
        $sessionstackjq.each(b, function(b, c) {
          a.execute(c)
        })
      }
      function d(a, b) {
        var c = []
        return (
          $sessionstackjq.each(a, function(d, e) {
            var f = e[0]
            f === b && (c.push(e), delete a[d])
          }),
          c
        )
      }
      function e(a) {
        var b = a[j] || a[k]
        return 'object' == typeof b ? b : { token: b }
      }
      function f(a) {
        return a ? window.SessionStack : window.SessionStackKey || 'sessionstack'
      }
      function g(a, b) {
        delete a[i]
        for (var c in a) c !== j && h(a, c, b)
      }
      function h(a, b, c) {
        a[b] = function() {
          var a = [b].concat([].slice.call(arguments, 0))
          c.execute(a)
        }
      }
      var i = 'q',
        j = 't',
        k = 'c'
      'complete' === document.readyState
        ? b()
        : $sessionstackjq(window).on('load', function() {
            b()
          })
    })()
})()
