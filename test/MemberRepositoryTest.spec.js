var assert = require("assert");
const { Member } = require("../models/member");

it("test Member save", () => {
  const member = new Member({
    name: "김태훈",
    account: "xmxm",
    password: "1234",
    email: "asdf",
  });
});
