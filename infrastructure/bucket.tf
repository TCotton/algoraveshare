terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.5.0"
}

provider "aws" {
  region = "eu-west-1"
}

# -----------------------------------------------
# 1. Logging Bucket
# -----------------------------------------------
resource "aws_s3_bucket" "log_bucket" {
  bucket = "myapp-prod-logs-eu-west-1"

  acl = "log-delivery-write"

  tags = {
    Name        = "myapp-prod-logs"
    Environment = "prod"
    Purpose     = "CloudFront access logs"
  }
}

# -----------------------------------------------
# 2. Private S3 Bucket (Origin)
# -----------------------------------------------
resource "aws_s3_bucket" "main_bucket" {
  bucket = "myapp-prod-uploads-eu-west-1"

  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = true
  restrict_public_buckets = true

  object_ownership = "BucketOwnerEnforced"

  tags = {
    Name        = "myapp-prod-uploads"
    Environment = "prod"
    ManagedBy   = "Terraform"
    Project     = "MyApp"
  }
}

# Default encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "main_bucket_encryption" {
  bucket = aws_s3_bucket.main_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Versioning
resource "aws_s3_bucket_versioning" "main_bucket_versioning" {
  bucket = aws_s3_bucket.main_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}

# -----------------------------------------------
# 3. CloudFront Origin Access Control (OAC)
# -----------------------------------------------
resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "myapp-oac"
  description                       = "OAC for CloudFront to securely access S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# -----------------------------------------------
# 4. CloudFront Distribution
# -----------------------------------------------
resource "aws_cloudfront_distribution" "cdn" {
  enabled             = true
  default_root_object = "index.html"

  origin {
    domain_name = aws_s3_bucket.main_bucket.bucket_regional_domain_name
    origin_id   = "S3Origin"

    s3_origin_config {
      origin_access_identity = "" # Not used with OAC
    }

    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  default_cache_behavior {
    target_origin_id       = "S3Origin"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]

    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6" # Managed-CachingOptimized
    compress        = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  logging_config {
    include_cookies = false
    bucket          = aws_s3_bucket.log_bucket.bucket_domain_name
    prefix          = "cloudfront-logs/"
  }

  tags = {
    Environment = "prod"
    ManagedBy   = "Terraform"
  }
}

# -----------------------------------------------
# 5. Bucket Policy for OAC
# -----------------------------------------------
data "aws_caller_identity" "current" {}

resource "aws_s3_bucket_policy" "main_bucket_policy" {
  bucket = aws_s3_bucket.main_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontServicePrincipalReadOnly"
        Effect    = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.main_bucket.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.cdn.arn
          }
        }
      }
    ]
  })
}

# -----------------------------------------------
# 6. Outputs
# -----------------------------------------------
output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.cdn.domain_name
}

output "bucket_name" {
  value = aws_s3_bucket.main_bucket.bucket
}
