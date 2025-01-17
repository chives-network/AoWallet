
// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Next Imports
import Link from 'next/link'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import ReactAudioPlayer from 'react-audio-player';

import { formatHash } from 'src/configs/functions';
import { Fragment } from 'react'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import authConfig from 'src/configs/auth'

const ImageRectangle = ( {item, backEndApi, FileType} : any) => {
  // ** Hook
  const { t } = useTranslation()

  const FileMap: { [key: string]: string } = {}
  item?.tags.map((Item: { [key: string]: string }) => {
    FileMap[Item.name] = Item.value;
  });
  const FileName = FileMap['File-Name'];
  const timestamp = item.block.timestamp;
  const date = new Date(timestamp * 1000);

  const EntityType = FileMap['Entity-Type'];
  const EntityAction = FileMap['Entity-Action'];
  const EntityTarget = FileMap['Entity-Target'];
  const EntityTargetText = FileMap['Entity-Target-Text'];
  const FileTxId = FileMap['File-TxId'];
  let ImageUrl = ""
  if(FileTxId && FileTxId.length == 43) {
    ImageUrl = FileTxId
  }
  else {
    ImageUrl = item.id
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthAbbreviation = monthNames[date.getMonth()];
  const day = date.getDate();

  console.log("FileType", FileType)

  return (
    <Card>
      {FileType && (FileType=="png" || FileType=="jpeg" || FileType=="gif" || FileType=="image" || FileType=="word" || FileType=="excel" || FileType=="pptx") ?
        <Link href={`/txs/view/${item.id}`}>
          <CardMedia image={`${backEndApi}/${ImageUrl}/thumbnail`} sx={{ height: '11.25rem', objectFit: 'contain' }}/>
        </Link>
        :
        <Fragment></Fragment>
      }
      {FileType && FileType=="video" ?
        <Link href={`/txs/view/${ImageUrl}`}>
          <CardMedia image={`${backEndApi}/${ImageUrl}/thumbnail`} sx={{ height: '11.25rem', objectFit: 'contain' }}/>
        </Link>
        :
        <Fragment></Fragment>
      }
      {FileType && FileType=="audio" ?
        <Link href={`/txs/view/${ImageUrl}`}>
          <ReactAudioPlayer src={`${backEndApi}/${ImageUrl}`} controls style={{width: '100%'}}/>
        </Link>
        :
        <Fragment></Fragment>
      }
      {FileType && FileType=="pdf" ?
        <Link href={`/txs/view/${ImageUrl}`}>
          <CardMedia image={`${backEndApi}/${ImageUrl}/thumbnail`} sx={{ height: '11.25rem', objectFit: 'contain' }}/>
        </Link>
        :
        <Fragment></Fragment>
      }
      {FileType && FileType=="stl" ?
        <Link href={`/txs/view/${ImageUrl}`}>
          <CardMedia image={`${backEndApi}/${ImageUrl}/thumbnail`} sx={{ height: '11.25rem', objectFit: 'contain' }}/>
        </Link>
        :
        <Fragment></Fragment>
      }
      <CardContent sx={{ m: 0, p: 0 }}>
        {authConfig ?
        <Fragment>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, pt: 1, ml: 1, pl: 1 }}>
            <CustomAvatar skin='light' variant='rounded' sx={{ mr: 1, width: '2.6rem', height: '3rem' }}>
              <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography
                  variant='body2'
                  sx={{ fontWeight: 500, lineHeight: 1.29, color: 'primary.main', letterSpacing: '0.47px' }}
                >
                  {monthAbbreviation}
                </Typography>
                <Typography variant='h6' sx={{ mt: -0.75, fontWeight: 600, color: 'primary.main' }}>
                  {day}
                </Typography>
              </Box>
            </CustomAvatar>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='body1' sx={{ fontWeight: 450 }}>{formatHash(FileName, 6)}</Typography>
              <Typography variant='caption' sx={{ ml: '2px', mt: '2px' }}>{formatHash(item.owner.address, 6)}</Typography>
            </Box>
          </Box>
        </Fragment>
        :
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography sx={{ fontWeight: 600 }}>{formatHash(FileName, 12)}</Typography>
        </Box>
        }
      </CardContent>
    </Card>
  )
}

export default ImageRectangle
