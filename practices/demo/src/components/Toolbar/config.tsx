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

type LocalizedText = Record<DemoLocale, string>;

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
  label: LocalizedText;
  description: LocalizedText;
}

export interface ChartTypeMeta {
  type: string;
  group: ChartGroupKey;
  label: LocalizedText;
  description: LocalizedText;
  icon: ReactNode;
}

export const TOOLBAR_TEXT = {
  chartType: {
    label: {
      'zh-CN': '图表类型',
      'en-US': 'Chart Type',
    },
    description: {
      'zh-CN': '按图表家族快速切换分析方式',
      'en-US': 'Switch charts from a grouped visual gallery',
    },
    panelTitle: {
      'zh-CN': '选择图表类型',
      'en-US': 'Choose a chart type',
    },
  },
  locale: {
    label: {
      'zh-CN': '语言',
      'en-US': 'Language',
    },
    description: {
      'zh-CN': '界面文案与数字格式',
      'en-US': 'UI copy and number formatting',
    },
    zh: {
      'zh-CN': '中文',
      'en-US': 'Chinese',
    },
    en: {
      'zh-CN': '英文',
      'en-US': 'English',
    },
  },
  theme: {
    label: {
      'zh-CN': '主题',
      'en-US': 'Theme',
    },
    description: {
      'zh-CN': '同步切换 Builder、Ant Design 与图表渲染',
      'en-US': 'Switch Builder, Ant Design and chart rendering together',
    },
    light: {
      'zh-CN': '浅色',
      'en-US': 'Light',
    },
    dark: {
      'zh-CN': '深色',
      'en-US': 'Dark',
    },
  },
  limit: {
    label: {
      'zh-CN': '取数上限',
      'en-US': 'Rows',
    },
    description: {
      'zh-CN': '控制单次查询返回的记录条数',
      'en-US': 'Controls how many rows a query returns',
    },
    helper: {
      'zh-CN': '设置单次查询返回的记录条数，默认 1000。',
      'en-US': 'Sets how many rows are returned per query. Default is 1000.',
    },
    placeholder: {
      'zh-CN': '默认 1000',
      'en-US': 'Default 1000',
    },
  },
  history: {
    label: {
      'zh-CN': '操作',
      'en-US': 'History',
    },
    description: {
      'zh-CN': '支持撤销与重做',
      'en-US': 'Undo and redo recent changes',
    },
    undo: {
      'zh-CN': '撤销',
      'en-US': 'Undo',
    },
    redo: {
      'zh-CN': '重做',
      'en-US': 'Redo',
    },
  },
} as const;

export const CHART_TYPE_GROUPS: ChartTypeGroupMeta[] = [
  {
    key: 'table',
    label: {
      'zh-CN': '表格',
      'en-US': 'Tables',
    },
    description: {
      'zh-CN': '明细与透视分析',
      'en-US': 'Detail views and pivots',
    },
  },
  {
    key: 'comparison',
    label: {
      'zh-CN': '比较',
      'en-US': 'Comparison',
    },
    description: {
      'zh-CN': '类目大小、并列与双轴对比',
      'en-US': 'Category comparisons and dual-axis views',
    },
  },
  {
    key: 'trend',
    label: {
      'zh-CN': '趋势',
      'en-US': 'Trends',
    },
    description: {
      'zh-CN': '时间变化与累计走势',
      'en-US': 'Change over time and cumulative motion',
    },
  },
  {
    key: 'proportion',
    label: {
      'zh-CN': '占比',
      'en-US': 'Proportion',
    },
    description: {
      'zh-CN': '构成、占比与转化漏斗',
      'en-US': 'Composition, share and funnel views',
    },
  },
  {
    key: 'distribution',
    label: {
      'zh-CN': '分布',
      'en-US': 'Distribution',
    },
    description: {
      'zh-CN': '相关性、密度与统计分布',
      'en-US': 'Correlation, density and statistical spread',
    },
  },
  {
    key: 'hierarchy',
    label: {
      'zh-CN': '层级',
      'en-US': 'Hierarchy',
    },
    description: {
      'zh-CN': '树形和层级结构关系',
      'en-US': 'Nested and hierarchical structures',
    },
  },
  {
    key: 'dynamic',
    label: {
      'zh-CN': '动态竞赛',
      'en-US': 'Animated Race',
    },
    description: {
      'zh-CN': '带时间演变的动态可视化',
      'en-US': 'Animated visuals across ordered time',
    },
  },
];

export const CHART_TYPE_METAS: ChartTypeMeta[] = [
  {
    type: 'table',
    group: 'table',
    label: {
      'zh-CN': '表格',
      'en-US': 'Table',
    },
    description: {
      'zh-CN': '查看明细记录',
      'en-US': 'Inspect raw records',
    },
    icon: <TableOutlined />,
  },
  {
    type: 'pivotTable',
    group: 'table',
    label: {
      'zh-CN': '透视表',
      'en-US': 'Pivot Table',
    },
    description: {
      'zh-CN': '交叉汇总分析',
      'en-US': 'Cross-tab summarization',
    },
    icon: <PartitionOutlined />,
  },
  {
    type: 'column',
    group: 'comparison',
    label: {
      'zh-CN': '柱状图',
      'en-US': 'Column',
    },
    description: {
      'zh-CN': '纵向类目比较',
      'en-US': 'Vertical category comparison',
    },
    icon: <BarChartOutlined />,
  },
  {
    type: 'columnParallel',
    group: 'comparison',
    label: {
      'zh-CN': '并列柱状图',
      'en-US': 'Grouped Column',
    },
    description: {
      'zh-CN': '多指标并列对比',
      'en-US': 'Side-by-side metrics',
    },
    icon: <FundProjectionScreenOutlined />,
  },
  {
    type: 'columnPercent',
    group: 'comparison',
    label: {
      'zh-CN': '百分比柱状图',
      'en-US': '100% Column',
    },
    description: {
      'zh-CN': '显示占比关系',
      'en-US': 'Show proportional shares',
    },
    icon: <DashboardOutlined />,
  },
  {
    type: 'bar',
    group: 'comparison',
    label: {
      'zh-CN': '条形图',
      'en-US': 'Bar',
    },
    description: {
      'zh-CN': '适合长类目名称',
      'en-US': 'Better for long labels',
    },
    icon: <BarChartOutlined />,
  },
  {
    type: 'barParallel',
    group: 'comparison',
    label: {
      'zh-CN': '并列条形图',
      'en-US': 'Grouped Bar',
    },
    description: {
      'zh-CN': '横向并列对比',
      'en-US': 'Horizontal grouped comparison',
    },
    icon: <FundProjectionScreenOutlined />,
  },
  {
    type: 'barPercent',
    group: 'comparison',
    label: {
      'zh-CN': '百分比条形图',
      'en-US': '100% Bar',
    },
    description: {
      'zh-CN': '横向占比堆叠',
      'en-US': 'Horizontal proportional stack',
    },
    icon: <DashboardOutlined />,
  },
  {
    type: 'dualAxis',
    group: 'comparison',
    label: {
      'zh-CN': '双轴图',
      'en-US': 'Dual Axis',
    },
    description: {
      'zh-CN': '对比不同量纲指标',
      'en-US': 'Compare different scales',
    },
    icon: <FundProjectionScreenOutlined />,
  },
  {
    type: 'line',
    group: 'trend',
    label: {
      'zh-CN': '折线图',
      'en-US': 'Line',
    },
    description: {
      'zh-CN': '观察趋势变化',
      'en-US': 'Track change over time',
    },
    icon: <LineChartOutlined />,
  },
  {
    type: 'area',
    group: 'trend',
    label: {
      'zh-CN': '面积图',
      'en-US': 'Area',
    },
    description: {
      'zh-CN': '强调累计量感',
      'en-US': 'Emphasize accumulated volume',
    },
    icon: <AreaChartOutlined />,
  },
  {
    type: 'areaPercent',
    group: 'trend',
    label: {
      'zh-CN': '百分比面积图',
      'en-US': '100% Area',
    },
    description: {
      'zh-CN': '趋势中的占比变化',
      'en-US': 'Share changes over time',
    },
    icon: <AreaChartOutlined />,
  },
  {
    type: 'pie',
    group: 'proportion',
    label: {
      'zh-CN': '饼图',
      'en-US': 'Pie',
    },
    description: {
      'zh-CN': '整体占比构成',
      'en-US': 'Part-to-whole view',
    },
    icon: <PieChartOutlined />,
  },
  {
    type: 'donut',
    group: 'proportion',
    label: {
      'zh-CN': '环形图',
      'en-US': 'Donut',
    },
    description: {
      'zh-CN': '中心可承载重点信息',
      'en-US': 'Highlights a center metric',
    },
    icon: <PieChartOutlined />,
  },
  {
    type: 'rose',
    group: 'proportion',
    label: {
      'zh-CN': '玫瑰图',
      'en-US': 'Rose',
    },
    description: {
      'zh-CN': '极坐标占比展示',
      'en-US': 'Polar proportion display',
    },
    icon: <PieChartOutlined />,
  },
  {
    type: 'roseParallel',
    group: 'proportion',
    label: {
      'zh-CN': '并列玫瑰图',
      'en-US': 'Grouped Rose',
    },
    description: {
      'zh-CN': '多指标极坐标对比',
      'en-US': 'Parallel polar metrics',
    },
    icon: <RadarChartOutlined />,
  },
  {
    type: 'funnel',
    group: 'proportion',
    label: {
      'zh-CN': '漏斗图',
      'en-US': 'Funnel',
    },
    description: {
      'zh-CN': '阶段转化分析',
      'en-US': 'Stage conversion analysis',
    },
    icon: <FunnelPlotOutlined />,
  },
  {
    type: 'scatter',
    group: 'distribution',
    label: {
      'zh-CN': '散点图',
      'en-US': 'Scatter',
    },
    description: {
      'zh-CN': '分析相关性',
      'en-US': 'Reveal correlation',
    },
    icon: <DotChartOutlined />,
  },
  {
    type: 'heatmap',
    group: 'distribution',
    label: {
      'zh-CN': '热力图',
      'en-US': 'Heatmap',
    },
    description: {
      'zh-CN': '展示二维密度',
      'en-US': 'Show matrix density',
    },
    icon: <HeatMapOutlined />,
  },
  {
    type: 'boxPlot',
    group: 'distribution',
    label: {
      'zh-CN': '箱线图',
      'en-US': 'Box Plot',
    },
    description: {
      'zh-CN': '查看分位数与异常值',
      'en-US': 'Inspect quartiles and outliers',
    },
    icon: <DotChartOutlined />,
  },
  {
    type: 'histogram',
    group: 'distribution',
    label: {
      'zh-CN': '直方图',
      'en-US': 'Histogram',
    },
    description: {
      'zh-CN': '统计数值分布',
      'en-US': 'Bin numerical distribution',
    },
    icon: <BarChartOutlined />,
  },
  {
    type: 'radar',
    group: 'distribution',
    label: {
      'zh-CN': '雷达图',
      'en-US': 'Radar',
    },
    description: {
      'zh-CN': '多维指标评分',
      'en-US': 'Multi-axis scoring view',
    },
    icon: <RadarChartOutlined />,
  },
  {
    type: 'treeMap',
    group: 'hierarchy',
    label: {
      'zh-CN': '矩形树图',
      'en-US': 'Treemap',
    },
    description: {
      'zh-CN': '高空间利用率的层级图',
      'en-US': 'Compact hierarchical layout',
    },
    icon: <ApartmentOutlined />,
  },
  {
    type: 'sunburst',
    group: 'hierarchy',
    label: {
      'zh-CN': '旭日图',
      'en-US': 'Sunburst',
    },
    description: {
      'zh-CN': '放射状层级关系',
      'en-US': 'Radial hierarchy view',
    },
    icon: <DeploymentUnitOutlined />,
  },
  {
    type: 'circlePacking',
    group: 'hierarchy',
    label: {
      'zh-CN': '圆形闭包图',
      'en-US': 'Circle Packing',
    },
    description: {
      'zh-CN': '强调包含关系',
      'en-US': 'Nested containment view',
    },
    icon: <NodeIndexOutlined />,
  },
  {
    type: 'raceBar',
    group: 'dynamic',
    label: {
      'zh-CN': '动态条形图',
      'en-US': 'Race Bar',
    },
    description: {
      'zh-CN': '排名随时间变化',
      'en-US': 'Ranking race over time',
    },
    icon: <BarChartOutlined />,
  },
  {
    type: 'raceColumn',
    group: 'dynamic',
    label: {
      'zh-CN': '动态柱状图',
      'en-US': 'Race Column',
    },
    description: {
      'zh-CN': '纵向排名动画',
      'en-US': 'Animated vertical ranking',
    },
    icon: <BarChartOutlined />,
  },
  {
    type: 'raceLine',
    group: 'dynamic',
    label: {
      'zh-CN': '动态折线图',
      'en-US': 'Race Line',
    },
    description: {
      'zh-CN': '轨迹式趋势演变',
      'en-US': 'Animated trend trajectory',
    },
    icon: <LineChartOutlined />,
  },
  {
    type: 'raceScatter',
    group: 'dynamic',
    label: {
      'zh-CN': '动态散点图',
      'en-US': 'Race Scatter',
    },
    description: {
      'zh-CN': '多指标轨迹演变',
      'en-US': 'Animated multi-metric motion',
    },
    icon: <DotChartOutlined />,
  },
  {
    type: 'racePie',
    group: 'dynamic',
    label: {
      'zh-CN': '动态饼图',
      'en-US': 'Race Pie',
    },
    description: {
      'zh-CN': '占比构成随时间变化',
      'en-US': 'Animated composition share',
    },
    icon: <PieChartOutlined />,
  },
  {
    type: 'raceDonut',
    group: 'dynamic',
    label: {
      'zh-CN': '动态环形图',
      'en-US': 'Race Donut',
    },
    description: {
      'zh-CN': '中心指标动画演变',
      'en-US': 'Animated donut with center focus',
    },
    icon: <PieChartOutlined />,
  },
];

export const CHART_TYPE_META_MAP = Object.fromEntries(
  CHART_TYPE_METAS.map((meta) => [meta.type, meta]),
) as Record<string, ChartTypeMeta>;

const FALLBACK_CHART_META: ChartTypeMeta = {
  type: 'unknown',
  group: 'distribution',
  label: {
    'zh-CN': '图表',
    'en-US': 'Chart',
  },
  description: {
    'zh-CN': '当前图表类型',
    'en-US': 'Current chart type',
  },
  icon: <DotChartOutlined />,
};

export const getLocaleText = (
  locale: DemoLocale,
  text: LocalizedText,
): string => {
  return text[locale];
};

export const getChartTypeMeta = (chartType: string): ChartTypeMeta => {
  return (
    CHART_TYPE_META_MAP[chartType] ?? {
      ...FALLBACK_CHART_META,
      type: chartType,
      label: {
        'zh-CN': chartType,
        'en-US': chartType,
      },
    }
  );
};

export const formatDefaultLimit = (locale: DemoLocale) => {
  return new Intl.NumberFormat(locale).format(DEMO_DEFAULT_LIMIT);
};
