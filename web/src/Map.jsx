import React from 'react'
import { GoogleMap, MarkerF } from '@react-google-maps/api';

const Map = ({ place, onDragEnd }) => {

  const containerStyle = {
    height: '400px',
    alignContent: 'center'
  }

  const defaultProps = {
    zoom: 13
  }
  
  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      zoom={defaultProps.zoom}
      center={place.geo}
    >
      <MarkerF position={place.geo} draggable onDragEnd={onDragEnd} />
    </GoogleMap>
  )
}

const mapView = ({ place, onDragEnd }) => (
  <Map
    place={place}
    onDragEnd={onDragEnd}
  />
)

export default mapView