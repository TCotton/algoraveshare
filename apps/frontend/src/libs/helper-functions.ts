import { equals, last, map, pipe, replace, split, toLower, trim } from 'ramda'

export const getFileExtension = pipe(
  split('.'), // split by dot
  last, // take the last segment
  toLower // normalize case
)

export const audioArray = (audioFilesAllowed: string) =>
  pipe(
    split(','), // split by comma
    map(pipe(
      trim, // remove surrounding spaces
      replace(/'/g, ''), // remove all single quotes
      split('/'), // split by '/'
      last // take last segment (e.g., 'wav')
    ))
  )(audioFilesAllowed)

export const validateAudioFileUpload = (file: string | undefined, audioFilesAllowed: string): boolean => {
  if (!file) {
    return false
  }
  const audioTypeArray = audioArray(audioFilesAllowed)
  return audioTypeArray.some((fileExtension) => {
    return equals(getFileExtension(file), fileExtension)
  })
}
