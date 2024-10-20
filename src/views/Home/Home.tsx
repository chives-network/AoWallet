// ** React Imports
import { useState, Fragment } from 'react'

import Footer from '../Layout/Footer'

import Email from '../Email/Email'
import Faucet from '../Faucet/Faucet'
import Setting from '../Setting/Setting'
import Wallet from '../Wallet/Wallet'
import MyWallet from '../MyWallet/MyWallet'

const HomeModel = () => {

  const [currentTab, setCurrentTab] = useState<string>('Wallet')
  const [currentToken, setCurrentToken] = useState<string>('Ar')
  const [specifyTokenSend, setSpecifyTokenSend] = useState<any>(null)
  const [disabledFooter, setDisabledFooter] = useState<boolean>(true)
  const [encryptWalletDataKey, setEncryptWalletDataKey] = useState<string>('')

  const handleSwitchBlockchain = () => {
    setCurrentToken(currentToken == 'Ar' ? 'Xwe' : 'Ar');
  }

  return (
    <Fragment>
      {currentTab == "MyWallet" && (<MyWallet currentToken={currentToken} setCurrentToken={setCurrentToken} handleSwitchBlockchain={handleSwitchBlockchain} setCurrentTab={setCurrentTab} encryptWalletDataKey={encryptWalletDataKey} setDisabledFooter={setDisabledFooter}/>)}
      {currentTab == "Wallet" && (<Wallet currentToken={currentToken} setCurrentToken={setCurrentToken} handleSwitchBlockchain={handleSwitchBlockchain} setCurrentTab={setCurrentTab} specifyTokenSend={specifyTokenSend} setSpecifyTokenSend={setSpecifyTokenSend} setDisabledFooter={setDisabledFooter} encryptWalletDataKey={encryptWalletDataKey} setEncryptWalletDataKey={setEncryptWalletDataKey}/>)}
      {currentTab == "Faucet" && (<Faucet currentToken={currentToken} setCurrentToken={setCurrentToken} handleSwitchBlockchain={handleSwitchBlockchain} setCurrentTab={setCurrentTab} setSpecifyTokenSend={setSpecifyTokenSend} encryptWalletDataKey={encryptWalletDataKey} />)}
      {currentTab == "Email" && (<Email currentToken={currentToken} setCurrentToken={setCurrentToken} handleSwitchBlockchain={handleSwitchBlockchain} encryptWalletDataKey={encryptWalletDataKey} />)}
      {currentTab == "Setting" && (<Setting currentToken={currentToken} setCurrentToken={setCurrentToken} handleSwitchBlockchain={handleSwitchBlockchain} encryptWalletDataKey={encryptWalletDataKey} setEncryptWalletDataKey={setEncryptWalletDataKey} />)}
      <Footer Hidden={false} setCurrentTab={setCurrentTab} setSpecifyTokenSend={setSpecifyTokenSend}  currentTab={currentTab} disabledFooter={disabledFooter}/>
    </Fragment>
  )
}

export default HomeModel
