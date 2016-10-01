OUT_DIR=bin

JS_FILES = $(patsubst %.js,${OUT_DIR}/%.js,$(wildcard *.js))
CSS_FILES = $(patsubst %.scss,${OUT_DIR}/%.css,$(wildcard *.scss))
JSON_FILES = $(patsubst %.json,${OUT_DIR}/%.json,$(wildcard *.json))
HTML_FILES = $(patsubst %.html,${OUT_DIR}/%.html,$(wildcard *.html))

${OUT_DIR}:
	mkdir -p ${OUT_DIR}

${OUT_DIR}/bower_components: bower_components | ${OUT_DIR}
	cp -r $< $@

# Map scss to css via sass
${OUT_DIR}/%.css: %.scss | ${OUT_DIR}
	sass $< $@

${OUT_DIR}/%.js: %.js | ${OUT_DIR}
	cp $< $@

${OUT_DIR}/%.json: %.json | ${OUT_DIR}
	cp $< $@

${OUT_DIR}/%.html: %.html | ${OUT_DIR}
	cp $< $@

all: ${JS_FILES} ${CSS_FILES} ${JSON_FILES} ${HTML_FILES} ${OUT_DIR}/bower_components

clean: | ${OUT_DIR}
	rm -r ${OUT_DIR}
