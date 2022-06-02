import * as cdk from "@aws-cdk/core";
import { ApiGatewayStack } from "./src/stack";

// // // //

// Defines new CDK App
const app = new cdk.App();

// Instantiates the ApiGatewayStack
new ApiGatewayStack(app, "ApiGatewayStack");
app.synth();
