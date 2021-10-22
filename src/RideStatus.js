import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

export class RideStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rideStatus: {},
      ETA: '',
      RideState: ''
    };
  }
  componentDidUpdate = (prevProps, prevState) => {

    if (prevProps.BookRes === this.props.BookRes) {
      console.log('data not updated')
    }
    else {
      this.getStatus()
    }
  }

  getStatus = () => {
    let rideStatusBody = {
      "reference": this.props.BookRes.reference
    };

    fetch('https://test.bzzt.se/api/external/ride_status', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 0E919FC4E1A356007719337034B72C2750FFB388FFF8DF5C1C68536D0A8B8BBB',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rideStatusBody),
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          response.text().then(text => {

            const error = JSON.parse(text);
            throw console.log(error.message)
          })
        }
      })
      .then(data => {
        if (data !== undefined) {
          if (data.status === 'accepted') {
            this.setState({
              rideStatus: data,
              ETA: data.eta.destination.dynamic,
              RideState: data.ride.state
            })
          }
          else {
            this.setState({ rideStatus: data })
          }
        }
      })
  }

  cancelRide = () => {
    let rideStatusBody = {
      "reference": this.props.BookRes.reference
    };

    fetch('https://test.bzzt.se/api/external/cancel_ride', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 0E919FC4E1A356007719337034B72C2750FFB388FFF8DF5C1C68536D0A8B8BBB',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rideStatusBody),
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
          let cancelled = data.cancelled ? 'Ride cancelled' : 'Ride not cancelled'
          this.setState({
            rideStatus: '',
            ETA: '',
            RideState: ''
          },
            () => alert(cancelled))
        }
      })
  }
  render() {
    let BookRes = this.props.BookRes;
    let rideStatus = this.state.rideStatus;
    let ETA = this.state.ETA;
    let RideState = this.state.RideState;
    return (
      <Card>
        <CardContent>
          <Typography variant="body2" component="p">
            Ride Status: {rideStatus !== null ? rideStatus.status : 'Not booked'}
            <br />
            Refrence: {BookRes !== null ? BookRes.reference : 'Not booked'}
            <br />
            ETA: {ETA !== '' ? ETA : 'Not booked'}
            <br />
            Ride State: {RideState !== '' ? RideState : 'Not booked'}
            <br />
          Estimated Fare: {rideStatus !== null ? rideStatus.estimatedFare : 'Not booked'}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => this.getStatus()}>Refresh Status</Button>
          <Button size="small" onClick={() => this.cancelRide()}>Cancel Ride</Button>
        </CardActions>
      </Card>
    );

  }
}

export default RideStatus;