import { Card, Flex } from 'antd';
import {
  DimensionShelf,
  HavingShelf,
  MeasureShelf,
  WhereShelf,
} from 'src/components/Shelfs';
import { useTranslation } from 'src/i18n';
import { FilterRootOperatorToggle } from './FilterRootOperatorToggle';
import { ShelfRow } from './ShelfRow';

const SHELF_STYLE: React.CSSProperties = {
  minHeight: 38,
  height: 38,
  flex: '1 1 0',
  minWidth: 0,
};

export const ShelfPanel = () => {
  const { t } = useTranslation();

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
          label={t('panelsShelvesDimensions')}
          shelf={<DimensionShelf style={SHELF_STYLE} />}
          borderBottom
        />
        <ShelfRow
          label={t('panelsShelvesMeasures')}
          shelf={<MeasureShelf style={SHELF_STYLE} />}
          borderBottom
        />
        <ShelfRow
          label={t('panelsShelvesWhere')}
          shelf={<WhereShelf showRootOperator={false} style={SHELF_STYLE} />}
          operator={<FilterRootOperatorToggle type="where" />}
          borderBottom
        />
        <ShelfRow
          label={t('panelsShelvesHaving')}
          shelf={<HavingShelf showRootOperator={false} style={SHELF_STYLE} />}
          operator={<FilterRootOperatorToggle type="having" />}
          borderBottom={false}
        />
      </Flex>
    </Card>
  );
};
