import * as Jetty from 'jetty';

export interface DataHandler {
    data?: Object;
    features?: Array<any>;
    jetty?: Jetty;
    obj?: Array<Object>;

    getFeatures(): Array<Object>;
    processFeaturesFromData(): void;
}
