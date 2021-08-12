import SourceMapSupport from 'source-map-support'

SourceMapSupport.install({
  'handleUncaughtExceptions': false
})

export { SourceMapSupport }
