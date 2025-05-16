"use client";
import PageContainer from "@/components/PageContainer";
import PostDetail from "@/components/PostDetail";
import { useParams } from "next/navigation";

export default function PostPage() {
  const params = useParams();  
  return (
    <PageContainer>
      <PostDetail username={params.username} postId={params.postId} />
    </PageContainer>
  );
}