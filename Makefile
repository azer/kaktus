PID=/tmp/kaktus-dev.pid
.PHONY: all

.PHONY: build
build: build-js build-css

build-js:
	@echo "  🛠  Building..."
	#@./node_modules/.bin/browserify ui/index.js | uglifyjs -cm > build/min.js
	@./node_modules/.bin/browserify src/app/index.js > build/min.js

build-css:
	@echo "  🛠  Building CSS..."
	@cat src/app/views/fonts.css  src/app/views/style.css src/app/views/top-bar/style.css src/app/views/title-bar/style.css src/app/views/search-results/style.css src/app/views/webviews/style.css src/app/views/find-in-page/style.css src/app/views/title-bar/spinner.css > build/style.css

watch-css:
	@echo "  👓  Watching for changes (CSS)..."
	@fswatch -o src/app/views/*.css src/app/views/**/*.css | xargs -n1 -I{}  make build-css

dev:
	@echo "  👓  Watching for changes (JS)..."
	@./node_modules/.bin/watchify src/app/index.js -o build/dev.js --debug --verbose

start:
	@echo "  ▶️  Starting"
	@DEV_MODE=ON ./node_modules/.bin/electron . & echo $$! > $(PID)

stop:
	@echo "  ⏹  Stopping"
	@-touch $(PID)
	@-kill `cat $(PID)` 2> /dev/null || true

clean:
	@rm -rf dist

osx:
	@./node_modules/.bin/electron-packager . Kaktüs --out=dist/osx --platform=darwin --arch=x64 --icon=kaktus.icns --ignore=dist --ignore=README.md --ignore=.gitignore
	@zip -r dist/kaktus-darwin-x64.zip dist/osx/Kaktüs-darwin-x64/

linux:
	@./node_modules/.bin/electron-packager . Kaktüs --out=dist/linux --platform=linux --arch=x64 --icon=kaktus.icns --ignore=dist --ignore=README.md --ignore=.gitignore

win:
	@./node_modules/.bin/electron-packager . Kaktüs --out=dist/win32 --platform=win32 --arch=x64 --icon=kaktus.icns --ignore=dist --ignore=README.md --ignore=.gitignore
