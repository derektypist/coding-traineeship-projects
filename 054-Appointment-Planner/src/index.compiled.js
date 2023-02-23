(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
    var setPrototypeOf = require("./setPrototypeOf.js");
    
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      setPrototypeOf(subClass, superClass);
    }
    
    module.exports = _inheritsLoose;
    module.exports["default"] = module.exports, module.exports.__esModule = true;
    },{"./setPrototypeOf.js":2}],2:[function(require,module,exports){
    function _setPrototypeOf(o, p) {
      module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };
    
      module.exports["default"] = module.exports, module.exports.__esModule = true;
      return _setPrototypeOf(o, p);
    }
    
    module.exports = _setPrototypeOf;
    module.exports["default"] = module.exports, module.exports.__esModule = true;
    },{}],3:[function(require,module,exports){
    'use strict';
    
    Object.defineProperty(exports, '__esModule', { value: true });
    
    function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }
    
    var resolvePathname = _interopDefault(require('resolve-pathname'));
    var valueEqual = _interopDefault(require('value-equal'));
    var warning = _interopDefault(require('tiny-warning'));
    var invariant = _interopDefault(require('tiny-invariant'));
    
    function _extends() {
      _extends = Object.assign || function (target) {
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
    
    function addLeadingSlash(path) {
      return path.charAt(0) === '/' ? path : '/' + path;
    }
    function stripLeadingSlash(path) {
      return path.charAt(0) === '/' ? path.substr(1) : path;
    }
    function hasBasename(path, prefix) {
      return path.toLowerCase().indexOf(prefix.toLowerCase()) === 0 && '/?#'.indexOf(path.charAt(prefix.length)) !== -1;
    }
    function stripBasename(path, prefix) {
      return hasBasename(path, prefix) ? path.substr(prefix.length) : path;
    }
    function stripTrailingSlash(path) {
      return path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path;
    }
    function parsePath(path) {
      var pathname = path || '/';
      var search = '';
      var hash = '';
      var hashIndex = pathname.indexOf('#');
    
      if (hashIndex !== -1) {
        hash = pathname.substr(hashIndex);
        pathname = pathname.substr(0, hashIndex);
      }
    
      var searchIndex = pathname.indexOf('?');
    
      if (searchIndex !== -1) {
        search = pathname.substr(searchIndex);
        pathname = pathname.substr(0, searchIndex);
      }
    
      return {
        pathname: pathname,
        search: search === '?' ? '' : search,
        hash: hash === '#' ? '' : hash
      };
    }
    function createPath(location) {
      var pathname = location.pathname,
          search = location.search,
          hash = location.hash;
      var path = pathname || '/';
      if (search && search !== '?') path += search.charAt(0) === '?' ? search : "?" + search;
      if (hash && hash !== '#') path += hash.charAt(0) === '#' ? hash : "#" + hash;
      return path;
    }
    
    function createLocation(path, state, key, currentLocation) {
      var location;
    
      if (typeof path === 'string') {
        // Two-arg form: push(path, state)
        location = parsePath(path);
        location.state = state;
      } else {
        // One-arg form: push(location)
        location = _extends({}, path);
        if (location.pathname === undefined) location.pathname = '';
    
        if (location.search) {
          if (location.search.charAt(0) !== '?') location.search = '?' + location.search;
        } else {
          location.search = '';
        }
    
        if (location.hash) {
          if (location.hash.charAt(0) !== '#') location.hash = '#' + location.hash;
        } else {
          location.hash = '';
        }
    
        if (state !== undefined && location.state === undefined) location.state = state;
      }
    
      try {
        location.pathname = decodeURI(location.pathname);
      } catch (e) {
        if (e instanceof URIError) {
          throw new URIError('Pathname "' + location.pathname + '" could not be decoded. ' + 'This is likely caused by an invalid percent-encoding.');
        } else {
          throw e;
        }
      }
    
      if (key) location.key = key;
    
      if (currentLocation) {
        // Resolve incomplete/relative pathname relative to current location.
        if (!location.pathname) {
          location.pathname = currentLocation.pathname;
        } else if (location.pathname.charAt(0) !== '/') {
          location.pathname = resolvePathname(location.pathname, currentLocation.pathname);
        }
      } else {
        // When there is no prior location and pathname is empty, set it to /
        if (!location.pathname) {
          location.pathname = '/';
        }
      }
    
      return location;
    }
    function locationsAreEqual(a, b) {
      return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && a.key === b.key && valueEqual(a.state, b.state);
    }
    
    function createTransitionManager() {
      var prompt = null;
    
      function setPrompt(nextPrompt) {
        warning(prompt == null, 'A history supports only one prompt at a time');
        prompt = nextPrompt;
        return function () {
          if (prompt === nextPrompt) prompt = null;
        };
      }
    
      function confirmTransitionTo(location, action, getUserConfirmation, callback) {
        // TODO: If another transition starts while we're still confirming
        // the previous one, we may end up in a weird state. Figure out the
        // best way to handle this.
        if (prompt != null) {
          var result = typeof prompt === 'function' ? prompt(location, action) : prompt;
    
          if (typeof result === 'string') {
            if (typeof getUserConfirmation === 'function') {
              getUserConfirmation(result, callback);
            } else {
              warning(false, 'A history needs a getUserConfirmation function in order to use a prompt message');
              callback(true);
            }
          } else {
            // Return false from a transition hook to cancel the transition.
            callback(result !== false);
          }
        } else {
          callback(true);
        }
      }
    
      var listeners = [];
    
      function appendListener(fn) {
        var isActive = true;
    
        function listener() {
          if (isActive) fn.apply(void 0, arguments);
        }
    
        listeners.push(listener);
        return function () {
          isActive = false;
          listeners = listeners.filter(function (item) {
            return item !== listener;
          });
        };
      }
    
      function notifyListeners() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
    
        listeners.forEach(function (listener) {
          return listener.apply(void 0, args);
        });
      }
    
      return {
        setPrompt: setPrompt,
        confirmTransitionTo: confirmTransitionTo,
        appendListener: appendListener,
        notifyListeners: notifyListeners
      };
    }
    
    var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
    function getConfirmation(message, callback) {
      callback(window.confirm(message)); // eslint-disable-line no-alert
    }
    /**
     * Returns true if the HTML5 history API is supported. Taken from Modernizr.
     *
     * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
     * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
     * changed to avoid false negatives for Windows Phones: https://github.com/reactjs/react-router/issues/586
     */
    
    function supportsHistory() {
      var ua = window.navigator.userAgent;
      if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) return false;
      return window.history && 'pushState' in window.history;
    }
    /**
     * Returns true if browser fires popstate on hash change.
     * IE10 and IE11 do not.
     */
    
    function supportsPopStateOnHashChange() {
      return window.navigator.userAgent.indexOf('Trident') === -1;
    }
    /**
     * Returns false if using go(n) with hash history causes a full page reload.
     */
    
    function supportsGoWithoutReloadUsingHash() {
      return window.navigator.userAgent.indexOf('Firefox') === -1;
    }
    /**
     * Returns true if a given popstate event is an extraneous WebKit event.
     * Accounts for the fact that Chrome on iOS fires real popstate events
     * containing undefined state when pressing the back button.
     */
    
    function isExtraneousPopstateEvent(event) {
      return event.state === undefined && navigator.userAgent.indexOf('CriOS') === -1;
    }
    
    var PopStateEvent = 'popstate';
    var HashChangeEvent = 'hashchange';
    
    function getHistoryState() {
      try {
        return window.history.state || {};
      } catch (e) {
        // IE 11 sometimes throws when accessing window.history.state
        // See https://github.com/ReactTraining/history/pull/289
        return {};
      }
    }
    /**
     * Creates a history object that uses the HTML5 history API including
     * pushState, replaceState, and the popstate event.
     */
    
    
    function createBrowserHistory(props) {
      if (props === void 0) {
        props = {};
      }
    
      !canUseDOM ? invariant(false, 'Browser history needs a DOM') : void 0;
      var globalHistory = window.history;
      var canUseHistory = supportsHistory();
      var needsHashChangeListener = !supportsPopStateOnHashChange();
      var _props = props,
          _props$forceRefresh = _props.forceRefresh,
          forceRefresh = _props$forceRefresh === void 0 ? false : _props$forceRefresh,
          _props$getUserConfirm = _props.getUserConfirmation,
          getUserConfirmation = _props$getUserConfirm === void 0 ? getConfirmation : _props$getUserConfirm,
          _props$keyLength = _props.keyLength,
          keyLength = _props$keyLength === void 0 ? 6 : _props$keyLength;
      var basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : '';
    
      function getDOMLocation(historyState) {
        var _ref = historyState || {},
            key = _ref.key,
            state = _ref.state;
    
        var _window$location = window.location,
            pathname = _window$location.pathname,
            search = _window$location.search,
            hash = _window$location.hash;
        var path = pathname + search + hash;
        warning(!basename || hasBasename(path, basename), 'You are attempting to use a basename on a page whose URL path does not begin ' + 'with the basename. Expected path "' + path + '" to begin with "' + basename + '".');
        if (basename) path = stripBasename(path, basename);
        return createLocation(path, state, key);
      }
    
      function createKey() {
        return Math.random().toString(36).substr(2, keyLength);
      }
    
      var transitionManager = createTransitionManager();
    
      function setState(nextState) {
        _extends(history, nextState);
    
        history.length = globalHistory.length;
        transitionManager.notifyListeners(history.location, history.action);
      }
    
      function handlePopState(event) {
        // Ignore extraneous popstate events in WebKit.
        if (isExtraneousPopstateEvent(event)) return;
        handlePop(getDOMLocation(event.state));
      }
    
      function handleHashChange() {
        handlePop(getDOMLocation(getHistoryState()));
      }
    
      var forceNextPop = false;
    
      function handlePop(location) {
        if (forceNextPop) {
          forceNextPop = false;
          setState();
        } else {
          var action = 'POP';
          transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
            if (ok) {
              setState({
                action: action,
                location: location
              });
            } else {
              revertPop(location);
            }
          });
        }
      }
    
      function revertPop(fromLocation) {
        var toLocation = history.location; // TODO: We could probably make this more reliable by
        // keeping a list of keys we've seen in sessionStorage.
        // Instead, we just default to 0 for keys we don't know.
    
        var toIndex = allKeys.indexOf(toLocation.key);
        if (toIndex === -1) toIndex = 0;
        var fromIndex = allKeys.indexOf(fromLocation.key);
        if (fromIndex === -1) fromIndex = 0;
        var delta = toIndex - fromIndex;
    
        if (delta) {
          forceNextPop = true;
          go(delta);
        }
      }
    
      var initialLocation = getDOMLocation(getHistoryState());
      var allKeys = [initialLocation.key]; // Public interface
    
      function createHref(location) {
        return basename + createPath(location);
      }
    
      function push(path, state) {
        warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to push when the 1st ' + 'argument is a location-like object that already has state; it is ignored');
        var action = 'PUSH';
        var location = createLocation(path, state, createKey(), history.location);
        transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
          if (!ok) return;
          var href = createHref(location);
          var key = location.key,
              state = location.state;
    
          if (canUseHistory) {
            globalHistory.pushState({
              key: key,
              state: state
            }, null, href);
    
            if (forceRefresh) {
              window.location.href = href;
            } else {
              var prevIndex = allKeys.indexOf(history.location.key);
              var nextKeys = allKeys.slice(0, prevIndex + 1);
              nextKeys.push(location.key);
              allKeys = nextKeys;
              setState({
                action: action,
                location: location
              });
            }
          } else {
            warning(state === undefined, 'Browser history cannot push state in browsers that do not support HTML5 history');
            window.location.href = href;
          }
        });
      }
    
      function replace(path, state) {
        warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to replace when the 1st ' + 'argument is a location-like object that already has state; it is ignored');
        var action = 'REPLACE';
        var location = createLocation(path, state, createKey(), history.location);
        transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
          if (!ok) return;
          var href = createHref(location);
          var key = location.key,
              state = location.state;
    
          if (canUseHistory) {
            globalHistory.replaceState({
              key: key,
              state: state
            }, null, href);
    
            if (forceRefresh) {
              window.location.replace(href);
            } else {
              var prevIndex = allKeys.indexOf(history.location.key);
              if (prevIndex !== -1) allKeys[prevIndex] = location.key;
              setState({
                action: action,
                location: location
              });
            }
          } else {
            warning(state === undefined, 'Browser history cannot replace state in browsers that do not support HTML5 history');
            window.location.replace(href);
          }
        });
      }
    
      function go(n) {
        globalHistory.go(n);
      }
    
      function goBack() {
        go(-1);
      }
    
      function goForward() {
        go(1);
      }
    
      var listenerCount = 0;
    
      function checkDOMListeners(delta) {
        listenerCount += delta;
    
        if (listenerCount === 1 && delta === 1) {
          window.addEventListener(PopStateEvent, handlePopState);
          if (needsHashChangeListener) window.addEventListener(HashChangeEvent, handleHashChange);
        } else if (listenerCount === 0) {
          window.removeEventListener(PopStateEvent, handlePopState);
          if (needsHashChangeListener) window.removeEventListener(HashChangeEvent, handleHashChange);
        }
      }
    
      var isBlocked = false;
    
      function block(prompt) {
        if (prompt === void 0) {
          prompt = false;
        }
    
        var unblock = transitionManager.setPrompt(prompt);
    
        if (!isBlocked) {
          checkDOMListeners(1);
          isBlocked = true;
        }
    
        return function () {
          if (isBlocked) {
            isBlocked = false;
            checkDOMListeners(-1);
          }
    
          return unblock();
        };
      }
    
      function listen(listener) {
        var unlisten = transitionManager.appendListener(listener);
        checkDOMListeners(1);
        return function () {
          checkDOMListeners(-1);
          unlisten();
        };
      }
    
      var history = {
        length: globalHistory.length,
        action: 'POP',
        location: initialLocation,
        createHref: createHref,
        push: push,
        replace: replace,
        go: go,
        goBack: goBack,
        goForward: goForward,
        block: block,
        listen: listen
      };
      return history;
    }
    
    var HashChangeEvent$1 = 'hashchange';
    var HashPathCoders = {
      hashbang: {
        encodePath: function encodePath(path) {
          return path.charAt(0) === '!' ? path : '!/' + stripLeadingSlash(path);
        },
        decodePath: function decodePath(path) {
          return path.charAt(0) === '!' ? path.substr(1) : path;
        }
      },
      noslash: {
        encodePath: stripLeadingSlash,
        decodePath: addLeadingSlash
      },
      slash: {
        encodePath: addLeadingSlash,
        decodePath: addLeadingSlash
      }
    };
    
    function stripHash(url) {
      var hashIndex = url.indexOf('#');
      return hashIndex === -1 ? url : url.slice(0, hashIndex);
    }
    
    function getHashPath() {
      // We can't use window.location.hash here because it's not
      // consistent across browsers - Firefox will pre-decode it!
      var href = window.location.href;
      var hashIndex = href.indexOf('#');
      return hashIndex === -1 ? '' : href.substring(hashIndex + 1);
    }
    
    function pushHashPath(path) {
      window.location.hash = path;
    }
    
    function replaceHashPath(path) {
      window.location.replace(stripHash(window.location.href) + '#' + path);
    }
    
    function createHashHistory(props) {
      if (props === void 0) {
        props = {};
      }
    
      !canUseDOM ? invariant(false, 'Hash history needs a DOM') : void 0;
      var globalHistory = window.history;
      var canGoWithoutReload = supportsGoWithoutReloadUsingHash();
      var _props = props,
          _props$getUserConfirm = _props.getUserConfirmation,
          getUserConfirmation = _props$getUserConfirm === void 0 ? getConfirmation : _props$getUserConfirm,
          _props$hashType = _props.hashType,
          hashType = _props$hashType === void 0 ? 'slash' : _props$hashType;
      var basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : '';
      var _HashPathCoders$hashT = HashPathCoders[hashType],
          encodePath = _HashPathCoders$hashT.encodePath,
          decodePath = _HashPathCoders$hashT.decodePath;
    
      function getDOMLocation() {
        var path = decodePath(getHashPath());
        warning(!basename || hasBasename(path, basename), 'You are attempting to use a basename on a page whose URL path does not begin ' + 'with the basename. Expected path "' + path + '" to begin with "' + basename + '".');
        if (basename) path = stripBasename(path, basename);
        return createLocation(path);
      }
    
      var transitionManager = createTransitionManager();
    
      function setState(nextState) {
        _extends(history, nextState);
    
        history.length = globalHistory.length;
        transitionManager.notifyListeners(history.location, history.action);
      }
    
      var forceNextPop = false;
      var ignorePath = null;
    
      function locationsAreEqual$$1(a, b) {
        return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash;
      }
    
      function handleHashChange() {
        var path = getHashPath();
        var encodedPath = encodePath(path);
    
        if (path !== encodedPath) {
          // Ensure we always have a properly-encoded hash.
          replaceHashPath(encodedPath);
        } else {
          var location = getDOMLocation();
          var prevLocation = history.location;
          if (!forceNextPop && locationsAreEqual$$1(prevLocation, location)) return; // A hashchange doesn't always == location change.
    
          if (ignorePath === createPath(location)) return; // Ignore this change; we already setState in push/replace.
    
          ignorePath = null;
          handlePop(location);
        }
      }
    
      function handlePop(location) {
        if (forceNextPop) {
          forceNextPop = false;
          setState();
        } else {
          var action = 'POP';
          transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
            if (ok) {
              setState({
                action: action,
                location: location
              });
            } else {
              revertPop(location);
            }
          });
        }
      }
    
      function revertPop(fromLocation) {
        var toLocation = history.location; // TODO: We could probably make this more reliable by
        // keeping a list of paths we've seen in sessionStorage.
        // Instead, we just default to 0 for paths we don't know.
    
        var toIndex = allPaths.lastIndexOf(createPath(toLocation));
        if (toIndex === -1) toIndex = 0;
        var fromIndex = allPaths.lastIndexOf(createPath(fromLocation));
        if (fromIndex === -1) fromIndex = 0;
        var delta = toIndex - fromIndex;
    
        if (delta) {
          forceNextPop = true;
          go(delta);
        }
      } // Ensure the hash is encoded properly before doing anything else.
    
    
      var path = getHashPath();
      var encodedPath = encodePath(path);
      if (path !== encodedPath) replaceHashPath(encodedPath);
      var initialLocation = getDOMLocation();
      var allPaths = [createPath(initialLocation)]; // Public interface
    
      function createHref(location) {
        var baseTag = document.querySelector('base');
        var href = '';
    
        if (baseTag && baseTag.getAttribute('href')) {
          href = stripHash(window.location.href);
        }
    
        return href + '#' + encodePath(basename + createPath(location));
      }
    
      function push(path, state) {
        warning(state === undefined, 'Hash history cannot push state; it is ignored');
        var action = 'PUSH';
        var location = createLocation(path, undefined, undefined, history.location);
        transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
          if (!ok) return;
          var path = createPath(location);
          var encodedPath = encodePath(basename + path);
          var hashChanged = getHashPath() !== encodedPath;
    
          if (hashChanged) {
            // We cannot tell if a hashchange was caused by a PUSH, so we'd
            // rather setState here and ignore the hashchange. The caveat here
            // is that other hash histories in the page will consider it a POP.
            ignorePath = path;
            pushHashPath(encodedPath);
            var prevIndex = allPaths.lastIndexOf(createPath(history.location));
            var nextPaths = allPaths.slice(0, prevIndex + 1);
            nextPaths.push(path);
            allPaths = nextPaths;
            setState({
              action: action,
              location: location
            });
          } else {
            warning(false, 'Hash history cannot PUSH the same path; a new entry will not be added to the history stack');
            setState();
          }
        });
      }
    
      function replace(path, state) {
        warning(state === undefined, 'Hash history cannot replace state; it is ignored');
        var action = 'REPLACE';
        var location = createLocation(path, undefined, undefined, history.location);
        transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
          if (!ok) return;
          var path = createPath(location);
          var encodedPath = encodePath(basename + path);
          var hashChanged = getHashPath() !== encodedPath;
    
          if (hashChanged) {
            // We cannot tell if a hashchange was caused by a REPLACE, so we'd
            // rather setState here and ignore the hashchange. The caveat here
            // is that other hash histories in the page will consider it a POP.
            ignorePath = path;
            replaceHashPath(encodedPath);
          }
    
          var prevIndex = allPaths.indexOf(createPath(history.location));
          if (prevIndex !== -1) allPaths[prevIndex] = path;
          setState({
            action: action,
            location: location
          });
        });
      }
    
      function go(n) {
        warning(canGoWithoutReload, 'Hash history go(n) causes a full page reload in this browser');
        globalHistory.go(n);
      }
    
      function goBack() {
        go(-1);
      }
    
      function goForward() {
        go(1);
      }
    
      var listenerCount = 0;
    
      function checkDOMListeners(delta) {
        listenerCount += delta;
    
        if (listenerCount === 1 && delta === 1) {
          window.addEventListener(HashChangeEvent$1, handleHashChange);
        } else if (listenerCount === 0) {
          window.removeEventListener(HashChangeEvent$1, handleHashChange);
        }
      }
    
      var isBlocked = false;
    
      function block(prompt) {
        if (prompt === void 0) {
          prompt = false;
        }
    
        var unblock = transitionManager.setPrompt(prompt);
    
        if (!isBlocked) {
          checkDOMListeners(1);
          isBlocked = true;
        }
    
        return function () {
          if (isBlocked) {
            isBlocked = false;
            checkDOMListeners(-1);
          }
    
          return unblock();
        };
      }
    
      function listen(listener) {
        var unlisten = transitionManager.appendListener(listener);
        checkDOMListeners(1);
        return function () {
          checkDOMListeners(-1);
          unlisten();
        };
      }
    
      var history = {
        length: globalHistory.length,
        action: 'POP',
        location: initialLocation,
        createHref: createHref,
        push: push,
        replace: replace,
        go: go,
        goBack: goBack,
        goForward: goForward,
        block: block,
        listen: listen
      };
      return history;
    }
    
    function clamp(n, lowerBound, upperBound) {
      return Math.min(Math.max(n, lowerBound), upperBound);
    }
    /**
     * Creates a history object that stores locations in memory.
     */
    
    
    function createMemoryHistory(props) {
      if (props === void 0) {
        props = {};
      }
    
      var _props = props,
          getUserConfirmation = _props.getUserConfirmation,
          _props$initialEntries = _props.initialEntries,
          initialEntries = _props$initialEntries === void 0 ? ['/'] : _props$initialEntries,
          _props$initialIndex = _props.initialIndex,
          initialIndex = _props$initialIndex === void 0 ? 0 : _props$initialIndex,
          _props$keyLength = _props.keyLength,
          keyLength = _props$keyLength === void 0 ? 6 : _props$keyLength;
      var transitionManager = createTransitionManager();
    
      function setState(nextState) {
        _extends(history, nextState);
    
        history.length = history.entries.length;
        transitionManager.notifyListeners(history.location, history.action);
      }
    
      function createKey() {
        return Math.random().toString(36).substr(2, keyLength);
      }
    
      var index = clamp(initialIndex, 0, initialEntries.length - 1);
      var entries = initialEntries.map(function (entry) {
        return typeof entry === 'string' ? createLocation(entry, undefined, createKey()) : createLocation(entry, undefined, entry.key || createKey());
      }); // Public interface
    
      var createHref = createPath;
    
      function push(path, state) {
        warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to push when the 1st ' + 'argument is a location-like object that already has state; it is ignored');
        var action = 'PUSH';
        var location = createLocation(path, state, createKey(), history.location);
        transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
          if (!ok) return;
          var prevIndex = history.index;
          var nextIndex = prevIndex + 1;
          var nextEntries = history.entries.slice(0);
    
          if (nextEntries.length > nextIndex) {
            nextEntries.splice(nextIndex, nextEntries.length - nextIndex, location);
          } else {
            nextEntries.push(location);
          }
    
          setState({
            action: action,
            location: location,
            index: nextIndex,
            entries: nextEntries
          });
        });
      }
    
      function replace(path, state) {
        warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to replace when the 1st ' + 'argument is a location-like object that already has state; it is ignored');
        var action = 'REPLACE';
        var location = createLocation(path, state, createKey(), history.location);
        transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
          if (!ok) return;
          history.entries[history.index] = location;
          setState({
            action: action,
            location: location
          });
        });
      }
    
      function go(n) {
        var nextIndex = clamp(history.index + n, 0, history.entries.length - 1);
        var action = 'POP';
        var location = history.entries[nextIndex];
        transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
          if (ok) {
            setState({
              action: action,
              location: location,
              index: nextIndex
            });
          } else {
            // Mimic the behavior of DOM histories by
            // causing a render after a cancelled POP.
            setState();
          }
        });
      }
    
      function goBack() {
        go(-1);
      }
    
      function goForward() {
        go(1);
      }
    
      function canGo(n) {
        var nextIndex = history.index + n;
        return nextIndex >= 0 && nextIndex < history.entries.length;
      }
    
      function block(prompt) {
        if (prompt === void 0) {
          prompt = false;
        }
    
        return transitionManager.setPrompt(prompt);
      }
    
      function listen(listener) {
        return transitionManager.appendListener(listener);
      }
    
      var history = {
        length: entries.length,
        action: 'POP',
        location: entries[index],
        index: index,
        entries: entries,
        createHref: createHref,
        push: push,
        replace: replace,
        go: go,
        goBack: goBack,
        goForward: goForward,
        canGo: canGo,
        block: block,
        listen: listen
      };
      return history;
    }
    
    exports.createBrowserHistory = createBrowserHistory;
    exports.createHashHistory = createHashHistory;
    exports.createMemoryHistory = createMemoryHistory;
    exports.createLocation = createLocation;
    exports.locationsAreEqual = locationsAreEqual;
    exports.parsePath = parsePath;
    exports.createPath = createPath;
    
    },{"resolve-pathname":28,"tiny-invariant":29,"tiny-warning":30,"value-equal":33}],4:[function(require,module,exports){
    "use strict";function _interopDefault(t){return t&&"object"==typeof t&&"default"in t?t.default:t}Object.defineProperty(exports,"__esModule",{value:!0});var resolvePathname=_interopDefault(require("resolve-pathname")),valueEqual=_interopDefault(require("value-equal"));require("tiny-warning");var invariant=_interopDefault(require("tiny-invariant"));function _extends(){return(_extends=Object.assign||function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n];for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a])}return t}).apply(this,arguments)}function addLeadingSlash(t){return"/"===t.charAt(0)?t:"/"+t}function stripLeadingSlash(t){return"/"===t.charAt(0)?t.substr(1):t}function hasBasename(t,n){return 0===t.toLowerCase().indexOf(n.toLowerCase())&&-1!=="/?#".indexOf(t.charAt(n.length))}function stripBasename(t,n){return hasBasename(t,n)?t.substr(n.length):t}function stripTrailingSlash(t){return"/"===t.charAt(t.length-1)?t.slice(0,-1):t}function parsePath(t){var n=t||"/",e="",a="",r=n.indexOf("#");-1!==r&&(a=n.substr(r),n=n.substr(0,r));var o=n.indexOf("?");return-1!==o&&(e=n.substr(o),n=n.substr(0,o)),{pathname:n,search:"?"===e?"":e,hash:"#"===a?"":a}}function createPath(t){var n=t.pathname,e=t.search,a=t.hash,r=n||"/";return e&&"?"!==e&&(r+="?"===e.charAt(0)?e:"?"+e),a&&"#"!==a&&(r+="#"===a.charAt(0)?a:"#"+a),r}function createLocation(t,n,e,a){var r;"string"==typeof t?(r=parsePath(t)).state=n:(void 0===(r=_extends({},t)).pathname&&(r.pathname=""),r.search?"?"!==r.search.charAt(0)&&(r.search="?"+r.search):r.search="",r.hash?"#"!==r.hash.charAt(0)&&(r.hash="#"+r.hash):r.hash="",void 0!==n&&void 0===r.state&&(r.state=n));try{r.pathname=decodeURI(r.pathname)}catch(t){throw t instanceof URIError?new URIError('Pathname "'+r.pathname+'" could not be decoded. This is likely caused by an invalid percent-encoding.'):t}return e&&(r.key=e),a?r.pathname?"/"!==r.pathname.charAt(0)&&(r.pathname=resolvePathname(r.pathname,a.pathname)):r.pathname=a.pathname:r.pathname||(r.pathname="/"),r}function locationsAreEqual(t,n){return t.pathname===n.pathname&&t.search===n.search&&t.hash===n.hash&&t.key===n.key&&valueEqual(t.state,n.state)}function createTransitionManager(){var o=null;var a=[];return{setPrompt:function(t){return o=t,function(){o===t&&(o=null)}},confirmTransitionTo:function(t,n,e,a){if(null!=o){var r="function"==typeof o?o(t,n):o;"string"==typeof r?"function"==typeof e?e(r,a):a(!0):a(!1!==r)}else a(!0)},appendListener:function(t){var n=!0;function e(){n&&t.apply(void 0,arguments)}return a.push(e),function(){n=!1,a=a.filter(function(t){return t!==e})}},notifyListeners:function(){for(var t=arguments.length,n=new Array(t),e=0;e<t;e++)n[e]=arguments[e];a.forEach(function(t){return t.apply(void 0,n)})}}}var canUseDOM=!("undefined"==typeof window||!window.document||!window.document.createElement);function getConfirmation(t,n){n(window.confirm(t))}function supportsHistory(){var t=window.navigator.userAgent;return(-1===t.indexOf("Android 2.")&&-1===t.indexOf("Android 4.0")||-1===t.indexOf("Mobile Safari")||-1!==t.indexOf("Chrome")||-1!==t.indexOf("Windows Phone"))&&(window.history&&"pushState"in window.history)}function supportsPopStateOnHashChange(){return-1===window.navigator.userAgent.indexOf("Trident")}function supportsGoWithoutReloadUsingHash(){return-1===window.navigator.userAgent.indexOf("Firefox")}function isExtraneousPopstateEvent(t){return void 0===t.state&&-1===navigator.userAgent.indexOf("CriOS")}var PopStateEvent="popstate",HashChangeEvent="hashchange";function getHistoryState(){try{return window.history.state||{}}catch(t){return{}}}function createBrowserHistory(t){void 0===t&&(t={}),canUseDOM||invariant(!1);var s=window.history,c=supportsHistory(),n=!supportsPopStateOnHashChange(),e=t,a=e.forceRefresh,h=void 0!==a&&a,r=e.getUserConfirmation,u=void 0===r?getConfirmation:r,o=e.keyLength,i=void 0===o?6:o,f=t.basename?stripTrailingSlash(addLeadingSlash(t.basename)):"";function l(t){var n=t||{},e=n.key,a=n.state,r=window.location,o=r.pathname+r.search+r.hash;return f&&(o=stripBasename(o,f)),createLocation(o,a,e)}function d(){return Math.random().toString(36).substr(2,i)}var v=createTransitionManager();function p(t){_extends(T,t),T.length=s.length,v.notifyListeners(T.location,T.action)}function g(t){isExtraneousPopstateEvent(t)||w(l(t.state))}function P(){w(l(getHistoryState()))}var m=!1;function w(n){if(m)m=!1,p();else{v.confirmTransitionTo(n,"POP",u,function(t){t?p({action:"POP",location:n}):function(t){var n=T.location,e=H.indexOf(n.key);-1===e&&(e=0);var a=H.indexOf(t.key);-1===a&&(a=0);var r=e-a;r&&(m=!0,L(r))}(n)})}}var y=l(getHistoryState()),H=[y.key];function x(t){return f+createPath(t)}function L(t){s.go(t)}var O=0;function E(t){1===(O+=t)&&1===t?(window.addEventListener(PopStateEvent,g),n&&window.addEventListener(HashChangeEvent,P)):0===O&&(window.removeEventListener(PopStateEvent,g),n&&window.removeEventListener(HashChangeEvent,P))}var S=!1;var T={length:s.length,action:"POP",location:y,createHref:x,push:function(t,n){var i=createLocation(t,n,d(),T.location);v.confirmTransitionTo(i,"PUSH",u,function(t){if(t){var n=x(i),e=i.key,a=i.state;if(c)if(s.pushState({key:e,state:a},null,n),h)window.location.href=n;else{var r=H.indexOf(T.location.key),o=H.slice(0,r+1);o.push(i.key),H=o,p({action:"PUSH",location:i})}else window.location.href=n}})},replace:function(t,n){var o="REPLACE",i=createLocation(t,n,d(),T.location);v.confirmTransitionTo(i,o,u,function(t){if(t){var n=x(i),e=i.key,a=i.state;if(c)if(s.replaceState({key:e,state:a},null,n),h)window.location.replace(n);else{var r=H.indexOf(T.location.key);-1!==r&&(H[r]=i.key),p({action:o,location:i})}else window.location.replace(n)}})},go:L,goBack:function(){L(-1)},goForward:function(){L(1)},block:function(t){void 0===t&&(t=!1);var n=v.setPrompt(t);return S||(E(1),S=!0),function(){return S&&(S=!1,E(-1)),n()}},listen:function(t){var n=v.appendListener(t);return E(1),function(){E(-1),n()}}};return T}var HashChangeEvent$1="hashchange",HashPathCoders={hashbang:{encodePath:function(t){return"!"===t.charAt(0)?t:"!/"+stripLeadingSlash(t)},decodePath:function(t){return"!"===t.charAt(0)?t.substr(1):t}},noslash:{encodePath:stripLeadingSlash,decodePath:addLeadingSlash},slash:{encodePath:addLeadingSlash,decodePath:addLeadingSlash}};function stripHash(t){var n=t.indexOf("#");return-1===n?t:t.slice(0,n)}function getHashPath(){var t=window.location.href,n=t.indexOf("#");return-1===n?"":t.substring(n+1)}function pushHashPath(t){window.location.hash=t}function replaceHashPath(t){window.location.replace(stripHash(window.location.href)+"#"+t)}function createHashHistory(t){void 0===t&&(t={}),canUseDOM||invariant(!1);var n=window.history,e=(supportsGoWithoutReloadUsingHash(),t),a=e.getUserConfirmation,i=void 0===a?getConfirmation:a,r=e.hashType,o=void 0===r?"slash":r,s=t.basename?stripTrailingSlash(addLeadingSlash(t.basename)):"",c=HashPathCoders[o],h=c.encodePath,u=c.decodePath;function f(){var t=u(getHashPath());return s&&(t=stripBasename(t,s)),createLocation(t)}var l=createTransitionManager();function d(t){_extends(E,t),E.length=n.length,l.notifyListeners(E.location,E.action)}var v=!1,p=null;function g(){var t=getHashPath(),n=h(t);if(t!==n)replaceHashPath(n);else{var e=f(),a=E.location;if(!v&&function(t,n){return t.pathname===n.pathname&&t.search===n.search&&t.hash===n.hash}(a,e))return;if(p===createPath(e))return;p=null,function(n){if(v)v=!1,d();else{l.confirmTransitionTo(n,"POP",i,function(t){t?d({action:"POP",location:n}):function(t){var n=E.location,e=y.lastIndexOf(createPath(n));-1===e&&(e=0);var a=y.lastIndexOf(createPath(t));-1===a&&(a=0);var r=e-a;r&&(v=!0,H(r))}(n)})}}(e)}}var P=getHashPath(),m=h(P);P!==m&&replaceHashPath(m);var w=f(),y=[createPath(w)];function H(t){n.go(t)}var x=0;function L(t){1===(x+=t)&&1===t?window.addEventListener(HashChangeEvent$1,g):0===x&&window.removeEventListener(HashChangeEvent$1,g)}var O=!1;var E={length:n.length,action:"POP",location:w,createHref:function(t){var n=document.querySelector("base"),e="";return n&&n.getAttribute("href")&&(e=stripHash(window.location.href)),e+"#"+h(s+createPath(t))},push:function(t,n){var o=createLocation(t,void 0,void 0,E.location);l.confirmTransitionTo(o,"PUSH",i,function(t){if(t){var n=createPath(o),e=h(s+n);if(getHashPath()!==e){p=n,pushHashPath(e);var a=y.lastIndexOf(createPath(E.location)),r=y.slice(0,a+1);r.push(n),y=r,d({action:"PUSH",location:o})}else d()}})},replace:function(t,n){var r="REPLACE",o=createLocation(t,void 0,void 0,E.location);l.confirmTransitionTo(o,r,i,function(t){if(t){var n=createPath(o),e=h(s+n);getHashPath()!==e&&(p=n,replaceHashPath(e));var a=y.indexOf(createPath(E.location));-1!==a&&(y[a]=n),d({action:r,location:o})}})},go:H,goBack:function(){H(-1)},goForward:function(){H(1)},block:function(t){void 0===t&&(t=!1);var n=l.setPrompt(t);return O||(L(1),O=!0),function(){return O&&(O=!1,L(-1)),n()}},listen:function(t){var n=l.appendListener(t);return L(1),function(){L(-1),n()}}};return E}function clamp(t,n,e){return Math.min(Math.max(t,n),e)}function createMemoryHistory(t){void 0===t&&(t={});var n=t,r=n.getUserConfirmation,e=n.initialEntries,a=void 0===e?["/"]:e,o=n.initialIndex,i=void 0===o?0:o,s=n.keyLength,c=void 0===s?6:s,h=createTransitionManager();function u(t){_extends(g,t),g.length=g.entries.length,h.notifyListeners(g.location,g.action)}function f(){return Math.random().toString(36).substr(2,c)}var l=clamp(i,0,a.length-1),d=a.map(function(t){return createLocation(t,void 0,"string"==typeof t?f():t.key||f())}),v=createPath;function p(t){var n=clamp(g.index+t,0,g.entries.length-1),e=g.entries[n];h.confirmTransitionTo(e,"POP",r,function(t){t?u({action:"POP",location:e,index:n}):u()})}var g={length:d.length,action:"POP",location:d[l],index:l,entries:d,createHref:v,push:function(t,n){var a=createLocation(t,n,f(),g.location);h.confirmTransitionTo(a,"PUSH",r,function(t){if(t){var n=g.index+1,e=g.entries.slice(0);e.length>n?e.splice(n,e.length-n,a):e.push(a),u({action:"PUSH",location:a,index:n,entries:e})}})},replace:function(t,n){var e="REPLACE",a=createLocation(t,n,f(),g.location);h.confirmTransitionTo(a,e,r,function(t){t&&(g.entries[g.index]=a,u({action:e,location:a}))})},go:p,goBack:function(){p(-1)},goForward:function(){p(1)},canGo:function(t){var n=g.index+t;return 0<=n&&n<g.entries.length},block:function(t){return void 0===t&&(t=!1),h.setPrompt(t)},listen:function(t){return h.appendListener(t)}};return g}exports.createBrowserHistory=createBrowserHistory,exports.createHashHistory=createHashHistory,exports.createMemoryHistory=createMemoryHistory,exports.createLocation=createLocation,exports.locationsAreEqual=locationsAreEqual,exports.parsePath=parsePath,exports.createPath=createPath;
    
    },{"resolve-pathname":28,"tiny-invariant":29,"tiny-warning":30,"value-equal":33}],5:[function(require,module,exports){
    (function (process){(function (){
    'use strict';
    
    if (process.env.NODE_ENV === 'production') {
      module.exports = require('./cjs/history.min.js');
    } else {
      module.exports = require('./cjs/history.js');
    }
    
    }).call(this)}).call(this,require('_process'))
    },{"./cjs/history.js":3,"./cjs/history.min.js":4,"_process":11}],6:[function(require,module,exports){
    'use strict';
    
    var reactIs = require('react-is');
    
    /**
     * Copyright 2015, Yahoo! Inc.
     * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
     */
    var REACT_STATICS = {
      childContextTypes: true,
      contextType: true,
      contextTypes: true,
      defaultProps: true,
      displayName: true,
      getDefaultProps: true,
      getDerivedStateFromError: true,
      getDerivedStateFromProps: true,
      mixins: true,
      propTypes: true,
      type: true
    };
    var KNOWN_STATICS = {
      name: true,
      length: true,
      prototype: true,
      caller: true,
      callee: true,
      arguments: true,
      arity: true
    };
    var FORWARD_REF_STATICS = {
      '$$typeof': true,
      render: true,
      defaultProps: true,
      displayName: true,
      propTypes: true
    };
    var MEMO_STATICS = {
      '$$typeof': true,
      compare: true,
      defaultProps: true,
      displayName: true,
      propTypes: true,
      type: true
    };
    var TYPE_STATICS = {};
    TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
    TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;
    
    function getStatics(component) {
      // React v16.11 and below
      if (reactIs.isMemo(component)) {
        return MEMO_STATICS;
      } // React v16.12 and above
    
    
      return TYPE_STATICS[component['$$typeof']] || REACT_STATICS;
    }
    
    var defineProperty = Object.defineProperty;
    var getOwnPropertyNames = Object.getOwnPropertyNames;
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var getPrototypeOf = Object.getPrototypeOf;
    var objectPrototype = Object.prototype;
    function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
      if (typeof sourceComponent !== 'string') {
        // don't hoist over string (html) components
        if (objectPrototype) {
          var inheritedComponent = getPrototypeOf(sourceComponent);
    
          if (inheritedComponent && inheritedComponent !== objectPrototype) {
            hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
          }
        }
    
        var keys = getOwnPropertyNames(sourceComponent);
    
        if (getOwnPropertySymbols) {
          keys = keys.concat(getOwnPropertySymbols(sourceComponent));
        }
    
        var targetStatics = getStatics(targetComponent);
        var sourceStatics = getStatics(sourceComponent);
    
        for (var i = 0; i < keys.length; ++i) {
          var key = keys[i];
    
          if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
            var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
    
            try {
              // Avoid failures from read-only properties
              defineProperty(targetComponent, key, descriptor);
            } catch (e) {}
          }
        }
      }
    
      return targetComponent;
    }
    
    module.exports = hoistNonReactStatics;
    
    },{"react-is":19}],7:[function(require,module,exports){
    (function (process,global){(function (){
    'use strict';var React=require('react'),_inheritsLoose=require('@babel/runtime/helpers/inheritsLoose'),PropTypes=require('prop-types'),warning=require('tiny-warning');function _interopDefaultLegacy(e){return e&&typeof e==='object'&&'default'in e?e:{'default':e}}var React__default=/*#__PURE__*/_interopDefaultLegacy(React);var _inheritsLoose__default=/*#__PURE__*/_interopDefaultLegacy(_inheritsLoose);var PropTypes__default=/*#__PURE__*/_interopDefaultLegacy(PropTypes);var warning__default=/*#__PURE__*/_interopDefaultLegacy(warning);var MAX_SIGNED_31_BIT_INT = 1073741823;
    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {};
    
    function getUniqueId() {
      var key = '__global_unique_id__';
      return commonjsGlobal[key] = (commonjsGlobal[key] || 0) + 1;
    }
    
    function objectIs(x, y) {
      if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
      } else {
        return x !== x && y !== y;
      }
    }
    
    function createEventEmitter(value) {
      var handlers = [];
      return {
        on: function on(handler) {
          handlers.push(handler);
        },
        off: function off(handler) {
          handlers = handlers.filter(function (h) {
            return h !== handler;
          });
        },
        get: function get() {
          return value;
        },
        set: function set(newValue, changedBits) {
          value = newValue;
          handlers.forEach(function (handler) {
            return handler(value, changedBits);
          });
        }
      };
    }
    
    function onlyChild(children) {
      return Array.isArray(children) ? children[0] : children;
    }
    
    function createReactContext(defaultValue, calculateChangedBits) {
      var _Provider$childContex, _Consumer$contextType;
    
      var contextProp = '__create-react-context-' + getUniqueId() + '__';
    
      var Provider = /*#__PURE__*/function (_Component) {
        _inheritsLoose__default['default'](Provider, _Component);
    
        function Provider() {
          var _this;
    
          _this = _Component.apply(this, arguments) || this;
          _this.emitter = createEventEmitter(_this.props.value);
          return _this;
        }
    
        var _proto = Provider.prototype;
    
        _proto.getChildContext = function getChildContext() {
          var _ref;
    
          return _ref = {}, _ref[contextProp] = this.emitter, _ref;
        };
    
        _proto.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
          if (this.props.value !== nextProps.value) {
            var oldValue = this.props.value;
            var newValue = nextProps.value;
            var changedBits;
    
            if (objectIs(oldValue, newValue)) {
              changedBits = 0;
            } else {
              changedBits = typeof calculateChangedBits === 'function' ? calculateChangedBits(oldValue, newValue) : MAX_SIGNED_31_BIT_INT;
    
              if (process.env.NODE_ENV !== 'production') {
                warning__default['default']((changedBits & MAX_SIGNED_31_BIT_INT) === changedBits, 'calculateChangedBits: Expected the return value to be a ' + '31-bit integer. Instead received: ' + changedBits);
              }
    
              changedBits |= 0;
    
              if (changedBits !== 0) {
                this.emitter.set(nextProps.value, changedBits);
              }
            }
          }
        };
    
        _proto.render = function render() {
          return this.props.children;
        };
    
        return Provider;
      }(React.Component);
    
      Provider.childContextTypes = (_Provider$childContex = {}, _Provider$childContex[contextProp] = PropTypes__default['default'].object.isRequired, _Provider$childContex);
    
      var Consumer = /*#__PURE__*/function (_Component2) {
        _inheritsLoose__default['default'](Consumer, _Component2);
    
        function Consumer() {
          var _this2;
    
          _this2 = _Component2.apply(this, arguments) || this;
          _this2.state = {
            value: _this2.getValue()
          };
    
          _this2.onUpdate = function (newValue, changedBits) {
            var observedBits = _this2.observedBits | 0;
    
            if ((observedBits & changedBits) !== 0) {
              _this2.setState({
                value: _this2.getValue()
              });
            }
          };
    
          return _this2;
        }
    
        var _proto2 = Consumer.prototype;
    
        _proto2.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
          var observedBits = nextProps.observedBits;
          this.observedBits = observedBits === undefined || observedBits === null ? MAX_SIGNED_31_BIT_INT : observedBits;
        };
    
        _proto2.componentDidMount = function componentDidMount() {
          if (this.context[contextProp]) {
            this.context[contextProp].on(this.onUpdate);
          }
    
          var observedBits = this.props.observedBits;
          this.observedBits = observedBits === undefined || observedBits === null ? MAX_SIGNED_31_BIT_INT : observedBits;
        };
    
        _proto2.componentWillUnmount = function componentWillUnmount() {
          if (this.context[contextProp]) {
            this.context[contextProp].off(this.onUpdate);
          }
        };
    
        _proto2.getValue = function getValue() {
          if (this.context[contextProp]) {
            return this.context[contextProp].get();
          } else {
            return defaultValue;
          }
        };
    
        _proto2.render = function render() {
          return onlyChild(this.props.children)(this.state.value);
        };
    
        return Consumer;
      }(React.Component);
    
      Consumer.contextTypes = (_Consumer$contextType = {}, _Consumer$contextType[contextProp] = PropTypes__default['default'].object, _Consumer$contextType);
      return {
        Provider: Provider,
        Consumer: Consumer
      };
    }var index = React__default['default'].createContext || createReactContext;module.exports=index;
    }).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    },{"@babel/runtime/helpers/inheritsLoose":1,"_process":11,"prop-types":15,"react":undefined,"tiny-warning":30}],8:[function(require,module,exports){
    /*
    object-assign
    (c) Sindre Sorhus
    @license MIT
    */
    
    'use strict';
    /* eslint-disable no-unused-vars */
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var propIsEnumerable = Object.prototype.propertyIsEnumerable;
    
    function toObject(val) {
        if (val === null || val === undefined) {
            throw new TypeError('Object.assign cannot be called with null or undefined');
        }
    
        return Object(val);
    }
    
    function shouldUseNative() {
        try {
            if (!Object.assign) {
                return false;
            }
    
            // Detect buggy property enumeration order in older V8 versions.
    
            // https://bugs.chromium.org/p/v8/issues/detail?id=4118
            var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
            test1[5] = 'de';
            if (Object.getOwnPropertyNames(test1)[0] === '5') {
                return false;
            }
    
            // https://bugs.chromium.org/p/v8/issues/detail?id=3056
            var test2 = {};
            for (var i = 0; i < 10; i++) {
                test2['_' + String.fromCharCode(i)] = i;
            }
            var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
                return test2[n];
            });
            if (order2.join('') !== '0123456789') {
                return false;
            }
    
            // https://bugs.chromium.org/p/v8/issues/detail?id=3056
            var test3 = {};
            'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
                test3[letter] = letter;
            });
            if (Object.keys(Object.assign({}, test3)).join('') !==
                    'abcdefghijklmnopqrst') {
                return false;
            }
    
            return true;
        } catch (err) {
            // We don't expect any of the above to throw, but better to be safe.
            return false;
        }
    }
    
    module.exports = shouldUseNative() ? Object.assign : function (target, source) {
        var from;
        var to = toObject(target);
        var symbols;
    
        for (var s = 1; s < arguments.length; s++) {
            from = Object(arguments[s]);
    
            for (var key in from) {
                if (hasOwnProperty.call(from, key)) {
                    to[key] = from[key];
                }
            }
    
            if (getOwnPropertySymbols) {
                symbols = getOwnPropertySymbols(from);
                for (var i = 0; i < symbols.length; i++) {
                    if (propIsEnumerable.call(from, symbols[i])) {
                        to[symbols[i]] = from[symbols[i]];
                    }
                }
            }
        }
    
        return to;
    };
    
    },{}],9:[function(require,module,exports){
    var isarray = require('isarray')
    
    /**
     * Expose `pathToRegexp`.
     */
    module.exports = pathToRegexp
    module.exports.parse = parse
    module.exports.compile = compile
    module.exports.tokensToFunction = tokensToFunction
    module.exports.tokensToRegExp = tokensToRegExp
    
    /**
     * The main path matching regexp utility.
     *
     * @type {RegExp}
     */
    var PATH_REGEXP = new RegExp([
      // Match escaped characters that would otherwise appear in future matches.
      // This allows the user to escape special characters that won't transform.
      '(\\\\.)',
      // Match Express-style parameters and un-named parameters with a prefix
      // and optional suffixes. Matches appear as:
      //
      // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
      // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
      // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
      '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
    ].join('|'), 'g')
    
    /**
     * Parse a string for the raw tokens.
     *
     * @param  {string}  str
     * @param  {Object=} options
     * @return {!Array}
     */
    function parse (str, options) {
      var tokens = []
      var key = 0
      var index = 0
      var path = ''
      var defaultDelimiter = options && options.delimiter || '/'
      var res
    
      while ((res = PATH_REGEXP.exec(str)) != null) {
        var m = res[0]
        var escaped = res[1]
        var offset = res.index
        path += str.slice(index, offset)
        index = offset + m.length
    
        // Ignore already escaped sequences.
        if (escaped) {
          path += escaped[1]
          continue
        }
    
        var next = str[index]
        var prefix = res[2]
        var name = res[3]
        var capture = res[4]
        var group = res[5]
        var modifier = res[6]
        var asterisk = res[7]
    
        // Push the current path onto the tokens.
        if (path) {
          tokens.push(path)
          path = ''
        }
    
        var partial = prefix != null && next != null && next !== prefix
        var repeat = modifier === '+' || modifier === '*'
        var optional = modifier === '?' || modifier === '*'
        var delimiter = res[2] || defaultDelimiter
        var pattern = capture || group
    
        tokens.push({
          name: name || key++,
          prefix: prefix || '',
          delimiter: delimiter,
          optional: optional,
          repeat: repeat,
          partial: partial,
          asterisk: !!asterisk,
          pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
        })
      }
    
      // Match any characters still remaining.
      if (index < str.length) {
        path += str.substr(index)
      }
    
      // If the path exists, push it onto the end.
      if (path) {
        tokens.push(path)
      }
    
      return tokens
    }
    
    /**
     * Compile a string to a template function for the path.
     *
     * @param  {string}             str
     * @param  {Object=}            options
     * @return {!function(Object=, Object=)}
     */
    function compile (str, options) {
      return tokensToFunction(parse(str, options), options)
    }
    
    /**
     * Prettier encoding of URI path segments.
     *
     * @param  {string}
     * @return {string}
     */
    function encodeURIComponentPretty (str) {
      return encodeURI(str).replace(/[\/?#]/g, function (c) {
        return '%' + c.charCodeAt(0).toString(16).toUpperCase()
      })
    }
    
    /**
     * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
     *
     * @param  {string}
     * @return {string}
     */
    function encodeAsterisk (str) {
      return encodeURI(str).replace(/[?#]/g, function (c) {
        return '%' + c.charCodeAt(0).toString(16).toUpperCase()
      })
    }
    
    /**
     * Expose a method for transforming tokens into the path function.
     */
    function tokensToFunction (tokens, options) {
      // Compile all the tokens into regexps.
      var matches = new Array(tokens.length)
    
      // Compile all the patterns before compilation.
      for (var i = 0; i < tokens.length; i++) {
        if (typeof tokens[i] === 'object') {
          matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$', flags(options))
        }
      }
    
      return function (obj, opts) {
        var path = ''
        var data = obj || {}
        var options = opts || {}
        var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent
    
        for (var i = 0; i < tokens.length; i++) {
          var token = tokens[i]
    
          if (typeof token === 'string') {
            path += token
    
            continue
          }
    
          var value = data[token.name]
          var segment
    
          if (value == null) {
            if (token.optional) {
              // Prepend partial segment prefixes.
              if (token.partial) {
                path += token.prefix
              }
    
              continue
            } else {
              throw new TypeError('Expected "' + token.name + '" to be defined')
            }
          }
    
          if (isarray(value)) {
            if (!token.repeat) {
              throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
            }
    
            if (value.length === 0) {
              if (token.optional) {
                continue
              } else {
                throw new TypeError('Expected "' + token.name + '" to not be empty')
              }
            }
    
            for (var j = 0; j < value.length; j++) {
              segment = encode(value[j])
    
              if (!matches[i].test(segment)) {
                throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
              }
    
              path += (j === 0 ? token.prefix : token.delimiter) + segment
            }
    
            continue
          }
    
          segment = token.asterisk ? encodeAsterisk(value) : encode(value)
    
          if (!matches[i].test(segment)) {
            throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
          }
    
          path += token.prefix + segment
        }
    
        return path
      }
    }
    
    /**
     * Escape a regular expression string.
     *
     * @param  {string} str
     * @return {string}
     */
    function escapeString (str) {
      return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
    }
    
    /**
     * Escape the capturing group by escaping special characters and meaning.
     *
     * @param  {string} group
     * @return {string}
     */
    function escapeGroup (group) {
      return group.replace(/([=!:$\/()])/g, '\\$1')
    }
    
    /**
     * Attach the keys as a property of the regexp.
     *
     * @param  {!RegExp} re
     * @param  {Array}   keys
     * @return {!RegExp}
     */
    function attachKeys (re, keys) {
      re.keys = keys
      return re
    }
    
    /**
     * Get the flags for a regexp from the options.
     *
     * @param  {Object} options
     * @return {string}
     */
    function flags (options) {
      return options && options.sensitive ? '' : 'i'
    }
    
    /**
     * Pull out keys from a regexp.
     *
     * @param  {!RegExp} path
     * @param  {!Array}  keys
     * @return {!RegExp}
     */
    function regexpToRegexp (path, keys) {
      // Use a negative lookahead to match only capturing groups.
      var groups = path.source.match(/\((?!\?)/g)
    
      if (groups) {
        for (var i = 0; i < groups.length; i++) {
          keys.push({
            name: i,
            prefix: null,
            delimiter: null,
            optional: false,
            repeat: false,
            partial: false,
            asterisk: false,
            pattern: null
          })
        }
      }
    
      return attachKeys(path, keys)
    }
    
    /**
     * Transform an array into a regexp.
     *
     * @param  {!Array}  path
     * @param  {Array}   keys
     * @param  {!Object} options
     * @return {!RegExp}
     */
    function arrayToRegexp (path, keys, options) {
      var parts = []
    
      for (var i = 0; i < path.length; i++) {
        parts.push(pathToRegexp(path[i], keys, options).source)
      }
    
      var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))
    
      return attachKeys(regexp, keys)
    }
    
    /**
     * Create a path regexp from string input.
     *
     * @param  {string}  path
     * @param  {!Array}  keys
     * @param  {!Object} options
     * @return {!RegExp}
     */
    function stringToRegexp (path, keys, options) {
      return tokensToRegExp(parse(path, options), keys, options)
    }
    
    /**
     * Expose a function for taking tokens and returning a RegExp.
     *
     * @param  {!Array}          tokens
     * @param  {(Array|Object)=} keys
     * @param  {Object=}         options
     * @return {!RegExp}
     */
    function tokensToRegExp (tokens, keys, options) {
      if (!isarray(keys)) {
        options = /** @type {!Object} */ (keys || options)
        keys = []
      }
    
      options = options || {}
    
      var strict = options.strict
      var end = options.end !== false
      var route = ''
    
      // Iterate over the tokens and create our regexp string.
      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i]
    
        if (typeof token === 'string') {
          route += escapeString(token)
        } else {
          var prefix = escapeString(token.prefix)
          var capture = '(?:' + token.pattern + ')'
    
          keys.push(token)
    
          if (token.repeat) {
            capture += '(?:' + prefix + capture + ')*'
          }
    
          if (token.optional) {
            if (!token.partial) {
              capture = '(?:' + prefix + '(' + capture + '))?'
            } else {
              capture = prefix + '(' + capture + ')?'
            }
          } else {
            capture = prefix + '(' + capture + ')'
          }
    
          route += capture
        }
      }
    
      var delimiter = escapeString(options.delimiter || '/')
      var endsWithDelimiter = route.slice(-delimiter.length) === delimiter
    
      // In non-strict mode we allow a slash at the end of match. If the path to
      // match already ends with a slash, we remove it for consistency. The slash
      // is valid at the end of a path match, not in the middle. This is important
      // in non-ending mode, where "/test/" shouldn't match "/test//route".
      if (!strict) {
        route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?'
      }
    
      if (end) {
        route += '$'
      } else {
        // In non-ending mode, we need the capturing groups to match as much as
        // possible by using a positive lookahead to the end or next path segment.
        route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)'
      }
    
      return attachKeys(new RegExp('^' + route, flags(options)), keys)
    }
    
    /**
     * Normalize the given path string, returning a regular expression.
     *
     * An empty array can be passed in for the keys, which will hold the
     * placeholder key descriptions. For example, using `/user/:id`, `keys` will
     * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
     *
     * @param  {(string|RegExp|Array)} path
     * @param  {(Array|Object)=}       keys
     * @param  {Object=}               options
     * @return {!RegExp}
     */
    function pathToRegexp (path, keys, options) {
      if (!isarray(keys)) {
        options = /** @type {!Object} */ (keys || options)
        keys = []
      }
    
      options = options || {}
    
      if (path instanceof RegExp) {
        return regexpToRegexp(path, /** @type {!Array} */ (keys))
      }
    
      if (isarray(path)) {
        return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
      }
    
      return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
    }
    
    },{"isarray":10}],10:[function(require,module,exports){
    module.exports = Array.isArray || function (arr) {
      return Object.prototype.toString.call(arr) == '[object Array]';
    };
    
    },{}],11:[function(require,module,exports){
    // shim for using process in browser
    var process = module.exports = {};
    
    // cached from whatever global is present so that test runners that stub it
    // don't break things.  But we need to wrap it in a try catch in case it is
    // wrapped in strict mode code which doesn't define any globals.  It's inside a
    // function because try/catches deoptimize in certain engines.
    
    var cachedSetTimeout;
    var cachedClearTimeout;
    
    function defaultSetTimout() {
        throw new Error('setTimeout has not been defined');
    }
    function defaultClearTimeout () {
        throw new Error('clearTimeout has not been defined');
    }
    (function () {
        try {
            if (typeof setTimeout === 'function') {
                cachedSetTimeout = setTimeout;
            } else {
                cachedSetTimeout = defaultSetTimout;
            }
        } catch (e) {
            cachedSetTimeout = defaultSetTimout;
        }
        try {
            if (typeof clearTimeout === 'function') {
                cachedClearTimeout = clearTimeout;
            } else {
                cachedClearTimeout = defaultClearTimeout;
            }
        } catch (e) {
            cachedClearTimeout = defaultClearTimeout;
        }
    } ())
    function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
            //normal enviroments in sane situations
            return setTimeout(fun, 0);
        }
        // if setTimeout wasn't available but was latter defined
        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
            cachedSetTimeout = setTimeout;
            return setTimeout(fun, 0);
        }
        try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedSetTimeout(fun, 0);
        } catch(e){
            try {
                // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                return cachedSetTimeout.call(null, fun, 0);
            } catch(e){
                // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                return cachedSetTimeout.call(this, fun, 0);
            }
        }
    
    
    }
    function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
            //normal enviroments in sane situations
            return clearTimeout(marker);
        }
        // if clearTimeout wasn't available but was latter defined
        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
            cachedClearTimeout = clearTimeout;
            return clearTimeout(marker);
        }
        try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedClearTimeout(marker);
        } catch (e){
            try {
                // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                return cachedClearTimeout.call(null, marker);
            } catch (e){
                // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                return cachedClearTimeout.call(this, marker);
            }
        }
    
    
    
    }
    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;
    
    function cleanUpNextTick() {
        if (!draining || !currentQueue) {
            return;
        }
        draining = false;
        if (currentQueue.length) {
            queue = currentQueue.concat(queue);
        } else {
            queueIndex = -1;
        }
        if (queue.length) {
            drainQueue();
        }
    }
    
    function drainQueue() {
        if (draining) {
            return;
        }
        var timeout = runTimeout(cleanUpNextTick);
        draining = true;
    
        var len = queue.length;
        while(len) {
            currentQueue = queue;
            queue = [];
            while (++queueIndex < len) {
                if (currentQueue) {
                    currentQueue[queueIndex].run();
                }
            }
            queueIndex = -1;
            len = queue.length;
        }
        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
    }
    
    process.nextTick = function (fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
                args[i - 1] = arguments[i];
            }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
            runTimeout(drainQueue);
        }
    };
    
    // v8 likes predictible objects
    function Item(fun, array) {
        this.fun = fun;
        this.array = array;
    }
    Item.prototype.run = function () {
        this.fun.apply(null, this.array);
    };
    process.title = 'browser';
    process.browser = true;
    process.env = {};
    process.argv = [];
    process.version = ''; // empty string to avoid regexp issues
    process.versions = {};
    
    function noop() {}
    
    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;
    process.prependListener = noop;
    process.prependOnceListener = noop;
    
    process.listeners = function (name) { return [] }
    
    process.binding = function (name) {
        throw new Error('process.binding is not supported');
    };
    
    process.cwd = function () { return '/' };
    process.chdir = function (dir) {
        throw new Error('process.chdir is not supported');
    };
    process.umask = function() { return 0; };
    
    },{}],12:[function(require,module,exports){
    (function (process){(function (){
    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    
    'use strict';
    
    var printWarning = function() {};
    
    if (process.env.NODE_ENV !== 'production') {
      var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');
      var loggedTypeFailures = {};
      var has = Function.call.bind(Object.prototype.hasOwnProperty);
    
      printWarning = function(text) {
        var message = 'Warning: ' + text;
        if (typeof console !== 'undefined') {
          console.error(message);
        }
        try {
          // --- Welcome to debugging React ---
          // This error was thrown as a convenience so that you can use this stack
          // to find the callsite that caused this warning to fire.
          throw new Error(message);
        } catch (x) {}
      };
    }
    
    /**
     * Assert that the values match with the type specs.
     * Error messages are memorized and will only be shown once.
     *
     * @param {object} typeSpecs Map of name to a ReactPropType
     * @param {object} values Runtime values that need to be type-checked
     * @param {string} location e.g. "prop", "context", "child context"
     * @param {string} componentName Name of the component for error messages.
     * @param {?Function} getStack Returns the component stack.
     * @private
     */
    function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
      if (process.env.NODE_ENV !== 'production') {
        for (var typeSpecName in typeSpecs) {
          if (has(typeSpecs, typeSpecName)) {
            var error;
            // Prop type validation may throw. In case they do, we don't want to
            // fail the render phase where it didn't fail before. So we log it.
            // After these have been cleaned up, we'll let them throw.
            try {
              // This is intentionally an invariant that gets caught. It's the same
              // behavior as without this statement except with a better message.
              if (typeof typeSpecs[typeSpecName] !== 'function') {
                var err = Error(
                  (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
                  'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
                );
                err.name = 'Invariant Violation';
                throw err;
              }
              error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
            } catch (ex) {
              error = ex;
            }
            if (error && !(error instanceof Error)) {
              printWarning(
                (componentName || 'React class') + ': type specification of ' +
                location + ' `' + typeSpecName + '` is invalid; the type checker ' +
                'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
                'You may have forgotten to pass an argument to the type checker ' +
                'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
                'shape all require an argument).'
              );
            }
            if (error instanceof Error && !(error.message in loggedTypeFailures)) {
              // Only monitor this failure once because there tends to be a lot of the
              // same error.
              loggedTypeFailures[error.message] = true;
    
              var stack = getStack ? getStack() : '';
    
              printWarning(
                'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
              );
            }
          }
        }
      }
    }
    
    /**
     * Resets warning cache when testing.
     *
     * @private
     */
    checkPropTypes.resetWarningCache = function() {
      if (process.env.NODE_ENV !== 'production') {
        loggedTypeFailures = {};
      }
    }
    
    module.exports = checkPropTypes;
    
    }).call(this)}).call(this,require('_process'))
    },{"./lib/ReactPropTypesSecret":16,"_process":11}],13:[function(require,module,exports){
    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    
    'use strict';
    
    var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');
    
    function emptyFunction() {}
    function emptyFunctionWithReset() {}
    emptyFunctionWithReset.resetWarningCache = emptyFunction;
    
    module.exports = function() {
      function shim(props, propName, componentName, location, propFullName, secret) {
        if (secret === ReactPropTypesSecret) {
          // It is still safe when called from React.
          return;
        }
        var err = new Error(
          'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
          'Use PropTypes.checkPropTypes() to call them. ' +
          'Read more at http://fb.me/use-check-prop-types'
        );
        err.name = 'Invariant Violation';
        throw err;
      };
      shim.isRequired = shim;
      function getShim() {
        return shim;
      };
      // Important!
      // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
      var ReactPropTypes = {
        array: shim,
        bool: shim,
        func: shim,
        number: shim,
        object: shim,
        string: shim,
        symbol: shim,
    
        any: shim,
        arrayOf: getShim,
        element: shim,
        elementType: shim,
        instanceOf: getShim,
        node: shim,
        objectOf: getShim,
        oneOf: getShim,
        oneOfType: getShim,
        shape: getShim,
        exact: getShim,
    
        checkPropTypes: emptyFunctionWithReset,
        resetWarningCache: emptyFunction
      };
    
      ReactPropTypes.PropTypes = ReactPropTypes;
    
      return ReactPropTypes;
    };
    
    },{"./lib/ReactPropTypesSecret":16}],14:[function(require,module,exports){
    (function (process){(function (){
    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    
    'use strict';
    
    var ReactIs = require('react-is');
    var assign = require('object-assign');
    
    var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');
    var checkPropTypes = require('./checkPropTypes');
    
    var has = Function.call.bind(Object.prototype.hasOwnProperty);
    var printWarning = function() {};
    
    if (process.env.NODE_ENV !== 'production') {
      printWarning = function(text) {
        var message = 'Warning: ' + text;
        if (typeof console !== 'undefined') {
          console.error(message);
        }
        try {
          // --- Welcome to debugging React ---
          // This error was thrown as a convenience so that you can use this stack
          // to find the callsite that caused this warning to fire.
          throw new Error(message);
        } catch (x) {}
      };
    }
    
    function emptyFunctionThatReturnsNull() {
      return null;
    }
    
    module.exports = function(isValidElement, throwOnDirectAccess) {
      /* global Symbol */
      var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
      var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.
    
      /**
       * Returns the iterator method function contained on the iterable object.
       *
       * Be sure to invoke the function with the iterable as context:
       *
       *     var iteratorFn = getIteratorFn(myIterable);
       *     if (iteratorFn) {
       *       var iterator = iteratorFn.call(myIterable);
       *       ...
       *     }
       *
       * @param {?object} maybeIterable
       * @return {?function}
       */
      function getIteratorFn(maybeIterable) {
        var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
        if (typeof iteratorFn === 'function') {
          return iteratorFn;
        }
      }
    
      /**
       * Collection of methods that allow declaration and validation of props that are
       * supplied to React components. Example usage:
       *
       *   var Props = require('ReactPropTypes');
       *   var MyArticle = React.createClass({
       *     propTypes: {
       *       // An optional string prop named "description".
       *       description: Props.string,
       *
       *       // A required enum prop named "category".
       *       category: Props.oneOf(['News','Photos']).isRequired,
       *
       *       // A prop named "dialog" that requires an instance of Dialog.
       *       dialog: Props.instanceOf(Dialog).isRequired
       *     },
       *     render: function() { ... }
       *   });
       *
       * A more formal specification of how these methods are used:
       *
       *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
       *   decl := ReactPropTypes.{type}(.isRequired)?
       *
       * Each and every declaration produces a function with the same signature. This
       * allows the creation of custom validation functions. For example:
       *
       *  var MyLink = React.createClass({
       *    propTypes: {
       *      // An optional string or URI prop named "href".
       *      href: function(props, propName, componentName) {
       *        var propValue = props[propName];
       *        if (propValue != null && typeof propValue !== 'string' &&
       *            !(propValue instanceof URI)) {
       *          return new Error(
       *            'Expected a string or an URI for ' + propName + ' in ' +
       *            componentName
       *          );
       *        }
       *      }
       *    },
       *    render: function() {...}
       *  });
       *
       * @internal
       */
    
      var ANONYMOUS = '<<anonymous>>';
    
      // Important!
      // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
      var ReactPropTypes = {
        array: createPrimitiveTypeChecker('array'),
        bool: createPrimitiveTypeChecker('boolean'),
        func: createPrimitiveTypeChecker('function'),
        number: createPrimitiveTypeChecker('number'),
        object: createPrimitiveTypeChecker('object'),
        string: createPrimitiveTypeChecker('string'),
        symbol: createPrimitiveTypeChecker('symbol'),
    
        any: createAnyTypeChecker(),
        arrayOf: createArrayOfTypeChecker,
        element: createElementTypeChecker(),
        elementType: createElementTypeTypeChecker(),
        instanceOf: createInstanceTypeChecker,
        node: createNodeChecker(),
        objectOf: createObjectOfTypeChecker,
        oneOf: createEnumTypeChecker,
        oneOfType: createUnionTypeChecker,
        shape: createShapeTypeChecker,
        exact: createStrictShapeTypeChecker,
      };
    
      /**
       * inlined Object.is polyfill to avoid requiring consumers ship their own
       * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
       */
      /*eslint-disable no-self-compare*/
      function is(x, y) {
        // SameValue algorithm
        if (x === y) {
          // Steps 1-5, 7-10
          // Steps 6.b-6.e: +0 != -0
          return x !== 0 || 1 / x === 1 / y;
        } else {
          // Step 6.a: NaN == NaN
          return x !== x && y !== y;
        }
      }
      /*eslint-enable no-self-compare*/
    
      /**
       * We use an Error-like object for backward compatibility as people may call
       * PropTypes directly and inspect their output. However, we don't use real
       * Errors anymore. We don't inspect their stack anyway, and creating them
       * is prohibitively expensive if they are created too often, such as what
       * happens in oneOfType() for any type before the one that matched.
       */
      function PropTypeError(message) {
        this.message = message;
        this.stack = '';
      }
      // Make `instanceof Error` still work for returned errors.
      PropTypeError.prototype = Error.prototype;
    
      function createChainableTypeChecker(validate) {
        if (process.env.NODE_ENV !== 'production') {
          var manualPropTypeCallCache = {};
          var manualPropTypeWarningCount = 0;
        }
        function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
          componentName = componentName || ANONYMOUS;
          propFullName = propFullName || propName;
    
          if (secret !== ReactPropTypesSecret) {
            if (throwOnDirectAccess) {
              // New behavior only for users of `prop-types` package
              var err = new Error(
                'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
                'Use `PropTypes.checkPropTypes()` to call them. ' +
                'Read more at http://fb.me/use-check-prop-types'
              );
              err.name = 'Invariant Violation';
              throw err;
            } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
              // Old behavior for people using React.PropTypes
              var cacheKey = componentName + ':' + propName;
              if (
                !manualPropTypeCallCache[cacheKey] &&
                // Avoid spamming the console because they are often not actionable except for lib authors
                manualPropTypeWarningCount < 3
              ) {
                printWarning(
                  'You are manually calling a React.PropTypes validation ' +
                  'function for the `' + propFullName + '` prop on `' + componentName  + '`. This is deprecated ' +
                  'and will throw in the standalone `prop-types` package. ' +
                  'You may be seeing this warning due to a third-party PropTypes ' +
                  'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
                );
                manualPropTypeCallCache[cacheKey] = true;
                manualPropTypeWarningCount++;
              }
            }
          }
          if (props[propName] == null) {
            if (isRequired) {
              if (props[propName] === null) {
                return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
              }
              return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
            }
            return null;
          } else {
            return validate(props, propName, componentName, location, propFullName);
          }
        }
    
        var chainedCheckType = checkType.bind(null, false);
        chainedCheckType.isRequired = checkType.bind(null, true);
    
        return chainedCheckType;
      }
    
      function createPrimitiveTypeChecker(expectedType) {
        function validate(props, propName, componentName, location, propFullName, secret) {
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== expectedType) {
            // `propValue` being instance of, say, date/regexp, pass the 'object'
            // check, but we can offer a more precise error message here rather than
            // 'of type `object`'.
            var preciseType = getPreciseType(propValue);
    
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
    
      function createAnyTypeChecker() {
        return createChainableTypeChecker(emptyFunctionThatReturnsNull);
      }
    
      function createArrayOfTypeChecker(typeChecker) {
        function validate(props, propName, componentName, location, propFullName) {
          if (typeof typeChecker !== 'function') {
            return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
          }
          var propValue = props[propName];
          if (!Array.isArray(propValue)) {
            var propType = getPropType(propValue);
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
          }
          for (var i = 0; i < propValue.length; i++) {
            var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
            if (error instanceof Error) {
              return error;
            }
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
    
      function createElementTypeChecker() {
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          if (!isValidElement(propValue)) {
            var propType = getPropType(propValue);
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
    
      function createElementTypeTypeChecker() {
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          if (!ReactIs.isValidElementType(propValue)) {
            var propType = getPropType(propValue);
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
    
      function createInstanceTypeChecker(expectedClass) {
        function validate(props, propName, componentName, location, propFullName) {
          if (!(props[propName] instanceof expectedClass)) {
            var expectedClassName = expectedClass.name || ANONYMOUS;
            var actualClassName = getClassName(props[propName]);
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
    
      function createEnumTypeChecker(expectedValues) {
        if (!Array.isArray(expectedValues)) {
          if (process.env.NODE_ENV !== 'production') {
            if (arguments.length > 1) {
              printWarning(
                'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
                'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
              );
            } else {
              printWarning('Invalid argument supplied to oneOf, expected an array.');
            }
          }
          return emptyFunctionThatReturnsNull;
        }
    
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          for (var i = 0; i < expectedValues.length; i++) {
            if (is(propValue, expectedValues[i])) {
              return null;
            }
          }
    
          var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
            var type = getPreciseType(value);
            if (type === 'symbol') {
              return String(value);
            }
            return value;
          });
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
        }
        return createChainableTypeChecker(validate);
      }
    
      function createObjectOfTypeChecker(typeChecker) {
        function validate(props, propName, componentName, location, propFullName) {
          if (typeof typeChecker !== 'function') {
            return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
          }
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== 'object') {
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
          }
          for (var key in propValue) {
            if (has(propValue, key)) {
              var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
              if (error instanceof Error) {
                return error;
              }
            }
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
    
      function createUnionTypeChecker(arrayOfTypeCheckers) {
        if (!Array.isArray(arrayOfTypeCheckers)) {
          process.env.NODE_ENV !== 'production' ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
          return emptyFunctionThatReturnsNull;
        }
    
        for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
          var checker = arrayOfTypeCheckers[i];
          if (typeof checker !== 'function') {
            printWarning(
              'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
              'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
            );
            return emptyFunctionThatReturnsNull;
          }
        }
    
        function validate(props, propName, componentName, location, propFullName) {
          for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
            var checker = arrayOfTypeCheckers[i];
            if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
              return null;
            }
          }
    
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
        }
        return createChainableTypeChecker(validate);
      }
    
      function createNodeChecker() {
        function validate(props, propName, componentName, location, propFullName) {
          if (!isNode(props[propName])) {
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
    
      function createShapeTypeChecker(shapeTypes) {
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== 'object') {
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
          }
          for (var key in shapeTypes) {
            var checker = shapeTypes[key];
            if (!checker) {
              continue;
            }
            var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
            if (error) {
              return error;
            }
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
    
      function createStrictShapeTypeChecker(shapeTypes) {
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== 'object') {
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
          }
          // We need to check all keys in case some are required but missing from
          // props.
          var allKeys = assign({}, props[propName], shapeTypes);
          for (var key in allKeys) {
            var checker = shapeTypes[key];
            if (!checker) {
              return new PropTypeError(
                'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
                '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
                '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
              );
            }
            var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
            if (error) {
              return error;
            }
          }
          return null;
        }
    
        return createChainableTypeChecker(validate);
      }
    
      function isNode(propValue) {
        switch (typeof propValue) {
          case 'number':
          case 'string':
          case 'undefined':
            return true;
          case 'boolean':
            return !propValue;
          case 'object':
            if (Array.isArray(propValue)) {
              return propValue.every(isNode);
            }
            if (propValue === null || isValidElement(propValue)) {
              return true;
            }
    
            var iteratorFn = getIteratorFn(propValue);
            if (iteratorFn) {
              var iterator = iteratorFn.call(propValue);
              var step;
              if (iteratorFn !== propValue.entries) {
                while (!(step = iterator.next()).done) {
                  if (!isNode(step.value)) {
                    return false;
                  }
                }
              } else {
                // Iterator will provide entry [k,v] tuples rather than values.
                while (!(step = iterator.next()).done) {
                  var entry = step.value;
                  if (entry) {
                    if (!isNode(entry[1])) {
                      return false;
                    }
                  }
                }
              }
            } else {
              return false;
            }
    
            return true;
          default:
            return false;
        }
      }
    
      function isSymbol(propType, propValue) {
        // Native Symbol.
        if (propType === 'symbol') {
          return true;
        }
    
        // falsy value can't be a Symbol
        if (!propValue) {
          return false;
        }
    
        // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
        if (propValue['@@toStringTag'] === 'Symbol') {
          return true;
        }
    
        // Fallback for non-spec compliant Symbols which are polyfilled.
        if (typeof Symbol === 'function' && propValue instanceof Symbol) {
          return true;
        }
    
        return false;
      }
    
      // Equivalent of `typeof` but with special handling for array and regexp.
      function getPropType(propValue) {
        var propType = typeof propValue;
        if (Array.isArray(propValue)) {
          return 'array';
        }
        if (propValue instanceof RegExp) {
          // Old webkits (at least until Android 4.0) return 'function' rather than
          // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
          // passes PropTypes.object.
          return 'object';
        }
        if (isSymbol(propType, propValue)) {
          return 'symbol';
        }
        return propType;
      }
    
      // This handles more types than `getPropType`. Only used for error messages.
      // See `createPrimitiveTypeChecker`.
      function getPreciseType(propValue) {
        if (typeof propValue === 'undefined' || propValue === null) {
          return '' + propValue;
        }
        var propType = getPropType(propValue);
        if (propType === 'object') {
          if (propValue instanceof Date) {
            return 'date';
          } else if (propValue instanceof RegExp) {
            return 'regexp';
          }
        }
        return propType;
      }
    
      // Returns a string that is postfixed to a warning about an invalid type.
      // For example, "undefined" or "of type array"
      function getPostfixForTypeWarning(value) {
        var type = getPreciseType(value);
        switch (type) {
          case 'array':
          case 'object':
            return 'an ' + type;
          case 'boolean':
          case 'date':
          case 'regexp':
            return 'a ' + type;
          default:
            return type;
        }
      }
    
      // Returns class name of the object, if any.
      function getClassName(propValue) {
        if (!propValue.constructor || !propValue.constructor.name) {
          return ANONYMOUS;
        }
        return propValue.constructor.name;
      }
    
      ReactPropTypes.checkPropTypes = checkPropTypes;
      ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
      ReactPropTypes.PropTypes = ReactPropTypes;
    
      return ReactPropTypes;
    };
    
    }).call(this)}).call(this,require('_process'))
    },{"./checkPropTypes":12,"./lib/ReactPropTypesSecret":16,"_process":11,"object-assign":8,"react-is":19}],15:[function(require,module,exports){
    (function (process){(function (){
    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    
    if (process.env.NODE_ENV !== 'production') {
      var ReactIs = require('react-is');
    
      // By explicitly using `prop-types` you are opting into new development behavior.
      // http://fb.me/prop-types-in-prod
      var throwOnDirectAccess = true;
      module.exports = require('./factoryWithTypeCheckers')(ReactIs.isElement, throwOnDirectAccess);
    } else {
      // By explicitly using `prop-types` you are opting into new production behavior.
      // http://fb.me/prop-types-in-prod
      module.exports = require('./factoryWithThrowingShims')();
    }
    
    }).call(this)}).call(this,require('_process'))
    },{"./factoryWithThrowingShims":13,"./factoryWithTypeCheckers":14,"_process":11,"react-is":19}],16:[function(require,module,exports){
    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    
    'use strict';
    
    var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';
    
    module.exports = ReactPropTypesSecret;
    
    },{}],17:[function(require,module,exports){
    (function (process){(function (){
    /** @license React v16.13.1
     * react-is.development.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    
    'use strict';
    
    
    
    if (process.env.NODE_ENV !== "production") {
      (function() {
    'use strict';
    
    // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
    // nor polyfill, then a plain number is used for performance.
    var hasSymbol = typeof Symbol === 'function' && Symbol.for;
    var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
    var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
    var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
    var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
    var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
    var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
    var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
    // (unstable) APIs that have been removed. Can we remove the symbols?
    
    var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
    var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
    var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
    var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
    var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
    var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
    var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
    var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
    var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
    var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
    var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;
    
    function isValidElementType(type) {
      return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
      type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
    }
    
    function typeOf(object) {
      if (typeof object === 'object' && object !== null) {
        var $$typeof = object.$$typeof;
    
        switch ($$typeof) {
          case REACT_ELEMENT_TYPE:
            var type = object.type;
    
            switch (type) {
              case REACT_ASYNC_MODE_TYPE:
              case REACT_CONCURRENT_MODE_TYPE:
              case REACT_FRAGMENT_TYPE:
              case REACT_PROFILER_TYPE:
              case REACT_STRICT_MODE_TYPE:
              case REACT_SUSPENSE_TYPE:
                return type;
    
              default:
                var $$typeofType = type && type.$$typeof;
    
                switch ($$typeofType) {
                  case REACT_CONTEXT_TYPE:
                  case REACT_FORWARD_REF_TYPE:
                  case REACT_LAZY_TYPE:
                  case REACT_MEMO_TYPE:
                  case REACT_PROVIDER_TYPE:
                    return $$typeofType;
    
                  default:
                    return $$typeof;
                }
    
            }
    
          case REACT_PORTAL_TYPE:
            return $$typeof;
        }
      }
    
      return undefined;
    } // AsyncMode is deprecated along with isAsyncMode
    
    var AsyncMode = REACT_ASYNC_MODE_TYPE;
    var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
    var ContextConsumer = REACT_CONTEXT_TYPE;
    var ContextProvider = REACT_PROVIDER_TYPE;
    var Element = REACT_ELEMENT_TYPE;
    var ForwardRef = REACT_FORWARD_REF_TYPE;
    var Fragment = REACT_FRAGMENT_TYPE;
    var Lazy = REACT_LAZY_TYPE;
    var Memo = REACT_MEMO_TYPE;
    var Portal = REACT_PORTAL_TYPE;
    var Profiler = REACT_PROFILER_TYPE;
    var StrictMode = REACT_STRICT_MODE_TYPE;
    var Suspense = REACT_SUSPENSE_TYPE;
    var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated
    
    function isAsyncMode(object) {
      {
        if (!hasWarnedAboutDeprecatedIsAsyncMode) {
          hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint
    
          console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
        }
      }
    
      return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
    }
    function isConcurrentMode(object) {
      return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
    }
    function isContextConsumer(object) {
      return typeOf(object) === REACT_CONTEXT_TYPE;
    }
    function isContextProvider(object) {
      return typeOf(object) === REACT_PROVIDER_TYPE;
    }
    function isElement(object) {
      return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    function isForwardRef(object) {
      return typeOf(object) === REACT_FORWARD_REF_TYPE;
    }
    function isFragment(object) {
      return typeOf(object) === REACT_FRAGMENT_TYPE;
    }
    function isLazy(object) {
      return typeOf(object) === REACT_LAZY_TYPE;
    }
    function isMemo(object) {
      return typeOf(object) === REACT_MEMO_TYPE;
    }
    function isPortal(object) {
      return typeOf(object) === REACT_PORTAL_TYPE;
    }
    function isProfiler(object) {
      return typeOf(object) === REACT_PROFILER_TYPE;
    }
    function isStrictMode(object) {
      return typeOf(object) === REACT_STRICT_MODE_TYPE;
    }
    function isSuspense(object) {
      return typeOf(object) === REACT_SUSPENSE_TYPE;
    }
    
    exports.AsyncMode = AsyncMode;
    exports.ConcurrentMode = ConcurrentMode;
    exports.ContextConsumer = ContextConsumer;
    exports.ContextProvider = ContextProvider;
    exports.Element = Element;
    exports.ForwardRef = ForwardRef;
    exports.Fragment = Fragment;
    exports.Lazy = Lazy;
    exports.Memo = Memo;
    exports.Portal = Portal;
    exports.Profiler = Profiler;
    exports.StrictMode = StrictMode;
    exports.Suspense = Suspense;
    exports.isAsyncMode = isAsyncMode;
    exports.isConcurrentMode = isConcurrentMode;
    exports.isContextConsumer = isContextConsumer;
    exports.isContextProvider = isContextProvider;
    exports.isElement = isElement;
    exports.isForwardRef = isForwardRef;
    exports.isFragment = isFragment;
    exports.isLazy = isLazy;
    exports.isMemo = isMemo;
    exports.isPortal = isPortal;
    exports.isProfiler = isProfiler;
    exports.isStrictMode = isStrictMode;
    exports.isSuspense = isSuspense;
    exports.isValidElementType = isValidElementType;
    exports.typeOf = typeOf;
      })();
    }
    
    }).call(this)}).call(this,require('_process'))
    },{"_process":11}],18:[function(require,module,exports){
    /** @license React v16.13.1
     * react-is.production.min.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    
    'use strict';var b="function"===typeof Symbol&&Symbol.for,c=b?Symbol.for("react.element"):60103,d=b?Symbol.for("react.portal"):60106,e=b?Symbol.for("react.fragment"):60107,f=b?Symbol.for("react.strict_mode"):60108,g=b?Symbol.for("react.profiler"):60114,h=b?Symbol.for("react.provider"):60109,k=b?Symbol.for("react.context"):60110,l=b?Symbol.for("react.async_mode"):60111,m=b?Symbol.for("react.concurrent_mode"):60111,n=b?Symbol.for("react.forward_ref"):60112,p=b?Symbol.for("react.suspense"):60113,q=b?
    Symbol.for("react.suspense_list"):60120,r=b?Symbol.for("react.memo"):60115,t=b?Symbol.for("react.lazy"):60116,v=b?Symbol.for("react.block"):60121,w=b?Symbol.for("react.fundamental"):60117,x=b?Symbol.for("react.responder"):60118,y=b?Symbol.for("react.scope"):60119;
    function z(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c:switch(a=a.type,a){case l:case m:case e:case g:case f:case p:return a;default:switch(a=a&&a.$$typeof,a){case k:case n:case t:case r:case h:return a;default:return u}}case d:return u}}}function A(a){return z(a)===m}exports.AsyncMode=l;exports.ConcurrentMode=m;exports.ContextConsumer=k;exports.ContextProvider=h;exports.Element=c;exports.ForwardRef=n;exports.Fragment=e;exports.Lazy=t;exports.Memo=r;exports.Portal=d;
    exports.Profiler=g;exports.StrictMode=f;exports.Suspense=p;exports.isAsyncMode=function(a){return A(a)||z(a)===l};exports.isConcurrentMode=A;exports.isContextConsumer=function(a){return z(a)===k};exports.isContextProvider=function(a){return z(a)===h};exports.isElement=function(a){return"object"===typeof a&&null!==a&&a.$$typeof===c};exports.isForwardRef=function(a){return z(a)===n};exports.isFragment=function(a){return z(a)===e};exports.isLazy=function(a){return z(a)===t};
    exports.isMemo=function(a){return z(a)===r};exports.isPortal=function(a){return z(a)===d};exports.isProfiler=function(a){return z(a)===g};exports.isStrictMode=function(a){return z(a)===f};exports.isSuspense=function(a){return z(a)===p};
    exports.isValidElementType=function(a){return"string"===typeof a||"function"===typeof a||a===e||a===m||a===g||a===f||a===p||a===q||"object"===typeof a&&null!==a&&(a.$$typeof===t||a.$$typeof===r||a.$$typeof===h||a.$$typeof===k||a.$$typeof===n||a.$$typeof===w||a.$$typeof===x||a.$$typeof===y||a.$$typeof===v)};exports.typeOf=z;
    
    },{}],19:[function(require,module,exports){
    (function (process){(function (){
    'use strict';
    
    if (process.env.NODE_ENV === 'production') {
      module.exports = require('./cjs/react-is.production.min.js');
    } else {
      module.exports = require('./cjs/react-is.development.js');
    }
    
    }).call(this)}).call(this,require('_process'))
    },{"./cjs/react-is.development.js":17,"./cjs/react-is.production.min.js":18,"_process":11}],20:[function(require,module,exports){
    'use strict';
    
    function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }
    
    var reactRouter = require('react-router');
    var React = _interopDefault(require('react'));
    var history = require('history');
    var PropTypes = _interopDefault(require('prop-types'));
    var warning = _interopDefault(require('tiny-warning'));
    var invariant = _interopDefault(require('tiny-invariant'));
    
    function _extends() {
      _extends = Object.assign || function (target) {
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
    
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      subClass.__proto__ = superClass;
    }
    
    function _objectWithoutPropertiesLoose(source, excluded) {
      if (source == null) return {};
      var target = {};
      var sourceKeys = Object.keys(source);
      var key, i;
    
      for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
      }
    
      return target;
    }
    
    /**
     * The public API for a <Router> that uses HTML5 history.
     */
    
    var BrowserRouter =
    /*#__PURE__*/
    function (_React$Component) {
      _inheritsLoose(BrowserRouter, _React$Component);
    
      function BrowserRouter() {
        var _this;
    
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
    
        _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
        _this.history = history.createBrowserHistory(_this.props);
        return _this;
      }
    
      var _proto = BrowserRouter.prototype;
    
      _proto.render = function render() {
        return React.createElement(reactRouter.Router, {
          history: this.history,
          children: this.props.children
        });
      };
    
      return BrowserRouter;
    }(React.Component);
    
    {
      BrowserRouter.propTypes = {
        basename: PropTypes.string,
        children: PropTypes.node,
        forceRefresh: PropTypes.bool,
        getUserConfirmation: PropTypes.func,
        keyLength: PropTypes.number
      };
    
      BrowserRouter.prototype.componentDidMount = function () {
         warning(!this.props.history, "<BrowserRouter> ignores the history prop. To use a custom history, " + "use `import { Router }` instead of `import { BrowserRouter as Router }`.") ;
      };
    }
    
    /**
     * The public API for a <Router> that uses window.location.hash.
     */
    
    var HashRouter =
    /*#__PURE__*/
    function (_React$Component) {
      _inheritsLoose(HashRouter, _React$Component);
    
      function HashRouter() {
        var _this;
    
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
    
        _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
        _this.history = history.createHashHistory(_this.props);
        return _this;
      }
    
      var _proto = HashRouter.prototype;
    
      _proto.render = function render() {
        return React.createElement(reactRouter.Router, {
          history: this.history,
          children: this.props.children
        });
      };
    
      return HashRouter;
    }(React.Component);
    
    {
      HashRouter.propTypes = {
        basename: PropTypes.string,
        children: PropTypes.node,
        getUserConfirmation: PropTypes.func,
        hashType: PropTypes.oneOf(["hashbang", "noslash", "slash"])
      };
    
      HashRouter.prototype.componentDidMount = function () {
         warning(!this.props.history, "<HashRouter> ignores the history prop. To use a custom history, " + "use `import { Router }` instead of `import { HashRouter as Router }`.") ;
      };
    }
    
    var resolveToLocation = function resolveToLocation(to, currentLocation) {
      return typeof to === "function" ? to(currentLocation) : to;
    };
    var normalizeToLocation = function normalizeToLocation(to, currentLocation) {
      return typeof to === "string" ? history.createLocation(to, null, null, currentLocation) : to;
    };
    
    var forwardRefShim = function forwardRefShim(C) {
      return C;
    };
    
    var forwardRef = React.forwardRef;
    
    if (typeof forwardRef === "undefined") {
      forwardRef = forwardRefShim;
    }
    
    function isModifiedEvent(event) {
      return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
    }
    
    var LinkAnchor = forwardRef(function (_ref, forwardedRef) {
      var innerRef = _ref.innerRef,
          navigate = _ref.navigate,
          _onClick = _ref.onClick,
          rest = _objectWithoutPropertiesLoose(_ref, ["innerRef", "navigate", "onClick"]);
    
      var target = rest.target;
    
      var props = _extends({}, rest, {
        onClick: function onClick(event) {
          try {
            if (_onClick) _onClick(event);
          } catch (ex) {
            event.preventDefault();
            throw ex;
          }
    
          if (!event.defaultPrevented && // onClick prevented default
          event.button === 0 && ( // ignore everything but left clicks
          !target || target === "_self") && // let browser handle "target=_blank" etc.
          !isModifiedEvent(event) // ignore clicks with modifier keys
          ) {
              event.preventDefault();
              navigate();
            }
        }
      }); // React 15 compat
    
    
      if (forwardRefShim !== forwardRef) {
        props.ref = forwardedRef || innerRef;
      } else {
        props.ref = innerRef;
      }
      /* eslint-disable-next-line jsx-a11y/anchor-has-content */
    
    
      return React.createElement("a", props);
    });
    
    {
      LinkAnchor.displayName = "LinkAnchor";
    }
    /**
     * The public API for rendering a history-aware <a>.
     */
    
    
    var Link = forwardRef(function (_ref2, forwardedRef) {
      var _ref2$component = _ref2.component,
          component = _ref2$component === void 0 ? LinkAnchor : _ref2$component,
          replace = _ref2.replace,
          to = _ref2.to,
          innerRef = _ref2.innerRef,
          rest = _objectWithoutPropertiesLoose(_ref2, ["component", "replace", "to", "innerRef"]);
    
      return React.createElement(reactRouter.__RouterContext.Consumer, null, function (context) {
        !context ?  invariant(false, "You should not use <Link> outside a <Router>")  : void 0;
        var history = context.history;
        var location = normalizeToLocation(resolveToLocation(to, context.location), context.location);
        var href = location ? history.createHref(location) : "";
    
        var props = _extends({}, rest, {
          href: href,
          navigate: function navigate() {
            var location = resolveToLocation(to, context.location);
            var method = replace ? history.replace : history.push;
            method(location);
          }
        }); // React 15 compat
    
    
        if (forwardRefShim !== forwardRef) {
          props.ref = forwardedRef || innerRef;
        } else {
          props.innerRef = innerRef;
        }
    
        return React.createElement(component, props);
      });
    });
    
    {
      var toType = PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func]);
      var refType = PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.shape({
        current: PropTypes.any
      })]);
      Link.displayName = "Link";
      Link.propTypes = {
        innerRef: refType,
        onClick: PropTypes.func,
        replace: PropTypes.bool,
        target: PropTypes.string,
        to: toType.isRequired
      };
    }
    
    var forwardRefShim$1 = function forwardRefShim(C) {
      return C;
    };
    
    var forwardRef$1 = React.forwardRef;
    
    if (typeof forwardRef$1 === "undefined") {
      forwardRef$1 = forwardRefShim$1;
    }
    
    function joinClassnames() {
      for (var _len = arguments.length, classnames = new Array(_len), _key = 0; _key < _len; _key++) {
        classnames[_key] = arguments[_key];
      }
    
      return classnames.filter(function (i) {
        return i;
      }).join(" ");
    }
    /**
     * A <Link> wrapper that knows if it's "active" or not.
     */
    
    
    var NavLink = forwardRef$1(function (_ref, forwardedRef) {
      var _ref$ariaCurrent = _ref["aria-current"],
          ariaCurrent = _ref$ariaCurrent === void 0 ? "page" : _ref$ariaCurrent,
          _ref$activeClassName = _ref.activeClassName,
          activeClassName = _ref$activeClassName === void 0 ? "active" : _ref$activeClassName,
          activeStyle = _ref.activeStyle,
          classNameProp = _ref.className,
          exact = _ref.exact,
          isActiveProp = _ref.isActive,
          locationProp = _ref.location,
          sensitive = _ref.sensitive,
          strict = _ref.strict,
          styleProp = _ref.style,
          to = _ref.to,
          innerRef = _ref.innerRef,
          rest = _objectWithoutPropertiesLoose(_ref, ["aria-current", "activeClassName", "activeStyle", "className", "exact", "isActive", "location", "sensitive", "strict", "style", "to", "innerRef"]);
    
      return React.createElement(reactRouter.__RouterContext.Consumer, null, function (context) {
        !context ?  invariant(false, "You should not use <NavLink> outside a <Router>")  : void 0;
        var currentLocation = locationProp || context.location;
        var toLocation = normalizeToLocation(resolveToLocation(to, currentLocation), currentLocation);
        var path = toLocation.pathname; // Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L202
    
        var escapedPath = path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
        var match = escapedPath ? reactRouter.matchPath(currentLocation.pathname, {
          path: escapedPath,
          exact: exact,
          sensitive: sensitive,
          strict: strict
        }) : null;
        var isActive = !!(isActiveProp ? isActiveProp(match, currentLocation) : match);
        var className = isActive ? joinClassnames(classNameProp, activeClassName) : classNameProp;
        var style = isActive ? _extends({}, styleProp, {}, activeStyle) : styleProp;
    
        var props = _extends({
          "aria-current": isActive && ariaCurrent || null,
          className: className,
          style: style,
          to: toLocation
        }, rest); // React 15 compat
    
    
        if (forwardRefShim$1 !== forwardRef$1) {
          props.ref = forwardedRef || innerRef;
        } else {
          props.innerRef = innerRef;
        }
    
        return React.createElement(Link, props);
      });
    });
    
    {
      NavLink.displayName = "NavLink";
      var ariaCurrentType = PropTypes.oneOf(["page", "step", "location", "date", "time", "true"]);
      NavLink.propTypes = _extends({}, Link.propTypes, {
        "aria-current": ariaCurrentType,
        activeClassName: PropTypes.string,
        activeStyle: PropTypes.object,
        className: PropTypes.string,
        exact: PropTypes.bool,
        isActive: PropTypes.func,
        location: PropTypes.object,
        sensitive: PropTypes.bool,
        strict: PropTypes.bool,
        style: PropTypes.object
      });
    }
    
    Object.defineProperty(exports, 'MemoryRouter', {
      enumerable: true,
      get: function () {
        return reactRouter.MemoryRouter;
      }
    });
    Object.defineProperty(exports, 'Prompt', {
      enumerable: true,
      get: function () {
        return reactRouter.Prompt;
      }
    });
    Object.defineProperty(exports, 'Redirect', {
      enumerable: true,
      get: function () {
        return reactRouter.Redirect;
      }
    });
    Object.defineProperty(exports, 'Route', {
      enumerable: true,
      get: function () {
        return reactRouter.Route;
      }
    });
    Object.defineProperty(exports, 'Router', {
      enumerable: true,
      get: function () {
        return reactRouter.Router;
      }
    });
    Object.defineProperty(exports, 'StaticRouter', {
      enumerable: true,
      get: function () {
        return reactRouter.StaticRouter;
      }
    });
    Object.defineProperty(exports, 'Switch', {
      enumerable: true,
      get: function () {
        return reactRouter.Switch;
      }
    });
    Object.defineProperty(exports, 'generatePath', {
      enumerable: true,
      get: function () {
        return reactRouter.generatePath;
      }
    });
    Object.defineProperty(exports, 'matchPath', {
      enumerable: true,
      get: function () {
        return reactRouter.matchPath;
      }
    });
    Object.defineProperty(exports, 'useHistory', {
      enumerable: true,
      get: function () {
        return reactRouter.useHistory;
      }
    });
    Object.defineProperty(exports, 'useLocation', {
      enumerable: true,
      get: function () {
        return reactRouter.useLocation;
      }
    });
    Object.defineProperty(exports, 'useParams', {
      enumerable: true,
      get: function () {
        return reactRouter.useParams;
      }
    });
    Object.defineProperty(exports, 'useRouteMatch', {
      enumerable: true,
      get: function () {
        return reactRouter.useRouteMatch;
      }
    });
    Object.defineProperty(exports, 'withRouter', {
      enumerable: true,
      get: function () {
        return reactRouter.withRouter;
      }
    });
    exports.BrowserRouter = BrowserRouter;
    exports.HashRouter = HashRouter;
    exports.Link = Link;
    exports.NavLink = NavLink;
    
    
    },{"history":5,"prop-types":15,"react":undefined,"react-router":25,"tiny-invariant":29,"tiny-warning":30}],21:[function(require,module,exports){
    "use strict";function _interopDefault(e){return e&&"object"==typeof e&&"default"in e?e.default:e}Object.defineProperty(exports,"__esModule",{value:!0});var reactRouter=require("react-router"),React=_interopDefault(require("react")),history=require("history");require("prop-types"),require("tiny-warning");var invariant=_interopDefault(require("tiny-invariant"));function _extends(){return(_extends=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(e[o]=r[o])}return e}).apply(this,arguments)}function _inheritsLoose(e,t){e.prototype=Object.create(t.prototype),(e.prototype.constructor=e).__proto__=t}function _objectWithoutPropertiesLoose(e,t){if(null==e)return{};var r,o,n={},a=Object.keys(e);for(o=0;o<a.length;o++)r=a[o],0<=t.indexOf(r)||(n[r]=e[r]);return n}var BrowserRouter=function(n){function e(){for(var e,t=arguments.length,r=new Array(t),o=0;o<t;o++)r[o]=arguments[o];return(e=n.call.apply(n,[this].concat(r))||this).history=history.createBrowserHistory(e.props),e}return _inheritsLoose(e,n),e.prototype.render=function(){return React.createElement(reactRouter.Router,{history:this.history,children:this.props.children})},e}(React.Component),HashRouter=function(n){function e(){for(var e,t=arguments.length,r=new Array(t),o=0;o<t;o++)r[o]=arguments[o];return(e=n.call.apply(n,[this].concat(r))||this).history=history.createHashHistory(e.props),e}return _inheritsLoose(e,n),e.prototype.render=function(){return React.createElement(reactRouter.Router,{history:this.history,children:this.props.children})},e}(React.Component),resolveToLocation=function(e,t){return"function"==typeof e?e(t):e},normalizeToLocation=function(e,t){return"string"==typeof e?history.createLocation(e,null,null,t):e},forwardRefShim=function(e){return e},forwardRef=React.forwardRef;function isModifiedEvent(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}void 0===forwardRef&&(forwardRef=forwardRefShim);var LinkAnchor=forwardRef(function(e,t){var r=e.innerRef,o=e.navigate,n=e.onClick,a=_objectWithoutPropertiesLoose(e,["innerRef","navigate","onClick"]),i=a.target,c=_extends({},a,{onClick:function(t){try{n&&n(t)}catch(e){throw t.preventDefault(),e}t.defaultPrevented||0!==t.button||i&&"_self"!==i||isModifiedEvent(t)||(t.preventDefault(),o())}});return c.ref=forwardRefShim!==forwardRef&&t||r,React.createElement("a",c)}),Link=forwardRef(function(e,a){var t=e.component,i=void 0===t?LinkAnchor:t,c=e.replace,u=e.to,s=e.innerRef,f=_objectWithoutPropertiesLoose(e,["component","replace","to","innerRef"]);return React.createElement(reactRouter.__RouterContext.Consumer,null,function(t){t||invariant(!1);var r=t.history,e=normalizeToLocation(resolveToLocation(u,t.location),t.location),o=e?r.createHref(e):"",n=_extends({},f,{href:o,navigate:function(){var e=resolveToLocation(u,t.location);(c?r.replace:r.push)(e)}});return forwardRefShim!==forwardRef?n.ref=a||s:n.innerRef=s,React.createElement(i,n)})}),forwardRefShim$1=function(e){return e},forwardRef$1=React.forwardRef;function joinClassnames(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];return t.filter(function(e){return e}).join(" ")}void 0===forwardRef$1&&(forwardRef$1=forwardRefShim$1);var NavLink=forwardRef$1(function(e,f){var t=e["aria-current"],l=void 0===t?"page":t,r=e.activeClassName,p=void 0===r?"active":r,R=e.activeStyle,h=e.className,d=e.exact,y=e.isActive,m=e.location,v=e.sensitive,b=e.strict,w=e.style,x=e.to,g=e.innerRef,P=_objectWithoutPropertiesLoose(e,["aria-current","activeClassName","activeStyle","className","exact","isActive","location","sensitive","strict","style","to","innerRef"]);return React.createElement(reactRouter.__RouterContext.Consumer,null,function(e){e||invariant(!1);var t=m||e.location,r=normalizeToLocation(resolveToLocation(x,t),t),o=r.pathname,n=o&&o.replace(/([.+*?=^!:${}()[\]|/\\])/g,"\\$1"),a=n?reactRouter.matchPath(t.pathname,{path:n,exact:d,sensitive:v,strict:b}):null,i=!!(y?y(a,t):a),c=i?joinClassnames(h,p):h,u=i?_extends({},w,{},R):w,s=_extends({"aria-current":i&&l||null,className:c,style:u,to:r},P);return forwardRefShim$1!==forwardRef$1?s.ref=f||g:s.innerRef=g,React.createElement(Link,s)})});Object.defineProperty(exports,"MemoryRouter",{enumerable:!0,get:function(){return reactRouter.MemoryRouter}}),Object.defineProperty(exports,"Prompt",{enumerable:!0,get:function(){return reactRouter.Prompt}}),Object.defineProperty(exports,"Redirect",{enumerable:!0,get:function(){return reactRouter.Redirect}}),Object.defineProperty(exports,"Route",{enumerable:!0,get:function(){return reactRouter.Route}}),Object.defineProperty(exports,"Router",{enumerable:!0,get:function(){return reactRouter.Router}}),Object.defineProperty(exports,"StaticRouter",{enumerable:!0,get:function(){return reactRouter.StaticRouter}}),Object.defineProperty(exports,"Switch",{enumerable:!0,get:function(){return reactRouter.Switch}}),Object.defineProperty(exports,"generatePath",{enumerable:!0,get:function(){return reactRouter.generatePath}}),Object.defineProperty(exports,"matchPath",{enumerable:!0,get:function(){return reactRouter.matchPath}}),Object.defineProperty(exports,"useHistory",{enumerable:!0,get:function(){return reactRouter.useHistory}}),Object.defineProperty(exports,"useLocation",{enumerable:!0,get:function(){return reactRouter.useLocation}}),Object.defineProperty(exports,"useParams",{enumerable:!0,get:function(){return reactRouter.useParams}}),Object.defineProperty(exports,"useRouteMatch",{enumerable:!0,get:function(){return reactRouter.useRouteMatch}}),Object.defineProperty(exports,"withRouter",{enumerable:!0,get:function(){return reactRouter.withRouter}}),exports.BrowserRouter=BrowserRouter,exports.HashRouter=HashRouter,exports.Link=Link,exports.NavLink=NavLink;
    
    
    },{"history":5,"prop-types":15,"react":undefined,"react-router":25,"tiny-invariant":29,"tiny-warning":30}],22:[function(require,module,exports){
    (function (process){(function (){
    "use strict";
    
    if (process.env.NODE_ENV === "production") {
      module.exports = require("./cjs/react-router-dom.min.js");
    } else {
      module.exports = require("./cjs/react-router-dom.js");
    }
    
    }).call(this)}).call(this,require('_process'))
    },{"./cjs/react-router-dom.js":20,"./cjs/react-router-dom.min.js":21,"_process":11}],23:[function(require,module,exports){
    'use strict';
    
    function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }
    
    var React = _interopDefault(require('react'));
    var PropTypes = _interopDefault(require('prop-types'));
    var history = require('history');
    var warning = _interopDefault(require('tiny-warning'));
    var createContext = _interopDefault(require('mini-create-react-context'));
    var invariant = _interopDefault(require('tiny-invariant'));
    var pathToRegexp = _interopDefault(require('path-to-regexp'));
    var reactIs = require('react-is');
    var hoistStatics = _interopDefault(require('hoist-non-react-statics'));
    
    function _extends() {
      _extends = Object.assign || function (target) {
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
    
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      subClass.__proto__ = superClass;
    }
    
    function _objectWithoutPropertiesLoose(source, excluded) {
      if (source == null) return {};
      var target = {};
      var sourceKeys = Object.keys(source);
      var key, i;
    
      for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
      }
    
      return target;
    }
    
    // TODO: Replace with React.createContext once we can assume React 16+
    
    var createNamedContext = function createNamedContext(name) {
      var context = createContext();
      context.displayName = name;
      return context;
    };
    
    var historyContext =
    /*#__PURE__*/
    createNamedContext("Router-History");
    
    // TODO: Replace with React.createContext once we can assume React 16+
    
    var createNamedContext$1 = function createNamedContext(name) {
      var context = createContext();
      context.displayName = name;
      return context;
    };
    
    var context =
    /*#__PURE__*/
    createNamedContext$1("Router");
    
    /**
     * The public API for putting history on context.
     */
    
    var Router =
    /*#__PURE__*/
    function (_React$Component) {
      _inheritsLoose(Router, _React$Component);
    
      Router.computeRootMatch = function computeRootMatch(pathname) {
        return {
          path: "/",
          url: "/",
          params: {},
          isExact: pathname === "/"
        };
      };
    
      function Router(props) {
        var _this;
    
        _this = _React$Component.call(this, props) || this;
        _this.state = {
          location: props.history.location
        }; // This is a bit of a hack. We have to start listening for location
        // changes here in the constructor in case there are any <Redirect>s
        // on the initial render. If there are, they will replace/push when
        // they mount and since cDM fires in children before parents, we may
        // get a new location before the <Router> is mounted.
    
        _this._isMounted = false;
        _this._pendingLocation = null;
    
        if (!props.staticContext) {
          _this.unlisten = props.history.listen(function (location) {
            if (_this._isMounted) {
              _this.setState({
                location: location
              });
            } else {
              _this._pendingLocation = location;
            }
          });
        }
    
        return _this;
      }
    
      var _proto = Router.prototype;
    
      _proto.componentDidMount = function componentDidMount() {
        this._isMounted = true;
    
        if (this._pendingLocation) {
          this.setState({
            location: this._pendingLocation
          });
        }
      };
    
      _proto.componentWillUnmount = function componentWillUnmount() {
        if (this.unlisten) this.unlisten();
      };
    
      _proto.render = function render() {
        return React.createElement(context.Provider, {
          value: {
            history: this.props.history,
            location: this.state.location,
            match: Router.computeRootMatch(this.state.location.pathname),
            staticContext: this.props.staticContext
          }
        }, React.createElement(historyContext.Provider, {
          children: this.props.children || null,
          value: this.props.history
        }));
      };
    
      return Router;
    }(React.Component);
    
    {
      Router.propTypes = {
        children: PropTypes.node,
        history: PropTypes.object.isRequired,
        staticContext: PropTypes.object
      };
    
      Router.prototype.componentDidUpdate = function (prevProps) {
         warning(prevProps.history === this.props.history, "You cannot change <Router history>") ;
      };
    }
    
    /**
     * The public API for a <Router> that stores location in memory.
     */
    
    var MemoryRouter =
    /*#__PURE__*/
    function (_React$Component) {
      _inheritsLoose(MemoryRouter, _React$Component);
    
      function MemoryRouter() {
        var _this;
    
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
    
        _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
        _this.history = history.createMemoryHistory(_this.props);
        return _this;
      }
    
      var _proto = MemoryRouter.prototype;
    
      _proto.render = function render() {
        return React.createElement(Router, {
          history: this.history,
          children: this.props.children
        });
      };
    
      return MemoryRouter;
    }(React.Component);
    
    {
      MemoryRouter.propTypes = {
        initialEntries: PropTypes.array,
        initialIndex: PropTypes.number,
        getUserConfirmation: PropTypes.func,
        keyLength: PropTypes.number,
        children: PropTypes.node
      };
    
      MemoryRouter.prototype.componentDidMount = function () {
         warning(!this.props.history, "<MemoryRouter> ignores the history prop. To use a custom history, " + "use `import { Router }` instead of `import { MemoryRouter as Router }`.") ;
      };
    }
    
    var Lifecycle =
    /*#__PURE__*/
    function (_React$Component) {
      _inheritsLoose(Lifecycle, _React$Component);
    
      function Lifecycle() {
        return _React$Component.apply(this, arguments) || this;
      }
    
      var _proto = Lifecycle.prototype;
    
      _proto.componentDidMount = function componentDidMount() {
        if (this.props.onMount) this.props.onMount.call(this, this);
      };
    
      _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
        if (this.props.onUpdate) this.props.onUpdate.call(this, this, prevProps);
      };
    
      _proto.componentWillUnmount = function componentWillUnmount() {
        if (this.props.onUnmount) this.props.onUnmount.call(this, this);
      };
    
      _proto.render = function render() {
        return null;
      };
    
      return Lifecycle;
    }(React.Component);
    
    /**
     * The public API for prompting the user before navigating away from a screen.
     */
    
    function Prompt(_ref) {
      var message = _ref.message,
          _ref$when = _ref.when,
          when = _ref$when === void 0 ? true : _ref$when;
      return React.createElement(context.Consumer, null, function (context) {
        !context ?  invariant(false, "You should not use <Prompt> outside a <Router>")  : void 0;
        if (!when || context.staticContext) return null;
        var method = context.history.block;
        return React.createElement(Lifecycle, {
          onMount: function onMount(self) {
            self.release = method(message);
          },
          onUpdate: function onUpdate(self, prevProps) {
            if (prevProps.message !== message) {
              self.release();
              self.release = method(message);
            }
          },
          onUnmount: function onUnmount(self) {
            self.release();
          },
          message: message
        });
      });
    }
    
    {
      var messageType = PropTypes.oneOfType([PropTypes.func, PropTypes.string]);
      Prompt.propTypes = {
        when: PropTypes.bool,
        message: messageType.isRequired
      };
    }
    
    var cache = {};
    var cacheLimit = 10000;
    var cacheCount = 0;
    
    function compilePath(path) {
      if (cache[path]) return cache[path];
      var generator = pathToRegexp.compile(path);
    
      if (cacheCount < cacheLimit) {
        cache[path] = generator;
        cacheCount++;
      }
    
      return generator;
    }
    /**
     * Public API for generating a URL pathname from a path and parameters.
     */
    
    
    function generatePath(path, params) {
      if (path === void 0) {
        path = "/";
      }
    
      if (params === void 0) {
        params = {};
      }
    
      return path === "/" ? path : compilePath(path)(params, {
        pretty: true
      });
    }
    
    /**
     * The public API for navigating programmatically with a component.
     */
    
    function Redirect(_ref) {
      var computedMatch = _ref.computedMatch,
          to = _ref.to,
          _ref$push = _ref.push,
          push = _ref$push === void 0 ? false : _ref$push;
      return React.createElement(context.Consumer, null, function (context) {
        !context ?  invariant(false, "You should not use <Redirect> outside a <Router>")  : void 0;
        var history$1 = context.history,
            staticContext = context.staticContext;
        var method = push ? history$1.push : history$1.replace;
        var location = history.createLocation(computedMatch ? typeof to === "string" ? generatePath(to, computedMatch.params) : _extends({}, to, {
          pathname: generatePath(to.pathname, computedMatch.params)
        }) : to); // When rendering in a static context,
        // set the new location immediately.
    
        if (staticContext) {
          method(location);
          return null;
        }
    
        return React.createElement(Lifecycle, {
          onMount: function onMount() {
            method(location);
          },
          onUpdate: function onUpdate(self, prevProps) {
            var prevLocation = history.createLocation(prevProps.to);
    
            if (!history.locationsAreEqual(prevLocation, _extends({}, location, {
              key: prevLocation.key
            }))) {
              method(location);
            }
          },
          to: to
        });
      });
    }
    
    {
      Redirect.propTypes = {
        push: PropTypes.bool,
        from: PropTypes.string,
        to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
      };
    }
    
    var cache$1 = {};
    var cacheLimit$1 = 10000;
    var cacheCount$1 = 0;
    
    function compilePath$1(path, options) {
      var cacheKey = "" + options.end + options.strict + options.sensitive;
      var pathCache = cache$1[cacheKey] || (cache$1[cacheKey] = {});
      if (pathCache[path]) return pathCache[path];
      var keys = [];
      var regexp = pathToRegexp(path, keys, options);
      var result = {
        regexp: regexp,
        keys: keys
      };
    
      if (cacheCount$1 < cacheLimit$1) {
        pathCache[path] = result;
        cacheCount$1++;
      }
    
      return result;
    }
    /**
     * Public API for matching a URL pathname to a path.
     */
    
    
    function matchPath(pathname, options) {
      if (options === void 0) {
        options = {};
      }
    
      if (typeof options === "string" || Array.isArray(options)) {
        options = {
          path: options
        };
      }
    
      var _options = options,
          path = _options.path,
          _options$exact = _options.exact,
          exact = _options$exact === void 0 ? false : _options$exact,
          _options$strict = _options.strict,
          strict = _options$strict === void 0 ? false : _options$strict,
          _options$sensitive = _options.sensitive,
          sensitive = _options$sensitive === void 0 ? false : _options$sensitive;
      var paths = [].concat(path);
      return paths.reduce(function (matched, path) {
        if (!path && path !== "") return null;
        if (matched) return matched;
    
        var _compilePath = compilePath$1(path, {
          end: exact,
          strict: strict,
          sensitive: sensitive
        }),
            regexp = _compilePath.regexp,
            keys = _compilePath.keys;
    
        var match = regexp.exec(pathname);
        if (!match) return null;
        var url = match[0],
            values = match.slice(1);
        var isExact = pathname === url;
        if (exact && !isExact) return null;
        return {
          path: path,
          // the path used to match
          url: path === "/" && url === "" ? "/" : url,
          // the matched portion of the URL
          isExact: isExact,
          // whether or not we matched exactly
          params: keys.reduce(function (memo, key, index) {
            memo[key.name] = values[index];
            return memo;
          }, {})
        };
      }, null);
    }
    
    function isEmptyChildren(children) {
      return React.Children.count(children) === 0;
    }
    
    function evalChildrenDev(children, props, path) {
      var value = children(props);
       warning(value !== undefined, "You returned `undefined` from the `children` function of " + ("<Route" + (path ? " path=\"" + path + "\"" : "") + ">, but you ") + "should have returned a React element or `null`") ;
      return value || null;
    }
    /**
     * The public API for matching a single path and rendering.
     */
    
    
    var Route =
    /*#__PURE__*/
    function (_React$Component) {
      _inheritsLoose(Route, _React$Component);
    
      function Route() {
        return _React$Component.apply(this, arguments) || this;
      }
    
      var _proto = Route.prototype;
    
      _proto.render = function render() {
        var _this = this;
    
        return React.createElement(context.Consumer, null, function (context$1) {
          !context$1 ?  invariant(false, "You should not use <Route> outside a <Router>")  : void 0;
          var location = _this.props.location || context$1.location;
          var match = _this.props.computedMatch ? _this.props.computedMatch // <Switch> already computed the match for us
          : _this.props.path ? matchPath(location.pathname, _this.props) : context$1.match;
    
          var props = _extends({}, context$1, {
            location: location,
            match: match
          });
    
          var _this$props = _this.props,
              children = _this$props.children,
              component = _this$props.component,
              render = _this$props.render; // Preact uses an empty array as children by
          // default, so use null if that's the case.
    
          if (Array.isArray(children) && children.length === 0) {
            children = null;
          }
    
          return React.createElement(context.Provider, {
            value: props
          }, props.match ? children ? typeof children === "function" ?  evalChildrenDev(children, props, _this.props.path)  : children : component ? React.createElement(component, props) : render ? render(props) : null : typeof children === "function" ?  evalChildrenDev(children, props, _this.props.path)  : null);
        });
      };
    
      return Route;
    }(React.Component);
    
    {
      Route.propTypes = {
        children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
        component: function component(props, propName) {
          if (props[propName] && !reactIs.isValidElementType(props[propName])) {
            return new Error("Invalid prop 'component' supplied to 'Route': the prop is not a valid React component");
          }
        },
        exact: PropTypes.bool,
        location: PropTypes.object,
        path: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
        render: PropTypes.func,
        sensitive: PropTypes.bool,
        strict: PropTypes.bool
      };
    
      Route.prototype.componentDidMount = function () {
         warning(!(this.props.children && !isEmptyChildren(this.props.children) && this.props.component), "You should not use <Route component> and <Route children> in the same route; <Route component> will be ignored") ;
         warning(!(this.props.children && !isEmptyChildren(this.props.children) && this.props.render), "You should not use <Route render> and <Route children> in the same route; <Route render> will be ignored") ;
         warning(!(this.props.component && this.props.render), "You should not use <Route component> and <Route render> in the same route; <Route render> will be ignored") ;
      };
    
      Route.prototype.componentDidUpdate = function (prevProps) {
         warning(!(this.props.location && !prevProps.location), '<Route> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.') ;
         warning(!(!this.props.location && prevProps.location), '<Route> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.') ;
      };
    }
    
    function addLeadingSlash(path) {
      return path.charAt(0) === "/" ? path : "/" + path;
    }
    
    function addBasename(basename, location) {
      if (!basename) return location;
      return _extends({}, location, {
        pathname: addLeadingSlash(basename) + location.pathname
      });
    }
    
    function stripBasename(basename, location) {
      if (!basename) return location;
      var base = addLeadingSlash(basename);
      if (location.pathname.indexOf(base) !== 0) return location;
      return _extends({}, location, {
        pathname: location.pathname.substr(base.length)
      });
    }
    
    function createURL(location) {
      return typeof location === "string" ? location : history.createPath(location);
    }
    
    function staticHandler(methodName) {
      return function () {
          invariant(false, "You cannot %s with <StaticRouter>", methodName)  ;
      };
    }
    
    function noop() {}
    /**
     * The public top-level API for a "static" <Router>, so-called because it
     * can't actually change the current location. Instead, it just records
     * location changes in a context object. Useful mainly in testing and
     * server-rendering scenarios.
     */
    
    
    var StaticRouter =
    /*#__PURE__*/
    function (_React$Component) {
      _inheritsLoose(StaticRouter, _React$Component);
    
      function StaticRouter() {
        var _this;
    
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
    
        _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    
        _this.handlePush = function (location) {
          return _this.navigateTo(location, "PUSH");
        };
    
        _this.handleReplace = function (location) {
          return _this.navigateTo(location, "REPLACE");
        };
    
        _this.handleListen = function () {
          return noop;
        };
    
        _this.handleBlock = function () {
          return noop;
        };
    
        return _this;
      }
    
      var _proto = StaticRouter.prototype;
    
      _proto.navigateTo = function navigateTo(location, action) {
        var _this$props = this.props,
            _this$props$basename = _this$props.basename,
            basename = _this$props$basename === void 0 ? "" : _this$props$basename,
            _this$props$context = _this$props.context,
            context = _this$props$context === void 0 ? {} : _this$props$context;
        context.action = action;
        context.location = addBasename(basename, history.createLocation(location));
        context.url = createURL(context.location);
      };
    
      _proto.render = function render() {
        var _this$props2 = this.props,
            _this$props2$basename = _this$props2.basename,
            basename = _this$props2$basename === void 0 ? "" : _this$props2$basename,
            _this$props2$context = _this$props2.context,
            context = _this$props2$context === void 0 ? {} : _this$props2$context,
            _this$props2$location = _this$props2.location,
            location = _this$props2$location === void 0 ? "/" : _this$props2$location,
            rest = _objectWithoutPropertiesLoose(_this$props2, ["basename", "context", "location"]);
    
        var history$1 = {
          createHref: function createHref(path) {
            return addLeadingSlash(basename + createURL(path));
          },
          action: "POP",
          location: stripBasename(basename, history.createLocation(location)),
          push: this.handlePush,
          replace: this.handleReplace,
          go: staticHandler("go"),
          goBack: staticHandler("goBack"),
          goForward: staticHandler("goForward"),
          listen: this.handleListen,
          block: this.handleBlock
        };
        return React.createElement(Router, _extends({}, rest, {
          history: history$1,
          staticContext: context
        }));
      };
    
      return StaticRouter;
    }(React.Component);
    
    {
      StaticRouter.propTypes = {
        basename: PropTypes.string,
        context: PropTypes.object,
        location: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
      };
    
      StaticRouter.prototype.componentDidMount = function () {
         warning(!this.props.history, "<StaticRouter> ignores the history prop. To use a custom history, " + "use `import { Router }` instead of `import { StaticRouter as Router }`.") ;
      };
    }
    
    /**
     * The public API for rendering the first <Route> that matches.
     */
    
    var Switch =
    /*#__PURE__*/
    function (_React$Component) {
      _inheritsLoose(Switch, _React$Component);
    
      function Switch() {
        return _React$Component.apply(this, arguments) || this;
      }
    
      var _proto = Switch.prototype;
    
      _proto.render = function render() {
        var _this = this;
    
        return React.createElement(context.Consumer, null, function (context) {
          !context ?  invariant(false, "You should not use <Switch> outside a <Router>")  : void 0;
          var location = _this.props.location || context.location;
          var element, match; // We use React.Children.forEach instead of React.Children.toArray().find()
          // here because toArray adds keys to all child elements and we do not want
          // to trigger an unmount/remount for two <Route>s that render the same
          // component at different URLs.
    
          React.Children.forEach(_this.props.children, function (child) {
            if (match == null && React.isValidElement(child)) {
              element = child;
              var path = child.props.path || child.props.from;
              match = path ? matchPath(location.pathname, _extends({}, child.props, {
                path: path
              })) : context.match;
            }
          });
          return match ? React.cloneElement(element, {
            location: location,
            computedMatch: match
          }) : null;
        });
      };
    
      return Switch;
    }(React.Component);
    
    {
      Switch.propTypes = {
        children: PropTypes.node,
        location: PropTypes.object
      };
    
      Switch.prototype.componentDidUpdate = function (prevProps) {
         warning(!(this.props.location && !prevProps.location), '<Switch> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.') ;
         warning(!(!this.props.location && prevProps.location), '<Switch> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.') ;
      };
    }
    
    /**
     * A public higher-order component to access the imperative API
     */
    
    function withRouter(Component) {
      var displayName = "withRouter(" + (Component.displayName || Component.name) + ")";
    
      var C = function C(props) {
        var wrappedComponentRef = props.wrappedComponentRef,
            remainingProps = _objectWithoutPropertiesLoose(props, ["wrappedComponentRef"]);
    
        return React.createElement(context.Consumer, null, function (context) {
          !context ?  invariant(false, "You should not use <" + displayName + " /> outside a <Router>")  : void 0;
          return React.createElement(Component, _extends({}, remainingProps, context, {
            ref: wrappedComponentRef
          }));
        });
      };
    
      C.displayName = displayName;
      C.WrappedComponent = Component;
    
      {
        C.propTypes = {
          wrappedComponentRef: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object])
        };
      }
    
      return hoistStatics(C, Component);
    }
    
    var useContext = React.useContext;
    function useHistory() {
      {
        !(typeof useContext === "function") ?  invariant(false, "You must use React >= 16.8 in order to use useHistory()")  : void 0;
      }
    
      return useContext(historyContext);
    }
    function useLocation() {
      {
        !(typeof useContext === "function") ?  invariant(false, "You must use React >= 16.8 in order to use useLocation()")  : void 0;
      }
    
      return useContext(context).location;
    }
    function useParams() {
      {
        !(typeof useContext === "function") ?  invariant(false, "You must use React >= 16.8 in order to use useParams()")  : void 0;
      }
    
      var match = useContext(context).match;
      return match ? match.params : {};
    }
    function useRouteMatch(path) {
      {
        !(typeof useContext === "function") ?  invariant(false, "You must use React >= 16.8 in order to use useRouteMatch()")  : void 0;
      }
    
      var location = useLocation();
      var match = useContext(context).match;
      return path ? matchPath(location.pathname, path) : match;
    }
    
    {
      if (typeof window !== "undefined") {
        var global = window;
        var key = "__react_router_build__";
        var buildNames = {
          cjs: "CommonJS",
          esm: "ES modules",
          umd: "UMD"
        };
    
        if (global[key] && global[key] !== "cjs") {
          var initialBuildName = buildNames[global[key]];
          var secondaryBuildName = buildNames["cjs"]; // TODO: Add link to article that explains in detail how to avoid
          // loading 2 different builds.
    
          throw new Error("You are loading the " + secondaryBuildName + " build of React Router " + ("on a page that is already running the " + initialBuildName + " ") + "build, so things won't work right.");
        }
    
        global[key] = "cjs";
      }
    }
    
    exports.MemoryRouter = MemoryRouter;
    exports.Prompt = Prompt;
    exports.Redirect = Redirect;
    exports.Route = Route;
    exports.Router = Router;
    exports.StaticRouter = StaticRouter;
    exports.Switch = Switch;
    exports.__HistoryContext = historyContext;
    exports.__RouterContext = context;
    exports.generatePath = generatePath;
    exports.matchPath = matchPath;
    exports.useHistory = useHistory;
    exports.useLocation = useLocation;
    exports.useParams = useParams;
    exports.useRouteMatch = useRouteMatch;
    exports.withRouter = withRouter;
    
    
    },{"history":5,"hoist-non-react-statics":6,"mini-create-react-context":7,"path-to-regexp":9,"prop-types":15,"react":undefined,"react-is":19,"tiny-invariant":29,"tiny-warning":30}],24:[function(require,module,exports){
    "use strict";function _interopDefault(t){return t&&"object"==typeof t&&"default"in t?t.default:t}Object.defineProperty(exports,"__esModule",{value:!0});var React=_interopDefault(require("react"));require("prop-types");var history=require("history");require("tiny-warning");var createContext=_interopDefault(require("mini-create-react-context")),invariant=_interopDefault(require("tiny-invariant")),pathToRegexp=_interopDefault(require("path-to-regexp"));require("react-is");var hoistStatics=_interopDefault(require("hoist-non-react-statics"));function _extends(){return(_extends=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o])}return t}).apply(this,arguments)}function _inheritsLoose(t,e){t.prototype=Object.create(e.prototype),(t.prototype.constructor=t).__proto__=e}function _objectWithoutPropertiesLoose(t,e){if(null==t)return{};var n,o,r={},a=Object.keys(t);for(o=0;o<a.length;o++)n=a[o],0<=e.indexOf(n)||(r[n]=t[n]);return r}var createNamedContext=function(t){var e=createContext();return e.displayName=t,e},historyContext=createNamedContext("Router-History"),createNamedContext$1=function(t){var e=createContext();return e.displayName=t,e},context=createNamedContext$1("Router"),Router=function(n){function t(t){var e;return(e=n.call(this,t)||this).state={location:t.history.location},e._isMounted=!1,e._pendingLocation=null,t.staticContext||(e.unlisten=t.history.listen(function(t){e._isMounted?e.setState({location:t}):e._pendingLocation=t})),e}_inheritsLoose(t,n),t.computeRootMatch=function(t){return{path:"/",url:"/",params:{},isExact:"/"===t}};var e=t.prototype;return e.componentDidMount=function(){this._isMounted=!0,this._pendingLocation&&this.setState({location:this._pendingLocation})},e.componentWillUnmount=function(){this.unlisten&&this.unlisten()},e.render=function(){return React.createElement(context.Provider,{value:{history:this.props.history,location:this.state.location,match:t.computeRootMatch(this.state.location.pathname),staticContext:this.props.staticContext}},React.createElement(historyContext.Provider,{children:this.props.children||null,value:this.props.history}))},t}(React.Component),MemoryRouter=function(r){function t(){for(var t,e=arguments.length,n=new Array(e),o=0;o<e;o++)n[o]=arguments[o];return(t=r.call.apply(r,[this].concat(n))||this).history=history.createMemoryHistory(t.props),t}return _inheritsLoose(t,r),t.prototype.render=function(){return React.createElement(Router,{history:this.history,children:this.props.children})},t}(React.Component),Lifecycle=function(t){function e(){return t.apply(this,arguments)||this}_inheritsLoose(e,t);var n=e.prototype;return n.componentDidMount=function(){this.props.onMount&&this.props.onMount.call(this,this)},n.componentDidUpdate=function(t){this.props.onUpdate&&this.props.onUpdate.call(this,this,t)},n.componentWillUnmount=function(){this.props.onUnmount&&this.props.onUnmount.call(this,this)},n.render=function(){return null},e}(React.Component);function Prompt(t){var o=t.message,e=t.when,r=void 0===e||e;return React.createElement(context.Consumer,null,function(t){if(t||invariant(!1),!r||t.staticContext)return null;var n=t.history.block;return React.createElement(Lifecycle,{onMount:function(t){t.release=n(o)},onUpdate:function(t,e){e.message!==o&&(t.release(),t.release=n(o))},onUnmount:function(t){t.release()},message:o})})}var cache={},cacheLimit=1e4,cacheCount=0;function compilePath(t){if(cache[t])return cache[t];var e=pathToRegexp.compile(t);return cacheCount<cacheLimit&&(cache[t]=e,cacheCount++),e}function generatePath(t,e){return void 0===t&&(t="/"),void 0===e&&(e={}),"/"===t?t:compilePath(t)(e,{pretty:!0})}function Redirect(t){var a=t.computedMatch,i=t.to,e=t.push,c=void 0!==e&&e;return React.createElement(context.Consumer,null,function(t){t||invariant(!1);var e=t.history,n=t.staticContext,o=c?e.push:e.replace,r=history.createLocation(a?"string"==typeof i?generatePath(i,a.params):_extends({},i,{pathname:generatePath(i.pathname,a.params)}):i);return n?(o(r),null):React.createElement(Lifecycle,{onMount:function(){o(r)},onUpdate:function(t,e){var n=history.createLocation(e.to);history.locationsAreEqual(n,_extends({},r,{key:n.key}))||o(r)},to:i})})}var cache$1={},cacheLimit$1=1e4,cacheCount$1=0;function compilePath$1(t,e){var n=""+e.end+e.strict+e.sensitive,o=cache$1[n]||(cache$1[n]={});if(o[t])return o[t];var r=[],a={regexp:pathToRegexp(t,r,e),keys:r};return cacheCount$1<cacheLimit$1&&(o[t]=a,cacheCount$1++),a}function matchPath(u,t){void 0===t&&(t={}),"string"!=typeof t&&!Array.isArray(t)||(t={path:t});var e=t,n=e.path,o=e.exact,p=void 0!==o&&o,r=e.strict,h=void 0!==r&&r,a=e.sensitive,l=void 0!==a&&a;return[].concat(n).reduce(function(t,e){if(!e&&""!==e)return null;if(t)return t;var n=compilePath$1(e,{end:p,strict:h,sensitive:l}),o=n.regexp,r=n.keys,a=o.exec(u);if(!a)return null;var i=a[0],c=a.slice(1),s=u===i;return p&&!s?null:{path:e,url:"/"===e&&""===i?"/":i,isExact:s,params:r.reduce(function(t,e,n){return t[e.name]=c[n],t},{})}},null)}var Route=function(t){function e(){return t.apply(this,arguments)||this}return _inheritsLoose(e,t),e.prototype.render=function(){var c=this;return React.createElement(context.Consumer,null,function(t){t||invariant(!1);var e=c.props.location||t.location,n=_extends({},t,{location:e,match:c.props.computedMatch?c.props.computedMatch:c.props.path?matchPath(e.pathname,c.props):t.match}),o=c.props,r=o.children,a=o.component,i=o.render;return Array.isArray(r)&&0===r.length&&(r=null),React.createElement(context.Provider,{value:n},n.match?r?"function"==typeof r?r(n):r:a?React.createElement(a,n):i?i(n):null:"function"==typeof r?r(n):null)})},e}(React.Component);function addLeadingSlash(t){return"/"===t.charAt(0)?t:"/"+t}function addBasename(t,e){return t?_extends({},e,{pathname:addLeadingSlash(t)+e.pathname}):e}function stripBasename(t,e){if(!t)return e;var n=addLeadingSlash(t);return 0!==e.pathname.indexOf(n)?e:_extends({},e,{pathname:e.pathname.substr(n.length)})}function createURL(t){return"string"==typeof t?t:history.createPath(t)}function staticHandler(t){return function(){invariant(!1)}}function noop(){}var StaticRouter=function(r){function t(){for(var e,t=arguments.length,n=new Array(t),o=0;o<t;o++)n[o]=arguments[o];return(e=r.call.apply(r,[this].concat(n))||this).handlePush=function(t){return e.navigateTo(t,"PUSH")},e.handleReplace=function(t){return e.navigateTo(t,"REPLACE")},e.handleListen=function(){return noop},e.handleBlock=function(){return noop},e}_inheritsLoose(t,r);var e=t.prototype;return e.navigateTo=function(t,e){var n=this.props,o=n.basename,r=void 0===o?"":o,a=n.context,i=void 0===a?{}:a;i.action=e,i.location=addBasename(r,history.createLocation(t)),i.url=createURL(i.location)},e.render=function(){var t=this.props,e=t.basename,n=void 0===e?"":e,o=t.context,r=void 0===o?{}:o,a=t.location,i=void 0===a?"/":a,c=_objectWithoutPropertiesLoose(t,["basename","context","location"]),s={createHref:function(t){return addLeadingSlash(n+createURL(t))},action:"POP",location:stripBasename(n,history.createLocation(i)),push:this.handlePush,replace:this.handleReplace,go:staticHandler(),goBack:staticHandler(),goForward:staticHandler(),listen:this.handleListen,block:this.handleBlock};return React.createElement(Router,_extends({},c,{history:s,staticContext:r}))},t}(React.Component),Switch=function(t){function e(){return t.apply(this,arguments)||this}return _inheritsLoose(e,t),e.prototype.render=function(){var t=this;return React.createElement(context.Consumer,null,function(n){n||invariant(!1);var o,r,a=t.props.location||n.location;return React.Children.forEach(t.props.children,function(t){if(null==r&&React.isValidElement(t)){var e=(o=t).props.path||t.props.from;r=e?matchPath(a.pathname,_extends({},t.props,{path:e})):n.match}}),r?React.cloneElement(o,{location:a,computedMatch:r}):null})},e}(React.Component);function withRouter(o){function t(t){var e=t.wrappedComponentRef,n=_objectWithoutPropertiesLoose(t,["wrappedComponentRef"]);return React.createElement(context.Consumer,null,function(t){return t||invariant(!1),React.createElement(o,_extends({},n,t,{ref:e}))})}var e="withRouter("+(o.displayName||o.name)+")";return t.displayName=e,t.WrappedComponent=o,hoistStatics(t,o)}var useContext=React.useContext;function useHistory(){return useContext(historyContext)}function useLocation(){return useContext(context).location}function useParams(){var t=useContext(context).match;return t?t.params:{}}function useRouteMatch(t){var e=useLocation(),n=useContext(context).match;return t?matchPath(e.pathname,t):n}exports.MemoryRouter=MemoryRouter,exports.Prompt=Prompt,exports.Redirect=Redirect,exports.Route=Route,exports.Router=Router,exports.StaticRouter=StaticRouter,exports.Switch=Switch,exports.__HistoryContext=historyContext,exports.__RouterContext=context,exports.generatePath=generatePath,exports.matchPath=matchPath,exports.useHistory=useHistory,exports.useLocation=useLocation,exports.useParams=useParams,exports.useRouteMatch=useRouteMatch,exports.withRouter=withRouter;
    
    
    },{"history":5,"hoist-non-react-statics":6,"mini-create-react-context":7,"path-to-regexp":9,"prop-types":15,"react":undefined,"react-is":19,"tiny-invariant":29,"tiny-warning":30}],25:[function(require,module,exports){
    (function (process){(function (){
    "use strict";
    
    if (process.env.NODE_ENV === "production") {
      module.exports = require("./cjs/react-router.min.js");
    } else {
      module.exports = require("./cjs/react-router.js");
    }
    
    }).call(this)}).call(this,require('_process'))
    },{"./cjs/react-router.js":23,"./cjs/react-router.min.js":24,"_process":11}],26:[function(require,module,exports){
    'use strict';
    
    function isAbsolute(pathname) {
      return pathname.charAt(0) === '/';
    }
    
    // About 1.5x faster than the two-arg version of Array#splice()
    function spliceOne(list, index) {
      for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
        list[i] = list[k];
      }
    
      list.pop();
    }
    
    // This implementation is based heavily on node's url.parse
    function resolvePathname(to, from) {
      if (from === undefined) from = '';
    
      var toParts = (to && to.split('/')) || [];
      var fromParts = (from && from.split('/')) || [];
    
      var isToAbs = to && isAbsolute(to);
      var isFromAbs = from && isAbsolute(from);
      var mustEndAbs = isToAbs || isFromAbs;
    
      if (to && isAbsolute(to)) {
        // to is absolute
        fromParts = toParts;
      } else if (toParts.length) {
        // to is relative, drop the filename
        fromParts.pop();
        fromParts = fromParts.concat(toParts);
      }
    
      if (!fromParts.length) return '/';
    
      var hasTrailingSlash;
      if (fromParts.length) {
        var last = fromParts[fromParts.length - 1];
        hasTrailingSlash = last === '.' || last === '..' || last === '';
      } else {
        hasTrailingSlash = false;
      }
    
      var up = 0;
      for (var i = fromParts.length; i >= 0; i--) {
        var part = fromParts[i];
    
        if (part === '.') {
          spliceOne(fromParts, i);
        } else if (part === '..') {
          spliceOne(fromParts, i);
          up++;
        } else if (up) {
          spliceOne(fromParts, i);
          up--;
        }
      }
    
      if (!mustEndAbs) for (; up--; up) fromParts.unshift('..');
    
      if (
        mustEndAbs &&
        fromParts[0] !== '' &&
        (!fromParts[0] || !isAbsolute(fromParts[0]))
      )
        fromParts.unshift('');
    
      var result = fromParts.join('/');
    
      if (hasTrailingSlash && result.substr(-1) !== '/') result += '/';
    
      return result;
    }
    
    module.exports = resolvePathname;
    
    },{}],27:[function(require,module,exports){
    "use strict";function isAbsolute(e){return"/"===e.charAt(0)}function spliceOne(e,t){for(var s=t,n=s+1,i=e.length;n<i;s+=1,n+=1)e[s]=e[n];e.pop()}function resolvePathname(e,t){void 0===t&&(t="");var s,n=e&&e.split("/")||[],i=t&&t.split("/")||[],l=e&&isAbsolute(e),r=t&&isAbsolute(t),o=l||r;if(e&&isAbsolute(e)?i=n:n.length&&(i.pop(),i=i.concat(n)),!i.length)return"/";if(i.length){var u=i[i.length-1];s="."===u||".."===u||""===u}else s=!1;for(var a=0,c=i.length;0<=c;c--){var f=i[c];"."===f?spliceOne(i,c):".."===f?(spliceOne(i,c),a++):a&&(spliceOne(i,c),a--)}if(!o)for(;a--;a)i.unshift("..");!o||""===i[0]||i[0]&&isAbsolute(i[0])||i.unshift("");var h=i.join("/");return s&&"/"!==h.substr(-1)&&(h+="/"),h}module.exports=resolvePathname;
    
    },{}],28:[function(require,module,exports){
    (function (process){(function (){
    'use strict';
    
    if (process.env.NODE_ENV === 'production') {
      module.exports = require('./cjs/resolve-pathname.min.js');
    } else {
      module.exports = require('./cjs/resolve-pathname.js');
    }
    
    }).call(this)}).call(this,require('_process'))
    },{"./cjs/resolve-pathname.js":26,"./cjs/resolve-pathname.min.js":27,"_process":11}],29:[function(require,module,exports){
    (function (process){(function (){
    'use strict';
    
    Object.defineProperty(exports, "__esModule", { value: true });
    var isProduction = process.env.NODE_ENV === 'production';
    var prefix = 'Invariant failed';
    function invariant(condition, message) {
        if (condition) {
            return;
        }
        if (isProduction) {
            throw new Error(prefix);
        }
        throw new Error(prefix + ": " + (message || ''));
    }
    exports.default = invariant;
    
    }).call(this)}).call(this,require('_process'))
    },{"_process":11}],30:[function(require,module,exports){
    (function (process){(function (){
    'use strict';
    
    var isProduction = process.env.NODE_ENV === 'production';
    function warning(condition, message) {
      if (!isProduction) {
        if (condition) {
          return;
        }
    
        var text = "Warning: " + message;
    
        if (typeof console !== 'undefined') {
          console.warn(text);
        }
    
        try {
          throw Error(text);
        } catch (x) {}
      }
    }
    
    module.exports = warning;
    
    }).call(this)}).call(this,require('_process'))
    },{"_process":11}],31:[function(require,module,exports){
    'use strict';
    
    function valueOf(obj) {
      return obj.valueOf ? obj.valueOf() : Object.prototype.valueOf.call(obj);
    }
    
    function valueEqual(a, b) {
      // Test for strict equality first.
      if (a === b) return true;
    
      // Otherwise, if either of them == null they are not equal.
      if (a == null || b == null) return false;
    
      if (Array.isArray(a)) {
        return (
          Array.isArray(b) &&
          a.length === b.length &&
          a.every(function(item, index) {
            return valueEqual(item, b[index]);
          })
        );
      }
    
      if (typeof a === 'object' || typeof b === 'object') {
        var aValue = valueOf(a);
        var bValue = valueOf(b);
    
        if (aValue !== a || bValue !== b) return valueEqual(aValue, bValue);
    
        return Object.keys(Object.assign({}, a, b)).every(function(key) {
          return valueEqual(a[key], b[key]);
        });
      }
    
      return false;
    }
    
    module.exports = valueEqual;
    
    },{}],32:[function(require,module,exports){
    "use strict";function valueOf(e){return e.valueOf?e.valueOf():Object.prototype.valueOf.call(e)}function valueEqual(u,r){if(u===r)return!0;if(null==u||null==r)return!1;if(Array.isArray(u))return Array.isArray(r)&&u.length===r.length&&u.every(function(e,u){return valueEqual(e,r[u])});if("object"!=typeof u&&"object"!=typeof r)return!1;var e=valueOf(u),t=valueOf(r);return e!==u||t!==r?valueEqual(e,t):Object.keys(Object.assign({},u,r)).every(function(e){return valueEqual(u[e],r[e])})}module.exports=valueEqual;
    
    },{}],33:[function(require,module,exports){
    (function (process){(function (){
    'use strict';
    
    if (process.env.NODE_ENV === 'production') {
      module.exports = require('./cjs/value-equal.min.js');
    } else {
      module.exports = require('./cjs/value-equal.js');
    }
    
    }).call(this)}).call(this,require('_process'))
    },{"./cjs/value-equal.js":31,"./cjs/value-equal.min.js":32,"_process":11}],34:[function(require,module,exports){
    "use strict";
    
    function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = void 0;
    
    var _react = _interopRequireWildcard(require("react"));
    
    var _reactRouterDom = require("react-router-dom");
    
    var _AppointmentsPage = require("./containers/appointmentsPage/AppointmentsPage");
    
    var _ContactsPage = require("./containers/contactsPage/ContactsPage");
    
    function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
    
    function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
    
    function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
    
    function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
    
    function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
    
    function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
    
    function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
    
    function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
    
    function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
    
    function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
    
    function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
    
    function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
    
    function App() {
      /*
      Define state variables for 
      contacts and appointments 
      */
      var ROUTES = {
        CONTACTS: "/contacts",
        APPOINTMENTS: "/appointments"
      };
      var defaultContacts = [{
        name: 'Dick Dastardly',
        phone: '07123123456',
        email: 'dick@example.com'
      }, {
        name: 'Postman Pat',
        phone: '07234589102',
        email: 'pat@example.com'
      }];
      /*
      Implement functions to add data to
      contacts and appointments
      */
    
      var _useState = (0, _react.useState)(defaultContacts),
          _useState2 = _slicedToArray(_useState, 2),
          contacts = _useState2[0],
          setContacts = _useState2[1];
    
      var addContact = function addContact(name, phone, email) {
        setContacts(function (prev) {
          return [].concat(_toConsumableArray(prev), [{
            name: name,
            phone: phone,
            email: email
          }]);
        });
      };
    
      var _useState3 = (0, _react.useState)([]),
          _useState4 = _slicedToArray(_useState3, 2),
          appointments = _useState4[0],
          setAppointments = _useState4[1];
    
      var addAppointment = function addAppointment(title, contact, date, time) {
        setAppointments(function (prev) {
          return [].concat(_toConsumableArray(prev), [{
            title: title,
            contact: contact,
            date: date,
            time: time
          }]);
        });
      };
    
      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("nav", null, /*#__PURE__*/_react["default"].createElement(_reactRouterDom.NavLink, {
        to: ROUTES.CONTACTS,
        activeClassName: "active"
      }, "Contacts"), /*#__PURE__*/_react["default"].createElement(_reactRouterDom.NavLink, {
        to: ROUTES.APPOINTMENTS,
        activeClassName: "active"
      }, "Appointments")), /*#__PURE__*/_react["default"].createElement("main", null, /*#__PURE__*/_react["default"].createElement(_reactRouterDom.Switch, null, /*#__PURE__*/_react["default"].createElement(_reactRouterDom.Route, {
        exact: true,
        path: "/"
      }, /*#__PURE__*/_react["default"].createElement(_reactRouterDom.Redirect, {
        to: ROUTES.CONTACTS
      })), /*#__PURE__*/_react["default"].createElement(_reactRouterDom.Route, {
        path: ROUTES.CONTACTS
      }, /*#__PURE__*/_react["default"].createElement(_ContactsPage.ContactsPage, {
        contacts: contacts,
        addContact: addContact
      })), /*#__PURE__*/_react["default"].createElement(_reactRouterDom.Route, {
        path: ROUTES.APPOINTMENTS
      }, /*#__PURE__*/_react["default"].createElement(_AppointmentsPage.AppointmentsPage, {
        appointments: appointments,
        addAppointment: addAppointment,
        contacts: contacts
      })))));
    }
    
    var _default = App;
    exports["default"] = _default;
    
    },{"./containers/appointmentsPage/AppointmentsPage":40,"./containers/contactsPage/ContactsPage":41,"react":undefined,"react-router-dom":22}],35:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.AppointmentForm = void 0;
    
    var _react = _interopRequireDefault(require("react"));
    
    var _ContactPicker = require("../../components/contactPicker/ContactPicker");
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
    
    function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
    
    function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
    
    function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
    
    function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
    
    function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
    
    function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
    
    var AppointmentForm = function AppointmentForm(_ref) {
      var contacts = _ref.contacts,
          title = _ref.title,
          setTitle = _ref.setTitle,
          contact = _ref.contact,
          setContact = _ref.setContact,
          date = _ref.date,
          setDate = _ref.setDate,
          time = _ref.time,
          setTime = _ref.setTime,
          handleSubmit = _ref.handleSubmit,
          alert = _ref.alert,
          defaultListValue = _ref.defaultListValue;
    
      var getTodayString = function getTodayString() {
        var _Date$toLocaleDateStr = new Date().toLocaleDateString("en-US").split("/"),
            _Date$toLocaleDateStr2 = _slicedToArray(_Date$toLocaleDateStr, 3),
            month = _Date$toLocaleDateStr2[0],
            day = _Date$toLocaleDateStr2[1],
            year = _Date$toLocaleDateStr2[2];
    
        return "".concat(year, "-").concat(month.padStart(2, "0"), "-").concat(day.padStart(2, "0"));
      };
    
      return /*#__PURE__*/_react["default"].createElement("form", {
        onSubmit: handleSubmit
      }, /*#__PURE__*/_react["default"].createElement("label", {
        htmlFor: "titleInput"
      }, "Title"), /*#__PURE__*/_react["default"].createElement("input", {
        value: title,
        onChange: function onChange(e) {
          return setTitle(e.target.value);
        },
        type: "text",
        id: "titleInput",
        required: true
      }), /*#__PURE__*/_react["default"].createElement(_ContactPicker.ContactPicker, {
        contacts: contacts,
        onChange: function onChange(e) {
          return setContact(e.target.value);
        },
        defaultListValue: defaultListValue
      }), /*#__PURE__*/_react["default"].createElement("label", {
        htmlFor: "dateInput"
      }, "Date"), /*#__PURE__*/_react["default"].createElement("input", {
        value: date,
        onChange: function onChange(e) {
          return setDate(e.target.value);
        },
        type: "text",
        id: "dateInput",
        min: getTodayString(),
        required: true
      }), /*#__PURE__*/_react["default"].createElement("label", {
        htmlFor: "timeInput"
      }, "Time"), /*#__PURE__*/_react["default"].createElement("input", {
        value: time,
        onChange: function onChange(e) {
          return setTime(e.target.value);
        },
        type: "text",
        id: "timeInput",
        required: true
      }), /*#__PURE__*/_react["default"].createElement("button", {
        type: "submit",
        disabled: alert ? true : false
      }, "Add Appointment"), /*#__PURE__*/_react["default"].createElement("h2", {
        className: "alert"
      }, alert));
    };
    
    exports.AppointmentForm = AppointmentForm;
    
    },{"../../components/contactPicker/ContactPicker":37,"react":undefined}],36:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ContactForm = void 0;
    
    var _react = _interopRequireDefault(require("react"));
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
    
    var ContactForm = function ContactForm(_ref) {
      var name = _ref.name,
          setName = _ref.setName,
          phone = _ref.phone,
          setPhone = _ref.setPhone,
          email = _ref.email,
          setEmail = _ref.setEmail,
          handleSubmit = _ref.handleSubmit,
          alert = _ref.alert;
      return /*#__PURE__*/_react["default"].createElement("form", {
        onSubmit: handleSubmit
      }, /*#__PURE__*/_react["default"].createElement("label", {
        htmlFor: "nameInput"
      }, "Name"), /*#__PURE__*/_react["default"].createElement("input", {
        value: name,
        onChange: function onChange(e) {
          return setName(e.target.value);
        },
        type: "text",
        id: "nameInput",
        required: true
      }), /*#__PURE__*/_react["default"].createElement("label", {
        htmlFor: "phoneInput"
      }, "Phone"), /*#__PURE__*/_react["default"].createElement("input", {
        value: phone,
        onChange: function onChange(e) {
          return setPhone(e.target.value);
        },
        type: "tel",
        pattern: "^\\s*\\(?(020[7,8]{1}\\)?[ ]?[1-9]{1}[0-9{2}[ ]?[0-9]{4})|(0[1-8]{1}[0-9]{3}\\)?[ ]?[1-9]{1}[0-9]{2}[ ]?[0-9]{3})\\s*$",
        id: "phoneInput",
        required: true
      }), /*#__PURE__*/_react["default"].createElement("label", {
        htmlFor: "emailInput"
      }, "Email"), /*#__PURE__*/_react["default"].createElement("input", {
        value: email,
        onChange: function onChange(e) {
          return setEmail(e.target.value);
        },
        type: "email",
        id: "emailInput",
        required: true
      }), /*#__PURE__*/_react["default"].createElement("button", {
        type: "submit",
        disabled: alert ? true : false
      }, "Add Contact"), /*#__PURE__*/_react["default"].createElement("h2", {
        className: "alert"
      }, alert));
    };
    
    exports.ContactForm = ContactForm;
    
    },{"react":undefined}],37:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ContactPicker = void 0;
    
    var _react = _interopRequireDefault(require("react"));
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
    
    var ContactPicker = function ContactPicker(props) {
      var names = props.contact.map(function (contact) {
        return /*#__PURE__*/_react["default"].createElement("option", {
          value: contact.name,
          key: contact.name
        }, contact.name);
      });
      return /*#__PURE__*/_react["default"].createElement("form", null, /*#__PURE__*/_react["default"].createElement("label", {
        htmlFor: "contactList"
      }, "Choose Contact:"), /*#__PURE__*/_react["default"].createElement("select", {
        id: "contactList",
        onChange: props.onChange,
        required: true
      }, /*#__PURE__*/_react["default"].createElement("option", {
        value: props.defaultListValue,
        key: "default",
        selected: "selected"
      }, props.defaultListValue)));
    };
    
    exports.ContactPicker = ContactPicker;
    
    },{"react":undefined}],38:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Tile = void 0;
    
    var _react = _interopRequireDefault(require("react"));
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
    
    var Tile = function Tile(props) {
      var object = props.info;
      var values = Object.values(object);
      var info = values.map(function (value, index) {
        var className;
    
        if (index === 0) {
          className = 'tile-title';
        } else {
          className = 'tile';
        }
    
        return /*#__PURE__*/_react["default"].createElement("p", {
          key: index,
          className: className
        }, value);
      });
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "tile-container"
      }, info);
    };
    
    exports.Tile = Tile;
    
    },{"react":undefined}],39:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.TileList = void 0;
    
    var _react = _interopRequireDefault(require("react"));
    
    var _Tile = require("../tile/Tile");
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
    
    var TileList = function TileList(props) {
      var tiles = props.object.map(function (info, index) {
        return /*#__PURE__*/_react["default"].createElement(_Tile.Tile, {
          info: info,
          key: index
        });
      });
      return /*#__PURE__*/_react["default"].createElement("div", null, tiles);
    };
    
    exports.TileList = TileList;
    
    },{"../tile/Tile":38,"react":undefined}],40:[function(require,module,exports){
    "use strict";
    
    function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.AppointmentsPage = void 0;
    
    var _react = _interopRequireWildcard(require("react"));
    
    var _AppointmentForm = require("../../components/appointmentForm/AppointmentForm");
    
    var _TileList = require("../../components/tileList/TileList");
    
    function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
    
    function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
    
    function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
    
    function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
    
    function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
    
    function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
    
    function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
    
    function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
    
    function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
    
    var AppointmentsPage = function AppointmentsPage(props) {
      /*
      Define state variables for 
      appointment info
      */
      var _useState = (0, _react.useState)(''),
          _useState2 = _slicedToArray(_useState, 2),
          currentTitle = _useState2[0],
          setCurrentTitle = _useState2[1];
    
      var _useState3 = (0, _react.useState)(''),
          _useState4 = _slicedToArray(_useState3, 2),
          currentContact = _useState4[0],
          setCurrentContact = _useState4[1];
    
      var _useState5 = (0, _react.useState)(''),
          _useState6 = _slicedToArray(_useState5, 2),
          currentDate = _useState6[0],
          setCurrentDate = _useState6[1];
    
      var _useState7 = (0, _react.useState)(''),
          _useState8 = _slicedToArray(_useState7, 2),
          currentTime = _useState8[0],
          setCurrentTime = _useState8[1];
    
      var _useState9 = (0, _react.useState)(''),
          _useState10 = _slicedToArray(_useState9, 2),
          alert = _useState10[0],
          setAlert = _useState10[1];
    
      var defaultListValue = 'No contact selected';
    
      var handleSubmit = function handleSubmit(e) {
        e.preventDefault();
        /*
        Add contact info and clear data  
        */
    
        props.addAppointment(currentTitle, currentContact, currentDate, currentTime);
        setCurrentTitle('');
        setCurrentContact('');
        setCurrentDate('');
        setCurrentTime('');
        document.getElementById('contactList').value = defaultListValue;
      };
    
      (0, _react.useEffect)(function () {
        var _iterator = _createForOfIteratorHelper(props.appointments),
            _step;
    
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var appointmentItem = _step.value;
    
            if (appointmentItem.date === currentDate && appointmentItem.time === currentTime) {
              setAlert('Appointment is already booked.');
              console.log('Appointment is already booked.');
            } else {
              setAlert('');
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }, [props.appointments, currentDate, currentTime]);
      return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("section", null, /*#__PURE__*/_react["default"].createElement("h2", null, "Add Appointment"), /*#__PURE__*/_react["default"].createElement(_AppointmentForm.AppointmentForm, {
        contacts: props.contacts,
        title: currentTitle,
        setTitle: setCurrentTitle,
        contact: currentContact,
        setContact: setCurrentContact,
        date: currentDate,
        setDate: setCurrentDate,
        time: currentTime,
        setTime: setCurrentTime,
        handleSubmit: handleSubmit,
        alert: alert,
        defaultListValue: defaultListValue
      })), /*#__PURE__*/_react["default"].createElement("hr", null), /*#__PURE__*/_react["default"].createElement("section", null, /*#__PURE__*/_react["default"].createElement("h2", null, "Appointments"), /*#__PURE__*/_react["default"].createElement(_TileList.TileList, {
        object: props.appointments
      })));
    };
    
    exports.AppointmentsPage = AppointmentsPage;
    
    },{"../../components/appointmentForm/AppointmentForm":35,"../../components/tileList/TileList":39,"react":undefined}],41:[function(require,module,exports){
    "use strict";
    
    function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ContactsPage = void 0;
    
    var _react = _interopRequireWildcard(require("react"));
    
    var _ContactForm = require("../../components/contactForm/ContactForm");
    
    var _TileList = require("../../components/tileList/TileList");
    
    function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
    
    function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
    
    function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
    
    function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
    
    function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
    
    function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
    
    function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
    
    function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
    
    function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
    
    var ContactsPage = function ContactsPage(props) {
      /*
      Define state variables for 
      contact info and duplicate check
      */
      var _useState = (0, _react.useState)(''),
          _useState2 = _slicedToArray(_useState, 2),
          currentName = _useState2[0],
          setCurrentName = _useState2[1];
    
      var _useState3 = (0, _react.useState)(''),
          _useState4 = _slicedToArray(_useState3, 2),
          currentPhone = _useState4[0],
          setCurrentPhone = _useState4[1];
    
      var _useState5 = (0, _react.useState)(''),
          _useState6 = _slicedToArray(_useState5, 2),
          currentEmail = _useState6[0],
          setCurrentEmail = _useState6[1];
    
      var _useState7 = (0, _react.useState)(false),
          _useState8 = _slicedToArray(_useState7, 2),
          duplicates = _useState8[0],
          setDuplicates = _useState8[1];
    
      var _useState9 = (0, _react.useState)(''),
          _useState10 = _slicedToArray(_useState9, 2),
          alert = _useState10[0],
          setAlert = _useState10[1];
    
      var handleSubmit = function handleSubmit(e) {
        e.preventDefault();
        /*
        Add contact info and clear data
        if the contact name is not a duplicate
        */
    
        if (!duplicates) {
          props.addContact(currentName, currentPhone, currentEmail);
          setCurrentName('');
          setCurrentPhone('');
          setCurrentEmail('');
        }
      };
      /*
      Using hooks, check for contact name in the 
      contacts array variable in props
      */
    
    
      (0, _react.useEffect)(function () {
        var _iterator = _createForOfIteratorHelper(props.contacts),
            _step;
    
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var contactItem = _step.value;
    
            if (contactItem.name === currentName) {
              if (!duplicates) {
                setDuplicates(true);
                setAlert('Contact is already in the list.');
                console.log('Contact is already in the list.');
              }
    
              return;
            } else {
              setDuplicates(false);
              setAlert('');
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }, [props.contacts, currentName, duplicates]);
      return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("section", null, /*#__PURE__*/_react["default"].createElement("h2", null, "Add Contact"), /*#__PURE__*/_react["default"].createElement(_ContactForm.ContactForm, {
        name: currentName,
        setName: setCurrentName,
        phone: currentPhone,
        setPhone: setCurrentPhone,
        email: currentEmail,
        setEmail: setCurrentEmail,
        handleSubmit: handleSubmit,
        alert: alert
      })), /*#__PURE__*/_react["default"].createElement("hr", null), /*#__PURE__*/_react["default"].createElement("section", null, /*#__PURE__*/_react["default"].createElement("h2", null, "Contacts"), /*#__PURE__*/_react["default"].createElement(_TileList.TileList, {
        object: props.contacts
      })));
    };
    
    exports.ContactsPage = ContactsPage;
    
    },{"../../components/contactForm/ContactForm":36,"../../components/tileList/TileList":39,"react":undefined}],42:[function(require,module,exports){
    "use strict";
    
    var _react = _interopRequireDefault(require("react"));
    
    var _reactDom = _interopRequireDefault(require("react-dom"));
    
    var _App = _interopRequireDefault(require("./App"));
    
    var _reactRouterDom = require("react-router-dom");
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
    
    _reactDom["default"].render( /*#__PURE__*/_react["default"].createElement(_reactRouterDom.BrowserRouter, null, /*#__PURE__*/_react["default"].createElement(_App["default"], null)), document.getElementById('root'));
    
    },{"./App":34,"react":undefined,"react-dom":undefined,"react-router-dom":22}]},{},[42]);
    