import { Peer, Port, SecurityGroup, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class Network extends Construct {
  readonly vpc: Vpc;
  readonly redshiftSecurityGroup: SecurityGroup;
  readonly lambdaSecurityGroup: SecurityGroup;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new Vpc(this, 'Vpc', {
      subnetConfiguration: [
        {
          name: "public",
          subnetType: SubnetType.PUBLIC,
          mapPublicIpOnLaunch: false
        },
        {
          name: "private",
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
    });

    const redshiftSecurityGroup = new SecurityGroup(
      this,
      'RedshiftSecurityGroup',
      {
        vpc: vpc,
        allowAllOutbound: true,
        securityGroupName: 'RedshiftSecurityGroup',
      }
    );

    const lambdaSecurityGroup = new SecurityGroup(this, 'LambdaSecurityGroup', {
      vpc: vpc,
      allowAllOutbound: true,
      securityGroupName: 'LambdaSecurityGroup',
    });

    redshiftSecurityGroup.addIngressRule(lambdaSecurityGroup, Port.tcp(5439));

    this.vpc = vpc;
    this.redshiftSecurityGroup = redshiftSecurityGroup;
    this.lambdaSecurityGroup = lambdaSecurityGroup;
  }
}
