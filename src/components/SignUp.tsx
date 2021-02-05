import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import React from 'reactn'
import isEmail from 'validator/lib/isEmail'
import { Button, PasswordValidationInfo, TextInput } from '.'
import { translate } from '../lib/i18n'
import {
  hasAtLeastXCharacters as hasAtLeastXCharactersLib,
  hasLowercase as hasLowercaseLib,
  hasMatchingStrings,
  hasNumber as hasNumberLib,
  hasUppercase as hasUppercaseLib,
  testProps
} from '../lib/utility'
import { PV } from '../resources'

type Props = {
  bottomButtons: any
  isLoading: boolean
  onSignUpPressed?: any
  style?: any
}

type State = {
  email: string
  hasAtLeastXCharacters: boolean
  hasLowercase: boolean
  hasMatching: boolean
  hasNumber: boolean
  hasUppercase: boolean
  hasValidEmail: boolean
  name: string
  password: string
  passwordVerification: string
  submitIsDisabled: boolean
}

const testIDPrefix = 'sign_up'

export class SignUp extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      email: '',
      hasAtLeastXCharacters: false,
      hasLowercase: false,
      hasMatching: false,
      hasNumber: false,
      hasUppercase: false,
      hasValidEmail: false,
      name: '',
      password: '',
      passwordVerification: '',
      submitIsDisabled: true
    }
  }

  componentDidMount() {
    Keyboard.addListener('keyboardDidHide', this.checkIfSubmitIsDisabled)
  }

  componentWillUnmount() {
    Keyboard.removeListener('keyboardDidHide', this.checkIfSubmitIsDisabled)
  }

  emailChanged = (emailText: string) => {
    const hasValidEmail = isEmail(emailText)
    this.setState({ email: emailText, hasValidEmail }, this.checkIfSubmitIsDisabled)
  }

  passwordChanged = (passwordText: string) => {
    const passwordValidation = this.passwordsValid(passwordText, this.state.passwordVerification)
    this.setState({ password: passwordText, ...passwordValidation }, this.checkIfSubmitIsDisabled)
  }

  passwordVerificationChanged = (passwordVerificationText: string) => {
    const passwordValidation = this.passwordsValid(this.state.password, passwordVerificationText)
    this.setState(
      { passwordVerification: passwordVerificationText, ...passwordValidation },
      this.checkIfSubmitIsDisabled
    )
  }

  nameChanged = (nameText: string) => {
    this.setState({ name: nameText })
  }

  passwordsValid = (password: string, passwordVerification: string) => {
    const hasAtLeastXCharacters = hasAtLeastXCharactersLib(password)
    const hasLowercase = hasLowercaseLib(password)
    const hasMatching = hasMatchingStrings(password, passwordVerification)
    const hasNumber = hasNumberLib(password)
    const hasUppercase = hasUppercaseLib(password)

    return {
      hasAtLeastXCharacters,
      hasLowercase,
      hasMatching,
      hasNumber,
      hasUppercase
    }
  }

  checkIfSubmitIsDisabled = () => {
    const { hasAtLeastXCharacters, hasLowercase, hasMatching, hasNumber, hasUppercase, hasValidEmail } = this.state
    const submitIsDisabled = !(
      hasAtLeastXCharacters &&
      hasLowercase &&
      hasMatching &&
      hasNumber &&
      hasUppercase &&
      hasValidEmail
    )
    this.setState({ submitIsDisabled })
  }

  signUp = () => {
    const { onSignUpPressed } = this.props
    const { email, name, password } = this.state
    onSignUpPressed({ email, password, name })
  }

  render() {
    const { bottomButtons, isLoading } = this.props
    const {
      hasAtLeastXCharacters,
      hasLowercase,
      hasNumber,
      hasUppercase,
      password,
      passwordVerification,
      submitIsDisabled
    } = this.state

    const passwordMismatch = passwordVerification.length > 0 && passwordVerification !== password
    const errorStyle = {
      borderColor: PV.Colors.red,
      borderWidth: 2
    }

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={true}>
        <TextInput
          autoCapitalize='none'
          autoCompleteType='email'
          keyboardType='email-address'
          onChangeText={this.emailChanged}
          onSubmitEditing={() => {
            this.secondTextInput.focus()
          }}
          placeholder={translate('Email')}
          placeholderTextColor={PV.Colors.gray}
          returnKeyType='next'
          testID={`${testIDPrefix}_email`}
          value={this.state.email}
        />
        <TextInput
          autoCapitalize='none'
          autoCompleteType='off'
          inputRef={(input) => {
            this.secondTextInput = input
          }}
          onChangeText={this.passwordChanged}
          onSubmitEditing={() => {
            this.thirdTextInput.focus()
          }}
          placeholder={translate('Password')}
          placeholderTextColor={PV.Colors.gray}
          returnKeyType='next'
          secureTextEntry={true}
          testID={`${testIDPrefix}_password`}
          underlineColorAndroid='transparent'
          value={this.state.password}
        />
        <TextInput
          autoCapitalize='none'
          autoCompleteType='off'
          inputRef={(input) => {
            this.thirdTextInput = input
          }}
          onSubmitEditing={() => {
            Keyboard.dismiss()
          }}
          onChangeText={this.passwordVerificationChanged}
          placeholder={translate('Verify Password')}
          placeholderTextColor={PV.Colors.gray}
          returnKeyType={Platform.OS === 'ios' ? 'done' : 'default'}
          secureTextEntry={true}
          style={passwordMismatch ? errorStyle : null}
          testID={`${testIDPrefix}_verify_password`}
          underlineColorAndroid='transparent'
          value={this.state.passwordVerification}
        />
        <TouchableOpacity activeOpacity={1}>
          <>
            <PasswordValidationInfo
              hasAtLeastXCharacters={hasAtLeastXCharacters}
              hasLowercase={hasLowercase}
              hasNumber={hasNumber}
              hasUppercase={hasUppercase}
              style={styles.passwordValidationInfo}
            />
            <TouchableOpacity
              style={styles.signInButton}
              disabled={submitIsDisabled || isLoading}
              onPress={this.signUp}
              {...testProps(`${testIDPrefix}_submit`)}>
              {isLoading ? (
                <ActivityIndicator animating={true} color={PV.Colors.white} size='small' />
              ) : (
                <Button disabled={submitIsDisabled} isPrimary={!submitIsDisabled} text={translate('Sign Up')} />
              )}
            </TouchableOpacity>
            {bottomButtons}
          </>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

const deviceWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
  passwordValidationInfo: {
    marginBottom: 30
  },
  scrollView: {
    width: '100%'
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    maxWidth: deviceWidth
  },
  signInButton: {
    marginTop: 6,
    marginBottom: 200
  },
  signInButtonText: {},
  textField: {
    backgroundColor: PV.Colors.white,
    color: PV.Colors.black,
    fontSize: PV.Fonts.sizes.lg,
    height: 50,
    marginBottom: 30
  }
})
