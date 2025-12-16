"use strict";
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

/***/ "./src/context/UploadContext.js":
/*!**************************************!*\
  !*** ./src/context/UploadContext.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   UploadContext: () => (/* binding */ UploadContext),\n/* harmony export */   UploadProvider: () => (/* binding */ UploadProvider)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _services_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/api */ \"./src/services/api.js\");\n\n\n\nconst UploadContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)({\n    files: [],\n    refresh: ()=>{}\n});\nfunction UploadProvider({ children, initialFiles = [] }) {\n    const [files, setFiles] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(initialFiles);\n    const refresh = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async ()=>{\n        const latest = await (0,_services_api__WEBPACK_IMPORTED_MODULE_2__.fetchFiles)();\n        setFiles(latest);\n    }, []);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        setFiles(initialFiles);\n    }, [\n        initialFiles\n    ]);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        if (!initialFiles || initialFiles.length === 0) {\n            refresh();\n        }\n    }, [\n        initialFiles,\n        refresh\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(UploadContext.Provider, {\n        value: {\n            files,\n            refresh\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"/home/runner/workspace/frontend/src/context/UploadContext.js\",\n        lineNumber: 25,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29udGV4dC9VcGxvYWRDb250ZXh0LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQXdFO0FBQzNCO0FBRXRDLE1BQU1LLDhCQUFnQkwsb0RBQWFBLENBQUM7SUFBRU0sT0FBTyxFQUFFO0lBQUVDLFNBQVMsS0FBTztBQUFFLEdBQUc7QUFFdEUsU0FBU0MsZUFBZSxFQUFFQyxRQUFRLEVBQUVDLGVBQWUsRUFBRSxFQUFFO0lBQzVELE1BQU0sQ0FBQ0osT0FBT0ssU0FBUyxHQUFHUiwrQ0FBUUEsQ0FBQ087SUFFbkMsTUFBTUgsVUFBVU4sa0RBQVdBLENBQUM7UUFDMUIsTUFBTVcsU0FBUyxNQUFNUix5REFBVUE7UUFDL0JPLFNBQVNDO0lBQ1gsR0FBRyxFQUFFO0lBRUxWLGdEQUFTQSxDQUFDO1FBQ1JTLFNBQVNEO0lBQ1gsR0FBRztRQUFDQTtLQUFhO0lBRWpCUixnREFBU0EsQ0FBQztRQUNSLElBQUksQ0FBQ1EsZ0JBQWdCQSxhQUFhRyxNQUFNLEtBQUssR0FBRztZQUM5Q047UUFDRjtJQUNGLEdBQUc7UUFBQ0c7UUFBY0g7S0FBUTtJQUUxQixxQkFDRSw4REFBQ0YsY0FBY1MsUUFBUTtRQUFDQyxPQUFPO1lBQUVUO1lBQU9DO1FBQVE7a0JBQzdDRTs7Ozs7O0FBR1AiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wZXJuLWZyb250ZW5kLy4vc3JjL2NvbnRleHQvVXBsb2FkQ29udGV4dC5qcz9iZGVhIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZUNvbnRleHQsIHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgZmV0Y2hGaWxlcyB9IGZyb20gJy4uL3NlcnZpY2VzL2FwaSc7XG5cbmV4cG9ydCBjb25zdCBVcGxvYWRDb250ZXh0ID0gY3JlYXRlQ29udGV4dCh7IGZpbGVzOiBbXSwgcmVmcmVzaDogKCkgPT4ge30gfSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBVcGxvYWRQcm92aWRlcih7IGNoaWxkcmVuLCBpbml0aWFsRmlsZXMgPSBbXSB9KSB7XG4gIGNvbnN0IFtmaWxlcywgc2V0RmlsZXNdID0gdXNlU3RhdGUoaW5pdGlhbEZpbGVzKTtcblxuICBjb25zdCByZWZyZXNoID0gdXNlQ2FsbGJhY2soYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGxhdGVzdCA9IGF3YWl0IGZldGNoRmlsZXMoKTtcbiAgICBzZXRGaWxlcyhsYXRlc3QpO1xuICB9LCBbXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBzZXRGaWxlcyhpbml0aWFsRmlsZXMpO1xuICB9LCBbaW5pdGlhbEZpbGVzXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIWluaXRpYWxGaWxlcyB8fCBpbml0aWFsRmlsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZWZyZXNoKCk7XG4gICAgfVxuICB9LCBbaW5pdGlhbEZpbGVzLCByZWZyZXNoXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8VXBsb2FkQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17eyBmaWxlcywgcmVmcmVzaCB9fT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L1VwbG9hZENvbnRleHQuUHJvdmlkZXI+XG4gICk7XG59XG4iXSwibmFtZXMiOlsiY3JlYXRlQ29udGV4dCIsInVzZUNhbGxiYWNrIiwidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJmZXRjaEZpbGVzIiwiVXBsb2FkQ29udGV4dCIsImZpbGVzIiwicmVmcmVzaCIsIlVwbG9hZFByb3ZpZGVyIiwiY2hpbGRyZW4iLCJpbml0aWFsRmlsZXMiLCJzZXRGaWxlcyIsImxhdGVzdCIsImxlbmd0aCIsIlByb3ZpZGVyIiwidmFsdWUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/context/UploadContext.js\n");

/***/ }),

/***/ "./src/pages/_app.js":
/*!***************************!*\
  !*** ./src/pages/_app.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/head */ \"next/head\");\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _context_UploadContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../context/UploadContext */ \"./src/context/UploadContext.js\");\n\n\n\nfunction App({ Component, pageProps }) {\n    const initialFiles = pageProps?.initialFiles || [];\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_head__WEBPACK_IMPORTED_MODULE_1___default()), {\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                    name: \"viewport\",\n                    content: \"width=device-width, initial-scale=1\"\n                }, void 0, false, {\n                    fileName: \"/home/runner/workspace/frontend/src/pages/_app.js\",\n                    lineNumber: 10,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"/home/runner/workspace/frontend/src/pages/_app.js\",\n                lineNumber: 9,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_context_UploadContext__WEBPACK_IMPORTED_MODULE_2__.UploadProvider, {\n                initialFiles: initialFiles,\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"/home/runner/workspace/frontend/src/pages/_app.js\",\n                    lineNumber: 13,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"/home/runner/workspace/frontend/src/pages/_app.js\",\n                lineNumber: 12,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvX2FwcC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQTZCO0FBQzZCO0FBRTFELFNBQVNFLElBQUksRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQUU7SUFDbkMsTUFBTUMsZUFBZUQsV0FBV0MsZ0JBQWdCLEVBQUU7SUFFbEQscUJBQ0U7OzBCQUNFLDhEQUFDTCxrREFBSUE7MEJBQ0gsNEVBQUNNO29CQUFLQyxNQUFLO29CQUFXQyxTQUFROzs7Ozs7Ozs7OzswQkFFaEMsOERBQUNQLGtFQUFjQTtnQkFBQ0ksY0FBY0E7MEJBQzVCLDRFQUFDRjtvQkFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7Ozs7O0FBSWhDO0FBRUEsaUVBQWVGLEdBQUdBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wZXJuLWZyb250ZW5kLy4vc3JjL3BhZ2VzL19hcHAuanM/OGZkYSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSGVhZCBmcm9tICduZXh0L2hlYWQnO1xuaW1wb3J0IHsgVXBsb2FkUHJvdmlkZXIgfSBmcm9tICcuLi9jb250ZXh0L1VwbG9hZENvbnRleHQnO1xuXG5mdW5jdGlvbiBBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9KSB7XG4gIGNvbnN0IGluaXRpYWxGaWxlcyA9IHBhZ2VQcm9wcz8uaW5pdGlhbEZpbGVzIHx8IFtdO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxIZWFkPlxuICAgICAgICA8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTFcIiAvPlxuICAgICAgPC9IZWFkPlxuICAgICAgPFVwbG9hZFByb3ZpZGVyIGluaXRpYWxGaWxlcz17aW5pdGlhbEZpbGVzfT5cbiAgICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgICAgPC9VcGxvYWRQcm92aWRlcj5cbiAgICA8Lz5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgQXBwO1xuIl0sIm5hbWVzIjpbIkhlYWQiLCJVcGxvYWRQcm92aWRlciIsIkFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyIsImluaXRpYWxGaWxlcyIsIm1ldGEiLCJuYW1lIiwiY29udGVudCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/pages/_app.js\n");

/***/ }),

/***/ "./src/services/api.js":
/*!*****************************!*\
  !*** ./src/services/api.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   fetchFiles: () => (/* binding */ fetchFiles),\n/* harmony export */   uploadFile: () => (/* binding */ uploadFile)\n/* harmony export */ });\nconst DEFAULT_API_BASE_URL =  false ? 0 : \"http://localhost:3001/api\";\nfunction resolveBaseUrl(override) {\n    if (override) return override;\n    if (true) {\n        return process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL;\n    }\n    return process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL;\n}\nasync function uploadFile(file, { baseUrl } = {}) {\n    const formData = new FormData();\n    formData.append(\"file\", file);\n    const res = await fetch(`${resolveBaseUrl(baseUrl)}/files`, {\n        method: \"POST\",\n        body: formData\n    });\n    if (!res.ok) {\n        const message = await res.text();\n        throw new Error(message || \"Upload failed\");\n    }\n    return res.json();\n}\nasync function fetchFiles({ baseUrl } = {}) {\n    const res = await fetch(`${resolveBaseUrl(baseUrl)}/files`);\n    if (!res.ok) {\n        throw new Error(\"Failed to fetch files\");\n    }\n    return res.json();\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2VydmljZXMvYXBpLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsTUFBTUEsdUJBQXVCLE1BQWtCLEdBQzNDLENBQStCLEdBQy9CO0FBRUosU0FBU0ksZUFBZUMsUUFBUTtJQUM5QixJQUFJQSxVQUFVLE9BQU9BO0lBQ3JCLElBQUksSUFBa0IsRUFBYTtRQUNqQyxPQUFPQyxRQUFRQyxHQUFHLENBQUNDLFlBQVksSUFBSUYsUUFBUUMsR0FBRyxDQUFDRSx3QkFBd0IsSUFBSVQ7SUFDN0U7SUFDQSxPQUFPTSxRQUFRQyxHQUFHLENBQUNFLHdCQUF3QixJQUFJVDtBQUNqRDtBQUVPLGVBQWVVLFdBQVdDLElBQUksRUFBRSxFQUFFQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDckQsTUFBTUMsV0FBVyxJQUFJQztJQUNyQkQsU0FBU0UsTUFBTSxDQUFDLFFBQVFKO0lBRXhCLE1BQU1LLE1BQU0sTUFBTUMsTUFBTSxDQUFDLEVBQUViLGVBQWVRLFNBQVMsTUFBTSxDQUFDLEVBQUU7UUFDMURNLFFBQVE7UUFDUkMsTUFBTU47SUFDUjtJQUVBLElBQUksQ0FBQ0csSUFBSUksRUFBRSxFQUFFO1FBQ1gsTUFBTUMsVUFBVSxNQUFNTCxJQUFJTSxJQUFJO1FBQzlCLE1BQU0sSUFBSUMsTUFBTUYsV0FBVztJQUM3QjtJQUVBLE9BQU9MLElBQUlRLElBQUk7QUFDakI7QUFFTyxlQUFlQyxXQUFXLEVBQUViLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMvQyxNQUFNSSxNQUFNLE1BQU1DLE1BQU0sQ0FBQyxFQUFFYixlQUFlUSxTQUFTLE1BQU0sQ0FBQztJQUMxRCxJQUFJLENBQUNJLElBQUlJLEVBQUUsRUFBRTtRQUNYLE1BQU0sSUFBSUcsTUFBTTtJQUNsQjtJQUNBLE9BQU9QLElBQUlRLElBQUk7QUFDakIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wZXJuLWZyb250ZW5kLy4vc3JjL3NlcnZpY2VzL2FwaS5qcz80YzhiIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IERFRkFVTFRfQVBJX0JBU0VfVVJMID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgXG4gID8gYCR7d2luZG93LmxvY2F0aW9uLm9yaWdpbn0vYXBpYCBcbiAgOiAnaHR0cDovL2xvY2FsaG9zdDozMDAxL2FwaSc7XG5cbmZ1bmN0aW9uIHJlc29sdmVCYXNlVXJsKG92ZXJyaWRlKSB7XG4gIGlmIChvdmVycmlkZSkgcmV0dXJuIG92ZXJyaWRlO1xuICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gcHJvY2Vzcy5lbnYuQVBJX0JBU0VfVVJMIHx8IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0FQSV9CQVNFX1VSTCB8fCBERUZBVUxUX0FQSV9CQVNFX1VSTDtcbiAgfVxuICByZXR1cm4gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQVBJX0JBU0VfVVJMIHx8IERFRkFVTFRfQVBJX0JBU0VfVVJMO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBsb2FkRmlsZShmaWxlLCB7IGJhc2VVcmwgfSA9IHt9KSB7XG4gIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpO1xuXG4gIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGAke3Jlc29sdmVCYXNlVXJsKGJhc2VVcmwpfS9maWxlc2AsIHtcbiAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICBib2R5OiBmb3JtRGF0YSxcbiAgfSk7XG5cbiAgaWYgKCFyZXMub2spIHtcbiAgICBjb25zdCBtZXNzYWdlID0gYXdhaXQgcmVzLnRleHQoKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSB8fCAnVXBsb2FkIGZhaWxlZCcpO1xuICB9XG5cbiAgcmV0dXJuIHJlcy5qc29uKCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEZpbGVzKHsgYmFzZVVybCB9ID0ge30pIHtcbiAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goYCR7cmVzb2x2ZUJhc2VVcmwoYmFzZVVybCl9L2ZpbGVzYCk7XG4gIGlmICghcmVzLm9rKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gZmV0Y2ggZmlsZXMnKTtcbiAgfVxuICByZXR1cm4gcmVzLmpzb24oKTtcbn1cbiJdLCJuYW1lcyI6WyJERUZBVUxUX0FQSV9CQVNFX1VSTCIsIndpbmRvdyIsImxvY2F0aW9uIiwib3JpZ2luIiwicmVzb2x2ZUJhc2VVcmwiLCJvdmVycmlkZSIsInByb2Nlc3MiLCJlbnYiLCJBUElfQkFTRV9VUkwiLCJORVhUX1BVQkxJQ19BUElfQkFTRV9VUkwiLCJ1cGxvYWRGaWxlIiwiZmlsZSIsImJhc2VVcmwiLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwiYXBwZW5kIiwicmVzIiwiZmV0Y2giLCJtZXRob2QiLCJib2R5Iiwib2siLCJtZXNzYWdlIiwidGV4dCIsIkVycm9yIiwianNvbiIsImZldGNoRmlsZXMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/services/api.js\n");

/***/ }),

/***/ "next/head":
/*!****************************!*\
  !*** external "next/head" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("next/head");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

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