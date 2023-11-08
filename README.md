[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/conermurphy/cdk-tutorials/blob/main/LICENSE)

# AWS CDK Tutorials & Examples

Welcome to the AWS CDK Tutorials repository! Here, you'll find a collection of example projects and AWS Cloud Development Kit (CDK) stacks that demonstrate how to build and configure various technologies in AWS.

## Contents

- [Introduction](#introduction)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Current Tutorials](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This AWS CDK Tutorials repository serves as a learning resource for developers, DevOps engineers, and anyone interested in building infrastructure on AWS using the AWS CDK. Each example project is broken down into steps and has a linked blog post (in some cases a YouTube video as well) that show you everything you need to know about that project.

## Requirements

Before you follow along with one of the example projects, it's a good idea to get the following technologies setup and configured.

- [AWS CLI](https://aws.amazon.com/cli/)
- [AWS CDK](https://aws.amazon.com/cdk/)
- [Node.js](https://nodejs.org/)

## Getting Started

1. Find an example project you want to follow along with.
2. Read the linked blog post/watch the YouTube video.
3. Follow along with the code.
4. Integrate it into your own projects! 🚀

## Current Tutorials

This repository acts like a mono-repository, each folder in the root directory is a standalone project that contains everything needed to run that project.

Here is a current list of all of the projects covered by this repository.

- [Trigger a Lambda Function From Another Lambda Function Using an AWS EventBridge Event Bus](https://github.com/conermurphy/cdk-tutorials/tree/main/triggering-lambdas-eventbus)
- [Using Compression to Store Attribute Values in DynamoDB](https://github.com/conermurphy/cdk-tutorials/tree/main/dynamodb-compression)
- [Configuring Lambda Layers for Lambda Functions](https://github.com/conermurphy/cdk-tutorials/tree/main/lambda-layers)
- [Automating AWS CDK Stack Deployments with GitHub Actions](https://conermurphy.com/blog/automate-aws-cdk-stack-deployment-github-actions)
- [Scheduling Lambda Functions with cron Jobs](https://github.com/conermurphy/cdk-tutorials/tree/main/lambda-cron-job-trigger)
- [Scheduling events with the EventBridge Scheduler](https://github.com/conermurphy/cdk-tutorials/tree/main/eventbridge-scheduler)
- [Invoking Lambda Functions Via DNS Requests With a Route 53 Hosted Zone](https://github.com/conermurphy/cdk-tutorials/tree/main/route-53-dns-trigger-lambda)
- [AWS CDK Envrionment Variables Setup](https://github.com/conermurphy/cdk-tutorials/tree/main/stack-envs)
- [Updating a DNS Record on a Route 53 Hosted Zone Using a Lambda Function & AWS SDK](https://github.com/conermurphy/cdk-tutorials/tree/main/route-53-update-dns-record)
- [Custom CloudWatch Alarms with SNS Notifications for Detecting Error Messages](https://github.com/conermurphy/cdk-tutorials/tree/main/cloudwatch-alarms-sns-notifications)
- [Build a REST API Using API Gateway, Lambda, and DynamoDB With API Key Authentication](https://github.com/conermurphy/cdk-tutorials/tree/main/rest-api-with-api-key-auth)
- [Create a GraphQL API: Step-by-Step Guide with AppSync and DynamoDB](https://github.com/conermurphy/cdk-tutorials/tree/main/graphql-api)
- [Reducing Latency: Pre-Warming Lambda Functions with EventBridge Rules](https://github.com/conermurphy/cdk-tutorials/tree/main/pre-warming-lambdas-eventbridge-rules)
- [A Practical Guide to Creating a REST API for Sending Emails using AWS SES, API Gateway, and Lambda via AWS CDK](https://github.com/conermurphy/cdk-tutorials/tree/main/ses-send-email-api)
- [Building a GraphQL API With TypeScript Resolvers Using AWS AppSync and CDK](https://github.com/conermurphy/cdk-tutorials/tree/main/graphql-api-typescript-resolvers)
- [Throttling API Keys in an API Gateway REST API using Usage Plans](https://github.com/conermurphy/cdk-tutorials/tree/main/rest-api-api-key-throttling)

## Contributing

We welcome contributions to the CDK Tutorials repository! If you have any improvements, fixes, or new examples to add, please feel free to open a pull request. For major changes, please open an issue first to discuss the proposed changes.

To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch for your contribution.
3. Make your changes and commit them with descriptive commit messages.
4. Push your changes to your fork.
5. Open a pull request to the `main` branch of this repository.

## License

This project is licensed under the MIT License. Feel free to use, modify, and distribute this code as permitted by the license.

I hope you find this repository helpful in your journey to learn and grow with the AWS CDK and build powerful applications on AWS. If you have any questions or need further assistance, [please feel free to reach out to me.](https://conermurphy.com/contact)

Happy building! 🚀
