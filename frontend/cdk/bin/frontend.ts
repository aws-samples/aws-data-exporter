#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { FrontendStack } from "../lib/frontend-stack";
import { FrontendWafStack } from "../lib/frontend-waf-stack";

const app = new cdk.App();

// set backend info
const backendApiUrl = app.node.tryGetContext("backendApiUrl");
const userPoolId = app.node.tryGetContext("userPoolId");
const userPoolClientId = app.node.tryGetContext("userPoolClientId");
const allowedIpV4AddressRanges: string[] = app.node.tryGetContext(
  "allowedIpV4AddressRanges"
);
const allowedIpV6AddressRanges: string[] = app.node.tryGetContext(
  "allowedIpV6AddressRanges"
);

// WAF for frontend
// 2023/4: Currently, the WAF for CloudFront needs to be created in the North America region (us-east-1), so the stacks are separated
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html
const waf = new FrontendWafStack(app, "DataExporterFrontendWafStack", {
  env: {
    region: "us-east-1",
  },
  allowedIpV4AddressRanges,
  allowedIpV6AddressRanges,
});

new FrontendStack(app, "DataExporterFrontendStack", {
  env: {
    region: "ap-northeast-1",
  },
  crossRegionReferences: true,
  backendApiUrl,
  userPoolId,
  userPoolClientId,
  webAclId: waf.webAclArn.value,
});
