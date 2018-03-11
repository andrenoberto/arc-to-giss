import * as JsonFile from 'jsonfile';
import * as Jetty from 'jetty';
import {GeoRoute} from './GeoRoute';

// Let's arrange
const argv = require('minimist')(process.argv);
debugger;
const data = require(argv.input || './example.json');
const jetty = new Jetty(process.stdout);
let obj: any;

//Let's start processing our data and obtain the results
//jetty.clear();
switch (argv.algorithm) {
    case 'GeoRoute':
        const geoRoute = new GeoRoute(data);
        geoRoute.processFeaturesFromData();
        obj = geoRoute.getFeatures();
        break;
}

// Finally, let's save our result into a file
if (obj) {
    jetty.text('\nWriting process started...');
    const file = argv.output || './output_result.json';
    JsonFile.writeFile(file, obj, {spaces: 2}, (err) => {
        jetty.text(err ? err : '\nOutput file has been successfully written.');
    });
}
