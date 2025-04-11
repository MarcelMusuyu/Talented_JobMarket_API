const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = ['./routes/applicationsRoutes.js', './routes/authRoutes.js','./routes/recruitmentRoutes.js']; // Include your route files

const doc = {
  info: {
    title: 'Talented JobMarket API',
    description: 'API documentation for the Talented JobMarket application. This API facilitates the recruitment process, managing user accounts (candidates and recruiters) and job applications.',
    version: '1.0.0', // Add a version
  },
  host: 'localhost:3000', // Replace with your host (e.g., your Render URL or domain)
  basePath: '/api', // If you have a base path for your API (e.g., /api)
  schemes: ['http'], // Or ['http', 'https'] if you support both
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'JWT Authorization header using the Bearer scheme. Example: "Bearer YOUR_TOKEN"',
    },
  },
  definitions: {
    Applicant: {
      type: 'object',
      required: ['firstName', 'lastName', 'email', 'password'], // Removed profile and username
      properties: {
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
        email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
        profile: { type: 'string', example: 'https://example.com/profile.jpg' }, // Example URL
        password: { type: 'string', example: 'Password123' },
      },
    },
    Recruiter: {
      type: 'object',
      required: ['firstName', 'lastName', 'email', 'password'], // Removed profile and username
      properties: {
        firstName: { type: 'string', example: 'Jane' },
        lastName: { type: 'string', example: 'Smith' },
        email: { type: 'string', format: 'email', example: 'jane.smith@company.com' },
        profile: { type: 'string', example: 'https://example.com/profile.jpg' }, // Example URL
        password: { type: 'string', example: 'RecruiterPass' },
      },
    },
    Login: {
      type: 'object',
      required: ['email', 'password'], // Changed to email
      properties: {
        email: { type: 'string', format: 'email', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
      },
    },
    Application: {
      type: 'object',
      required: ['applicant', 'jobOpportunity', 'resume'],
      properties: {
        applicant: { type: 'string', description: 'Applicant ID', example: '654321...' },
        jobOpportunity: { type: 'string', description: 'Job Opportunity ID', example: '123456...' },
        resume: { type: 'string', format: 'url', description: 'URL to the resume file', example: 'https://example.com/resume.pdf' },
        coverLetter: { type: 'string', format: 'url', description: 'URL to the cover letter file', example: 'https://example.com/coverLetter.pdf' },
        transcript: { type: 'string', format: 'url', description: 'URL to the transcript file', example: 'https://example.com/transcript.pdf' },
        skills: { type: 'string', description: 'Comma-separated list of skills', example: 'JavaScript,React,Node.js' },
        languages: { type: 'string', description: 'Comma-separated list of languages', example: 'English,French' },
        status: { type: 'string', enum: ['pending', 'reviewed', 'shortlisted', 'interviewing', 'offered', 'rejected'], description: 'Application status', example: 'pending' },
        selection: { type: 'string', description: 'Selection notification ID', example: '789012...' },
      },
    },
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc);