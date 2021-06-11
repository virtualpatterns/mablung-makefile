
.PHONY: default refresh upgrade build build-folder copy-folder ignore-folder debug debug-folder clean run test pre-release release

refresh:
	@rm -Rf node_modules package-lock.json
	@npm install

upgrade:
	@npx shx rm -f package-lock.json
	@npx npm-check-updates --upgrade
	@npm install

# - Build ---------

ifeq ($(origin projectPath),undefined)
export projectPath := $(CURDIR)
endif

ifeq ($(origin makefilePath),undefined)
export makefilePath := $(realpath $(MAKEFILE_LIST))
endif

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
currentReleasePath := $(subst /source,/release,$(currentSourcePath))

# $(info --------------------)
# $(info currentSourcePath = $(currentSourcePath))
# $(info currentReleasePath = $(currentReleasePath))
# $(info --------------------)

sourcePath :=	$(call contentOf,.)
releasePath := $(foreach \
									path,\
									$(sourcePath),\
									$(if \
										$(call contentOf,$(path)),\
										$(if \
											$(wildcard $(path)/makefile),\
											$(path)/.make-folder,\
											$(path)/.build-folder),\
										$(currentReleasePath)/$(path)))
	
%/.make-folder:
	@$(MAKE) --directory=$* --no-print-directory

%/.build-folder:
	@$(shx) mkdir -p $(currentReleasePath)/$*
	@$(MAKE) --directory=$* --file=$(firstword $(makefilePath)) --no-print-directory build-folder

# @$(shx) echo Make ...... $(patsubst $(projectPath)/%,%,$(currentSourcePath)/$*)
# @$(shx) echo Build ..... $(patsubst $(projectPath)/%,%,$(currentSourcePath)/$*)

$(currentReleasePath)/%.cjs: eslintFlag := --fix
$(currentReleasePath)/%.cjs: babelFlag := --source-maps
$(currentReleasePath)/%.cjs: %.cjs
	@$(shx) echo Compile ... $(patsubst $(projectPath)/%,%,$(currentSourcePath)/$<)
	@$(eslint) $< $(eslintFlag)
	@$(babel) $< --out-file $@ $(babelFlag)

$(currentReleasePath)/%.js: eslintFlag := --fix
$(currentReleasePath)/%.js: babelFlag := --source-maps
$(currentReleasePath)/%.js: %.js
	@$(shx) echo Compile ... $(patsubst $(projectPath)/%,%,$(currentSourcePath)/$<)
	@$(eslint) $< $(eslintFlag)
	@$(babel) $< --out-file $@ $(babelFlag)

$(currentReleasePath)/%.mjs: eslintFlag := --fix
$(currentReleasePath)/%.mjs: babelFlag := --source-maps
$(currentReleasePath)/%.mjs: %.mjs
	@$(shx) echo Compile ... $(patsubst $(projectPath)/%,%,$(currentSourcePath)/$<)
	@$(eslint) $< $(eslintFlag)
	@$(babel) $< --out-file $@ $(babelFlag)

$(currentReleasePath)/.DS_Store: ;
$(currentReleasePath)/.babelrc.json: ;
$(currentReleasePath)/.eslintrc.json: ;

$(currentReleasePath)/%: %
	@$(shx) echo Copy ...... $(patsubst $(projectPath)/%,%,$(currentSourcePath)/$<)
	@$(shx) cp -R $< $@

build: build-all

build-all:
	@$(MAKE) --directory=source --file=$(firstword $(makefilePath)) --jobs --no-print-directory build-folder

build-folder: $(releasePath)
	@$(shx) echo -n 

copy-folder:
	@$(shx) echo Copy ...... $(patsubst $(projectPath)/%,%,$(currentSourcePath))
	@$(shx) mkdir -p $(patsubst %/,%,$(dir $(currentReleasePath)))
	@$(shx) cp -R $(currentSourcePath) $(patsubst %/,%,$(dir $(currentReleasePath)))
	@$(shx) rm -f $(currentReleasePath)/makefile

ignore-folder:
	@$(shx) echo -n 

# - Debug ---------

debugPath := $(foreach \
								path,\
								$(sourcePath),\
								$(if \
									$(call contentOf,$(path)),\
									$(if \
										$(wildcard $(path)/makefile),,\
										$(path)/.debug-folder)))

%/.debug-folder:
	@$(MAKE) --directory=$* --file=$(firstword $(makefilePath)) --no-print-directory debug-folder

debug: debug-all

debug-all:
	@$(shx) echo
	@$(shx) echo .FEATURES ............ $(.FEATURES)
	@$(shx) echo projectPath .......... $(projectPath)
	@$(shx) echo makefilePath ......... $(makefilePath)
	@$(shx) echo
	@$(MAKE) --directory=source --file=$(firstword $(makefilePath)) --no-print-directory debug-folder

debug-folder: $(debugPath)
	@$(shx) echo currentSourcePath .... $(patsubst $(projectPath)/%,%,$(currentSourcePath))
	@$(shx) echo currentReleasePath ... $(patsubst $(projectPath)/%,%,$(currentReleasePath))
	@$(shx) echo sourcePath ........... $(sourcePath)
	@$(shx) echo releasePath .......... $(patsubst $(currentReleasePath)/%,%,$(releasePath))
	@$(shx) echo

# ----------

clean:
	@npx shx rm -Rf coverage process release

run: build-all
	@node --no-warnings --unhandled-rejections=strict $(argument)

test: build-all
	@npx shx rm -Rf coverage process
	@npx c8 ava $(argument)

# @git add release package-lock.json
# @git commit --message="post-test" --quiet

pre-release: clean upgrade refresh test
	@npx shx echo -n

release: pre-release
	@npm version prerelease
	@git push origin master

.DEFAULT_GOAL := build-all
