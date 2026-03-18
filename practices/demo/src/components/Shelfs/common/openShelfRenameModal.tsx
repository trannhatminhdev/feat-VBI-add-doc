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
  okText: string;
  cancelText: string;
  emptyNameMessage: string;
  duplicateNameMessage: string;
  id: string;
  currentAlias: string;
  items: NamedShelfItem[];
  onRename: (id: string, alias: string) => void;
}) => {
  const {
    title,
    placeholder,
    okText,
    cancelText,
    emptyNameMessage,
    duplicateNameMessage,
    id,
    currentAlias,
    items,
    onRename,
  } = params;
  let nextAlias = currentAlias;

  Modal.confirm({
    title,
    okText,
    cancelText,
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
        message.warning(emptyNameMessage);
        return Promise.reject(new Error(emptyNameMessage));
      }

      if (
        hasDuplicateShelfName({
          name: trimmed,
          items,
          excludeId: id,
        })
      ) {
        message.error(duplicateNameMessage);
        return Promise.reject(new Error(duplicateNameMessage));
      }

      onRename(id, trimmed);
      return Promise.resolve();
    },
  });
};
