import { useState, SyntheticEvent } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Icon from 'src/@core/components/icon'

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';


const FooterContent = () => {
  
  const [value, setValue] = useState(0);
  
  return (
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          console.log("FooterContent event", event)
        }}
      >
        <BottomNavigationAction label="Wallet" icon={<Icon icon='material-symbols:account-balance-wallet-outline' />} />
        <BottomNavigationAction label="Swap" icon={<Icon icon='material-symbols:swap-horiz-rounded' />} />
        <BottomNavigationAction label="Apps" icon={<Icon icon='tdesign:app' />} />
        <BottomNavigationAction label="Setting" icon={<Icon icon='material-symbols:settings-outline' />} />
      </BottomNavigation>
  )
}

export default FooterContent
