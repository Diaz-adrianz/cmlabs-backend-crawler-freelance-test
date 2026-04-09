import * as y from 'yup';

// create one
export const getSequenceDayWebPageSchema = y.object({
  url: y
    .string()
    .url()
    .matches(/^https:\/\/sequence\.day/)
    .required(),
});

export type GetSequenceDayWebPage = y.InferType<
  typeof getSequenceDayWebPageSchema
>;
