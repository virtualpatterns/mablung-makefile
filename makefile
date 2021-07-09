
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

# test:: project-name := $(notdir $(project-path))
# test:: exists-source-map := $(if $\
# 															$(findstring $\
# 																false,$\
# 																$(source-map)),,$\
# 															true)
# test::
# 	$(if $\
# 		$(exists-source-map),$\
# 		@npx mkdir -p ../Shared/$(project-name))
# 	$(if $\
# 		$(exists-source-map),$\
# 		@npx mkdir -p ../Shared/$(project-name))
# 	$(if $\
# 		$(exists-source-map),$\
# 		@npx shx rm -Rf ../Shared/$(project-name)/coverage)
# 	$(if $\
# 		$(exists-source-map),$\
# 		@npx shx cp -R coverage ../Shared/$(project-name))

.DEFAULT_GOAL := build
