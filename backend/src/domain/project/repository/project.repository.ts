/**
 * The repository layer in our application is crucial for handling all database interactions. It uses SQL providers to communicate with the database, leveraging schemas to define the data structures expected from the database responses and to format the data sent in queries.
 * There are currently no database interactions in our application, but this layer is designed to be flexible and scalable, allowing for future additions or modifications to the database schema.
 */
import { Context, Effect, Layer } from "effect"
import { ProjectData } from "../models/project.model.js"
import { ProjectService } from "../service/project.service.js"

const make = Effect.gen(function*() {
  // rest of the implementations
  return {
    getAllProjectData: ProjectService.getAllProjectData
  } as const
})
export class ProjectRepository
  extends Context.Tag("Repository")<ProjectRepository, Effect.Effect.Success<typeof make>>()
{
  static readonly Live = Layer.effect(this, make)
}
