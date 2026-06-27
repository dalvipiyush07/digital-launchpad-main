const { z } = require('zod');

// Helpers for coercion
const booleanCoerce = z.preprocess((val) => {
  if (val === 'true' || val === true) return true;
  if (val === 'false' || val === false) return false;
  return val;
}, z.boolean().default(false));

const numberCoerce = z.preprocess((val) => {
  if (val === undefined || val === '') return undefined;
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? undefined : parsed;
}, z.number().int());

const schemas = {
  works: z.object({
    name: z.string().min(1, 'Name is required'),
    tag: z.string().optional().default(''),
    desc: z.string().optional().default(''),
    url: z.string().optional().default(''),
    priority: numberCoerce.optional()
  }),
  clients: z.object({
    name: z.string().min(1, 'Name is required'),
    role: z.string().optional().default(''),
    text: z.string().optional().default(''),
    rating: numberCoerce.refine(val => val >= 1 && val <= 5, {
      message: 'Rating must be between 1 and 5'
    }).default(5)
  }),
  videos: z.object({
    title: z.string().min(1, 'Title is required'),
    type: z.string().optional().default(''),
    videoUrl: z.string().optional().default('')
  }),
  faqs: z.object({
    q: z.string().min(1, 'Question is required'),
    a: z.string().min(1, 'Answer is required')
  }),
  blogs: z.object({
    title: z.string().min(1, 'Title is required'),
    summary: z.string().optional().default(''),
    content: z.string().optional().default(''),
    category: z.string().optional().default('Insights'),
    published: booleanCoerce
  }),
  settings: z.record(z.any()),
  contact: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional().default(''),
    service: z.string().optional().default(''),
    message: z.string().optional().default('')
  })
};

/**
 * Express middleware to validate request body against a predefined schema.
 * @param {string} schemaKey - The name of the schema to validate against
 */
function validateBody(schemaKey) {
  return (req, res, next) => {
    const schema = schemas[schemaKey];
    if (!schema) return next();

    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errorList = result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid input data.',
        errors: errorList,
        errorCode: 'VALIDATION_ERROR'
      });
    }

    // Replace request body with sanitized schema values
    req.body = result.data;
    next();
  };
}

module.exports = {
  validateBody,
  schemas
};
