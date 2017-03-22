const State = require('./mixins/state');
const PathUtils = require('../pathutils');
const mixins = require('./mixins/mixins');
const Runner = require('./mixins/runner');
const InputFilter = require('./mixins/inputfilter');
const OutputFilter = require('./mixins/outputfilter');


class Wait extends mixins(Runner, InputFilter, OutputFilter, State) {

    constructor(name, spec, factory) {
        super(name, spec, factory);

        const { Seconds, SecondsPath, Timestamp, TimestampPath } = spec;
        this.seconds = Seconds;
        this.secondsPath = SecondsPath;
        this.timestamp = Timestamp;
        this.timestampPath = TimestampPath;
    }

    run(input) {
        const filtered = this.filterInput(input);
        
        return super.run(filtered)
            .then(result => this.filterOutput(result))
            .then(result => this.continue(result));
    }

    _run(input) {
        // Since there can only ever be one of these set, this code could
        // probably stand to be tightened up a bit.
        const { timestampPath, secondsPath } = this;
        let { timestamp, seconds } = this;
        let milliseconds = 0;

        if (typeof timestampPath === 'string') {
            timestamp = PathUtils.query(input, timestampPath);
        }

        if (typeof secondsPath === 'string') {
            seconds = PathUtils.query(input, secondsPath);
        }

        if (typeof timestamp === 'string') {
            const then = new Date(timestamp);
            milliseconds = then - Date.now();
        }

        if (typeof seconds === 'number') {
            milliseconds = seconds * 1000;
        }

        return new Promise(resolve => {
            setTimeout(resolve, milliseconds, input);
        });
    }

}


module.exports = Wait;
