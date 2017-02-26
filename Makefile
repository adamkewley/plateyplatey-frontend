OUT_DIR = bin
SRC_DIR = src

PLATE_IN_DIR = ${SRC_DIR}/plates
PLATE_OUT_DIR = ${OUT_DIR}/plates
PLATE_INPUT_FILES = $(wildcard ${PLATE_IN_DIR}/*.json)
PLATE_OUTPUT_FILES = $(patsubst ${PLATE_IN_DIR}/%.json, ${PLATE_OUT_DIR}/%.json, ${PLATE_INPUT_FILES})
PLATE_REGISTRY_OUTPUT = ${OUT_DIR}/plates.json

CSS_OUTPUT = ${OUT_DIR}/css/platey.css

HTML_INPUT_FILES = $(wildcard ${SRC_DIR}/*.html)
HTML_OUTPUT_FILES = $(patsubst ${SRC_DIR}/%.html, ${OUT_DIR}/%.html, ${HTML_INPUT_FILES})

PLATE_DOCUMENTS_IN_DIR = ${SRC_DIR}/documents
PLATE_DOCUMENTS_OUT_DIR = ${OUT_DIR}/documents

CONFIGURATIONS_IN_DIR = ${SRC_DIR}/configurations
CONFIGURATIONS_OUT_DIR = ${OUT_DIR}/configurations

JS_OUTPUT = ${OUT_DIR}/platey.js
JS_LIBS = ${OUT_DIR}/lib


${OUT_DIR}:
	mkdir -p $@


# Libs
${JS_LIB_OUTPUT_DIR}: ${JS_LIB_INPUT_DIR} | ${OUT_DIR}
	cp -r $< $@


# Plates
${PLATE_OUT_DIR}: | ${OUT_DIR}
	mkdir -p $@

${PLATE_OUT_DIR}/%.json: ${PLATE_IN_DIR}/%.json | ${PLATE_OUT_DIR}
	cp $< $@

${PLATE_REGISTRY_OUTPUT}: ${PLATE_INPUT_FILES} | ${OUT_DIR}
	ruby scripts/generate-plate-list.rb $^ > $@



# Javascript & CSS
${JS_OUTPUT} ${CSS_OUTPUT}: | ${OUT_DIR}
	npm run build

${JS_LIBS}: | ${OUT_DIR}
	cp -r node_modules $@


# HTML
${OUT_DIR}/%.html: ${SRC_DIR}/%.html | ${OUT_DIR}
	cp $< $@

# Plate documents
${PLATE_DOCUMENTS_OUT_DIR} : ${PLATE_DOCUMENTS_IN_DIR} | ${OUT_DIR}
	cp -r $< $@

${CONFIGURATIONS_OUT_DIR} : ${CONFIGURATIONS_IN_DIR} | ${OUT_DIR}
	cp -r $< $@




.PHONY: install clean all

all: ${HTML_OUTPUT_FILES} ${JS_OUTPUT} ${CSS_OUTPUT} ${JS_LIBS} ${PLATE_OUTPUT_FILES} ${JS_LIB_OUTPUT_DIR} ${PLATE_REGISTRY_OUTPUT} ${PLATE_DOCUMENTS_OUT_DIR} ${CONFIGURATIONS_OUT_DIR}

clean: | ${OUT_DIR}
	rm -r ${OUT_DIR}

install:
	npm install
