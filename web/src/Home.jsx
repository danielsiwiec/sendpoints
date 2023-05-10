import React, { Component } from 'react'
import { Grid } from '@mui/material'
import ReactGA from 'react-ga4'

import Search from './Search'
import ViewPlace from './ViewPlace'
import Hash from './Hash'
import { post } from './fetch'

const states = {
  SEARCH: 1,
  VIEW: 2,
  HASH: 3
}

export default class Home extends Component {
  constructor() {
    super()
    this.state = { state: states.SEARCH }
    this.onSetPlace = this.onSetPlace.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.onNameChange = this.onNameChange.bind(this)
    this.onBack = this.onBack.bind(this)
    this.onSend = this.onSend.bind(this)
  }

  render() {
    return (
      <Grid container
        alignContent='center'
        justifyContent='center'
        style={{ height: '100vh' }}
      >
        <Grid item xs={10} md={6}>
          {this.state.state === states.SEARCH && <Search onSetPlace={this.onSetPlace} />}
          {this.state.state === states.VIEW && <ViewPlace place={this.state.place} onDragEnd={this.onDragEnd} onNameChange={this.onNameChange} onSend={this.onSend} onBack={this.onBack} />}
          {this.state.state === states.HASH && <Hash hash={this.state.hash} onBack={this.onBack} />}
        </Grid>
      </Grid>
    )
  }

  componentDidMount() {
    ReactGA.initialize('UA-77110226-1')
    ReactGA.set({ page: window.location.pathname })
    ReactGA.pageview(window.location.pathname)
  }

  onSetPlace(place) {
    this.setState({ place })
    this.setState({ state: states.VIEW })
  }

  onDragEnd(marker) {
    let place = this.state.place
    place.geo = {
      lat: marker.latLng.lat(),
      lng: marker.latLng.lng()
    }
    this.setState({ place })
  }

  onNameChange(event) {
    let place = this.state.place
    place.name = event.target.value
    this.setState({ place })
  }

  onBack() {
    this.setState({ place: undefined })
    this.setState({ state: states.SEARCH })
  }

  onSend() {

    post('https://cors-anywhere.herokuapp.com/https://garmin-waypoints.herokuapp.com/locations', this.state.place).then(({ hash }) => {
      const payload = {
        id: hash,
        name: this.state.place.name,
        geo: {
          lat: this.state.place.geo.lat,
          long: this.state.place.geo.lng
        }
      }
      post('https://api.sendpoints.us', payload).then(({ hash }) => {
        this.setState({ hash })
        this.setState({ state: states.HASH })
      })
      this.setState({ hash })
      this.setState({ state: states.HASH })
    })
  }
}
