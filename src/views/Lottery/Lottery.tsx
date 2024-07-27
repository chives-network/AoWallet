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

import { AoTokenBalanceDryRun, AoTokenTransfer, GetAppAvatar } from 'src/functions/AoConnect/Token'

import { MyProcessTxIdsGetTokens, MyProcessTxIdsAddToken, MyProcessTxIdsDelToken } from 'src/functions/AoConnect/MyProcessTxIds'

import { GetArWalletAllTxs } from 'src/functions/Arweave'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { formatHash, formatTimestamp, ansiRegex } from 'src/configs/functions'

import { styled } from '@mui/material/styles'
import Footer from '../Layout/Footer'
import Header from '../Layout/Header'

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

const Lottery = () => {
  // ** Hook
  const { t } = useTranslation()
  const router = useRouter()
  const theme = useTheme()

  const contentHeightFixed = {}

  const [pageModel, setPageModel] = useState<string>('MainLottery')
  const [HeaderHidden, setHeaderHidden] = useState<boolean>(false)
  const [FooterHidden, setFooterHidden] = useState<boolean>(false)
  const [LeftIcon, setLeftIcon] = useState<string>('material-symbols:menu-rounded')
  const [Title, setTitle] = useState<string>('Lottery')
  const [RightButtonText, setRightButtonText] = useState<string>('Edit')
  const [RightButtonIcon, setRightButtonIcon] = useState<string>('mdi:qrcode')
  const [chooseWallet, setChooseWallet] = useState<any>(null)
  const [chooseToken, setChooseToken] = useState<any>(null)
  const [chooseTokenBalance, setChooseTokenBalance] = useState<string | null>(null)
  const [isTokenModel, setIsTokenModel] = useState<boolean>(false)

  const [mySavingTokensData, setMySavingTokensData] = useState<any[]>([])
  const [allTokensData, setAllTokensData] = useState<any[]>([])
  
  const currentFeeAO = 0

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
    setTitle(t('Lottery') as string)
    setRightButtonText(t('QR') as string)
    setRightButtonIcon('mdi:qrcode')
    setChooseToken(null)
    setChooseTokenBalance(null)
    setIsTokenModel(false)
  }
  
  const LeftIconOnClick = () => {
    switch(pageModel) {
      case 'ReceiveMoney':
      case 'AllTxs':
      case 'SendMoneySelectContact':
      case 'SendMoneyInputAmount':
      case 'ManageAssets':
      case 'ViewToken':
      case 'ScanQRCode':
        handleWalletGoHome()
        break
      case 'ReceiveMoneyAO':
      case 'SendMoneyInputAmountAO':
        break;
      case 'MainWallet':
        router.push('/mywallet')
        break
    }
  }

  
  const RightButtonOnClick = () => {
    console.log("chooseToken", chooseToken)

    if(RightButtonIcon == 'mdi:qrcode')  {
      setPageModel('ScanQRCode')
      setLeftIcon('mdi:arrow-left-thin')
      setTitle(t('Scan QRCode') as string)
      setRightButtonText(t('') as string)
      setRightButtonIcon('')
      setPage(0)
    }

    //handleWalletGoHome()
    
  }

  const [refreshWalletData, setRefreshWalletData] = useState<number>(0)

  const [currentAddress, setCurrentAddress] = useState<string>("")
  const [currentBalance, setCurrentBalance] = useState<string>("")
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
        
        if(authConfig.tokenType == "AR")  {

          //handleGetMySavingTokensData()

          const currentBalanceTemp = await getWalletBalance(currentAddress);
          if(currentBalanceTemp) {
            setCurrentBalance(Number(currentBalanceTemp).toFixed(4))
          }

          const AoTokenBalanceDryRunData = await AoTokenBalanceDryRun(authConfig.AoTokenProcessTxId, String(currentAddress))
          setCurrentAoBalance(FormatBalance(AoTokenBalanceDryRunData, 12))
          
        }

      }
      

    };
    processWallets();
  }, [currentAddress, pageModel, page])

  const handleWalletCopyAddress = () => {
    navigator.clipboard.writeText(chooseWallet.data.arweave.key);
    toast.success(t('Copied success') as string, { duration: 1000, position: 'top-center' })
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
            

        </ContentWrapper>
      </Box>
      <Footer Hidden={FooterHidden} />
    </Fragment>
  )
}

export default Lottery
