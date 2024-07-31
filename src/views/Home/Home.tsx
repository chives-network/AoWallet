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
  const [specifyTokenSend, setSpecifyTokenSend] = useState<any>({TokenId: 'gU_KGcU3pEKuYSBv3EYJwCkcOIHkQGs8P17NQQTd0N0', Name: 'Send Token Test', Address: 't5SrAnDXhQnpzNMBSZB7tU8k3BX7YkGnJFS2O9UgEc4'})

  return (
    <Fragment>
      {currentTab == "MyWallet" && (<MyWallet setCurrentTab={setCurrentTab} />)}
      {currentTab == "Wallet" && (<Wallet setCurrentTab={setCurrentTab} specifyTokenSend={specifyTokenSend} setSpecifyTokenSend={setSpecifyTokenSend} />)}
      {currentTab == "Faucet" && (<Faucet setCurrentTab={setCurrentTab} />)}
      {currentTab == "Apps" && (<Lottery />)}
      {currentTab == "Setting" && (<Setting />)}
      <Footer Hidden={false} setCurrentTab={setCurrentTab} currentTab={currentTab} />
    </Fragment>
  )
}

export default HomeModel
