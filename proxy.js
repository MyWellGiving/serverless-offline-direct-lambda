const serializeError = require("serialize-error");
const path = require("path");

function handler(event, context, callback) {
  const [targetHandlerFile, targetHandlerFunction] = event.targetHandler.split(
    "."
  );
  /**
   * When using webpack, this path needs to be relative to where the file is after being
   * compiled.
   */
  const target = require(path.resolve(
    __dirname,
    "../../.webpack/services",
    targetHandlerFile
  ));

  target[targetHandlerFunction](event.body, context, (error, response) => {
    if (error) {
      // Return Serverless error to AWS sdk
      callback(null, {
        StatusCode: 500,
        FunctionError: "Handled",
        Payload: serializeError(error)
      });
    } else {
      // Return lambda function response to AWS SDK & pass through args from serverless.
      callback(null, response);
    }
  });
}

module.exports.handler = handler;
