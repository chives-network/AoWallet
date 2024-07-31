// ** React Imports
import { useState, useEffect, Fragment } from 'react'

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

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { styled } from '@mui/material/styles'
import Header from '../Layout/Header'
import { formatHash } from '../../configs/functions'
import { FormatBalance } from '../../functions/AoConnect/AoConnect'

import { getCurrentWalletAddress, getCurrentWallet, getAllAoFaucets, setAllAoFaucets, getMyAoFaucetTokenBalance, setMyAoFaucetTokenBalance } from '../../functions/ChivesWallets'
import { GetAppAvatar, AoTokenBalanceDryRun } from '../../functions/AoConnect/Token'
import { AoFaucetGetFaucet, AoFaucetInfo } from '../../functions/AoConnect/ChivesFaucet'

import { ChivesServerDataGetFaucets } from '../../functions/AoConnect/ChivesServerData'

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

const Faucet = ({ setCurrentTab }: any) => {
  // ** Hook
  const { t } = useTranslation()

  const contentHeightFixed = {}

  const [currentAddress, setCurrentAddress] = useState<string>("")
  const [pageModel, setPageModel] = useState<string>('MainFaucet')
  const [HeaderHidden, setHeaderHidden] = useState<boolean>(false)
  const [LeftIcon, setLeftIcon] = useState<string>('')
  const [Title, setTitle] = useState<string>('Faucet')
  const [RightButtonText, setRightButtonText] = useState<string>('')
  const [RightButtonIcon, setRightButtonIcon] = useState<string>('')
  const [chooseWallet, setChooseWallet] = useState<any>(null)
  const [chooseFaucet, setChooseFaucet] = useState<any>(null)
  const [faucetBalance, setFaucetBalance] = useState<any>({})
  const [myTokenBalance, setMyTokenBalance] = useState<any>({})

  const [allFaucetsData, setAllFaucetsData] = useState<any[]>([])
  const [myFaucetTokenBalanceData, setMyFaucetTokenBalanceData] = useState<any[]>([])
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
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

    console.log("chooseFaucet", chooseFaucet)

    if(RightButtonIcon == 'solar:dollar-linear')  {
      setRightButtonIcon('solar:dollar-bold')
      setIsRechargeMode(true)
    }

    if(RightButtonIcon == 'solar:dollar-bold')  {
      setRightButtonIcon('solar:dollar-linear')
      setIsRechargeMode(false)
    }

    //handleWalletGoHome()
    
  }

  const [refreshWalletData, setRefreshWalletData] = useState<number>(0)

  const handleGetAllFaucetsData = async () => {

    const getAllAoFaucetsData = getAllAoFaucets(currentAddress)
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
          setAllAoFaucets(currentAddress, dataArrayFilter)
          setAllFaucetsData(dataArrayFilter)
          console.log("handleGetAllFaucetsData dataArrayFilter", dataArrayFilter)
      }
    }
    catch(e: any) {
      console.log("handleGetAllFaucetsData Error", e)      
    }

    setIsDisabledButton(false)

  }

  const handelGetAmountFromFaucet = async (Faucet: any) => {
    if( chooseWallet && chooseWallet.jwk && Faucet && Faucet.FaucetId && currentAddress.length == 43 )   {
      setIsDisabledButton(true)

      const GetFaucetFromFaucetTokenId: any = await AoFaucetGetFaucet(chooseWallet.jwk, Faucet.FaucetId)
      if(GetFaucetFromFaucetTokenId && GetFaucetFromFaucetTokenId.msg && GetFaucetFromFaucetTokenId.msg.Error) {
        toast.error(GetFaucetFromFaucetTokenId.msg.Error, {
          duration: 2500
        })
        setIsDisabledButton(false)

        return
      }
      if(GetFaucetFromFaucetTokenId?.msg?.Messages && GetFaucetFromFaucetTokenId?.msg?.Messages[4]?.Data) {
        console.log("GetFaucetFromFaucetTokenId", GetFaucetFromFaucetTokenId?.msg?.Messages[4]?.Data)
        toast.success(GetFaucetFromFaucetTokenId?.msg?.Messages[4]?.Data, {
          duration: 2000
        })

        const AoFaucetInfoData = await AoFaucetInfo(Faucet.FaucetId)
        console.log("AoFaucetInfoData AoFaucetInfo", AoFaucetInfoData)

        const AoDryRunBalance = await AoTokenBalanceDryRun(AoFaucetInfoData.FaucetTokenId, currentAddress);
        if(AoDryRunBalance && AoFaucetInfoData) {
          console.log("AoDryRunBalance", AoDryRunBalance)
          setMyTokenBalance((prevState: any)=>({
              ...prevState,
              [AoFaucetInfoData.FaucetTokenId]: FormatBalance(AoDryRunBalance, AoFaucetInfoData.Denomination)
          }))
        }

        const AoDryRunBalanceFaucet = await AoTokenBalanceDryRun(AoFaucetInfoData.FaucetTokenId, Faucet.FaucetId);
        if(AoDryRunBalanceFaucet && AoFaucetInfoData) {
          console.log("AoDryRunBalanceFaucet", AoDryRunBalanceFaucet)
          setFaucetBalance((prevState: any)=>({
              ...prevState,
              [Faucet.FaucetId]: FormatBalance(AoDryRunBalanceFaucet, AoFaucetInfoData.Denomination)
          }))
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
  }

  const handleGetMyFaucetTokenBalance = async () => {

    const getMyAoFaucetTokenBalanceData = getMyAoFaucetTokenBalance(currentAddress);
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
                setMyAoFaucetTokenBalance(currentAddress, {...getMyAoFaucetTokenBalanceData, [Faucet.FaucetData.FaucetTokenId]: AoDryRunBalanceCoinFormat}); // Immediately update the local storage balance
                console.log("AoDryRunBalanceCoinFormat1", AoDryRunBalanceCoinFormat)
                setMyFaucetTokenBalanceData((prevState: any)=>({
                  ...prevState, 
                  [Faucet.FaucetData.FaucetTokenId]: AoDryRunBalanceCoinFormat
                }))
              }

              //Get faucet address balance
              const AoDryRunFaucetBalance = await AoTokenBalanceDryRun(Faucet.FaucetData.FaucetTokenId, Faucet.FaucetId);
              if (AoDryRunFaucetBalance && Faucet) {
                const AoDryRunBalanceCoin = FormatBalance(AoDryRunFaucetBalance, Faucet.FaucetData.Denomination ? Faucet.FaucetData.Denomination : '12');
                const AoDryRunBalanceCoinFormat = Number(AoDryRunBalanceCoin) > 0 ? Number(AoDryRunBalanceCoin).toFixed(4).replace(/\.?0*$/, '') : 0;
                setMyAoFaucetTokenBalance(currentAddress, {...getMyAoFaucetTokenBalanceData, [Faucet.FaucetId]: AoDryRunBalanceCoinFormat}); // Immediately update the local storage balance
                console.log("AoDryRunBalanceCoinFormat2", AoDryRunBalanceCoinFormat)
                setMyFaucetTokenBalanceData((prevState: any)=>({
                  ...prevState, 
                  [Faucet.FaucetId]: AoDryRunBalanceCoinFormat
                }))
              }

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


  useEffect(() => {    

    setHeaderHidden(false)
    setRightButtonIcon('solar:dollar-linear')

    const currentAddressTemp = getCurrentWalletAddress()
    setCurrentAddress(String(currentAddressTemp))

    const getCurrentWalletTemp = getCurrentWallet()
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
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{height: '100%'}}>
                  <Grid container spacing={2}>
                    {allFaucetsData && allFaucetsData.map((Faucet: any, Index: number) => {

                      let isShow = false
                      if(isRechargeMode == false && Number(myFaucetTokenBalanceData[Faucet.FaucetId]) >= Number(Faucet.FaucetData.FaucetAmount)) {
                        isShow = true
                      }
                      if(isRechargeMode == true) {
                        isShow = true
                      }

                      return (
                        <>
                          { isShow && (
                            <Grid item xs={12} sx={{ py: 2 }} key={Index}>
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
                                      <Typography variant='caption' sx={{ letterSpacing: '0.4px' }}>
                                        {formatHash(Faucet.FaucetData.FaucetTokenId, 12)}
                                      </Typography>
                                      <Typography variant='caption' sx={{ letterSpacing: '0.4px' }}>
                                        {t('Balance')}: {myTokenBalance[Faucet.FaucetData.FaucetTokenId] ?? myFaucetTokenBalanceData[Faucet.FaucetData.FaucetTokenId] ?? ''}
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
                                      <Typography sx={{ fontSize: '0.875rem', py: 0.8 }}>{t('Faucet Balance') as string}: {faucetBalance[Faucet.FaucetId] ?? myFaucetTokenBalanceData[Faucet.FaucetId] ?? ''}</Typography>
                                    </Box>
                                  </Box>

                                  <Box sx={{ display: 'flex', '& svg': { mr: 3, mt: 1, fontSize: '1.375rem', color: 'text.secondary' } }}>
                                    <Icon icon='material-symbols:info-outline' />
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                      <Typography sx={{ fontSize: '0.875rem', py: 0.8 }}>{t('Version') as string}: {Faucet.FaucetData.Version}</Typography>
                                    </Box>
                                  </Box>

                                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Box sx={{ '& svg': { mr: 3, mt: 1, fontSize: '1.375rem', color: 'text.secondary' } }}>
                                        {isRechargeMode == false && (
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
                        </>
                      )

                    })}
                  </Grid>
                  <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={isDisabledButton}
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
