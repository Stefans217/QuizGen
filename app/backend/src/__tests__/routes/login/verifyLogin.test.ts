import request from 'supertest';
import express from 'express';
import router from '../../../routes/login/verifyLogin';
import bcrypt from 'bcrypt';
import { prismaMock } from '../../../singleton'

jest.mock('bcrypt');

const app = express();
app.use(express.json());
app.use('/login', router);

describe('POST /login/login', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if email or password is missing', async () => {
        const res = await request(app).post('/login/login').send({});
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Email and password are required.');
      });
    
      it('should return 401 if user is not found or invalid password', async () => {
        (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);
        const res = await request(app).post('/login/login').send({ email: 'foo@test.com', password: 'bar' });
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Invalid Credentials');
      });
    
      it('should return 200 and token if credentials are valid', async () => {
        (prismaMock.user.findUnique as jest.Mock).mockResolvedValue({ id: 1, email: 'foo@test.com', password: 'hashed' });
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        const res = await request(app).post('/login/login').send({ email: 'foo@test.com', password: 'Validpw1' });
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
      });
    
      it('should handle server error gracefully', async () => {
        (prismaMock.user.findUnique as jest.Mock).mockRejectedValue(new Error('Server error'));
        const res = await request(app).post('/login/login').send({ email: 'foo@test.com', password: 'Validpw1' });
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Internal server error.');
      });

});