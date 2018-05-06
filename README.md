Arc-To-Giss
==============
This is a very specific script that converts a "Feature to JSON" from Arcgis to Giss City's model.

Instructions
==============

1. Clone it.
2. Run `npm install`
3. Run `npm start -- --input=INPUT_FILE_ADDRESS --output=OUTPUT_FILE_ADDRESS --algorithm=GeoRoute`
or you can use node directly like this:
`node app.js --input=INPUT_FILE_ADDRESS --output=OUTPUT_FILE_ADDRESS --algorithm=GeoRoute`

The algorithm argument is required to run.

### List of available algorithms:

Consider a GeoJSON file exported through a "Feature to JSON" from ArcGis as input file.

- `InterGeoRoute`:
Generates a list of GeoPoint. This will help us to identify relations later on.

- `GeoRoute`:
Generates a list with properties of a path that show the relation between two InterGeoRoute. It begins with a InterGeoRoute and ends with another InterGeoPoint

- `IPoint`:
Generates a list of IPoint's. Further it will help us creating ours AbsGeoRoutes. It represents an intersection in our geographical information system.

- `AbsGeoRoute`:
Generates a list of AbsGeoRoute. An AbsGeoRoute is made from two `IPoints`: `_from` & `_to`. An AbsGeoRoute is an abstract route represented by two intersection points.
