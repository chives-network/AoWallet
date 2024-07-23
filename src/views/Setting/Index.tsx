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
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'


// ** MUI Imports
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'

import { setChivesContacts, getChivesContacts, deleteChivesContacts, searchChivesContacts } from 'src/functions/ChivesWallets'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { formatHash } from 'src/configs/functions'

import { styled } from '@mui/material/styles'
import Footer from '../Layout/Footer'
import Header from '../Layout/Header'
import PinKeyboard from '../Layout/PinKeyboard'

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
  const [languageValue, setLanguageValue] = useState<string>('en')
  const [themeValue, setThemeValue] = useState<string>('light')
  const [currencyValue, setCurrencyValue] = useState<string>('us')
  const [networkValue, setNetworkValue] = useState<string>('mainnet')

  const LanguageArray = [
        {name:'English', value:'en'},
        {name:'Chinese', value:'zh-CN'},
        {name:'Korean', value:'Kr'},
        {name:'Russia', value:'Ru'}
  ]
  const themeArray = [
    {name:'Dark', value:'dark'},
    {name:'Light', value:'light'}
  ]
  const currencyArray = [
    {name:'United Status', value:'us'}
  ]
  const networkArray = [
    {name:'Main Network', value:'mainnet'}
  ]

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
      case 'General':
      case 'Contacts':
      case 'Security':
      case 'Support':
        handleWalletGoHome()
        break
      case 'NewContact':
        handleClickContactsButton()
        break
      case 'Language':
        handleClickGeneralButton()
        break
      case 'Theme':
        handleClickGeneralButton()
        break
      case 'Currency':
        handleClickGeneralButton()
        break
      case 'Network':
        handleClickGeneralButton()
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
    setSearchContactkeyWord('')
  }

  const handleClickGeneralButton = () => {
    setCounter(counter + 1)
    setPageModel('General')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle(t('General Setting') as string)
    setRightButtonText(t('') as string)
    setRightButtonIcon('')
  }

  const handleClickLanguageButton = () => {
    setCounter(counter + 1)
    setPageModel('Language')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle(t('Language') as string)
    setRightButtonText(t('') as string)
    setRightButtonIcon('')
  }

  const handleClickThemeButton = () => {
    setCounter(counter + 1)
    setPageModel('Theme')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle(t('Theme') as string)
    setRightButtonText(t('') as string)
    setRightButtonIcon('')
  }

  const handleClickCurrencyButton = () => {
    setCounter(counter + 1)
    setPageModel('Currency')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle(t('Currency') as string)
    setRightButtonText(t('') as string)
    setRightButtonIcon('')
  }

  const handleClickNetworkButton = () => {
    setCounter(counter + 1)
    setPageModel('Network')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle(t('Network') as string)
    setRightButtonText(t('') as string)
    setRightButtonIcon('')
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

  const handleSelectLanguage = (Language: string) => {
    setLanguageValue(Language)
    setTitle(Language)
  }

  const handleSelectTheme = (Theme: string) => {
    console.log("Theme", Theme)
    setThemeValue(Theme)
    setTitle(Theme)
  }

  const handleSelectCurrency = (Currency: string) => {
    setCurrencyValue(Currency)
    setTitle(Currency)
  }

  const handleSelectNetwork = (Network: string) => {
    setNetworkValue(Network)
    setTitle(Network)
  }

  


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
                                <IconButton sx={{ p: 0 }} onClick={()=>handleClickGeneralButton()}>
                                    <Icon icon='oui:integration-general' fontSize={38} />
                                </IconButton>
                                <Box sx={{ ml: 2, display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>handleClickGeneralButton()}
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
                                    <IconButton sx={{ p: 0 }} onClick={()=>handleClickGeneralButton()}>
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

            {pageModel == 'General' && ( 
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{height: 'calc(100%)'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{ py: 1 }}>
                          <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                                <IconButton sx={{ p: 0 }} onClick={()=>handleClickLanguageButton()}>
                                    <Icon icon='clarity:language-line' fontSize={38} />
                                </IconButton>
                                <Box sx={{ ml: 2, display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>handleClickLanguageButton()}
                                    >
                                    <Typography sx={{ 
                                    color: 'text.primary',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    }}
                                    >
                                    {t('Language') as string}
                                    </Typography>
                                    <Box sx={{ display: 'flex'}}>
                                    <Typography variant='body2' sx={{ 
                                        color: `secondary.primary`, 
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        flex: 1
                                    }}>
                                        {t('Language') as string}
                                    </Typography>
                                    </Box>
                                </Box>
                                <Box textAlign="right">
                                    <IconButton sx={{ p: 0 }} onClick={()=>handleClickLanguageButton()}>
                                        <Icon icon='mdi:chevron-right' fontSize={30} />
                                    </IconButton>
                                </Box>
                            </Box>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sx={{ py: 1 }}>
                          <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                              <IconButton sx={{ p: 0, ml: 1 }} onClick={()=>handleClickThemeButton()}>
                                <Icon icon='line-md:light-dark' fontSize={34} />
                              </IconButton>
                              <Box sx={{ ml: 2.5, display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>handleClickThemeButton()}
                                >
                                <Typography sx={{ 
                                  color: 'text.primary',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                                >
                                  {t('Theme') as string}
                                </Typography>
                                <Box sx={{ display: 'flex'}}>
                                  <Typography variant='body2' sx={{ 
                                    color: `secondary.primary`, 
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    flex: 1
                                  }}>
                                    {t('Theme') as string}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box textAlign="right">
                                <IconButton sx={{ p: 0 }} onClick={()=>handleClickThemeButton()}>
                                    <Icon icon='mdi:chevron-right' fontSize={30} />
                                </IconButton>
                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sx={{ py: 1 }}>
                          <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                              <IconButton sx={{ p: 0, ml: 1 }} onClick={()=>handleClickCurrencyButton()}>
                                <Icon icon='mdi:dollar' fontSize={34} />
                              </IconButton>
                              <Box sx={{ ml: 2.5, display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>handleClickCurrencyButton()}
                                >
                                <Typography sx={{ 
                                  color: 'text.primary',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                                >
                                  {t('Currency') as string}
                                </Typography>
                                <Box sx={{ display: 'flex'}}>
                                  <Typography variant='body2' sx={{ 
                                    color: `secondary.primary`, 
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    flex: 1
                                  }}>
                                    {t('Currency') as string}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box textAlign="right">
                                <IconButton sx={{ p: 0 }} onClick={()=>handleClickCurrencyButton()}>
                                    <Icon icon='mdi:chevron-right' fontSize={30} />
                                </IconButton>
                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sx={{ py: 1 }}>
                          <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                              <IconButton sx={{ p: 0, ml: 1 }} onClick={()=>handleClickNetworkButton()}>
                                <Icon icon='tabler:world-dollar' fontSize={34} />
                              </IconButton>
                              <Box sx={{ ml: 2.5, display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>handleClickNetworkButton()}
                                >
                                <Typography sx={{ 
                                  color: 'text.primary',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                                >
                                  {t('Network') as string}
                                </Typography>
                                <Box sx={{ display: 'flex'}}>
                                  <Typography variant='body2' sx={{ 
                                    color: `secondary.primary`, 
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    flex: 1
                                  }}>
                                    {t('Network') as string}
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

            {pageModel == 'Language' && (
                <Grid container spacing={2}>

                    <RadioGroup row value={'value'}  sx={{width: '100%'}} onClick={(e: any)=>e.target.value && handleSelectLanguage(e.target.value)}>
                        {LanguageArray.map((Language: any, index: number) => {

                            return (
                                <Grid item xs={12} sx={{ py: 1 }} key={index}>
                                    <Card sx={{ml: 2}}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', ml: 2 }} onClick={()=>handleSelectLanguage(Language.value)}>
                                                <Typography sx={{ color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', }} >
                                                    {Language.name}
                                                </Typography>
                                            </Box>
                                            <Box textAlign="right" sx={{m: 0, p: 0}}>
                                                <FormControlLabel value={Language.value} control={<Radio sx={{justifyContent: 'center', ml: 3, mr: 0}} checked={languageValue == Language.value}/>} label="" />
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>
                            )

                        })}
                    </RadioGroup>

                </Grid>
            )}

            {pageModel == 'Theme' && (
                <Grid container spacing={2}>

                    <RadioGroup row value={'value'}  sx={{width: '100%'}} onClick={(e: any)=>e.target.value && handleSelectTheme(e.target.value)}>
                        {themeArray.map((Theme: any, index: number) => {

                            return (
                                <Grid item xs={12} sx={{ py: 1 }} key={index}>
                                    <Card sx={{ml: 2}}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', ml: 2 }}  onClick={()=>handleSelectTheme(Theme.value)}>
                                                <Typography sx={{ color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', }} >
                                                    {Theme.name}
                                                </Typography>
                                            </Box>
                                            <Box textAlign="right" sx={{m: 0, p: 0}}>
                                                <FormControlLabel value={Theme.value} control={<Radio sx={{justifyContent: 'center', ml: 3, mr: 0}} checked={themeValue == Theme.value}/>} label="" />
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>
                            )

                        })}
                    </RadioGroup>

                </Grid>
            )}

            {pageModel == 'Currency' && (
                <Grid container spacing={2}>

                    <RadioGroup row value={'value'}  sx={{width: '100%'}} onClick={(e: any)=>e.target.value && handleSelectCurrency(e.target.value)}>
                        {currencyArray.map((Currency: any, index: number) => {

                            return (
                                <Grid item xs={12} sx={{ py: 1 }} key={index}>
                                    <Card sx={{ml: 2}}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', ml: 2 }} onClick={()=>handleSelectCurrency(Currency.value)} >
                                                <Typography sx={{ color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', }} >
                                                    {Currency.name}
                                                </Typography>
                                            </Box>
                                            <Box textAlign="right" sx={{m: 0, p: 0}}>
                                                <FormControlLabel value={Currency.value} control={<Radio sx={{justifyContent: 'center', ml: 3, mr: 0}} checked={currencyValue == Currency.value}/>} label="" />
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>
                            )

                        })}
                    </RadioGroup>

                </Grid>
            )}

            {pageModel == 'Network' && (
                <Grid container spacing={2}>

                    <RadioGroup row value={'value'}  sx={{width: '100%'}} onClick={(e: any)=>e.target.value && handleSelectNetwork(e.target.value)}>
                        {networkArray.map((Network: any, index: number) => {

                            return (
                                <Grid item xs={12} sx={{ py: 1 }} key={index}>
                                    <Card sx={{ml: 2}}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', ml: 2 }} onClick={()=>handleSelectNetwork(Network.value)} >
                                                <Typography sx={{ color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', }} >
                                                    {Network.name}
                                                </Typography>
                                            </Box>
                                            <Box textAlign="right" sx={{m: 0, p: 0}}>
                                                <FormControlLabel value={Network.value} control={<Radio sx={{justifyContent: 'center', ml: 3, mr: 0}} checked={networkValue == Network.value}/>} label="" />
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>
                            )

                        })}
                    </RadioGroup>

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
