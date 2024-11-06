// ** React Imports
import { useState, useEffect, Fragment } from 'react'
import { Clipboard } from '@capacitor/clipboard';

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import authConfig from '../../configs/auth'
import CustomAvatar from '../../@core/components/mui/avatar'
import Icon from '../../@core/components/icon'
import Divider from '@mui/material/Divider'
import Backdrop from '@mui/material/Backdrop'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import toast from 'react-hot-toast'
import axios from 'axios'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { styled } from '@mui/material/styles'
import Header from '../Layout/Header'
import { formatHash } from '../../configs/functions'
import { FormatBalance } from 'src/functions/AoConnect/AoConnect'

import { getCurrentWalletAddress, getCurrentWallet, getAllAoFaucets, setAllAoFaucets, getMyAoFaucetTokenBalance, setMyAoFaucetTokenBalance, addMyAoToken } from 'src/functions/ChivesWallets'
import { GetAppAvatar, AoTokenBalanceDryRun, AoTokenInfoDryRun } from 'src/functions/AoConnect/Token'
import { AoFaucetGetFaucet, AoFaucetInfo } from 'src/functions/AoConnect/ChivesFaucet'

import { ChivesServerDataGetFaucets } from 'src/functions/AoConnect/ChivesServerData'
import { MyProcessTxIdsAddToken } from 'src/functions/AoConnect/MyProcessTxIds'

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

const Faucet = ({ currentToken, handleSwitchBlockchain, setCurrentTab, setSpecifyTokenSend, encryptWalletDataKey }: any) => {
  // ** Hook
  const { t } = useTranslation()

  const contentHeightFixed = {}

  const [currentAddress, setCurrentAddress] = useState<string>("")
  const [pageModel, setPageModel] = useState<string>('MainFaucet')
  const [HeaderHidden, setHeaderHidden] = useState<boolean>(false)
  const [LeftIcon, setLeftIcon] = useState<string>('')
  const [Title, setTitle] = useState<string>(t('Faucet') as string)
  const [RightButtonText, setRightButtonText] = useState<string>('')
  const [RightButtonIcon, setRightButtonIcon] = useState<string>('')
  const [chooseWallet, setChooseWallet] = useState<any>(null)
  const [chooseFaucet, setChooseFaucet] = useState<any>(null)

  const [allFaucetsData, setAllFaucetsData] = useState<any[]>([])
  const [myFaucetTokenBalanceData, setMyFaucetTokenBalanceData] = useState<any[]>([])
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [isDisabledButtonXwe, setIsDisabledButtonXwe] = useState<any>({GetXweByStakingAr: false, GetXweEveryDay: false})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isRechargeMode, setIsRechargeMode] = useState<boolean>(false)


  const handleWalletGoHome = () => {
    setRefreshWalletData(refreshWalletData+1)
    setPageModel('MainWallet')
    setLeftIcon('material-symbols:menu-rounded')
    setTitle(t('Faucet') as string)
    setRightButtonText(t('QR') as string)
    setRightButtonIcon('solar:dollar-linear')
    setChooseFaucet(null)
    console.log("chooseWallet", chooseWallet)
  }

  const LeftIconOnClick = () => {
    switch(pageModel) {
      case 'FaucetFaucet':
        handleWalletGoHome()
        break
    }
  }


  const RightButtonOnClick = () => {

    if(currentToken == 'Ar')  {
      console.log("chooseFaucet", chooseFaucet)

      if(RightButtonIcon == 'solar:dollar-linear')  {
        setRightButtonIcon('solar:dollar-bold')
        setIsRechargeMode(true)
      }

      if(RightButtonIcon == 'solar:dollar-bold')  {
        setRightButtonIcon('solar:dollar-linear')
        setIsRechargeMode(false)
      }
    }

  }

  const [refreshWalletData, setRefreshWalletData] = useState<number>(0)

  const handleGetAllFaucetsData = async () => {

    const getAllAoFaucetsData = getAllAoFaucets(currentAddress, encryptWalletDataKey)
    if(getAllAoFaucetsData) {
      setAllFaucetsData(getAllAoFaucetsData)
    }
    if(getAllAoFaucetsData.length == 0) {
      setIsDisabledButton(true)
    }
    console.log("getAllAoFaucetsData", getAllAoFaucetsData, currentAddress)

    try {
      const ChivesServerDataGetFaucetsData1 = await ChivesServerDataGetFaucets(authConfig.AoConnectChivesServerTxId, authConfig.AoConnectChivesServerUser)
      if(ChivesServerDataGetFaucetsData1) {
          const dataArray = Object.values(ChivesServerDataGetFaucetsData1);
          dataArray.sort((a: any, b: any) => {
              if (a.FaucetGroup == b.FaucetGroup) {
                  return Number(a.FaucetSort) - Number(b.FaucetSort);
              } else {
                  return a.FaucetGroup.localeCompare(b.FaucetGroup);
              }
          });
          const dataArrayFilter = dataArray.map((Faucet: any)=>({...Faucet, FaucetData: JSON.parse(Faucet.FaucetData.replace(/\\"/g, '"'))}))
          setAllAoFaucets(currentAddress, dataArrayFilter, encryptWalletDataKey)
          setAllFaucetsData(dataArrayFilter)
          console.log("handleGetAllFaucetsData dataArrayFilter", dataArrayFilter)
      }
    }
    catch(e: any) {
      console.log("handleGetAllFaucetsData Error", e)
      setIsDisabledButton(false)
    }

  }

  const handelGetAmountFromXweFaucet = async (Faucet: any) => {
    console.log("Faucet", Faucet)
    if(Faucet.Code == 'GetXweByStakingAr' || Faucet.Code == 'GetXweEveryDay')  {
      setIsDisabledButtonXwe((prevState: any)=>({
        ...prevState,
        [Faucet.Code]: true
      }))
      setIsLoading(true)
      const res = await axios.post('https://faucet.chivesweave.org/faucet.php', { Code: Faucet.Code, Address: currentAddress, Rule: Faucet.Rule, TokenName: Faucet.TokenName, GetAmount: Faucet.GetAmount }).then(res=>res.data);
      try {
        if(res && res.status == "error")  {
          toast.error(t(res.message) as string, {
            duration: 4000
          })
          setIsDisabledButtonXwe((prevState: any)=>({
            ...prevState,
            [Faucet.Code]: true
          }))
        }
        else if(res && res.status == "ok" && res.result == "OK")  {
          toast.success(t(res.message) as string, {
            duration: 2000
          })
          toast.success(t('TxId') + ': ' + formatHash(res.TXID, 8), {
            duration: 2000
          })
          setIsDisabledButtonXwe((prevState: any)=>({
            ...prevState,
            [Faucet.Code]: true
          }))
        }
        else if(res && res.status == "ok" && res.result == "Transaction already processed")  {
          toast.error(t(res.result) as string, {
            duration: 2000
          })
          toast.error(t('TxId') + ': ' + formatHash(res.TXID, 8), {
            duration: 2000
          })
          setIsDisabledButtonXwe((prevState: any)=>({
            ...prevState,
            [Faucet.Code]: true
          }))
        }
        else {
          toast.error(res.result, {
            duration: 2000
          })
          setIsDisabledButtonXwe((prevState: any)=>({
            ...prevState,
            [Faucet.Code]: true
          }))
        }
      }
      catch(Error: any) {
        console.log("handelGetAmountFromXweFaucet", Error)
      }
      setIsLoading(false)
      console.log("Faucet Res", res)
    }
  }

  const handelGetAmountFromFaucet = async (Faucet: any) => {
    if( chooseWallet && chooseWallet.jwk && Faucet && Faucet.FaucetId && currentAddress.length == 43 )   {
      setIsDisabledButton(true)

      const GetFaucetFromFaucetTokenId: any = await AoFaucetGetFaucet(chooseWallet.jwk, Faucet.FaucetId)
      console.log("GetFaucetFromFaucetTokenId", GetFaucetFromFaucetTokenId)
      if(GetFaucetFromFaucetTokenId && GetFaucetFromFaucetTokenId.status == 'ok' && GetFaucetFromFaucetTokenId.msg && GetFaucetFromFaucetTokenId.msg.Error) {
        toast.error(GetFaucetFromFaucetTokenId.msg.Error, {
          duration: 2500
        })
        setIsDisabledButton(false)

        return
      }
      if(GetFaucetFromFaucetTokenId && GetFaucetFromFaucetTokenId.status == 'error') {
        toast.error(GetFaucetFromFaucetTokenId.msg, {
          duration: 2500
        })
        setIsDisabledButton(false)

        return
      }
      if(GetFaucetFromFaucetTokenId?.msg?.Messages && GetFaucetFromFaucetTokenId?.msg?.Messages.length == 1) {
        const Messages = GetFaucetFromFaucetTokenId?.msg?.Messages
        if(Messages[0].Tags && Messages[0].Tags[6] && Messages[0].Tags[6].name == 'Error')  {
          toast.error(Messages[0].Tags[6].value, {
            duration: 2500
          })
          setIsDisabledButton(false)

          return
        }
      }
      if(GetFaucetFromFaucetTokenId?.msg?.Messages && GetFaucetFromFaucetTokenId?.msg?.Messages[4]?.Data) {
        console.log("GetFaucetFromFaucetTokenId", GetFaucetFromFaucetTokenId?.msg?.Messages[4]?.Data)
        toast.success(GetFaucetFromFaucetTokenId?.msg?.Messages[4]?.Data, {
          duration: 2000
        })

        const AoFaucetInfoData = await AoFaucetInfo(Faucet.FaucetId)
        console.log("AoFaucetInfoData AoFaucetInfo", AoFaucetInfoData)

        //Get my wallet address balance
        const AoDryRunBalance: any = await AoTokenBalanceDryRun(AoFaucetInfoData.FaucetTokenId, currentAddress);
        if (AoDryRunBalance && AoFaucetInfoData) {
          const getMyAoFaucetTokenBalanceData = getMyAoFaucetTokenBalance(currentAddress, encryptWalletDataKey);
          const AoDryRunBalanceCoin = FormatBalance(AoDryRunBalance, AoFaucetInfoData.Denomination ? AoFaucetInfoData.Denomination : '12');
          const AoDryRunBalanceCoinFormat = Number(AoDryRunBalanceCoin) > 0 ? Number(AoDryRunBalanceCoin).toFixed(4).replace(/\.?0*$/, '') : 0;
          setMyAoFaucetTokenBalance(currentAddress, {...getMyAoFaucetTokenBalanceData, [AoFaucetInfoData.FaucetTokenId]: AoDryRunBalanceCoinFormat}, encryptWalletDataKey); // Immediately update the local storage balance
          console.log("AoDryRunBalanceCoinFormat1-1", AoFaucetInfoData.FaucetTokenId, AoDryRunBalanceCoinFormat)
          setMyFaucetTokenBalanceData((prevState: any)=>({
            ...prevState,
            [AoFaucetInfoData.FaucetTokenId]: AoDryRunBalanceCoinFormat
          }))
        }

        //Get faucet address balance
        const AoDryRunFaucetBalance: any = await AoTokenBalanceDryRun(AoFaucetInfoData.FaucetTokenId, Faucet.FaucetId);
        if (AoDryRunFaucetBalance && Faucet) {
          const getMyAoFaucetTokenBalanceData = getMyAoFaucetTokenBalance(currentAddress, encryptWalletDataKey);
          const AoDryRunBalanceCoin = FormatBalance(AoDryRunFaucetBalance, AoFaucetInfoData.Denomination ? AoFaucetInfoData.Denomination : '12');
          const AoDryRunBalanceCoinFormat = Number(AoDryRunBalanceCoin) > 0 ? Number(AoDryRunBalanceCoin).toFixed(4).replace(/\.?0*$/, '') : 0;
          setMyAoFaucetTokenBalance(currentAddress, {...getMyAoFaucetTokenBalanceData, [Faucet.FaucetId]: AoDryRunBalanceCoinFormat}, encryptWalletDataKey); // Immediately update the local storage balance
          console.log("AoDryRunBalanceCoinFormat2-2", Faucet.FaucetId, AoDryRunBalanceCoinFormat)
          setMyFaucetTokenBalanceData((prevState: any)=>({
            ...prevState,
            [Faucet.FaucetId]: AoDryRunBalanceCoinFormat
          }))
        }

        //Add faucet token to my favorite
        const Token: any = await AoTokenInfoDryRun(AoFaucetInfoData.FaucetTokenId)
        if(Token) {
          handleSelectTokenAndSave({TokenId: AoFaucetInfoData.FaucetTokenId, ...Token, TokenData: Token}, Token)
          console.log("TokenId", {TokenId: AoFaucetInfoData.FaucetTokenId, ...Token, TokenData: Token})
        }

      }
      setIsDisabledButton(false)

    }
    else {
      console.log("GetFaucetFromFaucetTokenId chooseWallet", chooseWallet)
    }
  }

  const handelSendAmountToFaucet = async (Faucet: any) => {
    const TokenId = Faucet.FaucetData.FaucetTokenId
    setCurrentTab('Wallet')
    setSpecifyTokenSend({Name: 'Add Token To Faucet', TokenId: TokenId, Address: Faucet.FaucetId})
  }

  const handleGetMyFaucetTokenBalance = async () => {

    const getMyAoFaucetTokenBalanceData = getMyAoFaucetTokenBalance(currentAddress, encryptWalletDataKey);
    if(getMyAoFaucetTokenBalanceData) {
      setMyFaucetTokenBalanceData(getMyAoFaucetTokenBalanceData)
    }
    try {
      if (allFaucetsData) {
        Promise.any(
          allFaucetsData.map(async (Faucet: any) => {
            try {

              //Get my wallet address balance
              const AoDryRunBalance = await AoTokenBalanceDryRun(Faucet.FaucetData.FaucetTokenId, currentAddress);
              if (AoDryRunBalance && Faucet) {
                const AoDryRunBalanceCoin = FormatBalance(AoDryRunBalance, Faucet.FaucetData.Denomination ? Faucet.FaucetData.Denomination : '12');
                const AoDryRunBalanceCoinFormat = Number(AoDryRunBalanceCoin) > 0 ? Number(AoDryRunBalanceCoin).toFixed(4).replace(/\.?0*$/, '') : 0;
                console.log("AoDryRunBalanceCoinFormat1", AoDryRunBalanceCoinFormat)
                setMyFaucetTokenBalanceData((prevState: any)=>{
                  const TempData = { ...prevState, [Faucet.FaucetData.FaucetTokenId]: AoDryRunBalanceCoinFormat }
                  setMyAoFaucetTokenBalance(currentAddress, TempData, encryptWalletDataKey); // Immediately update the local storage balance

                  return TempData
                })
              }

              //Get faucet address balance
              const AoDryRunFaucetBalance = await AoTokenBalanceDryRun(Faucet.FaucetData.FaucetTokenId, Faucet.FaucetId);
              if (AoDryRunFaucetBalance && Faucet) {
                const AoDryRunBalanceCoin = FormatBalance(AoDryRunFaucetBalance, Faucet.FaucetData.Denomination ? Faucet.FaucetData.Denomination : '12');
                const AoDryRunBalanceCoinFormat = Number(AoDryRunBalanceCoin) > 0 ? Number(AoDryRunBalanceCoin).toFixed(4).replace(/\.?0*$/, '') : 0;
                setMyAoFaucetTokenBalance(currentAddress, {...getMyAoFaucetTokenBalanceData, [Faucet.FaucetId]: AoDryRunBalanceCoinFormat}, encryptWalletDataKey); // Immediately update the local storage balance
                console.log("AoDryRunBalanceCoinFormat2", AoDryRunBalanceCoinFormat)
                setMyFaucetTokenBalanceData((prevState: any)=>({
                  ...prevState,
                  [Faucet.FaucetId]: AoDryRunBalanceCoinFormat
                }))
                setMyFaucetTokenBalanceData((prevState: any)=>{
                  const TempData = { ...prevState, [Faucet.FaucetId]: AoDryRunBalanceCoinFormat }
                  setMyAoFaucetTokenBalance(currentAddress, TempData, encryptWalletDataKey); // Immediately update the local storage balance

                  return TempData
                })
              }
              setIsDisabledButton(false)

            } catch (error) {
              console.error(`Error processing Faucet.FaucetId ${Faucet.FaucetId}:`, error);
            }
          })
        ).catch((error) => {
          console.error("All promises failed:", error);
        });
      }
    }
    catch (e: any) {
      console.log("handleGetMySavingTokensBalance Error", e);
    }

  }

  const handleSelectTokenAndSave = async (Token: any, TokenData: any) => {
    const WantToSaveTokenProcessTxIdData = await MyProcessTxIdsAddToken(chooseWallet.jwk, authConfig.AoConnectMyProcessTxIds, Token.TokenId, '100', TokenData.Name, JSON.stringify(TokenData) )
    if(WantToSaveTokenProcessTxIdData?.msg?.Messages && WantToSaveTokenProcessTxIdData?.msg?.Messages[0]?.Data)  {
      toast.success(t(WantToSaveTokenProcessTxIdData?.msg?.Messages[0]?.Data) as string, { duration: 2500, position: 'top-center' })
      addMyAoToken(currentAddress, Token, encryptWalletDataKey)
    }
  }


  useEffect(() => {

    setHeaderHidden(false)

    if(currentToken == 'Ar')  {
      setRightButtonIcon('solar:dollar-linear')
    }

    const currentAddressTemp = getCurrentWalletAddress(encryptWalletDataKey)
    setCurrentAddress(String(currentAddressTemp))

    const getCurrentWalletTemp = getCurrentWallet(encryptWalletDataKey)
    setChooseWallet(getCurrentWalletTemp)

    if(currentAddress && currentAddress.length == 43) {
      handleGetAllFaucetsData()
    }

  }, [currentAddress]);

  useEffect(() => {
    if(allFaucetsData && allFaucetsData.length > 0) {
      handleGetMyFaucetTokenBalance()
    }
  }, [allFaucetsData]);

  const ChivesweaveFaucetList = [
    {
      'Code': 'GetXweEveryDay',
      'Project': 'Get Xwe Every Day',
      'TokenName': 'Chivesweave',
      'ShortName': 'Xwe',
      'Rule': 'EveryDay',
      'GetAmount': '0.1 Xwe',
      'Requirement': 'None'
    },
    {
      'Code': 'GetXweByStakingAr',
      'Project': 'Get Xwe when you have Ar',
      'TokenName': 'Chivesweave',
      'ShortName': 'Xwe',
      'Rule': 'EveryDay',
      'GetAmount': '1 Xwe',
      'Requirement': 'Balance more than 0.1 Ar'
    }
  ]


  return (
    <Fragment>
      <Header Hidden={HeaderHidden} LeftIcon={LeftIcon} LeftIconOnClick={LeftIconOnClick} Title={Title} RightButtonText={RightButtonText} RightButtonOnClick={RightButtonOnClick} RightButtonIcon={RightButtonIcon}/>

      <Box
        component="main"
        sx={{
          flex: 1,
          overflowY: 'auto',
          marginTop: '35px', // Adjust according to the height of the AppBar
          marginBottom: '56px', // Adjust according to the height of the Footer
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

              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ py: 0 }}>
                  <Card>
                    <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1}} onClick={()=>{handleSwitchBlockchain()}}>
                      <CustomAvatar
                        skin='light'
                        color={'primary'}
                        sx={{ mr: 0, width: 43, height: 43 }}
                        src={'https://web.aowallet.org/images/logo/' + currentToken + '.png'}
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
                        <Typography
                          sx={{
                            color: 'text.primary',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            textAlign: 'left'
                          }}
                        >
                          {currentToken == 'Ar' ? 'Arweave' : 'Chivesweave'}
                        </Typography>
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
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} sx={{height: '100%'}}>
                  <Grid container spacing={2}>
                    {currentToken == 'Ar' && allFaucetsData && allFaucetsData.map((Faucet: any, Index: number) => {

                      let isShow = false
                      if(isRechargeMode == false && Number(myFaucetTokenBalanceData[Faucet.FaucetId]) >= Number(Faucet.FaucetData.FaucetAmount)) {
                        isShow = true
                      }
                      if(isRechargeMode == true) {
                        isShow = true
                      }

                      return (
                        <Fragment key={Index}>
                          { isShow && (
                            <Grid item xs={12} sx={{ py: 2 }}>
                              <Card>
                                <CardContent>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CustomAvatar
                                      skin='light'
                                      color={'primary'}
                                      sx={{ mr: 3, width: 38, height: 38, fontSize: '1.5rem' }}
                                      src={GetAppAvatar(Faucet.FaucetData.Logo)}
                                    >
                                    </CustomAvatar>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                      <Typography sx={{ fontWeight: 600 }}>{Faucet.FaucetData.Name}</Typography>
                                      <Typography variant='caption' sx={{ letterSpacing: '0.4px', cursor: 'pointer' }} onClick={async ()=>{
                                        await Clipboard.write({
                                          string: Faucet.FaucetData.FaucetTokenId
                                        });
                                      }}>
                                        {formatHash(Faucet.FaucetData.FaucetTokenId, 12)}
                                      </Typography>
                                      <Typography variant='caption' sx={{ letterSpacing: '0.4px' }}>
                                        {t('My Balance')}: {myFaucetTokenBalanceData[Faucet.FaucetData.FaucetTokenId] ?? ''}
                                      </Typography>
                                    </Box>
                                  </Box>

                                  <Divider
                                    sx={{ mb: theme => `${theme.spacing(4)} !important`, mt: theme => `${theme.spacing(4.75)} !important` }}
                                  />

                                  <Box sx={{ mb: 2, display: 'flex', '& svg': { mr: 3, mt: 1, fontSize: '1.375rem', color: 'text.secondary' } }}>
                                    <Icon icon='mdi:clock-time-three-outline' />
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                      <Typography sx={{ fontSize: '0.875rem', py: 1 }}>{t('Rule') as string}: {Faucet.FaucetData.FaucetRule}</Typography>
                                    </Box>
                                  </Box>

                                  <Box sx={{ mb: 2, display: 'flex', '& svg': { mr: 3, mt: 1, fontSize: '1.375rem', color: 'text.secondary' } }}>
                                    <Icon icon='mdi:dollar' />
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                      <Typography sx={{ fontSize: '0.875rem', py: 0.8 }}>{t('Get Amount') as string}: {Faucet.FaucetData.FaucetAmount
                                      }</Typography>
                                    </Box>
                                  </Box>

                                  <Box sx={{ mb: 2, display: 'flex', '& svg': { mr: 3, mt: 1, fontSize: '1.375rem', color: 'text.secondary' } }}>
                                    <Icon icon='streamline:bag-dollar-solid' />
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                      <Typography sx={{ fontSize: '0.875rem', py: 0.8 }}>{t('Faucet Balance') as string}: {myFaucetTokenBalanceData[Faucet.FaucetId] ?? ''}</Typography>
                                      {Number(myFaucetTokenBalanceData[Faucet.FaucetId]) < Number(Faucet.FaucetData.FaucetAmount) && (
                                        <Typography sx={{ fontSize: '0.875rem', py: 0.8, color: 'error.main' }}>{t('Insufficient balance') as string}, {t('At least') as string}: {Faucet.FaucetData.FaucetAmount}</Typography>
                                      )}
                                    </Box>
                                  </Box>

                                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Box sx={{ '& svg': { mr: 3, mt: 1, fontSize: '1.375rem', color: 'text.secondary' } }}>
                                        {isRechargeMode == false && Number(myFaucetTokenBalanceData[Faucet.FaucetId]) >= Number(Faucet.FaucetData.FaucetAmount) && (
                                          <Button disabled={isDisabledButton} sx={{ textTransform: 'none', mt: 3, ml: 2 }} size="small" variant='outlined' onClick={() => handelGetAmountFromFaucet(Faucet)}>
                                              {t('Get Faucet') as string}
                                          </Button>
                                        )}
                                        {isRechargeMode == true && (
                                          <Button disabled={isDisabledButton} sx={{ textTransform: 'none', mt: 3, ml: 2 }} size="small" variant='contained' onClick={() => handelSendAmountToFaucet(Faucet)}>
                                              {t('Send amount to faucet') as string}
                                          </Button>
                                        )}
                                    </Box>
                                  </Box>

                                </CardContent>
                              </Card>
                            </Grid>
                          )}
                        </Fragment>
                      )

                    })}

                    {currentToken == 'Xwe' && ChivesweaveFaucetList && ChivesweaveFaucetList.map((Faucet: any, Index: number) => {

                    return (
                      <Fragment key={Index}>
                        { true && (
                          <Grid item xs={12} sx={{ py: 2 }}>
                            <Card>
                              <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <CustomAvatar
                                    skin='light'
                                    color={'primary'}
                                    sx={{ mr: 3, width: 38, height: 38, fontSize: '1.5rem' }}
                                    src={'https://web.aowallet.org/images/logo/Xwe.png'}
                                  >
                                  </CustomAvatar>
                                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography sx={{ fontWeight: 600 }}>{Faucet.Project}</Typography>
                                    <Typography variant='caption' sx={{ letterSpacing: '0.4px', cursor: 'pointer' }}>
                                      {formatHash(currentAddress, 8)}
                                    </Typography>
                                  </Box>
                                </Box>

                                <Divider
                                  sx={{ mb: theme => `${theme.spacing(4)} !important`, mt: theme => `${theme.spacing(4.75)} !important` }}
                                />

                                <Box sx={{ mb: 2, display: 'flex', '& svg': { mr: 3, mt: 1, fontSize: '1.375rem', color: 'text.secondary' } }}>
                                  <Icon icon='f7:money-dollar-circle' />
                                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography sx={{ fontSize: '0.875rem', py: 0.8 }}>{t('Get Amount') as string}: {Faucet.GetAmount}</Typography>
                                  </Box>
                                </Box>

                                <Box sx={{ mb: 2, display: 'flex', '& svg': { mr: 3, mt: 1, fontSize: '1.375rem', color: 'text.secondary' } }}>
                                  <Icon icon='mdi:clock-time-three-outline' />
                                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography sx={{ fontSize: '0.875rem', py: 1 }}>{t('Rule') as string}: {Faucet.Rule}</Typography>
                                  </Box>
                                </Box>

                                {Faucet.Requirement && (
                                  <Box sx={{ display: 'flex', '& svg': { mr: 3, mt: 1, fontSize: '1.375rem', color: 'text.secondary' } }}>
                                    <Icon icon='material-symbols:money-bag-outline' />
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                      <Typography sx={{ fontSize: '0.875rem', py: 0.8 }}>{t('Requirement') as string}: {Faucet.Requirement}</Typography>
                                    </Box>
                                  </Box>
                                )}

                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                  <Box sx={{ '& svg': { mr: 3, mt: 1, fontSize: '1.375rem', color: 'text.secondary' } }}>
                                    <Button disabled={isDisabledButtonXwe[Faucet.Code]} sx={{ textTransform: 'none', mt: 3, ml: 2 }} size="small" variant='outlined' onClick={() => handelGetAmountFromXweFaucet(Faucet)}>
                                        {t('Get Xwe') as string}
                                    </Button>
                                  </Box>
                                </Box>

                              </CardContent>
                            </Card>
                          </Grid>
                        )}
                      </Fragment>
                    )

                    })}
                  </Grid>
                  <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={isLoading}
                  >
                    <CircularProgress color="inherit" size={45}/>
                  </Backdrop>
                </Grid>
              </Grid>

        </ContentWrapper>
      </Box>
    </Fragment>
  )
}

export default Faucet
