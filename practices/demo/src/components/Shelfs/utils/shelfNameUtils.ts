type NamedShelfItem = {
  id: string;
  field: string;
  alias?: string | null;
};

const getDisplayName = (item: NamedShelfItem) => {
  const alias = typeof item.alias === 'string' ? item.alias.trim() : '';
  return alias || item.field;
};

const getTakenNames = (
  items: NamedShelfItem[],
  excludeId?: string,
): Set<string> => {
  return new Set(
    items
      .filter((item) => item.id !== excludeId)
      .map((item) => getDisplayName(item).trim())
      .filter(Boolean),
  );
};

export const hasDuplicateShelfName = ({
  name,
  items,
  excludeId,
}: {
  name: string;
  items: NamedShelfItem[];
  excludeId?: string;
}) => {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return false;
  }
  return getTakenNames(items, excludeId).has(trimmedName);
};

export const getNextFieldDuplicateName = ({
  field,
  items,
  excludeId,
}: {
  field: string;
  items: NamedShelfItem[];
  excludeId?: string;
}) => {
  const baseName = field.trim();
  const takenNames = getTakenNames(items, excludeId);
  const sameFieldCount = items.filter(
    (item) => item.id !== excludeId && item.field === field,
  ).length;

  let suffix = sameFieldCount + 1;
  const candidate = suffix === 1 ? baseName : `${baseName}${suffix}`;

  if (!takenNames.has(candidate)) {
    return candidate;
  }

  suffix = Math.max(2, suffix);
  while (takenNames.has(`${baseName}${suffix}`)) {
    suffix += 1;
  }
  return `${baseName}${suffix}`;
};
