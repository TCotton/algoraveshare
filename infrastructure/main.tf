terraform {
  required_version = ">= 1.5.0"
}

provider "null" {}

resource "null_resource" "placeholder" {
  provisioner "local-exec" {
    command = "echo 'infrastructure placeholder'"
  }
}
