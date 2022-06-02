// import * as s3 from "@aws-cdk/aws-s3";
import * as lambda from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";
import * as cdk from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigatewayv2";
// import { RemovalPolicy } from "@aws-cdk/core";
// import { S3EventSource } from "@aws-cdk/aws-lambda-event-sources";

// // // //

export class ApiGatewayStack extends cdk.Stack {
  // constructor(app: cdk.App, id: string) {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    // Provision HTTP API
    const httpApi = new apigateway.HttpApi(this, "http-api", {
      corsPreflight: {
        allowHeaders: ["*"],
        allowOrigins: ["*"],
        allowMethods: [apigateway.CorsHttpMethod.GET],
      },
    });

    // Create route key
    const httpRouteKey: apigateway.HttpRouteKey = apigateway.HttpRouteKey.with(
      "/hello",
      apigateway.HttpMethod.GET
    );

    // const authCheckLambda = new lambda.Function(this, 'aws-cdk-amazon-api-gateway-jwt-lambda', {
    //   runtime: lambda.Runtime.NODEJS_12_X,
    //   code: lambda.Code.asset('lambda'),
    //   handler: 'auth-check.handler',
    // });

    // Create API endpoint lambda
    const apiEndpointLambda = new lambda.Function(this, "api-endpoint", {
      code: new lambda.AssetCode("src/api-endpoint"),
      handler: "lambda.handler",
      runtime: lambda.Runtime.NODEJS_12_X,
      // timeout: cdk.Duration.seconds(300),
      // memorySize: 1024,
      // environment: {},
    });

    apiEndpointLambda.addPermission("gateway-lambda-permission", {
      principal: new iam.ServicePrincipal("apigateway.amazonaws.com"),
      sourceArn: cdk.Stack.of(this).formatArn({
        service: "execute-api",
        resource: httpApi.httpApiId,
        resourceName: `*/*${httpRouteKey.path ?? ""}`,
      }),
    });

    // Define HTTP integration
    const httpIntegration = new apigateway.HttpIntegration(
      this,
      "http-integration",
      {
        httpApi,
        integrationType: apigateway.HttpIntegrationType.AWS_PROXY,
        integrationUri: apiEndpointLambda.functionArn,
        payloadFormatVersion: apigateway.PayloadFormatVersion.VERSION_2_0,
      }
    );

    new apigateway.CfnRoute(this, "http-route", {
      apiId: httpApi.httpApiId,
      target: `integrations/${httpIntegration.integrationId}`,
      routeKey: httpRouteKey.key,
      // authorizationType: 'JWT',
      // authorizerId: authorizer.ref,
    });

    // return httpIntegration;

    // // Provisions S3 bucket for HTML source files
    // // Doc: https://docs.aws.amazon.com/cdk/api/latest/docs/aws-s3-readme.html#logging-configuration
    // const htmlBucket: s3.Bucket = new s3.Bucket(
    //   this,
    //   "pdf-generator-input-bucket",
    //   {
    //     removalPolicy: RemovalPolicy.DESTROY,
    //   }
    // );

    // // Provisions S3 bucket for generated PDFs
    // // Doc: https://docs.aws.amazon.com/cdk/api/latest/docs/aws-s3-readme.html#logging-configuration
    // const pdfsBucket: s3.Bucket = new s3.Bucket(
    //   this,
    //   "pdf-generator-output-bucket",
    //   {
    //     removalPolicy: RemovalPolicy.DESTROY,
    //   }
    // );

    // // // //
    // Provisions generate-pdf lambda
    // NOTE - we bump the memory to 1024mb here to accommodate the memory requirements for Puppeteer

    // DownloadURL Crawler Lambda
    // const writeHtmlToS3Lambda = new lambda.Function(
    //   this,
    //   "writeHtmlToS3Lambda",
    //   {
    //     code: new lambda.AssetCode("src/api-endpoint"),
    //     handler: "lambda.handler",
    //     runtime: lambda.Runtime.NODEJS_12_X,
    //     timeout: cdk.Duration.seconds(10),
    //     environment: {},
    //   }
    // );

    // Adds permissions for the writeHtmlToS3Lambda to read/write to S3
    // htmlBucket.grantReadWrite(writeHtmlToS3Lambda);

    // // // //
    // Provisions generate-pdf lambda
    // NOTE - we bump the memory to 1024mb here to accommodate the memory requirements for Puppeteer

    // DownloadURL Crawler Lambda
    // const apiEndpoint = new lambda.Function(this, "api-endpoint", {
    //   code: new lambda.AssetCode("src/api-endpoint"),
    //   handler: "lambda.handler",
    //   runtime: lambda.Runtime.NODEJS_12_X,
    //   timeout: cdk.Duration.seconds(300),
    //   memorySize: 1024,
    //   environment: {},
    // });

    // Configure event source so the `sendPdfToTextract` is run each time a file is downloaded to S3
    // Doc: https://docs.aws.amazon.com/cdk/api/latest/docs/aws-lambda-event-sources-readme.html#s3
    // generatePdfLambda.addEventSource(
    //   new S3EventSource(htmlBucket, {
    //     events: [s3.EventType.OBJECT_CREATED],
    //   })
    // );

    // Adds permissions for the generatePdfLambda to read/write to S3
    // htmlBucket.grantReadWrite(generatePdfLambda);
    // pdfsBucket.grantReadWrite(generatePdfLambda);
  }
}
