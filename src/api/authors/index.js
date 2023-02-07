import express from "express";
import { basicAuthMiddleware } from "../../lib/auth/basicAuth.js";
import AuthorsModel from "./model.js";

const authorsRouter = express.Router();

authorsRouter.post("/", async (req, res, next) => {
  try {
    const newAuthor = new AuthorsModel(req.body);
    const { _id } = await newAuthor.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

authorsRouter.get("/", basicAuthMiddleware, async (req, res, next) => {
  try {
    const authors = await AuthorsModel.find({});
    res.send(authors);
  } catch (error) {
    next(error);
  }
});

authorsRouter.get("/:authorId", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

authorsRouter.put("/:authorId", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

authorsRouter.delete("/:authorId", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default authorsRouter;
