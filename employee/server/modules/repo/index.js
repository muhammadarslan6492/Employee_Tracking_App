export default class Repo {
  constructor(model) {
    console.log(model);
    this.model = model;
  }

  async create(payload) {
    try {
      const response = await this.model.create(payload);
      return response;
    } catch (error) {
      return { error };
    }
  }
  async findAll(where, attr, options = {}) {
    try {
      let params = where;
      if (attr) {
        params.attr = attr;
      }
      if (options) {
        params = { ...params, ...options };
      }
      const response = await this.model.find(params);
      return { response };
    } catch (error) {
      return { error };
    }
  }
  async findOne(where, attr) {
    try {
      let params = where;
      if (attr) {
        params.aggr = attr;
      }
      const response = await this.model.findOne(params);
      return response;
    } catch (error) {
      return { error };
    }
  }
  async aggr(query) {
    try {
    } catch (error) {
      return { error };
    }
  }
  async updateRecode(where, data) {
    try {
      const response = await this.model.findOneAndUpdate(where, data, {
        new: true,
        runValidators: true,
      });
      return { response };
    } catch (error) {
      return { error };
    }
  }

  async deleteRecord(where) {
    try {
      const response = await this.model.findOneAndDelete(where);
      return { response };
    } catch (error) {
      return { error };
    }
  }
}
