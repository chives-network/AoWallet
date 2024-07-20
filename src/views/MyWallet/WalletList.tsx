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

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import authConfig from 'src/configs/auth'

// ** MUI Imports
import Button from '@mui/material/Button'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import UploadWalletJsonFile from 'src/views/Wallet/UploadWalletJsonFile'

import { getAllWallets, getWalletBalance, setWalletNickname, getWalletNicknames, getWalletByAddress, downloadTextFile, removePunctuation, deleteWalletById, getCurrentWalletAddress } from 'src/functions/ChivesWallets'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { formatHash, formatAR } from 'src/configs/functions'

import { styled } from '@mui/material/styles'
import Footer from '../Layout/Footer'
import Header from '../Layout/Header'

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

const MyWallet = () => {
  // ** Hook
  const { t } = useTranslation()

  const contentHeightFixed = {}
  
  const [HeaderHidden, setHeaderHidden] = useState<boolean>(false)
  const [FooterHidden, setFooterHidden] = useState<boolean>(false)
  const [LeftIcon, setLeftIcon] = useState<string>('mdi:arrow-left-thin')
  const [Title, setTitle] = useState<string>('My Wallet')
  const [RightButtonText, setRightButtonText] = useState<string>('Edit')

  const LeftIconOnClick = () => {
    setLeftIcon('material-symbols:menu-rounded')
  }

  const RightButtonOnClick = () => {
    setLeftIcon('mdi:arrow-left-thin')
  }
    
  const [walletBalanceMap, setWalletBalanceMap] = useState<any>({})
  const [getAllWalletsData, setGetAllWalletsData] = useState<any>([])
  const [getWalletNicknamesData, setGetWalletNicknamesData] = useState<any>({})
  const [createWalletWindow, setCreateWalletWindow] = useState<boolean>(false)
  const [isDialog, setIsDialog] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [wantDeleteWalletId, setWantDeleteWalletId] = useState<string>("")
  const [wantDeleteWalletAddress, setWantDeleteWalletAddress] = useState<string>("")
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
    if(createWalletWindow == false) {
      setGetAllWalletsData(getAllWallets())
      setGetWalletNicknamesData(getWalletNicknames())
    }
  }, [createWalletWindow, refreshWalletData])

  useEffect(() => {
    const walletBalanceMapItem: any = {}
    const processWallets = async () => {
      await Promise.all(getAllWalletsData.map(async (wallet: any) => {
        const currentBalance = await getWalletBalance(wallet.data.arweave.key);
        walletBalanceMapItem[wallet.data.arweave.key] = currentBalance
      }));
      setWalletBalanceMap(walletBalanceMapItem)
    };  
    processWallets();
  }, [getAllWalletsData])

  const handleInputNicknameChange = (event: any, Address: string) => {
    setWalletNickname(Address, event.target.value as string);
    console.log("event", event.target.value);
    console.log("Address", Address);
  };

  const handleClickToExport = (event: any, Address: string) => {
    console.log("event", event.target.value);
    console.log("Address", Address);
    const fileName = "chivesweave_keyfile_" + Address + "____" + removePunctuation(getWalletNicknamesData[Address]) + ".json";
    const mimeType = "text/plain";
    downloadTextFile(JSON.stringify(getWalletByAddress(Address).jwk), fileName, mimeType);
  };

  const handleClickToDelete = (event: any, Address: string, WalletId: string) => {
    setWantDeleteWalletId(WalletId)
    setWantDeleteWalletAddress(Address)
    setIsDialog(true);
    setOpen(true);
  };

  const handleNoClose = () => {
    setOpen(false)
    setIsDialog(false)
  }

  const handleYesClose = () => {
    setOpen(false)
    setIsDialog(false)
    console.log("wantDeleteWalletId", wantDeleteWalletId)
    if(wantDeleteWalletId!=="" && wantDeleteWalletId!==undefined) {
      deleteWalletById(Number(wantDeleteWalletId))
    }
    setWantDeleteWalletId("")
    setWantDeleteWalletAddress("")
    setRefreshWalletData(refreshWalletData+1)
  }

  const handleRefreshWalletData = () => {
    setRefreshWalletData(refreshWalletData+1)
    setOpen(false)
    setIsDialog(false)
    setCreateWalletWindow(false)
  }

  return (
    <Fragment>
      <Header Hidden={HeaderHidden} LeftIcon={LeftIcon} LeftIconOnClick={LeftIconOnClick} Title={Title} RightButtonText={RightButtonText} RightButtonOnClick={RightButtonOnClick} />

      <ContentWrapper
          className='layout-page-content'
          sx={{
              ...(contentHeightFixed && {
              overflow: 'hidden',
              '& > :first-of-type': { height: '100%' }
              })
          }}
          >

          {isDialog == true ? 
          <Fragment>
              <Dialog
                  open={open}
                  disableEscapeKeyDown
                  aria-labelledby='alert-dialog-title'
                  aria-describedby='alert-dialog-description'
                  >
                  <DialogTitle id='alert-dialog-title'>{`${t(`Are you deleting your wallet?`)}`}</DialogTitle>
                  <DialogContent>
                      <DialogContentText id='alert-dialog-description'>
                      {`${t(`Once this wallet is deleted, it cannot be restored.`)}`}
                      {`${t(`Do you want delete this wallet`)}`} {wantDeleteWalletAddress} ?
                      </DialogContentText>
                  </DialogContent>
                  <DialogActions className='dialog-actions-dense'>
                      <Button onClick={handleNoClose} color="error" size='large' variant='contained' >{`${t(`No`)}`}</Button>
                      <Button onClick={handleYesClose} color="primary">{`${t(`Yes`)}`}</Button>
                  </DialogActions>
              </Dialog>
          </Fragment>
          :
          <Fragment></Fragment>
          }
          
          {getAllWalletsData && createWalletWindow == false ? 
            <Grid container spacing={2}>
              <Grid item xs={12}>
                  <Grid container spacing={2}>
                    {getAllWalletsData.map((wallet: any, index: number) => {

                      return (
                        <Grid item xs={12} sx={{ py: 0 }} key={index}>
                          <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1}}>
                              <CustomAvatar
                                skin='light'
                                color={'primary'}
                                sx={{ mr: 3, width: 38, height: 38, fontSize: '1.5rem' }}
                              >
                                {getInitials(wallet.data.arweave.key).toUpperCase()}
                              </CustomAvatar>
                              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}
                                >
                                <Typography sx={{ 
                                  color: 'text.primary',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                                >
                                  {getWalletNicknamesData[wallet.data.arweave.key] ?? 'My Wallet'}
                                </Typography>
                                <Box sx={{ display: 'flex'}}>
                                  <Typography variant='body2' sx={{ 
                                    color: `primary.dark`, 
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    flex: 1
                                  }}>
                                    {formatHash(wallet.data.arweave.key, 5)}
                                  </Typography>
                                  
                                </Box>
                              </Box>
                              <Box sx={{ }} textAlign="right">
                                <Typography variant='h6' sx={{ 
                                  color: `info.dark`,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  mr: 2
                                }}>
                                  {formatAR(walletBalanceMap[wallet.data.arweave.key] ?? 0, 2)}
                                </Typography>
                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                      )

                    })}
                  </Grid>
              </Grid>
            </Grid>
          :
            <Fragment></Fragment>
          }
          {createWalletWindow == true ? 
            <Grid container spacing={6}>
              
              <Grid item xs={12}>
                <Card>
                  <CardHeader title={`${t(`Create Wallet`)}`}
                              action={
                                <div>
                                  <Button size='small' variant='contained' onClick={() => setCreateWalletWindow(false)}>
                                  {`${t(`Wallet List`)}`}
                                  </Button>
                                </div>
                              }
                              />
                  <Divider sx={{ m: '0 !important' }} />
                  <UploadWalletJsonFile  handleRefreshWalletData={handleRefreshWalletData} />
                </Card>
              </Grid>
            </Grid>
          :
            <Fragment></Fragment>
          }
      </ContentWrapper>

      <Footer Hidden={FooterHidden} />
    </Fragment>
  )
}

export default MyWallet
