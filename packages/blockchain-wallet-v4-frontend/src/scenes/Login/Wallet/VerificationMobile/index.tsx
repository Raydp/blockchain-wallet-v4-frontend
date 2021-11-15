import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { RemoteDataType } from '@core/types'
import { Button, Icon, Text } from 'blockchain-info-components'
import QRCodeWrapper from 'components/QRCodeWrapper'
import { actions, selectors } from 'data'
import { LoginSteps } from 'data/types'

import { Props as OwnProps } from '../..'
import { BackArrowFormHeader, Column, LOGIN_FORM_NAME, NeedHelpLink } from '../../model'

const Body = styled.div`
  display: flex;
  margin-bottom: 24px;
`
const TextColumn = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 24px;
  > div {
    margin-bottom: 16px;
  }
`
const LinkRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const CheckAppTextColumn = styled(Column)`
  min-height: 264px;
  margin-top: 24px;
`

const VerificationMobile = (props: Props) => {
  const {
    authActions,
    handleBackArrowClick,
    phonePubKey,
    qrData,
    secureChannelLoginState,
    setStep
  } = props

  const loginWithPasswordClicked = () => {
    authActions.analyticsLoginMethodSelected('PASSWORD')
    setStep(LoginSteps.ENTER_PASSWORD_WALLET)
  }

  return (
    <>
      <BackArrowFormHeader {...props} handleBackArrowClick={handleBackArrowClick} />
      <Body>
        <TextColumn>
          <Icon name='padlock' color='blue600' size='20px' style={{ padding: '0 0 16px 4px' }} />
          <Text
            color='grey900'
            size='16px'
            weight={600}
            lineHeight='1.5'
            style={{ marginBottom: '16px' }}
          >
            <FormattedMessage
              id='scenes.login.wallet.mobile_login.title'
              defaultMessage='Log in with mobile app'
            />
          </Text>
          <Text
            color='grey900'
            size='12px'
            weight={500}
            lineHeight='1.5'
            style={{ marginBottom: '16px' }}
          >
            <FormattedMessage
              id='scenes.login.wallet.mobile_login.description_one'
              defaultMessage='Scan this QR code with the Blockchain.com mobile app.'
            />
          </Text>
          <Text color='grey900' size='12px' weight={500} lineHeight='1.5'>
            <FormattedMessage
              id='scenes.login.wallet.mobile_login.description.ios'
              defaultMessage='iOS - Tap the Menu button at the top left corner of the app to reveal Web Log In option.'
            />
          </Text>
          <Text color='grey900' size='12px' weight={500} lineHeight='1.5'>
            <FormattedMessage
              id='scenes.login.wallet.mobile_login.description.android'
              defaultMessage='Android - Tap the QR code icon at the top right corner of the app.'
            />
          </Text>
        </TextColumn>
        {secureChannelLoginState.cata({
          Failure: (e) => (
            <Text>
              {typeof e === 'string' ? (
                e
              ) : (
                <FormattedMessage
                  id='scenes.login.qrcodelogin_failed'
                  defaultMessage='Login failed. Please refresh browser and try again.'
                />
              )}
            </Text>
          ),
          Loading: () => {
            return (
              <CheckAppTextColumn>
                <Text size='14px' weight={600}>
                  <FormattedMessage
                    id='scenes.login.qrcodelogin_success_confirm'
                    defaultMessage='Please confirm the login on your mobile device.'
                  />
                </Text>
                <Text
                  color='blue600'
                  size='14px'
                  weight={600}
                  style={{ cursor: 'pointer', marginTop: '8px' }}
                  data-e2e='qrCodeRefresh'
                  onClick={props.authActions.secureChannelLoginNotAsked}
                >
                  <FormattedMessage
                    id='scenes.login.qrcodelogin_refresh_code'
                    defaultMessage='Refresh Code'
                  />
                </Text>
              </CheckAppTextColumn>
            )
          },
          NotAsked: () => <QRCodeWrapper value={qrData} size={175} showImage />,
          Success: () => {
            return (
              <Text size='14px' weight={600}>
                <FormattedMessage
                  id='scenes.login.qrcodelogin_success'
                  defaultMessage='Success! Logging in...'
                />
              </Text>
            )
          }
        })}
      </Body>
      <LinkRow>
        <Button
          nature='empty-blue'
          fullwidth
          height='48px'
          data-e2e='loginWithPassword'
          style={{ marginBottom: '24px' }}
          onClick={loginWithPasswordClicked}
        >
          <FormattedMessage id='buttons.login_with_password' defaultMessage='Login with Password' />
        </Button>
        <NeedHelpLink authActions={authActions} origin='QR_CODE' />
      </LinkRow>
    </>
  )
}

const mapStateToProps = (state) => ({
  phonePubKey: selectors.cache.getPhonePubkey(state),
  qrData: selectors.cache.getChannelPrivKeyForQrData(state),
  secureChannelLoginState: selectors.auth.getSecureChannelLogin(state) as RemoteDataType<any, any>
})

const mapDispatchToProps = (dispatch) => ({
  middlewareActions: bindActionCreators(actions.ws, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = OwnProps & {
  setStep: (step: LoginSteps) => void
} & ConnectedProps<typeof connector>

export default connector(VerificationMobile)
