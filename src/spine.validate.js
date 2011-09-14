(function(Spine) {
    var Check = function(field) {
        var validators = [];
        var condition = function() { return true; };
        var message;

        return {
            /* Conditional */
            WhenNotNew: function() {
                condition = function(record) {
                    return !record.newRecord;  
                };
                return this;
            },
            WhenNotBlank: function() {
                condition = function(record) {
                    return record[field] !== undefined && record[field].length > 0;
                };
                return this;
            },
            When: function(func) {
                condition = func;
                return this;
            },

            /* English Chaining */
            And: function() {
                return this;  
            },
            Also: function() {
                return this;  
            },

            /* Standard Validators */
            Equal: function(value) {
                validators.push(function(record) {
                    if (record[field] !== value) {
                        return message || field + " must equal " + value;
                    }
                });
                return this;
            },
            Required: function() {
                validators.push(function(record) {
                    if (record[field] === undefined || record[field] === "") {
                        return field + " is required";
                    }
                });
                return this;
            },

            /* Length Validators */
            Length: function(length) {
                validators.push(function(record) {
                    if (record[field].length !== length) {
                        return message || field + " must be " + length + " characters";
                    }
                });
                return this;
            },
            MaxLength: function(length) {
                validators.push(function(record) {
                    if (record[field].length > length) {
                        return message || field + " must be less than " + length + " characters";
                    }
                });
                return this;
            },
            MinLength: function(length) {
                validators.push(function(record) {
                    if (record[field].length < length) {
                        return message || field + " must be greater than " + length + " characters";
                    }
                });
                return this;
            },

            /* Numeric Validator */
            LessThan: function(value) {
                validators.push(function(record) {
                    var val = typeof value === "function" ? 
                                isNaN(parseInt(value(record))) ? 0 : parseInt(value(record)) : 
                                value;

                    if (record[field] >= val) {
                        return message || field + " must be less than " + val;
                    }
                });
                return this;
            },
            LessThanOrEqual: function(value) {
                validators.push(function(record) {
                    var val = typeof value === "function" ? 
                                isNaN(parseInt(value(record))) ? 0 : parseInt(value(record)) : 
                                value;

                    if (record[field] > val) {
                        return message || field + " must be less than or equal to " + val;
                    }
                });
                return this;
            },
            GreaterThan: function(value) {
                validators.push(function(record) {
                    var val = typeof value === "function" ? 
                                isNaN(parseInt(value(record))) ? 0 : parseInt(value(record)) : 
                                value;

                    if (record[field] <= val) {
                        return message || field + " must be greater than " + val;
                    }
                });
                return this;
            },
            GreaterThanOrEqual: function(value) {
                validators.push(function(record) {
                    var val = typeof value === "function" ? 
                                isNaN(parseInt(value(record))) ? 0 : parseInt(value(record)) : 
                                value;

                    if (record[field] < val) {
                        return message || field + " must be greater than or equal to " + val;
                    }
                });
                return this;
            },
            Between: function(min,max) {
                validators.push(function(record) {
                    if (typeof record[field] === "undefined") return;
                    
                    if (record[field] < min || record[field] > max) {
                        return field + " is not between " + min + " and " + max;
                    }
                });
                return this;
            },

            /* Opposite Validators */
            NotNull: function() {
                validators.push(function(record) {
                    if (typeof record[field] === "undefined" || record[field] === null) {
                        return message || field + " must not be null";
                    }
                });
                return this;
            },
            NotEmpty: function() {
                validators.push(function(record) {
                    if (typeof record[field] === "undefined" || record[field] === null) return;
                    if (record[field].length === 0) {
                        return message || field + " must not be blank";
                    }
                });
                return this;
            },
            NotEqual: function(value) {
                validators.push(function(record) {
                    if (record[field] === value) {
                        return message || field + " must not equal " + value;
                    }
                });
                return this;
            },

            /* Regular Expression Validators */
            Matches: function(regex) {
                validators.push(function(record) {
                    if (!record[field].match(regex)) {
                        return message || field + " failed validation";
                    }
                });
                return this;
            },
            IsAlpha: function() {
                validators.push(function(record) {
                    if (record[field] !== undefined && !record[field].match(/[A-Za-z]+/i)) {
                        return field + " must be alpha";
                    }
                });
                return this;
            },
            IsNumeric: function() {
                validators.push(function(record) {
                    if (record[field] !== undefined && !record[field].match(/[0-9]+/)) {
                        return field + " must be alpha";
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
                                "\.",
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

                validators.push(function(record) {
                    if (typeof record[field] === "undefined" || record[field] === null) return;
                    if (!record[field].match(regex)) {
                        return message || field + " failed validation";
                    }
                });
                return this;
            },

            /* Predicate Validators */
            Must: function(func) {
                validators.push(function(record) {
                    if (!func(record[field],record)) {
                        return message || field + " failed validation";
                    }
                });
                return this;  
            },

            /* Date Validators */
            IsInPast: function() {
                validators.push(function(record) {
                    if (typeof record[field] === "undefined") return;

                    if (new Date(record[field]).getTime() > new Date().getTime()) {
                        return field + " cannot be in the future";
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
            validate: function(record) {
                var errors = [],
                    i,
                    validator,
                    error;

                if (condition(record)) {
                    for(i=0;i<validators.length;i++) {
                        validator = validators[i];
                        error = validator(record);
                        if (error) {
                            errors.push({property: field, message: error});
                        }
                    }
                }

                return errors;
            }
        };
    }

    var Validate = {
        validate: function() {
            var i,
                rules = this.rules(Check),
                errors = [];

            for(i=0;i<rules.length;i++) {
                var rule = rules[i];
                var failures = rule.validate(this);
                if (failures.length > 0) {
                    errors = errors.concat(failures)
                }
            }

            if (errors.length > 0) {
                return errors;
            }
        }
    };

    Spine.Validate = Validate;
})(Spine);