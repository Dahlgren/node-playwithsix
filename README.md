# PlayWithSix

[![Build Status](https://travis-ci.org/Dahlgren/node-playwithsix.svg)](http://travis-ci.org/Dahlgren/node-playwithsix)
[![Dependency Status](https://david-dm.org/dahlgren/node-playwithsix.png)](https://david-dm.org/dahlgren/node-playwithsix)

Node module to ease using the Play With Six service

# Usage

Can either be used as a command line tool or a module

## Command Line

Commands are executed with current working directory as folder

### Dependencies for mod

`playwithsix dependencies mod1 mod2 mod3...`

Show dependencies for one or more mods

### Download mod

`playwithsix install mod1 mod2 mod3...`

Install one or more mods

Use `-p` or `--path` to specify a directory other than current working directory

### Outdated mod

`playwithsix outdated`

List outdated mods

Use `-p` or `--path` to specify a directory other than current working directory

### Update mod

`playwithsix update`

Update all outdated mods

Use `-p` or `--path` to specify a directory other than current working directory

## Module

  npm install playwithsix

  require('playwithsix')

### checkOutdated(destination, callback(err, mods))

Find outdated mods which have previously been downloaded from PlayWithSix

### downloadMod(destination, mod, callback(err, mods))
### downloadMods(destination, mods, callback(err, mods))

Path where a mod or mods will be downloaded to.
Leftover files per mod directory will be deleted to ensure only current files are present.

Result will contain list of downloaded mods

### fetchMods(callback(err, mods))

Get all metadata about mods available from PlayWithSix

### resolveDependencies(mods, callback(err, mods))

Calculate needed mods from PlayWithSix for inputed list of mods
