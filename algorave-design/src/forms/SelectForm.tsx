import * as Ariakit from "@ariakit/react";
import {SelectProvider} from "@ariakit/react";
import type {selectFormProps} from "./formtypes.ts";

export default function SelectForm(props: SelectFormProps) {
    // Ariakit expects items to have id, label, value
    const formattedItems = props.items.map((item, idx) => ({
        id: item.value,
        label: item.label,
        value: item.value
    }));
    const select = Ariakit.useSelectStore({ items: formattedItems });
    return (
        <div className="select-container">
            <SelectProvider store={select}>
                <Ariakit.SelectLabel store={select} className="select-label">
                    {props.label}
                </Ariakit.SelectLabel>
                <Ariakit.Select store={select} className="select-trigger">
                    <Ariakit.SelectValue/>
                    <Ariakit.SelectArrow className="select-arrow"/>
                </Ariakit.Select>
                <Ariakit.SelectPopover store={select} className="select-popover">
                    {formattedItems.map(item => (
                        <Ariakit.SelectItem className="select-item" value={item.value} key={item.id}>
                            {item.value}
                        </Ariakit.SelectItem>
                    ))}
                </Ariakit.SelectPopover>
            </SelectProvider>
        </div>
    );
};