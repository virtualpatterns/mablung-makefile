
const Process = process

Process.exitCode = 0

try {
  console.log()
} catch (error) {
  Process.exitCode = 1
  console.error(error)
}
