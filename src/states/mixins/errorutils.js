

function lookup(errorCode) {
    return function find(rule, index, rules) {
        const { ErrorEquals } = rule;

        if (ErrorEquals.includes(errorCode)) {
            return true;
        }

        /**
         * 'The reserved name “States.ALL” appearing in a Retrier/Catcher's
         * “ErrorEquals” field is a wild-card and matches any Error Name.
         * Such a value MUST appear alone in the “ErrorEquals” array and MUST
         * appear in the last Retrier/Catcher in the “Catch”/"Retry" array.'
         *
         * TODO: See if this rule can be enforced during validation.
         */
        if (index === rules.length - 1 && ErrorEquals.length === 1 && ErrorEquals[0] === 'States.ALL') {
            return true;
        }

        return false;
    };
};


module.exports = {

    match(rules, errorCode, fallback) {
        const fn = lookup(errorCode);
        return rules.find(fn) || fallback;
    },

    toErrorOutput(error) {
        if (error instanceof Error) {
            return {
                Error: error.message,
                Cause: error.stack,
            };
        }

        if (typeof error === 'string') {
            return wrap(new Error(error));
        }

        return error;
    }

};
