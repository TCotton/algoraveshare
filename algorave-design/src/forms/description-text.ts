export const getDescriptionHtml = (currentProjectSoftware: string | null): string => {
  const isTidal = currentProjectSoftware === 'Tidal Cycles'
  const isStrudel = currentProjectSoftware === 'Strudel'

  return `<ul>
                    <li>🎛️ Creative Intent<br />
                        What inspired this pattern or composition? What kind of vibe, rhythm, or sonic texture were you
                        aiming for?<br />
                        > Example: I wanted a rolling minimal techno repetition that morphs into more chaotic textures over time.
                    </li>

                    <li>🧠 Musical Structure<br />
                        How is the timing or pattern organized? Mention cycles, phrases, or evolving layers.<br />
                        > Example: It loops every 8 bars, with each repeat introducing a new melodic variation.
                    </li>

                    <li>🧩 Code & Techniques<br />
                        Which functions or operators are central to this idea?<br />
                        ${isTidal ? '<span class="tidal-cycles">(TidalCycles: `every`, `when`, `superimpose`, `hurry`, etc.)</span>' : ''}
                        ${isStrudel ? '<span class="strudel">(Strudel: `map`, `withEffects`, `fast`, `stack`, etc.)</span>' : ''}
                        ${isTidal || isStrudel ? '<br />' : ''}
                        ${isTidal && isStrudel
                          ? '> Example: I used `superimpose` in Tidal / `stack` in Strudel to layer two rhythms.'
                          : isTidal
                            ? '> Example: I used `superimpose` to layer two rhythms.'
                            : isStrudel ? '> Example: I used `stack` to layer two rhythms.' : ''}
                    </li>

                    <li>🎚️ Sound Design & Effects<br />
                        How do you shape the sound or texture?<br />
                        ${isTidal ? '(Tidal: `reverb`, `hpf`, `crush`, `shape`)' : ''}
                        ${isTidal && isStrudel ? ' | ' : ''}
                        ${isStrudel ? '(Strudel: `withFx`, `filter`, `reverb`, `delay`)' : ''}
                        ${isTidal || isStrudel ? '<br />' : ''}
                        > Example: I added delay and filter sweeps to make the high-end shimmer.
                    </li>

                    <li>🎹 Performance & Interactivity<br />
                        How would you perform or tweak this live?<br />
                        > Example: I like to slowly fade density or switch samples live to evolve the groove.
                    </li>

                    <li>💡 Reflection & Sharing<br />
                        What did you learn, discover, or experiment with? Any advice for others?<br />
                        > Example: I learned how changing \`speed\` subtly changes the feel.
                    </li>

                    <li> 🎧 Listening Notes (optional)<br />
                        What should listeners pay attention to?<br />
                        > Example: The hats slowly shift phase against the kick, creating tension.
                    </li>`
}

// Keep backward compatibility with the old export
export const html = getDescriptionHtml(null)
