import { r as __toESM, t as __commonJSMin } from "./rolldown-runtime-DC62tzP2.js";
//#region node_modules/react-router/dist/production/lib/router/url.js
/**
* react-router v8.3.1
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
var ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|[\\/]{2})/i;
var PROTOCOL_RELATIVE_URL_REGEX = /^[\\/]{2}/;
function normalizeProtocolRelativeUrl(url, protocol) {
	return protocol + url.replace(/\\/g, "/");
}
//#endregion
//#region node_modules/react-router/dist/production/lib/router/history.js
/**
* react-router v8.3.1
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
function invariant(value, message) {
	if (value === false || value === null || typeof value === "undefined") throw new Error(message);
}
function warning(cond, message) {
	if (!cond) {
		if (typeof console !== "undefined") console.warn(message);
		try {
			throw new Error(message);
		} catch {}
	}
}
function createKey() {
	return Math.random().toString(36).substring(2, 10);
}
/**
* Creates a Location object with a unique key from the given Path
*/
function createLocation(current, to, state = null, key, mask) {
	return {
		pathname: typeof current === "string" ? current : current.pathname,
		search: "",
		hash: "",
		...typeof to === "string" ? parsePath(to) : to,
		state,
		key: to && to.key || key || createKey(),
		mask
	};
}
/**
* Creates a string URL path from the given pathname, search, and hash components.
*
* @public
* @category Utils
* @param path The pathname, search, and hash components to combine.
* @returns The combined URL path.
*/
function createPath({ pathname = "/", search = "", hash = "" }) {
	if (search && search !== "?") pathname += search.charAt(0) === "?" ? search : "?" + search;
	if (hash && hash !== "#") pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
	return pathname;
}
/**
* Parses a string URL path into its separate pathname, search, and hash components.
*
* @public
* @category Utils
* @param path The URL path to parse.
* @returns The parsed pathname, search, and hash components.
*/
function parsePath(path) {
	let parsedPath = {};
	if (path) {
		let hashIndex = path.indexOf("#");
		if (hashIndex >= 0) {
			parsedPath.hash = path.substring(hashIndex);
			path = path.substring(0, hashIndex);
		}
		let searchIndex = path.indexOf("?");
		if (searchIndex >= 0) {
			parsedPath.search = path.substring(searchIndex);
			path = path.substring(0, searchIndex);
		}
		if (path) parsedPath.pathname = path;
	}
	return parsedPath;
}
//#endregion
//#region node_modules/react/cjs/react.production.js
/**
* @license React
* react.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");
	var REACT_PORTAL_TYPE = Symbol.for("react.portal");
	var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
	var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
	var REACT_CONSUMER_TYPE = Symbol.for("react.consumer");
	var REACT_CONTEXT_TYPE = Symbol.for("react.context");
	var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
	var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
	var REACT_MEMO_TYPE = Symbol.for("react.memo");
	var REACT_LAZY_TYPE = Symbol.for("react.lazy");
	var REACT_ACTIVITY_TYPE = Symbol.for("react.activity");
	var REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition");
	var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
	function getIteratorFn(maybeIterable) {
		if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
		maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
		return "function" === typeof maybeIterable ? maybeIterable : null;
	}
	var ReactNoopUpdateQueue = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	};
	var assign = Object.assign;
	var emptyObject = {};
	function Component(props, context, updater) {
		this.props = props;
		this.context = context;
		this.refs = emptyObject;
		this.updater = updater || ReactNoopUpdateQueue;
	}
	Component.prototype.isReactComponent = {};
	Component.prototype.setState = function(partialState, callback) {
		if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, partialState, callback, "setState");
	};
	Component.prototype.forceUpdate = function(callback) {
		this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
	};
	function ComponentDummy() {}
	ComponentDummy.prototype = Component.prototype;
	function PureComponent(props, context, updater) {
		this.props = props;
		this.context = context;
		this.refs = emptyObject;
		this.updater = updater || ReactNoopUpdateQueue;
	}
	var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
	pureComponentPrototype.constructor = PureComponent;
	assign(pureComponentPrototype, Component.prototype);
	pureComponentPrototype.isPureReactComponent = !0;
	var isArrayImpl = Array.isArray;
	function noop() {}
	var ReactSharedInternals = {
		H: null,
		A: null,
		T: null,
		S: null
	};
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	function ReactElement(type, key, props) {
		var refProp = props.ref;
		return {
			$$typeof: REACT_ELEMENT_TYPE,
			type,
			key,
			ref: void 0 !== refProp ? refProp : null,
			props
		};
	}
	function cloneAndReplaceKey(oldElement, newKey) {
		return ReactElement(oldElement.type, newKey, oldElement.props);
	}
	function isValidElement(object) {
		return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
	}
	function escape(key) {
		var escaperLookup = {
			"=": "=0",
			":": "=2"
		};
		return "$" + key.replace(/[=:]/g, function(match) {
			return escaperLookup[match];
		});
	}
	var userProvidedKeyEscapeRegex = /\/+/g;
	function getElementKey(element, index) {
		return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
	}
	function resolveThenable(thenable) {
		switch (thenable.status) {
			case "fulfilled": return thenable.value;
			case "rejected": throw thenable.reason;
			default: switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(function(fulfilledValue) {
				"pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
			}, function(error) {
				"pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
			})), thenable.status) {
				case "fulfilled": return thenable.value;
				case "rejected": throw thenable.reason;
			}
		}
		throw thenable;
	}
	function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
		var type = typeof children;
		if ("undefined" === type || "boolean" === type) children = null;
		var invokeCallback = !1;
		if (null === children) invokeCallback = !0;
		else switch (type) {
			case "bigint":
			case "string":
			case "number":
				invokeCallback = !0;
				break;
			case "object": switch (children.$$typeof) {
				case REACT_ELEMENT_TYPE:
				case REACT_PORTAL_TYPE:
					invokeCallback = !0;
					break;
				case REACT_LAZY_TYPE: return invokeCallback = children._init, mapIntoArray(invokeCallback(children._payload), array, escapedPrefix, nameSoFar, callback);
			}
		}
		if (invokeCallback) return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
			return c;
		})) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(callback, escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(userProvidedKeyEscapeRegex, "$&/") + "/") + invokeCallback)), array.push(callback)), 1;
		invokeCallback = 0;
		var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
		if (isArrayImpl(children)) for (var i = 0; i < children.length; i++) nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
		else if (i = getIteratorFn(children), "function" === typeof i) for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done;) nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
		else if ("object" === type) {
			if ("function" === typeof children.then) return mapIntoArray(resolveThenable(children), array, escapedPrefix, nameSoFar, callback);
			array = String(children);
			throw Error("Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead.");
		}
		return invokeCallback;
	}
	function mapChildren(children, func, context) {
		if (null == children) return children;
		var result = [], count = 0;
		mapIntoArray(children, result, "", "", function(child) {
			return func.call(context, child, count++);
		});
		return result;
	}
	function lazyInitializer(payload) {
		if (-1 === payload._status) {
			var ctor = payload._result, thenable = ctor();
			thenable.then(function(moduleObject) {
				if (0 === payload._status || -1 === payload._status) payload._status = 1, payload._result = moduleObject, void 0 === thenable.status && (thenable.status = "fulfilled", thenable.value = moduleObject);
			}, function(error) {
				if (0 === payload._status || -1 === payload._status) payload._status = 2, payload._result = error, void 0 === thenable.status && (thenable.status = "rejected", thenable.reason = error);
			});
			-1 === payload._status && (payload._status = 0, payload._result = thenable);
		}
		if (1 === payload._status) return payload._result.default;
		throw payload._result;
	}
	var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
		if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
			var event = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
				error
			});
			if (!window.dispatchEvent(event)) return;
		} else if ("object" === typeof process && "function" === typeof process.emit) {
			process.emit("uncaughtException", error);
			return;
		}
		console.error(error);
	};
	function startTransition(scope) {
		var prevTransition = ReactSharedInternals.T, currentTransition = {};
		currentTransition.types = null !== prevTransition ? prevTransition.types : null;
		ReactSharedInternals.T = currentTransition;
		try {
			var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
			null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
			"object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
		} catch (error) {
			reportGlobalError(error);
		} finally {
			null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
		}
	}
	function addTransitionType(type) {
		var transition = ReactSharedInternals.T;
		if (null !== transition) {
			var transitionTypes = transition.types;
			null === transitionTypes ? transition.types = [type] : -1 === transitionTypes.indexOf(type) && transitionTypes.push(type);
		} else startTransition(addTransitionType.bind(null, type));
	}
	var Children = {
		map: mapChildren,
		forEach: function(children, forEachFunc, forEachContext) {
			mapChildren(children, function() {
				forEachFunc.apply(this, arguments);
			}, forEachContext);
		},
		count: function(children) {
			var n = 0;
			mapChildren(children, function() {
				n++;
			});
			return n;
		},
		toArray: function(children) {
			return mapChildren(children, function(child) {
				return child;
			}) || [];
		},
		only: function(children) {
			if (!isValidElement(children)) throw Error("React.Children.only expected to receive a single React element child.");
			return children;
		}
	};
	exports.Activity = REACT_ACTIVITY_TYPE;
	exports.Children = Children;
	exports.Component = Component;
	exports.Fragment = REACT_FRAGMENT_TYPE;
	exports.Profiler = REACT_PROFILER_TYPE;
	exports.PureComponent = PureComponent;
	exports.StrictMode = REACT_STRICT_MODE_TYPE;
	exports.Suspense = REACT_SUSPENSE_TYPE;
	exports.ViewTransition = REACT_VIEW_TRANSITION_TYPE;
	exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
	exports.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(size) {
			return ReactSharedInternals.H.useMemoCache(size);
		}
	};
	exports.addTransitionType = addTransitionType;
	exports.cache = function(fn) {
		return function() {
			return fn.apply(null, arguments);
		};
	};
	exports.cacheSignal = function() {
		return null;
	};
	exports.cloneElement = function(element, config, children) {
		if (null === element || void 0 === element) throw Error("The argument must be a React element, but you passed " + element + ".");
		var props = assign({}, element.props), key = element.key;
		if (null != config) for (propName in void 0 !== config.key && (key = "" + config.key), config) !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
		var propName = arguments.length - 2;
		if (1 === propName) props.children = children;
		else if (1 < propName) {
			for (var childArray = Array(propName), i = 0; i < propName; i++) childArray[i] = arguments[i + 2];
			props.children = childArray;
		}
		return ReactElement(element.type, key, props);
	};
	exports.createContext = function(defaultValue) {
		defaultValue = {
			$$typeof: REACT_CONTEXT_TYPE,
			_currentValue: defaultValue,
			_currentValue2: defaultValue,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		};
		defaultValue.Provider = defaultValue;
		defaultValue.Consumer = {
			$$typeof: REACT_CONSUMER_TYPE,
			_context: defaultValue
		};
		return defaultValue;
	};
	exports.createElement = function(type, config, children) {
		var propName, props = {}, key = null;
		if (null != config) for (propName in void 0 !== config.key && (key = "" + config.key), config) hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
		var childrenLength = arguments.length - 2;
		if (1 === childrenLength) props.children = children;
		else if (1 < childrenLength) {
			for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++) childArray[i] = arguments[i + 2];
			props.children = childArray;
		}
		if (type && type.defaultProps) for (propName in childrenLength = type.defaultProps, childrenLength) void 0 === props[propName] && (props[propName] = childrenLength[propName]);
		return ReactElement(type, key, props);
	};
	exports.createRef = function() {
		return { current: null };
	};
	exports.forwardRef = function(render) {
		return {
			$$typeof: REACT_FORWARD_REF_TYPE,
			render
		};
	};
	exports.isValidElement = isValidElement;
	exports.lazy = function(ctor) {
		return {
			$$typeof: REACT_LAZY_TYPE,
			_payload: {
				_status: -1,
				_result: ctor
			},
			_init: lazyInitializer
		};
	};
	exports.memo = function(type, compare) {
		return {
			$$typeof: REACT_MEMO_TYPE,
			type,
			compare: void 0 === compare ? null : compare
		};
	};
	exports.startTransition = startTransition;
	exports.unstable_useCacheRefresh = function() {
		return ReactSharedInternals.H.useCacheRefresh();
	};
	exports.use = function(usable) {
		return ReactSharedInternals.H.use(usable);
	};
	exports.useActionState = function(action, initialState, permalink) {
		return ReactSharedInternals.H.useActionState(action, initialState, permalink);
	};
	exports.useCallback = function(callback, deps) {
		return ReactSharedInternals.H.useCallback(callback, deps);
	};
	exports.useContext = function(Context) {
		return ReactSharedInternals.H.useContext(Context);
	};
	exports.useDebugValue = function() {};
	exports.useDeferredValue = function(value, initialValue) {
		return ReactSharedInternals.H.useDeferredValue(value, initialValue);
	};
	exports.useEffect = function(create, deps) {
		return ReactSharedInternals.H.useEffect(create, deps);
	};
	exports.useEffectEvent = function(callback) {
		return ReactSharedInternals.H.useEffectEvent(callback);
	};
	exports.useId = function() {
		return ReactSharedInternals.H.useId();
	};
	exports.useImperativeHandle = function(ref, create, deps) {
		return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
	};
	exports.useInsertionEffect = function(create, deps) {
		return ReactSharedInternals.H.useInsertionEffect(create, deps);
	};
	exports.useLayoutEffect = function(create, deps) {
		return ReactSharedInternals.H.useLayoutEffect(create, deps);
	};
	exports.useMemo = function(create, deps) {
		return ReactSharedInternals.H.useMemo(create, deps);
	};
	exports.useOptimistic = function(passthrough, reducer) {
		return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
	};
	exports.useReducer = function(reducer, initialArg, init) {
		return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
	};
	exports.useRef = function(initialValue) {
		return ReactSharedInternals.H.useRef(initialValue);
	};
	exports.useState = function(initialState) {
		return ReactSharedInternals.H.useState(initialState);
	};
	exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
		return ReactSharedInternals.H.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
	};
	exports.useTransition = function() {
		return ReactSharedInternals.H.useTransition();
	};
	exports.version = "19.3.0";
}));
//#endregion
//#region node_modules/react/index.js
var require_react = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_production();
}));
//#endregion
//#region node_modules/react-router/dist/production/lib/router/utils.js
/**
* react-router v8.3.1
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* Creates a type-safe {@link RouterContext} object that can be used to
* store and retrieve arbitrary values in [`action`](../../start/framework/route-module#action)s,
* [`loader`](../../start/framework/route-module#loader)s, and [middleware](../../how-to/middleware).
* Similar to React's [`createContext`](https://react.dev/reference/react/createContext),
* but specifically designed for React Router's request/response lifecycle.
*
* If a `defaultValue` is provided, it will be returned from `context.get()`
* when no value has been set for the context. Otherwise, reading this context
* when no value has been set will throw an error.
*
* ```tsx filename=app/context.ts
* import { createContext } from "react-router";
*
* // Create a context for user data
* export const userContext =
*   createContext<User | null>(null);
* ```
*
* ```tsx filename=app/middleware/auth.ts
* import { getUserFromSession } from "~/auth.server";
* import { userContext } from "~/context";
*
* export const authMiddleware = async ({
*   context,
*   request,
* }) => {
*   const user = await getUserFromSession(request);
*   context.set(userContext, user);
* };
* ```
*
* ```tsx filename=app/routes/profile.tsx
* import { userContext } from "~/context";
*
* export async function loader({
*   context,
* }: Route.LoaderArgs) {
*   const user = context.get(userContext);
*
*   if (!user) {
*     throw new Response("Unauthorized", { status: 401 });
*   }
*
*   return { user };
* }
* ```
*
* @public
* @category Utils
* @mode framework
* @mode data
* @param defaultValue An optional default value for the context. This value
* will be returned if no value has been set for this context.
* @returns A {@link RouterContext} object that can be used with
* `context.get()` and `context.set()` in [`action`](../../start/framework/route-module#action)s,
* [`loader`](../../start/framework/route-module#loader)s, and [middleware](../../how-to/middleware).
*/
function createContext(defaultValue) {
	return { defaultValue };
}
/**
* Provides methods for writing/reading values in application context in a
* type-safe way. Primarily for usage with [middleware](../../how-to/middleware).
*
* @example
* import {
*   createContext,
*   RouterContextProvider
* } from "react-router";
*
* const userContext = createContext<User | null>(null);
* const contextProvider = new RouterContextProvider();
* contextProvider.set(userContext, getUser());
* //                               ^ Type-safe
* const user = contextProvider.get(userContext);
* //    ^ User
*
* @public
* @category Utils
* @mode framework
* @mode data
*/
var RouterContextProvider = class {
	#map = /* @__PURE__ */ new Map();
	/**
	* Create a new `RouterContextProvider` instance
	* @param init An optional initial context map to populate the provider with
	*/
	constructor(init) {
		if (init) for (let [context, value] of init) this.set(context, value);
	}
	/**
	* Access a value from the context. If no value has been set for the context,
	* it will return the context's `defaultValue` if provided, or throw an error
	* if no `defaultValue` was set.
	* @param context The context to get the value for
	* @returns The value for the context, or the context's `defaultValue` if no
	* value was set
	*/
	get(context) {
		if (this.#map.has(context)) return this.#map.get(context);
		if (context.defaultValue !== void 0) return context.defaultValue;
		throw new Error("No value found for context");
	}
	/**
	* Set a value for the context. If the context already has a value set, this
	* will overwrite it.
	*
	* @param context The context to set the value for
	* @param value The value to set for the context
	* @returns {void}
	*/
	set(context, value) {
		this.#map.set(context, value);
	}
};
var unsupportedLazyRouteObjectKeys = /* @__PURE__ */ new Set([
	"lazy",
	"caseSensitive",
	"path",
	"id",
	"index",
	"children"
]);
function isUnsupportedLazyRouteObjectKey(key) {
	return unsupportedLazyRouteObjectKeys.has(key);
}
var unsupportedLazyRouteFunctionKeys = /* @__PURE__ */ new Set([
	"lazy",
	"caseSensitive",
	"path",
	"id",
	"index",
	"middleware",
	"children"
]);
function isUnsupportedLazyRouteFunctionKey(key) {
	return unsupportedLazyRouteFunctionKeys.has(key);
}
function isIndexRoute(route) {
	return route.index === true;
}
function defaultMapRouteProperties(route) {
	let updates = {};
	if (route.Component) Object.assign(updates, {
		element: import_react.createElement(route.Component),
		Component: void 0
	});
	if (route.HydrateFallback) Object.assign(updates, {
		hydrateFallbackElement: import_react.createElement(route.HydrateFallback),
		HydrateFallback: void 0
	});
	if (route.ErrorBoundary) Object.assign(updates, {
		errorElement: import_react.createElement(route.ErrorBoundary),
		ErrorBoundary: void 0
	});
	return updates;
}
function convertRoutesToDataRoutes(routes, mapRouteProperties = defaultMapRouteProperties, parentPath = [], manifest = {}, allowInPlaceMutations = false) {
	return routes.map((route, index) => {
		let treePath = [...parentPath, String(index)];
		let id = typeof route.id === "string" ? route.id : treePath.join("-");
		invariant(route.index !== true || !route.children, `Cannot specify children on an index route`);
		invariant(allowInPlaceMutations || !manifest[id], `Found a route id collision on id "${id}".  Route id's must be globally unique within Data Router usages`);
		if (isIndexRoute(route)) {
			let indexRoute = {
				...route,
				id
			};
			manifest[id] = mergeRouteUpdates(indexRoute, mapRouteProperties(indexRoute));
			return indexRoute;
		} else {
			let pathOrLayoutRoute = {
				...route,
				id,
				children: void 0
			};
			manifest[id] = mergeRouteUpdates(pathOrLayoutRoute, mapRouteProperties(pathOrLayoutRoute));
			if (route.children) pathOrLayoutRoute.children = convertRoutesToDataRoutes(route.children, mapRouteProperties, treePath, manifest, allowInPlaceMutations);
			return pathOrLayoutRoute;
		}
	});
}
function mergeRouteUpdates(route, updates) {
	return Object.assign(route, {
		...updates,
		...typeof updates.lazy === "object" && updates.lazy != null ? { lazy: {
			...route.lazy,
			...updates.lazy
		} } : {}
	});
}
/**
* Matches the given routes to a location and returns the match data.
*
* @example
* import { matchRoutes } from "react-router";
*
* let routes = [{
*   path: "/",
*   Component: Root,
*   children: [{
*     path: "dashboard",
*     Component: Dashboard,
*   }]
* }];
*
* matchRoutes(routes, "/dashboard"); // [rootMatch, dashboardMatch]
*
* @public
* @category Utils
* @param routes The array of route objects to match against.
* @param locationArg The location to match against, either a string path or a
* partial {@link Location} object
* @param basename Optional base path to strip from the location before matching.
* Defaults to `/`.
* @returns An array of matched routes, or `null` if no matches were found.
*/
function matchRoutes(routes, locationArg, basename = "/") {
	return matchRoutesImpl(routes, locationArg, basename, false);
}
function matchRoutesImpl(routes, locationArg, basename, allowPartial, precomputedBranches) {
	let pathname = stripBasename((typeof locationArg === "string" ? parsePath(locationArg) : locationArg).pathname || "/", basename);
	if (pathname == null) return null;
	let branches = precomputedBranches ?? flattenAndRankRoutes(routes);
	let matches = null;
	let decoded = decodePath(pathname);
	for (let i = 0; matches == null && i < branches.length; ++i) matches = matchRouteBranch(branches[i], decoded, allowPartial);
	return matches;
}
function convertRouteMatchToUiMatch(match, loaderData) {
	let { route, pathname, params } = match;
	return {
		id: route.id,
		pathname,
		params,
		loaderData: loaderData[route.id],
		handle: route.handle
	};
}
function flattenAndRankRoutes(routes) {
	let branches = flattenRoutes(routes);
	rankRouteBranches(branches);
	return branches;
}
function flattenRoutes(routes, branches = [], parentsMeta = [], parentPath = "", _hasParentOptionalSegments = false) {
	let flattenRoute = (route, index, hasParentOptionalSegments = _hasParentOptionalSegments, relativePath) => {
		let meta = {
			relativePath: relativePath === void 0 ? route.path || "" : relativePath,
			caseSensitive: route.caseSensitive === true,
			childrenIndex: index,
			route
		};
		if (meta.relativePath.startsWith("/")) {
			if (!meta.relativePath.startsWith(parentPath) && hasParentOptionalSegments) return;
			invariant(meta.relativePath.startsWith(parentPath), `Absolute route path "${meta.relativePath}" nested under path "${parentPath}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`);
			meta.relativePath = meta.relativePath.slice(parentPath.length);
		}
		let path = joinPaths([parentPath, meta.relativePath]);
		let routesMeta = parentsMeta.concat(meta);
		if (route.children && route.children.length > 0) {
			invariant(route.index !== true, `Index routes must not have child routes. Please remove all child routes from route path "${path}".`);
			flattenRoutes(route.children, branches, routesMeta, path, hasParentOptionalSegments);
		}
		if (route.path == null && !route.index) return;
		branches.push({
			path,
			score: computeScore(path, route.index),
			routesMeta: routesMeta.map((meta, i) => {
				let [matcher, params] = compilePath(meta.relativePath, meta.caseSensitive, i === routesMeta.length - 1);
				return {
					...meta,
					matcher,
					compiledParams: params
				};
			})
		});
	};
	routes.forEach((route, index) => {
		if (route.path === "" || !route.path?.includes("?")) flattenRoute(route, index);
		else for (let exploded of explodeOptionalSegments(route.path)) flattenRoute(route, index, true, exploded);
	});
	return branches;
}
function explodeOptionalSegments(path) {
	let segments = path.split("/");
	if (segments.length === 0) return [];
	let [first, ...rest] = segments;
	let isOptional = first.endsWith("?");
	let required = first.replace(/\?$/, "");
	if (rest.length === 0) return isOptional ? [required, ""] : [required];
	let restExploded = explodeOptionalSegments(rest.join("/"));
	let result = [];
	result.push(...restExploded.map((subpath) => subpath === "" ? required : [required, subpath].join("/")));
	if (isOptional) result.push(...restExploded);
	return result.map((exploded) => path.startsWith("/") && exploded === "" ? "/" : exploded);
}
function rankRouteBranches(branches) {
	branches.sort((a, b) => a.score !== b.score ? b.score - a.score : compareIndexes(a.routesMeta.map((meta) => meta.childrenIndex), b.routesMeta.map((meta) => meta.childrenIndex)));
}
var paramRe = /^:[\w-]+$/;
var partialParamRe = /^:[\w-]+/;
var partialDynamicSegmentValue = 3.5;
var dynamicSegmentValue = 3;
var indexRouteValue = 2;
var emptySegmentValue = 1;
var staticSegmentValue = 10;
var splatPenalty = -2;
var isSplat = (s) => s === "*";
function computeScore(path, index) {
	let segments = path.split("/");
	let initialScore = segments.length;
	if (segments.some(isSplat)) initialScore += splatPenalty;
	if (index) initialScore += indexRouteValue;
	return segments.filter((s) => !isSplat(s)).reduce((score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : partialParamRe.test(segment) ? partialDynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue), initialScore);
}
function compareIndexes(a, b) {
	return a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]) ? a[a.length - 1] - b[b.length - 1] : 0;
}
function matchRouteBranch(branch, pathname, allowPartial = false) {
	let { routesMeta } = branch;
	let matchedParams = {};
	let matchedPathname = "/";
	let matches = [];
	for (let i = 0; i < routesMeta.length; ++i) {
		let meta = routesMeta[i];
		let end = i === routesMeta.length - 1;
		let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
		let pattern = {
			path: meta.relativePath,
			caseSensitive: meta.caseSensitive,
			end
		};
		let match = meta.matcher && meta.compiledParams ? matchPathImpl(pattern, remainingPathname, meta.matcher, meta.compiledParams) : matchPath(pattern, remainingPathname);
		let route = meta.route;
		if (!match && end && allowPartial && !routesMeta[routesMeta.length - 1].route.index) match = matchPath({
			path: meta.relativePath,
			caseSensitive: meta.caseSensitive,
			end: false
		}, remainingPathname);
		if (!match) return null;
		Object.assign(matchedParams, match.params);
		matches.push({
			params: matchedParams,
			pathname: joinPaths([matchedPathname, match.pathname]),
			pathnameBase: normalizePathname(joinPaths([matchedPathname, match.pathnameBase])),
			route
		});
		if (match.pathnameBase !== "/") matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
	}
	return matches;
}
/**
* Performs pattern matching on a URL pathname and returns information about
* the match.
*
* @public
* @category Utils
* @param pattern The pattern to match against the URL pathname. This can be a
* string or a {@link PathPattern} object. If a string is provided, it will be
* treated as a pattern with `caseSensitive` set to `false` and `end` set to
* `true`.
* @param pathname The URL pathname to match against the pattern.
* @returns A path match object if the pattern matches the pathname,
* or `null` if it does not match.
*/
function matchPath(pattern, pathname) {
	if (typeof pattern === "string") pattern = {
		path: pattern,
		caseSensitive: false,
		end: true
	};
	let [matcher, compiledParams] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);
	return matchPathImpl(pattern, pathname, matcher, compiledParams);
}
function matchPathImpl(pattern, pathname, matcher, compiledParams) {
	let match = pathname.match(matcher);
	if (!match) return null;
	let matchedPathname = match[0];
	let pathnameBase = removeTrailingSlash(matchedPathname, 1);
	let captureGroups = match.slice(1);
	return {
		params: compiledParams.reduce((memo, { paramName, isOptional }, index) => {
			if (paramName === "*") {
				let splatValue = captureGroups[index] || "";
				pathnameBase = removeTrailingSlash(matchedPathname.slice(0, matchedPathname.length - splatValue.length), 1);
			}
			const value = captureGroups[index];
			if (isOptional && !value) memo[paramName] = void 0;
			else memo[paramName] = (value || "").replace(/%2F/g, "/");
			return memo;
		}, {}),
		pathname: matchedPathname,
		pathnameBase,
		pattern
	};
}
function compilePath(path, caseSensitive = false, end = true) {
	warning(path === "*" || !path.endsWith("*") || path.endsWith("/*"), `Route path "${path}" will be treated as if it were "${path.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${path.replace(/\*$/, "/*")}".`);
	let params = [];
	let regexpSource = "^" + path.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(/\/:([\w-]+)(\?)?/g, (match, paramName, isOptional, index, str) => {
		params.push({
			paramName,
			isOptional: isOptional != null
		});
		if (isOptional) {
			let nextChar = str.charAt(index + match.length);
			if (nextChar && nextChar !== "/") return "/([^\\/]*)";
			return "(?:/([^\\/]*))?";
		}
		return "/([^\\/]+)";
	}).replace(/\/([\w-]+)\?(?=\/|$|\()/g, "(?:/$1)?");
	if (path.endsWith("*")) {
		params.push({ paramName: "*" });
		regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
	} else if (end) regexpSource += "\\/*$";
	else if (path !== "" && path !== "/") regexpSource += "(?:(?=\\/|$))";
	return [new RegExp(regexpSource, caseSensitive ? void 0 : "i"), params];
}
function decodePath(value) {
	try {
		return value.split("/").map((v) => decodeURIComponent(v).replace(/\//g, "%2F")).join("/");
	} catch (error) {
		warning(false, `The URL path "${value}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${error}).`);
		return value;
	}
}
function stripBasename(pathname, basename) {
	if (basename === "/") return pathname;
	if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) return null;
	let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
	let nextChar = pathname.charAt(startIndex);
	if (nextChar && nextChar !== "/") return null;
	return pathname.slice(startIndex) || "/";
}
function prependBasename({ basename, pathname }) {
	return pathname === "/" ? basename : joinPaths([basename, pathname]);
}
var isAbsoluteUrl = (url) => ABSOLUTE_URL_REGEX.test(url);
/**
* Returns a resolved {@link Path} object relative to the given pathname.
*
* @public
* @category Utils
* @param to The path to resolve, either a string or a partial {@link Path}
* object.
* @param fromPathname The pathname to resolve the path from. Defaults to `/`.
* @returns A {@link Path} object with the resolved pathname, search, and hash.
*/
function resolvePath(to, fromPathname = "/") {
	let { pathname: toPathname, search = "", hash = "" } = typeof to === "string" ? parsePath(to) : to;
	let pathname;
	if (toPathname) {
		toPathname = removeDoubleSlashes(toPathname);
		if (toPathname.startsWith("/") || toPathname.startsWith("\\")) pathname = resolvePathname(toPathname.substring(1), "/");
		else pathname = resolvePathname(toPathname, fromPathname);
	} else pathname = fromPathname;
	return {
		pathname,
		search: normalizeSearch(search),
		hash: normalizeHash(hash)
	};
}
function resolvePathname(relativePath, fromPathname) {
	let segments = removeTrailingSlash(fromPathname).split("/");
	relativePath.split("/").forEach((segment) => {
		if (segment === "..") {
			if (segments.length > 1) segments.pop();
		} else if (segment !== ".") segments.push(segment);
	});
	return segments.length > 1 ? segments.join("/") : "/";
}
function getInvalidPathError(char, field, dest, path) {
	return `Cannot include a '${char}' character in a manually specified \`to.${field}\` field [${JSON.stringify(path)}].  Please separate it out to the \`to.${dest}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function getPathContributingMatches(matches) {
	return matches.filter((match, index) => index === 0 || match.route.path && match.route.path.length > 0);
}
function getResolveToMatches(matches) {
	let pathMatches = getPathContributingMatches(matches);
	return pathMatches.map((match, idx) => idx === pathMatches.length - 1 ? match.pathname : match.pathnameBase);
}
function resolveTo(toArg, routePathnames, locationPathname, isPathRelative = false) {
	let to;
	if (typeof toArg === "string") to = parsePath(toArg);
	else {
		to = { ...toArg };
		invariant(!to.pathname || !to.pathname.includes("?"), getInvalidPathError("?", "pathname", "search", to));
		invariant(!to.pathname || !to.pathname.includes("#"), getInvalidPathError("#", "pathname", "hash", to));
		invariant(!to.search || !to.search.includes("#"), getInvalidPathError("#", "search", "hash", to));
	}
	let isEmptyPath = toArg === "" || to.pathname === "";
	let toPathname = isEmptyPath ? "/" : to.pathname;
	let from;
	if (toPathname == null) from = locationPathname;
	else {
		let routePathnameIndex = routePathnames.length - 1;
		if (!isPathRelative && toPathname.startsWith("..")) {
			let toSegments = toPathname.split("/");
			while (toSegments[0] === "..") {
				toSegments.shift();
				routePathnameIndex -= 1;
			}
			to.pathname = toSegments.join("/");
		}
		from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
	}
	let path = resolvePath(to, from);
	let hasExplicitTrailingSlash = toPathname && toPathname !== "/" && toPathname.endsWith("/");
	let hasCurrentTrailingSlash = (isEmptyPath || toPathname === ".") && locationPathname.endsWith("/");
	if (!path.pathname.endsWith("/") && (hasExplicitTrailingSlash || hasCurrentTrailingSlash)) path.pathname += "/";
	return path;
}
var removeDoubleSlashes = (path) => path.replace(/[\\/]{2,}/g, "/");
var joinPaths = (paths) => removeDoubleSlashes(paths.join("/"));
function removeTrailingSlash(path, minLength = 0) {
	let end = path.length;
	while (end > minLength && path.charCodeAt(end - 1) === 47) end--;
	return end === path.length ? path : path.slice(0, end);
}
var normalizePathname = (pathname) => removeTrailingSlash(pathname).replace(/^\/*/, "/");
var normalizeSearch = (search) => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;
var normalizeHash = (hash) => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
var DataWithResponseInit = class {
	type = "DataWithResponseInit";
	data;
	init;
	constructor(data, init) {
		this.data = data;
		this.init = init || null;
	}
};
/**
* Create "responses" that contain `headers`/`status` without forcing
* serialization into an actual [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)
*
* @example
* import { data } from "react-router";
*
* export async function action({ request }: Route.ActionArgs) {
*   let formData = await request.formData();
*   let item = await createItem(formData);
*   return data(item, {
*     headers: { "X-Custom-Header": "value" }
*     status: 201,
*   });
* }
*
* @public
* @category Utils
* @mode framework
* @mode data
* @param data The data to be included in the response.
* @param init The status code or a `ResponseInit` object to be included in the
* response.
* @returns A {@link DataWithResponseInit} instance containing the data and
* response init.
*/
function data(data, init) {
	return new DataWithResponseInit(data, typeof init === "number" ? { status: init } : init);
}
/**
* A redirect [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response).
* Sets the status code and the [`Location`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location)
* header. Defaults to [`302 Found`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/302).
*
* This utility accepts absolute URLs and can navigate to external domains, so
* the application should validate any user-supplied inputs to redirects.
*
* @example
* import { redirect } from "react-router";
*
* export async function loader({ request }: Route.LoaderArgs) {
*   if (!isLoggedIn(request))
*     throw redirect("/login");
*   }
*
*   // ...
* }
*
* @public
* @category Utils
* @mode framework
* @mode data
* @param url The URL to redirect to.
* @param init The status code or a `ResponseInit` object to be included in the
* response.
* @returns A [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)
* object with the redirect status and [`Location`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location)
* header.
*/
var redirect = (url, init = 302) => {
	let responseInit = init;
	if (typeof responseInit === "number") responseInit = { status: responseInit };
	else if (typeof responseInit.status === "undefined") responseInit.status = 302;
	let headers = new Headers(responseInit.headers);
	headers.set("Location", url);
	return new Response(null, {
		...responseInit,
		headers
	});
};
/**
* A redirect [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)
* that will force a document reload to the new location. Sets the status code
* and the [`Location`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location)
* header. Defaults to [`302 Found`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/302).
*
* This utility accepts absolute URLs and can navigate to external domains, so
* the application should validate any user-supplied inputs to redirects.
*
* ```tsx filename=routes/logout.tsx
* import { redirectDocument } from "react-router";
*
* import { destroySession } from "../sessions.server";
*
* export async function action({ request }: Route.ActionArgs) {
*   let session = await getSession(request.headers.get("Cookie"));
*   return redirectDocument("/", {
*     headers: { "Set-Cookie": await destroySession(session) }
*   });
* }
* ```
*
* @public
* @category Utils
* @mode framework
* @mode data
* @param url The URL to redirect to.
* @param init The status code or a `ResponseInit` object to be included in the
* response.
* @returns A [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)
* object with the redirect status and [`Location`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location)
* header.
*/
var redirectDocument = (url, init) => {
	let response = redirect(url, init);
	response.headers.set("X-Remix-Reload-Document", "true");
	return response;
};
/**
* A redirect [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)
* that will perform a [`history.replaceState`](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState)
* instead of a [`history.pushState`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState)
* for client-side navigation redirects. Sets the status code and the [`Location`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location)
* header. Defaults to [`302 Found`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/302).
*
* @example
* import { replace } from "react-router";
*
* export async function loader() {
*   return replace("/new-location");
* }
*
* @public
* @category Utils
* @mode framework
* @mode data
* @param url The URL to redirect to.
* @param init The status code or a `ResponseInit` object to be included in the
* response.
* @returns A [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)
* object with the redirect status and [`Location`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location)
* header.
*/
var replace = (url, init) => {
	let response = redirect(url, init);
	response.headers.set("X-Remix-Replace", "true");
	return response;
};
var SUPPORTED_ERROR_TYPES = [
	"EvalError",
	"RangeError",
	"ReferenceError",
	"SyntaxError",
	"TypeError",
	"URIError"
];
var ErrorResponseImpl = class {
	status;
	statusText;
	data;
	error;
	internal;
	constructor(status, statusText, data, internal = false) {
		this.status = status;
		this.statusText = statusText || "";
		this.internal = internal;
		if (data instanceof Error) {
			this.data = data.toString();
			this.error = data;
		} else this.data = data;
	}
};
/**
* Check if the given error is an {@link ErrorResponse} generated from a 4xx/5xx
* [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)
* thrown from an [`action`](../../start/framework/route-module#action) or
* [`loader`](../../start/framework/route-module#loader) function.
*
* @example
* import { isRouteErrorResponse } from "react-router";
*
* export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
*   if (isRouteErrorResponse(error)) {
*     return (
*       <>
*         <p>Error: `${error.status}: ${error.statusText}`</p>
*         <p>{error.data}</p>
*       </>
*     );
*   }
*
*   return (
*     <p>Error: {error instanceof Error ? error.message : "Unknown Error"}</p>
*   );
* }
*
* @public
* @category Utils
* @mode framework
* @mode data
* @param error The error to check.
* @returns `true` if the error is an {@link ErrorResponse}, `false` otherwise.
*/
function isRouteErrorResponse(error) {
	return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}
function getRoutePattern(matches) {
	return joinPaths(matches.map((m) => m.route.path).filter(Boolean)) || "/";
}
function createDataFunctionUrl(request, path) {
	let url = new URL(typeof request === "string" || request instanceof URL ? request : request.url);
	let parsed = typeof path === "string" ? parsePath(path) : path;
	url.pathname = parsed.pathname || "/";
	if (parsed.search) {
		let searchParams = new URLSearchParams(parsed.search);
		let indexValues = searchParams.getAll("index");
		searchParams.delete("index");
		for (let value of indexValues.filter(Boolean)) searchParams.append("index", value);
		let search = searchParams.toString();
		url.search = search ? `?${search}` : "";
	} else url.search = "";
	url.hash = parsed.hash || "";
	return url;
}
var isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
function parseToInfo(_to, basename) {
	let to = _to;
	if (typeof to !== "string" || !ABSOLUTE_URL_REGEX.test(to)) return {
		absoluteURL: void 0,
		isExternal: false,
		to
	};
	let absoluteURL = to;
	let isExternal = false;
	if (isBrowser) try {
		let currentUrl = new URL(window.location.href);
		let targetUrl = PROTOCOL_RELATIVE_URL_REGEX.test(to) ? new URL(normalizeProtocolRelativeUrl(to, currentUrl.protocol)) : new URL(to);
		let path = stripBasename(targetUrl.pathname, basename);
		if (targetUrl.origin === currentUrl.origin && path != null) to = path + targetUrl.search + targetUrl.hash;
		else isExternal = true;
	} catch {
		warning(false, `<Link to="${to}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`);
	}
	return {
		absoluteURL,
		isExternal,
		to
	};
}
//#endregion
//#region node_modules/react-router/dist/production/lib/router/instrumentation.js
/**
* react-router v8.3.1
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
var UninstrumentedSymbol = Symbol("Uninstrumented");
var instrumentationResultMetaContext = createContext();
function getRouteInstrumentationUpdates(fns, route) {
	let aggregated = {
		lazy: [],
		"lazy.loader": [],
		"lazy.action": [],
		"lazy.middleware": [],
		middleware: [],
		loader: [],
		action: []
	};
	fns.forEach((fn) => fn({
		id: route.id,
		index: route.index,
		path: route.path,
		instrument(i) {
			if (i.lazy != null) aggregated.lazy.push(i.lazy);
			if (i["lazy.loader"] != null) aggregated["lazy.loader"].push(i["lazy.loader"]);
			if (i["lazy.action"] != null) aggregated["lazy.action"].push(i["lazy.action"]);
			if (i["lazy.middleware"] != null) aggregated["lazy.middleware"].push(i["lazy.middleware"]);
			if (i.middleware != null) aggregated.middleware.push(i.middleware);
			if (i.loader != null) aggregated.loader.push(i.loader);
			if (i.action != null) aggregated.action.push(i.action);
		}
	}));
	let updates = {};
	if (typeof route.lazy === "function" && aggregated.lazy.length > 0) {
		let lazy = route.lazy;
		updates.lazy = async (...args) => {
			return throwOrReturnResult(await recurseRight(aggregated.lazy, void 0, () => lazy(...args), getInstrumentationInnerResult));
		};
	}
	if (typeof route.lazy === "object") {
		let lazyObject = route.lazy;
		if (typeof lazyObject.middleware === "function" && aggregated["lazy.middleware"].length > 0) {
			let middleware = lazyObject.middleware;
			updates.lazy = Object.assign(updates.lazy || {}, { middleware: async (...args) => {
				return throwOrReturnResult(await recurseRight(aggregated["lazy.middleware"], void 0, () => middleware(...args), getInstrumentationInnerResult));
			} });
		}
		if (typeof lazyObject.loader === "function" && aggregated["lazy.loader"].length > 0) {
			let loader = lazyObject.loader;
			updates.lazy = Object.assign(updates.lazy || {}, { loader: async (...args) => {
				return throwOrReturnResult(await recurseRight(aggregated["lazy.loader"], void 0, () => loader(...args), getInstrumentationInnerResult));
			} });
		}
		if (typeof lazyObject.action === "function" && aggregated["lazy.action"].length > 0) {
			let action = lazyObject.action;
			updates.lazy = Object.assign(updates.lazy || {}, { action: async (...args) => {
				return throwOrReturnResult(await recurseRight(aggregated["lazy.action"], void 0, () => action(...args), getInstrumentationInnerResult));
			} });
		}
	}
	if (typeof route.loader === "function" && aggregated.loader.length > 0) {
		let original = getUninstrumentedHandler(route.loader);
		let instrumented = async (...args) => {
			return throwOrReturnResult(await recurseRight(aggregated.loader, getHandlerInfo(args[0]), () => original(...args), getInstrumentationInnerResult));
		};
		if (original.hydrate === true) instrumented.hydrate = true;
		setUninstrumentedHandler(instrumented, original);
		updates.loader = instrumented;
	}
	if (typeof route.action === "function" && aggregated.action.length > 0) {
		let original = getUninstrumentedHandler(route.action);
		let instrumented = async (...args) => {
			return throwOrReturnResult(await recurseRight(aggregated.action, getHandlerInfo(args[0]), () => original(...args), getInstrumentationInnerResult));
		};
		setUninstrumentedHandler(instrumented, original);
		updates.action = instrumented;
	}
	if (route.middleware && route.middleware.length > 0 && aggregated.middleware.length > 0) updates.middleware = route.middleware.map((middleware) => {
		let original = getUninstrumentedHandler(middleware);
		let instrumented = async (...args) => {
			return throwOrReturnResult(await recurseRight(aggregated.middleware, getHandlerInfo(args[0]), () => original(...args), getInstrumentationInnerResult));
		};
		setUninstrumentedHandler(instrumented, original);
		return instrumented;
	});
	return updates;
}
function instrumentHandler(handler, fns) {
	let aggregated = { request: [] };
	fns.forEach((fn) => fn({ instrument(i) {
		if (i.request != null) aggregated.request.push(i.request);
	} }));
	let instrumentedHandler = handler;
	if (aggregated.request.length > 0) instrumentedHandler = async (...args) => {
		let [request, context] = args;
		let instrumentationContext = context ?? new RouterContextProvider();
		return throwOrReturnResult(await recurseRight(aggregated.request, {
			request: getReadonlyRequest(request),
			context: getReadonlyContext(instrumentationContext)
		}, () => handler(request, instrumentationContext), (result, info) => {
			let meta;
			try {
				meta = info.context?.get(instrumentationResultMetaContext);
			} catch {}
			invariant(result.value instanceof Response, "Expected a Response from the request handler");
			return {
				...getInstrumentationInnerResult(result),
				statusCode: result.value.status,
				meta
			};
		}));
	};
	return instrumentedHandler;
}
function getUninstrumentedHandler(handler) {
	return handler[UninstrumentedSymbol] ?? handler;
}
function setUninstrumentedHandler(handler, uninstrumentedHandler) {
	handler[UninstrumentedSymbol] = uninstrumentedHandler;
}
function throwOrReturnResult(result) {
	if (result.type === "error") throw result.value;
	return result.value;
}
async function recurseRight(impls, info, handler, getInnerResult, state = {
	result: null,
	innerResult: null
}, index = impls.length - 1) {
	let impl = impls[index];
	if (!impl) {
		try {
			state.result = {
				type: "success",
				value: await handler()
			};
		} catch (e) {
			state.result = {
				type: "error",
				value: e
			};
		}
		state.innerResult = getInnerResult(state.result, info);
	} else {
		let handlerPromise = void 0;
		let callHandler = async () => {
			if (handlerPromise) console.error("You cannot call instrumented handlers more than once");
			else handlerPromise = recurseRight(impls, info, handler, getInnerResult, state, index - 1);
			await handlerPromise;
			invariant(state.innerResult, "Expected an inner result");
			return state.innerResult;
		};
		try {
			await impl(callHandler, info);
		} catch (e) {
			console.error("An instrumentation function threw an error:", e);
		}
		if (!handlerPromise) await callHandler();
		await handlerPromise;
	}
	if (state.result) return state.result;
	state.result = {
		type: "error",
		value: /* @__PURE__ */ new Error("No result assigned in instrumentation chain.")
	};
	state.innerResult = getInnerResult(state.result, info);
	return state.result;
}
function getInstrumentationInnerResult(result) {
	if (result.type === "error" && result.value instanceof Error) return {
		status: "error",
		error: result.value
	};
	return {
		status: "success",
		error: void 0
	};
}
function getHandlerInfo(args) {
	let { request, context, params } = args;
	return {
		...args,
		request: getReadonlyRequest(request),
		params: { ...params },
		context: getReadonlyContext(context)
	};
}
function getReadonlyRequest(request) {
	return {
		method: request.method,
		url: request.url,
		headers: { get: (...args) => request.headers.get(...args) }
	};
}
function getReadonlyContext(context) {
	return { get: (ctx) => context.get(ctx) };
}
//#endregion
//#region node_modules/react-router/dist/production/lib/router/router.js
/**
* react-router v8.3.1
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
var validMutationMethodsArr = [
	"POST",
	"PUT",
	"PATCH",
	"DELETE"
];
var validMutationMethods = new Set(validMutationMethodsArr);
var validRequestMethodsArr = ["GET", ...validMutationMethodsArr];
var validRequestMethods = new Set(validRequestMethodsArr);
var redirectStatusCodes = /* @__PURE__ */ new Set([
	301,
	302,
	303,
	307,
	308
]);
var IDLE_NAVIGATION = {
	state: "idle",
	location: void 0,
	matches: void 0,
	historyAction: void 0,
	formMethod: void 0,
	formAction: void 0,
	formEncType: void 0,
	formData: void 0,
	json: void 0,
	text: void 0
};
var IDLE_FETCHER = {
	state: "idle",
	data: void 0,
	formMethod: void 0,
	formAction: void 0,
	formEncType: void 0,
	formData: void 0,
	json: void 0,
	text: void 0
};
var IDLE_BLOCKER = {
	state: "unblocked",
	proceed: void 0,
	reset: void 0,
	location: void 0
};
var ResetLoaderDataSymbol = Symbol("ResetLoaderData");
/**
* Create a static handler to perform server-side data loading
*
* @example
* export async function handleRequest(request: Request) {
*   let { query, dataRoutes } = createStaticHandler(routes);
*   let context = await query(request);
*
*   if (context instanceof Response) {
*     return context;
*   }
*
*   let router = createStaticRouter(dataRoutes, context);
*   return new Response(
*     ReactDOMServer.renderToString(<StaticRouterProvider ... />),
*     { headers: { "Content-Type": "text/html" } }
*   );
* }
*
* @public
* @category Data Routers
* @mode data
* @param routes The {@link RouteObject | route objects} to create a static
* handler for
* @param opts Options
* @param opts.basename The base URL for the static handler (default: `/`)
* @param opts.future Future flags for the static handler
* @returns A static handler that can be used to query data for the provided
* routes
*/
function createStaticHandler(routes, opts) {
	invariant(routes.length > 0, "You must provide a non-empty routes array to createStaticHandler");
	let manifest = {};
	let basename = (opts ? opts.basename : null) || "/";
	let _mapRouteProperties = opts?.mapRouteProperties;
	let mapRouteProperties = _mapRouteProperties ? _mapRouteProperties : () => ({});
	({ ...opts?.future });
	if (opts?.instrumentations) {
		let instrumentations = opts.instrumentations;
		mapRouteProperties = (route) => {
			return {
				..._mapRouteProperties?.(route),
				...getRouteInstrumentationUpdates(instrumentations.map((i) => i.route).filter(Boolean), route)
			};
		};
	}
	let dataRoutes = convertRoutesToDataRoutes(routes, mapRouteProperties, void 0, manifest);
	let routeBranches = flattenAndRankRoutes(dataRoutes);
	/**
	* The query() method is intended for document requests, in which we want to
	* call an optional action and potentially multiple loaders for all nested
	* routes.  It returns a StaticHandlerContext object, which is very similar
	* to the router state (location, loaderData, actionData, errors, etc.) and
	* also adds SSR-specific information such as the statusCode and headers
	* from action/loaders Responses.
	*
	* It _should_ never throw and should report all errors through the
	* returned handlerContext.errors object, properly associating errors to
	* their error boundary.  Additionally, it tracks _deepestRenderedBoundaryId
	* which can be used to emulate React error boundaries during SSR by performing
	* a second pass only down to the boundaryId.
	*
	* The one exception where we do not return a StaticHandlerContext is when a
	* redirect response is returned or thrown from any action/loader.  We
	* propagate that out and return the raw Response so the HTTP server can
	* return it directly.
	*
	* - `opts.requestContext` is an optional server context that will be passed
	*   to actions/loaders in the `context` parameter
	* - `opts.skipLoaderErrorBubbling` is an optional parameter that will prevent
	*   the bubbling of errors which allows single-fetch-type implementations
	*   where the client will handle the bubbling and we may need to return data
	*   for the handling route
	*/
	async function query(request, { requestContext, filterMatchesToLoad, skipLoaderErrorBubbling, skipRevalidation, dataStrategy, generateMiddlewareResponse, normalizePath } = {}) {
		let normalizePathImpl = normalizePath || defaultNormalizePath;
		let method = request.method;
		let location = createLocation("", normalizePathImpl(request), null, "default");
		let matches = matchRoutesImpl(dataRoutes, location, basename, false, routeBranches);
		requestContext = requestContext != null ? requestContext : new RouterContextProvider();
		if (!isValidMethod(method) && method !== "HEAD") {
			let error = getInternalRouterError(405, { method });
			let { matches: methodNotAllowedMatches, route } = getShortCircuitMatches(dataRoutes);
			let staticContext = {
				basename,
				location,
				matches: methodNotAllowedMatches,
				loaderData: {},
				actionData: null,
				errors: { [route.id]: error },
				statusCode: error.status,
				loaderHeaders: {},
				actionHeaders: {}
			};
			return generateMiddlewareResponse ? generateMiddlewareResponse(() => Promise.resolve(staticContext)) : staticContext;
		} else if (!matches) {
			let error = getInternalRouterError(404, { pathname: location.pathname });
			let { matches: notFoundMatches, route } = getShortCircuitMatches(dataRoutes);
			let staticContext = {
				basename,
				location,
				matches: notFoundMatches,
				loaderData: {},
				actionData: null,
				errors: { [route.id]: error },
				statusCode: error.status,
				loaderHeaders: {},
				actionHeaders: {}
			};
			return generateMiddlewareResponse ? generateMiddlewareResponse(() => Promise.resolve(staticContext)) : staticContext;
		}
		if (generateMiddlewareResponse) {
			invariant(requestContext instanceof RouterContextProvider, "When using middleware in `staticHandler.query()`, any provided `requestContext` must be an instance of `RouterContextProvider`");
			try {
				await loadLazyMiddlewareForMatches(matches, manifest, mapRouteProperties);
				let renderedStaticContext;
				let response = await runServerMiddlewarePipeline({
					request,
					url: createDataFunctionUrl(request, location),
					pattern: getRoutePattern(matches),
					matches,
					params: matches[0].params,
					context: requestContext
				}, async () => {
					return await generateMiddlewareResponse(async (revalidationRequest, opts = {}) => {
						let result = await queryImpl(revalidationRequest, location, matches, requestContext, dataStrategy || null, skipLoaderErrorBubbling === true, null, "filterMatchesToLoad" in opts ? opts.filterMatchesToLoad ?? null : filterMatchesToLoad ?? null, skipRevalidation === true);
						if (isResponse(result)) return result;
						renderedStaticContext = {
							location,
							basename,
							...result
						};
						return renderedStaticContext;
					});
				}, async (error, routeId) => {
					if (isRedirectResponse(error)) return error;
					if (isResponse(error)) try {
						error = new ErrorResponseImpl(error.status, error.statusText, await parseResponseBody(error));
					} catch (e) {
						error = e;
					}
					if (isDataWithResponseInit(error)) error = dataWithResponseInitToErrorResponse(error);
					if (renderedStaticContext) {
						if (routeId in renderedStaticContext.loaderData) renderedStaticContext.loaderData[routeId] = void 0;
						let staticContext = getStaticContextFromError(dataRoutes, renderedStaticContext, error, skipLoaderErrorBubbling ? routeId : findNearestBoundary(matches, routeId).route.id);
						return generateMiddlewareResponse(() => Promise.resolve(staticContext));
					} else {
						let staticContext = {
							matches,
							location,
							basename,
							loaderData: {},
							actionData: null,
							errors: { [skipLoaderErrorBubbling ? routeId : findNearestBoundary(matches, matches.find((m) => m.route.id === routeId || m.route.loader)?.route.id || routeId).route.id]: error },
							statusCode: isRouteErrorResponse(error) ? error.status : 500,
							actionHeaders: {},
							loaderHeaders: {}
						};
						return generateMiddlewareResponse(() => Promise.resolve(staticContext));
					}
				});
				invariant(isResponse(response), "Expected a response in query()");
				return response;
			} catch (e) {
				if (isResponse(e)) return e;
				throw e;
			}
		}
		let result = await queryImpl(request, location, matches, requestContext, dataStrategy || null, skipLoaderErrorBubbling === true, null, filterMatchesToLoad || null, skipRevalidation === true);
		if (isResponse(result)) return result;
		return {
			location,
			basename,
			...result
		};
	}
	/**
	* The queryRoute() method is intended for targeted route requests, either
	* for fetch ?_data requests or resource route requests.  In this case, we
	* are only ever calling a single action or loader, and we are returning the
	* returned value directly.  In most cases, this will be a Response returned
	* from the action/loader, but it may be a primitive or other value as well -
	* and in such cases the calling context should handle that accordingly.
	*
	* We do respect the throw/return differentiation, so if an action/loader
	* throws, then this method will throw the value.  This is important so we
	* can do proper boundary identification in Remix where a thrown Response
	* must go to the Catch Boundary but a returned Response is happy-path.
	*
	* One thing to note is that any Router-initiated Errors that make sense
	* to associate with a status code will be thrown as an ErrorResponse
	* instance which include the raw Error, such that the calling context can
	* serialize the error as they see fit while including the proper response
	* code.  Examples here are 404 and 405 errors that occur prior to reaching
	* any user-defined loaders.
	*
	* - `opts.routeId` allows you to specify the specific route handler to call.
	*   If not provided the handler will determine the proper route by matching
	*   against `request.url`
	* - `opts.requestContext` is an optional server context that will be passed
	*    to actions/loaders in the `context` parameter
	*/
	async function queryRoute(request, { routeId, requestContext, dataStrategy, generateMiddlewareResponse, normalizePath } = {}) {
		let normalizePathImpl = normalizePath || defaultNormalizePath;
		let method = request.method;
		let location = createLocation("", normalizePathImpl(request), null, "default");
		let matches = matchRoutesImpl(dataRoutes, location, basename, false, routeBranches);
		requestContext = requestContext != null ? requestContext : new RouterContextProvider();
		if (!isValidMethod(method) && method !== "HEAD" && method !== "OPTIONS") throw getInternalRouterError(405, { method });
		else if (!matches) throw getInternalRouterError(404, { pathname: location.pathname });
		let match = routeId ? matches.find((m) => m.route.id === routeId) : getTargetMatch(matches, location);
		if (routeId && !match) throw getInternalRouterError(403, {
			pathname: location.pathname,
			routeId
		});
		else if (!match) throw getInternalRouterError(404, { pathname: location.pathname });
		if (generateMiddlewareResponse) {
			invariant(requestContext instanceof RouterContextProvider, "When using middleware in `staticHandler.queryRoute()`, any provided `requestContext` must be an instance of `RouterContextProvider`");
			await loadLazyMiddlewareForMatches(matches, manifest, mapRouteProperties);
			return await runServerMiddlewarePipeline({
				request,
				url: createDataFunctionUrl(request, location),
				pattern: getRoutePattern(matches),
				matches,
				params: matches[0].params,
				context: requestContext
			}, async () => {
				return await generateMiddlewareResponse(async (innerRequest) => {
					let processed = handleQueryResult(await queryImpl(innerRequest, location, matches, requestContext, dataStrategy || null, false, match, null, false));
					return isResponse(processed) ? processed : typeof processed === "string" ? new Response(processed) : Response.json(processed);
				});
			}, (error) => {
				if (isDataWithResponseInit(error)) return Promise.resolve(dataWithResponseInitToResponse(error));
				if (isResponse(error)) return Promise.resolve(error);
				throw error;
			});
		}
		return handleQueryResult(await queryImpl(request, location, matches, requestContext, dataStrategy || null, false, match, null, false));
		function handleQueryResult(result) {
			if (isResponse(result)) return result;
			let error = result.errors ? Object.values(result.errors)[0] : void 0;
			if (error !== void 0) throw error;
			if (result.actionData) return Object.values(result.actionData)[0];
			if (result.loaderData) return Object.values(result.loaderData)[0];
		}
	}
	async function queryImpl(request, location, matches, requestContext, dataStrategy, skipLoaderErrorBubbling, routeMatch, filterMatchesToLoad, skipRevalidation) {
		invariant(request.signal, "query()/queryRoute() requests must contain an AbortController signal");
		try {
			if (isMutationMethod(request.method)) return await submit(request, location, matches, routeMatch || getTargetMatch(matches, location), requestContext, dataStrategy, skipLoaderErrorBubbling, routeMatch != null, filterMatchesToLoad, skipRevalidation);
			let result = await loadRouteData(request, location, matches, requestContext, dataStrategy, skipLoaderErrorBubbling, routeMatch, filterMatchesToLoad);
			return isResponse(result) ? result : {
				...result,
				actionData: null,
				actionHeaders: {}
			};
		} catch (e) {
			if (isDataStrategyResult(e) && isResponse(e.result)) {
				if (e.type === "error") throw e.result;
				return e.result;
			}
			if (isRedirectResponse(e)) return e;
			throw e;
		}
	}
	async function submit(request, location, matches, actionMatch, requestContext, dataStrategy, skipLoaderErrorBubbling, isRouteRequest, filterMatchesToLoad, skipRevalidation) {
		let result;
		if (!actionMatch.route.action && !actionMatch.route.lazy) {
			let error = getInternalRouterError(405, {
				method: request.method,
				pathname: new URL(request.url).pathname,
				routeId: actionMatch.route.id
			});
			if (isRouteRequest) throw error;
			result = {
				type: "error",
				error
			};
		} else {
			result = (await callDataStrategy(request, location, getTargetedDataStrategyMatches(mapRouteProperties, manifest, request, location, matches, actionMatch, [], requestContext), isRouteRequest, requestContext, dataStrategy))[actionMatch.route.id];
			if (request.signal.aborted) throwStaticHandlerAbortedError(request, isRouteRequest);
		}
		if (isRedirectResult(result)) throw new Response(null, {
			status: result.response.status,
			headers: { Location: result.response.headers.get("Location") }
		});
		if (isRouteRequest) {
			if (isErrorResult(result)) throw result.error;
			return {
				matches: [actionMatch],
				loaderData: {},
				actionData: { [actionMatch.route.id]: result.data },
				errors: null,
				statusCode: 200,
				loaderHeaders: {},
				actionHeaders: {}
			};
		}
		if (skipRevalidation) if (isErrorResult(result)) {
			let boundaryMatch = skipLoaderErrorBubbling ? actionMatch : findNearestBoundary(matches, actionMatch.route.id);
			return {
				statusCode: isRouteErrorResponse(result.error) ? result.error.status : result.statusCode != null ? result.statusCode : 500,
				actionData: null,
				actionHeaders: { ...result.headers ? { [actionMatch.route.id]: result.headers } : {} },
				matches,
				loaderData: {},
				errors: { [boundaryMatch.route.id]: result.error },
				loaderHeaders: {}
			};
		} else return {
			actionData: { [actionMatch.route.id]: result.data },
			actionHeaders: result.headers ? { [actionMatch.route.id]: result.headers } : {},
			matches,
			loaderData: {},
			errors: null,
			statusCode: result.statusCode || 200,
			loaderHeaders: {}
		};
		let loaderRequest = new Request(request.url, {
			headers: request.headers,
			redirect: request.redirect,
			signal: request.signal
		});
		if (isErrorResult(result)) return {
			...await loadRouteData(loaderRequest, location, matches, requestContext, dataStrategy, skipLoaderErrorBubbling, null, filterMatchesToLoad, [(skipLoaderErrorBubbling ? actionMatch : findNearestBoundary(matches, actionMatch.route.id)).route.id, result]),
			statusCode: isRouteErrorResponse(result.error) ? result.error.status : result.statusCode != null ? result.statusCode : 500,
			actionData: null,
			actionHeaders: { ...result.headers ? { [actionMatch.route.id]: result.headers } : {} }
		};
		return {
			...await loadRouteData(loaderRequest, location, matches, requestContext, dataStrategy, skipLoaderErrorBubbling, null, filterMatchesToLoad),
			actionData: { [actionMatch.route.id]: result.data },
			...result.statusCode ? { statusCode: result.statusCode } : {},
			actionHeaders: result.headers ? { [actionMatch.route.id]: result.headers } : {}
		};
	}
	async function loadRouteData(request, location, matches, requestContext, dataStrategy, skipLoaderErrorBubbling, routeMatch, filterMatchesToLoad, pendingActionResult) {
		let isRouteRequest = routeMatch != null;
		if (isRouteRequest && !routeMatch?.route.loader && !routeMatch?.route.lazy) throw getInternalRouterError(400, {
			method: request.method,
			pathname: new URL(request.url).pathname,
			routeId: routeMatch?.route.id
		});
		let dsMatches;
		if (routeMatch) dsMatches = getTargetedDataStrategyMatches(mapRouteProperties, manifest, request, location, matches, routeMatch, [], requestContext);
		else {
			let maxIdx = pendingActionResult && isErrorResult(pendingActionResult[1]) ? matches.findIndex((m) => m.route.id === pendingActionResult[0]) - 1 : void 0;
			let pattern = getRoutePattern(matches);
			dsMatches = matches.map((match, index) => {
				if (maxIdx != null && index > maxIdx) return getDataStrategyMatch(mapRouteProperties, manifest, request, location, pattern, match, [], requestContext, false);
				return getDataStrategyMatch(mapRouteProperties, manifest, request, location, pattern, match, [], requestContext, (match.route.loader || match.route.lazy) != null && (!filterMatchesToLoad || filterMatchesToLoad(match)));
			});
		}
		if (!dataStrategy && !dsMatches.some((m) => m.shouldLoad)) return {
			matches,
			loaderData: {},
			errors: pendingActionResult && isErrorResult(pendingActionResult[1]) ? { [pendingActionResult[0]]: pendingActionResult[1].error } : null,
			statusCode: 200,
			loaderHeaders: {}
		};
		let results = await callDataStrategy(request, location, dsMatches, isRouteRequest, requestContext, dataStrategy);
		if (request.signal.aborted) throwStaticHandlerAbortedError(request, isRouteRequest);
		return {
			...processRouteLoaderData(matches, results, pendingActionResult, true, skipLoaderErrorBubbling),
			matches
		};
	}
	async function callDataStrategy(request, location, matches, isRouteRequest, requestContext, dataStrategy) {
		let results = await callDataStrategyImpl(dataStrategy || defaultDataStrategy, request, location, matches, null, requestContext, true);
		let dataResults = {};
		await Promise.all(matches.map(async (match) => {
			if (!(match.route.id in results)) return;
			let result = results[match.route.id];
			if (isRedirectDataStrategyResult(result)) {
				let response = result.result;
				throw normalizeRelativeRoutingRedirectResponse(response, request, match.route.id, matches, basename);
			}
			if (isRouteRequest) {
				if (isResponse(result.result)) throw result;
				else if (isDataWithResponseInit(result.result)) throw dataWithResponseInitToResponse(result.result);
			}
			dataResults[match.route.id] = await convertDataStrategyResultToDataResult(result);
		}));
		return dataResults;
	}
	return {
		dataRoutes,
		_internalRouteBranches: routeBranches,
		query,
		queryRoute
	};
}
/**
* Given an existing StaticHandlerContext and an error thrown at render time,
* provide an updated StaticHandlerContext suitable for a second SSR render
*
* @category Utils
*/
function getStaticContextFromError(routes, handlerContext, error, boundaryId) {
	let errorBoundaryId = boundaryId || handlerContext._deepestRenderedBoundaryId || routes[0].id;
	return {
		...handlerContext,
		statusCode: isRouteErrorResponse(error) ? error.status : 500,
		errors: { [errorBoundaryId]: error }
	};
}
function throwStaticHandlerAbortedError(request, isRouteRequest) {
	if (request.signal.reason !== void 0) throw request.signal.reason;
	throw new Error(`${isRouteRequest ? "queryRoute" : "query"}() call aborted without an \`AbortSignal.reason\`: ${request.method} ${request.url}`);
}
function defaultNormalizePath(request) {
	let url = new URL(request.url);
	return {
		pathname: url.pathname,
		search: url.search,
		hash: url.hash
	};
}
function normalizeTo(location, matches, basename, to, fromRouteId, relative) {
	let contextualMatches;
	let activeRouteMatch;
	if (fromRouteId) {
		contextualMatches = [];
		for (let match of matches) {
			contextualMatches.push(match);
			if (match.route.id === fromRouteId) {
				activeRouteMatch = match;
				break;
			}
		}
	} else {
		contextualMatches = matches;
		activeRouteMatch = matches[matches.length - 1];
	}
	let path = resolveTo(to ? to : ".", getResolveToMatches(contextualMatches), stripBasename(location.pathname, basename) || location.pathname, relative === "path");
	if (to == null) {
		path.search = location.search;
		path.hash = location.hash;
	}
	if ((to == null || to === "" || to === ".") && activeRouteMatch) {
		let nakedIndex = hasNakedIndexQuery(path.search);
		if (activeRouteMatch.route.index && !nakedIndex) path.search = path.search ? path.search.replace(/^\?/, "?index&") : "?index";
		else if (!activeRouteMatch.route.index && nakedIndex) {
			let params = new URLSearchParams(path.search);
			let indexValues = params.getAll("index");
			params.delete("index");
			indexValues.filter((v) => v).forEach((v) => params.append("index", v));
			let qs = params.toString();
			path.search = qs ? `?${qs}` : "";
		}
	}
	if (basename !== "/") path.pathname = prependBasename({
		basename,
		pathname: path.pathname
	});
	return createPath(path);
}
function shouldRevalidateLoader(loaderMatch, arg) {
	if (loaderMatch.route.shouldRevalidate) {
		let routeChoice = loaderMatch.route.shouldRevalidate(arg);
		if (typeof routeChoice === "boolean") return routeChoice;
	}
	return arg.defaultShouldRevalidate;
}
var lazyRoutePropertyCache = /* @__PURE__ */ new WeakMap();
var loadLazyRouteProperty = ({ key, route, manifest, mapRouteProperties }) => {
	let routeToUpdate = manifest[route.id];
	invariant(routeToUpdate, "No route found in manifest");
	if (!routeToUpdate.lazy || typeof routeToUpdate.lazy !== "object") return;
	let lazyFn = routeToUpdate.lazy[key];
	if (!lazyFn) return;
	let cache = lazyRoutePropertyCache.get(routeToUpdate);
	if (!cache) {
		cache = {};
		lazyRoutePropertyCache.set(routeToUpdate, cache);
	}
	let cachedPromise = cache[key];
	if (cachedPromise) return cachedPromise;
	let propertyPromise = (async () => {
		let isUnsupported = isUnsupportedLazyRouteObjectKey(key);
		let isStaticallyDefined = routeToUpdate[key] !== void 0;
		if (isUnsupported) {
			warning(!isUnsupported, "Route property " + key + " is not a supported lazy route property. This property will be ignored.");
			cache[key] = Promise.resolve();
		} else if (isStaticallyDefined) warning(false, `Route "${routeToUpdate.id}" has a static property "${key}" defined. The lazy property will be ignored.`);
		else {
			let value = await lazyFn();
			if (value != null) {
				Object.assign(routeToUpdate, { [key]: value });
				Object.assign(routeToUpdate, mapRouteProperties(routeToUpdate));
			}
		}
		if (typeof routeToUpdate.lazy === "object") {
			routeToUpdate.lazy[key] = void 0;
			if (Object.values(routeToUpdate.lazy).every((value) => value === void 0)) routeToUpdate.lazy = void 0;
		}
	})();
	cache[key] = propertyPromise;
	return propertyPromise;
};
var lazyRouteFunctionCache = /* @__PURE__ */ new WeakMap();
/**
* Execute route.lazy functions to lazily load route modules (loader, action,
* shouldRevalidate) and update the routeManifest in place which shares objects
* with dataRoutes so those get updated as well.
*/
function loadLazyRoute(route, type, manifest, mapRouteProperties, lazyRoutePropertiesToSkip) {
	let routeToUpdate = manifest[route.id];
	invariant(routeToUpdate, "No route found in manifest");
	if (!route.lazy) return {
		lazyRoutePromise: void 0,
		lazyHandlerPromise: void 0
	};
	if (typeof route.lazy === "function") {
		let cachedPromise = lazyRouteFunctionCache.get(routeToUpdate);
		if (cachedPromise) return {
			lazyRoutePromise: cachedPromise,
			lazyHandlerPromise: cachedPromise
		};
		let lazyRoutePromise = (async () => {
			invariant(typeof route.lazy === "function", "No lazy route function found");
			let lazyRoute = await route.lazy();
			let routeUpdates = {};
			for (let lazyRouteProperty in lazyRoute) {
				let lazyValue = lazyRoute[lazyRouteProperty];
				if (lazyValue === void 0) continue;
				let isUnsupported = isUnsupportedLazyRouteFunctionKey(lazyRouteProperty);
				let isStaticallyDefined = routeToUpdate[lazyRouteProperty] !== void 0;
				if (isUnsupported) warning(!isUnsupported, "Route property " + lazyRouteProperty + " is not a supported property to be returned from a lazy route function. This property will be ignored.");
				else if (isStaticallyDefined) warning(!isStaticallyDefined, `Route "${routeToUpdate.id}" has a static property "${lazyRouteProperty}" defined but its lazy function is also returning a value for this property. The lazy route property "${lazyRouteProperty}" will be ignored.`);
				else routeUpdates[lazyRouteProperty] = lazyValue;
			}
			Object.assign(routeToUpdate, routeUpdates);
			Object.assign(routeToUpdate, {
				...mapRouteProperties(routeToUpdate),
				lazy: void 0
			});
		})();
		lazyRouteFunctionCache.set(routeToUpdate, lazyRoutePromise);
		lazyRoutePromise.catch(() => {});
		return {
			lazyRoutePromise,
			lazyHandlerPromise: lazyRoutePromise
		};
	}
	let lazyKeys = Object.keys(route.lazy);
	let lazyPropertyPromises = [];
	let lazyHandlerPromise = void 0;
	for (let key of lazyKeys) {
		if (lazyRoutePropertiesToSkip && lazyRoutePropertiesToSkip.includes(key)) continue;
		let promise = loadLazyRouteProperty({
			key,
			route,
			manifest,
			mapRouteProperties
		});
		if (promise) {
			lazyPropertyPromises.push(promise);
			if (key === type) lazyHandlerPromise = promise;
		}
	}
	let lazyRoutePromise = lazyPropertyPromises.length > 0 ? Promise.all(lazyPropertyPromises).then(() => {}) : void 0;
	lazyRoutePromise?.catch(() => {});
	lazyHandlerPromise?.catch(() => {});
	return {
		lazyRoutePromise,
		lazyHandlerPromise
	};
}
function isNonNullable(value) {
	return value !== void 0;
}
function loadLazyMiddlewareForMatches(matches, manifest, mapRouteProperties) {
	let promises = matches.map(({ route }) => {
		if (typeof route.lazy !== "object" || !route.lazy.middleware) return;
		return loadLazyRouteProperty({
			key: "middleware",
			route,
			manifest,
			mapRouteProperties
		});
	}).filter(isNonNullable);
	return promises.length > 0 ? Promise.all(promises) : void 0;
}
async function defaultDataStrategy(args) {
	let matchesToLoad = args.matches.filter((m) => m.shouldLoad);
	let keyedResults = {};
	(await Promise.all(matchesToLoad.map((m) => m.resolve()))).forEach((result, i) => {
		keyedResults[matchesToLoad[i].route.id] = result;
	});
	return keyedResults;
}
function runServerMiddlewarePipeline(args, handler, errorHandler) {
	return runMiddlewarePipeline(args, handler, processResult, isResponse, errorHandler);
	function processResult(result) {
		return isDataWithResponseInit(result) ? dataWithResponseInitToResponse(result) : result;
	}
}
function runClientMiddlewarePipeline(args, handler) {
	return runMiddlewarePipeline(args, handler, (r) => {
		if (isRedirectResponse(r)) throw r;
		return r;
	}, isDataStrategyResults, errorHandler);
	async function errorHandler(error, routeId, nextResult) {
		if (nextResult) return Object.assign(nextResult.value, { [routeId]: {
			type: "error",
			result: error
		} });
		else {
			let { matches } = args;
			let maxBoundaryIdx = Math.min(Math.max(matches.findIndex((m) => m.route.id === routeId), 0), Math.max(matches.findIndex((m) => m.shouldCallHandler()), 0));
			let deepestRouteId = matches[maxBoundaryIdx].route.id;
			for (let match of matches.slice(0, maxBoundaryIdx + 1)) try {
				await match._lazyPromises?.route;
			} catch {
				deepestRouteId = match.route.id;
				break;
			}
			return { [findNearestBoundary(matches, deepestRouteId).route.id]: {
				type: "error",
				result: error
			} };
		}
	}
}
async function runMiddlewarePipeline(args, handler, processResult, isResult, errorHandler) {
	let { matches, ...dataFnArgs } = args;
	return await callRouteMiddleware(dataFnArgs, matches.flatMap((m) => m.route.middleware ? m.route.middleware.map((fn) => [m.route.id, fn]) : []), handler, processResult, isResult, errorHandler);
}
async function callRouteMiddleware(args, middlewares, handler, processResult, isResult, errorHandler, idx = 0) {
	let { request } = args;
	if (request.signal.aborted) throw request.signal.reason ?? /* @__PURE__ */ new Error(`Request aborted: ${request.method} ${request.url}`);
	let tuple = middlewares[idx];
	if (!tuple) return await handler();
	let [routeId, middleware] = tuple;
	let nextResult;
	let next = async () => {
		if (nextResult) throw new Error("You may only call `next()` once per middleware");
		try {
			nextResult = { value: await callRouteMiddleware(args, middlewares, handler, processResult, isResult, errorHandler, idx + 1) };
			return nextResult.value;
		} catch (error) {
			nextResult = { value: await errorHandler(error, routeId, nextResult) };
			return nextResult.value;
		}
	};
	try {
		let value = await middleware(args, next);
		let result = value != null ? processResult(value) : void 0;
		if (isResult(result)) return result;
		else if (nextResult) return result ?? nextResult.value;
		else {
			nextResult = { value: await next() };
			return nextResult.value;
		}
	} catch (error) {
		return await errorHandler(error, routeId, nextResult);
	}
}
function getDataStrategyMatchLazyPromises(mapRouteProperties, manifest, request, match, lazyRoutePropertiesToSkip) {
	let lazyMiddlewarePromise = loadLazyRouteProperty({
		key: "middleware",
		route: match.route,
		manifest,
		mapRouteProperties
	});
	let lazyRoutePromises = loadLazyRoute(match.route, isMutationMethod(request.method) ? "action" : "loader", manifest, mapRouteProperties, lazyRoutePropertiesToSkip);
	return {
		middleware: lazyMiddlewarePromise,
		route: lazyRoutePromises.lazyRoutePromise,
		handler: lazyRoutePromises.lazyHandlerPromise
	};
}
function getDataStrategyMatch(mapRouteProperties, manifest, request, path, pattern, match, lazyRoutePropertiesToSkip, scopedContext, shouldLoad, shouldRevalidateArgs = null, callSiteDefaultShouldRevalidate) {
	let isUsingNewApi = false;
	let _lazyPromises = getDataStrategyMatchLazyPromises(mapRouteProperties, manifest, request, match, lazyRoutePropertiesToSkip);
	return {
		...match,
		_lazyPromises,
		shouldLoad,
		shouldRevalidateArgs,
		shouldCallHandler(defaultShouldRevalidate) {
			isUsingNewApi = true;
			if (!shouldRevalidateArgs) return shouldLoad;
			if (typeof callSiteDefaultShouldRevalidate === "boolean") return shouldRevalidateLoader(match, {
				...shouldRevalidateArgs,
				defaultShouldRevalidate: callSiteDefaultShouldRevalidate
			});
			if (typeof defaultShouldRevalidate === "boolean") return shouldRevalidateLoader(match, {
				...shouldRevalidateArgs,
				defaultShouldRevalidate
			});
			return shouldRevalidateLoader(match, shouldRevalidateArgs);
		},
		resolve(handlerOverride) {
			let { lazy, loader, middleware } = match.route;
			let callHandler = isUsingNewApi || shouldLoad || handlerOverride && !isMutationMethod(request.method) && (lazy || loader);
			let isMiddlewareOnlyRoute = middleware && middleware.length > 0 && !loader && !lazy;
			if (callHandler && (isMutationMethod(request.method) || !isMiddlewareOnlyRoute)) return callLoaderOrAction({
				request,
				path,
				pattern,
				match,
				lazyHandlerPromise: _lazyPromises?.handler,
				lazyRoutePromise: _lazyPromises?.route,
				handlerOverride,
				scopedContext
			});
			return Promise.resolve({
				type: "data",
				result: void 0
			});
		}
	};
}
function getTargetedDataStrategyMatches(mapRouteProperties, manifest, request, path, matches, targetMatch, lazyRoutePropertiesToSkip, scopedContext, shouldRevalidateArgs = null) {
	return matches.map((match) => {
		if (match.route.id !== targetMatch.route.id) return {
			...match,
			shouldLoad: false,
			shouldRevalidateArgs,
			shouldCallHandler: () => false,
			_lazyPromises: getDataStrategyMatchLazyPromises(mapRouteProperties, manifest, request, match, lazyRoutePropertiesToSkip),
			resolve: () => Promise.resolve({
				type: "data",
				result: void 0
			})
		};
		return getDataStrategyMatch(mapRouteProperties, manifest, request, path, getRoutePattern(matches), match, lazyRoutePropertiesToSkip, scopedContext, true, shouldRevalidateArgs);
	});
}
async function callDataStrategyImpl(dataStrategyImpl, request, path, matches, fetcherKey, scopedContext, isStaticHandler) {
	if (matches.some((m) => m._lazyPromises?.middleware)) await Promise.all(matches.map((m) => m._lazyPromises?.middleware));
	let dataStrategyArgs = {
		request,
		url: createDataFunctionUrl(request, path),
		pattern: getRoutePattern(matches),
		params: matches[0].params,
		context: scopedContext,
		matches
	};
	let runClientMiddleware = isStaticHandler ? () => {
		throw new Error("You cannot call `runClientMiddleware()` from a static handler `dataStrategy`. Middleware is run outside of `dataStrategy` during SSR in order to bubble up the Response.  You can enable middleware via the `respond` API in `query`/`queryRoute`");
	} : (cb) => {
		let typedDataStrategyArgs = dataStrategyArgs;
		return runClientMiddlewarePipeline(typedDataStrategyArgs, () => {
			return cb({
				...typedDataStrategyArgs,
				fetcherKey,
				runClientMiddleware: () => {
					throw new Error("Cannot call `runClientMiddleware()` from within an `runClientMiddleware` handler");
				}
			});
		});
	};
	let results = await dataStrategyImpl({
		...dataStrategyArgs,
		fetcherKey,
		runClientMiddleware
	});
	try {
		await Promise.all(matches.flatMap((m) => [m._lazyPromises?.handler, m._lazyPromises?.route]));
	} catch {}
	return results;
}
async function callLoaderOrAction({ request, path, pattern, match, lazyHandlerPromise, lazyRoutePromise, handlerOverride, scopedContext }) {
	let result;
	let onReject;
	let isAction = isMutationMethod(request.method);
	let type = isAction ? "action" : "loader";
	let runHandler = (handler) => {
		let reject;
		let abortPromise = new Promise((_, r) => reject = r);
		onReject = () => reject();
		request.signal.addEventListener("abort", onReject);
		let actualHandler = (ctx) => {
			if (typeof handler !== "function") return Promise.reject(/* @__PURE__ */ new Error(`You cannot call the handler for a route which defines a boolean "${type}" [routeId: ${match.route.id}]`));
			return handler({
				request,
				url: createDataFunctionUrl(request, path),
				pattern,
				params: match.params,
				context: scopedContext
			}, ...ctx !== void 0 ? [ctx] : []);
		};
		let handlerPromise = (async () => {
			try {
				return {
					type: "data",
					result: await (handlerOverride ? handlerOverride((ctx) => actualHandler(ctx)) : actualHandler())
				};
			} catch (e) {
				return {
					type: "error",
					result: e
				};
			}
		})();
		return Promise.race([handlerPromise, abortPromise]);
	};
	try {
		let handler = isAction ? match.route.action : match.route.loader;
		if (lazyHandlerPromise || lazyRoutePromise) if (handler) {
			let handlerError;
			let [value] = await Promise.all([
				runHandler(handler).catch((e) => {
					handlerError = e;
				}),
				lazyHandlerPromise,
				lazyRoutePromise
			]);
			if (handlerError !== void 0) throw handlerError;
			result = value;
		} else {
			await lazyHandlerPromise;
			let handler = isAction ? match.route.action : match.route.loader;
			if (handler) [result] = await Promise.all([runHandler(handler), lazyRoutePromise]);
			else if (type === "action") {
				let url = new URL(request.url);
				let pathname = url.pathname + url.search;
				throw getInternalRouterError(405, {
					method: request.method,
					pathname,
					routeId: match.route.id
				});
			} else return {
				type: "data",
				result: void 0
			};
		}
		else if (!handler) {
			let url = new URL(request.url);
			throw getInternalRouterError(404, { pathname: url.pathname + url.search });
		} else result = await runHandler(handler);
	} catch (e) {
		return {
			type: "error",
			result: e
		};
	} finally {
		if (onReject) request.signal.removeEventListener("abort", onReject);
	}
	return result;
}
async function parseResponseBody(response) {
	let contentType = response.headers.get("Content-Type");
	if (contentType && /\bapplication\/json\b/.test(contentType)) return response.body == null ? null : response.json();
	return response.text();
}
async function convertDataStrategyResultToDataResult(dataStrategyResult) {
	let { result, type } = dataStrategyResult;
	if (isResponse(result)) {
		let data;
		try {
			data = await parseResponseBody(result);
		} catch (e) {
			return {
				type: "error",
				error: e
			};
		}
		if (type === "error") return {
			type: "error",
			error: new ErrorResponseImpl(result.status, result.statusText, data),
			statusCode: result.status,
			headers: result.headers
		};
		return {
			type: "data",
			data,
			statusCode: result.status,
			headers: result.headers
		};
	}
	if (type === "error") {
		if (isDataWithResponseInit(result)) {
			if (result.data instanceof Error) return {
				type: "error",
				error: result.data,
				statusCode: result.init?.status,
				headers: result.init?.headers ? new Headers(result.init.headers) : void 0
			};
			return {
				type: "error",
				error: dataWithResponseInitToErrorResponse(result),
				statusCode: isRouteErrorResponse(result) ? result.status : void 0,
				headers: result.init?.headers ? new Headers(result.init.headers) : void 0
			};
		}
		return {
			type: "error",
			error: result,
			statusCode: isRouteErrorResponse(result) ? result.status : void 0
		};
	}
	if (isDataWithResponseInit(result)) return {
		type: "data",
		data: result.data,
		statusCode: result.init?.status,
		headers: result.init?.headers ? new Headers(result.init.headers) : void 0
	};
	return {
		type: "data",
		data: result
	};
}
function normalizeRelativeRoutingRedirectResponse(response, request, routeId, matches, basename) {
	let location = response.headers.get("Location");
	invariant(location, "Redirects returned/thrown from loaders/actions must have a Location header");
	if (!isAbsoluteUrl(location)) {
		let trimmedMatches = matches.slice(0, matches.findIndex((m) => m.route.id === routeId) + 1);
		location = normalizeTo(new URL(request.url), trimmedMatches, basename, location);
		response.headers.set("Location", location);
	}
	return response;
}
var invalidProtocols = [
	"about:",
	"blob:",
	"chrome:",
	"chrome-untrusted:",
	"content:",
	"data:",
	"devtools:",
	"file:",
	"filesystem:",
	"javascript:"
];
function hasInvalidProtocol(location) {
	try {
		return invalidProtocols.includes(new URL(location).protocol);
	} catch {
		return false;
	}
}
function processRouteLoaderData(matches, results, pendingActionResult, isStaticHandler = false, skipLoaderErrorBubbling = false) {
	let loaderData = {};
	let errors = null;
	let statusCode;
	let foundError = false;
	let loaderHeaders = {};
	let pendingError = pendingActionResult && isErrorResult(pendingActionResult[1]) ? pendingActionResult[1].error : void 0;
	matches.forEach((match) => {
		if (!(match.route.id in results)) return;
		let id = match.route.id;
		let result = results[id];
		invariant(!isRedirectResult(result), "Cannot handle redirect results in processLoaderData");
		if (isErrorResult(result)) {
			let error = result.error;
			if (pendingError !== void 0) {
				error = pendingError;
				pendingError = void 0;
			}
			errors = errors || {};
			if (skipLoaderErrorBubbling) errors[id] = error;
			else {
				let boundaryMatch = findNearestBoundary(matches, id);
				if (errors[boundaryMatch.route.id] == null) errors[boundaryMatch.route.id] = error;
			}
			if (!isStaticHandler) loaderData[id] = ResetLoaderDataSymbol;
			if (!foundError) {
				foundError = true;
				statusCode = isRouteErrorResponse(result.error) ? result.error.status : 500;
			}
			if (result.headers) loaderHeaders[id] = result.headers;
		} else {
			loaderData[id] = result.data;
			if (result.statusCode && result.statusCode !== 200 && !foundError) statusCode = result.statusCode;
			if (result.headers) loaderHeaders[id] = result.headers;
		}
	});
	if (pendingError !== void 0 && pendingActionResult) {
		errors = { [pendingActionResult[0]]: pendingError };
		if (pendingActionResult[2]) loaderData[pendingActionResult[2]] = void 0;
	}
	return {
		loaderData,
		errors,
		statusCode: statusCode || 200,
		loaderHeaders
	};
}
function findNearestBoundary(matches, routeId) {
	return (routeId ? matches.slice(0, matches.findIndex((m) => m.route.id === routeId) + 1) : [...matches]).reverse().find((m) => m.route.ErrorBoundary != null || m.route.errorElement != null) || matches[0];
}
function getShortCircuitMatches(routes) {
	let route = routes.length === 1 ? routes[0] : routes.find((r) => r.index || !r.path || r.path === "/") || { id: `__shim-error-route__` };
	return {
		matches: [{
			params: {},
			pathname: "",
			pathnameBase: "",
			route
		}],
		route
	};
}
function getInternalRouterError(status, { pathname, routeId, method, type, message } = {}) {
	let statusText = "Unknown Server Error";
	let errorMessage = "Unknown @remix-run/router error";
	if (status === 400) {
		statusText = "Bad Request";
		if (method && pathname && routeId) errorMessage = `You made a ${method} request to "${pathname}" but did not provide a \`loader\` for route "${routeId}", so there is no way to handle the request.`;
		else if (type === "invalid-body") errorMessage = "Unable to encode submission body";
	} else if (status === 403) {
		statusText = "Forbidden";
		errorMessage = `Route "${routeId}" does not match URL "${pathname}"`;
	} else if (status === 404) {
		statusText = "Not Found";
		errorMessage = `No route matches URL "${pathname}"`;
	} else if (status === 405) {
		statusText = "Method Not Allowed";
		if (method && pathname && routeId) errorMessage = `You made a ${method.toUpperCase()} request to "${pathname}" but did not provide an \`action\` for route "${routeId}", so there is no way to handle the request.`;
		else if (method) errorMessage = `Invalid request method "${method.toUpperCase()}"`;
	}
	return new ErrorResponseImpl(status || 500, statusText, new Error(errorMessage), true);
}
function dataWithResponseInitToResponse(data) {
	return Response.json(data.data, data.init ?? void 0);
}
function dataWithResponseInitToErrorResponse(data) {
	return new ErrorResponseImpl(data.init?.status ?? 500, data.init?.statusText ?? "Internal Server Error", data.data);
}
function isDataStrategyResults(result) {
	return result != null && typeof result === "object" && Object.entries(result).every(([key, value]) => typeof key === "string" && isDataStrategyResult(value));
}
function isDataStrategyResult(result) {
	return result != null && typeof result === "object" && "type" in result && "result" in result && (result.type === "data" || result.type === "error");
}
function isRedirectDataStrategyResult(result) {
	return isResponse(result.result) && redirectStatusCodes.has(result.result.status);
}
function isErrorResult(result) {
	return result.type === "error";
}
function isRedirectResult(result) {
	return (result && result.type) === "redirect";
}
function isDataWithResponseInit(value) {
	return typeof value === "object" && value != null && "type" in value && "data" in value && "init" in value && value.type === "DataWithResponseInit";
}
function isResponse(value) {
	return value != null && typeof value.status === "number" && typeof value.statusText === "string" && typeof value.headers === "object" && typeof value.body !== "undefined";
}
function isRedirectStatusCode(statusCode) {
	return redirectStatusCodes.has(statusCode);
}
function isRedirectResponse(result) {
	return isResponse(result) && isRedirectStatusCode(result.status) && result.headers.has("Location");
}
function isValidMethod(method) {
	return validRequestMethods.has(method.toUpperCase());
}
function isMutationMethod(method) {
	return validMutationMethods.has(method.toUpperCase());
}
function hasNakedIndexQuery(search) {
	return new URLSearchParams(search).getAll("index").some((v) => v === "");
}
function getTargetMatch(matches, location) {
	let search = typeof location === "string" ? parsePath(location).search : location.search;
	if (matches[matches.length - 1].route.index && hasNakedIndexQuery(search || "")) return matches[matches.length - 1];
	let pathMatches = getPathContributingMatches(matches);
	return pathMatches[pathMatches.length - 1];
}
//#endregion
//#region node_modules/react-router/dist/production/lib/dom/ssr/markup.js
/**
* react-router v8.3.1
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
var ESCAPE_LOOKUP = {
	"&": "\\u0026",
	">": "\\u003e",
	"<": "\\u003c",
	"\u2028": "\\u2028",
	"\u2029": "\\u2029"
};
var ESCAPE_REGEX = /[&><\u2028\u2029]/g;
function escapeHtml(html) {
	return html.replace(ESCAPE_REGEX, (match) => ESCAPE_LOOKUP[match]);
}
//#endregion
//#region node_modules/react-router/dist/production/vendor/turbo-stream-v2/utils.js
/**
* react-router v8.3.1
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
var Deferred = class {
	promise;
	resolve;
	reject;
	constructor() {
		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}
};
function createLineSplittingTransform() {
	const decoder = new TextDecoder();
	let leftover = "";
	return new TransformStream({
		transform(chunk, controller) {
			const str = decoder.decode(chunk, { stream: true });
			const parts = (leftover + str).split("\n");
			leftover = parts.pop() || "";
			for (const part of parts) controller.enqueue(part);
		},
		flush(controller) {
			if (leftover) controller.enqueue(leftover);
		}
	});
}
//#endregion
//#region node_modules/react-router/dist/production/vendor/turbo-stream-v2/flatten.js
/**
* react-router v8.3.1
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
var TIME_LIMIT_MS = 1;
var getNow = () => Date.now();
var yieldToMain = () => new Promise((resolve) => setTimeout(resolve, 0));
async function flatten(input) {
	const { indices } = this;
	const existing = indices.get(input);
	if (existing) return [existing];
	if (input === void 0) return -7;
	if (input === null) return -5;
	if (Number.isNaN(input)) return -2;
	if (input === Number.POSITIVE_INFINITY) return -6;
	if (input === Number.NEGATIVE_INFINITY) return -3;
	if (input === 0 && 1 / input < 0) return -4;
	const index = this.index++;
	indices.set(input, index);
	const stack = [[input, index]];
	await stringify.call(this, stack);
	return index;
}
async function stringify(stack) {
	const { deferred, indices, plugins, postPlugins } = this;
	const str = this.stringified;
	let lastYieldTime = getNow();
	const flattenValue = (value) => {
		const existing = indices.get(value);
		if (existing) return [existing];
		if (value === void 0) return -7;
		if (value === null) return -5;
		if (Number.isNaN(value)) return -2;
		if (value === Number.POSITIVE_INFINITY) return -6;
		if (value === Number.NEGATIVE_INFINITY) return -3;
		if (value === 0 && 1 / value < 0) return -4;
		const index = this.index++;
		indices.set(value, index);
		stack.push([value, index]);
		return index;
	};
	let i = 0;
	while (stack.length > 0) {
		const now = getNow();
		if (++i % 6e3 === 0 && now - lastYieldTime >= TIME_LIMIT_MS) {
			await yieldToMain();
			lastYieldTime = getNow();
		}
		const [input, index] = stack.pop();
		const partsForObj = (obj) => Object.keys(obj).map((k) => `"_${flattenValue(k)}":${flattenValue(obj[k])}`).join(",");
		let error = null;
		switch (typeof input) {
			case "boolean":
			case "number":
			case "string":
				str[index] = JSON.stringify(input);
				break;
			case "bigint":
				str[index] = `["B","${input}"]`;
				break;
			case "symbol": {
				const keyFor = Symbol.keyFor(input);
				if (!keyFor) error = /* @__PURE__ */ new Error("Cannot encode symbol unless created with Symbol.for()");
				else str[index] = `["Y",${JSON.stringify(keyFor)}]`;
				break;
			}
			case "object": {
				if (!input) {
					str[index] = `-5`;
					break;
				}
				const isArray = Array.isArray(input);
				let pluginHandled = false;
				if (!isArray && plugins) for (const plugin of plugins) {
					const pluginResult = plugin(input);
					if (Array.isArray(pluginResult)) {
						pluginHandled = true;
						const [pluginIdentifier, ...rest] = pluginResult;
						str[index] = `[${JSON.stringify(pluginIdentifier)}`;
						if (rest.length > 0) str[index] += `,${rest.map((v) => flattenValue(v)).join(",")}`;
						str[index] += "]";
						break;
					}
				}
				if (!pluginHandled) {
					let result = isArray ? "[" : "{";
					if (isArray) {
						for (let i = 0; i < input.length; i++) result += (i ? "," : "") + (i in input ? flattenValue(input[i]) : -1);
						str[index] = `${result}]`;
					} else if (input instanceof Date) {
						const dateTime = input.getTime();
						str[index] = `["D",${Number.isNaN(dateTime) ? JSON.stringify("invalid") : dateTime}]`;
					} else if (input instanceof URL) str[index] = `["U",${JSON.stringify(input.href)}]`;
					else if (input instanceof RegExp) str[index] = `["R",${JSON.stringify(input.source)},${JSON.stringify(input.flags)}]`;
					else if (input instanceof Set) if (input.size > 0) str[index] = `["S",${[...input].map((val) => flattenValue(val)).join(",")}]`;
					else str[index] = `["S"]`;
					else if (input instanceof Map) if (input.size > 0) str[index] = `["M",${[...input].flatMap(([k, v]) => [flattenValue(k), flattenValue(v)]).join(",")}]`;
					else str[index] = `["M"]`;
					else if (input instanceof Promise) {
						str[index] = `["P",${index}]`;
						deferred[index] = input;
					} else if (input instanceof Error) {
						str[index] = `["E",${JSON.stringify(input.message)}`;
						if (input.name !== "Error") str[index] += `,${JSON.stringify(input.name)}`;
						str[index] += "]";
					} else if (Object.getPrototypeOf(input) === null) str[index] = `["N",{${partsForObj(input)}}]`;
					else if (isPlainObject(input)) str[index] = `{${partsForObj(input)}}`;
					else error = /* @__PURE__ */ new Error("Cannot encode object with prototype");
				}
				break;
			}
			default: {
				const isArray = Array.isArray(input);
				let pluginHandled = false;
				if (!isArray && plugins) for (const plugin of plugins) {
					const pluginResult = plugin(input);
					if (Array.isArray(pluginResult)) {
						pluginHandled = true;
						const [pluginIdentifier, ...rest] = pluginResult;
						str[index] = `[${JSON.stringify(pluginIdentifier)}`;
						if (rest.length > 0) str[index] += `,${rest.map((v) => flattenValue(v)).join(",")}`;
						str[index] += "]";
						break;
					}
				}
				if (!pluginHandled) error = /* @__PURE__ */ new Error("Cannot encode function or unexpected type");
			}
		}
		if (error) {
			let pluginHandled = false;
			if (postPlugins) for (const plugin of postPlugins) {
				const pluginResult = plugin(input);
				if (Array.isArray(pluginResult)) {
					pluginHandled = true;
					const [pluginIdentifier, ...rest] = pluginResult;
					str[index] = `[${JSON.stringify(pluginIdentifier)}`;
					if (rest.length > 0) str[index] += `,${rest.map((v) => flattenValue(v)).join(",")}`;
					str[index] += "]";
					break;
				}
			}
			if (!pluginHandled) throw error;
		}
	}
}
var objectProtoNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function isPlainObject(thing) {
	const proto = Object.getPrototypeOf(thing);
	return proto === Object.prototype || proto === null || Object.getOwnPropertyNames(proto).sort().join("\0") === objectProtoNames;
}
//#endregion
//#region node_modules/react-router/dist/production/vendor/turbo-stream-v2/unflatten.js
/**
* react-router v8.3.1
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
var globalObj = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : void 0;
function unflatten(parsed) {
	const { hydrated, values } = this;
	if (typeof parsed === "number") return hydrate.call(this, parsed);
	if (!Array.isArray(parsed) || !parsed.length) throw new SyntaxError();
	const startIndex = values.length;
	for (const value of parsed) values.push(value);
	hydrated.length = values.length;
	return hydrate.call(this, startIndex);
}
function hydrate(index) {
	const { hydrated, values, deferred, plugins } = this;
	let result;
	const stack = [[index, (v) => {
		result = v;
	}]];
	let postRun = [];
	while (stack.length > 0) {
		const [index, set] = stack.pop();
		switch (index) {
			case -7:
				set(void 0);
				continue;
			case -5:
				set(null);
				continue;
			case -2:
				set(NaN);
				continue;
			case -6:
				set(Infinity);
				continue;
			case -3:
				set(-Infinity);
				continue;
			case -4:
				set(-0);
				continue;
		}
		if (hydrated[index]) {
			set(hydrated[index]);
			continue;
		}
		const value = values[index];
		if (!value || typeof value !== "object") {
			hydrated[index] = value;
			set(value);
			continue;
		}
		if (Array.isArray(value)) if (typeof value[0] === "string") {
			const [type, b, c] = value;
			switch (type) {
				case "D":
					set(hydrated[index] = new Date(b));
					continue;
				case "U":
					set(hydrated[index] = new URL(b));
					continue;
				case "B":
					set(hydrated[index] = BigInt(b));
					continue;
				case "R":
					set(hydrated[index] = new RegExp(b, c));
					continue;
				case "Y":
					set(hydrated[index] = Symbol.for(b));
					continue;
				case "S":
					const newSet = /* @__PURE__ */ new Set();
					hydrated[index] = newSet;
					for (let i = value.length - 1; i > 0; i--) stack.push([value[i], (v) => {
						newSet.add(v);
					}]);
					set(newSet);
					continue;
				case "M":
					const map = /* @__PURE__ */ new Map();
					hydrated[index] = map;
					for (let i = value.length - 2; i > 0; i -= 2) {
						const r = [];
						stack.push([value[i + 1], (v) => {
							r[1] = v;
						}]);
						stack.push([value[i], (k) => {
							r[0] = k;
						}]);
						postRun.push(() => {
							map.set(r[0], r[1]);
						});
					}
					set(map);
					continue;
				case "N":
					const obj = Object.create(null);
					hydrated[index] = obj;
					for (const key of Object.keys(b).reverse()) {
						const r = [];
						stack.push([b[key], (v) => {
							r[1] = v;
						}]);
						stack.push([Number(key.slice(1)), (k) => {
							r[0] = k;
						}]);
						postRun.push(() => {
							obj[r[0]] = r[1];
						});
					}
					set(obj);
					continue;
				case "P":
					if (hydrated[b]) set(hydrated[index] = hydrated[b]);
					else {
						const d = new Deferred();
						deferred[b] = d;
						set(hydrated[index] = d.promise);
					}
					continue;
				case "E":
					const [, message, errorType] = value;
					let error = errorType && globalObj && SUPPORTED_ERROR_TYPES.includes(errorType) && errorType in globalObj && typeof globalObj[errorType] === "function" ? new globalObj[errorType](message) : new Error(message);
					hydrated[index] = error;
					set(error);
					continue;
				case "Z":
					set(hydrated[index] = hydrated[b]);
					continue;
				default:
					if (Array.isArray(plugins)) {
						const r = [];
						const vals = value.slice(1);
						for (let i = 0; i < vals.length; i++) {
							const v = vals[i];
							stack.push([v, (v) => {
								r[i] = v;
							}]);
						}
						postRun.push(() => {
							for (const plugin of plugins) {
								const result = plugin(value[0], ...r);
								if (result) {
									set(hydrated[index] = result.value);
									return;
								}
							}
							throw new SyntaxError();
						});
						continue;
					}
					throw new SyntaxError();
			}
		} else {
			const array = [];
			hydrated[index] = array;
			for (let i = 0; i < value.length; i++) {
				const n = value[i];
				if (n !== -1) stack.push([n, (v) => {
					array[i] = v;
				}]);
			}
			set(array);
			continue;
		}
		else {
			const object = {};
			hydrated[index] = object;
			for (const key of Object.keys(value).reverse()) {
				const r = [];
				stack.push([value[key], (v) => {
					r[1] = v;
				}]);
				stack.push([Number(key.slice(1)), (k) => {
					r[0] = k;
				}]);
				postRun.push(() => {
					object[r[0]] = r[1];
				});
			}
			set(object);
			continue;
		}
	}
	while (postRun.length > 0) postRun.pop()();
	return result;
}
//#endregion
//#region node_modules/react-router/dist/production/vendor/turbo-stream-v2/turbo-stream.js
/**
* react-router v8.3.1
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
async function decode(readable, options) {
	const { plugins } = options ?? {};
	const done = new Deferred();
	const reader = readable.pipeThrough(createLineSplittingTransform()).getReader();
	const decoder = {
		values: [],
		hydrated: [],
		deferred: {},
		plugins
	};
	const decoded = await decodeInitial.call(decoder, reader);
	let donePromise = done.promise;
	if (decoded.done) done.resolve();
	else donePromise = decodeDeferred.call(decoder, reader).then(done.resolve).catch((reason) => {
		for (const deferred of Object.values(decoder.deferred)) deferred.reject(reason);
		done.reject(reason);
	});
	return {
		done: donePromise.then(() => reader.closed),
		value: decoded.value
	};
}
async function decodeInitial(reader) {
	const read = await reader.read();
	if (!read.value) throw new SyntaxError();
	let line;
	try {
		line = JSON.parse(read.value);
	} catch {
		throw new SyntaxError();
	}
	return {
		done: read.done,
		value: unflatten.call(this, line)
	};
}
async function decodeDeferred(reader) {
	let read = await reader.read();
	while (!read.done) {
		if (!read.value) continue;
		const line = read.value;
		switch (line[0]) {
			case "P": {
				const colonIndex = line.indexOf(":");
				const deferredId = Number(line.slice(1, colonIndex));
				const deferred = this.deferred[deferredId];
				if (!deferred) throw new Error(`Deferred ID ${deferredId} not found in stream`);
				const lineData = line.slice(colonIndex + 1);
				let jsonLine;
				try {
					jsonLine = JSON.parse(lineData);
				} catch {
					throw new SyntaxError();
				}
				const value = unflatten.call(this, jsonLine);
				deferred.resolve(value);
				break;
			}
			case "E": {
				const colonIndex = line.indexOf(":");
				const deferredId = Number(line.slice(1, colonIndex));
				const deferred = this.deferred[deferredId];
				if (!deferred) throw new Error(`Deferred ID ${deferredId} not found in stream`);
				const lineData = line.slice(colonIndex + 1);
				let jsonLine;
				try {
					jsonLine = JSON.parse(lineData);
				} catch {
					throw new SyntaxError();
				}
				const value = unflatten.call(this, jsonLine);
				deferred.reject(value);
				break;
			}
			default: throw new SyntaxError();
		}
		read = await reader.read();
	}
}
function encode(input, options) {
	const { onComplete, plugins, postPlugins, signal } = options ?? {};
	const encoder = {
		deferred: {},
		index: 0,
		indices: /* @__PURE__ */ new Map(),
		stringified: [],
		plugins,
		postPlugins,
		signal
	};
	const textEncoder = new TextEncoder();
	let lastSentIndex = 0;
	return new ReadableStream({ async start(controller) {
		const id = await flatten.call(encoder, input);
		if (Array.isArray(id)) throw new Error("This should never happen");
		if (id < 0) controller.enqueue(textEncoder.encode(`${id}\n`));
		else {
			controller.enqueue(textEncoder.encode(`[${encoder.stringified.join(",")}]\n`));
			lastSentIndex = encoder.stringified.length - 1;
		}
		const seenPromises = /* @__PURE__ */ new WeakSet();
		let processingChain = Promise.resolve();
		if (Object.keys(encoder.deferred).length) {
			let raceDone;
			const racePromise = new Promise((resolve, reject) => {
				raceDone = resolve;
				if (signal) {
					const rejectPromise = () => reject(signal.reason || /* @__PURE__ */ new Error("Signal was aborted."));
					if (signal.aborted) rejectPromise();
					else signal.addEventListener("abort", (event) => {
						rejectPromise();
					});
				}
			});
			while (Object.keys(encoder.deferred).length > 0) {
				for (const [deferredId, deferred] of Object.entries(encoder.deferred)) {
					if (seenPromises.has(deferred)) continue;
					seenPromises.add(encoder.deferred[Number(deferredId)] = Promise.race([racePromise, deferred]).then((resolved) => {
						processingChain = processingChain.then(async () => {
							const id = await flatten.call(encoder, resolved);
							if (Array.isArray(id)) {
								controller.enqueue(textEncoder.encode(`P${deferredId}:[["Z",${id[0]}]]\n`));
								encoder.index++;
								lastSentIndex++;
							} else if (id < 0) controller.enqueue(textEncoder.encode(`P${deferredId}:${id}\n`));
							else {
								const values = encoder.stringified.slice(lastSentIndex + 1).join(",");
								controller.enqueue(textEncoder.encode(`P${deferredId}:[${values}]\n`));
								lastSentIndex = encoder.stringified.length - 1;
							}
						});
						return processingChain;
					}, (reason) => {
						processingChain = processingChain.then(async () => {
							if (!reason || typeof reason !== "object" || !(reason instanceof Error)) reason = /* @__PURE__ */ new Error("An unknown error occurred");
							const id = await flatten.call(encoder, reason);
							if (Array.isArray(id)) {
								controller.enqueue(textEncoder.encode(`E${deferredId}:[["Z",${id[0]}]]\n`));
								encoder.index++;
								lastSentIndex++;
							} else if (id < 0) controller.enqueue(textEncoder.encode(`E${deferredId}:${id}\n`));
							else {
								const values = encoder.stringified.slice(lastSentIndex + 1).join(",");
								controller.enqueue(textEncoder.encode(`E${deferredId}:[${values}]\n`));
								lastSentIndex = encoder.stringified.length - 1;
							}
						});
						return processingChain;
					}).finally(() => {
						delete encoder.deferred[Number(deferredId)];
					}));
				}
				await Promise.race(Object.values(encoder.deferred));
			}
			raceDone();
		}
		await Promise.all(Object.values(encoder.deferred));
		await processingChain;
		controller.close();
		onComplete?.();
	} });
}
//#endregion
//#region node_modules/react-router/dist/production/lib/dom/ssr/single-fetch.js
/**
* react-router v8.3.1
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
var SingleFetchRedirectSymbol = Symbol("SingleFetchRedirect");
var NO_BODY_STATUS_CODES = /* @__PURE__ */ new Set([
	100,
	101,
	204,
	205
]);
function StreamTransfer({ context, identifier, reader, textDecoder, nonce }) {
	if (!context.renderMeta || !context.renderMeta.didRenderScripts) return null;
	if (!context.renderMeta.streamCache) context.renderMeta.streamCache = {};
	let { streamCache } = context.renderMeta;
	let promise = streamCache[identifier];
	if (!promise) promise = streamCache[identifier] = reader.read().then((result) => {
		streamCache[identifier].result = {
			done: result.done,
			value: textDecoder.decode(result.value, { stream: true })
		};
	}).catch((e) => {
		streamCache[identifier].error = e;
	});
	if (promise.error) throw promise.error;
	if (promise.result === void 0) throw promise;
	let { done, value } = promise.result;
	let scriptTag = value ? /* @__PURE__ */ import_react.createElement("script", {
		nonce,
		dangerouslySetInnerHTML: { __html: `window.__reactRouterContext.streamController.enqueue(${escapeHtml(JSON.stringify(value))});` }
	}) : null;
	if (done) return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, scriptTag, /* @__PURE__ */ import_react.createElement("script", {
		nonce,
		dangerouslySetInnerHTML: { __html: `window.__reactRouterContext.streamController.close();` }
	}));
	else return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, scriptTag, /* @__PURE__ */ import_react.createElement(import_react.Suspense, null, /* @__PURE__ */ import_react.createElement(StreamTransfer, {
		context,
		identifier: identifier + 1,
		reader,
		textDecoder,
		nonce
	})));
}
function singleFetchUrl(reqUrl, extension) {
	let url = typeof reqUrl === "string" ? new URL(reqUrl, typeof window === "undefined" ? "server://singlefetch/" : window.location.origin) : reqUrl;
	if (url.pathname.endsWith("/")) url.pathname = `${url.pathname}_.${extension}`;
	else url.pathname = `${url.pathname}.${extension}`;
	return url;
}
function decodeViaTurboStream(body, global) {
	return decode(body, { plugins: [(type, ...rest) => {
		if (type === "SanitizedError") {
			let [name, message, stack] = rest;
			let Constructor = Error;
			if (name && SUPPORTED_ERROR_TYPES.includes(name) && name in global && typeof global[name] === "function") Constructor = global[name];
			let error = new Constructor(message);
			error.stack = stack;
			return { value: error };
		}
		if (type === "ErrorResponse") {
			let [data, status, statusText] = rest;
			return { value: new ErrorResponseImpl(status, statusText, data) };
		}
		if (type === "SingleFetchRedirect") return { value: { [SingleFetchRedirectSymbol]: rest[0] } };
		if (type === "SingleFetchClassInstance") return { value: rest[0] };
		if (type === "SingleFetchFallback") return { value: void 0 };
	}] });
}
//#endregion
//#region node_modules/react-router/dist/production/lib/dom/ssr/fog-of-war.js
/**
* react-router v8.3.1
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
function isFogOfWarEnabled(routeDiscovery, ssr) {
	return routeDiscovery.mode === "lazy" && ssr === true;
}
function getPartialManifest({ sri, ...manifest }, router) {
	let routeIds = new Set(router.state.matches.map((m) => m.route.id));
	let segments = router.state.location.pathname.split("/").filter(Boolean);
	let paths = ["/"];
	segments.pop();
	while (segments.length > 0) {
		paths.push(`/${segments.join("/")}`);
		segments.pop();
	}
	paths.forEach((path) => {
		let matches = matchRoutesImpl(router.routes, path, router.basename || "/", false, router.branches);
		if (matches) matches.forEach((m) => routeIds.add(m.route.id));
	});
	let initialRoutes = [...routeIds].reduce((acc, id) => Object.assign(acc, { [id]: manifest.routes[id] }), {});
	return {
		...manifest,
		routes: initialRoutes,
		sri: sri ? true : void 0
	};
}
function getManifestPath(_manifestPath, basename) {
	let manifestPath = _manifestPath || "/__manifest";
	return basename == null ? manifestPath : joinPaths([basename, manifestPath]);
}
//#endregion
//#region app/lib/phone.ts
var PHONE$1 = /^\+?[\d(][\d\s()-]{7,17}\d$/;
var HANDLE = /^@[A-Za-z0-9_]{4,32}$/;
var isValidContact = (value) => {
	const v = value.trim();
	return HANDLE.test(v) || PHONE$1.test(v);
};
/** Ищет телефон или @ник внутри свободного текста (чат, не форма) — первое совпадение или null. */
function extractContact(text) {
	const phone = text.match(/\+?[\d(][\d\s()-]{7,17}\d/)?.[0];
	if (phone && isValidContact(phone)) return phone.trim();
	return text.match(/@[A-Za-z0-9_]{4,32}/)?.[0] ?? null;
}
//#endregion
//#region app/content/company.ts
var STEPS = [
	{
		n: "01",
		title: "Выбор участка",
		text: "Подбираем 3–5 вариантов под задачу, бюджет и будущую логистику. Оцениваем рельеф, подъезд, сети и окружение.",
		result: "Сравнительная таблица",
		term: "2–4 недели"
	},
	{
		n: "02",
		title: "Юридическая проверка",
		text: "Проверяем собственность, обременения, зонирование, сети и параметры застройки. Запрашиваем выписки и градостроительные условия.",
		result: "Заключение и карта рисков",
		term: "3 рабочих дня",
		cta: ["proverka-uchastka", "Проверить участок"]
	},
	{
		n: "03",
		title: "Проектирование",
		text: "Готовим архитектурную концепцию, рабочий проект и инженерные решения. На этом этапе появляется детальная смета.",
		result: "Полный комплект проекта",
		term: "2–3 месяца"
	},
	{
		n: "04",
		title: "Согласование",
		text: "Формируем пакет документов, подаём в мэрию и сопровождаем согласования до получения разрешения.",
		result: "Разрешение на строительство",
		term: "1–3 месяца"
	},
	{
		n: "05",
		title: "Строительство",
		text: "Монолитный каркас, ограждающие конструкции, фасад и инженерные сети. Еженедельные отчёты и поэтапная приёмка. Срок зависит от объекта: частный дом — 8–14 месяцев, склад — 6–12, жилой корпус — 12–20.",
		result: "Объект под отделку",
		term: "6–20 месяцев"
	},
	{
		n: "06",
		title: "Сдача объекта",
		text: "Готовим исполнительную документацию, проводим итоговую приёмку и передаём ключи.",
		result: "Ключи и документы",
		term: "2 недели"
	}
];
var PARTICIPATION = [
	"Формулируете задачу и бюджет",
	"Получаете заключение и принимаете решение",
	"Согласовываете концепцию и смету",
	"Подписываете доверенность, остальное делает ONEZA",
	"Принимаете этапы, смотрите отчёты",
	"Подписываете акт и получаете ключи"
];
var PROMISE = [
	["Фиксируем<br>весь объём", "Полную смету, срок сдачи, состав работ, материалы и конкретные марки."],
	["Отвечаем<br>ресурсами", "Своя техника, опалубка и бригады. Прямые поставки и детальный проект до старта."],
	["Изменения —<br>прозрачно", "Если задача меняется, считаем только разницу и согласуем её до начала работ."]
];
var CONTROL = [
	[
		"document",
		"По нормам",
		"Проектируем и строим по действующим нормам Грузии."
	],
	[
		"inspect",
		"Технадзор",
		"Независимый инженер проверяет каждый критический этап."
	],
	[
		"check",
		"Приёмка",
		"Закрываем этап актом вместе с представителем заказчика."
	],
	[
		"photo",
		"Отчёты",
		"Фото и видео с площадки приходят каждую неделю."
	],
	[
		"monitor",
		"Онлайн-доступ",
		"Ход работ, документы и смета — в личном кабинете."
	]
];
var FACTS = [
	["12", "лет<br>в Грузии"],
	["180k", "м²<br>построено"],
	["40", "объектов<br>сдано"]
];
var DIRECTIONS = [
	{
		cat: "residential",
		slug: "zhilye-korpusa",
		who: "Инвесторам и девелоперам",
		title: "Жилые корпуса"
	},
	{
		cat: "industrial",
		slug: "proizvodstvo-i-sklady",
		who: "Владельцам бизнеса",
		title: "Производство<br>и склады"
	},
	{
		cat: "private",
		slug: "chastnye-doma",
		who: "Частным заказчикам",
		title: "Дома<br>от 160 м²"
	}
];
var RESPONSIBILITIES = [
	[
		"01",
		"Управление проектом",
		"Единая точка ответственности за решения, график и коммуникацию."
	],
	[
		"02",
		"Инженерный контроль",
		"Проверка конструктивных решений и критических этапов на площадке."
	],
	[
		"03",
		"Проектная координация",
		"Связка архитектуры, конструкций, инженерных систем и сметы."
	],
	[
		"04",
		"Снабжение",
		"Планирование поставок, контроль спецификаций и входная проверка материалов."
	]
];
var CHECK = [
	["Собственность", "Кто владелец по выписке из Публичного реестра, нет ли споров, арестов и совладельцев."],
	["Обременения", "Ипотека, залог, сервитуты, аренда, запреты на отчуждение."],
	["Категория земли", "Сельскохозяйственная или несельскохозяйственная. Для иностранцев и для строительства это критично."],
	["Функциональная зона", "Зона по генплану Тбилиси и разрешённые виды использования."],
	["Коэффициенты застройки", "К-1, К-2, К-3: сколько площади и этажей реально разрешат построить."],
	["Красные линии и отступы", "Границы улиц, охранные зоны, минимальные отступы от соседей."],
	["Границы участка", "Совпадают ли кадастровые границы с забором и фактом на местности."],
	["Подъезд", "Есть ли юридически оформленный доступ к дороге, а не только тропа через соседа."],
	["Электричество", "Ближайшая точка подключения, доступная мощность, стоимость подключения."],
	["Вода и канализация", "Центральные сети, скважина, септик: что разрешено и во что обойдётся."],
	["Газ", "Наличие сети рядом и условия подключения."],
	["Рельеф и геология", "Уклон, подпорные стены, грунты и грунтовые воды: влияет на фундамент и смету."],
	["Оползни и паводки", "Не попадает ли участок в опасные зоны по картам Национального агентства окружающей среды."],
	["История разрешений", "Выдавались ли ранее разрешения, нет ли незаконных построек и предписаний о сносе."],
	["Соседи и планы города", "Что строится рядом, нет ли планов по дорогам и изъятию."]
];
//#endregion
//#region app/content/pages/misc.ts
/** Главная и «Услуги»: подпись к каждому из трёх направлений. */
var HOME_DIRECTION_DETAILS = [
	"Финмодель защищена сроком в договоре и ответственностью за результат.",
	"Проектируем этапы так, чтобы быстрее запустить мощности.",
	"Итоговая цена известна до выхода техники на площадку."
];
var USLUGI_DIRECTION_DETAILS = [
	"Многоквартирные дома и апарт-комплексы от 1 000 м².",
	"Цеха, склады, логистические центры с поэтапным вводом.",
	"Монолитные дома и резиденции под отделку."
];
var HOME_STATS = [
	{
		value: "12",
		count: 12,
		label: "лет<br>в Грузии"
	},
	{
		value: "180 000",
		count: 18e4,
		space: true,
		label: "м²<br>построено"
	},
	{
		value: "40",
		count: 40,
		label: "объектов<br>сдано"
	}
];
var CENA_NAV = [
	["how", "Как работает"],
	["prices", "Цены"],
	["contract", "Что в договоре"],
	["payment", "Оплата"],
	["warranty", "Гарантия"],
	["why", "Почему можем"],
	["changes", "Если что-то меняется"],
	["examples", "Примеры"]
];
var CENA_PRICES = [
	["Монолитный каркас", "от $140 / м²"],
	["Коробка с фасадом и окнами", "от $250 / м²"],
	["Под отделку, с инженерными сетями", "от $300 / м²"]
];
/**
* FAQ на /cena — ответы на то, как запрос звучит в поиске: «сколько стоит
* построить дом в Грузии» (Wordstat: «построить дом в Грузии» 66). Цифры
* только те, что уже есть на странице: CENA_PRICES, аванс и акты этапов, 10 лет
* (закон 6 — факт не должен расходиться сам с собой). ONEZ-51.
*/
var CENA_FAQ = [
	["Сколько стоит построить дом в Грузии?", "Ориентир на 2026 год: монолитный каркас — от $140 / м², коробка с фасадом и окнами — от $250 / м², под отделку с инженерными сетями — от $300 / м². Точная сумма считается по рабочему проекту и фиксируется в договоре: она не меняется, пока вы не меняете задание."],
	["От чего зависит итоговая цена?", "От площади и этажности, сложности рельефа и фундамента, состава инженерных сетей и выбранных материалов. Поэтому смета собирается после проекта, а не по телефону: цифра, названная до проекта, всегда оказывается неполной."],
	["Как платить за строительство?", "Аванс — 100% стоимости материалов и 15% стоимости работ: на закупку и мобилизацию. Оставшиеся 85% работ оплачиваются по актам принятых этапов."],
	["Что будет, если материалы подорожают?", "Это наш риск. Цена в договоре не меняется из-за роста цен на материалы — только если вы сами меняете задание."]
];
/**
* Сравнительная таблица стадий на /cena (docs/SEO.md, §2: таблицу нейросети
* извлекают чаще всего). Только факты страницы: стадии накопительные, как их
* названия, цены — из CENA_PRICES.
*/
var CENA_TABLE = {
	head: [
		"Стадия",
		"Каркас",
		"Фасад и окна",
		"Инженерные сети",
		"Ориентир цены"
	],
	rows: CENA_PRICES.map(([stage, price], i) => [
		stage,
		...[
			0,
			1,
			2
		].map((j) => j <= i ? "входит" : "—"),
		price
	])
};
var CENA_PAYMENT = [
	"100% материалов авансом",
	"15% работ до выхода на площадку",
	"85% работ — по актам этапов",
	"Акт подписывается с технадзором"
];
var CENA_CONTRACT = [
	["Смета", "Полный перечень работ и материалов с объёмами и ценами"],
	["Марки", "Конкретные марки бетона, арматуры, окон, фасадных систем"],
	["Срок", "Дата сдачи и промежуточные вехи по этапам"],
	["Ответственность", "Неустойка за срыв срока по вине подрядчика"],
	["Оплата", "100% материалов и 15% работ авансом, остальное по актам этапов"],
	["Гарантия", "10 лет на конструктив"]
];
var CENA_WHY = [
	[
		"crane",
		"Своя техника",
		"Краны, опалубка, бетононасосы — не зависим от аренды."
	],
	[
		"team",
		"Свои бригады",
		"Постоянный штат монолитчиков и инженеров."
	],
	[
		"truck",
		"Прямые поставки",
		"Договоры с заводами на весь объём объекта."
	],
	[
		"blueprint",
		"Детальный проект",
		"Считаем всё до старта, а не по ходу стройки."
	]
];
var CENA_EXAMPLES = {
	first: ["Жилой корпус, Сабуртало", "Цена в договоре 2022 года. За 16 месяцев стройки арматура подорожала на 30%. Заказчик заплатил ровно сумму договора."],
	second: ["Частная резиденция, Лиси", "Заказчик добавил бассейн на этапе строительства. Посчитали разницу, подписали допсоглашение, срок сдвинули на 3 недели. Остальная смета не изменилась."]
};
var COMPANY_RESOURCES = [
	[
		"crane",
		"Техника",
		"Башенные краны, бетононасосы, экскаваторы, автопарк."
	],
	[
		"formwork",
		"Опалубка",
		"Собственный парк опалубки на 6 000 м² перекрытий одновременно."
	],
	[
		"team",
		"Бригады",
		"120 человек в штате: монолитчики, арматурщики, инженеры."
	],
	[
		"blueprint",
		"Техотдел",
		"Проектировщики, сметчики, технадзор и юристы по земле."
	]
];
/** BLUF /o-kompanii (правило 12): первый абзац — кто это, второй — условия работы. Цифры ONEZ-03 (м², объекты, штат, опалубка) в текст не идут. */
var COMPANY_LEAD = "ONEZA Construction — генподрядчик с собственной техникой, опалубкой, бригадами и техническим отделом. Поэтому можем отвечать за цену и срок.";
var COMPANY_MORE = "Компания работает в Грузии 12 лет: монолитные жилые корпуса от 1 000 м², производственные площадки и склады, частные дома от 160 м². Цена и срок фиксируются в договоре до начала работ, оплата — 100% материалов и 15% работ авансом, дальше по актам принятых этапов, гарантия на конструктив — 10 лет. Отделочные работы ONEZA не выполняет: объект передаётся под отделку с полным комплектом документов.";
/** Секция команды на /o-kompanii: шесть руководителей, полный состав — на /komanda. */
/** Философия: зачем и как ONEZA строит. Факты — только подтверждённые (цена в договоре, оплата по актам, свой штат, гарантия 10 лет). */
var COMPANY_PHILOSOPHY = {
	intro: "ONEZA Construction строит монолит для тех, кому важен предсказуемый результат: здание, которое переживёт владельца, и стройка, в которой цена и срок известны заранее. Монолитный каркас выбран не ради технологии, а ради сейсмики Грузии, свободных планировок и долговечности объекта.",
	items: [
		["Зачем строим", "Заказчик получает актив, а не стройку: объект под отделку с документами, гарантией 10 лет на конструктив и понятной себестоимостью."],
		["Как считаем", "Смета и срок появляются до выхода техники и становятся приложением к договору. Цена не меняется из-за курса, материалов или ошибок подрядчика."],
		["Как работаем", "Свои бригады, опалубка и техника вместо сборных подрядов: собственная производительность известна, поэтому график держится."],
		["Как отчитываемся", "Каждый этап закрывается актом с технадзором, и только после этого наступает платёж. Фото и видео с площадки приходят еженедельно."]
	]
};
var COMPANY_TEAM = {
	eyebrow: "Команда",
	title: "Кто ведёт<br><em>ваш объект?</em>",
	intro: "Шесть руководителей направлений: у каждого участка работы — от договора до приёмки — есть ответственный, к которому можно обратиться напрямую."
};
/** FAQ о компании (правило 6): только подтверждённые факты — в FAQPage уходит разметкой. */
var COMPANY_FAQ = [
	["Сколько лет ONEZA работает в Грузии?", "12 лет. За это время компания перешла от частных домов к жилым корпусам и производственным площадкам, но конструктив остался один — монолитный железобетон."],
	["Вы строите сами или отдаёте на субподряд?", "Сами. У компании своя техника, своя опалубка, бригады монолитчиков и арматурщиков в штате и собственный технический отдел. Поэтому темп работ не зависит от чужого графика."],
	["Какую гарантию даёт компания?", "10 лет на конструктив. Это условие договора, а не обещание на словах: рядом с ним зафиксированы цена, дата сдачи и неустойка за просрочку по нашей вине."],
	["Как устроена оплата?", "Аванс — 100% стоимости материалов и 15% стоимости работ. Материалы закупаются сразу на весь объём, поэтому их цена зафиксирована; оставшиеся 85% работ оплачиваются по актам принятых этапов."],
	["Делаете ли вы отделку?", "Нет. ONEZA передаёт объект под отделку — с коробкой, кровлей, фасадом, окнами и инженерными сетями. Отделочный ремонт заказывается отдельно."]
];
/** BLUF /proverka-uchastka (правило 12): первый абзац — ответ, второй — условия как в CHECK_TERMS. */
var CHECK_LEAD = "ONEZA Construction проверяет участок до покупки по всей Грузии: 15 пунктов — собственность и обременения, категория земли, коэффициенты застройки, подъезд, сети, рельеф и геология. Письменное заключение в PDF приходит через 3 рабочих дня после получения кадастрового номера. Тем, кто строит с нами, проверка достаётся бесплатно.";
var CHECK_MORE = "Условие простое: заключаете с нами договор на строительство — проверка участка, его подбор и юридическое сопровождение сделки не стоят вам ничего. Строите не с ONEZA — эта работа оплачивается отдельной услугой, сумму называем заранее, до её начала, а заключение всё равно остаётся у вас. Строим по всей Грузии, поэтому проверяем участки не только в Тбилиси. Иностранец может купить несельскохозяйственную землю, сельскохозяйственную — нет, поэтому категорию проверяем до сделки. В заключении — риски, реальные параметры застройки и предварительная вилка стоимости дома под отделку. Проверку ONEZA делает сам: юрист запрашивает выписки и градостроительные условия, инженер осматривает участок, подъезд и сети.";
/** Заголовок таблицы условий проверки (правило 15): те же данные, что в CHECK_TERMS. */
var CHECK_TERMS_HEAD = ["Условие", "Как у ONEZA"];
/** Блок для покупателей из-за рубежа на /proverka-uchastka (ONEZ-15): только факты, уже опубликованные на сайте. */
var CHECK_FOREIGN = [
	["Сельхозземля", "Иностранец и компания с иностранным контролем не могут купить сельскохозяйственную землю. Категорию участка проверяем до сделки."],
	["Доверенность", "Если приехать нельзя, сделку и разрешения ведут по доверенности, выданной в консульстве Грузии."],
	["Удалённая приёмка", "Еженедельные фото и видео с площадки, акты этапов подписывает независимый технадзор вместе с вами."],
	["Оплата по этапам", "Аванс на материалы и 15% работ, остальные работы — после акта приёмки этапа."]
];
/**
* FAQ на /proverka-uchastka — под интент «купить участок в Грузии под
* строительство» (Wordstat: «купить участок в Грузии» 239). Факты — те же,
* что уже на странице: CHECK_LEAD, CHECK_FOREIGN, CHECK_PAIN. ONEZ-51.
*/
var CHECK_FAQ = [
	["Как купить участок в Грузии под строительство?", "До сделки проверьте участок: собственность и обременения, категорию земли, коэффициенты застройки, подъезд и сети. Мы делаем такую проверку по 15 пунктам по всей Грузии и выдаём письменное заключение за 3 рабочих дня: тем, кто строит с нами, она достаётся бесплатно, без договора на строительство — оплачивается отдельной услугой."],
	["Может ли иностранец купить землю в Грузии?", "Землю несельскохозяйственного назначения и любое здание — да, в том числе на компанию со стопроцентным иностранным участием. Сельскохозяйственную землю иностранец и компания с иностранным контролем купить не могут, поэтому категорию участка мы проверяем до сделки."],
	["Что проверяете в участке?", "Собственность и обременения, категорию земли, коэффициенты застройки и разрешённую площадь, подъезд, рельеф и грунты, наличие и мощность сетей. В заключении — риски, реальные параметры застройки и предварительная оценка стоимости дома."],
	["Можно ли оформить покупку без приезда?", "Да, по доверенности, выданной в консульстве Грузии. Стройку в этом случае ведём с еженедельными фото и видео с площадки, акты этапов подписывает независимый технадзор."]
];
var CHECK_PAIN = {
	first: ["Как бывает", "Участок куплен, проект заказан, и выясняется: земля сельскохозяйственная, подъезда юридически нет, а по коэффициентам разрешено вдвое меньше площади. Перевод категории и согласования съедают год и десятки тысяч."],
	second: ["Как у нас", "Проверяем участок до сделки. Вы получаете заключение с рисками, реальными параметрами застройки и предварительной оценкой стоимости дома. Решение о покупке принимаете с открытыми глазами."]
};
var CHECK_HOW = [
	["Вы отправляете кадастровый номер", "Через форму ниже или в WhatsApp. Если участок ещё выбираете, можно отправить 2–3 варианта."],
	["Мы проверяем документы и выезжаем", "Юрист запрашивает выписки и градостроительные условия, инженер осматривает участок, подъезд и сети."],
	["Вы получаете заключение в PDF", "Статус по каждому из 15 пунктов, риски, реальные параметры застройки и предварительная вилка стоимости дома под отделку."]
];
var CHECK_TERMS = [
	["Стоимость", "Бесплатно, если строите с нами. Без договора на строительство — отдельной услугой, сумму называем заранее"],
	["Срок", "3 рабочих дня после получения кадастрового номера"],
	["Формат", "PDF-заключение и разбор по телефону или на встрече"],
	["Обязательства", "Никаких. Заключение остаётся у вас в любом случае, в том числе если решите не строить"],
	["География", "Вся Грузия: Тбилиси и пригороды, Мцхета, Рустави, Батуми и побережье, Кахетия, горные курорты"],
	["Сопровождение сделки", "Подбор участка, перевод категории земли, оформление подъезда и договоры с сетями — бесплатно при договоре на строительство"]
];
/** BLUF и сводная таблица /process (правила 12 и 15): цифры — из STEPS в content/company.ts. */
var PROCESS_HERO = {
	lead: "Строительство с ONEZA Construction проходит шесть этапов: выбор участка — 2–4 недели, юридическая проверка — 3 рабочих дня, проектирование — 2–3 месяца, согласование — 1–3 месяца, строительство — 6–20 месяцев, сдача объекта — 2 недели. Каждый этап закрывается актом и результатом, который остаётся у заказчика.",
	more: "Срок стройки зависит от объекта: частный дом — 8–14 месяцев, склад — 6–12, жилой корпус — 12–20. Детальная смета появляется на этапе проектирования и становится приложением к договору. Заказчик получает еженедельные фото и видео с площадки и принимает каждый этап вместе с независимым технадзором. Отделочный ремонт ONEZA не выполняет — объект передаётся под отделку. Разрешение на строительство ONEZA получает сам — по доверенности заказчика.",
	eyebrow: "Сводка",
	title: "Сколько длится<br><em>каждый этап?</em>",
	head: [
		"Этап",
		"Результат",
		"Срок"
	]
};
//#endregion
//#region app/content/services.ts
var SERVICES = [
	{
		kind: "service",
		slug: "zhilye-korpusa",
		seoDescription: "Строим в Тбилиси монолитные жилые корпуса и апарт-комплексы от 1 000 м² за 12–20 месяцев. Каркас от $140 / м², под отделку с сетями от $300.",
		modified: "2026-09-22",
		h2: {
			pain: "Что будет,<br><em>если стройка сорвёт срок?</em>",
			spec: "Какие жилые дома<br><em>строит ONEZA?</em>",
			features: "Что учитываем<br><em>в проекте жилого корпуса?</em>",
			price: "Сколько стоит<br><em>жилой корпус за м²?</em>"
		},
		name: "Жилые корпуса",
		card: "Многоквартирные дома и апарт-комплексы от 1 000 м².",
		objtype: "Жилой корпус",
		cat: "residential",
		eyebrow: "Инвесторам и девелоперам",
		title: "Жилые корпуса<br><em>и многоквартирные дома</em>",
		prices: true,
		lead: `ONEZA Construction строит в Тбилиси монолитные жилые корпуса и апарт-комплексы от 1 000 м² и до 20 этажей за 12–20 месяцев. Ориентир цены 2026 года: монолитный каркас — ${CENA_PRICES[0][1]}, готовность под отделку с инженерными сетями — ${CENA_PRICES[2][1]}. Срок сдачи и цена фиксируются в договоре с ответственностью подрядчика.`,
		more: "Крупный жилой комплекс ONEZA делит на очереди, чтобы продажи начались раньше. Корпус передаётся под отделку — с фасадом, сетями, паркингом и полным пакетом документов для ввода в эксплуатацию. Оплата: 100% материалов и 15% работ авансом, дальше по актам принятых этапов; гарантия на конструктив — 10 лет. Экономику проекта считаем ещё на этапе выбора участка.",
		pain: "Срыв сроков ломает финмодель: растут проценты по кредиту, откладываются продажи, теряется доверие дольщиков.",
		answer: "Срок сдачи и цена зафиксированы в договоре с ответственностью подрядчика. Своя техника и бригады позволяют держать темп без зависимости от субподряда.",
		spec: [
			["Формат", "Жилые корпуса, апарт-комплексы, ЖК из нескольких очередей"],
			["Площадь", "от 1 000 м²"],
			["Этажность", "до 20 этажей"],
			["Конструктив", "Монолитный железобетонный каркас"],
			["Готовность", "Под отделку, с сетями и фасадом"],
			["Срок", "12–20 месяцев в зависимости от объёма"]
		],
		features: [
			[
				"money",
				"Финмодель",
				"Помогаем посчитать экономику проекта ещё на этапе выбора участка."
			],
			[
				"layers",
				"Очереди",
				"Разбиваем крупные ЖК на очереди, чтобы начать продажи раньше."
			],
			[
				"building",
				"Паркинг",
				"Подземные и наземные паркинги в составе проекта."
			],
			[
				"document",
				"Документы",
				"Полный пакет для ввода в эксплуатацию и регистрации."
			]
		],
		faq: [
			["Сколько стоит построить жилой корпус в Тбилиси?", "Ориентир 2026 года: монолитный каркас — от $140 / м², коробка с фасадом и окнами — от $250, готовность под отделку с инженерными сетями — от $300. Точная сумма считается по рабочему проекту и фиксируется в договоре до выхода техники на площадку."],
			["Сколько занимает строительство корпуса?", "От 12 до 20 месяцев в зависимости от объёма и этажности. Срок привязан к графику этапов, по которому идут платежи, поэтому отставание видно не в конце стройки, а на ближайшем акте приёмки."],
			["Можно ли строить очередями?", "Да. Крупный комплекс разбивается на очереди так, чтобы первая начала приносить доход, пока достраивается вторая. Если это важно для вашей финмодели, очерёдность закладывается ещё на этапе проектирования."],
			["Кто занимается разрешением на строительство?", "Мы. Проверяем коэффициенты застройки и градостроительные условия, формируем пакет документов, подаём в мэрию и сопровождаем согласование до получения разрешения. Обычно это занимает от одного до трёх месяцев."]
		]
	},
	{
		kind: "service",
		slug: "proizvodstvo-i-sklady",
		seoDescription: "Цеха, склады класса А и B и логистические центры от 1 000 м² в Грузии за 6–12 месяцев. Поэтапный ввод, срок каждого этапа зафиксирован в договоре.",
		modified: "2026-09-22",
		h2: {
			pain: "Как запустить производство<br><em>до конца стройки?</em>",
			spec: "Какие склады и цеха<br><em>строит ONEZA?</em>",
			features: "Что учитываем<br><em>при строительстве склада?</em>",
			price: "Сколько стоит<br><em>склад за м²?</em>"
		},
		name: "Производство и склады",
		card: "Цеха, склады, логистические центры с поэтапным вводом.",
		objtype: "Производство или склад",
		cat: "industrial",
		eyebrow: "Владельцам бизнеса",
		title: "Производственные<br><em>и складские площадки</em>",
		prices: true,
		lead: `ONEZA Construction строит в Грузии цеха, склады классов А и B и логистические центры от 1 000 м² и высотой до 14 м за 6–12 месяцев. Ориентир цены 2026 года: монолитный каркас — ${CENA_PRICES[0][1]}, готовность под отделку с инженерными сетями — ${CENA_PRICES[2][1]}. Срок каждого этапа зафиксирован в договоре.`,
		more: "Ввод идёт очередями: первая очередь работает, пока строится вторая. Планировку ONEZA ведёт от технологической схемы производства, полы и перекрытия считает под реальное оборудование и технику. Объект передаётся под оборудование — с полами, рампами, электроснабжением, вентиляцией и очистными. Оплата: 100% материалов и 15% работ авансом, дальше по актам принятых этапов.",
		pain: "Каждый месяц простоя — недополученная выручка. Затянутая стройка откладывает запуск линии и срывает контракты.",
		answer: "Поэтапный ввод: первая очередь работает, пока строится вторая. Срок каждого этапа зафиксирован в договоре.",
		spec: [
			["Формат", "Цеха, склады класса А и B, логистические центры, энергоблоки"],
			["Площадь", "от 1 000 м²"],
			["Высота", "до 14 м, крановые пути"],
			["Конструктив", "Монолитный или сборно-монолитный каркас"],
			["Готовность", "Под оборудование: полы, сети, рампы"],
			["Срок", "6–12 месяцев"]
		],
		features: [
			[
				"blueprint",
				"Технология",
				"Планировку ведём от технологической схемы производства."
			],
			[
				"truck",
				"Нагрузки",
				"Полы и перекрытия под реальное оборудование и технику."
			],
			[
				"monitor",
				"Энергия",
				"Электроснабжение, вентиляция и очистные в составе проекта."
			],
			[
				"check",
				"Запуск",
				"Помогаем с вводом в эксплуатацию и подключением сетей."
			]
		],
		faq: [
			["Сколько стоит построить склад за м²?", "Ориентир 2026 года: монолитный каркас — от $140 / м², готовность под отделку с инженерными сетями — от $300. На стоимость влияют высота, пролёты, нагрузка на пол и состав инженерии; точная цифра появляется после рабочего проекта."],
			["За какой срок строится склад или цех?", "От 6 до 12 месяцев. Срок каждого этапа зафиксирован в договоре, а объект передаётся под оборудование: с полами, рампами, электроснабжением, вентиляцией и очистными."],
			["Можно ли запустить первую очередь, пока строится вторая?", "Да, поэтапный ввод — обычный режим для производства и складов. Первая очередь работает и приносит выручку, пока рядом идёт стройка второй."],
			["Кто занимается подключением к сетям?", "Мы ведём подключение сами: электроснабжение, вода, вентиляция и очистные входят в состав проекта, а не появляются отдельным счётом в конце. Помогаем и с вводом объекта в эксплуатацию."]
		]
	},
	{
		kind: "service",
		slug: "chastnye-doma",
		seoDescription: "Монолитные дома от 160 м² в Тбилиси за 8–14 месяцев: каркас от $140 / м², под отделку с сетями от $300. Смета по проекту, цена — в договоре.",
		modified: "2026-09-22",
		h2: {
			pain: "Почему смета дома<br><em>растёт во время стройки?</em>",
			spec: "Какой дом строим<br><em>и за какой срок?</em>",
			features: "Что учитываем<br><em>при строительстве дома?</em>",
			price: "Сколько стоит<br><em>дом за м²?</em>"
		},
		seoTitle: "Строительство дома в Тбилиси",
		name: "Частные дома",
		card: "Монолитные дома и резиденции под отделку.",
		objtype: "Частный дом",
		cat: "private",
		eyebrow: "Частным заказчикам",
		title: "Частные дома<br><em>от 160 м²</em>",
		prices: true,
		lead: `ONEZA Construction строит в Тбилиси монолитные частные дома от 160 м² в 1–3 этажа за 8–14 месяцев. Ориентир цены 2026 года: каркас — ${CENA_PRICES[0][1]}, коробка с фасадом и окнами — ${CENA_PRICES[1][1]}, под отделку с инженерными сетями — ${CENA_PRICES[2][1]}. Цена фиксируется в договоре до выхода техники на площадку.`,
		more: "Смета считается по детальному проекту и не меняется, пока не меняется задача. Дом передаётся под отделку: коробка, кровля, окна, фасад и инженерные сети. Оплата: 100% материалов и 15% работ авансом, дальше по актам принятых этапов, гарантия на конструктив — 10 лет. Участок, в том числе на склоне, ONEZA проверяет до покупки.",
		pain: "У большинства подрядчиков смета вырастает вдвое к концу стройки, а срок сдвигается на год.",
		answer: "Детальный проект и смета до начала работ. Цена в договоре не меняется, если не меняется задача.",
		spec: [
			["Формат", "Дома, резиденции, гостевые дома, бассейны"],
			["Площадь", "от 160 м²"],
			["Этажность", "1–3 этажа, цоколь"],
			["Конструктив", "Монолитный каркас, кирпич или блок"],
			["Готовность", "Под отделку: коробка, кровля, окна, фасад, сети"],
			["Срок", "8–14 месяцев"]
		],
		features: [
			[
				"pin",
				"Участок",
				"Подбираем и проверяем участок, в том числе на склонах."
			],
			[
				"blueprint",
				"Проект",
				"Индивидуальный проект под ваш образ жизни и рельеф."
			],
			[
				"photo",
				"Контроль",
				"Еженедельные фото и видео, доступ на площадку в любой день."
			],
			[
				"shield",
				"Гарантия",
				"Гарантия 10 лет на конструктив с ответственностью в договоре."
			]
		],
		faq: [
			["Сколько стоит построить дом в Тбилиси?", "Ориентир 2026 года: каркас — от $140 / м², коробка с фасадом и окнами — от $250, под отделку с инженерными сетями — от $300. Смета считается по детальному проекту и не меняется, пока не меняется задача."],
			["Сколько строится дом от 160 м²?", "От 8 до 14 месяцев в зависимости от площади, рельефа участка и сложности фундамента. Срок и цена фиксируются в договоре до выхода техники на площадку."],
			["Что входит в готовность под отделку?", "Монолитный каркас, стены, кровля, окна, фасад и инженерные сети внутри дома. Отделочные работы — штукатурку, плитку, покраску — ONEZA не выполняет, они заказываются отдельно."],
			["Проверяете ли участок до покупки?", "Да. Проверка по 15 пунктам — собственность, обременения, категория земли, коэффициенты застройки, подъезд, сети и геология. Письменное заключение приходит за 3 рабочих дня и достаётся бесплатно тем, кто строит с ONEZA."]
		]
	}
];
var MONOLITH = [{
	kind: "monolith",
	slug: "podpornye-steny",
	seoDescription: "Подпорные стены на склоне в Тбилиси: монолит по расчёту грунта, с дренажом и гидроизоляцией. Цена после выезда и изысканий, фиксируется в договоре.",
	modified: "2026-09-22",
	h2: {
		pain: "Почему подпорные стены<br><em>трескаются и сползают?</em>",
		spec: "Что входит<br><em>в подпорную стену?</em>",
		features: "Как строим<br><em>стену на склоне?</em>"
	},
	seoTitle: "Подпорная стена на склоне в Тбилиси",
	objtype: "Подпорная стена",
	hero: "private",
	eyebrow: "Участки на склонах",
	name: "Подпорные стены",
	title: "Подпорные стены<br><em>и укрепление склонов</em>",
	card: "Железобетонные стены с расчётом грунта, дренажом и контролем армирования.",
	lead: "Подпорная стена на склоне в Тбилиси — монолитный железобетон по расчёту грунта: уголковые и контрфорсные стены, стены на сваях, с пристенным дренажом и гидроизоляцией. Цену ONEZA называет после выезда на участок и изысканий и фиксирует в договоре до начала работ: она зависит от высоты, длины стены, грунта и подъезда техники.",
	more: "Без геологии и расчёта ONEZA стены не строит: толщину, армирование и фундамент считает инженер-конструктор. Армирование принимается до бетонирования, каждый этап снимается на фото и видео. Заказчик получает стену с исполнительной документацией и актами скрытых работ. На участке со склоном стены, фундамент и каркас дома проектируются вместе, чтобы работать как одна система.",
	pain: "Стена без расчёта и дренажа трескается и сползает после первых дождей: вода за стеной создаёт давление, которого не было в смете.",
	answer: "Начинаем с геологии и расчёта нагрузок, закладываем дренаж и гидроизоляцию в проект. Цена и срок фиксируются в договоре до начала работ.",
	spec: [
		["Назначение", "Удержание грунта на склоне, террасы, въезды и площадки"],
		["Конструктив", "Монолитный железобетон: уголковые и контрфорсные стены, стены на сваях"],
		["Высота", "По расчёту: от невысоких террас до стен в несколько метров"],
		["Дренаж", "Пристенный дренаж, отвод воды, гидроизоляция"],
		["Основание", "Проверка грунтов и грунтовых вод до проектирования"],
		["Результат", "Стена с исполнительной документацией и актами скрытых работ"]
	],
	features: [
		[
			"layers",
			"Геология",
			"Изыскания грунта и воды: без них размеры стены не посчитать."
		],
		[
			"blueprint",
			"Расчёт",
			"Толщину, армирование и фундамент стены считает инженер-конструктор."
		],
		[
			"drop",
			"Дренаж",
			"Отводим воду из-за стены, чтобы давление не росло после дождей."
		],
		[
			"photo",
			"Контроль",
			"Принимаем армирование до бетонирования, фото и видео каждого этапа."
		]
	],
	faq: [
		["Можно ли построить стену без проекта?", "Подпорные стены без расчёта ONEZA не строит: ошибка в толщине или армировании становится видна, когда стена уже наклонилась."],
		["Сколько стоит подпорная стена?", "Стоимость зависит от высоты, длины, грунта и подъезда техники. После выезда на участок и изысканий ONEZA даёт смету и фиксирует цену в договоре."],
		["Делаете стены вместе с домом?", "Да. На участке со склоном ONEZA проектирует подпорные стены, фундамент и каркас дома вместе, чтобы конструкции работали как одна система."]
	]
}, {
	kind: "monolith",
	slug: "fundamenty",
	seoDescription: "Монолитные фундаменты в Тбилиси: плита, лента или сваи по геологии, а также каркасы и перекрытия от $140 / м². Можно заказать отдельным этапом.",
	modified: "2026-09-22",
	h2: {
		pain: "Чем опасна ошибка<br><em>в фундаменте?</em>",
		spec: "Какие фундаменты<br><em>и монолитные работы делаем?</em>",
		features: "Как выбираем<br><em>и делаем фундамент?</em>",
		price: "Сколько стоит<br><em>монолит за м²?</em>"
	},
	objtype: "Фундамент или монолитные работы",
	hero: "process",
	eyebrow: "Основа любого объекта",
	name: "Фундаменты",
	title: "Фундаменты<br><em>и монолитные работы</em>",
	card: "Плита, лента или сваи по результатам геологии. Можно заказать отдельно от дома.",
	prices: true,
	lead: `ONEZA Construction делает в Тбилиси монолитные фундаменты — плиту, ленту, свайно-ростверковый — а также каркасы, колонны, перекрытия и стены цоколя для частных домов, жилых корпусов и производственных зданий. Ориентир цены 2026 года на монолитный каркас — ${CENA_PRICES[0][1]}. Фундамент можно заказать отдельным этапом.`,
	more: "Тип фундамента ONEZA выбирает по результатам геологии: грунты, уровень воды, нагрузка и рельеф, а не привычка бригады. Конструктивный расчёт и рабочие чертежи готовы до выхода на площадку, армирование принимается до заливки, бетон проверяется. Цена в договоре не меняется, пока не меняется задача; гарантия на конструктив, включая фундамент, — 10 лет. Работы ONEZA ведёт своей техникой и опалубкой, поэтому сроки не зависят от субподряда.",
	pain: "Ошибку в фундаменте не исправить, когда на нём уже стоит дом: трещины, осадка и сырость в цоколе обходятся дороже всей экономии на старте.",
	answer: "Фундамент проектируем по результатам геологии, армирование принимаем до бетонирования, бетон проверяем. Цена в договоре не меняется, если не меняется задача.",
	spec: [
		["Фундаменты", "Монолитная плита, ленточный, свайно-ростверковый"],
		["Монолитные работы", "Каркасы, колонны, перекрытия, лестницы, стены цоколя"],
		["Объекты", "Частные дома, жилые корпуса и многоэтажки, производственные здания"],
		["Ресурсы", "Своя техника и опалубка на 6 000 м² перекрытий одновременно"],
		["Контроль", "Акты скрытых работ, приёмка армирования, контроль бетона"],
		["Результат", "Конструктив с исполнительной документацией"]
	],
	features: [
		[
			"layers",
			"Геология",
			"Тип фундамента выбираем по грунтам и уровню воды, а не по привычке."
		],
		[
			"blueprint",
			"Проект",
			"Конструктивный расчёт и рабочие чертежи до выхода на площадку."
		],
		[
			"inspect",
			"Армирование",
			"Каждый этап армирования принимаем до заливки бетона."
		],
		[
			"clock",
			"Темп",
			"Своя опалубка и бригады: сроки не зависят от субподряда."
		]
	],
	faq: [
		["Можно заказать только фундамент?", "Да, фундамент и монолитный каркас можно заказать отдельным этапом. Объём и условия ONEZA обсуждает после выезда на участок."],
		["Какой фундамент нужен моему дому?", "Это решает расчёт по результатам геологии: плита, лента или сваи зависят от грунта, нагрузки и рельефа."],
		["Работаете с многоэтажными зданиями?", "Да. Монолитные каркасы жилых корпусов — основное направление ONEZA."]
	]
}];
/**
* Смежные услуги (ONEZ-53): единый источник блока «Смежные услуги» на страницах услуг,
* цены и проверки участка. Ключ — slug страницы, значения — slug услуг из SERVICES/MONOLITH.
*/
var RELATED_SERVICES = {
	"zhilye-korpusa": [
		"fundamenty",
		"proizvodstvo-i-sklady",
		"chastnye-doma"
	],
	"proizvodstvo-i-sklady": [
		"fundamenty",
		"zhilye-korpusa",
		"podpornye-steny"
	],
	"chastnye-doma": [
		"fundamenty",
		"podpornye-steny",
		"zhilye-korpusa"
	],
	"podpornye-steny": [
		"fundamenty",
		"chastnye-doma",
		"proizvodstvo-i-sklady"
	],
	"fundamenty": [
		"chastnye-doma",
		"zhilye-korpusa",
		"podpornye-steny"
	],
	"cena": [
		"chastnye-doma",
		"zhilye-korpusa",
		"proizvodstvo-i-sklady",
		"fundamenty",
		"podpornye-steny"
	],
	"proverka-uchastka": [
		"chastnye-doma",
		"podpornye-steny",
		"fundamenty"
	]
};
//#endregion
//#region app/site/contacts.ts
var PHONE = "+995 599 538 277";
var TEL = "tel:+995599538277";
var WHATSAPP = "https://wa.me/995599538277";
var TELEGRAM = "https://t.me/+995599538277";
var EMAIL = "info@onez.ge";
/** Страницы компании в Facebook (ONEZ-05): грузинская — для KA и EN, русская — для RU; обе в sameAs JSON-LD. */
var FACEBOOK = "https://www.facebook.com/61583334088458";
var FACEBOOK_RU = "https://www.facebook.com/profile.php?id=61594375529944";
var SITE_URL = "https://onez.ge";
/**
* Юридическое лицо (закон 14). Официальное название — грузинское, как в
* реестре предпринимателей: RU и EN — его транслитерация для читателя, в
* документах и договоре действует грузинское. Источник — подтверждение
* владельца 23.09.2026; выписка из реестра к делу не приложена (ONEZ-78).
*/
var LEGAL_NAME_KA = "შპს ონეზა ქონსთრაქშენი";
var LEGAL_NAME_RU = "ООО «Онеза Констракшени»";
/** Идентификационный код в реестре предпринимателей Грузии. */
var TAX_ID = "400418525";
/**
* Офис компании (закон 14): адрес и координаты меняются только здесь.
* Официальное название улицы — Григола Волски (то же место, что «2-й переулок
* Крцаниси, 35»); подтверждение владельца 23.09.2026, единый NAP для сайта,
* Google Business и Яндекс Бизнеса.
*/
var ADDRESS = "улица Григола Волски, 4, Тбилиси";
var ADDRESS_EN = "4 Grigol Volski St, Tbilisi 0114";
var COORDS = {
	lat: 41.67213,
	lng: 44.807149
};
/** Карточка компании в Google Картах (ONEZ-13): ссылка «Офис» и hasMap в JSON-LD. */
var MAP_LINK = "https://maps.google.com/?cid=9667708027843689739";
/** Часы работы офиса — как в Google Business Profile; суббота по договорённости не входит. */
/** Круглосуточно, как в карточке Google (подтверждение владельца 23.09.2026): единый NAP. */
var OPENING_HOURS = {
	days: [
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
		"Sunday"
	],
	opens: "00:00",
	closes: "23:59"
};
var METRIKA_ID = 112457250;
/** Каналы связи для ContactLink: адрес и подпись по умолчанию. */
var CHANNELS = {
	phone: {
		href: TEL,
		label: PHONE
	},
	whatsapp: {
		href: WHATSAPP,
		label: "WhatsApp"
	},
	telegram: {
		href: TELEGRAM,
		label: "Telegram"
	},
	email: {
		href: `mailto:${EMAIL}`,
		label: EMAIL
	},
	facebook: {
		href: FACEBOOK,
		label: "Facebook"
	}
};
//#endregion
export { STEPS as $, CHECK_HOW as A, data as At, COMPANY_RESOURCES as B, parseToInfo as Bt, CENA_NAV as C, instrumentHandler as Ct, CENA_WHY as D, convertRouteMatchToUiMatch as Dt, CENA_TABLE as E, RouterContextProvider as Et, CHECK_TERMS_HEAD as F, isRouteErrorResponse as Ft, USLUGI_DIRECTION_DETAILS as G, resolveTo as Gt, HOME_DIRECTION_DETAILS as H, redirectDocument as Ht, COMPANY_FAQ as I, joinPaths as It, DIRECTIONS as J, createPath as Jt, CHECK as K, stripBasename as Kt, COMPANY_LEAD as L, matchPath as Lt, CHECK_MORE as M, getResolveToMatches as Mt, CHECK_PAIN as N, getRoutePattern as Nt, CHECK_FAQ as O, convertRoutesToDataRoutes as Ot, CHECK_TERMS as P, isBrowser as Pt, RESPONSIBILITIES as Q, ABSOLUTE_URL_REGEX as Qt, COMPANY_MORE as R, matchRoutes as Rt, CENA_FAQ as S, isResponse as St, CENA_PRICES as T, ErrorResponseImpl as Tt, HOME_STATS as U, removeTrailingSlash as Ut, COMPANY_TEAM as V, redirect as Vt, PROCESS_HERO as W, replace as Wt, PARTICIPATION as X, parsePath as Xt, FACTS as Y, invariant as Yt, PROMISE as Z, warning as Zt, MONOLITH as _, hasInvalidProtocol as _t, EMAIL as a, NO_BODY_STATUS_CODES as at, CENA_CONTRACT as b, isRedirectResponse as bt, LEGAL_NAME_KA as c, decodeViaTurboStream as ct, METRIKA_ID as d, escapeHtml as dt, extractContact as et, OPENING_HOURS as f, IDLE_BLOCKER as ft, WHATSAPP as g, getStaticContextFromError as gt, TAX_ID as h, createStaticHandler as ht, COORDS as i, isFogOfWarEnabled as it, CHECK_LEAD as j, defaultMapRouteProperties as jt, CHECK_FOREIGN as k, createDataFunctionUrl as kt, LEGAL_NAME_RU as l, singleFetchUrl as lt, SITE_URL as m, IDLE_NAVIGATION as mt, ADDRESS_EN as n, getManifestPath as nt, FACEBOOK as o, SingleFetchRedirectSymbol as ot, PHONE as p, IDLE_FETCHER as pt, CONTROL as q, require_react as qt, CHANNELS as r, getPartialManifest as rt, FACEBOOK_RU as s, StreamTransfer as st, ADDRESS as t, isValidContact as tt, MAP_LINK as u, encode as ut, RELATED_SERVICES as v, isDataWithResponseInit as vt, CENA_PAYMENT as w, instrumentationResultMetaContext as wt, CENA_EXAMPLES as x, isRedirectStatusCode as xt, SERVICES as y, isMutationMethod as yt, COMPANY_PHILOSOPHY as z, matchRoutesImpl as zt };
