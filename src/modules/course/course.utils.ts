import { CourseOrderByWithRelationInput, CourseWhereInput } from "@/prisma/generated/models";

export const buildCourseWhere = ({
  academyId,
  search,
  isActive,
}: {
  academyId: string;
  search?: string;
  isActive?: boolean;
}): CourseWhereInput => {
  const where: CourseWhereInput = {
    academyId,
  };

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
        },
      },
      {
        description: {
          contains: search,
        },
      },
    ];
  }

  if (typeof isActive !== "undefined") {
    where.isActive = isActive;
  }

  return where;
};

export const orderBy: CourseOrderByWithRelationInput = {
  createdAt: "desc",
}