import { Validator } from 'pear-apps-utils-validator'

import {
  customFieldSchema,
  validateAndPrepareCustomFields
} from './validateAndPrepareCustomFields'

export const passPhraseSchema = Validator.object({
  title: Validator.string().required(),
  passPhrase: Validator.string().required(),
  comment: Validator.string(),
  customFields: Validator.array().items(customFieldSchema)
})

export const validateAndPreparePassPhraseData = (passPhrase) => {
  const passPhraseData = {
    title: passPhrase.title,
    passPhrase: passPhrase.passPhrase,
    comment: passPhrase.comment,
    customFields: validateAndPrepareCustomFields(passPhrase.customFields)
  }

  const errors = passPhraseSchema.validate(passPhraseData)

  if (errors) {
    throw new Error(
      `Invalid pass phrase data: ${JSON.stringify(errors, null, 2)}`
    )
  }

  return passPhraseData
}
