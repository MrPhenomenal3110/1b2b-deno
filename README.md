# Setup Guide for 1b2b-deno AdVantage process-imgresponse-worker Repo

This guide will help you set up and run the 1b2b-deno repository.

## Prerequisites
Before proceeding with the setup, make sure you have the following installed on your system:
- Deno: [Installation Guide](https://deno.land/#installation)

## Setup Steps
1. Clone the repository to your local machine:
    ```
    git clone git@github.com:MrPhenomenal3110/1b2b-deno.git
    ```

2. Navigate to the project directory:
    ```
    cd 1b2b-deno
    ```
3. Setup your aws account using aws-cli and add your aws-creds into your system using export.

4. Start the Deno server:
    ```
    deno run --allow-net --allow-read --watch server.ts --port 8000
    ```
    - It will ask for env access permission. give it.

5. The server should now be running on `http://localhost:8000`.

## Thank you for using AdVantage.