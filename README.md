
# Token-based RESTful user authentication

## Hi there 👋🏻
This is my submission for this coding project. I chose to implement this using JWT-based authentication using Node.js, Express.js, and MongoDB. My reasoning is because they are simple environments to set up and start developing for quickly, so I could focus on the actual implementation. The model is kept simple (only the required fields with no additional models), and user passwords are hashed using bcrypt.

## Let's get started

### Setup
- Install MongoDB
	- run `mongod` in a separate terminal for the API to use, or make sure it's running as a service
	- I used v4.2.3
- Install Node.js
	- I used v12.14.1
- Run `npm install` in project folder to install node dependencies

### Run

- Run the server with `> npm start`
	> [nodemon] restarting due to changes...
	> [nodemon] starting `node app.js`
	> Running on port 3000...
	> Connected to mongo!

### Tests
- run `> npm test` to run the mocha unit test suite (only 1 simple test implemented as a proof of concept)

## If I had more time...
- More unit tests!! Every path in every controller should have a test.
- Actually implement all the validation rules for registration and login.
- Integration tests for some common user stories
- More security -- per-user salts for password hashing, token expiry and blacklist for invalidated or compromised tokens
- Logging - CRUD operations, exceptions, etc. to keep track of what's actually going on
- Authorization/permissions -- what access does each user have? What differentiates an admin from a normal user? Could be an enum-like field, or even as granular as a bitmask for each user.
- The `DELETE` endpoint shouldn't normally delete a db record in practice, but instead do something like set a Deleted field.


## Models
 **User**
 1. name
 2. email
 3. password  

## Endpoints
1. `POST /api/register` -- User Registration

	* Request body contains relevant registration information:
		>       {
		> 		 	"name": "Les Claypool",
		> 		 	"email": "lclaypool@primus.com",
		> 		 	"password": "jerrywasaracecardriver"
		> 		}
	* Response returns a JWT token:
		>       {
		> 		 	"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZTMyNjg1NTJhNTQ5NTEwNTQyMGRkZWMifQ._L0-DuVuCHM2-jdHXWKYLcZSaGV-oaYkokFVjsh03zE"
		> 		}

2. `POST /api/login` -- Login 

	* Request body should contain login information:
		>       {
		> 		 	"email": "lclaypool@primus.com",
		> 		 	"password": "jerrywasaracecardriver"
		> 		}
	* Response returns a JWT token for the user:
		>       {
		> 		 	"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZTMyNjg1NTJhNTQ5NTEwNTQyMGRkZWMifQ._L0-DuVuCHM2-jdHXWKYLcZSaGV-oaYkokFVjsh03zE"
		> 		}
		
3. **Logout** is not implemented for the purpose of this simple authentication because the client can simply delete their copy of the token or wait for it to expire.

4. `PATCH /api/users` -- Update a user's information

	* Header should contain **Authorization** with user's JWT token
		* *e.g.* `Authorization Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZTMyNWY3YTE4ZDIxOTM3MmM1NmI1ODEifQ.xj2y8UlYnsFDrw71fzc9Pra1T7G_Sd17uIK8XWRGNXg`
	* Body should contain any fields that the user desires to update
		>       {
		>         "name": "John the Fisherman",
		> 		 	"password": "shakehandswithbeef"
		> 		}
	* Returns **204** on success, otherwise a **400** with relevant error information

5. `DELETE /api/users` -- Delete a user
	* Header should contain **Authorization** with user's JWT token
		* *e.g.* `Authorization Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZTMyNWY3YTE4ZDIxOTM3MmM1NmI1ODEifQ.xj2y8UlYnsFDrw71fzc9Pra1T7G_Sd17uIK8XWRGNXg`
	* Returns **204** on success, otherwise a **400** with relevant error information