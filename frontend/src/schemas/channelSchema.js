import * as Yup from 'yup'

export const getChannelNameSchema = (t, existingNames) => Yup.object({
  name: Yup.string()
    .trim()
    .min(3, t('validation.channelNameLength'))
    .max(20, t('validation.channelNameLength'))
    .notOneOf(existingNames, t('validation.mustBeUnique'))
    .required(t('validation.required')),
})
