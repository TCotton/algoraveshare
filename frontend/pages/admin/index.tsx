import { useState } from 'react'
import { projects as demoProjects, snippets as demoSnippets, events as demoEvents } from '../../data/dummy'
import UploadForm from '../../components/UploadForm'

export default function AdminIndex() {
  const [projects, setProjects] = useState(demoProjects)
  const [snippets, setSnippets] = useState(demoSnippets)
  const [events, setEvents] = useState(demoEvents)

  function addProject() {
    const p = { projectId: crypto.randomUUID(), userId: projects[0].userId, codeStart: '', codeEnd: '', description: 'New project', audioFilePath: null, audioFileType: null, youtubeUrl: '', softwareType: 'tidalcycles', createdAt: new Date().toISOString() }
    setProjects([p, ...projects])
  }

  function removeProject(id: string) {
    setProjects(projects.filter(p => p.projectId !== id))
  }

  return (
    <main>
      <h1>Admin Area (mock)</h1>
      <section>
        <h2>Projects</h2>
        <button onClick={addProject}>Add Project</button>
        <ul>
          {projects.map(p => (
            <li key={p.projectId}>{p.description} <button onClick={() => removeProject(p.projectId)}>Delete</button></li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Snippets (mock)</h2>
        <ul>
          {snippets.map(s => <li key={s.snippetId}>{s.description}</li>)}
        </ul>
      </section>

      <section>
        <h2>Events (mock)</h2>
        <UploadForm onUpload={(m) => alert('file meta: ' + JSON.stringify(m))} />
        <ul>
          {events.map(ev => <li key={ev.id}>{ev.title}</li>)}
        </ul>
      </section>
    </main>
  )
}
