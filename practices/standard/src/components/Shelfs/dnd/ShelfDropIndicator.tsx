export const ShelfDropIndicator = ({
  color,
  isActive,
}: {
  color: string;
  isActive: boolean;
}) => {
  return (
    <span
      style={{
        width: isActive ? 3 : 1,
        height: isActive ? 20 : 14,
        borderRadius: 2,
        backgroundColor: isActive ? color : 'transparent',
        boxShadow: isActive ? `0 0 0 1px ${color}1f` : 'none',
        transition: 'all 0.12s ease',
      }}
    />
  );
};
