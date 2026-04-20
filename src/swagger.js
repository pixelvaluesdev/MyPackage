const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My Package",
      version: "1.0.0",
      description: "MyPackage Smart Locker Backend & Analytics Platform"
    },
    servers: [
      {
        url: "https://mypackage.pixelplanet.in/api" // IMPORTANT
      }
    ]
  },

  // MUST match your folder structure
  apis: ["./src/modules/**/*.routes.js"]
};

module.exports = swaggerJSDoc(options);
