"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toEgyptDate = void 0;
const dayjs_config_1 = __importDefault(require("../../config/dayjs-config"));
const toEgyptDate = (val) => {
    return (0, dayjs_config_1.default)(val).tz("Africa/Cairo").toDate();
};
exports.toEgyptDate = toEgyptDate;
