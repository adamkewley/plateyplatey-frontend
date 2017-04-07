import {AllCommands} from "./AllCommands";
import {PlateyDocument} from "./PlateyDocument";
import {PlateyCommandController} from "./PlateyCommandController";
import {IController, IScope} from "angular";
import {PlateySavedDocument} from "./api/PlateySavedDocument";
import {Subscription} from "rxjs";
import {PlateyApp} from "./PlateyApp";
import {BodyKepressHandler} from "./BodyKepressHandler";
import {BodyKeydownHandler} from "./BodyKeydownHandler";
import {BodyClickHandler} from "./BodyClickHandler";
import {PlateyAPI} from "./api/PlateyAPI";
import {Plate} from "./api/Plate";

export const plateyController: IController = [
    "$scope", "plateyAPI", function($scope: IScope, plateyAPI: PlateyAPI) {

    $scope.currentValue = "";
    $scope.currentPlateTemplateSummary = null;
    $scope.plateTemplateSummaries = [];
    $scope.document = null;

    const configurationPromise = plateyAPI.fetchConfiguration();
    const platesPromise = plateyAPI.fetchPlateTemplateSummaries();

    Promise
      .all([configurationPromise, platesPromise])
      .then(responses => {
        const appConfiguration = responses[0];
        const plates = responses[1];

        plateyAPI.fetchDocument(appConfiguration.defaultDocumentId)
          .then((defaultDocument: PlateySavedDocument) => {

            const plateyApp = new PlateyApp(appConfiguration, defaultDocument);

            $scope.getPlateVbox = () => {
              return `0 0 ${$scope.document.gridWidth} ${$scope.document.gridHeight}`;
            };

            $scope.loadPlateSummary = (plateTemplateSummary: any) => {
              $scope.currentPlateTemplateSummary = plateTemplateSummary;

              plateyAPI.fetchPlateTemplateById(plateTemplateSummary.id).then((plateTemplateDetails: Plate) => {
                $scope.document.setLayout(plateTemplateDetails);
              });
            };

            const nativeCommands = new AllCommands(plateyApp.currentDocument, plateyApp);
            $scope.commands = nativeCommands.commandsHash;
            const commandController = new PlateyCommandController();
            $scope.getCommandDetails = nativeCommands.getCommandById.bind(nativeCommands);
            $scope.exec = commandController.executePlateyExpression.bind(commandController);

            commandController.afterExecPlateyExpression.subscribe((cmdName) =>
              console.log(cmdName));

            let documentEventSubscriptions: Subscription[] = [];
            plateyApp.currentDocument.subscribe((newDocument: PlateyDocument | null) => {
              documentEventSubscriptions.forEach(subscription => subscription.unsubscribe());
              documentEventSubscriptions = [];
              $scope.document = newDocument;

              if (newDocument !== null) {
                documentEventSubscriptions.push(
                  newDocument.afterColumnAdded.subscribe((columnId: string) => {
                    newDocument.selectColumn(columnId);
                  }));

                documentEventSubscriptions.push(
                  newDocument.afterSelectingRows.subscribe(() => {
                    $scope.currentValue = newDocument.getCurrentSelectionValue();
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

            const bodyKeydownHandler = new BodyKeydownHandler(plateyApp.getKeybinds(), $scope.exec, plateyApp.currentDocument, nativeCommands);
            $scope.bodyKeydownHandler = bodyKeydownHandler.handler.bind(bodyKeydownHandler);

            // Keypress happens before keydown
            const bodyKeypressHandler = new BodyKepressHandler(plateyApp.getKeybinds(), plateyApp.currentDocument);
            $scope.bodyKeypressHandler = bodyKeypressHandler.handler.bind(bodyKeypressHandler);

            const bodyClickEventHandler = new BodyClickHandler(nativeCommands, plateyApp.currentDocument);
            $scope.bodyClickEventHandler = bodyClickEventHandler.handler.bind(bodyClickEventHandler);

            // Initialize plates
            const plateTemplates = plates;
            $scope.plateTemplateSummaries = Object.keys(plateTemplates).map(key => plateTemplates[key]);

            $scope.getKeybindsAssociatedWith = (expr: string) => {
              const currentKeybinds = plateyApp.getKeybinds();
              return Object.keys(currentKeybinds)
                .filter(key => {
                  const keyboundCommandId = currentKeybinds[key];

                  return keyboundCommandId === expr;
                });
            };

            plateyApp.newDocument();
          });
      });
  }];
