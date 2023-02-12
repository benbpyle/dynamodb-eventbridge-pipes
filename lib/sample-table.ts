import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import {StreamViewType} from 'aws-cdk-lib/aws-dynamodb';
import {Construct} from "constructs";
import {EventBus} from "aws-cdk-lib/aws-events";
import * as pipes from 'aws-cdk-lib/aws-pipes';
import {Effect, PolicyDocument, PolicyStatement, Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";

interface SampleTableProps {
//    key: kms.Key,
    bus: EventBus
}

export class SampleTable extends Construct {
    private readonly _table: dynamodb.Table;

    constructor(scope: Construct, id: string, props: SampleTableProps) {
        super(scope, id);

        // dynamodb table
        this._table = new dynamodb.Table(this, id, {
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            partitionKey: {name: 'PK', type: dynamodb.AttributeType.STRING},
            sortKey: {name: 'SK', type: dynamodb.AttributeType.STRING},
            pointInTimeRecovery: false,
            tableName: 'SampleTable',
            stream: StreamViewType.NEW_AND_OLD_IMAGES
        });

        // const target = new EventBus(this, 'event-bus');

        const sourcePolicy = new PolicyDocument({
            statements: [
                new PolicyStatement({
                    resources: [this._table.tableStreamArn!],
                    actions: [
                        "dynamodb:DescribeStream",
                        "dynamodb:GetRecords",
                        "dynamodb:GetShardIterator",
                        "dynamodb:ListStreams"
                    ],
                    effect: Effect.ALLOW,
                })
            ]
        });

        const targetPolicy = new PolicyDocument({
            statements: [
                new PolicyStatement({
                    resources: [props.bus.eventBusArn],
                    actions: ['events:PutEvents'],
                    effect: Effect.ALLOW,
                }),
            ],
        });

        const pipeRole = new Role(this, 'PipeRole', {
            assumedBy: new ServicePrincipal('pipes.amazonaws.com'),
            inlinePolicies: {
                sourcePolicy,
                targetPolicy,
            },
        });

        // Create new Pipe
        const pipe = new pipes.CfnPipe(this, 'pipe', {
            name: 'SampleTableModifyPipe',
            roleArn: pipeRole.roleArn,
            source: this._table.tableStreamArn!,
            target: props.bus.eventBusArn,
            sourceParameters: {
                dynamoDbStreamParameters: {
                    startingPosition: 'LATEST',
                    batchSize: 1
                },
                filterCriteria: {
                    filters: [{
                        pattern: `{
                        "eventName": [{
                            "prefix": "MODIFY"
                        }]
                    }`}]
                }
            },
            targetParameters: {
                eventBridgeEventBusParameters: {
                    detailType: 'SampleTableModified',
                    source: 'com.sample'
                },
                inputTemplate: `
                    {
                      "details": {
                        "meta-data": {
                          "correlationId": <$.eventID>
                        },
                        "data": {
                          "PK": <$.dynamodb.Keys.PK.S>,
                          "SK": <$.dynamodb.Keys.SK.S>,
                          "Field1": <$.dynamodb.NewImage.Field1.S>
                        }
                      }
                    }          
                `,
            },
        });
    }

    get table()
        :
        dynamodb.Table {
        return this._table;
    }
}

