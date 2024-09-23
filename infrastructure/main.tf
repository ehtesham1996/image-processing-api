provider "aws" {
  region = "us-west-1"
}

data "aws_region" "current" {}
