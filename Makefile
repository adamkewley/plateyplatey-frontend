OUT_DIR=bin
PLATE_DIR=${OUT_DIR}/plates

JS_FILES = $(wildcard src/*.js)
CSS_FILES = $(patsubst src/%.scss,${OUT_DIR}/%.css,$(wildcard src/*.scss))
HTML_FILES = $(patsubst src/%.html,${OUT_DIR}/%.html,$(wildcard src/*.html))
PLATES = $(patsubst src/plates/%.json,${OUT_DIR}/plates/%.json, $(wildcard src/plates/*.json))

${OUT_DIR}:
	mkdir -p $@

${PLATE_DIR}: | ${OUT_DIR}
	mkdir -p $@

${OUT_DIR}/bower_components: bower_components | ${OUT_DIR}
	cp -r $< $@

# Map scss to css via sass
${OUT_DIR}/%.css: src/%.scss | ${OUT_DIR}
	sass $< $@

# Concatenate the platey source javascript and 
# adapt it to es5.
${OUT_DIR}/platey.js: ${JS_FILES} | ${OUT_DIR}
	babel $^ -o $@

${PLATE_DIR}/%.json: src/plates/%.json | ${OUT_DIR} ${PLATE_DIR}
	cp $< $@

${OUT_DIR}/plates.txt: ${PLATES}
	echo $(patsubst bin/%,%, $^) > $@

${OUT_DIR}/%.json: src/%.json | ${OUT_DIR}
	cp $< $@

${OUT_DIR}/%.html: src/%.html | ${OUT_DIR}
	cp $< $@

all: ${OUT_DIR}/platey.js ${CSS_FILES} ${PLATES} ${HTML_FILES} ${OUT_DIR}/bower_components ${OUT_DIR}/plates.txt

clean: | ${OUT_DIR}
	rm -r ${OUT_DIR}
