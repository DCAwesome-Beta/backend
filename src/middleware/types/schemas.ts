import * as yup from 'yup';

// User
export const signupSchema = yup.object({
  body: yup
    .object({
        email: yup.string().email().required(),
        password: yup.string().required()
    })
    .noUnknown(true)
    .strict()
});

export const loginSchema = yup.object({
    body: yup
      .object({
          email: yup.string().email().required(),
          password: yup.string().required()
      })
      .noUnknown(true)
      .strict()
  });
  
// Wallet
export const walletTokenBalanceSchema = yup.object({
    params: yup
        .object({
            id: yup.string().required()
        })
        .noUnknown(true)
        .strict(),
    query: yup
        .object({
            includeAll: yup.bool().optional(),
            name: yup.string().optional(),
            tokenAddresses: yup.array().of(yup.string().required()).optional(),
            standard: yup.string().optional(),
            from: yup.date().optional(),
            to: yup.date().optional(),
            pageBefore: yup.string().optional(),
            pageAfter: yup.string().optional(),
            pageSize: yup.number().optional()
      })
        .noUnknown(true)
        .strict()
  });
  
export const listWalletsSchema = yup.object({
    query: yup
        .object({
            address: yup.string().optional(),
            blockchain: yup.string().optional(),
            walletSetId: yup.string().optional(),
            refId: yup.string().optional(),
            from: yup.date().optional(),
            to: yup.date().optional(),
            pageBefore: yup.string().optional(),
            pageAfter: yup.string().optional(),
            pageSize: yup.number().optional()
        })
        .noUnknown(true)
        .strict()
});

export const getWalletSchema = yup.object({
    params: yup
        .object({
            id: yup.string().required()
        })
        .noUnknown(true)
        .strict()
});

export const createWalletSetSchema = yup.object({
    body: yup
        .object({
            name: yup.string().required()
        })
        .noUnknown(true)
        .strict()
});

export const createWalletSchema = yup.object({
    body: yup
        .object({
            blockchain: yup.string().required(),
            walletSetId: yup.string().required()
        })
        .noUnknown(true)
        .strict()
});

// Faucet
export const postFaucetDripSchema = yup.object({
    body: yup
      .object({
        address: yup.string().required(),
        blockchain: yup.string().required()
      })
      .noUnknown(true)
      .strict()
  });
  