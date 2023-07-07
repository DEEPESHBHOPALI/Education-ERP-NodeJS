1. Start 3 terminals for Course , Grade, User then run "node index.js" will Start the nodejs server.
2. You can update the port for databases from user_config/course_config/grade_config files
3. User is consuming "Course" details and "Grades" data from both the servers.
4. Authentication is covered in User Service.
5. Once you hit the login API you will receive token after registration.
6. To fetch the data you need to pass that token as Authorization value.