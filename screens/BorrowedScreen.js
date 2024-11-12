import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const BorrowedScreen = ({ navigation }) => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      fetchBorrowedBooks();
    }, [])
  );

  const fetchBorrowedBooks = async () => {
    try {
      const booksCollection = collection(db, 'books');
      const booksSnapshot = await getDocs(booksCollection);
      const booksList = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const borrowedBooksList = booksList.filter(book => book.borrowed === true);
      setBorrowedBooks(borrowedBooksList);
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
    }
  };

  const returnBook = async (bookId) => {
    try {
      const bookDoc = doc(db, 'books', bookId);
      await updateDoc(bookDoc, { borrowed: false });
      fetchBorrowedBooks();
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  const handleReturnBook = (bookId) => {
    Alert.alert(
      'Return Book',
      'Are you sure you want to return this book?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => returnBook(bookId) },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.bookName}>{item.name}</Text>
      <Text style={styles.authorName}>{item.author}</Text>
      <TouchableOpacity onPress={() => handleReturnBook(item.id)}>
        <Ionicons name="bookmark" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={borrowedBooks}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  bookName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  authorName: {
    fontSize: 16,
  },
});

export default BorrowedScreen;