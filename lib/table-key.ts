import * as cdk from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import {Construct} from "constructs";
import {CfnOutput} from "aws-cdk-lib";

export class TableKey extends Construct {
    private readonly _key: kms.Key;
    constructor(scope: Construct, id: string) {
        super(scope, id);

        // api level KMS key
        this._key = new kms.Key(this, `TableKey`);
        this._key.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    }

    get key(): kms.Key {
        return this._key;
    }
}
