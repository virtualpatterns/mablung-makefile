
dirty-item = $(strip $\
							$(filter $\
								$(include-folder),$\
								$(patsubst $\
									%/,$\
									%,$\
									$(shell git status --porcelain | awk '{print $$2}'))))

$(info --------------------)
$(info dirty-item = $(dirty-item))
$(info --------------------)

# a/b/c:
# 	@echo a/b/c
# a/b/c:
# 	@echo a/b/c
# sandbox/makefile:4: warning: overriding commands for target `a/b/c'
# sandbox/makefile:2: warning: ignoring old commands for target `a/b/c'

# a/b/c::
# 	@echo a/b/c
# a/b/c::
# 	@echo a/b/c
# a/b/c
# a/b/c

# a/%/c:
# 	@echo first a/b/c
# a/%/c:
# 	@echo second a/b/c
# < a/b/c
# > second a/b/c

# a/b%/c:
# 	@echo first a/b/c
# a/%/c:
# 	@echo second a/b/c
# < a/ba/c
# > first a/b/c

# a/%/c:
# 	@echo second a/b/c
# a/b%/c:
# 	@echo first a/b/c
# < a/ba/c
# > second a/b/c ... make uses whichever is defined first

# a/b/ba:
# 	@echo a/b/ba
# a/b/a:
# 	@echo a/b/a
# a/%/c: a/b/%
# 	@echo second a/b/c
# a/b%/c: a/b/%
# 	@echo first a/b/c
# < a/ba/c
# > a/b/ba
# > second a/b/c

# a/b/ba:
# 	@echo a/b/ba
# a/b/a:
# 	@echo a/b/a
# a/b%/c: a/b/%
# 	@echo first a/b/c
# a/%/c: a/b/%
# 	@echo second a/b/c
# < a/ba/c
# > a/b/a
# > first a/b/c ... make uses whichever is defined first

# a/b/ba/c:
# 	@echo a/b/ba/c
# a/b/c:
# 	@echo a/b/c
# a/ba/%: a/b/%
# 	@echo second a/b/c
# a/%: a/b/%
# 	@echo first a/b/c
# < a/ba/c
# > a/b/c
# > second a/b/c ... again, make uses whichever is defined first

# a/ba/%:
# 	@echo first a/ba/%
# a/ba/cd/%:
# 	@echo second a/ba/cd/%
# < a/ba/c
# > first a/b/c
# < a/ba/cd/d
# > first a/b/c

# a/ba/%::
# 	@echo first a/ba/%
# a/ba/c%::
# 	@echo second a/ba/c%
# < a/ba/cded
# first a/ba/%

# a/ba/dd/cded:
# 	@echo a/ba/dd/cded
# a/ba/d/ded:
# 	@echo a/ba/d/ded
# a/ba/%: a/ba/dd/%
# 	@echo first a/ba/%
# a/ba/c%: a/ba/d/%
# 	@echo second a/ba/c%
# < a/ba/cded
# first a/ba/%

# a/b/%:
# 	@echo first
# a/b/%:
# 	@echo second

# .PHONY: acd def;

# acd:
# 	@echo $@

# def:
# 	@echo $@

# # .PHONY: brain;

# brain: acd
# brain: def

# brain:
# 	@echo $@

# track/package-lock.json: package-lock.json
# 	@touch $@

# track/refresh: track/package-lock.json
# 	@touch $@

# refresh:
# 	@touch package-lock.json
# 	@$(MAKE) track/refresh

# bobo: var := $(shell ls > sandbox/ls.out)
# bobo:
# 	$(eval var := $(shell ls > sandbox/ls.out))
# 	@echo $(var)

# $(info $(shell git status --porcelain | awk '{print $$2}'))

# asd := $(shell npx npm-check-updates --errorLevel 2 1> /dev/null 2> /dev/null && echo $$?)
# $(info asd = $(asd))
# $(info .SHELLSTATUS = $(.SHELLSTATUS))

# do-it:: do-it-0
# 	@echo $@

$(info $(wildcard coverage))

do-it:: pre-do-it
	@echo $@

pre-do-it:
	@echo $@

# do-it:: pre-pre-do-it

# pre-pre-do-it:
# 	@echo $@

do-it::
	@echo $@ again

pre-do-it: do-it-0

do-it-0:
	@echo $@
