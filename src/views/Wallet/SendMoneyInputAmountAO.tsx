// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Backdrop from '@mui/material/Backdrop'
import Slider from '@mui/material/Slider'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import { useTheme } from '@mui/material/styles'
import { createTheme, ThemeProvider } from '@mui/material';

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { BalanceMinus, BalanceTimes } from '../../functions/AoConnect/AoConnect'



const SendMoneyInputAmountAO = ({ sendMoneyAddress, isDisabledButton, sendMoneyAmount, setSendMoneyAmount, chooseTokenBalance, currentFeeAO, chooseToken,handleWalletSendMoneyAO, uploadingButton } : any) => {

  const { t } = useTranslation()
  const theme = useTheme()

  const themeSlider = createTheme({
    components: {
      MuiSlider: {
        styleOverrides: {
          root: {
            color: theme.palette.primary.main,
          },
        },
      },
    },
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sx={{height: 'calc(100% - 100px)'}}>
          <Grid item xs={12} sx={{ py: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', px: 0}}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} >
                  <Typography sx={{
                    color: 'text.primary',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  >
                    {t('Send to')}
                  </Typography>
                  <Box sx={{ display: 'flex'}}>
                    <Typography variant='body2' sx={{
                      color: `primary.dark`,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                      fontSize: '12px'
                    }}>
                      {sendMoneyAddress.address}
                    </Typography>

                  </Box>
                </Box>
              </Box>
          </Grid>
          <Grid item xs={12} sx={{ py: 1 }}>
            <TextField
              disabled={isDisabledButton}
              fullWidth
              size='small'
              value={sendMoneyAmount}
              onChange={(e) => {
                const value = e.target.value;
                const regex = /^[0-9]*\.?[0-9]*$/;
                if (regex.test(value)) {
                  setSendMoneyAmount(value);
                }
              }}
              placeholder={t('Amount') as string}
              sx={{ '& .MuiInputBase-root': { borderRadius: 2 }, mt: 2 }}
            />
            <ThemeProvider theme={themeSlider}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 0, py: 0 }}>
                <Slider size="small"
                      disabled={isDisabledButton}
                      defaultValue={0}
                      aria-labelledby="small-slider"
                      min={0}
                      max={100}
                      onChange={( _ , newValue: number | number[])=>{
                        if (Array.isArray(newValue)) {
                          newValue = newValue[0];
                        }
                        const TotalLeft = BalanceMinus(Number(chooseTokenBalance), Number(currentFeeAO))
                        const MultiValue = newValue / 100
                        const result = BalanceTimes(Number(TotalLeft), MultiValue)
                        if(newValue == 100) {
                          setSendMoneyAmount( String(Number(result)) )
                        }
                        else {
                          setSendMoneyAmount( String(Number(result).toFixed(4)) )
                        }
                      }}
                      sx={{m: 0, p: 0, width: '90%' }}
                      />
              </Box>
            </ThemeProvider>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1.2, ml: 3, fontSize: 14 }}>
              {t('AoToken Name')}: {chooseToken.Name}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1.2, ml: 3, fontSize: 14 }}>
              {t('AoToken Ticker')}: {chooseToken.Ticker}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1.2, ml: 3, fontSize: 12 }}>
              {t('AoToken Id')}: {chooseToken.TokenId}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1.2, ml: 3, fontSize: 16 }}>
              {t('Max')}: {chooseTokenBalance} {chooseToken.Ticker}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1.2, ml: 3, fontSize: 16 }}>
              {t('Fee')}: {currentFeeAO}
            </Typography>
        </Grid>
        <Grid item xs={12} sx={{ py: 1 }}>
          <Box sx={{width: '100%', mr: 2}}>
            <Button sx={{mt: 5}} fullWidth disabled={
              (sendMoneyAddress && sendMoneyAddress.address && Number(sendMoneyAmount) > 0 && (Number(currentFeeAO) + Number(sendMoneyAmount)) < Number(chooseTokenBalance) ? false : true)
              ||
              (isDisabledButton)
              } variant='contained' onClick={()=>handleWalletSendMoneyAO()}>
              {uploadingButton}
            </Button>
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

export default SendMoneyInputAmountAO
