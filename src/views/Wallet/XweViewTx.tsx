import { Clipboard } from '@capacitor/clipboard';

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CustomAvatar from '../../@core/components/mui/avatar'
import toast from 'react-hot-toast'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { getXweWalletImageThumbnail } from '../../functions/ChivesWallets'
import { formatHash, formatTimestamp, formatStorageSize } from '../../configs/functions'


const XweViewTx = ({ currentTx, currentAddress, currentToken } : any) => {

  const { t } = useTranslation()

  return (
    <Grid container spacing={0} >

      <Grid item xs={12} sx={{mt: '10px', height: 'calc(100% - 56px)'}}>
        <Grid container spacing={2}>

          <Grid item xs={12} sx={{ py: 0 }} >
              {currentTx && currentTx.table && currentTx.table.id && currentTx.table.item_name && currentTx.table.item_type == 'image' && (
                <Box px={2} pb={2} textAlign="center" sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                  <CustomAvatar
                    skin='light'
                    color={'primary'}
                    sx={{ mr: 0, width: 100, height: 100 }}
                    src={getXweWalletImageThumbnail(currentTx)}
                  >
                  </CustomAvatar>
                </Box>
              )}
              {currentTx && currentTx.table && currentTx.table.id && currentTx.table.item_type == null && (
                <Box px={2} pb={2} textAlign="center" sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                  <Typography variant='h3' sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mb: 1.5, mr: 1 }}>
                    {currentTx.owner.address == currentAddress ? ' - ' : ' + '}
                  </Typography>
                  <Typography variant='h2' sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentTx.quantity.xwe}
                  </Typography>
                  <Typography variant='body2' sx={{ marginLeft: '5px', mb: 1 }}>
                    {currentToken}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2}}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', ml: 1.5 }}>
                    <Typography >{t('TxId')}: </Typography>
                </Box>
                <Box textAlign="right" onClick={ async ()=>{
                                          await Clipboard.write({
                                            string: currentTx.id
                                          });
                                          toast.success(t('Copied success') as string, { duration: 1000, position: 'top-center' })
                                        }}>
                  <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mr: 2 }}>
                    {formatHash(currentTx.id, 8)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2}}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', ml: 1.5 }}>
                    <Typography >{t('From Address')}: </Typography>
                </Box>
                <Box textAlign="right" onClick={ async ()=>{
                                          await Clipboard.write({
                                            string: currentTx.owner.address
                                          });
                                          toast.success(t('Copied success') as string, { duration: 1000, position: 'top-center' })
                                        }}>
                  <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mr: 2 }}>
                    {formatHash(currentTx.owner.address, 8)}
                  </Typography>
                </Box>
              </Box>
              {currentTx && currentTx.recipient && (
                <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2}}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', ml: 1.5 }}>
                      <Typography >{t('Target Address')}: </Typography>
                  </Box>
                  <Box textAlign="right" onClick={ async ()=>{
                                            await Clipboard.write({
                                              string: currentTx.recipient
                                            });
                                            toast.success(t('Copied success') as string, { duration: 1000, position: 'top-center' })
                                          }}>
                    <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mr: 2 }}>
                      {formatHash(currentTx.recipient, 8)}
                    </Typography>
                  </Box>
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2}}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', ml: 1.5 }}>
                    <Typography >{t('Block Height')}: </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mr: 2 }}>
                    {currentTx.block.height}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2}}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', ml: 1.5 }}>
                    <Typography >{t('Block Time')}: </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mr: 2 }}>
                    {formatTimestamp(currentTx.block.timestamp)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2}}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', ml: 1.5 }}>
                    <Typography >{t('Block Hash')}: </Typography>
                </Box>
                <Box textAlign="right" onClick={ async ()=>{
                                          await Clipboard.write({
                                            string: currentTx.block.indep_hash
                                          });
                                          toast.success(t('Copied success') as string, { duration: 1000, position: 'top-center' })
                                        }}>
                  <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mr: 2 }}>
                    {formatHash(currentTx.block.indep_hash, 8)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2}}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', ml: 1.5 }}>
                    <Typography >{t('Data Size')}: </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mr: 2 }}>
                    {formatStorageSize(currentTx.data.size)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2}}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', ml: 1.5 }}>
                    <Typography >{t('Tx Fee')}: </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mr: 2 }}>
                    {currentTx.fee.xwe}
                  </Typography>
                </Box>
              </Box>

              {currentTx && currentTx.table && currentTx.table.bundleid && (
                <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2}}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', ml: 1.5 }}>
                        <Typography >{t('Bundle Id')}: </Typography>
                    </Box>
                    <Box textAlign="right" onClick={ async ()=>{
                                            await Clipboard.write({
                                              string: currentTx.table.bundleid
                                            });
                                            toast.success(t('Copied success') as string, { duration: 1000, position: 'top-center' })
                                          }}>
                      <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mr: 2 }}>
                        {formatHash(currentTx.table.bundleid, 8)}
                      </Typography>
                    </Box>
                  </Box>
              )}
              {currentTx && currentTx.table && currentTx.table.id && currentTx.table.item_name && currentTx.table.item_type && (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2}}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', ml: 1.5 }}>
                        <Typography >{t('App Name')}: </Typography>
                    </Box>
                    <Box textAlign="right">
                      <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mr: 2 }}>
                        {currentTx.table.app_name}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2}}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', ml: 1.5 }}>
                        <Typography >{t('App Version')}: </Typography>
                    </Box>
                    <Box textAlign="right">
                      <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mr: 2 }}>
                        {currentTx.table.app_version}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2}}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', ml: 1.5 }}>
                        <Typography >{t('Is Public')}: </Typography>
                    </Box>
                    <Box textAlign="right">
                      <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mr: 2 }}>
                        {currentTx.table.is_public}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2}}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', ml: 1.5 }}>
                        <Typography >{t('File Name')}: </Typography>
                    </Box>
                    <Box textAlign="right">
                      <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mr: 2 }}>
                        {formatHash(currentTx.table.item_name, 16)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2}}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', ml: 1.5 }}>
                        <Typography >{t('Content Type')}: </Typography>
                    </Box>
                    <Box textAlign="right">
                      <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mr: 2 }}>
                        {currentTx.table.content_type}
                      </Typography>
                    </Box>
                  </Box>
                  {currentTx.table.item_name && currentTx.table.item_type == 'image' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2}}>
                        <img src={getXweWalletImageThumbnail(currentTx)} alt={currentTx.table.item_name} style={{'width':'100%', 'borderRadius': '4px'}}/>
                    </Box>
                  )}
                </>
              )}

          </Grid>

        </Grid>
      </Grid>

    </Grid>
  )

}

export default XweViewTx
