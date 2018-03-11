import * as Jetty from 'jetty';

export class GeoRoute {
    private counter = 0;
    private data: object;
    private features: Array<any>;
    private featuresLength: number;
    private jetty = new Jetty(process.stdout);
    private obj: Array<object> = [];

    public constructor(data: any) {
        this.data = data;
        this.features = (<any>this.data).features;
        this.featuresLength = this.features.length;
    }

    public getFeatures(): Array<object> {
        return this.obj;
    }

    public processFeaturesFromData(): void {
        this.jetty.clear();
        this.features.forEach(element => {
            this.jetty.moveTo([0, 0]).text(`\nProcessing feature ${++this.counter} of ${this.featuresLength}\n`);
            const geoRoute = element.geometry;
            const geoProperty = element.attributes;
            // Our model reference. We're gonna use it for defining each GeoRoute instance
            let listGeoPoint: Array<any> = [];
            let curveGeoPoint: Array<any> = [];
            let listProperty: object;
            let listSrcProperty: object;
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
            this.obj.push({
                listGeoPoint,
                listProperty,
                listSrcProperty,
                length
            });
        });
    }
}
