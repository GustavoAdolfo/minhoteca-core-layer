#!/bin/bash

TF_LOG=DEBUG && \
PIPENV=default && \
cd ../terraform/envs/prod && \
terraform init -migrate-state --backend-config=$PIPENV.conf || terraform init --backend-config=$PIPENV.conf -reconfigure || terraform init --backend-config=$PIPENV.conf
terraform fmt && \
terraform validate && \
terraform plan --var-file=terraform.tfvars 
terraform apply --var-file=terraform.tfvars -auto-approve -replace='module.deployment.random_string.random';
