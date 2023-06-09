import { PythonFunction } from '@aws-cdk/aws-lambda-python-alpha';
import { Cluster } from '@aws-cdk/aws-redshift-alpha';
import { Duration } from 'aws-cdk-lib';
import {
  AccessLogFormat,
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  Cors,
  LambdaIntegration,
  LogGroupLogDestination,
  MethodLoggingLevel,
  RestApi,
} from 'aws-cdk-lib/aws-apigateway';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { GlobalSecondaryIndexProps, Table } from 'aws-cdk-lib/aws-dynamodb';
import { SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export interface BackendApiProps {
  userPool: UserPool;
  redshiftCluster: Cluster;
  secret: Secret;
  vpc: Vpc;
  lambdaSecurityGroup: SecurityGroup;
  historyTable: Table;
  reportTable: Table;
  reportTableReportIdIndex: GlobalSecondaryIndexProps;
}

export class BackendApi extends Construct {
  readonly api: RestApi;

  constructor(scope: Construct, id: string, props: BackendApiProps) {
    super(scope, id);

    const {
      userPool,
      redshiftCluster,
      secret,
      vpc,
      lambdaSecurityGroup,
      historyTable,
      reportTable,
      reportTableReportIdIndex,
    } = props;

    const commonLambdaProps = {
      runtime: Runtime.PYTHON_3_9,
      timeout: Duration.minutes(15),
      vpc: vpc,
      securityGroups: [lambdaSecurityGroup],
      environment: {
        REDSHIFT_HOST: redshiftCluster.clusterEndpoint.hostname,
        SECRET_ID: secret.secretArn,
        HISTORY_TABLE_NAME: historyTable.tableName,
        REPORT_TABLE_NAME: reportTable.tableName,
        REPORT_ID_INDEX_NAME: reportTableReportIdIndex.indexName,
        USER_POOL_ID: userPool.userPoolId,
      },
    };

    // Lambda
    const getTableFunction = new PythonFunction(this, 'GetTable', {
      entry: 'lambda',
      index: 'table/get.py',
      ...commonLambdaProps,
    });

    secret.grantRead(getTableFunction);

    const getTableByNameFunction = new PythonFunction(this, 'GetTableByName', {
      entry: 'lambda',
      index: 'table/get_by_name.py',
      ...commonLambdaProps,
    });

    secret.grantRead(getTableByNameFunction);

    const postExtractFunction = new PythonFunction(this, 'PostExtraction', {
      entry: 'lambda',
      index: 'extract/post.py',
      ...commonLambdaProps,
    });

    secret.grantRead(postExtractFunction);
    historyTable.grantReadWriteData(postExtractFunction);

    const getExtractHistoryFunction = new PythonFunction(
      this,
      'GetExtractionHistory',
      {
        entry: 'lambda',
        index: 'extract/get_history.py',
        ...commonLambdaProps,
      }
    );

    secret.grantRead(getExtractHistoryFunction);
    historyTable.grantReadData(getExtractHistoryFunction);

    const postReportFunction = new PythonFunction(this, 'PostReport', {
      entry: 'lambda',
      index: 'report/post.py',
      ...commonLambdaProps,
    });

    secret.grantRead(postReportFunction);
    reportTable.grantReadWriteData(postReportFunction);

    const postReportShareFunction = new PythonFunction(
      this,
      'PostReportShare',
      {
        entry: 'lambda',
        index: 'report/post_share.py',
        ...commonLambdaProps,
      }
    );

    secret.grantRead(postReportShareFunction);
    reportTable.grantReadWriteData(postReportShareFunction);

    postReportShareFunction.addToRolePolicy(
      new PolicyStatement({
        actions: ['cognito-idp:ListUsers'],
        resources: [userPool.userPoolArn],
      })
    );

    const getReportFunction = new PythonFunction(this, 'GetReport', {
      entry: 'lambda',
      index: 'report/get.py',
      ...commonLambdaProps,
    });

    secret.grantRead(getReportFunction);
    reportTable.grantReadWriteData(getReportFunction);

    const getReportByIdFunction = new PythonFunction(this, 'GetReportById', {
      entry: 'lambda',
      index: 'report/get_by_id.py',
      ...commonLambdaProps,
    });

    secret.grantRead(getReportByIdFunction);
    reportTable.grantReadWriteData(getReportByIdFunction);

    const postExportFunction = new PythonFunction(this, 'PostExport', {
      entry: 'lambda',
      index: 'export/post.py',
      ...commonLambdaProps,
    });

    const getUserFunction = new PythonFunction(this, 'GetUser', {
      entry: 'lambda',
      index: 'user/get.py',
      ...commonLambdaProps,
    });

    // API Gateway
    const authorizer = new CognitoUserPoolsAuthorizer(this, 'Authorizer', {
      cognitoUserPools: [userPool],
    });

    const commonAuthorizerProps = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer,
    };

    const apiGatewayLogGroup = new LogGroup(this, 'ApiGatewayLogGroup', {
      logGroupName: '/aws/apigateway/rest-api-access-log',
    });

    const api = new RestApi(this, 'Api', {
      deployOptions: {
        stageName: 'api',
        // Execution Log
        dataTraceEnabled: true,
        loggingLevel: MethodLoggingLevel.INFO,
        // Access Log
        accessLogDestination: new LogGroupLogDestination(apiGatewayLogGroup),
        accessLogFormat: AccessLogFormat.jsonWithStandardFields(),
      },
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
      cloudWatchRole: true,
    });

    // GET: /table
    const tableResource = api.root.addResource('table');
    tableResource.addMethod(
      'GET',
      new LambdaIntegration(getTableFunction),
      commonAuthorizerProps
    );

    // GET: /table/{tableName}
    const tableByNameResource = tableResource.addResource('{tableName}');
    tableByNameResource.addMethod(
      'GET',
      new LambdaIntegration(getTableByNameFunction),
      commonAuthorizerProps
    );

    // POST: /extract
    const extractResource = api.root.addResource('extract');
    extractResource.addMethod(
      'POST',
      new LambdaIntegration(postExtractFunction),
      commonAuthorizerProps
    );

    // GET: /extract/history
    const extractHistoryResource = extractResource.addResource('history');
    extractHistoryResource.addMethod(
      'GET',
      new LambdaIntegration(getExtractHistoryFunction),
      commonAuthorizerProps
    );

    // POST: /report
    const reportResource = api.root.addResource('report');
    reportResource.addMethod(
      'POST',
      new LambdaIntegration(postReportFunction),
      commonAuthorizerProps
    );

    // GET: /report
    reportResource.addMethod(
      'GET',
      new LambdaIntegration(getReportFunction),
      commonAuthorizerProps
    );

    // POST: /report/share/{reportId}
    const reportShareResource = reportResource.addResource('share');
    const reportShareByReportIdResource =
      reportShareResource.addResource('{reportId}');
    reportShareByReportIdResource.addMethod(
      'POST',
      new LambdaIntegration(postReportShareFunction),
      commonAuthorizerProps
    );

    // GET: /report/{reportId}
    const reportByReportIdResource = reportResource.addResource('{reportId}');
    reportByReportIdResource.addMethod(
      'GET',
      new LambdaIntegration(getReportByIdFunction),
      commonAuthorizerProps
    );

    // POST: /export
    const exportResource = api.root.addResource('export');
    exportResource.addMethod(
      'POST',
      new LambdaIntegration(postExportFunction),
      commonAuthorizerProps
    );

    // GET: /user
    const userResource = api.root.addResource('user');
    userResource.addMethod(
      'GET',
      new LambdaIntegration(getUserFunction),
      commonAuthorizerProps
    );

    this.api = api;
  }
}
