import * as DTO from "./payroll.dto";
import PayrollService from "./payroll.service";
import sendSuccess from "../../shared/utils/successResponse";
import { IPayrollController } from "./payroll.type";

const PayrollController: IPayrollController = {
    createPayroll: async (req, res) => {
        const dataSafe = req.dataSafe as DTO.CreatePayrollDto;

        const payroll = await PayrollService.createPayroll(dataSafe);

        return sendSuccess({
            res,
            statusCode: 201,
            data: payroll,
            message: "تم إنشاء الراتب بنجاح",
        });
    },

    deletePayroll: async (req, res) => {
        const dataSafe = req.dataSafe as DTO.DeletePayrollDto;

        await PayrollService.deletePayroll(dataSafe);

        return sendSuccess({
            res,
            message: "تم حذف الراتب بنجاح",
        });
    },
    getAllPayroll: async (req, res) => {
        const dataSafe = req.dataSafe as DTO.GetAllPayrollDto;

        const data = await PayrollService.getAllPayroll(dataSafe);

        return sendSuccess({
            res,
            data
        });
    }
};

export default PayrollController;