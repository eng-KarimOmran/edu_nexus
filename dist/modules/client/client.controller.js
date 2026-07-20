"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const successResponse_1 = __importDefault(require("../../shared/utils/successResponse"));
const client_service_1 = __importDefault(require("./client.service"));
const ClientController = {
    create: async (req, res) => {
        const dataSafe = req.dataSafe;
        const userId = req.userLogin.id;
        const client = await client_service_1.default.createClient({ userId, body: dataSafe.body, params: dataSafe.params });
        return (0, successResponse_1.default)({
            res,
            statusCode: 201,
            data: client,
            message: "تم تسجيل العميل بنجاح",
        });
    },
    getAll: async (req, res) => {
        const dataSafe = req.dataSafe;
        const data = await client_service_1.default.getAllClients(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data,
        });
    },
    getDetails: async (req, res) => {
        const dataSafe = req.dataSafe;
        const clientData = await client_service_1.default.getClientDetails(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data: clientData,
        });
    },
    update: async (req, res) => {
        const dataSafe = req.dataSafe;
        const updatedClient = await client_service_1.default.updateClient(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data: updatedClient,
            message: "تم تحديث العميل بنجاح",
        });
    },
    delete: async (req, res) => {
        const dataSafe = req.dataSafe;
        await client_service_1.default.deleteClient(dataSafe);
        return (0, successResponse_1.default)({
            res,
            message: "تم حذف العميل نهائيًا",
        });
    },
};
exports.default = ClientController;
