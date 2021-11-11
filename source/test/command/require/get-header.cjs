const Sinon = require('sinon')

Sinon
  .stub(console, 'log')
  .onCall(0)
  .throws(new Error())
  
