const State = require('./mixins/state');
const PathUtils = require('../pathutils');
const mixins = require('./mixins/mixins');
const Runner = require('./mixins/runner');
const InputFilter = require('./mixins/inputfilter');
const OutputFilter = require('./mixins/outputfilter');


class Wait extends mixins(Runner, InputFilter, OutputFilter, State) {

    static create(name, spec, factory) {
        const { Seconds, SecondsPath, Timestamp, TimestampPath, Next, End = false } = spec;

        const wait = new Wait(name, spec);
        wait.seconds = Seconds;
        wait.secondsPath = SecondsPath;
        wait.timestamp = Timestamp;
        wait.timestampPath = TimestampPath;

        // Initialize the Runner mixin properties.
        wait.next = factory.build(Next);
        wait.end = End;
        
        return wait;
    }

    constructor(name, spec) {
        super(name, spec);
        this.seconds = undefined;
        this.secondsPath = undefined;
        this.timestamp = undefined;
        this.timestampPath = undefined;
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
