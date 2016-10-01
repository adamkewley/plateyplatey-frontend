OUT_DIR=bin

JS_FILES = $(wildcard src/*.js)
CSS_FILES = $(patsubst src/%.scss,${OUT_DIR}/%.css,$(wildcard src/*.scss))
JSON_FILES = $(patsubst src/%.json,${OUT_DIR}/%.json,$(wildcard src/*.json))
HTML_FILES = $(patsubst src/%.html,${OUT_DIR}/%.html,$(wildcard src/*.html))

${OUT_DIR}:
	mkdir -p ${OUT_DIR}

${OUT_DIR}/bower_components: bower_components | ${OUT_DIR}
	cp -r $< $@

# Map scss to css via sass
${OUT_DIR}/%.css: src/%.scss | ${OUT_DIR}
	sass $< $@

# Concatenate the platey source javascript and 
# adapt it to es5.
${OUT_DIR}/platey.js: ${JS_FILES} | ${OUT_DIR}
	babel $^ -o $@

${OUT_DIR}/%.json: src/%.json | ${OUT_DIR}
	cp $< $@

${OUT_DIR}/%.html: src/%.html | ${OUT_DIR}
	cp $< $@

all: ${OUT_DIR}/platey.js ${CSS_FILES} ${JSON_FILES} ${HTML_FILES} ${OUT_DIR}/bower_components

clean: | ${OUT_DIR}
	rm -r ${OUT_DIR}
