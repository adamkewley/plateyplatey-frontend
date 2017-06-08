webpackJsonp([0],{

/***/ 374:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_PlateyComponent__ = __webpack_require__(379);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_PlateyAPI__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_forms__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__directives_UiCommand__ = __webpack_require__(380);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__directives_UiKeyup__ = __webpack_require__(381);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_PlateComponent__ = __webpack_require__(378);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};









let AppModule = class AppModule {
};
AppModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* NgModule */])({
        imports: [__WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__["a" /* BrowserModule */], __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* HttpModule */], __WEBPACK_IMPORTED_MODULE_5__angular_forms__["a" /* FormsModule */]],
        declarations: [__WEBPACK_IMPORTED_MODULE_3__components_PlateyComponent__["a" /* PlateyComponent */], __WEBPACK_IMPORTED_MODULE_6__directives_UiCommand__["a" /* UiCommand */], __WEBPACK_IMPORTED_MODULE_7__directives_UiKeyup__["a" /* UiKeyup */], __WEBPACK_IMPORTED_MODULE_8__components_PlateComponent__["a" /* PlateComponent */]],
        providers: [__WEBPACK_IMPORTED_MODULE_4__services_PlateyAPI__["a" /* PlateyAPI */]],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_3__components_PlateyComponent__["a" /* PlateyComponent */]]
    })
], AppModule);



/***/ }),

/***/ 375:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class BodyClickHandler {
    constructor(commands, currentDocument) {
        this._commands = commands;
        this._currentDocument = currentDocument;
    }
    handler(e) {
        const sourceElement = e.target.tagName.toLowerCase();
        const sourceHandledByStandardHtmlElement = BodyClickHandler.sourcesWithClickHandlers.indexOf(sourceElement) !== -1;
        if (sourceHandledByStandardHtmlElement)
            return;
        else {
            const currentDocument = this._currentDocument.getValue();
            if (currentDocument !== null) {
                currentDocument.deSelectRowsById(currentDocument.getSelectedRowIds());
            }
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BodyClickHandler;

BodyClickHandler.sourcesWithClickHandlers = ["button", "input", "td", "th", "circle", "text", "circle", "option", "select"];


/***/ }),

/***/ 376:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class BodyKepressHandler {
    constructor(keybinds, currentDocument) {
        this._keybinds = keybinds;
        this._currentDocument = currentDocument;
    }
    handler(e) {
        const inputIsFocused = document.activeElement.tagName.toLowerCase() === "input";
        if (inputIsFocused)
            return;
        else if (e.which !== 0 && !e.ctrlKey) {
            // The current focus could be a button, pressing a key while
            // focused on a button can result in navigation.
            if (document.activeElement.blur !== undefined)
                document.activeElement.blur();
            const charCode = e.charCode;
            const char = String.fromCharCode(charCode);
            const currentDocument = this._currentDocument.getValue();
            if (currentDocument !== null) {
                const currentValue = currentDocument.getCurrentSelectionValue();
                const newValue = currentValue + char;
                currentDocument.setValueOfSelectionTo(newValue);
                e.stopPropagation();
                e.preventDefault();
            }
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BodyKepressHandler;



/***/ }),

/***/ 377:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Helpers__ = __webpack_require__(4);

class BodyKeydownHandler {
    constructor(keybinds, scriptExecutor, currentDocument, commands) {
        this._keybinds = keybinds;
        this._scriptExecutor = scriptExecutor;
        this._currentDocument = currentDocument;
        this._allCommands = commands;
    }
    handler(e) {
        if (e.target.tagName.toLowerCase() === "input")
            return;
        const keypressIdentifier = __WEBPACK_IMPORTED_MODULE_0__Helpers__["a" /* Helpers */].eventToKeybindKey(e);
        const commandIdentifier = this._keybinds[keypressIdentifier];
        if (commandIdentifier !== undefined) {
            this._scriptExecutor(commandIdentifier, this._allCommands.commandsHash, { e: e });
            e.stopPropagation();
            e.preventDefault();
        }
        // Prevent the backspace key from navigating back. This must be
        // handled in the keyDown handler because IE11 will navigate
        // backwards in its history before the keyPress handler gets a
        // chance to call.
        const currentDocument = this._currentDocument.getValue();
        if (e.keyCode === 8 && currentDocument !== null) {
            const currentValue = currentDocument.getCurrentSelectionValue();
            const len = currentValue.length;
            const newValue = currentValue.substring(0, len - 1);
            currentDocument.setValueOfSelectionTo(newValue);
            e.stopPropagation();
            e.preventDefault();
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BodyKeydownHandler;



/***/ }),

/***/ 378:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_document_PlateyDocument__ = __webpack_require__(82);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PlateComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


let PlateComponent = class PlateComponent {
    get plateVbox() {
        if (this.document !== null) {
            return `0 0 ${this.document.gridWidth} ${this.document.gridHeight}`;
        }
        else
            return null;
    }
};
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["L" /* Input */])(),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1__core_document_PlateyDocument__["a" /* PlateyDocument */])
], PlateComponent.prototype, "document", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["L" /* Input */])(),
    __metadata("design:type", Object)
], PlateComponent.prototype, "commands", void 0);
PlateComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["X" /* Component */])({
        selector: "plate",
        templateUrl: "plate.html"
    })
], PlateComponent);



/***/ }),

/***/ 379:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_PlateyAPI__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_PlateyApp__ = __webpack_require__(383);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_AppCommands__ = __webpack_require__(382);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_PlateyCommandController__ = __webpack_require__(384);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__BodyKeydownHandler__ = __webpack_require__(377);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__BodyKepressHandler__ = __webpack_require__(376);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__BodyClickHandler__ = __webpack_require__(375);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PlateyComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









let PlateyComponent = class PlateyComponent {
    constructor(plateyAPI) {
        this.plateyAPI = plateyAPI;
        this.currentValue = "";
        this.currentPlateTemplateSummary = null;
        this.plateTemplateSummaries = [];
        this.document = null;
        // To boot the app, the configuration and plate summaries
        // must be loaded. The configuration contains a reference to
        // the default document.
        const configurationPromise = plateyAPI.fetchConfiguration();
        const platesPromise = plateyAPI.fetchPlateTemplateSummaries();
        __WEBPACK_IMPORTED_MODULE_5_rxjs__["Observable"]
            .forkJoin(configurationPromise, platesPromise)
            .subscribe(responses => {
            const appConfiguration = responses[0];
            const plates = responses[1];
            plateyAPI.fetchDocument(appConfiguration.defaultDocumentId).subscribe(defaultDocument => {
                this.bootApplication(appConfiguration, defaultDocument, plates);
            });
        });
    }
    loadPlateSummary(plateSummary) {
        this.currentPlateTemplateSummary = plateSummary;
        if (this.document !== null) {
            this.plateyAPI
                .fetchPlateTemplateById(plateSummary.id)
                .subscribe((plateTemplateDetails) => {
                if (this.document !== null)
                    this.document.setLayout(plateTemplateDetails);
            });
        }
    }
    bootApplication(config, defaultDocument, plates) {
        const plateyApp = new __WEBPACK_IMPORTED_MODULE_2__core_PlateyApp__["a" /* PlateyApp */](config, defaultDocument);
        plateyApp.currentDocument.subscribe(newDocument => this.document = newDocument);
        const nativeCommands = new __WEBPACK_IMPORTED_MODULE_3__core_AppCommands__["a" /* AppCommands */](plateyApp);
        this.commands = nativeCommands.commandsHash;
        this.commandFunctions = {};
        Object.keys(nativeCommands.commandsHash).forEach(key => {
            const executeFunction = nativeCommands.commandsHash[key].execute;
            if (this.commandFunctions === null || this.commandFunctions === undefined)
                this.commandFunctions = {};
            this.commandFunctions[key] = executeFunction;
        });
        const commandController = new __WEBPACK_IMPORTED_MODULE_4__core_PlateyCommandController__["a" /* PlateyCommandController */]();
        this.getCommandDetails = nativeCommands.getCommandById.bind(nativeCommands);
        const exec = commandController.executePlateyExpression.bind(commandController);
        this.exec = exec;
        commandController.afterExecPlateyExpression.subscribe((cmdName) => console.log(cmdName));
        let documentEventSubscriptions = [];
        plateyApp.currentDocument.subscribe((newDocument) => {
            documentEventSubscriptions.forEach(subscription => subscription.unsubscribe());
            documentEventSubscriptions = [];
            this.document = newDocument;
            if (newDocument !== null) {
                if (newDocument.selectedColumn === null && newDocument.columns.length > 0) {
                    newDocument.selectColumn(newDocument.columns[0].id);
                }
                documentEventSubscriptions.push(newDocument.afterColumnAdded.subscribe((columnId) => {
                    newDocument.selectColumn(columnId);
                }));
                documentEventSubscriptions.push(newDocument.afterSelectingRows.subscribe(() => {
                    this.currentValue = newDocument.getCurrentSelectionValue();
                }));
                documentEventSubscriptions.push(newDocument.afterLayoutChanged.subscribe(() => {
                    const columnIds = newDocument.getColumnIds();
                    if (columnIds.length === 0) {
                        const newColumn = newDocument.addColumn();
                        newDocument.selectColumn(newColumn);
                        const rows = newDocument.getRowIds();
                        const firstRow = rows[0];
                        newDocument.focusRow(firstRow);
                    }
                }));
            }
        });
        this.bodyKeydownHandler = new __WEBPACK_IMPORTED_MODULE_6__BodyKeydownHandler__["a" /* BodyKeydownHandler */](plateyApp.getKeybinds(), exec, plateyApp.currentDocument, nativeCommands);
        // Keypress happens before keydown
        this.bodyKeypressHandler = new __WEBPACK_IMPORTED_MODULE_7__BodyKepressHandler__["a" /* BodyKepressHandler */](plateyApp.getKeybinds(), plateyApp.currentDocument);
        const bodyClickEventHandler = new __WEBPACK_IMPORTED_MODULE_8__BodyClickHandler__["a" /* BodyClickHandler */](nativeCommands, plateyApp.currentDocument);
        this.bodyClickEventHandler = bodyClickEventHandler.handler.bind(bodyClickEventHandler);
        // Initialize plates
        const plateTemplates = plates;
        this.plateTemplateSummaries = Object.keys(plateTemplates).map(key => plateTemplates[key]);
        this.getKeybindsAssociatedWith = (expr) => {
            const currentKeybinds = plateyApp.getKeybinds();
            return Object.keys(currentKeybinds)
                .filter(key => {
                const keyboundCommandId = currentKeybinds[key];
                return keyboundCommandId === expr;
            });
        };
        plateyApp.newDocument();
    }
    handleKeypress(e) {
        this.bodyKeypressHandler.handler(e);
    }
    handleKeydown(e) {
        this.bodyKeydownHandler.handler(e);
    }
};
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Y" /* HostListener */])("document:keypress", ["$event"]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [KeyboardEvent]),
    __metadata("design:returntype", void 0)
], PlateyComponent.prototype, "handleKeypress", null);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Y" /* HostListener */])("document:keydown", ["$event"]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [KeyboardEvent]),
    __metadata("design:returntype", void 0)
], PlateyComponent.prototype, "handleKeydown", null);
PlateyComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["X" /* Component */])({
        selector: 'plateyApp',
        templateUrl: "mainUI.html",
        providers: [__WEBPACK_IMPORTED_MODULE_1__services_PlateyAPI__["a" /* PlateyAPI */]]
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__services_PlateyAPI__["a" /* PlateyAPI */]])
], PlateyComponent);



/***/ }),

/***/ 380:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(11);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UiCommand; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

let UiCommand = class UiCommand {
    constructor(el) {
        this.el = el;
        this.commandArguments = null;
    }
    ngOnInit() {
        this.el.nativeElement.title = this.command.description;
        this.command.disabledSubject.subscribe((disabledState) => {
            if (disabledState.isDisabled) {
                this.el.nativeElement.disabled = true;
                this.el.nativeElement.title = disabledState.reason;
            }
            else {
                this.el.nativeElement.disabled = false;
                this.el.nativeElement.title = this.command.description;
            }
        });
    }
    onClick(e) {
        if (this.commandArguments === null) {
            this.command.execute(e);
        }
        else if (this.commandArguments instanceof Array) {
            this.command.execute(e, ...this.commandArguments);
        }
        else {
            this.command.execute(e, this.commandArguments);
        }
    }
};
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["L" /* Input */])(),
    __metadata("design:type", Object)
], UiCommand.prototype, "command", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["L" /* Input */])(),
    __metadata("design:type", Object)
], UiCommand.prototype, "commandArguments", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Y" /* HostListener */])("click", ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UiCommand.prototype, "onClick", null);
UiCommand = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Directive */])({ selector: "[command]" }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["J" /* ElementRef */]])
], UiCommand);



/***/ }),

/***/ 381:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(11);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UiKeyup; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

let UiKeyup = class UiKeyup {
    constructor(el) {
        this.el = el;
        this.keyupArguments = null;
    }
    ngOnInit() {
        this.el.nativeElement.title = this.keyup.description;
        this.keyup.disabledSubject.subscribe((disabledState) => {
            if (disabledState.isDisabled) {
                this.el.nativeElement.disabled = true;
                this.el.nativeElement.title = disabledState.reason;
            }
            else {
                this.el.nativeElement.disabled = false;
                this.el.nativeElement.title = this.keyup.description;
            }
        });
    }
    onClick(e) {
        if (this.keyupArguments === null) {
            this.keyup.execute(e);
        }
        else if (this.keyupArguments instanceof Array) {
            this.keyup.execute(e, ...this.keyupArguments);
        }
        else {
            this.keyup.execute(e, this.keyupArguments);
        }
    }
};
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["L" /* Input */])(),
    __metadata("design:type", Object)
], UiKeyup.prototype, "keyup", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["L" /* Input */])(),
    __metadata("design:type", Object)
], UiKeyup.prototype, "keyupArguments", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Y" /* HostListener */])("keyup", ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UiKeyup.prototype, "onClick", null);
UiKeyup = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Directive */])({ selector: "[keyup]" }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["J" /* ElementRef */]])
], UiKeyup);



/***/ }),

/***/ 382:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__commands_NewPlateCommand__ = __webpack_require__(402);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__commands_ClearPlateCommand__ = __webpack_require__(386);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__commands_InvertSelectionCommand__ = __webpack_require__(395);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__commands_MoveSelectedColumnLeftCommand__ = __webpack_require__(400);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__commands_MoveSelectedColumnRightCommand__ = __webpack_require__(401);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__commands_ExportTableToCSVCommand__ = __webpack_require__(391);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__commands_CopyTableToClipboardCommand__ = __webpack_require__(390);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__commands_AddColumnCommand__ = __webpack_require__(385);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__commands_ClearSelectionCommand__ = __webpack_require__(388);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__commands_SelectAllCommand__ = __webpack_require__(408);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__commands_MoveColumnSelectionLeftCommand__ = __webpack_require__(396);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__commands_MoveColumnSelectionRightCommand__ = __webpack_require__(397);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__commands_MoveRowFocusDownCommand__ = __webpack_require__(398);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__commands_MoveRowFocusUpCommand__ = __webpack_require__(399);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__commands_ClearValuesInCurrentSelectionCommand__ = __webpack_require__(389);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__commands_ClearRowSelectionCommand__ = __webpack_require__(387);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__commands_RemoveColumnCommand__ = __webpack_require__(406);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__commands_SelectRowById__ = __webpack_require__(410);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__commands_SelectRows__ = __webpack_require__(411);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__commands_SelectColumnCommand__ = __webpack_require__(409);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__commands_FocusRowCommand__ = __webpack_require__(392);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__commands_HoverOverRowCommand__ = __webpack_require__(393);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__commands_ObjectAccessor__ = __webpack_require__(403);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__commands_SetValueOfSelectedWells__ = __webpack_require__(412);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__commands_PromptUserForFileCommand__ = __webpack_require__(404);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__commands_PromptUserForFilesCommand__ = __webpack_require__(405);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__commands_ImportCSVFileCommand__ = __webpack_require__(394);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__commands_RemoveSelectedColumnCommand__ = __webpack_require__(407);




























class AppCommands {
    constructor(app) {
        this._commands = [
            new __WEBPACK_IMPORTED_MODULE_0__commands_NewPlateCommand__["a" /* NewPlateCommand */](app),
            new __WEBPACK_IMPORTED_MODULE_1__commands_ClearPlateCommand__["a" /* ClearPlateCommand */](app.currentDocument),
            new __WEBPACK_IMPORTED_MODULE_2__commands_InvertSelectionCommand__["a" /* InvertSelectionCommand */](app.currentDocument),
            new __WEBPACK_IMPORTED_MODULE_3__commands_MoveSelectedColumnLeftCommand__["a" /* MoveSelectedColumnLeftCommand */](app.currentDocument),
            new __WEBPACK_IMPORTED_MODULE_4__commands_MoveSelectedColumnRightCommand__["a" /* MoveSelectedColumnRightCommand */](app.currentDocument),
            new __WEBPACK_IMPORTED_MODULE_5__commands_ExportTableToCSVCommand__["a" /* ExportTableToCSVCommand */](app.currentDocument),
            new __WEBPACK_IMPORTED_MODULE_6__commands_CopyTableToClipboardCommand__["a" /* CopyTableToClipboardCommand */](app.currentDocument),
            new __WEBPACK_IMPORTED_MODULE_7__commands_AddColumnCommand__["a" /* AddColumnCommand */](app.currentDocument),
            new __WEBPACK_IMPORTED_MODULE_8__commands_ClearSelectionCommand__["a" /* ClearSelectionCommand */](app.currentDocument),
            new __WEBPACK_IMPORTED_MODULE_9__commands_SelectAllCommand__["a" /* SelectAllCommand */](app.currentDocument),
            new __WEBPACK_IMPORTED_MODULE_10__commands_MoveColumnSelectionLeftCommand__["a" /* MoveColumnSelectionLeftCommand */](app.currentDocument),
            new __WEBPACK_IMPORTED_MODULE_11__commands_MoveColumnSelectionRightCommand__["a" /* MoveColumnSelectionRightCommand */](app.currentDocument),
            new __WEBPACK_IMPORTED_MODULE_12__commands_MoveRowFocusDownCommand__["a" /* MoveRowFocusDownCommand */](app.currentDocument),
            new __WEBPACK_IMPORTED_MODULE_13__commands_MoveRowFocusUpCommand__["a" /* MoveRowFocusUpCommand */](app.currentDocument),
            new __WEBPACK_IMPORTED_MODULE_14__commands_ClearValuesInCurrentSelectionCommand__["a" /* ClearValuesInCurrentSelectionCommand */](app.currentDocument),
            new __WEBPACK_IMPORTED_MODULE_15__commands_ClearRowSelectionCommand__["a" /* ClearRowSelectionCommand */](app.currentDocument),
            new __WEBPACK_IMPORTED_MODULE_16__commands_RemoveColumnCommand__["a" /* RemoveColumnCommand */](app.currentDocument),
            new __WEBPACK_IMPORTED_MODULE_17__commands_SelectRowById__["a" /* SelectRowById */](app.currentDocument),
            new __WEBPACK_IMPORTED_MODULE_18__commands_SelectRows__["a" /* SelectRows */](app.currentDocument),
            new __WEBPACK_IMPORTED_MODULE_19__commands_SelectColumnCommand__["a" /* SelectColumnCommand */](app.currentDocument),
            new __WEBPACK_IMPORTED_MODULE_20__commands_FocusRowCommand__["a" /* FocusRowCommand */](app.currentDocument),
            new __WEBPACK_IMPORTED_MODULE_21__commands_HoverOverRowCommand__["a" /* HoverOverRowCommand */](app.currentDocument),
            new __WEBPACK_IMPORTED_MODULE_22__commands_ObjectAccessor__["a" /* ObjectAccessor */](),
            new __WEBPACK_IMPORTED_MODULE_23__commands_SetValueOfSelectedWells__["a" /* SetValueOfSelectedWells */](app.currentDocument),
            new __WEBPACK_IMPORTED_MODULE_24__commands_PromptUserForFileCommand__["a" /* PromptUserForFileCommand */](),
            new __WEBPACK_IMPORTED_MODULE_25__commands_PromptUserForFilesCommand__["a" /* PromptUserForFilesCommand */](),
            new __WEBPACK_IMPORTED_MODULE_26__commands_ImportCSVFileCommand__["a" /* ImportCSVFileCommand */](app),
            new __WEBPACK_IMPORTED_MODULE_27__commands_RemoveSelectedColumnCommand__["a" /* RemoveSelectedColumnCommand */](app.currentDocument),
        ];
        this.commandsHash = {};
        this._commands.forEach(cmd => this.commandsHash[cmd.id] = cmd);
    }
    getCommandById(id) {
        const command = this._commands.find(command => command.id === id);
        return command === undefined ? null : command;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AppCommands;



/***/ }),

/***/ 383:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__document_PlateyDocument__ = __webpack_require__(82);


class PlateyApp {
    constructor(configuration, defaultDocument) {
        this.currentDocument = new __WEBPACK_IMPORTED_MODULE_0_rxjs__["BehaviorSubject"](null);
        this._configuration = configuration;
        this._defaultDocument = defaultDocument;
    }
    newDocument() {
        const document = __WEBPACK_IMPORTED_MODULE_1__document_PlateyDocument__["a" /* PlateyDocument */].fromPlateyDocumentFile(this._defaultDocument);
        this.currentDocument.next(document);
        return document;
    }
    getKeybinds() {
        return this._configuration.keybinds;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PlateyApp;



/***/ }),

/***/ 384:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scripting_PlateyScript__ = __webpack_require__(415);


class PlateyCommandController {
    constructor() {
        this.afterExecPlateyExpression = new __WEBPACK_IMPORTED_MODULE_0_rxjs__["Subject"]();
    }
    executePlateyExpression(plateyExpression, ...scopes) {
        __WEBPACK_IMPORTED_MODULE_1__scripting_PlateyScript__["a" /* PlateyScript */].eval(plateyExpression, ...scopes);
        this.afterExecPlateyExpression.next(plateyExpression);
    }
    ;
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PlateyCommandController;



/***/ }),

/***/ 385:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Helpers__ = __webpack_require__(4);

class AddColumnCommand {
    constructor(currentDocument) {
        this.id = "add-column";
        this.title = "Add Column";
        this.description = "Add a column to the table";
        this._currentDocument = currentDocument;
        this.disabledSubject = __WEBPACK_IMPORTED_MODULE_0__Helpers__["a" /* Helpers */].disabledIfNull(currentDocument);
    }
    execute() {
        const currentDocument = this._currentDocument.getValue();
        if (currentDocument !== null)
            currentDocument.addColumn();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AddColumnCommand;



/***/ }),

/***/ 386:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Helpers__ = __webpack_require__(4);

class ClearPlateCommand {
    constructor(currentDocument) {
        this.id = "clear-plate";
        this.title = "Clear Plate";
        this.description = "Clear the plate of data, leaving the columns intact.";
        this._currentDocument = currentDocument;
        this.disabledSubject = __WEBPACK_IMPORTED_MODULE_0__Helpers__["a" /* Helpers */].disabledIfNull(currentDocument);
    }
    execute() {
        const currentDocument = this._currentDocument.getValue();
        if (currentDocument !== null) {
            const columnIds = currentDocument.getColumnIds();
            columnIds.forEach((columnId) => currentDocument.clearDataInColumn(columnId));
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ClearPlateCommand;



/***/ }),

/***/ 387:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Helpers__ = __webpack_require__(4);

class ClearRowSelectionCommand {
    constructor(currentDocument) {
        this.id = "clear-row-selection";
        this.title = "Clear Row Selection";
        this.description = "Clear the current row selection, leaving the column selection intact.";
        this._currentDocument = currentDocument;
        this.disabledSubject = __WEBPACK_IMPORTED_MODULE_0__Helpers__["a" /* Helpers */].disabledIfNull(currentDocument);
    }
    execute() {
        const document = this._currentDocument.getValue();
        if (document !== null) {
            const selectedRows = document.getSelectedRowIds();
            document.deSelectRowsById(selectedRows);
            document.focusRow(null);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ClearRowSelectionCommand;



/***/ }),

/***/ 388:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Helpers__ = __webpack_require__(4);

class ClearSelectionCommand {
    constructor(currentDocument) {
        this.id = "clear-selection";
        this.title = "Clear Selection";
        this.description = "Clear the current row and column selection";
        this._currentDocument = currentDocument;
        this.disabledSubject = __WEBPACK_IMPORTED_MODULE_0__Helpers__["a" /* Helpers */].disabledIfNull(currentDocument);
    }
    execute() {
        const currentDocument = this._currentDocument.getValue();
        if (currentDocument !== null) {
            currentDocument.selectColumn(null);
            const selectedRowIds = currentDocument.getSelectedRowIds();
            currentDocument.deSelectRowsById(selectedRowIds);
            currentDocument.focusRow(null);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ClearSelectionCommand;



/***/ }),

/***/ 389:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Helpers__ = __webpack_require__(4);

class ClearValuesInCurrentSelectionCommand {
    constructor(currentDocument) {
        this.id = "clear-values-in-current-selection";
        this.title = "Clear Values in Current Selection";
        this.description = "Clear the values within the current selection.";
        this._currentDocument = currentDocument;
        this.disabledSubject = __WEBPACK_IMPORTED_MODULE_0__Helpers__["a" /* Helpers */].disabledIfNull(currentDocument);
    }
    execute() {
        const currentDocument = this._currentDocument.getValue();
        if (currentDocument !== null) {
            const selectedColumn = currentDocument.getSelectedColumnId();
            const selectedRows = currentDocument.getSelectedRowIds();
            if (selectedColumn !== null && selectedRows.length > 0) {
                currentDocument.assignValueToCells(selectedColumn, selectedRows, "");
            }
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ClearValuesInCurrentSelectionCommand;



/***/ }),

/***/ 390:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Helpers__ = __webpack_require__(4);

class CopyTableToClipboardCommand {
    constructor(currentDocument) {
        this.id = "copy-table-to-clipboard";
        this.title = "Copy Table to Clipboard";
        this.description = "Copy the table to the clipboard as a tab-separated text block.";
        this._currentDocument = currentDocument;
        this.disabledSubject = __WEBPACK_IMPORTED_MODULE_0__Helpers__["a" /* Helpers */].disabledIfNull(currentDocument);
    }
    execute() {
        const currentDocument = this._currentDocument.getValue();
        if (currentDocument !== null) {
            const columnSeparator = "\t";
            const rowSeparator = "\n";
            const columnIds = currentDocument.getColumnIds();
            const tableHeaders = ["Well ID"].concat(columnIds.map((columnId) => currentDocument.getColumnHeader(columnId)));
            const tableData = currentDocument.getTableData();
            const entireTable = [tableHeaders].concat(tableData);
            const tsvData = entireTable.map(row => row.join(columnSeparator)).join(rowSeparator);
            __WEBPACK_IMPORTED_MODULE_0__Helpers__["a" /* Helpers */].copyTextToClipboard(tsvData);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CopyTableToClipboardCommand;



/***/ }),

/***/ 391:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_papaparse__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_papaparse___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_papaparse__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Helpers__ = __webpack_require__(4);


class ExportTableToCSVCommand {
    constructor(currentDocument) {
        this.id = "export-table-to-csv";
        this.title = "Export Table to CSV";
        this.description = "Export the current content of the table as a downloadable CSV file.";
        this._currentDocument = currentDocument;
        this.disabledSubject = __WEBPACK_IMPORTED_MODULE_1__Helpers__["a" /* Helpers */].disabledIfNull(currentDocument);
    }
    execute() {
        const currentDocument = this._currentDocument.getValue();
        if (currentDocument !== null) {
            const columnIds = currentDocument.getColumnIds();
            const tableHeaders = ["Well ID"].concat(columnIds.map(columnId => currentDocument.getColumnHeader(columnId)));
            const tableData = currentDocument.getTableData();
            const entireTable = [tableHeaders].concat(tableData);
            const csvData = __WEBPACK_IMPORTED_MODULE_0_papaparse___default.a.unparse(entireTable);
            __WEBPACK_IMPORTED_MODULE_1__Helpers__["a" /* Helpers */].promptUserToSaveData("platey-export.csv", "text/csv;charset=utf-8;", csvData);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ExportTableToCSVCommand;



/***/ }),

/***/ 392:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Helpers__ = __webpack_require__(4);

class FocusRowCommand {
    constructor(currentDocument) {
        this.id = "focus-row";
        this.title = "Focus Row";
        this.description = "Focus on a row";
        this._currentDocument = currentDocument;
        this.disabledSubject = __WEBPACK_IMPORTED_MODULE_0__Helpers__["a" /* Helpers */].disabledIfNull(currentDocument);
    }
    execute(e, id) {
        const currentDocument = this._currentDocument.getValue();
        if (currentDocument !== null) {
            if (!e.shiftKey) {
                // clear selection before focusing
                const selectedRowIds = currentDocument.getSelectedRowIds();
                currentDocument.deSelectRowsById(selectedRowIds);
            }
            currentDocument.focusRow(id);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = FocusRowCommand;



/***/ }),

/***/ 393:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Helpers__ = __webpack_require__(4);

class HoverOverRowCommand {
    constructor(currentDocument) {
        this.id = "hover-over-row";
        this.title = "Hover over row";
        this.description = "Hover over a row in the data.";
        this._currentDocument = currentDocument;
        this.disabledSubject = __WEBPACK_IMPORTED_MODULE_0__Helpers__["a" /* Helpers */].disabledIfNull(currentDocument);
    }
    execute(e, well) {
        const currentDocument = this._currentDocument.getValue();
        if (currentDocument !== null) {
            currentDocument.hoverOverWell(well);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = HoverOverRowCommand;



/***/ }),

/***/ 394:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_papaparse__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_papaparse___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_papaparse__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Helpers__ = __webpack_require__(4);


class ImportCSVFileCommand {
    constructor(app) {
        this.id = "import-csv-file";
        this.title = "Import CSV File";
        this.description = "Import a CSV file into the main table.";
        this._app = app;
        this.disabledSubject = __WEBPACK_IMPORTED_MODULE_1__Helpers__["a" /* Helpers */].disabledIfNull(app.currentDocument);
    }
    execute() {
        __WEBPACK_IMPORTED_MODULE_1__Helpers__["a" /* Helpers */].promptUserForFile("text/csv")
            .then(__WEBPACK_IMPORTED_MODULE_1__Helpers__["a" /* Helpers */].readFileAsText)
            .then((text) => {
            const tableData = __WEBPACK_IMPORTED_MODULE_0_papaparse___default.a.parse(text).data;
            const headerRow = tableData[0];
            const dataRows = tableData.slice(1);
            const longestRow = tableData.reduce((maxLen, row) => Math.max(maxLen, row.length), 0);
            const document = this._app.newDocument();
            const columns = [];
            for (var i = 0; i < longestRow; i++) {
                const header = headerRow[i];
                const hasHeader = header !== undefined;
                const column = document.addColumn();
                if (hasHeader)
                    document.setColumnHeader(header, column);
                columns.push(column);
            }
            const rowIds = document.getRowIds();
            rowIds.forEach((rowId, rowIdx) => {
                const row = dataRows[rowIdx];
                columns.forEach((columnId, columnIdx) => {
                    const val = row[columnIdx];
                    document.assignValueToCells(columnId, [rowId], val);
                });
            });
        })
            .catch((err) => console.log(err));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ImportCSVFileCommand;



/***/ }),

/***/ 395:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__);

class InvertSelectionCommand {
    constructor(currentDocument) {
        this.id = "invert-selection";
        this.title = "Invert Selection";
        this.description = "Invert the current selection, which de-selects anything that is currently selected and selects anything that is not currently selected.";
        this._currentDocument = currentDocument;
        this.disabledSubject = new __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__["BehaviorSubject"]({ isDisabled: true, reason: "Not yet initialized" });
        currentDocument
            .map(maybeDocument => {
            if (maybeDocument === null)
                return __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__["Observable"].of({ isDisabled: true, reason: "No document open" });
            else {
                const calculateDisabledState = () => {
                    if (maybeDocument.getSelectedRowIds().length === 0)
                        return { isDisabled: true, reason: "Nothing selected " };
                    else
                        return { isDisabled: false };
                };
                const ret = new __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__["BehaviorSubject"](calculateDisabledState());
                maybeDocument.afterRowSelectionChanged.subscribe(_ => ret.next(calculateDisabledState()));
                return ret;
            }
        })
            .switch()
            .subscribe(disabledState => this.disabledSubject.next(disabledState));
    }
    execute() {
        const currentDocument = this._currentDocument.getValue();
        if (currentDocument !== null) {
            const allRows = currentDocument.getRowIds();
            const selectedRows = currentDocument.getSelectedRowIds();
            const notSelectedRows = allRows.filter((rowId) => selectedRows.indexOf(rowId) === -1);
            currentDocument.selectRowsById(notSelectedRows);
            currentDocument.deSelectRowsById(selectedRows);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = InvertSelectionCommand;



/***/ }),

/***/ 396:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Helpers__ = __webpack_require__(4);

class MoveColumnSelectionLeftCommand {
    constructor(currentDocument) {
        this.id = "move-column-selection-left";
        this.title = "Move Column Selection Left";
        this.description = "Move the column selection left";
        this._currentDocument = currentDocument;
        this.id = "move-column-selection-left";
        this.title = "Move Column Selection Left";
        this.description = "Move the column selection left";
        this.disabledSubject = __WEBPACK_IMPORTED_MODULE_0__Helpers__["a" /* Helpers */].disabledIfNull(currentDocument);
    }
    execute() {
        const currentDocument = this._currentDocument.getValue();
        if (currentDocument !== null) {
            const currentColumnSelection = currentDocument.getSelectedColumnId();
            if (currentColumnSelection !== null) {
                const columns = currentDocument.getColumnIds();
                const selectionIndex = columns.indexOf(currentColumnSelection);
                if (currentColumnSelection !== null && selectionIndex !== 0) {
                    const newColumnSelection = columns[selectionIndex - 1];
                    currentDocument.selectColumn(newColumnSelection);
                }
            }
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MoveColumnSelectionLeftCommand;



/***/ }),

/***/ 397:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Helpers__ = __webpack_require__(4);

class MoveColumnSelectionRightCommand {
    constructor(currentDocument) {
        this.id = "move-column-selection-right";
        this.title = "Move Column Selection Right";
        this.description = "Select the column right of the currently selected column.";
        this._currentDocument = currentDocument;
        this.disabledSubject = __WEBPACK_IMPORTED_MODULE_0__Helpers__["a" /* Helpers */].disabledIfNull(currentDocument);
    }
    execute() {
        const currentDocument = this._currentDocument.getValue();
        if (currentDocument !== null) {
            const currentColumnSelection = currentDocument.getSelectedColumnId();
            if (currentColumnSelection !== null) {
                const columns = currentDocument.getColumnIds();
                const selectionIndex = columns.indexOf(currentColumnSelection);
                if (currentColumnSelection !== null && selectionIndex !== (columns.length - 1)) {
                    const newColumnSelection = columns[selectionIndex + 1];
                    currentDocument.selectColumn(newColumnSelection);
                }
            }
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MoveColumnSelectionRightCommand;



/***/ }),

/***/ 398:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Helpers__ = __webpack_require__(4);

class MoveRowFocusDownCommand {
    constructor(currentDocument) {
        this.id = "move-row-focus-down";
        this.title = "Move Row Focus Down";
        this.description = "Focus the row immediately beneath the currently focused row.";
        this._currentDocument = currentDocument;
        this.disabledSubject = __WEBPACK_IMPORTED_MODULE_0__Helpers__["a" /* Helpers */].disabledIfNull(currentDocument);
    }
    execute(e) {
        const currentDocument = this._currentDocument.getValue();
        if (currentDocument !== null) {
            if (!e.shiftKey) {
                // clear selection before focusing
                const selectedRowIds = currentDocument.getSelectedRowIds();
                currentDocument.deSelectRowsById(selectedRowIds);
            }
            const focusedRowId = currentDocument.getFocusedRowId();
            if (focusedRowId !== null) {
                const allRowIds = currentDocument.getRowIds();
                const focusedRowIdx = allRowIds.indexOf(focusedRowId);
                if (focusedRowId !== null && focusedRowIdx !== (allRowIds.length - 1)) {
                    const rowIdToFocus = allRowIds[focusedRowIdx + 1];
                    currentDocument.focusRow(rowIdToFocus);
                }
            }
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MoveRowFocusDownCommand;



/***/ }),

/***/ 399:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Helpers__ = __webpack_require__(4);

class MoveRowFocusUpCommand {
    constructor(currentDocument) {
        this.id = "move-row-focus-up";
        this.title = "Move Row Focus Up";
        this.description = "Move the row focus up.";
        this._currentDocument = currentDocument;
        this.disabledSubject = __WEBPACK_IMPORTED_MODULE_0__Helpers__["a" /* Helpers */].disabledIfNull(currentDocument);
    }
    execute(e) {
        const currentDocument = this._currentDocument.getValue();
        if (currentDocument !== null) {
            if (!e.shiftKey) {
                // clear selection before focusing
                const selectedRowIds = currentDocument.getSelectedRowIds();
                currentDocument.deSelectRowsById(selectedRowIds);
            }
            const focusedRowId = currentDocument.getFocusedRowId();
            if (focusedRowId !== null) {
                const allRowIds = currentDocument.getRowIds();
                const focusedRowIdx = allRowIds.indexOf(focusedRowId);
                if (focusedRowId !== null && focusedRowIdx !== 0) {
                    const rowIdToFocus = allRowIds[focusedRowIdx - 1];
                    currentDocument.focusRow(rowIdToFocus);
                }
            }
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MoveRowFocusUpCommand;



/***/ }),

/***/ 4:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs__);

class Helpers {
    static shuffle(a) {
        var j, x, i;
        for (i = a.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
        return a;
    }
    static moveItemInArray(array, old_index, new_index) {
        array.splice(new_index, 0, array.splice(old_index, 1)[0]);
        return array; // for testing purposes
    }
    static generateGuid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
    static eventToKeybindKey($event) {
        let modifiers = "";
        if ($event.ctrlKey)
            modifiers += "C-";
        if ($event.altKey)
            modifiers += "M-";
        const translatedKeyCode = Helpers.KEYCODES_OF_UNPRINTABLE_KEYPRESSES[$event.keyCode];
        if (translatedKeyCode === undefined)
            return modifiers + $event.key;
        else
            return modifiers + translatedKeyCode;
    }
    static promptUserToSaveData(fileName, contentType, data) {
        const blob = new Blob([data], { type: contentType });
        // If it's shitty IE
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileName);
        }
        else {
            const blobUrl = URL.createObjectURL(blob);
            const downloadLink = document.createElement("a");
            downloadLink.href = blobUrl;
            downloadLink.download = fileName;
            downloadLink.style.visibility = "hidden";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    }
    static copyTextToClipboard(text) {
        const $textElement = document.createElement("textarea");
        $textElement.style.visibility = "hidden";
        $textElement.value = text;
        document.body.appendChild($textElement);
        $textElement.select();
        document.execCommand("copy");
        document.body.removeChild($textElement);
    }
    static promptUserForFiles(mimeTypes = "", allowMultipleFiles = true) {
        return new Promise((resolve, reject) => {
            const fileInputEl = document.createElement("input");
            if (allowMultipleFiles)
                fileInputEl.multiple = true;
            fileInputEl.style.visibility = "hidden";
            fileInputEl.type = "file";
            fileInputEl.accept = mimeTypes;
            const onBodyFocus = () => {
                fileInputEl.removeEventListener("change", onChange);
                reject("User cancelled out of dialog");
            };
            const onChange = () => {
                document.removeEventListener("focus", onBodyFocus);
                if (fileInputEl.files !== null && fileInputEl.files.length === 1)
                    resolve(fileInputEl.files);
                else
                    reject("User did not select a file");
            };
            fileInputEl.addEventListener("change", onChange, false);
            document.addEventListener("focus", onBodyFocus, false);
            // Otherwise, the click will propagate upto the root click
            // handler and angular will cry
            fileInputEl.onclick = (e) => e.stopPropagation();
            document.body.appendChild(fileInputEl);
            fileInputEl.click();
            document.body.removeChild(fileInputEl);
        });
    }
    static promptUserForFile(mimeTypes = "") {
        return Helpers.promptUserForFiles(mimeTypes, false).then(files => files[0]);
    }
    static readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const textReader = new FileReader();
            textReader.onload = (e) => resolve(textReader.result);
            textReader.onerror = (e) => reject(textReader.error);
            textReader.readAsText(file);
        });
    }
    static behaviorMap(bh, f) {
        const ret = new __WEBPACK_IMPORTED_MODULE_0_rxjs__["BehaviorSubject"](f(bh.getValue()));
        const subscription = bh.subscribe(next => { ret.next(f(next)); }, err => { ret.error(err); }, () => { subscription.unsubscribe(); });
        return ret;
    }
    static disabledIfNull(bh) {
        return Helpers.behaviorMap(bh, document => {
            if (document === null) {
                return {
                    isDisabled: true,
                    reason: "No document currently open"
                };
            }
            else {
                return { isDisabled: false };
            }
        });
    }
    static generateRandomColorHexString() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    static allArrayValuesTheSame(ary) {
        for (let i = 1; i < ary.length; i++) {
            if (ary[i] !== ary[0])
                return false;
        }
        return true;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Helpers;

// These are used instead of directly using .key because a) it's
// easier to understand what's going on and b) browsers are
// inconsistient about keys (firefox: "ArrowLeft", ie: "Left")
Helpers.KEYCODES_OF_UNPRINTABLE_KEYPRESSES = {
    "8": "<backspace>",
    "9": "<tab>",
    "13": "<return>",
    "27": "<escape>",
    "33": "<prior>",
    "34": "<next>",
    "35": "<end>",
    "36": "<home>",
    "37": "<left>",
    "38": "<up>",
    "39": "<right>",
    "40": "<down>",
    "45": "<insert>",
    "46": "<delete>"
};


/***/ }),

/***/ 400:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Helpers__ = __webpack_require__(4);

class MoveSelectedColumnLeftCommand {
    constructor(currentDocument) {
        this.id = "move-selected-column-left";
        this.title = "Move Selected Column Left";
        this._currentDocument = currentDocument;
        this.disabledSubject = __WEBPACK_IMPORTED_MODULE_0__Helpers__["a" /* Helpers */].disabledIfNull(currentDocument);
        /* TODO: Implement
        applicationEvents.subscribeTo("after-column-selection-changed", updateCallback);
        applicationEvents.subscribeTo("after-table-columns-changed", updateCallback);
        */
    }
    /* TODO: Implement
    _calculateDisabled() {
      const allColumns = this._primativeCommands.getColumnIds();
      const selectedColumn = this._primativeCommands.getSelectedColumnId();
  
      if (selectedColumn === null) {
        return {
          isDisabled: true,
          hasReason: true,
          reason: "No column currently selected."
        };
      }
      else if (allColumns.indexOf(selectedColumn) === 0) {
        return {
          isDisabled: true,
          hasReason:true,
          reason: "Selected column is as leftwards as it can go.",
        };
      }
      else return { isDisabled: false };
    } */
    execute() {
        const currentDocument = this._currentDocument.getValue();
        if (currentDocument !== null) {
            const selectedColumn = currentDocument.getSelectedColumnId();
            if (selectedColumn !== null) {
                const allColumns = currentDocument.getColumnIds();
                const oldIndex = allColumns.indexOf(selectedColumn);
                const newIndex = oldIndex - 1;
                currentDocument.moveColumn(selectedColumn, newIndex);
            }
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MoveSelectedColumnLeftCommand;



/***/ }),

/***/ 401:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Helpers__ = __webpack_require__(4);

class MoveSelectedColumnRightCommand {
    constructor(currentDocument) {
        this.id = "move-selected-column-right";
        this.title = "Move Selected Column Right";
        this.description = "Move the currently selected column right.";
        this._currentDocument = currentDocument;
        this.disabledSubject = __WEBPACK_IMPORTED_MODULE_0__Helpers__["a" /* Helpers */].disabledIfNull(currentDocument);
        /* TODO: Implement
        applicationEvents.subscribeTo("after-column-selection-changed", updateCallback);
        applicationEvents.subscribeTo("after-table-columns-changed", updateCallback);
        */
    }
    /* TODO: Implement
    _calculateDisabled() {
      const allColumns = this._primativeCommands.getColumnIds();
      const selectedColumn = this._primativeCommands.getSelectedColumnId();
      const idx = allColumns.indexOf(selectedColumn);
      const len = allColumns.length;
  
      if (idx === -1) {
        return {
          isDisabled: true,
          hasReason: true,
          reason: "No column currently selected.",
        };
      } else if (idx === (len - 1)) {
        return {
          isDisabled: true,
          hasReason: true,
          reason: "Selected column is as rightwards as it can go.",
        };
      } else return { isDisabled: false };
    }
    */
    execute() {
        const currentDocument = this._currentDocument.getValue();
        if (currentDocument !== null) {
            const selectedColumn = currentDocument.getSelectedColumnId();
            if (selectedColumn !== null) {
                const allColumns = currentDocument.getColumnIds();
                const oldIndex = allColumns.indexOf(selectedColumn);
                const newIndex = oldIndex + 1;
                currentDocument.moveColumn(selectedColumn, newIndex);
            }
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MoveSelectedColumnRightCommand;



/***/ }),

/***/ 402:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__);

class NewPlateCommand {
    constructor(app) {
        this.id = "new-plate";
        this.title = "New Plate";
        this.description = "Create a new plate.";
        this._app = app;
        this.disabledSubject = new __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__["BehaviorSubject"]({ isDisabled: false });
    }
    execute() {
        this._app.newDocument();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = NewPlateCommand;



/***/ }),

/***/ 403:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__);

class ObjectAccessor {
    constructor() {
        this.id = ".";
        this.title = "Access Property";
        this.description = "Access the property of an object";
        this.disabledSubject = new __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__["BehaviorSubject"]({ isDisabled: false });
    }
    execute(e, instance, memberSymbol, args) {
        const member = instance[memberSymbol];
        if (member !== undefined && args !== undefined) {
            return member.apply(member, args);
        }
        else
            return member;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ObjectAccessor;



/***/ }),

/***/ 404:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Helpers__ = __webpack_require__(4);


class PromptUserForFileCommand {
    constructor() {
        this.id = "prompt-user-for-file";
        this.title = "Prompt User for File";
        this.description = "Prompt a user to browse for a file on their local filesystem";
        this.disabledSubject = new __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__["BehaviorSubject"]({ isDisabled: false });
    }
    execute(e, mimeTypes = "") {
        return __WEBPACK_IMPORTED_MODULE_1__Helpers__["a" /* Helpers */].promptUserForFile(mimeTypes);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PromptUserForFileCommand;



/***/ }),

/***/ 405:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Helpers__ = __webpack_require__(4);


class PromptUserForFilesCommand {
    constructor() {
        this.id = "prompt-user-for-files";
        this.title = "Prompt User for Files";
        this.description = "Prompt a user to browse for file(s) on their local filesystem";
        this.disabledSubject = new __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__["BehaviorSubject"]({ isDisabled: false });
    }
    execute(e, mimeTypes = "") {
        return __WEBPACK_IMPORTED_MODULE_1__Helpers__["a" /* Helpers */].promptUserForFiles(mimeTypes);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PromptUserForFilesCommand;



/***/ }),

/***/ 406:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__);

class RemoveColumnCommand {
    constructor(currentDocument) {
        this.id = "remove-column";
        this.title = "Remove Column";
        this.description = "Remove a column, identified by its ID, from the table";
        this.disabledSubject = new __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__["BehaviorSubject"]({ isDisabled: false });
        this._currentDocument = currentDocument;
    }
    execute(e, columnId) {
        const currentDocument = this._currentDocument.getValue();
        if (currentDocument !== null)
            currentDocument.removeColumn(columnId);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = RemoveColumnCommand;



/***/ }),

/***/ 407:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Helpers__ = __webpack_require__(4);

class RemoveSelectedColumnCommand {
    constructor(currentDocument) {
        this.id = "remove-selected-column";
        this.title = "Remove selected column";
        this.description = "Remove the currently selected column";
        this._currentDocument = currentDocument;
        this.disabledSubject = __WEBPACK_IMPORTED_MODULE_0__Helpers__["a" /* Helpers */].disabledIfNull(currentDocument);
        /* TODO: Implement
        const updateCallback = () => this.disabledSubject.next(this._calculateDisabled());
    
        applicationEvents.subscribeTo("after-column-selection-changed", updateCallback);
        applicationEvents.subscribeTo("after-table-columns-changed", updateCallback);
        */
    }
    /* TODO: Implement
    _calculateDisabled() {
      const selectedColumn = this._primativeCommands.getSelectedColumnId();
  
      if (selectedColumn === null) {
        return {
          isDisabled: true,
          hasReason: true,
          reason: "No column currently selected."
        };
      } else {
        return { isDisabled: false };
      }
    }
    */
    execute() {
        const currentDocument = this._currentDocument.getValue();
        if (currentDocument !== null) {
            const selectedColumn = currentDocument.getSelectedColumnId();
            if (selectedColumn !== null)
                currentDocument.removeColumn(selectedColumn);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = RemoveSelectedColumnCommand;



/***/ }),

/***/ 408:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Helpers__ = __webpack_require__(4);

class SelectAllCommand {
    constructor(currentDocument) {
        this.id = "select-all";
        this.title = "Select All";
        this.description = "Select all rows in the current column.";
        this._currentDocument = currentDocument;
        this.disabledSubject = __WEBPACK_IMPORTED_MODULE_0__Helpers__["a" /* Helpers */].disabledIfNull(currentDocument);
    }
    execute() {
        const currentDocument = this._currentDocument.getValue();
        if (currentDocument !== null) {
            const allRowIds = currentDocument.getRowIds();
            currentDocument.selectRowsById(allRowIds);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SelectAllCommand;



/***/ }),

/***/ 409:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Helpers__ = __webpack_require__(4);

class SelectColumnCommand {
    constructor(currentDocument) {
        this.id = "select-column";
        this.title = "Select Column";
        this.description = "Select a column in the table.";
        this._currentDocument = currentDocument;
        this.disabledSubject = __WEBPACK_IMPORTED_MODULE_0__Helpers__["a" /* Helpers */].disabledIfNull(currentDocument);
    }
    execute(e, columnId) {
        const currentDocument = this._currentDocument.getValue();
        if (currentDocument !== null) {
            currentDocument.selectColumn(columnId);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SelectColumnCommand;



/***/ }),

/***/ 410:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Helpers__ = __webpack_require__(4);

class SelectRowById {
    constructor(currentDocument) {
        this.id = "select-row-by-id";
        this.title = "Select Row";
        this.description = "Selects a row in the main table.";
        this.disabledSubject = __WEBPACK_IMPORTED_MODULE_0__Helpers__["a" /* Helpers */].disabledIfNull(currentDocument);
        this._currentDocument = currentDocument;
    }
    execute(e, id) {
        const currentDocument = this._currentDocument.getValue();
        if (currentDocument !== null)
            currentDocument.selectRowsById([id]);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SelectRowById;



/***/ }),

/***/ 411:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Helpers__ = __webpack_require__(4);

class SelectRows {
    constructor(currentDocument) {
        this.id = "select-rows";
        this.title = "Select Rows";
        this.description = "Select rows in the main table.";
        this._currentDocument = currentDocument;
        this.disabledSubject = __WEBPACK_IMPORTED_MODULE_0__Helpers__["a" /* Helpers */].disabledIfNull(currentDocument);
    }
    execute(e, ...rows) {
        const currentDocument = this._currentDocument.getValue();
        if (currentDocument !== null) {
            if (!e.shiftKey) {
                // clear selection before focusing
                const selectedRowIds = currentDocument.getSelectedRowIds();
                currentDocument.deSelectRowsById(selectedRowIds);
            }
            if (rows.length > 0)
                currentDocument.focusRow(rows[0].id);
            currentDocument.selectRows(rows);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SelectRows;



/***/ }),

/***/ 412:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Helpers__ = __webpack_require__(4);

class SetValueOfSelectedWells {
    constructor(currentDocument) {
        this.id = "set-value-of-selected-wells";
        this.title = "Set value of selected wells";
        this.description = "Sets the value of the currently selected wells.";
        this.disabledSubject = __WEBPACK_IMPORTED_MODULE_0__Helpers__["a" /* Helpers */].disabledIfNull(currentDocument);
        this._currentDocument = currentDocument;
    }
    execute(e, newValue) {
        const currentDocument = this._currentDocument.getValue();
        if (currentDocument !== null) {
            const selectedColumn = currentDocument.getSelectedColumnId();
            const selectedRows = currentDocument.getSelectedRowIds();
            if (selectedColumn !== null && selectedRows.length > 0) {
                currentDocument.assignValueToCells(selectedColumn, selectedRows, newValue);
            }
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SetValueOfSelectedWells;



/***/ }),

/***/ 413:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class PlateyLexer {
    lex(text) {
        this.text = text;
        this.index = 0;
        this.tokens = [];
        while (this.index < this.text.length) {
            const ch = this.text.charAt(this.index);
            if (ch === "(" || ch === ")") {
                this.tokens.push({ index: this.index, text: ch });
                this.index++;
            }
            else if (this._isSymbolStart(ch))
                this._readSymbol();
            else if (ch === '"')
                this._readString();
            else if (this._isWhitespace(ch))
                this.index++; // Discard
            else
                throw `Unexpected character, ${ch}, enountered at index ${this.index}`;
        }
        return this.tokens;
    }
    _isSymbolStart(ch) { return ch.match(/[A-Za-z\.]/); }
    _isWhitespace(ch) { return ch.match(/[ \n\t]/); }
    _isSymbolCharacter(ch) { return ch.match(/[A-Za-z\.1-9\-\+\*_/]/); }
    _readString() {
        const tokenStart = this.index;
        const stringStart = this.index + 1;
        let previous = "";
        let len = 0;
        this.index++; // skip the opening quote
        for (; this.index < this.text.length; this.index++, len++) {
            const current = this.text.charAt(this.index);
            if (current === '"' && previous !== "\\") {
                this.index++; // skip closing quote
                const stringContent = this.text.substring(stringStart, stringStart + len);
                this.tokens.push({ index: tokenStart, text: stringContent, isString: true });
                return;
            }
            previous = current;
        }
    }
    _readSymbol() {
        const start = this.index;
        while (this.index < this.text.length) {
            const ch = this.text.charAt(this.index);
            if (this._isSymbolCharacter(ch)) {
                this.index++;
            }
            else
                break;
        }
        const end = this.index;
        const symbolText = this.text.slice(start, end);
        this.tokens.push({ index: start, text: symbolText, isSymbol: true });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PlateyLexer;



/***/ }),

/***/ 414:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Resursive-descent LR(1) parser.
 */
class PlateyParser {
    parse(tokens) {
        this._tokens = tokens;
        const ast = this._program();
        if (this._tokens.length > 0)
            throw "Unexepcted tokens remaining after parsing a platey expression";
        else
            return ast;
    }
    _program() {
        const body = [];
        while (true) {
            if (this._tokens.length > 0) {
                if (this._peek(")"))
                    throw "Mis-matched parenthesis encountered when parsing the expression";
                else
                    body.push(this._sexp());
            }
            else
                return { type: PlateyParser.PROGRAM, body: body };
        }
    }
    _sexp() {
        const nextToken = this._peekToken();
        let body;
        if (nextToken.isString)
            body = this._string();
        else if (nextToken.text === "(")
            body = this._list();
        else
            body = this._symbol();
        return { type: PlateyParser.SEXP, body: body };
    }
    _string() {
        const token = this._peekToken();
        if (token.isString) {
            this._tokens.shift();
            return { type: PlateyParser.STRING, text: token.text };
        }
        else
            throw "Parse error: Unexpected token encountered when parsing a string";
    }
    _list() {
        const body = [];
        this._consume("(");
        while (true) {
            if (this._tokens.length === 0)
                throw "Parse error: Unexpected end of expression when parsing a list";
            else if (this._peek(")")) {
                this._consume(")");
                break;
            }
            else
                body.push(this._sexp());
        }
        return { type: PlateyParser.LIST, elements: body };
    }
    _symbol() {
        const token = this._peekToken();
        if (token.isSymbol) {
            this._tokens.shift();
            return { type: PlateyParser.SYMBOL, text: token.text };
        }
        else
            throw "Parse error: Unexpected token encountered when parsing a symbol.";
    }
    _consume(str) {
        const token = this._tokens.shift();
        if (token !== undefined && token.text === str)
            return true;
        else
            throw "Unexpected token encountered when shifting " + str;
    }
    _peekToken() {
        if (this._tokens.length === 0)
            throw "Parse error: Unexpected end of expression";
        else
            return this._tokens[0];
    }
    _peek(str) {
        const token = this._peekToken();
        return token.text === str;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PlateyParser;

PlateyParser.PROGRAM = "program";
PlateyParser.SEXP = "sexp";
PlateyParser.LIST = "list";
PlateyParser.SYMBOL = "symbol";
PlateyParser.STRING = "string";


/***/ }),

/***/ 415:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__PlateyParser__ = __webpack_require__(414);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__PlateyLexer__ = __webpack_require__(413);


class PlateyScript {
    static eval(text, ...scopes) {
        function evalAST(ast) {
            switch (ast.type) {
                case __WEBPACK_IMPORTED_MODULE_0__PlateyParser__["a" /* PlateyParser */].PROGRAM:
                    if (ast.body.length > 0) {
                        const results = ast.body.map(evalAST);
                        return results[results.length - 1];
                    }
                    else
                        return undefined;
                case __WEBPACK_IMPORTED_MODULE_0__PlateyParser__["a" /* PlateyParser */].SEXP:
                    return evalAST(ast.body);
                case __WEBPACK_IMPORTED_MODULE_0__PlateyParser__["a" /* PlateyParser */].LIST:
                    if (ast.elements.length === 0)
                        return undefined;
                    else {
                        let f, funcArgs;
                        [f, ...funcArgs] = ast.elements.map(evalAST);
                        return f.execute(...funcArgs);
                    }
                case __WEBPACK_IMPORTED_MODULE_0__PlateyParser__["a" /* PlateyParser */].SYMBOL:
                    const symbolText = ast.text;
                    let symbolValue;
                    // Scopes are right-priority
                    for (let len = scopes.length, i = len - 1; i >= 0; i--) {
                        let scope = scopes[i];
                        if (scope[symbolText] !== undefined) {
                            symbolValue = scope[symbolText];
                            break;
                        }
                    }
                    if (symbolValue === undefined)
                        throw "Symbol, " + symbolText + ", is void";
                    else
                        return symbolValue;
                case __WEBPACK_IMPORTED_MODULE_0__PlateyParser__["a" /* PlateyParser */].STRING:
                    return ast.text;
                default:
                    throw "Unknown AST node encountered when walking an AST";
            }
        }
        const lexer = new __WEBPACK_IMPORTED_MODULE_1__PlateyLexer__["a" /* PlateyLexer */]();
        const parser = new __WEBPACK_IMPORTED_MODULE_0__PlateyParser__["a" /* PlateyParser */]();
        const tokens = lexer.lex(text);
        const ast = parser.parse(tokens);
        return evalAST(ast);
    }
    static getFirstSymbolName(expr) {
        function getFirstSymbol(ast) {
            switch (ast.type) {
                case __WEBPACK_IMPORTED_MODULE_0__PlateyParser__["a" /* PlateyParser */].PROGRAM:
                    let symbol;
                    for (let i = 0, len = ast.body.length; i < len; i++) {
                        const sexp = ast.body[i];
                        symbol = getFirstSymbol(sexp);
                        if (symbol !== undefined)
                            return symbol;
                    }
                case __WEBPACK_IMPORTED_MODULE_0__PlateyParser__["a" /* PlateyParser */].SEXP:
                    return getFirstSymbol(ast.body);
                case __WEBPACK_IMPORTED_MODULE_0__PlateyParser__["a" /* PlateyParser */].LIST:
                    let listSymbol;
                    for (let i = 0, len = ast.elements.length; i < len; i++) {
                        const sexp = ast.elements[i];
                        listSymbol = getFirstSymbol(sexp);
                        if (listSymbol !== undefined)
                            return listSymbol;
                    }
                case __WEBPACK_IMPORTED_MODULE_0__PlateyParser__["a" /* PlateyParser */].SYMBOL:
                    return ast.text;
                default:
                    throw "Unknown AST node encountered when walking an AST";
            }
        }
        const lexer = new __WEBPACK_IMPORTED_MODULE_1__PlateyLexer__["a" /* PlateyLexer */]();
        const parser = new __WEBPACK_IMPORTED_MODULE_0__PlateyParser__["a" /* PlateyParser */]();
        const tokens = lexer.lex(expr);
        const ast = parser.parse(tokens);
        return getFirstSymbol(ast);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PlateyScript;



/***/ }),

/***/ 81:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(46);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PlateyAPI; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


let PlateyAPI = class PlateyAPI {
    constructor(httpService) {
        this.httpService = httpService;
    }
    fetchConfiguration() {
        return this.httpService.get("api/configurations/default").map(resp => resp.json());
    }
    fetchDocument(documentId) {
        return this.httpService.get("api/documents/" + documentId).map(resp => resp.json());
    }
    fetchPlateTemplateSummaries() {
        return this.httpService.get("api/plates").map(resp => resp.json());
    }
    fetchPlateTemplateById(plateTemplateId) {
        return this.httpService.get("api/plates/" + plateTemplateId).map(resp => resp.json());
    }
};
PlateyAPI = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["b" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */]])
], PlateyAPI);



/***/ }),

/***/ 82:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Helpers__ = __webpack_require__(4);


class PlateyDocument {
    constructor() {
        this.columns = [];
        this.selectedColumn = null;
        this.wells = [];
        this.clickedWell = null;
        this.arrangement = null;
        this.availableArrangements = [];
        this.selectors = [];
        this.beforeColumnSelectionChanged = new __WEBPACK_IMPORTED_MODULE_0_rxjs__["Subject"]();
        this.afterColumnSelectionChanged = new __WEBPACK_IMPORTED_MODULE_0_rxjs__["Subject"]();
        this.beforeColumnAdded = new __WEBPACK_IMPORTED_MODULE_0_rxjs__["Subject"]();
        this.afterColumnAdded = new __WEBPACK_IMPORTED_MODULE_0_rxjs__["Subject"]();
        this.beforeColumnMoved = new __WEBPACK_IMPORTED_MODULE_0_rxjs__["Subject"]();
        this.afterColumnMoved = new __WEBPACK_IMPORTED_MODULE_0_rxjs__["Subject"]();
        this.beforeColumnRemoved = new __WEBPACK_IMPORTED_MODULE_0_rxjs__["Subject"]();
        this.afterColumnRemoved = new __WEBPACK_IMPORTED_MODULE_0_rxjs__["Subject"]();
        this.beforeColumnDataCleared = new __WEBPACK_IMPORTED_MODULE_0_rxjs__["Subject"]();
        this.afterColumnDataCleared = new __WEBPACK_IMPORTED_MODULE_0_rxjs__["Subject"]();
        this.beforeSelectingRows = new __WEBPACK_IMPORTED_MODULE_0_rxjs__["Subject"]();
        this.afterSelectingRows = new __WEBPACK_IMPORTED_MODULE_0_rxjs__["Subject"]();
        this.beforeDeselectingRows = new __WEBPACK_IMPORTED_MODULE_0_rxjs__["Subject"]();
        this.afterDeselectingRows = new __WEBPACK_IMPORTED_MODULE_0_rxjs__["Subject"]();
        this.afterRowSelectionChanged = this.afterSelectingRows.merge(this.afterDeselectingRows);
        this.beforeAssigningValueToCells = new __WEBPACK_IMPORTED_MODULE_0_rxjs__["Subject"]();
        this.afterAssigningValueToCells = new __WEBPACK_IMPORTED_MODULE_0_rxjs__["Subject"]();
        this.beforeFocusRow = new __WEBPACK_IMPORTED_MODULE_0_rxjs__["Subject"]();
        this.afterFocusRow = new __WEBPACK_IMPORTED_MODULE_0_rxjs__["Subject"]();
        this.afterLayoutChanged = new __WEBPACK_IMPORTED_MODULE_0_rxjs__["Subject"]();
    }
    static fromPlateyDocumentFile(document) {
        if (document.fileSchema.version !== "1")
            throw "Unsupported document version: " + document.fileSchema.version;
        if (document.workbook.sheets.length > 1)
            console.log("Multiple workspaces found in document. Platey can only load the first");
        const focusedSheetId = document.workbook.focusedSheet;
        const focusedSheet = document.sheets[focusedSheetId];
        const tableSchemaId = focusedSheet.tableSchema;
        const tableSchema = document.tableSchemas[tableSchemaId];
        const sheetData = focusedSheet.data;
        const plateLayoutId = focusedSheet.plateTemplate;
        const plateLayout = document.plateLayouts[plateLayoutId];
        const plateyDocument = new PlateyDocument();
        plateyDocument.getColumnIds().forEach(plateyDocument.removeColumn);
        plateyDocument.setLayout(plateLayout);
        tableSchema.columns.forEach(column => {
            plateyDocument.addColumnWithId(column.id);
            plateyDocument.setColumnHeader(column.header, column.id);
        });
        Object.keys(sheetData).forEach(rowId => {
            const rowData = sheetData[rowId];
            Object.keys(rowData).forEach(columnId => {
                const cellValue = rowData[columnId].value;
                plateyDocument.assignValueToCells(columnId, [rowId], cellValue);
            });
        });
        return plateyDocument;
    }
    selectColumn(columnId) {
        const columnToSelect = (columnId === null) ? null : this.columns.find(column => column.id === columnId);
        if (columnId !== null &&
            columnToSelect !== undefined &&
            columnToSelect !== null &&
            this.selectedColumn !== columnToSelect) {
            this.beforeColumnSelectionChanged.next(columnId);
            this.selectedColumn = columnToSelect;
            this.afterColumnSelectionChanged.next(columnId);
        }
    }
    addColumn() {
        const randomId = __WEBPACK_IMPORTED_MODULE_1__Helpers__["a" /* Helpers */].generateGuid();
        return this.addColumnWithId(randomId);
    }
    addColumnWithId(id) {
        this.beforeColumnAdded.next(id);
        const newColumn = {
            header: "Column " + (this.columns.length + 1),
            id: id
        };
        this.columns.push(newColumn);
        this.wells.forEach(well => {
            well.data[newColumn.id] = { value: "", color: null };
        });
        this.afterColumnAdded.next(newColumn.id);
        return newColumn.id;
    }
    moveColumn(columnId, newIndex) {
        const oldIndex = this.columns.map(column => column.id).indexOf(columnId);
        if (oldIndex === -1)
            return; // The column wasn't in the table
        else if (oldIndex === newIndex)
            return; // It doesn't need to move
        else if (newIndex >= this.columns.length)
            return; // The new index is out of bounds
        else {
            this.beforeColumnMoved.next(columnId);
            __WEBPACK_IMPORTED_MODULE_1__Helpers__["a" /* Helpers */].moveItemInArray(this.columns, oldIndex, newIndex);
            this.afterColumnMoved.next(columnId);
        }
    }
    removeColumn(columnId) {
        const column = this.columns.find(col => col.id === columnId);
        if (column === undefined)
            return;
        else {
            if (column === this.selectedColumn)
                this.selectedColumn = null;
            this.beforeColumnRemoved.next(columnId);
            const idx = this.columns.indexOf(column);
            this.columns.splice(idx, 1);
            this.wells.forEach(well => {
                delete well.data[columnId];
            });
            this.afterColumnRemoved.next(columnId);
        }
    }
    getSelectedColumnId() {
        if (this.selectedColumn === null)
            return null;
        else
            return this.selectedColumn.id;
    }
    clearDataInColumn(columnId) {
        this.beforeColumnDataCleared.next(columnId);
        const rowIds = this.getRowIds();
        this.assignValueToCells(columnId, rowIds, "");
        this.afterColumnDataCleared.next(columnId);
    }
    getColumnIds() {
        return this.columns.map(column => column.id);
    }
    getColumnHeader(columnId) {
        const column = this.columns.find(column => column.id === columnId);
        if (column === undefined)
            return undefined;
        else
            return column.header;
    }
    setColumnHeader(header, columnId) {
        const column = this.columns.find(column => column.id === columnId);
        if (column === undefined)
            return undefined;
        else
            column.header = header;
    }
    getRowIds() {
        return this.wells.map(well => well.id);
    }
    getSelectedRowIds() {
        return this.wells.filter(well => well.selected === true).map(well => well.id);
    }
    selectRows(rows) {
        const rowIds = rows.map(row => row.id);
        this.beforeSelectingRows.next(rowIds);
        rows.forEach(row => row.selected = true);
        this.afterSelectingRows.next(rowIds);
    }
    selectRowsById(rowIds) {
        this.beforeSelectingRows.next(rowIds);
        this.wells
            .filter(well => rowIds.indexOf(well.id) !== -1)
            .forEach(well => well.selected = true);
        this.afterSelectingRows.next(rowIds);
    }
    deSelectRowsById(rowIds) {
        this.beforeDeselectingRows.next(rowIds);
        this.wells
            .filter(well => rowIds.indexOf(well.id) !== -1)
            .forEach(well => well.selected = false);
        this.afterDeselectingRows.next(rowIds);
    }
    assignValueToCells(columnId, rowIds, value) {
        this.beforeAssigningValueToCells.next({
            columnId: columnId,
            rowIds: rowIds,
            value: value,
        });
        const maybeColumn = this.columns.find(column => column.id === columnId);
        const wells = this.wells.filter(well => rowIds.indexOf(well.id) !== -1);
        if (maybeColumn !== undefined && wells.length > 0) {
            const column = maybeColumn;
            const columnId = column.id;
            const colorMappings = {};
            // Empty/null values should be blank.
            colorMappings[""] = { color: null, numEntries: 0 };
            this.wells
                .forEach(well => {
                const wellData = well.data[columnId];
                if (wellData.color !== null) {
                    const columnValue = wellData.value;
                    if (colorMappings[columnValue] === undefined) {
                        colorMappings[columnValue] = { color: wellData.color, numEntries: 1 };
                    }
                    else {
                        colorMappings[columnValue].numEntries++;
                    }
                }
            });
            let wellColor;
            if (colorMappings[value] === undefined) {
                const previousValue = wells[0].data[columnId].value;
                const previousValueHadColorAssigned = colorMappings[previousValue] !== undefined;
                if (previousValueHadColorAssigned) {
                    const selectedWellsAreOnlyWellsWithPreviousValue = colorMappings[previousValue].numEntries === wells.length;
                    if (selectedWellsAreOnlyWellsWithPreviousValue) {
                        const allSelectedWellsPreviouslyHadSameValue = wells.every(well => well.data[columnId].value === previousValue);
                        if (allSelectedWellsPreviouslyHadSameValue) {
                            wellColor = colorMappings[previousValue].color;
                        }
                        else {
                            wellColor = __WEBPACK_IMPORTED_MODULE_1__Helpers__["a" /* Helpers */].generateRandomColorHexString();
                        }
                    }
                    else {
                        wellColor = __WEBPACK_IMPORTED_MODULE_1__Helpers__["a" /* Helpers */].generateRandomColorHexString();
                    }
                }
                else {
                    wellColor = __WEBPACK_IMPORTED_MODULE_1__Helpers__["a" /* Helpers */].generateRandomColorHexString();
                }
            }
            else {
                wellColor = colorMappings[value].color;
            }
            wells.forEach((selectedWell) => {
                selectedWell.data[columnId].value = value;
                selectedWell.data[columnId].color = wellColor;
            });
        }
        this.afterAssigningValueToCells.next({
            columnId: columnId,
            rowIds: rowIds,
            value: value,
        });
    }
    getTableData() {
        const columnIds = this.columns.map(column => column.id);
        return this.wells.map(well => {
            const data = columnIds.map(columnId => well.data[columnId].value);
            return [well.id, ...data];
        });
    }
    getFocusedRowId() {
        if (this.clickedWell !== null)
            return this.clickedWell.id;
        else
            return null;
    }
    focusRow(rowId) {
        // null clears focus
        if (rowId === null) {
            this.beforeFocusRow.next(null);
            this.clickedWell = null;
            this.afterFocusRow.next(null);
        }
        else {
            const row = this.wells.find(well => well.id === rowId);
            if (row !== undefined) {
                this.beforeFocusRow.next(rowId);
                this.clickedWell = row;
                this.selectRowsById([rowId]);
                this.afterFocusRow.next(rowId);
            }
        }
    }
    hoverOverWell(well) {
        well.hovered = true;
    }
    unHoverOverWell(well) {
        well.hovered = false;
    }
    hoverOverWells(wells) {
        wells.forEach(well => this.hoverOverWell(well));
    }
    unHoverOverWells(wells) {
        wells.forEach(well => this.unHoverOverWell(well));
    }
    setLayout(layout) {
        const columnIds = this.columns.map(column => column.id);
        // Supply random and default arrangements for all
        // plates
        const defaultArrangement = {
            name: "Default",
            order: layout.wells.map(well => well.id)
        };
        const defaultArrangements = [
            defaultArrangement,
            {
                name: "Random",
                order: __WEBPACK_IMPORTED_MODULE_1__Helpers__["a" /* Helpers */].shuffle(layout.wells.map(well => well.id))
            },
        ];
        this.availableArrangements =
            (layout.arrangements) ? defaultArrangements.concat(layout.arrangements) : defaultArrangements;
        this.arrangement = defaultArrangement;
        this.wells = layout.wells.map(well => {
            const uiWell = {
                id: well.id,
                selected: false,
                hovered: false,
                x: well.x,
                y: well.y,
                radius: well.radius || layout.wellRadius || 0.3,
                data: {}
            };
            columnIds.forEach(columnId => {
                uiWell.data[columnId] = { value: "", color: null };
            });
            return uiWell;
        });
        this.selectors = layout.selectors.map(selector => {
            return {
                x: selector.x,
                y: selector.y,
                label: selector.label,
                selectsIds: selector.selects,
                selects: selector
                    .selects
                    .map(wellId => this.wells.find(well => well.id === wellId))
                    .filter(well => well !== undefined) // e.g. if the selector has an invalid ID in it
            };
        });
        this.gridWidth = layout.gridWidth;
        this.gridHeight = layout.gridHeight;
        this.afterLayoutChanged.next(layout);
    }
    setRowArrangement(arrangement) {
        const arrangementWells = arrangement.order;
        const arrangedWells = arrangementWells
            .map(wellId => this.wells.find(well => well.id === wellId))
            .filter(well => well !== undefined);
        const remainingWells = this.wells.filter(well => arrangement.order.indexOf(well.id) === -1);
        this.wells = arrangedWells.concat(remainingWells);
    }
    getSelectedWells() {
        return this.wells.filter(well => well.selected);
    }
    getSelectionValues() {
        if (this.selectedColumn === null)
            return [];
        else {
            const columnId = this.selectedColumn.id;
            const values = this.getSelectedWells().map(selectedWell => selectedWell.data[columnId].value);
            return values;
        }
    }
    setValueOfSelectionTo(newValue) {
        const selectedColumn = this.getSelectedColumnId();
        if (selectedColumn !== null) {
            const selectedRows = this.getSelectedRowIds();
            this.assignValueToCells(selectedColumn, selectedRows, newValue);
        }
    }
    getCurrentSelectionValue() {
        const selectionValues = this.getSelectionValues();
        if (selectionValues.length === 0) {
            return "";
        }
        else {
            const firstValue = selectionValues[0];
            if (firstValue === null)
                return "";
            const allWellsHaveSameValue = selectionValues.every((selectedWell) => selectedWell === firstValue);
            if (allWellsHaveSameValue)
                return firstValue;
            else
                return "";
        }
    }
    hasNoCellsSelected() {
        return this.selectedColumn === null ||
            !this.wells.some((well) => well.selected);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PlateyDocument;



/***/ }),

/***/ 84:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 84;

/***/ }),

/***/ 94:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(99);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(44)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./platey-style.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./platey-style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 95:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_AppModule__ = __webpack_require__(374);


__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__angular_AppModule__["a" /* AppModule */]);


/***/ }),

/***/ 96:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(90);

__webpack_require__(91);

__webpack_require__(93);

__webpack_require__(92);

__webpack_require__(94);

__webpack_require__(89);

__webpack_require__(95);

__webpack_require__(87);
__webpack_require__(85);
__webpack_require__(86);
__webpack_require__(88);

// This is the module that kicks off the app

/***/ })

},[96]);
//# sourceMappingURL=main.js.map