import * as Jetty from 'jetty';
import {DataHandler} from "../shared/DataHandler";

export class InterGeoRoute implements DataHandler {
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
            // Our model reference. We're gonna use it for defining each InterGeoRoute instance
            let listGeoPoint: Array<any> = [];
            // Obtains coordinates from our track section.
            if (geoRoute.paths) {
                listGeoPoint.push({
                    x: geoRoute.paths[0][0][0],
                    y: geoRoute.paths[0][0][1]
                });
            }
            this.obj.push({
                listGeoPoint,
            });
        });
    }
}
