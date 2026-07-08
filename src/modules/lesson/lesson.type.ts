import { Lesson } from "@/prisma/generated/client";
import { PaginatedResponse } from "../../shared/types/types";
import { AcademyRequestHandler } from "../academy/academy.type";
import { JobProfileRequestHandler } from "../jobProfile/jobProfile.type";

import {
    CreateLessonDto,
    UpdateLessonDto,
    GetAllLessonsDto,
    GetLessonDetailsDto,
    ChangeLessonStateDto,
} from "./lesson.dto";

export interface ILessonService {
    createLesson(
        data: CreateLessonDto
    ): Promise<Lesson>;

    updateLesson(
        data: UpdateLessonDto
    ): Promise<Lesson>;

    getAllLessons(
        data: GetAllLessonsDto
    ): Promise<PaginatedResponse<Lesson>>;

    getLessonDetails(
        data: GetLessonDetailsDto
    ): Promise<Lesson>;

    changeLessonState(data: ChangeLessonStateDto): Promise<Lesson>;
}

export interface ILessonController {
    createLesson: JobProfileRequestHandler;

    updateLesson: JobProfileRequestHandler;

    getAllLessons: AcademyRequestHandler;

    getLessonDetails: JobProfileRequestHandler;

    changeLessonState: JobProfileRequestHandler;
}