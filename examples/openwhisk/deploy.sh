#!/bin/bash

cd "${0%/*}"
wsk action update step_test_action action.js -i -u $__OW_API_KEY --apihost $__OW_API_HOST
