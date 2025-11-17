#!/usr/bin/env node
/* eslint-env node */
import 'dotenv/config'
import { Client } from 'pg'

const client = new Client({
  connectionString: process.env.DATABASE_URL
})

// Dummy data
const users = [
  {
    name: 'Alice Coder',
    email: 'alice@example.com',
    password_hash: '$2a$10$abcdefghijklmnopqrstuvwxyz123456', // bcrypt hash placeholder
    location: 'Berlin, Germany',
    portfolio_url: 'https://alice-codes.dev',
    youtube_url: 'https://youtube.com/@alicecodes',
    mastodon_url: 'https://mastodon.social/@alice',
    bluesky_url: null,
    linkedin_url: 'https://linkedin.com/in/alicecoder'
  },
  {
    name: 'Bob Beats',
    email: 'bob@example.com',
    password_hash: '$2a$10$xyz789wxyz789wxyz789wxyz789wxyz78',
    location: 'London, UK',
    portfolio_url: 'https://bobbeats.com',
    youtube_url: 'https://youtube.com/@bobbeats',
    mastodon_url: null,
    bluesky_url: 'https://bsky.app/profile/bobbeats.bsky.social',
    linkedin_url: null
  },
  {
    name: 'Carol Synth',
    email: 'carol@example.com',
    password_hash: '$2a$10$qwerty123qwerty123qwerty123qwerty',
    location: 'Brooklyn, NY',
    portfolio_url: null,
    youtube_url: null,
    mastodon_url: 'https://mastodon.social/@carolsynth',
    bluesky_url: 'https://bsky.app/profile/carol.bsky.social',
    linkedin_url: null
  },
  {
    name: 'David Drums',
    email: 'david@example.com',
    password_hash: '$2a$10$asdfgh456asdfgh456asdfgh456asdfg',
    location: 'Tokyo, Japan',
    portfolio_url: 'https://daviddrums.io',
    youtube_url: 'https://youtube.com/@daviddrums',
    mastodon_url: null,
    bluesky_url: null,
    linkedin_url: 'https://linkedin.com/in/daviddrums'
  },
  {
    name: 'Eva Live',
    email: 'eva@example.com',
    password_hash: '$2a$10$zxcvbn789zxcvbn789zxcvbn789zxcvb',
    location: 'Mexico City, Mexico',
    portfolio_url: 'https://evalive.art',
    youtube_url: null,
    mastodon_url: 'https://mastodon.social/@evalive',
    bluesky_url: 'https://bsky.app/profile/evalive.bsky.social',
    linkedin_url: null
  },
  {
    name: 'Finn Frequency',
    email: 'finn@example.com',
    password_hash: '$2a$10$mnbvcx321mnbvcx321mnbvcx321mnbv',
    location: 'Helsinki, Finland',
    portfolio_url: 'https://finnfrequency.fi',
    youtube_url: 'https://youtube.com/@finnfrequency',
    mastodon_url: 'https://mastodon.social/@finnfreq',
    bluesky_url: null,
    linkedin_url: 'https://linkedin.com/in/finnfrequency'
  },
  {
    name: 'Grace Glitch',
    email: 'grace@example.com',
    password_hash: '$2a$10$poiuyt098poiuyt098poiuyt098poiu',
    location: 'Melbourne, Australia',
    portfolio_url: 'https://graceglitch.au',
    youtube_url: null,
    mastodon_url: 'https://mastodon.social/@graceglitch',
    bluesky_url: 'https://bsky.app/profile/grace.bsky.social',
    linkedin_url: null
  }
]

const tags = [
  { name: 'beginner' },
  { name: 'intermediate' },
  { name: 'advanced' },
  { name: 'percussion' },
  { name: 'melodic' },
  { name: 'ambient' },
  { name: 'techno' },
  { name: 'experimental' },
  { name: 'tutorial' },
  { name: 'live-coding' }
]

const tidalProjects = [
  {
    project_name: 'Rhythmic Explorations in Tidal',
    code_start: 'd1 $ sound "bd sd"',
    code_end: 'd1 $ sound "bd sd hh cp" # speed 2',
    code_full: 'd1 $ sound "bd sd hh cp"\nd2 $ sound "arpy*8" # n (irand 16)\nd3 $ sound "bass3" # n 5',
    description:
      'A progressive exploration of rhythm patterns using TidalCycles. Starting with basic kick and snare, evolving into complex polyrhythmic structures.',
    audio_file_path: '/audio/tidal-rhythm-01.wav',
    audio_file_type: 'wav',
    audio_data: { duration: 120.5, bitrate: 1411, sample_rate: 44100, channels: 2, format: 'wav' },
    youtube_url_id: 'dQw4w9WgXcQ',
    software_type: 'tidalcycles'
  },
  {
    project_name: 'Ambient Textures with Tidal',
    code_start: 'd1 $ slow 4 $ sound "pad" # n 3',
    code_end: 'd1 $ slow 8 $ sound "pad*4" # n (scale 3 5 $ slow 16 sine) # room 0.8 # size 0.9',
    code_full:
      'd1 $ slow 8 $ sound "pad*4" # n (scale 3 5 $ slow 16 sine)\nd2 $ every 4 (rev) $ sound "birds3" # speed 0.5\nd3 $ rarely (# crush 4) $ sound "feel:4"',
    description:
      'Creating atmospheric soundscapes with slowly evolving pad sounds, modulated by sine waves for smooth transitions.',
    audio_file_path: '/audio/tidal-ambient-02.mp3',
    audio_file_type: 'mp3',
    audio_data: { duration: 240.0, bitrate: 320, sample_rate: 48000, channels: 2, format: 'mp3' },
    youtube_url_id: null,
    software_type: 'tidalcycles'
  },
  {
    project_name: 'Granular Synthesis Experiment',
    code_start: 'd1 $ sound "bev" # crush 8',
    code_end: 'd1 $ slow 2 $ sound "bev*16" # crush (range 2 16 $ slow 8 sine) # speed (range 0.5 2 $ fast 4 saw)',
    code_full:
      'd1 $ slow 2 $ sound "bev*16" # crush (range 2 16 $ slow 8 sine) # speed (range 0.5 2 $ fast 4 saw)\nd2 $ whenmod 8 6 (# delay 0.8) $ sound "feel" # n (irand 8)\nd3 $ rarely (|*| speed 0.5) $ sound "bass:5"',
    description:
      'Exploring granular synthesis techniques in TidalCycles using bit crushing and speed modulation for textural soundscapes.',
    audio_file_path: '/audio/tidal-granular-03.flac',
    audio_file_type: 'flac',
    audio_data: { duration: 180.2, bitrate: 1411, sample_rate: 96000, channels: 2, format: 'flac' },
    youtube_url_id: 'GrAnUl4r123',
    software_type: 'tidalcycles'
  }
]

const strudelProjects = [
  {
    project_name: 'Strudel Drum Machine',
    code_start: 's("bd sd")',
    code_end: 's("bd sd hh*4 cp").fast(2)',
    code_full: 's("bd sd hh*4 cp").fast(2)\n.stack(\n  s("arpy*8").n("0 1 2 3 4 5 6 7"),\n  s("bass3").n(5)\n)',
    description:
      'A simple yet effective drum machine pattern in Strudel, demonstrating layering and rhythm multiplication.',
    audio_file_path: '/audio/strudel-drums-01.flac',
    audio_file_type: 'flac',
    audio_data: { duration: 60.0, bitrate: 1411, sample_rate: 96000, channels: 2, format: 'flac' },
    youtube_url_id: 'aBcDeFg123',
    software_type: 'strudel'
  },
  {
    project_name: 'Melodic Sequences in Strudel',
    code_start: 'note("c a f e")',
    code_end: 'note("c a f e".scale("C:minor")).fast(2).s("piano")',
    code_full:
      'note("c a f e".scale("C:minor"))\n  .fast(2)\n  .s("piano")\n  .stack(\n    note("0 2 4 7".sub(12)).s("sawtooth"),\n    s("bd sd").fast(2)\n  )',
    description:
      'Exploring melodic patterns and harmonies in Strudel, combining piano melodies with bass synth and drums.',
    audio_file_path: '/audio/strudel-melody-02.aac',
    audio_file_type: 'aac',
    audio_data: { duration: 90.3, bitrate: 256, sample_rate: 44100, channels: 2, format: 'aac' },
    youtube_url_id: null,
    software_type: 'strudel'
  },
  {
    project_name: 'Polyrhythmic Chaos',
    code_start: 's("bd")',
    code_end: 's("bd").superimpose(x => x.fast(3/2)).superimpose(x => x.fast(5/4))',
    code_full:
      's("bd").superimpose(x => x.fast(3/2)).superimpose(x => x.fast(5/4))\n.stack(\n  s("hh*16").mask("1 0 1 1"),\n  note("c e g".slow(8)).s("pad"),\n  s("cp").fast("1 2 3 4")\n)',
    description:
      'Complex polyrhythmic composition using superimposition and layering techniques to create interlocking rhythms.',
    audio_file_path: '/audio/strudel-polyrhythm-03.wav',
    audio_file_type: 'wav',
    audio_data: { duration: 150.0, bitrate: 1411, sample_rate: 44100, channels: 2, format: 'wav' },
    youtube_url_id: 'PoLyRh123',
    software_type: 'strudel'
  }
]

const tidalSnippets = [
  {
    snippet_name: 'Basic Kick Pattern',
    code_sample: 'd1 $ sound "bd*4"',
    description: 'Four-on-the-floor kick drum pattern, the foundation of many electronic music genres.',
    audio_file_path: '/audio/snippets/kick-01.wav',
    audio_file_type: 'wav',
    audio_data: { duration: 8.0, bitrate: 1411, sample_rate: 44100, channels: 2, format: 'wav' },
    software_type: 'tidalcycles'
  },
  {
    snippet_name: 'Euclidean Rhythm',
    code_sample: 'd1 $ sound "bd(5,8)" # speed 1.2',
    description:
      'Using Euclidean rhythms to create interesting polyrhythmic patterns. 5 beats distributed across 8 steps.',
    audio_file_path: '/audio/snippets/euclidean-01.mp3',
    audio_file_type: 'mp3',
    audio_data: { duration: 12.0, bitrate: 320, sample_rate: 44100, channels: 2, format: 'mp3' },
    software_type: 'tidalcycles'
  },
  {
    snippet_name: 'Reverb Space',
    code_sample: 'd1 $ sound "cp" # room 0.9 # size 0.8',
    description: 'Adding spatial depth with reverb effects. High room and size values create a cathedral-like space.',
    audio_file_path: '/audio/snippets/reverb-01.mp3',
    audio_file_type: 'mp3',
    audio_data: { duration: 6.5, bitrate: 320, sample_rate: 44100, channels: 2, format: 'mp3' },
    software_type: 'tidalcycles'
  }
]

const strudelSnippets = [
  {
    snippet_name: 'Simple Arp',
    code_sample: 's("arpy").n("0 2 4 7").fast(4)',
    description: 'A simple arpeggiated pattern using the arpy sample, cycling through notes 0, 2, 4, and 7.',
    audio_file_path: '/audio/snippets/arp-01.wav',
    audio_file_type: 'wav',
    audio_data: { duration: 4.0, bitrate: 1411, sample_rate: 44100, channels: 2, format: 'wav' },
    software_type: 'strudel'
  },
  {
    snippet_name: 'Scale Helper',
    code_sample: 'note("0 2 4 7".scale("D:dorian")).s("piano")',
    description: 'Using the scale helper to transpose notes into D Dorian mode, played on piano samples.',
    audio_file_path: '/audio/snippets/scale-01.ogg',
    audio_file_type: 'ogg',
    audio_data: { duration: 8.0, bitrate: 256, sample_rate: 44100, channels: 2, format: 'ogg' },
    software_type: 'strudel'
  },
  {
    snippet_name: 'Stack Layers',
    code_sample: 's("bd").stack(s("hh*8"), s("cp").late(0.5))',
    description: 'Layering multiple patterns: kick drum, hi-hats, and delayed clap for a full drum kit sound.',
    audio_file_path: '/audio/snippets/stack-01.flac',
    audio_file_type: 'flac',
    audio_data: { duration: 10.0, bitrate: 1411, sample_rate: 48000, channels: 2, format: 'flac' },
    software_type: 'strudel'
  }
]

async function seedDatabase() {
  try {
    await client.connect()
    console.log('Connected to database')

    // Clear existing data (in reverse order of dependencies)
    console.log('\n🗑️  Clearing existing data...')
    await client.query('DELETE FROM tag_assignments')
    await client.query('DELETE FROM tags')
    await client.query('DELETE FROM snippets')
    await client.query('DELETE FROM projects')
    await client.query('DELETE FROM users')

    // Reset sequences to start from 1
    await client.query('ALTER SEQUENCE tags_tag_id_seq RESTART WITH 1')
    await client.query('ALTER SEQUENCE users_user_id_seq RESTART WITH 1')
    await client.query('ALTER SEQUENCE projects_project_id_seq RESTART WITH 1')
    await client.query('ALTER SEQUENCE snippets_snippet_id_seq RESTART WITH 1')
    console.log('✓ Existing data cleared')

    // Insert users and store their IDs
    console.log('\n👥 Inserting users...')
    const userIds = []
    for (const user of users) {
      const result = await client.query(
        `INSERT INTO users (name, email, password_hash, location, portfolio_url, youtube_url, mastodon_url, bluesky_url, linkedin_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING user_id`,
        [
          user.name,
          user.email,
          user.password_hash,
          user.location,
          user.portfolio_url,
          user.youtube_url,
          user.mastodon_url,
          user.bluesky_url,
          user.linkedin_url
        ]
      )
      userIds.push(result.rows[0].user_id)
      console.log(`  ✓ Created user: ${user.name}`)
    }

    // Insert tags and store their IDs
    console.log('\n🏷️  Inserting tags...')
    const tagIds = []
    for (const tag of tags) {
      const result = await client.query(
        'INSERT INTO tags (name) VALUES ($1) RETURNING tag_id',
        [tag.name]
      )
      tagIds.push(result.rows[0].tag_id)
      console.log(`  ✓ Created tag: ${tag.name}`)
    }

    // Insert Tidal projects
    console.log('\n🎵 Inserting Tidal Cycles projects...')
    const projectIds = []
    for (let i = 0; i < tidalProjects.length; i++) {
      const project = tidalProjects[i]
      const userId = userIds[i % userIds.length] // Distribute among users
      const result = await client.query(
        `INSERT INTO projects (project_name, user_id, code_start, code_end, code_full, description, 
                               audio_file_path, audio_file_type, audio_data, youtube_url_id, software_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING project_id`,
        [
          project.project_name,
          userId,
          project.code_start,
          project.code_end,
          project.code_full,
          project.description,
          project.audio_file_path,
          project.audio_file_type,
          JSON.stringify(project.audio_data),
          project.youtube_url_id,
          project.software_type
        ]
      )
      projectIds.push(result.rows[0].project_id)
      console.log(`  ✓ Created project: ${project.project_name}`)
    }

    // Insert Strudel projects
    console.log('\n🎹 Inserting Strudel projects...')
    for (let i = 0; i < strudelProjects.length; i++) {
      const project = strudelProjects[i]
      const userId = userIds[(i + 2) % userIds.length] // Different user distribution
      const result = await client.query(
        `INSERT INTO projects (project_name, user_id, code_start, code_end, code_full, description, 
                               audio_file_path, audio_file_type, audio_data, youtube_url_id, software_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING project_id`,
        [
          project.project_name,
          userId,
          project.code_start,
          project.code_end,
          project.code_full,
          project.description,
          project.audio_file_path,
          project.audio_file_type,
          JSON.stringify(project.audio_data),
          project.youtube_url_id,
          project.software_type
        ]
      )
      projectIds.push(result.rows[0].project_id)
      console.log(`  ✓ Created project: ${project.project_name}`)
    }

    // Insert Tidal snippets
    console.log('\n✂️  Inserting Tidal Cycles snippets...')
    const snippetIds = []
    for (let i = 0; i < tidalSnippets.length; i++) {
      const snippet = tidalSnippets[i]
      const userId = userIds[i % userIds.length]
      const result = await client.query(
        `INSERT INTO snippets (snippet_name, user_id, code_sample, description, 
                               audio_file_path, audio_file_type, audio_data, software_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING snippet_id`,
        [
          snippet.snippet_name,
          userId,
          snippet.code_sample,
          snippet.description,
          snippet.audio_file_path,
          snippet.audio_file_type,
          snippet.audio_data ? JSON.stringify(snippet.audio_data) : null,
          snippet.software_type
        ]
      )
      snippetIds.push(result.rows[0].snippet_id)
      console.log(`  ✓ Created snippet: ${snippet.snippet_name}`)
    }

    // Insert Strudel snippets
    console.log('\n✂️  Inserting Strudel snippets...')
    for (let i = 0; i < strudelSnippets.length; i++) {
      const snippet = strudelSnippets[i]
      const userId = userIds[(i + 1) % userIds.length]
      const result = await client.query(
        `INSERT INTO snippets (snippet_name, user_id, code_sample, description, 
                               audio_file_path, audio_file_type, audio_data, software_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING snippet_id`,
        [
          snippet.snippet_name,
          userId,
          snippet.code_sample,
          snippet.description,
          snippet.audio_file_path,
          snippet.audio_file_type,
          snippet.audio_data ? JSON.stringify(snippet.audio_data) : null,
          snippet.software_type
        ]
      )
      snippetIds.push(result.rows[0].snippet_id)
      console.log(`  ✓ Created snippet: ${snippet.snippet_name}`)
    }

    // Assign tags to projects
    console.log('\n🔗 Assigning tags to projects...')
    const projectTagAssignments = [
      { projectIndex: 0, tagIndices: [1, 3, 9] }, // Tidal Rhythm: intermediate, percussion, live-coding
      { projectIndex: 1, tagIndices: [2, 5, 7] }, // Tidal Ambient: advanced, ambient, experimental
      { projectIndex: 2, tagIndices: [2, 7, 5] }, // Tidal Granular: advanced, experimental, ambient
      { projectIndex: 3, tagIndices: [0, 3, 8] }, // Strudel Drums: beginner, percussion, tutorial
      { projectIndex: 4, tagIndices: [1, 4, 6] }, // Strudel Melody: intermediate, melodic, techno
      { projectIndex: 5, tagIndices: [2, 3, 7] } // Strudel Polyrhythm: advanced, percussion, experimental
    ]

    for (const assignment of projectTagAssignments) {
      const projectId = projectIds[assignment.projectIndex]
      for (const tagIndex of assignment.tagIndices) {
        const tagId = tagIds[tagIndex]
        await client.query(
          'INSERT INTO tag_assignments (tag_id, entity_type, entity_id) VALUES ($1, $2, $3)',
          [tagId, 'project', projectId]
        )
      }
      console.log(`  ✓ Tagged project ${assignment.projectIndex + 1} with ${assignment.tagIndices.length} tags`)
    }

    // Assign tags to snippets
    console.log('\n🔗 Assigning tags to snippets...')
    const snippetTagAssignments = [
      { snippetIndex: 0, tagIndices: [0, 3] }, // Basic Kick: beginner, percussion
      { snippetIndex: 1, tagIndices: [1, 3, 7] }, // Euclidean: intermediate, percussion, experimental
      { snippetIndex: 2, tagIndices: [1, 5] }, // Reverb: intermediate, ambient
      { snippetIndex: 3, tagIndices: [0, 4, 8] }, // Simple Arp: beginner, melodic, tutorial
      { snippetIndex: 4, tagIndices: [1, 4] }, // Scale Helper: intermediate, melodic
      { snippetIndex: 5, tagIndices: [0, 3, 8] } // Stack Layers: beginner, percussion, tutorial
    ]

    for (const assignment of snippetTagAssignments) {
      const snippetId = snippetIds[assignment.snippetIndex]
      for (const tagIndex of assignment.tagIndices) {
        const tagId = tagIds[tagIndex]
        await client.query(
          'INSERT INTO tag_assignments (tag_id, entity_type, entity_id) VALUES ($1, $2, $3)',
          [tagId, 'snippet', snippetId]
        )
      }
      console.log(`  ✓ Tagged snippet ${assignment.snippetIndex + 1} with ${assignment.tagIndices.length} tags`)
    }

    console.log('\n✨ Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`   Users: ${userIds.length}`)
    console.log(`   Tags: ${tagIds.length}`)
    console.log(`   Projects: ${projectIds.length}`)
    console.log(`   Snippets: ${snippetIds.length}`)

    // Count tag assignments
    const totalTagAssignments = projectTagAssignments.reduce((acc, assignment) =>
      acc + assignment.tagIndices.length, 0) +
      snippetTagAssignments.reduce((acc, assignment) => acc + assignment.tagIndices.length, 0)
    console.log(`   Tag Assignments: ${totalTagAssignments}`)
  } catch (error) {
    console.error('\n❌ Error seeding database:', error)
    process.exit(1)
  } finally {
    await client.end()
    console.log('\n👋 Database connection closed')
  }
}

// Run the seed function
seedDatabase()
