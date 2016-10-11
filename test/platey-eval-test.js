describe("plateyEval", function() {
  it("exists", function() {
    expect(plateyEval).toBeDefined();
  });

  it("is a function", function() {
    expect(typeof plateyEval).toBe("function");
  });

  it("accepts a platey expression string as its first argument", function() {
    const expr = "()";

    expect(() => plateyEval(expr)).not.toThrow();
  });

  it("accepts a scope object as an argument", function() {
    const scope = { x: 10 };
    const expr = "x";

    expect(() => plateyEval(expr, scope)).not.toThrow();
  });

  it("throws if a symbol appears in the expression that cannot be dereferenced in the scope", function() {
    const expr = "f";
    const scope = {};

    expect(() => plateyEval(expr, scope)).toThrow();
  });

  it("throws if a symbol appears in the expression that is not in the scope, even if other in-the-scope symbols are present", function() {
    const expr = "(f x)";

    const scope = { x: 10 };

    expect(() => plateyEval(expr, scope)).toThrow();
  });

  it("does not throw if multiple symbols appear that are all in the scope", function() {
    const expr = "(f x)";
    const scope = { f: (x) => x + 1, x: 1 };

    expect(() => plateyEval(expr, scope)).not.toThrow();
  });

  it("treats a list expression as a function call (lisp-like)", function() {
    const expr = "(f x)";
    let wasCalled = false;

    const scope = { f: () => wasCalled = true, x: 10 };

    expect(() => plateyEval(expr, scope)).not.toThrow();
    expect(wasCalled).toBe(true);
  });

  it("the remaining (symbol) elements in the list are supplied as arguments to the function call", function() {
    const expr = "(f x)";
    let wasCalled = false;

    const scope = {
      f: (x) => {
        wasCalled = true;
        expect(x).toBe(2048);
      },
      x: 2048
    };

    plateyEval(expr, scope);
    expect(wasCalled).toBe(true);
  });

  it("nested list arguments are evaluated before being passed to the parent function (lisp-like)", function() {
    const expr = "(f (g x))";

    let gWasCalled = false;
    let fWasCalled = false;

    const scope = {
      f: (arg) => {
        fWasCalled = true;
        expect(arg).toBe(2);
      },
      g: (x) => {
        gWasCalled = true;
        expect(x).toBe(1);
        return x + 1;
      },
      x: 1
    };

    plateyEval(expr, scope);

    expect(gWasCalled).toBe(true);
    expect(fWasCalled).toBe(true);
  });

  it("The function's return value is returned to the eval call", function() {
    const expr = "(f)";

    const scope = { f: () => 10 };

    const ret = plateyEval(expr, scope);

    expect(ret).toBe(10);
  });

  it("If the function returns nothing then undefined is returned to the eval call", function() {
    const expr = "(f)";
    const scope = { f: () => {} };

    const ret = plateyEval(expr, scope);

    expect(ret).toBe(undefined);
  });

  it("allows multiple scopes to be supplied", function() {
    const expr = "(f x)";
    const firstScope = { f: (x) => x + 1, x: 1 };
    const secondScope = { f: (x) => x + 1, x: 1 };

    expect(() => plateyEval(expr, firstScope, secondScope)).not.toThrow();
  });

  it("if multiple scopes are supplied, the rightmost scope takes priority over the leftmost", function() {
    const expr = "(f)";

    let firstScopeWasCalled = false;
    const firstScope = { f: () => firstScopeWasCalled = true };

    let secondScopeWasCalled = false;
    const secondScope = { f: () => secondScopeWasCalled = true };

    expect(() => plateyEval(expr, firstScope, secondScope)).not.toThrow();
    expect(firstScopeWasCalled).toBe(false);
    expect(secondScopeWasCalled).toBe(true);
  });

  it("supplies string literals to the function", function() {
    const expr = '(f "foo")';

    let wasCalled = false;

    const scope = { f: (str) => {
      wasCalled = true;
      expect(str).toBe("foo");
    }};

    plateyEval(expr, scope);

    expect(wasCalled).toBe(true);
  });

  it("supplies string literals to nested function calls", function() {
    const expr = '(f (g "foo"))';

    let gWasCalled = false;

    const scope = {
      f: () => {},
      g: (str) => {
        gWasCalled = true;
        expect(str).toBe("foo");
      }
    };

    plateyEval(expr, scope);

    expect(gWasCalled).toBe(true);
  });
});