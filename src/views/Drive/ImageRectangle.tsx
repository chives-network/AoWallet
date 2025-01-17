
// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'

// ** Next Imports
import Link from 'next/link'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import ReactAudioPlayer from 'react-audio-player';

import { formatHash } from 'src/configs/functions';
import { Fragment } from 'react'

import authConfig from 'src/configs/auth'

const ImageRectangle = ( {item, backEndApi, FileType, handleClickImageInAllDrive} : any) => {
  // ** Hook
  const FileMap: { [key: string]: string } = {}
  item?.tags.map((Item: { [key: string]: string }) => {
    FileMap[Item.name] = Item.value;
  });
  const FileName = FileMap['File-Name'];
  const timestamp = item.block.timestamp;
  const date = new Date(timestamp * 1000);

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
        <CardMedia image={`${backEndApi}/${ImageUrl}/thumbnail`} sx={{ height: '11.25rem', objectFit: 'contain' }} onClick={()=>handleClickImageInAllDrive(item)} />
        :
        <Fragment></Fragment>
      }
      {FileType && FileType=="video" ?
        <CardMedia image={`${backEndApi}/${ImageUrl}/thumbnail`} sx={{ height: '11.25rem', objectFit: 'contain' }} onClick={()=>handleClickImageInAllDrive(item)} />
        :
        <Fragment></Fragment>
      }
      {FileType && FileType=="audio" ?
        <ReactAudioPlayer src={`${backEndApi}/${ImageUrl}`} controls style={{width: '100%'}} />
        :
        <Fragment></Fragment>
      }
      {FileType && FileType=="pdf" ?
        <CardMedia image={`${backEndApi}/${ImageUrl}/thumbnail`} sx={{ height: '11.25rem', objectFit: 'contain' }} onClick={()=>handleClickImageInAllDrive(item)} />
        :
        <Fragment></Fragment>
      }
      {FileType && FileType=="stl" ?
        <CardMedia image={`${backEndApi}/${ImageUrl}/thumbnail`} sx={{ height: '11.25rem', objectFit: 'contain' }} onClick={()=>handleClickImageInAllDrive(item)} />
        :
        <Fragment></Fragment>
      }
      <Box sx={{ m: 0, p: 0, pb: 0 }}>
        {authConfig ?
          <Box sx={{ display: 'flex', alignItems: 'center', m: 1, p: 1 }}>
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
              <Typography variant='body1' sx={{ fontWeight: 450 }}>{formatHash(FileName, 5)}</Typography>
              <Typography variant='caption' sx={{ ml: '2px', mt: '2px' }}>{formatHash(item.owner.address, 5)}</Typography>
            </Box>
          </Box>
        :
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontWeight: 600 }}>{formatHash(FileName, 12)}</Typography>
          </Box>
        }
      </Box>
    </Card>
  )
}

export default ImageRectangle
