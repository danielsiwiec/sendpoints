import React from 'react'
import { Input, Grid } from '@mui/material'
import coordinates from 'parse-coords'
import { useJsApiLoader } from '@react-google-maps/api';

import Help from './Help'

const Search = ({ onSetPlace }) => {
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyDeyqJ4Zgbp6uoKDeE7k7b9roaMdq-HQco",
    libraries: ["geometry","places"]
  })
  
  return isLoaded ? (
    <Grid container >
      <Grid item xs={1} />
      <Grid item xs={10}>
        <Input fullWidth inputRef={attachAutocomplete(onSetPlace)} autoFocus placeholder="Freddie's Sandwiches" />
      </Grid>
      <Grid item xs={1}>
        <Help />
      </Grid>
    </Grid>
    ) : <></>
}

function attachAutocomplete (onSetPlace) {
  return element => {
    let autocomplete = new window.google.maps.places.Autocomplete(element)
    autocomplete.addListener('place_changed', () => {
      let place = autocomplete.getPlace().geometry ? normalizeGooglePlace(autocomplete.getPlace()) : tryCoordinates(element.value)
      onSetPlace(place)
    })
  }
}

function tryCoordinates (input) {
  return {
    name: input,
    geo: coordinates(input)
  }
}

const normalizeGooglePlace = googlePlace => ({
  name: googlePlace.name,
  geo: {
    lat: googlePlace.geometry.location.lat(),
    lng: googlePlace.geometry.location.lng()
  }
})

export default Search
