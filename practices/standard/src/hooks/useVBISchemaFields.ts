import { useEffect, useMemo, useState } from 'react';
import type { VBIChartBuilder } from '@visactor/vbi';
import {
  getFieldRoleBySchemaType,
  isDateSchemaType,
  type FieldRole,
} from 'src/utils/fieldRole';

export interface VBISchemaField {
  name: string;
  type: string;
  role: FieldRole;
  isDate: boolean;
}

const EMPTY_SCHEMA: VBISchemaField[] = [];

export const useVBISchemaFields = (builder: VBIChartBuilder | undefined) => {
  const [schemaFields, setSchemaFields] =
    useState<VBISchemaField[]>(EMPTY_SCHEMA);

  useEffect(() => {
    let destroyed = false;

    const run = async () => {
      if (!builder) {
        setSchemaFields(EMPTY_SCHEMA);
        return;
      }

      const schema = await builder.getSchema();
      if (destroyed) {
        return;
      }

      setSchemaFields(
        schema.map((item) => ({
          name: item.name,
          type: item.type,
          role: getFieldRoleBySchemaType(item.type),
          isDate: isDateSchemaType(item.type),
        })),
      );
    };

    run();

    return () => {
      destroyed = true;
    };
  }, [builder]);

  const fieldRoleMap = useMemo(() => {
    return Object.fromEntries(
      schemaFields.map((item) => [item.name, item.role]),
    ) as Record<string, FieldRole>;
  }, [schemaFields]);

  const fieldTypeMap = useMemo(() => {
    return Object.fromEntries(
      schemaFields.map((item) => [item.name, item.type]),
    ) as Record<string, string>;
  }, [schemaFields]);

  return {
    schemaFields,
    fieldRoleMap,
    fieldTypeMap,
  };
};
