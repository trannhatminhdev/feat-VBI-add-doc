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
