resource "aws_lambda_layer_version" "coreLayer" {
  layer_name               = "minhoteca-core-layer"
  compatible_runtimes      = [var.node_runtime]
  description              = "Lambda Layer Core do projeto Minhoteca"
  compatible_architectures = var.compatible_architectures
  filename                 = data.archive_file.core_layer_pack.output_path
  source_code_hash         = data.archive_file.core_layer_pack.output_base64sha256
  depends_on = [
    data.external.core_layer_version,
  ]
  lifecycle {
    create_before_destroy = true
  }
}

data "external" "core_layer_version" {
  program = ["node", "${path.module}/../../../layer/nodejs/version.mjs"]
}

data "archive_file" "core_layer_pack" {
  type        = "zip"
  source_dir  = "${path.module}/../../../layer/nodejs/dist_layer"
  output_path = "${path.module}/core_layer.zip"
}
