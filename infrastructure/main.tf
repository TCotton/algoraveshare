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
    Purpose     = "S3 access logs"
  }
}

# -----------------------------------------------
# 2. Main S3 Bucket
# -----------------------------------------------
resource "aws_s3_bucket" "main_bucket" {
  bucket = "myapp-prod-uploads-eu-west-1"

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  object_ownership = "BucketOwnerEnforced"

  tags = {
    Name        = "myapp-prod-uploads"
    Environment = "prod"
    ManagedBy   = "Terraform"
    Project     = "MyApp"
    Storage     = "S3 Glacier Instant Retrieval"
  }
}

# -----------------------------------------------
# 3. Default Encryption (SSE-S3 / AES-256)
# -----------------------------------------------
resource "aws_s3_bucket_server_side_encryption_configuration" "main_bucket_encryption" {
  bucket = aws_s3_bucket.main_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# -----------------------------------------------
# 4. Versioning
# -----------------------------------------------
resource "aws_s3_bucket_versioning" "main_bucket_versioning" {
  bucket = aws_s3_bucket.main_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}

# -----------------------------------------------
# 5. Logging
# -----------------------------------------------
resource "aws_s3_bucket_logging" "main_bucket_logging" {
  bucket = aws_s3_bucket.main_bucket.id

  target_bucket = aws_s3_bucket.log_bucket.id
  target_prefix = "logs/"
}

# -----------------------------------------------
# 6. Lifecycle Rule → Move all objects to GLACIER_IR
# -----------------------------------------------
resource "aws_s3_bucket_lifecycle_configuration" "main_bucket_lifecycle" {
  bucket = aws_s3_bucket.main_bucket.id

  rule {
    id     = "move-to-glacier-instant"
    status = "Enabled"

    transition {
      days          = 0
      storage_class = "GLACIER_IR" # Glacier Instant Retrieval
    }
  }
}

# -----------------------------------------------
# 7. Public Access Block
# -----------------------------------------------
resource "aws_s3_bucket_public_access_block" "main_bucket_block" {
  bucket = aws_s3_bucket.main_bucket.id

  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = true
  restrict_public_buckets = true
}

# -----------------------------------------------
# 8. Outputs
# -----------------------------------------------
output "bucket_name" {
  value = aws_s3_bucket.main_bucket.bucket
}

output "log_bucket_name" {
  value = aws_s3_bucket.log_bucket.bucket
}

