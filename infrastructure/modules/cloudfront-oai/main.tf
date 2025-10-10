resource "aws_cloudfront_origin_access_identity" "this" {
  comment = "OAI for ${var.environment} CloudFront distribution"
}

resource "aws_cloudfront_distribution" "this" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CloudFront distribution for ${var.environment}"
  default_root_object = "index.html"

  origin {
    domain_name = var.s3_bucket_regional_domain_name
    origin_id   = "s3-origin-${var.environment}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.this.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "s3-origin-${var.environment}"

    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = merge(
    {
      "Environment" = var.environment
      "Name"        = "cloudfront-${var.environment}"
    },
    var.tags
  )
}

# Grant OAI access to the S3 bucket
resource "aws_s3_bucket_policy" "allow_cloudfront" {
  bucket = var.s3_bucket_name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontRead"
        Effect    = "Allow"
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.this.iam_arn
        }
        Action    = ["s3:GetObject"]
        Resource  = "${var.s3_bucket_arn}/*"
      }
    ]
  })
}