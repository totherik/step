# OpenWhisk Example

1. Ensure your environment is setup.
```bash
$ . init.sh
Found '.nvmrc' with version <v6.9.1>
Now using node v6.9.1 (npm v3.10.8)
```

2. Deploy the test action.
```bash
$ ./examples/openwhisk/deploy.sh
ok: updated action step_test_action
```

3. Run the example.
```bash
$ node examples/machine.js
```
