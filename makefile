
.PHONY: refresh upgrade clean run test pre-release release build build-all build-folder copy-folder ignore-folder debug debug-all pre-debug-all debug-folder pre-debug-folder

ifeq ($(origin projectPath),undefined)
export projectPath := $(CURDIR)
endif

include $(projectPath)/include/common
include $(projectPath)/include/build/common
include $(projectPath)/include/build/build
include $(projectPath)/include/build/debug

.DEFAULT_GOAL := build
