import type { Response } from 'express';
import httpStatus from 'http-status';

class BaseController {
  constructor() {}

  private sanitize = <T>(value: T) => {
    if (value === undefined) return value;
    return JSON.parse(
      JSON.stringify(value, (_key, val) =>
        typeof val === 'bigint' ? val.toString() : val
      )
    );
  };

  protected success = <T>(
    res: Response,
    data: T,
    message: string = 'Success'
  ) => {
    const payload = this.sanitize(data);
    return res.status(httpStatus.OK).json({
      status: true,
      message,
      data: payload,
    });
  };

  protected html = (res: Response, data: string) => {
    return res.status(httpStatus.OK).send(data);
  };
}

export default BaseController;
