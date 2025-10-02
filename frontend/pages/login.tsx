export default function Login() {
  return (
    <main>
      <h1>Login (mock)</h1>
      <form onSubmit={(e) => { e.preventDefault(); alert('Login (mock)') }}>
        <label>Email<input name="email" /></label>
        <label>Password<input name="password" type="password"/></label>
        <button type="submit">Login</button>
      </form>
    </main>
  )
}
