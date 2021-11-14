
ifndef --mablung-makefile-path
export --mablung-makefile-path := $(patsubst %/,%,$(dir $(realpath $(lastword $(MAKEFILE_LIST)))))
endif

include $(--mablung-makefile-path)/include/common
include $(--mablung-makefile-path)/include/build
include $(--mablung-makefile-path)/include/debug
include $(--mablung-makefile-path)/include/clean

.DEFAULT_GOAL := version
