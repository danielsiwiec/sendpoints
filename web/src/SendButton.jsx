import React from 'react'
import { Button } from '@mui/material'

const sendButtonView = ({ onClick }) => {
  return <Button variant='contained' color='primary' onClick={onClick}>Send</Button>
}

export default sendButtonView