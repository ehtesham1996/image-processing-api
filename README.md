# Image Upload & Processing Service

This project consists of two microservices:
1. **Web API Service**: Allows users to upload images and stores metadata in a Postgres database. It upload images to S3 Bucket `images` folder which then sends an SQS message to trigger image processing.
2. **Image Processing Service**: Listens to SQS messages, processes the uploaded image, and sends email notifications once the image is processed.

## Features
- **Image Upload to AWS S3**: Users can upload an image via the Web API.
- **Postgres Database**: Stores image metadata and comments.
- **Image Processing**: Receives SQS messages to process images (e.g., resizing) and sends email notifications to users.
- **AWS S3, SQS, SES Integration**: Uses AWS services for storage, queuing, and email notification.
- **Terraform**: Infrastructure code written in [Infrastructure](/infrastructure/) folder 

---

## Table of Contents

- [APIs](#apis)
  - [Add a New Image](#add-a-new-image)
  - [Add Comment to an Image](#add-comment-to-an-image)
- [How to Run Services Locally](#how-to-run-services-locally)
- [Deployment with Docker](#deployment-with-docker)
- [Infrastructure Deployment with Terraform](#infrastructure-deployment-with-terraform)
  - [AWS Resources Created](#aws-resources-created)
  - [Steps to Deploy](#steps-to-deploy)

---

## APIs

### Add a New Image

**Endpoint**: 'POST /images'  
Uploads an image to AWS S3 and stores its metadata in Postgres. It also triggers the image processing service by sending a message to an SQS queue.

**Payload**: (Multipart form-data)
- 'file': Image file to be uploaded.

**Response**:
- '201 Created'
  ```json
  {
    "s3Url": "https://xxxx.xx-xxx-xx.amazonaws.com/images/{someID}.jpg",
    "key": "images/{someID}.jpg",
    "id": "{id}",
    "createdAt": "date",
    "updatedAt": "date"
  }
  ```
---
### Add Comment to an Image

**Endpoint**: 'POST /images/:id/comments'  
Allows users to add a comment to an existing image.

**Payload**:
 ```json
 {
   "comment": "This is a nice image!"
 }
 ```

**Response**:
- '201 Created'
  ```json
  {
    "text": "text5",
    "image": {
        "id": "id",
        "s3Url": "https://xx.amazonaws.com/images/{someID}.jpg",
        "key": "images/{someID}.jpg",
        "createdAt": "date",
        "updatedAt": "date"
    },
    "id": "{someID}",
    "createdAt": "date",
    "updatedAt": "date"
  }
  ```

---

## How to Run Services Locally

### Web API Service

1. **Clone the repository**:
   'git clone https://github.com/ehtesham1996/image-processing-api'

2. **Install dependencies**:
   'cd web-api'
   'npm install'

3. **Create `.env` file** with the following content:
   ```
    NODE_ENV=dev
    PORT=3000
    PG_HOST=xxxx
    PG_PORT=xxxx
    DB_USERNAME=xxxx
    DB_PASSWORD=xxxx
    DB_NAME=xxxx
    IMAGE_BUCKET=xxxx
    AWS_REGION=xxxx
   ```

4. **Run Postgres database**:
   'docker run --name my-postgres-db -p 5432:5432 -e POSTGRES_USER=username -e POSTGRES_PASSWORD=password -d postgres'

5. **Run migrations**:
   `npm run migration:run`

6. **Build the app**:
   `npm run build`
   
6. **Start the server**:
   `npm run start`

### Image Processing Service

1. **Navigate to the 'image-processing-service' directory**:
   `cd image-processing-service`

2. **Install dependencies**:
   `npm install`

3. **Create `.env` file** with the following content:
   ```
    PORT=4000
    REGION=your-region
    NODE_ENV=dev
    AWS_REGION=your-aws-region
    SQS_QUEUE_URL=your-sqs-queue-url
    ACCESS_KEY_ID=your-access-key-id
    SES_EMAIL_SOURCE=your-ses-email-source
    SQS_POLLING_INTERVAL=5000
    SECRET_ACCESS_KEY=your-secret-access-key
    IMAGE_NOTIFICATION_RECIPIENTS=email1@example.com,email2@example.com
   ```

4. **Start the polling service**:
   'npm run build && npm run start'

---

## Deployment with Docker

Each service can be deployed using Docker.

### Web API Service

1. **Build Docker Image**:
   `docker build -t web-api .`

2. **Run Docker Container**:
   `docker run -p 3000:3000 --env-file .env web-api`

### Image Processing Service

1. **Build Docker Image**:
   `docker build -t image-processing-service .`

2. **Run Docker Container**:
   `docker run --env-file .env image-processing-service`

---

## Infrastructure Deployment with Terraform

Use Terraform to create and deploy the required AWS infrastructure: S3 bucket, SQS queue, and ECS services.

### AWS Resources Created

- **S3 Bucket**: To store uploaded images and processed images.
- **SQS Queue**: For communication between the Web API and Image Processing services.
- **ECS**: For deploying the microservices in AWS.
- **SES**: For sending email notifications.

### Steps to Deploy

1. **Navigate to the 'infrastructure' directory**:
   `cd infrastructure`

2. **Initialize Terraform**:
   `terraform init`

3. **Create a Terraform variable file ('terraform.tfvars')**:
   ```
   aws_access_key = "your-aws-access-key-id"
   aws_secret_key = "your-aws-secret-access-key"
   aws_region     = "us-east-1"
   s3_bucket_name = "my-bucket"
   ```

4. **Plan and apply the infrastructure**:
   `terraform plan`
   `terraform apply`

5. **Deploy Docker Images to ECS**:
   After applying the Terraform plan, ECS tasks for both services will be created. Push your Docker images to ECR and ECS will automatically pull the images.

---

## Environment Variables

Here’s a list of all environment variables needed for this project:

- **AWS_ACCESS_KEY_ID**: AWS Access Key.
- **AWS_SECRET_ACCESS_KEY**: AWS Secret Key.
- **AWS_REGION**: AWS region (e.g., 'us-east-1').
- **S3_BUCKET_NAME**: Name of the S3 bucket for image storage.
- **IMAGE_PROCESSING_QUEUE_URL**: URL of the SQS queue.
- **POSTGRES_URL**: PostgreSQL database connection string.
- **EMAIL_SENDER**: Email sender address for SES.

---

## Notes

- Make sure to set up your AWS credentials and services before running the application.
- If you're running the application in production, ensure you follow security best practices by not hardcoding sensitive information.