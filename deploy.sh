#!/usr/bin/env bash
# =============================================================================
# MediaTracker - AWS Zero to Shipped Deploy Script
#
# Prerequisites:
#   1. AWS CLI installed and configured (aws configure)
#   2. AWS SAM CLI installed
#   3. AWS account with Free Tier
#
# This script deploys the full backend stack:
#   - 3 DynamoDB tables
#   - Lambda function (container image)
#   - API Gateway HTTP API
#
# Run:  ./deploy.sh
# =============================================================================
set -euo pipefail

STACK_NAME="media-tracker"
REGION="${AWS_REGION:-us-east-1}"
ENV="${ENVIRONMENT:-dev}"
JWT_SECRET="${JWT_SECRET:-$(openssl rand -hex 32)}"
ALLOWED_ORIGIN="${ALLOWED_ORIGIN:-\*}"

echo "==> Deploying MediaTracker stack '$STACK_NAME' to $REGION (env=$ENV)"

# Build only the Lambda function image (SamCliBuild uses the Dockerfile)
sam build --use-container

# Deploy with guided parameters / config
sam deploy \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
    "Environment=$ENV JWTSecret=$JWT_SECRET AllowedOrigin=$ALLOWED_ORIGIN" \
  --no-confirm-changeset

echo ""
echo "==> Deployment complete."
echo "==> API URL:"
sam list stack-outputs --stack-name "$STACK_NAME" --region "$REGION" 2>/dev/null \
  || aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$REGION" \
     --query "Stacks[0].Outputs" --output table

echo ""
echo "==> Next steps:"
echo "    1. Set VITE_API_URL in Amplify to the API URL above"
echo "    2. Deploy the frontend via Amplify Hosting (see amplify.yml)"