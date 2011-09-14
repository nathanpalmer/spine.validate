(function(Spine) {
    var Check = function(field) {
        var validators = [];
        var condition = function() { return true; };
        var message;

        return {
            Between: function(min,max) {
                validators.push(function(record) {
                    if (typeof record[field] === "undefined") return;
                    
                    if (record[field] < min || record[field] > max) {
                        return field + " is not between " + min + " and " + max;
                    }
                });
                return this;
            },

            Equals: function(value) {
                validators.push(function(record) {
                    if (typeof record[field] === "undefined") return;

                    if (record[field] !== value) {
                        return field + " does not equal " + value;
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

            Optional: function() {
                condition = function(record) {
                    return record[field] !== undefined && record[field].length > 0;
                };
                return this;
            },

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

            Must: function(func) {
                validators.push(function(record) {
                    if (!func(record[field])) {
                        return message || field + " failed validation";
                    }
                });
                return this;  
            },

            If: function(func) {
                condition = func;
                return this;
            },

            MaxLength: function(len) {
                validators.push(function(record) {
                    if (typeof record[field] === "undefined" || record[field].length > len) {
                        return field + " must be less than " + len + " characters";
                    }
                });
                return this;
            },

            MinLength: function(len) {
                validators.push(function(record) {
                    if (typeof record[field] === "undefined" || record[field].length < len) {
                        return field + " must be greater than " + len + " characters";
                    }
                });
                return this;
            },

            Length: function(len) {
                validators.push(function(record) {
                    if (typeof record[field] === "undefined" || record[field].length !== len) {
                        return field + " must be " + len + " characters";
                    }
                });
                return this;
            },

            IsInPast: function() {
                validators.push(function(record) {
                    if (typeof record[field] === "undefined") return;

                    if (new Date(record[field]).getTime() > new Date().getTime()) {
                        return field + " cannot be in the future";
                    }
                });
                return this;
            },

            Message: function(msg) {
                message = msg;
                return this;
            },

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