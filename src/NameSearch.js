import React, { Component } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import './App.css';
import TextField from '@material-ui/core/TextField';
import './App.css';

export class NameSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      coordinates: {
        lat: null,
        lng: null
      }
    };
  }

  handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);

    this.setState({
      address: value
    }, () => {
      this.props.setCoordinates(latLng);
    })

  };

  render() {
    let address = this.state.address;
    let type = this.props.type;
    const searchOptions = {
      componentRestrictions: { country: ['swe'] }
    }
    return (
      <div className='text-field' >
        <PlacesAutocomplete
          value={address}
          onChange={e => this.setState({ address: e })}
          onSelect={this.handleSelect}
          searchOptions={searchOptions}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <TextField {...getInputProps({ placeholder: "Type address" })} type='text' label={type} variant="outlined" />

              <div>
                {loading ? <div>...loading</div> : null}

                {suggestions.map(suggestion => {
                  const style = {
                    backgroundColor: suggestion.active ? "#B4D5FE" : "#fff",
                    maxWidth: '200px'
                  };

                  return (
                    <div {...getSuggestionItemProps(suggestion, { style })}>
                      {suggestion.description}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
      </div>
    );

  }
}

export default NameSearch;