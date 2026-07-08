import * as DTO from "./jobProfile.dto";
import JobProfileService from "./jobProfile.service";
import sendSuccess from "../../shared/utils/successResponse";
import { IJobProfileController } from "./jobProfile.type";

const JobProfileController: IJobProfileController = {
  createJobProfile: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.CreateJobProfileDto;

    const jobProfile = await JobProfileService.createJobProfile(dataSafe);

    return sendSuccess({
      res,
      statusCode: 201,
      data: jobProfile,
      message: "تم إنشاء الملف الوظيفي بنجاح",
    });
  },

  updateJobProfile: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.UpdateJobProfileDto;

    const jobProfile = await JobProfileService.updateJobProfile(dataSafe);

    return sendSuccess({
      res,
      data: jobProfile,
      message: "تم تحديث الملف الوظيفي بنجاح",
    });
  },

  deleteJobProfile: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.DeleteJobProfileDto;

    await JobProfileService.deleteJobProfile(dataSafe);

    return sendSuccess({
      res,
      message: "تم حذف الملف الوظيفي بنجاح",
    });
  },

  getAllJobProfiles: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.GetAllJobProfilesDto;

    const data = await JobProfileService.getAllJobProfiles(dataSafe);

    return sendSuccess({
      res,
      data,
    });
  },

  getJobProfileDetails: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.GetJobProfileDetailsDto;

    const jobProfile = await JobProfileService.getJobProfileDetails(dataSafe);

    return sendSuccess({
      res,
      data: jobProfile,
    });
  },
};

export default JobProfileController;