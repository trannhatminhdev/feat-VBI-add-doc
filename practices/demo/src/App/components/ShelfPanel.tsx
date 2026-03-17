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
  flex: '0 0 calc(100% - 90px)',
  width: '0 0 calc(100% - 90px)',
};

export const ShelfPanel = () => {
  return (
    <Card
      size="small"
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
