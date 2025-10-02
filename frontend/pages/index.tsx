import Head from 'next/head'
import { projects, snippets, users, tags, projectTags, snippetTags, events } from '../data/dummy'

export default function Home() {
  return (
    <>
      <Head>
        <title>AlgoraveShare — Demo</title>
      </Head>
      <main>
        <h1>AlgoraveShare — Demo</h1>
        <div className="two-col">
          <div>
            {projects.map((p) => (
              <article key={p.projectId} className="card">
                <h3>{p.description}</h3>
                <div>By: {users.find(u => u.userId === p.userId)?.name}</div>
                <div className="tags">
                  {projectTags.filter(pt => pt.projectId === p.projectId).map(pt => {
                    const t = tags.find(x => x.tagId === pt.tagId)
                    return t ? <span key={t.tagId} className="tag">{t.name}</span> : null
                  })}
                </div>
              </article>
            ))}

            <section>
              <h2>Snippets</h2>
              {snippets.map((s) => (
                <div key={s.snippetId} className="card">
                  <pre>{s.codeSample}</pre>
                  <div className="tags">
                    {snippetTags.filter(st => st.snippetId === s.snippetId).map(st => {
                      const t = tags.find(x => x.tagId === st.tagId)
                      return t ? <span key={t.tagId} className="tag">{t.name}</span> : null
                    })}
                  </div>
                </div>
              ))}
            </section>
          </div>

          <aside>
            <h2>Events</h2>
            {events.map(ev => (
              <div key={ev.id} className="card">
                <strong>{ev.title}</strong>
                <div>{ev.startsAt} — {ev.location}</div>
              </div>
            ))}
          </aside>
        </div>
      </main>
    </>
  )
}

