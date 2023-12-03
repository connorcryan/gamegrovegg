import { Dimensions } from "react-native";

const { width } = Dimensions.get("screen");

export const Colors = {
  primary50: "#ffffff",
  primary100: "#bae1ce",
  primary200: "#a4e0d7",
  primary400: "#9ae4f3",
  primary500: "#4043f9",
  primary700: "#211bd7",
  primary800: "#0A4C86",
  accent400: "#b8f3d7",
  accent500: "#81b9fc",
  accent600: "#b1d2fa",
  error50: "#fcc4e4",
  error500: "#9b095c",
  gray500: "#39324a",
  gray700: "#000000",
  white: "#ffffff"
};

export const PostTextStyle = {
  headings: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 10,
    color: Colors.primary800,
  },
  postTitle : {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 5,
    paddingTop: 3,
    paddingBottom: 3,
    color: Colors.primary800,
  },
  postPartyName : {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingTop: 2,
    paddingBottom: 5,
    color: Colors.primary700,
  },
  postTextContent : {
    fontSize: 16,
    paddingHorizontal: 5,
    paddingTop: 5,
    paddingBottom: 5,
    //color: Colors.primary800,
  },
}

export const Posts = {
  postContainer: {
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: Colors.primary50,
    padding: 10,
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    maxWidth: width - 100,
  },
  postImage: {
    width: 70,
    height: 70,
    borderRadius: 6,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  postVideo: {
    width: 70,
    height: 70,
    borderRadius: 6,
    position: 'absolute',
    top: 10,
    right: 10,
  },
}

export const PartySearch = {
  partiesSection: {
    //width: width, 
    padding: 10,
    backgroundColor: Colors.primary100,
  },
  searchContainer: {
    marginTop: 10,
    backgroundColor: Colors.primary100,
  },
  partySearch: {
    backgroundColor: Colors.primary50,
    borderRadius: 12,
    marginHorizontal: 10,
    marginTop: 10,
    padding: 10,
    fontSize: 18,
  },
  partyContainer: {
    justifyContent: 'center',
    marginBottom: 5,
    borderRadius: 12,
    backgroundColor: Colors.primary50,
    padding: 8,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  partyName: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 5,
    paddingTop: 5,
    paddingBottom: 5,
    color: Colors.primary800,
  }
}

export const CreatPostStyles = {
  rootContainer: {
    //flex: 1,
    backgroundColor: Colors.primary100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    //flex: 1,
    backgroundColor: Colors.primary50,
    width: '95%',
    //flexDirection: 'row',
    //justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    padding: 20,
    paddingHorizontal: 30,
    borderRadius: 16,
    elevation: 2,
    shadowColor: 'white',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  post: {
    marginTop: 10,
    //backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    //marginHorizontal: 10,
    //width: '120%',
    flexDirection: 'column',
    //flexWrap: 'wrap',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text : {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    //marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary800,
    //marginBottom: 8,
    //marginTop: 10,
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
    //backgroundColor: Colors.primary100,
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
  buttonContainer: {

  },
  button: {
    width: 350,
    borderRadius: 12,
    paddingVertical: 12,
    //paddingHorizontal: 12,
    marginHorizontal: 16,
    marginTop: 18,
    backgroundColor: Colors.primary400,
    elevation: 2,
    // shadowColor: 'white',
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    textAlign: 'center',
    color: Colors.primary800,
    fontSize: 18,
    fontWeight: 'bold'
  },
}

export const FormStyles = {
  container: {
    flex: 1,
    minWidth: '100%',
    //maxHeight: "90%",
    //justifyContent: 'center',
    alignItems: 'center', 
    //marginTop: 50,
    //marginHorizontal: 10,
    backgroundColor: Colors.primary50,
    borderRadius: 12,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  formContainer: {
    flex: 1,
    minWidth: '95%',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    paddingBottom: 30,
    backgroundColor: Colors.primary100,
    borderWidth: 3,
    borderRadius: 12,
    borderColor: Colors.primary200,
    elevation: 2,
    shadowColor: 'white',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    //alignItems: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingHorizontal: 10,
    // paddingTop: 10,
    // paddingBottom: 5,
    color: Colors.primary800,
  },
  text: {
    //justifyContent: 'center',
    textAlign: 'center',
    fontSize: 20,
    paddingHorizontal: 15,
    paddingVertical: 15,
    minWidth: '80%',
    maxWidth: '80%',
    maxHeight: 100,
    color: Colors.primary800,
},
  inputTitle: {
      backgroundColor: Colors.primary400,
      flexWrap: 'wrap',
      padding: 15,
      borderWidth: 3,
      borderRadius: 12,
      borderColor: Colors.accent500,
      //width: "90%",
      marginTop: 15,
      color: Colors.primary800,
  },
  inputText: {
    backgroundColor: Colors.primary400,
    flexWrap: 'wrap',
    padding: 15,
    borderWidth: 3,
    borderRadius: 12,
     borderColor: Colors.accent500,
    minHeight: 200,
    width: "90%",
    marginTop: 15,
    //color: "#000",
},
  button: {
    borderRadius: 12,
    padding: 5,
    marginTop: 10,
    marginBottom: 30,
  },
  partiesSection: {
    width: "90%", 
    padding: 10,
    backgroundColor: Colors.primary100,
  },
  partyContainer: {
    zIndex: 1,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: Colors.primary50,
    padding: 10,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  partyName: {
      fontSize: 16,
      paddingHorizontal: 5,
      paddingTop: 5,
      paddingBottom: 5,
      color: Colors.primary800,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  createPostButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 50,
    borderRadius: 6,
    marginTop: 15,
    marginBottom: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.accent500,
  },
  buttonText: {
    fontSize: 20,
    color: Colors.primary800,
  },
}