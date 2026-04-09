import * as y from 'yup';

// create one
export const getAirBnbWebPageSchema = y.object({
  url: y
    .string()
    .url()
    .matches(/^https:\/\/airbnb\.com/)
    .required(),
});

export type GetAirBnbWebPage = y.InferType<typeof getAirBnbWebPageSchema>;
