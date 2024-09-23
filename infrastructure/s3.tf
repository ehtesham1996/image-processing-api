resource "aws_s3_bucket" "image_processing_bucket" {
  bucket = "midas-lab-image-processing"
}

resource "aws_s3_bucket_notification" "image_bucket_notification" {
  bucket = aws_s3_bucket.image_processing_bucket.id

  queue {
    queue_arn     = aws_sqs_queue.image_processing_queue.arn
    events        = ["s3:ObjectCreated:*"]
    filter_prefix = "images/"
  }
}