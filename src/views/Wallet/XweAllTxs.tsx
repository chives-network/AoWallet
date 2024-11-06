// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Tab from '@mui/material/Tab'

import { getXweWalletImageThumbnail } from 'src/functions/ChivesWallets'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { formatHash, formatTimestamp, formatStorageSize } from 'src/configs/functions'

import Tabs from '@mui/material/Tabs';


const XweAllTxs = ({ currentWalletTxs, isDisabledButton, currentAddress, handleChangeActiveTab, activeTab, setCurrentTx, setPageModel } : any) => {

  const { t } = useTranslation()

  return (
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
            sx={{ my: 0, py: 0, mx: 0, px: 0}}
            variant="scrollable"
          >
            <Tab sx={{ textTransform: 'none', my: 0, py: 0, minHeight: '40px'}} value={'AllTxs'} label={t("All Txs") as string} />
            <Tab sx={{ textTransform: 'none', my: 0, py: 0, minHeight: '40px'}} value={'Sent'} label={t("Sent") as string} />
            <Tab sx={{ textTransform: 'none', my: 0, py: 0, minHeight: '40px'}} value={'Received'} label={t("Received") as string} />
            <Tab sx={{ textTransform: 'none', my: 0, py: 0, minHeight: '40px'}} value={'Files'} label={t("Files") as string} />
          </Tabs>
        </Box>

        <Grid item xs={12} sx={{mt: '10px', height: 'calc(100% - 56px)'}}>
            <Grid container spacing={2}>

            {activeTab && activeTab != 'Files' && currentWalletTxs && currentWalletTxs.data.map((Tx: any, index: number) => {

              return (
                <Grid item xs={12} sx={{ py: 0 }} key={index}>
                  <Card>
                    <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1}} onClick={ ()=>{
                        setCurrentTx(Tx)
                        setPageModel('ViewTx')
                      } }>
                    <CustomAvatar
                      skin='light'
                      color={'primary'}
                      sx={{ mr: 0, width: 38, height: 38 }}
                      src={getXweWalletImageThumbnail(Tx)}
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

            {activeTab && activeTab == 'Files' && currentWalletTxs && currentWalletTxs.data.map((Tx: any, index: number) => {

            return (
              <Grid item xs={12} sx={{ py: 0 }} key={index}>
                <Card>
                  <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1}} onClick={ ()=>{
                      setCurrentTx(Tx)
                      setPageModel('ViewTx')
                    } }>
                  <CustomAvatar
                    skin='light'
                    color={'primary'}
                    sx={{ mr: 0, width: 38, height: 38 }}
                    src={getXweWalletImageThumbnail(Tx)}
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
                        {Tx.table.item_name}
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
                      <Typography sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        mr: 2
                      }}>
                        {formatStorageSize(Tx.table.data_size)}
                      </Typography>

                    </Box>
                  </Box>
                </Card>
              </Grid>
            )
            })}

            {currentWalletTxs && currentWalletTxs.data && currentWalletTxs.data.length == 0 && (
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
  )

}

export default XweAllTxs
