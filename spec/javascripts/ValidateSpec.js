describe("Validate", function() {

	describe("ChainValidation", function() {
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

		it("should determine that one date comes before another", function() {
			// Given
			var model = { start: "01/02/2012", end: "01/03/2012" };
			var rules = [
				RuleFor("start")
					.IsBeforeDate("end")
			];

			// When
			var errors = ChainValidation.Validate(model, rules);

			// Then
			expect(errors.length).toBe(0);
		});

		it("should determine that one date comes after another", function() {
			// Given
			var model = { start: "01/02/2012", end: "01/03/2012" };
			var rules = [
				RuleFor("end")
					.IsAfterDate("start")
			];

			// When
			var errors = ChainValidation.Validate(model, rules);

			// Then
			expect(errors.length).toBe(0);
		});

		it("should determine that one date is less than or equal to another", function() {
			// Given
			var model = {
				start: "01/02/2012",
				end: "01/02/2012",
				end2: "01/03/2012"
			};
			var rules = [
				RuleFor("start")
					.IsBeforeOrEqualToDate("end")
					.IsBeforeOrEqualToDate("end2")
			];

			// When
			var errors = ChainValidation.Validate(model, rules);

			// Then
			expect(errors.length).toBe(0);
		});

		it("should determine that one date is greater than or equal to another", function() {
			// Given
			var model = {
				start: "01/02/2012",
				start2: "01/01/2012",
				end: "01/02/2012"
			};
			var rules = [
				RuleFor("end")
					.IsAfterOrEqualToDate("start")
					.IsAfterOrEqualToDate("start2")
			];

			// When
			var errors = ChainValidation.Validate(model, rules);

			// Then
			expect(errors.length).toBe(0);
		});

		it("should determine that two dates are equal", function() {
			// Given
			var model = {
				start: "01/02/2012",
				end: "01/02/2012"
			};
			var rules = [
				RuleFor("start")
					.IsEqualToDate("end")
			];

			// When
			var errors = ChainValidation.Validate(model, rules);

			// Then
			expect(errors.length).toBe(0);
		});
	});

	describe("Spine", function() {
		it("should validate when property is set", function() {
			var Person = Spine.Model.sub({
				/* Init is no longer necessary because of spine.activator.js */
				/*init: function() {
					this.prepareWatch();
					this.prepareValidation();
				},*/
				rules: function(RuleFor) { return [
					RuleFor("email")
						.EmailAddress()
				]; }
			});
			Person.configure("Person", "first", "last", "email");
			Person.include(Spine.Validate);
			Person.include(Spine.Watch);

			spy = sinon.spy();

			var person = new Person();
			person.bind("error[email]", spy);
			person.email = "test";

			runs(function() {
				expect(spy.called).toBe(true);
			});
		});
	});
});

