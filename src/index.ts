import { Request, Response, NextFunction } from 'express';
import { AnySchema, ValidationOptions } from 'joi';
import Config from './config';

export const validate =
  (validate: { headers?: AnySchema; params?: AnySchema; query?: AnySchema; body?: AnySchema }, options?: ValidationOptions) =>
  async (req: Request, _: Response, next: NextFunction) => {
    const { headers, params, query, body } = validate;

    if (headers) {
      const configs = { ...Config.headers, ...options };
      const { error: headersError, value: headersValue } = headers.validate(req.headers, configs);
      if (headersError) throw headersError;
      req.headers = headersValue;
    }

    if (params) {
      const configs = { ...Config.params, ...options };
      const { error: paramsError, value: paramsValue } = params.validate(req.params, configs);
      if (paramsError) throw paramsError;
      req.params = paramsValue;
    }

    if (query) {
      const configs = { ...Config.query, ...options };
      const { error: queryError, value: queryValue } = query.validate(req.query, configs);
      if (queryError) throw queryError;
      req.query = queryValue;
    }

    if (body) {
      const configs = { ...Config.body, ...options };
      const { error: bodyError, value: bodyValue } = body.validate(req.body, configs);
      if (bodyError) throw bodyError;
      req.body = bodyValue;
    }

    next();
  };

export const validateHeaders = (headers: AnySchema, options?: ValidationOptions) => validate({ headers }, options);
export const validateParams = (params: AnySchema, options?: ValidationOptions) => validate({ params }, options);
export const validateQuery = (query: AnySchema, options?: ValidationOptions) => validate({ query }, options);
export const validateBody = (body: AnySchema, options?: ValidationOptions) => validate({ body }, options);

export { default as Joi, ValidationError } from 'joi';

export default validate;
