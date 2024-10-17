const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ExpressJS with PostgreSQL API',
      version: '1.0.0',
      description: 'API documentation for the ExpressJS with PostgreSQL',
      contact: {
        name: 'Samit Koyom',
        url: 'https://itgenius.co.th',
        email: 'contact@itgenius.co.th'
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'The user ID',
              example: 1,
            },
            username: {
              type: 'string',
              description: 'The user\'s username',
              example: 'john_doe',
            },
            password: {
              type: 'string',
              description: 'The user\'s hashed password',
              example: '$2a$12$abcdefghijk',
            },
            fullname: {
              type: 'string',
              description: 'The user\'s full name',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              description: 'The user\'s email address',
              example: 'john.doe@example.com',
            },
            tel: {
              type: 'string',
              description: 'The user\'s telephone number',
              example: '0812345678',
            },           
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'The product ID',
              example: 1,
            },
            name: {
              type: 'string',
              description: 'The product name',
              example: 'iPhone 12 Pro Max',
            },
            price: {
              type: 'integer',
              description: 'The price of product',
              example: '1000',
            }
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'],
}

const swaggerSpec = swaggerJSDoc(options)

setupSwagger = (app) => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'ExpressJS with PostgreSQL API',  // ปรับเปลี่ยนชื่อเว็บเพจที่แสดงใน tab
    })
  )
}

module.exports = setupSwagger