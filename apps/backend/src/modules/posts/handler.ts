import { getProjects } from './db.js'

export const getPostsHandler = async () => {
  const data = await getProjects()

  return { data }
}
