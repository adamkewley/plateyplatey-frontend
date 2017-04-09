import {Component} from '@angular/core';
import {PlateSummary} from "../../core/apitypes/PlateSummary";
import {PlateyDocument} from "../../core/document/PlateyDocument";
import {PlateyAPI} from "../PlateyAPI";
import {PlateyConfiguration} from "../../core/apitypes/PlateyConfiguration";
import {PlateySavedDocument} from "../../core/apitypes/PlateySavedDocument";
import {PlateyApp} from "../../core/PlateyApp";
import {Plate} from "../../core/apitypes/Plate";
import {AppCommands} from "../../core/AppCommands";
import {PlateyCommandController} from "../../core/PlateyCommandController";
import {Command} from "../../core/commands/Command";
import {Observable, Subscription} from "rxjs";
import {BodyKeydownHandler} from "../BodyKeydownHandler";
import {BodyKepressHandler} from "../BodyKepressHandler";
import {BodyClickHandler} from "../BodyClickHandler";

@Component({
  selector: 'plateyApp',
  templateUrl: "plateyApp.html",
  providers: [PlateyAPI]
})
export class PlateyComponent {

  getKeybindsAssociatedWith: (expr: string) => string[];
  bodyClickEventHandler: BodyClickHandler;
  bodyKeypressHandler: BodyKepressHandler;
  bodyKeydownHandler: BodyKeydownHandler;
  currentValue: string = "";
  currentPlateTemplateSummary: PlateSummary | null = null;
  plateTemplateSummaries: PlateSummary[] = [];
  document: PlateyDocument | null = null;
  commands: { [key: string]: (...args: any[]) => any } | null;
  getCommandDetails: ((commandId: string) => Command) | null;
  exec: ((expr: string, ...args: any[]) => void) | null;

  constructor(private plateyAPI: PlateyAPI) {

    // To boot the app, the configuration and plate summaries
    // must be loaded. The configuration contains a reference to
    // the default document.
    const configurationPromise = plateyAPI.fetchConfiguration();
    const platesPromise = plateyAPI.fetchPlateTemplateSummaries();

    Observable
      .forkJoin(configurationPromise, platesPromise)
      .subscribe(responses => {
        const appConfiguration = responses[0];
        const plates = responses[1];

        plateyAPI.fetchDocument(appConfiguration.defaultDocumentId).subscribe(defaultDocument => {
          this.bootApplication(appConfiguration, defaultDocument, plates);
        });
      });
  }

  get plateVbox(): string | null {
    if (this.document !== null) {
      return `0 0 ${this.document.gridWidth} ${this.document.gridHeight}`
    } else return null;
  }

  loadPlateSummary(plateSummary: PlateSummary): void {
    this.currentPlateTemplateSummary = plateSummary;

    if (this.document !== null) {

      this.plateyAPI
        .fetchPlateTemplateById(plateSummary.id)
        .subscribe((plateTemplateDetails: Plate) => {
          if (this.document !== null)
            this.document.setLayout(plateTemplateDetails);
        });
    }
  }

  bootApplication(
    config: PlateyConfiguration,
    defaultDocument: PlateySavedDocument,
    plates: { [plateId: string]: PlateSummary }) {

    const plateyApp = new PlateyApp(config, defaultDocument);
    plateyApp.currentDocument.subscribe(newDocument => this.document = newDocument);

    const nativeCommands = new AppCommands(plateyApp);
    this.commands = nativeCommands.commandsHash;
    const commandController = new PlateyCommandController();
    this.getCommandDetails = nativeCommands.getCommandById.bind(nativeCommands);
    const exec = commandController.executePlateyExpression.bind(commandController);
    this.exec = exec;

    commandController.afterExecPlateyExpression.subscribe((cmdName) =>
      console.log(cmdName));

    let documentEventSubscriptions: Subscription[] = [];

    plateyApp.currentDocument.subscribe((newDocument: PlateyDocument | null) => {

      documentEventSubscriptions.forEach(subscription => subscription.unsubscribe());

      documentEventSubscriptions = [];
      this.document = newDocument;

        if (newDocument !== null) {
          documentEventSubscriptions.push(
            newDocument.afterColumnAdded.subscribe((columnId: string) => {
              newDocument.selectColumn(columnId);
            }));

          documentEventSubscriptions.push(
            newDocument.afterSelectingRows.subscribe(() => {
              this.currentValue = newDocument.getCurrentSelectionValue();
            }));

          documentEventSubscriptions.push(
            newDocument.afterLayoutChanged.subscribe(() => {
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

    const bodyKeydownHandler = new BodyKeydownHandler(
      plateyApp.getKeybinds(),
      exec,
      plateyApp.currentDocument,
      nativeCommands);

    this.bodyKeydownHandler = bodyKeydownHandler.handler.bind(bodyKeydownHandler);

    // Keypress happens before keydown
    const bodyKeypressHandler = new BodyKepressHandler(
      plateyApp.getKeybinds(),
      plateyApp.currentDocument);

    this.bodyKeypressHandler = bodyKeypressHandler.handler.bind(bodyKeypressHandler);

    const bodyClickEventHandler = new BodyClickHandler(
      nativeCommands,
      plateyApp.currentDocument);

    this.bodyClickEventHandler = bodyClickEventHandler.handler.bind(bodyClickEventHandler);

    // Initialize plates
    const plateTemplates: { [plateId: string]: PlateSummary } = plates;
    this.plateTemplateSummaries = Object.keys(plateTemplates).map(key => plateTemplates[key]);

    this.getKeybindsAssociatedWith = (expr: string) => {
      const currentKeybinds = plateyApp.getKeybinds();
      return Object.keys(currentKeybinds)
        .filter(key => {
          const keyboundCommandId = currentKeybinds[key];

          return keyboundCommandId === expr;
        });
    };

    plateyApp.newDocument();
  }
}