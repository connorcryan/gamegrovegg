import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../constants/styles";


function TextPostContainer() {
    return (
        <View style={styles.container}>
            <Text style ={styles.title}>Title is i make this really long how does it react to the size of my bubble</Text>
            <Text style={styles.text}>This is the testing of this post containe and if i conitinue to type how big will this get </Text>
        </View>
    )
}

export default TextPostContainer;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 12,
        backgroundColor: Colors.primary100,
        elevation: 2,
        shadowColor: 'white',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 5,
        color: Colors.primary700,
    },
    text: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingTop: 5,
        paddingBottom: 10,
        color: Colors.primary800,
    }
})