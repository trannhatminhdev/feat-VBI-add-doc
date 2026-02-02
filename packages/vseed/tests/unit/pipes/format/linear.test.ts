import { createLinearFormat, createLinearPercentFormat } from 'src/pipeline/spec/chart/pipes/axes/format/linearFormat'

test('createLinearFormat', () => {
  const formatter = (val: any) => `formatted-${val}`;
  
  // Case 1: autoFormat true
  expect(createLinearFormat(10, true, {}, formatter)).toBe('10'); // autoFormatter default
  
  // Case 2: numFormat not empty
  expect(createLinearFormat(10, false, { type: 'percent' }, formatter)).toBe('formatted-10');
  
  // Case 3: default (no auto, no numFormat)
  expect(createLinearFormat(10, false, {}, formatter)).toBe('10');
  
  // Case 4: nullish auto, empty numFormat -> autoFormatter
  expect(createLinearFormat(10, undefined, {}, formatter)).toBe('10');
});

test('createLinearPercentFormat', () => {
    const formatter = (val: any) => `formatted-${val}`;
    const percentFormatter = (val: any) => `percent-${val}`;

    // Case 1: autoFormat true
    expect(createLinearPercentFormat(0.5, true, {}, formatter, percentFormatter)).toBe('percent-0.5');

    // Case 2: numFormat not empty
    expect(createLinearPercentFormat(0.5, false, { type: 'number' }, formatter, percentFormatter)).toBe('formatted-0.5');

    // Case 3: default
    expect(createLinearPercentFormat(0.5, false, {}, formatter, percentFormatter)).toBe('0.5');
    
    // Case 4: nullish auto, empty numFormat -> percentFormatter
    expect(createLinearPercentFormat(0.5, undefined, {}, formatter, percentFormatter)).toBe('percent-0.5');
});
