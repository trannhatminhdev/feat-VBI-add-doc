export type FieldRole = 'dimension' | 'measure';

export const getFieldRoleBySchemaType = (schemaType?: string): FieldRole => {
  return schemaType === 'number' ? 'measure' : 'dimension';
};

const DATE_SCHEMA_TYPES = new Set(['date', 'datetime', 'timestamp']);

export const isDateSchemaType = (schemaType?: string) => {
  if (!schemaType) {
    return false;
  }

  return DATE_SCHEMA_TYPES.has(schemaType.toLowerCase());
};
