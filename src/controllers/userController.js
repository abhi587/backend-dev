const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const {isValid,isValidRequestBody,isNameValid,isValidPhone,isValidEmail} = require("../validation/validation")



//********************************************NEW USER REGISTRATION*************************************** */

// handler function for registering new user

const registerUser = async function (req, res) {

    try {

        const requestBody = req.body;
        const queryParams = req.query;

        // query params must be empty
        if (isValidRequestBody(queryParams)) {
            return res
                .status(400)
                .send({ status: false, message: "invalid request" });
        }

        if (!isValidRequestBody(requestBody)) {
            return res
                .status(400)
                .send({ status: false, message: "user data is required to create a new user" });
        }

        // using destructuring to validate every key

        const { title, name, phone, email, password, address } = requestBody;

        if (!isValid(title)) {
            return res
                .status(400)
                .send({ status: false, message: `title is required and should be valid format like: Mr/Mrs/Miss` });
        }

        if (!["Mr", "Mrs", "Miss"].includes(title.trim())) {
            return res
                .status(400)
                .send({ status: false, message: `title must be provided from these values: Mr/Mrs/Miss`, });
        }

        if (!isValid(name) || !isNameValid(name)) {
            return res
                .status(400)
                .send({ status: false, message: `name is required and should be in valid format ` });
        }

        if (!isValid(phone)) {
            return res
                .status(400)
                .send({ status: false, message: "mobile number is required" });
        }

        if (!isValidPhone(phone)) {
            return res
                .status(400)
                .send({ status: false, message: " please enter a valid 10 digit mobile number" });
        }

        const isPhoneUnique = await UserModel.findOne({ phone });

        if (isPhoneUnique) {
            return res
                .status(400)
                .send({ status: false, message: `mobile number: ${phone} already exist` });
        }

        if (!isValid(email)) {
            return res
                .status(400)
                .send({ status: false, message: "email address is required" });
        }

        if (!isValidEmail(email)) {
            return res
                .status(400)
                .send({ status: false, message: " please enter a valid email address" });
        }

        const isEmailUnique = await UserModel.findOne({ email });

        if (isEmailUnique) {
            return res
                .status(400)
                .send({ status: false, message: `email: ${email} already exist` });
        }

        if (!isValid(password)) {
            return res
                .status(400)
                .send({ status: false, message: "password is required" });
        }

        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/.test(password)) {
            return res
                .status(400)
                .send({ status: false, message: "password should be: 8 to 15 characters, at least one letter and one number " });
        }

        if (address) {

            if (!isValid(address.street)) {
                return res
                    .status(400)
                    .send({ status: false, message: "invalid city" })
            }

            if (!isValid(address.city) && !isNameValid(address.city)) {
                return res
                    .status(400)
                    .send({ status: false, message: "invalid city" });
            }

            if (! /^\+?([1-9]{1})\)?([0-9]{5})$/.test(address.pincode) && !isValid(address.pincode)) {
                return res
                    .status(400)
                    .send({ status: false, message: "invalid pin" })
            }

        }


        // validation ends here

        const userData = {
            title: title.trim(),
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim(),
            password: password,
            address: address
        };

        const newUser = await UserModel.create(userData);

        res
            .status(201)
            .send({ status: true, message: "new user registered successfully", data: newUser, });


    } catch (err) {

        res.status(500).send({ error: err.message });

    }
};

//*********************************************USER LOGIN********************************************* */

// handler function for user login

const userLogin = async function (req, res) {

    try {

        const requestBody = req.body;
        const queryParams = req.query;

        // query params must be empty
        if (isValidRequestBody(queryParams)) {
            return res
                .status(400)
                .send({ status: false, message: "invalid request" });
        }

        if (!isValidRequestBody(requestBody)) {
            return res
                .status(400)
                .send({ status: false, message: "please provide input credentials" });
        }

        const userName = requestBody.email;
        const password = requestBody.password;

        // validating userName and password
        if (!isValid(userName)) {
            return res
                .status(400)
                .send({ status: false, message: "email is required" });
        }

        if (!isValidEmail(userName)) {
            return res
                .status(400)
                .send({ status: false, message: "please enter a valid email address" });
        }

        if (!isValid(password)) {
            return res
                .status(400)
                .send({ status: false, message: "password is required" });
        }

        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/.test(password)) {
            return res
                .status(400)
                .send({ status: false, message: "password should be: 8 to 15 characters, at least one letter and one number" });
        }

        const loginUser = await UserModel.findOne({
            email: userName.toLowerCase().trim(),
            password: password,
        });

        if (!loginUser) {
            return res
                .status(404)
                .send({ status: false, message: "invalid login credentials" });
        }

        const userID = loginUser._id;
        const payLoad = { userId: userID };
        const secretKey = "project3group21";

        // creating JWT
        const token = jwt.sign(payLoad, secretKey, { expiresIn: "5000s" });

        res.header("x-api-key", token);

        res
            .status(200)
            .send({ status: true, message: "login successful", data: token });

    } catch (err) {

        res.status(500).send({ error: err.message });

    }
};

//**********************************EXPORTING HANDLERS FUNCTIONS************************************* */

module.exports.registerUser = registerUser;
module.exports.userLogin = userLogin;