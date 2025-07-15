
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
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      loginRequest: {
        identifier: "sumini",
        password: "1234",
      },
      RegisterRequest: {
        fullName: "sumini",
        username: "sumini",
        email: "sumini93.19@gmail.com",
        password: "1234",
        confirmPassword: "1234",
      },
      ActivationRequest: {
        code: "1234",
      },
      CreateCategoryRequest: {
        name: "",
        description: "",
        icon: "",
      },
      CreateEventRequest: {
        name: "Acara 2",
        startDate: "yyyy-mm-dd hh:mm:ss",
        endDate: "yyyy-mm-dd hh:mm:ss",
        description: "Test description",
        banner: "https://example.com/banner.jpg",
        isFeatured: false,
        isOnline: true,
        category: "60d5f9b8e8b4c72a3c8e4567",
        location: {
          region: "region id",
          coordinates: [0, 0],
        },
      },
      RemoveMediaRequest: {
        fileUrl: "",
      },
    },
  },
};
const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];
swaggerAutogen({openapi: "3.0.0"})(outputFile, endpointsFiles, doc);