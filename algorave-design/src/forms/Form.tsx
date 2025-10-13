import * as Ariakit from "@ariakit/react";
import SelectForm from "./SelectForm.tsx";
import type {FormProps} from "./formtypes.ts";

export default function Form(props: FormProps) {

    const form = Ariakit.useFormStore({defaultValues: {formInput: "", formTextarea: ""}});

    form.useSubmit(async (state) => {
        alert(JSON.stringify(state.values));
    });

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
                    maxLength="200"
                    autoCapitalize="none"
                    autocomplete="off"
                    size-="large"
                    required
                />
                <Ariakit.FormError name={form.names.formInput} className="error"/>
            </div>
            <div className="field">
                <h3>Description</h3>
                <p>When writing your description, consider addressing some of the following questions:</p>
                <ul>
                    <li>What inspired this pattern or composition?</li>
                    <li>What kind of mood, texture, or feeling were you aiming for?</li>
                    <li>How is the rhythm or structure of the pattern organized?</li>
                    <li>Are there repeating cycles, polyrhythms, or evolving sequences?</li>
                    <li>What role does silence or space play in the pattern?</li>
                    <li>Which functions or techniques are key to this pattern?</li>
                    <li>How do you control variation — randomness (rand, choose), patterning (every, when), or
                        layering?
                    </li>
                    <li>What was the trickiest part to get working?</li>
                    <li>Are there any interesting contrasts (e.g. between high/low, dry/wet, dense/sparse)?</li>
                    <li>How might someone remix or extend your idea?</li>
                    <li>What did you learn while making this pattern?</li>
                    <li>Is there something others could learn from your code?</li>
                    <li>Are there parts of the code that are experimental or exploratory?</li>
                </ul>
                <Ariakit.FormLabel name={form.names.formTextarea}>Description</Ariakit.FormLabel>
                <textarea
                    name="decription"
                    value={form.useValue("description")}
                    onChange={(event) => form.setValue("description", event.target.value)}
                    placeholder="Write your description here..."
                    className="form-textarea"
                    autoCapitalize="none"
                    autoCorrect="off"
                    required
                    rows={4}
                />
            </div>
            <Ariakit.FormError name={form.names.formTextarea} className="error"/>
            <div className="buttons">
                <Ariakit.FormSubmit className="button">Submit</Ariakit.FormSubmit>
            </div>
        </Ariakit.Form>
    );
};