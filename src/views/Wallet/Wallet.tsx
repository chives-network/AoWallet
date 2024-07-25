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

import { getAllWallets, getWalletBalance, getWalletNicknames, getCurrentWalletAddress, getCurrentWallet, getPrice, sendAmount, getTxsInMemory, getWalletBalanceReservedRewards, getXweWalletAllTxs, getChivesContacts, searchChivesContacts, setMyAoTokens, getMyAoTokens, getAllAoTokens, setAllAoTokens, deleteMyAoToken, addMyAoToken } from 'src/functions/ChivesWallets'
import { BalanceMinus, BalanceTimes, FormatBalance } from 'src/functions/AoConnect/AoConnect'

import { ChivesServerDataGetTokens } from 'src/functions/AoConnect/ChivesServerData'
import { GetAppAvatar } from 'src/functions/AoConnect/MsgReminder'

import { AoTokenBalanceDryRun } from 'src/functions/AoConnect/Token'

import { MyProcessTxIdsGetTokens, MyProcessTxIdsAddToken, MyProcessTxIdsDelToken } from 'src/functions/AoConnect/MyProcessTxIds'

import { GetArWalletAllTxs } from 'src/functions/Arweave'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { formatHash, formatTimestamp } from 'src/configs/functions'

import { styled } from '@mui/material/styles'
import Footer from '../Layout/Footer'
import Header from '../Layout/Header'
import PinKeyboard from '../Layout/PinKeyboard'
import ArWallet from './ArWallet'
import AoToken from './AoToken'

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

const Wallet = () => {
  // ** Hook
  const { t } = useTranslation()
  const router = useRouter()
  const theme = useTheme()

  const contentHeightFixed = {}

  const [pageModel, setPageModel] = useState<string>('MainWallet')
  const [HeaderHidden, setHeaderHidden] = useState<boolean>(false)
  const [FooterHidden, setFooterHidden] = useState<boolean>(false)
  const [LeftIcon, setLeftIcon] = useState<string>('material-symbols:menu-rounded')
  const [Title, setTitle] = useState<string>('Wallet')
  const [RightButtonText, setRightButtonText] = useState<string>('Edit')
  const [RightButtonIcon, setRightButtonIcon] = useState<string>('mdi:qrcode')
  const [chooseWallet, setChooseWallet] = useState<any>(null)
  const [chooseToken, setChooseToken] = useState<any>(null)
  const [searchContactkeyWord, setSearchContactkeyWord] = useState<string>('')
  const [contactsAll, setContactsAll] = useState<any>({})
  const [currentWalletTxs, setCurrentWalletTxs] = useState<any>(null)
  const [currentWalletTxsCursor, setCurrentWalletTxsCursor] = useState<any>({})
  const [currentWalletTxsHasNextPage, setCurrentWalletTxsHasNextPage] = useState<any>({'Sent': true, 'Received': true, 'AllTxs': true})

  const [mySavingTokensData, setMySavingTokensData] = useState<any[]>([])
  const [allTokensData, setAllTokensData] = useState<any[]>([])

  const [sendMoneyAddress, setSendMoneyAddress] = useState<any>({name: '', address: ''})
  const [sendMoneyAmount, setSendMoneyAmount] = useState<string>('')

  const [activeTab, setActiveTab] = useState<string>('Sent')

  const handleChangeActiveTab = (event: any, value: string) => {
    setActiveTab(value)
    console.log("handleChangeActiveTab", event)
  }

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

  const handleWalletGoHome = () => {
    setRefreshWalletData(refreshWalletData+1)
    setPageModel('MainWallet')
    setLeftIcon('material-symbols:menu-rounded')
    setTitle(t('Wallet') as string)
    setRightButtonText(t('QR') as string)
  }
  
  const LeftIconOnClick = () => {
    switch(pageModel) {
      case 'ReceiveMoney':
      case 'AllTxs':
      case 'SendMoneySelectContact':
      case 'SendMoneyInputAmount':
      case 'ManageAssets':
      case 'ViewToken':
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
  const [currentBalanceReservedRewards, setCurrentBalanceReservedRewards] = useState<string>("")
  const [currentTxsInMemory, setCurrentTxsInMemory] = useState<any>({})
  const [currentFee, setCurrentFee] = useState<number>(0)
  const [currentAoBalance, setCurrentAoBalance] = useState<string>("")
  const [myAoTokensBalance, setMyAoTokensBalance] = useState<any>({})
  
  
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [uploadingButton, setUploadingButton] = useState<string>(`${t('Send')}`)
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)

  

  
  
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
    const contactsAll = getChivesContacts()
    setContactsAll(contactsAll)
  }, []);

  const [page, setPage] = useState<number>(0)
  const [innerHeight, setInnerHeight] = useState<number | string>(0)

  useEffect(() => {
    const handleResize = () => {
      setInnerHeight(window.innerHeight);
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight;

      console.log("documentHeight", documentHeight);
      console.log("innerHeight", innerHeight);
      console.log("scrollY", scrollY);
      console.log("page", page);

      if (scrollY + windowHeight >= documentHeight) {
        setPage(prevPage => {

          return prevPage + 1;
        });
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    // 初始设置 innerHeight
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [innerHeight, page]);

  useEffect(() => {
    const processWallets = async () => {
      if(currentAddress && currentAddress.length == 43 && pageModel == 'MainWallet' && page == 0)  {
        
        if(authConfig.tokenType == "XWE")  {
          const currentBalanceTemp = await getWalletBalance(currentAddress);
          if(currentBalanceTemp) {
            setCurrentBalance(Number(currentBalanceTemp).toFixed(4))
          }

          const getTxsInMemoryData = await getTxsInMemory()
          setCurrentTxsInMemory(getTxsInMemoryData)
          const balanceReservedRewards = await getWalletBalanceReservedRewards(currentAddress)
          if(balanceReservedRewards) {
            setCurrentBalanceReservedRewards(balanceReservedRewards)
          }

          if(currentTxsInMemory && currentTxsInMemory['send'] && currentTxsInMemory['send'][currentAddress])  {
            const MinusBalance = BalanceMinus(Number(currentBalanceTemp) , Number(currentTxsInMemory['send'][currentAddress]))
            setCurrentBalance(Number(MinusBalance).toFixed(4))
          }

        }

        if(authConfig.tokenType == "AR")  {

          handleGetMySavingTokensData()

          const currentBalanceTemp = await getWalletBalance(currentAddress);
          if(currentBalanceTemp) {
            setCurrentBalance(Number(currentBalanceTemp).toFixed(4))
          }

          const AoTokenBalanceDryRunData = await AoTokenBalanceDryRun(authConfig.AoTokenProcessTxId, String(currentAddress))
          setCurrentAoBalance(FormatBalance(AoTokenBalanceDryRunData, 12))
          
        }

      }
      
      if(currentAddress && currentAddress.length == 43 && pageModel == 'AllTxs' && currentWalletTxsHasNextPage[activeTab] == true)  {
        if(authConfig.tokenType == "AR")  {
          setIsDisabledButton(true)
          const allTxs = await GetArWalletAllTxs(currentAddress, activeTab, currentWalletTxsCursor)
          if(allTxs)  {
            const currentWalletTxsCursorTemp = currentWalletTxsCursor
            if(allTxs['Sent'])  {
              currentWalletTxsCursorTemp['Sent'] = allTxs['Sent']
            }
            if(allTxs['Received'])  {
              currentWalletTxsCursorTemp['Received'] = allTxs['Received']
            }
            setCurrentWalletTxsCursor(currentWalletTxsCursorTemp)
            console.log("currentWalletTxs", currentWalletTxs)
            console.log("allTxs", allTxs)
            if(allTxs['data'])  {
              const currentWalletTxsTemp = { ...currentWalletTxs };
              if (!currentWalletTxsTemp[activeTab]) {
                  currentWalletTxsTemp[activeTab] = [];
              }
              currentWalletTxsTemp[activeTab] = [...currentWalletTxsTemp[activeTab], ...allTxs['data']];
              setCurrentWalletTxs(currentWalletTxsTemp);
            }
            if(allTxs['data'] && allTxs['data']['pageInfo'] && allTxs['data']['pageInfo']['hasNextPage'] == false)  {
              setCurrentWalletTxsHasNextPage((prevData: any)=>({
                ...prevData,
                [activeTab]: false
              }))
            }
          }
          setIsDisabledButton(false)
        }
        if(authConfig.tokenType == "XWE")  {
          setIsDisabledButton(true)
          const allTxs = await getXweWalletAllTxs(currentAddress, activeTab, 0, 150)
          if(allTxs)  {
            setCurrentWalletTxs(allTxs)
          }
          setIsDisabledButton(false)
        }
      }

    };
    processWallets();
  }, [currentAddress, pageModel, activeTab, page])

  useEffect(() => {
    setTitle(getWalletNicknamesData[currentAddress] ?? 'Wallet')
  }, [getWalletNicknamesData, currentAddress]);

  useEffect(() => {
    setGetAllWalletsData(getAllWallets())
    setGetWalletNicknamesData(getWalletNicknames())
  }, [refreshWalletData])

  useEffect(() => {
    if(pageModel == "SendMoneyInputAmount") {
      const getPriceDataFunction = async () => {
        try {
          const getPriceData = await getPrice(50)
          setCurrentFee(Number(getPriceData))
        } catch (error) {
          console.error('SendMoneyInputAmount Error:', error);
        }
      }
      getPriceDataFunction()
    }
    if(pageModel == "ManageAssets") {
      
      //handleGetServerData()
    }
  }, [pageModel])

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
  }

  const handleClickReceiveButton = () => {
    setPageModel('ReceiveMoney')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle(t('Receive') as string)
    setRightButtonText(t('') as string)
    setRightButtonIcon('')
  }

  const handleClickAllTxsButton = () => {
    setPageModel('AllTxs')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle(t('Wallet Txs') as string)
    setRightButtonText(t('') as string)
    setRightButtonIcon('')
    setCurrentWalletTxsCursor({})
    setCurrentWalletTxs(null)
    setPage(0)
    setCurrentWalletTxsHasNextPage({'Sent': true, 'Received': true, 'AllTxs': true})
  }

  const handleClickSendButton = () => {
    setPageModel('SendMoneySelectContact')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle(t('Select Contact') as string)
    setRightButtonText(t('') as string)
    setRightButtonIcon('')
    setSendMoneyAddress(null)
  }

  const handleClickManageAssetsButton = () => {
    setPageModel('ManageAssets')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle(t('Manage Assets') as string)
    setRightButtonText(t('') as string)
    setRightButtonIcon('mdi:add')
  }

  const handleClickViewTokenButton = (Token: any) => {
    setPageModel('ViewToken')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle(t('View Asset') as string)
    setRightButtonText(t('') as string)
    setRightButtonIcon('')
    setChooseToken(Token)
    setPage(0)
  }


  const handleSelectAddress = (MoneyAddress: any) => {
    setSendMoneyAddress(MoneyAddress)
    setPageModel('SendMoneyInputAmount')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle(t('Input Amount') as string)
    setRightButtonText(t('') as string)
    setRightButtonIcon('')
    setSendMoneyAmount('')
  }

  const handleWalletSendMoney = async () => {
    setIsDisabledButton(true)
    setUploadingButton(`${t('Submitting...')}`)
    const TxResult: any = await sendAmount(chooseWallet, sendMoneyAddress.address, String(sendMoneyAmount), [], 'inputData', "SubmitStatus", setUploadProgress);
    if(TxResult && TxResult.status == 800) {
      toast.error(TxResult.statusText, { duration: 2500 })
    }
    if(TxResult && TxResult.signature)  {
      toast.success(t("Successful Sent") as string, { duration: 2500 })
    }
    setIsDisabledButton(false)
    setUploadingButton(`${t('Send')}`)
    setSendMoneyAmount('')
    handleWalletGoHome()
    console.log("uploadProgress", uploadProgress)
  }

  const handleSelectTokenAndSave = async (Token: any, TokenData: any) => {
    setIsDisabledButton(true)
    const WantToSaveTokenProcessTxIdData = await MyProcessTxIdsAddToken(chooseWallet.jwk, authConfig.AoConnectMyProcessTxIds, Token.TokenId, '100', TokenData.Name, JSON.stringify(TokenData) )
    setIsDisabledButton(false)
    if(WantToSaveTokenProcessTxIdData?.msg?.Messages[0]?.Data)  {
      toast.success(t(WantToSaveTokenProcessTxIdData?.msg?.Messages[0]?.Data) as string, { duration: 2500, position: 'top-center' })
      addMyAoToken(currentAddress, Token)
      const getMyAoTokensData = getMyAoTokens(currentAddress)
      if(getMyAoTokensData) {      
        setMySavingTokensData(getMyAoTokensData)
      }
    }
    console.log("WantToSaveTokenProcessTxIdData", WantToSaveTokenProcessTxIdData)
  }

  const handleSelectDeleteMyToken = async (TokenId: string) => {
    setIsDisabledButton(true)
    const WantToDeleteTokenProcessTxIdData = await MyProcessTxIdsDelToken(chooseWallet.jwk, authConfig.AoConnectMyProcessTxIds, TokenId)
    setIsDisabledButton(false)
    if(WantToDeleteTokenProcessTxIdData?.msg?.Messages[0]?.Data)  {
      toast.success(t(WantToDeleteTokenProcessTxIdData?.msg?.Messages[0]?.Data) as string, { duration: 2500, position: 'top-center' })
      deleteMyAoToken(currentAddress, TokenId)
      const getMyAoTokensData = getMyAoTokens(currentAddress)
      if(getMyAoTokensData) {      
        setMySavingTokensData(getMyAoTokensData)
      }
    }
    console.log("WantToDeleteTokenProcessTxIdData", WantToDeleteTokenProcessTxIdData)
  }

  const handleGetMySavingTokensData = async () => {
    const getMyAoTokensData = getMyAoTokens(currentAddress)
    if(getMyAoTokensData) {      
      setMySavingTokensData(getMyAoTokensData)
    }

    try {
      const MyProcessTxIdsGetTokensData = await MyProcessTxIdsGetTokens(authConfig.AoConnectMyProcessTxIds, currentAddress);
      if (MyProcessTxIdsGetTokensData) {
          const dataArray = Object.values(MyProcessTxIdsGetTokensData);
          dataArray.sort((a: any, b: any) => {
              if (a.TokenGroup == b.TokenGroup) {
                  return Number(a.TokenSort) - Number(b.TokenSort);
              } else {
                  return a.TokenGroup.localeCompare(b.TokenGroup);
              }
          });
          const dataArrayFilter = dataArray.map((Token: any)=>({...Token, TokenData: Token.TokenData.replace(/\\"/g, '"')}))
          setMyAoTokens(currentAddress, dataArrayFilter)
          setMySavingTokensData(dataArrayFilter)
          console.log("handleGetMySavingTokensData dataArrayFilter", dataArrayFilter)
      }
    }
    catch(e: any) {
      console.log("handleGetMySavingTokensData Error", e)      
    }

    handleGetMySavingTokensBalance()

    handleGetAllTokensData()

  }

  const handleGetLeftAllTokens = (arr1: any[], arr2: any[]) =>  {
    const TokenIdList = arr2.map(item=>item.TokenId)
    const difference = arr1.filter((item: any) => !TokenIdList.includes(item.TokenId));

    return difference;
  }

  const handleGetMySavingTokensBalance = async () => {

    const getMyAoTokensData = getMyAoTokens(currentAddress);
    const myAoTokensBalanceTemp: any = {};
    try {
      if (getMyAoTokensData) {
        Promise.all(
          getMyAoTokensData.map(async (Token: any) => {
            const AoDryRunBalance = await AoTokenBalanceDryRun(Token.TokenId, currentAddress);
            if (AoDryRunBalance) {
              const TokenData = JSON.parse(Token.TokenData.replace(/\\"/g, '"'));
              const AoDryRunBalanceCoin = FormatBalance(AoDryRunBalance, TokenData.Denomination ? TokenData.Denomination : '12');
              if (!myAoTokensBalanceTemp[currentAddress]) {
                myAoTokensBalanceTemp[currentAddress] = {};
              }
              myAoTokensBalanceTemp[currentAddress][Token.TokenId] = Number(AoDryRunBalanceCoin) > 0 ? Number(AoDryRunBalanceCoin).toFixed(4) : 0;
            }
          })
        ).then(() => {
          setMyAoTokensBalance(myAoTokensBalanceTemp);
        });
      }
    }
    catch(e: any) {
      console.log("handleGetMySavingTokensBalance Error", e)      
    }
  }

  
  const handleGetAllTokensData = async () => {

    const getAllAoTokensData = getAllAoTokens(currentAddress)
    if(getAllAoTokensData) {      
      setAllTokensData(getAllAoTokensData)
    }
    
    try {
      const ChivesServerDataGetTokensData1 = await ChivesServerDataGetTokens(authConfig.AoConnectChivesServerTxId, authConfig.AoConnectChivesServerUser)
      if(ChivesServerDataGetTokensData1) {
          const dataArray = Object.values(ChivesServerDataGetTokensData1);
          dataArray.sort((a: any, b: any) => {
              if (a.TokenGroup == b.TokenGroup) {
                  return Number(a.TokenSort) - Number(b.TokenSort);
              } else {
                  return a.TokenGroup.localeCompare(b.TokenGroup);
              }
          });
          const dataArrayFilter = dataArray.map((Token: any)=>({...Token, TokenData: Token.TokenData.replace(/\\"/g, '"')}))
          setAllAoTokens(currentAddress, dataArrayFilter)
          setAllTokensData(dataArrayFilter)
          console.log("handleGetAllTokensData dataArrayFilter", dataArrayFilter)
      }
    }
    catch(e: any) {
      console.log("handleGetAllTokensData Error", e)      
    }


  }

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
            
            {getAllWalletsData && pageModel == 'MainWallet' ?  
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{height: '100%'}}>
                  <Grid container spacing={2}>
                    <Box p={2} textAlign="center" sx={{width: '100%'}}>
                      <CustomAvatar
                        skin='light'
                        color='primary'
                        sx={{ width: 60, height: 60, fontSize: '1.5rem', margin: 'auto' }}
                        src={'/images/logo/' + authConfig.tokenName + '.png'}
                      >
                      </CustomAvatar>
                      <Typography variant="h5" mt={6}>
                        {Number(currentBalance)} {authConfig.tokenName}
                      </Typography>
                      {currentTxsInMemory && currentTxsInMemory['receive'] && currentTxsInMemory['receive'][currentAddress] && (
                        <Typography variant="body1" component="div" sx={{ color: 'primary.main' }}>
                          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon icon='tdesign:plus' />
                            {currentTxsInMemory['receive'][currentAddress]} {authConfig.tokenName}
                          </Box>
                        </Typography>
                      )}
                      {currentTxsInMemory && currentTxsInMemory['send'] && currentTxsInMemory['send'][currentAddress] && (
                        <Typography variant="body1" component="div" sx={{ color: 'warning.main' }}>
                          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon icon='tdesign:minus' />
                            {currentTxsInMemory['send'][currentAddress]} {authConfig.tokenName}
                          </Box>
                        </Typography>
                      )}
                      {currentBalanceReservedRewards && Number(currentBalanceReservedRewards) > 0 && (
                        <Typography variant="body1" component="div" sx={{ color: 'info.main' }}>
                          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon icon='hugeicons:mining-02' />
                            {Number(currentBalanceReservedRewards).toFixed(4)} {authConfig.tokenName}
                          </Box>
                        </Typography>
                      )}

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
                          <IconButton onClick={()=>handleClickAllTxsButton()}>
                            <History />
                          </IconButton>
                          <Typography onClick={()=>handleClickAllTxsButton()}>{t('Txs') as string}</Typography>
                        </Grid>
                        <Grid item sx={{mx: 2}}>
                          <IconButton>
                            <Casino />
                          </IconButton>
                          <Typography>{t('Lottery') as string}</Typography>
                        </Grid>
                        <Grid item sx={{mx: 2}}>
                          <IconButton onClick={()=> Number(currentBalance) > 0 && handleClickSendButton()}>
                            <Send />
                          </IconButton>
                          <Typography onClick={()=>Number(currentBalance) > 0 && handleClickSendButton()}>{t('Send') as string}</Typography>
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
                                  src={'/images/logo/' + authConfig.tokenName + '.png'}
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
                                      {Number(currentBalance)}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box textAlign="right">
                                  <Typography variant='h6' sx={{ 
                                    color: `info.dark`,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    mr: 2,
                                    ml: 2
                                  }}>
                                    {Number(currentBalance) > 0 ? Number(currentBalance).toFixed(4) : '0'}
                                  </Typography>
                                </Box>
                              </Box>
                            </Card>
                          </Grid>
                          
                          {authConfig.tokenName && authConfig.tokenName == "AR" && (
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
                                        {Number(currentAoBalance)}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <Box textAlign="right">
                                    <Typography variant='h6' sx={{ 
                                      color: `info.dark`,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      mr: 2,
                                      ml: 2
                                    }}>
                                      {Number(currentAoBalance) > 0 ? Number(currentAoBalance).toFixed(4) : '0'}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Card>
                            </Grid>
                          )}

                          {mySavingTokensData && mySavingTokensData.map((Token: any, Index: number) => {

                            let TokenData: any = {}
                            try {
                              TokenData = JSON.parse(Token.TokenData.replace(/\\"/g, '"'))
                            }
                            catch(e: any) {
                              console.log("allTokensData Error", e)
                            }

                            return (
                              <Grid item xs={12} sx={{ py: 0 }} key={Index}>
                                <Card>
                                  <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1}} onClick={()=>handleClickViewTokenButton(Token)}>
                                    <CustomAvatar
                                      skin='light'
                                      color={'primary'}
                                      sx={{ mr: 3, width: 38, height: 38, fontSize: '1.5rem' }}
                                      src={GetAppAvatar(TokenData.Logo)}
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
                                        {TokenData.Name}
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
                                          {formatHash(Token.TokenId, 6)}
                                        </Typography>
                                      </Box>
                                    </Box>
                                    <Box textAlign="right">
                                      <Typography variant='h6' sx={{ 
                                        color: `info.dark`,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        mr: 2,
                                        ml: 2
                                      }}>
                                        {(myAoTokensBalance && myAoTokensBalance[currentAddress] && myAoTokensBalance[currentAddress][Token.TokenId]) ? myAoTokensBalance[currentAddress][Token.TokenId] : ''}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Card>
                              </Grid>
                            )

                          })}

                          <Grid item xs={12} sx={{ py: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1 }}>
                              <Button sx={{ textTransform: 'none', mt: 3, ml: 2 }} variant='text' startIcon={<Icon icon='mdi:add' />} onClick={() => handleClickManageAssetsButton()}>
                                {t('Manage Assets') as string}
                              </Button>
                            </Box>
                          </Grid>


                        </Grid>
                      </Fragment>

                    </Box>
                  </Grid>
                </Grid>

              </Grid>
            :
              <Fragment></Fragment>
            }

            {pageModel == 'AllTxs' && authConfig.tokenName == "XWE" && ( 
              <Grid container spacing={0}>
                <Box
                  component='header'
                  sx={{
                    backgroundColor: 'background.paper',
                    width: '91%',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    top: -10,
                    position: 'fixed',
                    mt: '48px',
                    height: '48px'
                  }}
                >
                  <Tabs
                    value={activeTab}
                    onChange={handleChangeActiveTab}
                    aria-label="icon position tabs example"
                    sx={{ height: '48px', my: 0, py: 0}}
                  >
                    <Tab sx={{ textTransform: 'none', my: 0, py: 0}} value={'AllTxs'} icon={<Icon fontSize={20} icon='ant-design:transaction-outlined' />} iconPosition="start" label="All Txs" />
                    <Tab sx={{ textTransform: 'none', my: 0, py: 0}} value={'Sent'} icon={<Icon fontSize={20} icon='mdi:receipt-text-arrow-right' />} iconPosition="start" label="Sent" />
                    <Tab sx={{ textTransform: 'none', my: 0, py: 0}} value={'Received'} icon={<Icon fontSize={20} icon='mdi:receipt-text-arrow-left' />} iconPosition="start" label="Received" />
                  </Tabs>
                </Box>
                
                <Grid item xs={12} sx={{mt: '40px', height: 'calc(100% - 56px)'}}>
                    <Grid container spacing={2}>

                    {authConfig.tokenName && currentWalletTxs && currentWalletTxs.data.map((Tx: any, index: number) => {

                      return (
                        <Grid item xs={12} sx={{ py: 0 }} key={index}>
                          <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1}}>
                            <CustomAvatar
                              skin='light'
                              color={'primary'}
                              sx={{ mr: 0, width: 38, height: 38 }}
                              src={'/images/logo/XWE.png'}
                            >
                            </CustomAvatar>
                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', ml: 1.5 }} onClick={()=>{
                              navigator.clipboard.writeText(Tx.owner.address == currentAddress ? Tx.recipient : Tx.owner.address)
                              toast.success(t('Copied success') as string, { duration: 1000, position: 'top-center' })
                            }}>
                                <Typography 
                                  sx={{ 
                                    color: 'text.primary',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    textAlign: 'left'
                                  }}
                                >
                                  {Tx.owner.address == currentAddress ? formatHash(Tx.recipient, 8) : formatHash(Tx.owner.address, 8)}
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
                                    {formatTimestamp(Tx.block.timestamp)}
                                  </Typography>
                                </Box>
                              </Box>

                              <Box textAlign="right">
                                <Typography variant='h6' sx={{ 
                                  color: `info.dark`,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  mr: 2
                                }}>
                                  {Tx.owner.address == currentAddress ? ' - ' : ' + '}
                                  {Number(Tx.quantity.xwe).toFixed(2)}
                                </Typography>

                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                      )
                    })}

                    {authConfig.tokenName && currentWalletTxs && currentWalletTxs.data && currentWalletTxs.data.length == 0 && (
                      <Grid item xs={12} sx={{ py: 0 }}>
                        <Box sx={{ justifyContent: 'center', display: 'flex', alignItems: 'center', px: 2, py: 1}}>
                          {t('No Record')}
                        </Box>
                      </Grid>
                    )}
                    
                    </Grid>

                </Grid>
                      
                <Backdrop
                  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                  open={isDisabledButton}
                >
                  <CircularProgress color="inherit" size={45}/>
                </Backdrop>

              </Grid>
            )}

            {pageModel == 'AllTxs' && authConfig.tokenName == "AR" && ( 
              <ArWallet 
                currentWalletTxs={currentWalletTxs} 
                isDisabledButton={isDisabledButton} 
                currentAddress={currentAddress} 
                handleChangeActiveTab={handleChangeActiveTab} 
                activeTab={activeTab} 
                currentWalletTxsHasNextPage={currentWalletTxsHasNextPage}
                />
            )}

            {pageModel == 'ViewToken' && authConfig.tokenName == "AR" && ( 
              <AoToken 
                currentAddress={currentAddress} 
                chooseToken={chooseToken}
                myAoTokensBalance={myAoTokensBalance}
                page={page}
                setPage={setPage}
                />
            )}

            {pageModel == 'ReceiveMoney' && ( 
              <Grid container direction="column" alignItems="center" justifyContent="center" spacing={2} sx={{ minHeight: '100%', p: 2 }}>
                <Grid item>
                  <QRCode value={currentAddress} size={180} />
                </Grid>
                <Grid item>
                  <Typography variant="body1" sx={{mt: 3, wordWrap: 'break-word', wordBreak: 'break-all', textAlign: 'center', maxWidth: '100%', fontSize: '0.8125rem !important' }}>
                    {currentAddress}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button variant="outlined" sx={{mt: 3}} startIcon={<ContentCopyIcon />} onClick={()=>handleWalletCopyAddress()}>
                    {t('Copy') as string}
                  </Button>
                </Grid>
                <Grid item sx={{ mt: 8, width: '100%' }}>
                  <Button variant="contained" startIcon={<ShareIcon />} fullWidth onClick={()=>handleAddressShare()}>
                  {t('Share') as string}
                  </Button>
                </Grid>
              </Grid>
            )}

            {pageModel == 'SendMoneySelectContact' && ( 
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{height: 'calc(100%)'}}>
                    <Grid container spacing={2}>
                      <TextField
                        fullWidth
                        size='small'
                        value={searchContactkeyWord}
                        placeholder={t('Search or Input Address') as string}
                        sx={{ '& .MuiInputBase-root': { borderRadius: 5 }, mb: 3 }}
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
                              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>handleSelectAddress({name: contactsAll[Address], address: Address})}
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
                <Grid item xs={12} sx={{height: 'calc(100% - 100px)'}}>
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
                        disabled={isDisabledButton}
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
                      <ThemeProvider theme={themeSlider}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 0, py: 0 }}>
                          <Slider size="small" 
                                disabled={isDisabledButton}
                                defaultValue={0} 
                                aria-labelledby="small-slider" 
                                min={0}
                                max={100}
                                onChange={( _ , newValue: number | number[])=>{
                                  if (Array.isArray(newValue)) {
                                    newValue = newValue[0];
                                  }
                                  const TotalLeft = BalanceMinus(Number(currentBalance), Number(currentFee))
                                  const MultiValue = newValue / 100
                                  const result = BalanceTimes(Number(TotalLeft), MultiValue)
                                  if(newValue == 100) {
                                    setSendMoneyAmount( String(Number(result)) )

                                  }
                                  else {
                                    setSendMoneyAmount( String(Number(result).toFixed(4)) )
                                  }
                                }} 
                                sx={{m: 0, p: 0, width: '90%' }}
                                />
                        </Box>
                      </ThemeProvider>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1.2, ml: 3 }}>
                        {t('Max')}: {currentBalance} {authConfig.tokenName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1.2, ml: 3 }}>
                        {t('Fee')}: {currentFee}
                      </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ py: 1 }}>
                    <Box sx={{width: '100%', mr: 2}}>
                      <Button sx={{mt: 8}} fullWidth disabled={
                        (sendMoneyAddress && sendMoneyAddress.address && currentFee && Number(sendMoneyAmount) > 0 && (Number(currentFee) + Number(sendMoneyAmount)) < Number(currentBalance) ? false : true)
                        ||
                        (isDisabledButton)                  
                        } variant='contained' onClick={()=>handleWalletSendMoney()}>
                        {uploadingButton}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
                      
                <Backdrop
                  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                  open={isDisabledButton}
                >
                  <CircularProgress color="inherit" size={45}/>
                </Backdrop>
                
              </Grid>
            )}

            {pageModel == 'ManageAssets' && ( 
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{height: 'calc(100%)'}}>
                    <Grid container spacing={2}>
                      <TextField
                        fullWidth
                        size='small'
                        value={searchContactkeyWord}
                        placeholder={t('Search Assets') as string}
                        sx={{ '& .MuiInputBase-root': { borderRadius: 5 }, mb: 3 }}
                        onChange={(e: any)=>{
                          setSearchContactkeyWord(e.target.value)
                          const searchChivesContactsData = searchChivesContacts(e.target.value)
                          setContactsAll(searchChivesContactsData)
                          console.log("e.target.value", e.target.value)
                        }}
                      />
                    </Grid>
                    
                    {mySavingTokensData && mySavingTokensData.length > 0 && (
                      <Grid item xs={12} sx={{ py: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pt: 1, pb: 3}}>
                            {t('My Assets') as string}
                          </Box>
                      </Grid>
                    )}
                    <Grid container spacing={2}>
                    {mySavingTokensData.map((Token: any, index: number) => {

                      let TokenData: any = {}
                      try {
                        TokenData = JSON.parse(Token.TokenData.replace(/\\"/g, '"'))
                      }
                      catch(e: any) {
                        console.log("allTokensData Error", e)
                      }

                      return (
                        <Grid item xs={12} sx={{ py: 1 }} key={index}>
                          <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                              <CustomAvatar
                                skin='light'
                                color={'primary'}
                                sx={{ mr: 3, width: 38, height: 38, fontSize: '1.5rem' }}
                                src={GetAppAvatar(TokenData.Logo)}
                              >
                              </CustomAvatar>
                              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} >
                                <Typography sx={{ 
                                  color: 'text.primary',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                                >
                                  {TokenData.Name}
                                </Typography>
                                <Box sx={{ display: 'flex'}}>
                                  <Typography variant='body2' sx={{ 
                                    color: `primary.dark`, 
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    flex: 1
                                  }}>
                                    {formatHash(Token.TokenId, 6)}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box textAlign="right">
                                <Typography variant="body1" component="div" sx={{ color: 'primary.main' }}>
                                  <Box sx={{ mr: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={()=>handleSelectDeleteMyToken(Token.TokenId)} >
                                    <Icon icon='mdi:delete-outline' />
                                    Delete
                                  </Box>
                                </Typography>
                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                      )

                    })}
                    </Grid>
                    
                    <Grid item xs={12} sx={{ py: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pt: 2, pb: 3}}>
                          {t('All Assets') as string}
                        </Box>
                    </Grid>
                    <Grid container spacing={2}>
                    {handleGetLeftAllTokens(allTokensData, mySavingTokensData).map((Token: any, index: number) => {

                      let TokenData: any = {}
                      try {
                        TokenData = JSON.parse(Token.TokenData.replace(/\\"/g, '"'))
                      }
                      catch(e: any) {
                        console.log("allTokensData Error", e)
                      }

                      return (
                        <Grid item xs={12} sx={{ py: 1 }} key={index}>
                          <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                              <CustomAvatar
                                skin='light'
                                color={'primary'}
                                sx={{ mr: 3, width: 38, height: 38, fontSize: '1.5rem' }}
                                src={GetAppAvatar(TokenData.Logo)}
                              >
                              </CustomAvatar>
                              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} >
                                <Typography sx={{ 
                                  color: 'text.primary',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                                >
                                  {TokenData.Name}
                                </Typography>
                                <Box sx={{ display: 'flex'}}>
                                  <Typography variant='body2' sx={{ 
                                    color: `primary.dark`, 
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    flex: 1
                                  }}>
                                    {formatHash(Token.TokenId, 6)}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box textAlign="right">
                                <Typography variant="body1" component="div" sx={{ color: 'primary.main' }}>
                                  <Box sx={{ mr: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={()=>handleSelectTokenAndSave(Token, TokenData)} >
                                    <Icon icon='tdesign:plus' />
                                    Add
                                  </Box>
                                </Typography>
                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                      )

                    })}
                    </Grid>
                    {mySavingTokensData && mySavingTokensData.length > 0 && handleGetLeftAllTokens(allTokensData, mySavingTokensData).length == 0 && (
                      <Grid item xs={12} sx={{ py: 0 }}>
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            color: 'secondary.main',
                            px: 2, 
                            pt: 2, 
                            pb: 3 
                        }}>
                            {t('No Assets') as string}
                        </Box>
                      </Grid>
                    )}
                    

                </Grid>
                <Backdrop
                  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                  open={isDisabledButton}
                >
                  <CircularProgress color="inherit" size={45}/>
                </Backdrop>
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

export default Wallet
