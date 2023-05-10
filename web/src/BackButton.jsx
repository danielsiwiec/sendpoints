import React from 'react'
import { Button } from '@mui/material'

const backButtonView = ({ onClick }) => (
  <Button variant='contained' color='secondary' onClick={onClick}>Back</Button>
)

export default backButtonView