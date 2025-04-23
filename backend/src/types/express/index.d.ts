declare namespace Express {
    interface Request {
      loggedUser: {
        id: string,
        email: string,
        name: string
      };
    }
  }