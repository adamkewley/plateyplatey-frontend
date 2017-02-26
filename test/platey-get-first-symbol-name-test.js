import getFirstSymbolName from "platey-lang/get-first-symbol";

describe("getFirstSymbolName", function() {
  it("exists", function() {
    expect(getFirstSymbolName).toBeDefined();
  });

  it("is a function", function() {
    expect(typeof getFirstSymbolName).toBe("function");
  });

  it("accepts an expression argument", function() {
    const expr = "(f x)";

    expect(() => getFirstSymbolName(expr)).not.toThrow();
  });

  it("returns the name of the first/root function call in the expression", function() {
    const expr = "(f x)";

    expect(getFirstSymbolName(expr)).toBe("f");
  });

  it("returns the first function name, even if there are nested ones", function() {
    const expr = "(f (g x))";

    expect(getFirstSymbolName(expr)).toBe("f");
  });

  it("returns the first function name even if there are subsequent calls", function() {
    const expr = "(f x) (g x)";

    expect(getFirstSymbolName(expr)).toBe("f");
  });

  it("returns undefined if there isn't a function call", function() {
    const expr = "()";

    expect(getFirstSymbolName(expr)).toBe(undefined);
  });

  it("returns the first symbol, even if it isn't a function call", function() {
    const expr = "f";

    expect(getFirstSymbolName(expr)).toBe("f");
  });
});
