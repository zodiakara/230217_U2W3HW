import createHttpError from "http-errors";
import atob from "atob";
import AuthorsModel from "../../api/authors/model.js";

export const basicAuthMiddleware = async (req, res, next) => {
  //police officer mw that is checking the document
  // if the documents are ok, user can have the access to the endpoint
  // if not = req. is gonna be rejected with an error (401)
  //here we are expecting to receive an Auth header, like "basic 7890jijj8kb78yhg"
  if (!req.headers.authorization) {
    nest(
      createHttpError(
        401,
        "please provide credentials in the Authorization header!!"
      )
    );
  } else {
    const encodedCredentials = req.headers.authorization.split(" ")[1];
    console.log(encodedCredentials);
    const credentials = atob(encodedCredentials);
    console.log(credentials);
    const [email, password] = credentials.split(":");

    const author = await AuthorsModel.checkCredentials(email, password);
    if (author) {
      req.author = author;
      next();
    } else {
      next(createHttpError(401, "Credentials are not ok!"));
    }
  }
};
