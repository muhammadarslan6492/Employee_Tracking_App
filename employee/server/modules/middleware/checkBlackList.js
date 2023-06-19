import cacheService from '../cache';

const blacklistMiddleware = async (req, res, next) => {
  try {
    const { headers } = req;
    const token = headers.authorization?.split(' ')[1];
    const blackListedTokens =
      (await cacheService.getAsync('blackListedTokens')) || [];
    if (blackListedTokens.includes(token)) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized',
      });
    }
    return next();
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export default blacklistMiddleware;
