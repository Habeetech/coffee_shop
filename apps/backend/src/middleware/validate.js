export default function validate(schema) {
  return (req, res, next) => {
    try {
      const data = {};

      if (schema.shape.body) data.body = req.body;
      if (schema.shape.params) data.params = req.params;
      if (schema.shape.query) data.query = req.query;

      const parsed = schema.parse(data);

      if (parsed.body) req.body = parsed.body;
      if (parsed.params) req.params = parsed.params;
      if (parsed.query) req.query = parsed.query;

      next();
    } catch (error) {
      next(error);
    }
  };
}