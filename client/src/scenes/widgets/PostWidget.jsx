import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  

} from "@mui/icons-material";
import { TextField, Button } from "@mui/material";

import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  onComment,
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const userName = useSelector((state) => state.user.firstName);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const [newComment, setNewComment] = useState("");

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };
  const sharePost = () => {
    const shareUrl = `${window.location.origin}/post/${postId}`;
    const shareText = `${name} shared a post on SociaLink: ${description}`;

    if (navigator.share) {
      try {
        navigator.share({
          title: "Check out this post!",
          text: shareText,
          url: shareUrl,
        });
        console.log("Post shared successfully!");
      } catch (error) {
        console.error("Error sharing the post:", error);
      }
    } else {
      // Fallback for browsers that do not support the Web Share API
      const shareMessage = `${shareText} ${shareUrl}`;
      const textarea = document.createElement("textarea");
      textarea.value = shareMessage;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      console.log("Post link copied to clipboard");
      alert("Post link copied to clipboard. You can now manually share it.");
    }
  };

  const handleComment = async () => {
    if (newComment.trim() === "") {
      // Do not submit empty comments
      return;
    }

    // Assuming there's an API endpoint for adding comments to a post
    const response = await fetch(`http://localhost:3001/posts/${postId}/comment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userName, content: newComment }),
    });

    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));

    // Invoke the onComment prop with the new comment
    
    
    // Clear the input after submitting the comment
    setNewComment("");
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton onClick={sharePost}>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleComment}
            sx={{ mt: '0.5rem' }}
          >
            Comment
          </Button>

          {comments.map((comment, i) => (
  <Box key={`${name}-${i}`}>
    <Divider />
    <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
      {/* Access the user and content properties */}
      <strong>{comment.user}: </strong>{comment.content}
    </Typography>
  </Box>
))}
          <Divider />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
