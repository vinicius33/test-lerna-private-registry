import React from 'react'

enum ValidationEnum {
  MIN_LENGTH = 'min_length',
  UPPER_CASE = 'uppercase',
  LOWER_CASE = 'lowercase',
  SPECIAL_CHARACTER = 'special_character',
  MATCH = 'match'
}

type Props = {
  password: string
  minimumLength: number
  onValidate: (validations: Validation) => void
  children: (state: State) => React.ReactNode
  passwordConfirmation?: string
}

type Validation = {
  [ValidationEnum.MIN_LENGTH]: boolean
  [ValidationEnum.UPPER_CASE]: boolean
  [ValidationEnum.LOWER_CASE]: boolean
  [ValidationEnum.SPECIAL_CHARACTER]: boolean
  [ValidationEnum.MATCH]: boolean
}

type State = {
  validations: Validation
}

const UPPER_CASE: RegExp = /[A-Z]/
const LOWER_CASE: RegExp = /[a-z]/
const SPECIAL_CHARACTER: RegExp = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/

// simple validator
export class PasswordValidator extends React.Component<Props, State> {
  static defaultProps = {
    password: '',
    minimumLength: 8
  }

  readonly state: State = {
    validations: {
      [ValidationEnum.MIN_LENGTH]: false,
      [ValidationEnum.UPPER_CASE]: false,
      [ValidationEnum.LOWER_CASE]: false,
      [ValidationEnum.SPECIAL_CHARACTER]: false,
      [ValidationEnum.MATCH]: false
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { password, passwordConfirmation } = this.props

    if (
      password !== prevProps.password ||
      passwordConfirmation !== prevProps.passwordConfirmation
    ) {
      this.onValidate()
    }
  }

  onValidate = (): void => {
    const { onValidate, passwordConfirmation } = this.props
    const { MIN_LENGTH, UPPER_CASE, LOWER_CASE, SPECIAL_CHARACTER, MATCH } = ValidationEnum
    const { validations } = this.state

    const minLength = this.validatorType(MIN_LENGTH)
    const uppercase = this.validatorType(UPPER_CASE)
    const lowercase = this.validatorType(LOWER_CASE)
    const specialCharacter = this.validatorType(SPECIAL_CHARACTER)
    const passwordsMatch = this.validatorType(MATCH)

    this.setState(
      {
        validations: {
          ...validations,
          [MIN_LENGTH]: minLength,
          [UPPER_CASE]: uppercase,
          [LOWER_CASE]: lowercase,
          [SPECIAL_CHARACTER]: specialCharacter,
          [MATCH]: passwordsMatch
        }
      },
      () => onValidate(this.state.validations)
    )
  }

  validatorType = (type: ValidationEnum): boolean => {
    const { password, passwordConfirmation, minimumLength } = this.props

    switch (type) {
      case ValidationEnum.MIN_LENGTH:
        return password.length >= minimumLength
      case ValidationEnum.UPPER_CASE:
        return !!password.match(UPPER_CASE)
      case ValidationEnum.LOWER_CASE:
        return !!password.match(LOWER_CASE)
      case ValidationEnum.SPECIAL_CHARACTER:
        return !!password.match(SPECIAL_CHARACTER)
      case ValidationEnum.MATCH:
        return password === passwordConfirmation
      default:
        return false
    }
  }

  render() {
    const { children } = this.props
    return children(this.state)
  }
}
