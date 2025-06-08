
import swaggerAutogen from "swagger-autogen";



const doc = {
  info: {
    version: "v.0.0",
    title: "Dokumentasi Acara API",
    description: "Dokumentasi Acara API",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Local server",
    },
    {
      url: "https://backend-acara-plum.vercel.app/api",
      description: "Production server",
    },

  ],
  components : {
    securitySchemes : {
      bearerAuth : {
        type : "http",
        scheme : "bearer",
      
      }
    },
    schemas : {
        loginRequest: {
            identifier: "sumini",
            password: "1234"
        },
        ActivationRequest : {
            code : "1234"
        }
    }
  }
};
const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];
swaggerAutogen({openapi: "3.0.0"})(outputFile, endpointsFiles, doc);