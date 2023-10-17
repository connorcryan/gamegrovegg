import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/styles';
import PostButton from '../../components/ui/PostButton';


function CreatePostScreen() {
  return (
    <View style={styles.rootContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Post</Text>
        <Text>This is the create post screen!</Text>
        <View style={styles.post}>
          <PostButton>The button</PostButton>
          <PostButton>The button</PostButton>
          <PostButton>The button</PostButton>
          <PostButton>The button</PostButton>
        </View>
      </View>     
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
});