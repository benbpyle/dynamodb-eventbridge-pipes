import {Construct} from 'constructs';
import {IFunction} from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import {LambdaFunction} from "aws-cdk-lib/aws-events-targets";
import {IEventBus} from "aws-cdk-lib/aws-events";


export interface EventBridgeRuleStackProps {
    func: IFunction,
    bus: IEventBus
}

export class EventBridgeRule extends Construct {
    constructor(scope: Construct, id: string, props: EventBridgeRuleStackProps) {
        super(scope, id);

        const rule = new events.Rule(this, 'ModifySampleRule', {
            eventPattern: {
                source: ["com.sample"]
            },
            ruleName: "sample-table-modified-rule",
            eventBus: props.bus
        });


        rule.addTarget(new LambdaFunction(props.func, {
            maxEventAge: cdk.Duration.hours(2),
            retryAttempts: 1,
        }));
    }

}
