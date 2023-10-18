import axios from 'axios';

import { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { AuthContext } from '../../components/store/auth-context';
import TextPostContainer from '../../components/containers/TextPostContainer';
import TextPostForm from '../../components/forms/TextPostForm';

function HomeScreen() {
  const [fetchedMesage, setFetchedMessage] = useState("");

  const authCtx = useContext(AuthContext);
  const token = authCtx.token;

  useEffect(() => {
    axios
      .get(
        "https://gamegrove-default-rtdb.europe-west1.firebasedatabase.app/.json?auth=" +
          token
      )
      .then((response) => {
        setFetchedMessage(response.data);
      });
  }, [token]);

  return (
    <View style={styles.rootContainer}>
      <ScrollView>
        <Text style={styles.title}>Welcome!</Text>
        <Text>You authenticated successfully!</Text>
        <Text>{JSON.stringify(fetchedMesage)}</Text>
        <TextPostContainer />
        <View>

        </View>
        <TextPostForm />
      </ScrollView>
    </View>
  );
}

export default HomeScreen

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});