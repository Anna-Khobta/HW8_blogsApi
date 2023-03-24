import {blogsCollection} from "./db";
import {BlogType} from "./types";


export const blogsRepository = {

    async createBlog(newBlog: BlogType): Promise<BlogType | null> {


        const insertNewBlogInDb = await blogsCollection.insertOne(newBlog)

        const newBlogWithoughtID = await blogsCollection.findOne({id: newBlog.id},{projection:{_id:0}})

        return newBlogWithoughtID
    },


    async updateBlog(id: string, name: string, description: string, websiteUrl: string ): Promise<boolean> {

        const result = await blogsCollection.updateOne({id: id}, {$set: {name: name, description:description, websiteUrl:websiteUrl  }})
        return result.matchedCount === 1

    },


    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({id: id})
        return result.deletedCount === 1
        // если 1 сработало. если 0, то нет
    },


    async deleteAllBlogs(): Promise<boolean> {
        const result = await blogsCollection.deleteMany({})
        return result.acknowledged === true
        // если всё удалит, вернет true
    }
}



