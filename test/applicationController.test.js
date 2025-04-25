const { getApplications, getCandidates, getApplicationById } = require('../controllers/applicationController'); // Adjust the path
const Application = require('../models/applicationModel'); // Adjust the path
const Applicant = require('../models/applicantModel');   // Adjust the path
const JobOpportunity = require('../models/jobOpportunityModel'); // Adjust the path
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server'); //for testing

jest.setTimeout(10000); // Increase timeout for longer operations.


let mongoServer;

//Mock the populate
const mockPopulate = (model) => {
  model.prototype.populate = jest.fn().mockResolvedValue(model.prototype);
  return model;
}

// Set up an in-memory MongoDB database for testing
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    dbName: 'jobMarket',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clean up and disconnect after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear the database before each test
beforeEach(async () => {
  await Application.deleteMany({});
  await Applicant.deleteMany({});
  await JobOpportunity.deleteMany({});
});



describe('Application Controller Tests', () => {


  describe('getApplications', () => {
    it('should return all applications with populated jobOpportunity and applicant data', async () => {
      // Create test data
      const mockApplicant = await Applicant.create({ firstName: 'John', lastname: 'Doe', email: 'john.doe@example.com' });
      const mockJobOpportunity = await JobOpportunity.create({ title: 'Software Engineer' });
      const mockApplication = await Application.create({
        applicant: mockApplicant._id,
        jobOpportunity: mockJobOpportunity._id,
      });

      // Mock the populate methods.  Chain them as they are chained in the controller.
      const ApplicationModel = mockPopulate(mockPopulate(Application));


      // Mock the res object
      const res = {
        setHeader: jest.fn(),
        json: jest.fn(),
        status: jest.fn().mockReturnThis(), // For chaining
      };

      // Call the controller function
      await getApplications({}, res);

      // Assertions
      expect(ApplicationModel.prototype.populate).toHaveBeenCalledWith('jobOpportunity', 'title');
      expect(ApplicationModel.prototype.populate).toHaveBeenCalledWith('applicant', 'firstName lastName email profile');
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          applicant: expect.objectContaining({
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@example.com'
          }),
          jobOpportunity: expect.objectContaining({
            title: 'Software Engineer'
          })
        }),
      ]));
    });

    it('should handle errors and return a 500 status code', async () => {
      // Mock the Application.find() to throw an error
      Application.find = jest.fn().mockRejectedValue(new Error('Database error'));

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        setHeader: jest.fn()
      };

      await getApplications({}, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('getCandidates', () => {
    it('should return all applicants', async () => {
      // Create test data
      const mockApplicant1 = await Applicant.create({ firstname: 'Alice', lastname: 'Smith', email: 'alice.smith@example.com' });
      const mockApplicant2 = await Applicant.create({ firstname: 'Bob', lastname: 'Johnson', email: 'bob.johnson@example.com' });

      const res = {
        setHeader: jest.fn(),
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getCandidates({}, res);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ firstname: 'Alice', lastname: 'Smith', email: 'alice.smith@example.com' }),
          expect.objectContaining({ firstname: 'Bob', lastname: 'Johnson', email: 'bob.johnson@example.com' }),
        ])
      );
    });

    it('should handle errors and return a 500 status code', async () => {
      Applicant.find = jest.fn().mockRejectedValue(new Error('Failed to retrieve applicants'));

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        setHeader: jest.fn()
      };

      await getCandidates({}, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to retrieve applicants' });
    });
  });

  describe('getApplicationById', () => {
    it('should return the application with the specified ID and populated data', async () => {
      // Create test data
      const mockApplicant = await Applicant.create({ firstname: 'Jane', lastname: 'Doe', email: 'jane.doe@example.com' });
      const mockJobOpportunity = await JobOpportunity.create({ title: 'Senior Developer' });
      const mockApplication = await Application.create({
        applicant: mockApplicant._id,
        jobOpportunity: mockJobOpportunity._id,
      });

      const ApplicationModel = mockPopulate(mockPopulate(Application));

      const req = {
        params: { id: mockApplication._id.toString() },
      };

      const res = {
        setHeader: jest.fn(),
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getApplicationById(req, res);
      expect(ApplicationModel.prototype.populate).toHaveBeenCalledWith('jobOpportunity');
      expect(ApplicationModel.prototype.populate).toHaveBeenCalledWith('applicant', 'firstName lastName email profile');
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        applicant: expect.objectContaining({
          firstname: 'Jane',
          lastname: 'Doe',
          email: 'jane.doe@example.com'
        }),
        jobOpportunity: expect.objectContaining({
          title: 'Senior Developer'
        })
      }));
    });

    it('should return a 404 status if the application is not found', async () => {
      // Mock Application.findById to return null
      Application.findById = jest.fn().mockResolvedValue(null);

      const req = {
        params: { id: 'nonexistent-id' },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        setHeader: jest.fn()
      };

      await getApplicationById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Application not found' });
    });

    it('should handle errors and return a 500 status code', async () => {
      Application.findById = jest.fn().mockRejectedValue(new Error('Failed to retrieve application'));

      const req = {
        params: { id: 'some-id' },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        setHeader: jest.fn()
      };

      await getApplicationById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to retrieve application' });
    });
  });
});

