angular
    .module("plateyPersistence", [])
    .service("plateyPersistence", [function() {
	
	const defaultConfiguration = {
	    keybinds: {
		"<escape>": "(clear-selection)",
		"C-a": "(select-all)",
		"C-n": "(new-plate)",
		"<left>": "(move-column-selection-left)",
		"<right>": "(move-column-selection-right)",
		"<down>": "(move-row-focus-down e)",
		"<up>": "(move-row-focus-up e)",
		"<delete>": "(clear-values-in-current-selection)",
		"C-i": "(add-column)",
		"<return>": "(move-row-focus-down e)",
		"<tab>": "(move-column-selection-right)",
		"M-<left>": "(move-selected-column-left)",
		"M-<right>": "(move-selected-column-right)"
	    },
	    defaultPlateTemplateId: "96-well-plate",
	};
	
	this.fetchConfiguration = function() {
	    return Promise.resolve(defaultConfiguration);
	};
    }]);
