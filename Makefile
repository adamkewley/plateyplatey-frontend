OUT_DIR=bin

all:
	mkdir -p ${OUT_DIR}
	cp -r bower_components ${OUT_DIR}
	cp *.html ${OUT_DIR}
	cp *.js ${OUT_DIR}
	cp *.css ${OUT_DIR}
	cp *.json ${OUT_DIR}
	cp -r src ${OUT_DIR}
