resource "aws_ecs_cluster" "cluster" {
  name = "ecs-cluster"
}

resource "aws_ecs_task_definition" "web_api_task" {
  family                   = "web-api"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name  = "web-api",
      image = "${aws_ecr_repository.web_api_ecr.repository_url}:latest",
      portMappings = [
        {
          containerPort = 80,
          hostPort      = 80
        }
      ],
      environment = [
        {
          name  = "PG_HOST",
          value = aws_rds_cluster_instance.web_api_aurora_postgres_instance.endpoint
        },
        {
          name  = "DB_NAME",
          value = aws_rds_cluster.web_api_aurora_postgres.database_name
        },
        {
          name  = "PG_PORT",
          value = "5432"
        },
        {
          name  = "DB_USERNAME",
          value = aws_rds_cluster.web_api_aurora_postgres.master_username
        },
        {
          name  = "DB_PASSWORD",
          value = aws_rds_cluster.web_api_aurora_postgres.master_password
        },
        {
          name  = "IMAGE_BUCKET",
          value = aws_s3_bucket.image_processing_bucket.id
        },
        {
          name  = "PORT",
          value = "80"
        },
        {
          name  = "AWS_REGION",
          value = data.aws_region.current.name
        }
      ],
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.web_api_log_group.name
          "awslogs-region"        = data.aws_region.current.name
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  task_role_arn = aws_iam_role.ecs_task_execution_role.arn
}

resource "aws_ecs_task_definition" "image_processing_task" {
  family                   = "image-processing-service"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name  = "image-processing-service",
      image = "${aws_ecr_repository.image_processing_ecr.repository_url}:latest",
      environment = [
        {
          name  = "SQS_QUEUE_URL",
          value = aws_sqs_queue.image_processing_queue.url
        },
        {
          name  = "SES_EMAIL_SOURCE",
          value = "ehteasham@gmail.com"
        },
        {
          name  = "SQS_POLLING_INTERVAL",
          value = "5000"
        },
        {
          name  = "AWS_REGION",
          value = data.aws_region.current.name
        },
        {
          name  = "IMAGE_NOTIFICATION_RECIPIENTS",
          value = "ehteasham@gmail.com"
        }
      ],
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.image_processing_log_group.name
          "awslogs-region"        = data.aws_region.current.name
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  task_role_arn = aws_iam_role.ecs_task_execution_role.arn
}

resource "aws_ecs_service" "web_api_service" {
  name            = "web-api-service"
  cluster         = aws_ecs_cluster.cluster.id
  task_definition = aws_ecs_task_definition.web_api_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = module.vpc.public_subnets
    security_groups  = [aws_security_group.rds_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.web_api_target_group.arn
    container_name   = "web-api"
    container_port   = 80
  }
}

resource "aws_ecs_service" "image_processing_service" {
  name            = "image-processing-service"
  cluster         = aws_ecs_cluster.cluster.id
  task_definition = aws_ecs_task_definition.image_processing_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = module.vpc.public_subnets
    security_groups  = [aws_security_group.rds_sg.id]
    assign_public_ip = true
  }
}