/* eslint-disable react/no-unknown-property */
import React from 'react'
import * as Ariakit from '@ariakit/react'
import { SelectProvider } from '@ariakit/react'
import type { SelectFormProps } from './formtypes.ts'

interface FormObject {
  useValue: (name: string) => string
  setValue: (name: string, value: string) => void
}

interface ExtendedSelectFormProps extends SelectFormProps {
  name: string
  form?: FormObject
}

export default function SelectForm(props: ExtendedSelectFormProps) {
  const { items, label, name, form } = props
  const formattedItems = items?.map(item => ({
    id: item.value,
    label: item.label,
    value: item.value,
  }))
  const select = Ariakit.useSelectStore({
    defaultValue: items.length > 0 ? items[0].value : undefined,
    items: formattedItems,
    value: form ? form.useValue(name) : undefined,
    setValue: form ? (val: string) => form.setValue(name, val) : undefined,
  })
  return (
    <div className="select-container" is-="typography-block" box-="round" shear-="top">
      <SelectProvider store={select}>
        <Ariakit.SelectLabel store={select} className="select-label">
          <div is-="badge" variant-="background0">{label}</div>
        </Ariakit.SelectLabel>
        <Ariakit.Select store={select} className="select-trigger">
          <Ariakit.SelectValue fallback={items.length > 0 ? items[0].value : undefined} />
          <Ariakit.SelectArrow className="select-arrow" />
        </Ariakit.Select>
        <Ariakit.SelectPopover store={select} className="menu-wrapper" id="menu-form" gutter={4}>
          {formattedItems.map(item => (
            <Ariakit.SelectItem className="menu-item" value={item.value} key={item.id}>
              <a href="#menu-form">{item.value}</a>
            </Ariakit.SelectItem>
          ))}
        </Ariakit.SelectPopover>
      </SelectProvider>
    </div>
  )
};
