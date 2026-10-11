const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isOwner, isReviewAuthor } = require("../middleware.js");
const { fakeRequest } = require("./helpers.js");

const ownerId = new mongoose.Types.ObjectId();
const otherId = new mongoose.Types.ObjectId();

// Collects next() calls. A rejected promise from the middleware is returned rather than
// thrown, because in Express 4 nothing would catch it and Node would exit.
async function run(middleware, req, res) {
    const calls = [];
    let crashed = null;
    try {
        await middleware(req, res, (err) => calls.push(err));
    } catch (err) {
        crashed = err;
    }
    return { calls, crashed };
}

test("isOwner lets the listing's owner through", async (t) => {
    t.mock.method(Listing, "findById", async () => ({ owner: ownerId }));
    const { req, res } = fakeRequest({ user: { _id: ownerId }, params: { id: "l1" } });
    const { calls, crashed } = await run(isOwner, req, res);
    assert.equal(crashed, null);
    assert.deepEqual(calls, [undefined]);
});

test("isOwner stops a signed-in user who doesn't own the listing", async (t) => {
    t.mock.method(Listing, "findById", async () => ({ owner: ownerId }));
    const { req, res } = fakeRequest({ user: { _id: otherId }, params: { id: "l1" } });
    const { calls } = await run(isOwner, req, res);
    assert.deepEqual(calls, []);
    assert.equal(res.redirectedTo, "/listings/l1");
});

test("isOwner handles a listing that doesn't exist instead of crashing", async (t) => {
    t.mock.method(Listing, "findById", async () => null);
    const { req, res } = fakeRequest({ user: { _id: ownerId }, params: { id: "missing" } });
    const { calls, crashed } = await run(isOwner, req, res);
    assert.equal(crashed, null, "an unhandled rejection here takes the whole server down");
    assert.deepEqual(calls, []);
    assert.equal(res.redirectedTo, "/listings");
});

test("isOwner passes database errors to the error handler", async (t) => {
    t.mock.method(Listing, "findById", async () => {
        throw new Error("database unavailable");
    });
    const { req, res } = fakeRequest({ user: { _id: ownerId }, params: { id: "l1" } });
    const { calls, crashed } = await run(isOwner, req, res);
    assert.equal(crashed, null);
    assert.equal(calls[0].message, "database unavailable");
});

test("isReviewAuthor stops someone else", async (t) => {
    t.mock.method(Review, "findById", async () => ({ author: ownerId }));
    const { req, res } = fakeRequest({ user: { _id: otherId }, params: { id: "l1", reviewId: "r1" } });
    const { calls } = await run(isReviewAuthor, req, res);
    assert.deepEqual(calls, []);
    assert.equal(res.redirectedTo, "/listings/l1");
});

test("isReviewAuthor handles a review that doesn't exist instead of crashing", async (t) => {
    t.mock.method(Review, "findById", async () => null);
    const { req, res } = fakeRequest({ user: { _id: ownerId }, params: { id: "l1", reviewId: "gone" } });
    const { calls, crashed } = await run(isReviewAuthor, req, res);
    assert.equal(crashed, null);
    assert.deepEqual(calls, []);
    assert.equal(res.redirectedTo, "/listings/l1");
});
