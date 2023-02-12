import {GoFunction} from "@aws-cdk/aws-lambda-go-alpha";
import {Duration, Tags} from "aws-cdk-lib";
import {Construct} from "constructs";
import {IFunction} from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import {CfnStateMachine} from "aws-cdk-lib/aws-stepfunctions";
import {Effect, PolicyStatement} from "aws-cdk-lib/aws-iam";

export class HandlerFunc extends Construct {
    private readonly _handler: IFunction;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this._handler = new GoFunction(this, `SampleHandlerFunc`, {
            entry: path.join(__dirname, `../src/sample-handler`),
            functionName: `sample-handler`,
            timeout: Duration.seconds(30),
        });

    }


    get handler(): IFunction {
        return this._handler;
    }
}
