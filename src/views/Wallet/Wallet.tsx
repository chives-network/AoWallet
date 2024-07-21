// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import TextField from '@mui/material/TextField'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer'
import CircularProgress from '@mui/material/CircularProgress'


import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// ** MUI Imports
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'

import { getAllWallets, getWalletBalance, setWalletNickname, getWalletNicknames, getWalletByAddress, getCurrentWalletAddress } from 'src/functions/ChivesWallets'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { formatHash, formatAR } from 'src/configs/functions'

import { styled } from '@mui/material/styles'
import Footer from '../Layout/Footer'
import Header from '../Layout/Header'
import PinKeyboard from '../Layout/PinKeyboard'
import { useRouter } from 'next/router'

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

const Wallet = () => {
  // ** Hook
  const { t } = useTranslation()
  const router = useRouter()

  const contentHeightFixed = {}
  
  const [model, setModel] = useState<string>('View')
  const [pageModel, setPageModel] = useState<string>('MainWallet')
  const [bottomMenus, setBottomMenus] = useState<any>([])
  const [HeaderHidden, setHeaderHidden] = useState<boolean>(false)
  const [FooterHidden, setFooterHidden] = useState<boolean>(false)
  const [LeftIcon, setLeftIcon] = useState<string>('material-symbols:menu-rounded')
  const [Title, setTitle] = useState<string>('Wallet')
  const [RightButtonText, setRightButtonText] = useState<string>('Edit')
  const [RightButtonIcon, setRightButtonIcon] = useState<string>('mdi:qrcode')
  const [drawerStatus, setDrawerStatus] = useState<boolean>(false)
  const [chooseWallet, setChooseWallet] = useState<any>(null)


  const handleWalletGoHome = () => {
    setModel('View')
    setRefreshWalletData(refreshWalletData+1)
    setPageModel('MainWallet')
    setLeftIcon('material-symbols:menu-rounded')
    setTitle(t('Wallet') as string)
    setRightButtonText(t('QR') as string)
  }
  
  const LeftIconOnClick = () => {
    router.push('/mywallet')
  }

  const RightButtonOnClick = () => {
  }
    
  const [getAllWalletsData, setGetAllWalletsData] = useState<any>([])
  const [getWalletNicknamesData, setGetWalletNicknamesData] = useState<any>({})
  const [refreshWalletData, setRefreshWalletData] = useState<number>(0)

  const [currentAddress, setCurrentAddress] = useState<string>("")
  

  useEffect(() => {

    const currentAddressTemp = getCurrentWalletAddress()
    setCurrentAddress(String(currentAddressTemp))

    const myTask = () => {
      setRefreshWalletData(refreshWalletData+1);
    };
    const intervalId = setInterval(myTask, 2 * 60 * 1000);
    
    return () => clearInterval(intervalId);

  }, []);

  useEffect(() => {
    setTitle(getWalletNicknamesData[currentAddress] ?? 'Wallet')
  }, [getWalletNicknamesData, currentAddress]);

  useEffect(() => {
    setGetAllWalletsData(getAllWallets())
    setGetWalletNicknamesData(getWalletNicknames())
  }, [refreshWalletData])


  const handleOpenWalletMenu = (wallet: any) => {
    setChooseWallet(wallet)
    const bottomMenusList: any[] = []
    bottomMenusList.push({icon: 'material-symbols:copy-all-outline', title: t('Copy Address'), function: 'handleWalletCopyAddress'})
    bottomMenusList.push({icon: 'material-symbols:edit-outline', title: t('Rename Wallet'), function: 'handleWalletRename'})
    bottomMenusList.push({icon: 'mdi:file-export-outline', title: t('Export Key'), function: 'handleWalletExportKey'})
    bottomMenusList.push({icon: 'material-symbols:delete-outline', title: t('Delete Wallet'), color: 'rgb(255, 76, 81)', function: 'handleWalletDelete'})
    setBottomMenus(bottomMenusList)
    setDrawerStatus(true)
  }

  const handleCreateWalletMenu = () => {
    const bottomMenusList: any[] = []
    bottomMenusList.push({icon: 'material-symbols:add', title: t('Add Wallet'), function: 'handleWalletCreate'})
    bottomMenusList.push({icon: 'material-symbols:download-sharp', title: t('Import Key'), function: 'handleWalletImportKey'})
    setBottomMenus(bottomMenusList)
    setDrawerStatus(true)
  }

  const handleWalletCreateMenu = () => {
    handleCreateWalletMenu()
  }


  const handleWalletCopyAddress = () => {
    console.log("handleWalletCopyAddress", chooseWallet.data.arweave.key)
    navigator.clipboard.writeText(chooseWallet.data.arweave.key);
    toast.success(t('Copied success') as string, { duration: 1000, position: 'top-center' })
  }

  return (
    <Fragment>
      <Header Hidden={HeaderHidden} LeftIcon={LeftIcon} LeftIconOnClick={LeftIconOnClick} Title={Title} RightButtonText={RightButtonText} RightButtonOnClick={RightButtonOnClick} RightButtonIcon={RightButtonIcon}/>

      <ContentWrapper
          className='layout-page-content'
          sx={{
              ...(contentHeightFixed && {
              overflow: 'hidden',
              '& > :first-of-type': { height: '100%' }
              })
          }}
          >
          
          {getAllWalletsData && pageModel == 'MainWallet' ?  
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{height: 'calc(100% - 35px)'}}>
                  <Grid container spacing={2}>
                    0000
                  </Grid>
              </Grid>
                    
              {model == 'Edit' && (
                <Box sx={{width: '100%', mr: 2}}>
                  <Button sx={{mt: 3, ml: 2}} fullWidth variant='contained' onClick={()=>handleWalletCreateMenu()}>
                    {t("Create Wallet")}
                  </Button>
                </Box>
              )}

              <Drawer
                anchor={'bottom'}
                open={drawerStatus}
                onClose={()=>setDrawerStatus(false)}
              >
                <Box
                  sx={{ width: 'auto' }}
                  role="presentation"
                  onClick={()=>setDrawerStatus(false)}
                  onKeyDown={()=>setDrawerStatus(false)}
                >
                  <List>
                    {bottomMenus.map((menu: any, index: number) => (
                      <ListItem key={index} disablePadding onClick={()=>{
                        switch(menu.function) {
                          case 'handleWalletCopyAddress':
                            handleWalletCopyAddress();
                            break;
                        }
                      }}>
                        <ListItemButton>
                          <ListItemIcon>
                            <Icon icon={menu.icon} fontSize={20} color={menu?.color && menu?.color != '' && 'rgb(255, 76, 81)'}/>
                          </ListItemIcon>
                          <ListItemText primary={menu.title} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Drawer>
            </Grid>
          :
            <Fragment></Fragment>
          }

          {pageModel == 'PinCode' && ( 
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <PinKeyboard />
              </Grid>
            </Grid>
          )}

      </ContentWrapper>

      <Footer Hidden={FooterHidden} />
    </Fragment>
  )
}

export default Wallet
