## kaktüs

A new minimalistic web browser. It's currently usable, [and there is a lot to do](#roadmap).

* [Download](#download)
* [How It Works](#how-it-works)
* [Keyboard Shortcuts](#keyboard-shortcuts)
* [Roadmap](#roadmap)
* [Development](#development)

![](https://cldup.com/6jOWAjYdpo.png)

## Download

* [OSX](https://www.dropbox.com/s/wwkj8c93s9ieijl/Kakt%C3%BCs-darwin-x64.zip?dl=0)
* [Linux](https://github.com/kaktus/kaktus/releases/download/1.0.0/Kaktus-linux-x64.zip)
* [Windows](https://github.com/kaktus/kaktus/releases/download/1.0.0/Kaktus-win32-x64.zip)

## How It Works
![](https://cldup.com/wDadS2XGrb.gif)

Tabbing menu shows both tabs and history items. They look same at first look. The difference is:
* When you hover them or select with arrow buttons, you'll see;
  - Tabs appear as blue, there is an X button on the right
  - History items appear as pink, there is a + button on the right.
  - X closes the tab, + opens that URL in new tab.
* You can filter the results by a query that you can type, like; "instagram" or "github".

#### Keyboard Shortcuts:
* Command+T: New Tab
* Control+Space: Open Menu
* Command+O: Focus Mode
* Shift+Command+F: Full Screen
* Shift+Command+N: Open New Window with Privacy Mode
* Command+W: Close Tab

## Roadmap

Features planned:
* Improved privacy mode that can be enabled for domain names (e.g Google)
* Auto-search: automatically bringing results from search engines -in privacy mode- to the menu, so user doesn't have to open them.
* Split browsing and follow-mode

Known issues:
* Multiple windows share same tabbing session.
* There is bugs with tabbing behavior.
* Back/forward buttons should update immediately after url changes
* The tabbing menu doesn't make it clear between history and tab items

Missing:
* Context menu
* Download manager
* PDF Preview

Improvements:
* Making search better (it currently can only match word-by-word)
* Showing screenshot on the tabbing menu (saving it to DB may be?)
* Saving and recovering screen size & positions

Windows & Linux:
* They don't look as nice as OSX builds do. Visual improvements are needed for both.

## Development

#### Building From Source

Install all dependencies:

```bash
npm install
```

And get the build out for your target platform. Available platforms are:

* osx
* win
* linux

So, I usually run;

```
make osx
```

Command to get my build for OSX.

#### Making Changes
Kaktüs is built with [choo](https://github.com/yoshuawuyts/choo) and [electron](https://github.com/electron/electron). Here is the commands I run to start the development:

```bash
$ make watch-css
$ make dev
$ make start
```

## Logo

I'm temporarily using [a cactus image I found on Dribble](https://dribbble.com/shots/1842263-Cactus) as a logo.
