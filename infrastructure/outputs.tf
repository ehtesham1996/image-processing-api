output "alb_dns" {
  value = aws_lb.web_api_lb.dns_name
}