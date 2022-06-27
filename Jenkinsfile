@Library('linkurious-shared')_

nodeJob {
  // General
  projectName = "lke-plugin-image-export"
  parameterList = [
    string(name: 'run', defaultValue: '', description: 'Run Id'),
    string(name: 'testomatio', defaultValue: 'ayv1ac1b32he', description: 'Testomatio API'),
    string(name: 'grep', defaultValue: '', description: 'Run specific tests'),
  ]
  runBenchTests = true
  runPreReleaseOnUpload = false
  npmPackPath = './dist'
  binaries = ["lke-plugin-image-export.lke"]
}
