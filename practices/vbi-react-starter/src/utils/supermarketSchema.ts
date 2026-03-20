import type { DatasetColumn } from '@visactor/vquery';

export const supermarketSchema: DatasetColumn[] = [
  { name: 'id', type: 'string' },
  { name: 'order_id', type: 'string' },
  { name: 'order_date', type: 'date' },
  { name: 'delivery_date', type: 'date' },
  { name: 'delivery_method', type: 'string' },
  { name: 'customer_id', type: 'string' },
  { name: 'customer_name', type: 'string' },
  { name: 'customer_type', type: 'string' },
  { name: 'city', type: 'string' },
  { name: 'province', type: 'string' },
  { name: 'country_or_region', type: 'string' },
  { name: 'area', type: 'string' },
  { name: 'product_id', type: 'string' },
  { name: 'product_type', type: 'string' },
  { name: 'product_sub_type', type: 'string' },
  { name: 'product_name', type: 'string' },
  { name: 'sales', type: 'number' },
  { name: 'amount', type: 'number' },
  { name: 'discount', type: 'number' },
  { name: 'profit', type: 'number' },
];

export const supermarketDimensions = supermarketSchema
  .filter((field) => field.type !== 'number')
  .map((field) => field.name);

export const supermarketMeasures = supermarketSchema
  .filter((field) => field.type === 'number')
  .map((field) => field.name);
