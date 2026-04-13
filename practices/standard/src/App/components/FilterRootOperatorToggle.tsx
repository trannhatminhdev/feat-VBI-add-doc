import {
  ShelfRootOperatorButton,
  type RootOperatorButtonColor,
} from 'src/components/Shelves/common';
import { useFilterRootOperator } from 'src/components/Shelves/hooks';
import { useVBIBuilder } from 'src/hooks';
import { useVBIStore } from 'src/model';
import { theme } from 'antd';
import { useMemo } from 'react';

export const FilterRootOperatorToggle = ({
  type,
}: {
  type: 'where' | 'having';
}) => {
  const builder = useVBIStore((state) => state.builder);
  const { token } = theme.useToken();
  const { theme: themeMode } = useVBIBuilder(builder);
  const { operator, setOperator } = useFilterRootOperator({
    builder,
    type,
  });
  const colors = useMemo<RootOperatorButtonColor>(() => {
    if (type === 'where') {
      return {
        border: themeMode === 'dark' ? 'rgba(255, 213, 145, 0.42)' : '#ffd591',
        color: themeMode === 'dark' ? '#ffd591' : '#d46b08',
        background: token.colorBgContainer,
      };
    }

    return {
      border: themeMode === 'dark' ? 'rgba(92, 219, 211, 0.42)' : '#87e8de',
      color: themeMode === 'dark' ? '#5cdbd3' : '#13c2c2',
      background: token.colorBgContainer,
    };
  }, [themeMode, token, type]);

  return (
    <ShelfRootOperatorButton
      operator={operator}
      colors={colors}
      onChange={setOperator}
    />
  );
};
