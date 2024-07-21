// ** MUI Imports
import Icon from 'src/@core/components/icon'

import { AppBar, Toolbar, Typography, IconButton, Button, Box } from '@mui/material';

const Header = (props: any) => {
  // ** Props
  const { Hidden, LeftIcon, LeftIconOnClick, Title, RightButtonText, RightButtonOnClick, RightButtonIcon } = props

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
        <Box width='100px'>
          {LeftIcon && (
            <IconButton size="small" edge="start" color="inherit" aria-label="menu">
              <Icon icon={LeftIcon} onClick={ () => LeftIconOnClick && LeftIconOnClick()}/>
            </IconButton>
          )}
        </Box>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
          {Title}
        </Typography>
        <Box display="flex" justifyContent="flex-end" width="100px">
          {RightButtonText && RightButtonIcon == null && (
            <Button size="small" color="inherit" onClick={ () => RightButtonOnClick && RightButtonOnClick()}>
              {RightButtonText}
            </Button>
          )}
          {RightButtonIcon && (
            <IconButton size="small" edge="start" color="inherit" aria-label="menu">
              <Icon icon={RightButtonIcon} onClick={ () => RightButtonOnClick && RightButtonOnClick()}/>
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
