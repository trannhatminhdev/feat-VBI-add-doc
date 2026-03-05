import { useState, useEffect, useRef, useMemo } from 'react';
import './App.css';
import { ConfigProvider, theme, Dropdown, Button } from 'antd';
import { LeftOutlined, RightOutlined, UploadOutlined } from '@ant-design/icons';
import DimensionShelf from './components/Shelfs/DimensionShelf';
import MeasureShelf from './components/Shelfs/MeasureShelf';
import { FilterPanel, type FilterItem } from './components/Filter/FilterPanel';
import type { VBIFilter } from '@visactor/vbi';
import { ChartTypeSelector } from './components/ChartType';
import FieldsList from './components/Fields/FieldList';
import { VSeedRender } from './components/Render';
import { useVBIStore } from './model';
import { useShallow } from 'zustand/shallow';
import { setLocalData } from './utils/localConnector';

export function APP() {
  const [leftWidth, setLeftWidth] = useState(220);
  const [dragging, setDragging] = useState(false);
  const [builderCollapsed, setBuilderCollapsed] = useState(false);

  // VBI builder 相关
  const builderRef = useRef<{
    dimensions?: {
      addDimension: (field: string, callback?: (node: unknown) => void) => void;
      removeDimension: (field: string) => void;
    };
    measures?: {
      addMeasure: (field: string, callback?: (node: unknown) => void) => void;
      removeMeasure: (field: string) => void;
    };
    chartType?: {
      changeChartType: (type: string) => void;
      getAvailableChartTypes: () => string[];
    };
    doc?: {
      transact: (callback: () => void) => void;
    };
  }>(null);

  // 可用的字段和选中的字段
  const [dimensions, setDimensions] = useState<string[]>([]);
  const [measures, setMeasures] = useState<string[]>([]);
  const [dimensionFields, setDimensionFields] = useState<string[]>([]);
  const [measureFields, setMeasureFields] = useState<string[]>([]);
  const [chartTypeOptions, setChartTypeOptions] = useState<string[]>([]);
  const [currentChartType, setCurrentChartType] = useState<string>('table');
  const [renderKey, setRenderKey] = useState(0);

  // 获取 vbi store 的状态
  const { initialize, initialized, builder, vseed, dsl } = useVBIStore(
    useShallow((state) => ({
      initialize: state.initialize,
      initialized: state.initialized,
      builder: state.builder,
      vseed: state.vseed,
      dsl: state.dsl,
    })),
  );

  const activeFields = useMemo(() => {
    if (!dsl) return [];
    const fields = new Set<string>();
    
    const extractFields = (items: any[]) => {
      items?.forEach((item) => {
        if (item && typeof item === 'object') {
          if ('field' in item && typeof item.field === 'string') {
            fields.add(item.field);
          }
          if ('children' in item && Array.isArray(item.children)) {
            extractFields(item.children);
          }
        }
      });
    };

    extractFields(dsl.dimensions || []);
    extractFields(dsl.measures || []);
    return Array.from(fields);
  }, [dsl]);

  const [allFields, setAllFields] = useState<{ name: string; role: 'dimension' | 'measure' }[]>([]);
  const [filters, setFilters] = useState<FilterItem[]>([]);

  useEffect(() => {
    const handleFilterError = () => {
      setFilters((prev) => prev.slice(0, -1));
    };
    window.addEventListener('vbi-filter-error', handleFilterError);
    return () => window.removeEventListener('vbi-filter-error', handleFilterError);
  }, []);

  useEffect(() => {
    if (initialized && builder) {
      const fetchSchema = async () => {
        const schema = await builder.getSchema();
        setAllFields(
          schema.map((s: { name: string; type: string }) => ({
            name: s.name,
            role: s.type === 'number' ? 'measure' : 'dimension',
          }))
        );
      };
      fetchSchema();
    }
  }, [initialized, builder]);

  const handleFilterChange = (newFilters: FilterItem[]) => {
    setFilters(newFilters);
    if (builder) {
      builder.doc.transact(() => {
        builder.filters.clearFilters();
        newFilters.forEach((f) => {
          if (f.isActive) {
            builder.filters.addFilter({
              field: f.field,
              operator: f.operator,
              value: f.value,
              actionType: f.actionType,
              sortOrder: f.sortOrder,
              limit: f.limit,
              enabled: true,
            });
          }
        });
      });
      setRenderKey((prev) => prev + 1);
    }
  };

  // 初始化
  useEffect(() => {
    initialize();
    builderRef.current = builder;
    // setCurrentBuilder(builder);

    // 获取可用的图表类型
    if (builder?.chartType?.getAvailableChartTypes) {
      const types = builder.chartType.getAvailableChartTypes();
      setChartTypeOptions(types);
    }
  }, []);

  // 加载 demo 数据
  const handleLoadDemo = async () => {
    try {
      const url = 'https://visactor.github.io/VBI/dataset/supermarket.csv';
      const response = await fetch(url);
      const csv = await response.text();

      const lines = csv.split('\n');
      const headers = lines[0].split(',').map((h: string) => h.trim());
      const data = lines
        .slice(1)
        .map((line: string) => {
          const values = line.split(',').map((v: string) => v.trim());
          const row: Record<string, unknown> = {};
          headers.forEach((header: string, index: number) => {
            const value = values[index];
            row[header] = isNaN(Number(value)) ? value : Number(value);
          });
          return row;
        })
        .filter((row: Record<string, unknown>) =>
          Object.values(row).some((v) => v !== ''),
        );

      // 设置本地数据
      setLocalData(data);

      // 识别维度和度量
      if (data.length > 0) {
        const dims = headers.filter((h: string) => isNaN(Number(data[0]?.[h])));
        const meas = headers.filter(
          (h: string) => !isNaN(Number(data[0]?.[h])),
        );
        setDimensions(dims.length > 0 ? dims : headers.slice(0, 3));
        setMeasures(meas.length > 0 ? meas : headers.slice(3));
        setDimensionFields([]);
        setMeasureFields([]);
      }

      console.log('Demo 数据已加载');
    } catch (err) {
      console.error('加载 Demo 数据失败:', err);
    }
  };

  // 上传 CSV
  const handleUploadCSV = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          const csv = event.target?.result as string;
          const lines = csv.split('\n');
          const headers = lines[0].split(',').map((h: string) => h.trim());
          const data = lines
            .slice(1)
            .map((line: string) => {
              const values = line.split(',').map((v: string) => v.trim());
              const row: Record<string, unknown> = {};
              headers.forEach((header: string, index: number) => {
                const value = values[index];
                row[header] = isNaN(Number(value)) ? value : Number(value);
              });
              return row;
            })
            .filter((row: Record<string, unknown>) =>
              Object.values(row).some((v) => v !== ''),
            );

          // 设置本地数据
          setLocalData(data);

          const dims = headers.filter((h: string) =>
            isNaN(Number(data[0]?.[h])),
          );
          const meas = headers.filter(
            (h: string) => !isNaN(Number(data[0]?.[h])),
          );
          setDimensions(dims.length > 0 ? dims : headers);
          setMeasures(meas.length > 0 ? meas : []);
          setDimensionFields([]);
          setMeasureFields([]);
          console.log(`CSV 已上传，共 ${data.length} 行`);
        } catch (err) {
          console.error('CSV 解析失败:', err);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const dataMenuItems = [
    { key: 'demo', label: 'Demo Data' },
    { key: 'csv', label: 'Upload CSV' },
  ];

  const handleDataMenuClick = ({ key }: { key: string }) => {
    if (key === 'demo') {
      handleLoadDemo();
    } else if (key === 'csv') {
      handleUploadCSV();
    }
  };

  // 维度字段变化
  const handleAddDimension = (field: string) => {
    if (!dimensionFields.includes(field)) {
      const newDims = [...dimensionFields, field];
      setDimensionFields(newDims);
      if (builderRef.current?.dimensions && builderRef.current.doc) {
        const { dimensions, doc } = builderRef.current;
        doc.transact(() => {
          dimensions.addDimension(field, (node: unknown) => {
            const nodeObj = node as Record<string, (field: string) => void>;
            if (nodeObj?.setAlias) {
              nodeObj.setAlias(field);
            }
          });
        });
      }
      setRenderKey((prev) => prev + 1);
    }
  };

  const handleRemoveDimension = (field: string) => {
    const newDims = dimensionFields.filter((d) => d !== field);
    setDimensionFields(newDims);
    if (builderRef.current?.dimensions && builderRef.current.doc) {
      const { dimensions, doc } = builderRef.current;
      doc.transact(() => {
        dimensions.removeDimension(field);
      });
    }
    setRenderKey((prev) => prev + 1);
  };

  // 度量字段变化
  const handleAddMeasure = (field: string) => {
    if (!measureFields.includes(field)) {
      const newMeas = [...measureFields, field];
      setMeasureFields(newMeas);
      if (builderRef.current?.measures && builderRef.current.doc) {
        const { measures, doc } = builderRef.current;
        doc.transact(() => {
          measures.addMeasure(field, (node: unknown) => {
            const nodeObj = node as Record<string, (field: string) => void>;
            if (nodeObj?.setAlias) {
              nodeObj.setAlias(field);
            }
          });
        });
      }
      setRenderKey((prev) => prev + 1);
    }
  };

  const handleRemoveMeasure = (field: string) => {
    const newMeas = measureFields.filter((m) => m !== field);
    setMeasureFields(newMeas);
    if (builderRef.current?.measures && builderRef.current.doc) {
      const { measures, doc } = builderRef.current;
      doc.transact(() => {
        measures.removeMeasure(field);
      });
    }
    setRenderKey((prev) => prev + 1);
  };

  // 图表类型变化
  const handleChangeChartType = (type: string) => {
    setCurrentChartType(type);
    if (builderRef.current?.chartType) {
      builderRef.current.chartType.changeChartType(type);
    }
    setRenderKey((prev) => prev + 1);
  };

  // 数据筛选变化
  const handleAddFilter = (filter: VBIFilter) => {
    if (builder && builder.doc) {
      builder.doc.transact(() => {
        builder.filters.addFilter(filter);
      });
      setRenderKey((prev) => prev + 1);
    }
  };

  const handleUpdateFilter = (index: number, filter: Partial<VBIFilter>) => {
    if (builder && builder.doc) {
      builder.doc.transact(() => {
        builder.filters.updateFilter(index, filter);
      });
      setRenderKey((prev) => prev + 1);
    }
  };

  const handleDeleteFilter = (index: number) => {
    if (builder && builder.doc) {
      builder.doc.transact(() => {
        builder.filters.removeFilter(index);
      });
      setRenderKey((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: MouseEvent) => {
      setLeftWidth((w) => Math.max(140, Math.min(400, w + e.movementX)));
    };

    const onUp = () => {
      setDragging(false);
      document.body.style.userSelect = '';
    };

    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [dragging]);

  if (!initialized) {
    return null;
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <div className="app-root">
        <div className="builder-layout">
          {!builderCollapsed && (
            <>
              <div className="left-panel" style={{ width: leftWidth }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingRight: 12,
                  }}
                  className="title left-panel-title"
                >
                  Data
                  <Dropdown
                    menu={{
                      items: dataMenuItems,
                      onClick: handleDataMenuClick,
                    }}
                    placement="bottomRight"
                  >
                    <Button
                      type="text"
                      size="small"
                      icon={<UploadOutlined />}
                      style={{ color: '#e0e0e0' }}
                    />
                  </Dropdown>
                </div>
                {(dimensions.length > 0 || measures.length > 0) && (
                  <div style={{ padding: '0 12px' }}>
                    <FilterPanel 
                      fields={allFields.length > 0 ? allFields : [...dimensions.map(d => ({name: d, role: 'dimension' as const})), ...measures.map(m => ({name: m, role: 'measure' as const}))]} 
                      activeFields={activeFields}
                      filters={filters}
                      onChange={handleFilterChange}
                    />
                  </div>
                )}
                {dimensions.length > 0 && (
                  <>
                    <div
                      style={{
                        fontSize: 12,
                        color: '#999',
                        padding: '8px 12px',
                        fontWeight: 'bold',
                      }}
                    >
                      Dimensions
                    </div>
                    <DimensionShelf
                      items={dimensions}
                      onAdd={handleAddDimension}
                      existingFields={dimensionFields}
                    />
                  </>
                )}
                {measures.length > 0 && (
                  <>
                    <div
                      style={{
                        fontSize: 12,
                        color: '#999',
                        padding: '8px 12px',
                        fontWeight: 'bold',
                      }}
                    >
                      Measures
                    </div>
                    <MeasureShelf
                      items={measures}
                      onAdd={handleAddMeasure}
                      existingFields={measureFields}
                    />
                  </>
                )}
                {dimensions.length === 0 && measures.length === 0 && (
                  <div
                    style={{
                      fontSize: 12,
                      color: '#666',
                      padding: '20px 12px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <UploadOutlined style={{ fontSize: 24, color: '#999' }} />
                    <div>点击右上角上传数据</div>
                  </div>
                )}
              </div>
              <div
                className="splitter"
                onMouseDown={() => setDragging(true)}
              ></div>
              <div className="middle-panel">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px',
                  }}
                >
                  <ChartTypeSelector
                    value={currentChartType}
                    options={chartTypeOptions}
                    onChange={handleChangeChartType}
                  />
                  <button
                    className="collapse-btn"
                    onClick={() => setBuilderCollapsed(true)}
                  >
                    <LeftOutlined />
                  </button>
                </div>
                <FieldsList
                  title="DIMENSIONS"
                  items={dimensionFields}
                  onAdd={handleAddDimension}
                  onRemove={handleRemoveDimension}
                  style={{ flex: 1, minHeight: 0 }}
                />
                <FieldsList
                  title="MEASURES"
                  items={measureFields}
                  onAdd={handleAddMeasure}
                  onRemove={handleRemoveMeasure}
                  style={{ flex: 1, minHeight: 0, marginTop: 12 }}
                />
              </div>
            </>
          )}
          <div className="canvas-panel">
            {builderCollapsed && (
              <button
                className="expand-btn"
                onClick={() => setBuilderCollapsed(false)}
              >
                <RightOutlined />
              </button>
            )}
            {vseed && <VSeedRender key={renderKey} vseed={vseed} />}
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default APP;
