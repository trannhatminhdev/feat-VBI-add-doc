
export type TimeUnit = 'minute' | 'hour' | 'day' | 'month' | 'quarter' | 'year' | 'second' | 'week';
export type AggrFunc = 'avg' | 'count_distinct' | 'count' | 'max' | 'median' | 'min' | 'quantile' | 'stddev' | 'sum' | 'variance' | 'variancePop';

export interface MinimalistChartInput {
  
  datasetId: string;
  description?: string;
  dataset: any[];
  schema: any[];

  
  dimensions?: string[];              
  time?: [string, TimeUnit][];         // 形如: [['date', 'month'], ['date', 'year']]
  measures?: [string, AggrFunc, string?][];     // 形如: [['sales', 'sum' , alias], ['sales', 'avg', alias]]
  
  orderBy?: { field: string; order:  'desc' }[];
  limit?: number;
}