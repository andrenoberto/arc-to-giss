import * as JsonFile from 'jsonfile';
import * as Jetty from 'jetty';
import {GeoRoute} from './collections/GeoRoute';
import {InterGeoRoute} from "./collections/InterGeoRoute";
import {IPoint} from "./collections/iPoint";

// Let's arrange
const argv = require('minimist')(process.argv);
debugger;
const data = require(argv.input || './example.json');
const jetty = new Jetty(process.stdout);
let obj: any;

//Let's start processing our data and obtain the results
switch (argv.algorithm) {
    case 'InterGeoRoute':
        const interGeoRoute = new InterGeoRoute(data);
        interGeoRoute.processFeaturesFromData();
        obj = interGeoRoute.getFeatures();
        break;
    case 'IPoint':
        const iPoint = new IPoint(data);
        iPoint.processFeaturesFromData();
        obj = iPoint.getFeatures();
        break;
    case 'GeoRoute':
        let documents = require(argv.data);
        const geoRoute = new GeoRoute(data, documents);
        geoRoute.processFeaturesFromData();
        obj = geoRoute.getFeatures();
        break;
}

// Finally, let's save our result into a file
if (obj) {
    const file = argv.output || './output_result.json';
    JsonFile.writeFile(file, obj, {spaces: 2}, (err) => {
        jetty.text(err ? err : '\nOutput file has been successfully written.');
    });
}
