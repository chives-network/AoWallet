// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import Typography, { TypographyProps } from '@mui/material/Typography'
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

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

// ** MUI Imports
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import TextField2 from 'src/views/Layout/TextField2'
import { useRouter } from 'next/router'
import { useDropzone } from 'react-dropzone'

import { getAllWallets, getWalletBalance, setWalletNickname, getWalletNicknames, downloadTextFile, removePunctuation, deleteWalletByWallet, setCurrentWallet } from 'src/functions/ChivesWallets'
import { generateNewMnemonicAndGetWalletData, importWalletJsonFile, readFileText } from 'src/functions/ChivesWallets'

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

const MyWallet = () => {
  // ** Hook
  const { t } = useTranslation()
  const router = useRouter()

  const contentHeightFixed = {}
  
  const [model, setModel] = useState<string>('View')
  const [pageModel, setPageModel] = useState<string>('ListWallet')
  const [bottomMenus, setBottomMenus] = useState<any>([])
  const [HeaderHidden, setHeaderHidden] = useState<boolean>(false)
  const [FooterHidden, setFooterHidden] = useState<boolean>(false)
  const [LeftIcon, setLeftIcon] = useState<string>('material-symbols:menu-open')
  const [Title, setTitle] = useState<string>('My Wallet')
  const [RightButtonText, setRightButtonText] = useState<string>('Edit')
  const [drawerStatus, setDrawerStatus] = useState<boolean>(false)
  const [chooseWallet, setChooseWallet] = useState<any>(null)
  const [chooseWalletName, setChooseWalletName] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [importKeyValue, setImportKeyValue] = useState<string>("")
  

  const handleWalletGoHome = () => {
    setModel('View')
    setRefreshWalletData(refreshWalletData+1)
    setPageModel('ListWallet')
    setLeftIcon('material-symbols:menu-open')
    setTitle(t('My Wallet') as string)
    setRightButtonText(t('Edit') as string)
  }
  
  const LeftIconOnClick = () => {
    if(pageModel != 'ListWallet') {
      handleWalletGoHome()
    }
    else {
      router.push('/wallet')
    }
  }

  const RightButtonOnClick = () => {
    if(model == 'View')   {
      setModel('Edit')
      setRightButtonText(t('Finished') as string)
    }
    else {
      setModel('View')
      setRightButtonText(t('Edit') as string)
      setRefreshWalletData(refreshWalletData+1)
      setPageModel('ListWallet')
    }
  }
    
  const [walletBalanceMap, setWalletBalanceMap] = useState<any>({})
  const [getAllWalletsData, setGetAllWalletsData] = useState<any>([])
  const [getWalletNicknamesData, setGetWalletNicknamesData] = useState<any>({})
  const [open, setOpen] = useState<boolean>(false)
  const [refreshWalletData, setRefreshWalletData] = useState<number>(0)

  useEffect(() => {

    setHeaderHidden(false)
    setFooterHidden(false)

    const myTask = () => {
      setRefreshWalletData(refreshWalletData+1);
    };

    const intervalId = setInterval(myTask, 2 * 60 * 1000);
    
    return () => clearInterval(intervalId);

  }, []);

  useEffect(() => {
    setGetAllWalletsData(getAllWallets())
    setGetWalletNicknamesData(getWalletNicknames())
  }, [refreshWalletData])

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
    bottomMenusList.push({icon: 'mdi:code-json', title: t('Import Key'), function: 'handleWalletImportKey'})
    bottomMenusList.push({icon: 'material-symbols:download-sharp', title: t('Import Json File'), function: 'handleWalletImportJsonFile'})
    setBottomMenus(bottomMenusList)
    setDrawerStatus(true)
  }

  const handleSetCurrentWallet = (wallet: any) => {
    setCurrentWallet(wallet.data.arweave.key)
    router.push('/wallet')
  }

  const handleWalletCreateMenu = () => {
    handleCreateWalletMenu()
  }

  const handleWalletCreate = () => {
    setChooseWalletName('')
    setPageModel('CreateWallet')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle(t('Create Wallet') as string)
    setRightButtonText('')
  }

  const handleWalletImportKey = () => {
    setPageModel('ImportKey')
    setLeftIcon('mdi:code-json')
    setTitle(t('Import Key') as string)
    setRightButtonText('')
  }

  const handleWalletImportJsonFile = () => {
    setPageModel('ImportJsonFile')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle(t('Import Json File') as string)
    setRightButtonText('')
  }

  

  const handleWalletCreateWalletData = async () => {
    setIsLoading(true)
    const NewWalletData: any = await generateNewMnemonicAndGetWalletData("")
    console.log("NewWalletData", NewWalletData)
    if(NewWalletData) {
        setIsLoading(false)
        setWalletNickname(NewWalletData.data.arweave.key, chooseWalletName)
        handleWalletGoHome()
    }
  }

  const handleWalletImportKeyData = async () => {
    try {
      const ImportWallet = JSON.parse(importKeyValue)
      const IsExist = getAllWalletsData.filter((wallet: any) => wallet.jwk.n == ImportWallet.n)
      if(IsExist && IsExist.length > 0)  {
        setChooseWalletName('')
        setImportKeyValue('')
        handleWalletGoHome()
        toast.error(t('Wallet exist, not need import again') as string, { duration: 2500, position: 'top-center' })
      }
      else {
        const ImportJsonFileWalletAddress = await importWalletJsonFile(ImportWallet)
        if(ImportJsonFileWalletAddress && ImportJsonFileWalletAddress.length == 43) {
            setWalletNickname(ImportJsonFileWalletAddress, chooseWalletName)
            setChooseWalletName('')
            setImportKeyValue('')
            handleWalletGoHome()
        }
      }
    }
    catch(e: any) {
      console.log("handleWalletImportKeyData Error:", e)
    }
  }

  const handleWalletCopyAddress = () => {
    console.log("handleWalletCopyAddress", chooseWallet.data.arweave.key)
    navigator.clipboard.writeText(chooseWallet.data.arweave.key);
    toast.success(t('Copied success') as string, { duration: 1000, position: 'top-center' })
  }

  const handleWalletRename = () => {
    setPageModel('RenameWallet')
    console.log("handleWalletRename", chooseWallet)
    chooseWallet && setChooseWalletName(getWalletNicknamesData[chooseWallet.data.arweave.key] ?? 'My Wallet')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle(t('Rename Wallet') as string)
    setRightButtonText('')
  }

  const handleWalletRenameSave = () => {
    setWalletNickname(chooseWallet.data.arweave.key, chooseWalletName);
    console.log("chooseWalletName", chooseWalletName);
    setRefreshWalletData(refreshWalletData+1)
    handleWalletGoHome()
  };

  const handleWalletExportKeyShow = () => {
    console.log("handleWalletExportKeyShow", chooseWallet)
    setPageModel('ExportKeyShow')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle(t('Show Key') as string)
    setRightButtonText('')
  }

  const handleWalletExportKeyHidden = () => {
    console.log("handleWalletExportKeyHidden", chooseWallet)
    setPageModel('ExportKeyHidden')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle(t('Hidden Key') as string)
    setRightButtonText('')
  }

  const handleWalletDelete = async () => {
    console.log("handleWalletDelete", chooseWallet)
    setOpen(true);
    setPageModel('DeleteWallet')
  }

  const handleClickToExport = () => {
    const Address = chooseWallet.data.arweave.key
    const fileName = "chivesweave_keyfile_" + Address + "____" + removePunctuation(getWalletNicknamesData[Address]) + ".json";
    const mimeType = "text/plain";
    downloadTextFile(JSON.stringify(chooseWallet.jwk), fileName, mimeType);
  };

  const handleNoClose = () => {
    setOpen(false)
    setPageModel('ListWallet')
  }

  const handleYesClose = () => {
    setOpen(false)
    deleteWalletByWallet(chooseWallet.jwk)
    setRefreshWalletData(refreshWalletData+1)
    setPageModel('ListWallet')
  }

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.json']
    },
    onDrop: (acceptedFiles: File[]) => {
        acceptedFiles.map((file: File) => {
            handleImportWalletJsonFile(file)
        })
    }
  })
  
  const handleImportWalletJsonFile = async (file: File) => {
    const jsonFileContent: string = await readFileText(file)
    const ImportJsonFileWalletAddress = await importWalletJsonFile(JSON.parse(jsonFileContent))
    
    if(ImportJsonFileWalletAddress && ImportJsonFileWalletAddress.length == 43) {
        setWalletNickname(ImportJsonFileWalletAddress, ImportJsonFileWalletAddress.slice(0, 6))
        handleWalletGoHome()
        toast.success(t('Import Json Files Success') as string, { duration: 1000, position: 'top-center' })
    }
    else {      
      toast.error(t('Import Json Files Failed') as string, { duration: 2500, position: 'top-center' })
      handleWalletGoHome()
    }
  };

  const HeadingTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
    marginBottom: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(4)
    }
  }))

  const Img = styled('img')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
      marginRight: theme.spacing(15.75)
    },
    [theme.breakpoints.down('md')]: {
      marginBottom: theme.spacing(4)
    },
    [theme.breakpoints.down('sm')]: {
      width: 160
    }
  }))


  return (
    <Fragment>
      <Header Hidden={HeaderHidden} LeftIcon={LeftIcon} LeftIconOnClick={LeftIconOnClick} Title={Title} RightButtonText={RightButtonText} RightButtonOnClick={RightButtonOnClick} />

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

          {pageModel == 'DeleteWallet' ? 
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
                      {`${t(`Do you want delete this wallet`)}`} {chooseWallet.data.arweave.key} ?
                      </DialogContentText>
                  </DialogContent>
                  <DialogActions className='dialog-actions-dense'>
                      <Button onClick={handleNoClose} color="error" size='small' variant='contained' >{`${t(`No`)}`}</Button>
                      <Button onClick={handleYesClose} color="primary">{`${t(`Yes`)}`}</Button>
                  </DialogActions>
              </Dialog>
          </Fragment>
          :
          <Fragment></Fragment>
          }
          
          {getAllWalletsData && pageModel == 'ListWallet' ?  
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{height: 'calc(100%)'}}>
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
                              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>handleSetCurrentWallet(wallet)}
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
                              <Box textAlign="right">
                                {model == 'View' && (
                                  <Typography variant='h6' sx={{ 
                                    color: Number(walletBalanceMap[wallet.data.arweave.key]) > 0 ? 'info.dark' : 'secondary.dark',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    mr: 2
                                  }}>
                                    {Number(walletBalanceMap[wallet.data.arweave.key]) > 0 ? Number(walletBalanceMap[wallet.data.arweave.key]).toFixed(2) : '0'}
                                  </Typography>
                                )}
                                {model == 'Edit' && (
                                  <IconButton sx={{ p: 1 }} onClick={()=>handleOpenWalletMenu(wallet)}>
                                    <Icon icon='mdi:dots-vertical' fontSize={20} />
                                  </IconButton>
                                )}

                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                      )

                    })}

                    {model == 'Edit' && (
                      <Box sx={{width: '100%', mr: 2}}>
                        <Button sx={{mt: 5, ml: 2}} fullWidth variant='contained' onClick={()=>handleWalletCreateMenu()}>
                          {t("Create Wallet")}
                        </Button>
                      </Box>
                    )}

                  </Grid>
              </Grid>
                    
              

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
                          case 'handleWalletRename':
                            handleWalletRename();
                            break;
                          case 'handleWalletExportKey':
                            handleWalletExportKeyHidden();
                            break;
                          case 'handleWalletDelete':
                            handleWalletDelete();
                            break;
                          case 'handleWalletCreate':
                            handleWalletCreate();
                            break;
                          case 'handleWalletImportKey':
                            handleWalletImportKey();
                            break;
                          case 'handleWalletImportJsonFile':
                            handleWalletImportJsonFile();
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

          {pageModel == 'CreateWallet' && ( 
            <Grid container spacing={2}>

              {isLoading ? 
              <Fragment>
                <CardContent>
                    <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                <CircularProgress sx={{ ml: 5, mb: 4 }} />
                                <Typography sx={{ml: 5}}>{`${t(`Create a new wallet, please wait`)}`} ...</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
              </Fragment>
              :
              <Fragment>
                <Grid item xs={12} sx={{height: '100%'}}>
                  <Grid container spacing={2}>
                    <TextField
                      fullWidth
                      size='small'
                      value={chooseWalletName}
                      onChange={(e) => setChooseWalletName(e.target.value)}
                      placeholder={t('Wallet Name') as string}
                      sx={{ '& .MuiInputBase-root': { borderRadius: 1 } }}
                    />
                    <Box sx={{width: '100%', mt: 2}}>
                      <Button sx={{mt: 8}} disabled={chooseWalletName=='' ? true : false} fullWidth variant='contained' onClick={handleWalletCreateWalletData}>
                        {t("Create Wallet")}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Fragment>
              }

            </Grid>
          )}

          {pageModel == 'ImportKey' && ( 
            <Grid container spacing={2}>

              {isLoading ? 
              <Fragment>
                <CardContent>
                    <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                <CircularProgress sx={{ ml: 5, mb: 4 }} />
                                <Typography sx={{ml: 5}}>{`${t(`Create a new wallet, please wait`)}`} ...</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
              </Fragment>
              :
              <Fragment>
                <Grid item xs={12} sx={{height: 'calc(100%)'}}>
                  <Grid container spacing={2}>
                    <TextField
                      fullWidth
                      size='small'
                      value={chooseWalletName}
                      onChange={(e) => setChooseWalletName(e.target.value)}
                      placeholder={t('Wallet Name') as string}
                      sx={{ '& .MuiInputBase-root': { borderRadius: 1 } }}
                    />
                    <TextField
                      multiline
                      rows={8}
                      fullWidth
                      size='small'
                      value={importKeyValue}
                      onChange={(e) => setImportKeyValue(e.target.value)}
                      placeholder={t('Wallet Name') as string}
                      sx={{ '& .MuiInputBase-root': { borderRadius: 1 }, mt: 3 }}
                    />
                    <Box sx={{width: '100%', mr: 2}}>
                      <Button sx={{mt: 8, ml: 2}} disabled={chooseWalletName == '' || importKeyValue == '' ? true : false} fullWidth variant='contained' onClick={handleWalletImportKeyData}>
                        {t("Import Key")}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
                      
                
              </Fragment>
              }
              
              
            </Grid>
          )}

          {pageModel == 'ImportJsonFile' && ( 
            <Grid container spacing={2}>

              {isLoading ? 
              <Fragment>
                <CardContent>
                    <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                <CircularProgress sx={{ ml: 5, mb: 4 }} />
                                <Typography sx={{ml: 5}}>{`${t(`Create a new wallet, please wait`)}`} ...</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
              </Fragment>
              :
              <Fragment>
                <Grid item xs={12} sx={{height: 'calc(100%)'}}>
                  <Grid container spacing={2}>
                    <Box sx={{width: '100%', mr: 2}}>
                      <CardContent>
                        <Box {...getRootProps({ className: 'dropzone' })} sx={acceptedFiles.length ? {} : {}}>
                            <input {...getInputProps()} />
                            <Box sx={{ display: 'flex', flexDirection: ['column', 'column', 'row'], alignItems: 'center' }}>
                                <Img alt='Upload img' src='/images/misc/upload.png' />
                                <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: ['center', 'center', 'inherit'] }}>
                                    <HeadingTypography variant='h5'>{`${t(`Click to choose your json file`)}`}</HeadingTypography>
                                </Box>
                            </Box>
                        </Box>
                      </CardContent>
                    </Box>
                  </Grid>
                </Grid>
                      
              </Fragment>
              }
              
              
            </Grid>
          )}

          {pageModel == 'RenameWallet' && ( 
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{height: 'calc(100%)'}}>
                  <Grid container spacing={2}>
                  <TextField
                    fullWidth
                    size='small'
                    value={chooseWalletName}
                    onChange={(e) => setChooseWalletName(e.target.value)}
                    placeholder={t('My Wallet') as string}
                    sx={{ '& .MuiInputBase-root': { borderRadius: 5 } }}
                  />
                  <Box sx={{width: '100%', mr: 3}}>
                    <Button sx={{mt: 8, mx: 2}} fullWidth variant='contained' onClick={()=>handleWalletRenameSave()}>
                      {t("Save")}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
                    
            </Grid>
          )}

          {pageModel == 'ExportKeyHidden' && ( 
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'primary.main', height: '100%' }}>
                <Box
                  position="relative"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    sx={{
                      backdropFilter: 'blur(5px)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 1
                    }}
                  />
                  <TextField2
                      disabled
                      multiline
                      rows={8}
                      size="small"
                      sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                  />
                  </Box>
                  <Box display="flex" justifyContent="center" alignItems="center">
                    <Button
                      sx={{ mt: 5, width: '100px' }}
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(chooseWallet.jwk));
                      }}
                      disabled
                      startIcon={<Icon icon='mdi:pencil' />}
                    >
                      {t("Copy")}
                    </Button>
                  </Box>

                  <Card sx={{mt: 8}}>
                    <Typography sx={{my: 2, pl: 2, fontWeight: 600, color: 'warning.main', textDecoration: 'none'}}>{t('Never Share Your Recovery Phrase') as string}</Typography>
                    <Typography sx={{my: 2, pl: 2, color: 'text.secondary'}}>{t('Anyone with it has full control over your wallet. Our support team will never ask for it') as string}</Typography>
                  </Card>
                  <Button sx={{mt: 8}} fullWidth variant='contained' onClick={() => handleWalletExportKeyShow()}>
                    {t("Show")}
                  </Button>
                  
                </div>
              </Grid>
            </Grid>
          )}

          {pageModel == 'ExportKeyShow' && ( 
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <TextField2
                      multiline
                      rows={8}
                      size="small"
                      value={JSON.stringify(chooseWallet.jwk)}
                      sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                      placeholder={t("ChannelGroup") as string}
                  />
                  <Box display="flex" justifyContent="center" alignItems="center">
                    <Button
                      sx={{ mt: 5, width: '100px' }}
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(chooseWallet.jwk));
                      }}
                      startIcon={<Icon icon='mdi:pencil' />}
                    >
                      {t("Copy")}
                    </Button>
                    <Button
                      sx={{ ml: 3, mt: 5, width: '100px' }}
                      size="small"
                      variant="outlined"
                      onClick={() => handleClickToExport()}
                      startIcon={<Icon icon='mdi:pencil' />}
                    >
                      {t("Export")}
                    </Button>
                  </Box>

                  <Card sx={{mt: 8}}>
                    <Typography sx={{my: 2, pl: 2, fontWeight: 600, color: 'warning.main', textDecoration: 'none'}}>{t('Never Share Your Recovery Phrase') as string}</Typography>
                    <Typography sx={{my: 2, pl: 2, color: 'text.secondary'}}>{t('Anyone with it has full control over your wallet. Our support team will never ask for it') as string}</Typography>
                  </Card>
                  <Button sx={{mt: 8}} fullWidth variant='contained' onClick={() => handleWalletExportKeyHidden()}>
                    {t("Hidden")}
                  </Button>
                  
                </div>
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

export default MyWallet
