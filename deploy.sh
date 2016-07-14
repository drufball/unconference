ssh -i /Users/dknox/Desktop/unconference-keys.pem ec2-user@ec2-52-41-215-199.us-west-2.compute.amazonaws.com "cd unconference/; git pull; forever stop 0; forever start server.js;"
