[<img src="https://secure.travis-ci.org/leveille/spine.validate.png" />](http://travis-ci.org/#!/leveille/spine.validate)

Simple model validation framework for [Spine](https://github.com/maccman/spine). Allowing you to mix strong validation rules with fluid english context. 

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
        rules: function(RuleFor) { return [
            RuleFor("first")
                .WhenNot().OnCreate()
                .ItShouldBe()
                .Required(),

            RuleFor("first")
                .It()
                .Must(function(field,record) {
                    return field === record.last;
                })
                .When(function(record) {
                    return record.last === "Palmer";
                })
                .Message("first and last names must match"),

            RuleFor("last")
                .ItIs()
                .Required()
                .And().Also()
                .Matches(/[A-Z]+/i),

            RuleFor("age")
                .ItShouldBe()
                .Between(18,25),

            RuleFor("birth")
                .It()
                .IsInPast(),

            RuleFor("state")
                .ItIs()
                .Required()
                .When(function(record) {
                    return record.zip !== undefined && record.zip.length > 0
                })
                .And().MaxLength(2),

            RuleFor("zip")
                .WhenNot().OnCreate()
                .It().IsNumeric()
                .Also().ItIs().Length(5),

            RuleFor("email")
                .ItIs()
                .EmailAddress()
        ]}
    });
```

After that whenever spine would normally call your custom "validate" method it will run through all the rules and send out error events just like you are used too. If you aren't familiar with this process see the spine documentation.

# Contributors

  * Nathan Palmer (author)
  * Aaron Hansen
  * Jason Leveille