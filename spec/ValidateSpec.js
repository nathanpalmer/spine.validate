describe("Validate", function() {
	var RuleFor = ChainValidation.RuleFor;
	
	it("should validate with no rules", function() {
		// Given
		var model = { first: "" };
		var rules = [ ];

		// When
		var errors = ChainValidation.Validate(model, rules);

		// Then
		expect(errors.length).toBe(0);
	});
	
	it("should return an error for required", function() {
		var model = { first: "" };
		var rules = [
			RuleFor("first")
				.Required()
		];

		var errors = ChainValidation.Validate(model, rules);

		expect(errors.length).toBe(1);
		expect(errors[0].property).toBe("first");
	});

	it("should verify equal", function() {
		// Given
		var model = { first: "Eric" };
		var rules = [
			RuleFor("first")
				.Equal("Nathan")
		];

		// When
		var errors = ChainValidation.Validate(model, rules);

		// Then
		expect(errors.length).toBe(1);
		expect(errors[0].property).toBe("first");
	});

	it("should invert equal", function() {
		// Given
		var model = { first: "Nathan" };
		var rules = [
			RuleFor("first")
				.Not().Equal("Nathan")
		];

		// When
		var errors = ChainValidation.Validate(model, rules);

		// Then
		expect(errors.length).toBe(1);
		expect(errors[0].property).toBe("first");
	});

	it("should invert only the next statement", function() {
		// Given
		var model = { first: "Nathan" };
		var rules = [
			RuleFor("first")
				.Not().Equal("Nathan")
				.Length(6)
		];

		// When
		var errors = ChainValidation.Validate(model, rules);

		// Then
		expect(errors.length).toBe(1);
		expect(errors[0].property).toBe("first");
	});

	it("should only check if its not blank", function() {
		// Given
		var model = { first: "" };
		var rules = [
			RuleFor("first")
				.WhenNotBlank()
				.Equal("Nathan")
		];

		// When
		var errors = ChainValidation.Validate(model, rules);

		// Then
		expect(errors.length).toBe(0);
	});

	it("should invert a condition", function() {
		// Given
		var model = { newRecord: false, first: "" };
		var rules = [
			RuleFor("first")
				.WhenNot().OnCreate()
				.ItShould()
				.Equal("Nathan")
		];

		// When
		var errors = ChainValidation.Validate(model, rules);

		// Then
		expect(errors.length).toBe(1);
		expect(errors[0].property).toBe("first");
	});
});