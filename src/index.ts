import { Request, Response, NextFunction } from 'express';
import { AnySchema, ValidationOptions } from 'joi';

export const validate =
  (validate: { params?: AnySchema; query?: AnySchema; body?: AnySchema }, options?: ValidationOptions) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { params, query, body } = validate;

    if (params) {
      const { error: paramsError, value: paramsValue } = params.validate(req.params, options);
      if (paramsError) throw new Error(paramsError.details[0].message);
      req.params = paramsValue;
    }

    if (query) {
      const { error: queryError, value: queryValue } = query.validate(req.query, options);
      if (queryError) throw new Error(queryError.details[0].message);
      req.query = queryValue;
    }

    if (body) {
      const { error: bodyError, value: bodyValue } = body.validate(req.body, options);
      if (bodyError) throw new Error(bodyError.details[0].message);
      req.body = bodyValue;
    }

    next();
  };

export const validateParams = (params: AnySchema, options?: ValidationOptions) => validate({ params }, options);
export const validateQuery = (query: AnySchema, options?: ValidationOptions) => validate({ query }, options);
export const validateBody = (body: AnySchema, options?: ValidationOptions) => validate({ body }, options);

export default validate;
