pipeline {
    agent any
    options {
        skipDefaultCheckout()
    }

    environment {
        ENV = credentials('env')
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
                    branch: 'main'
//                     credentialsId: 'github_token'
            }
        }

        stage('Copy .env file') {
            steps {
                sh 'cp "$ENV" .env'
            }
        }

        stage('Build and Deploy') {
            steps {
                sh 'docker-compose down'
                sh 'docker-compose up -d --build'
            }
        }
    }

    post {
        success {
            echo 'Success'
        }
        failure {
            echo 'Failure'
        }
    }
}
