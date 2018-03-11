import * as jsonfile from 'jsonfile';
import * as Jetty from 'jetty';
// Here we get our input json file
const data = require(process.env.npm_package_config_input || './example.json');
// This package will extend our console.log features
let jetty = new Jetty(process.stdout);
jetty.clear();
// Here we're gonna store all of our restructured objects
const features = (<any>data).features;
let obj: Array<object> = [];
let featuresLength = features.length;
let counter = 0;
// Let's do our job
features.forEach(element => {
    jetty.moveTo([0, 0]).text(`\nProcessing feature ${++counter} of ${featuresLength}\n`);
    const geoRoute = element.geometry;
    const geoProperty = element.attributes;
    // Our model reference. We're gonna use it for defining each GeoRoute instance
    let listGeoPoint: Array<any> = [];
    let curveGeoPoint: Array<any> = [];
    let listProperty: Object;
    let listSrcProperty: Object;
    let length: number;
    // Obtains coordinates from our track section.
    if (geoRoute.paths) {
        geoRoute.paths.forEach(pathElement => {
            pathElement.forEach(coordinates => {
                listGeoPoint.push({
                    x: coordinates[0],
                    y: coordinates[1]
                });
            });
        });
    }
    // This one will cover curve paths' case
    if (geoRoute.curvePaths) {
        geoRoute.curvePaths.forEach(curvePaths => {
            listGeoPoint.push(
                {
                    x: curvePaths[0][0],
                    y: curvePaths[0][1]
                }
            );
            curvePaths[1].c.forEach(coordinates => {
                curveGeoPoint.push({
                    x: coordinates[0],
                    y: coordinates[1]
                });
            });
        });
        listGeoPoint.push({
            curvePaths: curveGeoPoint
        });
    }
    // Get only those properties we're interested in
    listProperty = {
        trackSectionId: geoProperty.idtrechovia,
        placeId: geoProperty.idlogradouro,
        placeName: geoProperty.nomeusual,
        placeClassification: geoProperty.classificacaoctb,
    };
    listSrcProperty = element;
    length = geoProperty['st_length(shape)'];
    // Let's push a new section into our object
    obj.push({
        listGeoPoint,
        listProperty,
        listSrcProperty,
        length
    });
});
// Finally, let's save our result into a file
jetty.text('\nWriting process started...');
const file = process.env.npm_package_config_output || './geoRouteSection.json';
jsonfile.writeFile(file, obj, {spaces: 2}, (err) => {
    jetty.text(err ? err : '\nOutput file has been successfully written.');
});
