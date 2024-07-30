import { useState } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box'

import Icon from '../../@core/components/icon'

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { useTranslation } from 'react-i18next'
import { Casino } from '@mui/icons-material';


const Footer = (props: any) => {
  // ** Props
  const { footer, setCurrentTab } = props
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
                setCurrentTab('Wallet')
                break;
              case 1:
                setCurrentTab('Faucet')
                break;
              case 2:
                setCurrentTab('Lottery')
                break;
              case 3:
                setCurrentTab('Setting')
                break;
            }
          }}
          sx={{width: '100%'}}
        >
          <BottomNavigationAction label={t("Wallet")} icon={<Icon icon='material-symbols:account-balance-wallet-outline' />} />
          <BottomNavigationAction label={t("Faucet")} icon={<Icon icon='material-symbols:swap-horiz-rounded' />} />
          <BottomNavigationAction label={t("Lottery")} icon={<Casino />} />
          <BottomNavigationAction label={t("Setting")} icon={<Icon icon='material-symbols:settings-outline' />} />
        </BottomNavigation>
      </Box>
  )
}

export default Footer
