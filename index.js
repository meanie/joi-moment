'use strict';

/**
 * Dependencies
 */
const moment = require('moment-timezone');

/**
 * Extend Joi with moment date handling
 */
module.exports = Joi => ({
  type: 'moment',
  base: Joi.any(),
  messages: {
    'moment.isBefore': `must be before {{#date}}"`,
    'moment.isAfter': `must be after {{#date}}"`,
    'moment.isSameOrBefore': `must be same as or before {{#date}}"`,
    'moment.isSameOrAfter': `must be same as or after {{#date}}"`,
  },
  coerce(value, {schema, state, prefs}) {

    //No value
    if (!value) {
      return;
    }

    //Convert to moment
    if (!moment.isMoment(value)) {
      value = moment(value, moment.ISO_8601);
    }

    //If invalid at this stage, return as is
    if (!value.isValid()) {
      return;
    }

    //Get flags
    const tz = schema.$_getFlag('tz');
    const startOf = schema.$_getFlag('startOf');
    const endOf = schema.$_getFlag('endOf');
    let maxDate = schema.$_getFlag('maxDate');
    let minDate = schema.$_getFlag('minDate');

    //Resolve references
    if (Joi.isRef(minDate)) {
      minDate = minDate.resolve(value, state, prefs);
    }
    if (Joi.isRef(maxDate)) {
      maxDate = maxDate.resolve(value, state, prefs);
    }

    //Apply a timezone
    if (tz) {
      value.tz(tz);
    }
    else if (prefs.context.timezone) {
      value.tz(prefs.context.timezone);
    }

    //Start/end of period
    if (startOf) {
      value.startOf(startOf);
    }
    if (endOf) {
      value.endOf(endOf);
    }

    //Min/max date
    if (minDate && value.isBefore(minDate)) {
      value = minDate;
    }
    if (maxDate && value.isAfter(maxDate)) {
      value = maxDate;
    }

    //Return value
    return {value};
  },
  validate(value, helpers) {

    //No value
    if (!value) {
      return value;
    }

    //Invalid date provided
    if (!value.isValid()) {
      const errors = helpers.error('date.iso');
      return {value, errors};
    }
  },
  rules: {
    tz: {
      method(tz) {
        return this.$_setFlag('tz', tz);
      },
    },
    startOf: {
      method(startOf) {
        return this.$_setFlag('startOf', startOf);
      },
    },
    endOf: {
      method(endOf) {
        return this.$_setFlag('endOf', endOf);
      },
    },
    maxDate: {
      method(maxDate) {
        return this.$_setFlag('maxDate', maxDate);
      },
    },
    minDate: {
      method(minDate) {
        return this.$_setFlag('minDate', minDate);
      },
      // args: [
      //   {
      //     name: 'minDate',
      //     ref: true,
      //     assert: (value) => (
      //       !value || moment.isMoment(value)
      //     ),
      //     message: 'must be a moment object',
      //   },
      // ],
    },
    isBefore: {
      method(date, precision) {
        return this.$_addRule({
          name: 'isBefore',
          args: {date, precision},
        });
      },
      args: [
        {
          name: 'date',
          ref: true,
          assert: (value) => (
            !value || typeof value === 'string' || moment.isMoment(value)
          ),
          message: 'must be a date string or moment object',
        },
        {
          name: 'precision',
          assert: (value) => typeof value === 'string',
          message: 'must be a string',
        },
      ],
      validate(value, helpers, args) {
        let {date, precision} = args;
        if (!date) {
          return value;
        }
        if (!precision) {
          precision = 'milliseconds';
        }
        if (typeof date === 'string') {
          date = moment(date, moment.ISO_8601);
        }
        if (!moment.isMoment(value) || value.isBefore(date, precision)) {
          return value;
        }
        return helpers.error('moment.isBefore', {date, precision});
      },
    },
    isAfter: {
      method(date, precision) {
        return this.$_addRule({
          name: 'isAfter',
          args: {date, precision},
        });
      },
      args: [
        {
          name: 'date',
          ref: true,
          assert: (value) => (
            !value || typeof value === 'string' || moment.isMoment(value)
          ),
          message: 'must be a date string or moment object',
        },
        {
          name: 'precision',
          assert: (value) => typeof value === 'string',
          message: 'must be a string',
        },
      ],
      validate(value, helpers, args) {
        let {date, precision} = args;
        if (!date) {
          return value;
        }
        if (!precision) {
          precision = 'milliseconds';
        }
        if (typeof date === 'string') {
          date = moment(date, moment.ISO_8601);
        }
        if (!moment.isMoment(value) || value.isAfter(date, precision)) {
          return value;
        }
        return helpers.error('moment.isAfter', {date, precision});
      },
    },
    isSameOrBefore: {
      method(date, precision) {
        return this.$_addRule({
          name: 'isSameOrBefore',
          args: {date, precision},
        });
      },
      args: [
        {
          name: 'date',
          ref: true,
          assert: (value) => (
            !value || typeof value === 'string' || moment.isMoment(value)
          ),
          message: 'must be a date string or moment object',
        },
        {
          name: 'precision',
          assert: (value) => typeof value === 'string',
          message: 'must be a string',
        },
      ],
      validate(value, helpers, args) {
        let {date, precision} = args;
        if (!date) {
          return value;
        }
        if (!precision) {
          precision = 'milliseconds';
        }
        if (typeof date === 'string') {
          date = moment(date, moment.ISO_8601);
        }
        if (!moment.isMoment(value) || value.isSameOrBefore(date, precision)) {
          return value;
        }
        return helpers.error('moment.isSameOrBefore', {date, precision});
      },
    },
    isSameOrAfter: {
      method(date, precision) {
        return this.$_addRule({
          name: 'isSameOrAfter',
          args: {date, precision},
        });
      },
      args: [
        {
          name: 'date',
          ref: true,
          assert: (value) => (
            !value || typeof value === 'string' || moment.isMoment(value)
          ),
          message: 'must be a date string or moment object',
        },
        {
          name: 'precision',
          assert: (value) => typeof value === 'string',
          message: 'must be a string',
        },
      ],
      validate(value, helpers, args) {
        let {date, precision} = args;
        if (!date) {
          return value;
        }
        if (!precision) {
          precision = 'milliseconds';
        }
        if (typeof date === 'string') {
          date = moment(date, moment.ISO_8601);
        }
        if (!moment.isMoment(value) || value.isSameOrAfter(date, precision)) {
          return value;
        }
        return helpers.error('moment.isSameOrAfter', {date, precision});
      },
    },
  },
});
