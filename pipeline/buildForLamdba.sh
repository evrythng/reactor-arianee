set -eu

FILE="bundleLambda.zip"

rm -f $FILE

# Zip all rules, they will be selected at runtime
zip -vr $FILE ./package.json ./main.js ./.env ./node_modules ./__evt-runner.js > /dev/null

printf "\nCreated bundleLambda.zip\n"