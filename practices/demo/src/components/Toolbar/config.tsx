import type { ReactNode } from 'react';
import {
  ApartmentOutlined,
  AreaChartOutlined,
  BarChartOutlined,
  DashboardOutlined,
  DeploymentUnitOutlined,
  DotChartOutlined,
  FunnelPlotOutlined,
  FundProjectionScreenOutlined,
  HeatMapOutlined,
  LineChartOutlined,
  NodeIndexOutlined,
  PartitionOutlined,
  PieChartOutlined,
  RadarChartOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { DEMO_DEFAULT_LIMIT, type DemoLocale } from 'src/constants/builder';
import type { Translate } from 'src/i18n';

export type ChartGroupKey =
  | 'table'
  | 'comparison'
  | 'trend'
  | 'proportion'
  | 'distribution'
  | 'hierarchy'
  | 'dynamic';

export interface ChartTypeGroupMeta {
  key: ChartGroupKey;
  labelKey: string;
  descriptionKey: string;
}

export interface ChartTypeMeta {
  type: string;
  group: ChartGroupKey;
  labelKey: string;
  descriptionKey: string;
  icon: ReactNode;
}

export const CHART_TYPE_GROUPS: ChartTypeGroupMeta[] = [
  {
    key: 'table',
    labelKey: 'toolbarChartTypeGroupsTableLabel',
    descriptionKey: 'toolbarChartTypeGroupsTableDescription',
  },
  {
    key: 'comparison',
    labelKey: 'toolbarChartTypeGroupsComparisonLabel',
    descriptionKey: 'toolbarChartTypeGroupsComparisonDescription',
  },
  {
    key: 'trend',
    labelKey: 'toolbarChartTypeGroupsTrendLabel',
    descriptionKey: 'toolbarChartTypeGroupsTrendDescription',
  },
  {
    key: 'proportion',
    labelKey: 'toolbarChartTypeGroupsProportionLabel',
    descriptionKey: 'toolbarChartTypeGroupsProportionDescription',
  },
  {
    key: 'distribution',
    labelKey: 'toolbarChartTypeGroupsDistributionLabel',
    descriptionKey: 'toolbarChartTypeGroupsDistributionDescription',
  },
  {
    key: 'hierarchy',
    labelKey: 'toolbarChartTypeGroupsHierarchyLabel',
    descriptionKey: 'toolbarChartTypeGroupsHierarchyDescription',
  },
  {
    key: 'dynamic',
    labelKey: 'toolbarChartTypeGroupsDynamicLabel',
    descriptionKey: 'toolbarChartTypeGroupsDynamicDescription',
  },
];

export const CHART_TYPE_METAS: ChartTypeMeta[] = [
  {
    type: 'table',
    group: 'table',
    labelKey: 'toolbarChartTypeItemsTableLabel',
    descriptionKey: 'toolbarChartTypeItemsTableDescription',
    icon: <TableOutlined />,
  },
  {
    type: 'pivotTable',
    group: 'table',
    labelKey: 'toolbarChartTypeItemsPivotTableLabel',
    descriptionKey: 'toolbarChartTypeItemsPivotTableDescription',
    icon: <PartitionOutlined />,
  },
  {
    type: 'column',
    group: 'comparison',
    labelKey: 'toolbarChartTypeItemsColumnLabel',
    descriptionKey: 'toolbarChartTypeItemsColumnDescription',
    icon: <BarChartOutlined />,
  },
  {
    type: 'columnParallel',
    group: 'comparison',
    labelKey: 'toolbarChartTypeItemsColumnParallelLabel',
    descriptionKey: 'toolbarChartTypeItemsColumnParallelDescription',
    icon: <FundProjectionScreenOutlined />,
  },
  {
    type: 'columnPercent',
    group: 'comparison',
    labelKey: 'toolbarChartTypeItemsColumnPercentLabel',
    descriptionKey: 'toolbarChartTypeItemsColumnPercentDescription',
    icon: <DashboardOutlined />,
  },
  {
    type: 'bar',
    group: 'comparison',
    labelKey: 'toolbarChartTypeItemsBarLabel',
    descriptionKey: 'toolbarChartTypeItemsBarDescription',
    icon: <BarChartOutlined />,
  },
  {
    type: 'barParallel',
    group: 'comparison',
    labelKey: 'toolbarChartTypeItemsBarParallelLabel',
    descriptionKey: 'toolbarChartTypeItemsBarParallelDescription',
    icon: <FundProjectionScreenOutlined />,
  },
  {
    type: 'barPercent',
    group: 'comparison',
    labelKey: 'toolbarChartTypeItemsBarPercentLabel',
    descriptionKey: 'toolbarChartTypeItemsBarPercentDescription',
    icon: <DashboardOutlined />,
  },
  {
    type: 'dualAxis',
    group: 'comparison',
    labelKey: 'toolbarChartTypeItemsDualAxisLabel',
    descriptionKey: 'toolbarChartTypeItemsDualAxisDescription',
    icon: <FundProjectionScreenOutlined />,
  },
  {
    type: 'line',
    group: 'trend',
    labelKey: 'toolbarChartTypeItemsLineLabel',
    descriptionKey: 'toolbarChartTypeItemsLineDescription',
    icon: <LineChartOutlined />,
  },
  {
    type: 'area',
    group: 'trend',
    labelKey: 'toolbarChartTypeItemsAreaLabel',
    descriptionKey: 'toolbarChartTypeItemsAreaDescription',
    icon: <AreaChartOutlined />,
  },
  {
    type: 'areaPercent',
    group: 'trend',
    labelKey: 'toolbarChartTypeItemsAreaPercentLabel',
    descriptionKey: 'toolbarChartTypeItemsAreaPercentDescription',
    icon: <AreaChartOutlined />,
  },
  {
    type: 'pie',
    group: 'proportion',
    labelKey: 'toolbarChartTypeItemsPieLabel',
    descriptionKey: 'toolbarChartTypeItemsPieDescription',
    icon: <PieChartOutlined />,
  },
  {
    type: 'donut',
    group: 'proportion',
    labelKey: 'toolbarChartTypeItemsDonutLabel',
    descriptionKey: 'toolbarChartTypeItemsDonutDescription',
    icon: <PieChartOutlined />,
  },
  {
    type: 'rose',
    group: 'proportion',
    labelKey: 'toolbarChartTypeItemsRoseLabel',
    descriptionKey: 'toolbarChartTypeItemsRoseDescription',
    icon: <PieChartOutlined />,
  },
  {
    type: 'roseParallel',
    group: 'proportion',
    labelKey: 'toolbarChartTypeItemsRoseParallelLabel',
    descriptionKey: 'toolbarChartTypeItemsRoseParallelDescription',
    icon: <RadarChartOutlined />,
  },
  {
    type: 'funnel',
    group: 'proportion',
    labelKey: 'toolbarChartTypeItemsFunnelLabel',
    descriptionKey: 'toolbarChartTypeItemsFunnelDescription',
    icon: <FunnelPlotOutlined />,
  },
  {
    type: 'scatter',
    group: 'distribution',
    labelKey: 'toolbarChartTypeItemsScatterLabel',
    descriptionKey: 'toolbarChartTypeItemsScatterDescription',
    icon: <DotChartOutlined />,
  },
  {
    type: 'heatmap',
    group: 'distribution',
    labelKey: 'toolbarChartTypeItemsHeatmapLabel',
    descriptionKey: 'toolbarChartTypeItemsHeatmapDescription',
    icon: <HeatMapOutlined />,
  },
  {
    type: 'boxPlot',
    group: 'distribution',
    labelKey: 'toolbarChartTypeItemsBoxPlotLabel',
    descriptionKey: 'toolbarChartTypeItemsBoxPlotDescription',
    icon: <DotChartOutlined />,
  },
  {
    type: 'histogram',
    group: 'distribution',
    labelKey: 'toolbarChartTypeItemsHistogramLabel',
    descriptionKey: 'toolbarChartTypeItemsHistogramDescription',
    icon: <BarChartOutlined />,
  },
  {
    type: 'radar',
    group: 'distribution',
    labelKey: 'toolbarChartTypeItemsRadarLabel',
    descriptionKey: 'toolbarChartTypeItemsRadarDescription',
    icon: <RadarChartOutlined />,
  },
  {
    type: 'treeMap',
    group: 'hierarchy',
    labelKey: 'toolbarChartTypeItemsTreeMapLabel',
    descriptionKey: 'toolbarChartTypeItemsTreeMapDescription',
    icon: <ApartmentOutlined />,
  },
  {
    type: 'sunburst',
    group: 'hierarchy',
    labelKey: 'toolbarChartTypeItemsSunburstLabel',
    descriptionKey: 'toolbarChartTypeItemsSunburstDescription',
    icon: <DeploymentUnitOutlined />,
  },
  {
    type: 'circlePacking',
    group: 'hierarchy',
    labelKey: 'toolbarChartTypeItemsCirclePackingLabel',
    descriptionKey: 'toolbarChartTypeItemsCirclePackingDescription',
    icon: <NodeIndexOutlined />,
  },
  {
    type: 'raceBar',
    group: 'dynamic',
    labelKey: 'toolbarChartTypeItemsRaceBarLabel',
    descriptionKey: 'toolbarChartTypeItemsRaceBarDescription',
    icon: <BarChartOutlined />,
  },
  {
    type: 'raceColumn',
    group: 'dynamic',
    labelKey: 'toolbarChartTypeItemsRaceColumnLabel',
    descriptionKey: 'toolbarChartTypeItemsRaceColumnDescription',
    icon: <BarChartOutlined />,
  },
  {
    type: 'raceLine',
    group: 'dynamic',
    labelKey: 'toolbarChartTypeItemsRaceLineLabel',
    descriptionKey: 'toolbarChartTypeItemsRaceLineDescription',
    icon: <LineChartOutlined />,
  },
  {
    type: 'raceScatter',
    group: 'dynamic',
    labelKey: 'toolbarChartTypeItemsRaceScatterLabel',
    descriptionKey: 'toolbarChartTypeItemsRaceScatterDescription',
    icon: <DotChartOutlined />,
  },
  {
    type: 'racePie',
    group: 'dynamic',
    labelKey: 'toolbarChartTypeItemsRacePieLabel',
    descriptionKey: 'toolbarChartTypeItemsRacePieDescription',
    icon: <PieChartOutlined />,
  },
  {
    type: 'raceDonut',
    group: 'dynamic',
    labelKey: 'toolbarChartTypeItemsRaceDonutLabel',
    descriptionKey: 'toolbarChartTypeItemsRaceDonutDescription',
    icon: <PieChartOutlined />,
  },
];

export const CHART_TYPE_META_MAP = Object.fromEntries(
  CHART_TYPE_METAS.map((meta) => [meta.type, meta]),
) as Record<string, ChartTypeMeta>;

const FALLBACK_CHART_META: ChartTypeMeta = {
  type: 'unknown',
  group: 'distribution',
  labelKey: 'toolbarChartTypeFallbackLabel',
  descriptionKey: 'toolbarChartTypeFallbackDescription',
  icon: <DotChartOutlined />,
};

export const getChartTypeGroups = (t: Translate) => {
  return CHART_TYPE_GROUPS.map((group) => ({
    ...group,
    label: t(group.labelKey),
    description: t(group.descriptionKey),
  }));
};

export const getChartTypeMeta = (chartType: string, t: Translate) => {
  const meta = CHART_TYPE_META_MAP[chartType];

  if (!meta) {
    return {
      ...FALLBACK_CHART_META,
      type: chartType,
      label: chartType,
      description: t(FALLBACK_CHART_META.descriptionKey),
    };
  }

  return {
    ...meta,
    label: t(meta.labelKey),
    description: t(meta.descriptionKey),
  };
};

export const formatDefaultLimit = (locale: DemoLocale) => {
  return new Intl.NumberFormat(locale).format(DEMO_DEFAULT_LIMIT);
};
