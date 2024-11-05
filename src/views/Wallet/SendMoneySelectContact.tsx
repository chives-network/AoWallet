// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CustomAvatar from '../../@core/components/mui/avatar'
import TextField from '@mui/material/TextField'
import { getInitials } from '../../@core/utils/get-initials'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { formatHash } from '../../configs/functions'



const SendMoneySelectContact = ({ searchContactkeyWord, setSearchContactkeyWord, setContactsAll, searchChivesContacts, encryptWalletDataKey, contactsAll, handleSelectAddress } : any) => {

  const { t } = useTranslation()

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sx={{height: 'calc(100% - 104px)', mt: 2}}>
          <Grid container spacing={2}>
            <TextField
              fullWidth
              size='small'
              value={searchContactkeyWord}
              placeholder={t('Search or Input Address') as string}
              sx={{ '& .MuiInputBase-root': { borderRadius: 2 }, mb: 3, ml: 2 }}
              onChange={(e: any)=>{
                setSearchContactkeyWord(e.target.value)
                const searchChivesContactsData = searchChivesContacts(e.target.value, encryptWalletDataKey)
                setContactsAll(searchChivesContactsData)
                console.log("e.target.value", e.target.value)
              }}
            />
          </Grid>
          <Grid container spacing={2}>
          {Object.keys(contactsAll).map((Address: any, index: number) => {

            return (
              <Grid item xs={12} sx={{ py: 1 }} key={index}>
                <Card>
                  <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.7}}>
                    <CustomAvatar
                      skin='light'
                      color={'primary'}
                      sx={{ mr: 0, width: 43, height: 43, fontSize: '1.5rem' }}
                    >
                      {getInitials(Address).toUpperCase()}
                    </CustomAvatar>
                    <Box sx={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', width: '100%' }} onClick={()=>handleSelectAddress({name: contactsAll[Address], address: Address})}
                      >
                      <Typography sx={{
                        color: 'text.primary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      >
                        {contactsAll[Address]}
                      </Typography>
                      <Box sx={{ display: 'flex'}}>
                        <Typography variant='body2' sx={{
                          color: `primary.dark`,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1
                        }}>
                          {formatHash(Address, 10)}
                        </Typography>

                      </Box>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            )

          })}
          </Grid>

      </Grid>
    </Grid>
  )

}

export default SendMoneySelectContact
