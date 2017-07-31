const cp = require('child_process')
const Promise = require('bluebird')

function Jobbit(command, timeout) {
  this.command = command
  this.isRunning = true

  const start = new Date()

  this.promise = new Promise((resolve, reject) => {

    let stdout = ''
    let stderr = ''
    let isTimedOut = false

    this.child = cp.exec(command, (error) => {
      this.isRunning = false
      const completion = new Completion(error, start, stdout, stderr, isTimedOut)
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
  return new Job(this.command)
}

function Completion(error, start, stdout, stderr, isTimedOut) {
  this.error = error
  this.start = start
  this.end = new Date()
  this.time = this.end - this.start
  this.stdout = stdout
  this.stderr = stderr
  this.isTimedOut = isTimedOut
}

module.exports = Jobbit
