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
    'moment.isBefore': `must be before {{#date}}, with precision "{{#precision}}"`,
    'moment.isAfter': `must be after {{#date}}, with precision "{{#precision}}"`,
    'moment.isSameOrBefore': `must be same as or before {{#date}}, with precision "{{#precision}}"`,
    'moment.isSameOrAfter': `must be same as or after {{#date}}, with precision "{{#precision}}"`,
  },
  coerce(value, helpers) {

    //No value
    if (!value) {
      return;
    }

    //Convert to moment
    value = moment(value, moment.ISO_8601);

    //If invalid at this stage, return as is
    if (!value.isValid()) {
      return;
    }

    //Get flags
    const tz = helpers.schema.$_getFlag('tz');
    const startOf = helpers.schema.$_getFlag('startOf');
    const endOf = helpers.schema.$_getFlag('endOf');
    const max = helpers.schema.$_getFlag('max');
    const min = helpers.schema.$_getFlag('min');

    //Apply a timezone
    if (tz) {
      value.tz(tz);
    }

    //Start of period
    if (startOf) {
      value.startOf(startOf);
    }

    //End of period
    if (endOf) {
      value.endOf(endOf);
    }

    //Min date
    if (min && value.isBefore(min)) {
      value = min;
    }

    //Max date
    if (max && value.isAfter(max)) {
      value = max;
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
      method(max) {
        return this.$_setFlag('max', max);
      },
    },
    minDate: {
      method(min) {
        return this.$_setFlag('min', min);
      },
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
          assert: (value) => typeof value === 'string' || moment.isMoment(value),
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
          assert: (value) => typeof value === 'string' || moment.isMoment(value),
          message: 'must be a date string or moment object',
        },
        {
          name: 'precision',
          assert: (value) => typeof value === 'string',
          message: 'must be a string',
        },
      ],
      validate(value, helpers, args, options) {
        let {date, precision} = args;
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
          name: 'isBefore',
          args: {date, precision},
        });
      },
      args: [
        {
          name: 'date',
          ref: true,
          assert: (value) => typeof value === 'string' || moment.isMoment(value),
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
          name: 'isAfter',
          args: {date, precision},
        });
      },
      args: [
        {
          name: 'date',
          ref: true,
          assert: (value) => typeof value === 'string' || moment.isMoment(value),
          message: 'must be a date string or moment object',
        },
        {
          name: 'precision',
          assert: (value) => typeof value === 'string',
          message: 'must be a string',
        },
      ],
      validate(value, helpers, args, options) {
        let {date, precision} = args;
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
