rm -rf ./lib/*
tsc
copyfiles -u 1  "./src/**/*.css" "./lib/"