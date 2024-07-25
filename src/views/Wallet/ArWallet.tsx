
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


const ArWallet = ({ currentWalletTxs, isDisabledButton, currentAddress, handleChangeActiveTab, activeTab, currentWalletTxsHasNextPage } : any) => {

  const { t } = useTranslation()

  let currentWalletTxsData: any = null
  if(currentWalletTxs && currentWalletTxs[activeTab])  {
    currentWalletTxsData = currentWalletTxs[activeTab]
  }

  return (
    <Grid container spacing={0}>
        <Box
            component='header'
            sx={{
                backgroundColor: 'background.paper',
                width: '100%',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'fixed',
                top: 45,
                ml: -4,
                height: '40px'
            }}
        >
            <Tabs
                value={activeTab}
                onChange={handleChangeActiveTab}
                aria-label="icon position tabs example"
                sx={{ my: 0, py: 0}}
            >
            <Tab sx={{ textTransform: 'none', my: 0, py: 0}} value={'Sent'} icon={<Icon fontSize={20} icon='mdi:receipt-text-arrow-right' />} iconPosition="start" label="Sent" />
            <Tab sx={{ textTransform: 'none', my: 0, py: 0}} value={'Received'} icon={<Icon fontSize={20} icon='mdi:receipt-text-arrow-left' />} iconPosition="start" label="Received" />
            </Tabs>
        </Box>
        
        <Grid item xs={12} sx={{mt: '40px', height: 'calc(100% - 56px)'}}>
            <Grid container spacing={2}>

            {authConfig.tokenName && currentWalletTxsData && currentWalletTxsData.map((Tx: any, index: number) => {

                const TagsMap: any = {}
                Tx.node.tags && Tx.node.tags[0] && Tx.node.tags[0].name != "" && Tx.node.tags.length > 0 && Tx.node.tags.map( (Tag: any) => {
                    TagsMap[Tag.name] = Tag.value;
                })

                let LeftOne = ''
                let LeftTwo = ''
                let RightOne = ''
                let RightTwo = ''
                let Logo = ''
                let RightOneFullText = ''
                if(TagsMap['SDK'] == "aoconnect" || TagsMap['Variant'] == "ao.TN.1")   {
                    LeftOne = TagsMap['Action'] ?? TagsMap['Variant']
                    LeftTwo = "AO "  + TagsMap['Type']
                    RightOne = TagsMap['From-Process'] ? formatHash(TagsMap['From-Process'], 6) : formatHash(Tx.node.recipient, 6)
                    RightOneFullText = TagsMap['From-Process'] ? TagsMap['From-Process'] : Tx.node.recipient
                    RightTwo = formatTimestamp(Tx.node.block.timestamp)
                    Logo = '/images/logo/AO.png'
                }
                if(Tx.node.quantity.winston > 0) {
                    LeftOne = String(Number(Tx.node.quantity.ar))
                    LeftTwo = TagsMap['App-Name'] ?? TagsMap['Content-Type'] ?? 'Payment | Data'
                    RightOne = currentAddress == Tx.node.recipient ? formatHash(Tx.node.owner.address, 6) : formatHash(Tx.node.recipient, 6)
                    RightTwo = formatTimestamp(Tx.node.block.timestamp)
                    Logo = '/images/logo/AR.png'
                }
                
                return (
                <Grid item xs={12} sx={{ py: 0 }} key={index}>
                    <Card>
                        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1}}>
                            <CustomAvatar
                                skin='light'
                                color={'primary'}
                                sx={{ mr: 0, width: 38, height: 38 }}
                                src={Logo}
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
                                    {LeftOne}
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
                                    {LeftTwo}
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
                                    textAlign: 'right'
                                    }}
                                    onClick={()=>{
                                        navigator.clipboard.writeText(RightOneFullText)
                                    }}
                                >
                                    {RightOne}
                                </Typography>
                                <Box sx={{ display: 'flex' }}>
                                    <Typography 
                                    variant='body2' 
                                    sx={{ 
                                        color: `success.secondary`, 
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        flex: 1,
                                        textAlign: 'right'
                                    }}
                                    >
                                    {RightTwo}
                                    </Typography>
                                </Box>

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

export default ArWallet
