
// ** MUI Imports
import { styled } from '@mui/material/styles'
import Footer from '../Layout/Footer'
import Header from '../Layout/Header'
import WalletList from './WalletList'

const ContentWrapper = styled('main')(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  padding: theme.spacing(6),
  transition: 'padding .25s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  }
}))

const VerticalLayout = () => {
  // ** Props
  const contentHeightFixed = {}
  
  return (
    <>
        <Header footer='show' />

        <ContentWrapper
            className='layout-page-content'
            sx={{
                ...(contentHeightFixed && {
                overflow: 'hidden',
                '& > :first-of-type': { height: '100%' }
                })
            }}
            >
            <WalletList />
        </ContentWrapper>

        <Footer footer='show' />
    </>
  )
}

export default VerticalLayout
