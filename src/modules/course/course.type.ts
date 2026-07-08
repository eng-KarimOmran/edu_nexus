import { Course } from "@/prisma/generated/client";
import { PaginatedResponse } from "../../shared/types/types";
import { AcademyRequestHandler } from "../academy/academy.type";

import {
    CreateCourseDto,
    UpdateCourseDto,
    DeleteCourseDto,
    GetAllCoursesDto,
    GetCourseDetailsDto,
    AddCourseFeaturesDto,
    DeleteCourseFeaturesDto,
} from "./course.dto";

export interface ICourseService {
    createCourse(
        data: CreateCourseDto
    ): Promise<Course>;

    updateCourse(
        data: UpdateCourseDto
    ): Promise<Course>;

    deleteCourse(
        data: DeleteCourseDto
    ): Promise<Course>;

    getAllCourses(
        data: GetAllCoursesDto
    ): Promise<PaginatedResponse<Course>>;

    getCourseDetails(
        data: GetCourseDetailsDto
    ): Promise<Course>;

    addCourseFeature(
        data: AddCourseFeaturesDto
    ): Promise<Course>;

    deleteCourseFeature(data: DeleteCourseFeaturesDto): Promise<Course>;
}

export interface ICourseController {
    createCourse: AcademyRequestHandler;

    updateCourse: AcademyRequestHandler;

    deleteCourse: AcademyRequestHandler;

    getAllCourses: AcademyRequestHandler;

    getCourseDetails: AcademyRequestHandler;

    addCourseFeature: AcademyRequestHandler;

    deleteCourseFeature: AcademyRequestHandler;
}