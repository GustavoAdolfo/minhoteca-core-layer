variable "node_runtime" {
  type    = string
  default = "nodejs22.x"
}
variable "compatible_architectures" {
  type    = list(string)
  default = ["x86_64"]
}
