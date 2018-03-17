import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import GoogleMapsComponent from './GoogleMapsComponent';
import './app.css';


ReactDOM.render(
    <GoogleMapsComponent
        // currentLatitude={-22.923049} 
        // currentLongitude={-43.373979}
        destinationLatitude={-22.997345}
        destinationLongitude={-43.358052}
    />, document.getElementById('root'));

registerServiceWorker();
