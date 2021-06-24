
mablung-makefile-path := $(patsubst %/,%,$(dir $(realpath $(lastword $(MAKEFILE_LIST)))))
# $(info mablung-makefile-path := $(mablung-makefile-path))

ifeq ($(origin projectPath),undefined)
export projectPath := $(CURDIR)
endif

.PHONY: refresh upgrade clean run test pre-release release build copy ignore debug debug pre-debug

include $(mablung-makefile-path)/include/common
include $(mablung-makefile-path)/include/build/common
include $(mablung-makefile-path)/include/build/build
include $(mablung-makefile-path)/include/build/debug

.DEFAULT_GOAL := build
