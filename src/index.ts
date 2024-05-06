import { Request, Response, NextFunction } from 'express';
import { AnySchema, ValidationOptions, ValidationError } from 'joi';
import type { Entries } from 'type-fest';
import Config from './config';

export interface ValidationConfigs {
  throwErrors?: boolean;
  overwriteRequest?: boolean;
}

export interface ValidationErrors {
  headers?: ValidationError;
  params?: ValidationError;
  query?: ValidationError;
  body?: ValidationError;
}

export interface ValidationValues {
  headers?: any;
  params?: any;
  query?: any;
  body?: any;
}
export interface ValidationRequest extends Request {
  validationConfigs?: ValidationConfigs;
  validationErrors?: ValidationErrors;
  validationValues?: ValidationValues;
}
export interface ValidationProps {
  headers?: AnySchema;
  params?: AnySchema;
  query?: AnySchema;
  body?: AnySchema;
}

export const expressJoiValidations = (configs: ValidationConfigs) => (req: ValidationRequest, _: Response, next: NextFunction) => {
  req.validationConfigs = configs;
  next();
};

export const validate = (props: ValidationProps, options?: ValidationOptions) => (req: ValidationRequest, _: Response, next: NextFunction) => {
  req.validationConfigs ||= {};
  req.validationErrors ||= {};
  req.validationValues ||= {};

  const { throwErrors = false, overwriteRequest = false } = req.validationConfigs;

  for (const [key, schema] of Object.entries(props) as Entries<typeof props>) {
    if (schema) {
      const configs = { ...Config[key], ...options };
      const { error, value } = schema.validate(req[key as keyof Request], configs);

      req.validationErrors[key as keyof ValidationErrors] = error;
      req.validationValues[key as keyof ValidationValues] = value;

      if (error && throwErrors) throw error;
      if (overwriteRequest) Object.assign(req[key as keyof Request], value);
    }
  }

  next();
};

export const validateHeaders = (headers: AnySchema, options?: ValidationOptions) => validate({ headers }, options);
export const validateParams = (params: AnySchema, options?: ValidationOptions) => validate({ params }, options);
export const validateQuery = (query: AnySchema, options?: ValidationOptions) => validate({ query }, options);
export const validateBody = (body: AnySchema, options?: ValidationOptions) => validate({ body }, options);

export { default as Joi, ValidationError } from 'joi';

export default validate;
