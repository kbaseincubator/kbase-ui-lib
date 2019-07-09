# Development

## Standalone Development

[ to be written ]

## Co-Development with a react client

Since this library serves at the pleasure of front end code, it is very handy to be able to develop it in the context of some front end code that uses it. In this case, we are going to describe a workflow for modifying the kbase-ui-lib codebase while using and testing such changes with an React-based client. More specifically, a CRA, or `create-react-app` based web app.

React web apps at KBase include the Narrative, kbase-ui, and kbase-ui plugins.

### Simple, universal, but awkward

The simplest method of developing the ui-lib is to follow the normal local development practice described above, in which features are added or code is altered, in concert with full test coverage and creative tests.

However, since one is typically modifying ui-lib in order to bring additional functionality to some client, it is beneficial to be able to quickly test those changes in the web app itself. 

The most straightforward way of accomplishing this, requiring only a simple change to the web app, is to simply publish the library with a new version, bump up the version in the client web app, and then recompile the web app.

This method works for any web app or other client code which consumes `@kbase/ui-lib`.

However, this process is awkward and potentially unsafe. It can be awkward, because to avoid spamming the npm registry with multiple publications (and creating many intermediate versions), you will need to complete an update before publication. I say awkward because it subverts the iterative process to some degree, yet may not avoid it completely. (E.g. if after publication the library does not do what is expected, even if it operates correctly according to its own unit tests.)

It can be unsafe because if you do practice iterative development through multiple publications, there will be many many versions published. Any project using an upwardly mobile semver expression for the library may unexpectedly receive updates to the library frequently, with each version only being slightly different than the previous one, and incomplete.

One way around this is to use alpha or beta semver suffixes. This makes the published changes safer, but still creates a large number of versions.

### Linking

[ working on this, just a recipe for now...]

1. In the library CRA directory (should be top level):

    ```bash
    npm link
    ```

2. In the web app CRA directory (should be react-app subdir):

    ```bash
    npm link @kbase/ui-lib 
    ```

    Or where `@kbase/ui-lib` is the npm package name for the library.

3. In the web app `craco.config.js` add:

    ```javascript
     webpack: {
        alias: {
            react: path.resolve('./node_modules/react'),
            redux: path.resolve('./node_modules/redux'),
            'react-redux': path.resolve('./node_modules/react-redux')
        }
    },
    devServer: {
        watchOptions: {
            poll: 1000
        }
    }
    ```

    `poll` can be any value that works for you. This setting is necessary because the CRA file system watcher does not seem to work either within node_modules or due to the way we build the library.
        
    > TODO: figure out if we can get watch working - i tried the `ignore` watchOption, but it didn't seem to have an effect.

4. Start the web app:

    ```bash
    npm run start
    ```

5. Make a change to the library, and build it as normal

    ```bash
    npm run build
    ```

    > TODO: there is discussion (e.g. [https://github.com/facebook/create-react-app/issues/1070](https://github.com/facebook/create-react-app/issues/1070)) for CRA to support auto building on file change, similar to auto build for dev mode.
    > TODO: Er, nevermind. This library is not a CRA app, just a regular TSC one. TSC supports watch mode for regular compilation, but we need to also copy the files to the right location for the library -- to be done later.

6. Within a second, you should see the web app's terminal start to work, and a few seconds after that, the web app browser page refresh.

7. This process seems a little fragile, so if things stop refreshing, close the web app's `start` process and run it again.

When done, we need to undo the linking:

1. in the web app

    ```bash
    npm unlink --no-save @kbase/ui-lib
    npm install
    ```

2. in the library

    ```bash
    npm unlink
    ```

3. The `craco.config.js` settings can remain, the are harmless; or you may wish to comment them out to ensure the the CRA behavior is as it was before.

