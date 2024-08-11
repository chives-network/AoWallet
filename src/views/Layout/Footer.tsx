import { useState } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box'

import Icon from '../../@core/components/icon'

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { useTranslation } from 'react-i18next'


const Footer = (props: any) => {
  // ** Props
  const { footer, setCurrentTab, setSpecifyTokenSend, disabledFooter } = props
  const { t } = useTranslation()

  const [value, setValue] = useState(0);

  if (footer === 'hidden') {
    return null
  }

  return (
      <Box
        component='footer'
        sx={{
          width: '100%',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bottom: 0,
          position: 'fixed',
        }}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            console.log("FooterContent event", newValue)
            switch(newValue) {
              case 0:
                setSpecifyTokenSend(null)
                setCurrentTab('Wallet')
                break;
              case 1:
                setSpecifyTokenSend(null)
                setCurrentTab('Faucet')
                break;
              case 2:
                setSpecifyTokenSend(null)
                setCurrentTab('Email')
                break;
              case 3:
                setSpecifyTokenSend(null)
                setCurrentTab('Setting')
                break;
            }
          }}
          sx={{width: '100%'}}
        >
          <BottomNavigationAction label={t("Wallet")} disabled={disabledFooter} icon={<Icon icon='material-symbols:account-balance-wallet-outline' />} />
          <BottomNavigationAction label={t("Faucet")} disabled={disabledFooter} icon={<Icon icon='material-symbols:swap-horiz-rounded' />} />
          <BottomNavigationAction label={t("Email")} disabled={disabledFooter} icon={<Icon icon='mdi:email-outline' />} />
          <BottomNavigationAction label={t("Setting")} disabled={disabledFooter} icon={<Icon icon='material-symbols:settings-outline' />} />
        </BottomNavigation>
      </Box>
  )
}

//icon-park-outline:all-application

export default Footer
