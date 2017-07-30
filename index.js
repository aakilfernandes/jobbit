const cp = require('child_process')
const Promise = require('bluebird')

function Jobbit(path, timeout) {
  this.path = path
  this.isRunning = true

  const start = new Date()

  this.promise = new Promise((resolve, reject) => {

    let stdout = ''
    let stderr = ''
    let isTimedOut = false

    this.child = cp.exec(path, (error) => {
      this.isRunning = false
      if (error && !isTimedOut) {
        return reject(error)
      }
      const completion = new Completion(start, stdout, stderr, isTimedOut)
      resolve(completion)
    })

    this.child.stdout.on('data', (data) => {
      stdout += data
    })

    this.child.stderr.on('data', (data) => {
      stderr += data
    })

    if(timeout) {
      setTimeout(() => {
        if (this.isRunning) {
          isTimedOut = true
          this.child.kill()
        }
      }, timeout)
    }
  })
}

Jobbit.prototype.run = function run() {
  return new Job(this.path)
}

function Completion(start, stdout, stderr, isTimedOut) {
  this.start = start
  this.end = new Date()
  this.time = this.end - this.start
  this.stdout = stdout
  this.stderr = stderr
  this.isTimedOut = isTimedOut
}

module.exports = Jobbit
