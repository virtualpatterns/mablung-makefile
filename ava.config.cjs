module.exports = function({ path }) {
  
  return {
    'failFast': true,
    'files': [
      'release/**/test/**/*.test.*'
    ],
    'require': [],
    'verbose': true
  }

}
