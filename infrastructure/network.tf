module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  name   = "fargate-vpc"
  cidr   = "10.0.0.0/16"

  azs             = ["us-west-1a", "us-west-1c"]
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets = ["10.0.3.0/24", "10.0.4.0/24"]
}
