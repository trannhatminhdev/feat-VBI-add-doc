export function joinClassNames(...classNames: Array<string | undefined>): string | undefined {
  const nextClassName = classNames.filter(Boolean).join(' ')
  return nextClassName.length > 0 ? nextClassName : undefined
}
