
ifeq ($(origin projectPath),undefined)
export projectPath := $(CURDIR)
endif

.PHONY: refresh upgrade clean run test pre-release release build build-all build-folder copy-folder ignore-folder debug debug-all pre-debug-all debug-folder pre-debug-folder

ifeq ($(origin mablungMakefilePath),undefined)
export mablungMakefilePath := $(patsubst %/,%,$(dir $(lastword $(realpath $(MAKEFILE_LIST)))))
endif

include $(mablungMakefilePath)/include/common
include $(mablungMakefilePath)/include/build/common
include $(mablungMakefilePath)/include/build/build
include $(mablungMakefilePath)/include/build/debug

.DEFAULT_GOAL := build
