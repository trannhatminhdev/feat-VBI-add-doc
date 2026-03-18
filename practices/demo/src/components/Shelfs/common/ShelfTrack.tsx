import { useDroppable } from '@dnd-kit/core';
import { DropArea, ShelfBoundaryDropZone, type ShelfType } from '../dnd';

export type ShelfTone = {
  dragOverBackground: string;
  dragOverBorder: string;
  itemBackground: string;
  itemHoverBackground: string;
  itemBorder: string;
  itemHoverBorder: string;
  textColor: string;
  iconBackground: string;
  iconHoverBackground: string;
  iconColor: string;
};

type ShelfTrackProps = {
  shelf: ShelfType;
  itemsCount: number;
  placeholder: string;
  tone: ShelfTone;
  style?: React.CSSProperties;
  leading?: React.ReactNode;
  children: React.ReactNode;
};

const getContainerStyle = (params: {
  isDragOver: boolean;
  tone: ShelfTone;
  style?: React.CSSProperties;
}): React.CSSProperties => {
  const { isDragOver, tone, style } = params;

  return {
    flexBasis: 300,
    minHeight: 30,
    height: 30,
    border: 'none',
    borderRadius: 6,
    padding: '1px 0',
    backgroundColor: isDragOver ? tone.dragOverBackground : 'transparent',
    boxShadow: isDragOver ? `inset 0 0 0 1px ${tone.dragOverBorder}` : 'none',
    transition: 'all 0.2s',
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollbarWidth: 'thin',
    position: 'relative',
    ...style,
  };
};

const rowStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  minWidth: '100%',
  minHeight: '100%',
};

const trackStyle: React.CSSProperties = {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  minWidth: 0,
  minHeight: 22,
  flex: '1 0 auto',
};

const placeholderStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 22,
  color: '#bbb',
  fontSize: 12,
  padding: '2px 8px 2px 0',
  flexShrink: 0,
};

export const ShelfTrack = ({
  shelf,
  itemsCount,
  placeholder,
  tone,
  style,
  leading,
  children,
}: ShelfTrackProps) => {
  const isEmpty = itemsCount === 0;
  const { setNodeRef, isOver } = useDroppable({
    id: `shelf-empty:${shelf}`,
    disabled: !isEmpty,
    data: {
      kind: 'shelf-insert',
      shelf,
      insertIndex: 0,
      anchor: 'empty',
    },
  });

  return (
    <div
      ref={setNodeRef}
      style={getContainerStyle({
        isDragOver: isOver,
        tone,
        style,
      })}
    >
      <div style={rowStyle}>
        {leading}
        <div style={trackStyle}>
          {isEmpty ? (
            <>
              <ShelfBoundaryDropZone
                shelf={shelf}
                insertIndex={0}
                anchor="empty"
                color={tone.iconColor}
                edge="start"
              />
              <span style={placeholderStyle}>{placeholder}</span>
            </>
          ) : (
            <>
              {children}
              <DropArea
                shelf={shelf}
                insertIndex={itemsCount}
                anchor="tail"
                color={tone.iconColor}
                flexible
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
