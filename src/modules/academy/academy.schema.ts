import z from "zod";

import {
  address,
  id,
  limit,
  phone,
  platform,
  url,
  entityName,
  page,
} from "../../shared/utils/common.validation";

export const AcademySchema = {
  create: {
    body: z.object({
      name: entityName,
      profileTrackingUrl: url.optional(),
      phone,
      userId: id,
    }),
  },

  update: {
    params: z.object({
      academyId: id,
    }),
    body: z.object({
      name: entityName.optional(),
      profileTrackingUrl: url.optional()
    }),
  },

  delete: {
    params: z.object({
      academyId: id,
    }),
  },

  get: {
    params: z.object({
      academyId: id,
    }),
  },

  getAll: {
    query: z.object({
      page,
      limit,
      search: z.string().optional(),
    }),
  },

  phone: {
    add: {
      params: z.object({
        academyId: id,
      }),
      body: z.object({
        phone,
      }),
    },

    delete: {
      params: z.object({
        academyId: id,
        phoneId: id,
      }),
    },
  },

  address: {
    add: {
      params: z.object({
        academyId: id,
      }),
      body: z.object({
        address,
      }),
    },

    delete: {
      params: z.object({
        academyId: id,
        addressId: id,
      }),
    },
  },

  socialMedia: {
    add: {
      params: z.object({
        academyId: id,
      }),
      body: z.object({
        platform,
        url,
      }),
    },

    delete: {
      params: z.object({
        academyId: id,
        socialMediaId: id,
      }),
    }
  },

  owner: {
    add: {
      params: z.object({
        academyId: id,
        userId: id,
      }),
    },

    delete: {
      params: z.object({
        academyId: id,
        userId: id,
      }),
    },
  },
  paymentLink: {
    add: {
      params: z.object({
        academyId: id,
      }),
      body: z.object({
        url: url,
        walletProvider: z.string(),
        phone: phone.optional()
      }),
    },
    delete: {
      params: z.object({
        academyId: id,
        paymentLinkId: id,
      }),
    }
  },
  
  rule: {
    add: {
      params: z.object({
        academyId: id,
      }),
      body: z.object({
        content: z.string().trim().min(1).max(5000),
      }),
    },

    delete: {
      params: z.object({
        academyId: id,
        ruleId: id,
      }),
    },
  },
};