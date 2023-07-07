import myGradeDataSource from "./grade_db.js";

const gradeDBConnect = () => {
    myGradeDataSource.initialize().then(() => {
        console.log('Connected to the database');
    }).catch((error) => {
        console.log('Error connecting to the database:', error);
    });
}

export default gradeDBConnect