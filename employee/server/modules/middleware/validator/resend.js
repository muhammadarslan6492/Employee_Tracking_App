import Joi from 'joi';

const schema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Invalid Email',
    'string.email': 'Invalid Email',
    'string.empty': 'Invalid Email',
    'any.required': 'Invalid Email',
  }),
});

const validate = async (req, res, next) => {
  try {
    const { error } = await schema.validate(req.body);
    if (error) {
      if (error.details && error.details.length && error.details[0].message) {
        return res.status(400).json({ error: error.details[0].message });
      }
      return res.status(400).json({ error: error.message });
    }
    return next();
  } catch (error) {
    if (error.details && error.details.length && error.details[0].message) {
      return res.status(400).json({ error: error.details[0].message });
    }
    return res.status(400).json({ error: error.message });
  }
};

export default validate;
