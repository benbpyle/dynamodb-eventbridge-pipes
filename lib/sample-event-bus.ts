import {Construct} from "constructs";
import {EventBus} from "aws-cdk-lib/aws-events";

export class SampleEventBus extends Construct {
    private readonly _eventBus: EventBus;
    constructor(scope: Construct, id: string) {
        super(scope, id);

        this._eventBus = new EventBus(this, 'MdaEventBus', {
            eventBusName: `sample-bus`
        })
    }

    get eventBus(): EventBus {
        return this._eventBus;
    }
}