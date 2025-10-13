export type SelectFormProps = {
  label: string
  items: { label: string, value: string }[]
}

export interface FormProps extends selectFormProps {
  forms: {
    names: {
      formInput: string
      formTextarea: string
    }
  }
}
