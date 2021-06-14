
ifeq ($(origin projectPath),undefined)
export projectPath := $(CURDIR)
endif

include $(projectPath)/include/common
include $(projectPath)/include/build/common
include $(projectPath)/include/build/build
include $(projectPath)/include/build/debug

.DEFAULT_GOAL := build
