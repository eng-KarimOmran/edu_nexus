import sendSuccess from "../../shared/utils/successResponse";
import * as DTO from "./client.dto";
import ClientService from "./client.service";
import { IClientController } from "./client.type";

const ClientController: IClientController = {
  create: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.CreateClientDto;
    const userId = req.userLogin!.id

    const client = await ClientService.createClient({ userId, body: dataSafe.body, params: dataSafe.params });

    return sendSuccess({
      res,
      statusCode: 201,
      data: client,
      message: "تم تسجيل العميل بنجاح",
    });
  },

  getAll: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.GetAllClientsDto;

    const data = await ClientService.getAllClients(dataSafe);

    return sendSuccess({
      res,
      data,
    });
  },

  getDetails: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.GetClientDetailsDto;

    const clientData = await ClientService.getClientDetails(dataSafe);

    return sendSuccess({
      res,
      data: clientData,
    });
  },

  update: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.UpdateClientDto;

    const updatedClient = await ClientService.updateClient(dataSafe);

    return sendSuccess({
      res,
      data: updatedClient,
      message: "تم تحديث العميل بنجاح",
    });
  },

  delete: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.DeleteClientDto;

    await ClientService.deleteClient(dataSafe);

    return sendSuccess({
      res,
      message: "تم حذف العميل نهائيًا",
    });
  },
};

export default ClientController;