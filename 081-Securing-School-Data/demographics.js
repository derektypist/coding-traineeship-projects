import { getData } from "./data/database-api.js";

// Import the dotenv package
import dotenv from "dotenv";

// Inject environment variables
dotenv.config();

// Returns student and teacher data using the API key
const student_data = getData("student", POSTGRES_API_KEY);
const teacher_data = getData("teacher", DISTRICT_API_KEY);

// Output student data if no error has occurred
if (student_data !== 0 || (typeof(student_data) === "object" && Object.keys(student_data).length !== 0)) {
    const males = student_data.filter(student => student.gender === "male");
    const females = student_data.filter(student => student.gender === "female");

    const ages = student_data.map(student => student.age);
    const min_age = Math.min(...ages);
    const min_age_students = student_data.filter(student => student.age === min_age);
    const min_age_students_str = min_age_students.map(student => student.first + " " + student.last + " (id: " + student.id + ")").join("\n\t\t");
    const max_age = Math.max(...ages);
    const max_age_students = student_data.filter(student => student.age === max_age);
    const max_age_students_str = max_age_students.map(student => student.first + " " + student.last + " (id: " + student.id + ")").join("\n\t\t");
    const avg_age = ages.reduce((total, next) => total + next, 0) / ages.length;

    const avg_lunch_bal = student_data.reduce((total, next) => total + parseInt(next.lunch_balance.replace("$", "")), 0) / Object.keys(student_data).length;

    console.log(`Generated demographic data from ${Object.keys(student_data).length} students...`);
    console.log(`\t Number of male students: ${males.length}`);
    console.log(`\t Number of female students: ${females.length}`);
    console.log(`\t The minimum age of the students is ${min_age} years. These students are: \n\t\t${min_age_students_str}`);
    console.log(`\t The maximum age of the students is ${max_age} years. These students are: \n\t\t${max_age_students_str}`);
    console.log(`\t The average age of the students is ${avg_age} years.`);
    console.log(`\t The average lunch balance of the students is $${avg_lunch_bal}.`);
}

// Output teacher data if no error has occurred
if (teacher_data !== 0 || (typeof(teacher_data) === "object" && Object.keys(teacher_data).length !== 0)) {
    const males = teacher_data.filter(teacher => teacher.gender === "male");
    const females = teacher_data.filter(teacher => teacher.gender === "female");

    const ages = teacher_data.map(teacher => teacher.age);
    const min_age = Math.min(...ages);
    const max_age = Math.max(...ages);
    const avg_age = ages.reduce((total, next) => total + next, 0) / ages.length;

    const group_by_subjects = teacher_data.reduce((result, acc) => {
        result[acc.subject] = result[acc.subject] || [];
        result[acc.subject].push(acc);
        return result;
    }, Object.create(null));

    console.log(`\n\nGenerated demographic data from ${Object.keys(teacher_data).length} teachers...`);
    console.log(`\t Number of male teachers: ${males.length}`);
    console.log(`\t Number of female teachers: ${females.length}`);
    console.log(`\t The minimum age of the teachers is ${min_age} years.`);
    console.log(`\t The maximum age of the teachers is ${max_age} years.`);
    console.log(`\t The average age of the teachers is ${avg_age} years.`);
    Object.keys(group_by_subjects).forEach(subject => {
        const teachers_num = group_by_subjects[subject].length
        const str = group_by_subjects[subject].map(teacher => teacher.first + " " + teacher.last + " (id: " + teacher.id + ")").join("\n\t\t");
        console.log(`\t The teacher${teachers_num > 1 ? 's' : ''} teaching ${subject} ${teachers_num > 1 ? "are" : "is"} \n\t\t${str}`);
    });
}
