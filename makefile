
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

projectPath ?= $(CURDIR)
export projectPath

makefilePath := $(realpath $(firstword $(MAKEFILE_LIST)))
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
	@$(MAKE) --directory=$* --file=$(makefilePath) --no-print-directory build-one

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

build:
	@$(MAKE) --directory=source --file=$(makefilePath) --jobs --no-print-directory build-one

build-one: $(releasePath);
	@$(binaryPath)/shx echo -n 

# - Debug ---------

debugPath :=	$(foreach \
								path,\
								$(sourcePath),\
								$(if \
									$(call contentOf,$(path)),\
									$(path)/.debug))

%/.debug:
	@$(MAKE) --directory=$* --file=$(makefilePath) --no-print-directory debug-one

debug:
	@$(MAKE) --directory=source --file=$(makefilePath) --no-print-directory debug-one

debug-one: $(debugPath)
	@$(binaryPath)/shx echo Debug ......... $(patsubst $(projectPath)/%/,%,$(currentSourcePath)/$*)
	@$(binaryPath)/shx echo sourcePath .... $(addprefix $(patsubst $(projectPath)/%/,%,$(currentSourcePath)/$*)/,$(sourcePath))
	@$(binaryPath)/shx echo releasePath ... $(patsubst $(projectPath)/%,%,$(releasePath))
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
