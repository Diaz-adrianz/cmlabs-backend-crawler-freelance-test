declare namespace Express {
  interface Request {
    _query: this['query'];
  }
}
