import type React from 'react';
import { ShelfDropIndicator } from './ShelfDropIndicator';

const getZoneStyle = (side: 'before' | 'after'): React.CSSProperties => {
  return {
    position: 'absolute',
    top: -4,
    bottom: -4,
    width: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: side === 'before' ? 'flex-start' : 'flex-end',
    pointerEvents: 'none',
    zIndex: 2,
    ...(side === 'before' ? { left: 0 } : { right: 0 }),
  };
};

export const ShelfItemDropZones = ({
  color,
  beforeRef,
  afterRef,
  isBeforeOver,
  isAfterOver,
}: {
  color: string;
  beforeRef: React.RefCallback<HTMLDivElement>;
  afterRef: React.RefCallback<HTMLDivElement>;
  isBeforeOver: boolean;
  isAfterOver: boolean;
}) => {
  return (
    <>
      <div ref={beforeRef} style={getZoneStyle('before')}>
        <ShelfDropIndicator color={color} isActive={isBeforeOver} />
      </div>
      <div ref={afterRef} style={getZoneStyle('after')}>
        <ShelfDropIndicator color={color} isActive={isAfterOver} />
      </div>
    </>
  );
};
