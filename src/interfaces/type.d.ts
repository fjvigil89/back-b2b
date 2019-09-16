declare namespace Express {
  export interface Request {
    token: any;
    params: any;
    user: {
      client: string,
      userId: string,
    };
    body: {
      fecha: string;
      retail: string;
      folio: number;
      type: string;
      comment_id: number;
      content: string;
      context: string;
      id: string;
      post_id: number;
    };
  }
  export interface Response {
    token: any;
    user: {
      client: string,
      userId: string,
    };
    params: {
      id: number,
      range: number,
    };
  }
}
