export default function Contact() {
  return (
    <main>
      <h1>Contact</h1>
      <form onSubmit={(e) => { e.preventDefault(); alert('Contact form submitted (mock)') }}>
        <label>
          Name
          <input name="name" />
        </label>
        <label>
          Message
          <textarea name="message" />
        </label>
        <button type="submit">Send</button>
      </form>
    </main>
  )
}
