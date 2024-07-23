// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CustomAvatar from 'src/@core/components/mui/avatar'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import { getInitials } from 'src/@core/utils/get-initials'
import Slider from '@mui/material/Slider'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Tab from '@mui/material/Tab'

import { CallReceived, History, Casino, Send } from '@mui/icons-material';

import { QRCode } from 'react-qrcode-logo';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';

// ** MUI Imports
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import authConfig from 'src/configs/auth'
import { useTheme } from '@mui/material/styles'

import { getAllWallets, getWalletBalance, getWalletNicknames, getCurrentWalletAddress, getCurrentWallet, getPrice, sendAmount, getTxsInMemory, setChivesContacts, getChivesContacts, deleteChivesContacts, searchChivesContacts } from 'src/functions/ChivesWallets'
import { BalanceMinus, BalanceTimes } from 'src/functions/AoConnect/AoConnect'
import { GetArWalletAllTxs } from 'src/functions/Arweave'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { formatHash, formatTimestamp } from 'src/configs/functions'

import { styled } from '@mui/material/styles'
import Footer from '../Layout/Footer'
import Header from '../Layout/Header'
import PinKeyboard from '../Layout/PinKeyboard'
import { useRouter } from 'next/router'

import { createTheme, ThemeProvider } from '@mui/material';

import Tabs from '@mui/material/Tabs';

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

const Setting = () => {
  // ** Hook
  const { t } = useTranslation()
  const router = useRouter()
  const theme = useTheme()

  const contentHeightFixed = {}

  const [pageModel, setPageModel] = useState<string>('MainSetting')
  const [HeaderHidden, setHeaderHidden] = useState<boolean>(false)
  const [FooterHidden, setFooterHidden] = useState<boolean>(false)
  const [LeftIcon, setLeftIcon] = useState<string>('material-symbols:menu-rounded')
  const [Title, setTitle] = useState<string>('Wallet')
  const [RightButtonText, setRightButtonText] = useState<string>('')
  const [RightButtonIcon, setRightButtonIcon] = useState<string>('')

  const [contactName, setContactName] = useState<string>('')
  const [contactAddress, setContactAddress] = useState<string>('')
  const [contactsAll, setContactsAll] = useState<any>({})
  const [counter, setCounter] = useState<number>(0)
  const [searchContactkeyWord, setSearchContactkeyWord] = useState<string>('')

  const preventDefault = (e: any) => {
    e.preventDefault();
  };

  const disableScroll = () => {

    console.log("preventDefault", preventDefault)

    //document.body.style.overflow = 'hidden';
    //document.addEventListener('touchmove', preventDefault, { passive: false });
  };

  const enableScroll = () => {

    console.log("preventDefault", preventDefault)

    //document.body.style.overflow = '';
    //document.removeEventListener('touchmove', preventDefault);
  };

  useEffect(() => {
    
    disableScroll();

    return () => {
      
      enableScroll();
    };

  }, []);

  useEffect(() => {
    const contactsAll = getChivesContacts()
    setContactsAll(contactsAll)
  }, [counter]);


  const handleWalletGoHome = () => {
    setRefreshWalletData(refreshWalletData+1)
    setPageModel('MainSetting')
    setLeftIcon('material-symbols:menu-rounded')
    setTitle(t('Setting') as string)
    setRightButtonText(t('QR') as string)
  }
  
  const LeftIconOnClick = () => {
    switch(pageModel) {
      case 'MainSetting':
        handleWalletGoHome()
        break
      case 'Contacts':
        handleWalletGoHome()
        break
      case 'NewContact':
        handleClickContactsButton()
        break
    }
  }
  
  const RightButtonOnClick = () => {
    switch(pageModel) {
        case 'Contacts':
            handleClickNewContactButton()
          break
      }
  }
    
  const [refreshWalletData, setRefreshWalletData] = useState<number>(0)

  
  useEffect(() => {
    setHeaderHidden(false)
    setFooterHidden(false)
    setRightButtonIcon('')
  }, []);
  
  const handleContactSave = () => {
    if(contactAddress && contactAddress.length == 43) {
        setChivesContacts(contactAddress, contactName)
        handleClickContactsButton()
    }
  }
  
  const handleContactDelete = (Address: string) => {
    deleteChivesContacts(Address)
    handleClickContactsButton()
  }

  const handleClickContactsButton = () => {
    setCounter(counter + 1)
    setPageModel('Contacts')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle(t('Contacts') as string)
    setRightButtonText(t('') as string)
    setRightButtonIcon('mdi:add')
    setContactAddress('')
    setContactName('')
  }

  const handleClickNewContactButton = () => {
    setPageModel('NewContact')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle(t('New Contact') as string)
    setRightButtonText(t('') as string)
    setRightButtonIcon('')
    setContactAddress('')
    setContactName('')
  }

  const handleSelectContact = (Address: string, Name: string) => {
    setContactAddress(Address)
    setContactName(Name)
    setPageModel('NewContact')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle(t('Edit Conact') as string)
    setRightButtonText(t('') as string)
    setRightButtonIcon('')
  }

  const ContactData = [
      {name: '联系人1', address: 'M_XtWZkr1bSvwjZ6wEnXAKTnVErvRR__UAEWwdS8Xgs'},
      {name: '联系人2', address: 'mIZnYPDjIf5PlxE8nG3CALOU7-BngKJSc0N-Tit7cSM'},
      {name: '联系人3', address: 'xwA8HpOT9BI0iSKRDYTWhM7awHV6Xi_iTmtnGrAm4Xk'},
      {name: '联系人4', address: 'XrjRoNDx-WVhgK_xJfowYrTrzaFxabt7tGwjVpCf2yE'},
      {name: '联系人5', address: 'xPIvsc-poD6p_w63jHUNA-5i2l7iD-Fa1WP86_rhJjg'},
      {name: '联系人6', address: 'bVgbGVe8xoUMZUTotUs73Q35dgzqk65R8Dzauaj0WdU'},
      {name: '联系人7', address: 'IFVuoVlOzKnUbNZCOljFYXojP4fSIGhHp6bh8BSF9Dg'},
      {name: '联系人8', address: '72i2l5UJFwIb53gbUuiS9tKM-y1ooJnJFnyWltNEEBo'},
      {name: '联系人9', address: 'B7IT6nWYrkE7JDfSgIM_wiuRylP9W3Tagicl428m1gI'},
      {name: '联系人10', address: 'B7IT6nWYrkE7JDfSgIM_wiuRylP9W3Tagicl428m1gI'},
      {name: '联系人11', address: 'B7IT6nWYrkE7JDfSgIM_wiuRylP9W3Tagicl428m1gI'},
      {name: '联系人12', address: 'B7IT6nWYrkE7JDfSgIM_wiuRylP9W3Tagicl428m1gI'},
      {name: '联系人13', address: 'B7IT6nWYrkE7JDfSgIM_wiuRylP9W3Tagicl428m1gI'},
      {name: '联系人14', address: 'B7IT6nWYrkE7JDfSgIM_wiuRylP9W3Tagicl428m1gI'},
    ]

    const themeSlider = createTheme({
      components: {
        MuiSlider: {
          styleOverrides: {
            root: {
              color: theme.palette.primary.main,
            },
          },
        },
      },
    });

  return (
    <Fragment>
      <Header Hidden={HeaderHidden} LeftIcon={LeftIcon} LeftIconOnClick={LeftIconOnClick} Title={Title} RightButtonText={RightButtonText} RightButtonOnClick={RightButtonOnClick} RightButtonIcon={RightButtonIcon}/>

      <Box
        component="main"
        sx={{
          flex: 1,
          overflowY: 'auto',
          marginTop: '48px', // Adjust according to the height of the AppBar
          marginBottom: '56px', // Adjust according to the height of the Footer
        }}
      >
        <ContentWrapper
            className='layout-page-content'
            sx={{
                ...(contentHeightFixed && {
                overflow: 'hidden',
                '& > :first-of-type': { height: `calc(100% - 104px)` }
                })
            }}
            >
            
            {pageModel == 'MainSetting' && ( 
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{height: 'calc(100%)'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{ py: 1 }}>
                          <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                                <IconButton sx={{ p: 0 }} onClick={()=>null}>
                                    <Icon icon='oui:integration-general' fontSize={38} />
                                </IconButton>
                                <Box sx={{ ml: 2, display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>null}
                                    >
                                    <Typography sx={{ 
                                    color: 'text.primary',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    }}
                                    >
                                    {t('General') as string}
                                    </Typography>
                                    <Box sx={{ display: 'flex'}}>
                                    <Typography variant='body2' sx={{ 
                                        color: `secondary.primary`, 
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        flex: 1
                                    }}>
                                        {t('Edit language, currency and theme') as string}
                                    </Typography>
                                    </Box>
                                </Box>
                                <Box textAlign="right">
                                    <IconButton sx={{ p: 0 }} onClick={()=>null}>
                                        <Icon icon='mdi:chevron-right' fontSize={30} />
                                    </IconButton>
                                </Box>
                            </Box>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sx={{ py: 1 }}>
                          <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                              <IconButton sx={{ p: 0, ml: 1 }} onClick={()=>handleClickContactsButton()}>
                                <Icon icon='mdi:contact-mail-outline' fontSize={34} />
                              </IconButton>
                              <Box sx={{ ml: 2.5, display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>handleClickContactsButton()}
                                >
                                <Typography sx={{ 
                                  color: 'text.primary',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                                >
                                  {t('Contacts') as string}
                                </Typography>
                                <Box sx={{ display: 'flex'}}>
                                  <Typography variant='body2' sx={{ 
                                    color: `secondary.primary`, 
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    flex: 1
                                  }}>
                                    {t('Manage your contacts') as string}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box textAlign="right">
                                <IconButton sx={{ p: 0 }} onClick={()=>handleClickContactsButton()}>
                                    <Icon icon='mdi:chevron-right' fontSize={30} />
                                </IconButton>
                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sx={{ py: 1 }}>
                          <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                              <IconButton sx={{ p: 0, ml: 1 }} onClick={()=>null}>
                                <Icon icon='mdi:security-lock-outline' fontSize={34} />
                              </IconButton>
                              <Box sx={{ ml: 2.5, display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>null}
                                >
                                <Typography sx={{ 
                                  color: 'text.primary',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                                >
                                  {t('Security & Privacy') as string}
                                </Typography>
                                <Box sx={{ display: 'flex'}}>
                                  <Typography variant='body2' sx={{ 
                                    color: `secondary.primary`, 
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    flex: 1
                                  }}>
                                    {t('Management applications, etc') as string}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box textAlign="right">
                                <IconButton sx={{ p: 0 }} onClick={()=>null}>
                                    <Icon icon='mdi:chevron-right' fontSize={30} />
                                </IconButton>
                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sx={{ py: 1 }}>
                          <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                              <IconButton sx={{ p: 0, ml: 1 }} onClick={()=>null}>
                                <Icon icon='material-symbols:support-agent' fontSize={34} />
                              </IconButton>
                              <Box sx={{ ml: 2.5, display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>null}
                                >
                                <Typography sx={{ 
                                  color: 'text.primary',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                                >
                                  {t('Support') as string}
                                </Typography>
                                <Box sx={{ display: 'flex'}}>
                                  <Typography variant='body2' sx={{ 
                                    color: `secondary.primary`, 
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    flex: 1
                                  }}>
                                    {t('Contact our customer support') as string}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Card>
                        </Grid>

                    </Grid>

                </Grid>
              </Grid>
            )}

            {pageModel == 'Contacts' && ( 
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{height: 'calc(100%)'}}>
                    <Grid container spacing={2}>
                      <TextField
                        fullWidth
                        size='small'
                        value={searchContactkeyWord}
                        placeholder={t('Search Contact') as string}
                        sx={{ '& .MuiInputBase-root': { borderRadius: 2 }, mb: 3 }}
                        onChange={(e: any)=>{
                            setSearchContactkeyWord(e.target.value)
                            const searchChivesContactsData = searchChivesContacts(e.target.value)
                            setContactsAll(searchChivesContactsData)
                            console.log("e.target.value", e.target.value)
                        }}
                      />
                    </Grid>
                    <Grid container spacing={2}>
                    {Object.keys(contactsAll).map((Address: any, index: number) => {

                      return (
                        <Grid item xs={12} sx={{ py: 1 }} key={index}>
                          <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                              <CustomAvatar
                                skin='light'
                                color={'primary'}
                                sx={{ mr: 3, width: 38, height: 38, fontSize: '1.5rem' }}
                              >
                                {getInitials(Address).toUpperCase()}
                              </CustomAvatar>
                              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>handleSelectContact(Address, contactsAll[Address])}
                                >
                                <Typography sx={{ 
                                  color: 'text.primary',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                                >
                                  {contactsAll[Address]}
                                </Typography>
                                <Box sx={{ display: 'flex'}}>
                                  <Typography variant='body2' sx={{ 
                                    color: `primary.dark`, 
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    flex: 1
                                  }}>
                                    {formatHash(Address, 10)}
                                  </Typography>
                                  
                                </Box>
                              </Box>
                              <Box textAlign="right">
                                <IconButton sx={{ p: 0 }} onClick={()=>handleContactDelete(Address)}>
                                    <Icon icon='mdi:delete-outline' />
                                </IconButton>
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

            {pageModel == 'NewContact' && ( 
                <Grid container spacing={2}>
                    <Grid item xs={12} sx={{height: 'calc(100%)'}}>
                        <Grid container spacing={2}>
                            <TextField
                                fullWidth
                                size='small'
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                                placeholder={t('Contact Name') as string}
                                sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
                            />
                            <TextField
                                fullWidth
                                size='small'
                                value={contactAddress}
                                onChange={(e) => setContactAddress(e.target.value)}
                                placeholder={t('Contact Address') as string}
                                sx={{ mt: 3, '& .MuiInputBase-root': { borderRadius: 2 } }}
                            />
                            <Box sx={{width: '100%', mr: 3}}>
                                <Button sx={{mt: 8, mx: 2}} disabled={contactName != '' && contactAddress && contactAddress.length == 43 ? false : true} fullWidth variant='contained' onClick={()=>handleContactSave()}>
                                {t("Save")}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                        
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
      </Box>
      <Footer Hidden={FooterHidden} />
    </Fragment>
  )
}

export default Setting
