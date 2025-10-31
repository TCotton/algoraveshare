import { describe, expect, it } from 'vitest'
import { audioArray, getFileExtension, validateAudioFileUpload } from '../../../../src/libs/helper-functions'

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

describe('validateAudioFileUpload', () => {
  const audioFilesAllowed = '\'audio/wav\', \'audio/mp3\', \'audio/flac\', \'audio/aac\', \'audio/ogg\''

  it('returns true for valid WAV file', () => {
    const result = validateAudioFileUpload('audio.wav', audioFilesAllowed)
    expect(result).toBe(true)
  })

  it('returns true for valid MP3 file', () => {
    const result = validateAudioFileUpload('song.mp3', audioFilesAllowed)
    expect(result).toBe(true)
  })

  it('returns true for valid FLAC file', () => {
    const result = validateAudioFileUpload('music.flac', audioFilesAllowed)
    expect(result).toBe(true)
  })

  it('returns true for valid AAC file', () => {
    const result = validateAudioFileUpload('track.aac', audioFilesAllowed)
    expect(result).toBe(true)
  })

  it('returns true for valid OGG file', () => {
    const result = validateAudioFileUpload('audio.ogg', audioFilesAllowed)
    expect(result).toBe(true)
  })

  it('returns true for valid file with uppercase extension', () => {
    const result = validateAudioFileUpload('AUDIO.WAV', audioFilesAllowed)
    expect(result).toBe(true)
  })

  it('returns true for valid file with mixed case extension', () => {
    const result = validateAudioFileUpload('music.Mp3', audioFilesAllowed)
    expect(result).toBe(true)
  })

  it('returns true for valid file with path', () => {
    const result = validateAudioFileUpload('/path/to/audio.wav', audioFilesAllowed)
    expect(result).toBe(true)
  })

  it('returns true for valid file with multiple dots in name', () => {
    const result = validateAudioFileUpload('my.audio.file.mp3', audioFilesAllowed)
    expect(result).toBe(true)
  })

  it('returns false for invalid file extension', () => {
    const result = validateAudioFileUpload('document.pdf', audioFilesAllowed)
    expect(result).toBe(false)
  })

  it('returns false for invalid audio format (m4a)', () => {
    const result = validateAudioFileUpload('audio.m4a', audioFilesAllowed)
    expect(result).toBe(false)
  })

  it('returns false for video file', () => {
    const result = validateAudioFileUpload('video.mp4', audioFilesAllowed)
    expect(result).toBe(false)
  })

  it('returns false for text file', () => {
    const result = validateAudioFileUpload('readme.txt', audioFilesAllowed)
    expect(result).toBe(false)
  })

  it('returns false for file with no extension', () => {
    const result = validateAudioFileUpload('audiofile', audioFilesAllowed)
    expect(result).toBe(false)
  })

  it('returns false for undefined file', () => {
    const result = validateAudioFileUpload(undefined, audioFilesAllowed)
    expect(result).toBe(false)
  })

  it('returns false for empty string', () => {
    const result = validateAudioFileUpload('', audioFilesAllowed)
    expect(result).toBe(false)
  })

  it('handles different MIME type formats without quotes', () => {
    const audioFiles = 'audio/wav, audio/mp3'
    const result = validateAudioFileUpload('song.wav', audioFiles)
    expect(result).toBe(true)
  })

  it('validates correctly with single allowed type', () => {
    const audioFiles = '\'audio/wav\''
    const resultValid = validateAudioFileUpload('audio.wav', audioFiles)
    const resultInvalid = validateAudioFileUpload('audio.mp3', audioFiles)
    expect(resultValid).toBe(true)
    expect(resultInvalid).toBe(false)
  })
})
