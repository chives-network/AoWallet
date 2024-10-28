// ** React Imports
import { useState, useEffect, Fragment, useRef } from 'react'

import { Clipboard } from '@capacitor/clipboard';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CustomAvatar from '../../@core/components/mui/avatar'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import { getInitials } from '../../@core/utils/get-initials'
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
import Icon from '../../@core/components/icon'
import toast from 'react-hot-toast'
import authConfig from '../../configs/auth'
import { useTheme } from '@mui/material/styles'

import { isSetPasswordForWallet, checkPasswordForWallet, getAllWallets, getWalletBalance, getWalletNicknames, getCurrentWalletAddress, getCurrentWallet, getPrice, sendAmount, getTxsInMemoryXwe, getWalletBalanceReservedRewards, getXweWalletAllTxs, getChivesContacts, searchChivesContacts, setMyAoTokens, getMyAoTokens, getAllAoTokens, setAllAoTokens, deleteMyAoToken, addMyAoToken, getChivesLanguage, setChivesContacts } from '../../functions/ChivesWallets'
import { BalanceMinus, BalancePlus, BalanceTimes, FormatBalance } from '../../functions/AoConnect/AoConnect'

import { ChivesServerDataGetTokens } from '../../functions/AoConnect/ChivesServerData'

import { AoTokenBalanceDryRun, AoTokenTransfer, GetAppAvatar, AoTokenInfoDryRun } from '../../functions/AoConnect/Token'

import { MyProcessTxIdsGetTokens, MyProcessTxIdsAddToken, MyProcessTxIdsDelToken } from '../../functions/AoConnect/MyProcessTxIds'

import { GetArWalletAllTxs } from '../../functions/Arweave'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { formatHash, formatTimestamp, ansiRegex } from '../../configs/functions'

import { styled } from '@mui/material/styles'
import Header from '../Layout/Header'
import SetPinKeyboard from '../Layout/SetPinKeyboard'
import CheckPinKeyboard from '../Layout/CheckPinKeyboard'
import ArWallet from './ArWallet'
import AoToken from './AoToken'

import { createTheme, ThemeProvider } from '@mui/material';

import Tabs from '@mui/material/Tabs';

import { BrowserMultiFormatReader } from '@zxing/library';

import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';

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

const Wallet = ({ currentToken, handleSwitchBlockchain, setCurrentTab, specifyTokenSend, setSpecifyTokenSend, setDisabledFooter, encryptWalletDataKey, setEncryptWalletDataKey }: any) => {
  // ** Hook
  const { t, i18n } = useTranslation()
  const theme = useTheme()

  const contentHeightFixed = {}

  const [platform, setPlatform] = useState<string>('')
  const [pageModel, setPageModel] = useState<string>('MainWallet')
  const [HeaderHidden, setHeaderHidden] = useState<boolean>(false)
  const [LeftIcon, setLeftIcon] = useState<string>('material-symbols:menu-rounded')
  const [Title, setTitle] = useState<string>(t('Wallet') as string)
  const [RightButtonText, setRightButtonText] = useState<string>('Edit')
  const [RightButtonIcon, setRightButtonIcon] = useState<string>('mdi:qrcode')
  const [chooseWallet, setChooseWallet] = useState<any>(null)
  const [chooseToken, setChooseToken] = useState<any>(null)
  const [chooseTokenBalance, setChooseTokenBalance] = useState<string | null>(null)

  const [isTokenModel, setIsTokenModel] = useState<boolean>(false)
  const [searchContactkeyWord, setSearchContactkeyWord] = useState<string>('')
  const [searchAssetkeyWord, setSearchAssetkeyWord] = useState<string>('')
  const [searchAssetOnChain, setSearchAssetOnChain] = useState<any[]>([])
  const [contactsAll, setContactsAll] = useState<any>({})
  const [currentWalletTxs, setCurrentWalletTxs] = useState<any>(null)
  const [currentWalletTxsCursor, setCurrentWalletTxsCursor] = useState<any>({})
  const [currentWalletTxsHasNextPage, setCurrentWalletTxsHasNextPage] = useState<any>({'Sent': true, 'Received': true, 'AllTxs': true})

  const [mySavingTokensData, setMySavingTokensData] = useState<any[]>([])
  const [allTokensData, setAllTokensData] = useState<any[]>([])

  const [sendMoneyAddress, setSendMoneyAddress] = useState<any>({name: '', address: ''})
  const [sendMoneyAmount, setSendMoneyAmount] = useState<string>('')

  const [activeTab, setActiveTab] = useState<string>('AllTxs')

  const currentFeeAO = 0

  const handleChangeActiveTab = (event: any, value: string) => {
    setActiveTab(value)
    console.log("handleChangeActiveTab", event)
  }

  const [stream, setStream] = useState<any>(null);

  const closeVideoStream = (stream: MediaStream) => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (videoQrCodeRef.current) {
      videoQrCodeRef.current.srcObject = null;
    }
  };

  useEffect(() => {

    i18n.changeLanguage(getChivesLanguage())

    const platform = Capacitor.getPlatform();
    setPlatform(platform)

    const isSetPasswordForWalletData = isSetPasswordForWallet()
    if(isSetPasswordForWalletData == false)   {
      setPageModel('SetPinCode')
      setTitle(t('Set Pin Code') as string)
      setLeftIcon('')
      setRightButtonText('')
      setRightButtonIcon('')
      setLeftIcon('')
      setDisabledFooter(true)
    }
    else {
      const checkPasswordForWalletData = checkPasswordForWallet(encryptWalletDataKey)
      if(checkPasswordForWalletData == false)  {
        setPageModel('CheckPinCode')
        setTitle(t('Check Pin Code') as string)
        setLeftIcon('')
        setRightButtonText('')
        setRightButtonIcon('')
        setLeftIcon('')
        setDisabledFooter(true)
      }
      else {
        setDisabledFooter(false)
      }
    }

  }, [encryptWalletDataKey]);

  const handleWalletGoHome = () => {
    setRefreshWalletData(refreshWalletData+1)
    setPageModel('MainWallet')
    setLeftIcon('material-symbols:menu-rounded')
    setTitle(t('Wallet') as string)
    setRightButtonText(t('QR') as string)
    setRightButtonIcon('mdi:qrcode')
    setChooseToken(null)
    setChooseTokenBalance(null)
    setIsTokenModel(false)
    setSearchAssetkeyWord('')
    setSearchAssetOnChain([])
    setDisabledFooter(false)
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
        if (stream) {
          closeVideoStream(stream);
        }
        handleWalletGoHome()
        break
      case 'ReceiveMoneyAO':
      case 'SendMoneyInputAmountAO':
        handleClickViewTokenButtonAO()
        break;
      case 'MainWallet':
        setCurrentTab('MyWallet')
        break
    }
  }

  const setPinKeySuccess = () => {
    setCurrentTab('MyWallet')
  }

  const videoQrCodeRef = useRef<HTMLVideoElement>(null);
  const codeReader = new BrowserMultiFormatReader();

  useEffect(() =>   {
    return () => {
      codeReader.reset();
    };
  }, [codeReader]);

  const startScan = async () => {
    switch(platform) {
      case 'ios':
      case 'android':
          try {
            const result = await CapacitorBarcodeScanner.scanBarcode({
              hint: CapacitorBarcodeScannerTypeHint.ALL
            });
            if (result && result.ScanResult) {
              if(result.ScanResult.length == 43) {
                handleSelectAddress({name: 'WalletFromQrCode', address: result.ScanResult})
              }
              console.log('result.ScanResult:', result.ScanResult);
            }
          } catch (err) {
            console.log('Capacitor.getPlatform Error accessing camera:', err);
          }
          break;
      case 'web':
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setStream(stream)
          if (videoQrCodeRef.current) {
            videoQrCodeRef.current.srcObject = stream;
            videoQrCodeRef.current.play();
            codeReader.decodeFromVideoDevice(null, videoQrCodeRef.current, (resultTemp: any) => {
              if (resultTemp && resultTemp.getText() && ( resultTemp.getText().length == 43 || resultTemp.getText().slice(0, 10) == 'AoToken://') ) {
                codeReader.reset();
                stream.getTracks().forEach(track => track.stop());
                if(resultTemp.getText().length == 43) {
                  handleSelectAddress({name: 'WalletFromQrCode', address: resultTemp.getText()})
                }
              }
            });
          }
        } catch (err) {
          console.log('Error accessing camera:', err);
        }
        break;
    }

  };

  const RightButtonOnClick = () => {
    console.log("chooseToken", chooseToken)

    if(RightButtonIcon == 'mdi:qrcode')  {
      startScan()
      setPageModel('ScanQRCode')
      setLeftIcon('mdi:arrow-left-thin')
      setTitle(t('Scan QRCode') as string)
      setRightButtonText(t('') as string)
      setRightButtonIcon('')
      setPage(0)
    }

    //handleWalletGoHome()

  }

  const [getAllWalletsData, setGetAllWalletsData] = useState<any>([])
  const [getWalletNicknamesData, setGetWalletNicknamesData] = useState<any>({})
  const [refreshWalletData, setRefreshWalletData] = useState<number>(0)

  const [currentAddress, setCurrentAddress] = useState<string>("")
  const [currentBalance, setCurrentBalance] = useState<string>("")

  const [currentBalanceXwe, setCurrentBalanceXwe] = useState<string>("") // Xwe
  const [currentBalanceReservedRewards, setCurrentBalanceReservedRewards] = useState<string>("") // Xwe
  const [currentTxsInMemory, setCurrentTxsInMemory] = useState<any>({}) // Xwe

  const [currentFee, setCurrentFee] = useState<number>(0)
  const [currentAoBalance, setCurrentAoBalance] = useState<string>("")
  const [myAoTokensBalance, setMyAoTokensBalance] = useState<any>({})

  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [uploadingButton, setUploadingButton] = useState<string>(`${t('Send')}`)
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [isDisabledManageAssets, setIsDisabledManageAssets] = useState<boolean>(true)


  useEffect(() => {

    setHeaderHidden(false)

    const currentAddressTemp = getCurrentWalletAddress(encryptWalletDataKey)
    setCurrentAddress(String(currentAddressTemp))

    const getCurrentWalletTemp = getCurrentWallet(encryptWalletDataKey)
    setChooseWallet(getCurrentWalletTemp)

    const myTask = () => {
      setRefreshWalletData(refreshWalletData+1);
    };
    const intervalId = setInterval(myTask, 2 * 60 * 1000);

    return () => clearInterval(intervalId);

  }, [encryptWalletDataKey]);

  useEffect(() => {
    const contactsAll = getChivesContacts(encryptWalletDataKey)
    setContactsAll(contactsAll)
  }, [encryptWalletDataKey]);

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

      console.log("windowHeight", windowHeight);
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

        //For Xwe
        const currentBalanceTempXwe = await getWalletBalance(currentAddress, 'Xwe');
        if(currentBalanceTempXwe) {
          setCurrentBalanceXwe(Number(currentBalanceTempXwe).toFixed(4).replace(/\.?0*$/, ''))
        }
        if(currentToken == "Xwe")  {
          const getTxsInMemoryXweData = await getTxsInMemoryXwe()
          setCurrentTxsInMemory(getTxsInMemoryXweData)
          const balanceReservedRewards = await getWalletBalanceReservedRewards(currentAddress, 'Xwe')
          if(balanceReservedRewards) {
            setCurrentBalanceReservedRewards(balanceReservedRewards)
          }
          if(currentTxsInMemory && currentTxsInMemory['balance'] && currentTxsInMemory['balance'][currentAddress])  {
            const NewBalance = BalancePlus(Number(currentBalanceTempXwe) , Number(currentTxsInMemory['balance'][currentAddress]))
            setCurrentBalanceXwe(Number(NewBalance).toFixed(4).replace(/\.?0*$/, ''))
          }
        }

        // For Ar
        handleGetMySavingTokensData()
        const currentBalanceTempAr = await getWalletBalance(currentAddress, 'Ar');
        if(currentBalanceTempAr) {
          setCurrentBalance(Number(currentBalanceTempAr).toFixed(4).replace(/\.?0*$/, ''))
        }
        const AoTokenBalanceDryRunData = await AoTokenBalanceDryRun(authConfig.AoTokenProcessTxId, String(currentAddress))
        setCurrentAoBalance(FormatBalance(AoTokenBalanceDryRunData, 12))

      }

      if(currentAddress && currentAddress.length == 43 && pageModel == 'AllTxs' && currentWalletTxsHasNextPage[activeTab] == true)  {
        if(currentToken == "Ar")  {
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
        if(currentToken == "Xwe")  {
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
  }, [currentAddress, currentToken, pageModel, activeTab, page])

  useEffect(() => {
    const isSetPasswordForWalletData = isSetPasswordForWallet()
    const checkPasswordForWalletData = checkPasswordForWallet(encryptWalletDataKey)
    if(isSetPasswordForWalletData && checkPasswordForWalletData)   {
      setTitle(getWalletNicknamesData[currentAddress] ?? t('Wallet') as string)
    }
  }, [getWalletNicknamesData, currentAddress, encryptWalletDataKey]);

  useEffect(() => {
    if(currentAddress && currentAddress.length == 43 && specifyTokenSend && specifyTokenSend.Name && specifyTokenSend.Address && specifyTokenSend.TokenId && encryptWalletDataKey)  {
      handleDirectSendTokenOut()
    }
  }, [currentAddress, specifyTokenSend, encryptWalletDataKey]);

  const handleDirectSendTokenOut = async () => {
    setIsDisabledButton(true)
    setIsTokenModel(true)
    const TokenGetMap: any = await AoTokenInfoDryRun(specifyTokenSend.TokenId)
    if(TokenGetMap) {
      setChooseToken({...TokenGetMap, TokenId: specifyTokenSend.TokenId})
      console.log("TokenGetMap", TokenGetMap)
      const AoDryRunBalance = await AoTokenBalanceDryRun(specifyTokenSend.TokenId, currentAddress);
      if (AoDryRunBalance) {
        const AoDryRunBalanceCoin = FormatBalance(AoDryRunBalance, TokenGetMap.Denomination ? TokenGetMap.Denomination : '12');
        setChooseTokenBalance(AoDryRunBalanceCoin)
      }
      setSendMoneyAddress({name: specifyTokenSend.Name, address: specifyTokenSend.Address})
      setPageModel('SendMoneyInputAmountAOFaucet')
      setTitle(t('Token Amount') as string)
      setLeftIcon('')
      setRightButtonText(t('') as string)
      setRightButtonIcon('')
      setSendMoneyAmount('')
    }
    else {
      console.log("handleDirectSendTokenOut TokenGetMap", TokenGetMap)
    }
    setIsDisabledButton(false)
  }

  useEffect(() => {
    const isSetPasswordForWalletData = isSetPasswordForWallet()
    const checkPasswordForWalletData = checkPasswordForWallet(encryptWalletDataKey)
    if(isSetPasswordForWalletData && checkPasswordForWalletData)   {
      const getAllWalletsData = getAllWallets(encryptWalletDataKey)
      if(getAllWalletsData == null || getAllWalletsData.length == 0)  {

        //No wallet, and switch to MyWallet
        setCurrentTab('MyWallet')
      }
      else {

        //Have wallets, and list them
        setGetAllWalletsData(getAllWallets(encryptWalletDataKey))
        setGetWalletNicknamesData(getWalletNicknames(encryptWalletDataKey))
      }
    }
  }, [refreshWalletData, encryptWalletDataKey])

  useEffect(() => {
    if(pageModel == "SendMoneyInputAmount") {
      const getPriceDataFunction = async () => {
        try {
          const getPriceData = await getPrice(50, currentToken)
          setCurrentFee(Number(getPriceData))
        } catch (error) {
          console.log('SendMoneyInputAmount Error:', error);
        }
      }
      getPriceDataFunction()
    }
    if(pageModel == "ManageAssets") {

      //handleGetServerData()
    }
  }, [pageModel])

  const handleWalletCopyAddress = async () => {
    await Clipboard.write({
      string: chooseWallet.data.arweave.key
    });
    toast.success(t('Copied success') as string, { duration: 1000, position: 'top-center' })
  }

  const handleAddressShare = async () => {
    await Share.share({
      text: currentAddress,
    });
  }

  const handleClickReceiveButton = () => {
    setPageModel('ReceiveMoney')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle(t('Receive') as string)
    setRightButtonText(t('') as string)
    setRightButtonIcon('')
  }

  const handleClickReceiveButtonAO = () => {
    setPageModel('ReceiveMoneyAO')
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

  const handleClickSendButtonAO = () => {
    console.log("chooseToken", chooseToken)
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
    setRightButtonIcon('')
  }

  const handleClickViewTokenButton = (Token: any) => {
    setPageModel('ViewToken')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle(t('View Asset') as string)
    setRightButtonText(t('') as string)
    setRightButtonIcon('mdi:qrcode')
    try {
        if(Token && Token.TokenData) {
          setChooseToken({...Token, ...Token.TokenData})
        }
        setChooseTokenBalance(myAoTokensBalance && myAoTokensBalance[currentAddress] && myAoTokensBalance[currentAddress][Token.TokenId])
        setIsTokenModel(true)
        setPage(0)
    }
    catch(e: any) {
        console.log("allTokensData Error", e)
    }
  }

  const handleClickViewTokenButtonAO = () => {
    setPageModel('ViewToken')
    setLeftIcon('mdi:arrow-left-thin')
    setTitle(t('View Asset') as string)
    setRightButtonText(t('') as string)
    setRightButtonIcon('')
    setPage(0)
  }


  const handleSelectAddress = (MoneyAddress: any) => {
    setSendMoneyAddress(MoneyAddress)
    if(isTokenModel) {
      setPageModel('SendMoneyInputAmountAO')
      setTitle(t('Token Amount') as string)
    }
    else {
      setPageModel('SendMoneyInputAmount')
      setTitle(t('Input Amount') as string)
    }
    setLeftIcon('mdi:arrow-left-thin')
    setRightButtonText(t('') as string)
    setRightButtonIcon('')
    setSendMoneyAmount('')
  }

  const handleWalletSendMoney = async () => {
    setSearchContactkeyWord('')
    setIsDisabledButton(true)
    setUploadingButton(`${t('Submitting...')}`)
    const TxResult: any = await sendAmount(currentToken, chooseWallet, sendMoneyAddress.address, String(sendMoneyAmount), [], '', "SubmitStatus", setUploadProgress);
    if(TxResult && TxResult.status == 800) {
      toast.error(TxResult.statusText, { duration: 2500 })
    }
    if(TxResult && TxResult.status == 200)  {
      toast.success(t("Successful Sent") as string, { duration: 2500 })
      setChivesContacts(sendMoneyAddress.address, formatHash(sendMoneyAddress.address, 6), encryptWalletDataKey) //Save address to Contact
    }
    console.log("uploadProgress TxResult", TxResult)
    setIsDisabledButton(false)
    setUploadingButton(`${t('Send')}`)
    setSendMoneyAmount('')
    handleWalletGoHome()
    console.log("uploadProgress", uploadProgress)

    encryptWalletDataKey
  }

  const handleWalletSendMoneyAO = async () => {
    setIsDisabledButton(true)
    setUploadingButton(`${t('Submitting...')}`)
    const TxResult: any = await AoTokenTransfer(chooseWallet.jwk, chooseToken.TokenId, sendMoneyAddress.address, Number(sendMoneyAmount), chooseToken.Denomination);
    console.log("TxResult TxResult", TxResult)
    if(TxResult?.msg?.Messages && TxResult?.msg?.Messages[0]?.Data)  {
      toast.success(t(TxResult?.msg?.Messages[0]?.Data.replace(ansiRegex, '')) as string, { duration: 2500, position: 'top-center' })
      const getMyAoTokensData = getMyAoTokens(currentAddress, encryptWalletDataKey)
      if(getMyAoTokensData) {
        setMySavingTokensData(getMyAoTokensData)
      }
    }
    setIsDisabledButton(false)
    setUploadingButton(`${t('Send')}`)
    setSendMoneyAmount('')
    if(pageModel == "SendMoneyInputAmountAOFaucet")  {
      setSpecifyTokenSend(null)
      setCurrentTab('Faucet')
    }
    else {
      handleClickViewTokenButtonAO()
    }
  }

  const handleSelectTokenAndSave = async (Token: any, TokenData: any) => {
    setIsDisabledButton(true)
    const WantToSaveTokenProcessTxIdData = await MyProcessTxIdsAddToken(chooseWallet.jwk, authConfig.AoConnectMyProcessTxIds, Token.TokenId, '100', TokenData.Name, JSON.stringify(TokenData) )
    setIsDisabledButton(false)
    if(WantToSaveTokenProcessTxIdData?.msg?.Messages && WantToSaveTokenProcessTxIdData?.msg?.Messages[0]?.Data)  {
      toast.success(t(WantToSaveTokenProcessTxIdData?.msg?.Messages[0]?.Data) as string, { duration: 2500, position: 'top-center' })
      addMyAoToken(currentAddress, Token, encryptWalletDataKey)
      const getMyAoTokensData = getMyAoTokens(currentAddress, encryptWalletDataKey)
      if(getMyAoTokensData) {
        setMySavingTokensData(getMyAoTokensData)
      }
    }
  }

  const handleSelectDeleteMyToken = async (TokenId: string) => {
    setIsDisabledButton(true)
    const WantToDeleteTokenProcessTxIdData = await MyProcessTxIdsDelToken(chooseWallet.jwk, authConfig.AoConnectMyProcessTxIds, TokenId)
    setIsDisabledButton(false)
    if(WantToDeleteTokenProcessTxIdData?.msg?.Messages && WantToDeleteTokenProcessTxIdData?.msg?.Messages[0]?.Data)  {
      toast.success(t(WantToDeleteTokenProcessTxIdData?.msg?.Messages[0]?.Data) as string, { duration: 2500, position: 'top-center' })
      deleteMyAoToken(currentAddress, TokenId, encryptWalletDataKey)
      const getMyAoTokensData = getMyAoTokens(currentAddress, encryptWalletDataKey)
      if(getMyAoTokensData) {
        setMySavingTokensData(getMyAoTokensData)
      }
    }
  }

  const handleGetMySavingTokensData = async () => {
    const getMyAoTokensData = getMyAoTokens(currentAddress, encryptWalletDataKey)
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
          const dataArrayFilter = dataArray.map((Token: any)=>{

            //console.log("handleGetMySavingTokensData TokenData 1", Token.TokenData)
            const TokenDataTemp = Token.TokenData.replace(/\\"/g, '"').replace(':"{', ':{').replace('}"', '}').replace('/\"', '"')

            //console.log("handleGetMySavingTokensData TokenData 2", TokenDataTemp)
            const TokenData = JSON.parse(TokenDataTemp)

            //console.log("handleGetMySavingTokensData TokenData 3", TokenData)

            return {...Token, TokenData: TokenData}
          })
          setMyAoTokens(currentAddress, dataArrayFilter, encryptWalletDataKey)
          setMySavingTokensData(dataArrayFilter)

          //console.log("handleGetMySavingTokensData dataArrayFilter", dataArrayFilter)
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

    const getMyAoTokensData = getMyAoTokens(currentAddress, encryptWalletDataKey);
    const myAoTokensBalanceTemp: any = {};
    try {
      if (getMyAoTokensData) {
        for (const Token of getMyAoTokensData) {
          try {
            const AoDryRunBalance = await AoTokenBalanceDryRun(Token.TokenId, currentAddress);
            if (AoDryRunBalance) {
              const AoDryRunBalanceCoin = FormatBalance(AoDryRunBalance, Token.TokenData.Denomination ? Token.TokenData.Denomination : '12');
              if (!myAoTokensBalanceTemp[currentAddress]) {
                myAoTokensBalanceTemp[currentAddress] = {};
              }
              myAoTokensBalanceTemp[currentAddress][Token.TokenId] = Number(AoDryRunBalanceCoin) > 0 ? Number(AoDryRunBalanceCoin).toFixed(4).replace(/\.?0*$/, '') : 0;
              setMyAoTokensBalance({ ...myAoTokensBalanceTemp }); // Immediately update the balance
            }
            else {
              console.error('AoDryRunBalance is null or undefined', Token, "currentAddress", currentAddress, "AoDryRunBalance", AoDryRunBalance);
              myAoTokensBalanceTemp[currentAddress][Token.TokenId] = 'Error';
              setMyAoTokensBalance({ ...myAoTokensBalanceTemp }); // Immediately update the balance
            }
          } catch (error) {
            console.error(`Error processing token ${Token.TokenId}:`, error);
          }
        }
      }
    }
    catch (e: any) {
      console.error("handleGetMySavingTokensBalance Error", e);
    }

  }


  const handleGetAllTokensData = async () => {

    const getAllAoTokensData = getAllAoTokens(currentAddress, encryptWalletDataKey)
    if(getAllAoTokensData && getAllAoTokensData.length > 0) {
      setAllTokensData(getAllAoTokensData)
      setIsDisabledManageAssets(false)
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
          const dataArrayFilter = dataArray.map((Token: any)=>({...Token, TokenData: JSON.parse(Token.TokenData.replace(/\\"/g, '"'))}))
          setAllAoTokens(currentAddress, dataArrayFilter, encryptWalletDataKey)
          setAllTokensData(dataArrayFilter)
          setIsDisabledManageAssets(false)
      }
    }
    catch(e: any) {
      console.log("handleGetAllTokensData Error", e)
    }

  }

  const handleSearchAssets = (AllAssets: any[]) => {
    if(searchAssetkeyWord == "")  {

      return AllAssets
    }
    else {
      const result: any[] = []
      AllAssets && AllAssets.map((Token: any)=>{
        if (  Token.TokenId.toLowerCase().includes(searchAssetkeyWord.toLowerCase()) ||
              Token.TokenData.Name.toLowerCase().includes(searchAssetkeyWord.toLowerCase()) ||
              Token.TokenData.Ticker.toLowerCase().includes(searchAssetkeyWord.toLowerCase())
              ) {
          result.push(Token)
        }
      })
      console.log("AllAssets", result)

      return result
    }
  }

  const handleSearchAoAssetOnChain = async () => {
    setIsDisabledButton(true)
    const TokenGetMap: any = await AoTokenInfoDryRun(searchAssetkeyWord)
    if(TokenGetMap) {
      setSearchAssetOnChain([{TokenId: searchAssetkeyWord, TokenName: TokenGetMap.Name, TokenData: TokenGetMap}])
      console.log("handleTokenSearch TokenGetMap", TokenGetMap)
    }
    setIsDisabledButton(false)
  }

  useEffect(() => {
    if(searchAssetkeyWord.length == 43)  {
      handleSearchAoAssetOnChain()
    }
  }, [searchAssetkeyWord]);


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
          overflowX: 'hidden',
          marginTop: '35px', // Adjust according to the height of the AppBar
          marginBottom: '56px', // Adjust according to the height of the Footer,
          paddingTop: 'env(safe-area-inset-top)'
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
                        src={'https://web.aowallet.org/images/logo/' + currentToken + '.png'}
                        onClick={()=>{handleSwitchBlockchain()}}
                      >
                      </CustomAvatar>
                      <Typography variant="h5" mt={6} onClick={()=>{handleSwitchBlockchain()}} >
                        {Number(currentToken == 'Ar' ? currentBalance : currentBalanceXwe)} {currentToken}
                      </Typography>
                      {currentToken == "Xwe" && currentTxsInMemory && currentTxsInMemory['receive'] && currentTxsInMemory['receive'][currentAddress] && (
                        <Typography variant="body1" component="div" sx={{ color: 'primary.main' }}>
                          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon icon='tdesign:plus' />
                            {currentTxsInMemory['receive'][currentAddress]} {currentToken}
                          </Box>
                        </Typography>
                      )}
                      {currentToken == "Xwe" && currentTxsInMemory && currentTxsInMemory['send'] && currentTxsInMemory['send'][currentAddress] && (
                        <Typography variant="body1" component="div" sx={{ color: 'warning.main' }}>
                          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon icon='tdesign:minus' />
                            {currentTxsInMemory['send'][currentAddress]} {currentToken}
                          </Box>
                        </Typography>
                      )}
                      {currentBalanceReservedRewards && Number(currentBalanceReservedRewards) > 0 && (
                        <Typography variant="body1" component="div" sx={{ color: 'info.main' }}>
                          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon icon='hugeicons:mining-02' />
                            {Number(currentBalanceReservedRewards).toFixed(4).replace(/\.?0*$/, '')} {currentToken}
                          </Box>
                        </Typography>
                      )}

                      <Typography variant="h6" mt={2} onClick={()=>{
                        navigator.clipboard.writeText(currentAddress);
                        toast.success(t('Copied success') as string, { duration: 1000, position: 'top-center' })
                      }}>
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
                          <IconButton disabled={Number(currentToken == 'Ar' ? currentBalance : currentBalanceXwe) > 0 ? false : true} onClick={()=>handleClickAllTxsButton()}>
                            <History />
                          </IconButton>
                          <Typography sx={{
                                        color: Number(currentToken == 'Ar' ? currentBalance : currentBalanceXwe) > 0 ? `` : `secondary.dark`,
                                      }}
                                      onClick={()=>Number(currentToken == 'Ar' ? currentBalance : currentBalanceXwe) > 0 && handleClickAllTxsButton()}>
                            {t('Txs') as string}
                          </Typography>
                        </Grid>
                        <Grid item sx={{mx: 2}}>
                          <IconButton disabled={Number(currentToken == 'Ar' ? currentBalance : currentBalanceXwe) > 0 ? false : true} >
                            <Casino />
                          </IconButton>
                          <Typography sx={{
                                        color: Number(currentToken == 'Ar' ? currentBalance : currentBalanceXwe) > 0 ? `` : `secondary.dark`,
                                      }}
                                      >
                            {t('Swap') as string}
                          </Typography>
                        </Grid>
                        <Grid item sx={{mx: 2}}>
                          <IconButton disabled={Number(currentToken == 'Ar' ? currentBalance : currentBalanceXwe) > 0 ? false : true} onClick={()=> Number(currentToken == 'Ar' ? currentBalance : currentBalanceXwe) > 0 && handleClickSendButton()}>
                            <Send />
                          </IconButton>
                          <Typography sx={{
                                        color: Number(currentToken == 'Ar' ? currentBalance : currentBalanceXwe) > 0 ? `` : `secondary.dark`,
                                      }}
                                      onClick={()=>Number(currentToken == 'Ar' ? currentBalance : currentBalanceXwe) > 0 && handleClickSendButton()}>
                            {t('Send') as string}
                          </Typography>
                        </Grid>
                      </Grid>

                      <Fragment>
                        <Grid container spacing={2} sx={{mt: 4}}>

                          <Grid item xs={12} sx={{ py: 0 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1}}>
                                {t('My Coins') as string}
                              </Box>
                          </Grid>

                          <Grid item xs={12} sx={{ py: 0 }}>
                            <Card>
                              <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1}} onClick={()=>{handleSwitchBlockchain('Ar')}}>
                                <CustomAvatar
                                  skin='light'
                                  color={'primary'}
                                  sx={{ mr: 0, width: 43, height: 43 }}
                                  src={'https://web.aowallet.org/images/logo/Ar.png'}
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
                                      {Number(currentBalance)} {authConfig.tokenName}
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
                                    {Number(currentBalance) > 0 ? Number(currentBalance).toFixed(4).replace(/\.?0*$/, '') : '0'}
                                  </Typography>
                                </Box>
                              </Box>
                            </Card>
                          </Grid>

                          <Grid item xs={12} sx={{ py: 0 }}>
                            <Card>
                              <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1}} onClick={()=>{handleSwitchBlockchain('Xwe')}}>
                                <CustomAvatar
                                  skin='light'
                                  color={'primary'}
                                  sx={{ mr: 0, width: 43, height: 43 }}
                                  src={'https://web.aowallet.org/images/logo/Xwe.png'}
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
                                      {Number(currentBalanceXwe)} {authConfig.tokenNameXwe}
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
                                    {Number(currentBalanceXwe) > 0 ? Number(currentBalanceXwe).toFixed(4).replace(/\.?0*$/, '') : '0'}
                                  </Typography>
                                </Box>
                              </Box>
                            </Card>
                          </Grid>

                          {currentToken && currentToken == "Ar" && (
                            <Grid item xs={12} sx={{ py: 0 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1}}>
                                  {t('My Assets') as string}
                                </Box>
                            </Grid>
                          )}

                          {currentToken && currentToken == "Ar" && (
                            <Grid item xs={12} sx={{ py: 0 }}>
                              <Card>
                                <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1}}>
                                  <CustomAvatar
                                    skin='light'
                                    color={'primary'}
                                    sx={{ mr: 0, width: 43, height: 43 }}
                                    src={'https://web.aowallet.org/images/logo/AO.png'}
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
                                      AO
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
                                        {formatHash(authConfig.AoTokenProcessTxId, 6)}
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
                                      {Number(currentAoBalance) > 0 ? Number(currentAoBalance).toFixed(4).replace(/\.?0*$/, '') : '0'}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Card>
                            </Grid>
                          )}

                          {currentToken && currentToken == "Ar" && mySavingTokensData && mySavingTokensData.map((Token: any, Index: number) => {

                            return (
                              <Grid item xs={12} sx={{ py: 0 }} key={Index}>
                                <Card>
                                  <Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', px: 2, py: 1}} onClick={()=> (myAoTokensBalance && myAoTokensBalance[currentAddress] && myAoTokensBalance[currentAddress][Token.TokenId] !== undefined && myAoTokensBalance[currentAddress][Token.TokenId] !== 'Error') && handleClickViewTokenButton(Token)}>
                                    <CustomAvatar
                                      skin='light'
                                      color={'primary'}
                                      sx={{ mr: 0, width: 43, height: 43, fontSize: '1.5rem' }}
                                      src={GetAppAvatar(Token.TokenData.Logo)}
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
                                        {Token.TokenData.Name}
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
                                        color: (myAoTokensBalance && myAoTokensBalance[currentAddress] && myAoTokensBalance[currentAddress][Token.TokenId] !== undefined && myAoTokensBalance[currentAddress][Token.TokenId] !== 'Error') ? 'info.dark' : 'error.dark',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        mr: 2,
                                        ml: 2
                                      }}>
                                        {(myAoTokensBalance && myAoTokensBalance[currentAddress] && myAoTokensBalance[currentAddress][Token.TokenId] !== undefined) ? myAoTokensBalance[currentAddress][Token.TokenId] : ''}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Card>
                              </Grid>
                            )

                          })}

                          <Grid item xs={12} sx={{ py: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1 }}>
                              {isDisabledManageAssets == false && currentToken == "Ar" && (
                                <Button disabled={isDisabledManageAssets} sx={{ textTransform: 'none', mt: 3, ml: 2 }} variant='text' startIcon={<Icon icon='mdi:add' />} onClick={() => handleClickManageAssetsButton()}>
                                  {t('Manage Assets') as string}
                                </Button>
                              )}
                              {isDisabledManageAssets == true && currentToken == "Ar" && (
                                <Button disabled={isDisabledManageAssets} sx={{ textTransform: 'none', mt: 3, ml: 2 }} variant='text'>
                                  {t('Loading') as string} ...
                                </Button>
                              )}
                            </Box>
                          </Grid>


                        </Grid>
                      </Fragment>

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
            :
              <Fragment></Fragment>
            }

            {pageModel == 'AllTxs' && currentToken == "Xwe" && (
              <Grid container spacing={0} >
                <Box
                  component='header'
                  sx={{
                    backgroundColor: 'background.paper',
                    width: '100%',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '40px'
                  }}
                >
                  <Tabs
                    value={activeTab}
                    onChange={handleChangeActiveTab}
                    aria-label="icon position tabs example"
                    sx={{ my: 0, py: 0}}
                    variant="scrollable"
                    allowScrollButtonsMobile
                  >
                    <Tab sx={{ textTransform: 'none', my: 0, py: 0, minHeight: '40px'}} value={'AllTxs'} icon={<Icon fontSize={20} icon='ant-design:transaction-outlined' />} iconPosition="start" label="All Txs" />
                    <Tab sx={{ textTransform: 'none', my: 0, py: 0, minHeight: '40px'}} value={'Sent'} icon={<Icon fontSize={20} icon='mdi:receipt-text-arrow-right' />} iconPosition="start" label="Sent" />
                    <Tab sx={{ textTransform: 'none', my: 0, py: 0, minHeight: '40px'}} value={'Received'} icon={<Icon fontSize={20} icon='mdi:receipt-text-arrow-left' />} iconPosition="start" label="Received" />
                  </Tabs>
                </Box>

                <Grid item xs={12} sx={{mt: '10px', height: 'calc(100% - 56px)'}}>
                    <Grid container spacing={2}>

                    {currentToken && currentWalletTxs && currentWalletTxs.data.map((Tx: any, index: number) => {

                      return (
                        <Grid item xs={12} sx={{ py: 0 }} key={index}>
                          <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1}}>
                            <CustomAvatar
                              skin='light'
                              color={'primary'}
                              sx={{ mr: 0, width: 38, height: 38 }}
                              src={'https://web.aowallet.org/images/logo/Xwe.png'}
                            >
                            </CustomAvatar>
                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', ml: 1.5 }} onClick={ async ()=>{
                              await Clipboard.write({
                                string: Tx.owner.address == currentAddress ? Tx.recipient : Tx.owner.address
                              });
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
                                      color: Tx.block && Tx.block.timestamp ? `primary.dark` : `warning.dark`,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      flex: 1,
                                      textAlign: 'left'
                                    }}
                                  >
                                    {Tx.block && Tx.block.timestamp ? formatTimestamp(Tx.block.timestamp) : t('Memory Pool Tx')}
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
                                  {Number(Tx.quantity.xwe).toFixed(4)}
                                </Typography>

                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                      )
                    })}

                    {currentToken && currentWalletTxs && currentWalletTxs.data && currentWalletTxs.data.length == 0 && (
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

            {pageModel == 'AllTxs' && currentToken == "Ar" && (
              <ArWallet
                currentWalletTxs={currentWalletTxs}
                isDisabledButton={isDisabledButton}
                currentAddress={currentAddress}
                handleChangeActiveTab={handleChangeActiveTab}
                activeTab={activeTab}
                currentWalletTxsHasNextPage={currentWalletTxsHasNextPage}
                />
            )}

            {pageModel == 'ViewToken' && (
              <AoToken
                encryptWalletDataKey={encryptWalletDataKey}
                currentAddress={currentAddress}
                chooseToken={chooseToken}
                myAoTokensBalance={myAoTokensBalance}
                page={page}
                setPage={setPage}
                handleClickReceiveButtonAO={handleClickReceiveButtonAO}
                handleClickSendButtonAO={handleClickSendButtonAO}
                />
            )}

            {(pageModel == 'ReceiveMoney' || pageModel == 'ReceiveMoneyAO') && (
              <Grid container direction="column" alignItems="center" justifyContent="center" spacing={2} sx={{ minHeight: '100%', p: 2 }}>
                <Grid item>
                  <QRCode value={currentAddress} size={180} />
                </Grid>
                <Grid item>
                  <Typography variant="body1"
                    sx={{mt: 3, wordWrap: 'break-word', wordBreak: 'break-all', textAlign: 'center', maxWidth: '100%', fontSize: '0.8125rem !important' }}
                    onClick={()=>{
                        navigator.clipboard.writeText(currentAddress);
                        toast.success(t('Copied success') as string, { duration: 1000, position: 'top-center' })
                    }}>
                    {currentAddress}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button variant="outlined" sx={{mt: 3}} startIcon={<ContentCopyIcon />} onClick={()=>handleWalletCopyAddress()}>
                    {t('Copy') as string}
                  </Button>
                </Grid>
                <Grid item>
                  <Typography variant="body1" sx={{mt: 3, wordWrap: 'break-word', wordBreak: 'break-all', textAlign: 'center', maxWidth: '100%', fontSize: '1rem !important' }}>
                    {currentToken == 'Ar' ? 'Arweave Blockchain' : 'Chivesweave Blockchain'} {currentToken}
                  </Typography>
                </Grid>
                <Grid item sx={{ mt: 4, width: '100%' }}>
                  <Button variant="contained" startIcon={<ShareIcon />} fullWidth onClick={()=>handleAddressShare()}>
                  {t('Share') as string}
                  </Button>
                </Grid>
              </Grid>
            )}

            {(pageModel == 'ScanQRCode') && (
              <Grid container direction="column" alignItems="center" justifyContent="center" spacing={2} sx={{ minHeight: '100%', p: 2 }}>
                <Grid item container justifyContent="center" alignItems="center">
                  {platform && platform == "web" && (<video ref={videoQrCodeRef} width="80%" height="350px" autoPlay />)}
                </Grid>
                <Grid item>
                  <Typography variant="body1" sx={{mt: 3, wordWrap: 'break-word', wordBreak: 'break-all', textAlign: 'center', maxWidth: '100%', fontSize: '0.8125rem !important' }}>
                    {t('Scan the wallet address qrcode')}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button variant='contained' sx={{mt: 4}}
                    onClick={()=>{
                      if (stream) {
                        closeVideoStream(stream);
                      }
                    }}>
                        Close Video
                      </Button>
                </Grid>
              </Grid>
            )}

            {pageModel == 'SendMoneySelectContact' && (
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{height: 'calc(100% - 104px)', mt: 2}}>
                    <Grid container spacing={2}>
                      <TextField
                        fullWidth
                        size='small'
                        value={searchContactkeyWord}
                        placeholder={t('Search or Input Address') as string}
                        sx={{ '& .MuiInputBase-root': { borderRadius: 5 }, mb: 3, ml: 2 }}
                        onChange={(e: any)=>{
                          setSearchContactkeyWord(e.target.value)
                          const searchChivesContactsData = searchChivesContacts(e.target.value, encryptWalletDataKey)
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
                                sx={{ mr: 0, width: 43, height: 43, fontSize: '1.5rem' }}
                              >
                                {getInitials(Address).toUpperCase()}
                              </CustomAvatar>
                              <Box sx={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>handleSelectAddress({name: contactsAll[Address], address: Address})}
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
                    <Grid item xs={12} sx={{ pb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', px: 2}}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}
                            >
                            <Typography sx={{
                              color: 'text.primary',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                            >
                             {t('Send to')}
                            </Typography>
                            <Box sx={{ display: 'flex', mt: 1}}>
                              <Typography variant='body2' sx={{
                                color: `primary.dark`,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flex: 1,
                                fontSize: '12px'
                              }}>
                                {sendMoneyAddress.address}
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
                        sx={{ '& .MuiInputBase-root': { borderRadius: 5 }, mt: 2, px: 2 }}
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
                                  const TotalLeft = BalanceMinus(Number(currentToken == 'Ar' ? currentBalance : currentBalanceXwe), Number(currentFee))
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
                        {t('Max')}: {currentToken == 'Ar' ? currentBalance : currentBalanceXwe} {currentToken}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1.2, ml: 3 }}>
                        {t('Fee')}: {currentFee}
                      </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ py: 1 }}>
                    <Box sx={{width: '100%', px: 2, mr: 2}}>
                      <Button sx={{mt: 8}} fullWidth disabled={
                        (sendMoneyAddress && sendMoneyAddress.address && currentFee && Number(sendMoneyAmount) > 0 && (Number(currentFee) + Number(sendMoneyAmount)) < Number(currentToken == 'Ar' ? currentBalance : currentBalanceXwe) ? false : true)
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

            {(pageModel == 'SendMoneyInputAmountAO' || pageModel == 'SendMoneyInputAmountAOFaucet') && sendMoneyAddress && (
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{height: 'calc(100% - 100px)'}}>
                    <Grid item xs={12} sx={{ py: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', px: 0}}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} >
                            <Typography sx={{
                              color: 'text.primary',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                            >
                              {t('Send to')}
                            </Typography>
                            <Box sx={{ display: 'flex'}}>
                              <Typography variant='body2' sx={{
                                color: `primary.dark`,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flex: 1,
                                fontSize: '12px'
                              }}>
                                {sendMoneyAddress.address}
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
                                  const TotalLeft = BalanceMinus(Number(chooseTokenBalance), Number(currentFeeAO))
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
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1.2, ml: 3, fontSize: 14 }}>
                        {t('AoToken Name')}: {chooseToken.Name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1.2, ml: 3, fontSize: 14 }}>
                        {t('AoToken Ticker')}: {chooseToken.Ticker}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1.2, ml: 3, fontSize: 12 }}>
                        {t('AoToken Id')}: {chooseToken.TokenId}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1.2, ml: 3, fontSize: 16 }}>
                        {t('Max')}: {chooseTokenBalance} {chooseToken.Ticker}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1.2, ml: 3, fontSize: 16 }}>
                        {t('Fee')}: {currentFeeAO}
                      </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ py: 1 }}>
                    <Box sx={{width: '100%', mr: 2}}>
                      <Button sx={{mt: 8}} fullWidth disabled={
                        (sendMoneyAddress && sendMoneyAddress.address && Number(sendMoneyAmount) > 0 && (Number(currentFeeAO) + Number(sendMoneyAmount)) < Number(chooseTokenBalance) ? false : true)
                        ||
                        (isDisabledButton)
                        } variant='contained' onClick={()=>handleWalletSendMoneyAO()}>
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
                <Grid item xs={12} sx={{height: 'calc(100% - 104px)'}}>
                    <Grid container spacing={2}>
                      <TextField
                        fullWidth
                        size='small'
                        value={searchAssetkeyWord}
                        placeholder={t('Search Assets') as string}
                        sx={{ '& .MuiInputBase-root': { borderRadius: 5 }, mb: 3 }}
                        onChange={(e: any)=>{
                          setSearchAssetkeyWord(e.target.value)
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
                    {handleSearchAssets(mySavingTokensData).map((Token: any, index: number) => {

                      return (
                        <Grid item xs={12} sx={{ py: 1 }} key={index}>
                          <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                              <CustomAvatar
                                skin='light'
                                color={'primary'}
                                sx={{ mr: 0, width: 43, height: 43, fontSize: '1.5rem' }}
                                src={GetAppAvatar(Token.TokenData.Logo)}
                              >
                              </CustomAvatar>
                              <Box sx={{ display: 'flex', flexDirection: 'column', width: '65%', ml: 1.5 }} >
                                <Typography sx={{
                                  color: 'text.primary',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                                >
                                  {Token.TokenData.Name}
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
                                  <Box sx={{ cursor: 'pointer', mr: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={()=>handleSelectDeleteMyToken(Token.TokenId)} >
                                    <Icon icon='mdi:delete-outline' />
                                    {t('Delete') as string}
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
                    {handleGetLeftAllTokens(handleSearchAssets(allTokensData), mySavingTokensData).map((Token: any, index: number) => {

                      return (
                        <Grid item xs={12} sx={{ py: 1 }} key={index}>
                          <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                              <CustomAvatar
                                skin='light'
                                color={'primary'}
                                sx={{ mr: 0, width: 43, height: 43, fontSize: '1.5rem' }}
                                src={GetAppAvatar(Token.TokenData.Logo)}
                              >
                              </CustomAvatar>
                              <Box sx={{ display: 'flex', flexDirection: 'column', width: '65%', ml: 1.5 }} >
                                <Typography sx={{
                                  color: 'text.primary',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                                >
                                  {Token.TokenData.Name}
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
                                <Typography variant="body1" component="div" sx={{ color: 'primary.main', wordWrap: 'noWrap' }}>
                                  <Box sx={{ cursor: 'pointer', mr: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={()=>handleSelectTokenAndSave(Token, Token.TokenData)} >
                                    <Icon icon='tdesign:plus' />
                                    {t('Add') as string}
                                  </Box>
                                </Typography>
                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                      )

                    })}
                    </Grid>
                    <Grid container spacing={2}>
                    {handleGetLeftAllTokens(searchAssetOnChain, allTokensData).map((Token: any, index: number) => {

                      return (
                        <Grid item xs={12} sx={{ py: 1 }} key={index}>
                          <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                              <CustomAvatar
                                skin='light'
                                color={'primary'}
                                sx={{ mr: 0, width: 43, height: 43, fontSize: '1.5rem' }}
                                src={GetAppAvatar(Token.TokenData.Logo)}
                              >
                              </CustomAvatar>
                              <Box sx={{ display: 'flex', flexDirection: 'column', width: '65%', ml: 1.5 }} >
                                <Typography sx={{
                                  color: 'text.primary',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                                >
                                  {Token.TokenData.Name}
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
                                <Typography variant="body1" component="div" sx={{ color: 'primary.main', wordWrap: 'noWrap' }}>
                                  <Box sx={{ cursor: 'pointer', mr: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={()=>handleSelectTokenAndSave(Token, Token.TokenData)} >
                                    <Icon icon='tdesign:plus' />
                                    {t('Add') as string}
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

            {pageModel == 'SetPinCode' && (
              <SetPinKeyboard setPinKeySuccess={setPinKeySuccess} setEncryptWalletDataKey={setEncryptWalletDataKey} />
            )}

            {pageModel == 'CheckPinCode' && (
              <CheckPinKeyboard handleWalletGoHome={handleWalletGoHome} setEncryptWalletDataKey={setEncryptWalletDataKey} />
            )}

        </ContentWrapper>
      </Box>
    </Fragment>
  )
}

export default Wallet
