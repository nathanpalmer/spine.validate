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

	it("should return custom message for required", function() {
		var model = { first: "" };
		var message = 'First is a required field';
		var rules = [
			RuleFor("first")
				.Required()
				.Message(message)
		];

		var errors = ChainValidation.Validate(model, rules);
		expect(errors[0].message).toBe(message);
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
		var model = {
            isNew: function(){return false;},
            first: ""
        };
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

	it("should verify integer as numeric", function() {
		// Given
		var model = { number: "1" };
		var rules = [
			RuleFor("number")
				.IsNumeric()
		];

		// When
		var errors = ChainValidation.Validate(model, rules);

		// Then
		expect(errors.length).toBe(0);
	});

	it("should verify decimal as numeric", function() {
		// Given
		var model = { number: "1.1" };
		var rules = [
			RuleFor("number")
				.IsNumeric()
		];

		// When
		var errors = ChainValidation.Validate(model, rules);

		// Then
		expect(errors.length).toBe(0);
	});

	it("should fail email", function() {
		// Given
		var model = { email: "none" };
		var rules = [
			RuleFor("email")
				.EmailAddress()
		];

		// When
		var errors = ChainValidation.Validate(model, rules);

		// Then
		expect(errors.length).toBe(1);
		expect(errors[0].property).toBe("email");
	});

	it("should validate email", function() {
		// Given
		var model = { email: "test@example.com" };
		var rules = [
			RuleFor("email")
				.EmailAddress()
		];

		// When
		var errors = ChainValidation.Validate(model, rules);

		// Then
		expect(errors.length).toBe(0);
	});
});