const BookModel = require('../models/bookModel')
const UserModel = require('../models/userModel')
const moment = require("moment");
const ReviewModel = require('../models/reviewModel');
const { default: mongoose } = require('mongoose');


//**************************VALIDATION FUNCTION*******************/

const isValid = function (value) {
  if (typeof value == "undefined" || value == null) return false;
  if (typeof value == "string" && value.trim().length > 0) return true;
};

const isValidRequestBody = function (object) {
  return Object.keys(object).length > 0;
};

const isValidIdType = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId)
};

const isValidSubcategory = function (value) {
  if (typeof value == "undefined" || value == null) return false;
  if (typeof value == "string" && value.trim().length > 0) return true;
  if (typeof value == "object" && Array.isArray(value) == true) return true;
};


//************************************NEW BOOK REGISTRATION*************************/

const registerBook = async function (req, res) {

  try {

    const requestBody = req.body;
    const queryParams = req.query;
    const decodedToken = req.decodedToken;

    //  query params should be empty
    if (isValidRequestBody(queryParams)) {
      return res
        .status(400)
        .send({ status: false, message: "invalid request" });
    }

    if (!isValidRequestBody(requestBody)) {
      return res
        .status(400)
        .send({ status: false, message: "Book data is required to create a new user" });
    }

    // using destructuring then validate the keys

    const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = requestBody;

    if (!isValid(title)) {
      return res
        .status(400)
        .send({ status: false, message: `title is required and should be in valid format` });
    }

    // title must be unique
    const isTitleUnique = await BookModel.findOne({
      title: title,
      isDeleted: false,
      deletedAt: null,
    });

    if (isTitleUnique) {
      return res
        .status(400)
        .send({ status: false, message: `title already exist` });
    }

    if (!isValid(excerpt)) {
      return res
        .status(400)
        .send({ status: false, message: `excerpt is required and should be in valid format` });
    }

    if (!isValid(userId)) {
      return res
        .status(400)
        .send({ status: false, message: `userId is required and should be in valid format` });
    }

    if (!isValidIdType(userId)) {
      return res
        .status(400)
        .send({ status: false, message: `enter a valid userId` });
    }

    // finding user with the given id
    const isUserExistWithID = await UserModel.findById(userId);

    if (!isUserExistWithID) {
      return res
        .status(404)
        .send({ status: false, message: `no user exist with ${userId}` });
    }

    // authorization
    if (decodedToken.userId != requestBody.userId) {
      return res
        .status(401)
        .send({ status: false, message: `unauthorized access` });
    }

    if (!isValid(ISBN)) {
      return res
        .status(400)
        .send({ status: false, message: `ISBN is required` });
    }

    // checking ISBN format
    if (!/^(97(8|9))?\d{9}(\d|X)$/.test(ISBN)) {
      return res
        .status(400)
        .send({ status: false, message: `enter a valid ISBN of 13 digits` });
    }

    // ISBN should be unique
    const isUniqueISBN = await BookModel.findOne({
      ISBN: ISBN,
      isDeleted: false,
      deletedAt: null,
    });

    if (isUniqueISBN) {
      return res
        .status(400)
        .send({ status: false, message: `ISBN already exist` });
    }

    if (!isValid(category)) {
      return res
        .status(400)
        .send({ status: false, message: `category is required and should be in valid format` });
    }

    // if subcategory is an array then validating each element
    if (Array.isArray(subcategory)) {
      for (let i = 0; i < subcategory.length; i++) {
        element = subcategory[i];
        if (!isValid(element)) {
          return res
            .status(400)
            .send({ status: false, message: `subcategory is required and should be in valid format` });
        }
      }
    }

    // if subcategory is not an array then validating that
    if (!isValidSubcategory(subcategory)) {
      return res
        .status(400)
        .send({ status: false, message: `subcategory is required and should be in valid format` });
    }

    if (!isValid(releasedAt)) {
      return res
        .status(400)
        .send({ status: false, message: `releasedAt is required` });
    }

    // checking date format
    if (!/^[0-9]{4}[-]{1}[0-9]{2}[-]{1}[0-9]{2}/.test(releasedAt)) {
      return res
        .status(400)
        .send({ status: false, message: `released date format should be YYYY-MM-DD` });
    }

    // validating the date
    if (moment(releasedAt).isValid() == false) {
      return res
        .status(400)
        .send({ status: false, message: "enter a valid released date" });
    }

    // adding validated keys from requestBody and adding default values of isDeleted, reviews and deletedAt

    const bookData = {
      title: title.trim(),
      excerpt: excerpt.trim(),
      userId: userId.trim(),
      ISBN: ISBN.trim(),
      category: category.trim(),
      subcategory: subcategory,
      releasedAt: releasedAt,
      isDeleted: false,
      reviews: 0,
      deletedAt: null,
    };

    const newBook = await BookModel.create(bookData);

    res
      .status(201)
      .send({ status: true, message: "new book added successfully", data: newBook });

  } catch (err) {

    res.status(500).send({ error: err.message });

  }
};


//**************************************ALL BOOK LIST & FILTERED BOOK LIST************************************ */

const booksList = async function (req, res) {

  try {

    const requestBody = req.body;
    const queryParams = req.query;

    const filterConditions = {
      isDeleted: false,
      deletedAt: null
    };

    if (isValidRequestBody(requestBody)) {
      return res
        .status(400)
        .send({ status: false, message: "data is not required in body" });
    }

    // if filters are provided then validating each filter then adding it to filterCondition object
    if (isValidRequestBody(queryParams)) {

      const { userId, category, subcategory } = queryParams;

      if (queryParams.hasOwnProperty("userId")) {

        if (isValid(userId) && isValidIdType(userId)) {
          const userById = await UserModel.findById(userId);
          if (userById) {
            filterConditions["userId"] = userId.trim();
          } else {
            return res
              .status(404)
              .send({ status: false, message: `no user found by ${userId}` });
          }
        } else {
          return res
            .status(400)
            .send({ status: false, message: "enter a valid userId" });
        }
      }

      if (queryParams.hasOwnProperty("category")) {
        if (isValid(category)) {
          filterConditions["category"] = category.trim();
        } else {
          return res
            .status(400)
            .send({ status: false, message: `enter category in valid format` });
        }
      }

      if (queryParams.hasOwnProperty("subcategory")) {
        if (isValidSubcategory(subcategory)) {

          filterConditions["subcategory"] = subcategory;

        } else {

          return res
            .status(400)
            .send({ status: false, message: `enter subcategory in valid format` });

        }
      }
      const bookListAfterFiltration = await BookModel.find(filterConditions)
        .select({
          _id: 1,
          title: 1,
          excerpt: 1,
          userId: 1,
          category: 1,
          subcategory: 1,
          releasedAt: 1,
          reviews: 1,
        })
        .sort({ title: 1 });

      if (bookListAfterFiltration.length == 0) {
        return res
          .status(404)
          .send({ status: false, message: "no books found" });
      }

      res
        .status(200)
        .send({ status: true, message: "filtered Book list is here", booksCount: bookListAfterFiltration.length, bookList: bookListAfterFiltration });

      // if filters are not provided
    } else {
      const bookList = await BookModel.find(filterConditions)
        .select({
          _id: 1,
          title: 1,
          excerpt: 1,
          userId: 1,
          category: 1,
          subcategory: 1,
          releasedAt: 1,
          reviews: 1,
        })
        .sort({ title: 1 });

      if (bookList.length == 0) {
        return res
          .status(404)
          .send({ status: false, message: "no books found" });
      }

      res.status(200).send({
        status: true,
        message: "Book list is here",
        booksCount: bookList.length,
        bookList: bookList,
      });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

//*******************************************INDIVIDUAL BOOK DETAILS***************************************** */

const getBookDetails = async function (req, res) {

  try {

    const queryParam = req.query;
    const requestBody = req.body;
    const bookId = req.params.bookId;

    if (isValidRequestBody(requestBody)) {
      return res
        .status(400)
        .send({ status: false, message: "data is not required in body" });
    }

    if (isValidRequestBody(queryParam)) {
      return res
        .status(400)
        .send({ status: false, message: "invalid request" });
    }

    if (!bookId) {
      return res
        .status(400)
        .send({ status: false, message: "bookId is required in path params" });
    }

    if (!isValidIdType(bookId)) {
      return res
        .status(400)
        .send({ status: false, message: `enter a valid bookId` });
    }
    // used .lean to  convert mongoose object to plain javaScript object
    const bookByBookId = await BookModel.findOne({
      _id: bookId,
      isDeleted: false,
      deletedAt: null,
    });

    if (!bookByBookId) {
      return res
        .status(404)
        .send({ status: false, message: `no book found by ${bookId}` });
    }

    const allReviewsOfThisBook = await ReviewModel.find({
      bookId: bookId,
      isDeleted: false,
    });

    // adding a new property inside book and assigning it to allReviews array
    bookByBookId.reviewsData = allReviewsOfThisBook;

    res
      .status(200)
      .send({ status: true, message: "Book details", data: bookByBookId });

  } catch (err) {

    res.status(500).send({ error: err.message });

  }
};




//**********************************EXPORTING ALL HANDLERS FUNCTIONS************************************* */

module.exports.registerBook = registerBook;
module.exports.booksList = booksList;
module.exports.getBookDetails = getBookDetails;