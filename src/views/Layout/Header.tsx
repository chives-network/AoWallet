// ** MUI Imports
import Icon from 'src/@core/components/icon'

// ** Type Import
import { LayoutProps } from 'src/@core/layouts/types'

import { AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material';

import { useTranslation } from 'react-i18next'


const Header = (props: any) => {
  // ** Props
  const { footer } = props
  const { t } = useTranslation()

  if (footer === 'hidden') {
    return null
  }

  return (
    <AppBar
      color='default'
      position='sticky'
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
      }}
    >
      <Toolbar sx={{ height: '100%', display: 'flex', alignItems: 'center', 'min-height': 48 }}>
        <IconButton size="small" edge="start" color="inherit" aria-label="menu">
          <Icon icon='material-symbols:swap-horiz-rounded' />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
          {t('My Wallet')}
        </Typography>
        <Button size="small" color="inherit">{t('Edit')}</Button>
      </Toolbar>
    </AppBar>
  )
}

export default Header
