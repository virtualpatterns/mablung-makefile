
--mablung-makefile-path := $(patsubst %/,%,$(dir $(realpath $(lastword $(MAKEFILE_LIST)))))
# $(info --mablung-makefile-path := $(--mablung-makefile-path))

ifeq ($(origin project-path),undefined)
export project-path := $(CURDIR)
endif

include $(--mablung-makefile-path)/include/common
include $(--mablung-makefile-path)/include/update
include $(--mablung-makefile-path)/include/commit
include $(--mablung-makefile-path)/include/build
include $(--mablung-makefile-path)/include/debug

.DEFAULT_GOAL := build
