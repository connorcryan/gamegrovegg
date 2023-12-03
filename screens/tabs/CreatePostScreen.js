import { Modal, StyleSheet, Text, View, TouchableHighlight,SafeAreaView, Button } from 'react-native';
import { Colors, CreatPostStyles } from '../../constants/styles';
import PostButton from '../../components/ui/PostButton';
import { useState } from 'react';
import TextPostForm from '../../components/forms/TextPostForm';
import ImagePostForm from '../../components/forms/ImagePostForm';
import VideoPostForm from '../../components/forms/VideoPostForm';
import CreatePartyForm from '../../components/forms/PartyCreateForm';

function CreatePostScreen() {

  const [inputTitle, setInputTitle] = useState("");
  const [inputText, setInputText] = useState("");
  const [isTextModalVisible, setTextModalVisible] = useState(false);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [isVideoModalVisible, setVideoModalVisible] = useState(false);
  const [isPartyModalVisible, setPartyModalVisible] = useState(false);

  const toggleTextModal = () => {
    setTextModalVisible(!isTextModalVisible);
  };

  const toggleImageModal = () => {
    setImageModalVisible(!isImageModalVisible);
  };

  const toggleVideoModal = () => {
    setVideoModalVisible(!isVideoModalVisible);
  }

  const togglePartyModal = () => {
    setPartyModalVisible(!isPartyModalVisible);
  }

  return (
    <View style={styles.createView}>
    <View style={styles.rootContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>Post Creation</Text>
        <View style={styles.textContainer}>
        <Text style={styles.text}>
          Got something to share or discuss? Get it out there!
        </Text>
        <Text style={styles.text}>
          Gamegrove is the perfect place to discuss all things gaming related!
        </Text>
        </View>
        <View style={styles.post}>
          <View>
            <PostButton onPress={toggleTextModal}>Text Post</PostButton>
          </View>
          <View>
            <PostButton onPress={toggleImageModal}>Image Post</PostButton>
          </View>
        </View>
          {/* <View>
            <PostButton onPress={toggleVideoModal}>Video Post</PostButton>
          </View> */}
          {/* <View>
            <PostButton>Link</PostButton>
          </View> */}
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Party Creation</Text>
        <View style={styles.textContainer}>
        <Text style={styles.text}>
          Can't find a party crash? Never fear, you can host your own!
        </Text>
        <Text style={styles.text}>
          Feel free to create a party to discuss any gaming topic you want.
          Whether it is table top games or a place to discuss the latest
          developments in gaming technology, if it's gaming related it has a
          home on Gamegrove!
        </Text>
        </View>
        <View style={styles.post}>
          <View>
            <PostButton onPress={togglePartyModal}>Create Party</PostButton>
          </View>
        </View>
      </View>
      <SafeAreaView>
        <View >
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
                setInputText={setInputText}
              />
            
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
          {/* <Modal
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
        </Modal> */}
          <Modal
            animationType="slide"
            transparent={false}
            visible={isPartyModalVisible}
          >
            <CreatePartyForm
              onClose={togglePartyModal}
              inputTitle={inputTitle}
              setInputTitle={setInputTitle}
              inputText={inputText}
              setInputText={setInputText}
            />
          </Modal>
        </View>
      </SafeAreaView>
    </View>
    </View>
  );
}

export default CreatePostScreen

const styles = StyleSheet.create({
  createView: {
    flex: 1,
    backgroundColor: Colors.primary100,
  },
  rootContainer: {
    ...CreatPostStyles.rootContainer,
  },
  card: {
    ...CreatPostStyles.card,
  },
  post: {
    ...CreatPostStyles.post,
  },
  textContainer: {
    ...CreatPostStyles.textContainer,
  },
  text : {
    ...CreatPostStyles.text,
  },
  title: {
    ...CreatPostStyles.title,
  },
  centeredView: {
    ...CreatPostStyles.centeredView,
  },
  modalView: {
    ...CreatPostStyles.modalView,
  },
  closeButton: {
    ...CreatPostStyles.closeButton
  },
  closeText: {
    ...CreatPostStyles.closeText
  },
});