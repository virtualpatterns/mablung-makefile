class CommandError extends Error {

  constructor(...parameter) {
    super(...parameter)
  }

}

export { CommandError }
