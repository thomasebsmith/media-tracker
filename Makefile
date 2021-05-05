# Configuration #
# ============= #
BUILD_DIR = build
RELEASE_DIR = $(BUILD_DIR)/release
DEBUG_DIR = $(BUILD_DIR)/debug
STATIC_DIR = static
SRC_DIR = src
SCRIPTS_DIR = $(SRC_DIR)/scripts

# Script dependencies #
# =================== #
MAIN_SCRIPT = index
SCRIPTS = $(wildcard $(SCRIPTS_DIR)/*.ts)

# Rules #
# ===== #
$(BUILD_DIR): $(RELEASE_DIR) $(DEBUG_DIR)

$(RELEASE_DIR): $(RELEASE_DIR)/final
$(DEBUG_DIR): $(DEBUG_DIR)/final

$(RELEASE_DIR)/final: $(RELEASE_DIR)/static $(RELEASE_DIR)/minified
	rm -rf $@
	mkdir -p $@
	for src in $^; do \
		cp -R "$$src/." $@; \
	done
$(DEBUG_DIR)/final: $(DEBUG_DIR)/static $(DEBUG_DIR)/bundle
	rm -rf $@
	mkdir -p $@
	for src in $^; do \
		cp -R "$$src/." $@; \
	done

$(RELEASE_DIR)/static: $(STATIC_DIR)
	rm -rf $@
	mkdir -p $@
	cp -R $</. $@
$(DEBUG_DIR)/static: $(STATIC_DIR)
	rm -rf $@
	mkdir -p $@
	cp -R $</. $@

$(RELEASE_DIR)/minified: $(RELEASE_DIR)/bundle
	rm -rf $@
	mkdir -p $@/scripts
	npx uglifyjs --compress --mangle -o $@/scripts/$(MAIN_SCRIPT).js \
		-- $</scripts/$(MAIN_SCRIPT).js

$(RELEASE_DIR)/bundle: $(SCRIPTS)
	rm -rf $@
	npx tsc
	npx browserify --extension=.ts $(SCRIPTS_DIR)/$(MAIN_SCRIPT).ts \
		-t [ babelify --extensions '.ts,.tsx' ] \
		-o $@/scripts/$(MAIN_SCRIPT).js
$(DEBUG_DIR)/bundle: $(SCRIPTS)
	rm -rf $@
	npx tsc
	npx browserify --extension=.ts $(SCRIPTS_DIR)/$(MAIN_SCRIPT).ts \
		-t [ babelify --extensions '.ts,.tsx' ] \
		-o $@/scripts/$(MAIN_SCRIPT).js --debug

.PHONY: clean
clean:
	rm -rf $(BUILD_DIR)
