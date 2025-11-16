import { DbSchema } from '@repo/database/schema'
import { desc } from 'drizzle-orm'
import { db } from '../../db/index.js'

export const getProjects = async () => {
  const result = await db
    .select()
    .from(DbSchema.projects)
    .orderBy(desc(DbSchema.projects.createdAt))
    .limit(10)

  return result
}
