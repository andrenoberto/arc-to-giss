import * as JsonFile from 'jsonfile';
import * as Jetty from 'jetty';
import {GeoRoute} from './GeoRoute';

// Let's get our input data
const data = require(process.env.npm_package_config_input || './example.json');
const geoRoute = new GeoRoute(data);

// This package will extend our console.log features
let jetty = new Jetty(process.stdout);
jetty.clear();

//Let's process our features and obtain the results
geoRoute.processFeaturesFromData();
const obj = geoRoute.getFeatures();

// Finally, let's save our result into a file
jetty.text('\nWriting process started...');
const file = process.env.npm_package_config_output || './output_result.json';
JsonFile.writeFile(file, obj, {spaces: 2}, (err) => {
    jetty.text(err ? err : '\nOutput file has been successfully written.');
});
