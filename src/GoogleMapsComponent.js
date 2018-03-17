import * as React from 'react';
import * as scriptjs from 'scriptjs';
import './app.css';

export default class GoogleMapsComponent extends React.Component {

    divMap;
    divDirectionsPanel;
    directionsDisplay;

    constructor() {
        super()
        this.state = {
            currentLat: null,
            currentLong: null,
            endLat: null,
            endLong: null
        }
    }

    componentWillMount() {

        if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.successFunction.bind(this));
        } else {
          alert('Parece que a Geolocalização, que é necessária para esta página, não está ativada no seu navegador.');
        }
    }

    successFunction(position) {

        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        this.setState({
            currentLat: lat,
            currentLong: long
        })

        scriptjs('https:/maps.googleapis.com/maps/api/js?key=AIzaSyA1O7O4no8g3_NtA41ZoOlmWfR6XH-41wU&sensor=false',
        () => {
            this.createMap();
            // if (!this.props.disablePanel) {
            //     this.createPanel();
            // }
            
        });
    }

    componentDidMount() {
        if(SpeechSynthesisUtterance) {
            let msg = new SpeechSynthesisUtterance('Bem-vindo');
            window.speechSynthesis.speak(msg);
        }
    }

    createMap() {
        this.directionsDisplay = new window.google.maps.DirectionsRenderer();
        let currentLatLong = new window.google.maps.LatLng(this.state.currentLat, this.state.currentLong);

        let options = {
            zoom: 13,
            center: currentLatLong,
            mapTypeControl: true,
            mapTypeId: window.google.maps.MapTypeId.ROADMAP
        };

        let map = new window.google.maps.Map(this.divMap, options);
        this.directionsDisplay.setMap(map);

    }
    
    calculateRoute() {

        if(SpeechSynthesisUtterance) {
            let msg = new SpeechSynthesisUtterance(`Sua rota está pronta para ${this.input.value}`);
            window.speechSynthesis.speak(msg);
        }

        let directionsService = new window.google.maps.DirectionsService();
        let start = new window.google.maps.LatLng(this.state.currentLat, this.state.currentLong);
        let end =  new window.google.maps.LatLng(this.state.endLat, this.state.endLong);

        let request = {
            origin: start,
            destination: end,
            travelMode: window.google.maps.DirectionsTravelMode.DRIVING
        };

        directionsService.route(request, (response, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
                this.directionsDisplay.setDirections(response);
            }
        });

    }

    fetchLocation() {

        let geocoder = new window.google.maps.Geocoder();
        let address = this.input.value;

        geocoder.geocode( { 'address': address}, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK) {
            let latitude = results[0].geometry.location.lat();
            let longitude = results[0].geometry.location.lng();
                this.setState({
                    endLat: latitude,
                    endLong: longitude
                })

                this.calculateRoute();
            } 
        }); 
    }


    render() {

        let style = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        return (
            <div>
                <div className="search">
                    <input type="combobox" ref={input => this.input = input }/>
                    <button onClick={ () => this.fetchLocation() } >Buscar</button>
                </div>
                <div 
                    style={style} 
                    ref={divMap =>  this.divMap = divMap}></div>
            </div>
        );
    }
}