// ** React Imports
import { useState, useEffect, Fragment, useRef } from 'react'

import { Capacitor } from '@capacitor/core';

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** MUI Imports
import Button from '@mui/material/Button'
import toast from 'react-hot-toast'
import authConfig from 'src/configs/auth'

import { isSetPasswordForWallet, checkPasswordForWallet, getAllWallets, getWalletBalance, getWalletNicknames, getCurrentWalletAddress, getCurrentWallet, getPrice, sendAmount, getTxsInMemoryXwe, getWalletBalanceReservedRewards, getXweWalletAllTxs, getChivesContacts, searchChivesContacts, setMyAoTokens, getMyAoTokens, getAllAoTokens, setAllAoTokens, deleteMyAoToken, addMyAoToken, getChivesLanguage, setChivesContacts } from 'src/functions/ChivesWallets'
import { BalancePlus, FormatBalance } from 'src/functions/AoConnect/AoConnect'

import { ChivesServerDataGetTokens } from 'src/functions/AoConnect/ChivesServerData'

import { AoTokenBalanceDryRun, AoTokenTransfer, AoTokenInfoDryRun } from 'src/functions/AoConnect/Token'

import { MyProcessTxIdsGetTokens, MyProcessTxIdsAddToken, MyProcessTxIdsDelToken } from 'src/functions/AoConnect/MyProcessTxIds'

import { GetArWalletAllTxs } from 'src/functions/Arweave'

import { getWalletBalanceXcc } from 'src/functions/ChivesCoin'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { formatHash, ansiRegex } from 'src/configs/functions'

import { styled } from '@mui/material/styles'
import Header from '../Layout/Header'
import SetPinKeyboard from '../Layout/SetPinKeyboard'
import CheckPinKeyboard from '../Layout/CheckPinKeyboard'
import ArWallet from './ArWallet'
import AoToken from './AoToken'
import XweAllTxs from './XweAllTxs'
import XweViewTx from './XweViewTx'
import ManageAssets from './ManageAssets'
import SendMoneyInputAmountAO from './SendMoneyInputAmountAO'
import SendMoneyInputAmount from './SendMoneyInputAmount'
import SendMoneySelectContact from './SendMoneySelectContact'
import ReceiveMoney from './ReceiveMoney'
import MainWallet from './MainWallet'
import XweViewFile from './XweViewFile'
import UploadMyFiles from './UploadMyFiles'

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
  const [currentWalletTxsHasNextPage, setCurrentWalletTxsHasNextPage] = useState<any>({'Sent': true, 'Received': true, 'AllTxs': true, 'Files': true})

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
      case 'ViewFile':
      case 'UploadMyFiles':
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
      case 'ViewTx':
        handleClickViewTxReturnButton()
        break;
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
      setLeftIcon('ic:twotone-keyboard-arrow-left')
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
  const [currentTx, setCurrentTx] = useState<any>({}) // Xwe

  const [currentAddressXcc, setCurrentAddressXcc] = useState<string>("")
  const [currentBalanceXcc, setCurrentBalanceXcc] = useState<string>("")

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
  const [innerWidth, setInnerWidth] = useState<number | string>(0)

  useEffect(() => {
    const handleResize = () => {
      setInnerHeight(window.innerHeight);
      setInnerWidth(window.innerWidth);
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight;

      console.log("windowHeight", windowHeight);
      console.log("documentHeight", documentHeight);
      console.log("innerHeight", innerHeight);
      console.log("innerWidth", innerWidth);
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
      if(window) {
        setInnerWidth(window.innerWidth);
        console.log("innerWidth", window.innerWidth);
      }
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
        const currentBalanceTempAr = await getWalletBalance(currentAddress, 'Ar');
        if(currentBalanceTempAr) {
          setCurrentBalance(Number(currentBalanceTempAr).toFixed(4).replace(/\.?0*$/, ''))
        }
        if(currentToken == "Ar")  {
          const AoTokenBalanceDryRunData = await AoTokenBalanceDryRun(authConfig.AoTokenProcessTxId, String(currentAddress))
          setCurrentAoBalance(FormatBalance(AoTokenBalanceDryRunData, 12))
          handleGetMySavingTokensData() // Get Balanes For AO Token
        }

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
          console.log("currentWalletTxs allTxs", allTxs)
          setIsDisabledButton(false)
        }
      }

      if(chooseWallet && chooseWallet.xcc && chooseWallet.xcc.addressList && chooseWallet.xcc.addressList.length > 0)  {
        setCurrentAddressXcc(chooseWallet.xcc.addressList[0])
        const getWalletBalanceXccData = await getWalletBalanceXcc(chooseWallet.xcc)
        console.log("getWalletBalanceXccData", getWalletBalanceXccData)
        setCurrentBalanceXcc(getWalletBalanceXccData)
      }

      console.log("chooseWallet", chooseWallet)

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
    if(currentToken == "Ar" && currentAddress && currentAddress.length == 43 && specifyTokenSend && specifyTokenSend.Name && specifyTokenSend.Address && specifyTokenSend.TokenId && encryptWalletDataKey)  {
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

  const handleClickReceiveButton = () => {
    setPageModel('ReceiveMoney')
    setLeftIcon('ic:twotone-keyboard-arrow-left')
    setTitle(t('Receive') as string)
    setRightButtonText(t('') as string)
    setRightButtonIcon('')
  }

  const handleClickReceiveButtonAO = () => {
    setPageModel('ReceiveMoneyAO')
    setLeftIcon('ic:twotone-keyboard-arrow-left')
    setTitle(t('Receive') as string)
    setRightButtonText(t('') as string)
    setRightButtonIcon('')
  }

  const handleClickAllTxsButton = () => {
    if(currentToken == 'Ar') {
      setActiveTab('Sent')
    }
    else {
      setActiveTab('AllTxs')
    }
    setPageModel('AllTxs')
    setLeftIcon('ic:twotone-keyboard-arrow-left')
    setTitle(t('Wallet Txs') as string)
    setRightButtonText(t('') as string)
    setRightButtonIcon('')
    setCurrentWalletTxsCursor({})
    setCurrentWalletTxs(null)
    setPage(0)
    setCurrentWalletTxsHasNextPage({'Sent': true, 'Received': true, 'AllTxs': true, 'Files': true})
  }

  const handleClickViewTxReturnButton = () => {
    setPageModel('AllTxs')
    setLeftIcon('ic:twotone-keyboard-arrow-left')
    setTitle(t('Wallet Txs') as string)
    setRightButtonText(t('') as string)
    setRightButtonIcon('')
    setCurrentWalletTxsCursor({})
    setCurrentWalletTxs(null)
    setPage(0)
    setCurrentWalletTxsHasNextPage({'Sent': true, 'Received': true, 'AllTxs': true, 'Files': true})
  }

  const handleClickSendButton = () => {
    setPageModel('SendMoneySelectContact')
    setLeftIcon('ic:twotone-keyboard-arrow-left')
    setTitle(t('Select Contact') as string)
    setRightButtonText(t('') as string)
    setRightButtonIcon('')
    setSendMoneyAddress(null)
  }

  const handleClickSendButtonAO = () => {
    console.log("chooseToken", chooseToken)
    setPageModel('SendMoneySelectContact')
    setLeftIcon('ic:twotone-keyboard-arrow-left')
    setTitle(t('Select Contact') as string)
    setRightButtonText(t('') as string)
    setRightButtonIcon('')
    setSendMoneyAddress(null)
  }

  const handleClickManageAssetsButton = () => {
    setPageModel('ManageAssets')
    setLeftIcon('ic:twotone-keyboard-arrow-left')
    setTitle(t('Manage Assets') as string)
    setRightButtonText(t('') as string)
    setRightButtonIcon('')
    handleGetAllTokensData()
  }

  const handleClickViewTokenButton = (Token: any) => {
    setPageModel('ViewToken')
    setLeftIcon('ic:twotone-keyboard-arrow-left')
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
    setLeftIcon('ic:twotone-keyboard-arrow-left')
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
    setLeftIcon('ic:twotone-keyboard-arrow-left')
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
    const AoWalletTokenJson = JSON.parse('[{"TokenData":{"Data-Protocol":"ao","Variant":"ao.TN.1","Type":"Message","From-Process":"NYGM5NIrdGdq_h7ySkSt-efftYsO27ZRlO4JMRppYHQ","From-Module":"JdN3ffZQaFE33-s20LSp2uLhm9Z94wnG59aLRnBAecU","Ref_":"490","Release":"ChivesToken","TokenHolders":"60","Denomination":"3","TotalSupply":"21000000.0","Ticker":"AOW","Name":"AoWallet","Logo":"WqlWUAkpKaojk8Z_WRo0jsNb_Zvd5imm2oM-YOlY630","Version":"20240819"},"TokenSort":"100","TokenId":"NYGM5NIrdGdq_h7ySkSt-efftYsO27ZRlO4JMRppYHQ","TokenGroup":"AoWallet"}]')

    const getMyAoTokensData = getMyAoTokens(currentAddress, encryptWalletDataKey)
    const getMyAoTokensDataNew = getMyAoTokensData && getMyAoTokensData.length > 0 ? getMyAoTokensData : AoWalletTokenJson
    if(getMyAoTokensDataNew) {
      setMySavingTokensData(getMyAoTokensDataNew)
    }

    setIsDisabledManageAssets(false)

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

          const dataArrayFilterNew = dataArrayFilter && dataArrayFilter.length > 0 ? dataArrayFilter : AoWalletTokenJson

          setMyAoTokens(currentAddress, dataArrayFilterNew, encryptWalletDataKey)
          setMySavingTokensData(dataArrayFilterNew)

          //console.log("handleGetMySavingTokensData dataArrayFilter", dataArrayFilter)
      }
    }
    catch(e: any) {
      console.log("handleGetMySavingTokensData Error", e)
    }

    handleGetMySavingTokensBalance()

    //handleGetAllTokensData()

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
              <MainWallet
                handleSwitchBlockchain={handleSwitchBlockchain}
                currentToken={currentToken}
                currentTxsInMemory={currentTxsInMemory}
                currentAddress={currentAddress}
                currentAddressXcc={currentAddressXcc}
                currentBalance={currentBalance}
                currentBalanceXwe={currentBalanceXwe}
                currentBalanceXcc={currentBalanceXcc}
                currentBalanceReservedRewards={currentBalanceReservedRewards}
                handleClickReceiveButton={handleClickReceiveButton}
                handleClickAllTxsButton={handleClickAllTxsButton}
                handleClickSendButton={handleClickSendButton}
                currentAoBalance={currentAoBalance}
                mySavingTokensData={mySavingTokensData}
                myAoTokensBalance={myAoTokensBalance}
                handleClickViewTokenButton={handleClickViewTokenButton}
                isDisabledManageAssets={isDisabledManageAssets}
                handleClickManageAssetsButton={handleClickManageAssetsButton}
                isDisabledButton={isDisabledButton}
                setCurrentTx={setCurrentTx}
                setPageModel={setPageModel}
                setLeftIcon={setLeftIcon}
                setTitle={setTitle}
                setRightButtonIcon={setRightButtonIcon}
                encryptWalletDataKey={encryptWalletDataKey}
              />
            :
              <Fragment></Fragment>
            }

            {pageModel == 'AllTxs' && currentToken == "Xwe" && (
              <XweAllTxs
                currentWalletTxs={currentWalletTxs}
                isDisabledButton={isDisabledButton}
                currentAddress={currentAddress}
                handleChangeActiveTab={handleChangeActiveTab}
                activeTab={activeTab}
                setCurrentTx={setCurrentTx}
                setPageModel={setPageModel}
                />
            )}

            {pageModel == 'ViewTx' && currentToken == "Xwe" && currentTx && (
              <XweViewTx
                currentTx={currentTx}
                currentAddress={currentAddress}
                currentToken={currentToken}
                page={page}
                setPage={setPage}
                innerWidth={innerWidth}
                />
            )}

            {pageModel == 'ViewFile' && currentToken == "Xwe" && currentTx && (
              <XweViewFile
                currentTx={currentTx}
                currentAddress={currentAddress}
                currentToken={currentToken}
                page={page}
                setPage={setPage}
                innerWidth={innerWidth}
                />
            )}

            {pageModel == 'UploadMyFiles' && currentToken == "Xwe" && currentTx && (
              <UploadMyFiles
                currentAddress={currentAddress}
                chooseWallet={chooseWallet}
                handleWalletGoHome={handleWalletGoHome}
                encryptWalletDataKey={encryptWalletDataKey}
                setLeftIcon={setLeftIcon}
                setDisabledFooter={setDisabledFooter}
              />
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
              <ReceiveMoney
                currentAddress={currentAddress}
                currentToken={currentToken}
              />
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
              <SendMoneySelectContact
                searchContactkeyWord={searchContactkeyWord}
                setSearchContactkeyWord={setSearchContactkeyWord}
                setContactsAll={setContactsAll}
                searchChivesContacts={searchChivesContacts}
                encryptWalletDataKey={encryptWalletDataKey}
                contactsAll={contactsAll}
                handleSelectAddress={handleSelectAddress}
              />
            )}

            {pageModel == 'SendMoneyInputAmount' && sendMoneyAddress && (
              <SendMoneyInputAmount
                sendMoneyAddress={sendMoneyAddress}
                isDisabledButton={isDisabledButton}
                sendMoneyAmount={sendMoneyAmount}
                setSendMoneyAmount={setSendMoneyAmount}
                currentToken={currentToken}
                currentBalance={currentBalance}
                currentBalanceXwe={currentBalanceXwe}
                currentBalanceXcc={currentBalanceXcc}
                currentFee={currentFee}
                handleWalletSendMoney={handleWalletSendMoney}
                uploadingButton={uploadingButton}
              />
            )}

            {(pageModel == 'SendMoneyInputAmountAO' || pageModel == 'SendMoneyInputAmountAOFaucet') && sendMoneyAddress && (
               <SendMoneyInputAmountAO
                sendMoneyAddress={sendMoneyAddress}
                isDisabledButton={isDisabledButton}
                sendMoneyAmount={sendMoneyAmount}
                setSendMoneyAmount={setSendMoneyAmount}
                chooseTokenBalance={chooseTokenBalance}
                currentFeeAO={currentFeeAO}
                chooseToken={chooseToken}
                handleWalletSendMoneyAO={handleWalletSendMoneyAO}
                uploadingButton={uploadingButton}
               />
            )}

            {pageModel == 'ManageAssets' && (
              <ManageAssets
                searchAssetkeyWord={searchAssetkeyWord}
                setSearchAssetkeyWord={setSearchAssetkeyWord}
                mySavingTokensData={mySavingTokensData}
                handleSearchAssets={handleSearchAssets}
                handleSelectDeleteMyToken={handleSelectDeleteMyToken}
                handleGetLeftAllTokens={handleGetLeftAllTokens}
                allTokensData={allTokensData}
                handleSelectTokenAndSave={handleSelectTokenAndSave}
                searchAssetOnChain={searchAssetOnChain}
                isDisabledButton={isDisabledButton}
              />
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
