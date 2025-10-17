/*
The ProjectService is responsible for projet-related functionalities in our application. It acts as an intermediary between the ProjetRepository, which handles database operations, and ProjetInfrastructure, which deals with external API calls to fetch additional movie details.
 */
import { Context, Effect, Layer } from "effect"
import { ProjectRepository } from "../repository/project.repository.js"

// this needs to be rewritten to be a single service

const make = Effect.gen(function*() {
  const repository = yield* ProjectRepository

  const getAllProjectData = () => repository.getAllProjectData()

  return {
    getAllProjectData
  } as const
})

export class ProjectService
  extends Context.Tag("ProjectService")<ProjectService, Effect.Effect.Success<typeof make>>()
{
  static readonly Live = Layer.effect(this, make)
}
