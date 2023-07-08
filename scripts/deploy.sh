#!/bin/bash

# Exit if any errors are hit (any non-zero responses)
set -e

# This is for ssh connection
ssh-keyscan -H ${SITE_SSH_HOST} >> ~/.ssh/known_hosts

# Copy files via scp
scp -r ~/prognoz_web_app/dist ${SITE_SSH_USER}@${SITE_SSH_HOST}:/var/www/tmp-ui

# Change rights and move to files
ssh ${SITE_SSH_USER}@${SITE_SSH_HOST} 'sudo chown -R root:www-data /var/www/tmp-ui/ && rm -rf /var/www/ui/dist && mv /var/www/tmp-ui/dist/ /var/www/ui/dist/'
