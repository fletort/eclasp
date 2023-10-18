# Eclasp

> Extend clasp behavior with eclasp  (**E**xtanded **C**ommand **L**ine **A**pps
> **S**cript **P**rojects).

Add some command over [clasp](https://github.com/google/clasp) to develop easily
[Apps Script](https://developers.google.com/apps-script/) projects locally

## Features

Actually `eclasp` extends some commands using original `clasp` by command line.
It does not fork the original project for this behaviour. It "plays" like user script,
using clasp directly to get some advanced behaviour.

### Local Code management

`eclasp` extends `push` and `pull` features by adding management of "specific
local code section".

All local code section that are decorated with specific comments will be
commented on the online AppScript IDE, and uncommented on local side.

This local code:

```js
// COMMENT THIS BLOCK IN GASP - START
my_specific_local_code
// COMMENT THIS BLOCK IN GASP - END
```

will become this code on online IDE:

```js
/* COMMENT THIS BLOCK IN GASP - START
my_specific_local_code
COMMENT THIS BLOCK IN GASP - END */
```

and vice and versa.

This feature is very useful to enable require (or import) locally, and to remove
them on online IDE.

```js
// COMMENT THIS BLOCK IN GASP - START
const { MyClass } = require("./MyModule");
// COMMENT THIS BLOCK IN GASP - END
```

Theses requires are needed locally to enable Intellisense on VSCode for exemple.
(put them between if condition stops VSCode Intellisense working)

## Install

First download `eclasp`:

```bash
npm install -g eclasp
```

Then as indicated by `clasp` [readme install section](https://github.com/google/clasp/tree/master#install),
you must enable the Google Apps Script API: <https://script.google.com/home/usersettings.>

![Enable Apps Script API](https://user-images.githubusercontent.com/744973/54870967-a9135780-4d6a-11e9-991c-9f57a508bdf0.gif)

## Commands

The following command provide extended Apps Script project management.

- [`eclasp pull [--versionNumber]`](#pull)
- [`eclasp push [--watch] [--force]`](#push)

### Pull

This command use the original [`eclasp pull`](https://github.com/google/clasp/blob/master/README.md#pull)
command:

> Fetches a project from either a provided or saved script ID.
> Updates local files with Apps Script project.

But add the local code management feature. So all Local code that are commented
on online IDE will become uncommented when pull on local environnement.

#### Options

Original options are managed:

- `--versionNumber <number>`: The version number of the project to retrieve.

#### Examples

- `eclasp pull`
- `eclasp pull --versionNumber 23`

### Push

This command use the original [`eclasp push`](https://github.com/google/clasp/blob/master/README.md#push)
command:

> Force writes all local files to script.google.com.

But add the local code management feature. So all Local code that are properly
decorated will become commented when push on script.google.com environnement.

#### Options

Only force Original options are managed:

- `-f` `--force`: Forcibly overwrites the remote manifest.

The watch option is not managed actually:
> `-w` `--watch`: Watches local file changes. Pushes files every few seconds.

#### Examples

- `eclasp push`
- `eclasp push -f`
