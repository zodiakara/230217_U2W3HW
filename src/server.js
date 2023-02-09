import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import blogpostsRouter from "./api/posts/index.js";
import {
  badRequestHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandlers.js";
import authorsRouter from "./api/authors/index.js";
import passport from "passport";
import googleStrategy from "./lib/auth/google.js";

const server = express();
const port = process.env.PORT;

passport.use("google", googleStrategy);

server.use(cors());
server.use(express.json());
server.use(passport.initialize());

server.use("/blogposts", blogpostsRouter);
server.use("/authors", authorsRouter);

server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("successfully connected to Mongo!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port ${port}`);
  });
});
