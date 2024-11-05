// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CustomAvatar from '../../@core/components/mui/avatar'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'

// ** MUI Imports
import Icon from '../../@core/components/icon'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { formatHash } from '../../configs/functions'
import { GetAppAvatar } from '../../functions/AoConnect/Token'

const ManageAssets = ({ searchAssetkeyWord, setSearchAssetkeyWord, mySavingTokensData, handleSearchAssets, handleSelectDeleteMyToken, handleGetLeftAllTokens, allTokensData, handleSelectTokenAndSave, searchAssetOnChain, isDisabledButton } : any) => {

  const { t } = useTranslation()

  return (
    <Grid container spacing={2} mt={1}>
      <Grid item xs={12} sx={{height: 'calc(100% - 104px)'}}>
          <Grid container spacing={2}>
            <TextField
              fullWidth
              size='small'
              value={searchAssetkeyWord}
              placeholder={t('Search Assets') as string}
              sx={{ '& .MuiInputBase-root': { borderRadius: 2 }, mb: 3 }}
              onChange={(e: any)=>{
                setSearchAssetkeyWord(e.target.value)
              }}
            />
          </Grid>

          {mySavingTokensData && mySavingTokensData.length > 0 && (
            <Grid item xs={12} sx={{ py: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pt: 1, pb: 3}}>
                  {t('My Assets') as string}
                </Box>
            </Grid>
          )}
          <Grid container spacing={2}>
          {handleSearchAssets(mySavingTokensData).map((Token: any, index: number) => {

            return (
              <Grid item xs={12} sx={{ py: 1 }} key={index}>
                <Card>
                  <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                    <CustomAvatar
                      skin='light'
                      color={'primary'}
                      sx={{ mr: 0, width: 43, height: 43, fontSize: '1.5rem' }}
                      src={GetAppAvatar(Token.TokenData.Logo)}
                    >
                    </CustomAvatar>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '65%', ml: 1.5 }} >
                      <Typography sx={{
                        color: 'text.primary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      >
                        {Token.TokenData.Name}
                      </Typography>
                      <Box sx={{ display: 'flex'}}>
                        <Typography variant='body2' sx={{
                          color: `primary.dark`,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1
                        }}>
                          {formatHash(Token.TokenId, 6)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="body1" component="div" sx={{ color: 'primary.main' }}>
                        <Box sx={{ cursor: 'pointer', mr: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={()=>handleSelectDeleteMyToken(Token.TokenId)} >
                          <Icon icon='mdi:delete-outline' />
                          {t('Delete') as string}
                        </Box>
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            )

          })}
          </Grid>

          <Grid item xs={12} sx={{ py: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pt: 2, pb: 3}}>
                {t('All Assets') as string}
              </Box>
          </Grid>
          <Grid container spacing={2}>
          {handleGetLeftAllTokens(handleSearchAssets(allTokensData), mySavingTokensData).map((Token: any, index: number) => {

            return (
              <Grid item xs={12} sx={{ py: 1 }} key={index}>
                <Card>
                  <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                    <CustomAvatar
                      skin='light'
                      color={'primary'}
                      sx={{ mr: 0, width: 43, height: 43, fontSize: '1.5rem' }}
                      src={GetAppAvatar(Token.TokenData.Logo)}
                    >
                    </CustomAvatar>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '65%', ml: 1.5 }} >
                      <Typography sx={{
                        color: 'text.primary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      >
                        {Token.TokenData.Name}
                      </Typography>
                      <Box sx={{ display: 'flex'}}>
                        <Typography variant='body2' sx={{
                          color: `primary.dark`,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1
                        }}>
                          {formatHash(Token.TokenId, 6)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="body1" component="div" sx={{ color: 'primary.main', wordWrap: 'noWrap' }}>
                        <Box sx={{ cursor: 'pointer', mr: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={()=>handleSelectTokenAndSave(Token, Token.TokenData)} >
                          <Icon icon='tdesign:plus' />
                          {t('Add') as string}
                        </Box>
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            )

          })}
          </Grid>
          <Grid container spacing={2}>
          {handleGetLeftAllTokens(searchAssetOnChain, allTokensData).map((Token: any, index: number) => {

            return (
              <Grid item xs={12} sx={{ py: 1 }} key={index}>
                <Card>
                  <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                    <CustomAvatar
                      skin='light'
                      color={'primary'}
                      sx={{ mr: 0, width: 43, height: 43, fontSize: '1.5rem' }}
                      src={GetAppAvatar(Token.TokenData.Logo)}
                    >
                    </CustomAvatar>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '65%', ml: 1.5 }} >
                      <Typography sx={{
                        color: 'text.primary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      >
                        {Token.TokenData.Name}
                      </Typography>
                      <Box sx={{ display: 'flex'}}>
                        <Typography variant='body2' sx={{
                          color: `primary.dark`,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1
                        }}>
                          {formatHash(Token.TokenId, 6)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="body1" component="div" sx={{ color: 'primary.main', wordWrap: 'noWrap' }}>
                        <Box sx={{ cursor: 'pointer', mr: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={()=>handleSelectTokenAndSave(Token, Token.TokenData)} >
                          <Icon icon='tdesign:plus' />
                          {t('Add') as string}
                        </Box>
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            )

          })}
          </Grid>

          {mySavingTokensData && mySavingTokensData.length > 0 && handleGetLeftAllTokens(allTokensData, mySavingTokensData).length == 0 && (
            <Grid item xs={12} sx={{ py: 0 }}>
              <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'secondary.main',
                  px: 2,
                  pt: 2,
                  pb: 3
              }}>
                  {t('No Assets') as string}
              </Box>
            </Grid>
          )}

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

export default ManageAssets
