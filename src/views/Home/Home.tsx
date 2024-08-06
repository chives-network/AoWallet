// ** React Imports
import { useState, Fragment } from 'react'

import Footer from '../Layout/Footer'

import Lottery from '../Lottery/Lottery'
import Faucet from '../Faucet/Faucet'
import Setting from '../Setting/Setting'
import Wallet from '../Wallet/Wallet'
import MyWallet from '../MyWallet/MyWallet'



const HomeModel = () => {

  const [currentTab, setCurrentTab] = useState<string>('Wallet')
  const [specifyTokenSend, setSpecifyTokenSend] = useState<any>(null)
  const [disabledFooter, setDisabledFooter] = useState<boolean>(true)

  const [encryptWalletDataKey, setEncryptWalletDataKey] = useState<string>('')

  //{TokenId: 'gU_KGcU3pEKuYSBv3EYJwCkcOIHkQGs8P17NQQTd0N0', Name: 'Send Token Test', Address: 't5SrAnDXhQnpzNMBSZB7tU8k3BX7YkGnJFS2O9UgEc4'}

  return (
    <Fragment>
      {currentTab == "MyWallet" && (<MyWallet setCurrentTab={setCurrentTab} encryptWalletDataKey={encryptWalletDataKey} setDisabledFooter={setDisabledFooter}/>)}
      {currentTab == "Wallet" && (<Wallet setCurrentTab={setCurrentTab} specifyTokenSend={specifyTokenSend} setSpecifyTokenSend={setSpecifyTokenSend} setDisabledFooter={setDisabledFooter} encryptWalletDataKey={encryptWalletDataKey} setEncryptWalletDataKey={setEncryptWalletDataKey}/>)}
      {currentTab == "Faucet" && (<Faucet setCurrentTab={setCurrentTab} encryptWalletDataKey={encryptWalletDataKey} />)}
      {currentTab == "Apps" && (<Lottery encryptWalletDataKey={encryptWalletDataKey} />)}
      {currentTab == "Setting" && (<Setting encryptWalletDataKey={encryptWalletDataKey} />)}
      <Footer Hidden={false} setCurrentTab={setCurrentTab} currentTab={currentTab} disabledFooter={disabledFooter}/>
    </Fragment>
  )
}

export default HomeModel
