"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import connectToDB from "../mongoose";

interface IParams {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export const CreateThread = async ({
  text,
  author,
  communityId,
  path,
}: IParams) => {
  "use server";

  try {
    connectToDB();

    const createdThread = await Thread.create({
      text,
      author,
      community: null,
    });

    //update user model
    await User.findByIdAndUpdate(author, {
      $push: {
        threads: createdThread?._id,
      },
    });

    console.log("Thread created successfully!");
    revalidatePath(path);
  } catch (error: any) {
    console.log(error.message);
    throw new Error("Failed to create an thread", error.message);
  }
};

export const fetchThreads = async (pageNumber = 1, pageSize = 20) => {
  try {
    connectToDB();

    // calculate the number of post
    const skipAmount = (pageNumber - 1) * pageSize;

    const threadsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: User })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image",
        },
      });

    // find total documents count
    const totalThreadsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const threads = await threadsQuery.exec();

    const isNext = totalThreadsCount * skipAmount + threads?.length;

    return {
      threads,
      isNext,
    };
  } catch (error: any) {
    throw new Error("Failed to fetch threads", error.message);
  }
};

export const fetchThreadById = async (id: string) => {
  try {
    connectToDB();

    const thread = await Thread.findById(id)
      .populate({ path: "author", model: User, select: "_id id name image" })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id parentId name image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name image",
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (error: any) {
    throw new Error("Failed to fetch threads", error.message);
  }
};

interface IParamsAddComment {
  threadId: string;
  commentText: string;
  userId: string;
  path: string;
}

export const addCommentToThread = async ({
  threadId,
  commentText,
  userId,
  path,
}: IParamsAddComment) => {
  try {
    connectToDB();

    // original thread
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) throw new Error("Thread not found.");

    // create new thread
    const commentThread = new Thread({
      author: userId,
      text: commentText,
      parentId: threadId,
    });

    // Save the comment thread to the database
    const savedCommentThread = await commentThread.save();

    // Add the comment thread's ID to the original thread's children array
    originalThread.children.push(savedCommentThread._id);

    // Save the updated original thread to the database
    await originalThread.save();

    revalidatePath(path);
  } catch (error: any) {
    console.error("Error while adding comment:", error);
    throw new Error("Failed to comment on thread", error.message);
  }
};

export const fetchUserThreads = async (userId: string) => {
  try {
    connectToDB();

    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      },
    });

    return threads;
  } catch (error: any) {
    throw new Error("Failed to fetch user threads", error.message);
  }
};
