OUT_DIR=bin
OBJ_DIR=obj
PLATE_IN_DIR = src/plate-layouts
PLATE_OUT_DIR=${OUT_DIR}/plates

NATIVE_COMMANDS = $(filter-out $(wildcard src/commands/flycheck*.js),$(wildcard src/commands/*.js))
NATIVE_COMMANDS_FACTORY = src/native-commands.js

JS_FILES := $(wildcard src/platey-lang/*.js) $(filter-out ${NATIVE_COMMANDS_FACTORY}, $(filter-out src/commands.js,$(wildcard src/*.js)))

SCSS_FILES_PATTERN = src/stylesheets/*.scss
SCSS_FILES = $(wildcard ${SCSS_FILES_PATTERN})
CSS_FILES = $(patsubst src/stylesheets/%.scss,${OUT_DIR}/%.css,${SCSS_FILES})
HTML_FILES = $(patsubst src/%.html,${OUT_DIR}/%.html,$(wildcard src/*.html))
PLATES = $(patsubst ${PLATE_IN_DIR}/%.json,${PLATE_OUT_DIR}/%.json, $(wildcard ${PLATE_IN_DIR}/*.json))

${OUT_DIR}:
	mkdir -p $@

${OBJ_DIR}:
	mkdir -p $@

${PLATE_OUT_DIR}: | ${OUT_DIR}
	mkdir -p $@

${OUT_DIR}/bower_components: bower_components | ${OUT_DIR}
	cp -r $< $@

# Map scss to css via sass
${CSS_FILES}: ${SCSS_FILES} | ${OUT_DIR}
	sass $< $@

${OBJ_DIR}/native-commands.js: ${NATIVE_COMMANDS} ${NATIVE_COMMANDS_FACTORY} | ${OBJ_DIR}
	cat ${NATIVE_COMMANDS} ${NATIVE_COMMANDS_FACTORY} > $@

# Concatenate the platey source javascript and 
# adapt it to es5.
${OUT_DIR}/platey.js: ${JS_FILES} ${OBJ_DIR}/native-commands.js | ${OUT_DIR}
	babel $^ -o $@

${PLATE_OUT_DIR}/%.json: ${PLATE_IN_DIR}/%.json | ${OUT_DIR} ${PLATE_OUT_DIR}
	cp $< $@

${OUT_DIR}/plates.json: ${PLATES}
	ruby scripts/generate-plate-list.rb $^ > $@

${OUT_DIR}/%.html: src/%.html | ${OUT_DIR}
	cp $< $@

all: ${OUT_DIR}/platey.js ${CSS_FILES} ${PLATES} ${HTML_FILES} ${OUT_DIR}/bower_components ${OUT_DIR}/plates.json

clean: | ${OUT_DIR} ${OBJ_DIR}
	rm -r ${OUT_DIR}
	rm -r ${OBJ_DIR}
