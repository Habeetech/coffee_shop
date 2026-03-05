export default function validate(schema) {
  return (req, res, next) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params
      });
      next();
    } catch (error) {
      next(error);
    }
  };
}