import * as y from 'yup';

// create one
export const getCMLabsWebPageSchema = y.object({
  url: y
    .string()
    .url()
    .matches(/^https:\/\/cmlabs\.co/)
    .required(),
});

export type GetCMLabsWebPage = y.InferType<typeof getCMLabsWebPageSchema>;
