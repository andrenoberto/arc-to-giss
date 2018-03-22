import * as Jetty from 'jetty';
import {DataHandler} from "../shared/DataHandler";

export class IPoint implements DataHandler {
    documents: Array<any>;
    jetty = new Jetty(process.stdout);
    obj: Array<Object> = [];

    constructor(documents: any) {
        this.documents = documents;
    }

    getFeatures(): Array<Object> {
        return this.obj;
    }

    processFeaturesFromData(): void {
        let counter = 0;
        this.jetty.clear();
        this.jetty.text('\nDocument process starting...\n\n');
        this.documents.forEach(document => {
            this.jetty.moveTo([0, 0]).text(`\nProcessing document ${++counter} of ${this.documents.length}\n`);

            let listGeoPoint: Array<any>;
            let listIdRef: Array<string> = [];
            let type = "Intersection";

            listGeoPoint = document.listGeoPoint;
            listIdRef.push(document._id);

            this.obj.push({
                listGeoPoint,
                listIdRef,
                type
            });
        })
    }
}
