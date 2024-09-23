resource "aws_rds_cluster" "web_api_aurora_postgres" {
  cluster_identifier      = "web-api-aurora-postgres"
  engine                  = "aurora-postgresql"
  engine_version          = "15.4" # Specify the version you want
  database_name           = "webapidb"
  master_username         = "dbuser"
  master_password         = "dbpassword"
  skip_final_snapshot     = true
  apply_immediately       = true
  vpc_security_group_ids  = [aws_security_group.rds_sg.id]
  db_subnet_group_name    = aws_db_subnet_group.rds_subnet_group.name
  backup_retention_period = 7
  preferred_backup_window = "02:00-03:00"
}

resource "aws_rds_cluster_instance" "web_api_aurora_postgres_instance" {
  identifier          = "web-api-aurora-postgres-instance"
  cluster_identifier  = aws_rds_cluster.web_api_aurora_postgres.id
  instance_class      = "db.t3.medium"
  engine              = "aurora-postgresql"
  publicly_accessible = true
  apply_immediately   = true
}

resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "rds-subnet-group"
  subnet_ids = module.vpc.private_subnets
}
