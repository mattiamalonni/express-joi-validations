# express-joi-validations

Express middleware to validate request (headers, params, query, body) using Joi

## Installation

```bash
npm i express-joi-validations
```

## Usage

### Out of the box

```typescript
import validate from 'express-joi-validations';

router.put('/posts/:id', validate({ headers: userToken, params: postId, body: postBody }), (request, response) => {
  // Validation errors will be in request.validationErrors
  // Validation values will be in request.validationValues
});
```

### With custom settings

```javascript
import express from 'express';
import { expressJoiValidations } from 'express-joi-validations';

const app = express();
app.use(expressJoiValidations({ validationConfigs }));
```

#### Configuration

- **throwErrors** (default: false): Define if errors should be thrown (suggested usage with [express-async-errors](https://github.com/davidbanham/express-async-errors))

- **overwriteRequest** (default: false): Define if original request should be overwritten with validated data.

### Helper methods

#### validateBody

```javascript
import { Joi, validateBody } from 'express-joi-validations';

// POST /posts
// body: { title: "Lorem ipsum", content: "Lorem ipsum dolor sit amet" }

const postBody = Joi.object({
  title: Joi.string().required().trim(),
  content: Joi.string().required().trim().min(10),
});

router.post('/posts', validateBody(postBody), postsController.create);
```

#### validateParams

```javascript
import { Joi, validateParams } from 'express-joi-validations';

// GET /posts/507f1f77bcf86cd799439011

const postId = Joi.object({
  id: Joi.string().hex().length(24),
});

router.get('/posts/:id', validateParams(postId), postsController.detail);
```

#### validateQuery

```javascript
import { Joi, validateQuery } from 'express-joi-validations';

// GET /posts?page=2

const postQuery = Joi.object({
  page: Joi.optional().number().integer().min(1).default(1),
});

router.get('/posts', validateQuery(postQuery), postsController.list);
```

#### validateHeaders

```javascript
import { Joi, validateHeaders } from 'express-joi-validations';
// DELETE /posts/507f1f77bcf86cd799439011
// headers: { Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" }

const userToken = Joi.object({
  authorization: Joi.string().regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/),
});

router.delete('/posts/:id', validateHeaders(userToken), postsController.remove);
```

##### Chain

```javascript
import { validateHeaders, validateParams, validateBody } from 'express-joi-validations';

router.put('/posts/:id', validateHeaders(userToken), validateParams(postId), validateBody(postBody), postsController.update);
```

##### Joi options

To every function, is possible to add a second parameter to specify custom [Joi Options](https://github.com/hapijs/joi/blob/master/lib/index.d.ts#L95):

```javascript
router.post('/posts', validateBody(postBody, { allowUnknown: true }), postsController.create);
```
