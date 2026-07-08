import * as DTO from "./walletMovement.dto";
import LedgerTransactionService from "./walletMovement.service";
import sendSuccess from "../../shared/utils/successResponse";
import { IWalletMovementController } from "./walletMovement.type";

const LedgerTransactionController: IWalletMovementController = {
  processPaymentTransaction: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.ProcessPaymentTransactionDto
    const { body, params } = dataSafe
    const isOwner = req.isOwner
    const jobProfileId = req.jobProfile?.id



    const ledgerTransaction = await LedgerTransactionService.processPaymentTransaction({ body, params, isOwner, jobProfileId });

    return sendSuccess({
      res,
      statusCode: 201,
      data: ledgerTransaction,
      message: "تم إنشاء الحركة المالية بنجاح",
    });
  },

  getAllWalletMovements: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.GetAllWalletMovementDto

    const data = await LedgerTransactionService.getAllWalletMovements(dataSafe);

    return sendSuccess({
      res,
      data,
    });
  },

  getWalletMovementDetails: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.GetLedgerTransactionDetailsDto;

    const ledgerTransaction = await LedgerTransactionService.getWalletMovementDetails(dataSafe);

    return sendSuccess({
      res,
      data: ledgerTransaction,
    });
  },

  changeWalletMovementStatus: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.ChangeWalletMovementStatusDto;

    const ledgerTransaction = await LedgerTransactionService.changeWalletMovementStatus(dataSafe);

    return sendSuccess({
      res,
      data: ledgerTransaction,
    });
  },

  transferFunds: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.TransferFundsDto;
    const jobProfileId = req.jobProfile?.id
    const isOwner = req.isOwner

    const ledgerTransaction = await LedgerTransactionService.transferFunds({ ...dataSafe, jobProfileId, isOwner });

    return sendSuccess({
      res,
      data: ledgerTransaction,
    });
  }
};

export default LedgerTransactionController;