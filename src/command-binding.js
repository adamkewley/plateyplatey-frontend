const exampleCommand = {
  id: "clear-plate",
  title: "Clear Plate",
  description: "Clear the plate of plate of data, leaving the columns intact.",
  isDisabled: () => true,
  whyDisabled: () => "Because you're disabled",
  disabledChanged: null,
  execute: (e) => alert("hello")
};

/**
 * Describes a command that the UI can bind to.
 */
angular
.module("plateyCommand", [])
.directive("plateyCommand", function() {

  function link(scope, element, attrs) {
    const el = element[0];
    //const commandName = attrs.plateyCommand;

    // TODO: this command is just here to test the idea
    const command = exampleCommand;

    const updateElement = () => {
      const isDisabled = command.isDisabled();

      el.disabled = isDisabled;
      el.title = isDisabled ? command.whyDisabled() : command.description;
    };

    el.addEventListener("click", (e) => {
      scope.$apply(() => command.execute(e));
    });

    updateElement();
  }

  return { link: link };
});