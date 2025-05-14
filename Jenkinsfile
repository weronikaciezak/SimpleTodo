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
                    branch: 'env',
                    credentialsId: 'GitHub'
            }
        }

        stage('Build and Deploy') {
            steps {
                sh 'cp "$ENV" .env'
                sh 'docker-compose down'
                sh 'docker-compose up -d --build'
            }
        }
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
