import express from "express";
import createHttpError from "http-errors";
import PostsModel from "./model.js";

const blogpostsRouter = express.Router();

blogpostsRouter.post("/", async (req, res, next) => {
  try {
    const newPost = new PostsModel(req.body);
    const { _id } = await newPost.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.get("/", async (req, res, next) => {
  try {
    const posts = await PostsModel.find();
    res.send(posts);
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.get("/:blogpostId", async (req, res, next) => {
  try {
    const post = await PostsModel.findById(req.params.blogpostId);
    if (post) {
      res.send(post);
    } else {
      next(
        createHttpError(
          404,
          `Post with id ${req.params.blogpostId} not found!!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.put("/:blogpostId", async (req, res, next) => {
  try {
    const updatedPost = await PostsModel.findByIdAndUpdate(
      req.params.blogpostId,
      req.body,
      { new: true, runValidators: true }
    ); // By default findByIdAndUpdate returns the record pre-modification. If you want to get back the newly updated record you shall use new:true
    // By default validation is off in the findByIdAndUpdate --> runValidators:true
    if (updatedPost) {
      res.send(updatedPost);
    } else {
      next(
        createHttpError(
          404,
          `Post with id ${req.params.blogpostId} not found!!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.delete("/:blogpostId", async (req, res, next) => {
  try {
    const deletedPost = await PostsModel.findByIdAndDelete(
      req.params.blogpostId
    );
    if (deletedPost) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Post with id ${req.params.blogpostId} not found!!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default blogpostsRouter;
