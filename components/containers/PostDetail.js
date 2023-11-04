import React from "react";
import { View, Text } from 'react-native';

function PostDetailScreen({ route }) {
  const { post } = route.params;

  return (
    <View>
      <Text>{post.title}</Text>
      <Text>{post.party}</Text>
      <Text>{post.text}</Text>
    </View>
  );
}

export default PostDetailScreen;