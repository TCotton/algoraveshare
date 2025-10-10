import * as Ariakit from "@ariakit/react";

export default function DropDownMenu() {
    return (
        <Ariakit.MenuProvider>
            <Ariakit.MenuButton className="button" >
                Menu
                <Ariakit.MenuButtonArrow />
            </Ariakit.MenuButton>
            <Ariakit.Menu gutter={8} className="menu">
                <Ariakit.MenuItem className="menu-item">
                    Home
                </Ariakit.MenuItem>
                <Ariakit.MenuItem className="menu-item">
                    Projects
                </Ariakit.MenuItem>
                <Ariakit.MenuItem className="menu-item">
                    Snippets
                </Ariakit.MenuItem>
                <Ariakit.MenuSeparator className="separator" />
            </Ariakit.Menu>
        </Ariakit.MenuProvider>
    );
}
