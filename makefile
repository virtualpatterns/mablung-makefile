
ifeq ($(origin project-path),undefined)
export project-path := $(CURDIR)
export project-name := $(notdir $(project-path))
endif

ifeq ($(origin --mablung-makefile-path),undefined)
export --mablung-makefile-path := $(patsubst %/,%,$(dir $(realpath $(lastword $(MAKEFILE_LIST)))))
# $(info --mablung-makefile-path := $(--mablung-makefile-path))
export --mablung-makefile-name := $(shell node -p "require('$(--mablung-makefile-path)/package.json').name")
# $(info --mablung-makefile-name := $(--mablung-makefile-name))
export --mablung-makefile-version := $(shell node -p "require('$(--mablung-makefile-path)/package.json').version")
# $(info --mablung-makefile-version := $(--mablung-makefile-version))
endif

include $(--mablung-makefile-path)/include/common
include $(--mablung-makefile-path)/include/update
include $(--mablung-makefile-path)/include/commit
include $(--mablung-makefile-path)/include/build
include $(--mablung-makefile-path)/include/debug

.PHONY: version

version::
	@npx shx echo $(--mablung-makefile-name) $(--mablung-makefile-version)

.DEFAULT_GOAL := version
