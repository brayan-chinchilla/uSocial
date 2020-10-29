import AWS, { DynamoDB } from "aws-sdk";
import { Student } from "../../models/student.model";
import { User } from "../../models/user.model";

AWS.config.update({
    region: "us-east-1",
});

const docClient = new DynamoDB.DocumentClient();

export function getUser(username: string) {
    return getDocument('users', { username });
}

export function addUser(user: User) {
    return addDocument('users', user);
}

export function getStudent(username: string) {
    return getDocument('students', { username });
}

export function getAllStudents() {
    return getAllDocuments('students');
}

export function addStudent(student: Student) {
    return addDocument('students', student);
}

function addDocument(tableName: string, doc: object) {
    return docClient.put({
        TableName: tableName,
        Item: {
            ...doc
        }
    }).promise()
}

function getDocument(tableName: string, key: object) {
    return docClient.get({
        TableName: tableName, Key: key
    }).promise()
}

function getAllDocuments(tableName: string) {
    return docClient.scan({
        TableName: tableName,
    }).promise()
}