/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./src/context/AuthContext.js":
/*!************************************!*\
  !*** ./src/context/AuthContext.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AuthProvider: () => (/* binding */ AuthProvider),\n/* harmony export */   useAuth: () => (/* binding */ useAuth)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(null);\nfunction AuthProvider({ children }) {\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [token, setToken] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const savedToken = localStorage.getItem(\"pngpoint_token\");\n        const savedUser = localStorage.getItem(\"pngpoint_user\");\n        if (savedToken && savedUser) {\n            setToken(savedToken);\n            setUser(JSON.parse(savedUser));\n        }\n        setLoading(false);\n    }, []);\n    const login = (userData, authToken)=>{\n        setUser(userData);\n        setToken(authToken);\n        localStorage.setItem(\"pngpoint_token\", authToken);\n        localStorage.setItem(\"pngpoint_user\", JSON.stringify(userData));\n    };\n    const logout = ()=>{\n        setUser(null);\n        setToken(null);\n        localStorage.removeItem(\"pngpoint_token\");\n        localStorage.removeItem(\"pngpoint_user\");\n    };\n    const updateUser = (userData)=>{\n        setUser(userData);\n        localStorage.setItem(\"pngpoint_user\", JSON.stringify(userData));\n    };\n    const isAuthenticated = !!token;\n    const isAdmin = user?.role === \"admin\";\n    const isContributor = user?.role === \"contributor\" || user?.role === \"admin\";\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthContext.Provider, {\n        value: {\n            user,\n            token,\n            loading,\n            login,\n            logout,\n            updateUser,\n            isAuthenticated,\n            isAdmin,\n            isContributor\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"/home/runner/workspace/frontend/src/context/AuthContext.js\",\n        lineNumber: 45,\n        columnNumber: 5\n    }, this);\n}\nfunction useAuth() {\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AuthContext);\n    if (!context) {\n        throw new Error(\"useAuth must be used within AuthProvider\");\n    }\n    return context;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29udGV4dC9BdXRoQ29udGV4dC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQXVFO0FBRXZFLE1BQU1JLDRCQUFjSixvREFBYUEsQ0FBQztBQUUzQixTQUFTSyxhQUFhLEVBQUVDLFFBQVEsRUFBRTtJQUN2QyxNQUFNLENBQUNDLE1BQU1DLFFBQVEsR0FBR04sK0NBQVFBLENBQUM7SUFDakMsTUFBTSxDQUFDTyxPQUFPQyxTQUFTLEdBQUdSLCtDQUFRQSxDQUFDO0lBQ25DLE1BQU0sQ0FBQ1MsU0FBU0MsV0FBVyxHQUFHViwrQ0FBUUEsQ0FBQztJQUV2Q0MsZ0RBQVNBLENBQUM7UUFDUixNQUFNVSxhQUFhQyxhQUFhQyxPQUFPLENBQUM7UUFDeEMsTUFBTUMsWUFBWUYsYUFBYUMsT0FBTyxDQUFDO1FBRXZDLElBQUlGLGNBQWNHLFdBQVc7WUFDM0JOLFNBQVNHO1lBQ1RMLFFBQVFTLEtBQUtDLEtBQUssQ0FBQ0Y7UUFDckI7UUFDQUosV0FBVztJQUNiLEdBQUcsRUFBRTtJQUVMLE1BQU1PLFFBQVEsQ0FBQ0MsVUFBVUM7UUFDdkJiLFFBQVFZO1FBQ1JWLFNBQVNXO1FBQ1RQLGFBQWFRLE9BQU8sQ0FBQyxrQkFBa0JEO1FBQ3ZDUCxhQUFhUSxPQUFPLENBQUMsaUJBQWlCTCxLQUFLTSxTQUFTLENBQUNIO0lBQ3ZEO0lBRUEsTUFBTUksU0FBUztRQUNiaEIsUUFBUTtRQUNSRSxTQUFTO1FBQ1RJLGFBQWFXLFVBQVUsQ0FBQztRQUN4QlgsYUFBYVcsVUFBVSxDQUFDO0lBQzFCO0lBRUEsTUFBTUMsYUFBYSxDQUFDTjtRQUNsQlosUUFBUVk7UUFDUk4sYUFBYVEsT0FBTyxDQUFDLGlCQUFpQkwsS0FBS00sU0FBUyxDQUFDSDtJQUN2RDtJQUVBLE1BQU1PLGtCQUFrQixDQUFDLENBQUNsQjtJQUMxQixNQUFNbUIsVUFBVXJCLE1BQU1zQixTQUFTO0lBQy9CLE1BQU1DLGdCQUFnQnZCLE1BQU1zQixTQUFTLGlCQUFpQnRCLE1BQU1zQixTQUFTO0lBRXJFLHFCQUNFLDhEQUFDekIsWUFBWTJCLFFBQVE7UUFBQ0MsT0FBTztZQUMzQnpCO1lBQ0FFO1lBQ0FFO1lBQ0FRO1lBQ0FLO1lBQ0FFO1lBQ0FDO1lBQ0FDO1lBQ0FFO1FBQ0Y7a0JBQ0d4Qjs7Ozs7O0FBR1A7QUFFTyxTQUFTMkI7SUFDZCxNQUFNQyxVQUFVakMsaURBQVVBLENBQUNHO0lBQzNCLElBQUksQ0FBQzhCLFNBQVM7UUFDWixNQUFNLElBQUlDLE1BQU07SUFDbEI7SUFDQSxPQUFPRDtBQUNUIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcGVybi1mcm9udGVuZC8uL3NyYy9jb250ZXh0L0F1dGhDb250ZXh0LmpzPzRiYTYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlQ29udGV4dCwgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcblxuY29uc3QgQXV0aENvbnRleHQgPSBjcmVhdGVDb250ZXh0KG51bGwpO1xuXG5leHBvcnQgZnVuY3Rpb24gQXV0aFByb3ZpZGVyKHsgY2hpbGRyZW4gfSkge1xuICBjb25zdCBbdXNlciwgc2V0VXNlcl0gPSB1c2VTdGF0ZShudWxsKTtcbiAgY29uc3QgW3Rva2VuLCBzZXRUb2tlbl0gPSB1c2VTdGF0ZShudWxsKTtcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBzYXZlZFRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3BuZ3BvaW50X3Rva2VuJyk7XG4gICAgY29uc3Qgc2F2ZWRVc2VyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3BuZ3BvaW50X3VzZXInKTtcbiAgICBcbiAgICBpZiAoc2F2ZWRUb2tlbiAmJiBzYXZlZFVzZXIpIHtcbiAgICAgIHNldFRva2VuKHNhdmVkVG9rZW4pO1xuICAgICAgc2V0VXNlcihKU09OLnBhcnNlKHNhdmVkVXNlcikpO1xuICAgIH1cbiAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IGxvZ2luID0gKHVzZXJEYXRhLCBhdXRoVG9rZW4pID0+IHtcbiAgICBzZXRVc2VyKHVzZXJEYXRhKTtcbiAgICBzZXRUb2tlbihhdXRoVG9rZW4pO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwbmdwb2ludF90b2tlbicsIGF1dGhUb2tlbik7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3BuZ3BvaW50X3VzZXInLCBKU09OLnN0cmluZ2lmeSh1c2VyRGF0YSkpO1xuICB9O1xuXG4gIGNvbnN0IGxvZ291dCA9ICgpID0+IHtcbiAgICBzZXRVc2VyKG51bGwpO1xuICAgIHNldFRva2VuKG51bGwpO1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdwbmdwb2ludF90b2tlbicpO1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdwbmdwb2ludF91c2VyJyk7XG4gIH07XG5cbiAgY29uc3QgdXBkYXRlVXNlciA9ICh1c2VyRGF0YSkgPT4ge1xuICAgIHNldFVzZXIodXNlckRhdGEpO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwbmdwb2ludF91c2VyJywgSlNPTi5zdHJpbmdpZnkodXNlckRhdGEpKTtcbiAgfTtcblxuICBjb25zdCBpc0F1dGhlbnRpY2F0ZWQgPSAhIXRva2VuO1xuICBjb25zdCBpc0FkbWluID0gdXNlcj8ucm9sZSA9PT0gJ2FkbWluJztcbiAgY29uc3QgaXNDb250cmlidXRvciA9IHVzZXI/LnJvbGUgPT09ICdjb250cmlidXRvcicgfHwgdXNlcj8ucm9sZSA9PT0gJ2FkbWluJztcblxuICByZXR1cm4gKFxuICAgIDxBdXRoQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17e1xuICAgICAgdXNlcixcbiAgICAgIHRva2VuLFxuICAgICAgbG9hZGluZyxcbiAgICAgIGxvZ2luLFxuICAgICAgbG9nb3V0LFxuICAgICAgdXBkYXRlVXNlcixcbiAgICAgIGlzQXV0aGVudGljYXRlZCxcbiAgICAgIGlzQWRtaW4sXG4gICAgICBpc0NvbnRyaWJ1dG9yXG4gICAgfX0+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9BdXRoQ29udGV4dC5Qcm92aWRlcj5cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUF1dGgoKSB7XG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEF1dGhDb250ZXh0KTtcbiAgaWYgKCFjb250ZXh0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBdXRoIG11c3QgYmUgdXNlZCB3aXRoaW4gQXV0aFByb3ZpZGVyJyk7XG4gIH1cbiAgcmV0dXJuIGNvbnRleHQ7XG59XG4iXSwibmFtZXMiOlsiY3JlYXRlQ29udGV4dCIsInVzZUNvbnRleHQiLCJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsIkF1dGhDb250ZXh0IiwiQXV0aFByb3ZpZGVyIiwiY2hpbGRyZW4iLCJ1c2VyIiwic2V0VXNlciIsInRva2VuIiwic2V0VG9rZW4iLCJsb2FkaW5nIiwic2V0TG9hZGluZyIsInNhdmVkVG9rZW4iLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwic2F2ZWRVc2VyIiwiSlNPTiIsInBhcnNlIiwibG9naW4iLCJ1c2VyRGF0YSIsImF1dGhUb2tlbiIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJsb2dvdXQiLCJyZW1vdmVJdGVtIiwidXBkYXRlVXNlciIsImlzQXV0aGVudGljYXRlZCIsImlzQWRtaW4iLCJyb2xlIiwiaXNDb250cmlidXRvciIsIlByb3ZpZGVyIiwidmFsdWUiLCJ1c2VBdXRoIiwiY29udGV4dCIsIkVycm9yIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/context/AuthContext.js\n");

/***/ }),

/***/ "./src/pages/_app.js":
/*!***************************!*\
  !*** ./src/pages/_app.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/head */ \"next/head\");\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _context_AuthContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../context/AuthContext */ \"./src/context/AuthContext.js\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../styles/globals.css */ \"./src/styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_head__WEBPACK_IMPORTED_MODULE_1___default()), {\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        name: \"viewport\",\n                        content: \"width=device-width, initial-scale=1\"\n                    }, void 0, false, {\n                        fileName: \"/home/runner/workspace/frontend/src/pages/_app.js\",\n                        lineNumber: 9,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"title\", {\n                        children: \"PNGPoint - Free Download Transparent PNG Files\"\n                    }, void 0, false, {\n                        fileName: \"/home/runner/workspace/frontend/src/pages/_app.js\",\n                        lineNumber: 10,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        name: \"description\",\n                        content: \"Free download transparent PNG files. High quality PNG images for designers.\"\n                    }, void 0, false, {\n                        fileName: \"/home/runner/workspace/frontend/src/pages/_app.js\",\n                        lineNumber: 11,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                        rel: \"icon\",\n                        href: \"/favicon.ico\"\n                    }, void 0, false, {\n                        fileName: \"/home/runner/workspace/frontend/src/pages/_app.js\",\n                        lineNumber: 12,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/home/runner/workspace/frontend/src/pages/_app.js\",\n                lineNumber: 8,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_context_AuthContext__WEBPACK_IMPORTED_MODULE_2__.AuthProvider, {\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"/home/runner/workspace/frontend/src/pages/_app.js\",\n                    lineNumber: 15,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"/home/runner/workspace/frontend/src/pages/_app.js\",\n                lineNumber: 14,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvX2FwcC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBNkI7QUFDeUI7QUFDdkI7QUFFL0IsU0FBU0UsSUFBSSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBRTtJQUNuQyxxQkFDRTs7MEJBQ0UsOERBQUNKLGtEQUFJQTs7a0NBQ0gsOERBQUNLO3dCQUFLQyxNQUFLO3dCQUFXQyxTQUFROzs7Ozs7a0NBQzlCLDhEQUFDQztrQ0FBTTs7Ozs7O2tDQUNQLDhEQUFDSDt3QkFBS0MsTUFBSzt3QkFBY0MsU0FBUTs7Ozs7O2tDQUNqQyw4REFBQ0U7d0JBQUtDLEtBQUk7d0JBQU9DLE1BQUs7Ozs7Ozs7Ozs7OzswQkFFeEIsOERBQUNWLDhEQUFZQTswQkFDWCw0RUFBQ0U7b0JBQVcsR0FBR0MsU0FBUzs7Ozs7Ozs7Ozs7OztBQUloQztBQUVBLGlFQUFlRixHQUFHQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcGVybi1mcm9udGVuZC8uL3NyYy9wYWdlcy9fYXBwLmpzPzhmZGEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEhlYWQgZnJvbSAnbmV4dC9oZWFkJztcbmltcG9ydCB7IEF1dGhQcm92aWRlciB9IGZyb20gJy4uL2NvbnRleHQvQXV0aENvbnRleHQnO1xuaW1wb3J0ICcuLi9zdHlsZXMvZ2xvYmFscy5jc3MnO1xuXG5mdW5jdGlvbiBBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9KSB7XG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxIZWFkPlxuICAgICAgICA8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTFcIiAvPlxuICAgICAgICA8dGl0bGU+UE5HUG9pbnQgLSBGcmVlIERvd25sb2FkIFRyYW5zcGFyZW50IFBORyBGaWxlczwvdGl0bGU+XG4gICAgICAgIDxtZXRhIG5hbWU9XCJkZXNjcmlwdGlvblwiIGNvbnRlbnQ9XCJGcmVlIGRvd25sb2FkIHRyYW5zcGFyZW50IFBORyBmaWxlcy4gSGlnaCBxdWFsaXR5IFBORyBpbWFnZXMgZm9yIGRlc2lnbmVycy5cIiAvPlxuICAgICAgICA8bGluayByZWw9XCJpY29uXCIgaHJlZj1cIi9mYXZpY29uLmljb1wiIC8+XG4gICAgICA8L0hlYWQ+XG4gICAgICA8QXV0aFByb3ZpZGVyPlxuICAgICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgICA8L0F1dGhQcm92aWRlcj5cbiAgICA8Lz5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgQXBwO1xuIl0sIm5hbWVzIjpbIkhlYWQiLCJBdXRoUHJvdmlkZXIiLCJBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJtZXRhIiwibmFtZSIsImNvbnRlbnQiLCJ0aXRsZSIsImxpbmsiLCJyZWwiLCJocmVmIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/pages/_app.js\n");

/***/ }),

/***/ "./src/styles/globals.css":
/*!********************************!*\
  !*** ./src/styles/globals.css ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "next/head":
/*!****************************!*\
  !*** external "next/head" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/head");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./src/pages/_app.js"));
module.exports = __webpack_exports__;

})();