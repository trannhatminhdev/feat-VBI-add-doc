import { VBI } from '@visactor/vbi';
import {
  VQuery,
  type DatasetColumn,
  type RawDatasetSource,
  type VQueryDSL,
} from '@visactor/vquery';

let localData: unknown[] = [];

export const createLocalConnector = (connectorId: string) => {
  const vquery = new VQuery();
  console.log('Creating local connector:', connectorId);

  VBI.registerConnector(connectorId, async () => {
    console.log('Connector called for:', connectorId);
    return {
      discoverSchema: async () => {
        console.log('discoverSchema called, localData:', localData);
        if (localData.length === 0) {
          console.log('No local data yet');
          return [];
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
        console.log('Schema discovered:', schema);
        return schema;
      },

      query: async ({ queryDSL, schema }) => {
        console.log('query called with DSL:', queryDSL, 'schema:', schema);
        if (!(await vquery.hasDataset(connectorId))) {
          if (localData.length === 0) {
            console.log('No data for query');
            return { dataset: [] };
          }

          const datasetSource = { type: 'json', rawDataset: localData };
          console.log('Creating dataset...');
          await vquery.createDataset(
            connectorId,
            schema as DatasetColumn[],
            datasetSource as RawDatasetSource,
          );
        }

        const dataset = await vquery.connectDataset(connectorId);
        const queryResult = await dataset.query(
          queryDSL as VQueryDSL<Record<string, string | number>>,
        );
        console.log('Query result:', queryResult);

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
          console.log('Identified measure fields:', measureFields);

          if (measureFields.length > 0 || dimensionFields.length > 0) {
            // SQL 列名优先是 alias（如果提供），否则是 field
            normalizedDataset = queryResult.dataset.map((row) => {
              const next: Record<string, any> = {};

              for (const { field, alias } of measureFields) {
                const sourceKey = alias || field;
                const raw = (row as any)[sourceKey];
                console.log(
                  `Before: ${sourceKey} = ${raw} (type: ${typeof raw})`,
                );

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

                  // 仅在有效时赋值，使用 alias 作为列名
                  if (!Number.isNaN(num)) {
                    next[field] = num;
                  }
                }

                console.log(
                  `After: ${field} = ${next[field]} (type: ${typeof next[field]})`,
                );
              }

              for (const { field, alias } of dimensionFields) {
                const sourceKey = alias || field;
                const raw = (row as any)[sourceKey];
                if (raw != null) {
                  next[field] = raw;
                }
              }

              return next;
            });

            console.log('Normalized dataset:', normalizedDataset);
          }
        }

        return {
          dataset: queryResult.dataset,
        };
      },
    };
  });

  return connectorId;
};

export const setLocalData = (data: unknown[]) => {
  localData = data;
};

export const getLocalData = () => localData;
