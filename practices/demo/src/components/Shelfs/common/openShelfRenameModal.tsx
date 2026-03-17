import { Input, Modal, message } from 'antd';
import { hasDuplicateShelfName } from '../utils/shelfNameUtils';

type NamedShelfItem = {
  id: string;
  field: string;
  alias?: string | null;
};

export const openShelfRenameModal = (params: {
  title: string;
  placeholder: string;
  id: string;
  currentAlias: string;
  items: NamedShelfItem[];
  onRename: (id: string, alias: string) => void;
}) => {
  const { title, placeholder, id, currentAlias, items, onRename } = params;
  let nextAlias = currentAlias;

  Modal.confirm({
    title,
    okText: '保存',
    cancelText: '取消',
    content: (
      <Input
        autoFocus
        defaultValue={currentAlias}
        placeholder={placeholder}
        maxLength={50}
        onChange={(event) => {
          nextAlias = event.target.value;
        }}
      />
    ),
    onOk: () => {
      const trimmed = nextAlias.trim();
      if (!trimmed) {
        message.warning('名称不能为空');
        return Promise.reject(new Error('名称不能为空'));
      }

      if (
        hasDuplicateShelfName({
          name: trimmed,
          items,
          excludeId: id,
        })
      ) {
        message.error('名称已存在');
        return Promise.reject(new Error('名称已存在'));
      }

      onRename(id, trimmed);
      return Promise.resolve();
    },
  });
};
