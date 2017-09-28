# watson
Winston http logger for Sherlock

# Example

```js
const watson = require('johnwatson')({ service: 'test', http: { level: 'error', host: 'requestb.in', path: '/10c40eu1', ssl: true } });

const err = new Error('Something went wrong');

watson.log('error', err.message, {
  env: process.env.NODE_ENV || 'dev',
  stack: err.stack,
  request: {}
});
```

Open [https://requestb.in/10c40eu1](https://requestb.in/10c40eu1)


**For production replace `host`, `path`, `ssl` properties to match a Sherlock instance.**
