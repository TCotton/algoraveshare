import { projects, users } from '../../data/dummy'

export default function ProjectPage({ params }: { params: { id: string } }) {
  const project = projects.find((p) => p.projectId === params.id)
  if (!project) return <main><h1>Project not found</h1></main>
  const owner = users.find((u) => u.userId === project.userId)
  return (
    <main>
      <h1>{project.description}</h1>
      <p>By: {owner?.name}</p>
      <pre>{project.codeStart}\n...\n{project.codeEnd}</pre>
    </main>
  )
}
