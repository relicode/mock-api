import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'

export class HibobIntegrationMockApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props)

    const apiHandler = new NodejsFunction(this, 'mockApiHandler', {
      entry: './lambda/index.ts',
      runtime: lambda.Runtime.NODEJS_18_X,
    })

    new apigw.LambdaRestApi(this, 'apiHandler', {
      handler: apiHandler,
      deployOptions: { stageName: id },
    })
  }
}
