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

$(RELEASE_DIR)/final: $(RELEASE_DIR)/static $(RELEASE_DIR)/bundle
	for src in $^; do \
		cp -R "$$src/." $@; \
	done
$(DEBUG_DIR)/final: $(DEBUG_DIR)/static $(DEBUG_DIR)/bundle
	for src in $^; do \
		cp -R "$$src/." $@; \
	done

$(RELEASE_DIR)/static: $(STATIC_DIR)
	mkdir -p $@
	cp -R $</. $@
$(DEBUG_DIR)/static: $(STATIC_DIR)
	mkdir -p $@
	cp -R $</. $@

$(RELEASE_DIR)/bundle: $(RELEASE_DIR)/babel
	npx browserify $</scripts/$(MAIN_SCRIPT).js \
		-o $@/scripts/$(MAIN_SCRIPT).js
$(DEBUG_DIR)/bundle: $(DEBUG_DIR)/babel
	npx browserify $</scripts/$(MAIN_SCRIPT).js \
		-o $@/scripts/$(MAIN_SCRIPT).js --debug

$(RELEASE_DIR)/babel: $(SCRIPTS)
	npx tsc
	npx babel $(SCRIPTS_DIR) --out-dir $@/scripts --extensions '.ts,.tsx'
$(DEBUG_DIR)/babel: $(SCRIPTS)
	npx tsc
	npx babel $(SCRIPTS_DIR) --out-dir $@/scripts \
		--extensions '.ts,.tsx' --source-maps inline

.PHONY: clean
clean:
	rm -rf $(BUILD_DIR)
