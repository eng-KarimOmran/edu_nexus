import { JobProfileType, SupportType } from "@/prisma/generated/enums";
import {
  JobProfileOrderByWithRelationInput,
  JobProfileWhereInput,
} from "@/prisma/generated/models";

export const buildJobProfileWhere = ({
  search,
  isActive,
  jobProfileType,
  supportType,
}: {
  search?: string;
  isActive?: boolean;
  jobProfileType?: JobProfileType;
  supportType?: SupportType;
}): JobProfileWhereInput => {
  const where: JobProfileWhereInput = {};

  if (search) {
    where.OR = [
      { id: { contains: search } },
      {
        user: {
          OR: [
            {
              name: {
                contains: search,
              },
            },
            {
              phone: {
                contains: search,
              },
            },
          ],
        }
      }
    ]
  }

  if (typeof isActive === "boolean") {
    where.isActive = isActive;
  }

  if (jobProfileType) {
    where.jobProfileType = jobProfileType;
  }

  if (supportType) {
    where.supportType = { in: ["BOTH", supportType] };
  }

  return where;
};

export const orderBy: JobProfileOrderByWithRelationInput = {
  createdAt: "desc",
};