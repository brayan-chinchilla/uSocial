import { CognitoUserPool, CognitoUserAttribute, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import { User } from '../../models/user.model';

const userPool = new CognitoUserPool({
    UserPoolId: "eu-central-1_usocial", // Your user pool id here    
    ClientId: process.env.COGNITO_CLIENT_ID || '', // Your client id here,
});

export function RegisterUser(user: User) {
    return new Promise((resolve, reject) => {
        var attributeList = [];
        attributeList.push(new CognitoUserAttribute({ Name: "name", Value: user.name }));
        attributeList.push(new CognitoUserAttribute({ Name: "nickname", Value: user.username }));
        attributeList.push(new CognitoUserAttribute({ Name: "email", Value: user.email }));

        userPool.signUp(user.email, user.password, attributeList, [], function (err, result) {
            if (err) {
                return reject(err);;
            }
            const cognitoUser = result?.user;
            console.log('user name is ' + cognitoUser);
            return resolve('');
        });
    })
}

/*
export function LoginUser(username: string, password: string, email: string) {
    return new Promise((resolve, reject) => {
        console.log(username, password, email);
        const authenticationDetails = new AuthenticationDetails({
            Username: email,
            Password: password,
        });

        const cognitoUser = new CognitoUser({
            Username: username,
            Pool: userPool
        });

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess(session) {
                console.log(session)
                console.log(session.getAccessToken());
                console.log(session.getIdToken());
                console.log(session.getRefreshToken().getToken());
                console.log(session.isValid);
                resolve(session);
            },
            onFailure(err) {
                console.log('error en login', err);
                reject(err);
            }
        })
    })
}
*/