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
  async verify(req, res) {
    try {
      const { JWT } = req.params;
      const response = await AuthService.verifyAccount(JWT);
      return res.status(response.statusCode).json(response);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async resend(req, res) {
    try {
      const { email } = req.body;
      const response = await AuthService.resendVerification(email);
      return res.status(response.statusCode).json(response);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const response = await AuthService.login(email, password);
      return res.status(response.statusCode).json(response);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  async profile(req, res) {
    try {
      const user = req.user;
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async logout(req, res) {
    try {
      const { headers } = req;
      const token = headers.authorization.split(' ')[1];
      const response = await AuthService.logout(token);
      return res.status(response.statusCode).json(response);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

export default new Controller();
