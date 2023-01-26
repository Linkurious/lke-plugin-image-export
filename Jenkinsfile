@Library('linkurious-shared')_

nodeJob {
  // General
  projectName = "linkurious/lke-plugin-image-export"
  parameterList = [
    string(name: 'run', defaultValue: '', description: 'Run Id'),
    string(name: 'testomatio', defaultValue: 'ayv1ac1b32he', description: 'Testomatio API'),
    string(name: 'grep', defaultValue: '', description: 'Run specific tests'),
  ]
  runBenchTests = true
  runPreReleaseOnUpload = false
  runDependencyVersionCheck = false
  npmPackPath = './dist'
  createGitTag = true
  gitTagPrefix = 'v'
  runBookeeping = true

  //static asset upload
  runPrivateNpmPublish = false
  binaries = ["lke-plugin-image-export.lke"]
  groupId = 'com.linkurious.plugins'

  githubRelease = true

}
