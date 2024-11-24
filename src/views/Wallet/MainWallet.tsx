import { Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CustomAvatar from 'src/@core/components/mui/avatar'
import IconButton from '@mui/material/IconButton'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Icon from 'src/@core/components/icon'

import { CallReceived, History, Send } from '@mui/icons-material';
import { formatHash } from 'src/configs/functions'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import toast from 'react-hot-toast'
import authConfig from 'src/configs/auth'
import { GetAppAvatar } from 'src/functions/AoConnect/Token'

import MyFilesSummary from './MyFilesSummary'


const MainWallet = ({ handleSwitchBlockchain, currentToken, currentTxsInMemory, currentAddress, currentAddressXcc, currentAddressXch, currentBalance, currentBalanceXwe, currentBalanceXcc, currentBalanceXch, currentBalanceReservedRewards, handleClickReceiveButton, handleClickAllTxsButton, handleClickSendButton, currentAoBalance, mySavingTokensData, myAoTokensBalance, handleClickViewTokenButton, isDisabledManageAssets, handleClickManageAssetsButton, isDisabledButton, setCurrentTx, setPageModel, setLeftIcon, setTitle, setRightButtonIcon, encryptWalletDataKey } : any) => {

  const { t } = useTranslation()

  let balanceShow = 0
  let addressShow = ''
  switch(currentToken){
    case 'Ar':
      balanceShow = currentBalance
      addressShow = currentAddress
      break;
    case 'Xwe':
      balanceShow = currentBalanceXwe
      addressShow = currentAddress
      break;
    case 'Xcc':
      balanceShow = currentBalanceXcc
      addressShow = currentAddressXcc
      break;
    case 'Xch':
      balanceShow = currentBalanceXch
      addressShow = currentAddressXch
      break;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sx={{height: '100%'}}>
        <Grid container spacing={2}>
          <Box p={2} textAlign="center" sx={{position: 'relative', width: '100%'}}>
            <CustomAvatar
              skin='light'
              color='primary'
              sx={{ width: 60, height: 60, fontSize: '1.5rem', margin: 'auto' }}
              src={'https://web.aowallet.org/images/logo/' + currentToken + '.png'}
              onClick={()=>{handleSwitchBlockchain()}}
            >
            </CustomAvatar>
            <Typography variant="h5" mt={6} onClick={()=>{handleSwitchBlockchain()}} >
              {Number(balanceShow)} {currentToken}
            </Typography>
            {currentToken == "Xwe" && currentTxsInMemory && currentTxsInMemory['receive'] && currentTxsInMemory['receive'][currentAddress] && (
              <Box sx={{ position: 'absolute', top: 5, right: 20 }}>
                <Typography variant="body1" component="div" sx={{ color: 'primary.main' }}>
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon icon='tdesign:plus' />
                    {currentTxsInMemory['receive'][currentAddress]} {currentToken}
                  </Box>
                </Typography>
              </Box>
            )}
            {currentToken == "Xwe" && currentTxsInMemory && currentTxsInMemory['send'] && currentTxsInMemory['send'][currentAddress] && (
              <Box sx={{ position: 'absolute', top: currentTxsInMemory['receive'] && currentTxsInMemory['receive'][currentAddress] ? 30 : 5, right: 20 }}>
                <Typography variant="body1" component="div" sx={{ color: 'warning.main' }}>
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon icon='tdesign:minus' />
                    {currentTxsInMemory['send'][currentAddress]} {currentToken}
                  </Box>
                </Typography>
              </Box>
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
              navigator.clipboard.writeText(addressShow);
              toast.success(t('Copied success') as string, { duration: 1000, position: 'top-center' })
            }}>
              {formatHash(addressShow, 6)}
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

                <Grid item xs={12} sx={{ py: 0 }}>
                  <Card>
                    <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1}} onClick={()=>{handleSwitchBlockchain('Xcc')}}>
                      <CustomAvatar
                        skin='light'
                        color={'primary'}
                        sx={{ mr: 0, width: 43, height: 43 }}
                        src={'https://web.aowallet.org/images/logo/Xcc.png'}
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
                          {formatHash(currentAddressXcc, 8)}
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
                            {Number(currentBalanceXcc)} {authConfig.tokenNameXcc}
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
                          {Number(currentBalanceXcc) > 0 ? Number(currentBalanceXcc).toFixed(4).replace(/\.?0*$/, '') : '0'}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>

                <Grid item xs={12} sx={{ py: 0 }}>
                  <Card>
                    <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1}} onClick={()=>{handleSwitchBlockchain('Xch')}}>
                      <CustomAvatar
                        skin='light'
                        color={'primary'}
                        sx={{ ml: 1, mr: 0, width: 40, height: 40 }}
                        src={'https://web.aowallet.org/images/logo/Xch.png'}
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
                          {formatHash(currentAddressXch, 8)}
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
                            {Number(currentBalanceXch)} {authConfig.tokenNameXch}
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
                          {Number(currentBalanceXch) > 0 ? Number(currentBalanceXch).toFixed(4).replace(/\.?0*$/, '') : '0'}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>

                {currentToken && currentToken == "Xwe" && (
                  <MyFilesSummary
                    currentAddress={currentAddress}
                    currentBalanceXwe={currentBalanceXwe}
                    setCurrentTx={setCurrentTx}
                    setPageModel={setPageModel}
                    setLeftIcon={setLeftIcon}
                    setTitle={setTitle}
                    setRightButtonIcon={setRightButtonIcon}
                    encryptWalletDataKey={encryptWalletDataKey}
                  />
                )}

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

                {currentToken && currentToken == "Ar" && (
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
                )}

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
  )

}

export default MainWallet
