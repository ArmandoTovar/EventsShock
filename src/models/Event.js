import BaseModel from './BaseModel';
import knex from '../utils/knex';

class Event extends BaseModel {
  static get idColumn() {
    return 'id';
  }

  static get tableName() {
    return 'Events';
  }
}

export default Event.bindKnex(knex);
