import { useState, useEffect } from 'react'

import { Clipboard } from '@capacitor/clipboard';

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CustomAvatar from '../../@core/components/mui/avatar'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Tab from '@mui/material/Tab'
import IconButton from '@mui/material/IconButton'
import { CallReceived, History, Casino, Send } from '@mui/icons-material'

// ** MUI Imports
import authConfig from '../../configs/auth'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { formatHash, formatTimestamp, formatTimestamp2 } from '../../configs/functions'

import Tabs from '@mui/material/Tabs'

import { BigNumber } from 'bignumber.js'

import {AoTokenBalancesDryRun, AoTokenBalancesPageDryRun, AoTokenAllTransactions, AoTokenSentTransactions, AoTokenReceivedTransactions, AoTokenMyAllTransactions, GetAppAvatar } from '../../functions/AoConnect/Token'
import {setTokenAllHolderTxs, getTokenAllHolderTxs } from '../../functions/ChivesWallets'
import { FormatBalance, FormatBalanceString } from '../../functions/AoConnect/AoConnect'

const AoToken = ({ encryptWalletDataKey, currentAddress, chooseToken, myAoTokensBalance, page, setPage, handleClickReceiveButtonAO, handleClickSendButtonAO } : any) => {

    const { t } = useTranslation()

    const TokenData = {...chooseToken.TokenData, TokenId: chooseToken.TokenId}
    const TokenId = chooseToken.TokenId

    const [tokenListAction, setTokenListAction] = useState<string>(TokenData.Release == "ChivesToken" ? "MyTxs" : "Holders")
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
                    handleTokenBalancesPagination()
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
            console.log("handleAoTokenAllTransactions AoDryRunData", AoDryRunData, CurrentToken, startIndex, endIndex)
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
        const getTokenAllHolderTxsData = getTokenAllHolderTxs(CurrentToken, encryptWalletDataKey);
        if (getTokenAllHolderTxsData) {
            const { AoDryRunBalancesJsonSortedResult, TokenHolders, CirculatingSupply } = getTokenAllHolderTxsData;
            CirculatingSupply && setCirculatingSupply(String(Number(CirculatingSupply).toFixed(0)))
            TokenHolders && setHoldersNumber(TokenHolders)
            AoDryRunBalancesJsonSortedResult && setTokenHoldersTxsOfficialToken(AoDryRunBalancesJsonSortedResult)
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
                    setTokenHoldersTxsOfficialToken(AoDryRunBalancesJsonSortedResult)
                    setTokenAllHolderTxs(CurrentToken, {AoDryRunBalancesJsonSortedResult, TokenHolders, CirculatingSupply}, encryptWalletDataKey)
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
                            {t('Issue')}: {circulatingSupply}
                        </Typography>
                    </Box>
                </Box>
                <Typography variant="h5" mt={3}>
                    {myAoTokensBalance && myAoTokensBalance[currentAddress] && myAoTokensBalance[currentAddress][TokenId] } {TokenData.Ticker}
                </Typography>

                <Typography variant="h6" mt={2} onClick={async ()=>{
                                                    await Clipboard.write({
                                                    string: TokenId
                                                    });
                                                }} >
                    {formatHash(TokenId, 5)}
                </Typography>
            </Box>

            <Grid container spacing={4} justifyContent="center" mt={0} mb={2} alignItems="center">
                <Grid item sx={{mx: 2}}>
                    <IconButton onClick={()=>handleClickReceiveButtonAO()}>
                        <CallReceived />
                    </IconButton>
                    <Typography onClick={()=>handleClickReceiveButtonAO()}>{t('Receive') as string}</Typography>
                </Grid>
                <Grid item sx={{mx: 2}}>
                    <IconButton onClick={()=>{
                        if(tokenListAction != "Holders")   {
                            setTokenListAction('Holders')
                            setPage(0)
                            setTokenHoldersTxsChivesToken({})
                        }
                    }}>
                        <History />
                    </IconButton>
                    <Typography onClick={()=>{
                        if(tokenListAction != "Holders")   {
                            setTokenListAction('Holders')
                            setPage(0)
                            setTokenHoldersTxsChivesToken({})
                        }
                    }}>{t('Holders') as string}</Typography>
                </Grid>
                <Grid item sx={{mx: 2}}>
                    <IconButton
                        disabled={Number(myAoTokensBalance && myAoTokensBalance[currentAddress] && myAoTokensBalance[currentAddress][TokenId]) > 0 ? false : true}
                        >
                        <Casino />
                    </IconButton>
                    <Typography sx={{
                                        color: Number(myAoTokensBalance && myAoTokensBalance[currentAddress] && myAoTokensBalance[currentAddress][TokenId]) > 0 ? `` : `secondary.dark`,
                                        ml: 0.5
                                    }}
                                >
                        {t('Swap') as string}
                    </Typography>
                </Grid>
                <Grid item sx={{mx: 2}}>
                    <IconButton
                        disabled={Number(myAoTokensBalance && myAoTokensBalance[currentAddress] && myAoTokensBalance[currentAddress][TokenId]) > 0 ? false : true}
                        onClick={()=>handleClickSendButtonAO()}>
                        <Send />
                    </IconButton>
                    <Typography sx={{
                                        color: Number(myAoTokensBalance && myAoTokensBalance[currentAddress] && myAoTokensBalance[currentAddress][TokenId]) > 0 ? `` : `secondary.dark`,
                                    }}
                                onClick={()=>Number(myAoTokensBalance && myAoTokensBalance[currentAddress] && myAoTokensBalance[currentAddress][TokenId]) > 0 && handleClickSendButtonAO()}>
                        {t('Send') as string}
                    </Typography>
                </Grid>
            </Grid>

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
                        <Tab sx={{ textTransform: 'none', my: 0, py: 0}} value={'MyTxs'} iconPosition="start" label={t("MyTxs") as string} />
                        <Tab sx={{ textTransform: 'none', my: 0, py: 0}} value={'Sent'} iconPosition="start" label={t("Sent") as string} />
                        <Tab sx={{ textTransform: 'none', my: 0, py: 0}} value={'Received'} iconPosition="start" label={t("Received") as string} />
                        <Tab sx={{ textTransform: 'none', my: 0, py: 0}} value={'AllTxs'} iconPosition="start" label={t("AllTxs") as string} />
                        <Tab sx={{ textTransform: 'none', my: 0, py: 0}} value={'Holders'} iconPosition="start" label={t("Holders") as string} />
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
                                            onClick={async ()=>{
                                                await Clipboard.write({
                                                string: TokenIdValue
                                                });
                                            }}
                                        >
                                                {formatHash(TokenIdValue, 5)}
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
                                            onClick={async ()=>{
                                                await Clipboard.write({
                                                    string: TokenId
                                                });
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
                                                {formatHash(TokenIdValue[0], 5)}
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
                                            onClick={async ()=>{
                                                await Clipboard.write({
                                                    string: TokenId
                                                });
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
                                            onClick={async ()=>{
                                                await Clipboard.write({
                                                    string: Tx[1]
                                                });
                                            }}
                                        >
                                            {t('From') as string}: {formatHash(Tx[1], 5)}
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
                                                onClick={async ()=>{
                                                    await Clipboard.write({
                                                        string: Tx[2]
                                                    });
                                                }}
                                            >
                                            {t('To') as string}: {formatHash(Tx[2], 5)} {formatTimestamp2(Tx[4])}
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
                                            {FormatBalanceString(Tx[3], TokenData.Denomination, 4)}
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
                                            onClick={async ()=>{
                                                await Clipboard.write({
                                                    string: Tx[0]
                                                });
                                            }}
                                        >
                                            {Tx[3] === "Received" ? `${t('From') as string}: ${formatHash(Tx[1], 5)}` : `${t('To') as string}: ${formatHash(Tx[1], 5)}`}
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
                                            {formatTimestamp(Tx[4])}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box textAlign="right">
                                        <Typography
                                            sx={{
                                            color: Tx[3] === "Received" ? "primary.main" : "info.main",
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            textAlign: 'right'
                                            }}
                                        >
                                            {Tx[3] === "Received" ? "+" : "-"} {FormatBalanceString(Tx[2], TokenData.Denomination, 4)}
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
                                            onClick={async ()=>{
                                                await Clipboard.write({
                                                    string: Tx[0]
                                                });
                                            }}
                                        >
                                            {t('To')}: {formatHash(Tx[1], 5)}
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
                                            {formatTimestamp(Tx[3])}
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
                                           - {FormatBalanceString(Tx[2], TokenData.Denomination, 4)}
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
                                            onClick={async ()=>{
                                                await Clipboard.write({
                                                    string: Tx[0]
                                                });
                                            }}
                                        >
                                            {t('From')}: {formatHash(Tx[1], 5)}
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
                                                {formatTimestamp(Tx[3])}
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
                                            + {FormatBalanceString(Tx[2], TokenData.Denomination, 4)}
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
