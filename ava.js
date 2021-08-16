export default function (option) {

  return {
    "failFast": true,
    "files": [
      "release/**/test/**/*.test.*"
    ],
    "nodeArguments": [
      "--no-warnings",
      "--unhandled-rejections=strict"
    ],
    "require": [
      "./release/header/library/source-map-support.js"
    ],
    "verbose": true
  }

}