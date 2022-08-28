const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const createUser = async function (req, res) {
  let data = req.body;
  let user = await UserModel.create(data);
  res.send({ status: true, msg: user });
};

const login = async function (req, res) {
  //let userName = req.body.emailId;
  let password = req.body.password;
  let foundUser = await UserModel.findOne({
    //emailId: userName,
    password: password
  });
  if (!foundUser)
    return res.send({ status: false, msg: "Incorrect username or password" });
    
  let token = jwt.sign(
    { userId: foundUser._id.toString() 
    }, 
    "abhishekkumarprasad"
  );
  res.send({ status: true, msg: token });
};

const getUser = async function (req, res) {
  let id = req.params.userId;
  let user = await UserModel.findById(id);
  res.send({ status: true, msg: user });
};

const updateUser = async function (req, res) {
  let id = req.params.userId;
  let data = req.body;

  let update = await UserModel.findByIdAndUpdate(
    { _id: id },
    { $set: data },
    { new: true }
  );

  res.send({ status: true, msg: update });
};

const deleteUser = async function (req, res) {
  let id = req.params.userId;

  let deletedUser = await UserModel.findByIdAndUpdate(
    { _id: id },
    { $set: { isDeleted: true } },
    { new: true }
  );

  res.send({ status: true, msg: deletedUser });
};

module.exports.createUser = createUser;
module.exports.login = login;
module.exports.getUser = getUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;