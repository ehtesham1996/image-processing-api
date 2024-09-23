resource "aws_sqs_queue" "image_processing_dlq" {
  name                       = "image-processing-dlq"
  visibility_timeout_seconds = 30
  message_retention_seconds  = 1209600 # 14 days
}

resource "aws_sqs_queue" "image_processing_queue" {
  name                       = "image-processing-queue"
  visibility_timeout_seconds = 30
  message_retention_seconds  = 345600 # 4 days
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.image_processing_dlq.arn
    maxReceiveCount     = 3
  })
}

resource "aws_iam_policy" "ecs_task_sqs_policy" {
  name = "ecs-task-sqs-policy"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = ["sqs:ReceiveMessage", "sqs:SendMessage", "sqs:DeleteMessage"],
        Resource = aws_sqs_queue.image_processing_queue.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_sqs_policy_attachment" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.ecs_task_sqs_policy.arn
}

resource "aws_sqs_queue_policy" "s3_to_sqs_policy" {
  queue_url = aws_sqs_queue.image_processing_queue.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = "sqs:SendMessage"
        Effect   = "Allow"
        Resource = aws_sqs_queue.image_processing_queue.arn
        Principal = {
          Service = "s3.amazonaws.com"
        }
        Condition = {
          ArnLike = {
            "aws:SourceArn" = aws_s3_bucket.image_processing_bucket.arn
          }
        }
      }
    ]
  })
}