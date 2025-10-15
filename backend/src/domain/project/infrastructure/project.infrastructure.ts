/*
Notes
 Handle external API calls (projects only).
 The ProjectInfrastructure layer in our application is specifically designed to handle all external API interactions. In this example, we focus on fetching movie information from the MOCK_DUMMMY_DATA, but the structure is scalable to accommodate multiple external API sources as needed. This modularity ensures that extending our application to integrate with additional services is straightforward.
 */
import { FetchHttpClient, HttpClientRequest } from "@effect/platform"
import { Context, Effect, Layer, pipe } from "effect"
import { ProjectData } from "../models/project.model.js"

const basePath = process.env.MOCK_DUMMMY_DATA

const make = Effect.gen(function*() {
  const getProjectDataInformation = () =>
    pipe(
      HttpClientRequest.get(`${basePath}`),
      FetchHttpClient,
      ProjectData.decodeResponse,
      Effect.retry({ times: 3 }),
      Effect.withSpan("GetProjectInformation")
    )

  return {
    getProjectDataInformation
  } as const
})

export class ProjectInfrastructure
  extends Context.Tag("ProjectInfrastructure")<ProjectInfrastructure, Effect.Effect.Success<typeof make>>()
{
  static readonly Live = Layer.effect(this, make)
}
