import React from 'react'
import * as Ariakit from '@ariakit/react'

export default function Form() {
  const form = Ariakit.useFormStore({ defaultValues: { formInput: '', formTextarea: '', content: '' } })

  form.useSubmit(async (state) => {
    alert(JSON.stringify(state.values))
  })

  const html = `<ul>
                    <li>🎛️ Creative Intent
                        What inspired this pattern or composition? What kind of vibe, rhythm, or sonic texture were you
                        aiming for?<br />
                        > Example: I wanted a rolling minimal groove that morphs into more chaotic textures over time.
                    </li>

                    <li>🧠 Musical Structure
                        How is the timing or pattern organized? Mention cycles, phrases, or evolving layers.<br />
                        > Example: It loops every 8 bars, with each repeat introducing a new melodic variation.
                    </li>

                    <li>🧩 Code & Techniques
                        Which functions or operators are central to this idea?
                        (TidalCycles: \`every\`, \`when\`, \`superimpose\`, \`hurry\`, etc.)
                        (Strudel: \`map\`, \`withEffects\`, \`fast\`, \`stack\`, etc.)<br />
                        > Example: I used \`superimpose\` in Tidal / \`stack\` in Strudel to layer two rhythms.
                    </li>

                    <li>🎚️ Sound Design & Effects
                        How do you shape the sound or texture?
                        (Tidal: \`reverb\`, \`hpf\`, \`crush\`, \`shape\` | Strudel: \`withFx\`, \`filter\`, \`reverb\`, \`delay\`.)<br />
                        > Example: I added delay and filter sweeps to make the high-end shimmer.
                    </li>

                    <li>🎹 Performance & Interactivity
                        How would you perform or tweak this live?<br />
                        > Example: I like to slowly fade density or switch samples live to evolve the groove.
                    </li>

                    <li>💡 Reflection & Sharing
                        What did you learn, discover, or experiment with? Any advice for others?<br />
                        > Example: I learned how changing \`speed\` subtly changes the groove feel.
                    </li>

                    <li> 🎧 Listening Notes (optional)
                        What should listeners pay attention to?<br />
                        > Example: The hats slowly shift phase against the kick, creating tension.
                    </li>`

  return (
    <Ariakit.Form
      store={form}
      aria-labelledby="add-new-project"
      className="form-wrapper"
    >
      <div className="field">
      </div>
      <div className="field">
        <Ariakit.FormLabel name={form.names.formInput}>Name</Ariakit.FormLabel>
        <Ariakit.FormInput
          name={form.names.formInput}
          placeholder="Name of project"
          className="input"
          maxLength={200}
          autoCapitalize="none"
          autoComplete="off"
          size-="large"
          required
        />
        <Ariakit.FormError name={form.names.formInput} className="error" />
      </div>
      <div className="field">
        <h3>Description</h3>
        <p>When writing your description, consider addressing some of the following questions:</p>
        <div
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <Ariakit.FormLabel name={form.names.formTextarea}>Description</Ariakit.FormLabel>
        <textarea
          name={String(form.names.formTextarea)}
          value={form.useValue(form.names.formTextarea)}
          onChange={event => form.setValue('description', event.target.value)}
          placeholder="Write your description here..."
          className="form-textarea"
          autoCapitalize="none"
          autoCorrect="off"
          required
          rows={4}
        />
      </div>
      <Ariakit.FormError name={form.names.formTextarea} className="error" />
      <div className="buttons">
        <Ariakit.FormSubmit className="button">Submit</Ariakit.FormSubmit>
      </div>
    </Ariakit.Form>
  )
};
