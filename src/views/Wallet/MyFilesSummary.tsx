import React, { useState, useEffect } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { getMyLatestFiles } from 'src/functions/ChivesDrive'
import { formatStorageSize, formatTimestamp } from 'src/configs/functions'
import { getXweWalletImageThumbnail } from 'src/functions/ChivesWallets'

import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'

// Styled component for the upload image inside the dropzone area
const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    marginRight: theme.spacing(15.75)
  },
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  },
  [theme.breakpoints.down('sm')]: {
    width: 160
  }
}))

const MyFilesSummary = ({ currentAddress, currentBalanceXwe, setCurrentTx, setPageModel, setLeftIcon, setTitle, setRightButtonIcon } : any) => {

  const { t } = useTranslation()

  const [myFiles, setMyFiles] = useState<any | null>(null);

  const getMyFiles = async (currentAddress: string) => {
    const getMyLatestFilesData = await getMyLatestFiles(currentAddress);
    setMyFiles(getMyLatestFilesData)
  }

  useEffect(() => {
    getMyFiles(currentAddress);
  }, [currentAddress]);

  console.log("currentBalanceXwe", currentBalanceXwe)

  return (
    <Grid container alignItems="left" justifyContent="center" spacing={2} sx={{ minHeight: '100%', pt: 0, pl: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2, pb: 0, width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'left', px: 4, pt: 3 }}>
          {t('My Files') as string}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'left', px: 2, pt: 3 }}>
          <IconButton sx={{ py: 0 }}
                    onClick={ ()=>{
                      if(currentBalanceXwe < 0.01) {
                        toast.error(t('Balance is insufficient, you can get 0.1 Xwe in Faucet page') as string, { duration: 2500, position: 'top-center' })
                      }
                      else {
                        setPageModel('UploadMyFiles')
                        setLeftIcon('ic:twotone-keyboard-arrow-left')
                        setTitle(t('Upload My Files') as string)
                        setRightButtonIcon('')
                      }
                    }}>
            <Icon icon={'ic:sharp-add-circle-outline'}/>
          </IconButton>
        </Box>
      </Box>
      {myFiles && myFiles.data && myFiles.data.length > 0 && myFiles.data.map((Item: any, Index: number)=>(
        <Grid item xs={12} sx={{ py: 0 }} key={Index}>
          <Card>
            <Box sx={{ display: 'flex', alignItems: 'center', pl: 2, py: 1}}
                    onClick={ ()=>{
                      setCurrentTx(Item)
                      setPageModel('ViewFile')
                      setLeftIcon('ic:twotone-keyboard-arrow-left')
                      setRightButtonIcon('')
                    }}>
              <CustomAvatar
                skin='light'
                color={'primary'}
                sx={{ mr: 0, width: 43, height: 43 }}
                src={getXweWalletImageThumbnail(Item)}
              >
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '65%', ml: 1.5 }}>
                <Typography
                  sx={{
                    color: 'text.primary',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    textAlign: 'left'
                  }}
                >
                  {Item.table.item_name}
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
                    {formatTimestamp(Item.table.timestamp)}
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
                  {formatStorageSize(Item.table.data_size)}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      ))}
      {myFiles && myFiles.data && myFiles.data.length == 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2, pb: 0, width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'left', px: 4, pt: 3 }}
                    onClick={ ()=>{
                      if(currentBalanceXwe < 0.01) {
                        toast.error(t('Balance is insufficient, you can get 0.1 Xwe in Faucet page') as string, { duration: 2500, position: 'top-center' })
                      }
                      else {
                        setPageModel('UploadMyFiles')
                        setLeftIcon('ic:twotone-keyboard-arrow-left')
                        setTitle(t('Upload My Files') as string)
                        setRightButtonIcon('')
                      }
                    }}>
            <Img alt='Upload img' src='/images/misc/upload.png' />
          </Box>
        </Box>
      )}
    </Grid>
  )

}

export default MyFilesSummary
