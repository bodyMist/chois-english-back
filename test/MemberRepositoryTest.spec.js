var assert = require("assert");
const { Member } = require("../models/member");

it("test Member save", () => {
  const member = new Member({
    name: "κΉνν",
    account: "xmxm",
    password: "1234",
    email: "asdf",
  });
});
