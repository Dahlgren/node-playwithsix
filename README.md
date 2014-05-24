# PlayWithSix

[![Build Status](https://travis-ci.org/Dahlgren/node-playwithsix.svg)](http://travis-ci.org/Dahlgren/node-playwithsix)
[![Dependency Status](https://david-dm.org/dahlgren/node-playwithsix.png)](https://david-dm.org/dahlgren/node-playwithsix)

Node module to ease using the Play With Six service

# Requirements

The module currently depends on `gunzip` and `rsync` being present in your PATH

# Usage

Can either be used as a command line tool or a module

## Command Line

Commands are executed with current working directory as folder

### Download mod

`playwithsix install mod1 mod2 mod3...`

Install one or more mods

### Outdated mod

`playwithsix outdated`

List outdated mods

### Update mod

`playwithsix update`

Update all outdated mods

## Module

  npm install playwithsix

  require('playwithsix')

### checkOutdated(destination, callback(err, mods))

Find outdated mods which have previously been downloaded from PlayWithSix

### downloadMod(destination, mod, callback(err, mods))
### downloadMods(destination, mod, callback(err, mods))

Destination folder where a `.pws` directory will be created
to contain metadata and compressed filed

Result will contain list of downloaded mods

### fetchMods(callback(err, mods))

Get all metadata about mods available from PlayWithSix

### resolveDependencies(mods, callback(err, mods))

Calculate needed mods from PlayWithSix for inputed list of mods

# TODO

Windows support
