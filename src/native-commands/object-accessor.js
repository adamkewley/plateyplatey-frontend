/**
 * Access the property of an object
 */
class ObjectAccessor extends AlwaysEnabledCommand {
  constructor() {
    super();
    this.id = ".";
    this.title = "Access Property";
    this.description = "Access the property of an object";
  }

  execute(instance, memberSymbol, args) {
    const member = instance[memberSymbol];

    if (member !== undefined && args !== undefined) {
      return member.apply(member, args);
    } else return member;
  }
}