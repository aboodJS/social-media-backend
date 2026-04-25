const sendGreeting = require("../index")

test('function returns hello name', () => {
    expect(sendGreeting("abdallah")).toBe("hello, abdallah")
})