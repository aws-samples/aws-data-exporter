import * as cdk from "aws-cdk-lib";
import { RemovalPolicy } from "aws-cdk-lib";
import { BlockPublicAccess, BucketEncryption } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import path = require("path");
// import * as sqs from 'aws-cdk-lib/aws-sqs';

type FrontendStackProps = cdk.StackProps & {
  backendApiUrl: string;
  userPoolId: string;
  userPoolClientId: string;
  webAclId: string;
};

export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: FrontendStackProps) {
    super(scope, id, props);

    // S3 Bucket for Frontend
    const websiteBucket = new cdk.aws_s3.Bucket(this, "FrontendBucket", {
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const websiteIdentity = new cdk.aws_cloudfront.OriginAccessIdentity(
      this,
      "WebsiteIdentity"
    );
    // grant read permission to hosting SPA
    websiteBucket.grantRead(websiteIdentity);

    const distribution = new cdk.aws_cloudfront.CloudFrontWebDistribution(
      this,
      "FrontendDist",
      {
        // Return index.html as response even if 404 error occurs.
        // 404 error control is implemented in the frontend.
        errorConfigurations: [
          {
            errorCachingMinTtl: 300,
            errorCode: 404,
            responseCode: 200,
            responsePagePath: "/index.html",
          },
        ],

        // Distribute S3 Bucket as origin
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: websiteBucket,
              originAccessIdentity: websiteIdentity,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
              },
            ],
          },
        ],

        // define WAF
        webACLId: props.webAclId,
      }
    );

    // Deploy React App to S3 Bucket
    new cdk.aws_s3_deployment.BucketDeployment(this, "ReactDeploy", {
      sources: [
        cdk.aws_s3_deployment.Source.asset(path.join(__dirname, "../../"), {
          // Setup to build the frontend
          bundling: {
            // Configure if build output is not a zip file
            outputType: cdk.BundlingOutput.NOT_ARCHIVED,
            // Specify the Docker container image to build
            image: cdk.DockerImage.fromRegistry(
              "public.ecr.aws/docker/library/node:16-bullseye"
            ),
            // Environment variables at build time
            environment: {
              // Backend API URL
              VITE_API_URL: props.backendApiUrl,
              // Cognit user pool ID
              VITE_AUTH_USER_POOL_ID: props.userPoolId,
              // Cognito user pool client ID
              VITE_AUTH_WEB_CLIENT_ID: props.userPoolClientId,
            },
            // User in Docker container at build time
            user: "node",
            // Build command
            command: [
              "bash",
              "-c",
              [
                "npm ci --loglevel=error",
                "npm run build",
                "cp -r dist/* /asset-output/",
              ].join(" && "),
            ],
          },
        }),
      ],
      destinationBucket: websiteBucket,
      distribution: distribution,
      distributionPaths: ["/*"],
      retainOnDelete: false,
    });

    // output CloudFront URL
    new cdk.CfnOutput(this, "CloudFrontURL", {
      description: "CloudFrontURL",
      value: `https://${distribution.distributionDomainName}`,
    });
  }
}
