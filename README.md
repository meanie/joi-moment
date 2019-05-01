# @meanie/joi-moment

[![npm version](https://img.shields.io/npm/v/@meanie/joi-moment.svg)](https://www.npmjs.com/package/@meanie/joi-moment)
[![node dependencies](https://david-dm.org/meanie/joi-moment.svg)](https://david-dm.org/meanie/joi-moment)
[![github issues](https://img.shields.io/github/issues/meanie/joi-moment.svg)](https://github.com/meanie/joi-moment/issues)


A Joi extension to automatically convert ISO date strings to moment objects

![Meanie](https://raw.githubusercontent.com/meanie/meanie/master/meanie-logo-full.png)

### Features
- Validates incoming date values as ISO date strings
- Automatically converts date strings to `moment` objects
- Able to specify timezone and use modifiers like `startOf` or `endOf`
- Able to validate using moment functions like `isAfter` or `isBefore`

### Installation

```shell
#npm
npm install @meanie/joi-moment

#yarn
yarn add @meanie/joi-moment
```

### Usage
```js
const Joi = require('@hapi/joi');
const JoiMoment = require('@meanie/joi-moment');

module.exports = Joi.extend(JoiMoment);
```

### Examples

```js
const schema = Joi.object({
  startDate: Joi.moment().tz(timezone).startOf('day'),
  endDate: Joi.moment().tz(timezone).endOf('day').isAfter(Joi.ref('startDate')),
});
```

## Issues & feature requests

Please report any bugs, issues, suggestions and feature requests in the [meanie-moment-joi issue tracker](https://github.com/meanie/moment-joi/issues).

## Contributing

Pull requests are welcome! If you would like to contribute to Meanie, please check out the [Meanie contributing guidelines](https://github.com/meanie/meanie/blob/master/CONTRIBUTING.md).

## License

(MIT License)

Copyright 2019, [Adam Reis](http://adam.reis.nz)
