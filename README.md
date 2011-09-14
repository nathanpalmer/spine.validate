Simple model validation framework for [Spine](https://github.com/maccman/spine).

# Install
Download spine.validation.js and include it in your html.
> <script type="text/javascript" src="spine.validate.js"></script>

# Usage
You must first start with a spine model
```javascript
    var model = Spine.Model.setup("Person", ["first","last","age","birth","address1","city","state","zip"]);
```

Then include the validation object
```javascript
    model.include(Spine.Validate);
```

```javascript
Then setup some super awesome rules to go along with that
    model.include({
        rules: function(check) { return [
            check("first")
                .IsAlpha()
                .Equals("Nathan"),

            check("first")
                .Must(function(field) {
                    return field === "Nathan";
                })
                .If(function(record) {
                    return record.last === "Palmer";
                })
                .Message("if your last name is Palmer then your first must be Nathan"),

            check("last")
                .Required(),

            check("age")
                .Between(18,25),

            check("birth")
                .IsInPast(),

            check("state")
                .Required()
                .If(function(record) {
                    return record.zip !== undefined && record.zip.length > 0
                })
                .MaxLength(2),

            check("zip")
                .Optional()
                .IsNumeric()
                .Length(5)
        ]}
    });
```