export type SelectFormProps = {
  label: string
  items: { label: string, value: string }[]
}

export interface FormProps extends SelectFormProps {
  forms: {
    names: {
      formInput: string
      formTextarea: string
    }
  }
}
