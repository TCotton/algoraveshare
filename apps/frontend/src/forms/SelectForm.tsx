/* eslint-disable react/no-unknown-property */
import React from 'react'
import * as Ariakit from '@ariakit/react'
import { SelectProvider } from '@ariakit/react'
import type { SelectFormProps } from './formtypes.ts'

interface FormObject {
  useValue: (name: string) => string
  setValue: (name: string, value: string) => void
}

/**
 * In the future use the data-test-id for PlayWright tests:
 *
 * SelectForm
 *   label="Choose the project software"
 *   name="projectSoftware"
 *   form={form}
 *   items={[...]}
 *   selectClass="project-software"
 *   data-test-id="project-software-select"
 * />
 *
 *
 * // Instead of using class selectors:
 * await page.locator('.project-software button.select-trigger').click()
 *
 * // You can now use data-test-id:
 * await page.locator('[data-test-id="project-software-select"] button.select-trigger').click()
 *
 * // Or more simply:
 * await page.getByTestId('project-software-select').click()
 */

interface ExtendedSelectFormProps extends SelectFormProps {
  'name': string
  'form'?: FormObject
  'selectClass'?: string
  'onChange'?: (name: string, value: string) => void
  'onMouseEnter'?: (event: React.MouseEvent<HTMLDivElement>) => void
  'onMouseLeave'?: (event: React.MouseEvent<HTMLDivElement>) => void
  'data-testid'?: string
}

export default function SelectForm(props: ExtendedSelectFormProps) {
  const { items, label, name, form, onChange, selectClass, onMouseEnter, onMouseLeave, 'data-testid': dataTestId } = props
  const formattedItems = items?.map((item: { value: string, label: string }) => ({
    id: item.value,
    label: item.label,
    value: item.value,
  }))
  const select = Ariakit.useSelectStore({
    defaultValue: items.length > 0 ? items[0].value : undefined,
    items: formattedItems,
    value: form ? form.useValue(name) : undefined,
    setValue: (val: string) => {
      if (form) {
        form.setValue(name, val)
      }
      if (onChange) {
        onChange(name, val)
      }
    },
  })
  return (
    <div
      className={`select-container ${selectClass || ''}`}
      is-="typography-block"
      box-="round"
      shear-="top"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-testid={dataTestId}
    >
      <SelectProvider store={select}>
        <Ariakit.SelectLabel store={select} className="select-label">
          <div is-="badge" variant-="background0">{label}</div>
        </Ariakit.SelectLabel>
        <Ariakit.Select store={select} className="select-trigger">
          <Ariakit.SelectValue fallback={items.length > 0 ? items[0].value : undefined} />
          <Ariakit.SelectArrow className="select-arrow" />
        </Ariakit.Select>
        <Ariakit.SelectPopover store={select} className="menu-wrapper" id="menu-form" gutter={4}>
          {formattedItems.map((item: { value: string, label: string, id: string }) => (
            <Ariakit.SelectItem className={`menu-item ${item.label}`} value={item.value} key={item.id}>
              <a href="#menu-form">{item.value}</a>
            </Ariakit.SelectItem>
          ))}
        </Ariakit.SelectPopover>
      </SelectProvider>
    </div>
  )
}
