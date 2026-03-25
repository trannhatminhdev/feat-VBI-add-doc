import type { ReactNode } from 'react';
import { Button } from 'antd';

type StageNavButtonProps = {
  children: ReactNode;
  disabled: boolean;
  label: string;
  onClick: () => void;
};

export const StageNavButton = ({
  children,
  disabled,
  label,
  onClick,
}: StageNavButtonProps) => {
  return (
    <Button
      className="standard-report-stage-nav"
      aria-label={label}
      color="default"
      disabled={disabled}
      shape="circle"
      size="large"
      variant="filled"
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
