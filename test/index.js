const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const Jobbit = require('../')

chai.use(chaiAsPromised)
chai.should()

describe('Jobbit', () => {
  it('should resolve completion without timeout', () => {
    const jobbit = new Jobbit('node ./test/scripts/pass.js')
    return jobbit.promise.then((completion) => {
      completion.should.be.instanceOf(Object)
      completion.should.have.keys(['start', 'end', 'time', 'stderr', 'stdout', 'isTimedOut'])
      completion.time.should.be.a('number')
      completion.time.should.be.within(1000, 1100)
      completion.stderr.should.be.a('string')
      completion.stdout.should.be.a('string')
      completion.stdout.should.equal('abcd')
      completion.stderr.should.equal('1234')
      completion.isTimedOut.should.be.a('boolean')
      completion.isTimedOut.should.equal(false)
    })
  })
  it('should resolve completion with timeout', () => {
    const jobbit = new Jobbit('node ./test/scripts/pass.js', 500)
    return jobbit.promise.then((completion) => {
      completion.should.be.instanceOf(Object)
      completion.should.have.keys(['start', 'end', 'time', 'stderr', 'stdout', 'isTimedOut'])
      completion.time.should.be.a('number')
      completion.time.should.be.within(500, 600)
      completion.stderr.should.be.a('string')
      completion.stdout.should.be.a('string')
      completion.stdout.should.equal('ab')
      completion.stderr.should.equal('12')
      completion.isTimedOut.should.be.a('boolean')
      completion.isTimedOut.should.equal(true)
    })
  })
  it('should reject for missing script', () => {
    const jobbit = new Jobbit('node ./test/scripts/missing.js')
    return jobbit.promise.should.be.rejectedWith(Error)
  })
})
