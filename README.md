# Asynchronous Task Processing with Node.js and RabbitMQ

This project implements an asynchronous processing system using Node.js and RabbitMQ. It's divided into two main parts:

- **M1 Service (Task Provider)**: This service accepts HTTP POST requests with numeric data and places tasks into a RabbitMQ queue.
- **M2 Service (Task Processor)**: This service consumes tasks from the queue, processes them by doubling the numeric value, and places the results back into RabbitMQ.

## Prerequisites

- Node.js (version 12 or newer recommended)
- RabbitMQ Server

## Installation & Setup

To get the project up and running on your local machine, follow these steps:

1. Clone the project repository:
  git clone <your-repo-link>

2. Navigate to the project directory:
  cd path/to/your/project

3. Install the necessary Node.js dependencies:
bash
``npm install

# Running the Services
1. M1 Service (Task Provider)
To start the M1 service, run:
  node provider.js or nodemon provider.js
The service will listen on port 3000 by default. To post a task, send a JSON payload to http://localhost:3000/task with the following format:
  { "number": <your_number> }
2. M2 Service (Task Processor)
To start the M2 service, which will process the tasks, run:
  node worker.js
This service will consume messages from the 'tasks' queue, process them, and publish the results to the 'results' queue.

# Project Structure
provider.js: Contains the M1 service code that sets up an Express server and RabbitMQ producer.
worker.js: Contains the M2 service code that sets up a RabbitMQ consumer.

# Configuration
To modify the RabbitMQ connection or queue names, adjust the following variables in both provider.js and worker.js:

const rabbitMqUrl = 'amqp://localhost:5672';
const inputQueue = 'tasks';
const outputQueue = 'results';
