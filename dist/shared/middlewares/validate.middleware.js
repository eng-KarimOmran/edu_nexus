"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const validate = ({ body, params, query, }) => {
    return async (req, _, next) => {
        try {
            if (!req.dataSafe)
                req.dataSafe = {};
            if (body) {
                req.dataSafe.body = await body.strict().parseAsync(req.body);
            }
            if (query) {
                req.dataSafe.query = await query.strict().parseAsync(req.query);
            }
            if (params) {
                req.dataSafe.params = await params.strict().parseAsync(req.params);
            }
            next();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                const message = err.issues
                    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
                    .join(" | ");
                throw ApiError_1.default.ValidationError(message);
            }
            throw ApiError_1.default.Internal();
        }
    };
};
exports.default = validate;
