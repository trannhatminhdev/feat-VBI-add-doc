import { isUrl, isHttpUrl, isBase64Url } from '@visactor/vquery'

describe('url utils', () => {
  it('isHttpUrl', () => {
    expect(isHttpUrl('http://example.com')).toBe(true)
    expect(isHttpUrl('https://example.com')).toBe(true)
    expect(isHttpUrl('ftp://example.com')).toBe(false)
    expect(isHttpUrl('example.com')).toBe(false)
  })

  it('isBase64Url', () => {
    expect(isBase64Url('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==')).toBe(true)
    expect(isBase64Url('http://example.com')).toBe(false)
  })

  it('isUrl', () => {
    expect(isUrl('http://example.com')).toBe(true)
    expect(isUrl('https://example.com')).toBe(true)
    expect(isUrl('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==')).toBe(true)
    expect(isUrl('example.com')).toBe(false)
  })
})
