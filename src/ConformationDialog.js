import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export class ConformationDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rideRes: {}
    };
  }

  handleAgree = () => {
    let toCoordinates = this.props.toCoordinates;
    let fromCoordinates = this.props.fromCoordinates;
    let rideBody = {

      "type": "delivery",
      "from": {
        "latitude": toCoordinates.lat,
        "longitude": toCoordinates.lng
      },
      "to": {
        "latitude": fromCoordinates.lat,
        "longitude": fromCoordinates.lng
      },
      "metadata": {
        "BillingReference": "reference-123"
      }

    }

    fetch('https://test.bzzt.se/api/external/book_ride', {
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
          this.props.handleBookRes(data)
        }
      })
      .catch(error => alert(error));
  }
  
  handleClose = () => {
    this.setState({ open: false })
  };

  render() {
    let open = this.props.openConfDialog;
    let timeEstimate = this.props.timeEstimate
    return (
      <div>
        <Dialog
          open={open}
          onClose={() => this.props.handleClose()}
          aria-labelledby="conformation-dialog-title"
          aria-describedby="conformation-dialog-description"
        >
          <DialogTitle id="conformation-dialog-title">{"Conformation"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="conformation-dialog-description">
              Your ride takes {timeEstimate.duration + timeEstimate.unit}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.props.handleClose()} color="primary">
              Disagree
          </Button>
            <Button onClick={() => this.handleAgree()} color="primary" autoFocus>
              Agree
          </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default ConformationDialog;
