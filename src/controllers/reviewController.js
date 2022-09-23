const ReviewModel = require("../models/reviewModel")
const BookModel = require("../models/bookModel")
const mongoose = require('mongoose')
const { isValid, isValidIdType, isValidRequestBody, isValidSubcategory, isNameValid, isValidPhone, isValidEmail, isValidRating } = require('../validation/validation')


//*****************************CREATING NEW REVIEW***********************************/

const newReview = async function (req, res) {
    try {

        const requestBody = req.body
        const queryParams = req.query
        const bookId = req.params.bookId

        //query params should empty
        if (isValidRequestBody(queryParams)) {
            return res
                .status(400)
                .send({ status: false, message: "Invalid request" });
        }

        if (!isValidRequestBody(requestBody)) {
            return res
                .status(400)
                .send({ status: false, message: "review data is required to create review" });
        }

        if (!bookId) {
            return res
                .status(400)
                .send({ status: false, message: "bookId is required" });
        }

        if (!isValidIdType(bookId)) {
            return res
                .status(400)
                .send({ status: false, message: "enter a valid bookId" });
        }

        const bookBybookId = await BookModel.findOne({ _id: bookId, isDeleted: false, deleted: null })

        if (!bookBybookId) {
            return res
                .status(404)
                .send({ status: false, message: `no book found by ${bookId}` });
        }

        //using destructuring then checking existence of property. if exits then validating that key
        const { reviewedBy, rating, review } = requestBody

        //creating an object to add validation keys from requestBody
        const reviewData = {}

        if (requestBody.hasOwnProperty("reviewedBy")) {
            if (isValid(reviewedBy)) {
                reviewData["reviewedBy"] = reviewedBy.trim()
            } else {
                return res
                    .status(400)
                    .send({ status: false, message: "enter name in valid format" })
            }
            //if requestbody doesnot have the "reviewedBy" then assigning its default value
        } else {
            reviewData["reviewedBy"] = "Guest"
        }

        if (isValidRating(rating)) {

            reviewData["rating"] = rating

        } else {
            return res
                .status(400)
                .send({ status: false, message: "rate the book from 1 to 5,in number format" })
        }

        if (requestBody.hasOwnProperty("review")) {
            if (typeof (review) === "string" && review.trim().length > 0) {

                reviewData["review"] = review.trim()

            } else {
                return res
                    .status(400)
                    .send({ status: false, message: "enter review in valid format" })
            }
        }

        //adding properties like :bookId, default value of isDeleted and review creation data and time inside reviewData
        reviewData.bookId = bookId
        reviewData.isDeleted = false
        reviewData.reviewedAt = Date.now()

        const createReview = await ReviewModel.create(reviewData)

        const updateReviewCountInBook = await BookModel.findOneAndUpdate(
            { _id: bookId, isDeleted: false, deletedAt: null },
            { $inc: { reviews: +1 } },
            { new: true });

        const allReviewsOfThisBook = await ReviewModel.find({ bookId: bookId, isDeleted: false })

        //using .lean() to convert mongoose object to plain js object for adding a property temporarily
        const book = await BookModel.findOne({ _id: bookId, isDeleted: false, deletedAt: null }).lean()

        //temprorily adding one new property inside book which consist all reviews of this book
        book.reviewData = allReviewsOfThisBook

        res
            .status(201)
            .send({ status: true, message: "review added successfully", data: book })

    } catch (error) {

        res.status(500).send({ error: error.message })

    }
}


//****************************UPDATING A REVIEW********************************/

const updateReview = async function (req, res) {
    try {

        const queryParams = req.query
        const requestBody = req.body
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId

        //query must be empty
        if (isValidRequestBody(queryParams)) {
            return res
                .status(400)
                .send({ status: false, message: "invalid request" });
        }

        if (!isValidRequestBody(requestBody)) {
            return res
                .status(400)
                .send({ status: false, message: "data is required for review update" })
        }

        if (!bookId) {
            return res
                .status(400)
                .send({ status: false, message: "BookId is required in path params" })
        }

        if (!isValidIdType(bookId)) {
            return res
                .status(400)
                .send({ status: false, message: "enter a valid bookId" })
        }

        //using .lean() to convert mongoose object to plain js object for adding a propert temprorily
        const bookBybookId = await BookModel.findOne({ _id: bookId, isDeleted: false, deletedAt: null }).lean()

        if (!bookBybookId) {
            return res
                .status(404)
                .send({ status: false, message: `no book found by ${bookId}` })
        }

        if (!reviewId) {
            return res
                .status(400)
                .send({ status: false, message: "reviewId is required in path params" })
        }

        if (!isValidIdType(reviewId)) {
            return res
                .status(400)
                .send({ status: false, message: `enter a valid reviewId` })
        }

        const reviewByReviewId = await ReviewModel.findOne({ _id: reviewId, isDeleted: false })

        if (!reviewByReviewId) {
            return res
                .status(404)
                .send({ status: false, message: `No review found by ${reviewId}` });
        }

        if (reviewByReviewId.bookId != bookId) {
            return res
                .status(400)
                .send({ status: false, message: "review is not from this book" })
        }

        const { review, reviewedBy, rating } = requestBody

        //creating an empty object for adding all updates as per requestbody
        const update = {}

        //if requestbody has the mentioned property then validate that property and adding it to updates object
        if (requestBody.hasOwnProperty("reviewedBy")) {
            if (!isValid(reviewedBy)) {
                return res
                    .status(400)
                    .send({ status: false, message: "enter a valid name" })
            }
            update["reviewedBy"] = reviewedBy.trim()
        }

        if (requestBody.hasOwnProperty("rating")) {
            if (!isValidRating(rating)) {
                return res
                    .status(400)
                    .send({ status: false, message: "rate the book from 1 to 5 " })
            }
            update["rating"] = rating
        }

        if (requestBody.hasOwnProperty("review")) {
            if (typeof (review) === "string" && review.trim().length > 0) {
                update["review"] = review.trim()
            } else {
                return res
                    .status(400)
                    .send({ status: false, message: "enter review in valid format" })
            }
        }

        const reviewUpdate = await ReviewModel.findOneAndUpdate(
            { _id: reviewId, isDeleted: false },
            { $set: update },
            { new: true })

        const allReviewsOfThisBook = await ReviewModel.find({ bookId: bookId, isDeleted: false })

        //adding a temporary property inside book whic consist all reviews of this book
        bookBybookId.reviewData = allReviewsOfThisBook

        res
            .status(200)
            .send({ status: true, message: "review update successfully", data: bookBybookId })

    } catch (error) {

        res.status(500).send({ error: error.message })

    }
}


//*************************************DELETING A REVIEW****************************/

const deleteReview = async function (req, res) {
    try {

        const queryParams = req.query
        const requestBody = req.body
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId

        //query must be empty
        if (isValidRequestBody(queryParams)) {
            return res
                .status(400)
                .send({ status: false, message: "invalid request" });
        }

        if (isValidRequestBody(requestBody)) {
            return res
                .status(400)
                .send({ status: false, message: "data is not required in requestbody" })
        }

        if (!bookId) {
            return res
                .status(400)
                .send({ status: false, message: "BookId is required in path params" })
        }

        if (!isValidIdType(bookId)) {
            return res
                .status(400)
                .send({ status: false, message: "enter a valid bookId" })
        }

        const bookBybookId = await BookModel.findOne({ _id: bookId, isDeleted: false, deletedAt: null })

        if (!bookBybookId) {
            return res
                .status(404)
                .send({ status: false, message: `no book found by ${bookId}` })
        }

        if (!reviewId) {
            return res
                .status(400)
                .send({ status: false, message: "reviewId is required in path params" })
        }

        if (!isValidIdType(reviewId)) {
            return res
                .status(400)
                .send({ status: false, message: `enter a valid reviewId` })
        }

        const reviewByReviewId = await ReviewModel.findOne({ _id: reviewId, isDeleted: false })

        if (!reviewByReviewId) {
            return res
                .status(404)
                .send({ status: false, message: `No review found by ${reviewId}` });
        }

        if (reviewByReviewId.bookId != bookId) {
            return res
                .status(400)
                .send({ status: false, message: "review is not from this book" })
        }

        const markDirtyReview = await ReviewModel.findByIdAndUpdate(
            reviewId,
            { $set: { isDeleted: true } },
            { new: true }
        )

        const updateReviewCountInBook = await BookModel.findByIdAndUpdate(
            bookId,
            { $inc: { reviews: -1 } },
            { new: true }
        )

        res
            .status(200)
            .send({ status: true, message: "review has been successfully deleted" })

    } catch (error) {

        res.status(500).send({ error: error.message })

    }
}



module.exports.newReview = newReview
module.exports.updateReview = updateReview
module.exports.deleteReview = deleteReview