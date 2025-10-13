import * as Ariakit from "@ariakit/react";
import {SelectProvider} from "@ariakit/react";


import type { SelectStore } from '@ariakit/react';

type SelectFormProps = {
    label: string;
    items: { label: string; value: string }[];
    store: SelectStore;
};

export default function SelectForm(props: SelectFormProps) {
    // Ariakit expects items to have id, label, value
    const items = props.items.map((item: { label: string; value: string }) => ({
        id: item.value,
        label: item.label,
        value: item.value,
    }));
    const select = props.store;
    return (
        <div className="select-container">
            <Ariakit.SelectLabel store={select} className="select-label">
                {props.label}
            </Ariakit.SelectLabel>
            <Ariakit.Select store={select} className="select-trigger">
                <Ariakit.SelectValue />
                <Ariakit.SelectArrow className="select-arrow" />
            </Ariakit.Select>
            <Ariakit.SelectPopover store={select} className="select-popover">
                {items.map((item) => (
                    <Ariakit.SelectItem className="select-item" value={item.value} key={item.id}>
                        {item.label}
                    </Ariakit.SelectItem>
                ))}
            </Ariakit.SelectPopover>
        </div>
    );
}