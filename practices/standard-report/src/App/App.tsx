import type { VBIReportBuilder } from '@visactor/vbi';
import { Spin } from 'antd';
import { useEffect } from 'react';
import { useReportStore } from 'src/model';
import { ReportWorkbench } from './layout/ReportWorkbench';
import './styles/index.css';

type AppProps = {
  builder?: VBIReportBuilder;
};

export const APP = ({ builder }: AppProps) => {
  const initialize = useReportStore((state) => state.initialize);
  const initialized = useReportStore((state) => state.initialized);

  useEffect(() => {
    return initialize(builder);
  }, [builder, initialize]);

  if (!initialized) {
    return <Spin tip="初始化报表中..." fullscreen />;
  }

  return <ReportWorkbench />;
};
