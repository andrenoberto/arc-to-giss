import * as Jetty from 'jetty';
import {DataHandler} from "../shared/DataHandler";

export class IPoint implements DataHandler {
    data: Array<any>;
    jetty = new Jetty(process.stdout);
    obj: Array<Object> = [];

    constructor(data: any) {
        this.data = data;
    }

    getFeatures(): Array<Object> {
        return this.obj;
    }

    processFeaturesFromData(): void {
        let counter = 0;
        this.jetty.clear();
        this.jetty.text('\niPoint process starting...\n\n');
        this.data.forEach(data => {
            this.jetty.moveTo([0, 0]).text(`\nProcessing document ${++counter} of ${this.data.length}\n`);

            let listGeoPoint: Array<any>;
            let listIdRef: Array<string> = [];
            let type = "Intersection";

            listGeoPoint = data.listGeoPoint;
            listIdRef.push(data._id);

            this.obj.push({
                listGeoPoint,
                listIdRef,
                type
            });
        })
    }
}
