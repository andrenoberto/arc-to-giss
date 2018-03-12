import * as Jetty from 'jetty';
import {DataHandler} from "../shared/DataHandler";

export class GeoRoute implements DataHandler {
    data: Object;
    features: Array<any>;
    jetty = new Jetty(process.stdout);
    obj: Array<Object> = [];

    constructor(data: any) {
        this.data = data;
        this.features = (<any>this.data).features;
    }

    getFeatures(): Array<Object> {
        return this.obj;
    }

    processFeaturesFromData(): void {
        let counter = 0;
        this.jetty.clear();
        this.features.forEach(element => {
            this.jetty.moveTo([0, 0]).text(`\nProcessing feature ${++counter} of ${this.features.length}\n`);
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
            this.obj.push({
                listGeoPoint,
                listProperty,
                listSrcProperty,
                length
            });
        });
    }
}
