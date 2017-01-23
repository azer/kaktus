## kaktüs

A new minimalistic web browser. It's currently usable, [and there is a lot to do](#roadmap).

Screenshots: [Simple View](https://cldup.com/6jOWAjYdpo.png) | [Tabbing](https://cldup.com/wDadS2XGrb.gif) | [Private Mode for Sites](https://cldup.com/qsYAu0F-ja.png)

* [Download](#download)
* [Keyboard Shortcuts](#keyboard-shortcuts)
* [Roadmap](#roadmap)
* [Call for Designers](#call-for-designers)
* [Development](#development)

![](https://cldup.com/6jOWAjYdpo.png)

## Download

* [macOS](https://www.dropbox.com/s/zk0hd9ec6k0a0yc/Kaktus-v1.2.0.zip?dl=0)

#### Keyboard Shortcuts:
* Command+T: New Tab
* Control+Space: Open Menu
* Command+O: Focus Mode
* Shift+Command+F: Full Screen
* Shift+Command+N: Open New Window with Privacy Mode
* Command+F: Find in the page
* Command+W: Close Tab

## How It Works

* [Tabbing]()

## Roadmap

What is missing ?
* A logo
* Download manager
* PDF Support
* Right-click Context Menu

## Call For Designers 

Kaktüs needs a lot of help on design. Here is what's missing;

* **Logo:** Current logo is something I had to pick up from Dribble (with the permission of the designer) and it's temporary.
* **Icons:** Kaktüs needs an icon set to interact with user better/
* **Ideas:** Kaktüs needs your ideas on how to improve tabbing and search.

## Development

#### Building From Source

Install all dependencies:

```bash
npm install
```

And get the build out for your target platform. Available platforms are:

* macOS
* win
* linux

So, I usually run;

```
make osx
```

Command to get my build for macOS.

#### Making Changes
Kaktüs is built with [choo](https://github.com/yoshuawuyts/choo) and [electron](https://github.com/electron/electron). Here is the commands I run to start the development:

```bash
$ make watch-css
$ make watch-js
$ make start
```

## Logo

I'm temporarily using [a cactus image I found on Dribble](https://dribbble.com/shots/1842263-Cactus) as a logo.
