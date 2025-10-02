import { users } from '../../data/dummy'

export default function UserPage({ params }: { params: { id: string } }) {
  const user = users.find((u) => u.userId === params.id)
  if (!user) return <main><h1>User not found</h1></main>
  return (
    <main>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </main>
  )
}
