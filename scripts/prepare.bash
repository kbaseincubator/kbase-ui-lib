rm -rf ./lib
tsc
copyfiles -u 1  "./build/**/*" "./lib/"
copyfiles -u 1  "./src/**/*.css" "./lib/"
copyfiles -u 1 "./src/style/**/*" "./lib/"
copyfiles -u 1 "./src/custom/**/*" "./lib/"