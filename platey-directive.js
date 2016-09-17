/**
 * The plate that appears in the UI.
 */
angular.module("plateyPlate", []).directive(
  "plateyPlate",
  [function() {
     function link(scope, element) {
       let plate = null;
       let disableSelectionChanged = false;

       /**
        * Fires whenever the selection changes in the plate.
        */
       function onPlateSelectionChanged(selectionChangeDetails) {
         if (!disableSelectionChanged) {
           scope.$apply(() => {
             if (selectionChangeDetails.newItems.length > 0) {
               scope
               .wells
               .filter(well => selectionChangeDetails.newItems.indexOf(well.id) !== -1)
               .forEach(well => well.selected = true);
             }

             if (selectionChangeDetails.deSelectedItems.length > 0) {
               scope
               .wells
               .filter(well => selectionChangeDetails.deSelectedItems.indexOf(well.id) !== -1)
               .forEach(well => well.selected = false);
             }
           });
         }
       }

       /**
        * Fires whenever a new layout configuration comes along.
        */
       function onLayoutChanged(element, newLayout) {
         if (newLayout !== undefined && newLayout !== null) {
           plate = new Platey(newLayout, { gridWidth: 13, gridHeight: 9, element: element[0] });

           document.addEventListener("keypress", function(e) {
             if (e.key === "Escape")
               plate.clearSelection();
             else if (e.key === "a" && e.ctrlKey) {
               plate.selectWells(plate.wellIds);
               e.preventDefault();
             }
           });

           document.body.addEventListener("click", function(e) {
             if (e.target !== plate.htmlElement)
               plate.clearSelection();
           });

           // Whenever the plate's selection changes, update
           // the angular scope
           plate.onSelectionChanged.add(onPlateSelectionChanged);

           scope.wells =
             plate.wellIds.map(wellId => { return { id: wellId, columns: [], selected: false }});
         }
       }

       /**
        * When a new layout configuration comes along, fire
        * onLayoutChanged.
        */
       scope.$watch(
         (scope) => scope.plateLayout,
         (newLayout) => onLayoutChanged(element, newLayout));

       /**
        * When the well selection changes elsewhere (i.e. not in the
        * plate itself) then update the plate.
        */
       scope.$watch(
         (scope) => scope.wells,
         (wells) => {
           if (plate !== null) {
             disableSelectionChanged = true;

             wells.forEach(well => {
               if (well.selected) {
                 plate.selectWell(well.id);
               } else {
                 plate.deSelectWell(well.id);
               }
             });

             disableSelectionChanged = false;
           }
         },
         true); // Deep watch
     }

     return { link: link };
   }]);