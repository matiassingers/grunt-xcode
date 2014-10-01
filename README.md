# grunt-xcode [![Build Status](http://img.shields.io/travis/matiassingers/grunt-xcode.svg?style=flat-square)](https://travis-ci.org/matiassingers/grunt-xcode) [![Dependency Status](http://img.shields.io/gemnasium/matiassingers/grunt-xcode.svg?style=flat-square)](https://gemnasium.com/matiassingers/grunt-xcode)
> Build and export Xcode projects with Grunt

## Install
```shell
$ npm install grunt-xcode --save-dev
```

## Usage
```js
require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

grunt.initConfig({
    xcode: {
        options: {
          project: '/path/to/my/awesome/App/App.xcodeproj',
          scheme: 'Release'
        }
    }
});

grunt.registerTask('default', ['xcode']);
```

## Examples
*Coming soon.*

## Options
                              | default         | type      | description
----------------------------- | --------------- | --------- | ------------
**clean**                     | `true`          | `Boolean` | *Clean project before building*
**export**                    | `true`          | `Boolean` | *Export the project after building/archiving*
**project**                   | `''`            | `String`  | *Project (.xcodeproj) file to use to build app*
**configuration**             | `''`            | `String`  | *Configuration used to build('Debug' or 'Release' in most projects)<br>Available configurations for a project can be listed with `$ xcodebuild -list`*
**workspace**                 | `''`            | `String`  | *Workspace (.xcworkspace) file to use to build app, `scheme` must be passed along with `workspace`*
**scheme**                    | `''`            | `String`  | *Scheme used to build app*
**allTargets**                | `true`          | `Boolean` | *Will by default build all targets in project.<br>If `allTargets` is false and no `target` option is passed, the first available target will be built.*
**target**                    | `''`            | `String`  | *Build the target specified, by default will build all available targets - see `allTargets` option.<br>Available targets for a project can be listed with `$ xcodebuild -list`*
**archivePath**               | `''`            | `String`  | *Path to archive the build to (useful for saving DSYM etc.)<br>If nothing is provided a temp directory will be created and removed after completion.*
**exportFormat**              | `'IPA'`         | `String`  | *Valid formats are IPA (iOS archives only), PKG (Mac archives only), and APP.*
**exportPath**                | `process.cwd()` | `String`  | *Path to exported IPA file. Defaults to current directory*
**exportFilename**            | `'export.ipa'`  | `String`  | *Filename of the exported IPA file.*
**exportProvisioningProfile** | `''`            | `String`  | *Profilename of the provisioning profile to be used when exporting the archive.*
**exportSigningIdentity**     | `''`            | `String`  | *Identityname of the application signing identity to be used when exporting the archive.<br>If possible, this may be inferred from `exportProvisioningProfile`.<br>If nothing is specified the signing identity used to create the archive will be used.*
**exportInstallerIdentity**   | `''`            | `String`  | *Identityname of the installer signing identity to be used when exporting the archive.<br>If possible, this may be inferred from `exportProvisioningProfile` or `exportSigningIdentity`*
**arch**                      | `''`            | `String`  | *Build with specified architecture*
**sdk**                       | `''`            | `String`  | *Passed as `[<sdkfullpath> | <sdkname>]` when building the project<br>Available SDKs can be listed with `$ xcodebuild -showsdks`*


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## License

MIT © [Matias Singers](http://mts.io)
