// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { getCurrentWallet } from '../../functions/ChivesWallets'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { styled } from '@mui/material/styles'
import Header from '../Layout/Header'

const ContentWrapper = styled('main')(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  padding: theme.spacing(6),
  transition: 'padding .25s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  }
}))

const Lottery = ({ encryptWalletDataKey }: any) => {
  // ** Hook
  const { t } = useTranslation()

  const contentHeightFixed = {}

  const [pageModel, setPageModel] = useState<string>('MainLottery')
  const [HeaderHidden, setHeaderHidden] = useState<boolean>(false)
  const [LeftIcon, setLeftIcon] = useState<string>('material-symbols:menu-rounded')
  const [Title, setTitle] = useState<string>(t('Lottery') as string)
  const [RightButtonText, setRightButtonText] = useState<string>('Edit')
  const [RightButtonIcon, setRightButtonIcon] = useState<string>('mdi:qrcode')
  const [chooseWallet, setChooseWallet] = useState<any>(null)
  const [chooseToken, setChooseToken] = useState<any>(null)
  const [chooseTokenBalance, setChooseTokenBalance] = useState<string | null>(null)
  const [isTokenModel, setIsTokenModel] = useState<boolean>(false)

  const preventDefault = (e: any) => {
    e.preventDefault();
  };

  const disableScroll = () => {

    console.log("preventDefault", preventDefault)

    //document.body.style.overflow = 'hidden';
    //document.addEventListener('touchmove', preventDefault, { passive: false });
  };

  const enableScroll = () => {

    console.log("preventDefault", preventDefault)

    //document.body.style.overflow = '';
    //document.removeEventListener('touchmove', preventDefault);
  };

  useEffect(() => {
    
    disableScroll();

    return () => {
      
      enableScroll();
    };

  }, []);

  const handleWalletGoHome = () => {
    setRefreshWalletData(refreshWalletData+1)
    setPageModel('MainWallet')
    setLeftIcon('material-symbols:menu-rounded')
    setTitle(t('Lottery') as string)
    setRightButtonText(t('QR') as string)
    setRightButtonIcon('mdi:qrcode')
    setChooseToken(null)
    setChooseTokenBalance(null)
    setIsTokenModel(false)
    console.log("isTokenModel", isTokenModel, chooseTokenBalance, chooseWallet)
  }
  
  const LeftIconOnClick = () => {
    switch(pageModel) {
      case 'ReceiveMoney':
      case 'AllTxs':
      case 'SendMoneySelectContact':
      case 'SendMoneyInputAmount':
      case 'ManageAssets':
      case 'ViewToken':
      case 'ScanQRCode':
        handleWalletGoHome()
        break
      case 'ReceiveMoneyAO':
      case 'SendMoneyInputAmountAO':
        break;
    }
  }

  
  const RightButtonOnClick = () => {
    console.log("chooseToken", chooseToken)

    if(RightButtonIcon == 'mdi:qrcode')  {
      setPageModel('ScanQRCode')
      setLeftIcon('mdi:arrow-left-thin')
      setTitle(t('Scan QRCode') as string)
      setRightButtonText(t('') as string)
      setRightButtonIcon('')
      setPage(0)
    }

    //handleWalletGoHome()
    
  }

  const [refreshWalletData, setRefreshWalletData] = useState<number>(0)


  useEffect(() => {    

    setHeaderHidden(false)
    setRightButtonIcon('mdi:qrcode')

    const getCurrentWalletTemp = getCurrentWallet(encryptWalletDataKey)
    setChooseWallet(getCurrentWalletTemp)

    const myTask = () => {
      setRefreshWalletData(refreshWalletData+1);
    };
    const intervalId = setInterval(myTask, 2 * 60 * 1000);
    
    return () => clearInterval(intervalId);

  }, []);

  const [page, setPage] = useState<number>(0)
  const [innerHeight, setInnerHeight] = useState<number | string>(0)

  useEffect(() => {
    const handleResize = () => {
      setInnerHeight(window.innerHeight);
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight;

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

  return (
    <Fragment>
      <Header Hidden={HeaderHidden} LeftIcon={LeftIcon} LeftIconOnClick={LeftIconOnClick} Title={Title} RightButtonText={RightButtonText} RightButtonOnClick={RightButtonOnClick} RightButtonIcon={RightButtonIcon}/>

      <Box
        component="main"
        sx={{
          flex: 1,
          overflowY: 'auto',
          marginTop: '48px', // Adjust according to the height of the AppBar
          marginBottom: '56px', // Adjust according to the height of the Footer
        }}
      >
        <ContentWrapper
            className='layout-page-content'
            sx={{
                ...(contentHeightFixed && {
                overflow: 'hidden',
                '& > :first-of-type': { height: `calc(100% - 104px)` }
                })
            }}
            >
              <Typography variant="body1" sx={{
                color: 'text.primary',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                lineHeight: 1.6,
                marginBottom: 2, 
                whiteSpace: 'pre-line', 
                maxWidth: '800px', 
                margin: 'auto', 
                padding: { xs: 2, sm: 3 }, 
                backgroundColor: 'background.paper',
                borderRadius: 1,
                boxShadow: 1, 
              }} dangerouslySetInnerHTML={{ __html: `While from a user perspective, there will be a smooth experience and seem like one contest, there’ll actually be two draws: one for the lottery and one for the jackpot. Both will run simultaneously. Note that wagering puts you in for a chance of winning both, however, there are some key differences between the lottery and the jackpot:

Lottery winners will always be paid out every 20 hours, with 100 prizes, or the total amount of players if less than 100, paid out regularly and the chance of winning depending on the amount of TokenA user wagers.

There’s a 2% chance that the jackpot will be won every 20 hours and a 0.1% chance that the entire Jackpot prize pool is won. If the jackpot is not won, it is rolled over to the next round and the prize pool increases until it is won.

1st: 20% of the lottery prize pool
2nd: 15% of the lottery prize pool
3rd: 10% of the lottery prize pool
4th: 8% of the lottery prize pool
5th: 7% of the lottery prize pool
6th: 6% of the lottery prize pool
7th: 5% of the lottery prize pool
8th: 4% of the lottery prize pool
9th: 3% of the lottery prize pool
10th: 2% of the lottery prize pool
11th to 100th: 0.333% to 0.111% 
(in increments of 0.00247%) of the lottery prize pool.
              ` }} />

        </ContentWrapper>
      </Box>
    </Fragment>
  )
}

export default Lottery
