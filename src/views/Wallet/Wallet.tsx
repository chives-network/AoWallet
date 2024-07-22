// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CustomAvatar from 'src/@core/components/mui/avatar'
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer'
import TextField from '@mui/material/TextField'
import { getInitials } from 'src/@core/utils/get-initials'

import { CallReceived, History, Casino, Send } from '@mui/icons-material';


import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { QRCode } from 'react-qrcode-logo';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';

// ** MUI Imports
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import authConfig from 'src/configs/auth'

import { getAllWallets, getWalletBalance, getWalletNicknames, getCurrentWalletAddress, getCurrentWallet } from 'src/functions/ChivesWallets'
import { GetArWalletAllTxs } from 'src/functions/Arweave'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { formatHash, formatTimestampAge } from 'src/configs/functions'

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

const preventDefault = (e: any) => {
  e.preventDefault();
};

const disableScroll = () => {
  document.body.style.overflow = 'hidden';
  document.addEventListener('touchmove', preventDefault, { passive: false });
};

const enableScroll = () => {
  document.body.style.overflow = '';
  document.removeEventListener('touchmove', preventDefault);
};

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
  const [currentWalletTxs, setCurrentWalletTxs] = useState<any>(null)

  const [sendMoneyAddress, setSendMoneyAddress] = useState<any>({name: '联系人1', address: 'B7IT6nWYrkE7JDfSgIM_wiuRylP9W3Tagicl428m1gI'})
  const [sendMoneyAmount, setSendMoneyAmount] = useState<string>('')


  useEffect(() => {
    
    disableScroll();

    return () => {
      
      enableScroll();
    };

  }, []);

  const handleWalletGoHome = () => {
    setModel('View')
    setRefreshWalletData(refreshWalletData+1)
    setPageModel('MainWallet')
    setLeftIcon('material-symbols:menu-rounded')
    setTitle(t('Wallet') as string)
    setRightButtonText(t('QR') as string)
  }
  
  const LeftIconOnClick = () => {
    switch(pageModel) {
      case 'ReceiveMoney':
        handleWalletGoHome()
        break
      case 'SendMoneySelectContact':
        handleWalletGoHome()
        break
      case 'SendMoneyInputAmount':
        handleWalletGoHome()
        break
      case 'MainWallet':
        router.push('/mywallet')
        break
    }
  }

  const RightButtonOnClick = () => {
    handleWalletGoHome()
  }
    
  const [getAllWalletsData, setGetAllWalletsData] = useState<any>([])
  const [getWalletNicknamesData, setGetWalletNicknamesData] = useState<any>({})
  const [refreshWalletData, setRefreshWalletData] = useState<number>(0)

  const [currentAddress, setCurrentAddress] = useState<string>("")
  const [currentBalance, setCurrentBalance] = useState<string>("")
  

  useEffect(() => {

    setHeaderHidden(false)
    setFooterHidden(false)
    setRightButtonIcon('mdi:qrcode')

    const currentAddressTemp = getCurrentWalletAddress()
    setCurrentAddress(String(currentAddressTemp))

    const getCurrentWalletTemp = getCurrentWallet()
    setChooseWallet(getCurrentWalletTemp)

    const myTask = () => {
      setRefreshWalletData(refreshWalletData+1);
    };
    const intervalId = setInterval(myTask, 2 * 60 * 1000);
    
    return () => clearInterval(intervalId);

  }, []);
  
  useEffect(() => {
    const processWallets = async () => {
      if(currentAddress && currentAddress.length == 43)  {
        const currentBalance = await getWalletBalance(currentAddress);
        setCurrentBalance(Number(currentBalance).toFixed(4))
        const allTxs = await GetArWalletAllTxs(currentAddress)
        if(allTxs)  {
          setCurrentWalletTxs(allTxs)
        }
      }
    };  
    processWallets();
  }, [currentAddress])

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
    
    handleOpenWalletMenu(null) // ----------------
  }

  const handleWalletCopyAddress = () => {
    navigator.clipboard.writeText(chooseWallet.data.arweave.key);
    toast.success(t('Copied success') as string, { duration: 1000, position: 'top-center' })
  }

  const handleAddressShare = () => {
    if (navigator.share) {
      navigator.share({
        title: t('Share Wallet Address') as string,
        text: `${t('Here is my wallet address') as string}: ${currentAddress}`,
        url: window.location.href,
      }).then(() => {
        console.log('Successful share');
      }).catch((error) => {
        console.log('Error sharing', error);
      });
    } else {
      console.log('Share not supported on this browser');
    }
  };

  const handleClickReceiveButton = () => {
    setPageModel('ReceiveMoney')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle(t('Receive') as string)
    setRightButtonText(t('') as string)
    setRightButtonIcon('')
  }

  const handleClickSendButton = () => {
    setPageModel('SendMoneySelectContact')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle(t('Select Contact') as string)
    setRightButtonText(t('') as string)
    setRightButtonIcon('')
  }

  const handleSelectAddress = (MoneyAddress: any) => {
    setSendMoneyAddress(MoneyAddress)
    setPageModel('SendMoneyInputAmount')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle(t('Input Amount') as string)
    setRightButtonText(t('') as string)
    setRightButtonIcon('')
  }

  const handleWalletSendMoney = () => {
    handleWalletGoHome()
  }

  const ContactData = [
      {name: '联系人1', address: 'B7IT6nWYrkE7JDfSgIM_wiuRylP9W3Tagicl428m1gI'},
      {name: '联系人2', address: '9P8x4T0GTOvDFnYRfDlBoD7n5mX_FdINkCXGzpXmTzs'},
      {name: '联系人3', address: 'xwA8HpOT9BI0iSKRDYTWhM7awHV6Xi_iTmtnGrAm4Xk'},
      {name: '联系人4', address: '7U5p0rXSgSPuNHtCCrfKNCEk-NtqMSwZe28xCWJV5QM'},
      {name: '联系人5', address: 'B7IT6nWYrkE7JDfSgIM_wiuRylP9W3Tagicl428m1gI'},
      {name: '联系人6', address: 'B7IT6nWYrkE7JDfSgIM_wiuRylP9W3Tagicl428m1gI'},
      {name: '联系人7', address: 'B7IT6nWYrkE7JDfSgIM_wiuRylP9W3Tagicl428m1gI'},
      {name: '联系人8', address: 'B7IT6nWYrkE7JDfSgIM_wiuRylP9W3Tagicl428m1gI'},
      {name: '联系人9', address: 'B7IT6nWYrkE7JDfSgIM_wiuRylP9W3Tagicl428m1gI'},
      {name: '联系人10', address: 'B7IT6nWYrkE7JDfSgIM_wiuRylP9W3Tagicl428m1gI'},
      {name: '联系人11', address: 'B7IT6nWYrkE7JDfSgIM_wiuRylP9W3Tagicl428m1gI'},
      {name: '联系人12', address: 'B7IT6nWYrkE7JDfSgIM_wiuRylP9W3Tagicl428m1gI'},
      {name: '联系人13', address: 'B7IT6nWYrkE7JDfSgIM_wiuRylP9W3Tagicl428m1gI'},
      {name: '联系人14', address: 'B7IT6nWYrkE7JDfSgIM_wiuRylP9W3Tagicl428m1gI'},
    ]


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
                  <Box p={2} textAlign="center" sx={{width: '100%'}}>
                    <CustomAvatar
                      skin='light'
                      color='primary'
                      sx={{ width: 60, height: 60, fontSize: '1.5rem', margin: 'auto' }}
                      src={'/images/logo/AR.png'}
                    >
                    </CustomAvatar>
                    <Typography variant="h5" mt={6}>
                      {currentBalance} {authConfig.tokenName}
                    </Typography>
                    <Typography variant="h6" mt={2}>
                      {formatHash(currentAddress, 6)}
                    </Typography>
                    <Grid container spacing={4} justifyContent="center" mt={2}>
                      <Grid item sx={{mx: 2}}>
                        <IconButton onClick={()=>handleClickReceiveButton()}>
                          <CallReceived />
                        </IconButton>
                        <Typography onClick={()=>handleClickReceiveButton()}>{t('Receive') as string}</Typography>
                      </Grid>
                      <Grid item sx={{mx: 2}}>
                        <IconButton>
                          <History />
                        </IconButton>
                        <Typography>{t('Txs') as string}</Typography>
                      </Grid>
                      <Grid item sx={{mx: 2}}>
                        <IconButton>
                          <Casino />
                        </IconButton>
                        <Typography>{t('Lottery') as string}</Typography>
                      </Grid>
                      <Grid item sx={{mx: 2}}>
                        <IconButton onClick={()=>handleClickSendButton()}>
                          <Send />
                        </IconButton>
                        <Typography onClick={()=>handleClickSendButton()}>{t('Send') as string}</Typography>
                      </Grid>
                    </Grid>

                    <Fragment>
                      <Grid container spacing={2} sx={{mt: 4}}>

                        <Grid item xs={12} sx={{ py: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1}}>
                              {t('My Assets') as string}
                            </Box>
                        </Grid>

                        <Grid item xs={12} sx={{ py: 0 }}>
                          <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1}}>
                              <CustomAvatar
                                skin='light'
                                color={'primary'}
                                sx={{ mr: 0, width: 43, height: 43 }}
                                src={'/images/logo/AO.png'}
                              >
                              </CustomAvatar>
                              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', ml: 1.5 }}>
                                <Typography 
                                  sx={{ 
                                    color: 'text.primary',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    textAlign: 'left'
                                  }}
                                >
                                  {formatHash(currentAddress, 8)}
                                </Typography>
                                <Box sx={{ display: 'flex' }}>
                                  <Typography 
                                    variant='body2' 
                                    sx={{ 
                                      color: `primary.dark`, 
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      flex: 1,
                                      textAlign: 'left'
                                    }}
                                  >
                                    {currentBalance}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box textAlign="right">
                                {model == 'View' && (
                                  <Typography variant='h6' sx={{ 
                                    color: `info.dark`,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    mr: 2
                                  }}>
                                    {currentBalance}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </Card>
                        </Grid>

                        <Grid item xs={12} sx={{ py: 0 }}>
                          <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1}}>
                              <CustomAvatar
                                skin='light'
                                color={'primary'}
                                sx={{ mr: 0, width: 43, height: 43 }}
                                src={'/images/logo/AO.png'}
                              >
                              </CustomAvatar>
                              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', ml: 1.5 }}>
                                <Typography 
                                  sx={{ 
                                    color: 'text.primary',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    textAlign: 'left'
                                  }}
                                >
                                  {formatHash(currentAddress, 8)}
                                </Typography>
                                <Box sx={{ display: 'flex' }}>
                                  <Typography 
                                    variant='body2' 
                                    sx={{ 
                                      color: `primary.dark`, 
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      flex: 1,
                                      textAlign: 'left'
                                    }}
                                  >
                                    {currentBalance}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box textAlign="right">
                                {model == 'View' && (
                                  <Typography variant='h6' sx={{ 
                                    color: `info.dark`,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    mr: 2
                                  }}>
                                    {currentBalance}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </Card>
                        </Grid>

                        {currentWalletTxs && false && currentWalletTxs.edges.map((Tx: any, index: number) => {

                          return (
                            <Grid item xs={12} sx={{ py: 0 }} key={index}>
                              <Card>
                                <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1}}>
                                <CustomAvatar
                                  skin='light'
                                  color={'primary'}
                                  sx={{ mr: 0, width: 43, height: 43 }}
                                  src={'/images/logo/AO.png'}
                                >
                                </CustomAvatar>
                                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', ml: 1.5 }}>
                                    <Typography 
                                      sx={{ 
                                        color: 'text.primary',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        textAlign: 'left'
                                      }}
                                    >
                                      {formatHash(Tx.node.recipient, 10)}
                                    </Typography>
                                    <Box sx={{ display: 'flex' }}>
                                      <Typography 
                                        variant='body2' 
                                        sx={{ 
                                          color: `primary.dark`, 
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                          flex: 1,
                                          textAlign: 'left'
                                        }}
                                      >
                                        {formatTimestampAge(Tx.node.block.timestamp)}
                                      </Typography>
                                    </Box>
                                  </Box>

                                  <Box textAlign="right">
                                    {model == 'View' && (
                                      <Typography variant='h6' sx={{ 
                                        color: `info.dark`,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        mr: 2
                                      }}>
                                        {Number(Tx.node.fee.ar).toFixed(2)}
                                      </Typography>
                                    )}

                                  </Box>
                                </Box>
                              </Card>
                            </Grid>
                          )
                        })}

                        <Grid item xs={12} sx={{ py: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1 }}>
                            <Button sx={{ textTransform: 'none', mt: 3, ml: 2 }} variant='text' startIcon={<Icon icon='mdi:add' />} onClick={() => { 
                              // 处理点击事件
                            }}>
                              {t('Add Assets') as string}
                            </Button>
                          </Box>
                        </Grid>


                      </Grid>
                    </Fragment>

                  </Box>
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

          {pageModel == 'ReceiveMoney' && ( 
            <Grid container direction="column" alignItems="center" justifyContent="center" spacing={2} sx={{ minHeight: '100%', p: 2 }}>
              <Grid item>
                <QRCode value={currentAddress} size={150} />
              </Grid>
              <Grid item>
                <Typography variant="body1" sx={{mt: 1, wordWrap: 'break-word', wordBreak: 'break-all', textAlign: 'center', maxWidth: '100%', fontSize: '0.8125rem !important' }}>
                  {currentAddress}
                </Typography>
              </Grid>
              <Grid item>
                <Button variant="outlined" sx={{mt: 3}} startIcon={<ContentCopyIcon />} onClick={()=>handleWalletCopyAddress()}>
                  {t('Copy') as string}
                </Button>
              </Grid>
              <Grid item sx={{ mt: 'auto', width: '100%' }}>
                <Button variant="contained" startIcon={<ShareIcon />} fullWidth onClick={()=>handleAddressShare()}>
                {t('Share') as string}
                </Button>
              </Grid>
            </Grid>
          )}

          {pageModel == 'SendMoneySelectContact' && ( 
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{height: 'calc(100% - 35px)'}}>
                  <Grid container spacing={2}>
                    <TextField
                      fullWidth
                      size='small'
                      value={""}
                      placeholder={t('Search or Input Address') as string}
                      sx={{ '& .MuiInputBase-root': { borderRadius: 5 }, mb: 3 }}
                    />
                  </Grid>
                  <Grid container spacing={2}>
                  {ContactData.map((contact: any, index: number) => {

                    return (
                      <Grid item xs={12} sx={{ py: 1 }} key={index}>
                        <Card>
                          <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                            <CustomAvatar
                              skin='light'
                              color={'primary'}
                              sx={{ mr: 3, width: 38, height: 38, fontSize: '1.5rem' }}
                            >
                              {getInitials(contact.address).toUpperCase()}
                            </CustomAvatar>
                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>handleSelectAddress(contact)}
                              >
                              <Typography sx={{ 
                                color: 'text.primary',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                              >
                                {contact.name}
                              </Typography>
                              <Box sx={{ display: 'flex'}}>
                                <Typography variant='body2' sx={{ 
                                  color: `primary.dark`, 
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  flex: 1
                                }}>
                                  {formatHash(contact.address, 10)}
                                </Typography>
                                
                              </Box>
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                    )

                  })}
                  </Grid>

              </Grid>
            </Grid>
          )}

          {pageModel == 'SendMoneyInputAmount' && sendMoneyAddress && ( 
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{height: 'calc(100% - 35px)'}}>
                  <Grid item xs={12} sx={{ py: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', px: 0}}>
                        <CustomAvatar
                          skin='light'
                          color={'primary'}
                          sx={{ mr: 2, width: 38, height: 38, fontSize: '1.5rem' }}
                        >
                          {getInitials(sendMoneyAddress.address).toUpperCase()}
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
                            {sendMoneyAddress.name}
                          </Typography>
                          <Box sx={{ display: 'flex'}}>
                            <Typography variant='body2' sx={{ 
                              color: `primary.dark`, 
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              flex: 1
                            }}>
                              {formatHash(sendMoneyAddress.address, 10)}
                            </Typography>
                            
                          </Box>
                        </Box>
                      </Box>
                  </Grid>
                  <Grid item xs={12} sx={{ py: 1 }}>
                    <TextField
                      fullWidth
                      size='small'
                      value={sendMoneyAmount}
                      onChange={(e) => {
                        const value = e.target.value;
                        const regex = /^[0-9]*\.?[0-9]*$/;
                        if (regex.test(value)) {
                          setSendMoneyAmount(value);
                        }
                      }}
                      placeholder={t('Amount') as string}
                      sx={{ '& .MuiInputBase-root': { borderRadius: 5 }, mt: 2 }}
                    />
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1.2, ml: 3 }}>
                      {t('Max')}: {currentBalance} {authConfig.tokenName}
                    </Typography>
                </Grid>
              </Grid>
                    
              <Box sx={{width: '100%', mr: 2}}>
                <Button sx={{mt: 3, ml: 2}} fullWidth disabled={Number(sendMoneyAmount) > 0 && Number(sendMoneyAmount) < Number(currentBalance) ? false : true} variant='contained' onClick={()=>handleWalletSendMoney()}>
                  {t("Send")}
                </Button>
              </Box>
              
            </Grid>
          )}

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
