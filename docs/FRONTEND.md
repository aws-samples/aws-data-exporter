# Frontend

## Overview

It is a Single Page Application (SPA) using React and the build tool is [Vite](https://ja.vitejs.dev/).

Authentication is implemented with [Amplify UI Component Authenticator](https://ui.docs.amplify.aws/react/connected-components/authenticator).  
If you are using Vite as your build tool, the following settings are required.

- Add the following to `vite.config`

  ```json
  resolve: { alias: { "./runtimeConfig": "./runtimeConfig.browser" } }
  ```

- Add the following to `index.html`

  ```html
  <script>
    if (global === undefined) {
      var global = window;
    }
  </script>
  ```

## Local development

Set up the development environment on the local machine.

### Deploy Backend

Deploy the backend as described in [DEPLOY MANUAL](DEPLOYMENT.md).  
Authentication and backend APIs available after deployment.

### Start Local Frontend Server

#### Environment variables

Input the environment information output when the backend is deployed in `frontend/.env`.  
These outputs can also be viewed from the "Outputs" tab of the [CloudFormation Console](https://console.aws.amazon.com/cloudformation/).

```bash
# Backend API endpoint
# This is BASE URL for API call.
VITE_API_URL=https://xxxxx.execute-api.ap-northeast-1.amazonaws.com/api

# Cognito User Pool ID
VITE_AUTH_USER_POOL_ID=ap-northeast-1_xxxxx

# Cognito User Pool Client ID
VITE_AUTH_WEB_CLIENT_ID=xxxxx
```

Install npm packages by entering the following command in a terminal

```bash
cd frontend/
npm ci
```

After the npm package has been successfully installed, start the frontend server with the following command.

```bash
npm run dev
```

If the following is displayed, the frontend server is running.  
Access the displayed URL from your browser.

```bash
  VITE v4.2.0  ready in 281 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```
