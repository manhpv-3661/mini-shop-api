import { Request, Response } from 'express';
import {
  REQUEST_ID_HEADER,
  RequestIdMiddleware,
} from './request-id.middleware';

describe('RequestIdMiddleware', () => {
  let middleware: RequestIdMiddleware;
  let setHeader: jest.Mock;
  let next: jest.Mock;

  beforeEach(() => {
    middleware = new RequestIdMiddleware();
    setHeader = jest.fn();
    next = jest.fn();
  });

  it('generates a new request id when none is provided upstream', () => {
    const req = { headers: {} } as unknown as Request & { id?: string };
    const res = { setHeader } as unknown as Response;

    middleware.use(req, res, next);

    expect(req.id).toEqual(expect.any(String));
    expect(req.id).not.toHaveLength(0);
    expect(setHeader).toHaveBeenCalledWith(REQUEST_ID_HEADER, req.id);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('reuses an upstream request id instead of generating a new one', () => {
    const req = {
      headers: { [REQUEST_ID_HEADER]: 'upstream-id-123' },
    } as unknown as Request & { id?: string };
    const res = { setHeader } as unknown as Response;

    middleware.use(req, res, next);

    expect(req.id).toBe('upstream-id-123');
    expect(setHeader).toHaveBeenCalledWith(
      REQUEST_ID_HEADER,
      'upstream-id-123',
    );
  });
});
