var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn2, res) => function __init() {
  return fn2 && (res = (0, fn2[__getOwnPropNames(fn2)[0]])(fn2 = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/@gradio/client/dist/wrapper-CviSselG.js
var wrapper_CviSselG_exports = {};
__export(wrapper_CviSselG_exports, {
  Receiver: () => receiver$1,
  Sender: () => sender$1,
  WebSocket: () => WebSocket$2,
  WebSocketServer: () => websocketServer$1,
  createWebSocketStream: () => stream$1,
  default: () => WebSocket$2
});
import require$$0 from "stream";
import require$$0$2 from "zlib";
import require$$0$1 from "fs";
import require$$1$1 from "path";
import require$$2 from "os";
import require$$0$3 from "buffer";
import require$$3 from "net";
import require$$4 from "tls";
import require$$5 from "crypto";
import require$$0$4 from "events";
import require$$1$2 from "https";
import require$$2$1 from "http";
import require$$7 from "url";
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
function getAugmentedNamespace(n) {
  if (n.__esModule)
    return n;
  var f = n.default;
  if (typeof f == "function") {
    var a = function a2() {
      if (this instanceof a2) {
        return Reflect.construct(f, arguments, this.constructor);
      }
      return f.apply(this, arguments);
    };
    a.prototype = f.prototype;
  } else
    a = {};
  Object.defineProperty(a, "__esModule", { value: true });
  Object.keys(n).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n[k];
      }
    });
  });
  return a;
}
function emitClose$1(stream22) {
  stream22.emit("close");
}
function duplexOnEnd() {
  if (!this.destroyed && this._writableState.finished) {
    this.destroy();
  }
}
function duplexOnError(err) {
  this.removeListener("error", duplexOnError);
  this.destroy();
  if (this.listenerCount("error") === 0) {
    this.emit("error", err);
  }
}
function createWebSocketStream(ws, options) {
  let terminateOnDestroy = true;
  const duplex = new Duplex({
    ...options,
    autoDestroy: false,
    emitClose: false,
    objectMode: false,
    writableObjectMode: false
  });
  ws.on("message", function message(msg, isBinary) {
    const data = !isBinary && duplex._readableState.objectMode ? msg.toString() : msg;
    if (!duplex.push(data))
      ws.pause();
  });
  ws.once("error", function error2(err) {
    if (duplex.destroyed)
      return;
    terminateOnDestroy = false;
    duplex.destroy(err);
  });
  ws.once("close", function close() {
    if (duplex.destroyed)
      return;
    duplex.push(null);
  });
  duplex._destroy = function(err, callback) {
    if (ws.readyState === ws.CLOSED) {
      callback(err);
      process.nextTick(emitClose$1, duplex);
      return;
    }
    let called = false;
    ws.once("error", function error2(err2) {
      called = true;
      callback(err2);
    });
    ws.once("close", function close() {
      if (!called)
        callback(err);
      process.nextTick(emitClose$1, duplex);
    });
    if (terminateOnDestroy)
      ws.terminate();
  };
  duplex._final = function(callback) {
    if (ws.readyState === ws.CONNECTING) {
      ws.once("open", function open() {
        duplex._final(callback);
      });
      return;
    }
    if (ws._socket === null)
      return;
    if (ws._socket._writableState.finished) {
      callback();
      if (duplex._readableState.endEmitted)
        duplex.destroy();
    } else {
      ws._socket.once("finish", function finish() {
        callback();
      });
      ws.close();
    }
  };
  duplex._read = function() {
    if (ws.isPaused)
      ws.resume();
  };
  duplex._write = function(chunk, encoding, callback) {
    if (ws.readyState === ws.CONNECTING) {
      ws.once("open", function open() {
        duplex._write(chunk, encoding, callback);
      });
      return;
    }
    ws.send(chunk, callback);
  };
  duplex.on("end", duplexOnEnd);
  duplex.on("error", duplexOnError);
  return duplex;
}
function commonjsRequire(path) {
  throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
function requireNodeGypBuild$1() {
  if (hasRequiredNodeGypBuild$1)
    return nodeGypBuild;
  hasRequiredNodeGypBuild$1 = 1;
  var fs = require$$0$1;
  var path = require$$1$1;
  var os = require$$2;
  var runtimeRequire = typeof __webpack_require__ === "function" ? __non_webpack_require__ : commonjsRequire;
  var vars = process.config && process.config.variables || {};
  var prebuildsOnly = !!process.env.PREBUILDS_ONLY;
  var abi = process.versions.modules;
  var runtime = isElectron() ? "electron" : isNwjs() ? "node-webkit" : "node";
  var arch = process.env.npm_config_arch || os.arch();
  var platform = process.env.npm_config_platform || os.platform();
  var libc = process.env.LIBC || (isAlpine(platform) ? "musl" : "glibc");
  var armv = process.env.ARM_VERSION || (arch === "arm64" ? "8" : vars.arm_version) || "";
  var uv = (process.versions.uv || "").split(".")[0];
  nodeGypBuild = load;
  function load(dir) {
    return runtimeRequire(load.resolve(dir));
  }
  load.resolve = load.path = function(dir) {
    dir = path.resolve(dir || ".");
    try {
      var name = runtimeRequire(path.join(dir, "package.json")).name.toUpperCase().replace(/-/g, "_");
      if (process.env[name + "_PREBUILD"])
        dir = process.env[name + "_PREBUILD"];
    } catch (err) {
    }
    if (!prebuildsOnly) {
      var release = getFirst(path.join(dir, "build/Release"), matchBuild);
      if (release)
        return release;
      var debug = getFirst(path.join(dir, "build/Debug"), matchBuild);
      if (debug)
        return debug;
    }
    var prebuild = resolve(dir);
    if (prebuild)
      return prebuild;
    var nearby = resolve(path.dirname(process.execPath));
    if (nearby)
      return nearby;
    var target = [
      "platform=" + platform,
      "arch=" + arch,
      "runtime=" + runtime,
      "abi=" + abi,
      "uv=" + uv,
      armv ? "armv=" + armv : "",
      "libc=" + libc,
      "node=" + process.versions.node,
      process.versions.electron ? "electron=" + process.versions.electron : "",
      typeof __webpack_require__ === "function" ? "webpack=true" : ""
      // eslint-disable-line
    ].filter(Boolean).join(" ");
    throw new Error("No native build was found for " + target + "\n    loaded from: " + dir + "\n");
    function resolve(dir2) {
      var tuples = readdirSync(path.join(dir2, "prebuilds")).map(parseTuple);
      var tuple = tuples.filter(matchTuple(platform, arch)).sort(compareTuples)[0];
      if (!tuple)
        return;
      var prebuilds = path.join(dir2, "prebuilds", tuple.name);
      var parsed = readdirSync(prebuilds).map(parseTags);
      var candidates = parsed.filter(matchTags(runtime, abi));
      var winner = candidates.sort(compareTags(runtime))[0];
      if (winner)
        return path.join(prebuilds, winner.file);
    }
  };
  function readdirSync(dir) {
    try {
      return fs.readdirSync(dir);
    } catch (err) {
      return [];
    }
  }
  function getFirst(dir, filter) {
    var files = readdirSync(dir).filter(filter);
    return files[0] && path.join(dir, files[0]);
  }
  function matchBuild(name) {
    return /\.node$/.test(name);
  }
  function parseTuple(name) {
    var arr = name.split("-");
    if (arr.length !== 2)
      return;
    var platform2 = arr[0];
    var architectures = arr[1].split("+");
    if (!platform2)
      return;
    if (!architectures.length)
      return;
    if (!architectures.every(Boolean))
      return;
    return { name, platform: platform2, architectures };
  }
  function matchTuple(platform2, arch2) {
    return function(tuple) {
      if (tuple == null)
        return false;
      if (tuple.platform !== platform2)
        return false;
      return tuple.architectures.includes(arch2);
    };
  }
  function compareTuples(a, b) {
    return a.architectures.length - b.architectures.length;
  }
  function parseTags(file) {
    var arr = file.split(".");
    var extension2 = arr.pop();
    var tags = { file, specificity: 0 };
    if (extension2 !== "node")
      return;
    for (var i = 0; i < arr.length; i++) {
      var tag = arr[i];
      if (tag === "node" || tag === "electron" || tag === "node-webkit") {
        tags.runtime = tag;
      } else if (tag === "napi") {
        tags.napi = true;
      } else if (tag.slice(0, 3) === "abi") {
        tags.abi = tag.slice(3);
      } else if (tag.slice(0, 2) === "uv") {
        tags.uv = tag.slice(2);
      } else if (tag.slice(0, 4) === "armv") {
        tags.armv = tag.slice(4);
      } else if (tag === "glibc" || tag === "musl") {
        tags.libc = tag;
      } else {
        continue;
      }
      tags.specificity++;
    }
    return tags;
  }
  function matchTags(runtime2, abi2) {
    return function(tags) {
      if (tags == null)
        return false;
      if (tags.runtime !== runtime2 && !runtimeAgnostic(tags))
        return false;
      if (tags.abi !== abi2 && !tags.napi)
        return false;
      if (tags.uv && tags.uv !== uv)
        return false;
      if (tags.armv && tags.armv !== armv)
        return false;
      if (tags.libc && tags.libc !== libc)
        return false;
      return true;
    };
  }
  function runtimeAgnostic(tags) {
    return tags.runtime === "node" && tags.napi;
  }
  function compareTags(runtime2) {
    return function(a, b) {
      if (a.runtime !== b.runtime) {
        return a.runtime === runtime2 ? -1 : 1;
      } else if (a.abi !== b.abi) {
        return a.abi ? -1 : 1;
      } else if (a.specificity !== b.specificity) {
        return a.specificity > b.specificity ? -1 : 1;
      } else {
        return 0;
      }
    };
  }
  function isNwjs() {
    return !!(process.versions && process.versions.nw);
  }
  function isElectron() {
    if (process.versions && process.versions.electron)
      return true;
    if (process.env.ELECTRON_RUN_AS_NODE)
      return true;
    return typeof window !== "undefined" && window.process && window.process.type === "renderer";
  }
  function isAlpine(platform2) {
    return platform2 === "linux" && fs.existsSync("/etc/alpine-release");
  }
  load.parseTags = parseTags;
  load.matchTags = matchTags;
  load.compareTags = compareTags;
  load.parseTuple = parseTuple;
  load.matchTuple = matchTuple;
  load.compareTuples = compareTuples;
  return nodeGypBuild;
}
function requireNodeGypBuild() {
  if (hasRequiredNodeGypBuild)
    return nodeGypBuild$1.exports;
  hasRequiredNodeGypBuild = 1;
  if (typeof process.addon === "function") {
    nodeGypBuild$1.exports = process.addon.bind(process);
  } else {
    nodeGypBuild$1.exports = requireNodeGypBuild$1();
  }
  return nodeGypBuild$1.exports;
}
function requireFallback() {
  if (hasRequiredFallback)
    return fallback;
  hasRequiredFallback = 1;
  const mask2 = (source, mask3, output, offset, length) => {
    for (var i = 0; i < length; i++) {
      output[offset + i] = source[i] ^ mask3[i & 3];
    }
  };
  const unmask2 = (buffer, mask3) => {
    const length = buffer.length;
    for (var i = 0; i < length; i++) {
      buffer[i] ^= mask3[i & 3];
    }
  };
  fallback = { mask: mask2, unmask: unmask2 };
  return fallback;
}
function requireBufferutil() {
  if (hasRequiredBufferutil)
    return bufferutil.exports;
  hasRequiredBufferutil = 1;
  try {
    bufferutil.exports = requireNodeGypBuild()(__dirname);
  } catch (e) {
    bufferutil.exports = requireFallback();
  }
  return bufferutil.exports;
}
function concat$1(list, totalLength) {
  if (list.length === 0)
    return EMPTY_BUFFER$3;
  if (list.length === 1)
    return list[0];
  const target = Buffer.allocUnsafe(totalLength);
  let offset = 0;
  for (let i = 0; i < list.length; i++) {
    const buf = list[i];
    target.set(buf, offset);
    offset += buf.length;
  }
  if (offset < totalLength) {
    return new FastBuffer$2(target.buffer, target.byteOffset, offset);
  }
  return target;
}
function _mask(source, mask2, output, offset, length) {
  for (let i = 0; i < length; i++) {
    output[offset + i] = source[i] ^ mask2[i & 3];
  }
}
function _unmask(buffer, mask2) {
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] ^= mask2[i & 3];
  }
}
function toArrayBuffer$1(buf) {
  if (buf.length === buf.buffer.byteLength) {
    return buf.buffer;
  }
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
}
function toBuffer$2(data) {
  toBuffer$2.readOnly = true;
  if (Buffer.isBuffer(data))
    return data;
  let buf;
  if (data instanceof ArrayBuffer) {
    buf = new FastBuffer$2(data);
  } else if (ArrayBuffer.isView(data)) {
    buf = new FastBuffer$2(data.buffer, data.byteOffset, data.byteLength);
  } else {
    buf = Buffer.from(data);
    toBuffer$2.readOnly = false;
  }
  return buf;
}
function deflateOnData(chunk) {
  this[kBuffers].push(chunk);
  this[kTotalLength] += chunk.length;
}
function inflateOnData(chunk) {
  this[kTotalLength] += chunk.length;
  if (this[kPerMessageDeflate]._maxPayload < 1 || this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload) {
    this[kBuffers].push(chunk);
    return;
  }
  this[kError$1] = new RangeError("Max payload size exceeded");
  this[kError$1].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
  this[kError$1][kStatusCode$2] = 1009;
  this.removeListener("data", inflateOnData);
  this.reset();
}
function inflateOnError(err) {
  this[kPerMessageDeflate]._inflate = null;
  err[kStatusCode$2] = 1007;
  this[kCallback](err);
}
function isValidStatusCode$2(code) {
  return code >= 1e3 && code <= 1014 && code !== 1004 && code !== 1005 && code !== 1006 || code >= 3e3 && code <= 4999;
}
function _isValidUTF8(buf) {
  const len = buf.length;
  let i = 0;
  while (i < len) {
    if ((buf[i] & 128) === 0) {
      i++;
    } else if ((buf[i] & 224) === 192) {
      if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) {
        return false;
      }
      i += 2;
    } else if ((buf[i] & 240) === 224) {
      if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || // Overlong
      buf[i] === 237 && (buf[i + 1] & 224) === 160) {
        return false;
      }
      i += 3;
    } else if ((buf[i] & 248) === 240) {
      if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || // Overlong
      buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) {
        return false;
      }
      i += 4;
    } else {
      return false;
    }
  }
  return true;
}
function error(ErrorCtor, message, prefix, statusCode, errorCode) {
  const err = new ErrorCtor(
    prefix ? `Invalid WebSocket frame: ${message}` : message
  );
  Error.captureStackTrace(err, error);
  err.code = errorCode;
  err[kStatusCode$1] = statusCode;
  return err;
}
function callListener(listener, thisArg, event) {
  if (typeof listener === "object" && listener.handleEvent) {
    listener.handleEvent.call(listener, event);
  } else {
    listener.call(thisArg, event);
  }
}
function push(dest, name, elem) {
  if (dest[name] === void 0)
    dest[name] = [elem];
  else
    dest[name].push(elem);
}
function parse$2(header) {
  const offers = /* @__PURE__ */ Object.create(null);
  let params = /* @__PURE__ */ Object.create(null);
  let mustUnescape = false;
  let isEscaping = false;
  let inQuotes = false;
  let extensionName;
  let paramName;
  let start = -1;
  let code = -1;
  let end = -1;
  let i = 0;
  for (; i < header.length; i++) {
    code = header.charCodeAt(i);
    if (extensionName === void 0) {
      if (end === -1 && tokenChars$1[code] === 1) {
        if (start === -1)
          start = i;
      } else if (i !== 0 && (code === 32 || code === 9)) {
        if (end === -1 && start !== -1)
          end = i;
      } else if (code === 59 || code === 44) {
        if (start === -1) {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
        if (end === -1)
          end = i;
        const name = header.slice(start, end);
        if (code === 44) {
          push(offers, name, params);
          params = /* @__PURE__ */ Object.create(null);
        } else {
          extensionName = name;
        }
        start = end = -1;
      } else {
        throw new SyntaxError(`Unexpected character at index ${i}`);
      }
    } else if (paramName === void 0) {
      if (end === -1 && tokenChars$1[code] === 1) {
        if (start === -1)
          start = i;
      } else if (code === 32 || code === 9) {
        if (end === -1 && start !== -1)
          end = i;
      } else if (code === 59 || code === 44) {
        if (start === -1) {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
        if (end === -1)
          end = i;
        push(params, header.slice(start, end), true);
        if (code === 44) {
          push(offers, extensionName, params);
          params = /* @__PURE__ */ Object.create(null);
          extensionName = void 0;
        }
        start = end = -1;
      } else if (code === 61 && start !== -1 && end === -1) {
        paramName = header.slice(start, i);
        start = end = -1;
      } else {
        throw new SyntaxError(`Unexpected character at index ${i}`);
      }
    } else {
      if (isEscaping) {
        if (tokenChars$1[code] !== 1) {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
        if (start === -1)
          start = i;
        else if (!mustUnescape)
          mustUnescape = true;
        isEscaping = false;
      } else if (inQuotes) {
        if (tokenChars$1[code] === 1) {
          if (start === -1)
            start = i;
        } else if (code === 34 && start !== -1) {
          inQuotes = false;
          end = i;
        } else if (code === 92) {
          isEscaping = true;
        } else {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
      } else if (code === 34 && header.charCodeAt(i - 1) === 61) {
        inQuotes = true;
      } else if (end === -1 && tokenChars$1[code] === 1) {
        if (start === -1)
          start = i;
      } else if (start !== -1 && (code === 32 || code === 9)) {
        if (end === -1)
          end = i;
      } else if (code === 59 || code === 44) {
        if (start === -1) {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
        if (end === -1)
          end = i;
        let value = header.slice(start, end);
        if (mustUnescape) {
          value = value.replace(/\\/g, "");
          mustUnescape = false;
        }
        push(params, paramName, value);
        if (code === 44) {
          push(offers, extensionName, params);
          params = /* @__PURE__ */ Object.create(null);
          extensionName = void 0;
        }
        paramName = void 0;
        start = end = -1;
      } else {
        throw new SyntaxError(`Unexpected character at index ${i}`);
      }
    }
  }
  if (start === -1 || inQuotes || code === 32 || code === 9) {
    throw new SyntaxError("Unexpected end of input");
  }
  if (end === -1)
    end = i;
  const token = header.slice(start, end);
  if (extensionName === void 0) {
    push(offers, token, params);
  } else {
    if (paramName === void 0) {
      push(params, token, true);
    } else if (mustUnescape) {
      push(params, paramName, token.replace(/\\/g, ""));
    } else {
      push(params, paramName, token);
    }
    push(offers, extensionName, params);
  }
  return offers;
}
function format$1(extensions) {
  return Object.keys(extensions).map((extension2) => {
    let configurations = extensions[extension2];
    if (!Array.isArray(configurations))
      configurations = [configurations];
    return configurations.map((params) => {
      return [extension2].concat(
        Object.keys(params).map((k) => {
          let values = params[k];
          if (!Array.isArray(values))
            values = [values];
          return values.map((v) => v === true ? k : `${k}=${v}`).join("; ");
        })
      ).join("; ");
    }).join(", ");
  }).join(", ");
}
function initAsClient(websocket2, address, protocols, options) {
  const opts = {
    protocolVersion: protocolVersions[1],
    maxPayload: 100 * 1024 * 1024,
    skipUTF8Validation: false,
    perMessageDeflate: true,
    followRedirects: false,
    maxRedirects: 10,
    ...options,
    createConnection: void 0,
    socketPath: void 0,
    hostname: void 0,
    protocol: void 0,
    timeout: void 0,
    method: "GET",
    host: void 0,
    path: void 0,
    port: void 0
  };
  if (!protocolVersions.includes(opts.protocolVersion)) {
    throw new RangeError(
      `Unsupported protocol version: ${opts.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`
    );
  }
  let parsedUrl;
  if (address instanceof URL2) {
    parsedUrl = address;
    websocket2._url = address.href;
  } else {
    try {
      parsedUrl = new URL2(address);
    } catch (e) {
      throw new SyntaxError(`Invalid URL: ${address}`);
    }
    websocket2._url = address;
  }
  const isSecure = parsedUrl.protocol === "wss:";
  const isIpcUrl = parsedUrl.protocol === "ws+unix:";
  let invalidUrlMessage;
  if (parsedUrl.protocol !== "ws:" && !isSecure && !isIpcUrl) {
    invalidUrlMessage = `The URL's protocol must be one of "ws:", "wss:", or "ws+unix:"`;
  } else if (isIpcUrl && !parsedUrl.pathname) {
    invalidUrlMessage = "The URL's pathname is empty";
  } else if (parsedUrl.hash) {
    invalidUrlMessage = "The URL contains a fragment identifier";
  }
  if (invalidUrlMessage) {
    const err = new SyntaxError(invalidUrlMessage);
    if (websocket2._redirects === 0) {
      throw err;
    } else {
      emitErrorAndClose(websocket2, err);
      return;
    }
  }
  const defaultPort = isSecure ? 443 : 80;
  const key = randomBytes(16).toString("base64");
  const request = isSecure ? https.request : http$1.request;
  const protocolSet = /* @__PURE__ */ new Set();
  let perMessageDeflate;
  opts.createConnection = isSecure ? tlsConnect : netConnect;
  opts.defaultPort = opts.defaultPort || defaultPort;
  opts.port = parsedUrl.port || defaultPort;
  opts.host = parsedUrl.hostname.startsWith("[") ? parsedUrl.hostname.slice(1, -1) : parsedUrl.hostname;
  opts.headers = {
    ...opts.headers,
    "Sec-WebSocket-Version": opts.protocolVersion,
    "Sec-WebSocket-Key": key,
    Connection: "Upgrade",
    Upgrade: "websocket"
  };
  opts.path = parsedUrl.pathname + parsedUrl.search;
  opts.timeout = opts.handshakeTimeout;
  if (opts.perMessageDeflate) {
    perMessageDeflate = new PerMessageDeflate$1(
      opts.perMessageDeflate !== true ? opts.perMessageDeflate : {},
      false,
      opts.maxPayload
    );
    opts.headers["Sec-WebSocket-Extensions"] = format({
      [PerMessageDeflate$1.extensionName]: perMessageDeflate.offer()
    });
  }
  if (protocols.length) {
    for (const protocol of protocols) {
      if (typeof protocol !== "string" || !subprotocolRegex.test(protocol) || protocolSet.has(protocol)) {
        throw new SyntaxError(
          "An invalid or duplicated subprotocol was specified"
        );
      }
      protocolSet.add(protocol);
    }
    opts.headers["Sec-WebSocket-Protocol"] = protocols.join(",");
  }
  if (opts.origin) {
    if (opts.protocolVersion < 13) {
      opts.headers["Sec-WebSocket-Origin"] = opts.origin;
    } else {
      opts.headers.Origin = opts.origin;
    }
  }
  if (parsedUrl.username || parsedUrl.password) {
    opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
  }
  if (isIpcUrl) {
    const parts = opts.path.split(":");
    opts.socketPath = parts[0];
    opts.path = parts[1];
  }
  let req;
  if (opts.followRedirects) {
    if (websocket2._redirects === 0) {
      websocket2._originalIpc = isIpcUrl;
      websocket2._originalSecure = isSecure;
      websocket2._originalHostOrSocketPath = isIpcUrl ? opts.socketPath : parsedUrl.host;
      const headers = options && options.headers;
      options = { ...options, headers: {} };
      if (headers) {
        for (const [key2, value] of Object.entries(headers)) {
          options.headers[key2.toLowerCase()] = value;
        }
      }
    } else if (websocket2.listenerCount("redirect") === 0) {
      const isSameHost = isIpcUrl ? websocket2._originalIpc ? opts.socketPath === websocket2._originalHostOrSocketPath : false : websocket2._originalIpc ? false : parsedUrl.host === websocket2._originalHostOrSocketPath;
      if (!isSameHost || websocket2._originalSecure && !isSecure) {
        delete opts.headers.authorization;
        delete opts.headers.cookie;
        if (!isSameHost)
          delete opts.headers.host;
        opts.auth = void 0;
      }
    }
    if (opts.auth && !options.headers.authorization) {
      options.headers.authorization = "Basic " + Buffer.from(opts.auth).toString("base64");
    }
    req = websocket2._req = request(opts);
    if (websocket2._redirects) {
      websocket2.emit("redirect", websocket2.url, req);
    }
  } else {
    req = websocket2._req = request(opts);
  }
  if (opts.timeout) {
    req.on("timeout", () => {
      abortHandshake$1(websocket2, req, "Opening handshake has timed out");
    });
  }
  req.on("error", (err) => {
    if (req === null || req[kAborted])
      return;
    req = websocket2._req = null;
    emitErrorAndClose(websocket2, err);
  });
  req.on("response", (res) => {
    const location2 = res.headers.location;
    const statusCode = res.statusCode;
    if (location2 && opts.followRedirects && statusCode >= 300 && statusCode < 400) {
      if (++websocket2._redirects > opts.maxRedirects) {
        abortHandshake$1(websocket2, req, "Maximum redirects exceeded");
        return;
      }
      req.abort();
      let addr;
      try {
        addr = new URL2(location2, address);
      } catch (e) {
        const err = new SyntaxError(`Invalid URL: ${location2}`);
        emitErrorAndClose(websocket2, err);
        return;
      }
      initAsClient(websocket2, addr, protocols, options);
    } else if (!websocket2.emit("unexpected-response", req, res)) {
      abortHandshake$1(
        websocket2,
        req,
        `Unexpected server response: ${res.statusCode}`
      );
    }
  });
  req.on("upgrade", (res, socket, head) => {
    websocket2.emit("upgrade", res);
    if (websocket2.readyState !== WebSocket$1.CONNECTING)
      return;
    req = websocket2._req = null;
    if (res.headers.upgrade.toLowerCase() !== "websocket") {
      abortHandshake$1(websocket2, socket, "Invalid Upgrade header");
      return;
    }
    const digest = createHash$1("sha1").update(key + GUID$1).digest("base64");
    if (res.headers["sec-websocket-accept"] !== digest) {
      abortHandshake$1(websocket2, socket, "Invalid Sec-WebSocket-Accept header");
      return;
    }
    const serverProt = res.headers["sec-websocket-protocol"];
    let protError;
    if (serverProt !== void 0) {
      if (!protocolSet.size) {
        protError = "Server sent a subprotocol but none was requested";
      } else if (!protocolSet.has(serverProt)) {
        protError = "Server sent an invalid subprotocol";
      }
    } else if (protocolSet.size) {
      protError = "Server sent no subprotocol";
    }
    if (protError) {
      abortHandshake$1(websocket2, socket, protError);
      return;
    }
    if (serverProt)
      websocket2._protocol = serverProt;
    const secWebSocketExtensions = res.headers["sec-websocket-extensions"];
    if (secWebSocketExtensions !== void 0) {
      if (!perMessageDeflate) {
        const message = "Server sent a Sec-WebSocket-Extensions header but no extension was requested";
        abortHandshake$1(websocket2, socket, message);
        return;
      }
      let extensions;
      try {
        extensions = parse$1(secWebSocketExtensions);
      } catch (err) {
        const message = "Invalid Sec-WebSocket-Extensions header";
        abortHandshake$1(websocket2, socket, message);
        return;
      }
      const extensionNames = Object.keys(extensions);
      if (extensionNames.length !== 1 || extensionNames[0] !== PerMessageDeflate$1.extensionName) {
        const message = "Server indicated an extension that was not requested";
        abortHandshake$1(websocket2, socket, message);
        return;
      }
      try {
        perMessageDeflate.accept(extensions[PerMessageDeflate$1.extensionName]);
      } catch (err) {
        const message = "Invalid Sec-WebSocket-Extensions header";
        abortHandshake$1(websocket2, socket, message);
        return;
      }
      websocket2._extensions[PerMessageDeflate$1.extensionName] = perMessageDeflate;
    }
    websocket2.setSocket(socket, head, {
      generateMask: opts.generateMask,
      maxPayload: opts.maxPayload,
      skipUTF8Validation: opts.skipUTF8Validation
    });
  });
  if (opts.finishRequest) {
    opts.finishRequest(req, websocket2);
  } else {
    req.end();
  }
}
function emitErrorAndClose(websocket2, err) {
  websocket2._readyState = WebSocket$1.CLOSING;
  websocket2.emit("error", err);
  websocket2.emitClose();
}
function netConnect(options) {
  options.path = options.socketPath;
  return net.connect(options);
}
function tlsConnect(options) {
  options.path = void 0;
  if (!options.servername && options.servername !== "") {
    options.servername = net.isIP(options.host) ? "" : options.host;
  }
  return tls.connect(options);
}
function abortHandshake$1(websocket2, stream22, message) {
  websocket2._readyState = WebSocket$1.CLOSING;
  const err = new Error(message);
  Error.captureStackTrace(err, abortHandshake$1);
  if (stream22.setHeader) {
    stream22[kAborted] = true;
    stream22.abort();
    if (stream22.socket && !stream22.socket.destroyed) {
      stream22.socket.destroy();
    }
    process.nextTick(emitErrorAndClose, websocket2, err);
  } else {
    stream22.destroy(err);
    stream22.once("error", websocket2.emit.bind(websocket2, "error"));
    stream22.once("close", websocket2.emitClose.bind(websocket2));
  }
}
function sendAfterClose(websocket2, data, cb) {
  if (data) {
    const length = toBuffer(data).length;
    if (websocket2._socket)
      websocket2._sender._bufferedBytes += length;
    else
      websocket2._bufferedAmount += length;
  }
  if (cb) {
    const err = new Error(
      `WebSocket is not open: readyState ${websocket2.readyState} (${readyStates[websocket2.readyState]})`
    );
    process.nextTick(cb, err);
  }
}
function receiverOnConclude(code, reason) {
  const websocket2 = this[kWebSocket$1];
  websocket2._closeFrameReceived = true;
  websocket2._closeMessage = reason;
  websocket2._closeCode = code;
  if (websocket2._socket[kWebSocket$1] === void 0)
    return;
  websocket2._socket.removeListener("data", socketOnData);
  process.nextTick(resume, websocket2._socket);
  if (code === 1005)
    websocket2.close();
  else
    websocket2.close(code, reason);
}
function receiverOnDrain() {
  const websocket2 = this[kWebSocket$1];
  if (!websocket2.isPaused)
    websocket2._socket.resume();
}
function receiverOnError(err) {
  const websocket2 = this[kWebSocket$1];
  if (websocket2._socket[kWebSocket$1] !== void 0) {
    websocket2._socket.removeListener("data", socketOnData);
    process.nextTick(resume, websocket2._socket);
    websocket2.close(err[kStatusCode]);
  }
  websocket2.emit("error", err);
}
function receiverOnFinish() {
  this[kWebSocket$1].emitClose();
}
function receiverOnMessage(data, isBinary) {
  this[kWebSocket$1].emit("message", data, isBinary);
}
function receiverOnPing(data) {
  const websocket2 = this[kWebSocket$1];
  websocket2.pong(data, !websocket2._isServer, NOOP);
  websocket2.emit("ping", data);
}
function receiverOnPong(data) {
  this[kWebSocket$1].emit("pong", data);
}
function resume(stream22) {
  stream22.resume();
}
function socketOnClose() {
  const websocket2 = this[kWebSocket$1];
  this.removeListener("close", socketOnClose);
  this.removeListener("data", socketOnData);
  this.removeListener("end", socketOnEnd);
  websocket2._readyState = WebSocket$1.CLOSING;
  let chunk;
  if (!this._readableState.endEmitted && !websocket2._closeFrameReceived && !websocket2._receiver._writableState.errorEmitted && (chunk = websocket2._socket.read()) !== null) {
    websocket2._receiver.write(chunk);
  }
  websocket2._receiver.end();
  this[kWebSocket$1] = void 0;
  clearTimeout(websocket2._closeTimer);
  if (websocket2._receiver._writableState.finished || websocket2._receiver._writableState.errorEmitted) {
    websocket2.emitClose();
  } else {
    websocket2._receiver.on("error", receiverOnFinish);
    websocket2._receiver.on("finish", receiverOnFinish);
  }
}
function socketOnData(chunk) {
  if (!this[kWebSocket$1]._receiver.write(chunk)) {
    this.pause();
  }
}
function socketOnEnd() {
  const websocket2 = this[kWebSocket$1];
  websocket2._readyState = WebSocket$1.CLOSING;
  websocket2._receiver.end();
  this.end();
}
function socketOnError$1() {
  const websocket2 = this[kWebSocket$1];
  this.removeListener("error", socketOnError$1);
  this.on("error", NOOP);
  if (websocket2) {
    websocket2._readyState = WebSocket$1.CLOSING;
    this.destroy();
  }
}
function parse(header) {
  const protocols = /* @__PURE__ */ new Set();
  let start = -1;
  let end = -1;
  let i = 0;
  for (i; i < header.length; i++) {
    const code = header.charCodeAt(i);
    if (end === -1 && tokenChars[code] === 1) {
      if (start === -1)
        start = i;
    } else if (i !== 0 && (code === 32 || code === 9)) {
      if (end === -1 && start !== -1)
        end = i;
    } else if (code === 44) {
      if (start === -1) {
        throw new SyntaxError(`Unexpected character at index ${i}`);
      }
      if (end === -1)
        end = i;
      const protocol2 = header.slice(start, end);
      if (protocols.has(protocol2)) {
        throw new SyntaxError(`The "${protocol2}" subprotocol is duplicated`);
      }
      protocols.add(protocol2);
      start = end = -1;
    } else {
      throw new SyntaxError(`Unexpected character at index ${i}`);
    }
  }
  if (start === -1 || end !== -1) {
    throw new SyntaxError("Unexpected end of input");
  }
  const protocol = header.slice(start, i);
  if (protocols.has(protocol)) {
    throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
  }
  protocols.add(protocol);
  return protocols;
}
function addListeners(server, map) {
  for (const event of Object.keys(map))
    server.on(event, map[event]);
  return function removeListeners() {
    for (const event of Object.keys(map)) {
      server.removeListener(event, map[event]);
    }
  };
}
function emitClose(server) {
  server._state = CLOSED;
  server.emit("close");
}
function socketOnError() {
  this.destroy();
}
function abortHandshake(socket, code, message, headers) {
  message = message || http.STATUS_CODES[code];
  headers = {
    Connection: "close",
    "Content-Type": "text/html",
    "Content-Length": Buffer.byteLength(message),
    ...headers
  };
  socket.once("finish", socket.destroy);
  socket.end(
    `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r
` + Object.keys(headers).map((h) => `${h}: ${headers[h]}`).join("\r\n") + "\r\n\r\n" + message
  );
}
function abortHandshakeOrEmitwsClientError(server, req, socket, code, message) {
  if (server.listenerCount("wsClientError")) {
    const err = new Error(message);
    Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);
    server.emit("wsClientError", err, socket, req);
  } else {
    abortHandshake(socket, code, message);
  }
}
var Duplex, stream, stream$1, bufferUtil$1, constants, bufferutil, nodeGypBuild$1, nodeGypBuild, hasRequiredNodeGypBuild$1, hasRequiredNodeGypBuild, fallback, hasRequiredFallback, hasRequiredBufferutil, unmask$1, mask, EMPTY_BUFFER$3, FastBuffer$2, bufferUtilExports, kDone, kRun, Limiter$1, limiter, zlib, bufferUtil, Limiter2, kStatusCode$2, FastBuffer$1, TRAILER, kPerMessageDeflate, kTotalLength, kCallback, kBuffers, kError$1, zlibLimiter, PerMessageDeflate$4, permessageDeflate, validation, __viteOptionalPeerDep_utf8Validate_ws, __viteOptionalPeerDep_utf8Validate_ws$1, require$$1, isValidUTF8_1, isUtf8, tokenChars$2, validationExports, Writable, PerMessageDeflate$3, BINARY_TYPES$1, EMPTY_BUFFER$2, kStatusCode$1, kWebSocket$2, concat, toArrayBuffer, unmask, isValidStatusCode$1, isValidUTF8, FastBuffer, GET_INFO, GET_PAYLOAD_LENGTH_16, GET_PAYLOAD_LENGTH_64, GET_MASK, GET_DATA, INFLATING, Receiver$1, receiver, receiver$1, randomFillSync, PerMessageDeflate$2, EMPTY_BUFFER$1, isValidStatusCode, applyMask, toBuffer$1, kByteLength, maskBuffer, Sender$1, sender, sender$1, kForOnEventAttribute$1, kListener$1, kCode, kData, kError, kMessage, kReason, kTarget, kType, kWasClean, Event, CloseEvent, ErrorEvent, MessageEvent, EventTarget, eventTarget, tokenChars$1, extension$1, EventEmitter$1, https, http$1, net, tls, randomBytes, createHash$1, URL2, PerMessageDeflate$1, Receiver2, Sender2, BINARY_TYPES, EMPTY_BUFFER, GUID$1, kForOnEventAttribute, kListener, kStatusCode, kWebSocket$1, NOOP, addEventListener2, removeEventListener, format, parse$1, toBuffer, closeTimeout, kAborted, protocolVersions, readyStates, subprotocolRegex, WebSocket$1, websocket, WebSocket$2, tokenChars, subprotocol$1, EventEmitter, http, createHash, extension, PerMessageDeflate2, subprotocol, WebSocket22, GUID, kWebSocket, keyRegex, RUNNING, CLOSING, CLOSED, WebSocketServer, websocketServer, websocketServer$1;
var init_wrapper_CviSselG = __esm({
  "node_modules/@gradio/client/dist/wrapper-CviSselG.js"() {
    ({ Duplex } = require$$0);
    stream = createWebSocketStream;
    stream$1 = /* @__PURE__ */ getDefaultExportFromCjs(stream);
    bufferUtil$1 = { exports: {} };
    constants = {
      BINARY_TYPES: ["nodebuffer", "arraybuffer", "fragments"],
      EMPTY_BUFFER: Buffer.alloc(0),
      GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
      kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
      kListener: Symbol("kListener"),
      kStatusCode: Symbol("status-code"),
      kWebSocket: Symbol("websocket"),
      NOOP: () => {
      }
    };
    bufferutil = { exports: {} };
    nodeGypBuild$1 = { exports: {} };
    ({ EMPTY_BUFFER: EMPTY_BUFFER$3 } = constants);
    FastBuffer$2 = Buffer[Symbol.species];
    bufferUtil$1.exports = {
      concat: concat$1,
      mask: _mask,
      toArrayBuffer: toArrayBuffer$1,
      toBuffer: toBuffer$2,
      unmask: _unmask
    };
    if (!process.env.WS_NO_BUFFER_UTIL) {
      try {
        const bufferUtil2 = requireBufferutil();
        mask = bufferUtil$1.exports.mask = function(source, mask2, output, offset, length) {
          if (length < 48)
            _mask(source, mask2, output, offset, length);
          else
            bufferUtil2.mask(source, mask2, output, offset, length);
        };
        unmask$1 = bufferUtil$1.exports.unmask = function(buffer, mask2) {
          if (buffer.length < 32)
            _unmask(buffer, mask2);
          else
            bufferUtil2.unmask(buffer, mask2);
        };
      } catch (e) {
      }
    }
    bufferUtilExports = bufferUtil$1.exports;
    kDone = Symbol("kDone");
    kRun = Symbol("kRun");
    Limiter$1 = class Limiter {
      /**
       * Creates a new `Limiter`.
       *
       * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
       *     to run concurrently
       */
      constructor(concurrency) {
        this[kDone] = () => {
          this.pending--;
          this[kRun]();
        };
        this.concurrency = concurrency || Infinity;
        this.jobs = [];
        this.pending = 0;
      }
      /**
       * Adds a job to the queue.
       *
       * @param {Function} job The job to run
       * @public
       */
      add(job) {
        this.jobs.push(job);
        this[kRun]();
      }
      /**
       * Removes a job from the queue and runs it if possible.
       *
       * @private
       */
      [kRun]() {
        if (this.pending === this.concurrency)
          return;
        if (this.jobs.length) {
          const job = this.jobs.shift();
          this.pending++;
          job(this[kDone]);
        }
      }
    };
    limiter = Limiter$1;
    zlib = require$$0$2;
    bufferUtil = bufferUtilExports;
    Limiter2 = limiter;
    ({ kStatusCode: kStatusCode$2 } = constants);
    FastBuffer$1 = Buffer[Symbol.species];
    TRAILER = Buffer.from([0, 0, 255, 255]);
    kPerMessageDeflate = Symbol("permessage-deflate");
    kTotalLength = Symbol("total-length");
    kCallback = Symbol("callback");
    kBuffers = Symbol("buffers");
    kError$1 = Symbol("error");
    PerMessageDeflate$4 = class PerMessageDeflate {
      /**
       * Creates a PerMessageDeflate instance.
       *
       * @param {Object} [options] Configuration options
       * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
       *     for, or request, a custom client window size
       * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
       *     acknowledge disabling of client context takeover
       * @param {Number} [options.concurrencyLimit=10] The number of concurrent
       *     calls to zlib
       * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
       *     use of a custom server window size
       * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
       *     disabling of server context takeover
       * @param {Number} [options.threshold=1024] Size (in bytes) below which
       *     messages should not be compressed if context takeover is disabled
       * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
       *     deflate
       * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
       *     inflate
       * @param {Boolean} [isServer=false] Create the instance in either server or
       *     client mode
       * @param {Number} [maxPayload=0] The maximum allowed message length
       */
      constructor(options, isServer, maxPayload) {
        this._maxPayload = maxPayload | 0;
        this._options = options || {};
        this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024;
        this._isServer = !!isServer;
        this._deflate = null;
        this._inflate = null;
        this.params = null;
        if (!zlibLimiter) {
          const concurrency = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
          zlibLimiter = new Limiter2(concurrency);
        }
      }
      /**
       * @type {String}
       */
      static get extensionName() {
        return "permessage-deflate";
      }
      /**
       * Create an extension negotiation offer.
       *
       * @return {Object} Extension parameters
       * @public
       */
      offer() {
        const params = {};
        if (this._options.serverNoContextTakeover) {
          params.server_no_context_takeover = true;
        }
        if (this._options.clientNoContextTakeover) {
          params.client_no_context_takeover = true;
        }
        if (this._options.serverMaxWindowBits) {
          params.server_max_window_bits = this._options.serverMaxWindowBits;
        }
        if (this._options.clientMaxWindowBits) {
          params.client_max_window_bits = this._options.clientMaxWindowBits;
        } else if (this._options.clientMaxWindowBits == null) {
          params.client_max_window_bits = true;
        }
        return params;
      }
      /**
       * Accept an extension negotiation offer/response.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Object} Accepted configuration
       * @public
       */
      accept(configurations) {
        configurations = this.normalizeParams(configurations);
        this.params = this._isServer ? this.acceptAsServer(configurations) : this.acceptAsClient(configurations);
        return this.params;
      }
      /**
       * Releases all resources used by the extension.
       *
       * @public
       */
      cleanup() {
        if (this._inflate) {
          this._inflate.close();
          this._inflate = null;
        }
        if (this._deflate) {
          const callback = this._deflate[kCallback];
          this._deflate.close();
          this._deflate = null;
          if (callback) {
            callback(
              new Error(
                "The deflate stream was closed while data was being processed"
              )
            );
          }
        }
      }
      /**
       *  Accept an extension negotiation offer.
       *
       * @param {Array} offers The extension negotiation offers
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsServer(offers) {
        const opts = this._options;
        const accepted = offers.find((params) => {
          if (opts.serverNoContextTakeover === false && params.server_no_context_takeover || params.server_max_window_bits && (opts.serverMaxWindowBits === false || typeof opts.serverMaxWindowBits === "number" && opts.serverMaxWindowBits > params.server_max_window_bits) || typeof opts.clientMaxWindowBits === "number" && !params.client_max_window_bits) {
            return false;
          }
          return true;
        });
        if (!accepted) {
          throw new Error("None of the extension offers can be accepted");
        }
        if (opts.serverNoContextTakeover) {
          accepted.server_no_context_takeover = true;
        }
        if (opts.clientNoContextTakeover) {
          accepted.client_no_context_takeover = true;
        }
        if (typeof opts.serverMaxWindowBits === "number") {
          accepted.server_max_window_bits = opts.serverMaxWindowBits;
        }
        if (typeof opts.clientMaxWindowBits === "number") {
          accepted.client_max_window_bits = opts.clientMaxWindowBits;
        } else if (accepted.client_max_window_bits === true || opts.clientMaxWindowBits === false) {
          delete accepted.client_max_window_bits;
        }
        return accepted;
      }
      /**
       * Accept the extension negotiation response.
       *
       * @param {Array} response The extension negotiation response
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsClient(response) {
        const params = response[0];
        if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) {
          throw new Error('Unexpected parameter "client_no_context_takeover"');
        }
        if (!params.client_max_window_bits) {
          if (typeof this._options.clientMaxWindowBits === "number") {
            params.client_max_window_bits = this._options.clientMaxWindowBits;
          }
        } else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && params.client_max_window_bits > this._options.clientMaxWindowBits) {
          throw new Error(
            'Unexpected or invalid parameter "client_max_window_bits"'
          );
        }
        return params;
      }
      /**
       * Normalize parameters.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Array} The offers/response with normalized parameters
       * @private
       */
      normalizeParams(configurations) {
        configurations.forEach((params) => {
          Object.keys(params).forEach((key) => {
            let value = params[key];
            if (value.length > 1) {
              throw new Error(`Parameter "${key}" must have only a single value`);
            }
            value = value[0];
            if (key === "client_max_window_bits") {
              if (value !== true) {
                const num = +value;
                if (!Number.isInteger(num) || num < 8 || num > 15) {
                  throw new TypeError(
                    `Invalid value for parameter "${key}": ${value}`
                  );
                }
                value = num;
              } else if (!this._isServer) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else if (key === "server_max_window_bits") {
              const num = +value;
              if (!Number.isInteger(num) || num < 8 || num > 15) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
              value = num;
            } else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
              if (value !== true) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else {
              throw new Error(`Unknown parameter "${key}"`);
            }
            params[key] = value;
          });
        });
        return configurations;
      }
      /**
       * Decompress data. Concurrency limited.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      decompress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._decompress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Compress data. Concurrency limited.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      compress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._compress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Decompress data.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _decompress(data, fin, callback) {
        const endpoint = this._isServer ? "client" : "server";
        if (!this._inflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._inflate = zlib.createInflateRaw({
            ...this._options.zlibInflateOptions,
            windowBits
          });
          this._inflate[kPerMessageDeflate] = this;
          this._inflate[kTotalLength] = 0;
          this._inflate[kBuffers] = [];
          this._inflate.on("error", inflateOnError);
          this._inflate.on("data", inflateOnData);
        }
        this._inflate[kCallback] = callback;
        this._inflate.write(data);
        if (fin)
          this._inflate.write(TRAILER);
        this._inflate.flush(() => {
          const err = this._inflate[kError$1];
          if (err) {
            this._inflate.close();
            this._inflate = null;
            callback(err);
            return;
          }
          const data2 = bufferUtil.concat(
            this._inflate[kBuffers],
            this._inflate[kTotalLength]
          );
          if (this._inflate._readableState.endEmitted) {
            this._inflate.close();
            this._inflate = null;
          } else {
            this._inflate[kTotalLength] = 0;
            this._inflate[kBuffers] = [];
            if (fin && this.params[`${endpoint}_no_context_takeover`]) {
              this._inflate.reset();
            }
          }
          callback(null, data2);
        });
      }
      /**
       * Compress data.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _compress(data, fin, callback) {
        const endpoint = this._isServer ? "server" : "client";
        if (!this._deflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._deflate = zlib.createDeflateRaw({
            ...this._options.zlibDeflateOptions,
            windowBits
          });
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          this._deflate.on("data", deflateOnData);
        }
        this._deflate[kCallback] = callback;
        this._deflate.write(data);
        this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
          if (!this._deflate) {
            return;
          }
          let data2 = bufferUtil.concat(
            this._deflate[kBuffers],
            this._deflate[kTotalLength]
          );
          if (fin) {
            data2 = new FastBuffer$1(data2.buffer, data2.byteOffset, data2.length - 4);
          }
          this._deflate[kCallback] = null;
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          if (fin && this.params[`${endpoint}_no_context_takeover`]) {
            this._deflate.reset();
          }
          callback(null, data2);
        });
      }
    };
    permessageDeflate = PerMessageDeflate$4;
    validation = { exports: {} };
    __viteOptionalPeerDep_utf8Validate_ws = {};
    __viteOptionalPeerDep_utf8Validate_ws$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: __viteOptionalPeerDep_utf8Validate_ws
    }, Symbol.toStringTag, { value: "Module" }));
    require$$1 = /* @__PURE__ */ getAugmentedNamespace(__viteOptionalPeerDep_utf8Validate_ws$1);
    ({ isUtf8 } = require$$0$3);
    tokenChars$2 = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 0 - 15
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 16 - 31
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      1,
      1,
      0,
      // 32 - 47
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      // 48 - 63
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 64 - 79
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      // 80 - 95
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 96 - 111
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      0,
      1,
      0
      // 112 - 127
    ];
    validation.exports = {
      isValidStatusCode: isValidStatusCode$2,
      isValidUTF8: _isValidUTF8,
      tokenChars: tokenChars$2
    };
    if (isUtf8) {
      isValidUTF8_1 = validation.exports.isValidUTF8 = function(buf) {
        return buf.length < 24 ? _isValidUTF8(buf) : isUtf8(buf);
      };
    } else if (!process.env.WS_NO_UTF_8_VALIDATE) {
      try {
        const isValidUTF82 = require$$1;
        isValidUTF8_1 = validation.exports.isValidUTF8 = function(buf) {
          return buf.length < 32 ? _isValidUTF8(buf) : isValidUTF82(buf);
        };
      } catch (e) {
      }
    }
    validationExports = validation.exports;
    ({ Writable } = require$$0);
    PerMessageDeflate$3 = permessageDeflate;
    ({
      BINARY_TYPES: BINARY_TYPES$1,
      EMPTY_BUFFER: EMPTY_BUFFER$2,
      kStatusCode: kStatusCode$1,
      kWebSocket: kWebSocket$2
    } = constants);
    ({ concat, toArrayBuffer, unmask } = bufferUtilExports);
    ({ isValidStatusCode: isValidStatusCode$1, isValidUTF8 } = validationExports);
    FastBuffer = Buffer[Symbol.species];
    GET_INFO = 0;
    GET_PAYLOAD_LENGTH_16 = 1;
    GET_PAYLOAD_LENGTH_64 = 2;
    GET_MASK = 3;
    GET_DATA = 4;
    INFLATING = 5;
    Receiver$1 = class Receiver extends Writable {
      /**
       * Creates a Receiver instance.
       *
       * @param {Object} [options] Options object
       * @param {String} [options.binaryType=nodebuffer] The type for binary data
       * @param {Object} [options.extensions] An object containing the negotiated
       *     extensions
       * @param {Boolean} [options.isServer=false] Specifies whether to operate in
       *     client or server mode
       * @param {Number} [options.maxPayload=0] The maximum allowed message length
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       */
      constructor(options = {}) {
        super();
        this._binaryType = options.binaryType || BINARY_TYPES$1[0];
        this._extensions = options.extensions || {};
        this._isServer = !!options.isServer;
        this._maxPayload = options.maxPayload | 0;
        this._skipUTF8Validation = !!options.skipUTF8Validation;
        this[kWebSocket$2] = void 0;
        this._bufferedBytes = 0;
        this._buffers = [];
        this._compressed = false;
        this._payloadLength = 0;
        this._mask = void 0;
        this._fragmented = 0;
        this._masked = false;
        this._fin = false;
        this._opcode = 0;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._fragments = [];
        this._state = GET_INFO;
        this._loop = false;
      }
      /**
       * Implements `Writable.prototype._write()`.
       *
       * @param {Buffer} chunk The chunk of data to write
       * @param {String} encoding The character encoding of `chunk`
       * @param {Function} cb Callback
       * @private
       */
      _write(chunk, encoding, cb) {
        if (this._opcode === 8 && this._state == GET_INFO)
          return cb();
        this._bufferedBytes += chunk.length;
        this._buffers.push(chunk);
        this.startLoop(cb);
      }
      /**
       * Consumes `n` bytes from the buffered data.
       *
       * @param {Number} n The number of bytes to consume
       * @return {Buffer} The consumed bytes
       * @private
       */
      consume(n) {
        this._bufferedBytes -= n;
        if (n === this._buffers[0].length)
          return this._buffers.shift();
        if (n < this._buffers[0].length) {
          const buf = this._buffers[0];
          this._buffers[0] = new FastBuffer(
            buf.buffer,
            buf.byteOffset + n,
            buf.length - n
          );
          return new FastBuffer(buf.buffer, buf.byteOffset, n);
        }
        const dst = Buffer.allocUnsafe(n);
        do {
          const buf = this._buffers[0];
          const offset = dst.length - n;
          if (n >= buf.length) {
            dst.set(this._buffers.shift(), offset);
          } else {
            dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
            this._buffers[0] = new FastBuffer(
              buf.buffer,
              buf.byteOffset + n,
              buf.length - n
            );
          }
          n -= buf.length;
        } while (n > 0);
        return dst;
      }
      /**
       * Starts the parsing loop.
       *
       * @param {Function} cb Callback
       * @private
       */
      startLoop(cb) {
        let err;
        this._loop = true;
        do {
          switch (this._state) {
            case GET_INFO:
              err = this.getInfo();
              break;
            case GET_PAYLOAD_LENGTH_16:
              err = this.getPayloadLength16();
              break;
            case GET_PAYLOAD_LENGTH_64:
              err = this.getPayloadLength64();
              break;
            case GET_MASK:
              this.getMask();
              break;
            case GET_DATA:
              err = this.getData(cb);
              break;
            default:
              this._loop = false;
              return;
          }
        } while (this._loop);
        cb(err);
      }
      /**
       * Reads the first two bytes of a frame.
       *
       * @return {(RangeError|undefined)} A possible error
       * @private
       */
      getInfo() {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        const buf = this.consume(2);
        if ((buf[0] & 48) !== 0) {
          this._loop = false;
          return error(
            RangeError,
            "RSV2 and RSV3 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_2_3"
          );
        }
        const compressed = (buf[0] & 64) === 64;
        if (compressed && !this._extensions[PerMessageDeflate$3.extensionName]) {
          this._loop = false;
          return error(
            RangeError,
            "RSV1 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_1"
          );
        }
        this._fin = (buf[0] & 128) === 128;
        this._opcode = buf[0] & 15;
        this._payloadLength = buf[1] & 127;
        if (this._opcode === 0) {
          if (compressed) {
            this._loop = false;
            return error(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
          }
          if (!this._fragmented) {
            this._loop = false;
            return error(
              RangeError,
              "invalid opcode 0",
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
          }
          this._opcode = this._fragmented;
        } else if (this._opcode === 1 || this._opcode === 2) {
          if (this._fragmented) {
            this._loop = false;
            return error(
              RangeError,
              `invalid opcode ${this._opcode}`,
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
          }
          this._compressed = compressed;
        } else if (this._opcode > 7 && this._opcode < 11) {
          if (!this._fin) {
            this._loop = false;
            return error(
              RangeError,
              "FIN must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_FIN"
            );
          }
          if (compressed) {
            this._loop = false;
            return error(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
          }
          if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
            this._loop = false;
            return error(
              RangeError,
              `invalid payload length ${this._payloadLength}`,
              true,
              1002,
              "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH"
            );
          }
        } else {
          this._loop = false;
          return error(
            RangeError,
            `invalid opcode ${this._opcode}`,
            true,
            1002,
            "WS_ERR_INVALID_OPCODE"
          );
        }
        if (!this._fin && !this._fragmented)
          this._fragmented = this._opcode;
        this._masked = (buf[1] & 128) === 128;
        if (this._isServer) {
          if (!this._masked) {
            this._loop = false;
            return error(
              RangeError,
              "MASK must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_MASK"
            );
          }
        } else if (this._masked) {
          this._loop = false;
          return error(
            RangeError,
            "MASK must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_MASK"
          );
        }
        if (this._payloadLength === 126)
          this._state = GET_PAYLOAD_LENGTH_16;
        else if (this._payloadLength === 127)
          this._state = GET_PAYLOAD_LENGTH_64;
        else
          return this.haveLength();
      }
      /**
       * Gets extended payload length (7+16).
       *
       * @return {(RangeError|undefined)} A possible error
       * @private
       */
      getPayloadLength16() {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        this._payloadLength = this.consume(2).readUInt16BE(0);
        return this.haveLength();
      }
      /**
       * Gets extended payload length (7+64).
       *
       * @return {(RangeError|undefined)} A possible error
       * @private
       */
      getPayloadLength64() {
        if (this._bufferedBytes < 8) {
          this._loop = false;
          return;
        }
        const buf = this.consume(8);
        const num = buf.readUInt32BE(0);
        if (num > Math.pow(2, 53 - 32) - 1) {
          this._loop = false;
          return error(
            RangeError,
            "Unsupported WebSocket frame: payload length > 2^53 - 1",
            false,
            1009,
            "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH"
          );
        }
        this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
        return this.haveLength();
      }
      /**
       * Payload length has been read.
       *
       * @return {(RangeError|undefined)} A possible error
       * @private
       */
      haveLength() {
        if (this._payloadLength && this._opcode < 8) {
          this._totalPayloadLength += this._payloadLength;
          if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
            this._loop = false;
            return error(
              RangeError,
              "Max payload size exceeded",
              false,
              1009,
              "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
            );
          }
        }
        if (this._masked)
          this._state = GET_MASK;
        else
          this._state = GET_DATA;
      }
      /**
       * Reads mask bytes.
       *
       * @private
       */
      getMask() {
        if (this._bufferedBytes < 4) {
          this._loop = false;
          return;
        }
        this._mask = this.consume(4);
        this._state = GET_DATA;
      }
      /**
       * Reads data bytes.
       *
       * @param {Function} cb Callback
       * @return {(Error|RangeError|undefined)} A possible error
       * @private
       */
      getData(cb) {
        let data = EMPTY_BUFFER$2;
        if (this._payloadLength) {
          if (this._bufferedBytes < this._payloadLength) {
            this._loop = false;
            return;
          }
          data = this.consume(this._payloadLength);
          if (this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) {
            unmask(data, this._mask);
          }
        }
        if (this._opcode > 7)
          return this.controlMessage(data);
        if (this._compressed) {
          this._state = INFLATING;
          this.decompress(data, cb);
          return;
        }
        if (data.length) {
          this._messageLength = this._totalPayloadLength;
          this._fragments.push(data);
        }
        return this.dataMessage();
      }
      /**
       * Decompresses data.
       *
       * @param {Buffer} data Compressed data
       * @param {Function} cb Callback
       * @private
       */
      decompress(data, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate$3.extensionName];
        perMessageDeflate.decompress(data, this._fin, (err, buf) => {
          if (err)
            return cb(err);
          if (buf.length) {
            this._messageLength += buf.length;
            if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
              return cb(
                error(
                  RangeError,
                  "Max payload size exceeded",
                  false,
                  1009,
                  "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
                )
              );
            }
            this._fragments.push(buf);
          }
          const er = this.dataMessage();
          if (er)
            return cb(er);
          this.startLoop(cb);
        });
      }
      /**
       * Handles a data message.
       *
       * @return {(Error|undefined)} A possible error
       * @private
       */
      dataMessage() {
        if (this._fin) {
          const messageLength = this._messageLength;
          const fragments = this._fragments;
          this._totalPayloadLength = 0;
          this._messageLength = 0;
          this._fragmented = 0;
          this._fragments = [];
          if (this._opcode === 2) {
            let data;
            if (this._binaryType === "nodebuffer") {
              data = concat(fragments, messageLength);
            } else if (this._binaryType === "arraybuffer") {
              data = toArrayBuffer(concat(fragments, messageLength));
            } else {
              data = fragments;
            }
            this.emit("message", data, true);
          } else {
            const buf = concat(fragments, messageLength);
            if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
              this._loop = false;
              return error(
                Error,
                "invalid UTF-8 sequence",
                true,
                1007,
                "WS_ERR_INVALID_UTF8"
              );
            }
            this.emit("message", buf, false);
          }
        }
        this._state = GET_INFO;
      }
      /**
       * Handles a control message.
       *
       * @param {Buffer} data Data to handle
       * @return {(Error|RangeError|undefined)} A possible error
       * @private
       */
      controlMessage(data) {
        if (this._opcode === 8) {
          this._loop = false;
          if (data.length === 0) {
            this.emit("conclude", 1005, EMPTY_BUFFER$2);
            this.end();
          } else {
            const code = data.readUInt16BE(0);
            if (!isValidStatusCode$1(code)) {
              return error(
                RangeError,
                `invalid status code ${code}`,
                true,
                1002,
                "WS_ERR_INVALID_CLOSE_CODE"
              );
            }
            const buf = new FastBuffer(
              data.buffer,
              data.byteOffset + 2,
              data.length - 2
            );
            if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
              return error(
                Error,
                "invalid UTF-8 sequence",
                true,
                1007,
                "WS_ERR_INVALID_UTF8"
              );
            }
            this.emit("conclude", code, buf);
            this.end();
          }
        } else if (this._opcode === 9) {
          this.emit("ping", data);
        } else {
          this.emit("pong", data);
        }
        this._state = GET_INFO;
      }
    };
    receiver = Receiver$1;
    receiver$1 = /* @__PURE__ */ getDefaultExportFromCjs(receiver);
    ({ randomFillSync } = require$$5);
    PerMessageDeflate$2 = permessageDeflate;
    ({ EMPTY_BUFFER: EMPTY_BUFFER$1 } = constants);
    ({ isValidStatusCode } = validationExports);
    ({ mask: applyMask, toBuffer: toBuffer$1 } = bufferUtilExports);
    kByteLength = Symbol("kByteLength");
    maskBuffer = Buffer.alloc(4);
    Sender$1 = class Sender {
      /**
       * Creates a Sender instance.
       *
       * @param {(net.Socket|tls.Socket)} socket The connection socket
       * @param {Object} [extensions] An object containing the negotiated extensions
       * @param {Function} [generateMask] The function used to generate the masking
       *     key
       */
      constructor(socket, extensions, generateMask) {
        this._extensions = extensions || {};
        if (generateMask) {
          this._generateMask = generateMask;
          this._maskBuffer = Buffer.alloc(4);
        }
        this._socket = socket;
        this._firstFragment = true;
        this._compress = false;
        this._bufferedBytes = 0;
        this._deflating = false;
        this._queue = [];
      }
      /**
       * Frames a piece of data according to the HyBi WebSocket protocol.
       *
       * @param {(Buffer|String)} data The data to frame
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @return {(Buffer|String)[]} The framed data
       * @public
       */
      static frame(data, options) {
        let mask2;
        let merge = false;
        let offset = 2;
        let skipMasking = false;
        if (options.mask) {
          mask2 = options.maskBuffer || maskBuffer;
          if (options.generateMask) {
            options.generateMask(mask2);
          } else {
            randomFillSync(mask2, 0, 4);
          }
          skipMasking = (mask2[0] | mask2[1] | mask2[2] | mask2[3]) === 0;
          offset = 6;
        }
        let dataLength;
        if (typeof data === "string") {
          if ((!options.mask || skipMasking) && options[kByteLength] !== void 0) {
            dataLength = options[kByteLength];
          } else {
            data = Buffer.from(data);
            dataLength = data.length;
          }
        } else {
          dataLength = data.length;
          merge = options.mask && options.readOnly && !skipMasking;
        }
        let payloadLength = dataLength;
        if (dataLength >= 65536) {
          offset += 8;
          payloadLength = 127;
        } else if (dataLength > 125) {
          offset += 2;
          payloadLength = 126;
        }
        const target = Buffer.allocUnsafe(merge ? dataLength + offset : offset);
        target[0] = options.fin ? options.opcode | 128 : options.opcode;
        if (options.rsv1)
          target[0] |= 64;
        target[1] = payloadLength;
        if (payloadLength === 126) {
          target.writeUInt16BE(dataLength, 2);
        } else if (payloadLength === 127) {
          target[2] = target[3] = 0;
          target.writeUIntBE(dataLength, 4, 6);
        }
        if (!options.mask)
          return [target, data];
        target[1] |= 128;
        target[offset - 4] = mask2[0];
        target[offset - 3] = mask2[1];
        target[offset - 2] = mask2[2];
        target[offset - 1] = mask2[3];
        if (skipMasking)
          return [target, data];
        if (merge) {
          applyMask(data, mask2, target, offset, dataLength);
          return [target];
        }
        applyMask(data, mask2, data, 0, dataLength);
        return [target, data];
      }
      /**
       * Sends a close message to the other peer.
       *
       * @param {Number} [code] The status code component of the body
       * @param {(String|Buffer)} [data] The message component of the body
       * @param {Boolean} [mask=false] Specifies whether or not to mask the message
       * @param {Function} [cb] Callback
       * @public
       */
      close(code, data, mask2, cb) {
        let buf;
        if (code === void 0) {
          buf = EMPTY_BUFFER$1;
        } else if (typeof code !== "number" || !isValidStatusCode(code)) {
          throw new TypeError("First argument must be a valid error code number");
        } else if (data === void 0 || !data.length) {
          buf = Buffer.allocUnsafe(2);
          buf.writeUInt16BE(code, 0);
        } else {
          const length = Buffer.byteLength(data);
          if (length > 123) {
            throw new RangeError("The message must not be greater than 123 bytes");
          }
          buf = Buffer.allocUnsafe(2 + length);
          buf.writeUInt16BE(code, 0);
          if (typeof data === "string") {
            buf.write(data, 2);
          } else {
            buf.set(data, 2);
          }
        }
        const options = {
          [kByteLength]: buf.length,
          fin: true,
          generateMask: this._generateMask,
          mask: mask2,
          maskBuffer: this._maskBuffer,
          opcode: 8,
          readOnly: false,
          rsv1: false
        };
        if (this._deflating) {
          this.enqueue([this.dispatch, buf, false, options, cb]);
        } else {
          this.sendFrame(Sender.frame(buf, options), cb);
        }
      }
      /**
       * Sends a ping message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      ping(data, mask2, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else {
          data = toBuffer$1(data);
          byteLength = data.length;
          readOnly = toBuffer$1.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask: mask2,
          maskBuffer: this._maskBuffer,
          opcode: 9,
          readOnly,
          rsv1: false
        };
        if (this._deflating) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a pong message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      pong(data, mask2, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else {
          data = toBuffer$1(data);
          byteLength = data.length;
          readOnly = toBuffer$1.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask: mask2,
          maskBuffer: this._maskBuffer,
          opcode: 10,
          readOnly,
          rsv1: false
        };
        if (this._deflating) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a data message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Object} options Options object
       * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
       *     or text
       * @param {Boolean} [options.compress=false] Specifies whether or not to
       *     compress `data`
       * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Function} [cb] Callback
       * @public
       */
      send(data, options, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate$2.extensionName];
        let opcode = options.binary ? 2 : 1;
        let rsv1 = options.compress;
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else {
          data = toBuffer$1(data);
          byteLength = data.length;
          readOnly = toBuffer$1.readOnly;
        }
        if (this._firstFragment) {
          this._firstFragment = false;
          if (rsv1 && perMessageDeflate && perMessageDeflate.params[perMessageDeflate._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) {
            rsv1 = byteLength >= perMessageDeflate._threshold;
          }
          this._compress = rsv1;
        } else {
          rsv1 = false;
          opcode = 0;
        }
        if (options.fin)
          this._firstFragment = true;
        if (perMessageDeflate) {
          const opts = {
            [kByteLength]: byteLength,
            fin: options.fin,
            generateMask: this._generateMask,
            mask: options.mask,
            maskBuffer: this._maskBuffer,
            opcode,
            readOnly,
            rsv1
          };
          if (this._deflating) {
            this.enqueue([this.dispatch, data, this._compress, opts, cb]);
          } else {
            this.dispatch(data, this._compress, opts, cb);
          }
        } else {
          this.sendFrame(
            Sender.frame(data, {
              [kByteLength]: byteLength,
              fin: options.fin,
              generateMask: this._generateMask,
              mask: options.mask,
              maskBuffer: this._maskBuffer,
              opcode,
              readOnly,
              rsv1: false
            }),
            cb
          );
        }
      }
      /**
       * Dispatches a message.
       *
       * @param {(Buffer|String)} data The message to send
       * @param {Boolean} [compress=false] Specifies whether or not to compress
       *     `data`
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @param {Function} [cb] Callback
       * @private
       */
      dispatch(data, compress, options, cb) {
        if (!compress) {
          this.sendFrame(Sender.frame(data, options), cb);
          return;
        }
        const perMessageDeflate = this._extensions[PerMessageDeflate$2.extensionName];
        this._bufferedBytes += options[kByteLength];
        this._deflating = true;
        perMessageDeflate.compress(data, options.fin, (_, buf) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while data was being compressed"
            );
            if (typeof cb === "function")
              cb(err);
            for (let i = 0; i < this._queue.length; i++) {
              const params = this._queue[i];
              const callback = params[params.length - 1];
              if (typeof callback === "function")
                callback(err);
            }
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          this._deflating = false;
          options.readOnly = false;
          this.sendFrame(Sender.frame(buf, options), cb);
          this.dequeue();
        });
      }
      /**
       * Executes queued send operations.
       *
       * @private
       */
      dequeue() {
        while (!this._deflating && this._queue.length) {
          const params = this._queue.shift();
          this._bufferedBytes -= params[3][kByteLength];
          Reflect.apply(params[0], this, params.slice(1));
        }
      }
      /**
       * Enqueues a send operation.
       *
       * @param {Array} params Send operation parameters.
       * @private
       */
      enqueue(params) {
        this._bufferedBytes += params[3][kByteLength];
        this._queue.push(params);
      }
      /**
       * Sends a frame.
       *
       * @param {Buffer[]} list The frame to send
       * @param {Function} [cb] Callback
       * @private
       */
      sendFrame(list, cb) {
        if (list.length === 2) {
          this._socket.cork();
          this._socket.write(list[0]);
          this._socket.write(list[1], cb);
          this._socket.uncork();
        } else {
          this._socket.write(list[0], cb);
        }
      }
    };
    sender = Sender$1;
    sender$1 = /* @__PURE__ */ getDefaultExportFromCjs(sender);
    ({ kForOnEventAttribute: kForOnEventAttribute$1, kListener: kListener$1 } = constants);
    kCode = Symbol("kCode");
    kData = Symbol("kData");
    kError = Symbol("kError");
    kMessage = Symbol("kMessage");
    kReason = Symbol("kReason");
    kTarget = Symbol("kTarget");
    kType = Symbol("kType");
    kWasClean = Symbol("kWasClean");
    Event = class {
      /**
       * Create a new `Event`.
       *
       * @param {String} type The name of the event
       * @throws {TypeError} If the `type` argument is not specified
       */
      constructor(type) {
        this[kTarget] = null;
        this[kType] = type;
      }
      /**
       * @type {*}
       */
      get target() {
        return this[kTarget];
      }
      /**
       * @type {String}
       */
      get type() {
        return this[kType];
      }
    };
    Object.defineProperty(Event.prototype, "target", { enumerable: true });
    Object.defineProperty(Event.prototype, "type", { enumerable: true });
    CloseEvent = class extends Event {
      /**
       * Create a new `CloseEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {Number} [options.code=0] The status code explaining why the
       *     connection was closed
       * @param {String} [options.reason=''] A human-readable string explaining why
       *     the connection was closed
       * @param {Boolean} [options.wasClean=false] Indicates whether or not the
       *     connection was cleanly closed
       */
      constructor(type, options = {}) {
        super(type);
        this[kCode] = options.code === void 0 ? 0 : options.code;
        this[kReason] = options.reason === void 0 ? "" : options.reason;
        this[kWasClean] = options.wasClean === void 0 ? false : options.wasClean;
      }
      /**
       * @type {Number}
       */
      get code() {
        return this[kCode];
      }
      /**
       * @type {String}
       */
      get reason() {
        return this[kReason];
      }
      /**
       * @type {Boolean}
       */
      get wasClean() {
        return this[kWasClean];
      }
    };
    Object.defineProperty(CloseEvent.prototype, "code", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "reason", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "wasClean", { enumerable: true });
    ErrorEvent = class extends Event {
      /**
       * Create a new `ErrorEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.error=null] The error that generated this event
       * @param {String} [options.message=''] The error message
       */
      constructor(type, options = {}) {
        super(type);
        this[kError] = options.error === void 0 ? null : options.error;
        this[kMessage] = options.message === void 0 ? "" : options.message;
      }
      /**
       * @type {*}
       */
      get error() {
        return this[kError];
      }
      /**
       * @type {String}
       */
      get message() {
        return this[kMessage];
      }
    };
    Object.defineProperty(ErrorEvent.prototype, "error", { enumerable: true });
    Object.defineProperty(ErrorEvent.prototype, "message", { enumerable: true });
    MessageEvent = class extends Event {
      /**
       * Create a new `MessageEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.data=null] The message content
       */
      constructor(type, options = {}) {
        super(type);
        this[kData] = options.data === void 0 ? null : options.data;
      }
      /**
       * @type {*}
       */
      get data() {
        return this[kData];
      }
    };
    Object.defineProperty(MessageEvent.prototype, "data", { enumerable: true });
    EventTarget = {
      /**
       * Register an event listener.
       *
       * @param {String} type A string representing the event type to listen for
       * @param {(Function|Object)} handler The listener to add
       * @param {Object} [options] An options object specifies characteristics about
       *     the event listener
       * @param {Boolean} [options.once=false] A `Boolean` indicating that the
       *     listener should be invoked at most once after being added. If `true`,
       *     the listener would be automatically removed when invoked.
       * @public
       */
      addEventListener(type, handler, options = {}) {
        for (const listener of this.listeners(type)) {
          if (!options[kForOnEventAttribute$1] && listener[kListener$1] === handler && !listener[kForOnEventAttribute$1]) {
            return;
          }
        }
        let wrapper;
        if (type === "message") {
          wrapper = function onMessage(data, isBinary) {
            const event = new MessageEvent("message", {
              data: isBinary ? data : data.toString()
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "close") {
          wrapper = function onClose(code, message) {
            const event = new CloseEvent("close", {
              code,
              reason: message.toString(),
              wasClean: this._closeFrameReceived && this._closeFrameSent
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "error") {
          wrapper = function onError(error2) {
            const event = new ErrorEvent("error", {
              error: error2,
              message: error2.message
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "open") {
          wrapper = function onOpen() {
            const event = new Event("open");
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else {
          return;
        }
        wrapper[kForOnEventAttribute$1] = !!options[kForOnEventAttribute$1];
        wrapper[kListener$1] = handler;
        if (options.once) {
          this.once(type, wrapper);
        } else {
          this.on(type, wrapper);
        }
      },
      /**
       * Remove an event listener.
       *
       * @param {String} type A string representing the event type to remove
       * @param {(Function|Object)} handler The listener to remove
       * @public
       */
      removeEventListener(type, handler) {
        for (const listener of this.listeners(type)) {
          if (listener[kListener$1] === handler && !listener[kForOnEventAttribute$1]) {
            this.removeListener(type, listener);
            break;
          }
        }
      }
    };
    eventTarget = {
      CloseEvent,
      ErrorEvent,
      Event,
      EventTarget,
      MessageEvent
    };
    ({ tokenChars: tokenChars$1 } = validationExports);
    extension$1 = { format: format$1, parse: parse$2 };
    EventEmitter$1 = require$$0$4;
    https = require$$1$2;
    http$1 = require$$2$1;
    net = require$$3;
    tls = require$$4;
    ({ randomBytes, createHash: createHash$1 } = require$$5);
    ({ URL: URL2 } = require$$7);
    PerMessageDeflate$1 = permessageDeflate;
    Receiver2 = receiver;
    Sender2 = sender;
    ({
      BINARY_TYPES,
      EMPTY_BUFFER,
      GUID: GUID$1,
      kForOnEventAttribute,
      kListener,
      kStatusCode,
      kWebSocket: kWebSocket$1,
      NOOP
    } = constants);
    ({
      EventTarget: { addEventListener: addEventListener2, removeEventListener }
    } = eventTarget);
    ({ format, parse: parse$1 } = extension$1);
    ({ toBuffer } = bufferUtilExports);
    closeTimeout = 30 * 1e3;
    kAborted = Symbol("kAborted");
    protocolVersions = [8, 13];
    readyStates = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
    subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
    WebSocket$1 = class WebSocket2 extends EventEmitter$1 {
      /**
       * Create a new `WebSocket`.
       *
       * @param {(String|URL)} address The URL to which to connect
       * @param {(String|String[])} [protocols] The subprotocols
       * @param {Object} [options] Connection options
       */
      constructor(address, protocols, options) {
        super();
        this._binaryType = BINARY_TYPES[0];
        this._closeCode = 1006;
        this._closeFrameReceived = false;
        this._closeFrameSent = false;
        this._closeMessage = EMPTY_BUFFER;
        this._closeTimer = null;
        this._extensions = {};
        this._paused = false;
        this._protocol = "";
        this._readyState = WebSocket2.CONNECTING;
        this._receiver = null;
        this._sender = null;
        this._socket = null;
        if (address !== null) {
          this._bufferedAmount = 0;
          this._isServer = false;
          this._redirects = 0;
          if (protocols === void 0) {
            protocols = [];
          } else if (!Array.isArray(protocols)) {
            if (typeof protocols === "object" && protocols !== null) {
              options = protocols;
              protocols = [];
            } else {
              protocols = [protocols];
            }
          }
          initAsClient(this, address, protocols, options);
        } else {
          this._isServer = true;
        }
      }
      /**
       * This deviates from the WHATWG interface since ws doesn't support the
       * required default "blob" type (instead we define a custom "nodebuffer"
       * type).
       *
       * @type {String}
       */
      get binaryType() {
        return this._binaryType;
      }
      set binaryType(type) {
        if (!BINARY_TYPES.includes(type))
          return;
        this._binaryType = type;
        if (this._receiver)
          this._receiver._binaryType = type;
      }
      /**
       * @type {Number}
       */
      get bufferedAmount() {
        if (!this._socket)
          return this._bufferedAmount;
        return this._socket._writableState.length + this._sender._bufferedBytes;
      }
      /**
       * @type {String}
       */
      get extensions() {
        return Object.keys(this._extensions).join();
      }
      /**
       * @type {Boolean}
       */
      get isPaused() {
        return this._paused;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onclose() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onerror() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onopen() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onmessage() {
        return null;
      }
      /**
       * @type {String}
       */
      get protocol() {
        return this._protocol;
      }
      /**
       * @type {Number}
       */
      get readyState() {
        return this._readyState;
      }
      /**
       * @type {String}
       */
      get url() {
        return this._url;
      }
      /**
       * Set up the socket and the internal resources.
       *
       * @param {(net.Socket|tls.Socket)} socket The network socket between the
       *     server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Object} options Options object
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Number} [options.maxPayload=0] The maximum allowed message size
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @private
       */
      setSocket(socket, head, options) {
        const receiver2 = new Receiver2({
          binaryType: this.binaryType,
          extensions: this._extensions,
          isServer: this._isServer,
          maxPayload: options.maxPayload,
          skipUTF8Validation: options.skipUTF8Validation
        });
        this._sender = new Sender2(socket, this._extensions, options.generateMask);
        this._receiver = receiver2;
        this._socket = socket;
        receiver2[kWebSocket$1] = this;
        socket[kWebSocket$1] = this;
        receiver2.on("conclude", receiverOnConclude);
        receiver2.on("drain", receiverOnDrain);
        receiver2.on("error", receiverOnError);
        receiver2.on("message", receiverOnMessage);
        receiver2.on("ping", receiverOnPing);
        receiver2.on("pong", receiverOnPong);
        socket.setTimeout(0);
        socket.setNoDelay();
        if (head.length > 0)
          socket.unshift(head);
        socket.on("close", socketOnClose);
        socket.on("data", socketOnData);
        socket.on("end", socketOnEnd);
        socket.on("error", socketOnError$1);
        this._readyState = WebSocket2.OPEN;
        this.emit("open");
      }
      /**
       * Emit the `'close'` event.
       *
       * @private
       */
      emitClose() {
        if (!this._socket) {
          this._readyState = WebSocket2.CLOSED;
          this.emit("close", this._closeCode, this._closeMessage);
          return;
        }
        if (this._extensions[PerMessageDeflate$1.extensionName]) {
          this._extensions[PerMessageDeflate$1.extensionName].cleanup();
        }
        this._receiver.removeAllListeners();
        this._readyState = WebSocket2.CLOSED;
        this.emit("close", this._closeCode, this._closeMessage);
      }
      /**
       * Start a closing handshake.
       *
       *          +----------+   +-----------+   +----------+
       *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
       *    |     +----------+   +-----------+   +----------+     |
       *          +----------+   +-----------+         |
       * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
       *          +----------+   +-----------+   |
       *    |           |                        |   +---+        |
       *                +------------------------+-->|fin| - - - -
       *    |         +---+                      |   +---+
       *     - - - - -|fin|<---------------------+
       *              +---+
       *
       * @param {Number} [code] Status code explaining why the connection is closing
       * @param {(String|Buffer)} [data] The reason why the connection is
       *     closing
       * @public
       */
      close(code, data) {
        if (this.readyState === WebSocket2.CLOSED)
          return;
        if (this.readyState === WebSocket2.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake$1(this, this._req, msg);
          return;
        }
        if (this.readyState === WebSocket2.CLOSING) {
          if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) {
            this._socket.end();
          }
          return;
        }
        this._readyState = WebSocket2.CLOSING;
        this._sender.close(code, data, !this._isServer, (err) => {
          if (err)
            return;
          this._closeFrameSent = true;
          if (this._closeFrameReceived || this._receiver._writableState.errorEmitted) {
            this._socket.end();
          }
        });
        this._closeTimer = setTimeout(
          this._socket.destroy.bind(this._socket),
          closeTimeout
        );
      }
      /**
       * Pause the socket.
       *
       * @public
       */
      pause() {
        if (this.readyState === WebSocket2.CONNECTING || this.readyState === WebSocket2.CLOSED) {
          return;
        }
        this._paused = true;
        this._socket.pause();
      }
      /**
       * Send a ping.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the ping is sent
       * @public
       */
      ping(data, mask2, cb) {
        if (this.readyState === WebSocket2.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask2 = void 0;
        } else if (typeof mask2 === "function") {
          cb = mask2;
          mask2 = void 0;
        }
        if (typeof data === "number")
          data = data.toString();
        if (this.readyState !== WebSocket2.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask2 === void 0)
          mask2 = !this._isServer;
        this._sender.ping(data || EMPTY_BUFFER, mask2, cb);
      }
      /**
       * Send a pong.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the pong is sent
       * @public
       */
      pong(data, mask2, cb) {
        if (this.readyState === WebSocket2.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask2 = void 0;
        } else if (typeof mask2 === "function") {
          cb = mask2;
          mask2 = void 0;
        }
        if (typeof data === "number")
          data = data.toString();
        if (this.readyState !== WebSocket2.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask2 === void 0)
          mask2 = !this._isServer;
        this._sender.pong(data || EMPTY_BUFFER, mask2, cb);
      }
      /**
       * Resume the socket.
       *
       * @public
       */
      resume() {
        if (this.readyState === WebSocket2.CONNECTING || this.readyState === WebSocket2.CLOSED) {
          return;
        }
        this._paused = false;
        if (!this._receiver._writableState.needDrain)
          this._socket.resume();
      }
      /**
       * Send a data message.
       *
       * @param {*} data The message to send
       * @param {Object} [options] Options object
       * @param {Boolean} [options.binary] Specifies whether `data` is binary or
       *     text
       * @param {Boolean} [options.compress] Specifies whether or not to compress
       *     `data`
       * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when data is written out
       * @public
       */
      send(data, options, cb) {
        if (this.readyState === WebSocket2.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof options === "function") {
          cb = options;
          options = {};
        }
        if (typeof data === "number")
          data = data.toString();
        if (this.readyState !== WebSocket2.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        const opts = {
          binary: typeof data !== "string",
          mask: !this._isServer,
          compress: true,
          fin: true,
          ...options
        };
        if (!this._extensions[PerMessageDeflate$1.extensionName]) {
          opts.compress = false;
        }
        this._sender.send(data || EMPTY_BUFFER, opts, cb);
      }
      /**
       * Forcibly close the connection.
       *
       * @public
       */
      terminate() {
        if (this.readyState === WebSocket2.CLOSED)
          return;
        if (this.readyState === WebSocket2.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake$1(this, this._req, msg);
          return;
        }
        if (this._socket) {
          this._readyState = WebSocket2.CLOSING;
          this._socket.destroy();
        }
      }
    };
    Object.defineProperty(WebSocket$1, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket$1.prototype, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket$1, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket$1.prototype, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket$1, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket$1.prototype, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket$1, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    Object.defineProperty(WebSocket$1.prototype, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    [
      "binaryType",
      "bufferedAmount",
      "extensions",
      "isPaused",
      "protocol",
      "readyState",
      "url"
    ].forEach((property) => {
      Object.defineProperty(WebSocket$1.prototype, property, { enumerable: true });
    });
    ["open", "error", "close", "message"].forEach((method) => {
      Object.defineProperty(WebSocket$1.prototype, `on${method}`, {
        enumerable: true,
        get() {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute])
              return listener[kListener];
          }
          return null;
        },
        set(handler) {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) {
              this.removeListener(method, listener);
              break;
            }
          }
          if (typeof handler !== "function")
            return;
          this.addEventListener(method, handler, {
            [kForOnEventAttribute]: true
          });
        }
      });
    });
    WebSocket$1.prototype.addEventListener = addEventListener2;
    WebSocket$1.prototype.removeEventListener = removeEventListener;
    websocket = WebSocket$1;
    WebSocket$2 = /* @__PURE__ */ getDefaultExportFromCjs(websocket);
    ({ tokenChars } = validationExports);
    subprotocol$1 = { parse };
    EventEmitter = require$$0$4;
    http = require$$2$1;
    ({ createHash } = require$$5);
    extension = extension$1;
    PerMessageDeflate2 = permessageDeflate;
    subprotocol = subprotocol$1;
    WebSocket22 = websocket;
    ({ GUID, kWebSocket } = constants);
    keyRegex = /^[+/0-9A-Za-z]{22}==$/;
    RUNNING = 0;
    CLOSING = 1;
    CLOSED = 2;
    WebSocketServer = class extends EventEmitter {
      /**
       * Create a `WebSocketServer` instance.
       *
       * @param {Object} options Configuration options
       * @param {Number} [options.backlog=511] The maximum length of the queue of
       *     pending connections
       * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
       *     track clients
       * @param {Function} [options.handleProtocols] A hook to handle protocols
       * @param {String} [options.host] The hostname where to bind the server
       * @param {Number} [options.maxPayload=104857600] The maximum allowed message
       *     size
       * @param {Boolean} [options.noServer=false] Enable no server mode
       * @param {String} [options.path] Accept only connections matching this path
       * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
       *     permessage-deflate
       * @param {Number} [options.port] The port where to bind the server
       * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
       *     server to use
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @param {Function} [options.verifyClient] A hook to reject connections
       * @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
       *     class to use. It must be the `WebSocket` class or class that extends it
       * @param {Function} [callback] A listener for the `listening` event
       */
      constructor(options, callback) {
        super();
        options = {
          maxPayload: 100 * 1024 * 1024,
          skipUTF8Validation: false,
          perMessageDeflate: false,
          handleProtocols: null,
          clientTracking: true,
          verifyClient: null,
          noServer: false,
          backlog: null,
          // use default (511 as implemented in net.js)
          server: null,
          host: null,
          path: null,
          port: null,
          WebSocket: WebSocket22,
          ...options
        };
        if (options.port == null && !options.server && !options.noServer || options.port != null && (options.server || options.noServer) || options.server && options.noServer) {
          throw new TypeError(
            'One and only one of the "port", "server", or "noServer" options must be specified'
          );
        }
        if (options.port != null) {
          this._server = http.createServer((req, res) => {
            const body = http.STATUS_CODES[426];
            res.writeHead(426, {
              "Content-Length": body.length,
              "Content-Type": "text/plain"
            });
            res.end(body);
          });
          this._server.listen(
            options.port,
            options.host,
            options.backlog,
            callback
          );
        } else if (options.server) {
          this._server = options.server;
        }
        if (this._server) {
          const emitConnection = this.emit.bind(this, "connection");
          this._removeListeners = addListeners(this._server, {
            listening: this.emit.bind(this, "listening"),
            error: this.emit.bind(this, "error"),
            upgrade: (req, socket, head) => {
              this.handleUpgrade(req, socket, head, emitConnection);
            }
          });
        }
        if (options.perMessageDeflate === true)
          options.perMessageDeflate = {};
        if (options.clientTracking) {
          this.clients = /* @__PURE__ */ new Set();
          this._shouldEmitClose = false;
        }
        this.options = options;
        this._state = RUNNING;
      }
      /**
       * Returns the bound address, the address family name, and port of the server
       * as reported by the operating system if listening on an IP socket.
       * If the server is listening on a pipe or UNIX domain socket, the name is
       * returned as a string.
       *
       * @return {(Object|String|null)} The address of the server
       * @public
       */
      address() {
        if (this.options.noServer) {
          throw new Error('The server is operating in "noServer" mode');
        }
        if (!this._server)
          return null;
        return this._server.address();
      }
      /**
       * Stop the server from accepting new connections and emit the `'close'` event
       * when all existing connections are closed.
       *
       * @param {Function} [cb] A one-time listener for the `'close'` event
       * @public
       */
      close(cb) {
        if (this._state === CLOSED) {
          if (cb) {
            this.once("close", () => {
              cb(new Error("The server is not running"));
            });
          }
          process.nextTick(emitClose, this);
          return;
        }
        if (cb)
          this.once("close", cb);
        if (this._state === CLOSING)
          return;
        this._state = CLOSING;
        if (this.options.noServer || this.options.server) {
          if (this._server) {
            this._removeListeners();
            this._removeListeners = this._server = null;
          }
          if (this.clients) {
            if (!this.clients.size) {
              process.nextTick(emitClose, this);
            } else {
              this._shouldEmitClose = true;
            }
          } else {
            process.nextTick(emitClose, this);
          }
        } else {
          const server = this._server;
          this._removeListeners();
          this._removeListeners = this._server = null;
          server.close(() => {
            emitClose(this);
          });
        }
      }
      /**
       * See if a given request should be handled by this server instance.
       *
       * @param {http.IncomingMessage} req Request object to inspect
       * @return {Boolean} `true` if the request is valid, else `false`
       * @public
       */
      shouldHandle(req) {
        if (this.options.path) {
          const index = req.url.indexOf("?");
          const pathname = index !== -1 ? req.url.slice(0, index) : req.url;
          if (pathname !== this.options.path)
            return false;
        }
        return true;
      }
      /**
       * Handle a HTTP Upgrade request.
       *
       * @param {http.IncomingMessage} req The request object
       * @param {(net.Socket|tls.Socket)} socket The network socket between the
       *     server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @public
       */
      handleUpgrade(req, socket, head, cb) {
        socket.on("error", socketOnError);
        const key = req.headers["sec-websocket-key"];
        const version = +req.headers["sec-websocket-version"];
        if (req.method !== "GET") {
          const message = "Invalid HTTP method";
          abortHandshakeOrEmitwsClientError(this, req, socket, 405, message);
          return;
        }
        if (req.headers.upgrade.toLowerCase() !== "websocket") {
          const message = "Invalid Upgrade header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (!key || !keyRegex.test(key)) {
          const message = "Missing or invalid Sec-WebSocket-Key header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (version !== 8 && version !== 13) {
          const message = "Missing or invalid Sec-WebSocket-Version header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (!this.shouldHandle(req)) {
          abortHandshake(socket, 400);
          return;
        }
        const secWebSocketProtocol = req.headers["sec-websocket-protocol"];
        let protocols = /* @__PURE__ */ new Set();
        if (secWebSocketProtocol !== void 0) {
          try {
            protocols = subprotocol.parse(secWebSocketProtocol);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Protocol header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        const secWebSocketExtensions = req.headers["sec-websocket-extensions"];
        const extensions = {};
        if (this.options.perMessageDeflate && secWebSocketExtensions !== void 0) {
          const perMessageDeflate = new PerMessageDeflate2(
            this.options.perMessageDeflate,
            true,
            this.options.maxPayload
          );
          try {
            const offers = extension.parse(secWebSocketExtensions);
            if (offers[PerMessageDeflate2.extensionName]) {
              perMessageDeflate.accept(offers[PerMessageDeflate2.extensionName]);
              extensions[PerMessageDeflate2.extensionName] = perMessageDeflate;
            }
          } catch (err) {
            const message = "Invalid or unacceptable Sec-WebSocket-Extensions header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        if (this.options.verifyClient) {
          const info = {
            origin: req.headers[`${version === 8 ? "sec-websocket-origin" : "origin"}`],
            secure: !!(req.socket.authorized || req.socket.encrypted),
            req
          };
          if (this.options.verifyClient.length === 2) {
            this.options.verifyClient(info, (verified, code, message, headers) => {
              if (!verified) {
                return abortHandshake(socket, code || 401, message, headers);
              }
              this.completeUpgrade(
                extensions,
                key,
                protocols,
                req,
                socket,
                head,
                cb
              );
            });
            return;
          }
          if (!this.options.verifyClient(info))
            return abortHandshake(socket, 401);
        }
        this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
      }
      /**
       * Upgrade the connection to WebSocket.
       *
       * @param {Object} extensions The accepted extensions
       * @param {String} key The value of the `Sec-WebSocket-Key` header
       * @param {Set} protocols The subprotocols
       * @param {http.IncomingMessage} req The request object
       * @param {(net.Socket|tls.Socket)} socket The network socket between the
       *     server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @throws {Error} If called more than once with the same socket
       * @private
       */
      completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
        if (!socket.readable || !socket.writable)
          return socket.destroy();
        if (socket[kWebSocket]) {
          throw new Error(
            "server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration"
          );
        }
        if (this._state > RUNNING)
          return abortHandshake(socket, 503);
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        const headers = [
          "HTTP/1.1 101 Switching Protocols",
          "Upgrade: websocket",
          "Connection: Upgrade",
          `Sec-WebSocket-Accept: ${digest}`
        ];
        const ws = new this.options.WebSocket(null);
        if (protocols.size) {
          const protocol = this.options.handleProtocols ? this.options.handleProtocols(protocols, req) : protocols.values().next().value;
          if (protocol) {
            headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
            ws._protocol = protocol;
          }
        }
        if (extensions[PerMessageDeflate2.extensionName]) {
          const params = extensions[PerMessageDeflate2.extensionName].params;
          const value = extension.format({
            [PerMessageDeflate2.extensionName]: [params]
          });
          headers.push(`Sec-WebSocket-Extensions: ${value}`);
          ws._extensions = extensions;
        }
        this.emit("headers", headers, req);
        socket.write(headers.concat("\r\n").join("\r\n"));
        socket.removeListener("error", socketOnError);
        ws.setSocket(socket, head, {
          maxPayload: this.options.maxPayload,
          skipUTF8Validation: this.options.skipUTF8Validation
        });
        if (this.clients) {
          this.clients.add(ws);
          ws.on("close", () => {
            this.clients.delete(ws);
            if (this._shouldEmitClose && !this.clients.size) {
              process.nextTick(emitClose, this);
            }
          });
        }
        cb(ws, req);
      }
    };
    websocketServer = WebSocketServer;
    websocketServer$1 = /* @__PURE__ */ getDefaultExportFromCjs(websocketServer);
  }
});

// src/nodes/ExamplePluginNode.ts
function examplePluginNode(rivet) {
  const ExamplePluginNodeImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId(),
        // This is the default data that your node will store
        data: {
          someData: "Hello World From LP!!!",
          SK: ""
        },
        // This is the default title of your node.
        title: "Agent",
        // This must match the type of your node.
        type: "examplePlugin",
        // X and Y should be set to 0. Width should be set to a reasonable number so there is no overflow.
        visualData: {
          x: 0,
          y: 0,
          width: 200
        }
      };
      return node;
    },
    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      if (data.useSomeDataInput) {
        inputs.push({
          id: "someData",
          dataType: "string",
          title: "Some Data"
        });
        inputs.push({
          id: "SK",
          dataType: "string",
          title: "Secret Key"
        });
      }
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        {
          id: "someData",
          dataType: "string",
          title: "Some Data"
        },
        {
          id: "SK",
          dataType: "string",
          title: "Secret Key"
        }
      ];
    },
    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData() {
      return {
        contextMenuTitle: "Agent",
        group: "BioMl",
        infoBoxBody: "This is an example plugin node.",
        infoBoxTitle: "Example Plugin Node"
      };
    },
    // This function defines all editors that appear when you edit your node.
    getEditors(_data) {
      return [
        {
          type: "string",
          dataKey: "someData",
          useInputToggleDataKey: "useSomeDataInput",
          label: "Some Data"
        },
        {
          type: "string",
          dataKey: "SK",
          useInputToggleDataKey: "useSomeDataInput",
          label: "Secret Key"
        }
      ];
    },
    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(data) {
      return rivet.dedent`
        Example Plugin Node
        Data: ${data.useSomeDataInput ? "(Using Input)" : data.someData}
      `;
    },
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(data, inputData, _context) {
      const someData = rivet.getInputOrData(
        data,
        inputData,
        "someData",
        "string"
      );
      const result = await fetch("https://jsonplaceholder.typicode.com/posts");
      return {
        ["someData"]: {
          type: "string",
          value: await result.text()
        }
      };
    }
  };
  const examplePluginNode2 = rivet.pluginNodeDefinition(
    ExamplePluginNodeImpl,
    "Example Plugin Node"
  );
  return examplePluginNode2;
}

// node_modules/@gradio/client/dist/index.js
var __defProp2 = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _currentLine;
var fn = new Intl.Collator(0, { numeric: 1 }).compare;
function semiver(a, b, bool) {
  a = a.split(".");
  b = b.split(".");
  return fn(a[0], b[0]) || fn(a[1], b[1]) || (b[2] = b.slice(2).join("."), bool = /[.-]/.test(a[2] = a.slice(2).join(".")), bool == /[.-]/.test(b[2]) ? fn(a[2], b[2]) : bool ? -1 : 1);
}
var HOST_URL = `host`;
var SSE_URL = `queue/data`;
var SSE_DATA_URL = `queue/join`;
var UPLOAD_URL = `upload`;
var LOGIN_URL = `login`;
var CONFIG_URL = `config`;
var API_INFO_URL = `info`;
var RUNTIME_URL = `runtime`;
var SLEEPTIME_URL = `sleeptime`;
var HEARTBEAT_URL = `heartbeat`;
var COMPONENT_SERVER_URL = `component_server`;
var RESET_URL = `reset`;
var CANCEL_URL = `cancel`;
var SPACE_FETCHER_URL = "https://gradio-space-api-fetcher-v2.hf.space/api";
var QUEUE_FULL_MSG = "This application is currently busy. Please try again. ";
var BROKEN_CONNECTION_MSG = "Connection errored out. ";
var CONFIG_ERROR_MSG = "Could not resolve app config. ";
var SPACE_STATUS_ERROR_MSG = "Could not get space status. ";
var API_INFO_ERROR_MSG = "Could not get API info. ";
var SPACE_METADATA_ERROR_MSG = "Space metadata could not be loaded. ";
var INVALID_URL_MSG = "Invalid URL. A full URL path is required.";
var UNAUTHORIZED_MSG = "Not authorized to access this space. ";
var INVALID_CREDENTIALS_MSG = "Invalid credentials. Could not login. ";
var MISSING_CREDENTIALS_MSG = "Login credentials are required to access this space.";
var NODEJS_FS_ERROR_MSG = "File system access is only available in Node.js environments";
var ROOT_URL_ERROR_MSG = "Root URL not found in client config";
var FILE_PROCESSING_ERROR_MSG = "Error uploading file";
function resolve_root(base_url, root_path, prioritize_base) {
  if (root_path.startsWith("http://") || root_path.startsWith("https://")) {
    return prioritize_base ? base_url : root_path;
  }
  return base_url + root_path;
}
async function get_jwt(space, token, cookies) {
  try {
    const r = await fetch(`https://huggingface.co/api/spaces/${space}/jwt`, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...cookies ? { Cookie: cookies } : {}
      }
    });
    const jwt = (await r.json()).token;
    return jwt || false;
  } catch (e) {
    return false;
  }
}
function map_names_to_ids(fns) {
  let apis = {};
  fns.forEach(({ api_name, id }) => {
    if (api_name)
      apis[api_name] = id;
  });
  return apis;
}
async function resolve_config(endpoint) {
  var _a;
  const headers = this.options.hf_token ? { Authorization: `Bearer ${this.options.hf_token}` } : {};
  headers["Content-Type"] = "application/json";
  if (typeof window !== "undefined" && window.gradio_config && location.origin !== "http://localhost:9876" && !window.gradio_config.dev_mode) {
    const path = window.gradio_config.root;
    const config = window.gradio_config;
    let config_root = resolve_root(endpoint, config.root, false);
    config.root = config_root;
    return { ...config, path };
  } else if (endpoint) {
    const config_url = join_urls(endpoint, CONFIG_URL);
    const response = await this.fetch(config_url, {
      headers,
      credentials: "include"
    });
    if ((response == null ? void 0 : response.status) === 401 && !this.options.auth) {
      throw new Error(MISSING_CREDENTIALS_MSG);
    } else if ((response == null ? void 0 : response.status) === 401 && this.options.auth) {
      throw new Error(INVALID_CREDENTIALS_MSG);
    }
    if ((response == null ? void 0 : response.status) === 200) {
      let config = await response.json();
      config.path = config.path ?? "";
      config.root = endpoint;
      (_a = config.dependencies) == null ? void 0 : _a.forEach((dep, i) => {
        if (dep.id === void 0) {
          dep.id = i;
        }
      });
      return config;
    } else if ((response == null ? void 0 : response.status) === 401) {
      throw new Error(UNAUTHORIZED_MSG);
    }
    throw new Error(CONFIG_ERROR_MSG);
  }
  throw new Error(CONFIG_ERROR_MSG);
}
async function resolve_cookies() {
  const { http_protocol, host } = await process_endpoint(
    this.app_reference,
    this.options.hf_token
  );
  try {
    if (this.options.auth) {
      const cookie_header = await get_cookie_header(
        http_protocol,
        host,
        this.options.auth,
        this.fetch,
        this.options.hf_token
      );
      if (cookie_header)
        this.set_cookies(cookie_header);
    }
  } catch (e) {
    throw Error(e.message);
  }
}
async function get_cookie_header(http_protocol, host, auth, _fetch, hf_token) {
  const formData = new FormData();
  formData.append("username", auth == null ? void 0 : auth[0]);
  formData.append("password", auth == null ? void 0 : auth[1]);
  let headers = {};
  if (hf_token) {
    headers.Authorization = `Bearer ${hf_token}`;
  }
  const res = await _fetch(`${http_protocol}//${host}/${LOGIN_URL}`, {
    headers,
    method: "POST",
    body: formData,
    credentials: "include"
  });
  if (res.status === 200) {
    return res.headers.get("set-cookie");
  } else if (res.status === 401) {
    throw new Error(INVALID_CREDENTIALS_MSG);
  } else {
    throw new Error(SPACE_METADATA_ERROR_MSG);
  }
}
function determine_protocol(endpoint) {
  if (endpoint.startsWith("http")) {
    const { protocol, host, pathname } = new URL(endpoint);
    return {
      ws_protocol: protocol === "https:" ? "wss" : "ws",
      http_protocol: protocol,
      host: host + (pathname !== "/" ? pathname : "")
    };
  } else if (endpoint.startsWith("file:")) {
    return {
      ws_protocol: "ws",
      http_protocol: "http:",
      host: "lite.local"
      // Special fake hostname only used for this case. This matches the hostname allowed in `is_self_host()` in `js/wasm/network/host.ts`.
    };
  }
  return {
    ws_protocol: "wss",
    http_protocol: "https:",
    host: new URL(endpoint).host
  };
}
var parse_and_set_cookies = (cookie_header) => {
  let cookies = [];
  const parts = cookie_header.split(/,(?=\s*[^\s=;]+=[^\s=;]+)/);
  parts.forEach((cookie) => {
    const [cookie_name, cookie_value] = cookie.split(";")[0].split("=");
    if (cookie_name && cookie_value) {
      cookies.push(`${cookie_name.trim()}=${cookie_value.trim()}`);
    }
  });
  return cookies;
};
var RE_SPACE_NAME = /^[a-zA-Z0-9_\-\.]+\/[a-zA-Z0-9_\-\.]+$/;
var RE_SPACE_DOMAIN = /.*hf\.space\/{0,1}.*$/;
async function process_endpoint(app_reference, hf_token) {
  const headers = {};
  if (hf_token) {
    headers.Authorization = `Bearer ${hf_token}`;
  }
  const _app_reference = app_reference.trim().replace(/\/$/, "");
  if (RE_SPACE_NAME.test(_app_reference)) {
    try {
      const res = await fetch(
        `https://huggingface.co/api/spaces/${_app_reference}/${HOST_URL}`,
        { headers }
      );
      const _host = (await res.json()).host;
      return {
        space_id: app_reference,
        ...determine_protocol(_host)
      };
    } catch (e) {
      throw new Error(SPACE_METADATA_ERROR_MSG);
    }
  }
  if (RE_SPACE_DOMAIN.test(_app_reference)) {
    const { ws_protocol, http_protocol, host } = determine_protocol(_app_reference);
    return {
      space_id: host.split("/")[0].replace(".hf.space", ""),
      ws_protocol,
      http_protocol,
      host
    };
  }
  return {
    space_id: false,
    ...determine_protocol(_app_reference)
  };
}
var join_urls = (...urls) => {
  try {
    return urls.reduce((base_url, part) => {
      base_url = base_url.replace(/\/+$/, "");
      part = part.replace(/^\/+/, "");
      return new URL(part, base_url + "/").toString();
    });
  } catch (e) {
    throw new Error(INVALID_URL_MSG);
  }
};
function transform_api_info(api_info, config, api_map) {
  const transformed_info = {
    named_endpoints: {},
    unnamed_endpoints: {}
  };
  Object.keys(api_info).forEach((category) => {
    if (category === "named_endpoints" || category === "unnamed_endpoints") {
      transformed_info[category] = {};
      Object.entries(api_info[category]).forEach(
        ([endpoint, { parameters, returns }]) => {
          var _a, _b, _c, _d;
          const dependencyIndex = ((_a = config.dependencies.find(
            (dep) => dep.api_name === endpoint || dep.api_name === endpoint.replace("/", "")
          )) == null ? void 0 : _a.id) || api_map[endpoint.replace("/", "")] || -1;
          const dependencyTypes = dependencyIndex !== -1 ? (_b = config.dependencies.find((dep) => dep.id == dependencyIndex)) == null ? void 0 : _b.types : { generator: false, cancel: false };
          if (dependencyIndex !== -1 && ((_d = (_c = config.dependencies.find((dep) => dep.id == dependencyIndex)) == null ? void 0 : _c.inputs) == null ? void 0 : _d.length) !== parameters.length) {
            const components = config.dependencies.find((dep) => dep.id == dependencyIndex).inputs.map(
              (input) => {
                var _a2;
                return (_a2 = config.components.find((c) => c.id === input)) == null ? void 0 : _a2.type;
              }
            );
            try {
              components.forEach((comp, idx) => {
                if (comp === "state") {
                  const new_param = {
                    component: "state",
                    example: null,
                    parameter_default: null,
                    parameter_has_default: true,
                    parameter_name: null,
                    hidden: true
                  };
                  parameters.splice(idx, 0, new_param);
                }
              });
            } catch (e) {
              console.error(e);
            }
          }
          const transform_type = (data, component, serializer, signature_type) => ({
            ...data,
            description: get_description(data == null ? void 0 : data.type, serializer),
            type: get_type(data == null ? void 0 : data.type, component, serializer, signature_type) || ""
          });
          transformed_info[category][endpoint] = {
            parameters: parameters.map(
              (p) => transform_type(p, p == null ? void 0 : p.component, p == null ? void 0 : p.serializer, "parameter")
            ),
            returns: returns.map(
              (r) => transform_type(r, r == null ? void 0 : r.component, r == null ? void 0 : r.serializer, "return")
            ),
            type: dependencyTypes
          };
        }
      );
    }
  });
  return transformed_info;
}
function get_type(type, component, serializer, signature_type) {
  switch (type == null ? void 0 : type.type) {
    case "string":
      return "string";
    case "boolean":
      return "boolean";
    case "number":
      return "number";
  }
  if (serializer === "JSONSerializable" || serializer === "StringSerializable") {
    return "any";
  } else if (serializer === "ListStringSerializable") {
    return "string[]";
  } else if (component === "Image") {
    return signature_type === "parameter" ? "Blob | File | Buffer" : "string";
  } else if (serializer === "FileSerializable") {
    if ((type == null ? void 0 : type.type) === "array") {
      return signature_type === "parameter" ? "(Blob | File | Buffer)[]" : `{ name: string; data: string; size?: number; is_file?: boolean; orig_name?: string}[]`;
    }
    return signature_type === "parameter" ? "Blob | File | Buffer" : `{ name: string; data: string; size?: number; is_file?: boolean; orig_name?: string}`;
  } else if (serializer === "GallerySerializable") {
    return signature_type === "parameter" ? "[(Blob | File | Buffer), (string | null)][]" : `[{ name: string; data: string; size?: number; is_file?: boolean; orig_name?: string}, (string | null))][]`;
  }
}
function get_description(type, serializer) {
  if (serializer === "GallerySerializable") {
    return "array of [file, label] tuples";
  } else if (serializer === "ListStringSerializable") {
    return "array of strings";
  } else if (serializer === "FileSerializable") {
    return "array of files or single file";
  }
  return type == null ? void 0 : type.description;
}
function handle_message(data, last_status) {
  const queue = true;
  switch (data.msg) {
    case "send_data":
      return { type: "data" };
    case "send_hash":
      return { type: "hash" };
    case "queue_full":
      return {
        type: "update",
        status: {
          queue,
          message: QUEUE_FULL_MSG,
          stage: "error",
          code: data.code,
          success: data.success
        }
      };
    case "heartbeat":
      return {
        type: "heartbeat"
      };
    case "unexpected_error":
      return {
        type: "unexpected_error",
        status: {
          queue,
          message: data.message,
          stage: "error",
          success: false
        }
      };
    case "estimation":
      return {
        type: "update",
        status: {
          queue,
          stage: last_status || "pending",
          code: data.code,
          size: data.queue_size,
          position: data.rank,
          eta: data.rank_eta,
          success: data.success
        }
      };
    case "progress":
      return {
        type: "update",
        status: {
          queue,
          stage: "pending",
          code: data.code,
          progress_data: data.progress_data,
          success: data.success
        }
      };
    case "log":
      return { type: "log", data };
    case "process_generating":
      return {
        type: "generating",
        status: {
          queue,
          message: !data.success ? data.output.error : null,
          stage: data.success ? "generating" : "error",
          code: data.code,
          progress_data: data.progress_data,
          eta: data.average_duration,
          changed_state_ids: data.success ? data.output.changed_state_ids : void 0
        },
        data: data.success ? data.output : null
      };
    case "process_streaming":
      return {
        type: "streaming",
        status: {
          queue,
          message: data.output.error,
          stage: "streaming",
          time_limit: data.time_limit,
          code: data.code,
          progress_data: data.progress_data,
          eta: data.eta
        },
        data: data.output
      };
    case "process_completed":
      if ("error" in data.output) {
        return {
          type: "update",
          status: {
            queue,
            title: data.output.title,
            message: data.output.error,
            visible: data.output.visible,
            duration: data.output.duration,
            stage: "error",
            code: data.code,
            success: data.success
          }
        };
      }
      return {
        type: "complete",
        status: {
          queue,
          message: !data.success ? data.output.error : void 0,
          stage: data.success ? "complete" : "error",
          code: data.code,
          progress_data: data.progress_data,
          changed_state_ids: data.success ? data.output.changed_state_ids : void 0
        },
        data: data.success ? data.output : null
      };
    case "process_starts":
      return {
        type: "update",
        status: {
          queue,
          stage: "pending",
          code: data.code,
          size: data.rank,
          position: 0,
          success: data.success,
          eta: data.eta
        },
        original_msg: "process_starts"
      };
  }
  return { type: "none", status: { stage: "error", queue } };
}
var map_data_to_params = (data = [], endpoint_info) => {
  const parameters = endpoint_info ? endpoint_info.parameters : [];
  if (Array.isArray(data)) {
    if (data.length > parameters.length) {
      console.warn("Too many arguments provided for the endpoint.");
    }
    return data;
  }
  const resolved_data = [];
  const provided_keys = Object.keys(data);
  parameters.forEach((param, index) => {
    if (data.hasOwnProperty(param.parameter_name)) {
      resolved_data[index] = data[param.parameter_name];
    } else if (param.parameter_has_default) {
      resolved_data[index] = param.parameter_default;
    } else {
      throw new Error(
        `No value provided for required parameter: ${param.parameter_name}`
      );
    }
  });
  provided_keys.forEach((key) => {
    if (!parameters.some((param) => param.parameter_name === key)) {
      throw new Error(
        `Parameter \`${key}\` is not a valid keyword argument. Please refer to the API for usage.`
      );
    }
  });
  resolved_data.forEach((value, idx) => {
    if (value === void 0 && !parameters[idx].parameter_has_default) {
      throw new Error(
        `No value provided for required parameter: ${parameters[idx].parameter_name}`
      );
    }
  });
  return resolved_data;
};
async function view_api() {
  if (this.api_info)
    return this.api_info;
  const { hf_token } = this.options;
  const { config } = this;
  const headers = { "Content-Type": "application/json" };
  if (hf_token) {
    headers.Authorization = `Bearer ${hf_token}`;
  }
  if (!config) {
    return;
  }
  try {
    let response;
    let api_info;
    if (typeof window !== "undefined" && window.gradio_api_info) {
      api_info = window.gradio_api_info;
    } else {
      if (semiver((config == null ? void 0 : config.version) || "2.0.0", "3.30") < 0) {
        response = await this.fetch(SPACE_FETCHER_URL, {
          method: "POST",
          body: JSON.stringify({
            serialize: false,
            config: JSON.stringify(config)
          }),
          headers,
          credentials: "include"
        });
      } else {
        const url = join_urls(config.root, this.api_prefix, API_INFO_URL);
        response = await this.fetch(url, {
          headers,
          credentials: "include"
        });
      }
      if (!response.ok) {
        throw new Error(BROKEN_CONNECTION_MSG);
      }
      api_info = await response.json();
    }
    if ("api" in api_info) {
      api_info = api_info.api;
    }
    if (api_info.named_endpoints["/predict"] && !api_info.unnamed_endpoints["0"]) {
      api_info.unnamed_endpoints[0] = api_info.named_endpoints["/predict"];
    }
    return transform_api_info(api_info, config, this.api_map);
  } catch (e) {
    "Could not get API info. " + e.message;
  }
}
async function upload_files(root_url, files, upload_id) {
  var _a;
  const headers = {};
  if ((_a = this == null ? void 0 : this.options) == null ? void 0 : _a.hf_token) {
    headers.Authorization = `Bearer ${this.options.hf_token}`;
  }
  const chunkSize = 1e3;
  const uploadResponses = [];
  let response;
  for (let i = 0; i < files.length; i += chunkSize) {
    const chunk = files.slice(i, i + chunkSize);
    const formData = new FormData();
    chunk.forEach((file) => {
      formData.append("files", file);
    });
    try {
      const upload_url = upload_id ? `${root_url}${this.api_prefix}/${UPLOAD_URL}?upload_id=${upload_id}` : `${root_url}${this.api_prefix}/${UPLOAD_URL}`;
      response = await this.fetch(upload_url, {
        method: "POST",
        body: formData,
        headers,
        credentials: "include"
      });
    } catch (e) {
      throw new Error(BROKEN_CONNECTION_MSG + e.message);
    }
    if (!response.ok) {
      const error_text = await response.text();
      return { error: `HTTP ${response.status}: ${error_text}` };
    }
    const output = await response.json();
    if (output) {
      uploadResponses.push(...output);
    }
  }
  return { files: uploadResponses };
}
async function upload(file_data, root_url, upload_id, max_file_size) {
  let files = (Array.isArray(file_data) ? file_data : [file_data]).map(
    (file_data2) => file_data2.blob
  );
  const oversized_files = files.filter(
    (f) => f.size > (max_file_size ?? Infinity)
  );
  if (oversized_files.length) {
    throw new Error(
      `File size exceeds the maximum allowed size of ${max_file_size} bytes: ${oversized_files.map((f) => f.name).join(", ")}`
    );
  }
  return await Promise.all(
    await this.upload_files(root_url, files, upload_id).then(
      async (response) => {
        if (response.error) {
          throw new Error(response.error);
        } else {
          if (response.files) {
            return response.files.map((f, i) => {
              const file = new FileData({
                ...file_data[i],
                path: f,
                url: `${root_url}${this.api_prefix}/file=${f}`
              });
              return file;
            });
          }
          return [];
        }
      }
    )
  );
}
var FileData = class {
  constructor({
    path,
    url,
    orig_name,
    size,
    blob,
    is_stream,
    mime_type,
    alt_text,
    b64
  }) {
    __publicField(this, "path");
    __publicField(this, "url");
    __publicField(this, "orig_name");
    __publicField(this, "size");
    __publicField(this, "blob");
    __publicField(this, "is_stream");
    __publicField(this, "mime_type");
    __publicField(this, "alt_text");
    __publicField(this, "b64");
    __publicField(this, "meta", { _type: "gradio.FileData" });
    this.path = path;
    this.url = url;
    this.orig_name = orig_name;
    this.size = size;
    this.blob = url ? void 0 : blob;
    this.is_stream = is_stream;
    this.mime_type = mime_type;
    this.alt_text = alt_text;
    this.b64 = b64;
  }
};
var Command = class {
  constructor(command, meta) {
    __publicField(this, "type");
    __publicField(this, "command");
    __publicField(this, "meta");
    __publicField(this, "fileData");
    this.type = "command";
    this.command = command;
    this.meta = meta;
  }
};
var is_node = typeof process !== "undefined" && process.versions && process.versions.node;
function update_object(object, newValue, stack) {
  while (stack.length > 1) {
    const key2 = stack.shift();
    if (typeof key2 === "string" || typeof key2 === "number") {
      object = object[key2];
    } else {
      throw new Error("Invalid key type");
    }
  }
  const key = stack.shift();
  if (typeof key === "string" || typeof key === "number") {
    object[key] = newValue;
  } else {
    throw new Error("Invalid key type");
  }
}
async function walk_and_store_blobs(data, type = void 0, path = [], root = false, endpoint_info = void 0) {
  if (Array.isArray(data)) {
    let blob_refs = [];
    await Promise.all(
      data.map(async (_, index) => {
        var _a;
        let new_path = path.slice();
        new_path.push(String(index));
        const array_refs = await walk_and_store_blobs(
          data[index],
          root ? ((_a = endpoint_info == null ? void 0 : endpoint_info.parameters[index]) == null ? void 0 : _a.component) || void 0 : type,
          new_path,
          false,
          endpoint_info
        );
        blob_refs = blob_refs.concat(array_refs);
      })
    );
    return blob_refs;
  } else if (globalThis.Buffer && data instanceof globalThis.Buffer || data instanceof Blob) {
    return [
      {
        path,
        blob: new Blob([data]),
        type
      }
    ];
  } else if (typeof data === "object" && data !== null) {
    let blob_refs = [];
    for (const key of Object.keys(data)) {
      const new_path = [...path, key];
      const value = data[key];
      blob_refs = blob_refs.concat(
        await walk_and_store_blobs(
          value,
          void 0,
          new_path,
          false,
          endpoint_info
        )
      );
    }
    return blob_refs;
  }
  return [];
}
function skip_queue(id, config) {
  var _a, _b;
  let fn_queue = (_b = (_a = config == null ? void 0 : config.dependencies) == null ? void 0 : _a.find((dep) => dep.id == id)) == null ? void 0 : _b.queue;
  if (fn_queue != null) {
    return !fn_queue;
  }
  return !config.enable_queue;
}
function post_message(message, origin) {
  return new Promise((res, _rej) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = ({ data }) => {
      channel.port1.close();
      res(data);
    };
    window.parent.postMessage(message, origin, [channel.port2]);
  });
}
function handle_payload(resolved_payload, dependency, components, type, with_null_state = false) {
  if (type === "input" && !with_null_state) {
    throw new Error("Invalid code path. Cannot skip state inputs for input.");
  }
  if (type === "output" && with_null_state) {
    return resolved_payload;
  }
  let updated_payload = [];
  let payload_index = 0;
  const deps = type === "input" ? dependency.inputs : dependency.outputs;
  for (let i = 0; i < deps.length; i++) {
    const input_id = deps[i];
    const component = components.find((c) => c.id === input_id);
    if ((component == null ? void 0 : component.type) === "state") {
      if (with_null_state) {
        if (resolved_payload.length === deps.length) {
          const value = resolved_payload[payload_index];
          updated_payload.push(value);
          payload_index++;
        } else {
          updated_payload.push(null);
        }
      } else {
        payload_index++;
        continue;
      }
      continue;
    } else {
      const value = resolved_payload[payload_index];
      updated_payload.push(value);
      payload_index++;
    }
  }
  return updated_payload;
}
async function handle_blob(endpoint, data, api_info) {
  const self = this;
  await process_local_file_commands(self, data);
  const blobRefs = await walk_and_store_blobs(
    data,
    void 0,
    [],
    true,
    api_info
  );
  const results = await Promise.all(
    blobRefs.map(async ({ path, blob, type }) => {
      if (!blob)
        return { path, type };
      const response = await self.upload_files(endpoint, [blob]);
      const file_url = response.files && response.files[0];
      return {
        path,
        file_url,
        type,
        name: typeof File !== "undefined" && blob instanceof File ? blob == null ? void 0 : blob.name : void 0
      };
    })
  );
  results.forEach(({ path, file_url, type, name }) => {
    if (type === "Gallery") {
      update_object(data, file_url, path);
    } else if (file_url) {
      const file = new FileData({ path: file_url, orig_name: name });
      update_object(data, file, path);
    }
  });
  return data;
}
async function process_local_file_commands(client2, data) {
  var _a, _b;
  const root = ((_a = client2.config) == null ? void 0 : _a.root) || ((_b = client2.config) == null ? void 0 : _b.root_url);
  if (!root) {
    throw new Error(ROOT_URL_ERROR_MSG);
  }
  await recursively_process_commands(client2, data);
}
async function recursively_process_commands(client2, data, path = []) {
  for (const key in data) {
    if (data[key] instanceof Command) {
      await process_single_command(client2, data, key);
    } else if (typeof data[key] === "object" && data[key] !== null) {
      await recursively_process_commands(client2, data[key], [...path, key]);
    }
  }
}
async function process_single_command(client2, data, key) {
  var _a, _b;
  let cmd_item = data[key];
  const root = ((_a = client2.config) == null ? void 0 : _a.root) || ((_b = client2.config) == null ? void 0 : _b.root_url);
  if (!root) {
    throw new Error(ROOT_URL_ERROR_MSG);
  }
  try {
    let fileBuffer;
    let fullPath;
    if (typeof process !== "undefined" && process.versions && process.versions.node) {
      const fs = await import("fs/promises");
      const path = await import("path");
      fullPath = path.resolve(process.cwd(), cmd_item.meta.path);
      fileBuffer = await fs.readFile(fullPath);
    } else {
      throw new Error(NODEJS_FS_ERROR_MSG);
    }
    const file = new Blob([fileBuffer], { type: "application/octet-stream" });
    const response = await client2.upload_files(root, [file]);
    const file_url = response.files && response.files[0];
    if (file_url) {
      const fileData = new FileData({
        path: file_url,
        orig_name: cmd_item.meta.name || ""
      });
      data[key] = fileData;
    }
  } catch (error2) {
    console.error(FILE_PROCESSING_ERROR_MSG, error2);
  }
}
async function post_data(url, body, additional_headers) {
  const headers = { "Content-Type": "application/json" };
  if (this.options.hf_token) {
    headers.Authorization = `Bearer ${this.options.hf_token}`;
  }
  try {
    var response = await this.fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { ...headers, ...additional_headers },
      credentials: "include"
    });
  } catch (e) {
    return [{ error: BROKEN_CONNECTION_MSG }, 500];
  }
  let output;
  let status;
  try {
    output = await response.json();
    status = response.status;
  } catch (e) {
    output = { error: `Could not parse server response: ${e}` };
    status = 500;
  }
  return [output, status];
}
async function predict(endpoint, data = {}) {
  let data_returned = false;
  let status_complete = false;
  if (!this.config) {
    throw new Error("Could not resolve app config");
  }
  if (typeof endpoint === "number") {
    this.config.dependencies.find((dep) => dep.id == endpoint);
  } else {
    const trimmed_endpoint = endpoint.replace(/^\//, "");
    this.config.dependencies.find(
      (dep) => dep.id == this.api_map[trimmed_endpoint]
    );
  }
  return new Promise(async (resolve, reject) => {
    const app = this.submit(endpoint, data, null, null, true);
    let result;
    for await (const message of app) {
      if (message.type === "data") {
        if (status_complete) {
          resolve(result);
        }
        data_returned = true;
        result = message;
      }
      if (message.type === "status") {
        if (message.stage === "error")
          reject(message);
        if (message.stage === "complete") {
          status_complete = true;
          if (data_returned) {
            resolve(result);
          }
        }
      }
    }
  });
}
async function check_space_status(id, type, status_callback) {
  let endpoint = type === "subdomain" ? `https://huggingface.co/api/spaces/by-subdomain/${id}` : `https://huggingface.co/api/spaces/${id}`;
  let response;
  let _status;
  try {
    response = await fetch(endpoint);
    _status = response.status;
    if (_status !== 200) {
      throw new Error();
    }
    response = await response.json();
  } catch (e) {
    status_callback({
      status: "error",
      load_status: "error",
      message: SPACE_STATUS_ERROR_MSG,
      detail: "NOT_FOUND"
    });
    return;
  }
  if (!response || _status !== 200)
    return;
  const {
    runtime: { stage },
    id: space_name
  } = response;
  switch (stage) {
    case "STOPPED":
    case "SLEEPING":
      status_callback({
        status: "sleeping",
        load_status: "pending",
        message: "Space is asleep. Waking it up...",
        detail: stage
      });
      setTimeout(() => {
        check_space_status(id, type, status_callback);
      }, 1e3);
      break;
    case "PAUSED":
      status_callback({
        status: "paused",
        load_status: "error",
        message: "This space has been paused by the author. If you would like to try this demo, consider duplicating the space.",
        detail: stage,
        discussions_enabled: await discussions_enabled(space_name)
      });
      break;
    case "RUNNING":
    case "RUNNING_BUILDING":
      status_callback({
        status: "running",
        load_status: "complete",
        message: "Space is running.",
        detail: stage
      });
      break;
    case "BUILDING":
      status_callback({
        status: "building",
        load_status: "pending",
        message: "Space is building...",
        detail: stage
      });
      setTimeout(() => {
        check_space_status(id, type, status_callback);
      }, 1e3);
      break;
    case "APP_STARTING":
      status_callback({
        status: "starting",
        load_status: "pending",
        message: "Space is starting...",
        detail: stage
      });
      setTimeout(() => {
        check_space_status(id, type, status_callback);
      }, 1e3);
      break;
    default:
      status_callback({
        status: "space_error",
        load_status: "error",
        message: "This space is experiencing an issue.",
        detail: stage,
        discussions_enabled: await discussions_enabled(space_name)
      });
      break;
  }
}
var check_and_wake_space = async (space_id, status_callback) => {
  let retries = 0;
  const max_retries = 12;
  const check_interval = 5e3;
  return new Promise((resolve) => {
    check_space_status(
      space_id,
      RE_SPACE_NAME.test(space_id) ? "space_name" : "subdomain",
      (status) => {
        status_callback(status);
        if (status.status === "running") {
          resolve();
        } else if (status.status === "error" || status.status === "paused" || status.status === "space_error") {
          resolve();
        } else if (status.status === "sleeping" || status.status === "building") {
          if (retries < max_retries) {
            retries++;
            setTimeout(() => {
              check_and_wake_space(space_id, status_callback).then(resolve);
            }, check_interval);
          } else {
            resolve();
          }
        }
      }
    );
  });
};
var RE_DISABLED_DISCUSSION = /^(?=[^]*\b[dD]iscussions{0,1}\b)(?=[^]*\b[dD]isabled\b)[^]*$/;
async function discussions_enabled(space_id) {
  try {
    const r = await fetch(
      `https://huggingface.co/api/spaces/${space_id}/discussions`,
      {
        method: "HEAD"
      }
    );
    const error2 = r.headers.get("x-error-message");
    if (!r.ok || error2 && RE_DISABLED_DISCUSSION.test(error2))
      return false;
    return true;
  } catch (e) {
    return false;
  }
}
async function get_space_hardware(space_id, hf_token) {
  const headers = {};
  if (hf_token) {
    headers.Authorization = `Bearer ${hf_token}`;
  }
  try {
    const res = await fetch(
      `https://huggingface.co/api/spaces/${space_id}/${RUNTIME_URL}`,
      { headers }
    );
    if (res.status !== 200)
      throw new Error("Space hardware could not be obtained.");
    const { hardware } = await res.json();
    return hardware.current;
  } catch (e) {
    throw new Error(e.message);
  }
}
async function set_space_timeout(space_id, timeout, hf_token) {
  const headers = {};
  if (hf_token) {
    headers.Authorization = `Bearer ${hf_token}`;
  }
  const body = {
    seconds: timeout
  };
  try {
    const res = await fetch(
      `https://huggingface.co/api/spaces/${space_id}/${SLEEPTIME_URL}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(body)
      }
    );
    if (res.status !== 200) {
      throw new Error(
        "Could not set sleep timeout on duplicated Space. Please visit *ADD HF LINK TO SETTINGS* to set a timeout manually to reduce billing charges."
      );
    }
    const response = await res.json();
    return response;
  } catch (e) {
    throw new Error(e.message);
  }
}
var hardware_types = [
  "cpu-basic",
  "cpu-upgrade",
  "cpu-xl",
  "t4-small",
  "t4-medium",
  "a10g-small",
  "a10g-large",
  "a10g-largex2",
  "a10g-largex4",
  "a100-large",
  "zero-a10g",
  "h100",
  "h100x8"
];
async function duplicate(app_reference, options) {
  const { hf_token, private: _private, hardware, timeout, auth } = options;
  if (hardware && !hardware_types.includes(hardware)) {
    throw new Error(
      `Invalid hardware type provided. Valid types are: ${hardware_types.map((v) => `"${v}"`).join(",")}.`
    );
  }
  const { http_protocol, host } = await process_endpoint(
    app_reference,
    hf_token
  );
  let cookies = null;
  if (auth) {
    const cookie_header = await get_cookie_header(
      http_protocol,
      host,
      auth,
      fetch
    );
    if (cookie_header)
      cookies = parse_and_set_cookies(cookie_header);
  }
  const headers = {
    Authorization: `Bearer ${hf_token}`,
    "Content-Type": "application/json",
    ...cookies ? { Cookie: cookies.join("; ") } : {}
  };
  const user = (await (await fetch(`https://huggingface.co/api/whoami-v2`, {
    headers
  })).json()).name;
  const space_name = app_reference.split("/")[1];
  const body = {
    repository: `${user}/${space_name}`
  };
  if (_private) {
    body.private = true;
  }
  let original_hardware;
  try {
    if (!hardware) {
      original_hardware = await get_space_hardware(app_reference, hf_token);
    }
  } catch (e) {
    throw Error(SPACE_METADATA_ERROR_MSG + e.message);
  }
  const requested_hardware = hardware || original_hardware || "cpu-basic";
  body.hardware = requested_hardware;
  try {
    const response = await fetch(
      `https://huggingface.co/api/spaces/${app_reference}/duplicate`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(body)
      }
    );
    if (response.status === 409) {
      try {
        const client2 = await Client.connect(`${user}/${space_name}`, options);
        return client2;
      } catch (error2) {
        console.error("Failed to connect Client instance:", error2);
        throw error2;
      }
    } else if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const duplicated_space = await response.json();
    await set_space_timeout(`${user}/${space_name}`, timeout || 300, hf_token);
    return await Client.connect(
      get_space_reference(duplicated_space.url),
      options
    );
  } catch (e) {
    throw new Error(e);
  }
}
function get_space_reference(url) {
  const regex = /https:\/\/huggingface.co\/spaces\/([^/]+\/[^/]+)/;
  const match = url.match(regex);
  if (match) {
    return match[1];
  }
}
var TextLineStream = class extends TransformStream {
  /** Constructs a new instance. */
  constructor(options = { allowCR: false }) {
    super({
      transform: (chars, controller) => {
        chars = __privateGet(this, _currentLine) + chars;
        while (true) {
          const lfIndex = chars.indexOf("\n");
          const crIndex = options.allowCR ? chars.indexOf("\r") : -1;
          if (crIndex !== -1 && crIndex !== chars.length - 1 && (lfIndex === -1 || lfIndex - 1 > crIndex)) {
            controller.enqueue(chars.slice(0, crIndex));
            chars = chars.slice(crIndex + 1);
            continue;
          }
          if (lfIndex === -1)
            break;
          const endIndex = chars[lfIndex - 1] === "\r" ? lfIndex - 1 : lfIndex;
          controller.enqueue(chars.slice(0, endIndex));
          chars = chars.slice(lfIndex + 1);
        }
        __privateSet(this, _currentLine, chars);
      },
      flush: (controller) => {
        if (__privateGet(this, _currentLine) === "")
          return;
        const currentLine = options.allowCR && __privateGet(this, _currentLine).endsWith("\r") ? __privateGet(this, _currentLine).slice(0, -1) : __privateGet(this, _currentLine);
        controller.enqueue(currentLine);
      }
    });
    __privateAdd(this, _currentLine, "");
  }
};
_currentLine = /* @__PURE__ */ new WeakMap();
function stream$12(input) {
  let decoder = new TextDecoderStream();
  let split2 = new TextLineStream({ allowCR: true });
  return input.pipeThrough(decoder).pipeThrough(split2);
}
function split(input) {
  let rgx = /[:]\s*/;
  let match = rgx.exec(input);
  let idx = match && match.index;
  if (idx) {
    return [
      input.substring(0, idx),
      input.substring(idx + match[0].length)
    ];
  }
}
function fallback2(headers, key, value) {
  let tmp = headers.get(key);
  if (!tmp)
    headers.set(key, value);
}
async function* events(res, signal) {
  if (!res.body)
    return;
  let iter = stream$12(res.body);
  let line, reader = iter.getReader();
  let event;
  for (; ; ) {
    if (signal && signal.aborted) {
      return reader.cancel();
    }
    line = await reader.read();
    if (line.done)
      return;
    if (!line.value) {
      if (event)
        yield event;
      event = void 0;
      continue;
    }
    let [field, value] = split(line.value) || [];
    if (!field)
      continue;
    if (field === "data") {
      event || (event = {});
      event[field] = event[field] ? event[field] + "\n" + value : value;
    } else if (field === "event") {
      event || (event = {});
      event[field] = value;
    } else if (field === "id") {
      event || (event = {});
      event[field] = +value || value;
    } else if (field === "retry") {
      event || (event = {});
      event[field] = +value || void 0;
    }
  }
}
async function stream2(input, init) {
  let req = new Request(input, init);
  fallback2(req.headers, "Accept", "text/event-stream");
  fallback2(req.headers, "Content-Type", "application/json");
  let r = await fetch(req);
  if (!r.ok)
    throw r;
  return events(r, req.signal);
}
async function open_stream() {
  let {
    event_callbacks,
    unclosed_events,
    pending_stream_messages,
    stream_status,
    config,
    jwt
  } = this;
  const that = this;
  if (!config) {
    throw new Error("Could not resolve app config");
  }
  stream_status.open = true;
  let stream22 = null;
  let params = new URLSearchParams({
    session_hash: this.session_hash
  }).toString();
  let url = new URL(`${config.root}${this.api_prefix}/${SSE_URL}?${params}`);
  if (jwt) {
    url.searchParams.set("__sign", jwt);
  }
  stream22 = this.stream(url);
  if (!stream22) {
    console.warn("Cannot connect to SSE endpoint: " + url.toString());
    return;
  }
  stream22.onmessage = async function(event) {
    let _data = JSON.parse(event.data);
    if (_data.msg === "close_stream") {
      close_stream(stream_status, that.abort_controller);
      return;
    }
    const event_id = _data.event_id;
    if (!event_id) {
      await Promise.all(
        Object.keys(event_callbacks).map(
          (event_id2) => event_callbacks[event_id2](_data)
        )
      );
    } else if (event_callbacks[event_id] && config) {
      if (_data.msg === "process_completed" && ["sse", "sse_v1", "sse_v2", "sse_v2.1", "sse_v3"].includes(
        config.protocol
      )) {
        unclosed_events.delete(event_id);
      }
      let fn2 = event_callbacks[event_id];
      if (typeof window !== "undefined" && typeof document !== "undefined") {
        setTimeout(fn2, 0, _data);
      } else {
        fn2(_data);
      }
    } else {
      if (!pending_stream_messages[event_id]) {
        pending_stream_messages[event_id] = [];
      }
      pending_stream_messages[event_id].push(_data);
    }
  };
  stream22.onerror = async function() {
    await Promise.all(
      Object.keys(event_callbacks).map(
        (event_id) => event_callbacks[event_id]({
          msg: "unexpected_error",
          message: BROKEN_CONNECTION_MSG
        })
      )
    );
  };
}
function close_stream(stream_status, abort_controller) {
  if (stream_status) {
    stream_status.open = false;
    abort_controller == null ? void 0 : abort_controller.abort();
  }
}
function apply_diff_stream(pending_diff_streams, event_id, data) {
  let is_first_generation = !pending_diff_streams[event_id];
  if (is_first_generation) {
    pending_diff_streams[event_id] = [];
    data.data.forEach((value, i) => {
      pending_diff_streams[event_id][i] = value;
    });
  } else {
    data.data.forEach((value, i) => {
      let new_data = apply_diff(pending_diff_streams[event_id][i], value);
      pending_diff_streams[event_id][i] = new_data;
      data.data[i] = new_data;
    });
  }
}
function apply_diff(obj, diff) {
  diff.forEach(([action, path, value]) => {
    obj = apply_edit(obj, path, action, value);
  });
  return obj;
}
function apply_edit(target, path, action, value) {
  if (path.length === 0) {
    if (action === "replace") {
      return value;
    } else if (action === "append") {
      return target + value;
    }
    throw new Error(`Unsupported action: ${action}`);
  }
  let current = target;
  for (let i = 0; i < path.length - 1; i++) {
    current = current[path[i]];
  }
  const last_path = path[path.length - 1];
  switch (action) {
    case "replace":
      current[last_path] = value;
      break;
    case "append":
      current[last_path] += value;
      break;
    case "add":
      if (Array.isArray(current)) {
        current.splice(Number(last_path), 0, value);
      } else {
        current[last_path] = value;
      }
      break;
    case "delete":
      if (Array.isArray(current)) {
        current.splice(Number(last_path), 1);
      } else {
        delete current[last_path];
      }
      break;
    default:
      throw new Error(`Unknown action: ${action}`);
  }
  return target;
}
function readable_stream(input, init = {}) {
  const instance = {
    close: () => {
      console.warn("Method not implemented.");
    },
    onerror: null,
    onmessage: null,
    onopen: null,
    readyState: 0,
    url: input.toString(),
    withCredentials: false,
    CONNECTING: 0,
    OPEN: 1,
    CLOSED: 2,
    addEventListener: () => {
      throw new Error("Method not implemented.");
    },
    dispatchEvent: () => {
      throw new Error("Method not implemented.");
    },
    removeEventListener: () => {
      throw new Error("Method not implemented.");
    }
  };
  stream2(input, init).then(async (res) => {
    instance.readyState = instance.OPEN;
    try {
      for await (const chunk of res) {
        instance.onmessage && instance.onmessage(chunk);
      }
      instance.readyState = instance.CLOSED;
    } catch (e) {
      instance.onerror && instance.onerror(e);
      instance.readyState = instance.CLOSED;
    }
  }).catch((e) => {
    console.error(e);
    instance.onerror && instance.onerror(e);
    instance.readyState = instance.CLOSED;
  });
  return instance;
}
function submit(endpoint, data = {}, event_data, trigger_id, all_events) {
  var _a;
  try {
    let fire_event = function(event) {
      if (all_events || events_to_publish[event.type]) {
        push_event(event);
      }
    }, close = function() {
      done = true;
      while (resolvers.length > 0)
        resolvers.shift()({
          value: void 0,
          done: true
        });
    }, push2 = function(data2) {
      if (done)
        return;
      if (resolvers.length > 0) {
        resolvers.shift()(data2);
      } else {
        values.push(data2);
      }
    }, push_error = function(error2) {
      push2(thenable_reject(error2));
      close();
    }, push_event = function(event) {
      push2({ value: event, done: false });
    }, next = function() {
      if (values.length > 0)
        return Promise.resolve(values.shift());
      if (done)
        return Promise.resolve({ value: void 0, done: true });
      return new Promise((resolve) => resolvers.push(resolve));
    };
    const { hf_token } = this.options;
    const {
      fetch: fetch2,
      app_reference,
      config,
      session_hash,
      api_info,
      api_map,
      stream_status,
      pending_stream_messages,
      pending_diff_streams,
      event_callbacks,
      unclosed_events,
      post_data: post_data2,
      options,
      api_prefix
    } = this;
    const that = this;
    if (!api_info)
      throw new Error("No API found");
    if (!config)
      throw new Error("Could not resolve app config");
    let { fn_index, endpoint_info, dependency } = get_endpoint_info(
      api_info,
      endpoint,
      api_map,
      config
    );
    let resolved_data = map_data_to_params(data, endpoint_info);
    let websocket2;
    let stream22;
    let protocol = config.protocol ?? "ws";
    let event_id_final = "";
    let event_id_cb = () => event_id_final;
    const _endpoint = typeof endpoint === "number" ? "/predict" : endpoint;
    let payload;
    let event_id = null;
    let complete = false;
    let last_status = {};
    let url_params = typeof window !== "undefined" && typeof document !== "undefined" ? new URLSearchParams(window.location.search).toString() : "";
    const events_to_publish = ((_a = options == null ? void 0 : options.events) == null ? void 0 : _a.reduce(
      (acc, event) => {
        acc[event] = true;
        return acc;
      },
      {}
    )) || {};
    async function cancel() {
      const _status = {
        stage: "complete",
        queue: false,
        time: /* @__PURE__ */ new Date()
      };
      complete = _status;
      fire_event({
        ..._status,
        type: "status",
        endpoint: _endpoint,
        fn_index
      });
      let reset_request = {};
      let cancel_request = {};
      if (protocol === "ws") {
        if (websocket2 && websocket2.readyState === 0) {
          websocket2.addEventListener("open", () => {
            websocket2.close();
          });
        } else {
          websocket2.close();
        }
        reset_request = { fn_index, session_hash };
      } else {
        close_stream(stream_status, that.abort_controller);
        close();
        reset_request = { event_id };
        cancel_request = { event_id, session_hash, fn_index };
      }
      try {
        if (!config) {
          throw new Error("Could not resolve app config");
        }
        if ("event_id" in cancel_request) {
          await fetch2(`${config.root}${api_prefix}/${CANCEL_URL}`, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(cancel_request)
          });
        }
        await fetch2(`${config.root}${api_prefix}/${RESET_URL}`, {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify(reset_request)
        });
      } catch (e) {
        console.warn(
          "The `/reset` endpoint could not be called. Subsequent endpoint results may be unreliable."
        );
      }
    }
    const resolve_heartbeat = async (config2) => {
      await this._resolve_hearbeat(config2);
    };
    async function handle_render_config(render_config) {
      if (!config)
        return;
      let render_id = render_config.render_id;
      config.components = [
        ...config.components.filter((c) => c.props.rendered_in !== render_id),
        ...render_config.components
      ];
      config.dependencies = [
        ...config.dependencies.filter((d) => d.rendered_in !== render_id),
        ...render_config.dependencies
      ];
      const any_state = config.components.some((c) => c.type === "state");
      const any_unload = config.dependencies.some(
        (d) => d.targets.some((t) => t[1] === "unload")
      );
      config.connect_heartbeat = any_state || any_unload;
      await resolve_heartbeat(config);
      fire_event({
        type: "render",
        data: render_config,
        endpoint: _endpoint,
        fn_index
      });
    }
    this.handle_blob(config.root, resolved_data, endpoint_info).then(
      async (_payload) => {
        var _a2;
        let input_data = handle_payload(
          _payload,
          dependency,
          config.components,
          "input",
          true
        );
        payload = {
          data: input_data || [],
          event_data,
          fn_index,
          trigger_id
        };
        if (skip_queue(fn_index, config)) {
          fire_event({
            type: "status",
            endpoint: _endpoint,
            stage: "pending",
            queue: false,
            fn_index,
            time: /* @__PURE__ */ new Date()
          });
          post_data2(
            `${config.root}${api_prefix}/run${_endpoint.startsWith("/") ? _endpoint : `/${_endpoint}`}${url_params ? "?" + url_params : ""}`,
            {
              ...payload,
              session_hash
            }
          ).then(([output, status_code]) => {
            const data2 = output.data;
            if (status_code == 200) {
              fire_event({
                type: "data",
                endpoint: _endpoint,
                fn_index,
                data: handle_payload(
                  data2,
                  dependency,
                  config.components,
                  "output",
                  options.with_null_state
                ),
                time: /* @__PURE__ */ new Date(),
                event_data,
                trigger_id
              });
              if (output.render_config) {
                handle_render_config(output.render_config);
              }
              fire_event({
                type: "status",
                endpoint: _endpoint,
                fn_index,
                stage: "complete",
                eta: output.average_duration,
                queue: false,
                time: /* @__PURE__ */ new Date()
              });
            } else {
              fire_event({
                type: "status",
                stage: "error",
                endpoint: _endpoint,
                fn_index,
                message: output.error,
                queue: false,
                time: /* @__PURE__ */ new Date()
              });
            }
          }).catch((e) => {
            fire_event({
              type: "status",
              stage: "error",
              message: e.message,
              endpoint: _endpoint,
              fn_index,
              queue: false,
              time: /* @__PURE__ */ new Date()
            });
          });
        } else if (protocol == "ws") {
          const { ws_protocol, host } = await process_endpoint(
            app_reference,
            hf_token
          );
          fire_event({
            type: "status",
            stage: "pending",
            queue: true,
            endpoint: _endpoint,
            fn_index,
            time: /* @__PURE__ */ new Date()
          });
          let url = new URL(
            `${ws_protocol}://${resolve_root(
              host,
              config.path,
              true
            )}/queue/join${url_params ? "?" + url_params : ""}`
          );
          if (this.jwt) {
            url.searchParams.set("__sign", this.jwt);
          }
          websocket2 = new WebSocket(url);
          websocket2.onclose = (evt) => {
            if (!evt.wasClean) {
              fire_event({
                type: "status",
                stage: "error",
                broken: true,
                message: BROKEN_CONNECTION_MSG,
                queue: true,
                endpoint: _endpoint,
                fn_index,
                time: /* @__PURE__ */ new Date()
              });
            }
          };
          websocket2.onmessage = function(event) {
            const _data = JSON.parse(event.data);
            const { type, status, data: data2 } = handle_message(
              _data,
              last_status[fn_index]
            );
            if (type === "update" && status && !complete) {
              fire_event({
                type: "status",
                endpoint: _endpoint,
                fn_index,
                time: /* @__PURE__ */ new Date(),
                ...status
              });
              if (status.stage === "error") {
                websocket2.close();
              }
            } else if (type === "hash") {
              websocket2.send(JSON.stringify({ fn_index, session_hash }));
              return;
            } else if (type === "data") {
              websocket2.send(JSON.stringify({ ...payload, session_hash }));
            } else if (type === "complete") {
              complete = status;
            } else if (type === "log") {
              fire_event({
                type: "log",
                title: data2.title,
                log: data2.log,
                level: data2.level,
                endpoint: _endpoint,
                duration: data2.duration,
                visible: data2.visible,
                fn_index
              });
            } else if (type === "generating") {
              fire_event({
                type: "status",
                time: /* @__PURE__ */ new Date(),
                ...status,
                stage: status == null ? void 0 : status.stage,
                queue: true,
                endpoint: _endpoint,
                fn_index
              });
            }
            if (data2) {
              fire_event({
                type: "data",
                time: /* @__PURE__ */ new Date(),
                data: handle_payload(
                  data2.data,
                  dependency,
                  config.components,
                  "output",
                  options.with_null_state
                ),
                endpoint: _endpoint,
                fn_index,
                event_data,
                trigger_id
              });
              if (complete) {
                fire_event({
                  type: "status",
                  time: /* @__PURE__ */ new Date(),
                  ...complete,
                  stage: status == null ? void 0 : status.stage,
                  queue: true,
                  endpoint: _endpoint,
                  fn_index
                });
                websocket2.close();
              }
            }
          };
          if (semiver(config.version || "2.0.0", "3.6") < 0) {
            addEventListener(
              "open",
              () => websocket2.send(JSON.stringify({ hash: session_hash }))
            );
          }
        } else if (protocol == "sse") {
          fire_event({
            type: "status",
            stage: "pending",
            queue: true,
            endpoint: _endpoint,
            fn_index,
            time: /* @__PURE__ */ new Date()
          });
          var params = new URLSearchParams({
            fn_index: fn_index.toString(),
            session_hash
          }).toString();
          let url = new URL(
            `${config.root}${api_prefix}/${SSE_URL}?${url_params ? url_params + "&" : ""}${params}`
          );
          if (this.jwt) {
            url.searchParams.set("__sign", this.jwt);
          }
          stream22 = this.stream(url);
          if (!stream22) {
            return Promise.reject(
              new Error("Cannot connect to SSE endpoint: " + url.toString())
            );
          }
          stream22.onmessage = async function(event) {
            const _data = JSON.parse(event.data);
            const { type, status, data: data2 } = handle_message(
              _data,
              last_status[fn_index]
            );
            if (type === "update" && status && !complete) {
              fire_event({
                type: "status",
                endpoint: _endpoint,
                fn_index,
                time: /* @__PURE__ */ new Date(),
                ...status
              });
              if (status.stage === "error") {
                stream22 == null ? void 0 : stream22.close();
                close();
              }
            } else if (type === "data") {
              let [_, status2] = await post_data2(
                `${config.root}${api_prefix}/queue/data`,
                {
                  ...payload,
                  session_hash,
                  event_id
                }
              );
              if (status2 !== 200) {
                fire_event({
                  type: "status",
                  stage: "error",
                  message: BROKEN_CONNECTION_MSG,
                  queue: true,
                  endpoint: _endpoint,
                  fn_index,
                  time: /* @__PURE__ */ new Date()
                });
                stream22 == null ? void 0 : stream22.close();
                close();
              }
            } else if (type === "complete") {
              complete = status;
            } else if (type === "log") {
              fire_event({
                type: "log",
                title: data2.title,
                log: data2.log,
                level: data2.level,
                endpoint: _endpoint,
                duration: data2.duration,
                visible: data2.visible,
                fn_index
              });
            } else if (type === "generating" || type === "streaming") {
              fire_event({
                type: "status",
                time: /* @__PURE__ */ new Date(),
                ...status,
                stage: status == null ? void 0 : status.stage,
                queue: true,
                endpoint: _endpoint,
                fn_index
              });
            }
            if (data2) {
              fire_event({
                type: "data",
                time: /* @__PURE__ */ new Date(),
                data: handle_payload(
                  data2.data,
                  dependency,
                  config.components,
                  "output",
                  options.with_null_state
                ),
                endpoint: _endpoint,
                fn_index,
                event_data,
                trigger_id
              });
              if (complete) {
                fire_event({
                  type: "status",
                  time: /* @__PURE__ */ new Date(),
                  ...complete,
                  stage: status == null ? void 0 : status.stage,
                  queue: true,
                  endpoint: _endpoint,
                  fn_index
                });
                stream22 == null ? void 0 : stream22.close();
                close();
              }
            }
          };
        } else if (protocol == "sse_v1" || protocol == "sse_v2" || protocol == "sse_v2.1" || protocol == "sse_v3") {
          fire_event({
            type: "status",
            stage: "pending",
            queue: true,
            endpoint: _endpoint,
            fn_index,
            time: /* @__PURE__ */ new Date()
          });
          let hostname = "";
          if (typeof window !== "undefined" && typeof document !== "undefined") {
            hostname = (_a2 = window == null ? void 0 : window.location) == null ? void 0 : _a2.hostname;
          }
          let hfhubdev = "dev.spaces.huggingface.tech";
          const origin = hostname.includes(".dev.") ? `https://moon-${hostname.split(".")[1]}.${hfhubdev}` : `https://huggingface.co`;
          const is_iframe = typeof window !== "undefined" && typeof document !== "undefined" && window.parent != window;
          const is_zerogpu_space = dependency.zerogpu && config.space_id;
          const zerogpu_auth_promise = is_iframe && is_zerogpu_space ? post_message("zerogpu-headers", origin) : Promise.resolve(null);
          const post_data_promise = zerogpu_auth_promise.then((headers) => {
            return post_data2(
              `${config.root}${api_prefix}/${SSE_DATA_URL}?${url_params}`,
              {
                ...payload,
                session_hash
              },
              headers
            );
          });
          post_data_promise.then(async ([response, status]) => {
            if (status === 503) {
              fire_event({
                type: "status",
                stage: "error",
                message: QUEUE_FULL_MSG,
                queue: true,
                endpoint: _endpoint,
                fn_index,
                time: /* @__PURE__ */ new Date()
              });
            } else if (status !== 200) {
              fire_event({
                type: "status",
                stage: "error",
                message: BROKEN_CONNECTION_MSG,
                queue: true,
                endpoint: _endpoint,
                fn_index,
                time: /* @__PURE__ */ new Date()
              });
            } else {
              event_id = response.event_id;
              event_id_final = event_id;
              let callback = async function(_data) {
                try {
                  const { type, status: status2, data: data2, original_msg } = handle_message(
                    _data,
                    last_status[fn_index]
                  );
                  if (type == "heartbeat") {
                    return;
                  }
                  if (type === "update" && status2 && !complete) {
                    fire_event({
                      type: "status",
                      endpoint: _endpoint,
                      fn_index,
                      time: /* @__PURE__ */ new Date(),
                      original_msg,
                      ...status2
                    });
                  } else if (type === "complete") {
                    complete = status2;
                  } else if (type == "unexpected_error") {
                    console.error("Unexpected error", status2 == null ? void 0 : status2.message);
                    fire_event({
                      type: "status",
                      stage: "error",
                      message: (status2 == null ? void 0 : status2.message) || "An Unexpected Error Occurred!",
                      queue: true,
                      endpoint: _endpoint,
                      fn_index,
                      time: /* @__PURE__ */ new Date()
                    });
                  } else if (type === "log") {
                    fire_event({
                      type: "log",
                      title: data2.title,
                      log: data2.log,
                      level: data2.level,
                      endpoint: _endpoint,
                      duration: data2.duration,
                      visible: data2.visible,
                      fn_index
                    });
                    return;
                  } else if (type === "generating" || type === "streaming") {
                    fire_event({
                      type: "status",
                      time: /* @__PURE__ */ new Date(),
                      ...status2,
                      stage: status2 == null ? void 0 : status2.stage,
                      queue: true,
                      endpoint: _endpoint,
                      fn_index
                    });
                    if (data2 && dependency.connection !== "stream" && ["sse_v2", "sse_v2.1", "sse_v3"].includes(protocol)) {
                      apply_diff_stream(pending_diff_streams, event_id, data2);
                    }
                  }
                  if (data2) {
                    fire_event({
                      type: "data",
                      time: /* @__PURE__ */ new Date(),
                      data: handle_payload(
                        data2.data,
                        dependency,
                        config.components,
                        "output",
                        options.with_null_state
                      ),
                      endpoint: _endpoint,
                      fn_index
                    });
                    if (data2.render_config) {
                      await handle_render_config(data2.render_config);
                    }
                    if (complete) {
                      fire_event({
                        type: "status",
                        time: /* @__PURE__ */ new Date(),
                        ...complete,
                        stage: status2 == null ? void 0 : status2.stage,
                        queue: true,
                        endpoint: _endpoint,
                        fn_index
                      });
                      close();
                    }
                  }
                  if ((status2 == null ? void 0 : status2.stage) === "complete" || (status2 == null ? void 0 : status2.stage) === "error") {
                    if (event_callbacks[event_id]) {
                      delete event_callbacks[event_id];
                    }
                    if (event_id in pending_diff_streams) {
                      delete pending_diff_streams[event_id];
                    }
                  }
                } catch (e) {
                  console.error("Unexpected client exception", e);
                  fire_event({
                    type: "status",
                    stage: "error",
                    message: "An Unexpected Error Occurred!",
                    queue: true,
                    endpoint: _endpoint,
                    fn_index,
                    time: /* @__PURE__ */ new Date()
                  });
                  if (["sse_v2", "sse_v2.1", "sse_v3"].includes(protocol)) {
                    close_stream(stream_status, that.abort_controller);
                    stream_status.open = false;
                    close();
                  }
                }
              };
              if (event_id in pending_stream_messages) {
                pending_stream_messages[event_id].forEach(
                  (msg) => callback(msg)
                );
                delete pending_stream_messages[event_id];
              }
              event_callbacks[event_id] = callback;
              unclosed_events.add(event_id);
              if (!stream_status.open) {
                await this.open_stream();
              }
            }
          });
        }
      }
    );
    let done = false;
    const values = [];
    const resolvers = [];
    const iterator = {
      [Symbol.asyncIterator]: () => iterator,
      next,
      throw: async (value) => {
        push_error(value);
        return next();
      },
      return: async () => {
        close();
        return next();
      },
      cancel,
      event_id: event_id_cb
    };
    return iterator;
  } catch (error2) {
    console.error("Submit function encountered an error:", error2);
    throw error2;
  }
}
function thenable_reject(error2) {
  return {
    then: (resolve, reject) => reject(error2)
  };
}
function get_endpoint_info(api_info, endpoint, api_map, config) {
  let fn_index;
  let endpoint_info;
  let dependency;
  if (typeof endpoint === "number") {
    fn_index = endpoint;
    endpoint_info = api_info.unnamed_endpoints[fn_index];
    dependency = config.dependencies.find((dep) => dep.id == endpoint);
  } else {
    const trimmed_endpoint = endpoint.replace(/^\//, "");
    fn_index = api_map[trimmed_endpoint];
    endpoint_info = api_info.named_endpoints[endpoint.trim()];
    dependency = config.dependencies.find(
      (dep) => dep.id == api_map[trimmed_endpoint]
    );
  }
  if (typeof fn_index !== "number") {
    throw new Error(
      "There is no endpoint matching that name of fn_index matching that number."
    );
  }
  return { fn_index, endpoint_info, dependency };
}
var Client = class {
  constructor(app_reference, options = { events: ["data"] }) {
    __publicField(this, "app_reference");
    __publicField(this, "options");
    __publicField(this, "config");
    __publicField(this, "api_prefix", "");
    __publicField(this, "api_info");
    __publicField(this, "api_map", {});
    __publicField(this, "session_hash", Math.random().toString(36).substring(2));
    __publicField(this, "jwt", false);
    __publicField(this, "last_status", {});
    __publicField(this, "cookies", null);
    __publicField(this, "stream_status", { open: false });
    __publicField(this, "pending_stream_messages", {});
    __publicField(this, "pending_diff_streams", {});
    __publicField(this, "event_callbacks", {});
    __publicField(this, "unclosed_events", /* @__PURE__ */ new Set());
    __publicField(this, "heartbeat_event", null);
    __publicField(this, "abort_controller", null);
    __publicField(this, "stream_instance", null);
    __publicField(this, "current_payload");
    __publicField(this, "ws_map", {});
    __publicField(this, "view_api");
    __publicField(this, "upload_files");
    __publicField(this, "upload");
    __publicField(this, "handle_blob");
    __publicField(this, "post_data");
    __publicField(this, "submit");
    __publicField(this, "predict");
    __publicField(this, "open_stream");
    __publicField(this, "resolve_config");
    __publicField(this, "resolve_cookies");
    this.app_reference = app_reference;
    if (!options.events) {
      options.events = ["data"];
    }
    this.options = options;
    this.current_payload = {};
    this.view_api = view_api.bind(this);
    this.upload_files = upload_files.bind(this);
    this.handle_blob = handle_blob.bind(this);
    this.post_data = post_data.bind(this);
    this.submit = submit.bind(this);
    this.predict = predict.bind(this);
    this.open_stream = open_stream.bind(this);
    this.resolve_config = resolve_config.bind(this);
    this.resolve_cookies = resolve_cookies.bind(this);
    this.upload = upload.bind(this);
    this.fetch = this.fetch.bind(this);
    this.handle_space_success = this.handle_space_success.bind(this);
    this.stream = this.stream.bind(this);
  }
  fetch(input, init) {
    const headers = new Headers((init == null ? void 0 : init.headers) || {});
    if (this && this.cookies) {
      headers.append("Cookie", this.cookies);
    }
    if (this && this.options.headers) {
      for (const name in this.options.headers) {
        headers.append(name, this.options.headers[name]);
      }
    }
    return fetch(input, { ...init, headers });
  }
  stream(url) {
    const headers = new Headers();
    if (this && this.cookies) {
      headers.append("Cookie", this.cookies);
    }
    if (this && this.options.headers) {
      for (const name in this.options.headers) {
        headers.append(name, this.options.headers[name]);
      }
    }
    this.abort_controller = new AbortController();
    this.stream_instance = readable_stream(url.toString(), {
      credentials: "include",
      headers,
      signal: this.abort_controller.signal
    });
    return this.stream_instance;
  }
  async init() {
    var _a;
    if ((typeof window === "undefined" || !("WebSocket" in window)) && !global.WebSocket) {
      const ws = await Promise.resolve().then(() => (init_wrapper_CviSselG(), wrapper_CviSselG_exports));
      global.WebSocket = ws.WebSocket;
    }
    if (this.options.auth) {
      await this.resolve_cookies();
    }
    await this._resolve_config().then(
      ({ config }) => this._resolve_hearbeat(config)
    );
    this.api_info = await this.view_api();
    this.api_map = map_names_to_ids(((_a = this.config) == null ? void 0 : _a.dependencies) || []);
  }
  async _resolve_hearbeat(_config) {
    if (_config) {
      this.config = _config;
      this.api_prefix = _config.api_prefix || "";
      if (this.config && this.config.connect_heartbeat) {
        if (this.config.space_id && this.options.hf_token) {
          this.jwt = await get_jwt(
            this.config.space_id,
            this.options.hf_token,
            this.cookies
          );
        }
      }
    }
    if (_config.space_id && this.options.hf_token) {
      this.jwt = await get_jwt(_config.space_id, this.options.hf_token);
    }
    if (this.config && this.config.connect_heartbeat) {
      const heartbeat_url = new URL(
        `${this.config.root}${this.api_prefix}/${HEARTBEAT_URL}/${this.session_hash}`
      );
      if (this.jwt) {
        heartbeat_url.searchParams.set("__sign", this.jwt);
      }
      if (!this.heartbeat_event) {
        this.heartbeat_event = this.stream(heartbeat_url);
      }
    }
  }
  static async connect(app_reference, options = {
    events: ["data"]
  }) {
    const client2 = new this(app_reference, options);
    await client2.init();
    return client2;
  }
  close() {
    close_stream(this.stream_status, this.abort_controller);
  }
  set_current_payload(payload) {
    this.current_payload = payload;
  }
  static async duplicate(app_reference, options = {
    events: ["data"]
  }) {
    return duplicate(app_reference, options);
  }
  async _resolve_config() {
    const { http_protocol, host, space_id } = await process_endpoint(
      this.app_reference,
      this.options.hf_token
    );
    const { status_callback } = this.options;
    if (space_id && status_callback) {
      await check_and_wake_space(space_id, status_callback);
    }
    let config;
    try {
      config = await this.resolve_config(`${http_protocol}//${host}`);
      if (!config) {
        throw new Error(CONFIG_ERROR_MSG);
      }
      return this.config_success(config);
    } catch (e) {
      if (space_id && status_callback) {
        check_space_status(
          space_id,
          RE_SPACE_NAME.test(space_id) ? "space_name" : "subdomain",
          this.handle_space_success
        );
      } else {
        if (status_callback)
          status_callback({
            status: "error",
            message: "Could not load this space.",
            load_status: "error",
            detail: "NOT_FOUND"
          });
        throw Error(e);
      }
    }
  }
  async config_success(_config) {
    this.config = _config;
    this.api_prefix = _config.api_prefix || "";
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      if (window.location.protocol === "https:") {
        this.config.root = this.config.root.replace("http://", "https://");
      }
    }
    if (this.config.auth_required) {
      return this.prepare_return_obj();
    }
    try {
      this.api_info = await this.view_api();
    } catch (e) {
      console.error(API_INFO_ERROR_MSG + e.message);
    }
    return this.prepare_return_obj();
  }
  async handle_space_success(status) {
    var _a;
    if (!this) {
      throw new Error(CONFIG_ERROR_MSG);
    }
    const { status_callback } = this.options;
    if (status_callback)
      status_callback(status);
    if (status.status === "running") {
      try {
        this.config = await this._resolve_config();
        this.api_prefix = ((_a = this == null ? void 0 : this.config) == null ? void 0 : _a.api_prefix) || "";
        if (!this.config) {
          throw new Error(CONFIG_ERROR_MSG);
        }
        const _config = await this.config_success(this.config);
        return _config;
      } catch (e) {
        if (status_callback) {
          status_callback({
            status: "error",
            message: "Could not load this space.",
            load_status: "error",
            detail: "NOT_FOUND"
          });
        }
        throw e;
      }
    }
  }
  async component_server(component_id, fn_name, data) {
    var _a;
    if (!this.config) {
      throw new Error(CONFIG_ERROR_MSG);
    }
    const headers = {};
    const { hf_token } = this.options;
    const { session_hash } = this;
    if (hf_token) {
      headers.Authorization = `Bearer ${this.options.hf_token}`;
    }
    let root_url;
    let component = this.config.components.find(
      (comp) => comp.id === component_id
    );
    if ((_a = component == null ? void 0 : component.props) == null ? void 0 : _a.root_url) {
      root_url = component.props.root_url;
    } else {
      root_url = this.config.root;
    }
    let body;
    if ("binary" in data) {
      body = new FormData();
      for (const key in data.data) {
        if (key === "binary")
          continue;
        body.append(key, data.data[key]);
      }
      body.set("component_id", component_id.toString());
      body.set("fn_name", fn_name);
      body.set("session_hash", session_hash);
    } else {
      body = JSON.stringify({
        data,
        component_id,
        fn_name,
        session_hash
      });
      headers["Content-Type"] = "application/json";
    }
    if (hf_token) {
      headers.Authorization = `Bearer ${hf_token}`;
    }
    try {
      const response = await this.fetch(
        `${root_url}${this.api_prefix}/${COMPONENT_SERVER_URL}/`,
        {
          method: "POST",
          body,
          headers,
          credentials: "include"
        }
      );
      if (!response.ok) {
        throw new Error(
          "Could not connect to component server: " + response.statusText
        );
      }
      const output = await response.json();
      return output;
    } catch (e) {
      console.warn(e);
    }
  }
  set_cookies(raw_cookies) {
    this.cookies = parse_and_set_cookies(raw_cookies).join("; ");
  }
  prepare_return_obj() {
    return {
      config: this.config,
      predict: this.predict,
      submit: this.submit,
      view_api: this.view_api,
      component_server: this.component_server
    };
  }
  async connect_ws(url) {
    return new Promise((resolve, reject) => {
      let ws;
      try {
        ws = new WebSocket(url);
      } catch (e) {
        this.ws_map[url] = "failed";
        return;
      }
      ws.onopen = () => {
        resolve();
      };
      ws.onerror = (error2) => {
        console.error("WebSocket error:", error2);
        this.close_ws(url);
        this.ws_map[url] = "failed";
        resolve();
      };
      ws.onclose = () => {
        delete this.ws_map[url];
        this.ws_map[url] = "failed";
      };
      ws.onmessage = (event) => {
      };
      this.ws_map[url] = ws;
    });
  }
  async send_ws_message(url, data) {
    if (!(url in this.ws_map)) {
      await this.connect_ws(url);
    }
    const ws = this.ws_map[url];
    if (ws instanceof WebSocket) {
      ws.send(JSON.stringify(data));
    } else {
      this.post_data(url, data);
    }
  }
  async close_ws(url) {
    if (url in this.ws_map) {
      const ws = this.ws_map[url];
      if (ws instanceof WebSocket) {
        ws.close();
        delete this.ws_map[url];
      }
    }
  }
};

// src/nodes/CowsayPluginNode.ts
function cowsayPluginNode(rivet) {
  const CowsayPluginNodeImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId(),
        // This is the default data that your node will store
        data: {
          someData: "Hello World From LP!!!",
          SK: ""
        },
        // This is the default title of your node.
        title: "Cowsa",
        // This must match the type of your node.
        type: "cowsayPlugin",
        // X and Y should be set to 0. Width should be set to a reasonable number so there is no overflow.
        visualData: {
          x: 0,
          y: 0,
          width: 200
        }
      };
      return node;
    },
    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      if (data.useSomeDataInput) {
        inputs.push({
          id: "someData",
          dataType: "string",
          title: "Some Data"
        });
        inputs.push({
          id: "SK",
          dataType: "string",
          title: "Secret Key"
        });
      }
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        {
          id: "someData",
          dataType: "string",
          title: "Some Data"
        },
        {
          id: "SK",
          dataType: "string",
          title: "Secret Key"
        }
      ];
    },
    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData() {
      return {
        contextMenuTitle: "Cowsay !!!",
        group: "Lilypad",
        infoBoxBody: "This is an example plugin node.",
        infoBoxTitle: "Example Plugin Node"
      };
    },
    // This function defines all editors that appear when you edit your node.
    getEditors(_data) {
      return [
        {
          type: "string",
          dataKey: "someData",
          useInputToggleDataKey: "useSomeDataInput",
          label: "Some Data"
        },
        {
          type: "string",
          dataKey: "SK",
          useInputToggleDataKey: "useSomeDataInput",
          label: "Secret Key"
        }
      ];
    },
    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(data) {
      return rivet.dedent`
        Example Plugin Node
        Data: ${data.useSomeDataInput ? "(Using Input)" : data.someData}
      `;
    },
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(data, inputData, _context) {
      const someData = rivet.getInputOrData(
        data,
        inputData,
        "someData",
        "string"
      );
      const api = _context.getPluginConfig("api") || "no api url. check plugin config";
      const sk = _context.getPluginConfig("sk") || "no sk url check plugin config";
      const payload = {
        pk: sk,
        module: someData.split(",")[0],
        inputs: `-i "${someData.split(",")[1]}="`,
        stream: "true"
      };
      const result = await fetch("http://localhost:4000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
          // 'Authorization': `Bearer ${apisk}`
        },
        body: JSON.stringify(payload)
      });
      const client = await Client.connect("http://localhost:7860/");
      const result1 = await client.predict("/run", {
        dropdown: "cowsay:v0.0.4,Message",
        prompt: "Hello!!"
      });
      const s = "await result ";
      console.log("1024");
      return {
        ["someData"]: {
          type: "string",
          value: s || "no response"
        }
      };
    }
  };
  const cowsayPluginNode2 = rivet.pluginNodeDefinition(
    CowsayPluginNodeImpl,
    "Example Plugin Node"
  );
  return cowsayPluginNode2;
}

// src/nodes/SearchAgentPluginNode.ts
function searchAgentPluginNode(rivet) {
  const SearchAgentPluginNodeImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId(),
        // This is the default data that your node will store
        data: {
          someData: "Hello World From LP!!!"
          // SK:""
        },
        // This is the default title of your node.
        title: "Paper Search Agent",
        // This must match the type of your node.
        type: "searchAgentPlugin",
        // X and Y should be set to 0. Width should be set to a reasonable number so there is no overflow.
        visualData: {
          x: 0,
          y: 0,
          width: 200
        }
      };
      return node;
    },
    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      if (data.useSomeDataInput) {
        inputs.push({
          id: "someData",
          dataType: "string",
          title: "Terms"
        });
      }
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        {
          id: "someData",
          dataType: "string",
          title: "Results"
        }
        // {
        //   id: "SK" as PortId,
        //   dataType: "string",
        //   title: "Secret Key",
        // },
      ];
    },
    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData() {
      return {
        contextMenuTitle: "Paper Search Agent",
        group: "BioMl",
        infoBoxBody: "Its primary purpose is to perform a targeted literature search over a large corpus of oncology-related documents. By leveraging semantic search techniques and Retrieval Augmented Generation (RAG), this agent identifies a set of papers or excerpts most likely relevant to the oncology target in question.",
        infoBoxTitle: "The Search Agent"
      };
    },
    // This function defines all editors that appear when you edit your node.
    getEditors(_data) {
      return [
        {
          type: "string",
          dataKey: "someData",
          useInputToggleDataKey: "useSomeDataInput",
          label: "Some Data"
        }
        // {
        //   type: "string",
        //   dataKey: "SK",
        //   useInputToggleDataKey: "useSomeDataInput",
        //   label: "Secret Key",
        // },
      ];
    },
    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(data) {
      return rivet.dedent`
        Agent-1: The Search Agent is the entry point into the Decentralized AI-Oncologist pipeline. Its primary purpose is to perform a targeted literature search over a large corpus of oncology-related documents. By leveraging semantic search techniques and Retrieval Augmented Generation (RAG), this agent identifies a set of papers or excerpts most likely relevant to the oncology target in question.
        
      `;
    },
    // Data: ${data.useSomeDataInput ? "(Using Input)" : data.someData}
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(data, inputData, _context) {
      const someData = rivet.getInputOrData(
        data,
        inputData,
        "someData",
        "string"
      );
      const result = await fetch("https://jsonplaceholder.typicode.com/posts");
      return {
        ["someData"]: {
          type: "string",
          value: await result.text()
        }
      };
    }
  };
  const searchAgentPluginNode2 = rivet.pluginNodeDefinition(
    SearchAgentPluginNodeImpl,
    "Search Agent Plugin Node"
  );
  return searchAgentPluginNode2;
}

// src/nodes/PaperReaderAgentPluginNode.ts
function paperReaderAgentPluginNode(rivet) {
  const PaperReaderPluginNodeImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId(),
        // This is the default data that your node will store
        data: {
          someData: "Hello World From LP!!!"
          // SK:""
        },
        // This is the default title of your node.
        title: "Paper Reader Agent",
        // This must match the type of your node.
        type: "paperReaderAgentPlugin",
        // X and Y should be set to 0. Width should be set to a reasonable number so there is no overflow.
        visualData: {
          x: 0,
          y: 0,
          width: 200
        }
      };
      return node;
    },
    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      if (data.useSomeDataInput) {
        inputs.push({
          id: "Papers",
          dataType: "string",
          title: "Papers"
        });
      }
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        {
          id: "someData",
          dataType: "string",
          title: "Results"
        }
        // {
        //   id: "SK" as PortId,
        //   dataType: "string",
        //   title: "Secret Key",
        // },
      ];
    },
    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData() {
      return {
        contextMenuTitle: "Paper Reader Agent",
        group: "BioMl",
        infoBoxBody: "Its core function is to process the documents retrieved by Agent-1 (The Search Agent) at a finer granularity\u2014examining each paper paragraph-by-paragraph. The goal is to identify textual segments that potentially describe proteins, molecules, or structural features relevant to the target disease context discovered in the literature.",
        infoBoxTitle: "The Paper Reader "
      };
    },
    // This function defines all editors that appear when you edit your node.
    getEditors(_data) {
      return [
        {
          type: "string",
          dataKey: "someData",
          useInputToggleDataKey: "useSomeDataInput",
          label: "Some Data"
        }
        // {
        //   type: "string",
        //   dataKey: "SK",
        //   useInputToggleDataKey: "useSomeDataInput",
        //   label: "Secret Key",
        // },
      ];
    },
    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(data) {
      return rivet.dedent`
       The Paper Reader 
       is the second step in the Decentralized AI-Oncologist pipeline. Its core function is to process the documents retrieved by Agent-1 (The Search Agent) at a finer granularity—examining each paper paragraph-by-paragraph. The goal is to identify textual segments that potentially describe proteins, molecules, or structural features relevant to the target disease context discovered in the literature.
      `;
    },
    // Data: ${data.useSomeDataInput ? "(Using Input)" : data.someData}
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(data, inputData, _context) {
      const someData = rivet.getInputOrData(
        data,
        inputData,
        "someData",
        "string"
      );
      const result = await fetch("https://jsonplaceholder.typicode.com/posts");
      return {
        ["someData"]: {
          type: "string",
          value: await result.text()
        }
      };
    }
  };
  const paperReaderAgentPluginNode2 = rivet.pluginNodeDefinition(
    PaperReaderPluginNodeImpl,
    "Paper Reader Agent Plugin Node"
  );
  return paperReaderAgentPluginNode2;
}

// src/nodes/OncologistAgentPluginNode.ts
function oncologistAgentPluginNode(rivet) {
  const OncologistAgentPluginNodeImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId(),
        // This is the default data that your node will store
        data: {
          someData: "Hello World From LP!!!"
          // SK:""
        },
        // This is the default title of your node.
        title: "Oncologist Agent",
        // This must match the type of your node.
        type: "oncologistAgentPlugin",
        // X and Y should be set to 0. Width should be set to a reasonable number so there is no overflow.
        visualData: {
          x: 0,
          y: 0,
          width: 200
        }
      };
      return node;
    },
    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      if (data.useSomeDataInput) {
        inputs.push({
          id: "someData",
          dataType: "string",
          title: "Terms"
        });
      }
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        {
          id: "someData",
          dataType: "string",
          title: "Results"
        }
        // {
        //   id: "SK" as PortId,
        //   dataType: "string",
        //   title: "Secret Key",
        // },
      ];
    },
    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData() {
      return {
        contextMenuTitle: "Oncologist Agent",
        group: "BioMl",
        infoBoxBody: "Its primary purpose is to perform a targeted literature search over a large corpus of oncology-related documents. By leveraging semantic search techniques and Retrieval Augmented Generation (RAG), this agent identifies a set of papers or excerpts most likely relevant to the oncology target in question.",
        infoBoxTitle: "The Oncologist Agent"
      };
    },
    // This function defines all editors that appear when you edit your node.
    getEditors(_data) {
      return [
        {
          type: "string",
          dataKey: "someData",
          useInputToggleDataKey: "useSomeDataInput",
          label: "Some Data"
        }
        // {
        //   type: "string",
        //   dataKey: "SK",
        //   useInputToggleDataKey: "useSomeDataInput",
        //   label: "Secret Key",
        // },
      ];
    },
    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(data) {
      return rivet.dedent`
       Transform unstructured insights (relevant paragraphs and knowledge graphs) into a precise experimental blueprint for protein design.
      `;
    },
    // Data: ${data.useSomeDataInput ? "(Using Input)" : data.someData}
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(data, inputData, _context) {
      const someData = rivet.getInputOrData(
        data,
        inputData,
        "someData",
        "string"
      );
      const result = await fetch("https://jsonplaceholder.typicode.com/posts");
      return {
        ["someData"]: {
          type: "string",
          value: await result.text()
        }
      };
    }
  };
  const oncologistAgentPluginNode2 = rivet.pluginNodeDefinition(
    OncologistAgentPluginNodeImpl,
    "Search Agent Plugin Node"
  );
  return oncologistAgentPluginNode2;
}

// src/nodes/ProteinDesignerAgentPluginNode.ts
function proteinDesignerAgentPluginNode(rivet) {
  const ProteinDesignerAgentPluginNodeImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId(),
        // This is the default data that your node will store
        data: {
          someData: "Hello World From LP!!!"
          // SK:""
        },
        // This is the default title of your node.
        title: "Protein Designer Agent",
        // This must match the type of your node.
        type: "proteinDesignerAgentPlugin",
        // X and Y should be set to 0. Width should be set to a reasonable number so there is no overflow.
        visualData: {
          x: 0,
          y: 0,
          width: 200
        }
      };
      return node;
    },
    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      if (data.useSomeDataInput) {
        inputs.push({
          id: "someData",
          dataType: "string",
          title: "Terms"
        });
      }
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        {
          id: "someData",
          dataType: "string",
          title: "Results"
        }
        // {
        //   id: "SK" as PortId,
        //   dataType: "string",
        //   title: "Secret Key",
        // },
      ];
    },
    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData() {
      return {
        contextMenuTitle: "Protein Designer Agent",
        group: "BioMl",
        infoBoxBody: "Its primary purpose is to perform a targeted literature search over a large corpus of oncology-related documents. By leveraging semantic search techniques and Retrieval Augmented Generation (RAG), this agent identifies a set of papers or excerpts most likely relevant to the oncology target in question.",
        infoBoxTitle: "The Protein Designer Agent"
      };
    },
    // This function defines all editors that appear when you edit your node.
    getEditors(_data) {
      return [
        {
          type: "string",
          dataKey: "someData",
          useInputToggleDataKey: "useSomeDataInput",
          label: "Some Data"
        }
        // {
        //   type: "string",
        //   dataKey: "SK",
        //   useInputToggleDataKey: "useSomeDataInput",
        //   label: "Secret Key",
        // },
      ];
    },
    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(data) {
      return rivet.dedent`
       TBD
      `;
    },
    // Data: ${data.useSomeDataInput ? "(Using Input)" : data.someData}
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(data, inputData, _context) {
      const someData = rivet.getInputOrData(
        data,
        inputData,
        "someData",
        "string"
      );
      const result = await fetch("https://jsonplaceholder.typicode.com/posts");
      return {
        ["someData"]: {
          type: "string",
          value: await result.text()
        }
      };
    }
  };
  const proteinDesignerAgentPluginNode2 = rivet.pluginNodeDefinition(
    ProteinDesignerAgentPluginNodeImpl,
    "Search Agent Plugin Node"
  );
  return proteinDesignerAgentPluginNode2;
}

// src/index.ts
var plugin = (rivet) => {
  const exampleNode = examplePluginNode(rivet);
  const cowsayNode = cowsayPluginNode(rivet);
  const searchNode = searchAgentPluginNode(rivet);
  const readerNode = paperReaderAgentPluginNode(rivet);
  const oncologistNode = oncologistAgentPluginNode(rivet);
  const proteinDesignerNode = proteinDesignerAgentPluginNode(rivet);
  const examplePlugin = {
    // The ID of your plugin should be unique across all plugins.
    id: "example-plugin-lp",
    // The name of the plugin is what is displayed in the Rivet UI.
    name: "Lilypad Plugin",
    // Define all configuration settings in the configSpec object.
    configSpec: {
      sk: {
        type: "string",
        label: "Secret Key",
        description: "Paste in your secret key.",
        helperText: "Paste in your secret key."
      },
      api: {
        type: "string",
        label: "Api",
        description: "Paste in your api url.",
        helperText: "Paste in your api url."
      }
    },
    // Define any additional context menu groups your plugin adds here.
    contextMenuGroups: [
      {
        id: "lilypad",
        label: "Lilypad"
      },
      {
        id: "bioml",
        label: "BioMl"
      }
    ],
    // Register any additional nodes your plugin adds here. This is passed a `register`
    // function, which you can use to register your nodes.
    register: (register) => {
      register(exampleNode);
      register(cowsayNode);
      register(searchNode);
      register(readerNode);
      register(oncologistNode);
      register(proteinDesignerNode);
    }
  };
  return examplePlugin;
};
var src_default = plugin;
export {
  src_default as default
};
