import React, { Component } from 'react';
import './App.css';
import MapContainer from './MapContainer';
import NameSearch from './NameSearch';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import BzztLogo from './Images/BzztLogo.jpg';
import ConformationDialog from './ConformationDialog';
import RideStatus from './RideStatus';
import { GoogleApiWrapper } from 'google-maps-react';


export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toCoordinates: {},
      fromCoordinates: {},
      timeEstimate: {},
      openConfDialog: false,
      BookRes: {},
      route: []
    };
  }
  state = {
    toCoordinates: {},
    fromCoordinates: {}
  };

  setCoordinates = (coordinates, type) => {
    this.setState({
      [type]: coordinates
    })
  }

  handleClose = () => {
    this.setState({
      openConfDialog: false,
      timeEstimate: {},
      BookRes: {}
    })
  }

  handleSubmit = () => {
    let toCoordinates = this.state.toCoordinates;
    let fromCoordinates = this.state.fromCoordinates;
    let rideBody = {
      "from": {
        "latitude": toCoordinates.lat,
        "longitude": toCoordinates.lng
      },
      "to": {
        "latitude": fromCoordinates.lat,
        "longitude": fromCoordinates.lng
      }
    }

    fetch('https://test.bzzt.se/api/external/time_estimate', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 0E919FC4E1A356007719337034B72C2750FFB388FFF8DF5C1C68536D0A8B8BBB',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rideBody),
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          response.text().then(text => {

            const error = JSON.parse(text);
            throw alert(error.message)
          })
        }
      })
      .then(data => {
        if (data !== undefined) {
          this.setState({ timeEstimate: data, openConfDialog: true, BookRes: {} })
        }
      })
      .catch(error => alert(error));
  }

  handleBookRes = (data) => {

    this.setState({ BookRes: data, route: data.route.estimated, openConfDialog: false })
  }

  rideStatus = (BookRes) => {
    if (Object.keys(BookRes).length !== 0) {
      return <RideStatus BookRes={BookRes} />
    }
  }
  render() {
    let openConfDialog = this.state.openConfDialog;
    let timeEstimate = this.state.timeEstimate;
    let toCoordinates = this.state.toCoordinates;
    let fromCoordinates = this.state.fromCoordinates;
    let BookRes = this.state.BookRes;
    let route = this.state.route;
    return (
      <div>
        <Grid container
          direction="row"
          justify="flex-start"
          alignItems="center">
          <Grid item xs={6} sm={3}>
            <form className="form-wrapper">
              <img src={BzztLogo} alt={'BzztLogo'} />
              <h1 className='heading'>Book your ride</h1>
              <NameSearch setCoordinates={(e) => this.setCoordinates(e, 'fromCoordinates')} type={'From'} />
              <NameSearch setCoordinates={(e) => this.setCoordinates(e, 'toCoordinates')} type={'To'} />
              <Button onClick={() => this.handleSubmit()} variant="outlined" color="primary">Book Ride</Button>
              <ConformationDialog
                openConfDialog={openConfDialog}
                toCoordinates={toCoordinates}
                fromCoordinates={fromCoordinates}
                timeEstimate={timeEstimate}
                handleBookRes={(e) => this.handleBookRes(e)}
                handleClose={() => this.handleClose()} />
              <br />
              {this.rideStatus(BookRes)}
            </form>
          </Grid>
          <Grid item xs>
            <MapContainer
              google={this.props.google}
              fromCoordinates={fromCoordinates}
              toCoordinates={toCoordinates}
              route={route} />
          </Grid>
        </Grid>


      </div>
    );

  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAnjGimBr-RVx2HyMgWCGSfKehHC5j3vTE'
})(App);