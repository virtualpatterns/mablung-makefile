.PHONY: default refresh upgrade build build-one debug debug-one clean node test release

default: build

refresh:
	@rm -rf node_modules package-lock.json
	@npm install

upgrade:
	@npx shx rm -f package-lock.json
	@npx npm-check-updates --upgrade
	@npm install

# - Build ---------

contentOf =	$(strip \
							$(filter-out ..,\
							$(filter-out .,\
								$(patsubst ./%,%,\
									$(wildcard $(1)/.*) $(wildcard $(1)/*)))))

currentSourcePath		:=	$(shell $(or $(rootPath),.)/node_modules/.bin/shx pwd)
currentReleasePath	:=	$(subst /source/,/release/,\
												$(subst /source,/release,\
													$(currentSourcePath)))

sourcePath	:=	$(call contentOf,.)
releasePath :=	$(foreach \
									path,\
									$(sourcePath),\
									$(if \
										$(call contentOf,$(path)),\
										$(path)/.build,\
										$(currentReleasePath)/$(path)))

%/.build: export rootPath
%/.build:
	@$(MAKE) --directory=$* --file=$(rootPath)/makefile --no-print-directory build-one

define runCompile
@$(rootPath)/node_modules/.bin/shx echo Compile ... $(patsubst $(rootPath)/%,%,$(currentSourcePath)/$<)
@$(rootPath)/node_modules/.bin/eslint --fix $<
@$(rootPath)/node_modules/.bin/babel $< --out-file $@ --source-maps
endef

$(currentReleasePath)/%.cjs: %.cjs
	$(runCompile)
$(currentReleasePath)/%.js: %.js
	$(runCompile)
$(currentReleasePath)/%.mjs: %.mjs
	$(runCompile)

$(currentReleasePath)/.DS_Store: ;
$(currentReleasePath)/.babelrc.json: ;
$(currentReleasePath)/.eslintrc.json: ;

$(currentReleasePath)/%: %
	@$(rootPath)/node_modules/.bin/shx echo Copy ...... $(patsubst $(rootPath)/%,%,$(currentSourcePath)/$<)
	@$(rootPath)/node_modules/.bin/shx mkdir -p $(patsubst %/,%,$(dir $@))
	@$(rootPath)/node_modules/.bin/shx cp -R $< $@

build: export rootPath = $(CURDIR)
build:
	@$(MAKE) --directory=source --file=$(rootPath)/makefile --jobs --no-print-directory build-one

build-one: $(releasePath);
	@$(rootPath)/node_modules/.bin/shx echo -n 

# - Debug ---------

debugPath :=	$(foreach \
								path,\
								$(sourcePath),\
								$(if \
									$(call contentOf,$(path)),\
									$(path)/.debug))

%/.debug: export rootPath
%/.debug:
	@$(MAKE) --directory=$* --file=$(rootPath)/makefile --no-print-directory debug-one

debug: export rootPath ?= $(CURDIR)
debug:
	@$(MAKE) --directory=source --file=$(rootPath)/makefile --no-print-directory debug-one

debug-one: $(debugPath)
	@$(rootPath)/node_modules/.bin/shx echo Debug ......... $(patsubst $(rootPath)/%/,%,$(currentSourcePath)/$*)
	@$(rootPath)/node_modules/.bin/shx echo sourcePath .... $(addprefix $(patsubst $(rootPath)/%/,%,$(currentSourcePath)/$*)/,$(sourcePath))
	@$(rootPath)/node_modules/.bin/shx echo releasePath ... $(patsubst $(rootPath)/%,%,$(releasePath))
	@$(rootPath)/node_modules/.bin/shx echo

# ----------

clean:
	@npx shx rm -rf coverage process release

node: build
	@node --no-warnings --unhandled-rejections=strict $(argument)

test: build
	@npx shx rm -rf coverage process
	@npx c8 ava $(argument)

release: clean upgrade refresh test
	@npm version prerelease
	@git push origin master
