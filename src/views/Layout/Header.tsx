// ** MUI Imports
import Icon from 'src/@core/components/icon'

import { AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material';

const Header = (props: any) => {
  // ** Props
  const { Hidden, LeftIcon, LeftIconOnClick, Title, RightButtonText, RightButtonOnClick } = props

  if (Hidden == true) {
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
          <Icon icon={LeftIcon} onClick={ () => LeftIconOnClick && LeftIconOnClick()}/>
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
          {Title}
        </Typography>
        <Button size="small" color="inherit" onClick={ () => RightButtonOnClick && RightButtonOnClick()} >{RightButtonText}</Button>
      </Toolbar>
    </AppBar>
  )
}

export default Header
