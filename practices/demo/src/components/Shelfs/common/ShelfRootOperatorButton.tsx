import { Button, Tooltip } from 'antd';

export type RootOperator = 'and' | 'or';

export type RootOperatorButtonColor = {
  border: string;
  color: string;
  background?: string;
};

export const ShelfRootOperatorButton = (props: {
  operator: RootOperator;
  colors: RootOperatorButtonColor;
  onChange: (nextOperator: RootOperator) => void;
}) => {
  const { operator, colors, onChange } = props;
  const nextOperator: RootOperator = operator === 'and' ? 'or' : 'and';

  return (
    <Tooltip
      title={`当前逻辑 ${operator.toUpperCase()}，点击切换为 ${nextOperator.toUpperCase()}`}
    >
      <Button
        type="text"
        size="small"
        onClick={() => onChange(nextOperator)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 22,
          minWidth: 22,
          height: 18,
          padding: 0,
          lineHeight: 1,
          borderRadius: 5,
          border: `1px solid ${colors.border}`,
          background: colors.background ?? 'transparent',
          color: colors.color,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: 0.2,
            lineHeight: 1,
          }}
        >
          {operator.toUpperCase()}
        </span>
      </Button>
    </Tooltip>
  );
};
