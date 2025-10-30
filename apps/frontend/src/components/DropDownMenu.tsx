import React from 'react'
import * as Ariakit from '@ariakit/react'

export default function DropDownMenu() {
  return (
    <Ariakit.MenuProvider>
      <Ariakit.MenuButton className="button">
        Menu
        <Ariakit.MenuButtonArrow />
      </Ariakit.MenuButton>
      <Ariakit.Menu gutter={8} className="menu">
        <Ariakit.MenuItem className="menu-item">
          <a href="/">Home</a>
        </Ariakit.MenuItem>
        <Ariakit.MenuItem className="menu-item">
          <a href="/projects">Projects</a>
        </Ariakit.MenuItem>
        <Ariakit.MenuItem className="menu-item">
          <a href="/snippets">Snippets</a>
        </Ariakit.MenuItem>
        <Ariakit.MenuSeparator className="separator" />
      </Ariakit.Menu>
    </Ariakit.MenuProvider>
  )
}
