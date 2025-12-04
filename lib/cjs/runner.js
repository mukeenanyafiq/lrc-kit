"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runner = void 0;
var lrc_1 = require("./lrc");
var Runner = /** @class */ (function () {
    function Runner(lrc, offset) {
        if (lrc === void 0) { lrc = new lrc_1.Lrc(); }
        if (offset === void 0) { offset = true; }
        this.offset = offset;
        this._currentIndex = -1;
        this._currentWordIndex = [];
        this.setLrc(lrc);
    }
    Runner.prototype.setLrc = function (lrc) {
        this.lrc = lrc.clone();
        this.lrcUpdate();
    };
    Runner.prototype.lrcUpdate = function () {
        if (this.offset) {
            this._offsetAlign();
        }
        // this._sort();
    };
    Runner.prototype._offsetAlign = function () {
        if ('offset' in this.lrc.info) {
            var offset = parseInt(this.lrc.info.offset) / 1000;
            if (!isNaN(offset)) {
                this.lrc.offset(offset);
                delete this.lrc.info.offset;
            }
        }
    };
    Runner.prototype._sort = function () {
        this.lrc.lyrics.sort(function (a, b) { return a.timestamp - b.timestamp; });
    };
    Runner.prototype.timeUpdate = function (timestamp) {
        if (this._currentIndex >= this.lrc.lyrics.length) {
            this._currentIndex = this.lrc.lyrics.length - 1;
        }
        else if (this._currentIndex < -1) {
            this._currentIndex = -1;
        }
        var _a = __read(this._findIndex2(timestamp), 2), index = _a[0], wordIndex = _a[1];
        this._currentIndex = index;
        this._currentWordIndex = wordIndex;
    };
    Runner.prototype._findIndex = function (timestamp, startIndex) {
        var curFrontTimestamp = startIndex == -1
            ? Number.NEGATIVE_INFINITY
            : this.lrc.lyrics[startIndex].timestamp;
        var curBackTimestamp = startIndex == this.lrc.lyrics.length - 1
            ? Number.POSITIVE_INFINITY
            : this.lrc.lyrics[startIndex + 1].timestamp;
        if (timestamp < curFrontTimestamp) {
            return this._findIndex(timestamp, startIndex - 1);
        }
        else if (timestamp === curBackTimestamp) {
            if (curBackTimestamp === Number.POSITIVE_INFINITY) {
                return startIndex;
            }
            else {
                return startIndex + 1;
            }
        }
        else if (timestamp > curBackTimestamp) {
            return this._findIndex(timestamp, startIndex + 1);
        }
        else {
            return startIndex;
        }
    };
    Runner.prototype._findIndex2 = function (timestamp) {
        var e_1, _a, e_2, _b;
        var currentIndex = -1;
        var currentWordIndex = [];
        var largestTimestamp = -1.0;
        try {
            for (var _c = __values(this.lrc.lyrics.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = __read(_d.value, 2), key = _e[0], line_1 = _e[1];
                if (line_1.timestamp < largestTimestamp) {
                    break;
                }
                if (line_1.timestamp <= timestamp) {
                    currentIndex = key;
                    largestTimestamp = line_1.timestamp;
                }
                if (line_1.timestamp > timestamp) {
                    break;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var line = this.lrc.lyrics[currentIndex];
        if (currentIndex >= 0 && line.wordTimestamps) {
            try {
                for (var _f = __values(line.wordTimestamps.entries()), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var _h = __read(_g.value, 2), key = _h[0], wordT = _h[1];
                    if (wordT.timestamp <= timestamp) {
                        currentWordIndex.push(key);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        return [currentIndex, currentWordIndex];
    };
    Runner.prototype.getInfo = function () {
        return this.lrc.info;
    };
    Runner.prototype.getLyrics = function () {
        return this.lrc.lyrics;
    };
    Runner.prototype.getLyric = function (index) {
        if (index === void 0) { index = this.curIndex(); }
        if (index >= 0 && index <= this.lrc.lyrics.length - 1) {
            return this.lrc.lyrics[index];
        }
        else {
            throw new Error('Index not exist');
        }
    };
    Runner.prototype.curIndex = function () {
        return this._currentIndex;
    };
    Runner.prototype.curWordIndex = function () {
        return this._currentWordIndex;
    };
    Runner.prototype.curLyric = function () {
        return this.getLyric();
    };
    return Runner;
}());
exports.Runner = Runner;
