const moongoose = require("mongoose");

const { Schema } = moongoose;

const crypto = require("crypto");

const { v4: uuidv4 } = require("uuid");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    
    lastName: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },

    notes: {
      type: Array,
      default: [],
    },

    //todo come later
    encrpt_password: {
      type: String,
      required: true,
    },

    salt: String,

    profilepic: {
      type: String,
    },
  },
  { timestamps: true }
);

// Adding virtual
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4;
    this.encrpt_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

// Adding methods

userSchema.methods = {
  authenticate: function (plainPassword) {
    return this.securePassword(plainPassword) === this.encrpt_password;
  },

  securePassword: function (plainPassword) {
    if (!plainPassword) return "";

    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainPassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

module.exports = moongoose.model("User", userSchema);