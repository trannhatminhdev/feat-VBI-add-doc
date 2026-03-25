import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

type PageHoverActionsProps = {
  canRemove: boolean;
  showPlaceholder: boolean;
  onAddPage: () => void;
  onEdit: () => void;
  onRemovePage: () => void;
};

const getActions = ({
  canRemove,
  onAddPage,
  onEdit,
  onRemovePage,
  showPlaceholder,
}: PageHoverActionsProps) => {
  return [
    {
      icon: <EditOutlined />,
      key: 'edit',
      label: showPlaceholder ? '添加当前图表' : '编辑当前图表',
      onClick: onEdit,
    },
    {
      icon: <PlusOutlined />,
      key: 'add',
      label: '新增一页',
      onClick: onAddPage,
    },
    ...(canRemove
      ? [
          {
            icon: <DeleteOutlined />,
            key: 'remove',
            label: '删除当前页',
            onClick: onRemovePage,
          },
        ]
      : []),
  ];
};

export const PageHoverActions = (props: PageHoverActionsProps) => {
  const actions = getActions(props);

  return (
    <div
      className="standard-report-page-toolset"
      data-testid="standard-report-actions"
    >
      {actions.map((action) => (
        <Tooltip key={action.key} title={action.label}>
          <Button
            className="standard-report-icon-button"
            color="default"
            shape="circle"
            size="middle"
            variant="text"
            aria-label={action.label}
            icon={action.icon}
            onClick={action.onClick}
          />
        </Tooltip>
      ))}
    </div>
  );
};
