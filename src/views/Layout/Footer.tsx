import { useState } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box'

import Icon from 'src/@core/components/icon'

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { useTranslation } from 'react-i18next'

const Footer = (props: any) => {
  // ** Props
  const { footer } = props
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
            console.log("FooterContent event", event)
          }}
          sx={{width: '100%'}}
        >
          <BottomNavigationAction label={t("Wallet")} icon={<Icon icon='material-symbols:account-balance-wallet-outline' />} />
          <BottomNavigationAction label={t("Swap")} icon={<Icon icon='material-symbols:swap-horiz-rounded' />} />
          <BottomNavigationAction label={t("Apps")} icon={<Icon icon='tdesign:app' />} />
          <BottomNavigationAction label={t("Setting")} icon={<Icon icon='material-symbols:settings-outline' />} />
        </BottomNavigation>
      </Box>
  )
}

export default Footer
