pipeline {
    agent any
    options {
        skipDefaultCheckout()
    }

    stages {
        stage('Clean Workspace') {
            steps {
                 cleanWs()
            }
        }
        stage('Checkout') {
            steps {
                git url: 'https://github.com/weronikaciezak/SimpleTodo.git',
                    branch: 'main',
                    credentialsId: 'GitHub'
            }
        }

        stage('Build') {
            steps {
                sh 'docker build -t licencjat:latest .'
            }
        }

//         stage('Deploy') {
//             steps {
//                 sh 'docker-compose down'
//                 sh 'docker-compose up -d'
//             }
//         }
    }

    post {
        success {
            echo 'Deployment was successful!'
        }
        failure {
            echo 'There was an error during the build or deployment.'
        }
    }
}
