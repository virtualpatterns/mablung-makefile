import Sinon from 'sinon'

Sinon
  .stub(console, 'log')
  .onCall(0)
  .throws(new Error())
  
