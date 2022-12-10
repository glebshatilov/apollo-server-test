import { makeSchemaForDomain } from '../../../utils/schema.js'

export const schema = await makeSchemaForDomain(import.meta.url)
