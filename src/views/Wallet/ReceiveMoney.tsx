// ** MUI Imports
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { QRCode } from 'react-qrcode-logo';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import { Share } from '@capacitor/share';

import toast from 'react-hot-toast'


const ReceiveMoney = ({ currentAddress, currentToken } : any) => {

  const { t } = useTranslation()

  return (
    <Grid container direction="column" alignItems="center" justifyContent="center" spacing={2} sx={{ minHeight: '100%', p: 2 }}>
      <Grid item>
        <QRCode value={currentAddress} size={180} />
      </Grid>
      <Grid item>
        <Typography variant="body1"
          sx={{mt: 3, wordWrap: 'break-word', wordBreak: 'break-all', textAlign: 'center', maxWidth: '100%', fontSize: '0.8125rem !important' }}
          onClick={()=>{
              navigator.clipboard.writeText(currentAddress);
              toast.success(t('Copied success') as string, { duration: 1000, position: 'top-center' })
          }}>
          {currentAddress}
        </Typography>
      </Grid>
      <Grid item>
        <Button variant="outlined" sx={{mt: 3}} startIcon={<ContentCopyIcon />}
          onClick={()=>{
              navigator.clipboard.writeText(currentAddress);
              toast.success(t('Copied success') as string, { duration: 1000, position: 'top-center' })
          }}>
          {t('Copy') as string}
        </Button>
      </Grid>
      <Grid item>
        <Typography variant="body1" sx={{mt: 3, wordWrap: 'break-word', wordBreak: 'break-all', textAlign: 'center', maxWidth: '100%', fontSize: '1rem !important' }}>
          {currentToken == 'Ar' ? 'Arweave Blockchain' : 'Chivesweave Blockchain'} {currentToken}
        </Typography>
      </Grid>
      <Grid item sx={{ mt: 4, width: '100%' }}>
        <Button variant="contained" startIcon={<ShareIcon />} fullWidth onClick={async ()=>{
          await Share.share({
            text: currentAddress,
          });
        }}>
        {t('Share') as string}
        </Button>
      </Grid>
    </Grid>
  )

}

export default ReceiveMoney
