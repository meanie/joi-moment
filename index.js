/* eslint no-unused-vars: off */
'use strict';

/**
 * Dependencies
 */
const moment = require('moment-timezone');

/**
 * Extend Joi with moment date handling
 */
module.exports = Joi => ({
  base: Joi.any(),
  name: 'moment',
  language: {
    isBefore: `must be before {{date}}, with precision "{{precision}}"`,
    isAfter: `must be after {{date}}, with precision "{{precision}}"`,
  },
  coerce(value, state, options) {

    //No value
    if (!value) {
      return value;
    }

    //Convert to moment
    value = moment(value, moment.ISO_8601);

    //Not valid
    if (!value.isValid()) {
      return this.createError('date.iso', {value}, state, options);
    }

    //Return result
    return value;
  },
  rules: [
    {
      name: 'tz',
      params: {
        tz: Joi.string(),
      },
      validate(params, value, state, options) {
        if (!value) {
          return value;
        }
        return value.tz(params.tz);
      },
    },
    {
      name: 'startOf',
      params: {
        startOf: Joi.string(),
      },
      validate(params, value, state, options) {
        if (!value) {
          return value;
        }
        return value.startOf(params.startOf);
      },
    },
    {
      name: 'endOf',
      params: {
        endOf: Joi.string(),
      },
      validate(params, value, state, options) {
        if (!value) {
          return value;
        }
        return value.endOf(params.endOf);
      },
    },
    {
      name: 'isBefore',
      params: {
        date: Joi.string(),
        precision: Joi.string(),
      },
      validate(params, value, state, options) {
        let {date, precision} = params;
        if (!moment.isMoment(value)) {
          return value;
        }
        if (Joi.isRef(date)) {
          date = date(state.reference || state.parent, options);
          if (!(date instanceof Date) && !moment.isMoment(date)) {
            return value;
          }
        }
        if (value.isBefore(date, precision)) {
          return value;
        }
        if (!precision) {
          precision = 'milliseconds';
        }
        return this.createError('moment.isBefore', {
          value, date, precision,
        }, state, options);
      },
    },
    {
      name: 'isAfter',
      params: {
        date: Joi.alternatives([
          Joi.func().ref(),
          Joi.date().iso(),
        ]),
        precision: Joi.string(),
      },
      validate(params, value, state, options) {
        let {date, precision} = params;
        if (!moment.isMoment(value)) {
          return value;
        }
        if (Joi.isRef(date)) {
          date = date(state.reference || state.parent, options);
          if (!(date instanceof Date) && !moment.isMoment(date)) {
            return value;
          }
        }
        if (value.isAfter(date, precision)) {
          return value;
        }
        if (!precision) {
          precision = 'milliseconds';
        }
        return this.createError('moment.isAfter', {
          value, date, precision,
        }, state, options);
      },
    },
  ],
});
