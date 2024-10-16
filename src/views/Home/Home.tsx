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
  const [specifyTokenSend, setSpecifyTokenSend] = useState<any>(null)
  const [disabledFooter, setDisabledFooter] = useState<boolean>(true)
  const [encryptWalletDataKey, setEncryptWalletDataKey] = useState<string>('')

  return (
    <Fragment>
      {currentTab == "MyWallet" && (<MyWallet setCurrentTab={setCurrentTab} encryptWalletDataKey={encryptWalletDataKey} setDisabledFooter={setDisabledFooter}/>)}
      {currentTab == "Wallet" && (<Wallet setCurrentTab={setCurrentTab} specifyTokenSend={specifyTokenSend} setSpecifyTokenSend={setSpecifyTokenSend} setDisabledFooter={setDisabledFooter} encryptWalletDataKey={encryptWalletDataKey} setEncryptWalletDataKey={setEncryptWalletDataKey}/>)}
      {currentTab == "Faucet" && (<Faucet setCurrentTab={setCurrentTab} setSpecifyTokenSend={setSpecifyTokenSend} encryptWalletDataKey={encryptWalletDataKey} />)}
      {currentTab == "Email" && (<Email encryptWalletDataKey={encryptWalletDataKey} />)}
      {currentTab == "Setting" && (<Setting encryptWalletDataKey={encryptWalletDataKey} setEncryptWalletDataKey={setEncryptWalletDataKey} />)}
      <Footer Hidden={false} setCurrentTab={setCurrentTab} setSpecifyTokenSend={setSpecifyTokenSend}  currentTab={currentTab} disabledFooter={disabledFooter}/>
    </Fragment>
  )
}

export default HomeModel
