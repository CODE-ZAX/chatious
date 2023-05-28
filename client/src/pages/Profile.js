import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import styles from "./Profile.module.css";

const Profile = () => {
  const { user } = useAuth();

  // Assuming the user has a profile image, about me section, and posts.
  // If not, you might want to check for their existence before using them.
  const [profileImage, setProfileImage] = useState(
    user.profileImage || "https://via.placeholder.com/150"
  );
  const [aboutMe, setAboutMe] = useState(
    user.aboutMe || "This user hasn't written anything about themselves yet."
  );
  const [posts, setPosts] = useState(user.posts || []);

  return (
    <div className={"mt-3 pt-5 px-2 " + styles.profileContainer}>
      {/* Profile Image */}
      <div className={styles.imageContainer}>
        <img src={profileImage} alt="Profile" className={styles.profileImage} />

        <div className={styles.detailsContainer}>
          <h4 className={styles.subHeader}>Details</h4>
          <div className={styles.detail}>
            <strong>Username:</strong> {user.username}
          </div>
          <div className={styles.detail}>
            <strong>Email:</strong> {user.email}
          </div>
        </div>
      </div>
      {/* Details Section */}
      <hr />
      {/* About Me Section */}
      <div className={styles.aboutContainer}>
        <h4 className={styles.subHeader}>About Me</h4>
        <div className={styles.aboutContent}>{aboutMe}</div>
      </div>
      <hr />
      {/* User Posts/Activities Section */}
      <div className={styles.postsContainer}>
        <h4 className={styles.subHeader}>Posts</h4>
        {posts.length === 0 ? (
          <div>This user hasn't posted anything yet.</div>
        ) : (
          posts.map((post, index) => (
            <div className={styles.post} key={index}>
              <div className={styles.postTitle}>{post.title}</div>
              <div className={styles.postContent}>{post.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
