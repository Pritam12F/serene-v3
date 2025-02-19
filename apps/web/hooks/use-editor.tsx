import { fetchSinglePostById } from "@/server/actions";
import db from "@workspace/db";
import { useEffect, useState } from "react";

export const useEditor = (postId: number) => {
  const [post, setPost] = useState();

  const setData = async () => {};

  const getData = async () => {
    await fetchSinglePostById(postId);
  };

  return { setData, getData };
};
