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
  npmPackPath = './dist'

  //Deployement
  runDeploy = false
  ansibleTags = "playbook::infra::docker::up"
}
