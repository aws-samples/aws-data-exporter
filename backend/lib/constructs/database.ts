import { Cluster, DatabaseSecret } from '@aws-cdk/aws-redshift-alpha';
import { RemovalPolicy } from 'aws-cdk-lib';
import {
  AttributeType,
  BillingMode,
  GlobalSecondaryIndexProps,
  Table,
  TableEncryption,
} from 'aws-cdk-lib/aws-dynamodb';
import { SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export interface DatabaseProps {
  vpc: Vpc;
  redshiftSecurityGroup: SecurityGroup;
}

export class Database extends Construct {
  readonly cluster: Cluster;
  readonly secret: Secret;
  readonly historyTable: Table;
  readonly reportTable: Table;
  readonly reportTableReportIdIndex: GlobalSecondaryIndexProps;
  constructor(scope: Construct, id: string, props: DatabaseProps) {
    super(scope, id);
    const { vpc, redshiftSecurityGroup } = props;

    // Redshift
    const secret = new Secret(this, 'RedshiftPassword', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          user: 'admin',
          database: 'dev',
          port: '5439',
        }),
        generateStringKey: 'password',
        excludeCharacters: '"@/\\ \'',
        passwordLength: 16,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const cluster = new Cluster(this, 'RedshiftCluster', {
      masterUser: {
        masterUsername: 'admin',
        masterPassword: secret.secretValueFromJson('password'),
      },
      vpc: vpc,
      removalPolicy: RemovalPolicy.DESTROY,
      securityGroups: [redshiftSecurityGroup],
    });

    this.cluster = cluster;
    this.secret = secret;

    // DynamoDB
    const historyTable = new Table(this, 'HistoryTable', {
      partitionKey: { name: 'userId', type: AttributeType.STRING },
      sortKey: { name: 'timestamp', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
      encryption: TableEncryption.AWS_MANAGED,
    });

    const reportTable = new Table(this, 'ReportTable', {
      partitionKey: { name: 'userId', type: AttributeType.STRING },
      sortKey: { name: 'sortKey', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
      encryption: TableEncryption.AWS_MANAGED,
    });

    const reportTableGlobalSecondaryIndex: GlobalSecondaryIndexProps = {
      indexName: 'ReportIdIndex',
      partitionKey: {
        name: 'reportId',
        type: AttributeType.STRING,
      },
    };

    reportTable.addGlobalSecondaryIndex(reportTableGlobalSecondaryIndex);

    this.historyTable = historyTable;
    this.reportTable = reportTable;
    this.reportTableReportIdIndex = reportTableGlobalSecondaryIndex;
  }
}
