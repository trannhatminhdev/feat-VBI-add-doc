import { VBI } from '@visactor/vbi';
import {
  VQuery,
  type DatasetColumn,
  type RawDatasetSource,
  type VQueryDSL,
} from '@visactor/vquery';

let localData: unknown[] = [];
let localSchema: DatasetColumn[] | null = null;
let datasetNeedsRefresh = true;

export const createLocalConnector = (connectorId: string) => {
  const vquery = new VQuery();

  VBI.registerConnector(connectorId, async () => {
    return {
      discoverSchema: async () => {
        if (localData.length === 0) {
          return [];
        }

        if (localSchema) {
          return localSchema;
        }

        // 从数据的第一行推断字段类型
        const firstRow = localData[0];
        if (typeof firstRow !== 'object' || firstRow === null) {
          return [];
        }
        const schema = Object.entries(firstRow as Record<string, unknown>).map(
          ([name, value]) => ({
            name,
            type: typeof value === 'number' ? 'number' : 'string',
          }),
        );
        return schema;
      },

      query: async ({ queryDSL, schema }) => {
        const hasDataset = await vquery.hasDataset(connectorId);

        if (hasDataset && datasetNeedsRefresh) {
          await vquery.dropDataset(connectorId);
        }

        if (!(await vquery.hasDataset(connectorId))) {
          if (localData.length === 0) {
            return { dataset: [] };
          }

          const datasetSource = { type: 'json', rawDataset: localData };
          await vquery.createDataset(
            connectorId,
            schema as DatasetColumn[],
            datasetSource as RawDatasetSource,
          );
          datasetNeedsRefresh = false;
        }

        const dataset = await vquery.connectDataset(connectorId);
        const queryResult = await dataset.query(
          queryDSL as VQueryDSL<Record<string, string | number>>,
        );

        // 度量感知的类型转换：将度量结果从字符串转换为数字
        let normalizedDataset = queryResult.dataset;
        if (queryDSL.select && Array.isArray(queryDSL.select)) {
          // 识别度量列和维度列，查询结果列名优先 alias，否则 field
          const measureFields: { field: string; alias: string }[] = [];
          const dimensionFields: { field: string; alias: string }[] = [];

          for (const item of queryDSL.select) {
            if (typeof item === 'string') {
              dimensionFields.push({ field: item, alias: item });
              continue;
            }

            if (typeof item === 'object' && item !== null) {
              const field = (item as any).field as string | undefined;
              const alias = ((item as any).alias ?? field) as
                | string
                | undefined;

              if (!field || !alias) {
                continue;
              }

              if ((item as any).aggr?.func) {
                measureFields.push({ field, alias });
              } else {
                dimensionFields.push({ field, alias });
              }
            }
          }

          if (measureFields.length > 0 || dimensionFields.length > 0) {
            // SQL 列名优先是 alias（如果提供），否则是 field
            normalizedDataset = queryResult.dataset.map((row) => {
              const next: Record<string, any> = {};

              for (const { field, alias } of measureFields) {
                const sourceKey = alias || field;
                const raw = (row as any)[sourceKey];

                if (raw != null) {
                  let num: number;
                  if (typeof raw === 'string') {
                    num = Number(raw);
                  } else if (typeof raw === 'bigint') {
                    num = Number(raw);
                  } else if (typeof raw === 'number') {
                    num = raw;
                  } else {
                    num = NaN;
                  }

                  // 保留查询结果列名（优先 alias，否则 field），避免下游取不到值
                  if (!Number.isNaN(num)) {
                    next[sourceKey] = num;
                  }
                }
              }

              for (const { field, alias } of dimensionFields) {
                const sourceKey = alias || field;
                const raw = (row as any)[sourceKey];
                if (raw != null) {
                  next[sourceKey] = raw;
                }
              }

              return next;
            });
          }
        }

        return {
          dataset: normalizedDataset,
        };
      },
    };
  });

  return connectorId;
};

export const setLocalData = (data: unknown[]) => {
  localData = data;
  localSchema = null;
  datasetNeedsRefresh = true;
};

export const setLocalDataWithSchema = (
  data: unknown[],
  schema: DatasetColumn[] | null,
) => {
  localData = data;
  localSchema = schema;
  datasetNeedsRefresh = true;
};

export const getLocalData = () => localData;
