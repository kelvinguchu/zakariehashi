import React from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { notFound } from "next/navigation";
import BlogPost from "@/components/blog/blog-post";
import { slugify } from "@/lib/utils";

interface FirestorePost {
  title: string;
  content: string;
  contentHtml: string;
  date: any;
  image: string;
  categoryName: string;
  categoryId: string;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    // Await the params before using its properties
    const { slug } = await params;

    // Get all posts and find the matching one
    const postsRef = collection(db, "posts");
    const querySnapshot = await getDocs(postsRef);

    const matchingPost = querySnapshot.docs.find((doc) => {
      const postData = doc.data() as FirestorePost;
      const postSlug = slugify(postData.title);
      return postSlug === slug;
    });

    if (!matchingPost) {
      return notFound();
    }

    const postData = matchingPost.data() as FirestorePost;
    const post = {
      id: matchingPost.id,
      ...postData,
      // Convert Timestamp to string to avoid serialization issues
      date: postData.date.toDate().toISOString(),
    };

    return (
      <div className=''>
        <BlogPost post={post} />
      </div>
    );
  } catch (error) {
    console.error("Error in page component:", error);
    return <div>Error loading post. Please try again later.</div>;
  }
}
