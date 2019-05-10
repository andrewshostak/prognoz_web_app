#!/usr/bin/env bash

# Exit if any errors are hit (any non-zero responses)
set -e

# Copy files via scp
scp -r ~/prognoz_v2_angular/dist root@46.101.159.170:/var/www/tmp-ui

# Change rights and move to files
ssh root@46.101.159.170 'sudo chown -R root:www-data /var/www/tmp-ui/ && rm -rf /var/www/ui/dist && mv /var/www/tmp-ui/dist/ /var/www/ui/dist/'
