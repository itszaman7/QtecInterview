/**
 * Zod validation middleware factory.
 * Usage: validate(zodSchema) → Express middleware
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      errors,
    });
  }

  // Replace body with parsed (and possibly transformed) data
  req.body = result.data;
  next();
};

module.exports = validate;
