import * as Jetty from 'jetty';
import {DataHandler} from "../shared/DataHandler";

export class GeoRoute implements DataHandler {
    data: Object;
    documents: Array<any>;
    features: Array<any>;
    jetty = new Jetty(process.stdout);
    obj: Array<Object> = [];

    constructor(data: any, documents: any) {
        this.data = data;
        this.documents = documents;
        this.features = (<any>this.data).features;
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
            if (document.listGeoPoint.length) {
                this.features.forEach(element => {
                    const geoRoute = element.geometry;
                    const geoProperty = element.attributes;
                    // Our model reference. We're gonna use it for defining each GeoRoute instance
                    let canAddProperties = false;
                    let curveGeoPoint: Array<any> = [];
                    let _from: string;
                    let length: number;
                    let listGeoPoint: Array<any> = [];
                    let listProperty: Object;
                    let listSrcProperty: Object;
                    let _to;
                    // Obtains coordinates from our track section.
                    if (geoRoute.paths && geoRoute.paths.length &&
                        geoRoute.paths[0][0][0] === document.listGeoPoint[0].x &&
                        geoRoute.paths[0][0][1] === document.listGeoPoint[0].y) {
                        if (geoRoute.paths[0]) {
                            canAddProperties = true;
                            const index = geoRoute.paths[0].length - 1;
                            let x = geoRoute.paths[0][index][0];
                            let y = geoRoute.paths[0][index][1];
                            this.documents.forEach(document => {
                                if (document.listGeoPoint.length && document.listGeoPoint[0].x == x &&
                                    document.listGeoPoint[0].y == y) {
                                    _to = document._id;
                                }
                            });
                            // _to = this.findTo(x, y);
                            geoRoute.paths.forEach(pathElement => {
                                pathElement.forEach(coordinates => {
                                    listGeoPoint.push({
                                        x: coordinates[0],
                                        y: coordinates[1]
                                    });
                                });
                            });
                        }
                    }
                    // This one will cover curve paths' case
                    if (geoRoute.curvePaths && geoRoute.curvePaths.length &&
                        geoRoute.curvePaths[0][0][0] === document.listGeoPoint[0].x &&
                        geoRoute.curvePaths[0][0][1] === document.listGeoPoint[0].y) {
                        if (geoRoute.curvePaths[0]) {
                            canAddProperties = true;
                            const index = geoRoute.curvePaths[0][1].c[0].length - 1;
                            let x = geoRoute.curvePaths[0][1].c[0][index][0];
                            let y = geoRoute.curvePaths[0][1].c[0][index][1];
                            this.documents.forEach(document => {
                                if (document.listGeoPoint.length && document.listGeoPoint[0].x == x &&
                                    document.listGeoPoint[0].y == y) {
                                    _to = document._id;
                                }
                            });
                            // _to = this.findTo(x, y);
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
                    }
                    if (canAddProperties) {
                        // Get only those properties we're interested in
                        listProperty = {
                            trackSectionId: geoProperty.idtrechovia,
                            placeId: geoProperty.idlogradouro,
                            placeName: geoProperty.nomeusual,
                            placeClassification: geoProperty.classificacaoctb,
                        };
                        listSrcProperty = element;
                        length = geoProperty['st_length(shape)'];
                        _from = document._id;
                        // Let's push a new section into our object
                        this.obj.push({
                            _from,
                            _to,
                            listGeoPoint,
                            listProperty,
                            listSrcProperty,
                            length
                        });
                    }
                });
            }
        })
    }

    private findTo(x: any, y: any): string {
        this.documents.forEach(document => {
            if (document.listGeoPoint.length && document.listGeoPoint[0].x == x && document.listGeoPoint[0].y == y) {
                return document._id;
            }
        });
        return '';
    }
}
