// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CircularProgress from '@mui/material/CircularProgress'

import { getXweWalletImageThumbnail } from 'src/functions/ChivesWallets'

import axios from 'axios'
import authConfig from 'src/configs/auth'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

const BlockRewards = () => {
  // ** Hook
  const { t } = useTranslation()

  const pageModel = 'Main'

  const [page, setPage] = useState<number>(0)
  const [innerHeight, setInnerHeight] = useState<number | string>(0)

  const [totalRecords, setTotalRecords] = useState<number | null>(null) // Xwe
  const [records, setRecords] = useState<any[]>([]) // Xwe
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isLoadingFinished, setIsLoadingFinished] = useState<boolean>(false)

  useEffect(() => {
    const handleResize = () => {
      setInnerHeight(window.innerHeight);
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight;

      console.log("windowHeight", windowHeight);
      console.log("documentHeight", documentHeight);
      console.log("innerHeight", innerHeight);
      console.log("scrollY", scrollY);
      console.log("page", page);

      if (scrollY + windowHeight >= documentHeight) {
        setPage(prevPage => {

          return prevPage + 1;
        });
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    // 初始设置 innerHeight
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [innerHeight, page]);

  useEffect(() => {
    const processWallets = async () => {
      if(isLoadingFinished == false && pageModel == 'Main')  {
        setIsLoading(true)
        try {
          const response = await axios.get(authConfig.backEndApiXwe + '/blockreward');
          if(response && response.data) {
            const getBlockRewardsData = response.data
            if(getBlockRewardsData && getBlockRewardsData.data && getBlockRewardsData.data.length > 0)  {
              setRecords((preV: any)=>(
                [...preV, ...getBlockRewardsData.data]
              ))
              setTotalRecords(getBlockRewardsData.total)
            }
            if(getBlockRewardsData && getBlockRewardsData.data && getBlockRewardsData.data.length == 0) {
              setIsLoadingFinished(true)
              setTotalRecords(getBlockRewardsData.total)
            }
          }
          else {

            return
          }
        }
        catch (error) {
            console.error(`Error getBlockRewards:`, error);
        }
        setIsLoading(false)
      }
    };
    processWallets();
  }, [])


  return (
    <Fragment>
      <Box>
        {pageModel == "Main" && (
          <Grid container alignItems="left" justifyContent="center" spacing={2} sx={{ minHeight: '100%', pt: 0, pl: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 0, pb: 0, width: '100%' }}>

            </Box>
            {records && records.length > 0 && records.map((Item: any, Index: number)=>(
              <Grid item xs={12} sx={{ py: 0 }} key={Index}>
                <Card>
                  <Box sx={{ display: 'flex', alignItems: 'center', pl: 2, py: 1}} >
                    <CustomAvatar
                      skin='light'
                      color={'primary'}
                      sx={{ mr: 0, width: 43, height: 43 }}
                      src={getXweWalletImageThumbnail(Item)}
                    >
                    </CustomAvatar>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '60%', ml: 1.5 }}>
                      <Typography
                        sx={{
                          color: 'text.primary',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          textAlign: 'left'
                        }}
                      >
                        {Item.reward_addr}
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
                          {t('Rewards in last 24 hours')} {(Index+1)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box textAlign="right" sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                      <Typography variant='h6' sx={{
                        color: `info.dark`,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        mr: 2,
                        ml: 2
                      }}>
                        {Item.reward_amount}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
            {isLoading && isLoadingFinished == false && (
              <Fragment>
                <Grid container spacing={5}>
                    <Grid item xs={12}>
                        <Box sx={{ mt: 5, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <CircularProgress sx={{ mb: 4 }} />
                            <Typography sx={{mt: 3}}>{`${t(`Loading`)}`} ...</Typography>
                        </Box>
                    </Grid>
                </Grid>
              </Fragment>
            )}
            {isLoadingFinished == true && Number(totalRecords) > 0 && (
              <Fragment>
                <Grid container spacing={5}>
                    <Grid item xs={12}>
                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <Typography sx={{mt: 3}}>{`${t(`Loaded All Data`)}`}</Typography>
                        </Box>
                    </Grid>
                </Grid>
              </Fragment>
            )}
          </Grid>
        )}
      </Box>
    </Fragment>
  )
}

export default BlockRewards
