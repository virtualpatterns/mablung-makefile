
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
shx := $(binaryPath)/shx
eslint := $(binaryPath)/eslint
babel := $(binaryPath)/babel

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

$(currentReleasePath)/%.cjs: %.cjs
	@$(shx) echo Compile ... $(patsubst $(projectPath)/%,%,$(currentSourcePath)/$<)
	@$(eslint) --fix $<
	@$(babel) $< --out-file $@ --source-maps

$(currentReleasePath)/%.js: %.js
	@$(shx) echo Compile ... $(patsubst $(projectPath)/%,%,$(currentSourcePath)/$<)
	@$(eslint) --fix $<
	@$(babel) $< --out-file $@ --source-maps

$(currentReleasePath)/%.mjs: %.mjs
	@$(shx) echo Compile ... $(patsubst $(projectPath)/%,%,$(currentSourcePath)/$<)
	@$(eslint) --fix $<
	@$(babel) $< --out-file $@ --source-maps

$(currentReleasePath)/.DS_Store: ;
$(currentReleasePath)/.babelrc.json: ;
$(currentReleasePath)/.eslintrc.json: ;

$(currentReleasePath)/%: %
	@$(shx) echo Copy ...... $(patsubst $(projectPath)/%,%,$(currentSourcePath)/$<)
	@$(shx) mkdir -p $(patsubst %/,%,$(dir $@))
	@$(shx) cp -R $< $@

build:
	@$(MAKE) --directory=source --file=$(firstword $(makefilePath)) --no-print-directory build-one

build-one: $(releasePath)
	@$(shx) echo -n 

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
	@$(shx) echo
	@$(shx) echo .FEATURES ............ $(.FEATURES)
	@$(shx) echo projectPath .......... $(projectPath)
	@$(shx) echo makefilePath ......... $(makefilePath)
	@$(shx) echo
	@$(MAKE) --directory=source --file=$(firstword $(makefilePath)) --no-print-directory debug-one

debug-one: $(debugPath)
	@$(shx) echo currentSourcePath .... $(patsubst $(projectPath)/%/,%,$(currentSourcePath)/$*)
	@$(shx) echo currentReleasePath ... $(patsubst $(projectPath)/%/,%,$(currentReleasePath)/$*)
	@$(shx) echo sourcePath ........... $(sourcePath)
	@$(shx) echo

# ----------

clean:
	@npx shx rm -rf coverage process release

run: build
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
