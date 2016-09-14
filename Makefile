release:
	mkdir -p release

release/bower_components: | release
	cp -r bower_components $|

release/index.html: | release
	sed 's/\.\.\///' example/basic-plate-layout.html > $@

release/angular-implementation.js: | release
	cp example/angular-implementation.js $@

release/96-well-plate.json: | release
	cp example/96-well-plate.json $@

release/src: | release
	cp -r src $|

.PHONY: all clean

all: release/bower_components release/index.html release/angular-implementation.js release/96-well-plate.json release/src
clean: 
	rm -r release
