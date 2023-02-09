import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const AuthorsSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    avatar: { type: String, required: false },
    email: { type: String, required: true },
    password: { type: String, required: false },
    role: { type: String, enum: ["Author", "Admin"], default: "Author" },
    googleId: { type: String, required: false },
  },
  { timestamps: true }
);

AuthorsSchema.pre("save", async function (next) {
  const currentAuthor = this;
  console.log(currentAuthor);
  if (currentAuthor.isModified("password")) {
    const plainPW = currentAuthor.password;
    const hash = await bcrypt.hash(plainPW, 10);
    currentAuthor.password = hash;
  }
  next();
});

AuthorsSchema.methods.toJSON = function () {
  const authorDocument = this;
  const author = authorDocument.toObject();

  delete author.password;
  delete author.createdAt;
  delete author.updatedAt;
  delete author.__v;
  return author;
};

AuthorsSchema.static("checkCredentials", async function (email, password) {
  const author = await this.findOne({ email });
  if (author) {
    const passwordMatch = await bcrypt.compare(password, author.password);
    if (passwordMatch) {
      return author;
    } else {
      return null;
    }
  } else {
    return null;
  }
});
export default model("Author", AuthorsSchema);
