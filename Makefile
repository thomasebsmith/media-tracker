# Configuration #
# ============= #
BUILD_DIR = build
RELEASE_DIR = $(BUILD_DIR)/release
DEBUG_DIR = $(BUILD_DIR)/debug
STATIC_DIR = static
SRC_DIR = src
SCRIPTS_DIR = $(SRC_DIR)/scripts

# Static dependencies #
# =================== #
STATIC_FILES = $(wildcard $(STATIC_DIR)/**/*.html) \
			   $(wildcard $(STATIC_DIR)/*.html) \
			   $(wildcard $(STATIC_DIR)/**/*.css) \
			   $(wildcard $(STATIC_DIR)/*.css)

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

$(RELEASE_DIR)/static: $(STATIC_FILES)
	rm -rf $@
	mkdir -p $@
	cp -R $(STATIC_DIR)/. $@
$(DEBUG_DIR)/static: $(STATIC_FILES)
	rm -rf $@
	mkdir -p $@
	cp -R $(STATIC_DIR)/. $@

$(RELEASE_DIR)/minified: $(RELEASE_DIR)/bundle
	rm -rf $@
	mkdir -p $@/scripts
	npx uglifyjs --compress --mangle -o $@/scripts/$(MAIN_SCRIPT).js \
		-- $</scripts/$(MAIN_SCRIPT).js

$(RELEASE_DIR)/bundle: $(SCRIPTS) $(BUILD_DIR)/typecheck \
	$(BUILD_DIR)/lint
	rm -rf $@
	npx browserify --extension=.ts $(SCRIPTS_DIR)/$(MAIN_SCRIPT).ts \
		-t [ babelify --extensions '.ts,.tsx' ] \
		-o $@/scripts/$(MAIN_SCRIPT).js
$(DEBUG_DIR)/bundle: $(SCRIPTS) $(BUILD_DIR)/typecheck $(BUILD_DIR)/lint
	rm -rf $@
	npx browserify --extension=.ts $(SCRIPTS_DIR)/$(MAIN_SCRIPT).ts \
		-t [ babelify --extensions '.ts,.tsx' ] \
		-o $@/scripts/$(MAIN_SCRIPT).js --debug

$(BUILD_DIR)/lint: $(SCRIPTS)
	rm -f $@
	npx eslint $(SCRIPTS) --max-warnings 0
	mkdir -p $(BUILD_DIR)
	touch $@

$(BUILD_DIR)/typecheck: $(SCRIPTS)
	rm -f $@
	npx tsc
	mkdir -p $(BUILD_DIR)
	touch $@

.PHONY: clean
clean:
	rm -rf $(BUILD_DIR)
