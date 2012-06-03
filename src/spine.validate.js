(function(win) {
    Spine = win.Spine;

    var Check = function(field) {
        var validators = [];
        var conditions = [];
        var message;
        var invert = false;
        var inverter = function(func,record) {
            var result = func(record);
            if (result === undefined) {
                return message || "failed";
            }
        };
        var add = function(func) {
            if (invert) {
                validators.push(function(record) {
                    return inverter(func,record);
                });
                invert = false;
            } else {
                validators.push(func);
            }
        };
        var addCondition = function(func) {
            if (invert) {
                conditions.push(function (record) { return !func(record); });
                invert = false;
            } else {
                conditions.push(func);
            }
        };
        var validate = function(record) {
            var errors = [],
                i,
                validator,
                error;

            /*if (record.constructor.records[record.id] &&
                record.constructor.records[record.id][field] === record[field])
                return errors;*/

            var all = function (conditions, record) {
                var i,
                    condition;
                for (i = 0; i < conditions.length; i++) {
                    condition = conditions[i];
                    if (!condition(record)) return false;
                }
                return true;
            };

            if (all(conditions, record)) {
                for(i=0;i<validators.length;i++) {
                    validator = validators[i];
                    error = validator(record);
                    if (error) {
                        errors.push({property: field, message: error});
                    }
                }
            }

            return errors;
        };

        var chain = {
            Field: field,

            /* Conditional */
            OnCreate: function() {
                addCondition(function(record) {
                    return record.isNew();
                });
                return this;
            },
            WhenNotBlank: function() {
                addCondition(function(record) {
                    return record[field] !== undefined && record[field].length > 0;
                });
                return this;
            },
            When: function(func) {
                addCondition(func);
                return this;
            },

            /* English Chaining */
            And: function() {
                return this;  
            },
            AndIt: function() {
                return this;
            },
            Also: function() {
                return this;  
            },
            ItShould: function() {
                return this;
            },
            ItShouldBe: function() {
                return this;
            },
            It: function() {
                return this;
            },
            ItIs: function() {
                return this;
            },

            /* Inverse */
            Not: function(func) {
                invert = true;
                return this;  
            },
            WillNotBe: function(func) {
                invert = true;
                return this;
            },
            WhenNot: function(func) {
                invert = true;
                return this;
            },
            DontRun: function(func) {
                invert = true;
                return this;  
            },

            /* Standard Validators */
            Equal: function(value) {
                add(function(record) {
                    if (record[field] !== value) {
                        return message || field + " must equal " + value;
                    }
                });
                return this;
            },
            Required: function() {
                add(function(record) {
                    if (record[field] === undefined || record[field] === "") {
                        return message || field + " is required";
                    }
                });
                return this;
            },

            /* Length Validators */
            Length: function(length) {
                add(function(record) {
                    if (record[field].length !== length) {
                        return message || field + " must be " + length + " characters";
                    }
                });
                return this;
            },
            MaxLength: function(length) {
                add(function(record) {
                    if (record[field].length > length) {
                        return message || field + " must be less than " + length + " characters";
                    }
                });
                return this;
            },
            MinLength: function(length) {
                add(function(record) {
                    if (record[field].length < length) {
                        return message || field + " must be greater than " + length + " characters";
                    }
                });
                return this;
            },

            /* Numeric Validator */
            LessThan: function(value) {
                add(function(record) {
                    var val = typeof value === "function" ? 
                                isNaN(parseInt(value(record),10)) ? 0 : parseInt(value(record),10) : 
                                value;

                    if (record[field] >= val) {
                        return message || field + " must be less than " + val;
                    }
                });
                return this;
            },
            LessThanOrEqual: function(value) {
                add(function(record) {
                    var val = typeof value === "function" ? 
                                isNaN(parseInt(value(record),10)) ? 0 : parseInt(value(record),10) : 
                                value;

                    if (record[field] > val) {
                        return message || field + " must be less than or equal to " + val;
                    }
                });
                return this;
            },
            GreaterThan: function(value) {
                add(function(record) {
                    var val = typeof value === "function" ? 
                                isNaN(parseInt(value(record),10)) ? 0 : parseInt(value(record),10) : 
                                value;

                    if (record[field] <= val) {
                        return message || field + " must be greater than " + val;
                    }
                });
                return this;
            },
            GreaterThanOrEqual: function(value) {
                add(function(record) {
                    var val = typeof value === "function" ? 
                                isNaN(parseInt(value(record),10)) ? 0 : parseInt(value(record),10) : 
                                value;

                    if (record[field] < val) {
                        return message || field + " must be greater than or equal to " + val;
                    }
                });
                return this;
            },
            Between: function(min,max) {
                add(function(record) {
                    if (typeof record[field] === "undefined")  { return; }
                    
                    if (record[field] < min || record[field] > max) {
                        return message || field + " is not between " + min + " and " + max;
                    }
                });
                return this;
            },

            /* Opposite Validators */
            NotNull: function() {
                add(function(record) {
                    if (typeof record[field] === "undefined" || record[field] === null) {
                        return message || field + " must not be null";
                    }
                });
                return this;
            },
            NotEmpty: function() {
                add(function(record) {
                    if (typeof record[field] === "undefined" || record[field] === null) { return; }
                    if (record[field].length === 0) {
                        return message || field + " must not be blank";
                    }
                });
                return this;
            },
            NotEqual: function(value) {
                add(function(record) {
                    if (record[field] === value) {
                        return message || field + " must not equal " + value;
                    }
                });
                return this;
            },

            /* Regular Expression Validators */
            Matches: function(regex) {
                add(function(record) {
                    if (!record[field].match(regex)) {
                        return message || field + " failed validation";
                    }
                });
                return this;
            },
            IsAlpha: function() {
                add(function(record) {
                    if (record[field] !== undefined && !record[field].match(/[A-Za-z]+/i)) {
                        return message || field + " must be alpha";
                    }
                });
                return this;
            },
            IsNumeric: function() {
                add(function(record) {
                    if (record[field] !== undefined && !(record[field]+'').match(/[0-9\.]+/)) {
                        return message || field + " must be numeric";
                    }
                });
                return this;
            },
            EmailAddress: function() {
                /* 100% not my creation. 
                 * I did split it up so it's more readable and escaped it to work with javascript.
                 * 
                 * Source: http://regexlib.com/REDetails.aspx?regexp_id=1448
                 */
                var regex = new RegExp([
                    "^",
                    "(",
                        "(",
                            "([a-z]|[0-9]|!|#|$|%|&|'|\\*|\\+|\\-|\\/|\\=|\\?|\\^|_|`|\\{|\\||\\}|~)+",
                            "(",
                                "\\.",
                                "([a-z]|[0-9]|!|#|$|%|&|'|\\*|\\+|\\-|\\/|\\=|\\?|\\^|_|`|\\{|\\||\\}|~)+",
                            ")*",
                        ")",
                        "@",
                        "(",
                            "(",
                                "(",
                                    "(",
                                        "([a-z]|[0-9])",
                                        "([a-z]|[0-9]|\\-){0,61}",
                                        "([a-z]|[0-9])",
                                        "\\.",
                                    ")",
                                ")*",
                                "([a-z]|[0-9])",
                                "([a-z]|[0-9]|\\-){0,61}",
                                "([a-z]|[0-9])",
                                "\\.",
                                "(af|ax|al|dz|as|ad|ao|ai|aq|ag|ar|am|aw|au|at|az|bs|bh|bd|bb|by|be|bz|bj|bm|bt|bo|ba|bw|bv|br|io|bn|bg|bf|bi|kh|cm|ca|cv|ky|cf|td|cl|cn|cx|cc|co|km|cg|cd|ck|cr|ci|hr|cu|cy|cz|dk|dj|dm|do|ec|eg|sv|gq|er|ee|et|fk|fo|fj|fi|fr|gf|pf|tf|ga|gm|ge|de|gh|gi|gr|gl|gd|gp|gu|gt| gg|gn|gw|gy|ht|hm|va|hn|hk|hu|is|in|id|ir|iq|ie|im|il|it|jm|jp|je|jo|kz|ke|ki|kp|kr|kw|kg|la|lv|lb|ls|lr|ly|li|lt|lu|mo|mk|mg|mw|my|mv|ml|mt|mh|mq|mr|mu|yt|mx|fm|md|mc|mn|ms|ma|mz|mm|na|nr|np|nl|an|nc|nz|ni|ne|ng|nu|nf|mp|no|om|pk|pw|ps|pa|pg|py|pe|ph|pn|pl|pt|pr|qa|re|ro|ru|rw|sh|kn|lc|pm|vc|ws|sm|st|sa|sn|cs|sc|sl|sg|sk|si|sb|so|za|gs|es|lk|sd|sr|sj|sz|se|ch|sy|tw|tj|tz|th|tl|tg|tk|to|tt|tn|tr|tm|tc|tv|ug|ua|ae|gb|us|um|uy|uz|vu|ve|vn|vg|vi|wf|eh|ye|zm|zw|com|edu|gov|int|mil|net|org|biz|info|name|pro|aero|coop|museum|arpa)",
                            ")",
                            "|",
                            "(",
                                "(",
                                    "(",
                                        "([0-9]){1,3}",
                                        "\\.",
                                    "){3}",
                                    "([0-9]){1,3}",
                                ")",
                            ")",
                            "|",
                            "(",
                                "\\[",
                                "(",
                                    "(",
                                        "([0-9]){1,3}",
                                        "\\.",
                                    "){3}",
                                    "([0-9]){1,3}",
                                ")",
                                "\\]",
                            ")",
                        ")",
                    ")$"
                ].join(""));

                add(function(record) {
                    if (typeof record[field] === "undefined" || record[field] === null) { return; }
                    if (!record[field].match(regex)) {
                        return message || field + " failed validation";
                    }
                });
                return this;
            },

            /* Predicate Validators */
            Must: function(func) {
                add(function(record) {
                    if (!func(record[field],record)) {
                        return message || field + " failed validation";
                    }
                });
                return this;  
            },

            /* Date Validators */
            IsDate: function() {
                add(function(record) {
                    if (typeof record[field] === "undefined") { return; }

                    var date = new Date(record[field]);
                    if (date.toString() === "NaN" || date.toString() === "Invalid Date") {
                        return message || field + " is not a date";
                    }
                });
                return this;
            },
            IsInPast: function() {
                add(function(record) {
                    if (typeof record[field] === "undefined") { return; }

                    var d = new Date();
                    if (new Date(record[field]).getTime() > new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) {
                        return message || field + " cannot be in the future";
                    }
                });
                return this;
            },
            IsInFuture: function() {
                add(function(record) {
                    if (typeof record[field] === "undefined") { return; }

                    var d = new Date();
                    if (new Date(record[field]).getTime() < new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) {
                        return message || field + " cannot be in the past";
                    }
                });
                return this;                
            },
            IsBeforeDate: function(compareField) {
                add(function(record) {
                    if (typeof record[field] === "undefined" || typeof record[compareField] === "undefined") {
                        return;
                    }

                    var date = new Date(record[field]);
                    var futureDate = new Date(record[compareField]);
                    if (date >= futureDate) {
                        return message || field + " must come before " + compareField;
                    }
                });
                return this;
            },
            IsBeforeOrEqualToDate: function(compareField) {
                add(function(record) {
                    if (typeof record[field] === "undefined" || typeof record[compareField] === "undefined") {
                        return;
                    }

                    var date = new Date(record[field]);
                    var futureDate = new Date(record[compareField]);
                    if (date > futureDate) {
                        return message || field + " must come before or equal " + compareField;
                    }
                });
                return this;
            },
            IsAfterDate: function(compareField) {
                add(function(record) {
                    if (typeof record[field] === "undefined" || typeof record[compareField] === "undefined") {
                        return;
                    }

                    var date = new Date(record[field]);
                    var pastDate = new Date(record[compareField]);
                    if (date <= pastDate) {
                        return message || field + " must come after " + compareField;
                    }
                });
                return this;
            },
            IsAfterOrEqualToDate: function(compareField) {
                add(function(record) {
                    if (typeof record[field] === "undefined" || typeof record[compareField] === "undefined") {
                        return;
                    }

                    var date = new Date(record[field]);
                    var pastDate = new Date(record[compareField]);
                    if (date < pastDate) {
                        return message || field + " must come after or equal " + compareField;
                    }
                });
                return this;
            },
            IsEqualToDate: function(compareField) {
                add(function(record) {
                    if (typeof record[field] === "undefined" || typeof record[compareField] === "undefined") {
                        return;
                    }

                    var date = new Date(record[field]);
                    var comparisonDate = new Date(record[compareField]);
                    if (+date !== +comparisonDate) {
                        return message || field + " must equal " + compareField;
                    }
                });
                return this;
            },

            /* Message modification */
            Message: function(msg) {
                message = msg;
                return this;
            },

            /* And of course.. the validator! */
            validate: validate
        };


        return chain;
    };

    var Validate = {
        prepareValidation: function() {
            var i,
                rule,
                self = this,
                rules = this.rules(Check),
                fields = [];

            for(i=0;i<rules.length;i++) {
                rule = rules[i];
                self.bind("update["+rule.Field+"]", function(record,prop,current,previous) {
                    var errors = rule.validate(record);
                    if (errors.length > 0) {
                        self.trigger("error["+rule.Field+"]", errors);
                    }
                });
            }
        },

        validate: function() {
            var i,
                rules = this.rules(Check),
                errors = [];

            for(i=0;i<rules.length;i++) {
                var rule = rules[i];
                var failures = rule.validate(this);
                if (failures.length > 0) {
                    errors = errors.concat(failures);
                }
            }

            if (errors.length > 0) {
                return errors;
            }
        }
    };

    Spine.Validate = Validate;

    /* This is a bit of an inverted compatibility layer for non-spine
     * applications. I will need to switch this around. Not the best
     * design */
    win.ChainValidation = {
        RuleFor: Check,
        Validate: function(model,rules) {
            model.rules = function() { return rules; };
            var errors = Validate.validate.apply(model,arguments);
            return errors === undefined ? [] : errors;
        }
    };
})(window);