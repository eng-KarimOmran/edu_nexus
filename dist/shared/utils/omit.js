"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.omit = void 0;
const lodash_es_1 = require("lodash-es");
const omit = (obj, keys) => {
    const uniqueKeys = Array.from(new Set(keys));
    return (0, lodash_es_1.omit)(obj, uniqueKeys);
};
exports.omit = omit;
