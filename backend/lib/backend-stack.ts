import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Auth } from './constructs/auth';
import { BackendApi } from './constructs/backend-api';
import { Database } from './constructs/database';
import { Network } from './constructs/network';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const auth = new Auth(this, 'Auth');
    const network = new Network(this, 'Network');
    const database = new Database(this, 'Database', {
      vpc: network.vpc,
      redshiftSecurityGroup: network.redshiftSecurityGroup,
    });
    const backendApi = new BackendApi(this, 'BackendApi', {
      userPool: auth.userPool,
      redshiftCluster: database.cluster,
      secret: database.secret,
      vpc: network.vpc,
      lambdaSecurityGroup: network.lambdaSecurityGroup,
      historyTable: database.historyTable,
      reportTable: database.reportTable,
      reportTableReportIdIndex: database.reportTableReportIdIndex,
    });
  }
}
