import express from "express";
import request from "supertest";
import exp from "constants";
import {app} from "../settings";

export async function createPostWithBlog (app: express.Application, auth: {login: string, password: string}) {
    const createdResponseBlog = await request(app)
        .post('/blogs')
        .set('Authorization', `Basic ${Buffer.from(`${auth.login}:${auth.password}`).toString('base64')}`)
        .send({
            "name": "Anna1",
            "description": "1 description",
            "websiteUrl": "1google.com"
        })
        .expect(201);
    const createdBlog = createdResponseBlog.body;

    const createdResponsePost = await request(app)
        .post('/posts')
        .set('Authorization', `Basic ${Buffer.from(`${auth.login}:${auth.password}`).toString('base64')}`)
        .send({
            "title": "1post title",
            "shortDescription": "1post string",
            "content": "1post string",
            "blogId": createdBlog.id
        })
        .expect(201);
    const createdPost = createdResponsePost.body;

    return createdPost;
}

export async function createUser (app: express.Application, auth: {login: string, password: string}) {
    const createdResponseUser = await request(app)
        .post('/users')
        .set('Authorization', `Basic ${Buffer.from(`${auth.login}:${auth.password}`).toString('base64')}`)
        .send({
            "login": "test123",
            "password": "test123",
            "email": "test123@mail.com"
        })
        .expect(201)
    const createdUser = createdResponseUser.body
    return createdUser;
}

export async function loginUserGetToken (app: express.Application, auth: {login: string, password: string}) {

    const tryLogin = await request(app)
        .post('/auth/login')
        .send({
            "loginOrEmail": "test123",
            "password": "test123"
        })
        .expect(200)
    let createdUserToken = tryLogin.body.accessToken
    return createdUserToken;
}

