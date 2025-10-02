export default function Register() {
  return (
    <main>
      <h1>Register (mock)</h1>
      <form onSubmit={(e) => { e.preventDefault(); alert('Register (mock)') }}>
        <label>Name<input name="name" /></label>
        <label>Email<input name="email" /></label>
        <label>Password<input name="password" type="password"/></label>
        <button type="submit">Register</button>
      </form>
    </main>
  )
}
