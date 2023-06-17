import Joi from 'joi';

const schema = Joi.object({
  name: Joi.string().min(4).max(32).required().messages({
    'string.min': 'Invalid name entered or empty or empty',
    'string.max': 'Invalid name entered or empty',
    'string.empty': 'Invalid name entered or empty',
    'string.required': 'Invalid name entered or empty',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Invalid Email',
    'string.email': 'Invalid Email',
    'string.empty': 'Invalid Email',
    'any.required': 'Invalid Email',
  }),
  password: Joi.string().min(8).max(32).required().messages({
    'string.min': 'Invalid password',
    'string.max': 'Invalid password',
    'string.empty': 'Invalid password',
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
