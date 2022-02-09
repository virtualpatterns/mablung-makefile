
custom:
	$(info - custom -------------------------------)
	$(info current-build-folder ... $(current-build-folder))
	$(info exclude-build-folder ... $(exclude-build-folder))
	$(info exclude-build-file ..... $(exclude-build-file))
	$(info ----------------------------------------)
	@npx shx rm -f $(patsubst source/%,release/%,$(current-build-folder))/makefile
	@npx shx mkdir -p $(patsubst source/%,release/%,$(current-build-folder))/folder
	@npx shx touch $(patsubst source/%,release/%,$(current-build-folder))/folder/file