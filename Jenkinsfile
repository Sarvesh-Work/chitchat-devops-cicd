pipeline {
    agent any

    environment {
        GITHUB_REPO_URL = 'https://github.com/Sarvesh-Work/ci-cd-jenkins-next.js.git'
        GITHUB_REPO_BRANCH = 'main'
        SONAR_HOME = tool 'sonar-scanner'
        DOCKER_HUB_USERNAME = 'sarvesh9075'
        PROJECT_NAME = 'chitchat-chat-app'
    }

    stages {
        stage('Cleanup workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Git: Code checkout') {
            steps {
                echo 'Pulling the code'
                git url: "${GITHUB_REPO_URL}", branch: "${GITHUB_REPO_BRANCH}"
            }
        }

        stage('Trivy: File scan') {
            steps {
                echo 'Trivy scan started'
                sh 'trivy fs --exit-code 0 .'
            }
        }

        stage('OWASP: Dependency check') {
            steps {
                echo 'OWASP dependency check started'
                dependencyCheck(
                    additionalArguments: '--scan ./',
                    odcInstallation: 'dependency-check-OWASP'
                )
                dependencyCheckPublisher pattern: '**/dependency-check-report.html'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                    echo 'SonarQube code scan  started'

                    withSonarQubeEnv('sonarqube') {
                        sh """
                        ${SONAR_HOME}/bin/sonar-scanner \
                        -Dsonar.projectKey=chitchat \
                        -Dsonar.projectName=ChitChat \
                        -Dsonar.sources=.
                        """
                    }
            }
        }

        stage('SonarQube: Quality gate') {
            steps {
                echo 'Waiting for sonarqube quality gate result'
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Docker: Create docker image tag') {
            steps {
                echo 'Docker image tag creation'
                script {
                    env.VERSION = sh(
                    script: 'git describe --tags --abbrev=0',
                    returnStdout: true
                    ).trim()

                    env.GIT_SHA = sh(
                    script: 'git rev-parse --short HEAD',
                    returnStdout: true
                    ).trim()

                    env.DOCKER_IMAGE_TAG = "${env.VERSION}-${env.GIT_SHA}"

                    echo "Docker Tag: ${env.DOCKER_IMAGE_TAG}"
                }
            }
        }

        stage('Docker: Image build') {
            steps {
                echo 'Image build started'

                dir('client') {
                    sh "docker build -t ${DOCKER_HUB_USERNAME}/${PROJECT_NAME}-frontend:${DOCKER_IMAGE_TAG} ."
                }

                dir('server') {
                    sh "docker build -t ${DOCKER_HUB_USERNAME}/${PROJECT_NAME}-backend:${DOCKER_IMAGE_TAG}  ."
                }
            }
        }

        stage('Docker: push image to dockerhub') {
            steps {
                    withCredentials([usernamePassword(credentialsId:'docker-hub-cred', passwordVariable:'dockerhubpass', usernameVariable:'dockerhubuser')]) {
                        sh "echo ${dockerhubpass} | docker login -u ${dockerhubuser} --password-stdin"
                    }

                    sh "docker push ${DOCKER_HUB_USERNAME}/${PROJECT_NAME}-frontend:${DOCKER_IMAGE_TAG}"
                    sh "docker push ${DOCKER_HUB_USERNAME}/${PROJECT_NAME}-backend:${DOCKER_IMAGE_TAG}"
            }
        }
    }
}
