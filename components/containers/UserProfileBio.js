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
        {editMode ? (
          <Button title="Save" onPress={handleSave} />
        ) : (
          <TouchableOpacity onPress={handleToggleEdit}>
            <Text style={styles.editIcon}>✎</Text>
          </TouchableOpacity>
        )}
      </View>

      {editMode ? (
        <TextInput
          style={styles.bioInput}
          multiline
          numberOfLines={4}
          value={bio}
          onChangeText={onBioChange}
        />
      ) : (
        <Text style={styles.bioText}>{bio}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    bioContainer: {
      backgroundColor: Colors.primary500,
      color: Colors.primary500,
      padding: 16,
      marginBottom: 16,
      borderRadius: 8,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    bioLabel: {
      color: Colors.accent500,
      fontSize: 18,
      fontWeight: 'bold',
    },
    editIcon: {
      color: Colors.accent500,
      fontSize: 18,
      fontWeight: 'bold',
    },
    bioInput: {
      height: 100,
      color: Colors.gray700,
      marginBottom: 8,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 4,
      padding: 8,
    },
    bioText: {
      color: Colors.gray700,
      marginBottom: 8,
      fontSize: 16,
    },
  });
  
  export default UserProfileBio;