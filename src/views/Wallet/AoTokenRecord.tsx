
import { useState, useEffect, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Tab from '@mui/material/Tab'

// ** MUI Imports
import Icon from 'src/@core/components/icon'
import authConfig from 'src/configs/auth'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { formatHash, formatTimestamp } from 'src/configs/functions'

import Tabs from '@mui/material/Tabs';
import { GetAppAvatar } from 'src/functions/AoConnect/MsgReminder'

import { BigNumber } from 'bignumber.js'
import { ansiRegex } from 'src/configs/functions'

import { AoLoadBlueprintToken, AoTokenTransfer, AoTokenMint, AoTokenAirdrop, AoTokenBalanceDryRun, AoTokenBalancesDryRun, AoTokenBalancesPageDryRun, AoTokenInfoDryRun, AoTokenAllTransactions, AoTokenSentTransactions, AoTokenReceivedTransactions, AoTokenMyAllTransactions, GetTokenAvatar } from 'src/functions/AoConnect/Token'
import { AoCreateProcessAuto, FormatBalance, sleep, isOwner } from 'src/functions/AoConnect/AoConnect'

const AoTokenRecord = ({ currentWalletTxs, isDisabledButton, currentAddress, handleChangeActiveTab, activeTab, currentWalletTxsHasNextPage, chooseToken, myAoTokensBalance } : any) => {

    const { t } = useTranslation()

    let currentWalletTxsData: any = null
    if(currentWalletTxs && currentWalletTxs[activeTab])  {
      currentWalletTxsData = currentWalletTxs[activeTab]
    }

    const TokenId = chooseToken.TokenId
    let TokenData: any = {}
    try {
        TokenData = JSON.parse(chooseToken.TokenData.replace(/\\"/g, '"'))
        TokenData = {...TokenData, TokenId: chooseToken.TokenId}
    }
    catch(e: any) {
        console.log("allTokensData Error", e)
    }
    console.log("chooseToken", TokenData, myAoTokensBalance)

    const [isOwnerStatus, setIsOwnerStatus] = useState<boolean>(false)

    const [tokenListAction, setTokenListAction] = useState<string>("Holders")
    const [tokenListModel, setTokenListModel] = useState<string>("ChivesToken")
    const [pageId, setPageId] = useState<number>(1)
    const [pageCount, setPageCount] = useState<number>(0)
    const [startIndex, setStartIndex] = useState<number>(1)
    const [endIndex, setEndIndex] = useState<number>(10)
    const pageSize = 10

    const [holdersNumber, setHoldersNumber] = useState<number>(0)
    const [circulatingSupply, setCirculatingSupply] = useState<string>('')
    const [tokenAllTxs, setTokenAllTxs] = useState<any[]>([])
    const [tokenMyTxs, setTokenMyTxs] = useState<any[]>([])
    const [tokenSentTxs, setTokenSentTxs] = useState<any[]>([])
    const [tokenReceivedTxs, setTokenReceivedTxs] = useState<any[]>([])
    const [tokenHoldersTxs, setTokenHoldersTxs] = useState<any>({})

    useEffect(()=>{
        if(TokenData && TokenData.TokenId) {
            setStartIndex((pageId - 1) * pageSize + 1) //start with 1, not 0
            setEndIndex((pageId) * pageSize)
            switch(tokenListAction) {
                case 'AllTxs':
                    handleAoTokenAllTransactions(TokenData.TokenId)
                    console.log("handleAoTokenAllTransactions", pageId, TokenData)
                    break;
                case 'MyTxs':
                    handleAoTokenMyAllTransactions(TokenData.TokenId)
                    console.log("handleAoTokenMyAllTransactions", pageId, TokenData)
                    break;
                case 'Sent':
                    handleAoTokenSentTransactions(TokenData.TokenId)
                    console.log("handleAoTokenSentTransactions", pageId, TokenData)
                    break;
                case 'Received':
                    handleAoTokenReceivedTransactions(TokenData.TokenId)
                    console.log("handleAoTokenReceivedTransactions", pageId, TokenData)
                    break;
                case 'Holders':
                    handleTokenBalancesPagination()
                    break;
            }
        }
    }, [pageId, tokenListAction])

    const handleAoTokenAllTransactions = async function (CurrentToken: string) {
        const AoDryRunData: any = await AoTokenAllTransactions(CurrentToken, String(startIndex), String(endIndex))
        console.log("AoDryRunData", AoDryRunData)
        try{
            if(AoDryRunData) {
            setPageCount(Math.ceil(AoDryRunData[1]/pageSize))
            }
        }
        catch(Error: any) {
            console.log("handleAoTokenBalancesDryRun AoTokenBalancesPageDryRun Error", Error)
        }
    }

    const handleAoTokenMyAllTransactions = async function (CurrentToken: string) {
        const AoDryRunData: any = await AoTokenMyAllTransactions(CurrentToken, currentAddress, String(startIndex), String(endIndex))
        console.log("AoDryRunData", AoDryRunData)
        try{
            if(AoDryRunData) {
                setPageCount(Math.ceil(AoDryRunData[1]/pageSize))
            }
        }
        catch(Error: any) {
            console.log("handleAoTokenBalancesDryRun AoTokenBalancesPageDryRun Error", Error)
        }
    }

    const handleAoTokenSentTransactions = async function (CurrentToken: string) {
        const AoDryRunData: any = await AoTokenSentTransactions(CurrentToken, currentAddress, String(startIndex), String(endIndex))
        console.log("handleAoTokenSentTransactions AoDryRunData", AoDryRunData)
        try{
            if(AoDryRunData) {
            setPageCount(Math.ceil(AoDryRunData[1]/pageSize))
            }
        }
        catch(Error: any) {
            console.log("handleAoTokenBalancesDryRun AoTokenBalancesPageDryRun Error", Error)
        }
    }

    const handleAoTokenReceivedTransactions = async function (CurrentToken: string) {
        const AoDryRunData: any = await AoTokenReceivedTransactions(CurrentToken, currentAddress, String(startIndex), String(endIndex))
        console.log("handleAoTokenReceivedTransactions AoDryRunData", AoDryRunData)
        try{
            if(AoDryRunData) {
            setPageCount(Math.ceil(AoDryRunData[1]/pageSize))
            }
        }
        catch(Error: any) {
            console.log("handleAoTokenBalancesDryRun AoTokenBalancesPageDryRun Error", Error)
        }
    }

    const handleTokenBalancesPagination = async function () {
        if(TokenData && TokenData.Release == "ChivesToken") {
            await handleAoTokenBalancesDryRunChivesToken(TokenData.TokenId, TokenData.Denomination)
        }
        else {
            await handleAoTokenBalancesDryRunOfficialToken(TokenData.TokenId, TokenData.Denomination)
        }
    }

    const handleAoTokenBalancesDryRunOfficialToken = async function (CurrentToken: string, Denomination: number) {
        if(authConfig.AoConnectBlockTxIds.includes(CurrentToken)) {
            console.log("handleAoTokenBalancesDryRunOfficialToken", "This token can not search txs records, due to txs are too large.")

            return 
        }
        if(CurrentToken)   {
            const AoDryRunBalances = await AoTokenBalancesDryRun(CurrentToken)
            if(AoDryRunBalances && Denomination) {
                try{
                    const AoDryRunBalancesJson = JSON.parse(AoDryRunBalances)
                    const AoDryRunBalancesJsonMap = new Map(Object.entries(AoDryRunBalancesJson));
                    const AoDryRunBalancesJsonSorted = Array.from(AoDryRunBalancesJsonMap.entries()).filter(([, value] : any) => Number(value) > 0);
                    AoDryRunBalancesJsonSorted.sort((a: any, b: any) => b[1] - a[1]);
                    const TokenHolders = AoDryRunBalancesJsonSorted.length
                    let CirculatingSupply = BigNumber(0)
                    const AoDryRunBalancesJsonSortedResult = AoDryRunBalancesJsonSorted.map((Item: any)=>{
                    const HolderBalance = FormatBalance(Number(Item[1]), Number(Denomination))
                    CirculatingSupply = CirculatingSupply.plus(HolderBalance)

                    return [Item[0], HolderBalance]
                    })
                    setPageCount(Math.ceil(AoDryRunBalancesJsonSorted.length/pageSize))
                    console.log("handleAoTokenBalancesDryRunOfficialToken", AoDryRunBalancesJsonSortedResult, "TokenHolders", TokenHolders)
                }
                catch(Error: any) {
                    console.log("handleAoTokenBalancesDryRunOfficialToken Error", Error)
                }
            }
        }
    }

    const handleAoTokenBalancesDryRunChivesToken = async function (CurrentToken: string, Denomination: number) {
        if(authConfig.AoConnectBlockTxIds.includes(CurrentToken)) {
            console.log("handleAoTokenBalancesDryRunChivesToken", "This token can not search txs records, due to txs are too large.")

            return 
        }
        const AoDryRunBalances = await AoTokenBalancesPageDryRun(CurrentToken, String(startIndex), String(endIndex))
        if(AoDryRunBalances && Denomination) {
            try{
                const AoDryRunBalancesData = JSON.parse(AoDryRunBalances)
                console.log("AoDryRunBalancesData", AoDryRunBalancesData)
                const AoDryRunBalancesJson = AoDryRunBalancesData[0]
                const TokenHolders = AoDryRunBalancesData[1]
                const CirculatingSupply = FormatBalance(AoDryRunBalancesData[2], Number(Denomination))
                const AoDryRunBalancesJsonSorted = Object.entries(AoDryRunBalancesJson)
                                    .sort((a: any, b: any) => b[1] - a[1])
                                    .reduce((acc: any, [key, value]) => {
                                        acc[key] = FormatBalance(Number(value), Number(Denomination));
                                        
                                        return acc;
                                    }, {} as { [key: string]: number });
                setCirculatingSupply(CirculatingSupply)
                setHoldersNumber(TokenHolders)
                setTokenHoldersTxs(AoDryRunBalancesJsonSorted)
                console.log("handleAoTokenBalancesDryRunChivesToken AoDryRunBalances", AoDryRunBalancesJsonSorted, "TokenHolders", TokenHolders, "CirculatingSupply", CirculatingSupply)
            }
            catch(Error: any) {
                console.log("handleAoTokenBalancesDryRunChivesToken AoTokenBalancesPageDryRun Error", Error)
            }
        }
    }

    return (
        <Grid container spacing={0}>

            <Box px={2} textAlign="center" sx={{width: '100%'}}>
                <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CustomAvatar
                        skin='light'
                        color='primary'
                        sx={{ width: 60, height: 60, fontSize: '1.5rem' }}
                        src={GetAppAvatar(TokenData.Logo)}
                    />
                    <Box sx={{ position: 'absolute', top: 0, right: 0, marginRight: -2, marginTop: -3 }}>
                        <Typography variant="body2">
                            {t('Holders')}: {holdersNumber}
                        </Typography>
                    </Box>
                    <Box sx={{ position: 'absolute', top: 0, right: 0, marginRight: -2, marginTop: 3 }}>
                        <Typography variant="body2">
                            {t('Issues')}: {circulatingSupply}
                        </Typography>
                    </Box>
                </Box>
                <Typography variant="h5" mt={4}>
                    {myAoTokensBalance && myAoTokensBalance[currentAddress] && myAoTokensBalance[currentAddress][TokenId] }
                </Typography>

                <Typography variant="h6" mt={2}>
                    {formatHash(currentAddress, 6)}
                </Typography>
            </Box>

            <Box
                component='header'
                sx={{
                    backgroundColor: 'background.paper',
                    width: '100%',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    top: '220px',
                    position: 'fixed',
                    height: '40px',
                    ml: -4
                }}
            >
                <Tabs
                    value={activeTab}
                    onChange={handleChangeActiveTab}
                    variant="scrollable"
                    allowScrollButtonsMobile
                    aria-label="icon position tabs example"
                >
                    <Tab sx={{ textTransform: 'none', my: 0, py: 0}} value={'MyTxs'} iconPosition="start" label="MyTxs" />
                    <Tab sx={{ textTransform: 'none', my: 0, py: 0}} value={'Sent'} iconPosition="start" label="Sent" />
                    <Tab sx={{ textTransform: 'none', my: 0, py: 0}} value={'Received'} iconPosition="start" label="Received" />
                    <Tab sx={{ textTransform: 'none', my: 0, py: 0}} value={'Holders'} iconPosition="start" label="Holders" />
                    <Tab sx={{ textTransform: 'none', my: 0, py: 0}} value={'All'} iconPosition="start" label="All" />
                </Tabs>
            </Box>
            
            <Grid item xs={12} sx={{mt: '40px', height: 'calc(100% - 56px)'}}>
                <Grid container spacing={2} sx={{mt: 4}}>

                {tokenListAction == "Holders" && tokenHoldersTxs && Object.keys(tokenHoldersTxs).map((TokenIdValue: string, index: number) => {

                  return (
                    <Grid item xs={12} sx={{ py: 0 }} key={index}>
                        <Card>
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1}}>
                                <CustomAvatar
                                    skin='light'
                                    color={'primary'}
                                    sx={{ mr: 0, width: 38, height: 38 }}
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
                                        {formatHash(TokenIdValue, 8)}
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
                                        {tokenHoldersTxs[TokenIdValue]}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box textAlign="right">
                                    <Typography 
                                        sx={{ 
                                            color: 'secondary.main',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            textAlign: 'right',
                                            mr: 1
                                        }}
                                        onClick={()=>{
                                            navigator.clipboard.writeText(TokenId)
                                        }}
                                    >
                                        {(index+1)}
                                    </Typography>

                                </Box>

                            </Box>
                        </Card>
                    </Grid>
                    )
                })}

                {authConfig.tokenName && currentWalletTxsData && currentWalletTxsData.length == 0 && (
                    <Grid item xs={12} sx={{ py: 0 }}>
                        <Box sx={{ justifyContent: 'center', display: 'flex', alignItems: 'center', px: 2, py: 1}}>
                            {t('No Record')}
                        </Box>
                    </Grid>
                )}

                {authConfig.tokenName && currentWalletTxsData && currentWalletTxsData.length > 0 && currentWalletTxsHasNextPage[activeTab] == false && (
                    <Grid item xs={12} sx={{ py: 0 }}>
                        <Box sx={{ justifyContent: 'center', display: 'flex', alignItems: 'center', px: 2, py: 1}}>
                            {t('Have load all data')}
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
    )

}

export default AoTokenRecord
