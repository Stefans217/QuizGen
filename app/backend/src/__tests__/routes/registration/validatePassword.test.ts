import { validatePassword, validateEmail } from '../../../routes/registration/validatePassword';
import { validationResult } from 'express-validator';
import { Request, Response } from 'express';


describe('validatePassword', () => {
  const mockRequest = (password: string) => ({
    body: { password }
  } as Request);

  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const runValidation = async (req: Request, res: Response) => {
    await validatePassword.run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return res.status(200).json({ message: 'Valid password' });
  };

  it('should fail if password is less than 8 characters', async () => {
    const req = mockRequest('Short1');
    const res = mockResponse();
    await runValidation(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      errors: expect.arrayContaining([
        expect.objectContaining({ msg: 'Password must be at least 8 characters long' })
      ])
    }));
  });

  it('should fail if password does not contain an uppercase letter', async () => {
    const req = mockRequest('lowercase1');
    const res = mockResponse();
    await runValidation(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      errors: expect.arrayContaining([
        expect.objectContaining({ msg: 'Password must contain at least one uppercase letter' })
      ])
    }));
  });

  it('should fail if password does not contain a lowercase letter', async () => {
    const req = mockRequest('UPPERCASE1');
    const res = mockResponse();
    await runValidation(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      errors: expect.arrayContaining([
        expect.objectContaining({ msg: 'Password must contain at least one lowercase letter' })
      ])
    }));
  });

  it('should fail if password does not contain a number', async () => {
    const req = mockRequest('NoNumber');
    const res = mockResponse();
    await runValidation(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      errors: expect.arrayContaining([
        expect.objectContaining({ msg: 'Password must contain at least one number' })
      ])
    }));
  });

  it('should pass if password meets all criteria', async () => {
    const req = mockRequest('Valid1Password');
    const res = mockResponse();
    await runValidation(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Valid password' });
  });
});

describe('validateEmail', () => {
  const mockRequest = (email: string) => ({
    body: { email }
  } as Request);

  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const runValidation = async (req: Request, res: Response) => {
    await validateEmail.run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return res.status(200).json({ message: 'Valid email' });
  };

  it('should fail if email is invalid', async () => {
    const req = mockRequest('invalid-email');
    const res = mockResponse();
    await runValidation(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      errors: expect.arrayContaining([
        expect.objectContaining({ msg: 'Invalid email format' })
      ])
    }));
  });

  it('should pass if email is valid', async () => {
    const req = mockRequest('valid.email@example.com');
    const res = mockResponse();
    await runValidation(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Valid email' });
  });
});