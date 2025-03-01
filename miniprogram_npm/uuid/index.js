module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1740579918076, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.version = exports.validate = exports.v7 = exports.v6ToV1 = exports.v6 = exports.v5 = exports.v4 = exports.v3 = exports.v1ToV6 = exports.v1 = exports.stringify = exports.parse = exports.NIL = exports.MAX = void 0;
var max_js_1 = require("./max.js");
Object.defineProperty(exports, "MAX", { enumerable: true, get: function () { return max_js_1.default; } });
var nil_js_1 = require("./nil.js");
Object.defineProperty(exports, "NIL", { enumerable: true, get: function () { return nil_js_1.default; } });
var parse_js_1 = require("./parse.js");
Object.defineProperty(exports, "parse", { enumerable: true, get: function () { return parse_js_1.default; } });
var stringify_js_1 = require("./stringify.js");
Object.defineProperty(exports, "stringify", { enumerable: true, get: function () { return stringify_js_1.default; } });
var v1_js_1 = require("./v1.js");
Object.defineProperty(exports, "v1", { enumerable: true, get: function () { return v1_js_1.default; } });
var v1ToV6_js_1 = require("./v1ToV6.js");
Object.defineProperty(exports, "v1ToV6", { enumerable: true, get: function () { return v1ToV6_js_1.default; } });
var v3_js_1 = require("./v3.js");
Object.defineProperty(exports, "v3", { enumerable: true, get: function () { return v3_js_1.default; } });
var v4_js_1 = require("./v4.js");
Object.defineProperty(exports, "v4", { enumerable: true, get: function () { return v4_js_1.default; } });
var v5_js_1 = require("./v5.js");
Object.defineProperty(exports, "v5", { enumerable: true, get: function () { return v5_js_1.default; } });
var v6_js_1 = require("./v6.js");
Object.defineProperty(exports, "v6", { enumerable: true, get: function () { return v6_js_1.default; } });
var v6ToV1_js_1 = require("./v6ToV1.js");
Object.defineProperty(exports, "v6ToV1", { enumerable: true, get: function () { return v6ToV1_js_1.default; } });
var v7_js_1 = require("./v7.js");
Object.defineProperty(exports, "v7", { enumerable: true, get: function () { return v7_js_1.default; } });
var validate_js_1 = require("./validate.js");
Object.defineProperty(exports, "validate", { enumerable: true, get: function () { return validate_js_1.default; } });
var version_js_1 = require("./version.js");
Object.defineProperty(exports, "version", { enumerable: true, get: function () { return version_js_1.default; } });

}, function(modId) {var map = {"./max.js":1740579918077,"./nil.js":1740579918078,"./parse.js":1740579918079,"./stringify.js":1740579918082,"./v1ToV6.js":1740579918084,"./v3.js":1740579918085,"./v5.js":1740579918090,"./v6ToV1.js":1740579918095,"./validate.js":1740579918080,"./version.js":1740579918097}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1740579918077, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1740579918078, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = '00000000-0000-0000-0000-000000000000';

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1740579918079, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const validate_js_1 = require("./validate.js");
function parse(uuid) {
    if (!(0, validate_js_1.default)(uuid)) {
        throw TypeError('Invalid UUID');
    }
    let v;
    return Uint8Array.of((v = parseInt(uuid.slice(0, 8), 16)) >>> 24, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff, (v = parseInt(uuid.slice(9, 13), 16)) >>> 8, v & 0xff, (v = parseInt(uuid.slice(14, 18), 16)) >>> 8, v & 0xff, (v = parseInt(uuid.slice(19, 23), 16)) >>> 8, v & 0xff, ((v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000) & 0xff, (v / 0x100000000) & 0xff, (v >>> 24) & 0xff, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff);
}
exports.default = parse;

}, function(modId) { var map = {"./validate.js":1740579918080}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1740579918080, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const regex_js_1 = require("./regex.js");
function validate(uuid) {
    return typeof uuid === 'string' && regex_js_1.default.test(uuid);
}
exports.default = validate;

}, function(modId) { var map = {"./regex.js":1740579918081}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1740579918081, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1740579918082, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.unsafeStringify = void 0;
const validate_js_1 = require("./validate.js");
const byteToHex = [];
for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 0x100).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
    return (byteToHex[arr[offset + 0]] +
        byteToHex[arr[offset + 1]] +
        byteToHex[arr[offset + 2]] +
        byteToHex[arr[offset + 3]] +
        '-' +
        byteToHex[arr[offset + 4]] +
        byteToHex[arr[offset + 5]] +
        '-' +
        byteToHex[arr[offset + 6]] +
        byteToHex[arr[offset + 7]] +
        '-' +
        byteToHex[arr[offset + 8]] +
        byteToHex[arr[offset + 9]] +
        '-' +
        byteToHex[arr[offset + 10]] +
        byteToHex[arr[offset + 11]] +
        byteToHex[arr[offset + 12]] +
        byteToHex[arr[offset + 13]] +
        byteToHex[arr[offset + 14]] +
        byteToHex[arr[offset + 15]]).toLowerCase();
}
exports.unsafeStringify = unsafeStringify;
function stringify(arr, offset = 0) {
    const uuid = unsafeStringify(arr, offset);
    if (!(0, validate_js_1.default)(uuid)) {
        throw TypeError('Stringified UUID is invalid');
    }
    return uuid;
}
exports.default = stringify;

}, function(modId) { var map = {"./validate.js":1740579918080}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1740579918084, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const parse_js_1 = require("./parse.js");
const stringify_js_1 = require("./stringify.js");
function v1ToV6(uuid) {
    const v1Bytes = typeof uuid === 'string' ? (0, parse_js_1.default)(uuid) : uuid;
    const v6Bytes = _v1ToV6(v1Bytes);
    return typeof uuid === 'string' ? (0, stringify_js_1.unsafeStringify)(v6Bytes) : v6Bytes;
}
exports.default = v1ToV6;
function _v1ToV6(v1Bytes) {
    return Uint8Array.of(((v1Bytes[6] & 0x0f) << 4) | ((v1Bytes[7] >> 4) & 0x0f), ((v1Bytes[7] & 0x0f) << 4) | ((v1Bytes[4] & 0xf0) >> 4), ((v1Bytes[4] & 0x0f) << 4) | ((v1Bytes[5] & 0xf0) >> 4), ((v1Bytes[5] & 0x0f) << 4) | ((v1Bytes[0] & 0xf0) >> 4), ((v1Bytes[0] & 0x0f) << 4) | ((v1Bytes[1] & 0xf0) >> 4), ((v1Bytes[1] & 0x0f) << 4) | ((v1Bytes[2] & 0xf0) >> 4), 0x60 | (v1Bytes[2] & 0x0f), v1Bytes[3], v1Bytes[8], v1Bytes[9], v1Bytes[10], v1Bytes[11], v1Bytes[12], v1Bytes[13], v1Bytes[14], v1Bytes[15]);
}

}, function(modId) { var map = {"./parse.js":1740579918079,"./stringify.js":1740579918082}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1740579918085, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.URL = exports.DNS = void 0;
const md5_js_1 = require("./md5.js");
const v35_js_1 = require("./v35.js");
var v35_js_2 = require("./v35.js");
Object.defineProperty(exports, "DNS", { enumerable: true, get: function () { return v35_js_2.DNS; } });
Object.defineProperty(exports, "URL", { enumerable: true, get: function () { return v35_js_2.URL; } });
function v3(value, namespace, buf, offset) {
    return (0, v35_js_1.default)(0x30, md5_js_1.default, value, namespace, buf, offset);
}
v3.DNS = v35_js_1.DNS;
v3.URL = v35_js_1.URL;
exports.default = v3;

}, function(modId) { var map = {"./md5.js":1740579918086}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1740579918086, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
function md5(bytes) {
    if (Array.isArray(bytes)) {
        bytes = Buffer.from(bytes);
    }
    else if (typeof bytes === 'string') {
        bytes = Buffer.from(bytes, 'utf8');
    }
    return (0, crypto_1.createHash)('md5').update(bytes).digest();
}
exports.default = md5;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1740579918090, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.URL = exports.DNS = void 0;
const sha1_js_1 = require("./sha1.js");
const v35_js_1 = require("./v35.js");
var v35_js_2 = require("./v35.js");
Object.defineProperty(exports, "DNS", { enumerable: true, get: function () { return v35_js_2.DNS; } });
Object.defineProperty(exports, "URL", { enumerable: true, get: function () { return v35_js_2.URL; } });
function v5(value, namespace, buf, offset) {
    return (0, v35_js_1.default)(0x50, sha1_js_1.default, value, namespace, buf, offset);
}
v5.DNS = v35_js_1.DNS;
v5.URL = v35_js_1.URL;
exports.default = v5;

}, function(modId) { var map = {"./sha1.js":1740579918091}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1740579918091, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
function sha1(bytes) {
    if (Array.isArray(bytes)) {
        bytes = Buffer.from(bytes);
    }
    else if (typeof bytes === 'string') {
        bytes = Buffer.from(bytes, 'utf8');
    }
    return (0, crypto_1.createHash)('sha1').update(bytes).digest();
}
exports.default = sha1;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1740579918095, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const parse_js_1 = require("./parse.js");
const stringify_js_1 = require("./stringify.js");
function v6ToV1(uuid) {
    const v6Bytes = typeof uuid === 'string' ? (0, parse_js_1.default)(uuid) : uuid;
    const v1Bytes = _v6ToV1(v6Bytes);
    return typeof uuid === 'string' ? (0, stringify_js_1.unsafeStringify)(v1Bytes) : v1Bytes;
}
exports.default = v6ToV1;
function _v6ToV1(v6Bytes) {
    return Uint8Array.of(((v6Bytes[3] & 0x0f) << 4) | ((v6Bytes[4] >> 4) & 0x0f), ((v6Bytes[4] & 0x0f) << 4) | ((v6Bytes[5] & 0xf0) >> 4), ((v6Bytes[5] & 0x0f) << 4) | (v6Bytes[6] & 0x0f), v6Bytes[7], ((v6Bytes[1] & 0x0f) << 4) | ((v6Bytes[2] & 0xf0) >> 4), ((v6Bytes[2] & 0x0f) << 4) | ((v6Bytes[3] & 0xf0) >> 4), 0x10 | ((v6Bytes[0] & 0xf0) >> 4), ((v6Bytes[0] & 0x0f) << 4) | ((v6Bytes[1] & 0xf0) >> 4), v6Bytes[8], v6Bytes[9], v6Bytes[10], v6Bytes[11], v6Bytes[12], v6Bytes[13], v6Bytes[14], v6Bytes[15]);
}

}, function(modId) { var map = {"./parse.js":1740579918079,"./stringify.js":1740579918082}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1740579918097, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const validate_js_1 = require("./validate.js");
function version(uuid) {
    if (!(0, validate_js_1.default)(uuid)) {
        throw TypeError('Invalid UUID');
    }
    return parseInt(uuid.slice(14, 15), 16);
}
exports.default = version;

}, function(modId) { var map = {"./validate.js":1740579918080}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1740579918076);
})()
//miniprogram-npm-outsideDeps=["./v1.js","./v4.js","./v6.js","./v7.js","./v35.js","crypto"]
//# sourceMappingURL=index.js.map