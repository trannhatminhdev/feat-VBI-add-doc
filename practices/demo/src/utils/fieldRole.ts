export type FieldRole = 'dimension' | 'measure';

export const getFieldRoleBySchemaType = (schemaType?: string): FieldRole => {
  return schemaType === 'number' ? 'measure' : 'dimension';
};
