import { Request, Response, NextFunction } from 'express';
import Ajv, { JSONSchemaType } from 'ajv';

const validateSchema = (data: unknown, schema: JSONSchemaType<unknown>) => {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(data)) return true;
  return false;
};

/**
 * High order function that returns a middleware validating request body
 * against a predefined schema. If request body is invalid, throws an error.
 * Can be used for validating request bodies.
 * @param schema The predefined schema
 * @returns The middleware
 */
export const validateReqBody = (schema: JSONSchemaType<unknown>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (validateSchema(req.body, schema)) {
      next();
    } else {
      throw new Error('Invalid body');
    }
  };
};

/**
 * Function that validate data against a predefined schema.
 * If data body is invalid, throws an error.
 * Can be used for validating socket bodies.
 * @data The data to validate
 * @param schema The predefined schema
 */
export const validateBody = (
  data: unknown,
  schema: JSONSchemaType<unknown>
) => {
  if (!validateSchema(data, schema)) throw new Error('Invalid body');
};
