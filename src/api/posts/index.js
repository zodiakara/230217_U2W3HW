import express from "express";
import createHttpError from "http-errors";
import PostsModel from "./model.js";
import q2m from "query-to-mongo";

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

// blogpostsRouter.get("/", async (req, res, next) => {
//   try {
//     const posts = await PostsModel.find();
//     res.send(posts);
//   } catch (error) {
//     next(error);
//   }
// });

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

// ******************** PAGINATION IMPLEMENTED

blogpostsRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.body);
    const total = await PostsModel.countDocuments(mongoQuery.criteria);
    console.log(mongoQuery);
    console.log(total);

    const posts = await PostsModel.find(
      mongoQuery.criteria,
      mongoQuery.options.fields
    )
      .sort()
      .skip()
      .limit();
    res.send({
      links: mongoQuery.links("http://localhost:3001/blogposts", total),
      totalPages: Math.ceil(total / mongoQuery.options.limit),
      posts,
    });
  } catch (error) {
    next(error);
  }
});

// ******************** EMBEDDING COMMENTS CRUD TO BLOGPOSTS ROUTES:

// adds comment to the selected blogpost:
blogpostsRouter.post("/:blogpostId/comments", async (req, res, next) => {
  try {
    const newComment = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (newComment) {
      const updatedPost = await PostsModel.findByIdAndUpdate(
        req.params.blogpostId,
        { $push: { comments: newComment } },
        { new: true, runValidators: true }
      );
      res.send(updatedPost);
    } else {
    }
  } catch (error) {
    next(error);
  }
});
blogpostsRouter.get("/:blogpostId/comments", async (req, res, next) => {
  try {
    const post = await PostsModel.findById(req.params.blogpostId);
    if (post) {
      res.send(post.comments);
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
blogpostsRouter.get(
  "/:blogpostId/comments/:commentId",
  async (req, res, next) => {
    try {
      const post = await PostsModel.findById(req.params.blogpostId);
      if (post) {
        const singleComment = post.comments.find(
          (comment) => comment._id.toString() === req.params.commentId
        );
        if (singleComment) {
          res.send(singleComment);
        } else {
          createHttpError(
            404,
            `Comment with id ${req.params.commentId} not found!!`
          );
        }
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
  }
);
blogpostsRouter.put(
  "/:blogpostId/comments/:commentId",
  async (req, res, next) => {
    try {
      if (condition) {
      } else {
      }
    } catch (error) {
      next(error);
    }
  }
);
blogpostsRouter.delete(
  "/:blogpostId/comments/:commentId",
  async (req, res, next) => {
    try {
      if (condition) {
      } else {
      }
    } catch (error) {
      next(error);
    }
  }
);

export default blogpostsRouter;
