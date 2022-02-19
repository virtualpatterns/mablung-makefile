
ifndef --mablung-makefile-path
export --mablung-makefile-path := $(patsubst %/,%,$(dir $(realpath $(lastword $(MAKEFILE_LIST)))))
endif

include $(--mablung-makefile-path)/include/common
include $(--mablung-makefile-path)/include/build
include $(--mablung-makefile-path)/include/clean

# ifeq ($(project-name),mablung-makefile)

# ifneq ($(is-cleaning),true)
# ifneq ($(is-building),true)

# pre-build::
# 	$(info - pre-build ----------------------------)
# 	@$(MAKE) --no-print-directory pre-build-0

# pre-build-0: source/commonjs.create source/commonjs/test.create source/commonjs/test/library.create
# 	@$(MAKE) $(if $(job-count),--jobs=$(job-count),--jobs) --no-print-directory pre-build-1

# pre-build-1: source/commonjs/test/index.cjs source/commonjs/test/index.test.cjs source/commonjs/test/library/path-exists.cjs source/commonjs/test/library/path-exists.test.cjs
# 	@:

# source/commonjs.create:
# 	$(if $(verbose),@echo create .... $(patsubst %.create,%,$@))
# 	@npx shx mkdir -p $(patsubst %.create,%,$@)

# source/commonjs/%.create:
# 	$(if $(verbose),@echo create .... $(patsubst %.create,%,$@))
# 	@npx shx mkdir -p $(patsubst %.create,%,$@)

# source/commonjs/%.cjs: source/esmodule/%.js
# 	@echo create .... $@
# 	@npx shx mkdir -p $(call get-folder,$@)
# 	@npx shx cp $< $@
# 	@npx shx sed -i "s/\.js/.cjs/g" $@ > /dev/null
# 	@npx shx sed -i "s/Path\.dirname\(URL\.fileURLToPath\(import\.meta\.url\)\)/__dirname/g" $@ > /dev/null
# 	@npx shx sed -i "s/import URL from 'url'/\/\/ import URL from 'url'/g" $@ > /dev/null

# pre-clean::
# 	$(info - pre-clean ----------------------------)
# 	$(if $(verbose),@echo delete .... source/commonjs)
# 	@npx shx rm -Rf source/commonjs

# endif
# endif

# endif
