import { describe, it, expect } from 'vitest'
import { getFileExtension, audioArray } from '../../../../src/libs/helper-functions'

describe('getFileExtension', () => {
  it('extracts file extension from a filename', () => {
    const result = getFileExtension('audio.wav')
    expect(result).toBe('wav')
  })

  it('extracts file extension from a path with multiple dots', () => {
    const result = getFileExtension('my.audio.file.mp3')
    expect(result).toBe('mp3')
  })

  it('normalizes extension to lowercase', () => {
    const result = getFileExtension('AUDIO.WAV')
    expect(result).toBe('wav')
  })

  it('handles mixed case extensions', () => {
    const result = getFileExtension('music.FlAc')
    expect(result).toBe('flac')
  })

  it('handles file with no extension', () => {
    const result = getFileExtension('noextension')
    expect(result).toBe('noextension')
  })

  it('handles file path with directory separators', () => {
    const result = getFileExtension('/path/to/file.ogg')
    expect(result).toBe('ogg')
  })

  it('handles double extensions', () => {
    const result = getFileExtension('archive.tar.gz')
    expect(result).toBe('gz')
  })

  it('handles hidden files with extension', () => {
    const result = getFileExtension('.htaccess.bak')
    expect(result).toBe('bak')
  })
})

describe('audioArray', () => {
  it('converts comma-separated MIME types to array of extensions', () => {
    const input = '\'audio/wav\', \'audio/mp3\', \'audio/flac\', \'audio/aac\', \'audio/ogg\''
    const result = audioArray(input)
    expect(result).toEqual(['wav', 'mp3', 'flac', 'aac', 'ogg'])
  })

  it('removes single quotes from MIME types', () => {
    const input = '\'audio/wav\', \'audio/mp3\''
    const result = audioArray(input)
    expect(result).toEqual(['wav', 'mp3'])
  })

  it('handles MIME types without quotes', () => {
    const input = 'audio/wav, audio/mp3, audio/flac'
    const result = audioArray(input)
    expect(result).toEqual(['wav', 'mp3', 'flac'])
  })

  it('handles MIME types with extra spaces', () => {
    const input = '  audio/wav  ,  audio/mp3  ,  audio/flac  '
    const result = audioArray(input)
    expect(result).toEqual(['wav', 'mp3', 'flac'])
  })

  it('handles single MIME type', () => {
    const input = '\'audio/wav\''
    const result = audioArray(input)
    expect(result).toEqual(['wav'])
  })

  it('extracts only the file extension from MIME type', () => {
    const input = 'audio/mpeg, audio/x-wav, audio/vnd.wave'
    const result = audioArray(input)
    expect(result).toEqual(['mpeg', 'x-wav', 'vnd.wave'])
  })

  it('handles mixed quote styles', () => {
    const input = '\'audio/wav\', audio/mp3, \'audio/flac\''
    const result = audioArray(input)
    expect(result).toEqual(['wav', 'mp3', 'flac'])
  })

  it('handles empty string', () => {
    const input = ''
    const result = audioArray(input)
    expect(result).toEqual([''])
  })

  it('handles MIME types with no slashes', () => {
    const input = 'wav, mp3, flac'
    const result = audioArray(input)
    expect(result).toEqual(['wav', 'mp3', 'flac'])
  })

  it('trims whitespace and removes quotes correctly', () => {
    const input = '  \'audio/wav\'  ,  \'audio/mp3\'  '
    const result = audioArray(input)
    expect(result).toEqual(['wav', 'mp3'])
  })

  it('handles complex MIME type string from real use case', () => {
    const audioFilesAllowed = '\'audio/wav\', \'audio/mp3\', \'audio/flac\', \'audio/aac\', \'audio/ogg\''
    const result = audioArray(audioFilesAllowed)
    expect(result).toEqual(['wav', 'mp3', 'flac', 'aac', 'ogg'])
    expect(result).not.toContain('wav\'')
    expect(result).not.toContain('mp3\'')
  })
})
