import React from "react";
import {describe, it, expect, beforeEach, vi} from "vitest";
import {render, screen} from "@testing-library/react";
import renderer from 'react-test-renderer';
import SelectForm from "../../../../src/forms/SelectForm";

vi.mock("@ariakit/react", () => ({
    __esModule: true,
    useSelectStore: vi.fn(() => ({})),
    Select: (props: any) => <select {...props}>{props.children}</select>,
    SelectItem: (props: any) => <option {...props}>{props.children}</option>,
    SelectPopover: (props: any) => <div {...props}>{props.children}</div>,
    SelectProvider: (props: any) => <div {...props}>{props.children}</div>,
    SelectLabel: (props: any) => <label {...props}>{props.children}</label>,
    SelectValue: () => <span>Selected Value</span>,
    SelectArrow: () => <span>▼</span>
}));

// Sample data
const items = {
    "label": "Choose a project type",
    "items": [
        { "value": "Finished Project", "label": "finished" },
        { "value": "Before and After Live Coding Project", "label": "before-after" }
    ]
};

beforeEach(() => {
    render(<SelectForm label={items.label} items={items.items} />);
})

describe("SelectForm", () => {
    it("renders label and options", () => {
        expect(screen.getByText(/choose a project type/i)).toBeInTheDocument();
        expect(screen.getByText("Finished Project")).toBeInTheDocument();
        expect(
            screen.getByText("Before and After Live Coding Project")
        ).toBeInTheDocument();
    });
    it('matches snapshot', () => {
        const tree = renderer.create(<SelectForm label={items.label} items={items.items} />).toJSON();
        expect(tree).toMatchSnapshot();
    })
});
