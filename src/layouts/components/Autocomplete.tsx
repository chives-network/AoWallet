// ** React Imports
import { useEffect, useCallback, useState, ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'

// ** Types Imports
import { Settings } from '../../@core/context/settingsContext'

// ** Icon Imports
import Icon from '../../@core/components/icon'

interface Props {
  hidden: boolean
  settings: Settings
}

const AutocompleteComponent = ({ hidden }: Props) => {
  // ** States
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  useEffect(() => {
    if (!openDialog) {
      setSearchValue('')
    }
  }, [openDialog])

  useEffect(() => {
    setIsMounted(true)

    return () => setIsMounted(false)
  }, [])

  // Handle ESC & shortcut keys keydown events
  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      // ** Shortcut keys to open searchbox (Ctrl + /)
      if (!openDialog && event.ctrlKey && event.which === 191) {
        setOpenDialog(true)
      }
    },
    [openDialog]
  )

  // Handle shortcut keys keyup events
  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      // ** ESC key to close searchbox
      if (openDialog && event.keyCode === 27) {
        setOpenDialog(false)
      }
    },
    [openDialog]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyUp, handleKeydown])

  if (!isMounted) {
    return null
  } else {
    return (
      <Box >
        {!hidden && false ? (
          <TextField
            size="small"
            value={searchValue}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchValue(event.target.value)}
            InputProps={{
              style: { border: 0 }, 
              startAdornment: (
                <InputAdornment position='start' sx={{ color: 'text.primary' }}>
                  <Icon icon='mdi:magnify' />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment
                  position='end'
                  sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}
                >
                  <IconButton size='small' sx={{ p: 1 }}>
                    <Icon icon='mdi:close' fontSize={20} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        ) : null}
      </Box>
    )
  }
}

export default AutocompleteComponent
