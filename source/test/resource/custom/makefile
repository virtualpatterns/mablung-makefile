custom:
	$(info - custom -------------------------------)
	$(info current-compile-folder ... $(current-compile-folder))
	$(info exclude-compile-folder ... $(exclude-compile-folder))
	$(info exclude-compile-file ..... $(exclude-compile-file))
	$(info ----------------------------------------)
	@npx shx mkdir -p $(patsubst source/%,release/%,$(current-compile-folder))/folder
	@npx shx touch $(patsubst source/%,release/%,$(current-compile-folder))/folder/file