# grunt-xcode [![Build Status](https://travis-ci.org/matiassingers/grunt-xcode.png?branch=master)](https://travis-ci.org/matiassingers/grunt-xcode) [![Dependency Status](https://gemnasium.com/matiassingers/grunt-xcode.png)](https://gemnasium.com/matiassingers/grunt-xcode)
> Compile and build Xcode project with Grunt

## Getting Started
This plugin requires Grunt `~0.4.2`

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


#### gemInstall

Default: `false`  
Type: `Boolean`

Force the installation of the required gem without asking the user first.

#### workspace

Default: `''`  
Type: `String`

Workspace (.xcworkspace) file to use to build app (automatically detected in current directory)

#### project

Default: `''`  
Type: `String`

Project (.xcodeproj) file to use to build app (automatically detected in current directory, overridden by `workspace` option)

#### configuration

Default: `''`  
Type: `String`

Configuration used to build('Debug' or 'Release' in most projects)

#### scheme

Default: `''`  
Type: `String`

Scheme used to build app

#### clean

Default: `true`  
Type: `Boolean`

Clean project before building

#### archive

Default: `true`  
Type: `Boolean`

Archive project after building

#### destination

Default: `''`  
Type: `String`

Destination. Defaults to current directory

#### provision

Default: `''`  
Type: `String`

Sign .ipa file with .mobileprovision

#### identity

Default: `''`  
Type: `String`

Identity to be used along with --embed

#### sdk

Default: `''`  
Type: `String`

use SDK as the name or path of the base SDK when building the project

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_