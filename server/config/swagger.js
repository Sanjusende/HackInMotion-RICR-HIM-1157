import swaggerJSDoc from 'swagger-jsdoc';
import env from './env.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'KrishiMitra (Smart Farm Decision Support System) API',
      version: '1.0.0',
      description:
        'Enterprise-grade REST API powering the KrishiMitra agricultural platform. Integrates climate telemetry, mandi market dynamics, and machine learning models.',
      contact: {
        name: 'AgriTech Telemetry Network Team',
        email: 'support@krishimitra.org',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT || 5000}`,
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter authorization header in format: Bearer <JWT-token>',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Scope of route annotation scanning
  apis: ['./routes/*.js', './controllers/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
