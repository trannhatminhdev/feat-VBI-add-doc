import { Input, Modal, message } from 'antd';

export const openShelfRenameModal = (params: {
  title: string;
  placeholder: string;
  okText: string;
  cancelText: string;
  emptyNameMessage: string;
  id: string;
  currentAlias: string;
  onRename: (id: string, alias: string) => void;
}) => {
  const {
    title,
    placeholder,
    okText,
    cancelText,
    emptyNameMessage,
    id,
    currentAlias,
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

      onRename(id, trimmed);
      return Promise.resolve();
    },
  });
};
