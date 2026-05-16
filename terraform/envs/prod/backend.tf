terraform {
  backend "s3" {
    bucket       = "projetos-terraform"
    key          = "core-layer.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}
