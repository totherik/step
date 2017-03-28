#!/bin/bash


FILE=env.sh
CONTENTS=$(cat <<-EOM
#!/bin/bash

# Prepare the environment to mimick OpenWhisk runtime.
export __OW_API_KEY={api_key}
export __OW_API_HOST={api_host}
EOM
)


if [ ! -f $FILE ]; then
    echo "$CONTENTS" > $FILE
    echo 'To setup the environment for testing, set the appropriate values in env.sh.'
    exit 1
fi


# Initialize env variables. (Used by the )
source $FILE

# Ensure we're using the right Node runtime version.
source ~/.nvm/nvm.sh
nvm use
