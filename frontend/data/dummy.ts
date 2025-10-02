// Dummy data modeled after backend/db/configs/schema.ts

export const users = [
  {
    userId: '11111111-1111-1111-1111-111111111111',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    location: 'London, UK',
    youtubeUrl: '',
    mastodonUrl: '',
    blueskyUrl: '',
    linkedinUrl: '',
    createdAt: '2025-10-02T00:00:00.000Z',
  },
  {
    userId: '22222222-2222-2222-2222-222222222222',
    name: 'Bob Ross',
    email: 'bob@example.com',
    location: 'Palo Alto, CA',
    createdAt: '2025-10-02T00:00:00.000Z',
  },
]

export const projects = [
  {
    projectId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    userId: users[0].userId,
    codeStart: 'start code',
    codeEnd: 'end code',
    description: 'A demo project',
    audioFilePath: null,
    audioFileType: null,
    youtubeUrl: '',
    softwareType: 'tidalcycles',
    createdAt: '2025-10-02T00:00:00.000Z',
  },
]

export const snippets = [
  {
    snippetId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    userId: users[1].userId,
    codeSample: 'print("hello world")',
    description: 'A small demo snippet',
    audioFilePath: null,
    audioFileType: null,
    softwareType: 'strudel',
    createdAt: '2025-10-02T00:00:00.000Z',
  },
]

export const tags = [
  { tagId: 1, name: 'ambient' },
  { tagId: 2, name: 'glitch' },
]

export const projectTags = [
  { projectId: projects[0].projectId, tagId: 1 },
]

export const snippetTags = [
  { snippetId: snippets[0].snippetId, tagId: 2 },
]

export const events = [
  { id: 'e1', title: 'Live Algorave Session', startsAt: '2025-10-10T19:00:00Z', location: 'Online' },
]

