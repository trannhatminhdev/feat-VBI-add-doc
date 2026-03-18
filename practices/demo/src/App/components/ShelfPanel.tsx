import { Card, Flex } from 'antd';
import {
  DimensionShelf,
  HavingShelf,
  MeasureShelf,
  WhereShelf,
} from 'src/components/Shelfs';
import { FilterRootOperatorToggle } from './FilterRootOperatorToggle';
import { ShelfRow } from './ShelfRow';

const SHELF_STYLE: React.CSSProperties = {
  minHeight: 38,
  height: 38,
  flex: '1 1 0',
  minWidth: 0,
};

export const ShelfPanel = () => {
  return (
    <Card
      size="small"
      style={{
        minWidth: 0,
      }}
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      <Flex
        vertical
        gap={0}
        style={{
          padding: 0,
          minWidth: 0,
        }}
      >
        <ShelfRow
          label="Dimensions"
          shelf={<DimensionShelf style={SHELF_STYLE} />}
          borderBottom
        />
        <ShelfRow
          label="Measures"
          shelf={<MeasureShelf style={SHELF_STYLE} />}
          borderBottom
        />
        <ShelfRow
          label="Where"
          shelf={<WhereShelf showRootOperator={false} style={SHELF_STYLE} />}
          operator={<FilterRootOperatorToggle type="where" />}
          borderBottom
        />
        <ShelfRow
          label="Having"
          shelf={<HavingShelf showRootOperator={false} style={SHELF_STYLE} />}
          operator={<FilterRootOperatorToggle type="having" />}
          borderBottom={false}
        />
      </Flex>
    </Card>
  );
};
