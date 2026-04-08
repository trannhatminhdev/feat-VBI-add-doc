export const JsonRender = ({ value }: { value: unknown }) => {
  return (
    <pre
      style={{
        margin: 0,
        padding: 16,
        overflow: 'auto',
        borderRadius: 12,
        background: 'var(--rp-c-bg-soft)',
        fontSize: 12,
        lineHeight: 1.6,
      }}
    >
      {JSON.stringify(value, null, 2)}
    </pre>
  )
}
