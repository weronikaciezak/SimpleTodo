pipeline {
    agent any
    options {
        skipDefaultCheckout()
    }
    environment {
        DB_USER = credentials('db-user')
        DB_PASS = credentials('db-pass')
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

        stage('Create .env file') {
            steps {
                script {
                    def envContent = """
                    DB_USER=${env.DB_USER}
                    DB_PASS=${env.DB_PASS}
                    """

                    writeFile file: '.env', text: envContent
                }
            }
        }

        stage('Build') {
            steps {
                sh 'docker build -t licencjat:latest .'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker-compose down'
                sh 'docker-compose up -d'
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
