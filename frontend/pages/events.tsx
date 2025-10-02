import { events as demoEvents } from '../data/dummy'

export default function Events() {
  return (
    <main>
      <h1>Upcoming Events</h1>
      <ul>
        {demoEvents.map((ev) => (
          <li key={ev.id}>{ev.title} — {ev.startsAt}</li>
        ))}
      </ul>
    </main>
  )
}
