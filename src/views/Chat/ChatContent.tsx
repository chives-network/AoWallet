// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Badge from '@mui/material/Badge'
import MuiAvatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// ** Custom Components Import
import ChatLog from './ChatLog'
import { useTranslation } from 'react-i18next'
import SendMsgForm from 'src/views/Chat/SendMsgForm'
import { GetAppAvatar } from 'src/functions/AoConnect/MsgReminder'

const ChatContent = (props: any) => {
  // ** Props
  const {
    store,
    hidden,
    sendMsg,
    downloadButtonDisable,
    sendButtonDisable,
    sendButtonLoading,
    sendButtonText,
    sendInputText,
    processingMessages,
    ClearButtonClick,
    handleGetAllMessages,
    app,
    handleDeleteOneChatLogById,
    myAoConnectTxId,
    setMember,
    setUserProfileRightOpen,
    allMembers,
    loadingGetChatLogs
  } = props

  const { t } = useTranslation()

  const [rowInMsg, setRowInMsg] = useState<number>(1)
  
  const maxRows = 8

  const handleSetRowInMsg = (row: number) => {
    setRowInMsg(row)
  }

  const renderContent = () => {
          return (
            <Box
              sx={{
                flexGrow: 1,
                width: '100%',
                height: '100%',
                backgroundColor: 'action.hover'
              }}
            >
              <Box
                sx={{
                  py: 3,
                  px: 5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: theme => `1px solid ${theme.palette.divider}`
                }}
              >            
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center'}} >
                    <Badge
                      overlap='circular'
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                      }}
                      sx={{ mr: 3 }}
                      badgeContent={
                        <Box
                          component='span'
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            color: `primary.main`,
                            boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`,
                            backgroundColor: `primary.main`
                          }}
                        />
                      }
                    >
                      <MuiAvatar
                        src={GetAppAvatar(app.logo)}
                        alt={app.name}
                        sx={{ width: '2rem', height: '2rem' }}
                        onClick={
                          ()=>{
                            //setUserProfileRightOpen(true)
                            //setMember({MemberId: app.id, MemberName: app.name, MemberAvatar: app.logo})
                          }
                        }
                      />
                    </Badge>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                        {app.name}
                      </Typography>
                    </Box>

                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button size="small" onClick={()=>ClearButtonClick()}>{t('Clear')}</Button>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button size="small" onClick={()=>handleGetAllMessages()} disabled={downloadButtonDisable}>{t('Download')}</Button>
                  </Box>
                </Box>
              </Box>

              <ChatLog hidden={hidden} data={{ ...store?.selectedChat, userContact: store?.userProfile }} app={app} rowInMsg={rowInMsg} maxRows={maxRows} sendButtonDisable={sendButtonDisable} handleDeleteOneChatLogById={handleDeleteOneChatLogById} sendMsg={sendMsg} store={store} processingMessages={processingMessages} myAoConnectTxId={myAoConnectTxId} setUserProfileRightOpen={setUserProfileRightOpen} setMember={setMember} allMembers={allMembers} loadingGetChatLogs={loadingGetChatLogs}/>

              <SendMsgForm store={store} sendMsg={sendMsg} sendButtonDisable={sendButtonDisable} sendButtonLoading={sendButtonLoading} sendButtonText={sendButtonText} sendInputText={sendInputText} rowInMsg={rowInMsg} handleSetRowInMsg={handleSetRowInMsg} maxRows={maxRows} />

            </Box>
          )
  }

  return renderContent()
}

export default ChatContent
