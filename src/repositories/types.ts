

export type BlogType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type PostType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,

}

export type CommentDBType = {
    id: string,
    postId: string
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string
}

export type CommentViewType = {
    id: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string
}

export type UserViewWhenAdd = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}

export type UserTypeAuthMe = {
    email: string,
    login: string,
    userId: string
}

export type UserDbType = {
    id: string,
    accountData: {
        login: string,
        email: string,
        password: string,
        createdAt: string
    },
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean
    }
}

