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
  