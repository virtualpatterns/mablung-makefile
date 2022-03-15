
# # a/b/c:
# # 	@echo a/b/c
# # a/b/c:
# # 	@echo a/b/c
# # sandbox/makefile:4: warning: overriding commands for target `a/b/c'
# # sandbox/makefile:2: warning: ignoring old commands for target `a/b/c'

# # a/b/c::
# # 	@echo a/b/c
# # a/b/c::
# # 	@echo a/b/c
# # a/b/c
# # a/b/c

# # a/%/c:
# # 	@echo first a/b/c
# # a/%/c:
# # 	@echo second a/b/c
# # < a/b/c
# # > second a/b/c

# # a/b%/c:
# # 	@echo first a/b/c
# # a/%/c:
# # 	@echo second a/b/c
# # < a/ba/c
# # > first a/b/c

# # a/%/c:
# # 	@echo second a/b/c
# # a/b%/c:
# # 	@echo first a/b/c
# # < a/ba/c
# # > second a/b/c ... make uses whichever is defined first

# # a/b/ba:
# # 	@echo a/b/ba
# # a/b/a:
# # 	@echo a/b/a
# # a/%/c: a/b/%
# # 	@echo second a/b/c
# # a/b%/c: a/b/%
# # 	@echo first a/b/c
# # < a/ba/c
# # > a/b/ba
# # > second a/b/c

# # a/b/ba:
# # 	@echo a/b/ba
# # a/b/a:
# # 	@echo a/b/a
# # a/b%/c: a/b/%
# # 	@echo first a/b/c
# # a/%/c: a/b/%
# # 	@echo second a/b/c
# # < a/ba/c
# # > a/b/a
# # > first a/b/c ... make uses whichever is defined first

# # a/b/ba/c:
# # 	@echo a/b/ba/c
# # a/b/c:
# # 	@echo a/b/c
# # a/ba/%: a/b/%
# # 	@echo second a/b/c
# # a/%: a/b/%
# # 	@echo first a/b/c
# # < a/ba/c
# # > a/b/c
# # > second a/b/c ... again, make uses whichever is defined first

# # a/ba/%:
# # 	@echo first a/ba/%
# # a/ba/cd/%:
# # 	@echo second a/ba/cd/%
# # < a/ba/c
# # > first a/b/c
# # < a/ba/cd/d
# # > first a/b/c

# # a/ba/%::
# # 	@echo first a/ba/%
# # a/ba/c%::
# # 	@echo second a/ba/c%
# # < a/ba/cded
# # first a/ba/%

# # a/ba/dd/cded:
# # 	@echo a/ba/dd/cded
# # a/ba/d/ded:
# # 	@echo a/ba/d/ded
# # a/ba/%: a/ba/dd/%
# # 	@echo first a/ba/%
# # a/ba/c%: a/ba/d/%
# # 	@echo second a/ba/c%
# # < a/ba/cded
# # first a/ba/%

# # a/b/%:
# # 	@echo first
# # a/b/%:
# # 	@echo second

# # .PHONY: acd def;

# # acd:
# # 	@echo $@

# # def:
# # 	@echo $@

# # # .PHONY: brain;

# # brain: acd
# # brain: def

# # brain:
# # 	@echo $@

# # track/package-lock.json: package-lock.json
# # 	@touch $@

# # track/refresh: track/package-lock.json
# # 	@touch $@

# # refresh:
# # 	@touch package-lock.json
# # 	@$(MAKE) track/refresh

# # bobo: var := $(shell ls > sandbox/ls.out)
# # bobo:
# # 	$(eval var := $(shell ls > sandbox/ls.out))
# # 	@echo $(var)

# # $(info $(shell git status --porcelain | awk '{print $$2}'))

# # asd := $(shell npx npm-check-updates --errorLevel 2 1> /dev/null 2> /dev/null && echo $$?)
# # $(info asd = $(asd))
# # $(info .SHELLSTATUS = $(.SHELLSTATUS))

# # do-it:: do-it-0
# # 	@echo $@

# # $(info $(wildcard coverage))

# # do-it:: pre-do-it
# # 	@echo $@

# # pre-do-it:
# # 	@echo $@

# # # do-it:: pre-pre-do-it

# # # pre-pre-do-it:
# # # 	@echo $@

# # do-it::
# # 	@echo $@ again

# # pre-do-it: do-it-0

# # do-it-0:
# # 	@echo $@

# $(info MAKECMDGOALS = $(MAKECMDGOALS))

# # ifeq (run,$(firstword $(MAKECMDGOALS)))
# #   # use the rest as arguments for "run"
# #   RUN_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
# #   # ...and turn them into do-nothing targets
# #   $(eval $(RUN_ARGS):;@:)
# # endif

# get-argument = $(strip $\
# 								$(foreach $\
# 									item,$\
# 									$(MAKECMDGOALS),$\
# 									$(if $\
# 										$(or $(find-argument-$(1)),$(findstring $(1),$(item))),$\
# 										$(if $\
# 											$(find-argument-$(1)),$\
# 											$(item)$\
# 											$(eval $(item):;@:),$\
# 											$(eval find-argument-$(1) = $(item))))))

# cover: argument := $(call get-argument,cover)
# cover:
# 	@npx c8 ava $(argument)

# test: argument := $(call get-argument,test)
# test:
# 	npx ava $(argument)

# babo:;@:

# bebe:
# 	@:

# # % make -f sandbox/makefile clean test release/test/index.test.js
# # MAKECMDGOALS = clean test release/test/command/mablung-makefile-process.js release/test/command/mablung-makefile-process.js.map release/test/command/mablung-makefile.test.js release/test/command/mablung-makefile.test.js.map
# # make: *** No rule to make target `clean'.  Stop.

build-ignore := .babelrc.json

build: sandbox/release/.babelrc.json sandbox/release/folder/.babelrc.json
	@echo build!

$(foreach	item,\
					$(build-ignore),\
					$(eval sandbox/release/$(item):;@echo to $$@))
$(foreach	item,\
					$(build-ignore),\
					$(eval sandbox/release/%/$(item):;@echo to $$@))

# $(add-prefix sandbox/release/,build-ignore): $(add-prefix sandbox/source/,build-ignore)
# 	@echo $< to $@

# sandbox/release/.babelrc.json: sandbox/source/.babelrc.json
# 	@echo $< to $@
