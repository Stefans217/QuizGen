import request from 'supertest';
import express from 'express';
import router from '../../../routes/registration/uploadUser';
import prisma from '../../../client';
import bcrypt from 'bcrypt';
import { prismaMock } from '../../../singleton'

jest.mock('bcrypt');

const app = express();
app.use(express.json());
app.use('/registration', router);


describe('POST /registration/userupload', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    
    it('should return 400 if validation fails', async () => {
        const response = await request(app)
          .post('/registration/userupload')
          .send({ email: 'invalid-email', password: 'invalidpw' });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('should return 409 if user already exists', async () => {
        (prismaMock.user.findUnique as jest.Mock).mockResolvedValue({ id: 1, email: 'test@example.com' });
    
        const response = await request(app)
          .post('/registration/userupload')
          .send({ email: 'test@example.com', password: 'Validpw1' });

        expect(response.status).toBe(409);
        expect(response.body.message).toBe('email exists');
    });

    it('should return 200 and create a new user', async () => {
        (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
        (prismaMock.user.create as jest.Mock).mockResolvedValue({ id: 1, email: 'test@example.com' });
    
        const response = await request(app)
          .post('/registration/userupload')
          .send({ email: 'test@example.com', password: 'Validpw1' });
    
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User registered');
        expect(response.body.user).toEqual({ id: 1, email: 'test@example.com' });
      });

      it('should return 400 if there is an error during user creation', async () => {
        (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
        (prismaMock.user.create as jest.Mock).mockRejectedValue(new Error('Username already exists'));
    
        const response = await request(app)
          .post('/registration/userupload')
          .send({ email: 'test@example.com', password: 'Validpw1' });
    
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('email already exists');
      });


});