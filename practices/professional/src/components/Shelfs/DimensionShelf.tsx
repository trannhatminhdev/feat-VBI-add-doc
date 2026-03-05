import React from 'react';
import { PlusOutlined, NumberOutlined } from '@ant-design/icons';
import './Shelf.css';

export interface DimensionShelfProps {
  items: string[];
  onAdd?: (field: string) => void;
  existingFields?: string[];
  style?: React.CSSProperties;
}

const DimensionShelf: React.FC<DimensionShelfProps> = ({
  items,
  onAdd,
  existingFields = [],
  style,
}) => {
  const handleAction = (field: string) => {
    if (onAdd && !existingFields.includes(field)) {
      onAdd(field);
    }
  };

  return (
    <div className="shelf" style={style}>
      <div className="shelf-items">
        {items.map((field) => {
          const isExists = existingFields.includes(field);
          return (
            <div key={field} className="shelf-item">
              <NumberOutlined style={{ marginRight: 4 }} />
              <span className="shelf-item-text">{field}</span>
              <button
                className="shelf-item-remove"
                onClick={() => handleAction(field)}
                disabled={isExists}
                style={{
                  opacity: isExists ? 0.3 : undefined,
                  cursor: isExists ? 'not-allowed' : undefined,
                }}
              >
                <PlusOutlined style={{ color: '#e0e0e0' }} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DimensionShelf;
