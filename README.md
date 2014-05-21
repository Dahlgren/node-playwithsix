# PlayWithSix

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

### checkOutdated(destination, callback)

Find outdated mods which have previously been downloaded from PlayWithSix

### downloadMod(destination, mod, callback)

Destination folder where a `.pws` directory will be created
to contain metadata and compressed filed

### fetchMods(callback)

Get all metadata about mods available from PlayWithSix

# TODO

Windows support
