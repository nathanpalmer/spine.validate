var Person = (function() {
    var model = Spine.Model.setup("Person", ["first","last","age","birth","address1","city","state","zip","email"]);
    model.include(Spine.Validate);
    model.include({
        rules: function(RuleFor) { return [
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
    return model;
})();

var PersonController = Spine.Controller.create({
    tag: "div",

    proxied: [ "error" ],

    bindings: {
        "value input[name=first]": "first",
        "value input[name=last]": "last",
        "value input[name=age]": "age",
        "value input[name=birth]": "birth",
        "value input[name=city]": "city",
        "value input[name=state]": "state",
        "value input[name=zip]": "zip",
        "value input[name=email]": "email",
    },

    init: function() {
        var item = this.item;
        item.bind("error", this.proxy(this.error));
        item.bind("update", this.proxy(this.clear));
    },

    error: function(item,errors) {
        this.clear();
        var list = [];
        for(var i in errors) {
            var error = errors[i];
            this.el.find('input[name='+error.property+']').addClass('fail');
            list.push(error.message);
        }
        this.el.find('.error').html(this.template("error", {errors:list}));
    },

    clear: function() {
        this.el.find('.fail').removeClass('fail');
        this.el.find('.error').html("");
    },

    template: function(name,item) {
        var personTemplate = [
            "<label for='first'>First</label>",
            "<input type='text' name='first' value='${first}'/>",
            "<label for='last'>Last</label>",
            "<input type='text' name='last' value='${last}'/>",
            "<label for='age'>Age</label>",
            "<input type='text' name='age' value='${age}'/>",
            "<label for='birth'>Birth</label>",
            "<input type='text' name='birth' value='${birth}'/>",
            "<label for='last'>City</label>",
            "<input type='text' name='city' value='${city}'/>",
            "<label for='state'>State</label>",
            "<input type='text' name='state' value='${state}'/>",
            "<label for='zip'>Zip</label>",
            "<input type='text' name='zip' value='${zip}'/>",
            "<label for='email'>Email</label>",
            "<input type='text' name='email' value='${email}'/>",
            "<span class='error'>${error}</span>"
        ].join("");

        var errorTemplate = [
            "<ul>",
                "{{each errors}}",
                "<li>${$value}</li>",
                "{{/each}}",
            "</ul>"
        ].join("");

        switch(name) {
            case "person":
                return $.tmpl(personTemplate, item);
            case "error":
                return $.tmpl(errorTemplate, item);
            default:
                return "";
        }
    },

    render: function() {
        this.html(this.template("person",this.item));
        this.refreshBindings(this.item);
        return this;
    }
});

PersonController.include(Spine.DataBind);

var PersonApp = Spine.Controller.create({
    el: "#content",

    events: {
        "click input[value=Add]": "add"
    },

    init: function() {
        Person.bind("create", this.added);
        Person.bind("change", function(item) {
            console.log(item.toString());
        });
    },

    add: function() {
        Person.create({last:"Last"});
    },

    added: function(person) {
        var controller = PersonController.init({item: person});
        $("#content").append(controller.render().el);
    }
})

$(document).ready(function() {
    PersonApp.init();
});