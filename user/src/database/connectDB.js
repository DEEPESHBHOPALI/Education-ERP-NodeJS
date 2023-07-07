import myDataSource from './user_db.js'

const userDBConnect = () => {
    myDataSource.initialize().then(() => {
        console.log('Connected to the database');
    }).catch((error) => {
        console.log('Error connecting to the database:', error);
    });
}

export default userDBConnect
