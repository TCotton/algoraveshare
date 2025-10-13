import * as Ariakit from "@ariakit/react";
import SelectForm from '../forms/SelectForm';

export default function NewForm() {
    const form = Ariakit.useFormStore({defaultValues: {projectName: "", description: "", singleProject: ""}});

    form.useSubmit((state) => {
        const {values} = state;
        // clear previous errors
        form.setError("projectName", "");
        form.setError("description", "");
        form.setError("singleProject", "");

        let hasError = false;
        if (!String(values.projectName || "").trim()) {
            form.setError("projectName", "Name is required");
            hasError = true;
        }

        if (values.projectName.trim().length > 200) {
            form.setError("projectName", "The project name must not be longer than 200 characters");
            hasError = true;
        }

        if (!String(values.description || "").trim()) {
            form.setError("description", "Description is required");
            hasError = true;
        }

        if (!values.singleProject) {
            form.setError("singleProject", "Don't forget to add your code!");
            hasError = true;
        }

        if (hasError) {
            return;
        }
        alert(JSON.stringify(values));
    });

    return (
        <Ariakit.Form
            store={form}
            aria-labelledby="add-new-participant"
            className="form-wrapper"
        >
            <div className="field">
                <Ariakit.FormLabel name={form.names.projectName}>Name</Ariakit.FormLabel>
                <Ariakit.FormInput
                    name={form.names.projectName}
                    placeholder="Name of project"
                    className="input"
                    autoCapitalize="none"
                    autoComplete="off"
                    size-="large"
                />
                <Ariakit.FormError name={form.names.projectName} className="error"/>
            </div>
            <div className="field">
                <Ariakit.FormLabel name={form.names.description}>
                    Description</Ariakit.FormLabel>
                <div class="description-text">
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
                </div>
                <textarea
                    name={form.names.formTextarea}
                    value={form.useValue(form.names.formTextarea)}
                    onChange={(event) => form.setValue(form.names.formTextarea, event.target.value)}
                    placeholder="Describe the project..."
                    className="form-textarea"
                    autoCapitalize="none"
                    autoCorrect="off"
                    rows={4}
                />
                <Ariakit.FormError name={form.names.description} className="error"/>
            </div>
            <div className="field">
                <SelectForm label={'Choose a project type'} items={[
                    {value: 'finished', label: 'Finished Project'},
                    {value: 'before-after', label: 'Before and After Live Coding Project'},
                ]}/>
            </div>
            <div className="form-textarea-single">
                <Ariakit.FormLabel name={form.names.singleProject}>
                    Description</Ariakit.FormLabel>
                <textarea
                    name={String(form.names.singleProject)}
                    value={form.useValue("singleProject")}
                    onChange={e => form.setValue("singleProject", e.target.value)}
                    placeholder="Add code here..."
                    className="form-textarea-single"
                    autoCapitalize="none"
                    autoCorrect="off"
                    rows={4}
                />
                <Ariakit.FormError name={form.names.singleProject} className="error"/>
            </div>
            <div className="buttons">
                <Ariakit.FormSubmit className="button">Submit</Ariakit.FormSubmit>
            </div>
        </Ariakit.Form>
    );
}
;
