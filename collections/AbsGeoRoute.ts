import * as Jetty from 'jetty';
import {DataHandler} from "../shared/DataHandler";

export class AbsGeoRoute implements DataHandler {
    jetty = new Jetty(process.stdout);
    obj: Array<Object> = [];

    private geoRoute: Array<any>;
    private interGeoRoute: Array<any>;
    private iPoint: Array<any>;

    constructor() {
        this.geoRoute = require('../GeoRoute.json');
        this.interGeoRoute = require('../interGeoRoute.json');
        this.iPoint = require('../iPoint.json');
    }

    getFeatures(): Array<Object> {
        return this.obj;
    }

    processFeaturesFromData(): void {
        let counter = 0;
        this.jetty.clear();
        this.jetty.text('\nDocument process starting...\n\n');
        this.geoRoute.forEach(geoRoute => {
            this.jetty.moveTo([0, 0]).text(`\nProcessing document ${++counter} of ${this.geoRoute.length}\n`);
            let _interFrom: any = this.interGeoRoute.filter(item => item._id == geoRoute._from);
            let _interTo: any = this.interGeoRoute.filter(item => item._id == geoRoute._to);
            let _iPointFrom: any;
            let _iPointTo: any;
            if (_interFrom[0] && _interFrom[0]._id && _interTo[0] && _interTo[0]._id) {
                _iPointFrom = this.iPoint.filter(item => item.listIdRef[0] == _interFrom[0]._id);
                _iPointTo = this.iPoint.filter(item => item.listIdRef[0] == _interTo[0]._id);
                if (_iPointFrom[0] && _iPointFrom[0]._id && _iPointTo[0] && _iPointTo[0]._id) {
                    let _from = _iPointFrom[0]._id;
                    let _to = _iPointTo[0]._id;
                    this.obj.push({
                        _from,
                        _to,
                        length: null
                    });
                }
            }
        })
    }
}
