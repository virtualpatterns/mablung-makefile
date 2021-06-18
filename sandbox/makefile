
# haji := 123
# export HAJI

# $(info before default)

# default:
# 	$(eval HAJI := $(haji))
# 	@echo $$HAJI

# $(info after default)

# haji := 456

clean:
	rm -Rf one two

# one: 
# 	touch one

# two: 
# 	touch two

%.der::
	@echo stem = $*
	@echo preq = $<
	@echo trgt = $@

%.der:: one

%l.der::
	@echo stem = $*
	@echo preq = $<
	@echo trgt = $@
