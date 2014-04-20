# PlayWithSix

Node module to ease using the Play With Six service

# Requirements

The module currently depends on `gunzip` and `rsync` being present in your PATH

# Usage

Can either be used as a command line tool or a module

## Command Line

### Download mod

`playwithsix destination mod`

## Module

    require('playwithsix')

### downloadMod(destination, mod, callback)

Destination folder where a `.pws` directory will be created
to contain metadata and compressed filed

# TODO

Windows support
