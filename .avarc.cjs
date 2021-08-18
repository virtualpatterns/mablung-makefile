module.exports = function({ path }) {
  
  return {
    'failFast': true,
    'files': [
      'release/**/test/**/*.test.*'
    ],
    'require': [
      './release/header/library/source-map-support.js'
    ],
    'verbose': true
  }

}