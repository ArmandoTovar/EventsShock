import { Model, QueryBuilder } from 'objection';

import cursorPaginate from '../utils/pagination/cursorPaginate';

export class BaseQueryBuilder extends QueryBuilder {
  cursorPaginate(options) {
    return cursorPaginate(this, options);
  }
}

export class BaseModel extends Model {
  static get useLimitInFirst() {
    return true;
  }

  static get QueryBuilder() {
    return BaseQueryBuilder;
  }

  $beforeInsert() {
    if (!this.createdAt) {
      this.createdAt = new Date();
    }
  }
}

export default BaseModel;
