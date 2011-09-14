Simple model validation framework for [Spine](https://github.com/maccman/spine).

# Install
Download spine.validation.js and include it in your html.

```html
<script type="text/javascript" src="spine.validate.js"></script>
```

# Usage
You must first start with a spine model

```javascript
    var model = Spine.Model.setup("Person", ["first","last","age","birth","address1","city","state","zip"]);
```

Then include the validation object

```javascript
    model.include(Spine.Validate);
```

Then setup some super awesome rules to go along with that

```javascript
    model.include({
        rules: function(check) { return [
            RuleFor("first")
                .WhenNotNew()
                .NotEmpty(),

            RuleFor("first")
                .Must(function(field,record) {
                    return field === record.last;
                })
                .When(function(record) {
                    return record.last === "Palmer";
                })
                .Message("first and last names must match"),

            RuleFor("last")
                .Required()
                .Matches(/[A-Z]+/i),

            RuleFor("age")
                .Between(18,25),

            RuleFor("birth")
                .IsInPast(),

            RuleFor("state")
                .Required()
                .When(function(record) {
                    return record.zip !== undefined && record.zip.length > 0
                })
                .MaxLength(2),

            RuleFor("zip")
                .WhenNotBlank()
                .IsNumeric()
                .Length(5),

            RuleFor("email")
                .EmailAddress()
        ]}
    });
```

After that whenever spine would normally call your custom "validate" method it will run through all the rules and send out error events just like you are used too. If you aren't familiar with this process see the spine documentation.