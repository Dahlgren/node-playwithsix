# PlayWithSix

[![Build Status](https://travis-ci.org/Dahlgren/node-playwithsix.svg)](http://travis-ci.org/Dahlgren/node-playwithsix)
[![Dependency Status](https://david-dm.org/dahlgren/node-playwithsix.png)](https://david-dm.org/dahlgren/node-playwithsix)

Node module to ease using the Play withSIX service

# Usage

Can either be used as a command line tool or a module

## Command Line

For simplicity install it globally with

> npm install -g playwithsix

Commands are executed with current working directory as folder

### Dependencies for mod

> playwithsix dependencies *mod1 mod2 mod3...*

Show dependencies for one or more mods

### Download mod

> playwithsix install *mod1 mod2 mod3...*

Install one or more mods

* `--lite` to try to use lite version of mods
* `-p` or `--path` to specify a directory other than current working directory
* `--skip-dependencies` to skip downloading dependencies required

### Outdated mod

> playwithsix outdated

List outdated mods

* `-p` or `--path` to specify a directory other than current working directory

### Search mods

> playwithsix search *phrase*

Search Play withSIX for mods with phrase partially matching their mod name or title.

### Update mod

> playwithsix update

Update all outdated mods

* `--lite` to try to use lite version of mods
* `-p` or `--path` to specify a directory other than current working directory
* `--skip-dependencies` to skip downloading dependencies required

## Module

  Install module

  > npm install playwithsix

  Require the module in your code

  > var playwithsix = require('playwithsix')

### checkOutdated(destination, callback(err, mods))

Find outdated mods which have previously been downloaded from Play withSIX

### downloadMod(destination, mod, options, callback(err, mods))
### downloadMods(destination, mods, options, callback(err, mods))

Path where a mod or mods will be downloaded to.
Leftover files per mod directory will be deleted to ensure only current files are present.

Result will contain list of downloaded mods

#### Options

* lite [bool], Try to use lite version of mods
* skipDependencies [bool], Skip downloading any required dependencies

### fetchMods(callback(err, mods))

Get all metadata about mods available from Play withSIX

### resolveDependencies(mods, options, callback(err, mods))

Calculate needed mods from Play withSIX for inputed list of mods

#### Options

* lite [bool], Try to use lite version of mods

### search(phrase, callback(err, mods))

Search Play withSIX for mods with phrase partially matching their mod name or title.
