const test = require("node:test");
const assert = require("node:assert/strict");

const User = require("../models/user.js");
const { signup } = require("../controllers/users.js");

test("a failed login after sign-up goes to the error handler and stops", async (t) => {
    t.mock.method(User, "register", async (user) => user);
    const loginError = new Error("session store unavailable");
    const req = {
        body: { username: "u", email: "u@example.com", password: "a-long-password" },
        login: (user, callback) => callback(loginError),
        flash: () => {},
    };
    const res = { redirected: [], redirect(url) { this.redirected.push(url); } };
    const nextCalls = [];
    await signup(req, res, (err) => nextCalls.push(err));
    assert.deepEqual(nextCalls, [loginError]);
    assert.deepEqual(res.redirected, [], "no redirect after handing the error on");
});

test("sign-up doesn't log the new user document (it holds the password hash and salt)", async (t) => {
    t.mock.method(User, "register", async (user) => user);
    const logged = [];
    t.mock.method(console, "log", (...args) => logged.push(args));
    const req = {
        body: { username: "u", email: "u@example.com", password: "a-long-password" },
        login: (user, callback) => callback(),
        flash: () => {},
    };
    const res = { redirect() {} };
    await signup(req, res, () => {});
    assert.deepEqual(logged, []);
});
