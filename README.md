# BGH auth-service

This service implements operations with authentication such as register, login, refresh and also getIdFromToken

To run this project you'll need:

* Install Node, npm
* Upload code of this repository
* Run console command ```npm install``` from the root of repository
* Run console command ```npm run start:dev``` for running application in dev, or ```npm run start:prod``` to run in production mode (without updates when code changed)

### Technologies used in this project

* [Nest.js](https://docs.nestjs.com) for microservice
* [JWT](https://jwt.io) as method of authentication
* [GRPC](https://docs.nestjs.com/microservices/grpc) as transporter
* [Redis](https://docs.nestjs.com/techniques/caching) as cache-manager

## GRPC methods

1. Register

* Body of request should contain email, name, password
* Body of response will contain refreshToken, accessToken, message and status (SUCCESS or DENIED)

2. Login

* Body of request should contain email, password
* Body of response will contain refreshToken, accessToken, message and status (SUCCESS or DENIED)

3. Refresh

* Body of request should contain refreshToken, id
* Body of response will contain refreshToken, accessToken, message and status (SUCCESS or DENIED)

4. GetIdFromToken

* Body of request should contain token
* Body of response will contain id, status (SUCCESS or DENIED) and message
