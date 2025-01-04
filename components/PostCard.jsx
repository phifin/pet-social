import { Share, StyleSheet, Text, View } from "react-native";
import React from "react";
import { hp, stripHtmlTags, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Avatar from "./Avatar";
import { format } from "date-fns";
import { TouchableOpacity } from "react-native";
import Icon from "../assets/icons";
import RenderHtml from "react-native-render-html";
import { Image } from "expo-image";
import { downloadFile, getSupabaseFileUrl } from "../services/imageService";
import { useState, useEffect } from "react";
import { createPostLike } from "../services/postService";
import { removePostLike } from "../services/postService";
import { Video } from "expo-av";
import * as Sharing from "expo-sharing";
import { useRouter } from "expo-router";
import Loading from "./Loading";
const textStyle = {
  color: theme.colors.dark,
  fontSize: hp(1.75),
};

const tagsStyles = {
  div: textStyle,
  p: textStyle,
  ol: textStyle,
  h1: {
    color: theme.colors.dark,
  },
  h4: {
    color: theme.colors.dark,
  },
};

const PostCard = ({
  item,
  currentUser,
  router,
  hasShadow = true,
  showMoreIcon = true,
}) => {
  const openPostDetails = () => {
    if (!showMoreIcon) return null;
    router.push({ pathname: "postDetails", params: { postId: item?.id } });
  };
  const createdAt = item?.created_at
    ? format(new Date(item.created_at), "MMM d")
    : "N/A";

  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    setLikes(item?.postLikes || []);
  }, [item?.postLikes]);
  const liked = likes.some((like) => like.userId === currentUser?.id);
  const shadowStyles = {
    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.06)",
  };

  const onLike = async () => {
    try {
      if (liked) {
        // Remove Like
        const originalLikes = [...likes]; // Lưu trạng thái ban đầu
        const updatedLikes = likes.filter(
          (like) => like.userId !== currentUser?.id
        );
        setLikes(updatedLikes); // Cập nhật tạm thời

        const res = await removePostLike(item?.id, currentUser?.id);
        if (!res.success) {
          Alert.alert("Post", "Something went wrong!");
          setLikes(originalLikes); // Khôi phục trạng thái nếu có lỗi
        }
      } else {
        // Create Like
        const originalLikes = [...likes]; // Lưu trạng thái ban đầu
        const newLike = {
          userId: currentUser?.id,
          postId: item?.id,
        };
        setLikes([...likes, newLike]); // Cập nhật tạm thời

        const res = await createPostLike(newLike);
        if (!res.success) {
          Alert.alert("Post", "Something went wrong!");
          setLikes(originalLikes); // Khôi phục trạng thái nếu có lỗi
        }
      }
    } catch (error) {
      console.error("Error liking post:", error);
      Alert.alert("Post", "Something went wrong!");
    }
  };

  const onShare = async () => {
    try {
      setLoading(true);
      let content = { message: stripHtmlTags(item?.body) };

      if (item?.file) {
        // Download the file
        const fileUrl = getSupabaseFileUrl(item?.file).uri;
        const localUri = await downloadFile(fileUrl);
        setLoading(false);
        // Check if sharing is available
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(localUri, { dialogTitle: "Share Post" });
        } else {
          console.log("Sharing is not available on this device.");
        }
      } else {
        // Share text-only content
        setLoading(true);
        Share.share(content);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error sharing post:", error);
      Alert.alert("Post", "Unable to share this post.");
    }
  };

  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
        {/* user info and post time */}
        <View style={styles.userInfo}>
          <Avatar
            size={hp(4.5)}
            uri={item?.user?.image}
            rounded={theme.radius.md}
          />
          <View style={{ gap: 2 }}>
            <Text style={styles.username}>{item?.user?.name}</Text>
            <Text style={styles.postTime}>{createdAt}</Text>
          </View>
        </View>

        {showMoreIcon && (
          <TouchableOpacity onPress={openPostDetails}>
            <Icon
              name="threeDotsHorizontal"
              size={hp(3.4)}
              strokeWidth={3}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.postBody}>
          {item?.body && (
            <RenderHtml
              contentWidth={wp(100)}
              source={{ html: item?.body }}
              tagsStyles={tagsStyles}
            />
          )}
        </View>

        {item?.file && item?.file.includes("postImages") && (
          <Image
            source={getSupabaseFileUrl(item?.file)}
            transition={100}
            style={styles.postMedia}
            contentFit="cover"
          />
        )}

        {item?.file && item?.file.includes("postVideos") && (
          <Video
            style={[styles.postMedia, { height: hp(30) }]}
            source={{ uri: getSupabaseFileUrl(item?.file) }}
            useNativeControls
            resizeMode="cover"
            isLooping
          />
        )}

        <View style={styles.footer}>
          <View style={styles.footerButton}>
            <TouchableOpacity onPress={onLike}>
              <Icon
                name="heart"
                size={24}
                color={liked ? theme.colors.rose : theme.colors.textLight}
                fill={liked ? theme.colors.rose : "transparent"}
              />
            </TouchableOpacity>
            <Text style={styles.counts}>{likes.length}</Text>
          </View>
          <View style={styles.footerButton}>
            <TouchableOpacity onPress={openPostDetails}>
              <Icon name="comment" size={24} color={theme.colors.textLight} />
            </TouchableOpacity>
            <Text style={styles.counts}>{item?.comments[0]?.count}</Text>
          </View>
          <View style={styles.footerButton}>
            {loading ? (
              <Loading size="small" />
            ) : (
              <TouchableOpacity onPress={onShare}>
                <Icon name="share" size={24} color={theme.colors.textLight} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  postMedia: {
    height: hp(40),
    width: "100%",
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
  },
  postBody: {
    marginLeft: 5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  username: {
    fontSize: hp(1.7),
    color: theme.colors.textDark,
    fontWeight: theme.fonts.medium,
  },
  postTime: {
    fontSize: hp(1.4),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
  },
  content: {
    gap: 10,
    // marginBottom: 10,
  },
  container: {
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    shadowColor: "#000",
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.xxl * 1.1,
    borderCurve: "continuous",
    padding: 10,
    paddingVertical: 12,
    backgroundColor: "white",
  },
});
