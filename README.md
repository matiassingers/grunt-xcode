# grunt-xcode [![Build Status](http://img.shields.io/travis/matiassingers/grunt-xcode.svg?style=flat-square)](https://travis-ci.org/matiassingers/grunt-xcode) [![Dependency Status](http://img.shields.io/gemnasium/matiassingers/grunt-xcode.svg?style=flat-square)](https://gemnasium.com/matiassingers/grunt-xcode)
> Build and export Xcode projects with Grunt

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-xcode --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-xcode');
```

## Documentation
Not ready yet.

### Options

#### clean

Default: `true`
Type: `Boolean`

Clean project before building

#### export

Default: `true`
Type: `Boolean`

Export the project after building/archiving

#### workspace

Default: `''`
Type: `String`

Workspace (.xcworkspace) file to use to build app

#### project

Default: `''`  
Type: `String`

Project (.xcodeproj) file to use to build app (overridden by `workspace` option)

#### configuration

Default: `''`  
Type: `String`

Configuration used to build('Debug' or 'Release' in most projects)

#### scheme

Default: `''`  
Type: `String`

Scheme used to build app


#### archivePath

Default: `''`
Type: `String`

Path to archive the build to (useful for saving DSYM etc.)
If nothing is provided a temp directory will be created and removed after completion.

#### exportFormat

Default: `'IPA'`
Type: `String`

Valid formats are IPA (iOS archives only), PKG (Mac archives only), and APP.

#### exportPath

Default: `process.cwd()`
Type: `String`

Path to exported IPA file. Defaults to current directory

#### exportFilename

Default: `export.ipa`
Type: `String`

Filename of the exported IPA file.

#### exportProvisioningProfile

Default: `''`
Type: `String`

Profilename of the provisioning profile to be used when exporting the archive.

#### exportSigningIdentity

Default: `''`
Type: `String`

Identityname of the application signing identity to be used when exporting the archive. If possible, this may be inferred from `exportProvisioningProfile`.
If nothing is specified the signing identity used to create the archive will be used.

#### exportInstallerIdentity

Default: `''`
Type: `String`

Identityname of the installer signing identity to be used when exporting the archive. If possible, this may be inferred from `exportProvisioningProfile` or `exportSigningIdentity`


Default: `''`  
Type: `String`


#### sdk

Type: `String`

use SDK as the name or path of the base SDK when building the project

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_