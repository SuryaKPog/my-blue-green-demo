pipeline {
  agent any

  environment {
    BLUE_IMAGE  = "suryakpmax/myapp-blue"
    GREEN_IMAGE = "suryakpmax/myapp-green"
    DOCKER_CREDS = 'dockerhub-creds'    // ensure this credential exists in Jenkins
    COLOR = "green"                      // traffic target for manual switch
  }

  stages {
    stage('Prepare') {
      steps {
        script {
          echo "Using workspace: ${env.WORKSPACE}"
        }
      }
    }

    stage('Build Blue') {
      steps {
        echo "Building blue image..."
        sh "docker build -t ${BLUE_IMAGE}:${BUILD_NUMBER} ./app-blue"
      }
    }

    stage('Build Green') {
      steps {
        echo "Building green image..."
        sh "docker build -t ${GREEN_IMAGE}:${BUILD_NUMBER} ./app-green"
      }
    }

    stage('Push Images') {
      steps {
        withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker push ${BLUE_IMAGE}:${BUILD_NUMBER} || true
            docker tag ${BLUE_IMAGE}:${BUILD_NUMBER} ${BLUE_IMAGE}:latest || true
            docker push ${BLUE_IMAGE}:latest || true

            docker push ${GREEN_IMAGE}:${BUILD_NUMBER} || true
            docker tag ${GREEN_IMAGE}:${BUILD_NUMBER} ${GREEN_IMAGE}:latest || true
            docker push ${GREEN_IMAGE}:latest || true
          '''
        }
      }
    }

    stage('Deploy Green (staging)') {
      steps {
        echo "Deploying green image ${GREEN_IMAGE}:${BUILD_NUMBER} to k8s"
        sh "kubectl set image deployment/myapp-green myapp=${GREEN_IMAGE}:${BUILD_NUMBER} --record || true"
        sh "kubectl rollout status deployment/myapp-green --timeout=120s || true"
      }
    }

    stage('Manual Switch') {
      steps {
        input message: "Switch traffic to ${COLOR} ${BUILD_NUMBER}?"
        echo "Switching service selector to color=${COLOR}"
        // safe JSON quoting — expands ${COLOR}
        sh "kubectl patch service myapp-service --type=merge -p '{\"spec\":{\"selector\":{\"app\":\"myapp\",\"color\":\"${COLOR}\"}}}'"
        sh "kubectl get svc myapp-service -o yaml"
      }
    }
  } // end stages

  post {
    success {
      sh 'kubectl get pods -l app=myapp -o wide || true'
      sh 'kubectl get svc myapp-service -o yaml || true'
      echo "Pipeline finished successfully"
    }
    failure {
      echo "Pipeline failed"
    }
  }
}
