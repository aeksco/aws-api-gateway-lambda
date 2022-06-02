// import * as AWS from "aws-sdk";

// // // //

export const handler = async (
  event: any = {},
  context: any = {}
): Promise<any> => {
  // Log start message
  console.log("api-endpoint -> start");
  console.log(JSON.stringify(event, null, 4));

  try {
    console.log("Try/Catch");
  } catch (error) {
    return context.fail(error);
  } finally {
    console.log("Finally!");
  }

  // Logs "shutdown" statement
  console.log("api-endpoint -> shutdown");
  return context.succeed({ status: "Great success!" });
};
