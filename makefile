
.PHONY: default refresh upgrade build build-one debug debug-one clean node test release

default: build

refresh:
	@rm -Rf node_modules package-lock.json
	@npm install

upgrade:
	@npx shx rm -f package-lock.json
	@npx npm-check-updates --upgrade
	@npm install

# - Build ---------

export projectPath ?= $(CURDIR)
export makefilePath ?= $(realpath $(MAKEFILE_LIST))

export MAKEFILE_PATH := $(makefilePath)

binaryPath := $(projectPath)/node_modules/.bin

contentOf =	$(strip \
							$(filter-out ..,\
							$(filter-out .,\
								$(patsubst ./%,%,\
									$(wildcard $(1)/.*) $(wildcard $(1)/*)))))

currentSourcePath := $(CURDIR)
currentReleasePath :=	$(subst /source/,/release/,\
												$(subst /source,/release,\
													$(currentSourcePath)))

sourcePath :=	$(call contentOf,.)
releasePath :=	$(foreach \
									path,\
									$(sourcePath),\
									$(if \
										$(call contentOf,$(path)),\
										$(path)/.build,\
										$(currentReleasePath)/$(path)))

%/.build:
	@$(MAKE) --directory=$* --file=$(firstword $(makefilePath)) --no-print-directory build-one

build:
	@$(MAKE) --directory=source --file=$(firstword $(makefilePath)) --jobs --no-print-directory build-one

build-one: $(releasePath);
	@$(binaryPath)/shx echo -n 

define runCompile
@$(binaryPath)/shx echo Compile ... $(patsubst $(projectPath)/%,%,$(currentSourcePath)/$<)
@$(binaryPath)/eslint --fix $<
@$(binaryPath)/babel $< --out-file $@ --source-maps
endef

$(currentReleasePath)/%.cjs: %.cjs
	$(runCompile)
$(currentReleasePath)/%.js: %.js
	$(runCompile)
$(currentReleasePath)/%.mjs: %.mjs
	$(runCompile)

define runIgnore
@$(binaryPath)/shx echo Ignore .... $(patsubst $(projectPath)/%,%,$(currentSourcePath)/$<)
endef

$(currentReleasePath)/.DS_Store: .DS_Store
	$(runIgnore)
$(currentReleasePath)/.babelrc.json: .babelrc.json
	$(runIgnore)
$(currentReleasePath)/.eslintrc.json: .eslintrc.json
	$(runIgnore)

define runCopy
@$(binaryPath)/shx echo Copy ...... $(patsubst $(projectPath)/%,%,$(currentSourcePath)/$<)
@$(binaryPath)/shx mkdir -p $(patsubst %/,%,$(dir $@))
@$(binaryPath)/shx cp -R $< $@
endef

$(currentReleasePath)/%: %
	$(runCopy)

# - Debug ---------

debugPath :=	$(foreach \
								path,\
								$(sourcePath),\
								$(if \
									$(call contentOf,$(path)),\
									$(path)/.debug))

%/.debug:
	@$(MAKE) --directory=$* --file=$(firstword $(makefilePath)) --no-print-directory debug-one

debug:
	@$(binaryPath)/shx echo
	@$(binaryPath)/shx echo .FEATURES ............ $(.FEATURES)
	@$(binaryPath)/shx echo projectPath .......... $(projectPath)
	@$(binaryPath)/shx echo makefilePath ......... $(makefilePath)
	@$(binaryPath)/shx echo
	@$(MAKE) --directory=source --file=$(firstword $(makefilePath)) --no-print-directory debug-one

debug-one: $(debugPath)
	@$(binaryPath)/shx echo currentSourcePath .... $(patsubst $(projectPath)/%/,%,$(currentSourcePath)/$*)
	@$(binaryPath)/shx echo currentReleasePath ... $(patsubst $(projectPath)/%/,%,$(currentReleasePath)/$*)
	@$(binaryPath)/shx echo sourcePath ........... $(sourcePath)
	@$(binaryPath)/shx echo

# ----------

clean:
	@npx shx rm -rf coverage process release

node: build
	@node --no-warnings --unhandled-rejections=strict $(argument)

test: build
	@npx shx rm -rf coverage process
	@npx c8 ava $(argument)

# @git add release package-lock.json
# @git commit --message="post-test" --quiet

pre-release: clean upgrade refresh test
	@npx shx echo -n

release: pre-release
	@npm version prerelease
	@git push origin master
