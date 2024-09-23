resource "aws_cloudwatch_log_group" "web_api_log_group" {
  name = "/aws/ecs/web-api-log-group"
}

resource "aws_cloudwatch_log_group" "image_processing_log_group" {
  name = "/aws/ecs/image-processing-log-group"
}