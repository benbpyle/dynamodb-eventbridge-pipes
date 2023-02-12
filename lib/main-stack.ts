import {Construct} from 'constructs';
import * as cdk from 'aws-cdk-lib';
import {SampleTable} from "./sample-table";
import {TableKey} from "./table-key";
import {SampleEventBus} from "./sample-event-bus";
import {HandlerFunc} from "./func-handler";
import {EventBridgeRule} from "./event-bridge-rule";

interface LambdaStackProps extends cdk.StackProps {
}

export class MainStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props);

        const handler = new HandlerFunc(this, 'HandlerFunc');
        const bridge = new SampleEventBus(this, 'SampleEventBus');
        const sampleTable = new SampleTable(this, 'SampleTable', {
            bus: bridge.eventBus
        })
        const rule = new EventBridgeRule(this, 'SampleRule', {
            func: handler.handler,
            bus: bridge.eventBus
        })

    }
}
