import { Modal, StyleSheet, Text, View, TouchableHighlight,SafeAreaView, Button } from 'react-native';
import { Colors } from '../../constants/styles';
import PostButton from '../../components/ui/PostButton';
import { useState } from 'react';
import TextPostForm from '../../components/forms/TextPostForm';

function CreatePostScreen() {

  const [inputTitle, setInputTitle] = useState("");
  const [inputText, setInputText] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.rootContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Post</Text>
        <View style={styles.post}>
          <View>
            <PostButton onPress={toggleModal}>Text Post</PostButton>
          </View>
          <View>
            <PostButton>Image Post</PostButton>
          </View>
          <View>
            <PostButton>Video Post</PostButton>
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
          visible={isModalVisible}
        >
          <TextPostForm 
            onClose={toggleModal} 
            inputTitle={inputTitle} 
            setInputTitle={setInputTitle} 
            inputText={inputText} 
            setInputText={setInputText}/>
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