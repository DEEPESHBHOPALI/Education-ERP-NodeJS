import myCourseDataSource from './course_db.js'

const courseDBConnect = () => {
    myCourseDataSource.initialize().then(() => {
        console.log('Connected to the database');
    }).catch((error) => {
        console.log('Error connecting to the database:', error);
    });
}

export default courseDBConnect