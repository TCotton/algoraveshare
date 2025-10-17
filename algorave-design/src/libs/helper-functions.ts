import { split, map, trim, pipe, last, toLower, replace } from 'ramda'

export const getFileExtension = pipe(
  split('.'), // split by dot
  last, // take the last segment
  toLower, // normalize case
)

export const audioArray = (audioFilesAllowed: string) => pipe(
  split(','), // split by comma
  map(pipe(
    trim, // remove surrounding spaces
    replace(/'/g, ''), // remove all single quotes
    split('/'), // split by '/'
    last, // take last segment (e.g., 'wav')
  )),
)(audioFilesAllowed)
