import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ninjas UMS',
      description: 'Api documentation for Ninjas UMS',
      version: '1.0.0',
    },
    components : {
      securitySchemes : {
         bearerAuth : {
           type :"http" ,
           scheme : "bearer" ,
         }
      } 
    },
    security : [
     {
       bearerAuth : []
     }
    ],
   
  },

  apis: ['./**/swagger-docs.yaml']
}

const swaggerSpec = swaggerJsdoc(options);


export { swaggerUi , swaggerSpec }; 