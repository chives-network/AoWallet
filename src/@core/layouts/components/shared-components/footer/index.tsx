// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

// ** Type Import
import { LayoutProps } from 'src/@core/layouts/types'

// ** Footer Content Component
import FooterContent from './FooterContent'

interface Props {
  settings: LayoutProps['settings']
  saveSettings: LayoutProps['saveSettings']
  footerStyles?: NonNullable<LayoutProps['footerProps']>['sx']
  footerContent?: NonNullable<LayoutProps['footerProps']>['content']
}

const Footer = (props: Props) => {
  // ** Props
  const { settings, footerStyles } = props

  // ** Hook
  const theme = useTheme()

  // ** Vars
  const { skin, footer, layout } = settings

  if (footer === 'hidden') {
    return null
  }

  return (
    <Box
      component='footer'
      className='layout-footer'
      sx={{
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...(footer === 'fixed' && {
          bottom: 0,
          position: 'sticky',
          ...(layout === 'vertical'
            ? { px: [4, 6] }
            : {
                backgroundColor: 'background.paper',
                ...(skin === 'bordered' ? { borderTop: `1px solid ${theme.palette.divider}` } : { boxShadow: 6 })
              })
        }),
        ...footerStyles
      }}
    >
      <Box
        className='footer-content-container'
        sx={{
          width: '100%',
          borderRadius: '6px',
          backgroundColor: 'background.paper',
        }}
      >
        <FooterContent />
      </Box>
    </Box>
  )
}

export default Footer
