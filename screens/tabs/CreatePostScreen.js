import { Modal, StyleSheet, Text, View, TouchableHighlight,SafeAreaView, Button } from 'react-native';
import { Colors } from '../../constants/styles';
import PostButton from '../../components/ui/PostButton';
import { useState } from 'react';
import TextPostForm from '../../components/forms/TextPostForm';
import ImagePostForm from '../../components/forms/ImagePostForm';
import VideoPostForm from '../../components/forms/VideoPostForm';

function CreatePostScreen() {

  const [inputTitle, setInputTitle] = useState("");
  const [inputText, setInputText] = useState("");
  const [isTextModalVisible, setTextModalVisible] = useState(false);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [isVideoModalVisible, setVideoModalVisible] = useState(false);

  const toggleTextModal = () => {
    setTextModalVisible(!isTextModalVisible);
  };

  const toggleImageModal = () => {
    setImageModalVisible(!isImageModalVisible);
  };

  const toggleVideoModal = () => {
    setVideoModalVisible(!isVideoModalVisible);
  }

  return (
    <View style={styles.rootContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Post</Text>
        <View style={styles.post}>
          <View>
            <PostButton onPress={toggleTextModal}>Text Post</PostButton>
          </View>
          <View>
            <PostButton onPress={toggleImageModal}>Image Post</PostButton>
          </View>
          <View>
            <PostButton onPress={toggleVideoModal}>Video Post</PostButton>
          </View>
          <View>
            <PostButton>Link</PostButton>
          </View>
        </View>
      </View>
      <SafeAreaView>
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={isTextModalVisible}
        >
          <TextPostForm 
            onClose={toggleTextModal} 
            inputTitle={inputTitle} 
            setInputTitle={setInputTitle} 
            inputText={inputText} 
            setInputText={setInputText}/>
        </Modal>
        <Modal
          animationType="slide"
          transparent={false}
          visible={isImageModalVisible}
          >
            <ImagePostForm
              onClose={toggleImageModal} 
              inputTitle={inputTitle} 
              setInputTitle={setInputTitle} 
              inputText={inputText} 
              setInputText={setInputText}
              />
        </Modal>
        <Modal
          animationType="slide"
          transparent={false}
          visible={isVideoModalVisible}
          >
            <VideoPostForm
              onClose={toggleVideoModal} 
              inputTitle={inputTitle} 
              setInputTitle={setInputTitle} 
              inputText={inputText} 
              setInputText={setInputText}
              />
        </Modal>
      </View>
      </SafeAreaView>
    </View>
  );
}

export default CreatePostScreen

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.primary50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    backgroundColor: Colors.accent500,
    width: '95%',
    //flexDirection: 'row',
    //justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: 'white',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  post: {
    marginTop: 40,
    //backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    //marginHorizontal: 10,
    width: '120%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  text: {

  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    //justifyContent: 'flex-start',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  modalView: {
    margin: 20,
    //backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    padding: 10,
  },
  closeText: {
    fontSize: 20,
  },
});