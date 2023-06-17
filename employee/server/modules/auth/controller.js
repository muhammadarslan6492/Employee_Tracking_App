import AuthService from './services';

class Controller {
  constructor() {}

  test(req, res) {
    try {
      return res.status(200).json({
        message: 'this is test api for check everythings is good to go',
      });
    } catch (error) {
      return res.status(500).json({ err: error.message });
    }
  }

  async webSignup(req, res) {
    try {
      const body = req.body;
      body.role = 'ADMIN';
      const response = await AuthService.createUser(body);
      return res.status(response.statusCode).json(response);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

export default new Controller();
