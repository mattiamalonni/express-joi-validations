import { ValidationOptions } from 'joi';

interface Config {
  [key: string]: ValidationOptions;
}

const Config: Config = {
  headers: {
    allowUnknown: true,
  },
  params: {
    allowUnknown: false,
  },
  query: {
    allowUnknown: false,
  },
  body: {
    allowUnknown: false,
    stripUnknown: true,
  },
};

export default Config;
