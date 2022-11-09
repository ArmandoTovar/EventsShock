import BaseModel from './BaseModel';
import knex from '../utils/knex';

class Detail extends BaseModel {
  static get idColumn() {
    return 'id';
  }
  static get tableName() {
    return 'Detail';
  }
}

export default Detail.bindKnex(knex);
