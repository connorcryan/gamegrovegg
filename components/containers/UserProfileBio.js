import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/styles';

const UserProfileBio = ({ bio, onBioChange, onSaveBio }) => {
  const [editMode, setEditMode] = useState(false);

  const handleToggleEdit = () => {
    setEditMode(!editMode);
  };

  const handleSave = () => {
    onSaveBio();
    setEditMode(false);
  };

  return (
    <View style={styles.bioContainer}>
      <View style={styles.header}>
        <Text style={styles.bioLabel}>User Bio:</Text>
      </View>

      {editMode ? (
        <TextInput
          style={styles.bioInput}
          multiline
          numberOfLines={4}
          placeholder="Add a bio..."  // Added placeholder
          value={bio}
          onChangeText={onBioChange}
        />
      ) : (
        <>
          <Text style={styles.bioText}>
            {bio ? bio : "No bio available"}  {/* Updated rendering logic */}
          </Text>
          <TouchableOpacity onPress={handleToggleEdit}>
            <Text style={styles.editIcon}>✎</Text>
          </TouchableOpacity>
        </>
      )}

      {editMode && (
        <View style={styles.buttonContainer}>
          <Button title="Save" onPress={handleSave} />
        </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
    bioContainer: {
      //backgroundColor: Colors.primary500,
      maxWidth: '80%',
      alignItems: 'center',
      color: Colors.primary800,
      padding: 16,
      borderRadius: 8,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    bioLabel: {
      color: Colors.primary800,
      fontSize: 18,
      fontWeight: 'bold',
    },
    editIcon: {
      color: Colors.primary800,
      fontSize: 24,
      fontWeight: 'bold',
    },
    bioInput: {
      backgroundColor: Colors.primary100,
      //height: 100,
      minWidth: '90%',
      color: Colors.gray700,
      marginBottom: 8,
      // borderColor: 'gray',
      // borderWidth: 1,
      // borderRadius: 4,
      borderRadius: 12,
      padding: 8,
    },
    bioText: {
      color: Colors.primary500,
      textAlign: 'center',
      marginBottom: 8,
      fontSize: 18,
    },
    bioPlaceholderText: {
      color: Colors.gray500,
      textAlign: 'center',
      marginBottom: 8,
      fontSize: 18,
    },
    buttonContainer: {
      marginTop: 8,
    },
  });
  
  export default UserProfileBio;