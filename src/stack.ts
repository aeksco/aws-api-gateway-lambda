import * as lambda from "aws-cdk-lib/aws-lambda";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { CfnOutput } from "aws-cdk-lib";

// // // //

export class ApiGatewayStack extends cdk.Stack {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const apiEndpointLambda = new lambda.Function(this, "api-endpoint", {
            code: new lambda.AssetCode("src/api-endpoint"),
            handler: "lambda.handler",
            runtime: lambda.Runtime.NODEJS_16_X,
        });

        const helloIntegration = new HttpLambdaIntegration(
            "HelloIntegration",
            apiEndpointLambda
        );

        const httpApi = new apigateway.HttpApi(this, "HttpApi");

        httpApi.addRoutes({
            path: "/hello",
            methods: [apigateway.HttpMethod.GET],
            integration: helloIntegration,
        });

        // Output the URL
        new CfnOutput(this, "apiUrl", { value: httpApi.url || "n/a" });
    }
}
