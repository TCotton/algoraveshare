import {snippets, users} from '../../data/dummy';

export default function SnippetPage({params}: { params: { id: string } }) {
    const snippet = snippets.find((s) => s.snippetId === params.id);
    if (!snippet) {
        return <main><h1>Snippet not found</h1></main>;
    }
    const owner = users.find((u) => u.userId === snippet.userId);
    return (
        <main>
            <h1>Snippet by {owner?.name}</h1>
            <pre>{snippet.codeSample}</pre>

            <p>{snippet.description}</p>
        </main>
    )
}
