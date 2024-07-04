# workerd modules sharing issue reproduction

This is a minimal reproduction showing that the fact that workerd can share its modules registry across
different workers can result in issues when there are modules that use module top level state to store
values.

This reproduction contains a simple `lib.js` module used by the entrypoint that relies on some top level
state to return a result to the caller, the usage of this state is interleaved by asynchronous operations
allowing worker runs race conditions.

> [!NOTE]
> This is a very unrealistic example, but it does shows the core issue at hand

## Reproduction

Install the dependencies:
```sh
$ npm i
```

run the tests:
```sh
$ npm test
```

as you can see, when making multiple parallel requests to the worker (both locally and in production)
the module's state can end up corrupted and not return the valid data (resulting in even data leakage
across worker runs)
