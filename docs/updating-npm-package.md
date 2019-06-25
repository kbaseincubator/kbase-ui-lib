# Updating npm package

## How it WILL work

1. increment the version in package.json

2. push up change to fork

3. issue PR

4. Accept and merge PR

5. The package is published via travis

## How it DOES work

1. increment the version in package.json

2. Make sure it is built

    ```bash
    npm build
    ```

3. publish the package:

    ```bash
    npm publish
    ```