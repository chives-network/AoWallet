
import { useState, useEffect } from 'react'

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
import authConfig from 'src/configs/auth'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { formatHash } from 'src/configs/functions'

import Tabs from '@mui/material/Tabs';
import { GetAppAvatar } from 'src/functions/AoConnect/MsgReminder'

import { BigNumber } from 'bignumber.js'

import {AoTokenBalancesDryRun, AoTokenBalancesPageDryRun, AoTokenAllTransactions, AoTokenSentTransactions, AoTokenReceivedTransactions, AoTokenMyAllTransactions } from 'src/functions/AoConnect/Token'
import {setTokenAllHolderTxs, getTokenAllHolderTxs } from 'src/functions/ChivesWallets'
import { FormatBalance } from 'src/functions/AoConnect/AoConnect'

const AoToken = ({ currentAddress, chooseToken, myAoTokensBalance, page, setPage } : any) => {

    const { t } = useTranslation()

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

    const [tokenListAction, setTokenListAction] = useState<string>("Holders")
    const pageSize = 20
    const startIndex = TokenData.Release == "ChivesToken" ? (page) * pageSize : 0
    const endIndex = (page+1) * pageSize
    
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [holdersNumber, setHoldersNumber] = useState<number>(0)
    const [circulatingSupply, setCirculatingSupply] = useState<string>('')
    const [tokenAllTxs, setTokenAllTxs] = useState<any>({})
    const [tokenMyTxs, setTokenMyTxs] = useState<any>({})
    const [tokenSentTxs, setTokenSentTxs] = useState<any>({})
    const [tokenReceivedTxs, setTokenReceivedTxs] = useState<any>({})
    const [tokenHoldersTxsChivesToken, setTokenHoldersTxsChivesToken] = useState<any>({})
    const [tokenHoldersTxsOfficialToken, setTokenHoldersTxsOfficialToken] = useState<any[]>([])

    const handleChangeActiveTab = (event: any, value: string) => {
        setTokenListAction(value)
        setPage(0)
        switch(tokenListAction) {
            case 'AllTxs':
                setTokenAllTxs({})
                break;
            case 'MyTxs':
                setTokenMyTxs({})
                break;
            case 'Sent':
                setTokenSentTxs({})
                break;
            case 'Received':
                setTokenReceivedTxs({})
                break;
            case 'Holders':
                setTokenHoldersTxsChivesToken({})
                break;
        }
        console.log("handleChangeActiveTab", event, value, "startIndex", startIndex, "endIndex", endIndex)
    }

    useEffect(()=>{
        if(TokenData && TokenData.TokenId) {
            switch(tokenListAction) {
                case 'AllTxs':
                    if(tokenAllTxs && tokenAllTxs[0] && tokenAllTxs[1] && startIndex > 0 && startIndex > tokenAllTxs[1]) {

                        break;
                    }
                    handleAoTokenAllTransactions(TokenData.TokenId)
                    console.log("handleAoTokenAllTransactions", page, TokenData)
                    break;
                case 'MyTxs':
                    if(tokenMyTxs && tokenMyTxs[0] && tokenMyTxs[1] && startIndex > 0 && startIndex > tokenMyTxs[1]) {

                        break;
                    }
                    handleAoTokenMyAllTransactions(TokenData.TokenId)
                    console.log("handleAoTokenMyAllTransactions", page, TokenData)
                    break;
                case 'Sent':
                    if(tokenSentTxs && tokenSentTxs[0] && tokenSentTxs[1] && startIndex > 0 && startIndex > tokenSentTxs[1]) {

                        break;
                    }
                    handleAoTokenSentTransactions(TokenData.TokenId)
                    console.log("handleAoTokenSentTransactions", page, TokenData)
                    break;
                case 'Received':
                    if(tokenReceivedTxs && tokenReceivedTxs[0] && tokenReceivedTxs[1] && startIndex > 0 && startIndex > tokenReceivedTxs[1]) {

                        break;
                    }
                    handleAoTokenReceivedTransactions(TokenData.TokenId)
                    console.log("handleAoTokenReceivedTransactions", page, TokenData)
                    break;
                case 'Holders':
                    if( TokenData && TokenData.Release == "ChivesToken" 
                        && tokenHoldersTxsChivesToken && tokenHoldersTxsChivesToken[0] && tokenHoldersTxsChivesToken[1] 
                        && startIndex > 0 && startIndex > tokenHoldersTxsChivesToken[1] ) {

                        break;
                    }
                    handleTokenBalancesPagination()
                    break;
            }
        }
    }, [page, tokenListAction])

    const handleAoTokenAllTransactions = async function (CurrentToken: string) {
        try{
            setIsLoading(true)
            const AoDryRunData: any = await AoTokenAllTransactions(CurrentToken, String(startIndex), String(endIndex))
            console.log("AoDryRunData", AoDryRunData, CurrentToken, startIndex, endIndex)
            if(AoDryRunData) {
                setTokenAllTxs((prevData: any)=>{
                    if(prevData && prevData[0] && prevData[1])  {
                        const AllTxsTemp = [...prevData[0], ...AoDryRunData[0]]

                        return [AllTxsTemp, AoDryRunData[1]]
                    }
                    else {

                        return AoDryRunData
                    }
                })
            }
            setIsLoading(false)
        }
        catch(Error: any) {
            console.log("handleAoTokenBalancesDryRun AoTokenBalancesPageDryRun Error", Error)
        }
    }

    const handleAoTokenMyAllTransactions = async function (CurrentToken: string) {
        try{
            setIsLoading(true)
            const AoDryRunData: any = await AoTokenMyAllTransactions(CurrentToken, currentAddress, String(startIndex), String(endIndex))
            console.log("AoDryRunData", AoDryRunData)
            if(AoDryRunData) {
                setTokenMyTxs((prevData: any)=>{
                    if(prevData && prevData[0] && prevData[1])  {
                        const AllTxsTemp = [...prevData[0], ...AoDryRunData[0]]

                        return [AllTxsTemp, AoDryRunData[1]]
                    }
                    else {

                        return AoDryRunData
                    }
                })
            }
            setIsLoading(false)
        }
        catch(Error: any) {
            console.log("handleAoTokenBalancesDryRun AoTokenBalancesPageDryRun Error", Error)
        }
    }

    const handleAoTokenSentTransactions = async function (CurrentToken: string) {
        try{
            setIsLoading(true)
            const AoDryRunData: any = await AoTokenSentTransactions(CurrentToken, currentAddress, String(startIndex), String(endIndex))
            console.log("handleAoTokenSentTransactions AoDryRunData", AoDryRunData)
            if(AoDryRunData) {
                setTokenSentTxs((prevData: any)=>{
                    if(prevData && prevData[0] && prevData[1])  {
                        const AllTxsTemp = [...prevData[0], ...AoDryRunData[0]]

                        return [AllTxsTemp, AoDryRunData[1]]
                    }
                    else {

                        return AoDryRunData
                    }
                })
            }
            setIsLoading(false)
        }
        catch(Error: any) {
            console.log("handleAoTokenBalancesDryRun AoTokenBalancesPageDryRun Error", Error)
        }
    }

    const handleAoTokenReceivedTransactions = async function (CurrentToken: string) {
        try{
            setIsLoading(true)
            const AoDryRunData: any = await AoTokenReceivedTransactions(CurrentToken, currentAddress, String(startIndex), String(endIndex))
            console.log("handleAoTokenReceivedTransactions AoDryRunData", AoDryRunData)
            if(AoDryRunData) {
                setTokenReceivedTxs((prevData: any)=>{
                    if(prevData && prevData[0] && prevData[1])  {
                        const AllTxsTemp = [...prevData[0], ...AoDryRunData[0]]

                        return [AllTxsTemp, AoDryRunData[1]]
                    }
                    else {

                        return AoDryRunData
                    }
                })
            }
            setIsLoading(false)
        }
        catch(Error: any) {
            console.log("handleAoTokenBalancesDryRun AoTokenBalancesPageDryRun Error", Error)
        }
    }

    const handleTokenBalancesPagination = async function () {
        if(TokenData && TokenData.Release == "ChivesToken") {
            await handleAoTokenBalancesDryRunChivesToken(TokenData.TokenId, TokenData.Denomination)
        }
        else if(page == 0){
            await handleAoTokenBalancesDryRunOfficialToken(TokenData.TokenId, TokenData.Denomination)
        }
    }

    const handleAoTokenBalancesDryRunOfficialToken = async function (CurrentToken: string, Denomination: number) {
        if(authConfig.AoConnectBlockTxIds.includes(CurrentToken)) {
            console.log("handleAoTokenBalancesDryRunOfficialToken", "This token can not search txs records, due to txs are too large.")

            return 
        }
        const getTokenAllHolderTxsData = getTokenAllHolderTxs(CurrentToken);
        if (getTokenAllHolderTxsData) {
            const { AoDryRunBalancesJsonSorted, TokenHolders, CirculatingSupply } = getTokenAllHolderTxsData;
            CirculatingSupply && setCirculatingSupply(String(Number(CirculatingSupply).toFixed(0)))
            TokenHolders && setHoldersNumber(TokenHolders)
            AoDryRunBalancesJsonSorted && setTokenHoldersTxsOfficialToken(AoDryRunBalancesJsonSorted)
        }
        if(CurrentToken)   {
            if(Denomination) {
                try{
                    !getTokenAllHolderTxsData && setIsLoading(true) //只有在第一次执行的时候,需要增加一个加载中提示,第二次的时候,会直接使用缓存,然后后台进行更新.
                    const AoDryRunBalances = await AoTokenBalancesDryRun(CurrentToken)
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
                    setCirculatingSupply(String(CirculatingSupply.toFixed(0)))
                    setHoldersNumber(TokenHolders)
                    setTokenHoldersTxsOfficialToken(AoDryRunBalancesJsonSorted)
                    setTokenAllHolderTxs(CurrentToken, {AoDryRunBalancesJsonSorted, TokenHolders, CirculatingSupply})
                    console.log("handleAoTokenBalancesDryRunOfficialToken", AoDryRunBalancesJsonSortedResult, "TokenHolders", TokenHolders)
                    !getTokenAllHolderTxsData && setIsLoading(false)
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
        if(Denomination) {
            try{
                setIsLoading(true)
                const AoDryRunBalances = await AoTokenBalancesPageDryRun(CurrentToken, String(startIndex), String(endIndex))
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
                setTokenHoldersTxsChivesToken((prevData: any)=>{
                    if(prevData)  {

                        return {...prevData, ...AoDryRunBalancesJsonSorted}
                    }
                    else {

                        return AoDryRunBalancesJsonSorted
                    }
                })

                console.log("handleAoTokenBalancesDryRunChivesToken AoDryRunBalances", AoDryRunBalancesJsonSorted, "TokenHolders", TokenHolders, "CirculatingSupply", CirculatingSupply)
                setIsLoading(false)
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
                    {myAoTokensBalance && myAoTokensBalance[currentAddress] && myAoTokensBalance[currentAddress][TokenId] } {TokenData.Ticker}
                </Typography>

                <Typography variant="h6" mt={2}>
                    {formatHash(TokenId, 6)}
                </Typography>
            </Box>
            {TokenData.Release == "ChivesToken" && (
                <Box
                    component='header'
                    sx={{
                        backgroundColor: 'background.paper',
                        width: '100%',
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'static',
                        height: '40px',
                        mt: 2
                    }}
                >
                    <Tabs
                        value={tokenListAction}
                        onChange={handleChangeActiveTab}
                        variant="scrollable"
                        allowScrollButtonsMobile
                        aria-label="icon position tabs example"
                    >
                        <Tab sx={{ textTransform: 'none', my: 0, py: 0}} value={'MyTxs'} iconPosition="start" label="MyTxs" />
                        <Tab sx={{ textTransform: 'none', my: 0, py: 0}} value={'Sent'} iconPosition="start" label="Sent" />
                        <Tab sx={{ textTransform: 'none', my: 0, py: 0}} value={'Received'} iconPosition="start" label="Received" />
                        <Tab sx={{ textTransform: 'none', my: 0, py: 0}} value={'Holders'} iconPosition="start" label="Holders" />
                        <Tab sx={{ textTransform: 'none', my: 0, py: 0}} value={'AllTxs'} iconPosition="start" label="AllTxs" />
                    </Tabs>
                </Box>
            )}

            {TokenData.Release != "ChivesToken" && (
                <Box
                    component='header'
                    sx={{
                        backgroundColor: 'background.paper',
                        width: '100%',
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'static',
                        height: '40px',
                        mt: 2
                    }}
                >
                    <Tabs
                        value={tokenListAction}
                        variant="scrollable"
                        aria-label="icon position tabs example"
                    >
                        <Tab sx={{ textTransform: 'none', my: 0, py: 0}} value={'Holders'} iconPosition="start" label="Holders" />
                    </Tabs>
                </Box>
            )}
            
            <Grid item xs={12} sx={{mt: 0, height: 'calc(100% - 56px)'}}>
                <Grid container spacing={2} sx={{mt: 4}}>

                {TokenData.Release == "ChivesToken" && tokenListAction == "Holders" && tokenHoldersTxsChivesToken && Object.keys(tokenHoldersTxsChivesToken).map((TokenIdValue: string, index: number) => {

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
                                                {t('Balance') as string}: {tokenHoldersTxsChivesToken[TokenIdValue]}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box textAlign="right">
                                        <Typography 
                                            sx={{ 
                                                color: 'info.main',
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

                {TokenData.Release != "ChivesToken" && tokenListAction == "Holders" && tokenHoldersTxsOfficialToken && tokenHoldersTxsOfficialToken.slice(startIndex, endIndex).map((TokenIdValue: string, index: number) => {

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
                                                {formatHash(TokenIdValue[0], 8)}
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
                                                {t('Balance') as string}: {TokenIdValue[1]}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box textAlign="right">
                                        <Typography 
                                            sx={{ 
                                                color: 'info.main',
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

                {authConfig.tokenName && tokenHoldersTxsChivesToken && false && Object.keys(tokenHoldersTxsChivesToken).length > 0 && (
                    <Grid item xs={12} sx={{ py: 0 }}>
                        <Box sx={{ justifyContent: 'center', display: 'flex', alignItems: 'center', px: 2, py: 1}}>
                            {t('Have load all data')}
                        </Box>
                    </Grid>
                )}

                {tokenListAction == "AllTxs"  && tokenAllTxs && tokenAllTxs[0] && tokenAllTxs[0].map((Tx: any, index: number) => {

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
                                            onClick={()=>{
                                                navigator.clipboard.writeText(Tx[0])
                                            }}
                                        >
                                            {t('From') as string}: {formatHash(Tx[0], 8)}
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
                                                onClick={()=>{
                                                    navigator.clipboard.writeText(Tx[1])
                                                }}
                                            >
                                            {t('To') as string}: {formatHash(Tx[1], 8)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box textAlign="right">
                                        <Typography 
                                            sx={{ 
                                            color: 'info.main',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            textAlign: 'right'
                                            }}
                                        >
                                            {FormatBalance(Tx[2], TokenData.Denomination)}
                                        </Typography>

                                    </Box>

                                </Box>
                            </Card>
                        </Grid>
                    )
                })}

                {tokenListAction == "MyTxs"  && tokenMyTxs && tokenMyTxs[0] && tokenMyTxs[0].map((Tx: any, index: number) => {

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
                                            onClick={()=>{
                                                navigator.clipboard.writeText(Tx[0])
                                            }}
                                        >
                                            {t('From') as string}: {formatHash(Tx[0], 8)}
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
                                            {Tx[2]}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box textAlign="right">
                                        <Typography 
                                            sx={{ 
                                            color: Tx[2] === "Received" ? "primary.main" : "info.main",
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            textAlign: 'right'
                                            }}
                                        >
                                            {Tx[2]=="Received" ? "+" : "-"} {FormatBalance(Tx[1], TokenData.Denomination)}
                                        </Typography>

                                    </Box>

                                </Box>
                            </Card>
                        </Grid>
                    )
                })}

                {tokenListAction == "Sent"  && tokenSentTxs && tokenSentTxs[0] && tokenSentTxs[0].map((Tx: any, index: number) => {

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
                                            onClick={()=>{
                                                navigator.clipboard.writeText(Tx[0])
                                            }}
                                        >
                                            {formatHash(Tx[0], 8)}
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
                                            {t('To') as string}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box textAlign="right">
                                        <Typography 
                                            sx={{ 
                                            color: 'info.main',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            textAlign: 'right'
                                            }}
                                        >
                                           - {FormatBalance(Tx[1], TokenData.Denomination)}
                                        </Typography>

                                    </Box>

                                </Box>
                            </Card>
                        </Grid>
                    )
                })}

                {tokenListAction == "Received"  && tokenReceivedTxs && tokenReceivedTxs[0] && tokenReceivedTxs[0].map((Tx: any, index: number) => {

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
                                            onClick={()=>{
                                                navigator.clipboard.writeText(Tx[0])
                                            }}
                                        >
                                            {formatHash(Tx[0], 8)}
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
                                                {t('From') as string}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box textAlign="right">
                                        <Typography 
                                            sx={{ 
                                            color: 'info.main',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            textAlign: 'right'
                                            }}
                                        >
                                            + {FormatBalance(Tx[1], TokenData.Denomination)}
                                        </Typography>

                                    </Box>

                                </Box>
                            </Card>
                        </Grid>
                    )
                })}

                {isLoading == false && tokenHoldersTxsChivesToken && Object.keys(tokenHoldersTxsChivesToken).length == 0 && (
                    <Grid item xs={12} sx={{ py: 0 }}>
                        <Box sx={{ justifyContent: 'center', display: 'flex', alignItems: 'center', px: 2, py: 1}}>
                            {t('No Record')}
                        </Box>
                    </Grid>
                )}

                {isLoading == true && tokenHoldersTxsChivesToken && Object.keys(tokenHoldersTxsChivesToken).length == 0 && (
                    <Grid item xs={12} sx={{ py: 0 }}>
                        <Box sx={{ justifyContent: 'center', display: 'flex', alignItems: 'center', px: 2, py: 1}}>
                            {t('Loading')}
                        </Box>
                    </Grid>
                )}

                </Grid>

            </Grid>
                    
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" size={45}/>
            </Backdrop>

        </Grid>
    )

}

export default AoToken
