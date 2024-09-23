resource "aws_ecr_repository" "web_api_ecr" {
  name                 = "web-api-repo"
  image_tag_mutability = "MUTABLE"
}

resource "aws_ecr_repository" "image_processing_ecr" {
  name                 = "image-processing-repo"
  image_tag_mutability = "MUTABLE"
}