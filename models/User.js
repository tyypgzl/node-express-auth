const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userScheme = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter an password"],
    minLength: [6, "Minimum  password length is 6 characters"],
  },
});

// fire a function after doc saved to db
// userScheme.post("save", function (doc, next) {
//   console.log("New user was created & saved", doc);
//   next();
// });

// fire a function before doc saved to db
userScheme.pre("save", async function (next) {
  // console.log("user about to be created & saved", this);
  // this => User.create({ email, password }) fonksiyonundaki user'a erisir.
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userScheme.statics.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (user) {
    const passwordHashCompare = await bcrypt.compare(password, user.password);
    if (passwordHashCompare) {
      return user;
    }
    throw Error("Incorrect password");
  }
  throw Error("incorrect email");
};

const User = mongoose.model("user", userScheme);

module.exports = User;
