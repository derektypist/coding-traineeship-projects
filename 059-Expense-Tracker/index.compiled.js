(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
    var v1 = require('./v1');
    var v4 = require('./v4');
    
    var uuid = v4;
    uuid.v1 = v1;
    uuid.v4 = v4;
    
    module.exports = uuid;
    
    },{"./v1":4,"./v4":5}],2:[function(require,module,exports){
    /**
     * Convert array of 16 byte values to UUID string format of the form:
     * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
     */
    var byteToHex = [];
    for (var i = 0; i < 256; ++i) {
      byteToHex[i] = (i + 0x100).toString(16).substr(1);
    }
    
    function bytesToUuid(buf, offset) {
      var i = offset || 0;
      var bth = byteToHex;
      // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
      return ([
        bth[buf[i++]], bth[buf[i++]],
        bth[buf[i++]], bth[buf[i++]], '-',
        bth[buf[i++]], bth[buf[i++]], '-',
        bth[buf[i++]], bth[buf[i++]], '-',
        bth[buf[i++]], bth[buf[i++]], '-',
        bth[buf[i++]], bth[buf[i++]],
        bth[buf[i++]], bth[buf[i++]],
        bth[buf[i++]], bth[buf[i++]]
      ]).join('');
    }
    
    module.exports = bytesToUuid;
    
    },{}],3:[function(require,module,exports){
    // Unique ID creation requires a high quality random # generator.  In the
    // browser this is a little complicated due to unknown quality of Math.random()
    // and inconsistent support for the `crypto` API.  We do the best we can via
    // feature-detection
    
    // getRandomValues needs to be invoked in a context where "this" is a Crypto
    // implementation. Also, find the complete implementation of crypto on IE11.
    var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                          (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));
    
    if (getRandomValues) {
      // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
      var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef
    
      module.exports = function whatwgRNG() {
        getRandomValues(rnds8);
        return rnds8;
      };
    } else {
      // Math.random()-based (RNG)
      //
      // If all else fails, use Math.random().  It's fast, but is of unspecified
      // quality.
      var rnds = new Array(16);
    
      module.exports = function mathRNG() {
        for (var i = 0, r; i < 16; i++) {
          if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
          rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
        }
    
        return rnds;
      };
    }
    
    },{}],4:[function(require,module,exports){
    var rng = require('./lib/rng');
    var bytesToUuid = require('./lib/bytesToUuid');
    
    // **`v1()` - Generate time-based UUID**
    //
    // Inspired by https://github.com/LiosK/UUID.js
    // and http://docs.python.org/library/uuid.html
    
    var _nodeId;
    var _clockseq;
    
    // Previous uuid creation time
    var _lastMSecs = 0;
    var _lastNSecs = 0;
    
    // See https://github.com/uuidjs/uuid for API details
    function v1(options, buf, offset) {
      var i = buf && offset || 0;
      var b = buf || [];
    
      options = options || {};
      var node = options.node || _nodeId;
      var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;
    
      // node and clockseq need to be initialized to random values if they're not
      // specified.  We do this lazily to minimize issues related to insufficient
      // system entropy.  See #189
      if (node == null || clockseq == null) {
        var seedBytes = rng();
        if (node == null) {
          // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
          node = _nodeId = [
            seedBytes[0] | 0x01,
            seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
          ];
        }
        if (clockseq == null) {
          // Per 4.2.2, randomize (14 bit) clockseq
          clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
        }
      }
    
      // UUID timestamps are 100 nano-second units since the Gregorian epoch,
      // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
      // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
      // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
      var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();
    
      // Per 4.2.1.2, use count of uuid's generated during the current clock
      // cycle to simulate higher resolution clock
      var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;
    
      // Time since last uuid creation (in msecs)
      var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;
    
      // Per 4.2.1.2, Bump clockseq on clock regression
      if (dt < 0 && options.clockseq === undefined) {
        clockseq = clockseq + 1 & 0x3fff;
      }
    
      // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
      // time interval
      if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
        nsecs = 0;
      }
    
      // Per 4.2.1.2 Throw error if too many uuids are requested
      if (nsecs >= 10000) {
        throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
      }
    
      _lastMSecs = msecs;
      _lastNSecs = nsecs;
      _clockseq = clockseq;
    
      // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
      msecs += 12219292800000;
    
      // `time_low`
      var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
      b[i++] = tl >>> 24 & 0xff;
      b[i++] = tl >>> 16 & 0xff;
      b[i++] = tl >>> 8 & 0xff;
      b[i++] = tl & 0xff;
    
      // `time_mid`
      var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
      b[i++] = tmh >>> 8 & 0xff;
      b[i++] = tmh & 0xff;
    
      // `time_high_and_version`
      b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
      b[i++] = tmh >>> 16 & 0xff;
    
      // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
      b[i++] = clockseq >>> 8 | 0x80;
    
      // `clock_seq_low`
      b[i++] = clockseq & 0xff;
    
      // `node`
      for (var n = 0; n < 6; ++n) {
        b[i + n] = node[n];
      }
    
      return buf ? buf : bytesToUuid(b);
    }
    
    module.exports = v1;
    
    },{"./lib/bytesToUuid":2,"./lib/rng":3}],5:[function(require,module,exports){
    var rng = require('./lib/rng');
    var bytesToUuid = require('./lib/bytesToUuid');
    
    function v4(options, buf, offset) {
      var i = buf && offset || 0;
    
      if (typeof(options) == 'string') {
        buf = options === 'binary' ? new Array(16) : null;
        options = null;
      }
      options = options || {};
    
      var rnds = options.random || (options.rng || rng)();
    
      // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
      rnds[6] = (rnds[6] & 0x0f) | 0x40;
      rnds[8] = (rnds[8] & 0x3f) | 0x80;
    
      // Copy bytes to buffer, if provided
      if (buf) {
        for (var ii = 0; ii < 16; ++ii) {
          buf[i + ii] = rnds[ii];
        }
      }
    
      return buf || bytesToUuid(rnds);
    }
    
    module.exports = v4;
    
    },{"./lib/bytesToUuid":2,"./lib/rng":3}],6:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = void 0;
    
    var _Transactions = _interopRequireDefault(require("../features/transactions/Transactions"));
    
    var _Budgets = _interopRequireDefault(require("../features/budgets/Budgets"));
    
    var _react = _interopRequireDefault(require("react"));
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
    
    function App() {
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "App"
      }, /*#__PURE__*/_react["default"].createElement("header", {
        className: "App-header"
      }, /*#__PURE__*/_react["default"].createElement("h1", null, "Expense Tracker"), /*#__PURE__*/_react["default"].createElement(_Budgets["default"], null), /*#__PURE__*/_react["default"].createElement(_Transactions["default"], null)));
    }
    
    var _default = App;
    exports["default"] = _default;
    
    },{"../features/budgets/Budgets":12,"../features/transactions/Transactions":14,"react":undefined}],7:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = void 0;
    
    var _toolkit = require("@reduxjs/toolkit");
    
    var _transactionsSlice = _interopRequireDefault(require("../features/transactions/transactionsSlice"));
    
    var _budgetsSlice = _interopRequireDefault(require("../features/budgets/budgetsSlice"));
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
    
    var _default = (0, _toolkit.configureStore)({
      reducer: {
        transactions: _transactionsSlice["default"],
        budgets: _budgetsSlice["default"]
      }
    });
    
    exports["default"] = _default;
    
    },{"../features/budgets/budgetsSlice":13,"../features/transactions/transactionsSlice":15,"@reduxjs/toolkit":undefined}],8:[function(require,module,exports){
    "use strict";
    
    function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = Budget;
    
    var _react = _interopRequireWildcard(require("react"));
    
    var _reactRedux = require("react-redux");
    
    var _budgetsSlice = require("../features/budgets/budgetsSlice");
    
    var _transactionsSlice = require("../features/transactions/transactionsSlice");
    
    function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
    
    function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
    
    function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
    
    function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
    
    function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
    
    function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
    
    function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
    
    function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
    
    function Budget(_ref) {
      var budget = _ref.budget;
      var dispatch = (0, _reactRedux.useDispatch)();
    
      var _useState = (0, _react.useState)(budget.amount),
          _useState2 = _slicedToArray(_useState, 2),
          amount = _useState2[0],
          setAmount = _useState2[1];
    
      var transactions = (0, _reactRedux.useSelector)(_transactionsSlice.selectTransactions);
    
      var handleEdit = function handleEdit(e) {
        e.preventDefault();
        dispatch((0, _budgetsSlice.editBudget)({
          category: budget.category,
          amount: amount
        }));
      };
    
      var calculateTotalExpenses = function calculateTotalExpenses() {
        return transactions[budget.category].map(function (transaction) {
          return transaction.amount;
        }).reduce(function (amount1, amount2) {
          return amount1 + amount2;
        }, 0);
      };
    
      var getFundsRemainingClassName = function getFundsRemainingClassName(amount) {
        if (parseFloat(amount) === 0) {
          return null;
        }
    
        return parseFloat(amount) > 0 ? 'positive' : 'negative';
      };
    
      var remainingFunds = Number.parseFloat(budget.amount - calculateTotalExpenses()).toFixed(2);
      var fundsRemainingClassName = getFundsRemainingClassName(remainingFunds);
      return /*#__PURE__*/_react["default"].createElement("li", {
        className: "budget-container"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "category-label"
      }, "Category"), ' ', /*#__PURE__*/_react["default"].createElement("div", {
        className: "category-wrapper"
      }, /*#__PURE__*/_react["default"].createElement("h3", {
        className: "category-value"
      }, budget.category), /*#__PURE__*/_react["default"].createElement("form", {
        onSubmit: handleEdit,
        className: "budget-form"
      }, /*#__PURE__*/_react["default"].createElement("input", {
        className: "amount-input",
        value: amount,
        onChange: function onChange(e) {
          return setAmount(e.currentTarget.value);
        },
        type: "number",
        step: "0.01"
      }), /*#__PURE__*/_react["default"].createElement("button", {
        className: "update-button"
      }, "Update"))), /*#__PURE__*/_react["default"].createElement("h4", {
        className: "remaining-funds ".concat(fundsRemainingClassName)
      }, "Funds Remaining: ", remainingFunds));
    }
    
    },{"../features/budgets/budgetsSlice":13,"../features/transactions/transactionsSlice":15,"react":undefined,"react-redux":undefined}],9:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = Transaction;
    
    var _react = _interopRequireDefault(require("react"));
    
    var _reactRedux = require("react-redux");
    
    var _transactionsSlice = require("../features/transactions/transactionsSlice");
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
    
    function Transaction(_ref) {
      var transaction = _ref.transaction;
      var dispatch = (0, _reactRedux.useDispatch)();
    
      var handleDelete = function handleDelete(e) {
        dispatch((0, _transactionsSlice.deleteTransaction)(transaction));
      };
    
      return /*#__PURE__*/_react["default"].createElement("li", {
        className: "new-transaction"
      }, /*#__PURE__*/_react["default"].createElement("span", null, transaction.amount, " \u2013 ", transaction.category, ' ', /*#__PURE__*/_react["default"].createElement("span", {
        className: "description"
      }, "( ", transaction.description, " )")), /*#__PURE__*/_react["default"].createElement("button", {
        onClick: handleDelete,
        "aria-label": "Remove"
      }, "X"));
    }
    
    },{"../features/transactions/transactionsSlice":15,"react":undefined,"react-redux":undefined}],10:[function(require,module,exports){
    "use strict";
    
    function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = TransactionForm;
    
    var _react = _interopRequireWildcard(require("react"));
    
    var _reactRedux = require("react-redux");
    
    var _transactionsSlice = require("../features/transactions/transactionsSlice");
    
    var _uuid = require("uuid");
    
    function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
    
    function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
    
    function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
    
    function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
    
    function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
    
    function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
    
    function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
    
    function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
    
    function TransactionForm(_ref) {
      var categories = _ref.categories;
      var dispatch = (0, _reactRedux.useDispatch)();
    
      var _useState = (0, _react.useState)(_transactionsSlice.CATEGORIES[0]),
          _useState2 = _slicedToArray(_useState, 2),
          category = _useState2[0],
          setCategory = _useState2[1];
    
      var _useState3 = (0, _react.useState)(''),
          _useState4 = _slicedToArray(_useState3, 2),
          description = _useState4[0],
          setDescription = _useState4[1];
    
      var _useState5 = (0, _react.useState)(0),
          _useState6 = _slicedToArray(_useState5, 2),
          amount = _useState6[0],
          setAmount = _useState6[1];
    
      var handleSubmit = function handleSubmit(e) {
        e.preventDefault();
        dispatch((0, _transactionsSlice.addTransaction)({
          category: category,
          description: description,
          amount: parseFloat(amount),
          id: (0, _uuid.v4)()
        }));
        setCategory(_transactionsSlice.CATEGORIES[0]);
        setDescription('');
        setAmount(0);
      };
    
      return /*#__PURE__*/_react["default"].createElement("section", {
        className: "new-transaction-section"
      }, /*#__PURE__*/_react["default"].createElement("h2", null, "New Transaction"), /*#__PURE__*/_react["default"].createElement("form", {
        onSubmit: handleSubmit
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "form-wrapper"
      }, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("label", {
        htmlFor: "category"
      }, "Category"), /*#__PURE__*/_react["default"].createElement("select", {
        id: "category",
        value: category,
        onChange: function onChange(e) {
          return setCategory(e.currentTarget.value);
        }
      }, _transactionsSlice.CATEGORIES.map(function (c) {
        return /*#__PURE__*/_react["default"].createElement("option", {
          key: c,
          value: c
        }, c);
      }))), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("label", {
        htmlFor: "description"
      }, "Description"), /*#__PURE__*/_react["default"].createElement("input", {
        id: "description",
        value: description,
        onChange: function onChange(e) {
          return setDescription(e.currentTarget.value);
        },
        type: "text"
      })), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("label", {
        htmlFor: "amount"
      }, "Amount"), /*#__PURE__*/_react["default"].createElement("input", {
        id: "amount",
        value: amount,
        onChange: function onChange(e) {
          return setAmount(e.currentTarget.value);
        },
        type: "number",
        step: "0.01"
      }))), /*#__PURE__*/_react["default"].createElement("button", null, "Add Transaction")));
    }
    
    },{"../features/transactions/transactionsSlice":15,"react":undefined,"react-redux":undefined,"uuid":1}],11:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = TransactionList;
    
    var _react = _interopRequireDefault(require("react"));
    
    var _Transaction = _interopRequireDefault(require("./Transaction"));
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
    
    function TransactionList(_ref) {
      var transactions = _ref.transactions;
      return /*#__PURE__*/_react["default"].createElement("section", {
        className: "new-transactions-section"
      }, /*#__PURE__*/_react["default"].createElement("h2", null, "Transactions"), /*#__PURE__*/_react["default"].createElement("ul", {
        className: "new-transaction-list"
      }, transactions.map(function (t) {
        return /*#__PURE__*/_react["default"].createElement(_Transaction["default"], {
          transaction: t,
          key: t.id
        });
      })));
    }
    
    },{"./Transaction":9,"react":undefined}],12:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = void 0;
    
    var _react = _interopRequireDefault(require("react"));
    
    var _reactRedux = require("react-redux");
    
    var _budgetsSlice = require("./budgetsSlice");
    
    var _Budget = _interopRequireDefault(require("../../components/Budget"));
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
    
    var Transactions = function Transactions() {
      var budgets = (0, _reactRedux.useSelector)(_budgetsSlice.selectBudgets);
      return /*#__PURE__*/_react["default"].createElement("ul", {
        className: "comments-container"
      }, budgets.map(function (budget) {
        return /*#__PURE__*/_react["default"].createElement(_Budget["default"], {
          budget: budget,
          key: budget.category
        });
      }));
    };
    
    var _default = Transactions;
    exports["default"] = _default;
    
    },{"../../components/Budget":8,"./budgetsSlice":13,"react":undefined,"react-redux":undefined}],13:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = exports.editBudget = exports.selectBudgets = exports.CATEGORIES = void 0;
    
    var _toolkit = require("@reduxjs/toolkit");
    
    var CATEGORIES = ['housing', 'food', 'transportation', 'utilities', 'clothing', 'healthcare', 'personal', 'education', 'entertainment'];
    exports.CATEGORIES = CATEGORIES;
    var initialState = CATEGORIES.map(function (category) {
      return {
        category: category,
        amount: 0
      };
    });
    var budgetsSlice = (0, _toolkit.createSlice)({
      name: 'budgets',
      initialState: initialState,
      reducers: {
        editBudget: function editBudget(state, action) {
          category: action.payload.category;
    
          amount: action.payload.amount;
        }
      }
    });
    
    var selectBudgets = function selectBudgets(state) {
      return state.budgets;
    };
    
    exports.selectBudgets = selectBudgets;
    var editBudget = budgetsSlice.actions.editBudget;
    exports.editBudget = editBudget;
    var _default = budgetsSlice.reducer;
    exports["default"] = _default;
    
    },{"@reduxjs/toolkit":undefined}],14:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = void 0;
    
    var _react = _interopRequireDefault(require("react"));
    
    var _reactRedux = require("react-redux");
    
    var _transactionsSlice = require("./transactionsSlice");
    
    var _TransactionForm = _interopRequireDefault(require("../../components/TransactionForm"));
    
    var _TransactionList = _interopRequireDefault(require("../../components/TransactionList"));
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
    
    var Transactions = function Transactions() {
      var transactions = (0, _reactRedux.useSelector)(_transactionsSlice.selectFlattenedTransactions);
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "comments-container"
      }, /*#__PURE__*/_react["default"].createElement(_TransactionList["default"], {
        transactions: transactions
      }), /*#__PURE__*/_react["default"].createElement(_TransactionForm["default"], null));
    };
    
    var _default = Transactions;
    exports["default"] = _default;
    
    },{"../../components/TransactionForm":10,"../../components/TransactionList":11,"./transactionsSlice":15,"react":undefined,"react-redux":undefined}],15:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = exports.deleteTransaction = exports.addTransaction = exports.selectFlattenedTransactions = exports.selectTransactions = exports.CATEGORIES = void 0;
    
    var _toolkit = require("@reduxjs/toolkit");
    
    function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }
    
    function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
    
    function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
    
    function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
    
    function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
    
    function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
    
    function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
    
    function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
    
    function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
    
    var CATEGORIES = ['housing', 'food', 'transportation', 'utilities', 'clothing', 'healthcare', 'personal', 'education', 'entertainment'];
    exports.CATEGORIES = CATEGORIES;
    var initialState = Object.fromEntries(CATEGORIES.map(function (category) {
      return [category, []];
    }));
    var transactionsSlice = (0, _toolkit.createSlice)({
      name: 'transactions',
      initialState: initialState,
      reducers: {
        addTransaction: function addTransaction(state, action) {
          var newTransactionsForCategory = [].concat(_toConsumableArray(state[action.payload.category].slice()), [action.payload]);
          return _objectSpread(_objectSpread({}, state), {}, _defineProperty({}, action.payload.category, newTransactions));
        },
        deleteTransaction: function deleteTransaction(state, action) {
          var deletedIndex = state[action.payload.category].findIndex(function (transaction) {
            return transaction.id === action.payload.id;
          });
          var newTransactionsForCategory = state[action.payload.category].filter(function (item, index) {
            return index !== deletedIndex;
          });
          return _objectSpread(_objectSpread({}, state), {}, _defineProperty({}, action.payload.category, newTransactionsForCategory));
        }
      }
    });
    
    var selectTransactions = function selectTransactions(state) {
      return state.transactions;
    };
    
    exports.selectTransactions = selectTransactions;
    
    var selectFlattenedTransactions = function selectFlattenedTransactions(state) {
      return Object.values(state.transactions).reduce(function (a, b) {
        return [].concat(_toConsumableArray(a), _toConsumableArray(b));
      }, []);
    };
    
    exports.selectFlattenedTransactions = selectFlattenedTransactions;
    var _transactionsSlice$ac = transactionsSlice.actions,
        addTransaction = _transactionsSlice$ac.addTransaction,
        deleteTransaction = _transactionsSlice$ac.deleteTransaction;
    exports.deleteTransaction = deleteTransaction;
    exports.addTransaction = addTransaction;
    var _default = transactionsSlice.reducer;
    exports["default"] = _default;
    
    },{"@reduxjs/toolkit":undefined}],16:[function(require,module,exports){
    "use strict";
    
    var _react = _interopRequireDefault(require("react"));
    
    var _reactDom = _interopRequireDefault(require("react-dom"));
    
    var _App = _interopRequireDefault(require("./app/App"));
    
    var _reactRedux = require("react-redux");
    
    var _store = _interopRequireDefault(require("./app/store"));
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
    
    _reactDom["default"].render( /*#__PURE__*/_react["default"].createElement(_react["default"].StrictMode, null, /*#__PURE__*/_react["default"].createElement(_reactRedux.Provider, {
      store: _store["default"]
    }, /*#__PURE__*/_react["default"].createElement(_App["default"], null))), document.getElementById('app'));
    
    },{"./app/App":6,"./app/store":7,"react":undefined,"react-dom":undefined,"react-redux":undefined}]},{},[16]);
    