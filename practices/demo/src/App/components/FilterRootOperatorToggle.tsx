import {
  ShelfRootOperatorButton,
  type RootOperatorButtonColor,
} from 'src/components/Shelfs/common';
import { useFilterRootOperator } from 'src/components/Shelfs/hooks';
import { useVBIStore } from 'src/model';

const ROOT_OPERATOR_COLORS: Record<
  'where' | 'having',
  RootOperatorButtonColor
> = {
  where: {
    border: '#ffd8a8',
    color: '#d46b08',
  },
  having: {
    border: '#bdd7ff',
    color: '#0958d9',
  },
};

export const FilterRootOperatorToggle = ({
  type,
}: {
  type: 'where' | 'having';
}) => {
  const builder = useVBIStore((state) => state.builder);
  const { operator, setOperator } = useFilterRootOperator({
    builder,
    type,
  });

  return (
    <ShelfRootOperatorButton
      operator={operator}
      colors={ROOT_OPERATOR_COLORS[type]}
      onChange={setOperator}
    />
  );
};
