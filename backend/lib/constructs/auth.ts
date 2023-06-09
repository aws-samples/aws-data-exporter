import { CfnOutput, Duration } from 'aws-cdk-lib';
import {
  BooleanAttribute,
  UserPool,
  UserPoolClient,
} from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export class Auth extends Construct {
  readonly userPool: UserPool;
  readonly client: UserPoolClient;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const userPool = new UserPool(this, 'UserPool', {
      signInAliases: {
        username: false,
        email: true,
      },
      passwordPolicy: {
        requireUppercase: true,
        requireSymbols: true,
        requireDigits: true,
        minLength: 8,
      },
      customAttributes: {
        Downloadable: new BooleanAttribute({ mutable: true }),
      },
    });

    const client = userPool.addClient('client', {
      idTokenValidity: Duration.days(1),
    });

    this.client = client;
    this.userPool = userPool;

    new CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
    new CfnOutput(this, 'UserPoolClientId', { value: client.userPoolClientId });
  }
}
